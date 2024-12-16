/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DegreeRequirementsView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';

// Internal components
import CourseDetailModal, { ICourseDetailModalResProps } from '../../Generic/CourseDetailModal';
import CoursePopOver, { ICoursePopOverResProps } from '../../Generic/CoursePopOver';
import CoursesModal, { ICoursesModalResProps } from '../../Generic/CoursesModal';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import SectionSearchModal, { ISectionSearchModalResProps } from '../../Generic/SectionSearchModal';
import DegreeRequirementsDisciplines, { IDegreeRequirementsDisciplinesResProps } from './DegreeRequirementsDisciplines';
import DegreeRequirementsHeader, { IDegreeRequirementsHeaderResProps } from './DegreeRequirementsHeader';
import DegreeRequirementsOptions, { IDegreeRequirementsOptionsResProps } from './DegreeRequirementsOptions';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ICourseCatalog } from '../../../Types/Course/ICourseCatalog';
import { ICourseTaken } from '../../../Types/Course/ICourseTaken';
import { IDegreeRequirementsResources } from '../../../Types/Resources/Planning/IDegreeRequirementsResources';
import { IDegReqParameters } from '../../../Types/DegreeRequirements/IDegReqParameters';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ISectionSearch } from '../../../Types/Section/ISectionSearch';
import { IStudentDegReq } from '../../../Types/DegreeRequirements/IStudentDegReq';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import QueryString from '@hedtech/powercampus-design-system/helpers/QueryString';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsSection from '../../../Requests/Generic/Section';
import Requests from '../../../Requests/Planning/DegreeRequirements';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// Storage
import Storage from '@hedtech/powercampus-design-system/storage';
import StorageKeys from '@hedtech/powercampus-design-system/storage/StorageKeys';
// #endregion Imports

// #region Internal types
interface IDegreeRequirementsState {
    academicPlan?: IStudentDegReq;
    allExpanded: boolean;
    degrees?: IDropDownOption[];
    degreeSelected?: IDropDownOption;
    isAnonymous: boolean;
    isLoading: boolean;
    isSuccessfulAdded: boolean;
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    programs?: IDropDownOption[];
    programSelected?: IDropDownOption;
    resources?: IDegReqsRes;
    showHideClassificationsCredits: any[];
    showHideCourses: boolean;
    showHideDisciplineCredits: boolean[];
    showSequence: boolean;
    wildcard: string;

    // Cart
    sectionIdToAdd?: number;

    // Generic components
    courseCatalogModal: boolean;
    courseDetail?: ICourseCatalog;
    courseDetailCatalog?: ICourseCatalog;
    courseDetailModalOpen?: boolean;
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

    // Query String
    newPeriodSelected?: string;
    newProgram?: string;
    newDegreSelected?: string;
}

export interface IDegReqsRes extends IDegreeRequirementsResources {
    courseDetailModal: ICourseDetailModalResProps;
    coursePopOver: ICoursePopOverResProps;
    coursesModal: ICoursesModalResProps;
    degreeRequirementsDisciplines: IDegreeRequirementsDisciplinesResProps;
    degreeRequirementsHeader: IDegreeRequirementsHeaderResProps;
    degreeRequirementsOptions: IDegreeRequirementsOptionsResProps;
    sectionDetailModal: ISectionDetailModalResProps;
    sectionSearchModal: ISectionSearchModalResProps;
}
// #endregion Internal types

// #region Component
class DegreeRequirementsView extends React.Component<any, IDegreeRequirementsState> {
    private idModule: string;
    private idPage: string;
    private periodIndexToAdd: number | undefined;
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<IDegreeRequirementsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Planning';
        this.idPage = 'DegreeRequirements';
        this.periodIndexToAdd = undefined;
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IDegreeRequirementsState {
        let resources: IDegReqsRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            academicPlan: undefined,
            allExpanded: true,
            degrees: undefined,
            degreeSelected: undefined,
            isAnonymous: false,
            isLoading: true,
            isSuccessfulAdded: false,
            periods: undefined,
            periodSelected: undefined,
            programs: undefined,
            programSelected: undefined,
            resources: resources,
            showHideClassificationsCredits: [],
            showHideCourses: false,
            showHideDisciplineCredits: [],
            showSequence: false,
            wildcard: '*',

            // Generic components
            courseCatalogModal: false,
            courseDetail: undefined,
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
                    Requests.addToCart(id, this.resolvePostAddToCart, this.props.personId);
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
                    Requests.addToWaitlist(id, this.resolvePostAddToWaitlist, this.props.personId);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddToWaitlist.name, e));
        }
    };

    private onChangeDegree = (optionSelected: IDropDownOption): void => {
        try {
            const {
                periodSelected,
                programSelected
            } = this.state;

            this.setState({
                allExpanded: true,
                academicPlan: undefined,
                degreeSelected: optionSelected
            });

            if (periodSelected && periodSelected.value
                && programSelected && programSelected.value
                && optionSelected && optionSelected.value) {
                LayoutActions.showPageLoader();
                Requests.getAcademicPlan(
                    String(periodSelected.value),
                    String(programSelected.value),
                    String(optionSelected.value),
                    this.resolveGetAcademicPlan);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDegree.name, e));
        }
    };

    private onChangePeriod = (optionSelected: IDropDownOption): void => {
        try {
            this.setState({
                academicPlan: undefined,
                degrees: undefined,
                degreeSelected: undefined,
                periodSelected: optionSelected,
                programs: undefined,
                programSelected: undefined
            });

            if (optionSelected && optionSelected.value) {
                LayoutActions.showPageLoader();
                Requests.getPrograms(String(optionSelected.value), this.resolveGetPrograms);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onChangeProgram = (optionSelected: IDropDownOption): void => {
        try {
            const {
                periodSelected
            } = this.state;

            this.setState({
                academicPlan: undefined,
                degrees: undefined,
                degreeSelected: undefined,
                programSelected: optionSelected
            });

            if (periodSelected && periodSelected.value
                && optionSelected && optionSelected.value) {
                LayoutActions.showPageLoader();
                Requests.getDegrees(String(periodSelected.value), String(optionSelected.value),
                    this.resolveGetDegrees);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeProgram.name, e));
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

    private onCloseCourseDetailModal = (): void => {
        const {
            isWildCard
        } = this.state;

        if (isWildCard) {
            this.setState({
                courseCatalogModal: true,
                courseDetailModalOpen: false,
                page: 0
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

    private onCloseCoursesModal = (): void => {
        this.setState({
            courseCatalogModal: false,
            courseDetail: undefined,
            isWildCard: false,
            page: 0,
            selectedCourse: undefined
        });
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

    private onClickPopOver = (event: any, year: string, term: string, session: string, eventId: string,
        subType: string,
        section: string,
        status: string): void => {
        try {
            LayoutActions.showPageLoader();
            Requests.getTakenCourseDetail(year, term, session, eventId, subType, section, status, this.resolveGetTakenCourseDetail);
            this.setState({
                viewCommentsAnchor: event.currentTarget.parentNode.parentNode
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickPopOver.name, e));
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
                allExpanded: expanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandAll.name, e));
        }
    };

    private onExpandClassification = (iDiscipline: number, iClassification: number, expanded: boolean): void => {
        try {
            const {
                academicPlan
            } = this.state;

            let allExpanded: boolean = true;
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
                academicPlan
            } = this.state;

            let allExpanded: boolean = true;
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

            Requests.getSectionsByPeriod(id, this.resolveGetSectionSearch);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearchSection.name, e));
        }
    };

    private onViewSectionDetails = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                isAnonymous
            } = this.state;
            const id: number = Number(event.currentTarget.dataset.id);
            LayoutActions.showPageLoader();
            if (isAnonymous) {
                RequestsSection.getSectionAnonymous(id, this.resolveGetSection);
            } else {
                RequestsSection.getSection(id, false, this.resolveGetSection, this.props.personId);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetails.name, e));
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
            this.logError(LogData.fromException(this.onAddToWaitlist.name, e));
            return false;
        }
    };

    private setCourseDetail = (courseDetail?: ICourseCatalog): void => {
        try {
            this.setState({
                courseDetail: courseDetail
            }, LayoutActions.hidePageLoader);
        }
        catch (e) {
            this.logError(LogData.fromException(this.setCourseDetail.name, e));
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

    private setQueryStringValues = (): void => {
        try {
            const hdnMatricYear: HTMLInputElement | undefined =
                document.getElementById('hdnMatricYear') as HTMLInputElement;
            const hdnMatricTerm: HTMLInputElement | undefined =
                document.getElementById('hdnMatricTerm') as HTMLInputElement;
            const hdnDegree: HTMLInputElement | undefined =
                document.getElementById('hdnDegree') as HTMLInputElement;
            const hdnCurriculum: HTMLInputElement | undefined =
                document.getElementById('hdnCurriculum') as HTMLInputElement;
            const hdnProgram: HTMLInputElement | undefined =
                document.getElementById('hdnProgram') as HTMLInputElement;
            if (hdnMatricYear && hdnMatricYear.value &&
                hdnMatricTerm && hdnMatricTerm.value &&
                hdnDegree && hdnDegree.value &&
                hdnCurriculum && hdnCurriculum.value &&
                hdnProgram && hdnProgram.value) {

                const newPeriodSelected = hdnMatricYear.value + '/' + hdnMatricTerm.value;
                const newProgramSelected = hdnProgram.value;
                const newDegreSelected = hdnDegree.value + '/' + hdnCurriculum.value;

                hdnMatricYear.remove();
                hdnMatricTerm.remove();
                hdnDegree.remove();
                hdnCurriculum.remove();
                hdnProgram.remove();

                const newDegree: IDropDownOption = { description: '', value: newDegreSelected };
                const newProgram: IDropDownOption = { description: '', value: newProgramSelected };
                const newPeriod: IDropDownOption = { description: '', value: newPeriodSelected };

                this.setState({
                    allExpanded: true,
                    academicPlan: undefined,
                    degreeSelected: newDegree,
                    programSelected: newProgram,
                    periodSelected: newPeriod
                });

                Requests.getPrograms(newPeriodSelected, this.resolveGetPrograms);
                Requests.getDegrees(newPeriodSelected, newProgramSelected, this.resolveGetDegrees);

                Requests.getAcademicPlan(
                    newPeriodSelected,
                    newProgramSelected,
                    newDegreSelected,
                    this.resolveGetAcademicPlan);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setQueryStringValues.name, e));
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

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }

    // #endregion Error Functions

    // #region Resolvers
    private resolveGetAcademicPlan = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAcademicPlan.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    showHideDisciplineCredits,
                    showHideClassificationsCredits
                } = this.state;

                const isAnonymous: boolean | undefined = result.data.isAnonymous;
                if (isAnonymous) {
                    this.setState({
                        isAnonymous: true
                    });
                }
                else {
                    this.setState({
                        showSequence: result.data.showSequence
                    });
                }

                const plan: IStudentDegReq | undefined = result.data.studentDegreeRequirement;
                if (plan) {
                    plan.disciplineList.forEach((discipline, i) => {
                        discipline.expanded = true;
                        showHideDisciplineCredits.push(false);
                        discipline.classificationList.forEach((classification, j) => {
                            classification.expanded = true;
                            showHideClassificationsCredits.push([false, i, j]);
                        });
                    });
                }

                const {
                    degreeSelected,
                    periodSelected,
                    programSelected
                } = this.state;

                const yearTerm: string[] | undefined = periodSelected?.value.toString().split('/');
                const degreeCurriculum: string[] | undefined = degreeSelected?.value.toString().split('/');

                if (yearTerm && degreeCurriculum && programSelected?.value) {
                    const degReqParameters: IDegReqParameters =
                    {
                        curriculum: degreeCurriculum[1],
                        degree: degreeCurriculum[0],
                        matricTerm: yearTerm[1],
                        matricYear: yearTerm[0],
                        program: programSelected?.value.toString()
                    };
                    const url: string = QueryString.setCurrentUrl(degReqParameters);
                    Storage.saveToStorage(StorageKeys.urlDegreeReq, url);
                }

                this.setState({
                    academicPlan: plan
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAcademicPlan.name, e));
        }
    };

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

    private resolveGetDegrees = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDegrees.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    degrees: result.data
                }, LayoutActions.hidePageLoader);
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
                    isLoading: false,
                    periods: result.data
                }, LayoutActions.hidePageLoader);
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
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPrograms.name, e));
        }
    };

    private resolveGetSectionSearch = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSectionSearch.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    sectionSearchDetail: result.data,
                    sectionSearchModalOpen: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSectionSearch.name, e));
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

    private resolveGetTakenCourseDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTakenCourseDetail.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    this.setState({
                        courseTaken: result.data,
                        openPopOver: true
                        // showPadding: true
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

    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
            this.setQueryStringValues();
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };
    // #endregion

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IDegReqsRes | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();

        if (ready) {
            this.setState({
                cultures: cultures,
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
    public componentDidMount(): void {
        Requests.getWildCard(this.resolveGetWildcard);
        Requests.getPeriods(this.resolveGetPeriods);
    }

    public componentWillUnmount(): void {
        LayoutActions.showPageLoader();
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
        LayoutActions.hidePageLoader();
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            academicPlan,
            allExpanded,
            degrees,
            degreeSelected,
            isLoading,
            isSuccessfulAdded,
            periods,
            periodSelected,
            programs,
            programSelected,
            resources,
            showHideClassificationsCredits,
            showHideDisciplineCredits,
            showSequence,

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
            viewCommentsAnchor
        } = this.state;

        let optionsSection: JSX.Element | undefined;
        let pageInstructions: JSX.Element | undefined;
        let academicPlanInformation: JSX.Element | undefined;
        let sectionSearchModal: JSX.Element | undefined;
        let sectionDetailModal: JSX.Element | undefined;
        let coursePopOver: JSX.Element | undefined;
        let coursesModal: JSX.Element | undefined;
        let courseDetailModal: JSX.Element | undefined;

        if (resources) {
            if (!isLoading) {
                if (periods && periods.length > 0) {
                    optionsSection = (
                        <>
                            <DegreeRequirementsOptions
                                degrees={degrees}
                                degreeSelected={degreeSelected}
                                periods={periods}
                                periodSelected={periodSelected}
                                programs={programs}
                                programSelected={programSelected}
                                resources={resources.degreeRequirementsOptions}
                                onChangeDegree={this.onChangeDegree}
                                onChangePeriod={this.onChangePeriod}
                                onChangeProgram={this.onChangeProgram}
                            />
                            <br />
                        </>
                    );

                    if (degreeSelected && degreeSelected.value
                        && periodSelected && periodSelected.value
                        && programSelected && programSelected.value
                        && academicPlan) {
                        if (academicPlan.disciplineList.length > 0) {
                            academicPlanInformation = (
                                <>
                                    <DegreeRequirementsHeader
                                        allExpanded={allExpanded}
                                        courseMax={academicPlan.coursesMax}
                                        courseMin={academicPlan.coursesMin}
                                        discipline={academicPlan.discipline}
                                        formalTitle={academicPlan.formalTitle}
                                        programId={academicPlan.programOfStudyId}
                                        resources={resources.degreeRequirementsHeader}
                                        onExpandAll={this.onExpandAll}
                                    />
                                    <br />
                                    <DegreeRequirementsDisciplines
                                        academicPlan={academicPlan}
                                        showCredisTaken={false}
                                        showHideClassificationsCredits={showHideClassificationsCredits}
                                        showHideDisciplineCredits={showHideDisciplineCredits}
                                        showMinCredits={true}
                                        showMinGrade={true}
                                        showStatusIcons={true}
                                        showSequence={showSequence}
                                        onButtonClick={this.onCourseDetailButtonClick}
                                        onClickPopOver={this.onClickPopOver}
                                        onClickShowCredits={this.onClickShowDisciplinesCredits}
                                        onClickShowClassificationsCredits={this.onClickShowClassificationsCredits}
                                        onExpand={this.onExpandDiscipline}
                                        onExpandClassification={this.onExpandClassification}
                                        onSearchSection={this.onSearchSection}
                                        resources={resources.degreeRequirementsDisciplines}
                                    />
                                </>
                            );

                            if (sectionSearchModalOpen) {
                                sectionSearchModal = (
                                    <SectionSearchModal
                                        canAddToCart={this.canAddToCart}
                                        canAddToWaitlist={this.canAddToWaitlist}
                                        currencySymbol={cultures.currencySymbol}
                                        isSuccessfulAdded={isSuccessfulAdded}
                                        numberCulture={cultures.numberCulture}
                                        open={sectionSearchModalOpen}
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

                            if (openPopOver && courseTaken) {
                                coursePopOver = (
                                    <CoursePopOver
                                        courses={courseTaken}
                                        onClosePopOver={this.onClosePopOver}
                                        viewCommentsAnchor={viewCommentsAnchor}
                                        resources={resources.coursePopOver}
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
                                        selectedCourse={selectedCourse}
                                        onChangePage={this.onChangePage}
                                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                                        onClose={this.onCloseCoursesModal}
                                        onCourseDetail={this.onCourseDetailButtonClick}
                                        onSeachSection={this.onSearchSection}
                                        resources={resources.coursesModal}
                                    />
                                );
                            }

                            if (courseDetailModalOpen) {
                                if (courseDetail) {
                                    courseDetailModal = (
                                        <CourseDetailModal
                                            courseDetail={courseDetail}
                                            open={courseDetailModalOpen}
                                            onClose={this.onCloseCourseDetailModal}
                                            resources={resources.courseDetailModal}
                                        />
                                    );
                                }
                            }

                        }
                        else {
                            academicPlanInformation = (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <br />
                                        <MessageStyled
                                            classMessage="noResults"
                                            message={resources.lblNoDisciplinesAvailable}
                                        />
                                    </Grid>
                                </Grid>
                            );
                        }
                    }
                    else {
                        pageInstructions = (
                            <MessageStyled
                                classMessage="pageInstructions"
                                message={resources.lblPageInstructions}
                            />
                        );
                    }
                }
                else {
                    optionsSection = (
                        <Grid container>
                            <Grid item xs={12}>
                                <br />
                                <MessageStyled
                                    classMessage="noResults"
                                    message={resources.lblNoPeriodsAvailable}
                                />
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
                {optionsSection}
                {pageInstructions}
                {academicPlanInformation}
                {coursePopOver}
                {coursesModal}
                {courseDetailModal}
                {sectionSearchModal}
                {sectionDetailModal}
            </Layout>
        );
    }
}

const DegreeRequirementsViewWithLayout = withLayout(DegreeRequirementsView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<DegreeRequirementsViewWithLayout />, document.getElementById('root'));