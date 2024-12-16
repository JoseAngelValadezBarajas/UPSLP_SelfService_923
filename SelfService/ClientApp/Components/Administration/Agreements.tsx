/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: Agreements.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import AgreementsEdit, { IAgreementsEditResProps } from './AgreementsEdit';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { AgreementStatus } from '../../Types/Agreements/IAgreement';
import { AgreementType, IAgreementDetail } from '../../Types/Agreements/IAgreementDetail';
import { IAgreementDetailValidations } from '../../Types/Agreements/IAgreementDetailValidations';
import { IAgreements } from '../../Types/Agreements/IAgreements';
import { IAgreementsResources } from '../../Types/Resources/Administration/IAgreementsResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../Requests/Administration/Agreements';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IAgreementsProps {
    agreementType: AgreementType;
    lblSuccessSave: string;
}

interface IPublishConfirmationResources {
    btnAccept: string;
    btnDecline: string;
    formatTitle: string;
    lblContent: string;
}

interface IAgreementsRes extends IAgreementsResources {
    agreementsEdit: IAgreementsEditResProps;
    publishConfirmation: IPublishConfirmationResources;
}

interface IAgreementsState {
    agreements?: IAgreements;
    agreementSelected?: IAgreementDetail;
    agreementValidations?: IAgreementDetailValidations;
    componentError: boolean;
    isAssignedToRegistration: boolean;
    publishConfirmationOpen: boolean;
    resources?: IAgreementsRes;

    // Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '30%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '50%'
            }
        }
    }
}));

type PropsWithStyles = IAgreementsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class Agreements extends React.Component<PropsWithStyles, IAgreementsState> {
    private idModule: string;
    private idPage: string;
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<IAgreementsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'Agreements';
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAgreementsState {
        let resources: IAgreementsRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            isAssignedToRegistration: false,
            publishConfirmationOpen: false,
            resources: resources,

            // Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: []
        };
    }

    // #region Events

    // #region Pagination
    private onChangePage = (_event: any, page: number): void => {
        try {
            const {
                agreementType
            } = this.props;

            const {
                rowsPerPage
            } = this.state;

            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                page: page
            }, () => {
                LayoutActions.setLoading(true);
                Requests.getAgreements(agreementType, page * rowsPerPage, rowsPerPage, this.resolveGetAgreements, this.logError);
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangeRowsPerPage = (event: any): void => {
        try {
            this.setState({
                page: 0,
                rowsPerPage: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };
    // #endregion Pagination

    // #region New-Edit
    private onBlurName = (): void => {
        try {
            const {
                agreementSelected,
                agreementValidations
            } = this.state;

            if (agreementSelected
                && agreementValidations
                && Boolean(agreementSelected.name)) {
                if (agreementSelected.name !== agreementSelected.nameOriginal) {
                    Requests.postValidateName(agreementSelected.name, this.resolveGetValidateName, this.logError);
                }
                else {
                    agreementValidations.nameDuplicated = false;
                    agreementValidations.nameModified = true;
                    this.setState({
                        agreementValidations: agreementValidations
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurName.name, e));
        }
    };

    private onCancelAgreement = (): void => {
        try {
            this.setState({
                agreementSelected: undefined,
                agreementValidations: undefined,
                isAssignedToRegistration: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelAgreement.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                agreementSelected,
                agreementValidations
            } = this.state;

            const id: string = event.target.id;
            const value: string = event.target.value;
            if (agreementSelected && agreementValidations) {
                switch (id) {
                    case 'txtAcceptance':
                        if (value.length <= 255) {
                            agreementSelected.acceptance = value;
                        }
                        agreementValidations.acceptanceModified = true;
                        break;
                    case 'txtContent':
                        agreementSelected.content = value;
                        agreementValidations.contentModified = true;
                        break;
                    case 'txtName':
                        if (value.length <= 30) {
                            agreementSelected.name = value;
                        }
                        agreementValidations.nameModified = true;
                        break;
                    case 'txtTitle':
                        if (value.length <= 255) {
                            agreementSelected.title = value;
                        }
                        agreementValidations.titleModified = true;
                        break;
                }
                this.setState({
                    agreementSelected: agreementSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onSaveAgreement = (): void => {
        try {
            const {
                agreementSelected
            } = this.state;

            if (agreementSelected && this.validateSave()) {
                LayoutActions.setLoading(true);
                Requests.postPostSaveAgreement(agreementSelected, AgreementStatus.Active, this.resolvePostSaveAgreement, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAgreement.name, e));
        }
    };
    // #endregion New-Edit

    // #region Status
    private onClosePublishConfirmation = (): void => {
        try {
            this.setState({
                publishConfirmationOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePublishConfirmation.name, e));
        }
    };

    private onDeactivate = (): void => {
        try {
            const {
                agreementSelected
            } = this.state;

            if (agreementSelected) {
                LayoutActions.setLoading(true);
                this.setState({
                    publishConfirmationOpen: false
                });
                Requests.postPostStatus(agreementSelected.id, AgreementStatus.Inactive, this.resolvePostSaveAgreement, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeactivate.name, e));
        }
    };

    private onPublish = (): void => {
        try {
            const {
                agreementSelected
            } = this.state;

            if (agreementSelected) {
                if (agreementSelected.status === AgreementStatus.Inactive) {
                    LayoutActions.setLoading(true);
                    this.setState({
                        publishConfirmationOpen: false
                    });
                    Requests.postPostStatus(agreementSelected.id, AgreementStatus.Publish, this.resolvePostSaveAgreement, this.logError);
                }
                else if (this.validateSave()) {
                    this.setState({
                        publishConfirmationOpen: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onPublish.name, e));
        }
    };

    private onConfirmPublish = (): void => {
        try {
            const {
                agreementSelected
            } = this.state;

            if (agreementSelected) {
                LayoutActions.setLoading(true);
                this.setState({
                    publishConfirmationOpen: false
                });
                Requests.postPostSaveAgreement(agreementSelected, AgreementStatus.Publish, this.resolvePostSaveAgreement, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onConfirmPublish.name, e));
        }
    };
    // #endregion Status

    private onAddAgreement = (): void => {
        try {
            const {
                agreementType
            } = this.props;

            LayoutActions.setLoading(true);
            const agreementDetail: IAgreementDetail = {
                acceptance: '',
                agreementType: agreementType,
                content: '',
                id: 0,
                name: '',
                nameOriginal: '',
                status: AgreementStatus.Active,
                title: ''
            } as IAgreementDetail;
            this.setState({
                agreementSelected: agreementDetail,
                agreementValidations: this.getDefaultValidations()
            }, () => LayoutActions.setLoading(false));
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddAgreement.name, e));
        }
    };

    private onClickAgreement = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            LayoutActions.setLoading(true);
            const id: string[] = event.currentTarget.id.split('_');
            Requests.getAgreement(Number(id[1]), this.resolveGetAgreement, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAgreement.name, e));
        }
    };
    // #endregion Events

    // #region Functions

    // #region Pagination
    private getRowsPerPageOptions(maxValue: number): number[] {
        const rowsPerPageOptions: number[] = [];
        try {
            this.rowsPerPageOptions.forEach(option => {
                if (option < maxValue) {
                    rowsPerPageOptions.push(option);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.getRowsPerPageOptions.name, e));
        }
        return rowsPerPageOptions;
    }
    // #endregion Pagination

    private getDefaultValidations(): IAgreementDetailValidations {
        return {
            acceptanceModified: false,
            contentModified: false,
            nameModified: false,
            titleModified: false,

            nameDuplicated: false
        } as IAgreementDetailValidations;
    }

    private validateSave = (): boolean => {
        const {
            agreementSelected,
            agreementValidations
        } = this.state;

        let result: boolean = false;
        if (agreementSelected && agreementValidations) {
            // Validate save
            agreementValidations.acceptanceModified = true;
            agreementValidations.contentModified = true;
            agreementValidations.nameModified = true;
            agreementValidations.titleModified = true;

            this.setState({
                agreementValidations: agreementValidations
            });

            if (agreementSelected.status === AgreementStatus.Active
                && !agreementValidations.nameDuplicated
                && Boolean(agreementSelected.acceptance)
                && Boolean(agreementSelected.content)
                && Boolean(agreementSelected.name)
                && Boolean(agreementSelected.title)) {
                result = true;
            }
        }
        return result;
    };

    // #endregion Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    private showError(message?: string): void {
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetAgreement = (json: string): void => {
        try {
            const {
                agreementType
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAgreement.name);

            if (result?.status) {
                const agreementDetail: IAgreementDetail = result.data.agreementDetail;
                agreementDetail.agreementType = agreementType;
                agreementDetail.nameOriginal = agreementDetail.name;
                this.setState({
                    agreementSelected: agreementDetail,
                    agreementValidations: this.getDefaultValidations(),
                    isAssignedToRegistration: result.data.isAssignedToRegistration
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAgreement.name, e));
        }
    };

    private resolveGetAgreements = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAgreements.name);

            if (result?.status) {
                const agreements: IAgreements = result.data;
                if (agreements) {
                    const page: number = this.preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(agreements.overallCount);
                    const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                    this.setState({
                        agreements: agreements,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: rowsPerPageOptions
                    }, () => LayoutActions.setLoading(false));
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAgreements.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);

            if (result?.status) {
                this.setState({
                    resources: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetValidateName = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetValidateName.name);

            if (result?.status) {
                const {
                    agreementSelected,
                    agreementValidations
                } = this.state;

                if (agreementSelected && agreementValidations) {
                    if (result.data) {
                        agreementValidations.nameDuplicated = false;
                        agreementValidations.nameModified = true;
                    }
                    else {
                        if (agreementSelected.name === agreementSelected.nameOriginal) {
                            agreementValidations.nameDuplicated = false;
                            agreementValidations.nameModified = true;
                        }
                        else {
                            agreementValidations.nameDuplicated = true;
                            agreementValidations.nameModified = true;
                        }
                    }
                    this.setState({
                        agreementValidations: agreementValidations
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetValidateName.name, e));
        }
    };

    private resolvePostSaveAgreement = (json: string): void => {
        try {
            const {
                agreementType,
                lblSuccessSave
            } = this.props;

            const {
                page,
                rowsPerPage
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveAgreement.name);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        agreementSelected: undefined,
                        agreementValidations: undefined,
                        isAssignedToRegistration: false
                    }, () => {
                        Requests.getAgreements(agreementType, page * rowsPerPage, rowsPerPage, this.resolveGetAgreements, this.logError);
                        LayoutActions.setAlert({
                            message: lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveAgreement.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                agreementType
            } = this.props;

            const {
                page,
                rowsPerPage
            } = this.state;

            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getAgreements(agreementType, page * rowsPerPage, rowsPerPage, this.resolveGetAgreements, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentDidCatch(error, info): void {
        this.setState({
            componentError: true
        }, () => {
            this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
            this.redirectError(500);
        });
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes
        } = this.props;

        const {
            agreements,
            agreementSelected,
            agreementValidations,
            componentError,
            isAssignedToRegistration,
            publishConfirmationOpen,
            resources,

            // Pagination
            page,
            rowsPerPage,
            rowsPerPageOptions
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let confirmationModal: JSX.Element | undefined;
        if (!componentError && resources) {
            if (agreementSelected && agreementValidations) {
                // #region Confirmation Modal
                confirmationModal = (
                    <ConfirmationDialog
                        contentText={resources.publishConfirmation.lblContent}
                        open={publishConfirmationOpen}
                        primaryActionOnClick={this.onClosePublishConfirmation}
                        primaryActionText={resources.publishConfirmation.btnDecline}
                        secondaryActionOnClick={this.onConfirmPublish}
                        secondaryActionText={resources.publishConfirmation.btnAccept}
                        title={Format.toString(resources.publishConfirmation.formatTitle, [agreementSelected.name])}
                    />
                );
                contentPage = (
                    <AgreementsEdit
                        agreement={agreementSelected}
                        agreementValidations={agreementValidations}
                        isAssignedToRegistration={isAssignedToRegistration}
                        resources={resources.agreementsEdit}
                        onBlurName={this.onBlurName}
                        onCancel={this.onCancelAgreement}
                        onChangeTextField={this.onChangeTextField}
                        onDeactivate={this.onDeactivate}
                        onPublish={this.onPublish}
                        onSave={this.onSaveAgreement}
                    />
                );
            }
            else if (agreements && agreements.agreementList) {
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblInstructions}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Button
                                    id="btnAddAgreement"
                                    onClick={this.onAddAgreement}
                                >
                                    {resources.btnAdd}
                                </Button>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblRegistrationGroups"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblName}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblTitle}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblStatus}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {agreements.agreementList.map((row, i) =>
                                            (
                                                <TableRow key={`${i}_${row.id}`}>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        <Link onClick={this.onClickAgreement} id={`lnk_${row.id}`}>
                                                            <span>
                                                                {row.name}
                                                            </span>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell
                                                        columnName={resources.lblTitle}
                                                    >
                                                        <span>
                                                            {row.title}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        columnName={resources.lblStatus}
                                                    >
                                                        {row.status !== AgreementStatus.Active ? (
                                                            <StatusLabel
                                                                id={`stat_${i}_${row.id}`}
                                                                text={row.status === AgreementStatus.Publish ?
                                                                    resources.lblPublished
                                                                    : resources.lblNotActive}
                                                                type={row.status === AgreementStatus.Publish
                                                                    ? 'success'
                                                                    : 'default'}
                                                            />
                                                        ) : undefined}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        {rowsPerPage > 0 ? (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={agreements.overallCount}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        onPageChange={this.onChangePage}
                                        onRowsPerPageChange={this.onChangeRowsPerPage}
                                    />
                                </Grid>
                            </Grid >
                        ) : undefined}
                    </>
                );
            }
        }

        return (
            <>
                {contentPage}
                {confirmationModal}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(Agreements);