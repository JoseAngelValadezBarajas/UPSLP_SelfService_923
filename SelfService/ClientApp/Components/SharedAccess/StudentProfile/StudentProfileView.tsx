/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: StudentProfileView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Internal components
import AcademicPlanMain from '../../Registration/AcademicPlan/AcademicPlanMain';
import AddressesMain from '../../Account/MyProfile/AddressesMain';
import BalanceMain from '../../Finances/Balance/BalanceMain';
import FinancialAidMain from '../../Finances/FinancialAid/FinancialAidMain';
import GradeReportMain from '../../Grades/GradeReport/GradeReportMain';
import StopListMain from './StopListMain';
import StudentProfileMain from './StudentProfileMain';
import StudentSchedule from '../../Registration/Schedule/StudentSchedule';
import UnofficialTranscriptMain from '../../Grades/UnofficialTranscript/UnofficialTranscriptMain';

// Requests
import Requests from '../../../Requests/SharedAccess/Students';

// Types
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ImpersonateProcess } from '../../../Types/Enum/ImpersonateProcess';
import { IStudentProfilePermissions } from '../../../Types/Permissions/IStudentProfilePermissions';
import { IStudentProfileResources } from '../../../Types/Resources/SharedAccess/IStudentProfileResources';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { StudentProfileTab } from '../../../Types/Enum/StudentProfileTab';

// Helpers
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IStudentProfileState {
    isLoading: boolean;
    permissions?: IStudentProfilePermissions;
    personId: number;
    resources?: IStudentProfileResources;
    tabs: ITabOption[];
    tabSelected: number;
    tabBalance?: number;
}
// #endregion Types

// #region Component
class StudentProfileView extends React.Component<any, IStudentProfileState> {
    private idMainPage: string;
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IStudentProfileState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idMainPage = 'Students'
        this.idModule = 'SharedAccess';
        this.idPage = 'StudentProfile';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IStudentProfileState {
        let isLoading: boolean = true;
        let permissions: IStudentProfilePermissions | undefined;
        let resources: IStudentProfileResources | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            permissions = this.state.permissions;
            resources = this.state.resources;
        }
        return {
            isLoading: isLoading,
            permissions: permissions,
            personId: -1,
            resources: resources,
            tabs: [],
            tabSelected: -1
        };
    }

    // #region Events
    private onChangeTab = (_event: object, value: number): void => {
        try {
            LayoutStore.abort();
            const {
                tabSelected
            } = this.state;

            if (tabSelected !== value) {
                const initialState: IStudentProfileState = this.getInitialState();
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

    // #region Functions
    private getHiddenValues = (): void => {
        try {
            const hdnPersonId: HTMLInputElement | undefined =
                document.getElementById('hdnPersonId') as HTMLInputElement;
            const hdnTransactionId: HTMLInputElement | undefined =
                document.getElementById('hdnTransactionId') as HTMLInputElement;
            let personId: number;
            if (hdnPersonId?.value) {
                if (hdnTransactionId?.value) {
                    this.setState({
                        tabBalance: 7
                    });
                }
                personId = Number(hdnPersonId.value);
                this.setState({
                    personId
                });
                hdnPersonId.remove();

                Requests.getProfileClaims(personId, this.resolveGetProfileClaims);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.getHiddenValues.name, e));
        }
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
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
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = (): void => {
        try {
            const {
                resources,
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                this.getHiddenValues();
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveGetProfileClaims = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetProfileClaims.name, this.hideAllLoaders);
            if (result?.status) {
                const permissions: IStudentProfilePermissions | undefined = result.data;

                const {
                    resources,
                    tabs
                } = this.state;

                let tabsModified: ITabOption[] = tabs;
                if (permissions && resources) {
                    if (permissions.stopList) {
                        tabsModified.push({
                            id: StudentProfileTab.stopList,
                            text: resources.lblStopList
                        });
                    }

                    if (permissions.schedule) {
                        tabsModified.push({
                            id: StudentProfileTab.schedule,
                            text: resources.lblSchedule
                        });
                    }

                    if (permissions.gradeReport) {
                        tabsModified.push({
                            id: StudentProfileTab.gradeReport,
                            text: resources.lblGradeReport
                        });
                    }

                    if (permissions.academicPlan) {
                        tabsModified.push({
                            id: StudentProfileTab.academicPlan,
                            text: resources.lblAcademicPlan
                        });
                    }

                    if (permissions.transcript) {
                        tabsModified.push({
                            id: StudentProfileTab.transcript,
                            text: resources.lblTranscript
                        });
                    }

                    if (permissions.address) {
                        tabsModified.push({
                            id: StudentProfileTab.addresses,
                            text: resources.lblAddresses
                        });
                    }

                    if (permissions.balance) {
                        tabsModified.push({
                            id: StudentProfileTab.balance,
                            text: resources.lblBalance
                        });
                    }

                    if (permissions.financialAid) {
                        tabsModified.push({
                            id: StudentProfileTab.financialAid,
                            text: resources.lblFinancialAid
                        });
                    }

                    if (tabsModified && tabsModified.length > 1) {
                        tabsModified = tabsModified.sort((tabA, tabB) => tabA.id - tabB.id);
                    }

                    if (tabsModified.length > 0) {
                        this.setState({
                            isLoading: false,
                            tabSelected: tabsModified[0].id,
                            tabs: tabsModified,
                            permissions
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
                        isLoading: false,
                    }, LayoutActions.hidePageLoader);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetProfileClaims.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IStudentProfileResources | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
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
            personId,
            resources,
            tabs,
            tabBalance
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (permissions && resources && !isLoading) {
            const contentTabs: JSX.Element[] = tabs.map(tab => {
                switch (tab.id) {
                    case StudentProfileTab.stopList:
                        return (
                            <StopListMain
                                key="StopListMain"
                                impersonateInfo={{
                                    personId: personId,
                                    process: ImpersonateProcess.SharedAccess
                                }}
                            />
                        );
                    case StudentProfileTab.schedule:
                        return (
                            <StudentSchedule
                                key="StudentSchedule"
                                impersonateInfo={{
                                    personId: personId,
                                    process: ImpersonateProcess.SharedAccess
                                }}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                    case StudentProfileTab.gradeReport:
                        return (
                            <GradeReportMain
                                advisingCourseworkClaim={permissions.activityGrades}
                                isRelative
                                key="GradeReportMain"
                                personId={personId}
                                impersonateInfo={{
                                    personId: personId,
                                    process: ImpersonateProcess.SharedAccess
                                }}
                            />
                        );
                    case StudentProfileTab.academicPlan:
                        return (
                            <AcademicPlanMain
                                addToCartClaim={false}
                                key="AcademicPlanMain"
                                isRelative
                                impersonateInfo={{
                                    personId: personId,
                                    process: ImpersonateProcess.SharedAccess,
                                }}
                            />
                        );
                    case StudentProfileTab.transcript:
                        return (
                            <UnofficialTranscriptMain
                                inTab
                                key="UnofficialTranscriptMain"
                                impersonateInfo={{
                                    personId: personId,
                                    process: ImpersonateProcess.SharedAccess
                                }}
                            />
                        );
                    case StudentProfileTab.addresses:
                        return (
                            <AddressesMain
                                key="Addresses"
                                isRelative
                                personId={personId}
                            />
                        );
                    case StudentProfileTab.balance:
                        return (
                            <BalanceMain
                                isRelative
                                key="BalanceMain"
                                personId={personId}
                            />
                        );
                    case StudentProfileTab.financialAid:
                        return (
                            <FinancialAidMain
                                isRelative
                                key="FinancialAidMain"
                                personId={personId}
                            />
                        );
                    default:
                        return (<></>);
                }
            });

            contentPage = (
                <StudentProfileMain
                    key="studentMain"
                    contentTabs={contentTabs}
                    impersonateInfo={{
                        personId: personId,
                        process: ImpersonateProcess.SharedAccess
                    }}
                    tabId={tabBalance !== undefined ? tabBalance : tabs[0].id}
                    tabs={tabs}
                />
            );
        }

        return (
            <Layout
                hideHeader
                idMainPage={this.idMainPage}
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

const StudentProfileViewWithLayout = withLayout(StudentProfileView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<StudentProfileViewWithLayout />, document.getElementById('root'));