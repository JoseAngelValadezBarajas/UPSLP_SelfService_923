/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: CourseTemplatesView.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import AddTemplatesModal from './CourseTemplatesAddModal';
import CourseTemplateAssignCourses from './CourseTemplatesAssign';
import CourseTemplateSetup from './CourseTemplateSetup';
import CourseTemplatesTable from './CourseTemplatesTable';
import CourseTemplatesViewCourses from './CourseTemplatesViewCourses';
import CourseTemplatesCopyActivitiesModal from './CourseTemplatesCopyActivitiesModal';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPeopleSearchModel } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchModel';
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ICourseTemplate } from '../../../Types/Department/ICourseTemplate';
import { ICourseTemplateAddActivities } from '../../../Types/Department/ICourseTemplateAddActivities';
import { ICourseTemplates } from '../../../Types/Department/ICourseTemplates';
import { ICourseTemplatesAssignCourses } from '../../../Types/Department/ICourseTemplatesAssignCourses';
import { ICourseTemplatesAssignCoursesSave } from '../../../Types/Department/ICourseTemplatesAssignCoursesSave';
import { ICourseTemplatesAssignmentSearch } from '../../../Types/Department/ICourseTemplatesAssignmentSearch';
import { ICourseTemplatesAssignOptions } from '../../../Types/Department/ICourseTemplatesAssignOptions';
import { ICourseTemplatesPermissions } from '../../../Types/Permissions/ICourseTemplatesPermissions';
import { ICourseTemplateAssignmentShare } from '../../../Types/Department/ICourseTemplateAssignmnetShare';
import { ICourseTemplateSetup } from '../../../Types/Department/ICourseTemplateSetup';
import { ICourseTemplatesViewCourses } from '../../../Types/Department/ICourseTemplatesViewCourses';
import { ICourseTemplatesResources } from '../../../Types/Resources/Department/ICourseTemplatesResources';
import { ICourseTemplatesSettings } from '../../../Types/Department/ICourseTemplatesSettings';
import { IActivitiesSetup } from '../../../Types/Section/IActivitiesSetup';
import { IAssignments } from '../../../Types/Section/IAssignments';
import { IAssignmentTypes } from '../../../Types/Section/IAssignmentTypes';
import { ISectionAssignmentValidationResult } from '../../../Types/Section/ISectionAssignmentValidationResult';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// Requests
import Requests from '../../../Requests/Department/CourseTemplates';
import RequestsSection from '../../../Requests/Generic/Section';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import PeopleSearchActions from '@hedtech/powercampus-design-system/flux/actions/PeopleSearchActions';
import PeopleSearchStore from '@hedtech/powercampus-design-system/flux/stores/PeopleSearchStore';
// #endregion Imports

// #region Types
interface ICourseTemplatesState {
    // #region Assign courses
    assignFilterOptions?: ICourseTemplatesAssignOptions;
    assignSections: ICourseTemplatesAssignCoursesSave[];
    checkboxHeader: boolean;
    confirmationAssignedModal: boolean;
    courseId: string;
    courseName: string;
    courseTemplateFilterSearch: ICourseTemplatesAssignmentSearch;
    isAssignCourses: boolean;
    isDepartmentSelected: boolean;
    sectionAssignments?: ICourseTemplatesAssignCourses;
    showAssignButton: boolean;
    templateHasActivities: boolean;
    templateIsAssigned: boolean;
    templateIsAssignedByUser: boolean;
    // #endregion Assign courses

    // #region View courses
    assignmentSections?: ICourseTemplatesViewCourses;
    isViewCourses: boolean;
    sectionDetail?: ISectionDetail;
    sectionModalOpen: boolean;
    // #endregion View courses

    // #region Activities
    activityName: string;
    activitiesSetup?: IActivitiesSetup;
    activitySetupItems: IAssignments;
    activityType: number;
    addActivity: boolean;
    addActivityItems: ICourseTemplateAddActivities;
    confirmDeleteActivity: boolean;
    confirmationDeleteAll: boolean;
    copyAssignments?: IAssignments[];
    copyPeriods?: IDropDownOption[];
    copyPeriodSelected?: number;
    copyTemplate?: IDropDownOption[];
    copyTemplateSelected?: number;
    editActivityItems: ICourseTemplateAddActivities;
    countAllFinal: number;
    countAllMidterm: number;
    gradeActivity?: IDropDownOption[];
    idActivity?: number;
    isActivityTypeRequired: boolean;
    isAddActivities: boolean;
    isAddActivity: boolean;
    isCopyActivities: boolean;
    isEditActivity: boolean;
    isFinishCopy: boolean;
    isLoadingTemplates: boolean;
    isMidterm: boolean;
    isPossiblePoints: boolean;
    isTitleRequired: boolean;
    isValidDueDate: boolean;
    isValidName: boolean;
    isViewActivity: boolean;
    percentageFinalBytype: number[];
    percentageMidtermBytype: number[];
    saveAssignment: IAssignments[];
    saveAssignmentTypes: IAssignmentTypes[];
    sectionAssignmentValidationResult?: ISectionAssignmentValidationResult;
    showMessageDueDate: boolean;
    // #endregion Activities

    // #region Date Modal
    dateIndex: number;
    dateSubIndex: number;
    dateKey: number;
    dateModal: boolean;
    dateSelected?: string;
    // #endregion Date Modal

    //#region Templates
    assignmentTemplateShares?: ICourseTemplateAssignmentShare[];
    assignmentTemplateShareDelete?: number;
    assignmentTemplateShareName?: string;
    confirmationModal: boolean;
    confirmationDeleteSharedModal: boolean;
    courseTemplateAdd: ICourseTemplateSetup;
    courseTemplateSetup?: ICourseTemplate;
    courseTemplates?: ICourseTemplates;
    courseTemplateId?: number;
    courseTemplateName: string;
    countTemplates: number;
    cultures: ICultures;
    errorTemplateName: boolean;
    existTemplateName: boolean;
    idToDelete: number;
    isAdd: boolean;
    isIndeterminate: boolean;
    isLoading: boolean;
    isPeopleSearch: boolean;
    isSetupView: boolean;
    isSharedWith: boolean;
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    permissions?: ICourseTemplatesPermissions;
    selectedPerson?: IPeopleSearchModel;
    shareTemplates: ICourseTemplatesSettings[];
    //#endregion Templates

    //#region PeopleSearchModal
    selectedOption?: string | number;
    //#endregion PeopleSearch Modal

    // #region Stepper
    activeStep: number;
    numSteps: number;
    stepErrors: boolean[];
    // #endregion Stepper

    // #region Pagination
    page: number;
    pageAssign: number;
    pageAssignCourses: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier

    resources?: ICourseTemplatesRes;
}

export interface ICourseTemplatesRes extends ICourseTemplatesResources {
    sectionDetailModal: ISectionDetailModalResProps;
}
// #endregion Types

// #region Component
class CourseTemplatesView extends React.Component<any, ICourseTemplatesState> {
    private dateFormat: string;
    private idModule: string;
    private idPage: string;

    // #region Pagination
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<ICourseTemplatesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.dateFormat = 'YYYY-MM-DD';
        this.idModule = 'Department';
        this.idPage = 'CourseTemplates';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Pagination
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        // #endregion Pagination

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        PeopleSearchStore.addSelectedPersonListener(this.onSelect);
        // #endregion State Management Listeners
    }

    private getInitialState(): ICourseTemplatesState {
        let permissions: ICourseTemplatesPermissions | undefined;
        let resources: ICourseTemplatesRes | undefined;
        if (this.state) {
            permissions = this.state.permissions;
            resources = this.state.resources;
        }
        return {
            // #region Assign courses
            assignSections: [],
            checkboxHeader: false,
            confirmationAssignedModal: false,
            courseId: '',
            courseName: '',
            courseTemplateFilterSearch: { classLevelId: undefined, departmentId: undefined, subTypeId: undefined },
            isAssignCourses: false,
            isDepartmentSelected: true,
            showAssignButton: false,
            templateHasActivities: false,
            templateIsAssigned: false,
            templateIsAssignedByUser: false,
            // #endregion Assign courses

            // #region View courses
            isViewCourses: false,
            sectionModalOpen: false,
            // #endregion View courses

            // #region Activities
            activityName: '',
            activitySetupItems: {},
            activityType: 0,
            addActivity: false,
            addActivityItems: {},
            confirmDeleteActivity: false,
            confirmationDeleteAll: false,
            countAllFinal: 0,
            countAllMidterm: 0,
            editActivityItems: {},
            isActivityTypeRequired: false,
            isAddActivities: false,
            isAddActivity: false,
            isCopyActivities: false,
            isEditActivity: false,
            isFinishCopy: true,
            isLoadingTemplates: false,
            isMidterm: false,
            isPossiblePoints: false,
            isTitleRequired: false,
            isValidDueDate: false,
            isValidName: false,
            isViewActivity: false,
            percentageFinalBytype: [],
            percentageMidtermBytype: [],
            saveAssignment: [],
            saveAssignmentTypes: [],
            showMessageDueDate: false,
            // #endregion Activities

            // #region Date Modal
            dateIndex: 0,
            dateKey: 0,
            dateModal: false,
            dateSubIndex: 0,
            // #endregion Date Modal

            // #region Templates
            confirmationModal: false,
            confirmationDeleteSharedModal: false,
            courseTemplateAdd: {
                assignmentWeightingMethod: 1,
                automaticOverallGrades: false,
                createdBy: 0,
                defaultGradeMapping: false,
                isDateByAssignmentType: undefined,
                isRestrictive: false,
                name: '',
                templateId: 0,
                useWeightedAssignmentTypes: false
            },
            courseTemplateName: '',
            countTemplates: 0,
            cultures: LayoutStore.getCultures(),
            errorTemplateName: false,
            existTemplateName: false,
            idToDelete: 0,
            isAdd: false,
            isLoading: false,
            isIndeterminate: false,
            isPeopleSearch: false,
            isSetupView: false,
            isSharedWith: false,
            permissions: permissions,
            shareTemplates: [],
            // #endregion Templates

            // #region Pagination
            page: 0,
            pageAssign: 0,
            pageAssignCourses: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            // #endregion Pagination

            // #region Stepper
            activeStep: 0,
            numSteps: 2,
            stepErrors: [false, false],
            // #endregion Stepper

            // #region Dossier
            dossierPersonId: 0,
            openDossierModal: false,
            // #endregion Dossier

            resources: resources
        };
    }

    // #region Events

    // #region Assign / View courses
    private onAssignCourses = (): void => {
        try {
            const {
                assignSections
            } = this.state;

            if (assignSections) {
                LayoutActions.setLoading(true);
                Requests.postSaveAssingCourses(assignSections, this.resolvePostSaveAssignCourses);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAssignCourses.name, e));
        }
    };

    private onChangeCheckHeader = (): void => {
        try {
            const {
                assignSections,
                checkboxHeader,
                courseTemplateId,
                courseTemplateSetup,
                sectionAssignments
            } = this.state;

            if (courseTemplateSetup && courseTemplateId && sectionAssignments) {
                const oneSelected: boolean = sectionAssignments.sectionAssignments.findIndex(section => section.checked && !section.hasGrades && !section.hasPostedGrades) >= 0;
                const newChecked: boolean = !(checkboxHeader || oneSelected);
                sectionAssignments.sectionAssignments.forEach(section => {
                    if (!section.hasGrades && !section.hasPostedGrades && newChecked) {
                        assignSections.push({
                            defaultGradeMapping: Number(courseTemplateSetup.assignmentTemplate.defaultGradeMapping),
                            sectionId: section.sectionId,
                            templateId: courseTemplateId
                        });
                    }
                    else {
                        assignSections.forEach((item, i) => {
                            if (item.sectionId === section.sectionId) {
                                assignSections.splice(i, 1);
                            }
                        });
                    }
                    section.checked = newChecked;
                });
                this.setState({
                    checkboxHeader: newChecked,
                    sectionAssignments: sectionAssignments,
                    showAssignButton: newChecked
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckHeader.name, e));
        }
    };

    private onChangeCheckboxAssign = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                assignSections,
                courseTemplateId,
                courseTemplateSetup,
                sectionAssignments
            } = this.state;
            const id: string[] = event.target.id.split('_');
            const checked: boolean = event.target.checked;
            if (courseTemplateSetup && courseTemplateId && sectionAssignments) {
                if (checked) {
                    sectionAssignments.sectionAssignments[Number(id[2])].checked = checked;
                    assignSections.push({
                        defaultGradeMapping: Number(courseTemplateSetup.assignmentTemplate.defaultGradeMapping),
                        sectionId: Number(id[1]),
                        templateId: courseTemplateId
                    });
                }
                else {
                    assignSections.forEach((item, i) => {
                        if (item.sectionId === Number(id[1])) {
                            assignSections.splice(i, 1);
                        }
                    });
                    sectionAssignments.sectionAssignments[Number(id[2])].checked = checked;
                }
                const oneNotSelected: boolean = sectionAssignments.sectionAssignments.findIndex(section => !section.checked && !section.hasGrades && !section.hasPostedGrades) >= 0;
                const oneSelected: boolean = sectionAssignments.sectionAssignments.findIndex(section => section.checked && !section.hasGrades && !section.hasPostedGrades) >= 0;
                this.setState({
                    checkboxHeader: !oneNotSelected,
                    assignSections: assignSections,
                    sectionAssignments: sectionAssignments,
                    showAssignButton: oneSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckboxAssign.name, e));
        }
    };

    private onClearFilters = (): void => {
        try {
            const {
                courseTemplateFilterSearch
            } = this.state;

            courseTemplateFilterSearch.classLevelId = undefined;
            courseTemplateFilterSearch.departmentId = undefined;
            courseTemplateFilterSearch.status = undefined;
            courseTemplateFilterSearch.subTypeId = undefined;

            this.setState({
                courseTemplateFilterSearch: courseTemplateFilterSearch,
                isDepartmentSelected: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearFilters.name, e));
        }
    };

    private onClickAssign = (): void => {
        try {
            LayoutActions.setLoading(true);
            Requests.getAssignFilters(this.resolveGetAssignFilters);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAssign.name, e));
        }
    };

    private onClickViewCourses = (): void => {
        try {
            const {
                courseTemplateId,
                pageAssignCourses,
                rowsPerPage
            } = this.state;

            if (courseTemplateId) {
                LayoutActions.setLoading(true);
                Requests.getAssignedCourses(courseTemplateId, pageAssignCourses, rowsPerPage, this.resolveGetAssignedCourses);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickViewCourses.name, e));
        }
    };

    private onCloseAssign = (): void => {
        try {
            const {
                page,
                courseTemplates,
                periodSelected,
                rowsPerPage
            } = this.state;

            if (courseTemplates && periodSelected) {
                LayoutActions.setLoading(true);
                courseTemplates.startIndex = page * rowsPerPage;
                courseTemplates.length = rowsPerPage;
                Requests.getTemplates(Number(periodSelected.value), courseTemplates.startIndex,
                    courseTemplates.length, this.resolveGetCourseTemplatesCurrent);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAssign.name, e));
        }
    };

    private onCloseSectionModal = (): void => {
        try {
            this.setState({
                sectionDetail: undefined,
                sectionModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSectionModal.name, e));
        }
    };

    private onDeleteAssignedCourses = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const id: string[] = event.target.id.split('_');
            this.setState({
                confirmationAssignedModal: true,
                courseId: String(id[2]),
                courseName: String(id[3]),
                idToDelete: Number(id[1])
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAssignedCourses.name, e));
        }
    };

    private onDeleteAssignedConfirmation = (): void => {
        try {
            const {
                idToDelete
            } = this.state;
            LayoutActions.setLoading(true);
            Requests.postDeleteAssignedCourse(idToDelete, this.resolvePostDeleteAssignedCourses);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAssignedConfirmation.name, e));
        }
    };

    private onDropdownChangeFilter = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                courseTemplateFilterSearch,
                isDepartmentSelected
            } = this.state;

            let isDepartment: boolean = isDepartmentSelected;
            if (id) {
                switch (id) {
                    case 'ddlDepartment':

                        if (optionSelected.value) {
                            isDepartment = false;
                        }
                        else {
                            isDepartment = true;
                        }
                        courseTemplateFilterSearch.departmentId = Number(optionSelected.value ? optionSelected.value : undefined);
                        break;
                    case 'ddlSubtype':
                        courseTemplateFilterSearch.subTypeId = Number(optionSelected.value ? optionSelected.value : undefined);
                        break;
                    case 'ddlClassLevel':
                        courseTemplateFilterSearch.classLevelId = Number(optionSelected.value ? optionSelected.value : undefined);
                        break;
                    case 'ddlStatus':
                        courseTemplateFilterSearch.status = Number(optionSelected.value ? optionSelected.value : undefined);
                        break;
                }
                this.setState({
                    courseTemplateFilterSearch: courseTemplateFilterSearch,
                    isDepartmentSelected: isDepartment
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChangeFilter.name, e));
        }
    };

    private onSearchCourses = (): void => {
        try {
            const {
                courseTemplateFilterSearch,
                courseTemplateId,
                pageAssign,
                rowsPerPage
            } = this.state;

            if (courseTemplateId) {
                LayoutActions.setLoading(true);
                courseTemplateFilterSearch.templateId = courseTemplateId;
                Requests.postSearchCourses(courseTemplateFilterSearch, pageAssign, rowsPerPage, this.resolveGetAssignCourses);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearchCourses.name, e));
        }
    };

    private onViewDetailsSection = (id: number): void => {
        try {
            LayoutActions.setLoading(true);
            RequestsSection.getSection(id, false, this.resolveGetSection, this.props.personId);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDetailsSection.name, e));
        }
    };
    // #endregion Assign / View courses

    // #region Options
    private onCancel = (): void => {
        try {
            this.setState({
                errorTemplateName: false,
                existTemplateName: false,
                isAdd: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancel.name, e));
        }
    };

    private onChangePeriod = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                periods
            } = this.state;

            if (periods) {
                if (optionSelected.value) {
                    LayoutActions.setLoading(true);
                    Requests.getTemplates(Number(optionSelected.value), 0, 5, this.resolveGetCourseTemplates);
                }
                this.setState({
                    periodSelected: optionSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onChangeSetup = (): void => {
        try {
            const {
                courseTemplateSetup
            } = this.state;

            if (courseTemplateSetup) {
                LayoutActions.setLoading(true);
                Requests.postSaveTemplate(courseTemplateSetup.assignmentTemplate, this.resolvePostChangeSetup);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSetup.name, e));
        }
    };

    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                courseTemplateSetup
            } = this.state;

            if (event.target.id && courseTemplateSetup) {
                switch (event.target.id) {
                    case 'chkSetDueDates':
                        courseTemplateSetup.assignmentTemplate.isRestrictive = !courseTemplateSetup.assignmentTemplate.isRestrictive;
                        if (!courseTemplateSetup.assignmentTemplate.isRestrictive) {
                            courseTemplateSetup.assignmentTemplate.isDateByAssignmentType = undefined;
                        }
                        else {
                            courseTemplateSetup.assignmentTemplate.isDateByAssignmentType = true;
                        }
                        break;
                    case 'chkWeightActivitiesByType':
                        courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes =
                            !courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes;
                        break;
                    case 'chkUseDefaults':
                        courseTemplateSetup.assignmentTemplate.defaultGradeMapping = !courseTemplateSetup.assignmentTemplate.defaultGradeMapping;
                        break;
                    case 'chkOverallGrades':
                        courseTemplateSetup.assignmentTemplate.automaticOverallGrades =
                            !courseTemplateSetup.assignmentTemplate.automaticOverallGrades;
                        break;
                }
                this.setState({
                    courseTemplateSetup: courseTemplateSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onClickAdd = (): void => {
        try {
            this.setState({
                isAdd: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAdd.name, e));
        }
    };

    private onClickCourseTemplates = (): void => {
        try {
            const {
                page,
                courseTemplates,
                periodSelected,
                rowsPerPage
            } = this.state;

            if (courseTemplates && periodSelected) {
                LayoutActions.setLoading(true);
                courseTemplates.startIndex = page * rowsPerPage;
                courseTemplates.length = rowsPerPage;
                Requests.getTemplates(Number(periodSelected.value), courseTemplates.startIndex,
                    courseTemplates.length, this.resolveGetCourseTemplates);
            }

            this.setState({
                isSetupView: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickCourseTemplates.name, e));
        }
    };

    private onClickDelete = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const id: string[] = event.target.id.split('_');
            this.setState({
                confirmationModal: true,
                courseTemplateName: String(id[2]),
                idToDelete: Number(id[1])
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickDelete.name, e));
        }
    };

    private onClickSetup = (event: any): void => {
        const name: string[] = event.currentTarget.id.split('_');
        try {
            const {
                courseTemplates
            } = this.state;

            if (courseTemplates) {
                const template: any = courseTemplates.courseTemplates.find(x => x.templateId === Number(name[1]));
                LayoutActions.setLoading(true);
                Requests.getTemplate(Number(name[1]), this.resolveGetCourseTemplate);

                this.setState({
                    courseTemplateId: Number(name[1]),
                    courseTemplateName: String(name[2]),
                    templateHasActivities: template.hasActivities,
                    templateIsAssignedByUser: template.isAssignedByUser
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickSetup.name, e));
        }
    };

    private onCloseAddModal = (): void => {
        try {
            this.setState({
                errorTemplateName: false,
                existTemplateName: false,
                isAdd: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAddModal.name, e));
        }
    };

    private onCloseDeleteConfirmModal = (): void => {
        try {
            this.setState({
                confirmationAssignedModal: false,
                confirmationModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteConfirmModal.name, e));
        }
    };

    private onDeleteConfirm = (): void => {
        try {
            const {
                idToDelete
            } = this.state;
            LayoutActions.setLoading(true);
            Requests.postDeleteTemplate(idToDelete, this.resolvePostDeleteTemplate);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteConfirm.name, e));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                courseTemplateSetup
            } = this.state;

            if (id && courseTemplateSetup) {
                switch (id) {
                    case 'ddlSetDueDatesBy':
                        courseTemplateSetup.assignmentTemplate.isDateByAssignmentType = Boolean(optionSelected.value);
                        break;
                    case 'ddlWeightActivities':
                        courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod = Number(optionSelected.value);
                }
                this.setState({
                    courseTemplateSetup: courseTemplateSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onSaveTemplate = (): void => {
        try {
            const {
                courseTemplateAdd,
                periodSelected
            } = this.state;

            if (periodSelected && courseTemplateAdd.name) {
                LayoutActions.setLoading(true);
                courseTemplateAdd.sessionPeriodId = Number(periodSelected.value);
                Requests.postSaveTemplate(courseTemplateAdd, this.resolvePostSaveTemplate);
                this.setState({
                    errorTemplateName: false,
                    existTemplateName: false
                });
            }
            else {
                this.setState({
                    errorTemplateName: true,
                    existTemplateName: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveTemplate.name, e));
        }
    };

    private onTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                courseTemplateAdd
            } = this.state;

            courseTemplateAdd.name = event.target.value;
            this.setState({
                courseTemplateAdd: courseTemplateAdd,
                errorTemplateName: false,
                existTemplateName: false
            });

        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };
    // #endregion Options

    // #region Templates
    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                courseTemplates,
                countTemplates,
                shareTemplates
            } = this.state;

            if (event.target.id && courseTemplates) {
                let isIndeterminate: boolean = false;
                let checkboxHeader: boolean = true;
                let shareTemplate: ICourseTemplatesSettings[] = shareTemplates;
                let countTemplate: number = countTemplates;
                const id: string[] = event.target.id.split('_');
                courseTemplates.courseTemplates[Number(id[2])].checked = !courseTemplates.courseTemplates[Number(id[2])].checked;
                if (courseTemplates.courseTemplates.findIndex(s => s.checked === false
                    || s.checked === undefined) !== -1) {
                    checkboxHeader = false;
                }
                const templateDisabled: ICourseTemplatesSettings[] = courseTemplates.courseTemplates.filter(t => t.userIsOwner === false);
                if (courseTemplates.courseTemplates[Number(id[2])].checked) {
                    countTemplate++;
                    shareTemplate.push(courseTemplates.courseTemplates[Number(id[2])]);
                }
                else {
                    shareTemplate.splice(Number(id[2]) - 1, 1);
                    countTemplate--;
                }
                if (courseTemplates.courseTemplates.length - templateDisabled.length !== countTemplate && countTemplate !== 0) {
                    isIndeterminate = true;
                }
                else {
                    checkboxHeader = countTemplate !== 0
                }
                this.setState({
                    checkboxHeader: checkboxHeader,
                    countTemplates: countTemplate,
                    isIndeterminate: isIndeterminate,
                    courseTemplates: courseTemplates,
                    shareTemplates: shareTemplate
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeCheckboxHeader = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                courseTemplates,
                countTemplates,
                isIndeterminate
            } = this.state;

            if (event.target.id && courseTemplates) {
                let chkboxHeader: boolean = event.target.checked;
                let countTemplate: number = countTemplates;
                let shareTemplate: ICourseTemplatesSettings[] = [];
                if (isIndeterminate) {
                    chkboxHeader = false;
                }

                courseTemplates.courseTemplates.forEach(template => {
                    if (chkboxHeader) {
                        if (template.userIsOwner) {
                            countTemplate++;
                            template.checked = chkboxHeader;
                            shareTemplate.push(template);
                        }
                    }
                    else {
                        if (template.userIsOwner) {
                            countTemplate--;
                            template.checked = chkboxHeader;
                        }
                        shareTemplate = [];
                    }
                });
                this.setState({
                    checkboxHeader: chkboxHeader,
                    countTemplates: countTemplate,
                    courseTemplates: courseTemplates,
                    isIndeterminate: false,
                    shareTemplates: shareTemplate
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckboxHeader.name, e));
        }
    };

    private onClickDeleteShared = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            let idName: string[] = event.target.id.split('_');
            this.setState({
                assignmentTemplateShareDelete: Number(idName[1]),
                assignmentTemplateShareName: String(idName[2]),
                isSharedWith: false,
                confirmationDeleteSharedModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickDeleteShared.name, e));
        }
    };

    private onClickShare = (): void => {
        try {
            this.setState({
                isPeopleSearch: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickShare.name, e));
        }
    }

    private onChangePerson = (): void => {
        try {
            PeopleSearchActions.setEmptySearch();
            this.setState({
                isPeopleSearch: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePerson.name, e));
        }
    }

    private onCloseSearch = (): void => {
        try {
            PeopleSearchActions.setEmptySearch();
            this.setState({
                activeStep: 0,
                numSteps: 2,
                isPeopleSearch: false,
                stepErrors: [false, false]
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSearch.name, e));
        }
    }

    private onCloseSharedModal = (): void => {
        try {
            this.setState({
                isSharedWith: false,
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSharedModal.name, e));
        }
    }

    private onCloseConfirmationSharedModal = (): void => {
        try {
            this.setState({
                confirmationDeleteSharedModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseConfirmationSharedModal.name, e));
        }
    }

    private onConfirmationDeleteShareModal = (): void => {
        try {
            const {
                assignmentTemplateShareDelete
            } = this.state;
            LayoutActions.showPageLoader();
            Requests.postDeleteAssignmentShare(Number(assignmentTemplateShareDelete), this.resolvePostDeleteTemplateShare);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onConfirmationDeleteShareModal.name, e));
        }
    }

    private onFinishShare = (): void => {
        try {
            const {
                selectedPerson,
                shareTemplates
            } = this.state;
            PeopleSearchActions.setEmptySearch();
            let assignmentTemplateHeaders: number[] = [];
            shareTemplates.forEach(template => {
                assignmentTemplateHeaders.push(template.templateId);
            });
            LayoutActions.showPageLoader();
            Requests.postCreateShare(assignmentTemplateHeaders, Number(selectedPerson?.personId), this.resolvePostCreateShare);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSearch.name, e));
        }
    }

    private onSharedWith = (assignmentTemplateHeaderId: number): void => {
        try {
            LayoutActions.showPageLoader();
            Requests.postShareList(assignmentTemplateHeaderId, this.resolvePostShareList);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSharedWith.name, e));
        }
    }

    private onSelect = (): void => {
        const person: IPeopleSearchModel | undefined = PeopleSearchStore.getSelectedPerson();
        this.setState({
            selectedOption: undefined,
            selectedPerson: person,
        });
    };
    // #endregion Templates

    // #region Stepper
    private onClickStep = (event: any): void => {
        try {
            const {
                numSteps
            } = this.state;

            const positionParts: string[] = event.currentTarget.id.split('_');
            const position: number = Number(positionParts[1]);
            if (position >= 0 && position <= numSteps) {
                this.setState({
                    activeStep: position
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickStep.name, e));
        }
    };
    // #endregion Stepper

    // #region Add activities
    private onChangeDropDownAdd = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            let optionsSelected: ICourseTemplateAddActivities | undefined;
            optionsSelected = this.state.addActivityItems;
            if (optionsSelected) {
                optionsSelected.assignmentTypeId = Number(optionSelected.value);
                this.setState({
                    addActivityItems: optionsSelected,
                    isActivityTypeRequired: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropDownAdd.name, e));
        }
    };

    private onChangeTextFieldModalAdd = (event: any): void => {
        try {
            const textFieldValue: ICourseTemplateAddActivities = { ...this.state.addActivityItems };
            const idSelected: string = event.target.id;

            if (idSelected === 'txtMidtermWeight' || idSelected === 'txtFinalWeight') {
                if (textFieldValue && event.target.value.match(/^[0-9.\b]*$/g) && event.target.value <= 999) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        addActivityItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else if (idSelected === 'txtPossiblePoints') {
                if (textFieldValue && event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 99999) {
                    const value: any = event.target.value.split('.');
                    if (value[1]) {
                        if (value[1].length <= 2) {
                            textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                        }
                    }
                    else {
                        textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    }

                    this.setState({
                        addActivityItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else {
                if (textFieldValue) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        addActivityItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldModalAdd.name, e));
        }
    };

    private onCheckboxChangeAdd = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                addActivityItems
            } = this.state;

            const checked: boolean = event.target.checked;
            if (event.target.id) {
                switch (event.target.id) {
                    case 'chkCountsTowardFinal':
                        addActivityItems.countsForFinal = checked;
                        checked ? addActivityItems.finalWeight = 1 : addActivityItems.finalWeight = 0;
                        break;
                    case 'chkExtraCredit':
                        addActivityItems.isExtraCredit = checked;
                        break;
                    case 'chkCountsTowardMidterm':
                        addActivityItems.countsForMidterm = checked;
                        checked ? addActivityItems.midtermWeight = 1 : addActivityItems.midtermWeight = 0;
                        break;
                }

                this.setState({
                    addActivityItems: addActivityItems
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChangeAdd.name, e));
        }
    };

    private onClickAddActivities = (): void => {
        try {
            Requests.getGradeActivity(this.resolveGetGradeActivity);
            this.setState({
                isAddActivities: true,
                isEditActivity: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAddActivities.name, e));
        }
    };

    private onCloseAddActivities = (): void => {
        try {
            this.setState({
                isAddActivities: false,
                isEditActivity: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAddActivities.name, e));
        }
    };

    private onDateTimeChangeAdd = (date: string, id: string, _isValid: boolean): void => {
        try {
            let optionsSelected: IAssignments | undefined;
            optionsSelected = this.state.addActivityItems;
            if (optionsSelected) {
                if (id === 'dtpAssigned') {
                    optionsSelected.assignedDate = date;
                    optionsSelected.isAssignedDateChanged = true;
                }
                else {
                    optionsSelected.dueDate = date;
                    optionsSelected.isdueDateChanged = true;
                }

                this.setState({
                    addActivityItems: optionsSelected,
                    isValidDueDate: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDateTimeChangeAdd.name, e));
        }
    };

    private onSaveAddActivity = (): void => {
        try {
            const {
                activityType,
                addActivityItems,
                courseTemplateId,
                cultures
            } = this.state;

            if (!addActivityItems.assignmentTypeId) {
                addActivityItems.assignmentTypeId = activityType;
            }

            if (!addActivityItems.isAssignedDateChanged) {
                addActivityItems.assignedDate = Format.toDatePicker(cultures.shortDatePattern, addActivityItems.assignedDate);
            }

            if (!addActivityItems.isdueDateChanged) {
                addActivityItems.dueDate = Format.toDatePicker(cultures.shortDatePattern, addActivityItems.dueDate);
            }

            addActivityItems.isAssignedDateChanged = false;
            addActivityItems.isdueDateChanged = false;

            if (addActivityItems.assignedDate === '') {
                addActivityItems.assignedDate = undefined;
            }

            if (addActivityItems.dueDate === '') {
                addActivityItems.dueDate = undefined;
            }

            if (!addActivityItems.possiblePoints) {
                addActivityItems.possiblePoints = undefined;
            }

            if (addActivityItems && addActivityItems.assignmentTitle && addActivityItems.assignmentTypeId && courseTemplateId) {
                if (addActivityItems.possiblePoints) {
                    if (addActivityItems.possiblePoints <= 99999) {
                        LayoutActions.showPageLoader();
                        Requests.postValidateActivityName(addActivityItems, courseTemplateId, this.resolveIsValidName);
                        this.setState({
                            isActivityTypeRequired: false,
                            isAddActivity: true,
                            isPossiblePoints: false,
                            isTitleRequired: false
                        });
                    }
                    else {
                        this.setState({
                            isActivityTypeRequired: false,
                            isPossiblePoints: true,
                            isTitleRequired: false
                        });
                    }
                }
                else {
                    LayoutActions.showPageLoader();
                    Requests.postValidateActivityName(addActivityItems, courseTemplateId, this.resolveIsValidName);
                    this.setState({
                        isActivityTypeRequired: false,
                        isAddActivity: true,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else if (addActivityItems.assignmentTitle && !addActivityItems.assignmentTypeId) {
                this.setState({
                    isActivityTypeRequired: true,
                    isTitleRequired: false
                });
            }
            else if (!addActivityItems.assignmentTitle && addActivityItems.assignmentTypeId) {
                this.setState({
                    isActivityTypeRequired: false,
                    isTitleRequired: true
                });
            }
            else {
                this.setState({
                    isActivityTypeRequired: true,
                    isTitleRequired: true
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAddActivity.name, e));
        }
    };
    // #endregion Add activities

    // #region Edit activities
    private onChangeDropDownEdit = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            let optionsSelected: ICourseTemplateAddActivities | undefined;
            optionsSelected = this.state.editActivityItems;
            if (optionsSelected) {
                optionsSelected.assignmentTypeId = Number(optionSelected.value);
                this.setState({
                    editActivityItems: optionsSelected,
                    isActivityTypeRequired: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropDownEdit.name, e));
        }
    };

    private onChangeTextFieldModalEdit = (event: any): void => {
        try {
            const textFieldValue: ICourseTemplateAddActivities = { ...this.state.editActivityItems };
            const idSelected: string = event.target.id;

            if (idSelected === 'txtMidtermWeight' || idSelected === 'txtFinalWeight') {
                if (textFieldValue && event.target.value.match(/^[0-9.\b]*$/g) && event.target.value <= 999) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        editActivityItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else if (idSelected === 'txtPossiblePoints') {
                if (textFieldValue && event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 99999) {
                    const value: any = event.target.value.split('.');
                    if (value[1]) {
                        if (value[1].length <= 2) {
                            textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                        }
                    }
                    else {
                        textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    }

                    this.setState({
                        editActivityItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else {
                if (textFieldValue) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        editActivityItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldModalEdit.name, e));
        }
    };

    private onCheckboxChangeEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                editActivityItems
            } = this.state;

            const checked: boolean = event.target.checked;
            if (event.target.id) {
                switch (event.target.id) {
                    case 'chkCountsTowardFinal':
                        editActivityItems.countsForFinal = checked;
                        checked ? editActivityItems.finalWeight = 1 : editActivityItems.finalWeight = 0;
                        break;
                    case 'chkExtraCredit':
                        editActivityItems.isExtraCredit = checked;
                        break;
                    case 'chkCountsTowardMidterm':
                        editActivityItems.countsForMidterm = checked;
                        checked ? editActivityItems.midtermWeight = 1 : editActivityItems.midtermWeight = 0;
                        break;
                }

                this.setState({
                    editActivityItems: editActivityItems
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChangeEdit.name, e));
        }
    };

    private onDateTimeChangeEdit = (date: string, id: string, _isValid: boolean): void => {
        try {
            let optionsSelected: IAssignments | undefined;
            optionsSelected = this.state.editActivityItems;
            if (optionsSelected) {
                if (id === 'dtpAssigned') {
                    optionsSelected.assignedDate = date;
                    optionsSelected.isAssignedDateChanged = true;
                }
                else {
                    optionsSelected.dueDate = date;
                    optionsSelected.isdueDateChanged = true;
                }

                this.setState({
                    editActivityItems: optionsSelected,
                    isValidDueDate: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDateTimeChangeEdit.name, e));
        }
    };

    private onSaveEditActitiy = (): void => {
        try {
            const {
                activityType,
                editActivityItems,
                courseTemplateId,
                cultures
            } = this.state;

            if (!editActivityItems.assignmentTypeId) {
                editActivityItems.assignmentTypeId = activityType;
            }

            if (!editActivityItems.isAssignedDateChanged) {
                editActivityItems.assignedDate = Format.toDatePicker(cultures.shortDatePattern, editActivityItems.assignedDate);
            }

            if (!editActivityItems.isdueDateChanged) {
                editActivityItems.dueDate = Format.toDatePicker(cultures.shortDatePattern, editActivityItems.dueDate);
            }

            editActivityItems.isAssignedDateChanged = false;
            editActivityItems.isdueDateChanged = false;

            if (editActivityItems.assignedDate === '') {
                editActivityItems.assignedDate = undefined;
            }

            if (editActivityItems.dueDate === '') {
                editActivityItems.dueDate = undefined;
            }

            if (!editActivityItems.possiblePoints) {
                editActivityItems.possiblePoints = undefined;
            }

            if (editActivityItems && editActivityItems.assignmentTitle && editActivityItems.assignmentTypeId && courseTemplateId) {
                if (editActivityItems.possiblePoints) {
                    if (editActivityItems.possiblePoints <= 99999) {
                        LayoutActions.showPageLoader();
                        Requests.postValidateActivityName(editActivityItems, courseTemplateId, this.resolveIsValidName);
                        this.setState({
                            isActivityTypeRequired: false,
                            isEditActivity: true,
                            isPossiblePoints: false,
                            isTitleRequired: false
                        });
                    }
                    else {
                        this.setState({
                            isActivityTypeRequired: false,
                            isPossiblePoints: true,
                            isTitleRequired: false
                        });
                    }
                }
                else {
                    LayoutActions.showPageLoader();
                    Requests.postValidateActivityName(editActivityItems, courseTemplateId, this.resolveIsValidName);
                    this.setState({
                        isActivityTypeRequired: false,
                        isEditActivity: true,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else if (editActivityItems.assignmentTitle && !editActivityItems.assignmentTypeId) {
                this.setState({
                    isActivityTypeRequired: true,
                    isTitleRequired: false
                });
            }
            else if (!editActivityItems.assignmentTitle && editActivityItems.assignmentTypeId) {
                this.setState({
                    isActivityTypeRequired: false,
                    isTitleRequired: true
                });
            }
            else {
                this.setState({
                    isActivityTypeRequired: true,
                    isTitleRequired: true
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveEditActitiy.name, e));
        }
    };
    // #endregion Edit activities

    // #region Calculations
    private getCalculations = (): void => {
        try {
            const {
                activitiesSetup,
                courseTemplateSetup
            } = this.state;

            if (courseTemplateSetup && activitiesSetup && activitiesSetup.assignmentTypes) {
                if (courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes) { // Calculate Weight
                    this.calculateWeight();
                }
                else {
                    this.calculate();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.getCalculations.name, e));
        }
    };

    private calculate = (): void => {
        try {
            const {
                activitiesSetup,
                courseTemplateSetup
            } = this.state;
            let countAllMidterm: number = 0;
            let countAllFinal: number = 0;
            if (activitiesSetup && courseTemplateSetup) {
                if (courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 2) {
                    activitiesSetup.assignmentTypes.forEach(items => {
                        items.sectionAssignments.forEach(item => {
                            if (!item.isExtraCredit && item.midtermWeight) {
                                countAllMidterm += Number(item.midtermWeight);
                            }
                            if (!item.isExtraCredit && item.finalWeight) {
                                countAllFinal += Number(item.finalWeight);
                            }
                        });
                    });
                    this.calculatePercentageMidterm(countAllMidterm);
                    this.calculatePercentageFinal(countAllFinal);
                }
                else {
                    activitiesSetup.assignmentTypes.forEach((items, i) => {
                        items.sectionAssignments.forEach((item, j) => {
                            if (item.midtermWeight && !item.isExtraCredit) {
                                countAllMidterm += item.midtermWeight;
                                this.calculatePercentage(item.possiblePoints ? item.possiblePoints : 0, i, j);
                            }
                            else if (item.midtermWeight && item.isExtraCredit) {
                                this.calculatePercentage(item.possiblePoints ? item.possiblePoints : 0, i, j);
                            }
                            else if (item.finalWeight && !item.isExtraCredit) {
                                countAllFinal += items.finalWeight;
                                this.calculatePercentage(item.possiblePoints ? item.possiblePoints : 0, i, j);
                            }
                            else if (item.finalWeight && item.isExtraCredit) {
                                this.calculatePercentage(item.possiblePoints ? item.possiblePoints : 0, i, j);
                            }
                        });
                    });
                }
            }

            this.setState({
                activitiesSetup: activitiesSetup,
                countAllFinal: countAllFinal,
                countAllMidterm: countAllMidterm
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculate.name, e));
        }
    };

    private calculateWeight = (): void => {
        try {
            const {
                activitiesSetup,
                courseTemplateSetup
            } = this.state;

            let midtermWeight: number = 0;
            let finalWeight: number = 0;
            let numMidtermAssignment: number = 0;
            let numFinalAssingment: number = 0;
            let numPossiblePoints: number = 0;
            const totalMidtermAssignment: number[] = [];
            const totalFinalAssignment: number[] = [];
            const totalPossiblePoints: number[] = [];
            let finalPercentage: number = 0;
            let percentage: number = 0;
            const weightTypeValue: number[] = [];
            const weightFinalTypeValue: number[] = [];
            const percentageByType: number[] = [];
            const percentageFinalByType: number[] = [];

            if (activitiesSetup && courseTemplateSetup) {
                activitiesSetup.assignmentTypes.forEach(items => {
                    if (items.midtermWeight) {
                        weightTypeValue.push(items.midtermWeight);
                        midtermWeight += items.midtermWeight;
                    }

                    if (items.finalWeight) {
                        weightFinalTypeValue.push(items.finalWeight);
                        finalWeight += items.finalWeight;
                    }

                    items.sectionAssignments.forEach(item => {
                        if (!item.isExtraCredit && item.midtermWeight) {
                            numMidtermAssignment += 1;
                        }

                        if (!item.isExtraCredit && item.finalWeight) {
                            numFinalAssingment += 1;
                        }

                        if (!item.isExtraCredit && item.possiblePoints) {
                            numPossiblePoints += Number(item.possiblePoints);
                        }
                    });

                    totalMidtermAssignment.push(numMidtermAssignment);
                    totalFinalAssignment.push(numFinalAssingment);
                    totalPossiblePoints.push(numPossiblePoints);
                    numFinalAssingment = 0;
                    numMidtermAssignment = 0;
                    numPossiblePoints = 0;
                });

                weightTypeValue.forEach(weight => {
                    percentage = Number((weight * 100) / midtermWeight);
                    percentageByType.push(percentage);
                });

                weightFinalTypeValue.forEach(weight => {
                    finalPercentage = Number((weight * 100) / finalWeight);
                    percentageFinalByType.push(finalPercentage);
                });

                activitiesSetup.assignmentTypes.forEach((types, i) => {
                    let midTermValue: string = '';
                    let finalValue: string = '';
                    types.sectionAssignments.forEach((assignment, j) => {
                        if (courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 1) {
                            if (!assignment.isExtraCredit && assignment.possiblePoints) {
                                if (activitiesSetup.showMidterm && types.midtermWeight > 0) {
                                    midTermValue =
                                        (Number((types.midtermWeight) * 100 / midtermWeight) *
                                            Number(assignment.possiblePoints)
                                            / Number(totalPossiblePoints[i])).toFixed(2).toString();
                                    activitiesSetup.assignmentTypes[i].sectionAssignments[j].midtermPercentage =
                                        Number(midTermValue);
                                }
                                else {
                                    activitiesSetup.assignmentTypes[i].sectionAssignments[j].midtermPercentage = 0;
                                }
                                if (types.finalWeight > 0) {
                                    finalValue =
                                        (Number((types.finalWeight) * 100 / finalWeight) *
                                            Number(assignment.possiblePoints)
                                            / Number(totalPossiblePoints[i])).toFixed(2).toString();
                                    activitiesSetup.assignmentTypes[i].sectionAssignments[j].finalPercentage =
                                        Number(finalValue);
                                }
                                else {
                                    activitiesSetup.assignmentTypes[i].sectionAssignments[j].finalPercentage = 0;
                                }
                            }
                        }
                        else {
                            if (activitiesSetup.showMidterm && types.midtermWeight > 0) {
                                this.calculatePercentageMidtermByWeight(i);
                            }
                            else {
                                activitiesSetup.assignmentTypes[i].sectionAssignments[j].midtermPercentage = 0;
                            }
                            if (types.finalWeight > 0) {
                                this.caluclatePercentageFinalByWeight(i);
                            }
                            else {
                                activitiesSetup.assignmentTypes[i].sectionAssignments[j].finalPercentage = 0;
                            }
                        }
                    });
                });
            }

            this.setState({
                activitiesSetup: activitiesSetup,
                percentageFinalBytype: percentageFinalByType,
                percentageMidtermBytype: percentageByType
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculateWeight.name, e));
        }
    };

    private calculatePercentageByWeight = (isMidterm: boolean, isByPoints: boolean, index: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let totalMidtermPointsAssignment: number = 0;
            let totalFinalPointsAssignment: number = 0;
            let midtermPercentage: string = '';
            let finalPercentage: string = '';
            let totalMidtermAssignment = 0;
            let totalFinalAssignmnet = 0;
            let totalTypesMidterm: number = 0;
            let totalTypesFinal: number = 0;
            let percentageTypeMidterm: number = 0;
            let percentageTypeFinal: number = 0;

            if (activitiesSetup) {
                if (isByPoints) {
                    activitiesSetup.assignmentTypes.forEach(types => {
                        if (types.midtermWeight) {
                            totalTypesMidterm += 1;
                        }

                        if (types.finalWeight) {
                            totalTypesFinal += 1;
                        }
                    });

                    if (totalTypesFinal > 0) {
                        percentageTypeFinal = 100 / totalTypesFinal;
                    }
                    if (totalTypesMidterm > 0) {
                        percentageTypeMidterm = 100 / totalTypesMidterm;
                    }

                    activitiesSetup.assignmentTypes[index].sectionAssignments.forEach(item => {
                        if (!item.isExtraCredit && item.midtermWeight && item.possiblePoints) {
                            totalMidtermPointsAssignment = Number(totalMidtermPointsAssignment) + Number(item.possiblePoints);
                        }

                        if (!item.isExtraCredit && item.finalWeight && item.possiblePoints) {
                            totalFinalPointsAssignment = Number(totalFinalPointsAssignment) + Number(item.possiblePoints);
                        }
                    });
                    activitiesSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                        if (!assignment.isExtraCredit && assignment.midtermWeight && assignment.possiblePoints) {
                            midtermPercentage =
                                Number((assignment.possiblePoints * percentageTypeMidterm) / totalMidtermPointsAssignment).toFixed(2).toString();
                            assignment.midtermPercentage = Number(midtermPercentage);
                        }

                        if (!assignment.isExtraCredit && assignment.finalWeight && assignment.possiblePoints) {
                            finalPercentage =
                                Number((assignment.possiblePoints * percentageTypeFinal) / totalFinalPointsAssignment).toFixed(2).toString();
                            assignment.finalPercentage = Number(finalPercentage);
                        }
                    });
                }
                else {
                    activitiesSetup.assignmentTypes.forEach(types => {
                        if (isMidterm) {
                            if (types.midtermWeight) {
                                totalTypesMidterm += 1;
                            }
                        }
                        else {
                            if (types.finalWeight) {
                                totalTypesFinal += 1;
                            }
                        }
                    });

                    if (isMidterm) {
                        percentageTypeMidterm = 100 / totalTypesMidterm;
                        activitiesSetup.assignmentTypes[index].sectionAssignments.forEach(item => {
                            if (!item.isExtraCredit && item.midtermWeight) {
                                totalMidtermAssignment += 1;
                            }
                        });
                        activitiesSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                            if (!assignment.isExtraCredit && assignment.midtermWeight) {
                                midtermPercentage = (Number((1 * percentageTypeMidterm) / totalMidtermAssignment).toFixed(2)).toString();
                                assignment.midtermPercentage = Number(midtermPercentage);
                            }
                        });
                    }
                    else {
                        percentageTypeFinal = 100 / totalTypesFinal;
                        activitiesSetup.assignmentTypes[index].sectionAssignments.forEach(item => {
                            if (!item.isExtraCredit && item.finalWeight) {
                                totalFinalAssignmnet += 1;
                            }
                        });
                        activitiesSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                            if (!assignment.isExtraCredit && assignment.midtermWeight) {
                                finalPercentage = (Number((1 * percentageTypeFinal) / totalFinalAssignmnet).toFixed(2)).toString();
                                assignment.finalPercentage = Number(finalPercentage);
                            }
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentageByWeight.name, e));
        }
    };

    private caluclatePercentageFinalByWeight = (index: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let percentageFinalWeight: string = '';
            let percentageTypeFinal: number = 0;
            let totalTypesFinal: number = 0;
            let totalFinalAssignment: number = 0;

            if (activitiesSetup) {
                activitiesSetup.assignmentTypes.forEach(type => {
                    if (type.finalWeight) {
                        totalTypesFinal += 1;
                    }
                });

                percentageTypeFinal = 100 / totalTypesFinal;
                activitiesSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                    if (!assignment.isExtraCredit && assignment.finalWeight) {
                        totalFinalAssignment += Number(assignment.finalWeight);
                    }
                });

                activitiesSetup.assignmentTypes[index].sectionAssignments.forEach((item, i) => {
                    if (!item.isExtraCredit && item.finalWeight) {
                        percentageFinalWeight =
                            (Number((item.finalWeight * percentageTypeFinal) / totalFinalAssignment).toFixed(2)).toString();
                        activitiesSetup.assignmentTypes[index].sectionAssignments[i].finalPercentage =
                            Number(percentageFinalWeight);
                    }
                });

                this.setState({
                    activitiesSetup: activitiesSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.caluclatePercentageFinalByWeight.name, e));
        }
    };

    private calculatePercentageMidtermByWeight = (index: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let percentageMidtermWeight: string = '';
            let percentageTypeMidterm: number = 0;
            let totalTypesMidterm: number = 0;
            let totalMidtermAssignment: number = 0;

            if (activitiesSetup) {
                activitiesSetup.assignmentTypes.forEach(type => {
                    if (type.midtermWeight) {
                        totalTypesMidterm += 1;
                    }
                });

                percentageTypeMidterm = 100 / totalTypesMidterm;
                activitiesSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                    if (!assignment.isExtraCredit && assignment.midtermWeight) {
                        totalMidtermAssignment += Number(assignment.midtermWeight);
                    }
                });

                activitiesSetup.assignmentTypes[index].sectionAssignments.forEach((item, i) => {
                    if (!item.isExtraCredit && item.midtermWeight) {
                        percentageMidtermWeight =
                            (Number((item.midtermWeight * percentageTypeMidterm) / totalMidtermAssignment).toFixed(2)).toString();
                        activitiesSetup.assignmentTypes[index].sectionAssignments[i].midtermPercentage =
                            Number(percentageMidtermWeight);
                    }
                });

                this.setState({
                    activitiesSetup: activitiesSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentageMidtermByWeight.name, e));
        }
    };

    private calculatePercentage = (value: number, index: number, subIndex: number): void => {
        try {
            const {
                activitiesSetup,
                courseTemplateSetup
            } = this.state;

            let percentageMidterm: number = 0;
            let percentageFinal: number = 0;
            let midtermMaxDrop: number = 0;
            let finalMaxDrop: number = 0;

            if (activitiesSetup && courseTemplateSetup) {
                switch (courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod) {
                    case 1:
                        percentageMidterm = Number((value * 100) /
                            Number(activitiesSetup.totalMidtermPoints));
                        percentageFinal = Number((value * 100) /
                            Number(activitiesSetup.totalFinalPoints));
                        activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].midtermPercentage =
                            Number(percentageMidterm.toFixed(2).toString());
                        activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].finalPercentage =
                            Number(percentageFinal.toFixed(2).toString());
                        break;

                    case 3:
                        activitiesSetup.assignmentTypes.forEach(item => {
                            midtermMaxDrop += item.midtermMaxDrop;
                            finalMaxDrop += item.finalMaxDrop;
                        });
                        percentageMidterm = Number(100 / midtermMaxDrop);
                        percentageFinal = Number(100 / finalMaxDrop);
                        activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].midtermPercentage =
                            Number(percentageMidterm.toFixed(2).toString());
                        activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].finalPercentage =
                            Number(percentageFinal.toFixed(2).toString());
                        break;
                }

            }

            this.setState({
                activitiesSetup: activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentage.name, e));
        }
    };

    private calculatePercentageFinal = (totalFinal: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let percentageFinal: number = 0;

            if (activitiesSetup) {
                activitiesSetup.assignmentTypes.forEach((items, i) => {
                    items.sectionAssignments.forEach((item, j) => {
                        if (item.finalWeight) {
                            percentageFinal = Number((100 / totalFinal) * item.finalWeight);
                            activitiesSetup.assignmentTypes[i].sectionAssignments[j].finalPercentage = Number(percentageFinal.toFixed(2).toString());
                        }
                    });
                });
            }

            this.setState({
                activitiesSetup: activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentageFinal.name, e));
        }
    };

    private calculatePercentageMidterm = (totalMidterm: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let percentageMidterm: number = 0;

            if (activitiesSetup) {
                activitiesSetup.assignmentTypes.forEach((items, i) => {
                    items.sectionAssignments.forEach((item, j) => {
                        if (item.midtermWeight) {
                            percentageMidterm = Number((100 / totalMidterm) * item.midtermWeight);
                            activitiesSetup.assignmentTypes[i].sectionAssignments[j].midtermPercentage =
                                Number(percentageMidterm.toFixed(2).toString());
                        }
                    });
                });
            }

            this.setState({
                activitiesSetup: activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentageMidterm.name, e));
        }
    };
    // #endregion Calculations

    // #region Activities
    private onBlurTextField = (event: any): void => {
        try {
            const {
                activitiesSetup,
                courseTemplateSetup
            } = this.state;

            if (activitiesSetup && courseTemplateSetup) {
                const index: string[] = event.target.id.split('_');
                let possiblePoints: number = 0;
                let totalMidterm: number = 0;
                let totalFinal: number = 0;

                switch (index[0]) {
                    case 'txtWeightMidterm':
                        activitiesSetup.assignmentTypes[index[1]].midtermWeight = Number(event.target.value);
                        this.calculateWeight();
                        break;
                    case 'txtWeightFinal':
                        activitiesSetup.assignmentTypes[index[1]].finalWeight = Number(event.target.value);
                        this.calculateWeight();
                        break;
                    case 'txtPossiblePoints':
                        if (!activitiesSetup.assignmentTypes[index[1]]
                            .sectionAssignments[index[2]].isExtraCredit && courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 1) {
                            if (activitiesSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].midtermWeight ||
                                activitiesSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].finalWeight) {
                                if (courseTemplateSetup && courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes) {
                                    if (activitiesSetup.assignmentTypes[0].midtermWeight > 0) {
                                        this.calculatePercentageByWeight(true, true, Number(index[1]));
                                    }
                                    if (activitiesSetup.assignmentTypes[0].finalWeight > 0) {
                                        this.calculatePercentageByWeight(false, true, Number(index[1]));
                                    }
                                }
                                else {
                                    activitiesSetup.assignmentTypes.forEach(assignment => {
                                        assignment.sectionAssignments.forEach(item => {
                                            if (item.possiblePoints && !item.isExtraCredit) {
                                                if (item.midtermWeight || item.finalWeight) {
                                                    possiblePoints += Number(item.possiblePoints);
                                                }
                                            }
                                        });
                                    });
                                    activitiesSetup.totalMidtermPoints = possiblePoints.toFixed(2).toString();
                                    activitiesSetup.totalFinalPoints = possiblePoints.toFixed(2).toString();
                                    activitiesSetup.assignmentTypes.forEach((assignment, i) => {
                                        assignment.sectionAssignments.forEach((item, j) => {
                                            if (item.possiblePoints) {
                                                this.calculatePercentage(item.possiblePoints, i, j);
                                            }
                                        });
                                    });
                                }
                            }

                            this.setState({
                                activitiesSetup: activitiesSetup
                            });
                        }
                        break;

                    case 'txtCountsTowardMidterm':
                        if (courseTemplateSetup && courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes) {
                            if (activitiesSetup.assignmentTypes[0].midtermWeight > 0) {
                                this.calculatePercentageMidtermByWeight(Number(index[1]));
                            }
                        }
                        else {
                            activitiesSetup.assignmentTypes.forEach(items => {
                                items.sectionAssignments.forEach(item => {
                                    if (!item.isExtraCredit && item.midtermWeight) {
                                        totalMidterm += Number(item.midtermWeight);
                                    }
                                });
                            });
                            this.calculatePercentageMidterm(totalMidterm);
                        }
                        break;

                    case 'txtCountsTowardFinal':
                        if (courseTemplateSetup && courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes) {
                            if (activitiesSetup.assignmentTypes[0].finalWeight > 0) {
                                this.caluclatePercentageFinalByWeight(Number(index[1]));
                            }
                        }
                        else {
                            activitiesSetup.assignmentTypes.forEach(items => {
                                items.sectionAssignments.forEach(item => {
                                    if (!item.isExtraCredit && item.finalWeight) {
                                        totalFinal += Number(item.finalWeight);
                                    }
                                });
                            });
                            this.calculatePercentageFinal(totalFinal);
                        }
                        break;
                }

            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurTextField.name, e));
        }
    };

    private onChangeDateTime = (date: string, id: string, isValid: boolean): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);
            if (isValid) {
                if (activitiesSetup) {
                    activitiesSetup.assignmentTypes[row].endDate = date;
                    this.setState({
                        activitiesSetup: activitiesSetup,
                        showMessageDueDate: false
                    });
                }
            }
            else {
                if (activitiesSetup) {
                    activitiesSetup.assignmentTypes[row].endDate = '';
                    this.setState({
                        activitiesSetup: activitiesSetup
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDateTime.name, e));
        }
    };

    private onCheckboxChangeActivity = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                activitiesSetup,
                countAllFinal,
                countAllMidterm,
                courseTemplateSetup
            } = this.state;

            let countMidterm: number = 0;
            let countFinal: number = 0;
            const checked: boolean = event.target.checked;
            if (activitiesSetup) {
                const index: string[] = event.target.id.split('_');
                switch (index[0]) {
                    case 'chkCountsTowardMidterm':
                        checked ? activitiesSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].midtermWeight = 1
                            : activitiesSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].midtermWeight = 0;
                        if (!activitiesSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].isExtraCredit) {
                            checked ? activitiesSetup.assignmentTypes[index[1]].midtermMaxDrop += 1 :
                                activitiesSetup.assignmentTypes[index[1]].midtermMaxDrop -= 1;
                            checked ?
                                activitiesSetup.totalMidtermPoints =
                                (Number(activitiesSetup.totalMidtermPoints) +
                                    Number(activitiesSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints)).toFixed(2).toString()
                                :
                                activitiesSetup.totalMidtermPoints =
                                (Number(activitiesSetup.totalMidtermPoints) -
                                    Number(activitiesSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints)).toFixed(2).toString();

                            if (courseTemplateSetup && courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes
                                && courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 1) {
                                this.calculatePercentageByWeight(false, true, Number(index[1]));
                            }
                            else if (courseTemplateSetup && courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes
                                && courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod !== 1) {
                                this.calculatePercentageByWeight(true, false, Number(index[1]));
                            }
                            else {
                                activitiesSetup.assignmentTypes.forEach((items, i) => {
                                    items.sectionAssignments.forEach((item, j) => {
                                        if (item.possiblePoints) {
                                            this.calculatePercentage(item.possiblePoints, Number(i), Number(j));
                                        }
                                    });
                                });
                            }
                        }
                        checked ? countMidterm += countAllMidterm : countMidterm -= countAllMidterm;
                        break;
                    case 'chkCountsTowardFinal':
                        checked ? activitiesSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].finalWeight = 1
                            : activitiesSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].finalWeight = 0;
                        if (!activitiesSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].isExtraCredit) {
                            checked ? activitiesSetup.assignmentTypes[index[1]].finalMaxDrop += 1 :
                                activitiesSetup.assignmentTypes[index[1]].finalMaxDrop -= 1;
                            checked ?
                                activitiesSetup.totalFinalPoints =
                                (Number(activitiesSetup.totalFinalPoints) +
                                    Number(activitiesSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints)).toFixed(2).toString()
                                :
                                activitiesSetup.totalFinalPoints =
                                (Number(activitiesSetup.totalFinalPoints) -
                                    Number(activitiesSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints)).toFixed(2).toString();

                            if (courseTemplateSetup && courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes
                                && courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 1) {
                                this.calculatePercentageByWeight(false, true, Number(index[1]));
                            }
                            else if (courseTemplateSetup && courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes
                                && courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod !== 1) {
                                this.calculatePercentageByWeight(false, false, Number(index[1]));
                            }
                            else {
                                activitiesSetup.assignmentTypes.forEach((items, i) => {
                                    items.sectionAssignments.forEach((item, j) => {
                                        if (item.possiblePoints) {
                                            this.calculatePercentage(item.possiblePoints, Number(i), Number(j));
                                        }
                                    });
                                });
                            }
                        }
                        checked ? countFinal += countAllFinal : countFinal -= countAllFinal;
                        break;
                }

                this.setState({
                    activitiesSetup: activitiesSetup,
                    countAllFinal: countFinal,
                    countAllMidterm: countMidterm
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChangeActivity.name, e));
        }
    };

    private onConfirmDeleteAllActivities = (): void => {
        try {
            const {
                courseTemplateId
            } = this.state;
            LayoutActions.showPageLoader();
            Requests.postDeleteAllActivities(Number(courseTemplateId), this.resolvePostDeleteAllActivities);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onConfirmDeleteAllActivities.name, e));
        }
    }

    private onCloseCopyModal = (): void => {
        try {
            this.setState({
                copyAssignments: undefined,
                isCopyActivities: false,
                isFinishCopy: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseCopyModal.name, e));
        }
    }

    private onCloseDeleteAllConfirmModal = (): void => {
        try {
            this.setState({
                confirmDeleteActivity: false,
                confirmationDeleteAll: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteAllConfirmModal.name, e));
        }
    }

    private onConfirmDeleteActivity = (): void => {
        try {
            const {
                idActivity
            } = this.state;
            LayoutActions.showPageLoader();
            Requests.postDeleteActivity(Number(idActivity), this.resolvePostDeleteActivity);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onConfirmDeleteActivity.name, e));
        }
    }

    private onCopyActivities = (): void => {
        try {
            const {
                courseTemplateId,
                periodSelected
            } = this.state;
            if (courseTemplateId) {
                LayoutActions.showPageLoader();
                Requests.getTemplateOptions(Number(periodSelected?.value), courseTemplateId, this.resolvePostTemplateOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCopyActivities.name, e));
        }
    }

    private onDeleteActivity = (id: number, name: string): void => {
        try {
            this.setState({
                activityName: name,
                confirmDeleteActivity: true,
                idActivity: id
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteActivity.name, e));
        }
    };

    private onDeleteAllActivities = (): void => {
        try {
            this.setState({
                confirmationDeleteAll: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAllActivities.name, e));
        }
    };

    private onDropdownChangeCopy = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                courseTemplateId
            } = this.state;
            if (id) {
                switch (id) {
                    case 'ddlPeriod':
                        if (Number(optionSelected.value) > 0) {
                            Requests.getTemplateOptions(Number(optionSelected.value), Number(courseTemplateId), this.resolvePostTemplateOptions);
                        }
                        this.setState({
                            copyAssignments: undefined,
                            copyPeriodSelected: Number(optionSelected.value),
                            isLoadingTemplates: true
                        });
                        break;
                    case 'ddlTemplate':
                        if (Number(optionSelected.value) > 0) {
                            LayoutActions.showPageLoader();
                            Requests.getTemplate(Number(optionSelected.value), this.resolveGetAssignments);
                        }
                        this.setState({
                            copyTemplateSelected: Number(optionSelected.value),
                        });
                }

            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChangeCopy.name, e));
        }
    }

    private onEditActivity = (id: number, index: number, subIndex: number, disabled: boolean): void => {
        try {

            const {
                activitiesSetup,
                editActivityItems
            } = this.state;

            if (id && activitiesSetup) {
                Requests.getGradeActivity(this.resolveGetGradeActivity);
                editActivityItems.assignedDate = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].assignedDate;
                editActivityItems.assignmentEndDate = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].assignmentEndDate;
                editActivityItems.assignmentId = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].id;
                editActivityItems.assignmentTitle = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].title;
                editActivityItems.assignmentTypeId = activitiesSetup.assignmentTypes[index].id;
                editActivityItems.countsForFinal = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].countsForFinal;
                editActivityItems.countsForMidterm = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].countsForMidterm;
                editActivityItems.description = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].description;
                editActivityItems.dueDate = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].dueDate;
                editActivityItems.finalWeight = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].finalWeight;
                editActivityItems.midtermWeight = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].midtermWeight;
                editActivityItems.isExtraCredit = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].isExtraCredit;
                editActivityItems.possiblePoints = activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].possiblePoints;
                this.setState({
                    addActivityItems: {},
                    editActivityItems: editActivityItems,
                    isAddActivity: false,
                    isEditActivity: true,
                    isViewActivity: disabled
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditActivity.name, e));
        }
    };

    private onFinishCopyAssignments = (): void => {
        try {
            const {
                courseTemplateId,
                copyTemplateSelected
            } = this.state;
            LayoutActions.showPageLoader();
            Requests.postCopyAssignments(Number(copyTemplateSelected), Number(courseTemplateId), this.resolvePostCopyAssignments);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinishCopyAssignments.name, e));
        }
    }

    private onTextFieldChangeActivities = (event: any): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            if (activitiesSetup) {
                const index: string[] = event.target.id.split('_');
                switch (index[0]) {
                    case 'txtWeightMidterm':
                        if (event.target.value.match(/^[0-9.\b]*$/g) && event.target.value <= 999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.assignmentTypes[index[1]].midtermWeight = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.assignmentTypes[index[1]].midtermWeight = event.target.value;
                            }
                        }
                        break;

                    case 'txtDropLowestMidterm':
                        if (event.target.value.match(/^[0-9\b]*$/g) && event.target.value <= 999) {
                            if (event.target.value === '') {
                                activitiesSetup.assignmentTypes[index[1]].midtermDropLowest = event.target.value;
                            }
                            else {
                                activitiesSetup.assignmentTypes[index[1]].midtermDropLowest = Number(event.target.value);
                                if (activitiesSetup.assignmentTypes[index[1]].midtermDropLowest !== 0 &&
                                    activitiesSetup.assignmentTypes[index[1]].midtermDropLowest !== '') {
                                    activitiesSetup.assignmentTypes[index[1]].isMidtermDrop = true;
                                }
                                else {
                                    if (activitiesSetup.assignmentTypes[index[1]].midtermDropHighest !== 0 &&
                                        activitiesSetup.assignmentTypes[index[1]].midtermDropHighest !== '') {
                                        activitiesSetup.assignmentTypes[index[1]].isMidtermDrop = true;
                                    }
                                    else {
                                        activitiesSetup.assignmentTypes[index[1]].isMidtermDrop = false;
                                    }
                                }
                            }
                        }
                        break;

                    case 'txtDropHighestMidterm':
                        if (event.target.value.match(/^[0-9\b]*$/g) && event.target.value <= 999) {
                            if (event.target.value === '') {
                                activitiesSetup.assignmentTypes[index[1]].midtermDropHighest = event.target.value;
                            }
                            else {
                                activitiesSetup.assignmentTypes[index[1]].midtermDropHighest = Number(event.target.value);
                                if (activitiesSetup.assignmentTypes[index[1]].midtermDropHighest !== 0 &&
                                    activitiesSetup.assignmentTypes[index[1]].midtermDropHighest !== '') {
                                    activitiesSetup.assignmentTypes[index[1]].isMidtermDrop = true;
                                }
                                else {
                                    if (activitiesSetup.assignmentTypes[index[1]].midtermDropLowest !== 0 &&
                                        activitiesSetup.assignmentTypes[index[1]].midtermDropLowest !== '') {
                                        activitiesSetup.assignmentTypes[index[1]].isMidtermDrop = true;
                                    }
                                    else {
                                        activitiesSetup.assignmentTypes[index[1]].isMidtermDrop = false;
                                    }
                                }
                            }
                        }
                        break;

                    case 'txtWeightFinal':
                        if (event.target.value.match(/^[0-9.\b]*$/g) && event.target.value <= 999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.assignmentTypes[index[1]].finalWeight = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.assignmentTypes[index[1]].finalWeight = event.target.value;
                            }
                        }
                        break;

                    case 'txtDropLowestFinal':
                        if (event.target.value.match(/^[0-9\b]*$/g) && event.target.value <= 999) {
                            if (event.target.value === '') {
                                activitiesSetup.assignmentTypes[index[1]].finalDropLowest = event.target.value;
                            }
                            else {
                                activitiesSetup.assignmentTypes[index[1]].finalDropLowest = Number(event.target.value);
                                if (activitiesSetup.assignmentTypes[index[1]].finalDropLowest !== 0 &&
                                    activitiesSetup.assignmentTypes[index[1]].finalDropLowest !== '') {
                                    activitiesSetup.assignmentTypes[index[1]].isFinalDrop = true;
                                }
                                else {
                                    if (activitiesSetup.assignmentTypes[index[1]].finalDropHighest !== 0 &&
                                        activitiesSetup.assignmentTypes[index[1]].finalDropHighest !== '') {
                                        activitiesSetup.assignmentTypes[index[1]].isFinalDrop = true;
                                    }
                                    else {
                                        activitiesSetup.assignmentTypes[index[1]].isFinalDrop = false;
                                    }
                                }
                            }
                        }
                        break;

                    case 'txtDropHighestFinal':
                        if (event.target.value.match(/^[0-9\b]*$/g) && event.target.value <= 999) {
                            if (event.target.value === '') {
                                activitiesSetup.assignmentTypes[index[1]].finalDropHighest = event.target.value;
                            }
                            else {
                                activitiesSetup.assignmentTypes[index[1]].finalDropHighest = Number(event.target.value);
                                if (activitiesSetup.assignmentTypes[index[1]].finalDropHighest !== 0 &&
                                    activitiesSetup.assignmentTypes[index[1]].finalDropHighest !== '') {
                                    activitiesSetup.assignmentTypes[index[1]].isFinalDrop = true;
                                }
                                else {
                                    if (activitiesSetup.assignmentTypes[index[1]].finalDropLowest !== 0 &&
                                        activitiesSetup.assignmentTypes[index[1]].finalDropLowest !== '') {
                                        activitiesSetup.assignmentTypes[index[1]].isFinalDrop = true;
                                    }
                                    else {
                                        activitiesSetup.assignmentTypes[index[1]].isFinalDrop = false;
                                    }
                                }
                            }
                        }
                        break;

                    case 'txtPossiblePoints':
                        if (event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 99999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.assignmentTypes[index[1]]
                                    .sectionAssignments[index[2]].possiblePoints = event.target.value;
                            }
                        }
                        break;

                    case 'txtCountsTowardMidterm':
                        if (event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].midtermWeight = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.assignmentTypes[index[1]]
                                    .sectionAssignments[index[2]].midtermWeight = event.target.value;
                            }
                        }
                        break;

                    case 'txtCountsTowardFinal':
                        if (event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].finalWeight = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.assignmentTypes[index[1]]
                                    .sectionAssignments[index[2]].finalWeight = event.target.value;
                            }
                        }
                        break;
                }
            }

            this.setState({
                activitiesSetup: activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChangeActivities.name, e));
        }
    };

    private onSaveActivities = (): void => {
        try {
            const {
                activitiesSetup,
                courseTemplateId,
                cultures,
                saveAssignment,
                saveAssignmentTypes
            } = this.state;

            if (activitiesSetup && courseTemplateId) {
                activitiesSetup.assignmentTypes.forEach(assignments => {
                    saveAssignmentTypes.push(assignments);
                    assignments.sectionAssignments.forEach(assignment => {
                        assignment.assignmentId = courseTemplateId;
                        assignment.assignmentTypeRuleId = assignments.assignmentTypeRuleId;
                        assignment.assignmentTypeId = assignments.id;
                        assignment.assignedDate = Format.toDatePicker(cultures.shortDatePattern, assignment.assignedDate);
                        assignment.assignmentEndDate = Format.toDatePicker(cultures.shortDatePattern, assignment.assignmentEndDate);
                        assignment.dueDate = Format.toDatePicker(cultures.shortDatePattern, assignment.dueDate);

                        if (assignment.assignedDate === '') {
                            assignment.assignedDate = undefined;
                        }

                        if (assignment.assignmentEndDate === '') {
                            assignment.assignmentEndDate = undefined;
                        }

                        if (assignment.dueDate === '') {
                            assignment.dueDate = undefined;
                        }

                        if (!assignment.possiblePoints) {
                            assignment.dueDate = undefined;
                        }

                        saveAssignment.push(assignment);
                    });
                });
                LayoutActions.showPageLoader();
                this.setState({
                    activitiesSetup: activitiesSetup
                });
                Requests.postSaveActivities(saveAssignment, saveAssignmentTypes, this.resolvePostSaveActivities);
            }
        } catch (e) {
            this.logError(LogData.fromException(this.onSaveActivities.name, e));
        }
    };
    // #endregion Activities

    // #region Date Modal
    private onChangeDate = (date: string, _id: string, _isValid: boolean): void => {
        try {
            this.setState({
                dateSelected: date
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDate.name, e));
        }
    };

    private onClearDate = (): void => {
        try {
            const {
                activitiesSetup,
                dateIndex,
                dateKey,
                dateSubIndex
            } = this.state;

            if (activitiesSetup) {
                activitiesSetup.assignmentTypes[dateIndex].sectionAssignments[dateSubIndex].assignmentEndDate = undefined;
                this.setState({
                    activitiesSetup: activitiesSetup,
                    dateKey: dateKey + 1,
                    dateModal: false,
                    dateSelected: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearDate.name, e));
        }
    };

    private onCloseDate = (): void => {
        try {
            this.setState({
                dateModal: false,
                dateSelected: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDate.name, e));
        }
    };

    private onOkDate = (): void => {
        try {
            const {
                activitiesSetup,
                dateIndex,
                cultures,
                dateSubIndex,
                dateSelected
            } = this.state;

            if (activitiesSetup) {
                activitiesSetup.assignmentTypes[dateIndex].sectionAssignments[dateSubIndex].assignmentEndDate =
                    dateSelected ? moment(dateSelected, this.dateFormat)
                        .format(cultures.shortDatePattern.toUpperCase()) : undefined;
                this.setState({
                    activitiesSetup: activitiesSetup,
                    dateModal: false,
                    dateSelected: undefined,
                    showMessageDueDate: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOkDate.name, e));
        }
    };

    private onOpenDate = (index: number, subIndex: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            if (activitiesSetup) {
                this.setState({
                    dateIndex: index,
                    dateKey: 0,
                    dateModal: true,
                    dateSelected: activitiesSetup.assignmentTypes[index].sectionAssignments[subIndex].assignmentEndDate,
                    dateSubIndex: subIndex
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDate.name, e));
        }
    };
    // #endregion Date Modal

    // #region Pagination
    private getRowsPerPageOptions = (maxValue: number): number[] => {
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
    };

    private setContent = (): void => {
        try {
            const {
                page,
                courseTemplates,
                periodSelected,
                rowsPerPage
            } = this.state;

            if (courseTemplates && periodSelected) {
                courseTemplates.startIndex = page * rowsPerPage;
                courseTemplates.length = rowsPerPage;
                Requests.getTemplates(Number(periodSelected.value), courseTemplates.startIndex,
                    courseTemplates.length, this.resolveGetCourseTemplates);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
    };

    private onChangePage = (_event: any, pageNumber: number): void => {
        try {
            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                page: pageNumber
            }, () => {
                LayoutActions.showPageLoader();
                this.setContent();
            });
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

    // #region Assign Pagination
    private setContentAssign = (): void => {
        try {
            const {
                courseTemplateFilterSearch,
                courseTemplateId,
                pageAssign,
                rowsPerPage
            } = this.state;

            if (courseTemplateId) {
                LayoutActions.showPageLoader();
                courseTemplateFilterSearch.startIndex = pageAssign * rowsPerPage;
                courseTemplateFilterSearch.length = rowsPerPage;
                courseTemplateFilterSearch.templateId = courseTemplateId;
                Requests.postSearchCourses(courseTemplateFilterSearch, courseTemplateFilterSearch.startIndex,
                    courseTemplateFilterSearch.length, this.resolveGetAssignCourses);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContentAssign.name, e));
        }
    };

    private onChangePageAssign = (_event: any, pageNumber: number): void => {
        try {
            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                pageAssign: pageNumber
            }, () => {
                LayoutActions.showPageLoader();
                this.setContentAssign();
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePageAssign.name, e));
        }
    };

    private onChangeRowsPerPageAssign = (event: any): void => {
        try {
            this.setState({
                page: 0,
                rowsPerPage: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPageAssign.name, e));
        }
    };
    // #endregion Assign Pagination

    // #region View courses Pagination
    private setContentViewCourses = (): void => {
        try {
            const {
                pageAssignCourses,
                courseTemplateId,
                periodSelected,
                rowsPerPage
            } = this.state;

            if (courseTemplateId && periodSelected) {
                const startIndex: number = pageAssignCourses * rowsPerPage;
                Requests.getAssignedCourses(courseTemplateId, startIndex, rowsPerPage, this.resolveGetAssignedCourses);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContentViewCourses.name, e));
        }
    };

    private onChangePageViewCourses = (_event: any, pageNumber: number): void => {
        try {
            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                pageAssignCourses: pageNumber
            }, () => {
                LayoutActions.setLoading(true);
                this.setContentViewCourses();
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePageViewCourses.name, e));
        }
    };

    private onChangeRowsPerPageViewCourses = (event: any): void => {
        try {
            this.setState({
                page: 0,
                rowsPerPage: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPageViewCourses.name, e));
        }
    };
    // #endregion View courses Pagination

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

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetCourseTemplatesCurrent = (json: string): void => {
        try {
            const {
                courseTemplateId,
                courseTemplateName
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCourseTemplatesCurrent.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    const courseTemplates: ICourseTemplates = result.data;
                    if (courseTemplates && courseTemplateId) {
                        const template: any = courseTemplates.courseTemplates.find(x => x.templateId === courseTemplateId);
                        this.setState({
                            courseTemplateFilterSearch: { classLevelId: undefined, departmentId: undefined, subTypeId: undefined },
                            courseTemplateId: courseTemplateId,
                            courseTemplateName: courseTemplateName,
                            courseTemplates: courseTemplates,
                            isAssignCourses: false,
                            isSetupView: true,
                            isViewCourses: false,
                            sectionAssignments: undefined,
                            templateHasActivities: template.hasActivities,
                            templateIsAssignedByUser: template.isAssignedByUser
                        });
                    }
                    LayoutActions.hidePageLoader();
                }
                else {
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCourseTemplatesCurrent.name, e));
        }
    };

    private resolveGetCourseTemplates = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCourseTemplates.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    const courseTemplates: ICourseTemplates = result.data;
                    const page: number = this.preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(courseTemplates.overallCount);
                    const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                   this.setState({
                        courseTemplates: courseTemplates,
                        isIndeterminate: false,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: rowsPerPageOptions
                    }, () => LayoutActions.hidePageLoader());
                }
                else {
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCourseTemplates.name, e));
        }
    };

    private resolveGetCourseTemplate = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCourseTemplate.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    const activitiesSetup: IActivitiesSetup = result.data.sectionAssignmentSetup;
                    const courseTemplateSetup: ICourseTemplate = result.data;
                    let showMessageDueDate: boolean = false;
                    let oneEndDateHasValue: boolean = false;
                    if (activitiesSetup.assignmentTypes) {
                        activitiesSetup.assignmentTypes.forEach(activity => {
                            if (!activity.endDate && courseTemplateSetup.assignmentTemplate.isDateByAssignmentType
                                && courseTemplateSetup.assignmentTemplate.isRestrictive && !oneEndDateHasValue) {
                                showMessageDueDate = true;
                            }
                            else {
                                oneEndDateHasValue = true;
                            }
                            if (activity.sectionAssignments) {
                                activity.sectionAssignments.forEach(item => {
                                    if ((item.assignmentEndDate === '' || item.assignmentEndDate === undefined) && !courseTemplateSetup.assignmentTemplate.isDateByAssignmentType &&
                                        courseTemplateSetup.assignmentTemplate.isRestrictive && !oneEndDateHasValue) {
                                        showMessageDueDate = true;
                                    }
                                    else {
                                        oneEndDateHasValue = true;
                                    }
                                });
                            }
                            if (activity.midtermDropLowest > 0 || activity.midtermDropHighest > 0) {
                                activity.isMidtermDrop = true;
                            }
                            else {
                                activity.isMidtermDrop = false;
                            }
                            if (activity.finalDropLowest > 0 || activity.finalDropHighest > 0) {
                                activity.isFinalDrop = true;
                            }
                            else {
                                activity.isFinalDrop = false;
                            }
                        });
                    }

                    let validation: ISectionAssignmentValidationResult = result.data.sectionAssignmentValidationResult;

                    this.setState({
                        activitiesSetup: activitiesSetup,
                        copyAssignments: undefined,
                        courseTemplateSetup: courseTemplateSetup,
                        isAssignCourses: false,
                        isMidterm: result.data.midtermGrades,
                        isSetupView: true,
                        isFinishCopy: true,
                        isViewCourses: false,
                        sectionAssignments: undefined,
                        sectionAssignmentValidationResult: validation?.errors ? validation : undefined,
                        showMessageDueDate: showMessageDueDate
                    });
                    this.getCalculations();
                    LayoutActions.hidePageLoader();
                }
                else {
                    LayoutActions.hidePageLoader();
                }
            }
        } catch (e) {
            this.logError(LogData.fromException(this.resolveGetCourseTemplate.name, e));
        }
    };

    private resolveGetAssignments = (json: string): void => {
        try {
            const {
                isCopyActivities
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAssignments.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    const activitiesSetup: IActivitiesSetup = result.data.sectionAssignmentSetup;
                    let assignmentsList: IAssignments[] = [];
                    if (activitiesSetup.assignmentTypes) {
                        if (isCopyActivities) {
                            activitiesSetup.assignmentTypes.forEach(assignments => {
                                let copyActivities: IAssignments = {};
                                assignments.sectionAssignments.forEach(assignment => {
                                    copyActivities = {};
                                    copyActivities.assignmentType = assignments.description;
                                    copyActivities.description = assignment.description;
                                    copyActivities.possiblePoints = assignment.possiblePoints;
                                    copyActivities.title = assignment.title;
                                    assignmentsList.push(copyActivities);
                                });
                            });
                            this.setState({
                                copyAssignments: assignmentsList,
                                isFinishCopy: false
                            });
                        }
                    }
                    LayoutActions.hidePageLoader();
                }
                else {
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAssignments.name, e));
        }
    };

    private resolveGetGradeActivity = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetGradeActivity.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    gradeActivity: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetGradeActivity.name, e));
        }
    };

    private resolveGetPeriods = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    this.setState({
                        periods: result.data
                    }, () => LayoutActions.hidePageLoader());
                }
                else {
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolvePostChangeSetup = (json: string): void => {
        try {
            const {
                courseTemplateId
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostChangeSetup.name, this.hideAllLoaders);
            const resourcesLayout = LayoutStore.getResourcesLayout();
            if (result?.status && resourcesLayout) {
                LayoutActions.hidePageLoader();
                LayoutActions.setAlert({
                    message: resourcesLayout.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);

                if (courseTemplateId) {
                    LayoutActions.showPageLoader();
                    Requests.getTemplate(courseTemplateId, this.resolveGetCourseTemplate);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostChangeSetup.name, e));
        }
    };

    private resolvePostCopyAssignments = (json: string): void => {
        try {
            const {
                courseTemplateId
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostCopyAssignments.name, this.hideAllLoaders);
            const resourcesLayout = LayoutStore.getResourcesLayout();
            if (result?.status && resourcesLayout) {
                LayoutActions.hidePageLoader();
                LayoutActions.setAlert({
                    message: resourcesLayout.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);

                this.setState({
                    isCopyActivities: false,
                });

                if (courseTemplateId) {
                    LayoutActions.showPageLoader();
                    Requests.getTemplate(courseTemplateId, this.resolveGetCourseTemplate);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostCopyAssignments.name, e));
        }
    };

    private resolvePostCreateShare = (json: string): void => {
        try {
            const {
                page,
                courseTemplates,
                rowsPerPage,
                periodSelected
            } = this.state
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostCreateShare.name, this.hideAllLoaders);
            const resourcesLayout = LayoutStore.getResourcesLayout();
            if (result?.status && resourcesLayout) {
                LayoutActions.hidePageLoader();
                LayoutActions.setAlert({
                    message: resourcesLayout.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
                this.setState({
                    activeStep: 0,
                    numSteps: 2,
                    isPeopleSearch: false,
                    stepErrors: [false, false],
                    shareTemplates: []
                });
                if (periodSelected && courseTemplates) {
                    courseTemplates.startIndex = page * rowsPerPage;
                    courseTemplates.length = rowsPerPage;
                    Requests.getTemplates(Number(periodSelected.value), courseTemplates.startIndex,
                        courseTemplates.length, this.resolveGetCourseTemplates);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostCreateShare.name, e));
        }
    }

    private resolvePostShareList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostShareList.name, this.hideAllLoaders);
            if (result?.status) {
                LayoutActions.hidePageLoader();
                this.setState({
                    assignmentTemplateShares: result.data,
                    isSharedWith: true,
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostShareList.name, e));
        }
    };

    private resolvePostDeleteTemplate = (json: string): void => {
        try {
            const {
                page,
                courseTemplates,
                rowsPerPage,
                periodSelected
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteTemplate.name, this.hideAllLoaders);
            const resourcesLayout = LayoutStore.getResourcesLayout();
            if (result?.status && resourcesLayout) {
                LayoutActions.setAlert({
                    message: resourcesLayout.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
                if (periodSelected && courseTemplates) {
                    courseTemplates.startIndex = page * rowsPerPage;
                    courseTemplates.length = rowsPerPage;
                    Requests.getTemplates(Number(periodSelected.value), courseTemplates.startIndex,
                        courseTemplates.length, this.resolveGetCourseTemplates);
                }
                this.setState({
                    confirmationModal: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteTemplate.name, e));
        }
    };

    private resolvePostDeleteTemplateShare = (json: string): void => {
        try {
            const {
                page,
                courseTemplates,
                rowsPerPage,
                periodSelected
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteTemplateShare.name, this.hideAllLoaders);
            const resourcesLayout = LayoutStore.getResourcesLayout();
            if (result?.status && resourcesLayout) {
                LayoutActions.setAlert({
                    message: resourcesLayout.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
                this.setState({
                    confirmationDeleteSharedModal: false
                });
                if (periodSelected && courseTemplates) {
                    courseTemplates.startIndex = page * rowsPerPage;
                    courseTemplates.length = rowsPerPage;
                    Requests.getTemplates(Number(periodSelected.value), courseTemplates.startIndex,
                        courseTemplates.length, this.resolveGetCourseTemplates);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteTemplateShare.name, e));
        }
    };

    private resolvePostSaveTemplate = (json: string): void => {
        try {
            const {
                page,
                courseTemplates,
                rowsPerPage,
                periodSelected
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveTemplate.name, this.hideAllLoaders);
            const resourcesLayout = LayoutStore.getResourcesLayout();
            if (result?.status && resourcesLayout) {
                if (result.data > -1) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                    if (periodSelected && courseTemplates) {
                        courseTemplates.startIndex = page * rowsPerPage;
                        courseTemplates.length = rowsPerPage;
                        LayoutActions.showPageLoader();
                        Requests.getTemplates(Number(periodSelected.value), courseTemplates.startIndex,
                            courseTemplates.length, this.resolveGetCourseTemplates);
                    }
                    this.setState({
                        existTemplateName: false,
                        isAdd: false
                    });
                }
                else {
                    LayoutActions.hidePageLoader();
                    this.setState({
                        existTemplateName: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveTemplate.name, e));
        }
    };

    private resolveLayoutReady = () => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                LayoutActions.hidePageLoader();
                Requests.getPeriods(this.resolveGetPeriods);
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

    // #region Resolvers Assign
    private resolveGetAssignFilters = (json: string): void => {
        try {
            LayoutActions.hidePageLoader();
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAssignFilters.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    assignFilterOptions: result.data,
                    isAssignCourses: true,
                    isSetupView: false,
                    isViewCourses: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAssignFilters.name, e));
        }
    };

    private resolveGetAssignCourses = (json: string): void => {
        try {
            LayoutActions.hidePageLoader();
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAssignCourses.name, this.hideAllLoaders);
            if (result?.status) {
                const sectionAssignments: ICourseTemplatesAssignCourses = result.data;
                const page: number = this.preservePage ? this.state.pageAssign : 0;
                const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(sectionAssignments.overallCount);
                const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];

                this.setState({
                    pageAssign: page,
                    rowsPerPage: rowsPerPage,
                    rowsPerPageOptions: rowsPerPageOptions,
                    sectionAssignments: sectionAssignments,
                    showAssignButton: false
                }, () => LayoutActions.hidePageLoader());
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAssignCourses.name, e));
        }
    };

    private resolveGetAssignedCourses = (json: string): void => {
        try {
            LayoutActions.hidePageLoader();
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAssignedCourses.name, this.hideAllLoaders);
            if (result?.status) {
                const assignmentSections: ICourseTemplatesViewCourses = result.data;
                const page: number = this.preservePage ? this.state.pageAssignCourses : 0;
                const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(assignmentSections.overallCount);
                const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                let templateIsAssigned: boolean = false;
                if (assignmentSections.overallCount > 0) {
                    templateIsAssigned = true;
                }

                this.setState({
                    assignmentSections: assignmentSections,
                    isViewCourses: true,
                    pageAssignCourses: page,
                    rowsPerPage: rowsPerPage,
                    rowsPerPageOptions: rowsPerPageOptions,
                    showAssignButton: false,
                    templateIsAssigned: templateIsAssigned
                }, () => LayoutActions.hidePageLoader());
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAssignedCourses.name, e));
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
                }, () => LayoutActions.hidePageLoader());
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };

    private resolvePostSaveAssignCourses = (json: string): void => {
        try {
            const {
                courseTemplateFilterSearch,
                courseTemplateId,
                rowsPerPage
            } = this.state;
            LayoutActions.hidePageLoader();
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveAssignCourses.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    const resourcesLayout = LayoutStore.getResourcesLayout();
                    if (resourcesLayout) {
                        LayoutActions.setAlert({
                            message: resourcesLayout.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }

                    if (courseTemplateId) {
                        LayoutActions.showPageLoader();
                        courseTemplateFilterSearch.startIndex = 0;
                        courseTemplateFilterSearch.length = rowsPerPage;
                        courseTemplateFilterSearch.templateId = courseTemplateId;
                        Requests.postSearchCourses(courseTemplateFilterSearch, courseTemplateFilterSearch.startIndex,
                            courseTemplateFilterSearch.length, this.resolveGetAssignCourses);
                    }
                    this.setState({
                        checkboxHeader: false,
                        pageAssign: 0,
                        templateIsAssigned: true
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveAssignCourses.name, e));
        }
    };

    private resolvePostDeleteAssignedCourses = (json: string): void => {
        try {
            LayoutActions.hidePageLoader();
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteAssignedCourses.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    courseTemplateId,
                    rowsPerPage
                } = this.state;

                if (courseTemplateId) {
                    LayoutActions.showPageLoader();
                    Requests.getAssignedCourses(courseTemplateId, 0, rowsPerPage, this.resolveGetAssignedCourses);
                    this.setState({
                        confirmationAssignedModal: false,
                        pageAssignCourses: 0
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteAssignedCourses.name, e));
        }
    };
    // #endregion Resolvers Assign

    // #region Resolvers Activities
    private resolveIsValidName = (json: string): void => {
        try {
            const {
                activitySetupItems,
                addActivityItems,
                editActivityItems,
                courseTemplateId,
                courseTemplateSetup,
                isAddActivity,
                isEditActivity
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveIsValidName.name, this.hideAllLoaders);
            let useManualWeights: boolean = false;
            if (result?.status) {
                if (result.data && courseTemplateId && courseTemplateSetup) {
                    if (courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod !== 2) {
                        useManualWeights = true;
                    }
                    if (isAddActivity) {
                        Requests.postSaveActivity(addActivityItems, courseTemplateId, useManualWeights, this.resolvePostSaveActivity);
                    }
                    else if (isEditActivity) {
                        Requests.postSaveActivity(editActivityItems, courseTemplateId, useManualWeights, this.resolvePostSaveActivity);
                    }
                    else {
                        Requests.postSaveActivity(activitySetupItems, courseTemplateId, useManualWeights, this.resolvePostSaveActivity);
                    }
                    this.setState({
                        isValidName: false
                    });
                }
                else {
                    this.setState({
                        isValidName: true
                    }, () => LayoutActions.hidePageLoader());
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveIsValidName.name, e));
        }
    };

    private resolvePostDeleteActivity = (json: string): void => {
        try {
            const {
                courseTemplateId
            } = this.state;
            LayoutActions.hidePageLoader();
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteActivity.name, this.hideAllLoaders);
            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                this.setState({
                    activitySetupItems: {},
                    addActivity: false,
                    addActivityItems: {},
                    confirmDeleteActivity: false,
                    isAddActivities: false,
                    isAddActivity: false,
                    isEditActivity: false,
                    isValidDueDate: false,
                    isValidName: false
                });

                if (courseTemplateId) {
                    LayoutActions.setLoading(true);
                    Requests.getTemplate(courseTemplateId, this.resolveGetCourseTemplate);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteActivity.name, e));
        }
    };

    private resolvePostDeleteAllActivities = (json: string): void => {
        try {
            const {
                courseTemplateId
            } = this.state;
            LayoutActions.setLoading(false);
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteAllActivities.name, this.hideAllLoaders);
            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                this.setState({
                    activitySetupItems: {},
                    addActivity: false,
                    addActivityItems: {},
                    confirmationDeleteAll: false,
                    isAddActivities: false,
                    isAddActivity: false,
                    isValidDueDate: false,
                    isValidName: false,
                    templateHasActivities: false
                });

                if (courseTemplateId) {
                    LayoutActions.setLoading(true);
                    Requests.getTemplate(courseTemplateId, this.resolveGetCourseTemplate);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteAllActivities.name, e));
        }
    };

    private resolvePostSaveActivity = (json: string): void => {
        try {
            const {
                courseTemplateId,
                editActivityItems
            } = this.state;
            LayoutActions.setLoading(false);
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveActivity.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data >= 0) {
                    const resourcesLayout = LayoutStore.getResourcesLayout();
                    editActivityItems.isAssignedDateChanged = false;
                    editActivityItems.isdueDateChanged = false;
                    if (resourcesLayout) {
                        LayoutActions.setAlert({
                            message: resourcesLayout.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }

                    this.setState({
                        activitySetupItems: {},
                        addActivity: false,
                        addActivityItems: {},
                        editActivityItems: editActivityItems,
                        isAddActivities: false,
                        isAddActivity: false,
                        isEditActivity: false,
                        isValidDueDate: false,
                        isValidName: false,
                        templateHasActivities: true
                    });

                    if (courseTemplateId) {
                        LayoutActions.showPageLoader();
                        Requests.getTemplate(courseTemplateId, this.resolveGetCourseTemplate);
                    }
                }
                else if (result.data === -1) {
                    this.setState({
                        isValidDueDate: true,
                        isValidName: false
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveActivity.name, e));
        }
    };

    private resolvePostSaveActivities = (json: string): void => {
        try {
            const {
                courseTemplateId
            } = this.state;
            LayoutActions.setLoading(false);
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveActivities.name, this.hideAllLoaders);
            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                this.setState({
                    activitySetupItems: {},
                    addActivity: false,
                    addActivityItems: {},
                    isAddActivities: false,
                    isAddActivity: false,
                    isEditActivity: false,
                    isValidDueDate: false,
                    isValidName: false,
                    saveAssignment: [],
                    saveAssignmentTypes: [],
                    templateHasActivities: true
                });

                if (courseTemplateId) {
                    LayoutActions.setLoading(true);
                    Requests.getTemplate(courseTemplateId, this.resolveGetCourseTemplate);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveActivities.name, e));
        }
    };

    private resolvePostTemplateOptions = (json: string): void => {
        try {
            const {
                courseTemplateId,
                copyPeriodSelected
            } = this.state;
            LayoutActions.hidePageLoader();
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostTemplateOptions.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data.templates.length > 0) {
                    let periodSelected: number = Number(copyPeriodSelected);
                    if (copyPeriodSelected == undefined) {
                        periodSelected = Number(result.data.periods[0]?.value);
                    }
                    this.setState({
                        copyPeriods: result.data.periods,
                        copyPeriodSelected: periodSelected,
                        copyTemplate: result.data.templates,
                        copyTemplateSelected: 0,
                        isCopyActivities: true,
                        isLoadingTemplates: false
                    });
                }
                else {
                    if (courseTemplateId) {
                        LayoutActions.showPageLoader();
                        Requests.getTemplateOptions(Number(result.data.periods[0]?.value), courseTemplateId, this.resolvePostTemplateOptions);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostTemplateOptions.name, e));
        }
    }
    // #endregion Resolvers Activities

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const permissions: ICourseTemplatesPermissions | undefined = LayoutStore.getPermissions();
        const resources: ICourseTemplatesRes | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                permissions: permissions,
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
    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
        PeopleSearchStore.removeSelectedPersonListener(this.onSelect);
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            cultures,
            isLoading,
            isMidterm,
            isSetupView,
            permissions,
            showAssignButton,
            templateHasActivities,
            templateIsAssigned,
            templateIsAssignedByUser,

            // #region Assign courses
            assignFilterOptions,
            assignmentSections,
            assignmentTemplateShareName,
            checkboxHeader,
            confirmationAssignedModal,
            courseId,
            courseName,
            courseTemplateFilterSearch,
            isAssignCourses,
            isDepartmentSelected,
            isViewCourses,
            pageAssign,
            pageAssignCourses,
            sectionAssignments,
            sectionDetail,
            sectionModalOpen,
            // #endregion Assign courses

            // #region Templates
            activeStep,
            assignmentTemplateShares,
            confirmationModal,
            confirmationDeleteSharedModal,
            courseTemplateSetup,
            courseTemplates,
            courseTemplateId,
            courseTemplateName,
            errorTemplateName,
            existTemplateName,
            gradeActivity,
            isAdd,
            isIndeterminate,
            isPeopleSearch,
            isSharedWith,
            numSteps,
            page,
            periods,
            periodSelected,
            rowsPerPage,
            rowsPerPageOptions,
            shareTemplates,
            selectedPerson,
            stepErrors,
            // #endregion Templates

            // #region Add/Edit Activities
            addActivityItems,
            editActivityItems,
            isActivityTypeRequired,
            isAddActivities,
            isEditActivity,
            isTitleRequired,
            isValidDueDate,
            isValidName,
            isViewActivity,
            // #endregion Add Activities

            // #region Activities
            activityName,
            activitiesSetup,
            confirmationDeleteAll,
            confirmDeleteActivity,
            copyAssignments,
            copyPeriods,
            copyPeriodSelected,
            copyTemplate,
            copyTemplateSelected,
            isCopyActivities,
            isFinishCopy,
            isLoadingTemplates,
            sectionAssignmentValidationResult,
            showMessageDueDate,
            // #endregion Activities

            // #region Date Modal
            dateKey,
            dateModal,
            dateSelected,
            // #endregion Date Modal

            // #region Dossier
            dossierPersonId,
            openDossierModal,
            // #endregion Dossier

            resources
        } = this.state;

        const resourcesLayout = LayoutStore.getResourcesLayout();
        let emptyOption: IDropDownOption;
        emptyOption = {
            description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
            value: ''
        };

        let addTemplateModal: JSX.Element | undefined;
        let copyActivitiesModal: JSX.Element | undefined;
        let contentHeader: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;
        let contentPeriod: JSX.Element | undefined;
        let contentSetup: JSX.Element | undefined;
        let contentTable: JSX.Element | undefined;
        let emptyContent: JSX.Element | undefined;
        let sectionDetailModal: JSX.Element | undefined;
        if (resources && permissions) {
            if (!isLoading) {
                contentPeriod = (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlPeriod"
                                label={resources.lblPeriod}
                                options={periods}
                                value={periodSelected ? periodSelected.value : undefined}
                                onChange={this.onChangePeriod}
                            />
                        </Grid>
                    </Grid>
                );

                if (periodSelected && periodSelected.value) {
                    if (courseTemplates && courseTemplates.overallCount > 0) {
                        contentTable = (
                            <CourseTemplatesTable
                                assignmentTemplateShareName={assignmentTemplateShareName}
                                activeStep={activeStep}
                                checkboxHeader={checkboxHeader}
                                courseTemplates={courseTemplates}
                                confirmationDeleteShare={confirmationDeleteSharedModal}
                                getRowsPerPageOptions={this.getRowsPerPageOptions}
                                hasDossierClaim={permissions.facultyDossier}
                                isIndeterminate={isIndeterminate}
                                isPeopleSearch={isPeopleSearch}
                                isSharedWith={isSharedWith}
                                numSteps={numSteps}
                                onChangeCheckbox={this.onChangeCheckbox}
                                onChangeCheckboxHeader={this.onChangeCheckboxHeader}
                                onChangePage={this.onChangePage}
                                onChangeRowsPerPage={this.onChangeRowsPerPage}
                                onClickAdd={this.onClickAdd}
                                onClose={this.onCloseSearch}
                                onCloseSharedModal={this.onCloseSharedModal}
                                onClickDelete={this.onClickDelete}
                                onClickDeleteShared={this.onClickDeleteShared}
                                onClickSetup={this.onClickSetup}
                                onClickShare={this.onClickShare}
                                onClickStep={this.onClickStep}
                                onCloseDeleteShareConfirmModal={this.onCloseConfirmationSharedModal}
                                onDeleteShareConfirm={this.onConfirmationDeleteShareModal}
                                onFinishShare={this.onFinishShare}
                                onSharedWith={this.onSharedWith}
                                onViewDossier={this.onViewDossier}
                                page={page}
                                people={assignmentTemplateShares}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={rowsPerPageOptions}
                                shareTemplates={shareTemplates}
                                selectedPerson={selectedPerson}
                                stepErrors={stepErrors}
                                resources={resources}
                            />
                        );
                    }
                    else {
                        contentHeader = (
                            <>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Tooltip
                                            id="addCourseTemplate"
                                            title={resources.lblAdd}
                                            aria-label={resources.lblAdd}
                                        >
                                            <IconButton
                                                id="btnAdd"
                                                onClick={this.onClickAdd}
                                            >
                                                <Icon name="add" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="space-between">
                                    <Grid item xs={12}>
                                        <Illustration
                                            color="secondary"
                                            height="md"
                                            internalName="no-activities"
                                            text={resources.lblNoTemplates}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        );
                    }
                }
                else if (contentPeriod) {
                    emptyContent = (
                        <Card>
                            <CardContent>
                                <Illustration
                                    color="secondary"
                                    name="no-search-results"
                                    text={resources.lblNoPeriod}
                                />
                            </CardContent>
                        </Card>
                    );
                }
                else {
                    contentPeriod = (
                        <MessageStyled
                            classMessage="noResults"
                            message={resources.lblNoTemplates}
                        />
                    );
                }

                if (isAdd) {
                    addTemplateModal = (
                        <AddTemplatesModal
                            errorTemplateName={errorTemplateName}
                            existTemplateName={existTemplateName}
                            open={isAdd}
                            onCancel={this.onCancel}
                            onClose={this.onCloseAddModal}
                            onSave={this.onSaveTemplate}
                            onTextFieldChange={this.onTextFieldChange}
                            resources={resources}
                        />
                    );
                }

                const dossier: JSX.Element = (
                    <Dossier
                        key={`Dossier_${dossierPersonId}`}
                        dossierType={DossierType.Faculty}
                        open={openDossierModal}
                        personId={dossierPersonId}
                        onClose={this.onCloseDossierModal}
                    />
                );

                contentPage = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        {contentPeriod}
                                    </CardContent>
                                </Card>
                            </Grid>
                            {periodSelected && periodSelected.value ?
                                (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                {contentHeader}
                                                {contentTable}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                                : undefined}
                            <Grid item xs={12}>
                                {emptyContent}
                            </Grid>
                        </Grid>
                        {confirmationModal ?
                            (
                                <ConfirmationDialog
                                    contentText={Format.toString(resources.formatDeleteTemplate, [courseTemplateName])}
                                    open={confirmationModal}
                                    primaryActionOnClick={this.onCloseDeleteConfirmModal}
                                    primaryActionText={resources.btnCancel}
                                    secondaryActionOnClick={this.onDeleteConfirm}
                                    secondaryActionText={resources.btnDelete}
                                    secondaryActionProps={{ id: `btnDelete_${this.idPage}` }}
                                    title={resources.lblTitleConfirmationDialog}
                                />
                            )
                            : undefined}
                        {addTemplateModal}
                        {dossier}
                    </>
                );
            }

            if (isSetupView) {
                contentSetup = (
                    <CourseTemplateSetup
                        // #region Options
                        courseTemplateId={courseTemplateId}
                        courseTemplates={courseTemplates}
                        courseTemplateName={courseTemplateName}
                        courseTemplateSetup={courseTemplateSetup}
                        cultures={cultures}
                        gradeActivity={gradeActivity}
                        hasActivities={templateHasActivities}
                        isAssignedByUser={templateIsAssignedByUser}
                        periodSelected={periodSelected}
                        onChangeSetup={this.onChangeSetup}
                        onCheckboxChange={this.onCheckboxChange}
                        onClickCourseTemplates={this.onClickCourseTemplates}
                        onDropdownChange={this.onDropdownChange}
                        // #endregion Options

                        // #region Add activities
                        activitySetupItems={addActivityItems}
                        isActivityTypeRequired={isActivityTypeRequired}
                        isAddActivities={isAddActivities}
                        isTitleRequired={isTitleRequired}
                        isValidDueDate={isValidDueDate}
                        isValidName={isValidName}
                        onClickAddActivities={this.onClickAddActivities}
                        onCloseAddActivities={this.onCloseAddActivities}
                        onCheckboxChangeModal={this.onCheckboxChangeAdd}
                        onDateTimeChangeModal={this.onDateTimeChangeAdd}
                        onDropdownChangeModal={this.onChangeDropDownAdd}
                        onSaveAddActivity={this.onSaveAddActivity}
                        onTextFieldChangeModal={this.onChangeTextFieldModalAdd}
                        // #endregion Add activities

                        // #region Edit activities
                        editActivitySetupItems={editActivityItems}
                        isEditActivity={isEditActivity}
                        isViewActivity={isViewActivity}
                        onCheckboxChangeEdit={this.onCheckboxChangeEdit}
                        onDateTimeChangeEdit={this.onDateTimeChangeEdit}
                        onDropdownChangeEdit={this.onChangeDropDownEdit}
                        onSaveEditActitiy={this.onSaveEditActitiy}
                        onTextFieldChangeEdit={this.onChangeTextFieldModalEdit}
                        // #endregion Edit activities

                        // #region Activities
                        activityName={activityName}
                        activitiesSetup={activitiesSetup}
                        confirmationDeleteAll={confirmationDeleteAll}
                        confirmDeleteActivity={confirmDeleteActivity}
                        isMidterm={isMidterm}
                        sectionAssignmentValidationResult={sectionAssignmentValidationResult}
                        showMessageDueDate={showMessageDueDate}
                        onClickDeleteAllActivities={this.onDeleteAllActivities}
                        onBlurTextField={this.onBlurTextField}
                        onChangeDateTime={this.onChangeDateTime}
                        onCheckboxChangeActivity={this.onCheckboxChangeActivity}
                        onClickCopyActivities={this.onCopyActivities}
                        onCloseDeleteAllConfirmModal={this.onCloseDeleteAllConfirmModal}
                        onConfirmDeleteActivity={this.onConfirmDeleteActivity}
                        onDeleteActivity={this.onDeleteActivity}
                        onDeleteAllActivity={this.onConfirmDeleteAllActivities}
                        onEditActivity={this.onEditActivity}
                        onSaveActivities={this.onSaveActivities}
                        onTextFieldChange={this.onTextFieldChangeActivities}
                        // #endregion Activities

                        // #region Date Modal
                        dateKey={dateKey}
                        dateModal={dateModal}
                        dateSelected={dateSelected}
                        onChangeDate={this.onChangeDate}
                        onClearDate={this.onClearDate}
                        onCloseDate={this.onCloseDate}
                        onOkDate={this.onOkDate}
                        onOpenDate={this.onOpenDate}
                        // #endregion Date Modal
                        onClickAssign={this.onClickAssign}
                        onClickViewCourses={this.onClickViewCourses}
                        resources={resources}
                    />
                );

                if (isCopyActivities) {
                    copyActivitiesModal = (
                        <CourseTemplatesCopyActivitiesModal
                            assignments={copyAssignments}
                            isFinishButton={isFinishCopy}
                            isLoadingTemplates={isLoadingTemplates}
                            open={isCopyActivities}
                            periods={copyPeriods}
                            periodSelected={copyPeriodSelected}
                            templates={copyTemplate}
                            templateSelected={copyTemplateSelected}
                            onClose={this.onCloseCopyModal}
                            onFinishCopy={this.onFinishCopyAssignments}
                            onDropdownChange={this.onDropdownChangeCopy}
                            resources={resources}
                        />
                    );
                }

                contentPage = (
                    <>
                        {copyActivitiesModal}
                        {contentSetup}
                    </>
                );
            }

            if (isAssignCourses) {
                contentSetup = (
                    <CourseTemplateAssignCourses
                        checkboxHeader={checkboxHeader}
                        courseTemplateFilterSearch={courseTemplateFilterSearch}
                        courseTemplateId={courseTemplateId}
                        courseTemplateName={courseTemplateName}
                        courseTemplates={courseTemplates}
                        filterOptions={assignFilterOptions}
                        isDepartmentSelected={isDepartmentSelected}
                        periodSelected={periodSelected}
                        sectionAssignments={sectionAssignments}
                        showAssignButton={showAssignButton}
                        getRowsPerPageOptions={this.getRowsPerPageOptions}
                        onAssignCourses={this.onAssignCourses}
                        onChangeCheckHeader={this.onChangeCheckHeader}
                        onChangeCheckbox={this.onChangeCheckboxAssign}
                        onChangePage={this.onChangePageAssign}
                        onChangeRowsPerPage={this.onChangeRowsPerPageAssign}
                        onClickClear={this.onClearFilters}
                        onClickSetup={this.onCloseAssign}
                        onClickViewCourses={this.onClickViewCourses}
                        onDropdownChangeFilter={this.onDropdownChangeFilter}
                        onSearchCourses={this.onSearchCourses}
                        page={pageAssign}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={rowsPerPageOptions}
                        templateIsAssigned={templateIsAssigned}
                        resources={resources}
                    />
                );

                contentPage = (
                    <>
                        {contentSetup}
                    </>
                );
            }

            if (isViewCourses) {
                contentSetup = (
                    <>
                        <CourseTemplatesViewCourses
                            assignmentSection={assignmentSections}
                            courseTemplateId={courseTemplateId}
                            courseTemplateName={courseTemplateName}
                            getRowsPerPageOptions={this.getRowsPerPageOptions}
                            page={pageAssignCourses}
                            periodSelected={periodSelected}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={rowsPerPageOptions}
                            onChangePage={this.onChangePageViewCourses}
                            onChangeRowsPerPage={this.onChangeRowsPerPageViewCourses}
                            onClickAssign={this.onClickAssign}
                            onClickDelete={this.onDeleteAssignedCourses}
                            onClickSetup={this.onCloseAssign}
                            onViewDetailsSection={this.onViewDetailsSection}
                            resources={resources}
                        />

                        {confirmationAssignedModal && (
                            <ConfirmationDialog
                                contentText={Format.toString(resources.assignCourses.formatDeleteCourse, [courseId, courseName])}
                                open={confirmationAssignedModal}
                                primaryActionOnClick={this.onCloseDeleteConfirmModal}
                                primaryActionText={resources.btnCancel}
                                secondaryActionOnClick={this.onDeleteAssignedConfirmation}
                                secondaryActionText={resources.btnDelete}
                                title={resources.assignCourses.lblTitleConfirmationDialogCourse}
                            />
                        )}
                    </>
                );

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

                contentPage = (
                    <>
                        {contentSetup}
                        {sectionDetailModal}
                    </>
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
            </Layout>
        );
    }
}

const CourseTemplatesViewWithLayout = withLayout(CourseTemplatesView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<CourseTemplatesViewWithLayout />, document.getElementById('root'));