/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SharedAdviseesView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import EmailModal from '../../Generic/EmailModal';
import SharedAdviseesTable, { ISharedAdviseesTableResProps } from './SharedAdviseesTable';

// Types
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAdviseesShared, IAdviseeShared } from '../../../Types/Advisees/IAdviseesShared';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IShareAdvisees } from '../../../Types/Advisees/IShareAdvisees';
import { ISharedAdviseesPermissions } from '../../../Types/Permissions/ISharedAdviseesPermissions';
import { ISharedAdviseesResources } from '../../../Types/Resources/Advising/ISharedAdviseesResources';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Requests
import Requests from '../../../Requests/Advising/SharedAdvisees';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface ISharedAdviseesRes extends ISharedAdviseesResources {
    deleteAdviseesConfirmation: IConfirmationDialogResources;
    deleteAdvisorConfirmation: IConfirmationDialogResources;
    sharedAdviseesTable: ISharedAdviseesTableResProps;
}

interface ISharedAdviseesState {
    allSelected: boolean;
    deleteAdviseesConfirmationModal: boolean;
    deleteAdvisorConfirmationModal: boolean;
    emailSettings?: IEmailSettings;
    isAdviseeSelected: boolean;
    isLoading: boolean;
    isLoadingTable: boolean;
    permissions?: ISharedAdviseesPermissions;
    resources?: ISharedAdviseesRes;
    sharedAdvisees?: IAdviseesShared;
    selectedSharedAdvisee?: IShareAdvisees;
    selectedAdvisorName?: string;

    // #region Dossier
    isFaculty: boolean;
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination

    // #region Email Modal
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

const styles = createStyles({
    checkboxHeader: {
        marginLeft: `${Tokens.spacing35}!important`
    },
    divider: {
        backgroundColor: 'rgba(0,0,0,0.12)'
    },
    formatResult: {
        marginLeft: Tokens.spacing40,
        marginRight: Tokens.spacing40,
        verticalAlign: 'middle'
    },
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    }
});

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class SharedAdviseesView extends React.Component<PropsWithStyles, ISharedAdviseesState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    // #region Pagination
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<ISharedAdviseesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Advising';
        this.idPage = 'SharedAdvisees';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();

        // #endregion Initialize Variables and State

        // #region Pagination
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        // #endregion Pagination

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): ISharedAdviseesState {
        let emailSettings: IEmailSettings | undefined;
        let permissions: ISharedAdviseesPermissions | undefined;
        let resources: ISharedAdviseesRes | undefined;
        if (this.state) {
            emailSettings = this.state.emailSettings;
            permissions = this.state.permissions;
            resources = this.state.resources;
        }
        return {
            allSelected: false,
            deleteAdviseesConfirmationModal: false,
            deleteAdvisorConfirmationModal: false,
            emailSettings: emailSettings,
            isAdviseeSelected: false,
            isLoading: true,
            isLoadingTable: false,
            permissions: permissions,
            resources: resources,
            sharedAdvisees: undefined,

            // #region Dossier
            isFaculty: false,
            dossierPersonId: 0,
            openDossierModal: false,
            // #endregion Dossier

            // #region Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            // #endregion Pagination

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events

    // #region Dossier
    private onCloseDossierModal = (): void => {
        try {
            this.setState({
                dossierPersonId: 0,
                openDossierModal: false
            });
            LayoutStore.abort();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDossierModal.name, e));
        }
    };

    private onViewDossier = (event: React.MouseEvent<HTMLButtonElement>, id: number, isFaculty: boolean): void => {
        try {
            let personId: number = 0;
            if (isFaculty) {
                personId = id;
            }
            else {
                personId = Number(event.currentTarget.dataset.id);
                isFaculty = false;
            }
            this.setState({
                dossierPersonId: personId,
                isFaculty: isFaculty,
                openDossierModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDossier.name, e));
        }
    };
    // #endregion Dossier

    private onCloseDeleteAdviseesModal = (): void => {
        try {
            this.setState({
                deleteAdviseesConfirmationModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteAdviseesModal.name, e));
        }
    };

    private onCloseDeleteAdvisorModal = (): void => {
        try {
            this.setState({
                deleteAdvisorConfirmationModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteAdvisorModal.name, e));
        }
    };

    private onDeleteAdvisor = (): void => {
        try {
            const {
                selectedSharedAdvisee
            } = this.state;

            if (selectedSharedAdvisee) {
                this.onCloseDeleteAdvisorModal();
                LayoutActions.showPageLoader();
                Requests.deleteSharedAdviseeAdvisor(selectedSharedAdvisee, this.resolveDeleteSharedAdvisees);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAdvisor.name, e));
        }
    };

    private onDeleteAdvisees = (): void => {
        try {
            const {
                sharedAdvisees
            } = this.state;

            if (sharedAdvisees?.advisees && sharedAdvisees.advisees.length > 0) {
                this.onCloseDeleteAdviseesModal();
                const advisees: number[] = [];
                sharedAdvisees.advisees.filter(a => a.checked).forEach(advisee => advisees.push(advisee.personId));
                if (advisees.length > 0) {
                    LayoutActions.showPageLoader();
                    Requests.deleteSharedAdvisees(advisees, this.resolveDeleteSharedAdvisees);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAdvisees.name, e));
        }
    };

    private onEmailSelected = (): void => {
        try {
            const {
                emailSettings,
                sharedAdvisees
            } = this.state;

            if (sharedAdvisees && emailSettings) {
                const emails: string[] = [];
                sharedAdvisees.advisees.forEach(advisee => {
                    if (advisee.checked && advisee.email) {
                        emails.push(advisee.email);
                    }
                });

                if (emailSettings.emailProvider === EmailProviderOption.External) {
                    window.open(Format.toString(emailSettings.staffUrl, [emails.join(emailSettings.staffSeparator)]),
                        emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
                }
                else {
                    this.onOpenEmailModal(emails);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEmailSelected.name, e));
        }
    };

    private onGetAdvisors = (adviseeId: number): void => {
        try {
            Requests.getAdvisors(adviseeId, this.resolveGetAdvisors);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onGetAdvisors.name, e));
        }
    };

    private onOpenDeleteAdviseesModal = (): void => {
        try {
            this.setState({
                deleteAdviseesConfirmationModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteAdviseesModal.name, e));
        }
    };

    private onOpenDeleteAdvisorModal = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            this.setState({
                deleteAdvisorConfirmationModal: true,
                selectedSharedAdvisee: {
                    advisorId: Number(event.currentTarget.dataset.advisorId),
                    sharedAdviseeId: Number(event.currentTarget.dataset.id),
                    studentIds: [Number(event.currentTarget.dataset.adviseeId)]
                },
                selectedAdvisorName: String(event.currentTarget.dataset.name)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteAdvisorModal.name, e));
        }
    };

    private onSelectAdvisee = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                sharedAdvisees
            } = this.state;

            if (sharedAdvisees) {
                const personId: number = Number(event.currentTarget.dataset.id);
                const advisee: IAdviseeShared | undefined = sharedAdvisees.advisees.find(a => a.personId === personId);
                if (advisee) {
                    advisee.checked = !advisee.checked;
                    const isAdviseeSelected: boolean = sharedAdvisees.advisees.findIndex(advisee => advisee.checked) >= 0;
                    const oneNotSelected: boolean = sharedAdvisees.advisees.findIndex(advisee => !advisee.checked) >= 0;
                    this.setState({
                        allSelected: !oneNotSelected,
                        isAdviseeSelected: isAdviseeSelected,
                        sharedAdvisees: sharedAdvisees
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectAdvisee.name, e));
        }
    };

    private onSelectAll = (): void => {
        try {
            const {
                allSelected,
                isAdviseeSelected,
                sharedAdvisees
            } = this.state;

            if (sharedAdvisees && sharedAdvisees.advisees) {
                let selectAll: boolean = false;
                if (allSelected || !isAdviseeSelected) {
                    selectAll = !allSelected;
                }
                sharedAdvisees.advisees.forEach(advisee => advisee.checked = selectAll);
                this.setState({
                    allSelected: selectAll,
                    isAdviseeSelected: selectAll,
                    sharedAdvisees: sharedAdvisees
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectAll.name, e));
        }
    };

    private setContent = (): void => {
        try {
            const {
                page,
                rowsPerPage
            } = this.state;

            this.showLoaderTable();
            Requests.getSharedAdvisees(page * rowsPerPage, rowsPerPage, this.resolveGetSharedAdvisees);
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
    };

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                emailSettings
            } = this.state;

            if (emailSettings?.emailProvider === EmailProviderOption.SelfService) {
                LayoutActions.showPageLoader();
                this.setState({
                    recipientsEmailAddresses: emailAddresses,
                    openEmailModal: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenEmailModal.name, e));
        }
    };

    private onCloseEmailModal = (): void => {
        try {
            this.setState({
                openEmailModal: false,
                recipientsEmailAddresses: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEmailModal.name, e));
        }
    };
    // #endregion Email Modal
    // #endregion Events

    // #region Functions

    // #region Pagination
    private getRowsPerPageOptions = (maxValue: number): number[] => {
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
    };

    private onChangePage = (_event: any, pageNumber: number): void => {
        try {
            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                allSelected: false,
                isAdviseeSelected: false,
                page: pageNumber
            }, this.setContent);
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

    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingTable: false
        });
    };

    private hideLoaderTable = (): void => {
        this.setState({
            isLoadingTable: false
        });
    };

    private showLoaderTable = (): void => {
        this.setState({
            isLoadingTable: true
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError = (logData: ILogData): void => {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    };

    private showError = (message?: string): void => {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    };
    // #endregion Error Functions

    // #region Resolvers
    private resolveDeleteSharedAdvisees = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveDeleteSharedAdvisees.name);
            if (result?.status) {
                if (result.data) {
                    const {
                        resources
                    } = this.state;
                    if (resources) {
                        LayoutActions.setAlert({
                            message: resources.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }
                    const initialState: ISharedAdviseesState = this.getInitialState();
                    initialState.isLoading = false;
                    this.setState(initialState, this.setContent);
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteSharedAdvisees.name, e));
        }
    };

    private resolveGetAdvisors = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetAdvisors.name);
            if (result?.status) {
                const {
                    sharedAdvisees
                } = this.state;

                if (sharedAdvisees) {
                    const advisee: IAdviseeShared | undefined = sharedAdvisees.advisees.find(a => a.personId === result.data.id);
                    if (advisee) {
                        advisee.advisors = result.data.advisors;
                        this.setState({
                            sharedAdvisees: sharedAdvisees
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvisors.name, e));
        }
    };

    private resolveGetSharedAdvisees = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetSharedAdvisees.name);
            if (result?.status) {
                const sharedAdvisees: any = result.data;
                if (sharedAdvisees) {
                    const page: number = this.preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(sharedAdvisees.overallCount);
                    const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                    this.setState({
                        sharedAdvisees: sharedAdvisees,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: rowsPerPageOptions
                    }, this.hideLoaderTable);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSharedAdvisees.name, e));
        }
    };

    private resolveGetStaffEmail = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetStaffEmail.name);
            if (result?.status) {
                this.setState({
                    emailSettings: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStaffEmail.name, e));
        }
    };

    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                Requests.getStaffEmail(this.resolveGetStaffEmail);
                this.setContent();
                this.setState({
                    isLoading: false
                }, LayoutActions.hidePageLoader);
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const permissions: ISharedAdviseesPermissions | undefined = LayoutStore.getPermissions();
        const resources: ISharedAdviseesRes | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                permissions: permissions,
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.logError(LogData.layoutNoReady(this.onLayoutReady.name));
            this.redirectError(500);
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes
        } = this.props;

        const {
            allSelected,
            deleteAdviseesConfirmationModal,
            deleteAdvisorConfirmationModal,
            isAdviseeSelected,
            isLoading,
            isLoadingTable,
            permissions,
            resources,
            sharedAdvisees,
            selectedAdvisorName,

            // #region Dossier
            isFaculty,
            dossierPersonId,
            openDossierModal,
            // #endregion Dossier

            // #region Pagination
            page,
            rowsPerPage,
            // #endregion Pagination

            // #region Email Modal
            emailSettings,
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources && permissions && !isLoading) {
            if (sharedAdvisees && sharedAdvisees.overallCount > 0) {
                let firstRow: number = page * rowsPerPage + 1;
                let lastRow: number = page * rowsPerPage + rowsPerPage;
                const totalRows: number = sharedAdvisees.overallCount;
                if (lastRow > totalRows) {
                    lastRow = totalRows;
                }
                if (firstRow > lastRow) {
                    firstRow = lastRow;
                }
                contentPage = (
                    <>
                        <Card>
                            <CardContent>
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item>
                                        <Checkbox
                                            checked={allSelected || isAdviseeSelected}
                                            classes={{
                                                focused: classes.checkboxHeader,
                                                root: classes.checkboxHeader
                                            }}
                                            disabled={isLoadingTable}
                                            id="chkSelectAll"
                                            indeterminate={!allSelected && isAdviseeSelected}
                                            inputProps={{
                                                'aria-label': this.layoutResources?.lblSelectAll
                                            }}
                                            onChange={this.onSelectAll}
                                        />
                                        <Tooltip
                                            id="tltEmailSelected"
                                            placement="top"
                                            title={resources.btnEmailSelected}
                                        >
                                            <div className={classes.inline}>
                                                <IconButton
                                                    aria-label={resources.btnEmailSelected}
                                                    classes={{ root: classes.iconHeader }}
                                                    color="secondary"
                                                    disabled={isLoadingTable || !isAdviseeSelected}
                                                    onClick={this.onEmailSelected}
                                                    id="btnEmailSelected"
                                                >
                                                    <Icon large name="email" />
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                        <Tooltip
                                            id="tltDeleteSelected"
                                            placement="top"
                                            title={resources.btnDeleteSelected}
                                        >
                                            <div className={classes.inline}>
                                                <IconButton
                                                    aria-label={resources.btnDeleteSelected}
                                                    classes={{ root: classes.iconHeader }}
                                                    color="secondary"
                                                    disabled={isLoadingTable || !isAdviseeSelected}
                                                    onClick={this.onOpenDeleteAdviseesModal}
                                                    id="btnDeleteSelected"
                                                >
                                                    <Icon large name="trash" />
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Text
                                            display="inline"
                                            id="txtFormatResults"
                                            className={classes.formatResult}
                                        >
                                            {Format.toString(resources.formatNumberOfRows, [firstRow, lastRow, totalRows])}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs>
                                        <Divider classes={{ root: classes.divider }} noMarginBottom noMarginTop />
                                        {isLoadingTable ? (<ContainerLoader id="ldrSharedAdvisees" height="sm" />) : (
                                            <SharedAdviseesTable
                                                advisees={sharedAdvisees.advisees}
                                                hasDossierClaim={permissions.dossier}
                                                hasFacultyDossier={permissions.facultyDossier}
                                                resources={resources.sharedAdviseesTable}
                                                RelatedAdvisorsTableProps={{
                                                    onDeleteAdvisor: this.onOpenDeleteAdvisorModal,
                                                    onGetAdvisors: this.onGetAdvisors
                                                }}
                                                onSelectAdvisee={this.onSelectAdvisee}
                                                onViewDossier={this.onViewDossier}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                                {rowsPerPage > 0 && (
                                    <Grid container>
                                        <Grid item xs>
                                            <Pagination
                                                count={totalRows}
                                                page={page}
                                                rowsPerPage={rowsPerPage}
                                                rowsPerPageOptions={this.getRowsPerPageOptions(totalRows)}
                                                onPageChange={this.onChangePage}
                                                onRowsPerPageChange={this.onChangeRowsPerPage}
                                            />
                                        </Grid>
                                    </Grid >
                                )}
                            </CardContent>
                        </Card>
                        <Dossier
                            key={`Dossier_${dossierPersonId}`}
                            dossierType={isFaculty ? DossierType.Faculty : DossierType.Student}
                            open={openDossierModal}
                            personId={dossierPersonId}
                            onClose={this.onCloseDossierModal}
                        />
                        {deleteAdviseesConfirmationModal && (
                            <ConfirmationDialog
                                contentText={resources.deleteAdviseesConfirmation.formatContent}
                                open={deleteAdviseesConfirmationModal}
                                primaryActionOnClick={this.onCloseDeleteAdviseesModal}
                                primaryActionText={resources.deleteAdviseesConfirmation.btnDecline}
                                secondaryActionOnClick={this.onDeleteAdvisees}
                                secondaryActionText={resources.deleteAdviseesConfirmation.btnAccept}
                                title={resources.deleteAdviseesConfirmation.lblTitle}
                            />
                        )}
                        {deleteAdvisorConfirmationModal && (
                            <ConfirmationDialog
                                contentText={Format.toString(resources.deleteAdvisorConfirmation.formatContent, [selectedAdvisorName])}
                                open={deleteAdvisorConfirmationModal}
                                primaryActionOnClick={this.onCloseDeleteAdvisorModal}
                                primaryActionText={resources.deleteAdvisorConfirmation.btnDecline}
                                secondaryActionOnClick={this.onDeleteAdvisor}
                                secondaryActionText={resources.deleteAdvisorConfirmation.btnAccept}
                                title={resources.deleteAdvisorConfirmation.lblTitle}
                            />
                        )}
                        {openEmailModal && emailSettings && (
                            <EmailModal
                                emailSettings={emailSettings}
                                onClose={this.onCloseEmailModal}
                                recipientsEmailAddresses={recipientsEmailAddresses}
                            />
                        )}
                    </>
                );
            }
            else if (isLoadingTable) {
                contentPage = (<ContainerLoader id="ldrSharedAdvisees" height="sm" withCard />);
            }
            else {
                contentPage = (
                    <Grid container>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Illustration
                                        color="secondary"
                                        internalName="no-enrolled"
                                        text={resources.lblEmptyList}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                );
            }
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
            </Layout>
        );
    }
}

const SharedAdviseesViewWithLayout = withLayout(withStyles(styles)(SharedAdviseesView));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<SharedAdviseesViewWithLayout />, document.getElementById('root'));