/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: WebsiteSetupView.tsx
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
import EmailProvider from './EmailProvider';
import GlobalSettings from './GlobalSettings';
import NameFormatCategories from './NameFormatCategories';
import NameFormats from './NameFormats';
import PaymentProvider from './PaymentProvider';
import ReCaptcha from './ReCaptcha'
import SystemInformation from './SystemInformation';
import ThemeEditor from './ThemeEditor';
import CourseMaterials from './CourseMaterials';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { IWebsiteSetupPermissions, WebsiteSetupTabs } from '../../../Types/Permissions/IWebsiteSetupPermissions';
import { IWebsiteSetupResources } from '../../../Types/Resources/Administration/IWebsiteSetupResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IWebsiteSetupState {
    componentError: boolean;
    permissions?: IWebsiteSetupPermissions;
    resources?: IWebsiteSetupResources;
    tabSelected: number;
}
// #endregion Types

// #region Component
class WebsiteSetupView extends React.Component<any, IWebsiteSetupState> {
    private idModule: string;
    private idPage: string;
    private tabs: ITabOption[];

    public readonly state: Readonly<IWebsiteSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'WebsiteSetup';
        this.tabs = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IWebsiteSetupState {
        let permissions: IWebsiteSetupPermissions | undefined;
        let resources: IWebsiteSetupResources | undefined;
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
    private onChangeTab = (_event: string, value: number): void => {
        try {
            const {
                tabSelected
            } = this.state;

            if (tabSelected !== value) {
                const initialState: IWebsiteSetupState = this.getInitialState();
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
                    if (permissions.emailProvider) {
                        this.tabs.push({
                            id: WebsiteSetupTabs.EmailProvider,
                            text: resources.websiteSetupTabs.lblEmailProvider
                        });
                    }
                    if (permissions.nameFormats) {
                        this.tabs.push({
                            id: WebsiteSetupTabs.NameFormats,
                            text: resources.websiteSetupTabs.lblNameFormats
                        });
                    }
                    if (permissions.nameFormatCategories) {
                        this.tabs.push({
                            id: WebsiteSetupTabs.NameFormatCategories,
                            text: resources.websiteSetupTabs.lblNameFormatCategories
                        });
                    }
                    if (permissions.paymentProvider) {
                        this.tabs.push({
                            id: WebsiteSetupTabs.PaymentProvider,
                            text: resources.websiteSetupTabs.lblPaymentProvider
                        });
                    }
                    if (permissions.systemFormats) {
                        this.tabs.push({
                            id: WebsiteSetupTabs.SystemFormats,
                            text: resources.websiteSetupTabs.lblGlobalSettings
                        });
                    }
                    if (permissions.systemInformation) {
                        this.tabs.push({
                            id: WebsiteSetupTabs.SystemInformation,
                            text: resources.websiteSetupTabs.lblSystemInformation
                        });
                    }
                    if (permissions.theme) {
                        this.tabs.push({
                            id: WebsiteSetupTabs.Theme,
                            text: resources.websiteSetupTabs.lblTheme
                        });
                    }
                    if (permissions.reCaptcha) {
                        this.tabs.push({
                            id: WebsiteSetupTabs.ReCaptcha,
                            text: resources.websiteSetupTabs.lblReCaptcha
                        });
                    }
                    if (permissions.courseMaterials) {
                        this.tabs.push({
                            id: WebsiteSetupTabs.CourseMaterials,
                            text: resources.websiteSetupTabs.lblCourseMaterials
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
        const permissions: IWebsiteSetupPermissions | undefined = LayoutStore.getPermissions();
        const resources: IWebsiteSetupResources | undefined = LayoutStore.getResources();

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
                        id="WebsiteSetupTabs"
                        marginBottom
                        options={this.tabs}
                        scrollButtons
                        valueSelected={tabSelected}
                        onChange={this.onChangeTab}
                    />
                );
                switch (tabSelected) {
                    case WebsiteSetupTabs.EmailProvider:
                        contentTab = (
                            <EmailProvider />
                        );
                        break;
                    case WebsiteSetupTabs.NameFormatCategories:
                        contentTab = (
                            <NameFormatCategories
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case WebsiteSetupTabs.NameFormats:
                        contentTab = (
                            <NameFormats
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case WebsiteSetupTabs.PaymentProvider:
                        contentTab = (
                            <PaymentProvider
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case WebsiteSetupTabs.SystemFormats:
                        contentTab = (
                            <GlobalSettings
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case WebsiteSetupTabs.SystemInformation:
                        contentTab = (
                            <SystemInformation />
                        );
                        break;
                    case WebsiteSetupTabs.Theme:
                        contentTab = (
                            <ThemeEditor />
                        );
                        break;
                    case WebsiteSetupTabs.ReCaptcha:
                        contentTab = (
                            <ReCaptcha
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case WebsiteSetupTabs.CourseMaterials:
                        contentTab = (
                            <CourseMaterials />
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

const WebsiteSetupViewWithLayout = withLayout(WebsiteSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<WebsiteSetupViewWithLayout />, document.getElementById('root'));