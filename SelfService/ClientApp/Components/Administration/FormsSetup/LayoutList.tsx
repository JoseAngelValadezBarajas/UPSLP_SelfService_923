/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: LayoutList.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import SaveSettings from './SaveSettings';
import SaveSettingsModal from './SaveSettingsModal';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IApplicationSettings } from '../../../Types/Applications/IApplicationSettings';
import { IApplicationStatus } from '../../../Types/Form/IApplicationStatus';
import { IAppSetupForm } from '../../../Types/Form/IAppSetupForm';
import { ILayoutListResources } from '../../../Types/Resources/Administration/ILayoutListResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/FormLayouts';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface ILayoutListProps {
    lblSuccessSave: string;
}

interface ILayoutListState {
    appFormsSetup: IAppSetupForm[];
    applicationStatus?: IApplicationStatus;
    componentError: boolean;
    confirmationMessage?: string;
    emptyConfirmationMessage: boolean;
    emptySaveMessage: boolean;
    enableSaveApplication: boolean;
    expanded: boolean | number;
    openSaveSettingsModal: boolean;
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    saveMessage?: string;
    total: number;

    // resources
    resources?: ILayoutListResources;
}

const styles = (() => createStyles({
    table: {
        '& > tbody > tr > th:nth-child(2)': {
            width: '70%'
        },
        '& > tbody > tr > th:nth-child(3)': {
            width: '30%'
        },
        '& > thead > tr > th:nth-child(2)': {
            width: '70%'
        },
        '& > thead > tr > th:nth-child(3)': {
            width: '30%'
        }
    },
    indentBlock: {
        paddingLeft: `${Tokens.spacing60}!important`
    }
}));

type PropsWithStyles = ILayoutListProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class LayoutList extends React.Component<PropsWithStyles, ILayoutListState> {
    private idModule: string;
    private idPage: string;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<ILayoutListState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'LayoutList';
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ILayoutListState {
        let resources: ILayoutListResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            appFormsSetup: [],
            componentError: false,
            emptyConfirmationMessage: false,
            emptySaveMessage: false,
            enableSaveApplication: false,
            expanded: false,
            openSaveSettingsModal: false,
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            total: 0,
            resources: resources
        };
    }

    // #region Functions

    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                applicationStatus
            } = this.state;

            const checked: boolean = event.target.checked;

            if (applicationStatus) {
                switch (event.target.id) {
                    case 'chkShowApplicationStatus':
                        applicationStatus.showApplicationStatus = checked;
                        if (!applicationStatus.showApplicationStatus)
                            applicationStatus.showDecisionAdmit = false;
                        break;
                    case 'chkShowDecisionAdmit':
                        applicationStatus.showDecisionAdmit = checked;
                        break;
                }
                this.setState({
                    applicationStatus: applicationStatus
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };
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

    private onChangePage = (_event: any, page: number): void => {
        try {
            const {
                rowsPerPage
            } = this.state;

            this.setState({
                page: page
            }, () => {
                LayoutActions.setLoading(true);
                Requests.getApplicationFormLayouts(page * rowsPerPage, rowsPerPage, this.resolveGetAppFormLayouts, this.logError);
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

    private onChangeExpansionPanel = (stepNumber: number) => (): void => {
        try {
            this.setState({
                expanded: stepNumber
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeExpansionPanel.name, e));
        }
    };

    private onEnableSaveApplication = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const isEnabled: boolean = !Boolean(event.target.value);
            if (isEnabled) {
                Requests.getSettings(this.resolveGetSettings, this.logError);
                this.setState({
                    enableSaveApplication: isEnabled,
                    openSaveSettingsModal: true
                });
            }
            else {
                const {
                    confirmationMessage,
                    saveMessage
                } = this.state;
                if (confirmationMessage && saveMessage) {
                    const applicationSettings: IApplicationSettings = {
                        confirmationSaveMessage: confirmationMessage,
                        enableSave: false,
                        footerSaveMessage: saveMessage
                    };
                    Requests.postSaveSettings(applicationSettings, this.resolveSaveSettings, this.logError);
                    this.setState({
                        enableSaveApplication: isEnabled
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEnableSaveApplication.name, e));
        }
    };

    private onClickAddMore = (): void => {
        try {
            window.location.href = `${Constants.webUrl}/Administration/ApplicationSetup/1`;
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAddMore.name, e));
        }
    };

    private onChangeTextField = (event: any): void => {
        try {
            const id = event.target.id;
            switch (id) {
                case 'txtSaveMessage':
                    this.setState({
                        emptySaveMessage: false,
                        saveMessage: event.target.value
                    });
                    break;
                case 'txtConfirmationMessage':
                    this.setState({
                        confirmationMessage: event.target.value,
                        emptyConfirmationMessage: false
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onCloseSaveSettingsModal = (): void => {
        try {
            Requests.getSettings(this.resolveGetSettings, this.logError);
            this.setState({
                openSaveSettingsModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSaveSettingsModal.name, e));
        }
    };

    private onSaveStatusSettings = (): void => {
        try {
            const {
                applicationStatus
            } = this.state;
            if (applicationStatus) {
                if (!applicationStatus.showApplicationStatus) {
                    applicationStatus.showDecisionAdmit = false
                }
                LayoutActions.showPageLoader();
                Requests.postSaveStatusSettings(applicationStatus, this.resolvePostSaveStatusSettings, this.logError);
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveStatusSettings.name, e));
        }
    };

    private onSaveSettingsModal = (): void => {
        try {
            const {
                confirmationMessage,
                saveMessage
            } = this.state;
            let isValid: boolean = true;
            if (!confirmationMessage) {
                this.setState({
                    emptyConfirmationMessage: true
                });
                isValid = false;
            }
            if (!saveMessage) {
                this.setState({
                    emptySaveMessage: true
                });
                isValid = false;
            }
            if (isValid) {
                if (confirmationMessage && saveMessage) {
                    const applicationSettings: IApplicationSettings = {
                        confirmationSaveMessage: confirmationMessage,
                        enableSave: true,
                        footerSaveMessage: saveMessage
                    };
                    Requests.postSaveSettings(applicationSettings, this.resolveSaveSettings, this.logError);
                    this.setState({
                        enableSaveApplication: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettingsModal.name, e));
        }
    };

    private onClickEditSaveSettings = (): void => {
        try {
            this.setState({
                openSaveSettingsModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickEditSaveSettings.name, e));
        }
    };
    // #endregion Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetStatusSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStatusSettings.name);

            if (result?.status) {
                const applicationStatus: IApplicationStatus = result.data;
                this.setState({
                    applicationStatus: applicationStatus
                }, () => LayoutActions.hidePageLoader());
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveStatusSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveStatusSettings.name);

            if (result?.status) {
                const {
                    lblSuccessSave
                } = this.props;

                LayoutActions.hidePageLoader();
                LayoutActions.setAlert({
                    message: lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveStatusSettings.name, e));
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

    private resolveGetAppFormLayouts = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAppFormLayouts.name);

            if (result?.status) {
                const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(result.data.overallCount
                    ? result.data.overallCount : 0);
                this.setState({
                    appFormsSetup: result.data.formLayouts,
                    rowsPerPageOptions,
                    total: result.data.overallCount
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAppFormLayouts.name, e));
        }
    };

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        confirmationMessage: result.data.confirmationSaveMessage,
                        enableSaveApplication: result.data.enableSave,
                        saveMessage: result.data.footerSaveMessage
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolveSaveSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveSettings.name);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        openSaveSettingsModal: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveSettings.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                page,
                rowsPerPage
            } = this.state;

            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getApplicationFormLayouts(page, rowsPerPage, this.resolveGetAppFormLayouts, this.logError);
            Requests.getSettings(this.resolveGetSettings, this.logError);
            Requests.getStatusSettings(this.resolveGetStatusSettings, this.logError);
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
            appFormsSetup,
            applicationStatus,
            confirmationMessage,
            emptyConfirmationMessage,
            emptySaveMessage,
            enableSaveApplication,
            openSaveSettingsModal,
            page,
            rowsPerPage,
            resources,
            rowsPerPageOptions,
            saveMessage,
            total
        } = this.state;

        let table: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;

        if (resources) {
            let pagination: JSX.Element | undefined;
            if (appFormsSetup && appFormsSetup.length > 0) {
                table = (
                    <Table
                        breakpoint="sm"
                        classes={{ root: classes.table }}
                        id="LayoutList"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">
                                    {resources.lblFormName}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblDescription}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appFormsSetup.map((layout, i) => {

                                const linkToFormSetup = (): void => {
                                    window.location.assign(`${Constants.webUrl}/Administration/ApplicationSetup/${layout.formLayoutId}`);
                                };

                                return (
                                    <TableRow
                                        key={`layoutRow_${i}`}
                                    >
                                        <TableCell
                                            columnName={resources.lblFormName}
                                            component="th"
                                            scope="row"
                                        >
                                            <Grid item>
                                                <Button
                                                    TextProps={{
                                                        weight: 'strong'
                                                    }}
                                                    align="left"
                                                    id={`lnkLayout_${i}`}
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={linkToFormSetup}
                                                >
                                                    {layout.name}
                                                </Button>
                                            </Grid>
                                        </TableCell>
                                        <TableCell
                                            columnName={resources.lblDescription}
                                            component="th"
                                            scope="row"
                                        >
                                            {layout.description}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                );

                pagination = (
                    <Grid item xs>
                        <Pagination
                            count={total}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={rowsPerPageOptions}
                            onPageChange={this.onChangePage}
                            onRowsPerPageChange={this.onChangeRowsPerPage}
                        />
                    </Grid>
                );
            }

            const saveSettings: JSX.Element = (
                <>
                    <SaveSettings
                        confirmationMessage={confirmationMessage}
                        enableSaveApplication={enableSaveApplication}
                        saveMessage={saveMessage}
                        onClickEditSaveSettings={this.onClickEditSaveSettings}
                        onEnableSaveApplication={this.onEnableSaveApplication}
                        resources={resources.layoutListResorces}
                    />
                </>
            );

            const saveSettingsModal: JSX.Element = (
                <>
                    <SaveSettingsModal
                        confirmationMessage={confirmationMessage}
                        emptyConfirmationMessage={emptyConfirmationMessage}
                        emptySaveMessage={emptySaveMessage}
                        open={openSaveSettingsModal}
                        saveMessage={saveMessage}
                        onChangeTextField={this.onChangeTextField}
                        onClose={this.onCloseSaveSettingsModal}
                        onSave={this.onSaveSettingsModal}
                        resources={resources.layoutListResorces}
                    />
                </>
            );
            if (resources && applicationStatus) {
            contentPage = (
                <>
                    <Grid item xs>
                        <Text size="large">
                            {resources.lblInstructions}
                        </Text>
                    </Grid>
                    <br />
                    <Grid item xs>
                        <Text size="h2">
                            {resources.lblApplicationStatus}
                        </Text>
                    </Grid>
                    <Divider />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Checkbox
                                id="chkShowApplicationStatus"
                                checked={applicationStatus.showApplicationStatus}
                                label={resources.lblShowApplicationStatus}
                                onChange={this.onCheckboxChange}
                            />
                            <Grid container className={classes.indentBlock} spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        id="chkShowDecisionAdmit"
                                        checked={applicationStatus.showDecisionAdmit}
                                        disabled={!applicationStatus.showApplicationStatus}
                                        label={resources.lblShowDecisionAdmit}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>

                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Button
                                id="btnSaveApplicationStatus"
                                onClick={this.onSaveStatusSettings}
                            >
                                {resources.lblSave}
                            </Button>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid item xs>
                        <Text size="h2">
                            {resources.lblSaveOptionsTitle}
                        </Text>
                    </Grid>
                    <Divider />
                    {saveSettings}
                    <br />
                    <Grid item xs>
                        <Text size="h2">
                            {resources.lblLayouts}
                        </Text>
                    </Grid>
                    <Divider />
                    <Grid item xs>
                        <Button
                            id="btnAddForm"
                            onClick={this.onClickAddMore}
                        >
                            {resources.lblAddForm}
                        </Button>
                    </Grid>
                    <br />
                    <Grid item xs>
                        {table}
                    </Grid>
                    {pagination}
                    {saveSettingsModal}
                </>
                );
            }
        }

        return (
            <Grid container spacing={3}>
                <Grid item xs>
                    {contentPage}
                </Grid>
            </Grid>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(LayoutList);