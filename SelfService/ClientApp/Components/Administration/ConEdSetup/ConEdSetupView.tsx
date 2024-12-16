/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ConEdSetupView.tsx
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
import ConEdDefaults from './ConEdDefaults';
import ConEdRegistration from './ConEdRegistration';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { ConEdSetupTabs, IConEdSetupPermissions } from '../../../Types/Permissions/IConEdSetupPermissions';
import { IConEdSetupResources } from '../../../Types/Resources/Administration/IConEdSetupResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IConEdSetupState {
    componentError: boolean;
    permissions?: IConEdSetupPermissions;
    resources?: IConEdSetupResources;
    tabSelected: number;
}
// #endregion Types

// #region Component
class ConEdSetupView extends React.Component<any, IConEdSetupState> {
    private idModule: string;
    private idPage: string;
    private tabs: ITabOption[];

    public readonly state: Readonly<IConEdSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'ConEdSetup';
        this.tabs = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IConEdSetupState {
        let permissions: IConEdSetupPermissions | undefined;
        let resources: IConEdSetupResources | undefined;
        if (this.state) {
            permissions = this.state.permissions;
            resources = this.state.resources;
        }
        return {
            componentError: false,
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
                const initialState: IConEdSetupState = this.getInitialState();
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
    private resolveLayoutReady = (): void => {
        try {
            const {
                permissions,
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                if (permissions) {
                    if (permissions.conEdDefaults) {
                        this.tabs.push({
                            id: ConEdSetupTabs.ConEdDefaults,
                            text: resources.conEdSetupTabs.lblConEdDefaults
                        });
                    }
                    if (permissions.conEdRegistration) {
                        this.tabs.push({
                            id: ConEdSetupTabs.ConEdRegistration,
                            text: resources.conEdSetupTabs.lblConEdRegistration
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
        const permissions: IConEdSetupPermissions | undefined = LayoutStore.getPermissions();
        const resources: IConEdSetupResources | undefined = LayoutStore.getResources();

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
                        id="ConEdSetupTabs"
                        marginBottom
                        options={this.tabs}
                        scrollButtons
                        valueSelected={tabSelected}
                        onChange={this.onChangeTab}
                    />
                );
                switch (tabSelected) {
                    case ConEdSetupTabs.ConEdDefaults:
                        contentTab = (
                            <ConEdDefaults
                                lblDropDownEmptyText={resources.lblDropDownEmptyText}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case ConEdSetupTabs.ConEdRegistration:
                        contentTab = (
                            <ConEdRegistration
                                lblDropDownEmptyText={resources.lblDropDownEmptyText}
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

const ConEdSetupViewWithLayout = withLayout(ConEdSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<ConEdSetupViewWithLayout />, document.getElementById('root'));