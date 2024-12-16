/* Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
 * File: StudentSetupView.tsx
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
import GradeMappings from '../../Classes/CourseManagement/GradeMappings';
import Agreements from '../Agreements';
import BlockRegistration from './BlockRegistration';
import FinancialSettings from './FinancialSettings';
import RegistrationGroups from './RegistrationGroups';
import Settings1098T from './Settings1098T';
import SharedAccessMain from './SharedAccessMain';
import StudentRecords from './StudentRecords';
import TraditionalDefaults from './TraditionalDefaults';
import TraditionalRegistration from './TraditionalRegistration';
import TranscriptRequest from './TranscriptRequest';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { AgreementType } from '../../../Types/Agreements/IAgreementDetail';
import { CourseManagementMainOptions } from '../../../Types/Permissions/ICourseManagementMainPermissions';
import { IStudentSetupPermissions, StudentSetupTabs } from '../../../Types/Permissions/IStudentSetupPermissions';
import { IStudentSetupResources } from '../../../Types/Resources/Administration/IStudentSetupResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// #endregion Imports

// #region Types
interface IStudentSetupState {
    componentError: boolean;
    permissions?: IStudentSetupPermissions;
    resources?: IStudentSetupResources;
    tabSelected: number;
}
// #endregion Types

// #region Component
class StudentSetupView extends React.Component<any, IStudentSetupState> {
    private idModule: string;
    private idPage: string;
    private tabs: ITabOption[];

    public readonly state: Readonly<IStudentSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'StudentSetup';
        this.tabs = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IStudentSetupState {
        let permissions: IStudentSetupPermissions | undefined;
        let resources: IStudentSetupResources | undefined;
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
                const initialState: IStudentSetupState = this.getInitialState();
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
                    if (permissions.agreements) {
                        this.tabs.push({
                            id: StudentSetupTabs.Agreements,
                            text: resources.studentSetupTabs.lblAgreements
                        });
                    }
                    if (permissions.financialSettings) {
                        this.tabs.push({
                            id: StudentSetupTabs.FinancialSettings,
                            text: resources.studentSetupTabs.lblFinancialSettings
                        });
                    }
                    if (permissions.registrationGroups) {
                        this.tabs.push({
                            id: StudentSetupTabs.RegistrationGroups,
                            text: resources.studentSetupTabs.lblRegistrationGroups
                        });
                    }
                    if (permissions.studentRecords) {
                        this.tabs.push({
                            id: StudentSetupTabs.StudentRecords,
                            text: resources.studentSetupTabs.lblStudentRecords
                        });
                    }
                    if (permissions.traditionalDefaults) {
                        this.tabs.push({
                            id: StudentSetupTabs.TraditionalDefaults,
                            text: resources.studentSetupTabs.lblTraditionalDefaults
                        });
                    }
                    if (permissions.traditionalRegistration) {
                        this.tabs.push({
                            id: StudentSetupTabs.TraditionalRegistration,
                            text: resources.studentSetupTabs.lblTraditionalRegistration
                        });
                    }
                    if (permissions.transcriptRequest) {
                        this.tabs.push({
                            id: StudentSetupTabs.TranscriptRequest,
                            text: resources.studentSetupTabs.lblTranscriptRequest
                        });
                    }
                    if (permissions.gradeMappings) {
                        this.tabs.push({
                            id: StudentSetupTabs.GradeMappings,
                            text: resources.studentSetupTabs.lblGradeMappings
                        });
                    }
                    if (permissions.settings1098T) {
                        this.tabs.push({
                            id: StudentSetupTabs.Settings1098T,
                            text: resources.studentSetupTabs.lblSettings1098T
                        });
                    }

                    if (permissions.blockRegistration) {
                        this.tabs.push({
                            id: StudentSetupTabs.BlockRegistration,
                            text: resources.studentSetupTabs.lblBlockRegistration
                        });
                    }

                    if (permissions.sharedAccess) {
                        this.tabs.push({
                            id: StudentSetupTabs.SharedAccess,
                            text: resources.studentSetupTabs.lblSharedAccess
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
        const permissions: IStudentSetupPermissions | undefined = LayoutStore.getPermissions();
        const resources: IStudentSetupResources | undefined = LayoutStore.getResources();

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
                        id="StudentSetupTabs"
                        marginBottom
                        options={this.tabs}
                        scrollButtons
                        valueSelected={tabSelected}
                        onChange={this.onChangeTab}
                    />
                );
                switch (tabSelected) {
                    case StudentSetupTabs.Agreements:
                        contentTab = (
                            <Agreements
                                agreementType={AgreementType.Registration}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case StudentSetupTabs.FinancialSettings:
                        contentTab = (
                            <FinancialSettings
                                lblDropDownEmptyText={resources.lblDropDownEmptyText}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case StudentSetupTabs.RegistrationGroups:
                        contentTab = (
                            <RegistrationGroups
                                lblDropDownEmptyText={resources.lblDropDownEmptyText}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case StudentSetupTabs.StudentRecords:
                        contentTab = (
                            <StudentRecords
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case StudentSetupTabs.TraditionalDefaults:
                        contentTab = (
                            <TraditionalDefaults
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case StudentSetupTabs.TraditionalRegistration:
                        contentTab = (
                            <TraditionalRegistration
                                lblDropDownEmptyText={resources.lblDropDownEmptyText}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case StudentSetupTabs.TranscriptRequest:
                        contentTab = (
                            <TranscriptRequest
                                lblDropDownEmptyText={resources.lblDropDownEmptyText}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case StudentSetupTabs.GradeMappings:
                        contentTab = (
                            <GradeMappings
                                isAdministration
                                myPosition={CourseManagementMainOptions.GradeMappings}
                            />
                        );
                        break;
                    case StudentSetupTabs.Settings1098T:
                        contentTab = (
                            <Settings1098T
                                lblDropDownEmptyText={resources.lblDropDownEmptyText}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case StudentSetupTabs.BlockRegistration:
                        contentTab = (
                            <BlockRegistration />
                        );
                        break;
                    case StudentSetupTabs.SharedAccess:
                        contentTab = (
                            <SharedAccessMain />
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

const StudentSetupViewWithLayout = withLayout(StudentSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<StudentSetupViewWithLayout />, document.getElementById('root'));