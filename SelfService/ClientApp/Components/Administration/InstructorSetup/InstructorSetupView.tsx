/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: InstructorSetupView.tsx
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
import AdvisorWarnings from './AdvisorWarnings';
import AssociationHead from './AssociationHead';
import CampusCoordinator from './CampusCoordinator';
import DepartmentHead from './DepartmentHead';
import FacultyPages from './FacultyPages';
import OfficesSetup from './OfficesSetup';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';
import { IInstructorSetupPermissions, InstructorSetupTabs } from '../../../Types/Permissions/IInstructorSetupPermissions';
import { IInstructorSetupResources } from '../../../Types/Resources/Administration/IInstructorSetupResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IInstructorSetupState {
    componentError: boolean;
    permissions?: IInstructorSetupPermissions;
    resources?: IInstructorSetupResources;
    tabSelected: number;
}
// #endregion Types

// #region Component
class InstructorSetupView extends React.Component<any, IInstructorSetupState> {
    private idModule: string;
    private idPage: string;
    private tabs: ITabOption[];

    public readonly state: Readonly<IInstructorSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'InstructorSetup';
        this.tabs = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IInstructorSetupState {
        let permissions: IInstructorSetupPermissions | undefined;
        let resources: IInstructorSetupResources | undefined;
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
                const initialState: IInstructorSetupState = this.getInitialState();
                initialState.tabSelected = value;
                this.setState(initialState, () => LayoutActions.showPageLoader());
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
                    if (permissions.campusCoordinator) {
                        this.tabs.push({
                            id: InstructorSetupTabs.CampusCoordinator,
                            text: resources.instructorSetupTabs.lblCampusCoordinator
                        });
                    }
                    if (permissions.courseManagement) {
                        this.tabs.push({
                            id: InstructorSetupTabs.CourseManagement,
                            text: resources.instructorSetupTabs.lblFacultyPages
                        });
                    }
                    if (permissions.advisorWarnings) {
                        this.tabs.push({
                            id: InstructorSetupTabs.AdvisorWarnings,
                            text: resources.instructorSetupTabs.lblAdvisorWarnings
                        });
                    }
                    if (permissions.departmentHead) {
                        this.tabs.push({
                            id: InstructorSetupTabs.DepartmentHead,
                            text: resources.instructorSetupTabs.lblDepartmentHead
                        });
                    }
                    if (permissions.associationHead) {
                        this.tabs.push({
                            id: InstructorSetupTabs.AssociationHead,
                            text: resources.instructorSetupTabs.lblAssociationHead
                        });
                    }
                    if (permissions.offices) {
                        this.tabs.push({
                            id: InstructorSetupTabs.Offices,
                            text: resources.instructorSetupTabs.lblOffices
                        });
                    }

                    if (this.tabs && this.tabs.length > 1) {
                        this.tabs = this.tabs.sort((tabA, tabB) => tabA.id - tabB.id);
                    }

                    if (this.tabs.length > 0) {
                        this.setState({
                            tabSelected: this.tabs[0].id
                        }, () => LayoutActions.showPageLoader());
                    }
                    else {
                        LayoutActions.hidePageLoader();
                    }
                }
                else {
                    LayoutActions.hidePageLoader();
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
        const permissions: IInstructorSetupPermissions | undefined = LayoutStore.getPermissions();
        const resources: IInstructorSetupResources | undefined = LayoutStore.getResources();

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
                        id="InstructorSetupTabs"
                        marginBottom
                        options={this.tabs}
                        scrollButtons
                        valueSelected={tabSelected}
                        onChange={this.onChangeTab}
                    />
                );
                switch (tabSelected) {
                    case InstructorSetupTabs.CampusCoordinator:
                        contentTab = (
                            <CampusCoordinator
                                hasDossierClaim={permissions.campusCoordinatorFacultyDossier}
                            />
                        );
                        break;
                    case InstructorSetupTabs.CourseManagement:
                        contentTab = (
                            <FacultyPages
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case InstructorSetupTabs.AdvisorWarnings:
                        contentTab = (
                            <AdvisorWarnings
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case InstructorSetupTabs.DepartmentHead:
                        contentTab = (
                            <DepartmentHead
                                hasDossierClaim={permissions.departmentHeadFacultyDossier}
                            />
                        );
                        break;
                    case InstructorSetupTabs.AssociationHead:
                        contentTab = (
                            <AssociationHead
                                hasDossierClaim={permissions.associationFacultyDossier}
                                lblSuccessSave={resources.lblSuccessSave}
                            />
                        );
                        break;
                    case InstructorSetupTabs.Offices:
                        contentTab = (
                            <OfficesSetup
                                hasDossierClaim={permissions.officesFacultyDossier}
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

const InstructorSetupViewWithLayout = withLayout(InstructorSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<InstructorSetupViewWithLayout />, document.getElementById('root'));