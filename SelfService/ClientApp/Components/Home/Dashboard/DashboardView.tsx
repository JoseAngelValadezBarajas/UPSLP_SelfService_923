/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: DashboardView.tsx
 * Type: Container component */

// #region Imports
import ical, { EventData, ICalCalendar } from 'ical-generator';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';

// Internal components
import DashboardCalendar, { IDashboardCalendarResProps } from './DashboardCalendar';
import DashboardChecklist, { IDashboardChecklistResProps } from './DashboardChecklist';
import DashboardStatus, { IDashboardStatusResProps } from './DashboardStatus';
import DashboardMessages from './DashboardMessages';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITheme } from '@hedtech/powercampus-design-system/types/ITheme';
import { IMyTasks } from '../../../Types/Checklist/IMyTasks';
import { IDashboardChecklist } from '../../../Types/Dashboard/IDashboardChecklist';
import { IDashboardEvent } from '../../../Types/Dashboard/IDashboardEvent';
import { IDashboardNotification } from '../../../Types/Dashboard/IDashboardNotification';
import { IDashboardStatus } from '../../../Types/Dashboard/IDashboardStatus';
import { CourseManagementMainOptions } from '../../../Types/Permissions/ICourseManagementMainPermissions';
import { IDashboardResources } from '../../../Types/Resources/Home/IDashboardResources';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import ThemeHelper from '@hedtech/powercampus-design-system/helpers/ThemeHelper';

// Requests
import Requests from '../../../Requests/Home/Dashboard';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IDashboardRes extends IDashboardResources {
    dashboardCalendar: IDashboardCalendarResProps;
    dashboardStatus: IDashboardStatusResProps;
    dashboardChecklist: IDashboardChecklistResProps;
}

interface IDashboardState {
    cultures: ICultures;
    generalMessage?: string;
    isAuthenticated: boolean;
    isChecklistAvailable?: number;
    isLoading: boolean;
    myTasksDetail: IDashboardChecklist;
    notifications?: IDashboardNotification[];
    resources?: IDashboardRes;
    showChecklist?: boolean;
    status?: IDashboardStatus;
    theme: ITheme;

    // #region Dashboard Calendar
    date?: string;
    dateDesc?: string;
    events?: IDashboardEvent[];
    isLoadingCalendar: boolean;
    showStudyingLegend: boolean;
    showTeachingLegend: boolean;
    withDownloadLink: boolean;
    // #endregion Dashboard Calendar
}
// #endregion Types

// #region Component
class DashboardView extends React.Component<any, IDashboardState> {
    private dateFormat: string;
    private idModule: string;
    private idPage: string;
    private timeFormat: string;

    public readonly state: Readonly<IDashboardState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.dateFormat = 'YYYY-MM-DD';
        this.idModule = 'Home';
        this.idPage = 'Dashboard';
        this.timeFormat = 'HH:mm:ss';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IDashboardState {
        let isLoading: boolean = true;
        let resources: IDashboardRes | undefined;
        let date: string = moment().format(this.dateFormat);
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }

        return {
            cultures: LayoutStore.getCultures(),
            isAuthenticated: false,
            isLoading: isLoading,
            myTasksDetail: { overdue: 0, today: 0, upcoming: 0 },
            resources: resources,
            theme: ThemeHelper.getDefaultValues(),

            // #region Dashboard Calendar
            date: date,
            isLoadingCalendar: false,
            showStudyingLegend: false,
            showTeachingLegend: false,
            withDownloadLink: false
            // #endregion Dashboard Calendar
        };
    }

    // #region Events

    // #region Dashboard Calendar
    private onChangeDatePicker = (date: string): void => {
        try {
            this.setState({
                date: date,
                isLoadingCalendar: true
            });
            Requests.getEvents(date, this.resolveGetEvents);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDatePicker.name, e));
        }
    };

    private onClickClassList = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const year: number = Number(event.currentTarget.dataset.year);
            const term: string = String(event.currentTarget.dataset.term);
            const session: string | undefined = event.currentTarget.dataset.session || '-';
            const id: number = Number(event.currentTarget.dataset.id);
            const periodParams: string = `${year}/${term}/${session}`;
            window.location.assign(`${Constants.webUrl}/Classes/CourseManagement/${periodParams}/${id}/${CourseManagementMainOptions.ClassList}`);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickClassList.name, e));
        }
    };

    private onCloseEventNotes = (index: number): void => {
        try {
            const {
                events
            } = this.state;
            if (events) {
                events[index].anchorElNotes = null
                events[index].openNotes = false;
                this.setState({
                    events: events
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEventNotes.name, e));
        }
    };

    private onDownloadEvent = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                date
            } = this.state;

            const eventName: string = String(event.currentTarget.dataset.eventName);
            const endHour: string = String(event.currentTarget.dataset.endHour);
            const startHour: string = String(event.currentTarget.dataset.startHour);
            const cal: ICalCalendar = ical({
                prodId: { company: 'ellucian', product: 'powercampus' }
            });

            cal.createEvent({
                end: moment(`${date} ${endHour}`, `${this.dateFormat} ${this.timeFormat}`),
                start: moment(`${date} ${startHour}`, `${this.dateFormat} ${this.timeFormat}`),
                summary: eventName
            } as EventData);

            const link: any | null = document.getElementById('lnkHdnDownloadCalendar');
            if (link) {
                link.href = `data:application/ics;charset=utf-8,${encodeURI(cal.toString())}`;
                link.download = `${eventName}.ics`;
                link.click();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDownloadEvent.name, e));
        }
    };

    private onViewEventNotes = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                events
            } = this.state;

            const index: number = Number(event.currentTarget.dataset.index);

            if (events) {
                events[index].anchorElNotes = event.currentTarget;
                events[index].openNotes = true;
                this.setState({
                    events: events
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewEventNotes.name, e));
        }
    };
    // #endregion Dashboard Calendar

    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = (): void => {
        try {
            const {
                isChecklistAvailable,
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                if (isChecklistAvailable && isChecklistAvailable > 0) {
                    Requests.getChecklist(this.resolveGetChecklist);
                }
                else {
                    this.setState({
                        showChecklist: false
                    });
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

    private resolveGetChecklist = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetChecklist.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data.showTask) {
                    Requests.getMyTasks(this.resolveGetMyTasks);
                }
                else {
                    LayoutActions.hidePageLoader();
                }
                this.setState({
                    showChecklist: result.data.showTask
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetChecklist.name, e));
        }
    };

    private resolveGetMyTasks = (json: string): void => {
        try {
            const {
                myTasksDetail
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetMyTasks.name, this.hideAllLoaders);
            if (result?.status) {
                const myTasks: IMyTasks[] = result.data;
                myTasksDetail.overdue = myTasks.find(m => m.category == 1)?.myTasks.length ? myTasks.find(m => m.category == 1)?.myTasks.length : 0;
                myTasksDetail.today = myTasks.find(m => m.category == 2)?.myTasks.length ? myTasks.find(m => m.category == 2)?.myTasks.length : 0;
                myTasksDetail.upcoming = myTasks.find(m => m.category == 3)?.myTasks.length ? myTasks.find(m => m.category == 3)?.myTasks.length : 0;
                this.setState({
                    myTasksDetail: myTasksDetail
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetMyTasks.name, e));
        }
    };

    private resolveGetNotifications = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetNotifications.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    generalMessage: result.data.generalMessage,
                    isLoading: false,
                    notifications: result.data.notifications
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNotifications.name, e));
        }
    };

    private resolveGetStatus = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStatus.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    status: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStatus.name, e));
        }
    };

    // #region Dashboard Calendar
    private resolveGetEvents = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetEvents.name, this.hideAllLoaders);
            if (result?.status) {
                const events: IDashboardEvent[] | undefined = result.data.events;
                let showStudyingLegend: boolean = false;
                let showTeachingLegend: boolean = false;
                if (events) {
                    events.forEach(event => {
                        event.anchorElNotes = null;
                        event.openNotes = false;
                    });
                    showStudyingLegend = events.findIndex(e => e.isStudent) >= 0;
                    showTeachingLegend = events.findIndex(e => !e.isStudent) >= 0;
                }
                this.setState({
                    dateDesc: result.data.dateDesc,
                    events: events,
                    isLoadingCalendar: false,
                    showStudyingLegend: showStudyingLegend,
                    showTeachingLegend: showTeachingLegend
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetEvents.name, e));
        }
    };
    // #endregion Dashboard Calendar

    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const cultures: ICultures = LayoutStore.getCultures();
        const isAuthenticated: boolean = LayoutStore.getIsAuthenticated();
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IDashboardRes | undefined = LayoutStore.getResources();
        const isChecklistAvailable: any = LayoutStore.getMenuOptions()?.findIndex(o => o.id === 'ChecklistId');

        if (ready) {
            this.setState({
                cultures: cultures,
                isAuthenticated: isAuthenticated,
                isChecklistAvailable: isChecklistAvailable,
                resources: resources,
                theme: ThemeHelper.withDefaultValues(LayoutStore.getTheme())
            }, this.resolveLayoutReady);
        }
        else {
            this.logError(LogData.layoutNoReady(this.onLayoutReady.name));
            this.redirectError(500);
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentDidMount(): void {
        const {
            date
        } = this.state;

        Requests.getNotifications(this.resolveGetNotifications);

        // TODO: This is to get the percentages after GA
        // Requests.getStatus(this.resolveGetStatus, this.logError);

        if (date) {
            this.setState({
                isLoadingCalendar: true
            });
            Requests.getEvents(date, this.resolveGetEvents);
        }
    }

    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            cultures,
            generalMessage,
            isAuthenticated,
            isChecklistAvailable,
            isLoading,
            myTasksDetail,
            notifications,
            resources,
            showChecklist,
            status,
            theme,

            // #region Dashboard Calendar
            date,
            dateDesc,
            events,
            isLoadingCalendar,
            showStudyingLegend,
            showTeachingLegend,
            withDownloadLink
            // #endregion Dashboard Calendar
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources && !isLoading) {
            if (isAuthenticated) {
                contentPage = (
                    <div>
                        <Grid key="homeChecklist" container spacing={3}>
                            <Grid item xs={12}>
                                {showChecklist && isChecklistAvailable && isChecklistAvailable > 0 ? (
                                    <DashboardChecklist
                                        myTasksDetail={myTasksDetail}
                                        resources={resources.dashboardChecklist}
                                    />
                                ) : undefined}
                            </Grid>
                        </Grid>
                        <Grid key="homeNotifications" container spacing={3}>
                            <Grid item xs={12}>
                                {notifications && (
                                    <DashboardMessages
                                        notifications={notifications}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        <Grid key="homeCalendarStatus" container spacing={3}>
                            <Grid item xs={12} lg={7}>
                                {Boolean(date) && (
                                    <DashboardCalendar
                                        cultures={cultures}
                                        date={date}
                                        dateDesc={dateDesc}
                                        events={events}
                                        isLoading={isLoadingCalendar}
                                        resources={resources.dashboardCalendar}
                                        showStudyingLegend={showStudyingLegend}
                                        showTeachingLegend={showTeachingLegend}
                                        theme={theme}
                                        withDownloadLink={withDownloadLink}
                                        onChangeDatePicker={this.onChangeDatePicker}
                                        onClickClassList={this.onClickClassList}
                                        onCloseEventNotes={this.onCloseEventNotes}
                                        onDownloadEvent={this.onDownloadEvent}
                                        onViewEventNotes={this.onViewEventNotes}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} lg={5}>
                                <DashboardStatus
                                    resources={resources.dashboardStatus}
                                    status={status}
                                    statusInfo={generalMessage}
                                />
                            </Grid>
                        </Grid>
                    </div>
                );
            }
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
                withBackgroundImage
                withFooter
            >
                {contentPage}
            </Layout>
        );
    }
}

const DashboardViewWithLayout = withLayout(DashboardView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<DashboardViewWithLayout />, document.getElementById('root'));