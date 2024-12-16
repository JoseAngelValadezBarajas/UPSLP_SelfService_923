/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AdviseeProfileView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Internal Components
import AcademicPlanMain from '../../Registration/AcademicPlan/AcademicPlanMain';
import AdvisorApproval from './AdvisorApproval';
import AgreementsMain from '../../Account/MyProfile/AgreementsMain';
import AlertReportMain from './AlertReportMain';
import AttendanceMain from './AttendanceMain';
import DisabilitiesMain from './DisabilitiesMain';
import GradeReportMain from '../../Grades/GradeReport/GradeReportMain';
import MyTasksMain from '../../Checklist/MyTasks/MyTasksMain';
import ProfileMain from '../../Account/MyProfile/ProfileMain';
import RegistrationSummaryMain from '../../Account/MyProfile/RegistrationSummaryMain';
import StudentSchedule from '../../Registration/Schedule/StudentSchedule';
import TestScoresMain from './TestScoresMain';
import UnofficialTranscriptMain from '../../Grades/UnofficialTranscript/UnofficialTranscriptMain';
import WhatIfMain from '../../Registration/WhatIf/WhatIfMain';

// Requests
import RequestsAdvisees from '../../../Requests/Advising/ManageAdvisees';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { IAdviseeClaims } from '../../../Types/Advisees/IAdviseeClaims';
import { AdviseeProfileTab } from '../../../Types/Enum/AdviseeProfileTab';
import { ImpersonateProcess } from '../../../Types/Enum/ImpersonateProcess';
import { IAdviseeProfileResources } from '../../../Types/Resources/Advising/IAdviseeProfileResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IAdviseeProfileState {
    componentError: boolean;
    cultures: ICultures;
    claims?: IAdviseeClaims;
    resources?: IAdviseeProfileResources;
    tabs: ITabOption[];
}
// #endregion Types

// #region Component
class AdviseeProfileView extends React.Component<any, IAdviseeProfileState> {
    private idMainPage: string;
    private idModule: string;
    private idPage: string;
    private personId: number;
    private tabId: number;
    private tabText: string;
    private viewId: number;

    public readonly state: Readonly<IAdviseeProfileState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idMainPage = 'ManageAdvisees';
        this.idModule = 'Advising';
        this.idPage = 'AdviseeProfile';
        this.personId = 0;
        this.tabId = -1;
        this.tabText = '';
        this.viewId = -1;
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IAdviseeProfileState {
        let resources: IAdviseeProfileResources | undefined;
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

    // #region Functions
    private getHiddenValues = (): void => {
        try {
            const hdnPersonId: HTMLInputElement | undefined =
                document.getElementById('hdnPersonId') as HTMLInputElement;
            const hdnTabId: HTMLInputElement | undefined =
                document.getElementById('hdnTabId') as HTMLInputElement;
            const hdnTabText: HTMLInputElement | undefined =
                document.getElementById('hdnTabText') as HTMLInputElement;
            const hdnViewId: HTMLInputElement | undefined =
                document.getElementById('hdnViewId') as HTMLInputElement;

            if (hdnPersonId && hdnPersonId.value
                && hdnViewId && hdnViewId.value
                && hdnTabText && hdnTabText.value
                && hdnTabId && hdnTabId.value) {
                this.personId = Number(hdnPersonId.value);
                this.tabId = Number(hdnTabId.value);
                this.tabText = hdnTabText.value;
                this.viewId = Number(hdnViewId.value);
                hdnPersonId.remove();
                hdnViewId.remove();
                hdnTabText.remove();
                hdnTabId.remove();

                LayoutActions.setLoading(true);
                RequestsAdvisees.getProfileClaims(this.viewId,
                    this.resolveGetProfileClaims);
            }
            else {
                this.logError(LogData.fromMessage(this.getHiddenValues.name, 'hdnPersonId, hdnViewId, hdnTabId  and/or hdnTabText not found.'));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.getHiddenValues.name, e));
        }
    };
    // #endregion Functions

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
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                const {
                    tabs
                } = this.state;
                tabs.push({
                    id: AdviseeProfileTab.profile,
                    text: resources.lblProfile
                });
                this.setState({
                    tabs: tabs
                });
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
                = Resolver(json, this.resolveGetProfileClaims.name);

            if (result?.status) {
                const claims: IAdviseeClaims | undefined = result.data;
                const {
                    resources,
                    tabs
                } = this.state;
                let tabsModified: ITabOption[] = tabs;
                if (claims && resources) {
                    if (claims.scheduleRequests) {
                        tabsModified.push({
                            id: AdviseeProfileTab.scheduleRequests,
                            text: resources.lblScheduleRequests
                        });
                    }

                    if (claims.schedule) {
                        tabsModified.push({
                            id: AdviseeProfileTab.schedule,
                            text: resources.lblSchedule
                        });
                    }

                    if (claims.gradeReport) {
                        tabsModified.push({
                            id: AdviseeProfileTab.grades,
                            text: resources.lblGrades
                        });
                    }

                    if (claims.academicPlan) {
                        tabsModified.push({
                            id: AdviseeProfileTab.academicPlan,
                            text: resources.lblAcademicPlan
                        });
                    }

                    if (claims.unofficialTranscript) {
                        tabsModified.push({
                            id: AdviseeProfileTab.unofficialTranscript,
                            text: resources.lblUnofficialTranscript
                        });
                    }

                    if (claims.agreements) {
                        tabsModified.push({
                            id: AdviseeProfileTab.agreements,
                            text: resources.lblAgreements
                        });
                    }

                    if (claims.disabilities) {
                        tabsModified.push(
                            {
                                id: AdviseeProfileTab.disabilities,
                                text: resources.lblDisabilities
                            }
                        );
                    }

                    if (claims.testScores) {
                        tabsModified.push({
                            id: AdviseeProfileTab.testScores,
                            text: resources.lblTestScores
                        });
                    }

                    if (claims.attendance) {
                        tabsModified.push({
                            id: AdviseeProfileTab.attendance,
                            text: resources.lblAttendance
                        });
                    }

                    if (claims.whatIf) {
                        tabsModified.push({
                            id: AdviseeProfileTab.whatIf,
                            text: resources.lblWhatIf
                        });
                    }

                    if (claims.alerts) {
                        tabsModified.push({
                            id: AdviseeProfileTab.alerts,
                            text: resources.lblAlerts
                        });
                    }

                    if (claims.checklist) {
                        tabsModified.push({
                            id: AdviseeProfileTab.checklist,
                            text: resources.lblChecklist
                        });
                    }

                    if (claims.registrationSummary) {
                        tabsModified.push({
                            id: AdviseeProfileTab.registrationSummary,
                            text: resources.lblRegistrationSummary
                        });
                    }

                    if (tabsModified && tabsModified.length > 1) {
                        tabsModified = tabsModified.sort((optionA, optionB) => optionA.id - optionB.id);
                    }
                }

                this.setState({
                    claims: claims,
                    tabs: tabsModified
                }, () => {
                    LayoutActions.setLoading(false);
                });
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
        const resources: IAdviseeProfileResources | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();

        if (ready) {
            this.setState({
                cultures: cultures,
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
            claims,
            componentError,
            cultures,
            resources,
            tabs
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && claims) {
            const contentTabs: JSX.Element[] = tabs.map(tab => {
                switch (tab.id) {
                    case AdviseeProfileTab.academicPlan:
                        return (
                            <AcademicPlanMain
                                addToCartClaim={claims.academicPlanAddToCart}
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.academicPlan,
                                    viewId: this.viewId
                                }}
                                isRelative
                                key="AcademicPlanMain"
                            />
                        );
                    case AdviseeProfileTab.agreements:
                        return (
                            <AgreementsMain
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.agreements,
                                    viewId: this.viewId
                                }}
                                numberCulture={cultures.numberCulture}
                                key="Agreements"
                            />
                        );
                    case AdviseeProfileTab.attendance:
                        return (
                            <AttendanceMain
                                dailyAttendanceClaim={claims.attendanceDailyAttendance}
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.attendance,
                                    viewId: this.viewId
                                }}
                                key="AttendanceMain"
                            />
                        );
                    case AdviseeProfileTab.disabilities:
                        return (
                            <DisabilitiesMain
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.disabilities,
                                    viewId: this.viewId
                                }}
                                key="Disabilities"
                            />
                        );
                    case AdviseeProfileTab.grades:
                        return (
                            <GradeReportMain
                                advisingCourseworkClaim={claims.gradeReportCoursework}
                                isRelative
                                key="GradeReportMain"
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.grades,
                                    viewId: this.viewId
                                }}
                            />
                        );
                    case AdviseeProfileTab.schedule:
                        return (
                            <StudentSchedule
                                key="StudentSchedule"
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.schedule,
                                    viewId: this.viewId
                                }}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                    case AdviseeProfileTab.scheduleRequests:
                        return (
                            <AdvisorApproval
                                cultures={cultures}
                                key="AdvisorApproval"
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.scheduleRequests,
                                    viewId: this.viewId
                                }}
                            />
                        );
                    case AdviseeProfileTab.testScores:
                        return (
                            <TestScoresMain
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.testScores,
                                    viewId: this.viewId
                                }}
                                key="TestScores"
                            />
                        );
                    case AdviseeProfileTab.unofficialTranscript:
                        return (
                            <UnofficialTranscriptMain
                                key="UnofficialTranscriptMain"
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.unofficialTranscript,
                                    viewId: this.viewId
                                }}
                            />
                        );
                    case AdviseeProfileTab.whatIf:
                        return (
                            <WhatIfMain
                                addToCartClaim={claims.whatIfAddToCart}
                                key="WhatIfMain"
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.whatIf,
                                    viewId: this.viewId
                                }}
                            />
                        );

                    case AdviseeProfileTab.alerts:
                        return (
                            <AlertReportMain
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.alerts,
                                    viewId: this.viewId
                                }}
                                key="AlertsReportMain"
                            />
                        );

                    case AdviseeProfileTab.checklist:
                        return (
                            <MyTasksMain
                                createActionClaim={claims.checklistCreateActionItem}
                                isAdviseeProfile
                                key="MyTaskMain"
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.checklist,
                                    viewId: this.viewId
                                }}
                            />
                        );

                     case AdviseeProfileTab.registrationSummary:
                        return (
                            <RegistrationSummaryMain
                                key="RegistrationSummaryMain"
                                impersonateInfo={{
                                    personId: this.personId,
                                    process: ImpersonateProcess.Advising,
                                    tabId: AdviseeProfileTab.registrationSummary,
                                    viewId: this.viewId
                                }}
                            />
                        );
                    default:
                        return (<></>);
                }
            });

            contentPage = (
                <ProfileMain
                    key="profileMain_advisee"
                    contentTabs={contentTabs}
                    impersonateInfo={{
                        personId: this.personId,
                        process: ImpersonateProcess.Advising,
                        tabId: this.tabId,
                        viewId: this.viewId
                    }}
                    stopListshowOthers={true}
                    tabs={tabs}
                    tabText={this.tabText}
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
            </Layout >
        );
    }
}

const AdviseeProfileViewWithLayout = withLayout(AdviseeProfileView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<AdviseeProfileViewWithLayout />, document.getElementById('root'));