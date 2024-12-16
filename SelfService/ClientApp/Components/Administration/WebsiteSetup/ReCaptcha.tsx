/* Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ReCaptcha.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IReCaptchaResources } from '../../../Types/Resources/Administration/IReCaptchaResources';
import { IReCaptchaSettings } from '../../../Types/Administration/IReCaptchaSettings';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, withStyles, WithStyles, Theme } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Administration/ReCaptcha';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IReCaptchaProps {
    lblSuccessSave: string;
}

interface IReCaptchaState {
    openClearDisableDialog: boolean;
    reCaptchaSettings?: IReCaptchaSettings
    isLoading: boolean;
    enableSwitches: boolean;
    resources?: IReCaptchaResources;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '50%'
            }
        }
    }
}));

type PropsWithStyles = IReCaptchaProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class ReCaptcha extends React.Component<PropsWithStyles, IReCaptchaState> {
    private idModule: string;
    private idPage: string;
    private siteKeyBackup?: string;
    private secretKeyBackup?: string;

    public readonly state: Readonly<IReCaptchaState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'ReCaptcha';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IReCaptchaState {
        let isLoading: boolean = true;
        let resources: IReCaptchaResources | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            enableSwitches: false,
            openClearDisableDialog: false,
            isLoading: isLoading,
            resources: resources
        };
    }

    // #region Events
    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                reCaptchaSettings
            } = this.state;
            const id: string = event.target.id;
            if (reCaptchaSettings) {
                switch (id) {
                    case 'txtSiteKey':
                        reCaptchaSettings.siteKey = event.target.value;
                        reCaptchaSettings.siteKeyModified = true;
                        break;
                    case 'txtSecretKey':
                        reCaptchaSettings.secretKey = event.target.value;
                        reCaptchaSettings.secretKeyModified = true;
                        break;
                }
            }
            this.setState({
                reCaptchaSettings: reCaptchaSettings
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                reCaptchaSettings
            } = this.state;

            const id: string = event.target.id;
            const newStatus: boolean = !Boolean(event.target.value);

            if (reCaptchaSettings) {
                switch (id) {
                    case 'swtEnableForgotPassword':
                        reCaptchaSettings.enableForgotPassword = newStatus;
                        reCaptchaSettings.isEnableForgotPasswordLoading = true;
                        break;

                    case 'swtEnableCreateAccount':
                        reCaptchaSettings.enableCreateAccount = newStatus;
                        reCaptchaSettings.isEnableCreateAccountLoading = true;
                        break;

                    case 'swtEnableSubmitApplication':
                        reCaptchaSettings.enableSubmitApplication = newStatus;
                        reCaptchaSettings.isEnableSubmitApplicationLoading = true;
                        break;

                    case 'swtEnableSubmitInquiry':
                        reCaptchaSettings.enableSubmitInquiry = newStatus;
                        reCaptchaSettings.isEnableSubmitInquiryLoading = true;
                        break;

                    case 'swtEnableMakePayment':
                        reCaptchaSettings.enableMakePayment = newStatus;
                        reCaptchaSettings.isEnableMakePaymentLoading = true;
                        break;
                }

                const tempSettings: IReCaptchaSettings = { ...reCaptchaSettings };
                if (this.siteKeyBackup && this.secretKeyBackup) {
                    tempSettings.siteKey = this.siteKeyBackup;
                    tempSettings.secretKey = this.secretKeyBackup;
                }
                Requests.saveReCaptchaSettings(tempSettings, this.resolveSavePageEnable);

                this.setState({
                    reCaptchaSettings: reCaptchaSettings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSwitch.name, e));
        }
    };

    private onSaveKeys = (): void => {
        try {
            const {
                reCaptchaSettings
            } = this.state;

            if (reCaptchaSettings) {
                reCaptchaSettings.secretKeyModified = true;
                reCaptchaSettings.siteKeyModified = true;

                if (reCaptchaSettings.siteKey && reCaptchaSettings.secretKey && reCaptchaSettings.googleEndpoint) {
                    LayoutActions.showPageLoader();
                    Requests.saveReCaptchaSettings(reCaptchaSettings, this.resolveSaveKeys);
                }

                this.setState({
                    reCaptchaSettings: reCaptchaSettings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveKeys.name, e));
        }
    };

    private onOpenClearDisableConfirmatioDialog = (): void => {
        try {
            this.setState({
                openClearDisableDialog: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenClearDisableConfirmatioDialog.name, e));
        }
    };

    private onClearDisable = (): void => {
        try {
            const {
                reCaptchaSettings
            } = this.state;

            if (reCaptchaSettings) {
                const newSettings: IReCaptchaSettings = {
                    enableForgotPassword: false,
                    enableCreateAccount: false,
                    enableMakePayment: false,
                    enableSubmitApplication: false,
                    enableSubmitInquiry: false,
                    googleEndpoint: reCaptchaSettings.googleEndpoint,
                    secretKey: '',
                    siteKey: '',
                    isEnableForgotPasswordLoading: false,
                    secretKeyModified: false,
                    siteKeyModified: false
                };
                LayoutActions.showPageLoader();
                Requests.saveReCaptchaSettings(newSettings, this.resolveSaveKeys);

                this.setState({
                    reCaptchaSettings: newSettings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearDisable.name, e));
        }
    };

    private onCloseClearDisableConfirmatioDialog = (): void => {
        try {
            this.setState({
                openClearDisableDialog: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseClearDisableConfirmatioDialog.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    isLoading: false,
                    resources: result.data
                });
                Requests.getReCaptchaSettings(this.resolveGetReCaptchaSettings);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetReCaptchaSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetReCaptchaSettings.name, this.hideAllLoaders);
            if (result?.status) {
                const reCaptchaSettings: IReCaptchaSettings = result.data;
                this.siteKeyBackup = reCaptchaSettings.siteKey;
                this.secretKeyBackup = reCaptchaSettings.secretKey;

                this.setState({
                    enableSwitches: !!reCaptchaSettings.secretKey && !!reCaptchaSettings.siteKey,
                    reCaptchaSettings: reCaptchaSettings
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetReCaptchaSettings.name, e));
        }
    };

    private resolveSaveKeys = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveKeys.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    lblSuccessSave
                } = this.props;

                const {
                    reCaptchaSettings
                } = this.state;

                if (reCaptchaSettings) {
                    this.siteKeyBackup = reCaptchaSettings.siteKey;
                    this.secretKeyBackup = reCaptchaSettings.secretKey

                    this.setState({
                        enableSwitches: !!reCaptchaSettings.secretKey && !!reCaptchaSettings.siteKey,
                        openClearDisableDialog: false
                    });
                    this.hideAllLoaders();

                    LayoutActions.setAlert({
                        message: lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveKeys.name, e));
        }
    };

    private resolveSavePageEnable = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSavePageEnable.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    reCaptchaSettings
                } = this.state;

                if (reCaptchaSettings) {
                    reCaptchaSettings.isEnableForgotPasswordLoading = false;
                    reCaptchaSettings.isEnableCreateAccountLoading = false;
                    reCaptchaSettings.isEnableSubmitApplicationLoading = false;
                    reCaptchaSettings.isEnableSubmitInquiryLoading = false;
                    reCaptchaSettings.isEnableMakePaymentLoading = false;
                }

                this.setState({
                    reCaptchaSettings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSavePageEnable.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage, this.resolveGetResources);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            enableSwitches,
            openClearDisableDialog,
            reCaptchaSettings,
            isLoading,
            resources
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (resources) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrReCaptcha" />);
            }
            else if (reCaptchaSettings) {
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs={12}>
                                <Text>
                                    {resources.lblInstructions}
                                </Text>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="txtSiteKey"
                                    label={resources.lblSiteKey}
                                    required
                                    error={reCaptchaSettings.siteKeyModified && reCaptchaSettings.siteKey === ''}
                                    helperText={reCaptchaSettings.siteKeyModified && reCaptchaSettings.siteKey === ''
                                        ? resources.lblSiteKeyRequired : undefined}
                                    value={reCaptchaSettings.siteKey}
                                    onChange={this.onChangeTextField}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="txtSecretKey"
                                    label={resources.lblSecretKey}
                                    required
                                    error={reCaptchaSettings.secretKeyModified && reCaptchaSettings.secretKey === ''}
                                    helperText={reCaptchaSettings.secretKeyModified && reCaptchaSettings.secretKey === ''
                                        ? resources.lblSecretKeyRequired : undefined}
                                    value={reCaptchaSettings.secretKey}
                                    onChange={this.onChangeTextField}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonGroup id="bgReCaptchaSettings">
                                    <Button
                                        id="btnSave"
                                        onClick={this.onSaveKeys}
                                    >
                                        {resources.btnSave}
                                    </Button>
                                    <Button
                                        color="secondary"
                                        id="btnClearDisable"
                                        onClick={this.onOpenClearDisableConfirmatioDialog}
                                    >
                                        {resources.btnClearDisable}
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Table
                                    className={classes.table}
                                    id="tblPages"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblPage}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblEnable}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell columnName={resources.lblPage}>
                                                {resources.lblForgotPassword}
                                            </TableCell>
                                            <TableCell columnName={resources.lblEnable}>
                                                <Switch
                                                    disabled={!enableSwitches}
                                                    id="swtEnableForgotPassword"
                                                    inputProps={{
                                                        'aria-label': resources.lblForgotPassword
                                                    }}
                                                    loading={reCaptchaSettings.isEnableForgotPasswordLoading}
                                                    checked={reCaptchaSettings.enableForgotPassword}
                                                    onChange={this.onChangeSwitch}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblPage}>
                                                {resources.lblCreateAccount}
                                            </TableCell>
                                            <TableCell columnName={resources.lblEnable}>
                                                <Switch
                                                    disabled={!enableSwitches}
                                                    id="swtEnableCreateAccount"
                                                    inputProps={{
                                                        'aria-label': resources.lblCreateAccount
                                                    }}
                                                    loading={reCaptchaSettings.isEnableCreateAccountLoading}
                                                    checked={reCaptchaSettings.enableCreateAccount}
                                                    onChange={this.onChangeSwitch}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblPage}>
                                                {resources.lblSubmitApplication}
                                            </TableCell>
                                            <TableCell columnName={resources.lblEnable}>
                                                <Switch
                                                    disabled={!enableSwitches}
                                                    id="swtEnableSubmitApplication"
                                                    inputProps={{
                                                        'aria-label': resources.lblSubmitApplication
                                                    }}
                                                    loading={reCaptchaSettings.isEnableSubmitApplicationLoading}
                                                    checked={reCaptchaSettings.enableSubmitApplication}
                                                    onChange={this.onChangeSwitch}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblPage}>
                                                {resources.lblSubmitInquiry}
                                            </TableCell>
                                            <TableCell columnName={resources.lblEnable}>
                                                <Switch
                                                    disabled={!enableSwitches}
                                                    id="swtEnableSubmitInquiry"
                                                    inputProps={{
                                                        'aria-label': resources.lblSubmitInquiry
                                                    }}
                                                    loading={reCaptchaSettings.isEnableSubmitInquiryLoading}
                                                    checked={reCaptchaSettings.enableSubmitInquiry}
                                                    onChange={this.onChangeSwitch}
                                                />
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell columnName={resources.lblPage}>
                                                {resources.lblMakeAGift}
                                            </TableCell>
                                            <TableCell columnName={resources.lblEnable}>
                                                <Switch
                                                    disabled={!enableSwitches}
                                                    id="swtEnableMakePayment"
                                                    inputProps={{
                                                        'aria-label': resources.lblMakeAGift
                                                    }}
                                                    loading={reCaptchaSettings.isEnableMakePaymentLoading}
                                                    checked={reCaptchaSettings.enableMakePayment}
                                                    onChange={this.onChangeSwitch}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        <ConfirmationDialog
                            contentText={resources.lblClearDisableConfirmation}
                            open={openClearDisableDialog}
                            primaryActionOnClick={this.onCloseClearDisableConfirmatioDialog}
                            primaryActionText={resources.btnCancel}
                            secondaryActionOnClick={this.onClearDisable}
                            secondaryActionText={resources.btnClearDisable}
                            title={resources.lblClearDisable}
                        />
                    </>
                );
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(ReCaptcha);