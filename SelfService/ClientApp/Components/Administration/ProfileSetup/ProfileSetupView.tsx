/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: ProfileSetupView.tsx
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
import AddressSettings from './AddressSettings';
import DemographicSettings from './DemographicSettings';
import EmergencyContactSettings from './EmergencyContactSettings';
import PhoneNumberSettings from './PhoneNumberSettings';
import PreferredNameSettings from './PreferredNameSettings';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { IProfileSetupPermissions, ProfileSetupTabs } from '../../../Types/Permissions/IProfileSetupPermissions';
import { IProfileSetupResources } from '../../../Types/Resources/Administration/IProfileSetupResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IProfileSetupState {
    componentError: boolean;
    permissions?: IProfileSetupPermissions;
    resources?: IProfileSetupResources;
    tabSelected: number;
}
// #endregion Types

// #region Component
class ProfileSetupView extends React.Component<any, IProfileSetupState> {
    private idModule: string;
    private idPage: string;
    private tabs: ITabOption[];

    public readonly state: Readonly<IProfileSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'ProfileSetup';
        this.tabs = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IProfileSetupState {
        let permissions: IProfileSetupPermissions | undefined;
        let resources: IProfileSetupResources | undefined;
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
                const initialState: IProfileSetupState = this.getInitialState();
                initialState.tabSelected = value;
                this.setState(initialState);
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
                    if (permissions.addressSettings) {
                        this.tabs.push({
                            id: ProfileSetupTabs.AddressSettings,
                            text: resources.profileSetupTabs.lblAddressSettings
                        });
                    }
                    if (permissions.demographicSettings) {
                        this.tabs.push({
                            id: ProfileSetupTabs.DemographicSettings,
                            text: resources.profileSetupTabs.lblDemographicSettings
                        });
                    }
                    if (permissions.phoneNumberSettings) {
                        this.tabs.push({
                            id: ProfileSetupTabs.PhoneNumberSettings,
                            text: resources.profileSetupTabs.lblPhoneNumberSettings
                        });
                    }
                    if (permissions.emergencyContactSettings) {
                        this.tabs.push({
                            id: ProfileSetupTabs.EmergencyContactSettings,
                            text: resources.profileSetupTabs.lblEmergencyContactSettings
                        });
                    }
                    if (permissions.preferredNameSettings) {
                        this.tabs.push({
                            id: ProfileSetupTabs.PreferredNameSetting,
                            text: resources.profileSetupTabs.lblPreferredNameSettings
                        });
                    }

                    if (this.tabs && this.tabs.length > 1) {
                        this.tabs = this.tabs.sort((tabA, tabB) => tabA.id - tabB.id);
                    }

                    if (this.tabs.length > 0) {
                        this.setState({
                            tabSelected: this.tabs[0].id
                        });
                    }
                }
                LayoutActions.hidePageLoader();
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
        const permissions: IProfileSetupPermissions | undefined = LayoutStore.getPermissions();
        const resources: IProfileSetupResources | undefined = LayoutStore.getResources();

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
                        id="ProfileSetupTabs"
                        marginBottom
                        options={this.tabs}
                        scrollButtons
                        valueSelected={tabSelected}
                        onChange={this.onChangeTab}
                    />
                );
                switch (tabSelected) {
                    case ProfileSetupTabs.AddressSettings:
                        contentTab = (
                            <AddressSettings />
                        );
                        break;

                    case ProfileSetupTabs.DemographicSettings:
                        contentTab = (
                            <DemographicSettings />
                        );
                        break;

                    case ProfileSetupTabs.PhoneNumberSettings:
                        contentTab = (
                            <PhoneNumberSettings />
                        );
                        break;

                    case ProfileSetupTabs.EmergencyContactSettings:
                        contentTab = (
                            <EmergencyContactSettings />
                        );
                        break;

                    case ProfileSetupTabs.PreferredNameSetting:
                        contentTab = (
                            <PreferredNameSettings />
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

const ProfileSetupViewWithLayout = withLayout(ProfileSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<ProfileSetupViewWithLayout />, document.getElementById('root'));