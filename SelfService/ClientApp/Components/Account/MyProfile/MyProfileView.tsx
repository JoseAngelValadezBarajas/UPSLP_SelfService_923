/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: MyProfileView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Internal components
import AccountMain from './AccountMain';
import AddressesMain from './AddressesMain';
import AgreementsMain from './AgreementsMain';
import DemographicMain from './DemographicMain';
import EmergencyContactMain from './EmergencyContactMain';
import EthnicityMain from './EthnicityMain';
import PhoneNumberMain from './PhoneNumberMain';
import PreferredNameMain from './PreferredNameMain';
import ProfileMain from './ProfileMain';
import RegistrationSummaryMain from './RegistrationSummaryMain';
import SharedAccessMain from './SharedAccessMain';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { IProfilePermissions, ProfileTabs } from '../../../Types/Permissions/IProfilePermissions';
import { IMyProfileResources } from '../../../Types/Resources/Account/IMyProfileResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion

// #region Internal types
interface IMyProfileState {
    componentError: boolean;
    cultures: ICultures;
    permissions?: IProfilePermissions;
    tabs: ITabOption[];

    resources?: IMyProfileResources;
}
// #endregion Internal types

// #region Component
class MyProfileView extends React.Component<any, IMyProfileState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IMyProfileState>;

    public constructor(props) {
        super(props);

        // Init Variables
        this.idModule = 'Account';
        this.idPage = 'MyProfile';
        this.state = this.getInitialState();

        // Init state Management listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
    }

    // Initial State
    private getInitialState(): IMyProfileState {
        let resources: IMyProfileResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            cultures: LayoutStore.getCultures(),
            resources: resources,
            tabs: []
        };
    }

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
                resources,
                tabs
            } = this.state;

            let mainTabs: ITabOption[] = tabs;
            if (resources) {
                document.title = resources.lblPageTitle;

                // Initializes first tab
                mainTabs.push({
                    id: ProfileTabs.Profile,
                    text: resources.lblProfile
                });

                if (permissions?.account) {
                    mainTabs.push({
                        id: ProfileTabs.Account,
                        text: resources.lblAccount
                    });
                }

                if (permissions?.addresses) {
                    mainTabs.push({
                        id: ProfileTabs.Addresses,
                        text: resources.lblAddresses
                    });
                }

                if (permissions?.phoneNumbers) {
                    mainTabs.push({
                        id: ProfileTabs.PhoneNumbers,
                        text: resources.lblPhoneNumbers
                    });
                }

                if (permissions?.emergencyContacts) {
                    mainTabs.push({
                        id: ProfileTabs.EmergencyContacts,
                        text: resources.lblEmergencyContacts
                    });
                }

                if (permissions?.preferredName) {
                    mainTabs.push({
                        id: ProfileTabs.PreferredName,
                        text: resources.lblPreferredName
                    });
                }

                if (permissions?.demographic) {
                    mainTabs.push({
                        id: ProfileTabs.Demographic,
                        text: resources.lblDemographic
                    });
                }

                if (permissions?.ethnicityAndRace) {
                    mainTabs.push({
                        id: ProfileTabs.EthnicityAndRace,
                        text: resources.lblEthnicityRace
                    });
                }

                if (permissions?.agreements) {
                    mainTabs.push({
                        id: ProfileTabs.Agreements,
                        text: resources.lblAgreements
                    });
                }

                if (permissions?.sharedAccess) {
                    mainTabs.push({
                        id: ProfileTabs.SharedAccess,
                        text: resources.lblSharedAccess
                    });
                }

                if (permissions?.registrationSummary) {
                    mainTabs.push({
                        id: ProfileTabs.RegistrationSummary,
                        text: resources.lblRegistrationSummary
                    });
                }

                if (mainTabs?.length > 1) {
                    mainTabs = mainTabs.sort((optionA, optionB) => optionA.id - optionB.id);
                }
                this.setState({
                    tabs: mainTabs
                }, () => {
                    LayoutActions.setLoading(false);
                });
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
        const resources: IMyProfileResources | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();
        const permissions: IProfilePermissions = LayoutStore.getPermissions();
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
            tabs
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            const contentTabs: JSX.Element[] = tabs.map(tab => {

                switch (tab.id) {
                    case ProfileTabs.Account:
                        return (
                            <AccountMain
                                isChangePassword={permissions?.changePassword}
                                key="Account"
                            />
                        );
                    case ProfileTabs.Addresses:
                        return (
                            <AddressesMain
                                key="Addresses"
                            />
                        );
                    case ProfileTabs.PhoneNumbers:
                        return (
                            <PhoneNumberMain
                                key="PhoneNumbers"
                            />
                        );
                    case ProfileTabs.EmergencyContacts:
                        return (
                            <EmergencyContactMain
                                key="EmergencyContacts"
                            />
                        );
                    case ProfileTabs.PreferredName:
                        return (
                            <PreferredNameMain
                                key="PreferredName"
                            />
                        );
                    case ProfileTabs.Demographic:
                        return (
                            <DemographicMain
                                key="Demographic"
                            />
                        );
                    case ProfileTabs.EthnicityAndRace:
                        return (
                            <EthnicityMain
                                key="Ethnicity"
                            />
                        );
                    case ProfileTabs.Agreements:
                        return (
                            <AgreementsMain
                                numberCulture={cultures.numberCulture}
                                key="Agreements"
                            />
                        );
                    case ProfileTabs.SharedAccess:
                        return (
                            <SharedAccessMain />
                        );
                    case ProfileTabs.RegistrationSummary:
                        return (
                            <RegistrationSummaryMain />
                        );
                    default:
                        return (<></>);
                }
            });

            // Main content
            contentPage = (
                <ProfileMain
                    key="profileMain"
                    contentTabs={contentTabs}
                    tabs={tabs}
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
                {contentPage}
            </Layout>
        );
    }
}

const MyProfileViewWithLayout = withLayout(MyProfileView);
// #endregion

// RenderDOM: Component
ReactDOM.render(<MyProfileViewWithLayout />, document.getElementById('root'));