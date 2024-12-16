/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FacultyScheduleView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Internal Components
import FacultyScheduleDetail, { IFacultyScheduleDetailResProps } from './FacultyScheduleDetail';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';

// Types
import { CourseManagementMainOptions } from '../../../Types/Permissions/ICourseManagementMainPermissions';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IFacultySchedule } from '@hedtech/powercampus-design-system/types/Faculty/IFacultySchedule';
import { IFacultyScheduleBySession } from '../../../Types/Schedule/IFacultyScheduleBySession';
import { IFacultySchedulePermissions } from '../../../Types/Permissions/IFacultySchedulePermissions';
import { IFacultyScheduleResources } from '../../../Types/Resources/Classes/IFacultyScheduleResources';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ITheme } from '@hedtech/powercampus-design-system/types/ITheme';
import { IYearTermSession } from '../../../Types/Generic/IYearTerm';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import ThemeHelper from '@hedtech/powercampus-design-system/helpers/ThemeHelper';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Requests
import Requests from '../../../Requests/Classes/FacultySchedule';
import RequestsSection from '../../../Requests/Generic/Section';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IFacultyScheduleRes extends IFacultyScheduleResources {
    facultyScheduleDetail: IFacultyScheduleDetailResProps;
    printing: IPrintResources;
    sectionDetailModal: ISectionDetailModalResProps;
}

interface IFacultyScheduleState {
    componentError: boolean;
    conEd: boolean;
    isLoading: boolean;
    isLoadingConEd: boolean;
    isLoadingTrad: boolean;
    myConEdSchedule?: IFacultySchedule[];
    mySchedule?: IFacultyScheduleBySession[];
    periods?: IDropDownOption[];
    onlyConEd: boolean;
    periodValue?: string;
    permissions?: IFacultySchedulePermissions;
    resources?: IFacultyScheduleRes;
    sectionDetail?: ISectionDetail;
    sectionModalOpen: boolean;
    theme: ITheme;
}
// #endregion Types

// #region Component
class FacultyScheduleView extends React.Component<any, IFacultyScheduleState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IFacultyScheduleState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'FacultySchedule';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IFacultyScheduleState {
        let permissions: IFacultySchedulePermissions | undefined;
        let resources: IFacultyScheduleRes | undefined;
        if (this.state) {
            permissions = this.state.permissions;
            resources = this.state.resources;
        }
        return {
            componentError: false,
            conEd: false,
            isLoading: true,
            onlyConEd: false,
            isLoadingConEd: false,
            isLoadingTrad: false,
            periods: undefined,
            periodValue: undefined,
            permissions: permissions,
            resources: resources,
            sectionDetail: undefined,
            sectionModalOpen: false,
            theme: ThemeHelper.getDefaultValues()
        };
    }

    // #region Events
    private onCheckboxChange = (): void => {
        const {
            conEd,
            periodValue
        } = this.state;

        if (periodValue && !conEd) {
            this.showLoaderConEd();
            LayoutActions.showPageLoader();
            Requests.getConEdScheduleList(this.resolveGetConEdScheduleList);
        }
        this.setState({
            conEd: !conEd
        });
    };

    private onClassList = (period: IYearTermSession, id: number): void => {
        try {
            const periodParams: string = `${period.year}/${period.term}/${period.session || '-'}`;
            window.location.assign(`${Constants.webUrl}/Classes/CourseManagement/${periodParams}/${id}/${CourseManagementMainOptions.ClassList}`);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClassList.name, e));
        }
    };

    private onCloseSectionModal = (): void => {
        this.setState({
            sectionDetail: undefined,
            sectionModalOpen: false
        });
    };

    private onDropdownChange = (optionSelected: IDropDownOption, _id: string): void => {
        if (optionSelected) {
            LayoutActions.showPageLoader()
            this.showLoaderTrad()
            Requests.getScheduleList(optionSelected.value.toString(), this.resolveGetScheduleList);
            this.setState({
                periodValue: String(optionSelected.value)
            });
        }
    };

    private onViewSectionDetails = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const id: number = Number(event.currentTarget.dataset.id);
            LayoutActions.showPageLoader();
            RequestsSection.getSection(id, false, this.resolveGetSection);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetails.name, e));
        }
    };

    private onViewSectionDetailsByCalendar = (id: number): void => {
        try {
            LayoutActions.showPageLoader();
            RequestsSection.getSection(id, false, this.resolveGetSection);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetailsByCalendar.name, e));
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

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingConEd: false,
            isLoadingTrad: false
        }, LayoutActions.hidePageLoader);
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };

    private hideLoaderConEd = (): void => {
        this.setState({
            isLoadingConEd: false
        }, LayoutActions.hidePageLoader);
    };

    private showLoaderConEd = (): void => {
        this.setState({
            isLoadingConEd: true
        });
    };

    private hideLoaderTrad = (): void => {
        this.setState({
            isLoadingTrad: false
        }, LayoutActions.hidePageLoader);
    };

    private showLoaderTrad = (): void => {
        this.setState({
            isLoadingTrad: true
        });
    };
    // #endregion Loader Functions

    // #region Resolvers
    private resolveLayoutReady = () => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
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

    private resolveGetSchedulePeriods = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSchedulePeriods.name, this.hideAllLoaders);
            if (result?.status) {
                LayoutActions.hidePageLoader();
                let periodValue: string | undefined;
                let periods: IDropDownOption[] | undefined = result.data;
                if (periods && periods.length > 0) {
                    periodValue = periods[0].value as string;
                    this.showLoaderTrad();
                    Requests.getScheduleList(periodValue, this.resolveGetScheduleList);
                    this.setState({
                        periods: periods,
                        periodValue: periodValue
                    });
                }
                else {
                    Requests.getConEdScheduleList(this.resolveGetConEdScheduleList);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSchedulePeriods.name, e));
        }
    };

    private resolveGetScheduleList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetScheduleList.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    mySchedule: result.data
                }, () => {
                    this.hideLoader();
                    this.hideLoaderTrad();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetScheduleList.name, e));
        }
    };

    private resolveGetConEdScheduleList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetConEdScheduleList.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    conEd,
                    periods
                } = this.state;

                const myConEdSchedule: IFacultySchedule[] = result.data;
                const onlyConEd: boolean = myConEdSchedule
                    && myConEdSchedule.length > 0
                    && (!periods || (periods && periods.length === 0))

                this.setState({
                    conEd: onlyConEd || conEd,
                    onlyConEd: onlyConEd,
                    myConEdSchedule: result.data
                }, () => {
                    this.hideLoader();
                    this.hideLoaderConEd();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetConEdScheduleList.name, e));
        }
    };

    private resolveGetSection = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    sectionDetail: result.data,
                    sectionModalOpen: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const permissions: IFacultySchedulePermissions | undefined = LayoutStore.getPermissions();
        const resources: IFacultyScheduleRes | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                permissions: permissions,
                resources: resources,
                theme: ThemeHelper.withDefaultValues(LayoutStore.getTheme())
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
    public componentDidMount(): void {
        try {
            Requests.getSchedulePeriods(this.resolveGetSchedulePeriods);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

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
            conEd,
            isLoading,
            isLoadingConEd,
            isLoadingTrad,
            myConEdSchedule,
            mySchedule,
            onlyConEd,
            periods,
            periodValue,
            permissions,
            resources,
            sectionDetail,
            sectionModalOpen,
            theme
        } = this.state;

        let sectionModal: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;

        if (!componentError && resources && permissions) {

            if (sectionDetail) {
                sectionModal = (
                    <SectionDetailModal
                        open={sectionModalOpen}
                        resources={resources.sectionDetailModal}
                        section={sectionDetail}
                        onClose={this.onCloseSectionModal}
                    />
                );
            }
            if (isLoading) {
                contentPage = (
                    <Card>
                        <CardContent>
                            <ContainerLoader id="ldrFacultySchedule" height="md" />
                        </CardContent>
                    </Card>
                );
            }
            else {
                if ((periods && periods.length > 0) || (mySchedule && mySchedule.length > 0) || (myConEdSchedule && myConEdSchedule.length > 0)) {
                    contentPage = (
                        <>
                            <FacultyScheduleDetail
                                ScheduleItemProps={{
                                    onViewSectionDetails: this.onViewSectionDetails
                                }}
                                conEd={conEd}
                                isLoadingConEd={isLoadingConEd}
                                isLoadingTrad={isLoadingTrad}
                                myConEdSchedule={myConEdSchedule}
                                mySchedule={mySchedule}
                                onlyConEd={onlyConEd}
                                periods={periods}
                                periodValue={periodValue}
                                printResources={resources.printing}
                                resources={resources.facultyScheduleDetail}
                                showClassListLink={permissions.classList}
                                teachingCalendarColor={theme.teachingCalendarColor}
                                onClassList={this.onClassList}
                                onCheckboxChange={this.onCheckboxChange}
                                onDropdownChange={this.onDropdownChange}
                                onViewSectionDetailsByCalendar={this.onViewSectionDetailsByCalendar}
                            />
                            {sectionModal}
                        </>
                    );
                }
                else {
                    contentPage = (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Illustration
                                            color="secondary"
                                            name="empty-calendar"
                                            text={resources.lblNoCourses}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    );
                }
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
            </Layout>
        );
    }
}

const FacultyScheduleViewWithLayout = withLayout(FacultyScheduleView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<FacultyScheduleViewWithLayout />, document.getElementById('root'));