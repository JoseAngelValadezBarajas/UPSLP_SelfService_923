/* Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
 * File: GeneralSetupView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Tabs from '@hedtech/powercampus-design-system/react/core/Tabs';

// Internal components
import DashboardMessages from './DashboardMessages';
import PeriodFilters from './PeriodFilters';
import DossierSetup from './DossierSetup';
import ChecklistSetup from './ChecklistSetup';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { GeneralSetupTabs, IGeneralSetupPermissions } from '../../../Types/Permissions/IGeneralSetupPermissions';
import { IGeneralSetupResources } from '../../../Types/Resources/Administration/IGeneralSetupResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IGeneralSetupState {
    isLoading: boolean;
    permissions?: IGeneralSetupPermissions;
    resources?: IGeneralSetupResources;
    tabSelected: number;
}
// #endregion Types

// #region Component
class GeneralSetupView extends React.Component<any, IGeneralSetupState> {
    private idModule: string;
    private idPage: string;
    private tabs: ITabOption[];

    public readonly state: Readonly<IGeneralSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'GeneralSetup';
        this.tabs = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IGeneralSetupState {
        let permissions: IGeneralSetupPermissions | undefined;
        let resources: IGeneralSetupResources | undefined;
        if (this.state) {
            permissions = this.state.permissions;
            resources = this.state.resources;
        }
        return {
            isLoading: true,
            permissions: permissions,
            resources: resources,
            tabSelected: -1
        };
    }

    // #region Events
    private onChangeTab = (_event: object, value: number): void => {
        try {
            const {
                tabSelected
            } = this.state;

            if (tabSelected !== value) {
                const initialState: IGeneralSetupState = this.getInitialState();
                initialState.isLoading = false;
                initialState.tabSelected = value;
                this.setState(initialState);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTab.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = () => {
        try {
            const {
                permissions,
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                if (permissions) {
                    if (permissions.dashboardMessages) {
                        this.tabs.push({
                            id: GeneralSetupTabs.DashboardMessages,
                            text: resources.generalSetupTabs.lblDashboardMessages
                        });
                    }
                    if (permissions.periodFilters) {
                        this.tabs.push({
                            id: GeneralSetupTabs.PeriodFilters,
                            text: resources.generalSetupTabs.lblPeriodFilters
                        });
                    }
                    if (permissions.dossier) {
                        this.tabs.push({
                            id: GeneralSetupTabs.Dossier,
                            text: resources.generalSetupTabs.lblDossier
                        });
                    }
                    if (permissions.checklist) {
                        this.tabs.push({
                            id: GeneralSetupTabs.Checklist,
                            text: resources.generalSetupTabs.lblChecklist
                        });
                    }

                    if (this.tabs && this.tabs.length > 1) {
                        this.tabs = this.tabs.sort((tabA, tabB) => tabA.id - tabB.id);
                    }

                    if (this.tabs.length > 0) {
                        this.setState({
                            isLoading: false,
                            tabSelected: this.tabs[0].id
                        }, LayoutActions.hidePageLoader);
                    }
                    else {
                        this.setState({
                            isLoading: false
                        }, LayoutActions.hidePageLoader);
                    }
                }
                else {
                    this.setState({
                        isLoading: false
                    }, LayoutActions.hidePageLoader);
                }
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
        const permissions: IGeneralSetupPermissions | undefined = LayoutStore.getPermissions();
        const resources: IGeneralSetupResources | undefined = LayoutStore.getResources();

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
            isLoading,
            permissions,
            resources,
            tabSelected
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let emptyContent: JSX.Element | undefined;
        if (permissions && resources && !isLoading) {
            let componentTabs: JSX.Element | undefined;
            let contentTab: JSX.Element | undefined;
            if (tabSelected !== -1) {
                componentTabs = (
                    <Tabs
                        id="GeneralSetupTabs"
                        marginBottom
                        options={this.tabs}
                        scrollButtons
                        valueSelected={tabSelected}
                        onChange={this.onChangeTab}
                    />
                );
                switch (tabSelected) {
                    case GeneralSetupTabs.DashboardMessages:
                        contentTab = (
                            <DashboardMessages
                                lblDropDownEmptyText={resources.lblDropDownEmptyText}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case GeneralSetupTabs.PeriodFilters:
                        contentTab = (
                            <PeriodFilters
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case GeneralSetupTabs.Dossier:
                        contentTab = (
                            <DossierSetup
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case GeneralSetupTabs.Checklist:
                        contentTab = (
                            <ChecklistSetup
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                }
            }
            else {
                emptyContent = (
                    <Illustration
                        color="secondary"
                        name="under-maintenance"
                        text={resources.lblEmptyState}
                    />
                );
            }

            if (!emptyContent) {
                contentPage = (
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    {componentTabs}
                                    {contentTab}
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
                {emptyContent}
            </Layout>
        );
    }
}

const GeneralSetupViewWithLayout = withLayout(GeneralSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<GeneralSetupViewWithLayout />, document.getElementById('root'));