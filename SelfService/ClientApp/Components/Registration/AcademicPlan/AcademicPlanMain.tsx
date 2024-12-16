/* Copyright 2019 - 2024 Ellucian Company L.P. and its affiliates.
 * File: AcademicPlanMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';

// Internal components
import CourseDetailModal, { ICourseDetailModalResProps } from '../../Generic/CourseDetailModal';
import CoursePopOver, { ICoursePopOverResProps } from '../../Generic/CoursePopOver';
import CoursesModal, { ICoursesModalResProps } from '../../Generic/CoursesModal';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import SectionSearchModal, { ISectionSearchModalResProps } from '../../Generic/SectionSearchModal';
import AcademicPlanDisciplines, { IAcademicPlanDisciplinesResProps } from './AcademicPlanDisciplines';
import AcademicPlanExtraCourses, { IAcademicPlanExtraCoursesResProps } from './AcademicPlanExtraCourses';
import AcademicPlanHeader, { IAcademicPlanHeaderResProps } from './AcademicPlanHeader';
import AvailableAcademicPlanModal, { IAvailableAcademicPlanModalResProps } from './AvailableAcademicPlanModal';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { IAcademicDegReq } from '../../../Types/DegreeRequirements/IAcademicDegReq';
import { IAcademicPlanMainResources } from '../../../Types/Resources/Registration/IAcademicPlanMainResources';
import { ICourseCatalog } from '../../../Types/Course/ICourseCatalog';
import { ICourseTaken } from '../../../Types/Course/ICourseTaken';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ISectionSearch } from '../../../Types/Section/ISectionSearch';
import { IStudentDegReq } from '../../../Types/DegreeRequirements/IStudentDegReq';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestsSection from '../../../Requests/Generic/Section';
import Requests from '../../../Requests/Registration/AcademicPlan';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion

// #region Internal types
interface IAcademicPlanMainProps {
    addToCartClaim?: boolean;
    isRelative?: boolean;
    impersonateInfo?: IImpersonateInfo;
}

export interface IAcademicPlanMainResProps extends IAcademicPlanMainResources {
    academicPlanDisciplines: IAcademicPlanDisciplinesResProps;
    academicPlanExtraCourses: IAcademicPlanExtraCoursesResProps;
    academicPlanHeader: IAcademicPlanHeaderResProps;
    availableAcademicPlanModal: IAvailableAcademicPlanModalResProps;
    courseDetailModal: ICourseDetailModalResProps;
    coursePopOver: ICoursePopOverResProps;
    coursesModal: ICoursesModalResProps;
    sectionDetailModal: ISectionDetailModalResProps;
    sectionSearchModal: ISectionSearchModalResProps;
    printing: IPrintResources;
}

interface IAcademicPlanMainState {
    academicPlan?: IStudentDegReq;
    allExpanded: boolean;
    availableAcademicPlanModalOpen: boolean;
    availableAcademicPlans?: IAcademicDegReq[];
    canViewOtherPlans: boolean;
    email: string;
    expectedGraduationDate?: string;
    extraCoursesExpanded: boolean;
    fullName: string;
    graduationPeriod?: string;
    idClassification: number;
    isLoading: boolean;
    isSuccessfulAdded: boolean;
    resources?: IAcademicPlanMainResProps;
    selectedAcademicPlanValue?: string;
    showHideClassificationsCredits: any[];
    showHideCourses: boolean;
    showHideDisciplineCredits: boolean[];
    showPadding: boolean;
    showSequence: boolean;
    studentMailToUrl: string;
    wildcard: string;

    // Cart
    sectionIdToAdd?: number;

    // Generic components
    courseCatalogModal: boolean;
    courseDetail?: ICourseCatalog;
    courseDetailCatalog?: ICourseCatalog;
    courseDetailModalOpen: boolean;
    courseTaken?: ICourseTaken;
    cultures: ICultures;
    isWildCard: boolean;
    openPopOver: boolean;
    overallCount: number;
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    sectionDetail?: ISectionDetail;
    sectionId: string;
    sectionIdWildCard: string;
    sectionModalOpen: boolean;
    sectionSearchDetail?: ISectionSearch[];
    sectionSearchModalOpen: boolean;
    selectedCourse?: string;
    selectedSearchPeriod?: string;
    viewCommentsAnchor: any;
}
// #endregion

// #region Component
class AcademicPlanMain extends React.Component<IAcademicPlanMainProps, IAcademicPlanMainState> {
    private idModule: string;
    private idPage: string;
    private periodIndexToAdd: number | undefined;
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<IAcademicPlanMainState>;

    public constructor(props: IAcademicPlanMainProps) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Registration';
        this.idPage = 'AcademicPlanMain';
        this.periodIndexToAdd = undefined;
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAcademicPlanMainState {
        let resources: IAcademicPlanMainResProps | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            academicPlan: undefined,
            allExpanded: true,
            availableAcademicPlanModalOpen: false,
            availableAcademicPlans: undefined,
            canViewOtherPlans: false,
            email: '',
            extraCoursesExpanded: true,
            fullName: '',
            idClassification: 0,
            isLoading: true,
            isSuccessfulAdded: false,
            resources: resources,
            selectedAcademicPlanValue: undefined,
            showHideClassificationsCredits: [],
            showHideCourses: false,
            showHideDisciplineCredits: [],
            showPadding: false,
            showSequence: false,
            wildcard: '*',

            // Generic components
            courseCatalogModal: false,
            courseDetailModalOpen: false,
            cultures: LayoutStore.getCultures(),
            isWildCard: false,
            openPopOver: false,
            overallCount: 0,
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            sectionId: '',
            sectionIdWildCard: '',
            sectionModalOpen: false,
            sectionSearchModalOpen: false,
            selectedCourse: undefined,
            studentMailToUrl: 'mailto:{0}',
            viewCommentsAnchor: null
        };
    }

    // #region Events

    // #region Generic components

    // #region Pagination
    private getRowsPerPageOptions(maxValue: number): number[] {
        const rowsPerPageOptions: number[] = [];
        try {
            this.rowsPerPageOptions.forEach(option => {
                if (option < maxValue) {
                    rowsPerPageOptions.push(option);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.getRowsPerPageOptions.name, e));
        }
        return rowsPerPageOptions;
    }

    private onChangePage = (_event: any, page: number): void => {
        try {
            const {
                rowsPerPage,
                selectedCourse
            } = this.state;

            this.preservePage = true;
            this.preserveRowsPerPage = true;

            if (selectedCourse) {
                this.setState({
                    page
                }, () => {
                    LayoutActions.showPageLoader();
                    Requests.getCourseDetail(selectedCourse, this.resolveGetCourseDetailModal,
                        page * rowsPerPage, rowsPerPage);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangeRowsPerPage = (event: any): void => {
        try {
            this.setState({
                page: 0,
                rowsPerPage: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };
    // #endregion Pagination

    private onClickPopOver = (event: any, year: string, term: string, session: string, eventId: string,
        subType: string, section: string, status: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            LayoutActions.showPageLoader();
            Requests.getTakenCourseDetail(year,
                term,
                session,
                eventId,
                subType,
                section,
                status,
                this.resolveGetTakenCourseDetail,
                impersonateInfo);
            this.setState({
                viewCommentsAnchor: event.currentTarget.parentNode
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickPopOver.name, e));
        }
    };

    private onCloseCoursesModal = (): void => {
        this.setState({
            courseCatalogModal: false,
            courseDetail: undefined,
            isWildCard: false,
            page: 0,
            selectedCourse: undefined
        });
    };

    private onCloseCourseDetailModal = (): void => {
        const {
            isWildCard
        } = this.state;

        if (isWildCard) {
            this.setState({
                courseCatalogModal: true,
                courseDetailModalOpen: false
            });
        }
        else {
            this.setState({
                courseDetail: undefined,
                courseDetailModalOpen: false,
                page: 0,
                selectedCourse: undefined
            });
        }
    };

    private onClosePopOver = (): void => {
        try {
            this.setState({
                openPopOver: false,
                showPadding: false,
                viewCommentsAnchor: null
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopOver.name, e));
        }
    };

    private onCloseSectionModal = (): void => {
        try {
            this.setState({
                sectionDetail: undefined,
                sectionModalOpen: false
            });
        } catch (e) {
            this.logError(LogData.fromException(this.onCloseSectionModal.name, e));
        }
    };

    private onCloseSectionSearch = (): void => {
        try {
            const {
                isWildCard
            } = this.state;

            if (isWildCard) {
                this.setState({
                    courseCatalogModal: true,
                    isSuccessfulAdded: false,
                    sectionId: '',
                    sectionIdWildCard: '',
                    sectionSearchModalOpen: false
                });
            }
            else {
                this.setState({
                    courseCatalogModal: false,
                    isSuccessfulAdded: false,
                    page: 0,
                    sectionId: '',
                    sectionIdWildCard: '',
                    sectionSearchDetail: undefined,
                    sectionSearchModalOpen: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSectionSearch.name, e));
        }
    };

    private onCourseDetailButtonClick = (id: string): void => {
        try {
            const {
                page,
                rowsPerPage,
                wildcard
            } = this.state;

            LayoutActions.showPageLoader();
            if (id.includes(wildcard)) {
                this.setState({
                    selectedCourse: id
                }, () => Requests.getCourseDetail(id, this.resolveGetCourseDetailModal, page * rowsPerPage, rowsPerPage));
            }
            else {
                Requests.getCourseDetail(id, this.resolveGetCourseDetail);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCourseDetailButtonClick.name, e));
        }
    };

    private onSearchSection = (id: string, eventSubType: string): void => {
        try {
            const {
                wildcard
            } = this.state;

            LayoutActions.showPageLoader();
            if (id.includes(wildcard)) {
                this.setState({
                    sectionIdWildCard: id
                });
            }
            else {
                this.setState({
                    sectionId: id
                });
            }

            Requests.getSectionsByPeriod(id, eventSubType, this.resolveGetSectionSearch, this.props.impersonateInfo);

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearchSection.name, e));
        }
    };

    private onViewSectionDetails = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const id: number = Number(event.currentTarget.dataset.id);
            LayoutActions.showPageLoader();
            RequestsSection.getSection(id, false, this.resolveGetSection, this.props.impersonateInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetails.name, e));
        }
    };
    // #endregion Generic components

    // #region Cart
    private onAddToCart = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                sectionSearchDetail
            } = this.state;
            const id: number = Number(event.currentTarget.dataset.id);

            if (!(this.periodIndexToAdd === null || this.periodIndexToAdd === undefined)
                && this.periodIndexToAdd >= 0
                && sectionSearchDetail
                && sectionSearchDetail[this.periodIndexToAdd].enableCart) {
                this.setState({
                    sectionIdToAdd: id
                }, () => {
                    LayoutActions.showPageLoader();
                    Requests.addToCart(id, this.resolvePostAddToCart, this.props.impersonateInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddToCart.name, e));
        }
    };

    private onAddToWaitlist = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                sectionSearchDetail
            } = this.state;
            const id: number = Number(event.currentTarget.dataset.id);

            if (!(this.periodIndexToAdd === null || this.periodIndexToAdd === undefined)
                && this.periodIndexToAdd >= 0
                && sectionSearchDetail
                && sectionSearchDetail[this.periodIndexToAdd].enableCart) {
                this.setState({
                    sectionIdToAdd: id
                }, () => {
                    LayoutActions.showPageLoader();
                    Requests.addToWaitlist(id, this.resolvePostAddToWaitlist, this.props.impersonateInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddToWaitlist.name, e));
        }
    };
    // #endregion Cart

    private onChangeAcademicPlan = event => {
        this.setState({
            selectedAcademicPlanValue: event.target.value
        });
    };

    private onClickSelectAcademicPlan = () => {
        try {
            this.setState({
                availableAcademicPlanModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickSelectAcademicPlan.name, e));
        }
    };

    private onClickShowHeaderCourses = (): void => {
        const {
            showHideCourses
        } = this.state;

        const showHide: boolean = !showHideCourses;

        try {
            this.setState({
                showHideCourses: showHide
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickShowHeaderCourses.name, e));
        }
    };

    private onClickShowDisciplinesCredits = (event: any): void => {
        const {
            showHideDisciplineCredits
        } = this.state;

        try {
            const data: string[] = event.target.id.split('_');
            const id: number = Number(data[1]);
            const showHideDisciplines: boolean = !showHideDisciplineCredits[id];
            showHideDisciplineCredits.splice(id, 1, showHideDisciplines);
            event.stopPropagation();
            event.preventDefault();
            this.setState({
                showHideDisciplineCredits: showHideDisciplineCredits
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickShowDisciplinesCredits.name, e));
        }
    };

    private onClickShowClassificationsCredits = (event: any): void => {
        const {
            showHideClassificationsCredits
        } = this.state;

        try {
            const data: string[] = event.target.id.split('_');
            const idDiscipline: number = Number(data[1]);
            const idClassification: number = Number(data[2]);
            const index: number = showHideClassificationsCredits.findIndex(x => x[1] === idDiscipline && x[2] === idClassification);
            const showHideClassifications: boolean = !showHideClassificationsCredits[index][0];
            showHideClassificationsCredits.splice(index, 1, [showHideClassifications, idDiscipline, idClassification]);
            event.stopPropagation();
            event.preventDefault();
            this.setState({
                showHideClassificationsCredits: showHideClassificationsCredits
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickShowClassificationsCredits.name, e));
        }
    };

    private onCloseAvailableAcademicPlanModal = (): void => {
        this.setState({
            availableAcademicPlanModalOpen: false
        });
    };

    private onSelectAcademicPlan = (): void => {
        try {
            if (this.state.selectedAcademicPlanValue) {
                const academicPlan: string[] = this.state.selectedAcademicPlanValue.split('|');
                LayoutActions.showPageLoader();
                Requests.getAcademicPlan(academicPlan[0],
                    academicPlan[1], academicPlan[2],
                    academicPlan[3], academicPlan[4],
                    this.resolveGetAcademicPlan,
                    this.props.impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectAcademicPlan.name, e));
        }
    };

    private onCloseAlert = (): void => {
        try {
            this.setState({
                isSuccessfulAdded: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAlert.name, e));
        }
    };

    private onExpandAll = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                academicPlan
            } = this.state;

            const expanded: boolean = JSON.parse(event.currentTarget.dataset.expanded || 'false');

            if (academicPlan && academicPlan.disciplineList) {
                academicPlan.disciplineList.forEach(discipline => {
                    discipline.expanded = expanded;
                    if (discipline.classificationList) {
                        discipline.classificationList.forEach(classification => {
                            classification.expanded = expanded;
                        });
                    }
                });
            }

            this.setState({
                academicPlan: academicPlan,
                allExpanded: expanded,
                extraCoursesExpanded: expanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandAll.name, e));
        }
    };

    private onExpandClassification = (iDiscipline: number, iClassification: number, expanded: boolean): void => {
        try {
            const {
                academicPlan,
                extraCoursesExpanded
            } = this.state;

            let allExpanded: boolean = extraCoursesExpanded;
            if (academicPlan && academicPlan.disciplineList) {
                academicPlan.disciplineList[iDiscipline].classificationList[iClassification].expanded = expanded;
                academicPlan.disciplineList.forEach(discipline => {
                    allExpanded = allExpanded && discipline.expanded;
                    if (discipline.classificationList) {
                        discipline.classificationList.forEach(classification => {
                            allExpanded = allExpanded && classification.expanded;
                        });
                    }
                });
            }

            this.setState({
                academicPlan: academicPlan,
                allExpanded: allExpanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandClassification.name, e));
        }
    };

    private onExpandDiscipline = (iDiscipline: number, expanded: boolean): void => {
        try {
            const {
                academicPlan,
                extraCoursesExpanded
            } = this.state;

            let allExpanded: boolean = extraCoursesExpanded;
            if (academicPlan && academicPlan.disciplineList) {
                academicPlan.disciplineList[iDiscipline].expanded = expanded;
                academicPlan.disciplineList.forEach(discipline => {
                    allExpanded = allExpanded && discipline.expanded;
                    if (discipline.classificationList) {
                        discipline.classificationList.forEach(classification => {
                            allExpanded = allExpanded && classification.expanded;
                        });
                    }
                });
            }

            this.setState({
                academicPlan: academicPlan,
                allExpanded: allExpanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandDiscipline.name, e));
        }
    };

    private onExpandExtraCourses = (_event: any, expanded: boolean): void => {
        try {
            const {
                academicPlan
            } = this.state;

            let allExpanded: boolean = expanded;
            if (academicPlan && academicPlan.disciplineList) {
                academicPlan.disciplineList.forEach(discipline => {
                    allExpanded = allExpanded && discipline.expanded;
                    if (discipline.classificationList) {
                        discipline.classificationList.forEach(classification => {
                            allExpanded = allExpanded && classification.expanded;
                        });
                    }
                });
            }

            this.setState({
                allExpanded: allExpanded,
                extraCoursesExpanded: expanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandExtraCourses.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private canAddToCart = (section: ISection, periodIndex: number): boolean => {
        try {
            const {
                sectionSearchDetail
            } = this.state;

            let enableCart: boolean = false;
            if (sectionSearchDetail && sectionSearchDetail.length > periodIndex) {
                enableCart = sectionSearchDetail[periodIndex].enableCart;
            }
            return enableCart && section.isCartable && section.seatsLeft > 0;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canAddToCart.name, e));
            return false;
        }
    };

    private canAddToWaitlist = (section: ISection, periodIndex: number): boolean => {
        try {
            const {
                sectionSearchDetail
            } = this.state;

            let enableCart: boolean = false;
            if (sectionSearchDetail && sectionSearchDetail.length > periodIndex) {
                enableCart = sectionSearchDetail[periodIndex].enableCart;
            }
            return enableCart && section.isWaitable;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canAddToWaitlist.name, e));
            return false;
        }
    };

    private setPeriodIndex = (periodIndex: number): void => {
        try {
            this.periodIndexToAdd = periodIndex;
        }
        catch (e) {
            this.logError(LogData.fromException(this.setPeriodIndex.name, e));
        }
    };
    // #endregion Functions

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

    // #endregion Error Functions

    // #region Resolvers

    // #region Resolvers generic components
    private resolveGetCourseDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCourseDetail.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    courseCatalogModal: false,
                    courseDetail: result.data,
                    courseDetailModalOpen: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCourseDetail.name, e));
        }
    };

    private resolveGetCourseDetailModal = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCourseDetailModal.name, this.hideAllLoaders);
            if (result?.status) {
                const page: number = this.preservePage ? this.state.page : 0;
                const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(result.data.overallCount);
                const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                this.setState({
                    courseCatalogModal: true,
                    courseDetailCatalog: result.data.courseCatalogList,
                    isWildCard: true,
                    overallCount: result.data.overallCount,
                    page: page,
                    rowsPerPage: rowsPerPage,
                    rowsPerPageOptions: rowsPerPageOptions
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCourseDetail.name, e));
        }
    };

    private resolveGetTakenCourseDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTakenCourseDetail.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    this.setState({
                        courseTaken: result.data,
                        openPopOver: true
                    }, LayoutActions.hidePageLoader);
                }
                else {
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTakenCourseDetail.name, e));
        }
    };

    private resolveGetSection = (json: string): void => {
        try {
            if (json !== undefined) {
                const result: IJsonResult | undefined
                    = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);
                if (result?.status) {
                    this.setState({
                        sectionDetail: result.data,
                        sectionModalOpen: true
                    }, LayoutActions.hidePageLoader);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };

    private resolveGetSectionSearch = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSectionSearch.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    courseCatalogModal: false,
                    sectionSearchDetail: result.data,
                    sectionSearchModalOpen: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSectionSearch.name, e));
        }
    };
    // #endregion Resolvers generic components

    // #region Resolvers cart
    private resolvePostAddToCart = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostAddToCart.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    sectionIdToAdd,
                    sectionSearchDetail
                } = this.state;

                LayoutActions.getCountCart();

                if (!(this.periodIndexToAdd === null || this.periodIndexToAdd === undefined)
                    && this.periodIndexToAdd >= 0
                    && sectionSearchDetail
                    && sectionIdToAdd) {
                    const sectionFound: ISection | undefined
                        = sectionSearchDetail[this.periodIndexToAdd].sections.find(s => s.id === sectionIdToAdd);
                    if (sectionFound) {
                        sectionFound.isCartable = false;
                    }
                }
                this.periodIndexToAdd = undefined;
                this.setState({
                    isSuccessfulAdded: true,
                    sectionIdToAdd: undefined,
                    sectionSearchDetail: sectionSearchDetail
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostAddToCart.name, e));
        }
    };

    private resolvePostAddToWaitlist = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostAddToWaitlist.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    sectionIdToAdd,
                    sectionSearchDetail
                } = this.state;

                LayoutActions.getCountCart();

                if (!(this.periodIndexToAdd === null || this.periodIndexToAdd === undefined)
                    && this.periodIndexToAdd >= 0
                    && sectionSearchDetail
                    && sectionIdToAdd) {
                    const sectionFound: ISection | undefined
                        = sectionSearchDetail[this.periodIndexToAdd].sections.find(s => s.id === sectionIdToAdd);
                    if (sectionFound) {
                        sectionFound.isWaitable = false;
                    }
                }
                this.periodIndexToAdd = undefined;
                this.setState({
                    isSuccessfulAdded: true,
                    sectionIdToAdd: undefined,
                    sectionSearchDetail: sectionSearchDetail
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostAddToCart.name, e));
        }
    };
    // #endregion Resolvers cart

    private resolveGetAvailablePlans = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAvailablePlans.name, this.hideAllLoaders);
            if (result?.status) {
                let canViewOtherPlans: boolean = false;
                const availableAcademicPlans: IAcademicDegReq[] = result.data;

                if (availableAcademicPlans && availableAcademicPlans.length > 0) {
                    if (availableAcademicPlans.length === 1) {
                        if (availableAcademicPlans[0].programs && (availableAcademicPlans[0].programs.length > 1 ||
                            (availableAcademicPlans[0].programs.length === 1 && availableAcademicPlans[0].programs[0].degrees
                                && availableAcademicPlans[0].programs[0].degrees.length > 1))) {
                            canViewOtherPlans = true;
                        }
                    }
                    else {
                        canViewOtherPlans = true;
                    }
                }

                this.setState({
                    availableAcademicPlans,
                    canViewOtherPlans
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAvailablePlans.name, e));
        }
    };

    private resolveGetAcademicPlan = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAcademicPlan.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    showHideClassificationsCredits,
                    showHideDisciplineCredits
                } = this.state;

                const academicPlan: IStudentDegReq | undefined = result.data.studentDegreeRequirement;
                let availableAcademicPlanModalOpen: boolean = true;

                showHideClassificationsCredits.length = 0;
                showHideDisciplineCredits.length = 0;

                if (academicPlan) {
                    if (academicPlan.disciplineList) {
                        academicPlan.disciplineList.map((discipline, i) => {
                            discipline.expanded = true;
                            showHideDisciplineCredits.push(false);
                            discipline.classificationList.map((classification, j) => {
                                classification.expanded = true;
                                showHideClassificationsCredits.push(
                                    [false, i, j]
                                );
                            });
                        });
                    }
                    availableAcademicPlanModalOpen = false;
                }

                this.setState({
                    academicPlan: academicPlan,
                    allExpanded: true,
                    availableAcademicPlanModalOpen: availableAcademicPlanModalOpen,
                    email: result.data.email,
                    expectedGraduationDate: result.data.expectedGraduationDate,
                    extraCoursesExpanded: true,
                    fullName: result.data.fullName,
                    graduationPeriod: result.data.graduationPeriod,
                    showHideClassificationsCredits: showHideClassificationsCredits,
                    showHideDisciplineCredits: showHideDisciplineCredits,
                    showSequence: result.data.showSequence,
                    studentMailToUrl: result.data.studentMailToUrl
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAcademicPlan.name, e));
        }
    };

    private resolveGetDefaultAcademicPlan = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDefaultAcademicPlan.name, this.hideAllLoaders);
            if (result?.status && result.data) {
                if (result.data.studentDegreeRequirement) {
                    const {
                        showHideDisciplineCredits,
                        showHideClassificationsCredits
                    } = this.state;
                    const selectedAcademicPlanValue: IStudentDegReq = result.data.studentDegreeRequirement;
                    result.data.studentDegreeRequirement.disciplineList.map((discipline, i) => {
                        discipline.expanded = true;
                        showHideDisciplineCredits.push(false);
                        discipline.classificationList.map((classification, j) => {
                            classification.expanded = true;
                            showHideClassificationsCredits.push(
                                [false, i, j]
                            );
                        });
                    });
                    this.setState({
                        academicPlan: selectedAcademicPlanValue,
                        email: result.data.email,
                        expectedGraduationDate: result.data.expectedGraduationDate,
                        fullName: result.data.fullName,
                        graduationPeriod: result.data.graduationPeriod,
                        isLoading: false,
                        selectedAcademicPlanValue: `${selectedAcademicPlanValue.matricYear}|` +
                            `${selectedAcademicPlanValue.termCode}|${selectedAcademicPlanValue.programCode}|` +
                            `${selectedAcademicPlanValue.degreeCode}|${selectedAcademicPlanValue.curriculumCode}`,
                        showHideClassificationsCredits: showHideClassificationsCredits,
                        showHideDisciplineCredits: showHideDisciplineCredits,
                        showSequence: result.data.showSequence,
                        studentMailToUrl: result.data.studentMailToUrl
                    }, () => {
                        Requests.getAvailableAcademicPlans(this.resolveGetAvailablePlans, this.props.impersonateInfo);
                    });
                }
                else {
                    this.setState({
                        isLoading: false
                    }, LayoutActions.hidePageLoader);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDefaultAcademicPlan.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getDefaultAcademicPlan(this.resolveGetDefaultAcademicPlan,
                        this.props.impersonateInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetWildcard = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetWildcard.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    wildcard: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetWildcard.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            Requests.getWildCard(this.resolveGetWildcard);
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            addToCartClaim,
            isRelative,
            impersonateInfo
        } = this.props;

        const {
            academicPlan,
            allExpanded,
            availableAcademicPlanModalOpen,
            availableAcademicPlans,
            canViewOtherPlans,
            email,
            expectedGraduationDate,
            extraCoursesExpanded,
            fullName,
            graduationPeriod,
            isLoading,
            isSuccessfulAdded,
            selectedAcademicPlanValue,
            showHideClassificationsCredits,
            showHideCourses,
            showHideDisciplineCredits,
            showPadding,
            showSequence,
            studentMailToUrl,

            // Generic components
            courseCatalogModal,
            courseDetail,
            courseDetailCatalog,
            courseDetailModalOpen,
            courseTaken,
            cultures,
            openPopOver,
            overallCount,
            page,
            resources,
            rowsPerPage,
            rowsPerPageOptions,
            sectionDetail,
            sectionId,
            sectionIdWildCard,
            sectionModalOpen,
            sectionSearchDetail,
            sectionSearchModalOpen,
            selectedCourse,
            viewCommentsAnchor
        } = this.state;

        let academicPlanHeader: JSX.Element | undefined;
        let academicPlanInformation: JSX.Element | undefined;
        let academicPlanExtraInformation: JSX.Element | undefined;
        let coursePopOver: JSX.Element | undefined;
        let availableAcademicPlanModal: JSX.Element | undefined;
        let coursesModal: JSX.Element | undefined;
        let courseDetailModal: JSX.Element | undefined;
        let sectionSearchModal: JSX.Element | undefined;
        let sectionDetailModal: JSX.Element | undefined;
        let emptyContent: JSX.Element | undefined;

        if (resources) {
            if (!isLoading) {
                if (academicPlan) {
                    let printLink: string = '';
                    if (selectedAcademicPlanValue) {
                        const printMandatoryParameters: string = `?year=${selectedAcademicPlanValue.split('|')[0]}&term=${selectedAcademicPlanValue.split('|')[1]}&program=${selectedAcademicPlanValue.split('|')[2]}&degree=${selectedAcademicPlanValue.split('|')[3]}&curriculum=${selectedAcademicPlanValue.split('|')[4]}`;
                        const printOptionalParameters: string = impersonateInfo ? `&impersonate.process=${impersonateInfo.process}&impersonateInfo.personId=${impersonateInfo.personId}&impersonateInfo.viewId=${impersonateInfo.viewId}&=impersonateInfo.tabId${impersonateInfo.tabId}` : '';
                        printLink = `${Constants.webUrl}/AcademicPlans/Report${printMandatoryParameters}${printOptionalParameters}&currentPage=${Constants.headersRequestsJson['X-Current-Page']}`;
                    }

                    academicPlanHeader = (
                        <AcademicPlanHeader
                            academicPlan={academicPlan}
                            allExpanded={allExpanded}
                            canViewOtherPlans={canViewOtherPlans}
                            email={email}
                            expectedGraduationDate={expectedGraduationDate}
                            fullName={fullName}
                            graduationPeriod={graduationPeriod}
                            isWhatIf={false}
                            printLink={printLink}
                            resources={resources.academicPlanHeader}
                            printingResources={resources.printing}
                            showHideCourse={showHideCourses}
                            studentMailToUrl={studentMailToUrl}
                            onChangePlan={this.onClickSelectAcademicPlan}
                            onClickShowCourse={this.onClickShowHeaderCourses}
                            onExpandAll={this.onExpandAll}
                        />
                    );

                    if (academicPlan.disciplineList && academicPlan.disciplineList.length > 0) {
                        academicPlanInformation = (
                            <AcademicPlanDisciplines
                                disciplines={academicPlan.disciplineList}
                                impersonateInfo={impersonateInfo}
                                resources={resources.academicPlanDisciplines}
                                showCredisTaken={true}
                                showHideClassificationsCredits={showHideClassificationsCredits}
                                showHideDisciplineCredits={showHideDisciplineCredits}
                                showMinCredits={false}
                                showMinGrade={false}
                                showPadding={showPadding}
                                showSequence={showSequence}
                                showStatusIcons={true}
                                onButtonClick={this.onCourseDetailButtonClick}
                                onClickPopOver={this.onClickPopOver}
                                onClickShowCredits={this.onClickShowDisciplinesCredits}
                                onClickShowClassificationsCredits={this.onClickShowClassificationsCredits}
                                onExpand={this.onExpandDiscipline}
                                onExpandClassification={this.onExpandClassification}
                                onSearchSection={this.onSearchSection}
                            />
                        );

                        if (academicPlan.sectionsNotCounted &&
                            academicPlan.sectionsNotCounted.length > 0) {
                            academicPlanExtraInformation = (
                                <AcademicPlanExtraCourses
                                    courses={academicPlan.sectionsNotCounted}
                                    expanded={extraCoursesExpanded}
                                    resources={resources.academicPlanExtraCourses}
                                    onButtonClick={this.onCourseDetailButtonClick}
                                    onExpand={this.onExpandExtraCourses}
                                />
                            );
                        }

                        if (openPopOver && courseTaken) {
                            coursePopOver = (
                                <CoursePopOver
                                    courses={courseTaken}
                                    viewCommentsAnchor={viewCommentsAnchor}
                                    resources={resources.coursePopOver}
                                    onClosePopOver={this.onClosePopOver}
                                />
                            );
                        }

                        if (sectionSearchModalOpen) {
                            sectionSearchModal = (
                                <SectionSearchModal
                                    addToCartClaim={addToCartClaim}
                                    canAddToCart={this.canAddToCart}
                                    canAddToWaitlist={this.canAddToWaitlist}
                                    currencySymbol={cultures.currencySymbol}
                                    isSuccessfulAdded={isSuccessfulAdded}
                                    numberCulture={cultures.numberCulture}
                                    open={sectionSearchModalOpen}
                                    impersonateInfo={impersonateInfo}
                                    resources={resources.sectionSearchModal}
                                    sections={sectionSearchDetail}
                                    sectionId={sectionId}
                                    sectionIdWildCard={sectionIdWildCard}
                                    onAddToCart={this.onAddToCart}
                                    onAddToWaitlist={this.onAddToWaitlist}
                                    onClose={this.onCloseSectionSearch}
                                    onCloseAlert={this.onCloseAlert}
                                    onSetPeriodIndex={this.setPeriodIndex}
                                    onViewSectionDetails={this.onViewSectionDetails}
                                />
                            );
                        }

                        if (sectionDetail) {
                            sectionDetailModal = (
                                <SectionDetailModal
                                    open={sectionModalOpen}
                                    resources={resources.sectionDetailModal}
                                    section={sectionDetail}
                                    onClose={this.onCloseSectionModal}
                                />
                            );
                        }

                        if (courseCatalogModal) {
                            coursesModal = (
                                <CoursesModal
                                    courseDetail={courseDetailCatalog}
                                    open={courseCatalogModal}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    overallCount={overallCount}
                                    resources={resources.coursesModal}
                                    selectedCourse={selectedCourse}
                                    onChangePage={this.onChangePage}
                                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                                    onClose={this.onCloseCoursesModal}
                                    onCourseDetail={this.onCourseDetailButtonClick}
                                    onSeachSection={this.onSearchSection}
                                />
                            );
                        }

                        if (courseDetailModalOpen && courseDetail) {
                            courseDetailModal = (
                                <CourseDetailModal
                                    courseDetail={courseDetail}
                                    open={courseDetailModalOpen}
                                    resources={resources.courseDetailModal}
                                    onClose={this.onCloseCourseDetailModal}
                                />
                            );
                        }
                    }
                    else {
                        academicPlanInformation = (
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <br />
                                    <MessageStyled
                                        classMessage="noResults"
                                        message={resources.lblNoAcademicPlaInformation}
                                    />
                                </Grid>
                            </Grid>
                        );
                    }
                }
                else {
                    emptyContent = (
                        <Card>
                            <CardContent>
                                <Illustration
                                    color="secondary"
                                    name="under-maintenance"
                                    text={resources.lblNoAcademicPlan}
                                />
                            </CardContent>
                        </Card>
                    );
                }

                if (availableAcademicPlanModalOpen && availableAcademicPlans) {
                    availableAcademicPlanModal = (
                        <AvailableAcademicPlanModal
                            academicPlans={availableAcademicPlans}
                            open={availableAcademicPlanModalOpen}
                            resources={resources.availableAcademicPlanModal}
                            selectedAcademicPlan={selectedAcademicPlanValue}
                            onChangeAcademicPlan={this.onChangeAcademicPlan}
                            onClose={this.onCloseAvailableAcademicPlanModal}
                            onSelect={this.onSelectAcademicPlan}
                        />
                    );
                }
            }
        }

        if (isLoading && isRelative) {
            return (
                <ContainerLoader id="ldrAcademicPlan" height="md" />
            );
        }
        return (
            <>
                {academicPlanHeader}
                {academicPlanInformation}
                {academicPlanExtraInformation}
                {coursePopOver}
                {availableAcademicPlanModal}
                {coursesModal}
                {courseDetailModal}
                {sectionSearchModal}
                {sectionDetailModal}
                {emptyContent}
            </>
        );
    }
}
// #endregion Component

// RenderDOM: Component
export default AcademicPlanMain;