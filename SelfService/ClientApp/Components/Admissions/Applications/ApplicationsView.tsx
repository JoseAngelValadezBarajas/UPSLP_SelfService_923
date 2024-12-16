/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ApplicationsView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration/Illustration';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import List, { ListItem, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Internal Components
import SavedApplications from './SavedApplications';
import SubmittedApplications from './SubmittedApplications';

// Types
import { IApplicationsResources } from '../../../Types/Resources/Admissions/IApplicationsResources';
import { IForm } from '../../../Types/Form/IForm';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISavedApplication } from '../../../Types/Applications/ISavedApplication';
import { ISubmittedApplication } from '../../../Types/Applications/ISubmittedApplication';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsApplications from '../../../Requests/Admissions/Applications';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IApplicationsViewState {
    visibleBtnRefer: boolean;
    errorCurp: boolean;
    errorTextCurp: string;
    curp: string;
    formSettingId: number;
    showCurp: boolean;
    applications: IForm[];
    componentError: boolean;
    openRemoveConfirmationDialog: boolean;
    resources?: IApplicationsResources;
    savedApplicationId?: number;
    savedApplicationName?: string;
    savedApplications?: ISavedApplication[];
    showApplicationStatus: boolean;
    showDecisionAdmit: boolean;
    submittedApplications?: ISubmittedApplication[]
}
// #endregion Types

// #region Component
class ApplicationsView extends React.Component<any, IApplicationsViewState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IApplicationsViewState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Admissions';
        this.idPage = 'Applications';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IApplicationsViewState {
        let resources: IApplicationsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            visibleBtnRefer: false,
            errorCurp: false,
            errorTextCurp: "",
            curp: "",
            showCurp: false,
            formSettingId: 0,
            applications: [],
            componentError: false,
            openRemoveConfirmationDialog: false,
            showApplicationStatus: false,
            showDecisionAdmit: false,
            resources: resources
        };
    }

    // #region Events

    private onRemoveSavedApplication = (event: any): void => {
        try {
            const savedApplicationId: string[] = event.target.id.split('|');
            this.setState({
                openRemoveConfirmationDialog: true,
                savedApplicationId: Number(savedApplicationId[1]),
                savedApplicationName: savedApplicationId[2]
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRemoveSavedApplication.name, e));
        }
    };

    private onClickRemoveButton = (): void => {
        try {
            const {
                savedApplicationId
            } = this.state;

            if (savedApplicationId) {
                LayoutActions.setLoading(true);
                RequestsApplications.postDeleteSavedApplication(savedApplicationId, this.resolveDeleteSavedApplication, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickRemoveButton.name, e));
        }
    };

    private onCloseSavedApplicationModal = (): void => {
        try {
            this.setState({
                openRemoveConfirmationDialog: false,
                savedApplicationId: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSavedApplicationModal.name, e));
        }
    };
    // #endregion Events

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    // #endregion Error Functions

    // #region Resolvers
    private resolveDeleteSavedApplication = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveDeleteSavedApplication.name);
            if (result?.status) {
                if (result.data) {
                    this.setState({
                        openRemoveConfirmationDialog: false
                    });
                }
                RequestsApplications.getApplications(this.resolveGetApplications, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteSavedApplication.name, e));
        }
    };

    private resolveGetApplications = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetApplications.name);
            let applications: IForm[] = [];
            let savedApplications: ISavedApplication[] | undefined = undefined;
            let logged: boolean = false;
            if (result?.status) {
                if (result.data) {
                    if (result.data.forms &&
                        result.data.forms.length > 0) {
                        applications = result.data.forms;
                    }

                    if (result.data.savedApplicationViewModel &&
                        result.data.savedApplicationViewModel.length > 0) {
                        savedApplications = result.data.savedApplicationViewModel
                    }

                    logged = result.data.logged;

                    this.setState({
                        applications: applications,
                        savedApplications: savedApplications
                    }, () => {
                        if (!logged) {
                            LayoutActions.hidePageLoader();
                        }
                    });
                }

                if (logged) {
                    RequestsApplications.getStatusSettings(this.resolveGetStatusSettings);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetApplications.name, e));
        }
    };

    private resolveGetStatusSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetStatusSettings.name);
            if (result?.status) {
                if (result.data) {
                    this.setState({
                        showApplicationStatus: result.data.showApplicationStatus,
                        showDecisionAdmit: result.data.showDecisionAdmit
                    });
                }
                RequestsApplications.getSubmittedApplications(this.resolveGetSubmittedApplications);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStatusSettings.name, e));
        }
    };

    private resolveGetSubmittedApplications = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetSubmittedApplications.name);
            if (result?.status) {
                if (result.data
                    && result.data.submittedApplications
                    && result.data.submittedApplications.length > 0) {
                    this.setState({
                        submittedApplications: result.data.submittedApplications
                    }, LayoutActions.hidePageLoader);
                }
                else {
                    this.setState({
                        submittedApplications: undefined
                    }, LayoutActions.hidePageLoader);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSubmittedApplications.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IApplicationsResources | undefined = LayoutStore.getResources();

        if (resources) {
            document.title = resources.lblPageTitle;
        }

        if (ready) {
            this.setState({
                resources: resources
            });
        }
        else {
            this.setState({
                componentError: true
            }, () => this.logError(LogData.layoutNoReady(this.onLayoutReady.name)));
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsApplications.getApplications(this.resolveGetApplications, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
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

    private validateCurp(value: string): boolean {
        let isValid: boolean = false;

        if (value.match(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)) {
            isValid = true;
        }

        return isValid;
    }

    public render(): JSX.Element {
        const {
            visibleBtnRefer,
            errorCurp,
            errorTextCurp,
            curp,
            formSettingId,
            showCurp,
            applications,
            componentError,
            openRemoveConfirmationDialog,
            resources,
            savedApplicationName,
            savedApplications,
            showApplicationStatus,
            showDecisionAdmit,
            submittedApplications
        } = this.state;

        let applicationList: JSX.Element | undefined;

        const linkToApplicationForm2 = (): void => {
            try {
                if (curp) {

                    if(this.validateCurp(curp)){
                        RequestsApplications.getValidateCurp(resolveValidateCurp, this.logError, curp, formSettingId);
                    }
                    else{
                        this.setState({
                            errorCurp: true,
                            errorTextCurp: "La CURP no tiene un formato correcto",
                        })
                    }
                    
                }
                else {
                    this.setState({
                        errorCurp: true,
                        errorTextCurp: "Ingrese su CURP",
                    })
                }
            }
            catch (e) {
                this.logError(LogData.fromException(linkToApplicationForm2.name, e));
            }
        
        };

        const resolveValidateCurp = (json: string): void => {
            try {

                const result: IJsonResult | undefined = Resolver(json, resolveValidateCurp.name);
                
                if (result?.status) {
                    if (result.data == 'N') {
                        
                        this.setState({
                            errorCurp: false,
                            errorTextCurp: ""
                        })

                        window.location.assign(`${Constants.webUrl}/Admissions/ApplicationForm/${formSettingId}/${curp}`);

                    }
                    else {
                        this.setState({
                            visibleBtnRefer: true,
                            errorCurp: false,
                            errorTextCurp: ""
                        })
                    }
                }
            }
            catch (e) {
                this.logError(LogData.fromException(resolveValidateCurp.name, e));
            }
        };

        const onChangeCurp = (event: any): void => {
            try {
        
                this.setState({
                    visibleBtnRefer: false,
                    curp: event.target.value,
                    errorCurp: false,
                    errorTextCurp: ""
                })
        
            }
            catch (e) {
                this.logError(LogData.fromException(onChangeCurp.name, e));
            }
        }

        const onPagRefer = (): void => {
            try {

                LayoutActions.showPageLoader();
 
                var uricomplement = `curp=${(curp)}&idForm=${(formSettingId)}`;
                var complement = `Applications/GetPagoReferAdmisionByCurp?${uricomplement}`;
                var TourlAction = `${Constants.webUrl}/${complement}`;
                location.href = TourlAction;
       
                LayoutActions.hidePageLoader();
            }
            catch (e) {
                this.logError(LogData.fromException(onPagRefer.name, e));
            }
        };

        const elements: JSX.Element[] = applications.map((app, i) => {

            const linkToApplicationForm = (): void => {
                this.setState({
                    showCurp: true,
                    formSettingId: app.formSettingId
                });
            };

            return (
                <ListItem
                    id={`applications_${i}`}
                    key={`applications_${i}`}
                >
                    <ListItemText
                        id={`application_${i}`}
                        primary={(
                            <Button
                                TextProps={{
                                    size: 'h3'
                                }}
                                align="left"
                                id={`lnkApliccation_${i}`}
                                textVariantStyling="inherit"
                                variant="text"
                                onClick={linkToApplicationForm}
                            >
                                {app.name}
                            </Button>
                        )}
                        secondary={(
                            <Text color="textPrimary">
                                {app.description}
                            </Text>
                        )}
                    />
                </ListItem>
            );
        })

        if (!componentError && resources) {
            if (applications && applications.length > 0) {
                if (savedApplications || submittedApplications) {
                    applicationList = (
                        <ExpansionPanel
                            id="epnlApplications"
                            header={(
                                <Text size="h2">
                                    {resources.lblApplications}
                                </Text>
                            )}
                        >
                            <Divider
                                aria-hidden="true"
                                noMarginBottom
                                noMarginTop
                            />
                            <List id="lstApplicationsList">
                                {elements}
                            </List>
                        </ExpansionPanel>
                    );
                }
                else {
                    if (showCurp){
                        applicationList = (
                            <Card>
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs>
                                            <Text size="h2">
                                                {resources.lblApplications}
                                            </Text>
                                            <Divider />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField 
                                            id="txtCURP"
                                            label={"CURP"}
                                            value={curp}
                                            required
                                            onChange={onChangeCurp}
                                            error={errorCurp}
                                            helperText={errorTextCurp}
                                        />
                                    </Grid>
                                    <br />
                                    <Grid item xs={12}>
                                        <ButtonGroup id="btgCURP">
                                            <Button
                                                id="btnEnviar"
                                                onClick={linkToApplicationForm2}
                                            >
                                                {"ENVIAR"}
                                            </Button>
                                            {visibleBtnRefer ? (
                                                <Button
                                                    id="btnRefer"
                                                   onClick={onPagRefer}
                                                >
                                                    {"DESCARGAR REFERENCIA"}
                                                </Button>) : undefined}
                                        </ButtonGroup>
                                    </Grid>
                                    {visibleBtnRefer ? (
                                        <Grid item xs={12}>
                                            <Text size="h3">
                                                {"Tu CURP ya se encuentra registrada en caso de requerir cambios comunicarse con el área de admisiones."}
                                            </Text>
                                        </Grid>) : undefined}
                                </CardContent>
                            </Card>
                        );
                    }
                    else {
                        applicationList = (
                            <Card>
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs>
                                            <Text size="h2">
                                                {resources.lblApplications}
                                            </Text>
                                            <Divider aria-hidden="true"/>
                                            <List id="applicationsList">
                                                {elements}
                                            </List>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        );
                    }
                }
            }
            else {
                applicationList = (
                    <Grid container>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    <Illustration
                                        name="under-maintenance"
                                        text={resources.lblNoResults}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                );
            }
        }

        let savedApplicationList: JSX.Element | undefined;
        if (resources && savedApplications) {
            savedApplicationList = (
                <SavedApplications
                    savedApplications={savedApplications}
                    resources={resources.savedApplicationsResources}
                    onRemove={this.onRemoveSavedApplication}
                />
            );
        }

        let submittedApplicationList: JSX.Element | undefined;
        if (resources && submittedApplications) {
            submittedApplicationList = (
                <SubmittedApplications
                    showApplicationStatus={showApplicationStatus}
                    showDecisionAdmit={showDecisionAdmit}
                    submittedApplications={submittedApplications}
                    resources={resources.submittedApplicationsResources}
                />
            );
        }

        let removeSavedApplicatioModal: JSX.Element | undefined;
        if (resources && openRemoveConfirmationDialog) {
            removeSavedApplicatioModal = (
                <ConfirmationDialog
                    contentText={Format.toString(resources.savedApplicationsResources.lblRemoveConfirmation, [savedApplicationName])}
                    open={openRemoveConfirmationDialog}
                    primaryActionOnClick={this.onClickRemoveButton}
                    primaryActionText={resources.savedApplicationsResources.lblAcceptConfirmation}
                    secondaryActionOnClick={this.onCloseSavedApplicationModal}
                    secondaryActionText={resources.savedApplicationsResources.lblCancelConfirmation}
                    title={resources.savedApplicationsResources.lblTitle}
                />
            );
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                <Grid container spacing={3}>
                    {submittedApplicationList && (
                        <Grid item xs={12}>
                            {submittedApplicationList}
                        </Grid>
                    )}
                    {savedApplicationList && (
                        <Grid item xs={12}>
                            {savedApplicationList}
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        {applicationList}
                    </Grid>
                </Grid>
                {removeSavedApplicatioModal}
            </Layout>
        );
    }
}

const ApplicationsViewWithLayout = withLayout(ApplicationsView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<ApplicationsViewWithLayout />, document.getElementById('root'));