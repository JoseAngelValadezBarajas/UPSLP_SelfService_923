/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: CourseManagementMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import Media from 'react-media';
import Moment from 'moment';

// Core components
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Sidebar, { ISidebarResProps } from '@hedtech/powercampus-design-system/react/core/Sidebar';
import StepProgress, { Step, StepContent, StepLabel } from '@hedtech/powercampus-design-system/react/core/StepProgress';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import DownloadModal from '../../Generic/DownloadModal';
import ActivitiesSetup from './ActivitiesSetup';
import ActivityGrades from './ActivityGrades';
import Alerts from './Alerts';
import Attendance from './Attendance';
import ClassList from './ClassList';
import DailyAttendance from './DailyAttendance';
import GradeMappings from './GradeMappings';
import ManageAssistants from './ManageAssistants';
import OverallGrades from './OverallGrades';
import PermissionsRequests from './PermissionsRequests';
import WaitList from './WaitList';

// Types
import { ClassListStatus } from '../../../Types/Enum/ClassListStatus';
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISidebarOption } from '@hedtech/powercampus-design-system/types/ISidebarOption';
import { DownloadView } from '../../../Types/Enum/DownloadView';
import { IYearTermSession } from '../../../Types/Generic/IYearTerm';
import {
    CourseManagementMainFilter,
    CourseManagementMainOptions,
    ICourseManagementMainPermissions
} from '../../../Types/Permissions/ICourseManagementMainPermissions';
import { IFacultyAssistant } from '../../../Types/FacultyAssistants/IFacultyAssistant';
import { ICourseManagementMainResources } from '../../../Types/Resources/Classes/ICourseManagementMainResources';
import { ISectionCourseManagement } from '../../../Types/Section/ISectionCourseManagement';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { hasSpecialChars, SpecialCharsRegExp } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/CourseManagementMain';
import RequestsSection from '../../../Requests/Generic/Section';
import RequestsAssistant from '../../../Requests/Classes/ManageAssistants';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Actions from '../../../Actions/CourseManagementActions';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
interface ICourseManagementMainRes extends ICourseManagementMainResources {
    sidebar: ISidebarResProps;
}

export interface ICourseManagementMainProps {
    cultures: ICultures;
    isFaculty?: boolean;
}

interface ICourseManagementMainState {
    componentError: boolean;
    departments?: IDropDownOption[];
    departmentSelected?: IDropDownOption;
    faculties?: IDropDownOption[];
    facultyAssistant?: IFacultyAssistant;
    facultySelected?: IDropDownOption;
    filters?: IDropDownOption[];
    filterSelected?: IDropDownOption;
    hasAssistantRole?: boolean;
    isLoading: boolean;
    isLoadingContent: boolean;
    isLoadingFilter: boolean;
    isLoadingPeriods: boolean;
    isLoadingSections: boolean;
    isSidebarReady: boolean;
    instructorIds?: number[];
    noPeriods?: boolean;
    optionsOpen: boolean;
    periodFixed?: IYearTermSession;
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    permissions?: ICourseManagementMainPermissions;
    resources?: ICourseManagementMainRes;
    sectionDetail?: ISectionDetail;
    sectionIdFixed?: number;
    sections?: IDropDownOption[];
    sectionSelected?: IDropDownOption;
    sidebarMenu: ISidebarOption[];
    sidebarOptionSelected: number;
    years?: IDropDownOption[];
    yearSelected?: IDropDownOption;

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier

    // #region Download Modal
    defaultName: string;
    downloadView: number;
    isDownloadModalOpen: boolean;
    isNewWordExcluded: boolean;
    isWordExcluded: boolean;
    nameSelected: string;
    typeSelected: number;
    // #endregion Download Modal
}

const styles = ((theme: Theme) => createStyles({
    avatar: {
        marginLeft: '0rem!important'
    },
    centered: {
        alignItems: 'center',
        display: 'flex'
    },
    courseContainer: {
        marginBottom: Tokens.spacing60
    },
    headerCourse: {
        [theme.breakpoints.up('md')]: {
            paddingTop: '0!important'
        }
    },
    instructorName: {
        wordBreak: 'normal'
    },
    instructorsContainer: {
        backgroundColor: Tokens.colorBrandNeutral200,
        marginBottom: Tokens.spacing50,
        marginLeft: Tokens.spacing40,
        marginRight: Tokens.spacing40,
        marginTop: Tokens.sizingXxSmall,
        paddingLeft: Tokens.spacing40,
        paddingRight: Tokens.spacing40,
        width: 'auto'
    },
    optionsStepProgress: {
        padding: 0
    }
}));

type PropsWithStyles = ICourseManagementMainProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class CourseManagementMain extends React.Component<PropsWithStyles, ICourseManagementMainState> {
    private idModule: string;
    private idPage: string;
    private classListStatus: ClassListStatus;

    public readonly state: Readonly<ICourseManagementMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'CourseManagementMain';
        this.classListStatus = ClassListStatus.Add;
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        Store.addDailyAttendanceListener(this.onDailyAttendance);
        // #endregion State Management Listeners
    }

    private getInitialState(): ICourseManagementMainState {
        let hasAssistantRole: boolean | undefined = false;
        let isLoading: boolean = true;
        let isSidebarReady: boolean = false;
        let optionsOpen: boolean = true;
        let periods: IDropDownOption[] | undefined;
        let periodSelected: IDropDownOption | undefined;
        let permissions: ICourseManagementMainPermissions | undefined;
        let resources: ICourseManagementMainRes | undefined;
        let sectionDetail: ISectionDetail | undefined;
        let sections: IDropDownOption[] | undefined;
        let sectionSelected: IDropDownOption | undefined;
        let sidebarMenu: ISidebarOption[] = [];
        if (this.state) {
            hasAssistantRole = this.state.hasAssistantRole;
            isLoading = this.state.isLoading;
            isSidebarReady = this.state.isSidebarReady;
            optionsOpen = this.state.optionsOpen;
            periods = this.state.periods;
            periodSelected = this.state.periodSelected;
            permissions = this.state.permissions;
            resources = this.state.resources;
            sectionDetail = this.state.sectionDetail;
            sections = this.state.sections;
            sectionSelected = this.state.sectionSelected;
            sidebarMenu = this.state.sidebarMenu;
        }
        return {
            componentError: false,
            hasAssistantRole: hasAssistantRole,
            isLoading: isLoading,
            isLoadingContent: false,
            isLoadingFilter: false,
            isLoadingPeriods: false,
            isLoadingSections: false,
            isSidebarReady: isSidebarReady,
            optionsOpen: optionsOpen,
            periods: periods,
            periodSelected: periodSelected,
            permissions: permissions,
            resources: resources,
            sectionDetail: sectionDetail,
            sections: sections,
            sectionSelected: sectionSelected,
            sidebarMenu: sidebarMenu,
            sidebarOptionSelected: -1,

            // #region Dossier
            dossierPersonId: 0,
            openDossierModal: false,
            // #endregion Dossier

            // #region Download Modal
            defaultName: this.idPage,
            downloadView: 0,
            isDownloadModalOpen: false,
            isNewWordExcluded: false,
            isWordExcluded: false,
            nameSelected: this.idPage,
            typeSelected: 0
            // #endregion Download Modal
        };
    }

    // #region Events

    // #region Download Modal
    private onChangeFileType = (optionSelected: IDropDownOption): void => {
        try {
            this.setState({
                typeSelected: Number(optionSelected.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFileType.name, e));
        }
    };

    private onChangeFileName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            if (hasSpecialChars(event.target.value)) {
                event.target.value = event.target.value.replace(SpecialCharsRegExp, '');
            }
            this.setState({
                nameSelected: event.target.value
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFileName.name, e));
        }
    };

    private onCloseDownloadModal = (): void => {
        try {
            this.setState({
                isDownloadModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDownloadModal.name, e));
        }
    };

    private onDownloadModal = (): void => {
        try {
            const {
                sidebarMenu,
                sidebarOptionSelected
            } = this.state;

            const nameIndex: number = sidebarMenu.findIndex(option => option.id === sidebarOptionSelected);
            let name: string | undefined;
            if (nameIndex > -1 && sidebarMenu[nameIndex].downloadText) {
                name = sidebarMenu[nameIndex].downloadText + '_' + Moment().format('YYYYMMDDHHmm');
            }

            let view: number = DownloadView.overallGrades;
            switch (sidebarOptionSelected) {
                case CourseManagementMainOptions.ClassList:
                    if (this.classListStatus == ClassListStatus.Add) {
                        view = DownloadView.classListAdd;
                    }
                    else if (this.classListStatus == ClassListStatus.Drop) {
                        view = DownloadView.classListDrop;
                    }
                    else if (this.classListStatus == ClassListStatus.Hold) {
                        view = DownloadView.classListHold;
                    }
                    else {
                        view = DownloadView.classList
                    }
                    break;
                case CourseManagementMainOptions.OverallGrades:
                    view = DownloadView.overallGrades;
                    break;
                case CourseManagementMainOptions.Alerts:
                    view = DownloadView.violations;
                    break;
                case CourseManagementMainOptions.Attendance:
                    view = DownloadView.attendance;
                    break;
            }

            this.setState({
                defaultName: name ? name : this.idPage,
                downloadView: view,
                isDownloadModalOpen: true,
                isNewWordExcluded: false,
                isWordExcluded: false,
                nameSelected: name ? name : this.idPage,
                typeSelected: 0
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDownloadModal.name, e));
        }

    };

    private onDownloadDailyAttendance = (defaultName: string, nameSelected: string): void => {
        try {
            this.setState({
                defaultName: defaultName,
                downloadView: DownloadView.attendanceDaily,
                isDownloadModalOpen: true,
                isNewWordExcluded: true,
                isWordExcluded: true,
                nameSelected: nameSelected,
                typeSelected: 0
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDownloadDailyAttendance.name, e));
        }
    };

    private onDownloadModalSpecific = (defaultName: string): void => {
        try {
            this.setState({
                defaultName: defaultName,
                downloadView: DownloadView.overallGradesStatistics,
                isDownloadModalOpen: true,
                isNewWordExcluded: false,
                isWordExcluded: false,
                nameSelected: defaultName,
                typeSelected: 0
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDownloadModalSpecific.name, e));
        }
    };
    // #endregion Download Modal

    // #region Dossier
    private onCloseDossierModal = (): void => {
        try {
            this.setState({
                dossierPersonId: 0,
                openDossierModal: false
            });
            LayoutStore.abort();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDossierModal.name, e));
        }
    };

    private onViewDossier = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const personId: number = Number(event.currentTarget.dataset.id);
            this.setState({
                dossierPersonId: personId,
                openDossierModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDossier.name, e));
        }
    };
    // #endregion Dossier

    private onChangeDepartment = (optionSelected: IDropDownOption): void => {
        try {
            const {
                periodFixed
            } = this.state;

            this.setState({
                departmentSelected: optionSelected,
                noPeriods: undefined,
                periods: undefined,
                periodSelected: undefined,
                sections: undefined,
                sectionSelected: undefined
            });

            if (optionSelected.value) {
                this.showLoaderPeriods();
                Requests.getPeriods({
                    departmentId: optionSelected.value,
                    period: periodFixed
                } as ISectionCourseManagement, this.resolveGetPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDepartment.name, e));
        }
    };

    private onChangeFaculty = (optionSelected: IDropDownOption): void => {
        try {
            const {
                periodFixed
            } = this.state;

            this.setState({
                facultySelected: optionSelected,
                noPeriods: undefined,
                periods: undefined,
                periodSelected: undefined,
                sections: undefined,
                sectionSelected: undefined
            });

            if (optionSelected.value) {
                this.showLoaderPeriods();
                Requests.getPeriods({
                    facultyId: Number(optionSelected.value),
                    period: periodFixed
                } as ISectionCourseManagement, this.resolveGetPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFaculty.name, e));
        }
    };

    private onChangeFirstLevelSidebar = (_event: any, value: number): void => {
        try {
            const {
                sectionDetail,
                sidebarOptionSelected
            } = this.state;

            if (sidebarOptionSelected !== value) {
                if (sectionDetail) {
                    LayoutStore.abort();
                }
                if (value === CourseManagementMainOptions.DailyAttendance) {
                    Actions.cleanDailyAttendance();
                }
                const initialState: ICourseManagementMainState = this.getInitialState();
                initialState.sidebarOptionSelected = value;
                this.setState(initialState);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFirstLevelSidebar.name, e));
        }
    };

    private onChangeFilter = (optionSelected: IDropDownOption): void => {
        try {
            const {
                filterSelected
            } = this.state;

            if (filterSelected && filterSelected.value !== optionSelected.value) {
                this.setState({
                    departmentSelected: undefined,
                    facultySelected: undefined,
                    filterSelected: optionSelected,
                    noPeriods: undefined,
                    periods: undefined,
                    periodSelected: undefined,
                    sections: undefined,
                    sectionSelected: undefined,
                    yearSelected: undefined
                });

                switch (optionSelected.value) {
                    case CourseManagementMainFilter.Faculty:
                        this.showLoaderFilter();
                        Requests.getFaculties(this.resolveGetFaculties);
                        break;
                    case CourseManagementMainFilter.Year:
                        this.showLoaderFilter();
                        Requests.getYears(this.resolveGetYears);
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFilter.name, e));
        }
    };

    private onChangeOptionsExpansion = (_event: object, expanded: boolean): void => {
        try {
            this.setState({
                optionsOpen: expanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeOptionsExpansion.name, e));
        }
    };

    private onChangePeriod = (optionSelected: IDropDownOption): void => {
        try {
            const {
                isFaculty
            } = this.props;
            const {
                departmentSelected,
                facultySelected,
                filterSelected,
                periods,
                yearSelected
            } = this.state;

            if (optionSelected && periods) {
                this.setState({
                    periodSelected: optionSelected
                }, this.showLoaderSections);
                if (optionSelected.value) {
                    // For Faculty and Faculty Assistant
                    if (isFaculty) {
                        Requests.getSections({
                            sessionPeriodId: Number(optionSelected.value)
                        } as ISectionCourseManagement, this.resolveGetSections);
                    }
                    // For Department Head
                    else if (filterSelected) {
                        Requests.getSections({
                            departmentId: filterSelected.value === CourseManagementMainFilter.Department && departmentSelected ?
                                Number(departmentSelected.value) : undefined,
                            facultyId: filterSelected.value === CourseManagementMainFilter.Faculty && facultySelected ?
                                Number(facultySelected.value) : undefined,
                            sessionPeriodId: Number(optionSelected.value),
                            year: filterSelected.value === CourseManagementMainFilter.Year && yearSelected ?
                                yearSelected.value : undefined
                        } as ISectionCourseManagement, this.resolveGetSections);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onChangeSection = (optionSelected: IDropDownOption): void => {
        try {
            const {
                sectionDetail,
                sections,
                sectionSelected
            } = this.state;
            const {
                isFaculty
            } = this.props;

            if (sections) {
                LayoutStore.abort();
                Actions.cleanDailyAttendance();
                this.setState({
                    isSidebarReady: false,
                    isLoadingSections: true,
                    optionsOpen: !Boolean(optionSelected.value),
                    sectionDetail: sectionSelected && sectionSelected.value === optionSelected.value ? sectionDetail : undefined,
                    sectionSelected: optionSelected,
                    sidebarOptionSelected: CourseManagementMainOptions.Dashboard
                }, () => {
                    this.showLoaderContent();
                    if (optionSelected.value) {
                        if (isFaculty) {
                            // Gets Grants for Faculty Assistant before displaying tabs
                            RequestsAssistant.getDetailFacultyAssistants(Number(optionSelected.value), this.resolveGetDetailFacultyAssistants);
                        }
                        else {
                            this.setSidebarReady();
                            this.hideLoaderSections();
                            // Gets Section detail
                            RequestsSection.getSection(Number(optionSelected.value),
                                false, this.resolveGetSection);
                        }
                    }
                    else {
                        this.setSidebarReady();
                        this.hideLoaderSections();
                        this.hideLoaderContent();
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSection.name, e));
        }
    };

    private onChangeYear = (optionSelected: IDropDownOption): void => {
        try {
            const {
                periodFixed
            } = this.state;

            this.setState({
                noPeriods: undefined,
                periods: undefined,
                periodSelected: undefined,
                sections: undefined,
                sectionSelected: undefined,
                yearSelected: optionSelected
            });

            if (optionSelected.value) {
                this.showLoaderPeriods();
                Requests.getPeriods({
                    period: periodFixed,
                    year: optionSelected.value
                } as ISectionCourseManagement, this.resolveGetPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeYear.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingContent: false,
            isLoadingFilter: false,
            isLoadingPeriods: false,
            isLoadingSections: false
        });
    };

    private hideLoaderContent = (): void => {
        this.setState({
            isLoadingContent: false
        });
    };

    private showLoaderContent = (): void => {
        this.setState({
            isLoadingContent: true
        });
    };

    private hideLoaderFilter = (): void => {
        this.setState({
            isLoadingFilter: false
        });
    };

    private showLoaderFilter = (): void => {
        this.setState({
            isLoadingFilter: true
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

    private hideLoaderSections = (): void => {
        this.setState({
            isLoadingSections: false
        });
    };

    private showLoaderSections = (): void => {
        this.setState({
            isLoadingSections: true
        });
    };
    // #endregion Loader Functions

    // #region Functions
    private setSidebarMenu = (permissions: ICourseManagementMainPermissions,
        facultyAssistant: IFacultyAssistant | undefined = undefined): ISidebarOption[] => {
        const {
            resources
        } = this.state;

        const {
            isFaculty
        } = this.props;

        let sidebarMenu: ISidebarOption[] = [];

        if (resources) {
            sidebarMenu.push({
                id: CourseManagementMainOptions.Dashboard,
                text: resources.courseManagementMainOptions.lblDashboard
            });

            // Enrollment
            if ((isFaculty && permissions.classesClassList
                && (!facultyAssistant || (facultyAssistant && facultyAssistant.canAccessClassList)))
                || (!isFaculty && permissions.departmentClassList)) {
                sidebarMenu.push({
                    downloadText: resources.courseManagementMainOptions.lblClassListDownload,
                    id: CourseManagementMainOptions.ClassList,
                    text: resources.courseManagementMainOptions.lblClassList
                });
            }
            if (isFaculty && !facultyAssistant && permissions.classesPermissionRequest) {
                sidebarMenu.push({
                    id: CourseManagementMainOptions.PermissionRequest,
                    text: resources.courseManagementMainOptions.lblPermissionRequest
                });
            }
            if ((isFaculty && permissions.classesWaitlist
                && (!facultyAssistant || (facultyAssistant && facultyAssistant.canAccessWaitlist)))
                || (!isFaculty && permissions.departmentWaitlist)) {
                sidebarMenu.push({
                    id: CourseManagementMainOptions.Waitlist,
                    text: resources.courseManagementMainOptions.lblWaitList
                });
            }

            // Setup
            if ((isFaculty && permissions.classesActivitiesSetup
                && (!facultyAssistant || (facultyAssistant && facultyAssistant.canSetupActivities)))
                || (!isFaculty && permissions.departmentActivitiesSetup)) {
                sidebarMenu.push({
                    id: CourseManagementMainOptions.ActivitiesSetup,
                    text: resources.courseManagementMainOptions.lblActivitiesSetup
                });
            }
            if ((isFaculty && permissions.classesGradeMappings
                && (!facultyAssistant || (facultyAssistant && facultyAssistant.canSetupGradeMappings)))
                || (!isFaculty && permissions.departmentGradeMappings)) {
                sidebarMenu.push({
                    id: CourseManagementMainOptions.GradeMappings,
                    text: resources.courseManagementMainOptions.lblGradeMappings
                });
            }

            // Grading
            if ((isFaculty && permissions.classesActivityGrades
                && (!facultyAssistant || (facultyAssistant && facultyAssistant.canAccessActivityGrades)))
                || (!isFaculty && permissions.departmentActivityGrades)) {
                sidebarMenu.push({
                    downloadText: resources.courseManagementMainOptions.lblActivityGradesDownload,
                    id: CourseManagementMainOptions.ActivityGrades,
                    text: resources.courseManagementMainOptions.lblActivityGrades
                });
            }
            if ((isFaculty && permissions.classesAlerts
                && (!facultyAssistant || (facultyAssistant && facultyAssistant.canAccessViolations)))
                || (!isFaculty && permissions.departmentAlerts)) {
                sidebarMenu.push({
                    downloadText: resources.courseManagementMainOptions.lblAlertsDownload,
                    id: CourseManagementMainOptions.Alerts,
                    text: resources.courseManagementMainOptions.lblAlerts
                });
            }
            if ((isFaculty && permissions.classesAttendance
                && (!facultyAssistant || (facultyAssistant && facultyAssistant.canAccessAttendance)))
                || (!isFaculty && permissions.departmentAttendance)) {
                sidebarMenu.push({
                    downloadText: resources.courseManagementMainOptions.lblAttendanceDownload,
                    id: CourseManagementMainOptions.Attendance,
                    text: resources.courseManagementMainOptions.lblAttendance
                });
            }
            if ((isFaculty && permissions.classesDailyAttendance
                && (!facultyAssistant || (facultyAssistant && facultyAssistant.canTakeDailyAttendance)))
                || (!isFaculty && permissions.departmentDailyAttendance)) {
                sidebarMenu.push({
                    id: CourseManagementMainOptions.DailyAttendance,
                    text: resources.courseManagementMainOptions.lblDailyAttendance
                });
            }
            if ((isFaculty && permissions.classesOverallGrades
                && (!facultyAssistant || (facultyAssistant && facultyAssistant.canAccessOverallGrades)))
                || (!isFaculty && permissions.departmentOverallGrades)) {
                sidebarMenu.push({
                    downloadText: resources.courseManagementMainOptions.lblOverallGradesDownload,
                    id: CourseManagementMainOptions.OverallGrades,
                    text: resources.courseManagementMainOptions.lblOverallGrades
                    // send claim to link of overallGrades
                });
            }

            // Manage Assitants
            if (isFaculty && !facultyAssistant && permissions.classesManageAssistants) {
                sidebarMenu.push({
                    id: CourseManagementMainOptions.ManageAssistants,
                    text: resources.courseManagementMainOptions.lblManageAssistants
                });
            }

            if (sidebarMenu && sidebarMenu.length > 1) {
                sidebarMenu = sidebarMenu.sort((optionA, optionB) => optionA.id - optionB.id);
            }
        }
        return sidebarMenu;
    };

    private setSidebarReady = (): void => {
        this.setState({
            isSidebarReady: true
        });
    };

    private setClassListStatus = (newStatus: ClassListStatus): void => {
        try {
            this.classListStatus = newStatus;
        }
        catch (e) {
            this.logError(LogData.fromException(this.setClassListStatus.name, e));
        }

    };
    // #endregion Functions

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
    private resolveGetDepartments = (json: string): void => {
        try {
            const {
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDepartments.name, this.hideAllLoaders);

            if (result?.status) {
                const departments: IDropDownOption[] = result.data;
                if (departments && departments.length > 0 && resources) {
                    const filters: IDropDownOption[] = [];
                    filters.push({
                        description: resources.lblDepartment,
                        value: CourseManagementMainFilter.Department
                    });
                    filters.push({
                        description: resources.lblInstructor,
                        value: CourseManagementMainFilter.Faculty
                    });
                    filters.push({
                        description: resources.lblYear,
                        value: CourseManagementMainFilter.Year
                    });
                    this.setState({
                        departments: result.data,
                        filters: filters,
                        filterSelected: filters[0],
                        isLoading: false
                    }, () => {
                        this.hideLoaderFilter();
                        LayoutActions.setLoading(false);
                    });
                }
                else {
                    this.setState({
                        isLoading: false
                    }, () => {
                        this.hideLoaderFilter();
                        LayoutActions.setLoading(false);
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDepartments.name, e));
        }
    };

    private resolveGetFaculties = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetFaculties.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    faculties: result.data
                }, this.hideLoaderFilter);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetFaculties.name, e));
        }
    };

    private resolveGetPeriods = (json: string): void => {
        try {
            const {
                isFaculty
            } = this.props;
            const {
                departmentSelected,
                facultySelected,
                filterSelected,
                sectionIdFixed,
                yearSelected
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data
                    && result.data.periods
                    && result.data.periods.length > 0
                    && result.data.defaultPeriod) {
                    const defaultPeriod: IDropDownOption = result.data.defaultPeriod;
                    this.setState({
                        noPeriods: false,
                        periodFixed: undefined,
                        periods: result.data.periods,
                        periodSelected: defaultPeriod,
                        sections: undefined,
                        sectionSelected: undefined
                    }, this.hideLoaderPeriods);
                    // For Faculty and Faculty Assistant
                    if (isFaculty) {
                        this.showLoaderSections();
                        Requests.getSections({
                            sectionId: sectionIdFixed,
                            sessionPeriodId: Number(defaultPeriod.value)
                        } as ISectionCourseManagement, this.resolveGetSections);
                    }
                    // For Deparment Head
                    else if (filterSelected) {
                        this.showLoaderSections();
                        Requests.getSections({
                            departmentId: filterSelected.value === CourseManagementMainFilter.Department
                                && departmentSelected ? Number(departmentSelected.value) : undefined,
                            facultyId: filterSelected.value === CourseManagementMainFilter.Faculty
                                && facultySelected ? Number(facultySelected.value) : undefined,
                            sectionId: sectionIdFixed,
                            sessionPeriodId: Number(defaultPeriod.value),
                            year: filterSelected.value === CourseManagementMainFilter.Year && yearSelected ?
                                yearSelected.value : undefined
                        } as ISectionCourseManagement, this.resolveGetSections);
                    }
                    LayoutActions.setLoading(false);
                }
                else {
                    this.setState({
                        isLoading: false,
                        noPeriods: true,
                        periodFixed: undefined,
                        sectionIdFixed: undefined
                    }, () => {
                        this.hideLoaderPeriods();
                        LayoutActions.setLoading(false);
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolveGetSections = (json: string): void => { // when is this called
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSections.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    isLoading: false,
                    optionsOpen: !Boolean(result.data.defaultSection),
                    sectionIdFixed: undefined,
                    sections: result.data.sections,
                    sectionSelected: result.data.defaultSection
                }, () => {
                    if (result.data.defaultSection) {
                        const sectionId: number = Number(result.data.defaultSection.value);
                        RequestsAssistant.getDetailFacultyAssistants(sectionId, this.resolveGetDetailFacultyAssistants);
                        RequestsSection.getSectionInstructors(sectionId,
                            this.resolveGetSectionInstructors);
                    }
                    this.hideLoaderSections();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSections.name, e));
        }
    };

    private resolveGetSection = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    sectionDetail: result.data
                }, this.hideLoaderContent);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };

    private resolveGetYears = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetYears.name, this.hideAllLoaders);

            if (result?.status) {
                const years: IDropDownOption[] = [];
                if (result.data) {
                    result.data.forEach(year => years.push({
                        description: year,
                        value: year
                    }));
                }
                this.setState({
                    years: years
                }, this.hideLoaderFilter);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetYears.name, e));
        }
    };

    private resolveGetSectionInstructors = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSectionInstructors.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    instructorIds: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSectionInstructors.name, e));
        }
    };

    private resolveGetAssistantDefaultRole = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAssistantDefaultRole.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    hasAssistantRole: result.data
                }, () => {
                    Requests.getPeriods({
                        period: this.state.periodFixed
                    } as ISectionCourseManagement, this.resolveGetPeriods);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAssistantDefaultRole.name, e));
        }
    };

    private resolveGetDetailFacultyAssistants = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDetailFacultyAssistants.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    permissions,
                    sectionSelected
                } = this.state;

                const facultyAssistant: IFacultyAssistant = result.data;
                if (permissions) {
                    this.setState({
                        facultyAssistant: facultyAssistant,
                        sidebarMenu: this.setSidebarMenu(permissions, facultyAssistant)
                    }, () => {
                        this.setSidebarReady();
                        this.hideLoaderSections();
                        if (sectionSelected) {
                            // Gets Section detail
                            RequestsSection.getSection(Number(sectionSelected.value),
                                false, this.resolveGetSection);
                            if (!facultyAssistant) {
                                // Gets Section FacultyIds for Manage Assistants tab
                                RequestsSection.getSectionInstructors(Number(sectionSelected.value),
                                    this.resolveGetSectionInstructors);
                            }
                        }
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDetailFacultyAssistants.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                });
                if (result.data) {
                    RequestsLayout.getPermissions(this.idModule, this.idPage,
                        this.resolveGetPermissions,
                        this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetPermissions = (json: string): void => {
        try {
            const {
                isFaculty
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPermissions.name, this.hideAllLoaders);

            if (result?.status) {
                const permissions: ICourseManagementMainPermissions | undefined = result.data;
                let sidebarMenu: ISidebarOption[] = [];
                if (permissions) {
                    sidebarMenu = this.setSidebarMenu(permissions);
                }

                let option: number | undefined;
                let sectionId: number | undefined;
                let period: IYearTermSession | undefined;

                if (isFaculty) {
                    const hdnOption: HTMLInputElement | undefined =
                        document.getElementById('hdnOption') as HTMLInputElement;
                    const hdnYear: HTMLInputElement | undefined =
                        document.getElementById('hdnYear') as HTMLInputElement;
                    const hdnTerm: HTMLInputElement | undefined =
                        document.getElementById('hdnTerm') as HTMLInputElement;
                    const hdnSession: HTMLInputElement | undefined =
                        document.getElementById('hdnSession') as HTMLInputElement;
                    const hdnSectionId: HTMLInputElement | undefined =
                        document.getElementById('hdnSectionId') as HTMLInputElement;
                    if (hdnOption && hdnOption.value && sidebarMenu && sidebarMenu.find(sm => sm.id === Number(hdnOption.value))) {
                        option = Number(hdnOption.value);
                        if (hdnYear && hdnYear.value && hdnTerm && hdnTerm.value) {
                            period = {
                                session: hdnSession && hdnSession.value ? hdnSession.value : '',
                                term: hdnTerm.value,
                                year: Number(hdnYear.value)
                            } as IYearTermSession;
                            if (hdnSectionId && hdnSectionId.value) {
                                sectionId = Number(hdnSectionId.value);
                            }
                        }
                    }
                }

                const sidebarOptionSelected: number = sidebarMenu.length > 0 ? (option ? option : sidebarMenu[0].id) : -1;

                this.setState({
                    noPeriods: undefined,
                    periodFixed: period,
                    permissions: permissions,
                    sectionIdFixed: sectionId,
                    sidebarMenu: sidebarMenu,
                    sidebarOptionSelected: sidebarOptionSelected
                }, () => {
                    if (isFaculty) {
                        this.showLoaderPeriods();
                        if (permissions && permissions.classesManageAssistants) {
                            RequestsAssistant.getAssistantDefaultRole(this.resolveGetAssistantDefaultRole);
                        }
                        else {
                            Requests.getPeriods({
                                period: period
                            } as ISectionCourseManagement, this.resolveGetPeriods);
                        }
                    }
                    else {
                        this.showLoaderFilter();
                        Requests.getDepartments(this.resolveGetDepartments);
                    }
                });
                if (sectionId) {
                    this.showLoaderContent();
                    this.setSidebarReady();
                    RequestsSection.getSection(sectionId, false, this.resolveGetSection);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPermissions.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onDailyAttendance = (): void => {
        this.setState({
            sidebarOptionSelected: CourseManagementMainOptions.DailyAttendance
        });
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentWillUnmount(): void {
        Store.removeDailyAttendanceListener(this.onDailyAttendance);
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
            classes,
            cultures,
            isFaculty
        } = this.props;

        const {
            componentError,
            departments,
            departmentSelected,
            faculties,
            facultyAssistant,
            facultySelected,
            filters,
            filterSelected,
            hasAssistantRole,
            instructorIds,
            isLoading,
            isLoadingContent,
            isLoadingFilter,
            isLoadingPeriods,
            isLoadingSections,
            isSidebarReady,
            noPeriods,
            optionsOpen,
            periods,
            periodSelected,
            permissions,
            resources,
            sectionDetail,
            sections,
            sectionSelected,
            sidebarMenu,
            sidebarOptionSelected,
            years,
            yearSelected,

            // #region Dossier
            dossierPersonId,
            openDossierModal,
            // #endregion Dossier

            // #region Download Modal
            defaultName,
            downloadView,
            isDownloadModalOpen,
            isNewWordExcluded,
            isWordExcluded,
            nameSelected,
            typeSelected
            // #endregion Download Modal
        } = this.state;

        const resourcesLayout = LayoutStore.getResourcesLayout();
        const emptyOption: IDropDownOption = {
            description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
            value: ''
        };

        let contentPage: JSX.Element | undefined;
        if (!componentError && permissions && resources) {
            if (!isLoading) {
                let filterOptions: JSX.Element | undefined;
                if (filters && filterSelected) {
                    filterOptions = (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    id="ddlFilter"
                                    label={resources.lblFilter}
                                    options={filters}
                                    value={filterSelected ? filterSelected.value : undefined}
                                    onChange={this.onChangeFilter}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {filterSelected.value === CourseManagementMainFilter.Department ? (
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        id="ddlDepartment"
                                        label={resources.lblDepartment}
                                        loading={isLoadingFilter}
                                        options={departments}
                                        value={departmentSelected ? departmentSelected.value : undefined}
                                        onChange={this.onChangeDepartment}
                                    />
                                ) : undefined}
                                {filterSelected.value === CourseManagementMainFilter.Faculty ? (
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        id="ddlInstructor"
                                        label={resources.lblInstructor}
                                        loading={isLoadingFilter}
                                        options={faculties}
                                        value={facultySelected ? facultySelected.value : undefined}
                                        onChange={this.onChangeFaculty}
                                    />
                                ) : undefined}
                                {filterSelected.value === CourseManagementMainFilter.Year ? (
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        id="ddlYear"
                                        label={resources.lblYear}
                                        loading={isLoadingFilter}
                                        options={years}
                                        value={yearSelected ? yearSelected.value : undefined}
                                        onChange={this.onChangeYear}
                                    />
                                ) : undefined}
                            </Grid>
                        </Grid>
                    );
                }

                let contentOptions: JSX.Element | undefined;
                if (periods && periods.length > 0) {
                    contentOptions = (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    id="ddlPeriod"
                                    label={resources.lblPeriod}
                                    loading={isLoadingPeriods}
                                    options={periods}
                                    value={periodSelected ? periodSelected.value : undefined}
                                    onChange={this.onChangePeriod}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    id="ddlCourse"
                                    label={resources.lblCourse}
                                    loading={isLoadingPeriods || isLoadingSections}
                                    options={sections}
                                    value={sectionSelected ? sectionSelected.value : undefined}
                                    onChange={this.onChangeSection}
                                />
                            </Grid>
                        </Grid>
                    );
                }
                else if (!isFaculty && noPeriods === undefined) {
                    contentOptions = (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    id="ddlPeriod"
                                    label={resources.lblPeriod}
                                    loading={isLoadingPeriods}
                                    options={undefined}
                                    value={undefined}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    id="ddlCourse"
                                    label={resources.lblCourse}
                                    loading={isLoadingPeriods || isLoadingSections}
                                    options={undefined}
                                    value={undefined}
                                />
                            </Grid>
                        </Grid>
                    );
                }

                let optionsSection: JSX.Element | undefined;
                let componentSidebar: JSX.Element | undefined;
                let contentSidebar: JSX.Element | undefined;
                let emptyContent: JSX.Element | undefined;
                let withDossier: boolean | undefined = false;

                if (periodSelected && periodSelected.value
                    && sectionSelected && sectionSelected.value
                    && isSidebarReady) {
                    if (sidebarOptionSelected !== -1) {
                        let textHeaderSidebar: string = '';
                        switch (sidebarOptionSelected) {
                            case CourseManagementMainOptions.Dashboard:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblDashboard;
                                break;
                            case CourseManagementMainOptions.ClassList:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblClassList;
                                break;
                            case CourseManagementMainOptions.Waitlist:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblWaitList;
                                break;
                            case CourseManagementMainOptions.PermissionRequest:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblPermissionRequest;
                                break;
                            case CourseManagementMainOptions.ActivitiesSetup:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblActivitiesSetup;
                                break;
                            case CourseManagementMainOptions.GradeMappings:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblGradeMappings;
                                break;
                            case CourseManagementMainOptions.ActivityGrades:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblActivityGrades;
                                break;
                            case CourseManagementMainOptions.Alerts:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblAlerts;
                                break;
                            case CourseManagementMainOptions.Attendance:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblAttendance;
                                break;
                            case CourseManagementMainOptions.DailyAttendance:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblDailyAttendance;
                                break;
                            case CourseManagementMainOptions.OverallGrades:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblOverallGrades;
                                break;
                            case CourseManagementMainOptions.ManageAssistants:
                                textHeaderSidebar = resources.courseManagementMainOptions.lblManageAssistants;
                                break;
                        }

                        if (isLoadingContent) {
                            contentSidebar = (
                                <ContainerLoader id="ldrCourseManagementContent" height="md" />
                            );
                        }
                        else if (sectionDetail) {
                            const periodId: number = Number(periodSelected.value);
                            const sectionId: number = Number(sectionSelected.value);

                            // #region Sidebar content
                            switch (sidebarOptionSelected) {
                                case CourseManagementMainOptions.Dashboard:

                                    // #region Instructor(s)
                                    let instructors: JSX.Element | JSX.Element[] | undefined;
                                    if (sectionDetail.instructors && sectionDetail.instructors.length > 0) {
                                        instructors = sectionDetail.instructors.map((instructor, i) => (
                                            <Grid item className={classes.centered} key={`instructor_${i}`}>
                                                <div>
                                                    <Avatar
                                                        id={`avatar_firstLetter_${i}`}
                                                        backgroundNumber={instructor.colorFirstLetter}
                                                        classes={{ root: classes.avatar }}
                                                    >
                                                        {instructor.firstLetter}
                                                    </Avatar>
                                                </div>
                                                <div>
                                                    <Text
                                                        className={classes.instructorName}
                                                        id={`instructor_${i}`}
                                                    >
                                                        {instructor.fullName}
                                                    </Text>
                                                </div>
                                            </Grid>
                                        ));
                                    }
                                    else {
                                        instructors = (
                                            <Grid item xs className={classes.centered}>
                                                <div>
                                                    <Avatar
                                                        id="avatar_noInstructor"
                                                        background="default"
                                                        classes={{ root: classes.avatar }}
                                                    />
                                                </div>
                                                <div>
                                                    <Text className={classes.instructorName}>
                                                        {resources.lblNoInstructor}
                                                    </Text>
                                                </div>
                                            </Grid>
                                        );
                                    }
                                    // #endregion Instructor(s)

                                    contentSidebar = (
                                        <>
                                            <Grid container>
                                                <Grid item xs>
                                                    <Text>
                                                        {Format.toString(resources.formatSessionSectionSubtype,
                                                            [sectionDetail.eventSubType, sectionDetail.section])}
                                                    </Text>
                                                    <Text>
                                                        {Format.toString(resources.formatTypeDuration,
                                                            [sectionDetail.eventType, sectionDetail.startDate, sectionDetail.endDate])}
                                                    </Text>
                                                    <Text>
                                                        {Format.toString(resources.formatCreditTypesCredits,
                                                            [sectionDetail.defaultCreditTypeDesc, sectionDetail.credits])}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                            <DailyAttendance
                                                cultures={cultures}
                                                includeLocation={true}
                                                includeNotes={(isFaculty && permissions.classesDashboardNotes
                                                    && (!facultyAssistant || (facultyAssistant && facultyAssistant.canAccessDashboardNotes)))
                                                    || (!isFaculty && permissions.departmentDashboardNotes)}
                                                includeStudents={false}
                                                includeTakeAttendance={(isFaculty && permissions.classesDailyAttendance
                                                    && (!facultyAssistant || (facultyAssistant && facultyAssistant.canTakeDailyAttendance)))
                                                    || (!isFaculty && permissions.departmentDailyAttendance)}
                                                inDashboard
                                                key={`dailyAttendance_${periodId}_${sectionId}`}
                                                myPosition={CourseManagementMainOptions.DailyAttendance}
                                                sectionId={sectionId}
                                            />
                                            <Grid container>
                                                <Grid item>
                                                    <Text size="h4">
                                                        {resources.lblInstructors}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                            <div className={classes.instructorsContainer}>
                                                <Grid container spacing={2}>
                                                    {instructors}
                                                </Grid>
                                            </div>
                                            {sectionDetail.description ? (
                                                <div className={classes.courseContainer}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12}>
                                                            <Text size="h4">
                                                                {resources.lblCourseDescription}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Text>
                                                                {sectionDetail.description}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            ) : undefined}
                                        </>
                                    );
                                    break;
                                case CourseManagementMainOptions.ClassList:
                                    withDossier = (isFaculty && permissions.classesClassListDossier
                                        || !isFaculty && permissions.departmentClassListDossier);
                                    contentSidebar = (
                                        <ClassList
                                            key={`classList_${periodId}_${sectionId}`}
                                            myPosition={CourseManagementMainOptions.ClassList}
                                            sectionId={sectionId}
                                            setClassListStatus={this.setClassListStatus}
                                            onDownloadModal={this.onDownloadModal}
                                            onViewDossier={withDossier ? this.onViewDossier : undefined}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.Waitlist:
                                    contentSidebar = (
                                        <WaitList
                                            key={`waitlist_${periodId}_${sectionId}`}
                                            myPosition={CourseManagementMainOptions.Waitlist}
                                            sectionId={sectionId}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.PermissionRequest:
                                    contentSidebar = (
                                        <PermissionsRequests
                                            hasDossierClaim={permissions.classesPermissionRequestDossier}
                                            key={`permissionRequests_${periodId}_${sectionId}`}
                                            myPosition={CourseManagementMainOptions.PermissionRequest}
                                            sectionId={sectionId}
                                            onViewDossier={permissions.classesPermissionRequestDossier ? this.onViewDossier : undefined}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.ActivitiesSetup:
                                    contentSidebar = (
                                        <ActivitiesSetup
                                            key={`activitiesSetup_${periodId}_${sectionId}`}
                                            cultures={cultures}
                                            myPosition={CourseManagementMainOptions.ActivitiesSetup}
                                            sectionId={sectionId}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.GradeMappings:
                                    contentSidebar = (
                                        <GradeMappings
                                            key={`gradeMappings_${periodId}_${sectionId}`}
                                            myPosition={CourseManagementMainOptions.GradeMappings}
                                            sectionId={sectionId}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.ActivityGrades:
                                    contentSidebar = (
                                        <ActivityGrades
                                            key={`activityGrades_${periodId}_${sectionId}`}
                                            cultures={cultures}
                                            myPosition={CourseManagementMainOptions.ActivityGrades}
                                            sectionId={sectionId}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.Alerts:
                                    contentSidebar = (
                                        <Alerts
                                            key={`alerts_${periodId}_${sectionId}`}
                                            cultures={cultures}
                                            myPosition={CourseManagementMainOptions.Alerts}
                                            sectionId={sectionId}
                                            onDownloadModal={this.onDownloadModal}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.Attendance:
                                    contentSidebar = (
                                        <Attendance
                                            key={`attendance_${periodId}_${sectionId}`}
                                            cultures={cultures}
                                            myPosition={CourseManagementMainOptions.Attendance}
                                            sectionId={sectionId}
                                            onDownloadModal={this.onDownloadModal}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.DailyAttendance:
                                    contentSidebar = (
                                        <DailyAttendance
                                            cultures={cultures}
                                            includeLocation={false}
                                            includeNotes={false}
                                            includeStudents={true}
                                            includeTakeAttendance={false}
                                            key={`dailyAttendance_${periodId}_${sectionId}`}
                                            myPosition={CourseManagementMainOptions.DailyAttendance}
                                            sectionId={sectionId}
                                            onDownloadDailyAttendance={this.onDownloadDailyAttendance}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.OverallGrades:
                                    contentSidebar = (
                                        <OverallGrades
                                            hasSubmit={!facultyAssistant || (facultyAssistant && facultyAssistant.canSubmitOverallGrades)}
                                            isAssistant={Boolean(facultyAssistant)}
                                            isCourseManagement
                                            key={`overallGrades_${periodId}_${sectionId}`}
                                            myPosition={CourseManagementMainOptions.OverallGrades}
                                            periodDescription={sectionDetail.eventId}
                                            sectionDescription={sectionDetail.eventName}
                                            sectionId={sectionId}
                                            onDownloadModal={this.onDownloadModal}
                                            onDownloadStatisticsModal={this.onDownloadModalSpecific}
                                        />
                                    );
                                    break;
                                case CourseManagementMainOptions.ManageAssistants:
                                    withDossier = permissions.classesManageAssistantsDossier;
                                    contentSidebar = (
                                        <ManageAssistants
                                            hasActivitiesClaim={permissions.classesManageAssistantsGrantActivities}
                                            hasActivityGradesClaim={permissions.classesManageAssistantsGrantActivityGrades}
                                            hasAlertsClaim={permissions.classesManageAssistantsGrantAlerts}
                                            hasAssistantRole={hasAssistantRole}
                                            hasClassListClaim={permissions.classesManageAssistantsGrantClassList}
                                            hasDailyAttendanceClaim={permissions.classesManageAssistantsGrantDailyAttendance}
                                            hasDashboardNotesClaim={permissions.classesManageAssistantsGrantDashboardNotes}
                                            hasGradeMappingsClaim={permissions.classesManageAssistantsGrantGradeMappings}
                                            hasOverallAttendanceClaim={permissions.classesManageAssistantsGrantOverallAttendance}
                                            hasOverallGradesClaim={permissions.classesManageAssistantsGrantOverallGrades}
                                            hasOverallGradesSubmissionClaim={permissions.classesManageAssistantsGrantOverallGradesSubmission}
                                            hasWaitListClaim={permissions.classesManageAssistantsGrantWaitList}
                                            instructorIds={instructorIds}
                                            key={`overallGrades_${periodId}_${sectionId}`}
                                            myPosition={CourseManagementMainOptions.ManageAssistants}
                                            sectionId={sectionId}
                                            onViewDossier={withDossier ? this.onViewDossier : undefined}
                                        />
                                    );
                                    break;
                            }
                            // #endregion Sidebar content
                        }

                        componentSidebar = (
                            <Sidebar
                                aria-label={resources.lblCourseSidebar}
                                header={(
                                    <Text size="h2">
                                        {textHeaderSidebar}
                                    </Text>
                                )}
                                contentAfter={(
                                    <>
                                        {contentSidebar}
                                    </>
                                )}
                                contentBefore={(
                                    <>
                                        {sectionDetail ? (
                                            <Grid container spacing={3}>
                                                <Grid item xs className={classes.headerCourse}>
                                                    <Text id="txtCourseName" size="h2">
                                                        {Format.toString(resources.formatTitleSection,
                                                            [sectionDetail.eventId, sectionDetail.eventName])}
                                                    </Text>
                                                    <Hidden smDown>
                                                        <Divider noMarginBottom />
                                                    </Hidden>
                                                </Grid>
                                            </Grid>
                                        ) : undefined}
                                    </>
                                )}
                                id="CourseManagementSidebar"
                                options={sidebarMenu}
                                resources={resources.sidebar}
                                valueSelected={sidebarOptionSelected}
                                onClickFirstLevel={this.onChangeFirstLevelSidebar}
                            />
                        );
                    }
                }
                else if (isLoadingContent) {
                    emptyContent = (
                        <ContainerLoader id="ldrEmptyContent" height="md" />
                    );
                }
                else {
                    emptyContent = (
                        <Card>
                            <CardContent>
                                <Illustration
                                    color="secondary"
                                    name="no-search-results"
                                    text={isFaculty ? resources.lblNoCourse : resources.lblNoFilterNoCourse}
                                />
                            </CardContent>
                        </Card>
                    );
                }

                if (isFaculty) {
                    if (contentOptions) {
                        optionsSection = (
                            <Media query={Tokens.mqSmallDown}>
                                {(matches: boolean): JSX.Element => matches ? (
                                    <ExpansionPanel
                                        defaultExpanded
                                        expanded={optionsOpen}
                                        header={(
                                            <Text size="h3">
                                                {resources.lblOptions}
                                            </Text>
                                        )}
                                        onChange={this.onChangeOptionsExpansion}
                                    >
                                        {contentOptions}
                                    </ExpansionPanel>
                                ) : (
                                    <Card>
                                        <CardContent>
                                            {contentOptions}
                                        </CardContent>
                                    </Card>
                                )
                                }
                            </Media>
                        );
                    }
                    else {
                        optionsSection = (
                            <Card>
                                <CardContent>
                                    <Illustration
                                        color="secondary"
                                        height="lg"
                                        name="under-maintenance"
                                        text={resources.lblNoOptions}
                                    />
                                </CardContent>
                            </Card>
                        );
                        emptyContent = undefined;
                    }
                }
                else {
                    if (filterOptions) {
                        optionsSection = (
                            <ExpansionPanel
                                defaultExpanded
                                expanded={optionsOpen}
                                header={(
                                    <Text size="h3">
                                        {resources.lblOptions}
                                    </Text>
                                )}
                                onChange={this.onChangeOptionsExpansion}
                            >
                                <StepProgress
                                    classes={{ root: classes.optionsStepProgress }}
                                    nonLinear
                                    orientation="vertical"
                                >
                                    <Step active>
                                        <StepLabel>
                                            {resources.lblSelectFilter}
                                        </StepLabel>
                                        <StepContent>
                                            {filterOptions}
                                        </StepContent>
                                    </Step>
                                    <Step active>
                                        <StepLabel>
                                            {resources.lblSelectCourse}
                                        </StepLabel>
                                        <StepContent>
                                            {contentOptions ? (
                                                <>
                                                    {contentOptions}
                                                </>
                                            ) : (
                                                <MessageStyled
                                                    classMessage="noResults"
                                                    message={resources.lblNoOptions}
                                                />
                                            )}
                                        </StepContent>
                                    </Step>
                                </StepProgress>
                            </ExpansionPanel>
                        );
                    }
                    else {
                        optionsSection = (
                            <Card>
                                <CardContent>
                                    <Illustration
                                        color="secondary"
                                        name="no-search-results"
                                        text={resources.lblNoDepartments}
                                    />
                                </CardContent>
                            </Card >
                        );
                        emptyContent = undefined;
                    }
                }

                contentPage = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {optionsSection}
                            </Grid>
                            <Grid item xs={12}>
                                {componentSidebar}
                                {emptyContent}
                            </Grid>
                        </Grid>
                        <Dossier
                            key={`Dossier_${dossierPersonId}`}
                            dossierType={DossierType.Student}
                            open={openDossierModal}
                            personId={dossierPersonId}
                            onClose={this.onCloseDossierModal}
                        />
                        <DownloadModal
                            defaultFileName={defaultName}
                            isNewWordExcluded={isNewWordExcluded}
                            isWordExcluded={isWordExcluded}
                            isModalOpen={isDownloadModalOpen}
                            nameSelected={nameSelected}
                            sectionId={sectionSelected ? Number(sectionSelected.value) : 0}
                            typeSelected={typeSelected}
                            view={downloadView}
                            onChangeFileName={this.onChangeFileName}
                            onChangeFileType={this.onChangeFileType}
                            onCloseModal={this.onCloseDownloadModal}
                        />
                    </>
                );
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(CourseManagementMain);