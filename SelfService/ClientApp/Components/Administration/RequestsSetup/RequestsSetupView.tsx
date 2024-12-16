/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: RequestsSetupView.tsx
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
import AddressRequests from './AddressRequests';
import DemographicRequests from './DemographicRequests';
import PreferredNameRequests from './PreferredNameRequests';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { IRequestsSetupPermissions, RequestsSetupTabs } from '../../../Types/Permissions/IRequestsSetupPermissions';
import { IRequestsSetupResources } from '../../../Types/Resources/Administration/IRequestsSetupResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// #endregion Imports

// #region Types
interface IRequestsSetupState {
    componentError: boolean;
    cultures: ICultures;
    permissions?: IRequestsSetupPermissions;
    resources?: IRequestsSetupResources;
    tabSelected: number;
}
// #endregion Types

// #region Component
class RequestsSetupView extends React.Component<any, IRequestsSetupState> {
    private idModule: string;
    private idPage: string;
    private tabs: ITabOption[];

    public readonly state: Readonly<IRequestsSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'RequestsSetup';
        this.tabs = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IRequestsSetupState {
        let permissions: IRequestsSetupPermissions | undefined;
        let resources: IRequestsSetupResources | undefined;
        if (this.state) {
            permissions = this.state.permissions;
            resources = this.state.resources;
        }
        return {
            componentError: false,
            cultures: LayoutStore.getCultures(),
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
                const initialState: IRequestsSetupState = this.getInitialState();
                initialState.tabSelected = value;
                this.setState(initialState, () => LayoutActions.setLoading(true));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTab.name, e));
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
    private resolveLayoutReady = () => {
        try {
            const {
                permissions,
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                if (permissions) {
                    if (permissions.demographicRequests) {
                        this.tabs.push({
                            id: RequestsSetupTabs.DemographicRequests,
                            text: resources.requestsSetupTabs.lblDemographicRequests
                        });
                    }
                    if (permissions.addressRequests) {
                        this.tabs.push({
                            id: RequestsSetupTabs.AddressRequests,
                            text: resources.requestsSetupTabs.lblAddressRequests
                        });
                    }
                    if (permissions.preferredNameRequests) {
                        this.tabs.push({
                            id: RequestsSetupTabs.PreferredNameRequests,
                            text: resources.requestsSetupTabs.lblPreferredNameRequests
                        });
                    }

                    if (this.tabs && this.tabs.length > 1) {
                        this.tabs = this.tabs.sort((tabA, tabB) => tabA.id - tabB.id);
                    }

                    if (this.tabs.length > 0) {
                        this.setState({
                            tabSelected: this.tabs[0].id
                        }, () => LayoutActions.setLoading(true));
                    }
                    else {
                        LayoutActions.setLoading(false);
                    }
                }
                else {
                    LayoutActions.setLoading(false);
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
        const permissions: IRequestsSetupPermissions | undefined = LayoutStore.getPermissions();
        const resources: IRequestsSetupResources | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();

        if (ready) {
            this.setState({
                cultures: cultures,
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
            cultures,
            permissions,
            resources,
            tabSelected
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let emptyContent: JSX.Element | undefined;
        if (!componentError && permissions && resources) {
            let componentTabs: JSX.Element | undefined;
            let contentTab: JSX.Element | undefined;
            if (tabSelected !== -1) {
                componentTabs = (
                    <Tabs
                        id="RequestsSetupTabs"
                        marginBottom
                        options={this.tabs}
                        scrollButtons
                        valueSelected={tabSelected}
                        onChange={this.onChangeTab}
                    />
                );
                switch (tabSelected) {
                    case RequestsSetupTabs.DemographicRequests:
                        contentTab = (
                            <DemographicRequests
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case RequestsSetupTabs.AddressRequests:
                        contentTab = (
                            <AddressRequests
                                cultures={cultures}
                            />
                        );
                        break;
                    case RequestsSetupTabs.PreferredNameRequests:
                        contentTab = (
                            <PreferredNameRequests
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

const RequestsSetupViewWithLayout = withLayout(RequestsSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<RequestsSetupViewWithLayout />, document.getElementById('root'));