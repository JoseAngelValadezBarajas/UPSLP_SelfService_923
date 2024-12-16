/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: DonationsSetupView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Tabs from '@hedtech/powercampus-design-system/react/core/Tabs';

// Internal components
import Campaigns from './Campaigns';
import Form from './Form';
import GiftBatchDefaults from './GiftBatchDefaults';

// Types
import { IDonationsSetupPermissions, DonationsSetupTabs } from '../../../Types/Permissions/IDonationsSetupPermissions';
import { IDonationsSetupResources } from '../../../Types/Resources/Administration/IDonationsSetupResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IDonationsSetupState {
    componentError: boolean;
    isLoading: boolean;
    permissions?: IDonationsSetupPermissions;
    resources?: IDonationsSetupResources;
    tabSelected: number;
}
// #endregion Types

// #region Component
class DonationsSetupView extends React.Component<any, IDonationsSetupState> {
    private idModule: string;
    private idPage: string;
    private tabs: ITabOption[];

    public readonly state: Readonly<IDonationsSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'DonationsSetup';
        this.tabs = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IDonationsSetupState {
        let permissions: IDonationsSetupPermissions | undefined;
        let resources: IDonationsSetupResources | undefined;
        if (this.state) {
            permissions = this.state.permissions;
            resources = this.state.resources;
        }
        return {
            componentError: false,
            isLoading: false,
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
                const initialState: IDonationsSetupState = this.getInitialState();
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
    private logError = (logData: ILogData): void => {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    };

    // private showError = (message?: string): void => {
    //    this.hideAllLoaders();
    //    LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    // };
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = (): void => {
        try {
            const {
                permissions,
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                if (permissions) {
                    if (permissions.campaigns) {
                        this.tabs.push({
                            id: DonationsSetupTabs.Campaigns,
                            text: resources.lblCampaigns
                        });
                    }

                    if (permissions.form) {
                        this.tabs.push({
                            id: DonationsSetupTabs.Form,
                            text: resources.lblForm
                        });
                    }

                    if (permissions.giftBatchDefaults) {
                        this.tabs.push({
                            id: DonationsSetupTabs.GiftBatchDefaults,
                            text: resources.lblGiftBatchDefaults
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
        const permissions: IDonationsSetupPermissions | undefined = LayoutStore.getPermissions();
        const resources: IDonationsSetupResources | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                permissions: permissions,
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.setState({
                componentError: true
            }, () => this.logError(LogData.layoutNoReady(this.onLayoutReady.name)));
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
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

    public render(): JSX.Element {
        const {
            componentError,
            isLoading,
            permissions,
            resources,
            tabSelected
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let emptyContent: JSX.Element | undefined;
        if (!componentError && permissions && resources) {
            if (!isLoading) {
                let componentTabs: JSX.Element | undefined;
                let contentTab: JSX.Element | undefined;
                if (tabSelected !== -1) {
                    componentTabs = (
                        <Tabs
                            id="DonationsSetupTabs"
                            marginBottom
                            options={this.tabs}
                            scrollButtons
                            valueSelected={tabSelected}
                            onChange={this.onChangeTab}
                        />
                    );
                    switch (tabSelected) {
                        case DonationsSetupTabs.Campaigns:
                            contentTab = (
                                <Campaigns />
                            );
                            break;
                        case DonationsSetupTabs.Form:
                            contentTab = (
                                <Form />
                            );
                            break;
                        case DonationsSetupTabs.GiftBatchDefaults:
                            contentTab = (
                                <GiftBatchDefaults />
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
                contentPage = (
                    <Grid container>
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

const DonationsSetupViewWithLayout = withLayout(DonationsSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<DonationsSetupViewWithLayout />, document.getElementById('root'));