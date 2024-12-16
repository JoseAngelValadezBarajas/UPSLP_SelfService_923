/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: WhatIfMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';

// Internal components
import CourseDetailModal, { ICourseDetailModalResProps } from '../../Generic/CourseDetailModal';
import CoursePopOver, { ICoursePopOverResProps } from '../../Generic/CoursePopOver';
import CoursesModal, { ICoursesModalResProps } from '../../Generic/CoursesModal';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import SectionSearchModal, { ISectionSearchModalResProps } from '../../Generic/SectionSearchModal';
import AcademicPlanDisciplines, { IAcademicPlanDisciplinesResProps } from '../AcademicPlan/AcademicPlanDisciplines';
import AcademicPlanExtraCourses, { IAcademicPlanExtraCoursesResProps } from '../AcademicPlan/AcademicPlanExtraCourses';
import AcademicPlanHeader, { IAcademicPlanHeaderResProps } from '../AcademicPlan/AcademicPlanHeader';
import AvailableWhatIf, { IAvailableWhatIfResProps } from './AvailableWhatIf';
import WhatIfOptions, { IWhatIfOptionsResProps } from './WhatIfOptions';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';
import { ICourseCatalog } from '../../../Types/Course/ICourseCatalog';
import { ICourseTaken } from '../../../Types/Course/ICourseTaken';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ISectionSearch } from '../../../Types/Section/ISectionSearch';
import { IStudentDegReq } from '../../../Types/DegreeRequirements/IStudentDegReq';
import { IWhatIfMainResources } from '../../../Types/Resources/Registration/IWhatIfMainResources';
import { IWhatIfPlanHeader } from '../../../Types/WhatIf/IWhatIfPlanHeader';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Registration/WhatIf';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestsSection from '../../../Requests/Generic/Section';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Internal types
interface IWhatIfMainProps {
    addToCartClaim?: boolean;
    impersonateInfo?: IImpersonateInfo;
}

interface IWhatIfMainState {
    allExpanded: boolean;
    confirmationModalOpen: boolean;
    degrees?: IDropDownOption[];
    degreeSelected?: IDropDownOption;
    extraCoursesExpanded: boolean;
    isDuplicated: boolean;
    isLoading: boolean;
    isLoadingCreate: boolean;
    isLoadingDegrees: boolean;
    isLoadingList: boolean;
    isLoadingPeriods: boolean;
    isLoadingPrograms: boolean;
    isSuccessfulAdded: boolean;
    maxNumberPlans: number;
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    programs?: IDropDownOption[];
    programSelected?: IDropDownOption;
    resources?: IWhatIfMainRes;
    showSequence: boolean;
    whatIfList?: IWhatIfPlanHeader[];
    whatIfPlan?: IStudentDegReq;
    whatIfSelected?: IWhatIfPlanHeader;
    wildcard: string;

    idClassification: number;
    showHideClassificationsCredits: any[];
    showHideCourses: boolean;
    showHideDisciplineCredits: boolean[];

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

export interface IWhatIfMainRes extends IWhatIfMainResources {
    academicPlanDisciplines: IAcademicPlanDisciplinesResProps;
    academicPlanExtraCourses: IAcademicPlanExtraCoursesResProps;
    academicPlanHeader: IAcademicPlanHeaderResProps;
    availableWhatIf: IAvailableWhatIfResProps;
    courseDetailModal: ICourseDetailModalResProps;
    coursePopOver: ICoursePopOverResProps;
    coursesModal: ICoursesModalResProps;
    deleteWhatIfConfirmation: IConfirmationDialogResources;
    sectionDetailModal: ISectionDetailModalResProps;
    sectionSearchModal: ISectionSearchModalResProps;
    whatIfOptions: IWhatIfOptionsResProps;
}
// #endregion Internal types

// #region Component
class WhatIfMain extends React.Component<IWhatIfMainProps, IWhatIfMainState> {
    private idModule: string;
    private idPage: string;
    private periodIndexToAdd: number | undefined;
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<IWhatIfMainState>;

    public constructor(props: IWhatIfMainProps) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Registration';
        this.idPage = 'WhatIfMain';
        this.periodIndexToAdd = undefined;
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IWhatIfMainState {
        let resources: IWhatIfMainRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            allExpanded: true,
            confirmationModalOpen: false,
            degrees: undefined,
            degreeSelected: undefined,
            extraCoursesExpanded: true,
            isDuplicated: false,
            isLoading: true,
            isLoadingCreate: false,
            isLoadingDegrees: false,
            isLoadingList: false,
            isLoadingPeriods: false,
            isLoadingPrograms: false,
            isSuccessfulAdded: false,
            maxNumberPlans: 0,
            periods: undefined,
            periodSelected: undefined,
            programs: undefined,
            programSelected: undefined,
            resources: resources,
            showSequence: false,
            whatIfList: undefined,
            whatIfPlan: undefined,
            whatIfSelected: undefined,
            wildcard: '*',

            idClassification: 0,
            showHideClassificationsCredits: [],
            showHideCourses: false,
            showHideDisciplineCredits: [],

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
                    sectionId: '',
                    sectionIdWildCard: '',
                    sectionSearchModalOpen: false
                });
            }
            else {
                this.setState({
                    courseCatalogModal: false,
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
                }, () => Requests.getCourseDetail(id, this.resolveGetCourseDetailModal,
                    page * rowsPerPage, rowsPerPage));
            }
            else {
                Requests.getCourseDetail(id, this.resolveGetCourseDetail);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCourseDetailButtonClick.name, e));
        }
    };

    private onSearchSection = (id: string): void => {
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

            Requests.getSectionsByPeriod(id, this.resolveGetSectionSearch, this.props.impersonateInfo?.personId);

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

    private onChangeDegree = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            this.setState({
                degreeSelected: optionSelected,
                isDuplicated: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDegree.name, e));
        }
    };

    private onChangePeriod = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            this.setState({
                degrees: undefined,
                degreeSelected: undefined,
                isDuplicated: false,
                periodSelected: optionSelected,
                programs: undefined,
                programSelected: undefined
            });

            if (optionSelected && optionSelected.value) {
                this.showLoaderPrograms();
                Requests.getPrograms(Number(optionSelected.value), this.resolveGetPrograms, this.props.impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onChangeProgram = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                periodSelected
            } = this.state;

            this.setState({
                degrees: undefined,
                degreeSelected: undefined,
                isDuplicated: false,
                programSelected: optionSelected
            });

            if (periodSelected && periodSelected.value
                && optionSelected && optionSelected.value) {
                this.showLoaderDegrees();
                Requests.getDegrees(Number(periodSelected.value), String(optionSelected.value) ,
                    this.resolveGetDegrees, this.props.impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeProgram.name, e));
        }
    };

    private onCloseDeleteConfirmationModal = (): void => {
        try {
            this.setState({
                confirmationModalOpen: false,
                whatIfSelected: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteConfirmationModal.name, e));
        }
    };

    private onCreate = (): void => {
        try {
            const {
                degreeSelected,
                periodSelected,
                programSelected,
                whatIfList
            } = this.state;

            if (degreeSelected
                && degreeSelected.value
                && periodSelected
                && periodSelected.value
                && programSelected
                && programSelected.value) {
                const degreeCurriculum: string[] = String(degreeSelected.value).split('/');
                if (whatIfList && whatIfList.find(item =>
                    item.termPeriodId === Number(periodSelected.value)
                    && item.programCode === String(programSelected.value)
                    && item.degreeCode === degreeCurriculum[0]
                    && item.curriculumCode === degreeCurriculum[1])) {
                    this.setState({
                        isDuplicated: true
                    });
                }
                else {
                    this.setState({
                        isDuplicated: false
                    });
                    this.showLoaderCreate();
                    Requests.createWhatIf({
                        curriculum: degreeCurriculum[1],
                        degree: degreeCurriculum[0],
                        impersonateInfo: this.props.impersonateInfo,
                        program: String(programSelected.value),
                        termPeriodId: Number(periodSelected.value)
                    },
                        this.resolveCreateWhatIf);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCreate.name, e));
        }
    };

    private onDelete = (index: number): void => {
        try {
            const {
                whatIfList
            } = this.state;

            if (whatIfList && whatIfList.length > 0) {
                this.setState({
                    confirmationModalOpen: true,
                    whatIfSelected: whatIfList[index]
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDelete.name, e));
        }
    };

    private onDeleteConfirm = (): void => {
        try {
            const {
                whatIfSelected
            } = this.state;

            if (whatIfSelected) {
                Requests.deleteWhatIf({
                    curriculum: whatIfSelected.curriculumCode,
                    degree: whatIfSelected.degreeCode,
                    impersonateInfo: this.props.impersonateInfo,
                    program: whatIfSelected.programCode,
                    termPeriodId: whatIfSelected.termPeriodId
                },
                    this.resolveDeleteWhatIf);

                this.setState({
                    confirmationModalOpen: false,
                    whatIfSelected: undefined
                });
                LayoutActions.showPageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteConfirm.name, e));
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

    private onExpandAll = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                whatIfPlan
            } = this.state;

            const expanded: boolean = JSON.parse(event.currentTarget.dataset.expanded || 'false');

            if (whatIfPlan && whatIfPlan.disciplineList) {
                whatIfPlan.disciplineList.forEach(discipline => {
                    discipline.expanded = expanded;
                    if (discipline.classificationList) {
                        discipline.classificationList.forEach(classification => {
                            classification.expanded = expanded;
                        });
                    }
                });
            }

            this.setState({
                allExpanded: expanded,
                extraCoursesExpanded: expanded,
                whatIfPlan: whatIfPlan
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandAll.name, e));
        }
    };

    private onExpandClassification = (iDiscipline: number, iClassification: number, expanded: boolean): void => {
        try {
            const {
                extraCoursesExpanded,
                whatIfPlan
            } = this.state;

            let allExpanded: boolean = extraCoursesExpanded;
            if (whatIfPlan && whatIfPlan.disciplineList) {
                whatIfPlan.disciplineList[iDiscipline].classificationList[iClassification].expanded = expanded;
                whatIfPlan.disciplineList.forEach(discipline => {
                    allExpanded = allExpanded && discipline.expanded;
                    if (discipline.classificationList) {
                        discipline.classificationList.forEach((classification) => {
                            allExpanded = allExpanded && classification.expanded;
                        });
                    }
                });
            }

            this.setState({
                allExpanded: allExpanded,
                whatIfPlan: whatIfPlan
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandClassification.name, e));
        }
    };

    private onExpandDiscipline = (iDiscipline: number, expanded: boolean): void => {
        try {
            const {
                extraCoursesExpanded,
                whatIfPlan
            } = this.state;

            let allExpanded: boolean = extraCoursesExpanded;
            if (whatIfPlan && whatIfPlan.disciplineList) {
                whatIfPlan.disciplineList[iDiscipline].expanded = expanded;
                whatIfPlan.disciplineList.forEach(discipline => {
                    allExpanded = allExpanded && discipline.expanded;
                    if (discipline.classificationList) {
                        discipline.classificationList.forEach((classification) => {
                            allExpanded = allExpanded && classification.expanded;
                        });
                    }
                });
            }

            this.setState({
                allExpanded: allExpanded,
                whatIfPlan: whatIfPlan
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandDiscipline.name, e));
        }
    };

    private onExpandExtraCourses = (_event: any, expanded: boolean): void => {
        try {
            const {
                whatIfPlan
            } = this.state;

            let allExpanded: boolean = expanded;
            if (whatIfPlan && whatIfPlan.disciplineList) {
                whatIfPlan.disciplineList.forEach(discipline => {
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

    private onReturnToList = (): void => {
        try {
            this.setState({
                whatIfPlan: undefined,
                whatIfSelected: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onReturnToList.name, e));
        }
    };

    private onSelectWhatIf = (index: number): void => {
        try {
            const {
                whatIfList
            } = this.state;

            if (whatIfList && whatIfList.length > 0) {
                this.setState({
                    whatIfSelected: whatIfList[index]
                });
                LayoutActions.showPageLoader();
                Requests.getWhatIf({
                    curriculum: whatIfList[index].curriculumCode,
                    degree: whatIfList[index].degreeCode,
                    impersonateInfo: this.props.impersonateInfo,
                    program: whatIfList[index].programCode,
                    termPeriodId: whatIfList[index].termPeriodId
                },
                    this.resolveGetWhatIf);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectWhatIf.name, e));
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

    private hideLoaderCreate = (): void => {
        this.setState({
            isLoadingCreate: false
        });
    };

    private hideLoaderDegrees = (): void => {
        this.setState({
            isLoadingDegrees: false
        });
    };

    private hideLoaderList = (): void => {
        this.setState({
            isLoadingList: false
        });
    };

    private hideLoaderPeriods = (): void => {
        this.setState({
            isLoadingPeriods: false
        });
    };

    private hideLoaderPrograms = (): void => {
        this.setState({
            isLoadingPrograms: false
        });
    };

    private showLoaderCreate = (): void => {
        this.setState({
            isLoadingCreate: true
        });
    };

    private showLoaderDegrees = (): void => {
        this.setState({
            isLoadingDegrees: true
        });
    };

    private showLoaderPeriods = (): void => {
        this.setState({
            isLoadingPeriods: true
        });
    };

    private showLoaderList = (): void => {
        this.setState({
            isLoadingList: true
        });
    };

    private showLoaderPrograms = (): void => {
        this.setState({
            isLoadingPrograms: true
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

    private resolveCreateWhatIf = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveCreateWhatIf.name, this.hideAllLoaders);
            if (result?.status) {
                const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
                if (layoutResources) {
                    LayoutActions.setAlert({
                        message: layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                const {
                    degreeSelected,
                    periodSelected,
                    programSelected
                } = this.state;

                if (degreeSelected
                    && degreeSelected.value
                    && periodSelected
                    && periodSelected.value
                    && programSelected
                    && programSelected.value) {
                    const degreeCurriculum: string[] = String(degreeSelected.value).split('/');
                    this.hideLoaderCreate();
                    LayoutActions.showPageLoader();
                    Requests.getWhatIf({
                        curriculum: degreeCurriculum[1],
                        degree: degreeCurriculum[0],
                        impersonateInfo: this.props.impersonateInfo,
                        program: String(programSelected.value),
                        termPeriodId: Number(periodSelected.value)
                    },
                        this.resolveGetWhatIf);
                }

                this.showLoaderList();
                Requests.getAvailableWhatIfs(this.resolveGetAvailableWhatIfs, this.props.impersonateInfo);
                this.showLoaderPeriods();
                Requests.getPeriods(this.resolveGetPeriods, this.props.impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveCreateWhatIf.name, e));
        }
    };

    private resolveDeleteWhatIf = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteWhatIf.name, this.hideAllLoaders);
            if (result?.status) {
                LayoutActions.hidePageLoader();
                this.showLoaderList();
                Requests.getAvailableWhatIfs(this.resolveGetAvailableWhatIfs, this.props.impersonateInfo);
                this.showLoaderPeriods();
                Requests.getPeriods(this.resolveGetPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteWhatIf.name, e));
        }
    };

    private resolveGetAvailableWhatIfs = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAvailableWhatIfs.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    maxNumberPlans: result.data.maxNumberPlans,
                    whatIfList: result.data.whatIfPlans
                }, this.hideLoaderList);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAvailableWhatIfs.name, e));
        }
    };

    private resolveGetDegrees = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDegrees.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    degrees: result.data
                }, this.hideLoaderDegrees);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDegrees.name, e));
        }
    };

    private resolveGetPeriods = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    degrees: undefined,
                    degreeSelected: undefined,
                    periods: result.data,
                    periodSelected: undefined,
                    programs: undefined,
                    programSelected: undefined
                }, this.hideLoaderPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolveGetPrograms = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPrograms.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    programs: result.data
                }, this.hideLoaderPrograms);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPrograms.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    isLoading: false,
                    resources: result.data
                }, LayoutActions.hidePageLoader);
                this.showLoaderList();
                Requests.getAvailableWhatIfs(this.resolveGetAvailableWhatIfs, this.props?.impersonateInfo);
                this.showLoaderPeriods();
                Requests.getPeriods(this.resolveGetPeriods, this.props.impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetWhatIf = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetWhatIf.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    showHideClassificationsCredits,
                    showHideDisciplineCredits
                } = this.state;

                const whatIfPlan: IStudentDegReq | undefined = result.data.studentDegreeRequirement;

                showHideClassificationsCredits.length = 0;
                showHideDisciplineCredits.length = 0;

                if (whatIfPlan) {
                    if (whatIfPlan.disciplineList) {
                        whatIfPlan.disciplineList.map((discipline, i) => {
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
                }

                this.setState({
                    allExpanded: true,
                    extraCoursesExpanded: true,
                    showHideClassificationsCredits: showHideClassificationsCredits,
                    showHideDisciplineCredits: showHideDisciplineCredits,
                    showSequence: result.data.showSequence,
                    whatIfPlan: whatIfPlan
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetWhatIf.name, e));
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
            impersonateInfo
        } = this.props;

        const {
            allExpanded,
            confirmationModalOpen,
            degrees,
            degreeSelected,
            extraCoursesExpanded,
            isLoading,
            isLoadingCreate,
            isLoadingDegrees,
            isLoadingList,
            isLoadingPeriods,
            isLoadingPrograms,
            isSuccessfulAdded,
            maxNumberPlans,
            periods,
            periodSelected,
            programs,
            programSelected,
            resources,
            whatIfList,
            whatIfPlan,
            whatIfSelected,

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
            rowsPerPage,
            rowsPerPageOptions,
            sectionDetail,
            sectionId,
            sectionIdWildCard,
            sectionModalOpen,
            sectionSearchDetail,
            sectionSearchModalOpen,
            selectedCourse,
            showHideClassificationsCredits,
            showHideCourses,
            showHideDisciplineCredits,
            showSequence,
            viewCommentsAnchor
        } = this.state;

        let optionsSection: JSX.Element | undefined;
        let availableWhatIf: JSX.Element | undefined;
        let breadcrumbs: JSX.Element | undefined;
        let academicPlanHeader: JSX.Element | undefined;
        let academicPlanInformation: JSX.Element | undefined;
        let academicPlanExtraInformation: JSX.Element | undefined;
        let deleteConfirmation: JSX.Element | undefined;
        let coursePopOver: JSX.Element | undefined;
        let coursesModal: JSX.Element | undefined;
        let courseDetailModal: JSX.Element | undefined;
        let sectionSearchModal: JSX.Element | undefined;
        let sectionDetailModal: JSX.Element | undefined;

        if (resources) {
            if (!isLoading) {

                if (whatIfPlan) {
                    breadcrumbs = (
                        <Grid container>
                            <Grid item>
                                <Paragraph
                                    gutterBottom
                                    id="prgBreadcrumbs"
                                    text={resources.lblBreadcrumbs}
                                    events={[this.onReturnToList]}
                                />
                                <br />
                            </Grid>
                        </Grid>
                    );
                    academicPlanHeader = (
                        <AcademicPlanHeader
                            academicPlan={whatIfPlan}
                            allExpanded={allExpanded}
                            isWhatIf
                            resources={resources.academicPlanHeader}
                            showHideCourse={showHideCourses}
                            onClickShowCourse={this.onClickShowHeaderCourses}
                            onExpandAll={this.onExpandAll}
                        />
                    );

                    if (whatIfPlan.disciplineList && whatIfPlan.disciplineList.length > 0) {
                        academicPlanInformation = (
                            <AcademicPlanDisciplines
                                disciplines={whatIfPlan.disciplineList}
                                impersonateInfo={impersonateInfo}
                                resources={resources.academicPlanDisciplines}
                                showHideClassificationsCredits={showHideClassificationsCredits}
                                showHideDisciplineCredits={showHideDisciplineCredits}
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

                        if (whatIfPlan.sectionsNotCounted &&
                            whatIfPlan.sectionsNotCounted.length > 0) {
                            academicPlanExtraInformation = (
                                <AcademicPlanExtraCourses
                                    courses={whatIfPlan.sectionsNotCounted}
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
                                    resources={resources.coursePopOver}
                                    viewCommentsAnchor={viewCommentsAnchor}
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
                            <>
                                <br />
                                <Card>
                                    <CardContent>
                                        <Illustration
                                            color="secondary"
                                            name="under-maintenance"
                                            text={resources.lblNoInformation}
                                        />
                                    </CardContent>
                                </Card>
                            </>
                        );
                    }
                }
                else {
                    optionsSection = (
                        <>
                            <WhatIfOptions
                                degrees={degrees}
                                degreeSelected={degreeSelected}
                                isLoadingCreate={isLoadingCreate}
                                isLoadingDegrees={isLoadingDegrees}
                                isLoadingPeriods={isLoadingPeriods}
                                isLoadingPrograms={isLoadingPrograms}
                                periods={periods}
                                periodSelected={periodSelected}
                                programs={programs}
                                programSelected={programSelected}
                                resources={resources.whatIfOptions}
                                whatIfNoMore={maxNumberPlans <= (whatIfList ? whatIfList.length : 0)}
                                onChangeDegree={this.onChangeDegree}
                                onChangePeriod={this.onChangePeriod}
                                onChangeProgram={this.onChangeProgram}
                                onCreate={this.onCreate}
                            />
                            <br />
                        </>
                    );

                    availableWhatIf = (
                        <AvailableWhatIf
                            isLoadingList={isLoadingList}
                            resources={resources.availableWhatIf}
                            whatIfList={whatIfList}
                            onDelete={this.onDelete}
                            onSelectWhatIf={this.onSelectWhatIf}
                        />
                    );

                    deleteConfirmation = (
                        <ConfirmationDialog
                            contentText={whatIfSelected ? Format.toString(resources.deleteWhatIfConfirmation.formatContent, [
                                whatIfSelected.programDesc,
                                whatIfSelected.degreeDesc,
                                whatIfSelected.curriculumDesc
                            ]) : ''}
                            open={confirmationModalOpen}
                            primaryActionOnClick={this.onCloseDeleteConfirmationModal}
                            primaryActionText={resources.deleteWhatIfConfirmation.btnDecline}
                            secondaryActionOnClick={this.onDeleteConfirm}
                            secondaryActionText={resources.deleteWhatIfConfirmation.btnAccept}
                            title={resources.deleteWhatIfConfirmation.lblTitle}
                        />
                    );
                }
            }
        }

        return (
            <>
                {optionsSection}
                {availableWhatIf}
                {breadcrumbs}
                {academicPlanHeader}
                {academicPlanInformation}
                {academicPlanExtraInformation}
                {deleteConfirmation}
                {coursePopOver}
                {coursesModal}
                {courseDetailModal}
                {sectionSearchModal}
                {sectionDetailModal}
            </>
        );
    }
}
// #endregion Component

// RenderDOM: Component
export default WhatIfMain;