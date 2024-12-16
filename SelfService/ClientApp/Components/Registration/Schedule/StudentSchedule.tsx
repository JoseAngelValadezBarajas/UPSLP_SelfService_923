/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: StudentSchedule.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';

// Internal Components
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import ScheduleDetail, { IScheduleDetailResProps } from './ScheduleDetail';

// Types
import { IAcademicInformation } from '../../../Types/Students/IAcademicInformation';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPermissionRequestInfo } from '@hedtech/powercampus-design-system/types/Student/IPermissionRequestInfo';
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ISectionStatus } from '@hedtech/powercampus-design-system/types/Section/ISectionStatus';
import { ISectionStatusInfo } from '@hedtech/powercampus-design-system/types/Section/ISectionStatusInfo';
import { IStudentCourseMessagesResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseMessagesResources';
import { IStudentCourseStatusResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseStatusResources';
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
import { ITheme } from '@hedtech/powercampus-design-system/types/ITheme';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ISectionsSession } from '../../../Types/Students/ISectionsSession';
import { IStudentScheduleResources } from '../../../Types/Resources/Registration/IStudentScheduleResources';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import SectionHelper from '@hedtech/powercampus-design-system/helpers/SectionHelper';
import ThemeHelper from '@hedtech/powercampus-design-system/helpers/ThemeHelper';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestsSection from '../../../Requests/Generic/Section';
import Requests from '../../../Requests/Registration/StudentSchedule';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IStudentScheduleProps {
    impersonateInfo?: IImpersonateInfo;
    isStudentView?: boolean;
    lblSuccessSave: string;
}

interface IStudentScheduleRes extends IStudentScheduleResources {
    printing: IPrintResources;
    scheduleDetail: IScheduleDetailResProps;
    sectionDetailModal: ISectionDetailModalResProps;
    studentCourseMessages: IStudentCourseMessagesResources;
    studentCourseStatus: IStudentCourseStatusResources;
}

interface IStudentScheduleState {
    academicInformation?: IAcademicInformation[];
    componentError: boolean;
    conEd: boolean;
    fullName?: string;
    inCart: boolean;
    showDenied: boolean;
    inWaitlist: boolean;
    isLoading: boolean;
    isLoadingConEd: boolean;
    isLoadingPeriods: boolean;
    isLoadingTrad: boolean;
    // 0 - Waitlist
    // 1 - Cart
    // 2 - Pending
    // 3 - Registered
    // 4 - Denied
    myConEdSchedule?: IStudentSchedule[][];
    mySchedule?: ISectionsSession[];
    openStatusInfo: boolean;
    periods?: IDropDownOption[];
    periodValue?: string;
    registeredCredits?: string;
    resources?: IStudentScheduleRes;
    sectionModalOpen: boolean;
    sectionDetail?: ISectionDetail;
    sectionSelected?: ISection;
    statusInfoAnchor: any;
    theme: ITheme;
}

const styles = createStyles({
    statusMessageInfo: {
        height: 'auto',
        width: 'auto'
    }
});

type PropsWithStyles = WithStyles<typeof styles> & IStudentScheduleProps;
// #endregion Types

// #region Component
class StudentSchedule extends React.Component<PropsWithStyles, IStudentScheduleState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IStudentScheduleState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Registration';
        this.idPage = 'StudentSchedule';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IStudentScheduleState {
        return {
            componentError: false,
            conEd: false,
            inCart: false,
            inWaitlist: false,
            isLoading: true,
            isLoadingConEd: false,
            isLoadingPeriods: false,
            isLoadingTrad: false,
            openStatusInfo: false,
            showDenied: false,
            sectionModalOpen: false,
            statusInfoAnchor: null,
            theme: ThemeHelper.getDefaultValues()
        };
    }

    // #region Events

    private onCloseStatusInfoPopper = (): void => {
        try {
            this.setState({
                openStatusInfo: false,
                statusInfoAnchor: null
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseStatusInfoPopper.name, e));
        }
    };

    private onOpenStatusInfoPopper = (event: any): void => {
        try {
            this.setState({
                openStatusInfo: true,
                statusInfoAnchor: event.currentTarget
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenStatusInfoPopper.name, e));
        }
    };

    // #region Permission Request Detail

    private onCancelEditPermissionRequest = (id: number): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && studentSchedule.permissionRequestInfo) {
                const permissionRequestInfo: IPermissionRequestInfo | undefined
                    = studentSchedule.permissionRequestInfo.find(pri => pri.id === id);
                if (permissionRequestInfo) {
                    permissionRequestInfo.editable = false;
                    permissionRequestInfo.studentComments = permissionRequestInfo.studentCommentsBackup;
                    permissionRequestInfo.studentCommentsBackup = '';
                    this.setState({
                        sectionSelected: studentSchedule
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEnableEditPermissionRequest.name, e));
        }
    };

    private onChangeCommentsForEdit = (id: number, value: string): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && studentSchedule.permissionRequestInfo) {
                const permissionRequestInfo: IPermissionRequestInfo | undefined
                    = studentSchedule.permissionRequestInfo.find(pri => pri.id === id);
                if (permissionRequestInfo) {
                    permissionRequestInfo.studentComments = value;
                    permissionRequestInfo.modified = true;
                    permissionRequestInfo.error = false;
                    this.setState({
                        sectionSelected: studentSchedule
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCommentsForEdit.name, e));
        }
    };

    private onEditPermissionRequest = (id: number): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && studentSchedule.permissionRequestInfo) {
                const permissionRequestInfo: IPermissionRequestInfo | undefined
                    = studentSchedule.permissionRequestInfo.find(pri => pri.id === id);
                if (permissionRequestInfo) {
                    // Edit
                    if (permissionRequestInfo.studentComments
                        && permissionRequestInfo.studentComments.trim() !== '') {
                        Requests.postEditPermissionRequest(permissionRequestInfo.id,
                            permissionRequestInfo.studentComments,
                            this.resolvePostEditPermissionRequest);
                        LayoutActions.showPageLoader();
                    }
                    else {
                        permissionRequestInfo.error = true;
                        this.setState({
                            sectionSelected: studentSchedule
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditPermissionRequest.name, e));
        }
    };

    private onEnableEditPermissionRequest = (id: number): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && studentSchedule.permissionRequestInfo) {
                const permissionRequestInfo: IPermissionRequestInfo | undefined
                    = studentSchedule.permissionRequestInfo.find(pri => pri.id === id);
                if (permissionRequestInfo) {
                    permissionRequestInfo.editable = true;
                    permissionRequestInfo.studentCommentsBackup = permissionRequestInfo.studentComments;
                    this.setState({
                        sectionSelected: studentSchedule
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEnableEditPermissionRequest.name, e));
        }
    };

    // #endregion Permission Request Detail

    // #region Search

    private onDropdownChange = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            if (optionSelected) {
                this.setState({
                    periodValue: String(optionSelected.value)
                });
                this.showLoaderTrad();
                LayoutActions.showPageLoader();
                Requests.postScheduleList(String(optionSelected.value), this.resolvePostScheduleList, impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onChangeCheckbox = (event: any): void => {
        try {
            const {
                conEd,
                inCart,
                inWaitlist,
                periodValue,
                showDenied,
                resources
            } = this.state;

            const inCartValue: boolean = !inCart;
            const inWaitlistValue: boolean = !inWaitlist;
            const conEdValue: boolean = !conEd;
            const showDeniedValue: boolean = !showDenied;

            if (resources && periodValue) {
                switch (event.target.id) {
                    // All the cases must match with the ids of the checkboxes
                    case 'chkCoursesCart':
                        this.setState({
                            inCart: inCartValue
                        });
                        break;
                    case 'chkShowDeniedCourses':
                        this.setState({
                            showDenied: showDeniedValue
                        });
                        break;
                    case 'chkWaitListCourses':
                        this.setState({
                            inWaitlist: inWaitlistValue
                        });
                        break;
                    case 'chkConEd':
                        if (conEdValue) {
                            this.setState({
                                conEd: conEdValue
                            });
                            const {
                                impersonateInfo
                            } = this.props;
                            this.showLoaderConEd();
                            Requests.postConEdScheduleList(this.resolvePostConEdScheduleList, impersonateInfo);
                        }
                        else {
                            this.setState({
                                conEd: conEdValue,
                                myConEdSchedule: undefined
                            });
                        }
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    // #endregion Search

    private onChangeCartView = (): void => {
        try {
            const {
                periodValue
            } = this.state;

            if (periodValue) {
                const parts: string[] = periodValue.split('/');
                const url: string = `${Constants.webUrl}/Registration/Courses/${parts[0]}/${parts[1]}`;
                window.location.assign(url);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCartView.name, e));
        }
    };

    private onCloseSectionModal = (): void => {
        try {
            this.setState({
                sectionDetail: undefined,
                sectionModalOpen: false,
                sectionSelected: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSectionModal.name, e));
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

    // #region Functions
    private getSectionStatus = (section: IStudentSchedule): ISectionStatus => {
        const {
            classes
        } = this.props;

        const {
            openStatusInfo,
            statusInfoAnchor,
            resources
        } = this.state;

        const sectionStatusInfo: ISectionStatusInfo = {
            classes: classes,
            openStatusInfo: openStatusInfo,
            statusInfoAnchor: statusInfoAnchor,
            onCloseStatusInfoPopper: this.onCloseStatusInfoPopper,
            onOpenStatusInfoPopper: this.onOpenStatusInfoPopper
        };

        return SectionHelper.getSectionStatus(section, resources?.studentCourseStatus, resources?.studentCourseMessages, sectionStatusInfo);
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingConEd: false,
            isLoadingPeriods: false,
            isLoadingTrad: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoaderConEd = (): void => {
        this.setState({
            isLoadingConEd: false
        });
    };

    private showLoaderConEd = (): void => {
        this.setState({
            isLoadingConEd: true
        });
    };

    private hideLoaderPeriods = (): void => {
        this.setState({
            isLoadingPeriods: false
        });
    };

    private showLoaderPeriods = (): void => {
        this.setState({
            isLoadingPeriods: true
        });
    };

    private hideLoaderTrad = (): void => {
        this.setState({
            isLoadingTrad: false
        });
    };

    private showLoaderTrad = (): void => {
        this.setState({
            isLoadingTrad: true
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

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetFullName = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetFullName.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    fullName: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetFullName.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    resources: result.data,
                    theme: ThemeHelper.withDefaultValues(LayoutStore.getTheme())
                }, this.hideLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetSchedulePeriods = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSchedulePeriods.name, this.hideAllLoaders);
            let periodValue: string | undefined;
            let periods: IDropDownOption[] | undefined;
            if (result?.status) {
                const {
                    impersonateInfo
                } = this.props;

                periods = result.data;
                if (periods) {
                    periodValue = periods[0].value as string;
                    this.showLoaderTrad();
                    Requests.postScheduleList(periodValue, this.resolvePostScheduleList, impersonateInfo);
                    this.setState({
                        periods: periods,
                        periodValue: periodValue
                    });
                }
                LayoutActions.hidePageLoader();
                this.hideLoaderPeriods();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSchedulePeriods.name, e));
        }
    };

    private resolveGetSection = (json: string): void => {
        try {
            const {
                myConEdSchedule,
                mySchedule
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);
            if (result?.status) {
                const section: ISectionDetail | undefined = result.data;

                // Status for section detail modal
                let sectionInSchedule: IStudentSchedule | undefined;
                if (section && mySchedule) {
                    mySchedule.forEach(session => {
                        if (session.sections) {
                            session.sections.forEach(sectionList => {
                                sectionList.forEach(sectionInList => {
                                    if (!Boolean(sectionInSchedule) && sectionInList.id === section.id) {
                                        sectionInSchedule = sectionInList;
                                    }
                                });
                            });
                        }
                    });
                }
                if (!Boolean(sectionInSchedule) && section && myConEdSchedule) {
                    myConEdSchedule.forEach(sectionList => {
                        sectionList.forEach(sectionInList => {
                            if (!Boolean(sectionInSchedule) && sectionInList.id === section.id) {
                                sectionInSchedule = sectionInList;
                            }
                        });
                    });
                }

                if (sectionInSchedule && section) {
                    section.advisorApprovalInfo = sectionInSchedule.advisorApprovalInfo;
                    section.permissionRequestInfo = sectionInSchedule.permissionRequestInfo;
                    section.statusPermisionRequest = sectionInSchedule.isApproved ? 0
                        : (sectionInSchedule.isDenied ? 1 : 2);
                }

                this.setState({
                    sectionDetail: section,
                    sectionModalOpen: true,
                    sectionSelected: sectionInSchedule
                });
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };

    private resolvePostConEdScheduleList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostConEdScheduleList.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    myConEdSchedule: result.data
                }, this.hideLoaderConEd);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostConEdScheduleList.name, e));
        }
    };

    private resolvePostEditPermissionRequest = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostEditPermissionRequest.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    lblSuccessSave
                } = this.props;

                const {
                    resources,
                    sectionSelected
                } = this.state;

                const idPermissionRequestInfo: number = result.data;

                const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
                if (studentSchedule
                    && studentSchedule.permissionRequestInfo
                    && studentSchedule.permissionRequestInfo.length > 0) {
                    const permissionRequestInfo: IPermissionRequestInfo | undefined
                        = studentSchedule.permissionRequestInfo.find(pri => pri.id === idPermissionRequestInfo);
                    if (permissionRequestInfo && result.data) {
                        permissionRequestInfo.editable = false;
                        permissionRequestInfo.studentCommentsBackup = '';
                        this.setState({
                            sectionSelected: studentSchedule
                        });
                    }
                }

                LayoutActions.hidePageLoader();

                if (resources) {
                    LayoutActions.setAlert({
                        message: lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostEditPermissionRequest.name, e));
        }
    };

    private resolvePostScheduleList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostScheduleList.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    const mySchedule: ISectionsSession[] | undefined = result.data.schedule;
                    const academicInformation: IAcademicInformation[] | undefined = result.data.academicInformation;
                    const registeredCredits: string | undefined = result.data.registeredCredits;
                    this.setState({
                        academicInformation: academicInformation,
                        mySchedule: mySchedule,
                        registeredCredits: registeredCredits
                    }, () => {
                        this.hideLoaderTrad();
                        LayoutActions.hidePageLoader();
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostScheduleList.name, e));
        }
    };
    // #endregion Resolvers

    // #region Life-cycle
    public componentDidMount(): void {
        try {
            const {
                impersonateInfo
            } = this.props;

            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            this.showLoaderPeriods();
            Requests.getSchedulePeriods(this.resolveGetSchedulePeriods, impersonateInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentDidCatch(error, info): void {
        this.setState({
            componentError: true
        }, () => {
            this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
            this.redirectError(500);
        });
    }
    // #endregion Life-cycle

    public render(): JSX.Element {
        const {
            academicInformation,
            componentError,
            conEd,
            inCart,
            inWaitlist,
            isLoading,
            isLoadingConEd,
            isLoadingPeriods,
            isLoadingTrad,
            myConEdSchedule,
            mySchedule,
            periods,
            periodValue,
            registeredCredits,
            resources,
            sectionModalOpen,
            sectionDetail,
            sectionSelected,
            showDenied,
            theme
        } = this.state;

        const {
            impersonateInfo,
            isStudentView
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (isLoading || isLoadingPeriods) {
            contentPage = (
                <ContainerLoader id="ldrAttendance" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (!isLoading && !isLoadingPeriods) {
                const sectionSelectedAsStudentSchedule: IStudentSchedule = sectionSelected as IStudentSchedule;

                // #region Section Details
                let sectionModal: JSX.Element | undefined;
                if (sectionModalOpen && sectionDetail) {
                    sectionModal = (
                        <SectionDetailModal
                            creditTypeDesc={sectionSelectedAsStudentSchedule ?
                                sectionSelectedAsStudentSchedule.creditTypeDescription
                                : undefined}
                            isStudentView={isStudentView}
                            open={sectionModalOpen}
                            PermissionRequestDetailProps={{
                                resourcesPermissionRequestStatus: resources.permissionRequestStatus,

                                onCancelEdit: this.onCancelEditPermissionRequest,
                                onChangeCommentsForEdit: this.onChangeCommentsForEdit,
                                onEdit: this.onEditPermissionRequest,
                                onEnableEdit: this.onEnableEditPermissionRequest
                            }}
                            resources={resources.sectionDetailModal}
                            section={sectionDetail}
                            sectionStatus={sectionSelectedAsStudentSchedule ?
                                this.getSectionStatus(sectionSelectedAsStudentSchedule)
                                : undefined}
                            onClose={this.onCloseSectionModal}
                        />
                    );
                }
                // #endregion Section Details

                if (periods && periods.length > 0) {

                    // #region Filter data
                    if (mySchedule && mySchedule.length > 0) {
                        mySchedule.forEach(session => {
                            if (session.sections) {
                                session.sections.forEach((sectionList, isl) => {
                                    sectionList.forEach(section => {
                                        if (isl === 0) {
                                            section.isHidden = !inWaitlist;
                                        }
                                        else if (isl === 1) {
                                            section.isHidden = !inCart;
                                        }
                                        else if (isl === 4) {
                                            section.isHidden = !showDenied;
                                        }
                                        else {
                                            section.isHidden = false;
                                        }
                                    });
                                });
                            }
                        });
                    }
                    if (myConEdSchedule && myConEdSchedule.length > 0) {
                        myConEdSchedule.forEach((sectionList, isl) => {
                            sectionList.forEach(section => {
                                if (isl === 0) {
                                    section.isHidden = !inWaitlist;
                                }
                                else if (isl === 1) {
                                    section.isHidden = !inCart;
                                }
                                else if (isl === 4) {
                                    section.isHidden = !showDenied;
                                }
                                else {
                                    section.isHidden = false;
                                }
                            });
                        });
                    }
                    // #endregion Filter data

                    contentPage = (
                        <>
                            <ScheduleDetail
                                academicInformation={academicInformation}
                                conEd={conEd}
                                impersonateInfo={impersonateInfo}
                                inCart={inCart}
                                inWaitlist={inWaitlist}
                                isLoadingConEd={isLoadingConEd}
                                isLoadingPeriods={isLoadingPeriods}
                                isLoadingTrad={isLoadingTrad}
                                isStudentView={isStudentView}
                                myConEdSchedule={myConEdSchedule}
                                mySchedule={mySchedule}
                                periods={periods}
                                periodValue={periodValue}
                                printResources={resources.printing}
                                registeredCredits={registeredCredits}
                                resources={resources.scheduleDetail}
                                showDenied={showDenied}
                                studyingCalendarColor={theme.studyingCalendarColor}
                                ScheduleItemProps={{
                                    getSectionStatus: this.getSectionStatus,
                                    onViewSectionDetails: this.onViewSectionDetails
                                }}
                                onButtonViewCart={this.onChangeCartView}
                                onCheckboxChange={this.onChangeCheckbox}
                                onDropdownChange={this.onDropdownChange}
                                onViewSectionDetailsByCalendar={this.onViewSectionDetailsByCalendar}
                            />
                            {sectionModal}
                        </>
                    );
                }
                else {
                    contentPage = (
                        <Card>
                            <CardContent>
                                <Illustration
                                    color="secondary"
                                    name="empty-calendar"
                                    text={resources.lblNoCourses}
                                />
                            </CardContent>
                        </Card>
                    );
                }
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}

const StudentScheduleWithSytles = withStyles(styles)(StudentSchedule);
// #endregion Component

// Export: Component
export default (StudentScheduleWithSytles);