/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: MyTasksMain.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import PeopleSearch from '@hedtech/powercampus-design-system/react/components/PeopleSearch';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import ChecklistTask from './ChecklistTask';
import MyTasksListDetail from './MyTasksListDetail';
import MyTasksProcessed from './MyTasksProcessed';
import CancelWaiveModal from './CancelWaiveModal';
import MyTasksCompletedModal from './MyTasksCompletedModal';
import MyTasksViewDetailModal from './MyTasksViewDetailModal';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { IChecklistAction } from '../../../Types/Checklist/IChecklistAction';
import { ICheckListPermissions } from '../../../Types/Permissions/ICheckListPermissions';
import { IChecklistResponsible } from '../../../Types/Checklist/IChecklistResponsible';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IMyTasks } from '../../../Types/Checklist/IMyTasks';
import { IMyTasksDetail } from '../../../Types/Checklist/IMyTasksDetial';
import { IMyTasksMainResources } from '../../../Types/Resources/Checklist/IMyTasksMainResources';
import { IMyTasksViewDetails } from '../../../Types/Checklist/IMyTasksViewDetails';
import { IPeopleSearchModel } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchModel';
import { IPeopleSearchModalResources } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchResources';
import { ITask } from '../../../Types/Checklist/ITask';
import { IYearTerm } from '../../../Types/Periods/IYearTerm';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import QueryString from '@hedtech/powercampus-design-system/helpers/QueryString';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/CheckList/MyTasks';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import PeopleSearchActions from '@hedtech/powercampus-design-system/flux/actions/PeopleSearchActions';
import PeopleSearchStore from '@hedtech/powercampus-design-system/flux/stores/PeopleSearchStore';
import MyTasksReassignModal from './MyTasksReassignModal';
import MyTasksViewEdit from './MyTasksViewEdit';

// Storage
import Storage from '@hedtech/powercampus-design-system/storage';
import StorageKeys from '@hedtech/powercampus-design-system/storage/StorageKeys';
// #endregion Imports

// #region Types
export interface IMyTasksMainResourcesProps extends IMyTasksMainResources {
    peopleSearchModal: IPeopleSearchModalResources;
}

export interface IMyTaskMainProps {
    createActionClaim?: boolean;
    impersonateInfo?: IImpersonateInfo;
    isAdviseeProfile?: boolean;
}

interface IMyTasksState {
    actionScheduledId: number;
    allExpanded: boolean;
    anchorEl: any;
    avatarInfo?: IAvatar;
    canceled?: boolean;
    canViewDetails?: number;
    canViewNotes?: number;
    cancelReasons?: IDropDownOption[];
    category: number;
    checkListPermissions?: ICheckListPermissions;
    completed?: boolean;
    completeTask?: IMyTasksDetail;
    componentError: boolean;
    cultures: ICultures;
    difference: number;
    editResponsibles?: IDropDownOption[];
    editTask?: IMyTasksDetail;
    isCancelReason: boolean;
    isLoading: boolean;
    isPeopleSearch: boolean;
    isPerDay: boolean;
    isProcessedOpen: boolean;
    myTaskAddress?: IMyTasksDetail;
    myTaskEditPopper?: IMyTasksDetail;
    myProcessedTaskDetail?: IMyTasksDetail;
    myProcessedTasks?: IMyTasks;
    myTaskDetail?: IMyTasksDetail;
    myTasks?: IMyTasks[];
    myTaskViewDetail?: IMyTasksViewDetails;
    myTaskViewDetailPopper?: IMyTasksViewDetails;
    openCancelWaiveModal: boolean;
    openCompleteModal: boolean;
    openEditModal: boolean;
    openInfo: boolean;
    openInfoViewDetails: boolean;
    openPopperAdd: boolean;
    openPopperEdit: boolean;
    openMyTaskDetailModal: boolean;
    openMyTaskDetailProcessedModal: boolean;
    resources?: IMyTasksMainResourcesProps;
    saveReasons: IChecklistAction;
    openReassignModal: boolean;
    reassignTask?: IMyTasksDetail;
    yearTerm?: IDropDownOption[];
    taskActionName: string;
    waived?: boolean;
    waiveReasons?: IDropDownOption[];

    // #region PeopleSearchModal
    selectedOption?: string | number;
    // #endregion PeopleSearch Modal

    // #region Stepper
    activeStep: number;
    numSteps: number;
    stepErrors: boolean[];
    // #endregion Stepper

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination

    // #region ChecklistTask
    actions?: IDropDownOption[];
    isLoadingAction: boolean;
    isLoadingResponsible: boolean;
    isLoadingSession: boolean;
    offices: IDropDownOption[];
    openChecklistTask: boolean;
    openPeopleSearchModal: boolean;
    responsibles?: IDropDownOption[];
    selectedPerson?: IPeopleSearchModel;
    showSearchButton: boolean;
    sessions?: IDropDownOption[];
    task: ITask;
    yearTerms: IDropDownOption[];
    // #endregion ChecklistTask

    // #region Query String
    isOpenByQueryString: boolean;
    // #endregion Query String
}

const styles = () => createStyles({
    popperText: {
        maxWidth: '15rem'
    }
});

type PropsWithStyles = WithStyles<typeof styles> & IMyTaskMainProps;

// #endregion Types

// #region Component
class MyTasksMain extends React.Component<PropsWithStyles, IMyTasksState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    // #region Pagination
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<IMyTasksState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Checklist';
        this.idPage = 'MyTasksMain';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        PeopleSearchStore.addSelectedPersonListener(this.onSelect);
        // #endregion State Management Listeners

        // #region Pagination
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        // #endregion Pagination

        // #region Bind State Management Listeners
        PeopleSearchStore.addSelectedPersonListener(this.onSelect);
        // #endregion State Management Listeners
    }

    private getInitialState(): IMyTasksState {
        let resources: IMyTasksMainResourcesProps | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            anchorEl: null,
            actionScheduledId: 0,
            allExpanded: false,
            category: 0,
            componentError: false,
            cultures: LayoutStore.getCultures(),
            difference: 0,
            isCancelReason: false,
            isLoading: true,
            isPeopleSearch: false,
            isPerDay: false,
            isProcessedOpen: false,
            openCancelWaiveModal: false,
            openCompleteModal: false,
            openEditModal: false,
            openInfo: false,
            openInfoViewDetails: false,
            openMyTaskDetailModal: false,
            openMyTaskDetailProcessedModal: false,
            openPopperAdd: false,
            openPopperEdit: false,
            openReassignModal: false,
            taskActionName: '',
            saveReasons: {
                actionId: '',
                actionName: '',
                instruction: '',
                note: '',
                priority: '',
                isRequired: false,
                reasonRequired: false,
                reasonSelected: ''
            },

            // #region Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            // #endregion Pagination

            // #region ChecklistTask
            isLoadingAction: false,
            isLoadingResponsible: false,
            isLoadingSession: false,
            openPeopleSearchModal: false,
            offices: [],
            openChecklistTask: false,
            showSearchButton: false,
            task: {
                dueDate: '',
                dueTime: '',
                instruction: '',
                isRequired: false,
                note: '',
                priority: '',
                // UI
                actionModified: false,
                actionInvalid: false,
                dueDateInvalid: false,
                dueDateModified: false,
                officeModified: false,
                offsetDaysModified: false,
                offsetDaysInvalid: false,
                optionModified: false,
                priorityInvalid: false,
                priorityModified: false,
                timeModified: false
            },
            yearTerms: [],
            // #endregion ChecklistTask

            // #region Stepper
            activeStep: 0,
            numSteps: 2,
            stepErrors: [false, false],
            // #endregion Stepper

            // #region Query String
            isOpenByQueryString: false,
            // #endregion Query String

            resources: resources
        };
    }

    // #region Events
    private setContent = (): void => {
        try {
            const {
                page,
                rowsPerPage
            } = this.state;

            LayoutActions.showPageLoader();

            Requests.getMyProcessedTask(
                page * rowsPerPage,
                rowsPerPage,
                this.resolveGetMyProcessedTasks,
                this.props.impersonateInfo
            );
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
    };

    private onAddTask = (): void => {
        try {
            LayoutActions.showPageLoader();
            const {
                impersonateInfo
            } = this.props;
            if (impersonateInfo?.personId) {
                Requests.getTemplateOffices(impersonateInfo, this.resolveGetTemplateOffices);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddTask.name, e));
        }
    };

    private onCancelAction = (task: IMyTasksDetail): void => {
        try {
            const {
                saveReasons
            } = this.state;
            LayoutActions.showPageLoader();
            if (task.notes) {
                saveReasons.note = task.notes;
            }
            this.setState({
                actionScheduledId: task.actionScheduledId,
                canViewNotes: task.canViewNotes,
                isCancelReason: true,
                saveReasons: saveReasons,
                taskActionName: task.actionName
            });
            Requests.getCancelReasons(this.resolveGetCancelReasons);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelAction.name, e));
        }
    };

    private onCompleteAction = (task: IMyTasksDetail): void => {
        try {
            const completeTask: IMyTasksDetail | undefined = task;
            if (completeTask) {
                if (this.props.isAdviseeProfile) {
                    this.setState({
                        completeTask: completeTask
                    });
                    LayoutActions.showPageLoader();
                    Requests.getContactInformation(Number(completeTask.personId), this.resolveGetCompleteContactInformation);
                }
                else {
                    completeTask.avatarComplete = completeTask.avatarResp;

                    if (completeTask.peopleCodeId && completeTask.avatarComplete) {
                        completeTask.avatarComplete.peopleId = completeTask.peopleCodeId;
                    }
                    completeTask.completedDateModified = false;
                    completeTask.timeModified = false;
                    completeTask.completedDateInvalid = false;
                    completeTask.completedDate = moment().format(Constants.dateFormat);
                    completeTask.completedTime = moment().format(Constants.timeFormat);

                    this.setState({
                        completeTask: completeTask,
                        openCompleteModal: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCompleteAction.name, e));
        }
    };

    private onEditAction = (task: IMyTasksDetail, category: number): void => {
        try {
            LayoutActions.showPageLoader();
            if (task) {
                this.setState({
                    canViewNotes: task.canViewNotes,
                    category: category
                });
                window.location.href = '#contentPage'; // To Do
                Requests.getMyEditTask(this.resolveGetMyEditTask, this.props.impersonateInfo, task.actionScheduledId);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditAction.name, e));
        }
    };

    private onReassignAction = (task: IMyTasksDetail): void => {
        try {
            const reassignTask: IMyTasksDetail | undefined = task;
            if (reassignTask) {
                this.setState({
                    isPeopleSearch: true,
                    openReassignModal: true,
                    reassignTask: reassignTask
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onReassignAction.name, e));
        }
    };

    private onWaiveAction = (task: IMyTasksDetail): void => {
        try {
            const {
                saveReasons
            } = this.state;
            LayoutActions.showPageLoader();
            if (task.notes) {
                saveReasons.note = task.notes;
            }
            this.setState({
                actionScheduledId: task.actionScheduledId,
                isCancelReason: false,
                saveReasons: saveReasons,
                taskActionName: task.actionName
            });
            Requests.getWaiveReasons(this.resolveGetWaiveReasons);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onWaiveAction.name, e));
        }
    };

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
    };

    private onCloseModal = (): void => {
        try {
            const {
                saveReasons
            } = this.state;
            saveReasons.reasonRequired = false;
            saveReasons.note = '';
            saveReasons.reasonSelected = '';
            this.setState({
                isCancelReason: false,
                openCancelWaiveModal: false,
                saveReasons: saveReasons
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onCloseCompleteModal = (): void => {
        try {
            PeopleSearchActions.setEmptySearch();
            this.setState({
                activeStep: 0,
                numSteps: 2,
                completeTask: undefined,
                isPeopleSearch: false,
                openCompleteModal: false,
                openReassignModal: false,
                stepErrors: [false, false]
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseCompleteModal.name, e));
        }
    };

    private onCloseSearch = (): void => {
        try {
            PeopleSearchActions.setEmptySearch();
            this.setState({
                isPeopleSearch: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSearch.name, e));
        }
    };

    private onCloseViewDetailModal = (): void => {
        try {
            this.setState({
                myTaskViewDetail: undefined,
                openMyTaskDetailModal: false,
                openMyTaskDetailProcessedModal: false,
                openInfo: false,
                openInfoViewDetails: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseViewDetailModal.name, e));
        }
    };

    private onDatePickerChange = (date: string, _id: string, isValid: boolean) => {
        try {
            const {
                completeTask
            } = this.state;

            if (completeTask) {
                completeTask.completedDateInvalid = !isValid;
                completeTask.completedDate = date;
                completeTask.completedDateModified = true;
                this.setState({
                    completeTask: completeTask
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDatePickerChange.name, e));
        }
    };

    private onDatePickerEditChange = (date: string, _id: string, isValid: boolean) => {
        try {
            const {
                editTask
            } = this.state;

            if (editTask) {
                editTask.scheduleDateInvalid = !isValid;
                editTask.scheduleDate = date;
                editTask.scheduleDateModified = true;
                this.setState({
                    editTask: editTask
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDatePickerEditChange.name, e));
        }
    };

    private onDropDownChange = (optionSelected: IDropDownOption): void => {
        try {
            const {
                saveReasons
            } = this.state;
            if (optionSelected.value !== '') {
                saveReasons.reasonRequired = false;
                saveReasons.reason = String(optionSelected.value);
                saveReasons.reasonSelected = String(optionSelected.value);
            }
            else {
                saveReasons.reasonRequired = true;
                saveReasons.reasonSelected = String(optionSelected.value);
            }
            this.setState({
                saveReasons: saveReasons
            });

        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropDownChange.name, e));
        }
    };

    private onNext = (): void => {
        try {
            const {
                completeTask,
                selectedPerson
            } = this.state;

            if (selectedPerson && completeTask) {
                completeTask.avatarComplete = selectedPerson;
                this.setState({
                    completeTask: completeTask,
                    isPeopleSearch: false
                });
                PeopleSearchActions.setEmptySearch();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onNext.name, e));
        }
    };

    private onNextEdit = (): void => {
        try {
            const {
                selectedPerson
            } = this.state;

            if (selectedPerson) {
                LayoutActions.showPageLoader();
                if (this.props.impersonateInfo?.personId === undefined) {
                    Requests.getContactInformation(selectedPerson.personId, this.resolveGetEditContactInformation);
                }
                else {
                    Requests.getContactInformation(selectedPerson.personId, this.resolveGetEditAdvisorResponsibleInformation);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onNextEdit.name, e));
        }
    };

    private onTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                completeTask,
                saveReasons
            } = this.state;

            if (event.target.id === 'txtCompleteNotes' && completeTask) {
                completeTask.notes = event.target.value;
            }
            else {
                saveReasons.note = event.target.value;
            }
            this.setState({
                completeTask: completeTask,
                saveReasons: saveReasons
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };

    private onTimePickerChange = (value: string) => {
        try {
            const {
                completeTask
            } = this.state;

            if (completeTask) {
                completeTask.completedTime = value;
                completeTask.timeModified = true;
                this.setState({
                    completeTask: completeTask
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTimePickerChange.name, e));
        }
    };

    private onTimePickerEditChange = (value: string) => {
        try {
            const {
                editTask
            } = this.state;

            if (editTask) {
                editTask.scheduleTime = value;
                editTask.scheduleTimeModified = true;
                this.setState({
                    editTask: editTask
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTimePickerEditChange.name, e));
        }
    };

    private onExpandAll = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                myTasks
            } = this.state;
            const expanded: boolean = JSON.parse(event.currentTarget.dataset.expanded || 'false');
            myTasks?.forEach(task => {
                task.expanded = expanded;
            });

            this.setState({
                allExpanded: expanded,
                myTasks: myTasks
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandAll.name, e));
        }
    };

    private onExpandedCategory = (category: number, expanded: boolean): void => {
        try {
            const {
                myTasks
            } = this.state;

            myTasks?.forEach(task => {
                if (task.category === category) {
                    task.expanded = expanded;
                }
            });

            this.setState({
                myTasks: myTasks
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandedCategory.name, e));
        }
    };

    private onOpenPopper = (event: any, myTaskDetails: IMyTasksDetail): void => {
        try {
            if (this.props.impersonateInfo?.personId !== undefined) {
                this.setState({
                    anchorEl: event.currentTarget,
                    myTaskDetail: myTaskDetails
                });
                LayoutActions.showPageLoader();
                if (myTaskDetails.avatarResp && myTaskDetails.avatarResp.personId) {
                    Requests.getContactInformation(Number(myTaskDetails.avatarResp.personId), this.resolveGetAdvisorContactInformation);
                }
            }
            else {
                this.setState({
                    anchorEl: event.currentTarget,
                    myTaskDetail: myTaskDetails,
                    myProcessedTaskDetail: myTaskDetails,
                    openInfo: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onOpenPopperProcessed = (event: any, myTaskDetails: IMyTasksDetail): void => {
        try {
            this.setState({
                anchorEl: event.currentTarget,
                myTaskDetail: myTaskDetails,
                myProcessedTaskDetail: myTaskDetails,
                openInfo: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopperProcessed.name, e));
        }
    };

    private onOpenPopperViewDetails = (event: any, myTaskViewDetails: IMyTasksViewDetails): void => {
        try {
            if (this.props.impersonateInfo?.personId !== undefined) {
                this.setState({
                    myTaskViewDetailPopper: myTaskViewDetails,
                    anchorEl: event.currentTarget
                });
                LayoutActions.showPageLoader();
                Requests.getContactInformation(Number(myTaskViewDetails.avatarResp.personId), this.resolveGetAdvisorViewDetailsContactInformation);
            }
            else {
                const {
                    isOpenByQueryString,
                    myTaskViewDetail
                } = this.state;

                if (isOpenByQueryString && myTaskViewDetail) {
                    Requests.getContactInformation(Number(myTaskViewDetail.avatarResp.personId), this.resolveGetAdvisorViewDetailsContactInformation);
                    this.setState({
                        anchorEl: event.currentTarget,
                        myTaskViewDetailPopper: myTaskViewDetail,
                        openInfoViewDetails: true
                    });
                }
                else {
                    this.setState({
                        anchorEl: event.currentTarget,
                        myTaskViewDetailPopper: myTaskViewDetails,
                        openInfoViewDetails: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopperViewDetails.name, e));
        }
    };

    private onOpenPopperEdit = (event: any, myTaskEdit: IMyTasksDetail): void => {
        try {
            if (this.props.impersonateInfo?.personId !== undefined) {
                this.setState({
                    myTaskEditPopper: myTaskEdit,
                    anchorEl: event.currentTarget
                });
                LayoutActions.showPageLoader();
                if (myTaskEdit.avatarEdit && myTaskEdit.avatarEdit.personId) {
                    Requests.getContactInformation(Number(myTaskEdit.avatarEdit.personId), this.resolveGetAdvisorEditContactInformation);
                }
            }
            else {
                this.setState({
                    anchorEl: event.currentTarget,
                    myTaskEditPopper: myTaskEdit,
                    openPopperEdit: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopperEdit.name, e));
        }
    };

    private onOpenPopperAdd = (event: any): void => {
        try {
            this.setState({
                anchorEl: event.currentTarget,
                openPopperAdd: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopperAdd.name, e));
        }
    };

    private onCheckboxEditChange = (event: any) => {
        try {
            const {
                editTask
            } = this.state;

            if (editTask) {
                const checked: boolean = event.target.checked;
                editTask.required = checked;
                editTask.isRequired = checked;
                this.setState({
                    editTask: editTask
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxEditChange.name, e));
        }
    };

    private onClosePopperViewDetail = (): void => {
        try {
            this.setState({
                anchorEl: null,
                myTaskViewDetailPopper: undefined,
                openInfo: false,
                openInfoViewDetails: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopperViewDetail.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            this.setState({
                anchorEl: null,
                myTaskDetail: undefined,
                myProcessedTaskDetail: undefined,
                openInfo: false,
                openInfoViewDetails: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
        }
    };

    private onClosePopperProcessedViewDetail = (): void => {
        try {
            this.setState({
                anchorEl: null,
                openInfo: false,
                openInfoViewDetails: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopperProcessedViewDetail.name, e));
        }
    };

    private onClosePopperAdd = (): void => {
        try {
            this.setState({
                anchorEl: null,
                openPopperAdd: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopperAdd.name, e));
        }
    };

    private onClosePopperEdit = (): void => {
        try {
            this.setState({
                anchorEl: null,
                myTaskEditPopper: undefined,
                openPopperEdit: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopperEdit.name, e));
        }
    };

    private onReturnToList = (): void => {
        try {
            const {
                editTask
            } = this.state;

            if (editTask && editTask.avatarEdit && editTask.avatarEditResp) {
                editTask.avatarEdit.peopleId = '';
                editTask.avatarEditResp.peopleId = '';
            }
            this.setState({
                isProcessedOpen: false,
                openInfo: false,
                openInfoViewDetails: false,
                openPopperEdit: false,
                editTask: editTask,
                openEditModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onReturnToList.name, e));
        }
    };

    private onSaveEdit = (): void => {
        try {
            const {
                editTask
            } = this.state;

            if (editTask) {
                editTask.dueDate = editTask.scheduleDate;
                editTask.dueTime = editTask.scheduleTime;
                editTask.actionScheduleId = editTask.actionScheduledId;
                let isImpersonate: boolean;
                if (this.props.impersonateInfo === undefined && editTask.avatarEdit) {
                    editTask.personId = editTask.avatarEdit.personId;
                    isImpersonate = false;
                }
                else {
                    if (editTask.avatarEdit) {
                        editTask.personId = editTask.avatarEdit.personId;
                    }
                    isImpersonate = true;
                }
                editTask.note = editTask.notes;
                if (!editTask.scheduleDateInvalid && editTask.priority !== '' && editTask.scheduleTime !== null) {
                    LayoutActions.showPageLoader();
                    Requests.updateEdit(editTask, isImpersonate, this.resolveSaveEdit);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveEdit.name, e));
        }
    };

    private onSaveReasons = (): void => {
        try {
            const {
                actionScheduledId,
                isCancelReason,
                saveReasons
            } = this.state;
            if (saveReasons.reasonSelected !== '' && this.layoutResources) {
                LayoutActions.showPageLoader();
                saveReasons.reasonRequired = false;
                saveReasons.isCanceled = isCancelReason;
                saveReasons.actionScheduleId = actionScheduledId;
                saveReasons.status = 'Y';
                Requests.updateReasons(saveReasons, this.resolveSaveReasons);
                LayoutActions.setAlert({
                    message: this.layoutResources.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
            }
            else {
                saveReasons.reasonRequired = true;
                this.setState({
                    saveReasons: saveReasons
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveReasons.name, e));
        }
    };

    private onSaveCompleted = (): void => {
        try {
            const {
                completeTask
            } = this.state;

            if (completeTask) {
                if (completeTask.completedDate && completeTask.completedTime) {
                    completeTask.status = 'Y';
                    if (completeTask.avatarComplete) {
                        completeTask.completedBy = 'P' + completeTask.avatarComplete.peopleId.replace(/-/g, '');
                    }
                    completeTask.actionScheduleId = completeTask.actionScheduledId;
                    LayoutActions.showPageLoader();
                    Requests.updateCompletedStatus(completeTask, this.resolveSaveCompleted);
                }
                else {
                    completeTask.completedDateModified = true;
                    completeTask.timeModified = true;
                    this.setState({
                        completeTask: completeTask
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveCompleted.name, e));
        }
    };

    private onSaveReassign = (): void => {
        try {
            const {
                reassignTask,
                selectedPerson,
                stepErrors
            } = this.state;

            if (!stepErrors[0] && !stepErrors[1] && selectedPerson && reassignTask && this.layoutResources) {
                LayoutActions.showPageLoader();
                Requests.updateReassign(reassignTask.actionScheduledId, selectedPerson.personId, this.resolveSaveReassign);
                LayoutActions.setAlert({
                    message: this.layoutResources.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveReassign.name, e));
        }
    };

    private onSelect = (): void => {
        const person: IPeopleSearchModel | undefined = PeopleSearchStore.getSelectedPerson();
        this.setState({
            selectedOption: undefined,
            selectedPerson: person
        });
    };

    private onViewDetails = (actionScheduleId: number, category: number,
        difference: number, isPerDay: boolean, task: IMyTasksDetail,
        completed: boolean, canceled: boolean, waived: boolean): void => {
        try {
            LayoutActions.showPageLoader();
            const myTaskAddress: IMyTasksDetail = task;
            myTaskAddress.addressLine1 = task.addressLine1;
            myTaskAddress.addressLine2 = task.addressLine2;
            myTaskAddress.addressLine3 = task.addressLine3;
            myTaskAddress.addressLine4 = task.addressLine4;
            myTaskAddress.phoneFormat = task.phoneFormat;
            myTaskAddress.phoneNumber = task.phoneNumber;
            myTaskAddress.houseNumber = task.houseNumber;
            myTaskAddress.city = task.city;
            myTaskAddress.state = task.state;
            myTaskAddress.zipCode = task.zipCode;
            myTaskAddress.country = task.country;
            myTaskAddress.email = task.email;
            this.setState({
                canViewDetails: task.canViewDetails,
                canViewNotes: task.canViewNotes,
                canceled: canceled,
                category: category,
                completed: completed,
                difference: difference,
                isPerDay: isPerDay,
                myTaskAddress: myTaskAddress,
                waived: waived
            });
            Requests.getMyTasksDetails(actionScheduleId, this.resolveGetMyTasksDetails, this.props.impersonateInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDetails.name, e));
        }
    };

    private onViewProcessed = (): void => {
        try {
            this.setContent();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewProcessed.name, e));
        }
    };

    private onTextFieldEditChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                editTask
            } = this.state;

            if (editTask) {
                switch (event.target.id) {
                    case 'txtPriority':
                        if (!event.target.value.match(/^[0-9]*$/g)) {
                            const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                            event.target.value = event.target.value.replace(onlyNum, '');
                        }
                        else {
                            if (event.target.value.length < 3) {
                                editTask.priority = event.target.value;
                                editTask.priorityModified = true;
                                editTask.priorityInvalid = true;
                            }
                            else {
                                editTask.priority = event.target.value;
                                editTask.priorityModified = true;
                                editTask.priorityInvalid = false;
                            }
                        }
                        break;
                    case 'txtInstructions':
                        editTask.instruction = event.target.value;
                        break;
                    case 'txtNotes':
                        editTask.note = event.target.value;
                        break;
                }
                this.setState({
                    editTask: editTask
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldEditChange.name, e));
        }
    };

    private onYearTermSessionChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                editTask
            } = this.state;
            if (editTask) {
                switch (id) {
                    case 'ddlResponsible':
                        editTask.responsibleId = String(optionSelected.value);
                        if (Number(optionSelected.value) !== -1) {
                            editTask.avatarEdit = optionSelected.complement.avatar;
                            if (editTask.avatarEdit) {
                                editTask.avatarEdit.hasPicture = false;
                            }
                            editTask.peopleOrgCodeId = optionSelected.complement.avatar.peopleId;
                            editTask.addressLine1 = optionSelected.complement.addressLine1;
                            editTask.addressLine2 = optionSelected.complement.addressLine2;
                            editTask.addressLine3 = optionSelected.complement.addressLine3;
                            editTask.addressLine4 = optionSelected.complement.addressLine4;
                            editTask.city = optionSelected.complement.city;
                            editTask.country = optionSelected.complement.country;
                            editTask.email = optionSelected.complement.email;
                            editTask.houseNumber = optionSelected.complement.houseNumber;
                            editTask.phoneFormat = optionSelected.complement.phoneFormat;
                            editTask.phoneNumber = optionSelected.complement.phoneNumber;
                            editTask.state = optionSelected.complement.state;
                            editTask.zipCode = optionSelected.complement.zipCode;
                        }
                        break;
                    case 'ddlYearTerm':
                        editTask.yearTerm = String(optionSelected.value);
                        const yearTermVal = editTask.yearTerm.split('/');
                        const yearTerm: IYearTerm = { term: yearTermVal[1], year: Number(yearTermVal[0]) };
                        editTask.academicYear = String(yearTermVal[0]);
                        editTask.academicTerm = String(yearTermVal[1]);
                        LayoutActions.showPageLoader();
                        Requests.getSessions(yearTerm, this.resolveGetSessions);
                        break;
                    case 'ddlSession':
                        editTask.academicSession = String(optionSelected.value);
                        break;
                }
                this.setState({
                    editTask: editTask
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onYearTermSessionChange.name, e));
        }
    };

    // #region checklisttask
    private onCancelAddTask = () => {
        try {
            this.cleanTask();

            this.setState({
                openChecklistTask: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelAddTask.name, e));
        }
    };

    private onCheckboxChange = (event: any) => {
        try {
            try {
                const id: string = event.target.id;
                const checked: boolean = event.target.checked;

                const {
                    task
                } = this.state;

                switch (id) {
                    case 'chkRequired':
                        task.isRequired = checked;
                        break;
                    case 'chkActive':
                        task.isActive = checked;
                        break;
                }

                this.setState({
                    task
                });
            }
            catch (e) {
                this.logError(LogData.fromException(this.onCheckboxChange.name, e));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onDatePickerChecklistTaskChange = (date: string, id: string, isValid: boolean) => {
        try {
            const {
                task
            } = this.state;

            if (id === 'dpDueDate') {
                task.dueDateInvalid = !isValid;
                task.dueDate = date;
                task.dueDateModified = true;

                this.setState({
                    task
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDatePickerChecklistTaskChange.name, e));
        }
    };

    private onDropDownAddTaskChange = (option: IDropDownOption, id: string) => {
        try {
            const {
                task
            } = this.state;

            switch (id) {
                case 'ddlOffice':
                    task.officeId = Number(option.value);
                    task.officeModified = true;
                    task.actionId = undefined;
                    task.actionModified = false;
                    task.actionInvalid = false;
                    this.setState({
                        isLoadingAction: true,
                        task
                    });
                    Requests.getTemplateActions(Number(option.value), this.resolveGetTemplateActions);
                    break;
                case 'ddlAction':
                    task.actionId = option.value.toString();
                    task.actionModified = true;
                    task.actionInvalid = false;

                    if (task.officeId && this.props.impersonateInfo?.personId) {
                        const checklistResponsible: IChecklistResponsible =
                        {
                            actionId: option.value.toString(),
                            officeId: task.officeId,
                            impersonateInfo: this.props.impersonateInfo
                        };

                        this.setState({
                            isLoadingResponsible: true,
                            task
                        });

                        Requests.getTemplateDetail(checklistResponsible, this.resolveGetTemplateDetail);
                    }
                    break;
                case 'ddlResponsible':
                    task.responsibleId = Number(option.value);
                    if (Number(option.value) === -1 || option.complement === '-1') {
                        task.responsibleId = undefined;
                        task.responsible = undefined;
                        task.responsibleDetail = undefined;
                        this.setState({
                            showSearchButton: true
                        });
                    }
                    else {
                        this.setState({
                            showSearchButton: false
                        });
                    }
                    if (option.complement && option.complement.avatar) {
                        task.responsible = option.complement.avatar;
                        task.responsibleDetail = {
                            addressLine1: option.complement.addressLine1,
                            addressLine2: option.complement.addressLine2,
                            addressLine3: option.complement.addressLine3,
                            addressLine4: option.complement.addressLine4,
                            city: option.complement.city,
                            country: option.complement.country,
                            email: option.complement.email,
                            houseNumber: option.complement.houseNumber,
                            phoneFormat: option.complement.phoneFormat,
                            phoneNumber: option.complement.phoneNumber,
                            state: option.complement.state,
                            zipCode: option.complement.zipCode
                        };
                    }
                    this.setState({
                        task
                    });
                    break;
                case 'ddlYearTerm':
                    task.yearTermSelected = option.value.toString();
                    task.academicSession = undefined;
                    task.actionInvalid = false;
                    this.setState({
                        isLoadingSession: true
                    });
                    const value: string[] = option.value.toString().split('/');
                    const yearTerm: IYearTerm = { term: value[1], year: Number(value[0]) };
                    task.academicTerm = value[1];
                    task.academicYear = value[0];
                    Requests.getSessions(yearTerm, this.resolveGetSessions);
                    break;
                case 'ddlSession':
                    task.academicSession = option.value.toString();
                    task.actionInvalid = false;
                    break;
                case 'ddlDueDate':
                    task.option = Number(option.value);
                    if (task.option === 1) {
                        task.dueDate = '';
                        task.dueDateModified = false;
                    }
                    break;
            }

            this.setState({
                task
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropDownAddTaskChange.name, e));
        }
    };

    private onSaveTask = () => {
        try {
            const {
                task
            } = this.state;

            let isValid: boolean = true;

            if (!Boolean(task.officeId)) {
                isValid = false;
                task.officeModified = true;
            }

            if (!Boolean(task.actionId)) {
                isValid = false;
                task.actionModified = true;
            }

            if (!Boolean(task.priority)) {
                isValid = false;
                task.priorityModified = true;
            }
            else {
                if (task.priority && task.priority.length < 3) {
                    isValid = false;
                    task.priorityInvalid = true;
                }
            }

            if (!Boolean(task.dueDate)) {
                isValid = false;
                task.dueDateModified = true;
            }
            if (!Boolean(task.dueTime)) {
                isValid = false;
                task.timeModified = true;
            }
            else {
                if (task.dueTime.length > 5) {
                    task.dueTime = task.dueTime.substring(0, 5);
                }
            }

            if (isValid) {
                LayoutActions.setLoading(true);
                task.impersonateInfo = this.props.impersonateInfo;
                Requests.postSaveAction(task, this.resolveSaveAction);
            }

            this.setState({
                task
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveTask.name, e));
        }
    };

    private onSearchResponsible = () => {
        try {
            this.setState({
                openPeopleSearchModal: true,
                selectedPerson: undefined
            });
            PeopleSearchActions.setEmptySearch();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearchResponsible.name, e));
        }
    };

    private onTextFieldAddTaskChange = (event: any) => {
        try {
            const {
                task
            } = this.state;

            switch (event.target.id) {
                case 'txtPriority':
                    if (!event.target.value.match(/^[0-9]*$/g)) {
                        const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                        event.target.value = event.target.value.replace(onlyNum, '');
                    }
                    else {
                        task.priority = event.target.value;
                        task.priorityModified = true;
                        task.priorityInvalid = false;
                    }
                    break;
                case 'txtInstructions':
                    task.instruction = event.target.value;
                    break;
                case 'txtNotes':
                    task.note = event.target.value;
                    break;
            }

            this.setState({
                task
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldAddTaskChange.name, e));
        }
    };

    private onTimePickerChecklistTaskChange = (value: string) => {
        try {
            const {
                task
            } = this.state;

            task.dueTime = value;
            task.timeModified = true;

            this.setState({
                task
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTimePickerChecklistTaskChange.name, e));
        }
    };

    private onClickAssociatedTaskLink = (): void => {
        try {
            this.cleanTask();

            this.setState({
                openChecklistTask: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddTask.name, e));
        }
    };

    private onSearch = (): void => {
        try {
            this.setState({
                openPeopleSearchModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearch.name, e));
        }
    };

    private onClosePeopleSearchModal = (): void => {
        try {
            this.setState({
                openPeopleSearchModal: false,
                selectedPerson: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearch.name, e));
        }
    };

    private onSavePeopleSearchModal = (): void => {
        try {
            const {
                selectedPerson,
                task
            } = this.state;

            task.responsibleId = selectedPerson?.personId;

            this.setState({
                selectedPerson: undefined
            });

            if (task.responsibleId) {
                Requests.getContactInformation(task.responsibleId, this.resolveGetContactInformation);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSavePeopleSearchModal.name, e));
        }
    };
    // #endregion checklisttask

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

    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };
    // #endregion Loader Functions

    // #region Internal Functions
    private cleanTask = (): void => {
        const {
            task
        } = this.state;

        task.academicSession = undefined;
        task.academicTerm = undefined;
        task.academicYear = undefined;
        task.actionId = undefined;
        task.dueDate = '';
        task.dueTime = '';
        task.instruction = '';
        task.isActive = undefined;
        task.isRequired = false;
        task.note = '';
        task.officeId = undefined;
        task.priority = '';
        task.yearTermSelected = undefined;
        task.actionModified = false;
        task.actionInvalid = false;
        task.dueDateInvalid = false;
        task.dueDateModified = false;
        task.officeModified = false;
        task.priorityInvalid = false;
        task.priorityModified = false;
        task.timeModified = false;
        task.responsibleId = undefined;
        task.responsible = undefined;
        task.responsibleDetail = undefined;

        this.setState({
            actions: undefined,
            selectedPerson: undefined,
            sessions: [],
            task
        });
    };
    // #endregion Internal Functions

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

    // #region Functions
    private setQueryStringValues = (): void => {
        try {
            const hdnChecklistItemId: HTMLInputElement | undefined =
                document.getElementById('hdnChecklistItemId') as HTMLInputElement;
            if (hdnChecklistItemId && hdnChecklistItemId.value) {
                const checklistItemId = hdnChecklistItemId.value;
                hdnChecklistItemId.remove();
                this.setState({
                    anchorEl: null,
                    isOpenByQueryString: true,
                    myTaskViewDetailPopper: undefined,
                    openInfo: false,
                    openInfoViewDetails: false,
                    openMyTaskDetailModal: true
                }, () => {
                    Requests.getMyTasksDetails(Number(checklistItemId), this.resolveGetMyTasksDetails, this.props.impersonateInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setQueryStringValues.name, e));
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

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetCancelReasons = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCancelReasons.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status) {
                this.setState({
                    isCancelReason: true,
                    cancelReasons: result.data,
                    openCancelWaiveModal: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCancelReasons.name, e));
        }
    };

    private resolveGetEditContactInformation = (json: string): void => {
        try {
            const {
                editTask
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetEditContactInformation.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status && result.data && editTask) {
                if (this.props.impersonateInfo?.personId !== undefined) {
                    editTask.avatarEditResp = result.data.contact.avatar;
                    if (editTask.avatarEditResp && editTask.avatarEdit) {
                        editTask.avatarEditResp.hasPicture = false;
                        editTask.peopleCodeId = editTask.avatarEdit.peopleId;
                    }
                }
                else {
                    editTask.avatarEdit = result.data.contact.avatar;
                    if (editTask.avatarEditResp && editTask.avatarEdit) {
                        editTask.avatarEdit.hasPicture = false;
                        editTask.peopleOrgCodeId = editTask.avatarEdit.peopleId;
                    }
                }
                editTask.addressLine1 = result.data.contact.addressLine1;
                editTask.addressLine2 = result.data.contact.addressLine2;
                editTask.addressLine3 = result.data.contact.addressLine3;
                editTask.addressLine4 = result.data.contact.addressLine4;
                editTask.city = result.data.contact.city;
                editTask.country = result.data.contact.country;
                editTask.email = result.data.contact.email;
                editTask.houseNumber = result.data.contact.houseNumber;
                editTask.phoneFormat = result.data.contact.phoneFormat;
                editTask.phoneNumber = result.data.contact.phoneNumber;
                editTask.state = result.data.contact.state;
                editTask.zipCode = result.data.contact.zipCode;
                PeopleSearchActions.setEmptySearch();
                this.setState({
                    editTask: editTask,
                    isPeopleSearch: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetEditContactInformation.name, e));
        }
    };

    private resolveGetAdvisorContactInformation = (json: string): void => {
        try {
            const {
                myTaskDetail
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdvisorContactInformation.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status && result.data && myTaskDetail) {
                myTaskDetail.addressLine1 = result.data.contact.addressLine1;
                myTaskDetail.addressLine2 = result.data.contact.addressLine2;
                myTaskDetail.addressLine3 = result.data.contact.addressLine3;
                myTaskDetail.addressLine4 = result.data.contact.addressLine4;
                myTaskDetail.city = result.data.contact.city;
                myTaskDetail.country = result.data.contact.country;
                myTaskDetail.email = result.data.contact.email;
                myTaskDetail.houseNumber = result.data.contact.houseNumber;
                myTaskDetail.phoneFormat = result.data.contact.phoneFormat;
                myTaskDetail.phoneNumber = result.data.contact.phoneNumber;
                myTaskDetail.state = result.data.contact.state;
                myTaskDetail.zipCode = result.data.contact.zipCode;
                this.setState({
                    myTaskDetail: myTaskDetail,
                    myProcessedTaskDetail: myTaskDetail,
                    openInfo: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvisorContactInformation.name, e));
        }
    };

    private resolveGetAdvisorViewDetailsContactInformation = (json: string): void => {
        try {
            const {
                myTaskAddress
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdvisorViewDetailsContactInformation.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status && result.data) {
                if (myTaskAddress) {
                    myTaskAddress.addressLine1 = result.data.contact.addressLine1;
                    myTaskAddress.addressLine2 = result.data.contact.addressLine2;
                    myTaskAddress.addressLine3 = result.data.contact.addressLine3;
                    myTaskAddress.addressLine4 = result.data.contact.addressLine4;
                    myTaskAddress.city = result.data.contact.city;
                    myTaskAddress.country = result.data.contact.country;
                    myTaskAddress.email = result.data.contact.email;
                    myTaskAddress.houseNumber = result.data.contact.houseNumber;
                    myTaskAddress.phoneFormat = result.data.contact.phoneFormat;
                    myTaskAddress.phoneNumber = result.data.contact.phoneNumber;
                    myTaskAddress.state = result.data.contact.state;
                    myTaskAddress.zipCode = result.data.contact.zipCode;

                    this.setState({
                        myTaskAddress,
                        openInfoViewDetails: true
                    });
                }
                else {
                    const myTaskAddress: IMyTasksDetail = {
                        academicTerm: '',
                        academicYear: '',
                        actionId: '',
                        actionName: '',
                        actionScheduleId: 0,
                        actionScheduledId: 0,
                        assignedDate: '',
                        assignedTime: '',
                        officeId: 0,
                        officeDesc: '',
                        addressLine1: result.data.contact.addressLine1,
                        addressLine2: result.data.contact.addressLine2,
                        addressLine3: result.data.contact.addressLine3,
                        addressLine4: result.data.contact.addressLine4,
                        city: result.data.contact.city,
                        country: result.data.contact.country,
                        difference: 0,
                        email: result.data.contact.email,
                        houseNumber: result.data.contact.houseNumber,
                        isPerDay: false,
                        phoneFormat: result.data.contact.phoneFormat,
                        phoneNumber: result.data.contact.phoneNumber,
                        state: result.data.contact.state,
                        zipCode: result.data.contact.zipCode
                    };
                    this.setState({
                        myTaskAddress: myTaskAddress,
                        openInfoViewDetails: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvisorViewDetailsContactInformation.name, e));
        }
    };

    private resolveGetAdvisorEditContactInformation = (json: string): void => {
        try {
            const {
                myTaskEditPopper
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdvisorEditContactInformation.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status && result.data && myTaskEditPopper) {
                myTaskEditPopper.addressLine1 = result.data.contact.addressLine1;
                myTaskEditPopper.addressLine2 = result.data.contact.addressLine2;
                myTaskEditPopper.addressLine3 = result.data.contact.addressLine3;
                myTaskEditPopper.addressLine4 = result.data.contact.addressLine4;
                myTaskEditPopper.city = result.data.contact.city;
                myTaskEditPopper.country = result.data.contact.country;
                myTaskEditPopper.email = result.data.contact.email;
                myTaskEditPopper.houseNumber = result.data.contact.houseNumber;
                myTaskEditPopper.phoneFormat = result.data.contact.phoneFormat;
                myTaskEditPopper.phoneNumber = result.data.contact.phoneNumber;
                myTaskEditPopper.state = result.data.contact.state;
                myTaskEditPopper.zipCode = result.data.contact.zipCode;
                this.setState({
                    myTaskEditPopper: myTaskEditPopper,
                    openPopperEdit: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvisorEditContactInformation.name, e));
        }
    };

    private resolveGetEditResponsibleInformation = (json: string): void => {
        try {
            const {
                editTask
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetEditResponsibleInformation.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status && result.data && editTask) {
                editTask.avatarEditResp = result.data.contact.avatar;
                if (editTask.avatarEditResp) {
                    editTask.avatarEditResp.hasPicture = false;
                    editTask.peopleCodeId = editTask.avatarEditResp.peopleId;
                }
                editTask.addressLine1 = result.data.contact.addressLine1;
                editTask.addressLine2 = result.data.contact.addressLine2;
                editTask.addressLine3 = result.data.contact.addressLine3;
                editTask.addressLine4 = result.data.contact.addressLine4;
                editTask.city = result.data.contact.city;
                editTask.country = result.data.contact.country;
                editTask.email = result.data.contact.email;
                editTask.houseNumber = result.data.contact.houseNumber;
                editTask.phoneFormat = result.data.contact.phoneFormat;
                editTask.phoneNumber = result.data.contact.phoneNumber;
                editTask.state = result.data.contact.state;
                editTask.zipCode = result.data.contact.zipCode;
                this.setState({
                    editTask: editTask,
                    isPeopleSearch: false
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetEditResponsibleInformation.name, e));
        }
    };

    private resolveGetEditAdvisorResponsibleInformation = (json: string): void => {
        try {
            const {
                editTask
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetEditAdvisorResponsibleInformation.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status && result.data && editTask) {
                editTask.avatarEdit = result.data.contact.avatar;
                if (editTask.avatarEdit) {
                    editTask.avatarEdit.hasPicture = false;
                    editTask.peopleOrgCodeId = editTask.avatarEdit.peopleId;
                }
                editTask.addressLine1 = result.data.contact.addressLine1;
                editTask.addressLine2 = result.data.contact.addressLine2;
                editTask.addressLine3 = result.data.contact.addressLine3;
                editTask.addressLine4 = result.data.contact.addressLine4;
                editTask.city = result.data.contact.city;
                editTask.country = result.data.contact.country;
                editTask.email = result.data.contact.email;
                editTask.houseNumber = result.data.contact.houseNumber;
                editTask.phoneFormat = result.data.contact.phoneFormat;
                editTask.phoneNumber = result.data.contact.phoneNumber;
                editTask.state = result.data.contact.state;
                editTask.zipCode = result.data.contact.zipCode;
                this.setState({
                    editTask: editTask,
                    isPeopleSearch: false
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetEditAdvisorResponsibleInformation.name, e));
        }
    };

    private resolveGetCompleteContactInformation = (json: string): void => {
        try {
            const {
                completeTask
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCompleteContactInformation.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status && result.data && completeTask) {
                completeTask.avatarComplete = result.data.contact.avatar;
                completeTask.completedDate = moment().format(Constants.dateFormat);
                completeTask.completedTime = moment().format(Constants.timeFormat);
                if (completeTask.avatarComplete) {
                    completeTask.avatarComplete.hasPicture = false;
                }
                completeTask.completedDateModified = false;
                completeTask.timeModified = false;
                completeTask.completedDateInvalid = false;
                this.setState({
                    completeTask: completeTask,
                    openCompleteModal: true
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCompleteContactInformation.name, e));
        }
    };

    private resolveGetMyTasksDetails = (json: string): void => {
        try {
            const {
                isProcessedOpen
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetMyTasksDetails.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status) {
                const myTaskDetail: IMyTasksViewDetails = result.data;
                if (myTaskDetail) {
                    if (this.props.impersonateInfo?.personId) {
                        myTaskDetail.avatar.peopleId = myTaskDetail.peopleOrgCodeId;
                        myTaskDetail.avatarResp.peopleId = myTaskDetail.peopleCodeId;
                        myTaskDetail.isImpersonate = true;
                    }
                    else {
                        myTaskDetail.avatar.peopleId = myTaskDetail.peopleCodeId;
                        myTaskDetail.avatarResp.peopleId = myTaskDetail.peopleOrgCodeId;
                        myTaskDetail.isImpersonate = false;
                    }

                    this.setState({
                        myTaskViewDetail: myTaskDetail,
                        openMyTaskDetailModal: !isProcessedOpen ? true : false,
                        openMyTaskDetailProcessedModal: true
                    });

                    const checklistId: string = myTaskDetail.actionScheduledId.toString();
                    const url: string = QueryString.setCurrentUrl({ checklistItemId: checklistId });
                    Storage.saveToStorage(StorageKeys.urlChecklist, url);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetMyTasksDetails.name, e));
        }
    };

    private resolveGetWaiveReasons = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetWaiveReasons.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status) {
                this.setState({
                    waiveReasons: result.data,
                    openCancelWaiveModal: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetWaiveReasons.name, e));
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
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetMyTasks = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetMyTasks.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status && result.data) {
                PeopleSearchActions.setEmptySearch();
                this.setState({
                    isLoading: false,
                    myTasks: result.data
                }, () => {
                    this.setQueryStringValues();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetMyTasks.name, e));
        }
    };

    private resolveGetMyEditTask = (json: string): void => {
        try {
            const {
                category
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetMyEditTask.name, this.hideAllLoaders);

            if (result?.status && result.data) {
                const editTask: IMyTasksDetail = result.data[0];
                if (editTask) {
                    editTask.isRequired = false;
                    if (String(editTask.required) === 'Y' || String(editTask.required) === '1') {
                        editTask.isRequired = true;
                    }
                    editTask.category = category;
                    editTask.priorityModified = false;
                    editTask.priorityInvalid = false;
                    editTask.scheduleDateInvalid = false;
                    editTask.scheduleDateModified = false;
                    editTask.scheduleTimeModified = false;
                    editTask.yearTerm = editTask.academicYear + '/' + editTask.academicTerm;
                    editTask.session = editTask.academicSession;
                    editTask.avatarEdit = editTask.avatar;
                    editTask.avatarEditResp = editTask.avatarResp;
                    this.setState({
                        editTask: editTask
                    });
                }
                Requests.getYearTerm(editTask.academicYear, editTask.academicTerm, this.resolveGetYearTerm);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetMyEditTask.name, e));
        }
    };

    private resolveGetMyProcessedTasks = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetMyProcessedTasks.name, this.hideAllLoaders);

            if (result?.status) {
                const myProcessedTasks: IMyTasks = result.data;
                if (result.data) {
                    const page: number = this.preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(result.data.overallCount);
                    const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                    this.setState({
                        myProcessedTasks: myProcessedTasks,
                        isProcessedOpen: true,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: rowsPerPageOptions
                    }, () => {
                        LayoutActions.hidePageLoader();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetMyProcessedTasks.name, e));
        }
    };

    private resolveGetPermissions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPermissions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    checkListPermissions: result.data
                }, () => {
                    Requests.getMyTasks(this.resolveGetMyTasks, this.props.impersonateInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPermissions.name, e));
        }
    };

    private resolveGetYearTerm = (json: string): void => {
        try {
            const {
                editTask
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetYearTerm.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status && editTask) {
                if (this.props.impersonateInfo?.personId !== undefined) {
                    const checklistResponsible: IChecklistResponsible =
                    {
                        actionId: String(editTask.actionId),
                        officeId: editTask.officeId,
                        impersonateInfo: this.props.impersonateInfo
                    };
                    Requests.getTemplateDetail(checklistResponsible, this.resolveGetResponsibles);
                }
                this.setState({
                    sessions: result.data.sessions,
                    yearTerm: result.data.yearTerms,
                    openEditModal: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetYearTerm.name, e));
        }
    };

    private resolveGetResponsibles = (json: string): void => {
        try {
            const {
                editTask,
                resources
            } = this.state;
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetResponsibles.name, this.hideAllLoaders);
            if (result?.status && resources && editTask) {
                const editResponsibles: IDropDownOption[] = result.data.responsibles;
                const otherOption: IDropDownOption = {
                    description: resources.checklistTaskResources.lblOther,
                    value: -1,
                    complement: '-1'
                };
                editResponsibles?.push(otherOption);
                this.setState({
                    editResponsibles: editResponsibles
                });
                if (editTask.avatarEditResp) {
                    Requests.getContactInformation(Number(editTask.avatarEditResp.personId), this.resolveGetEditResponsibleInformation);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResponsibles.name, e));
        }
    };

    private resolveSaveEdit = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveEdit.name, this.hideAllLoaders);

            const {
                editTask
            } = this.state;
            if (result?.status && editTask && this.layoutResources) {
                if (editTask.avatarEdit && editTask.avatarEditResp) {
                    editTask.avatarEdit.peopleId = '';
                    editTask.avatarEditResp.peopleId = '';
                }
                this.setState({
                    openEditModal: false,
                    editTask: undefined
                });
                LayoutActions.setAlert({
                    message: this.layoutResources.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
                Requests.getMyTasks(this.resolveGetMyTasks, this.props.impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveEdit.name, e));
        }
    };

    private resolveSaveReasons = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveReasons.name, this.hideAllLoaders);

            const {
                saveReasons
            } = this.state;
            saveReasons.reasonRequired = false;
            saveReasons.note = '';
            saveReasons.reason = '';
            saveReasons.reasonSelected = '';
            if (result?.status) {
                this.setState({
                    openCancelWaiveModal: false,
                    saveReasons: saveReasons
                });
                Requests.getMyTasks(this.resolveGetMyTasks, this.props.impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveReasons.name, e));
        }
    };

    private resolveSaveCompleted = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveCompleted.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    completeTask: undefined,
                    isPeopleSearch: false,
                    openCompleteModal: false
                });

                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                Requests.getMyTasks(this.resolveGetMyTasks, this.props.impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveCompleted.name, e));
        }
    };

    // #region checklisttask
    private resolveGetTemplateOffices = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetTemplateOffices.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    avatarInfo: result.data.avatar,
                    isLoading: false,
                    offices: result.data.offices,
                    openChecklistTask: true,
                    yearTerms: result.data.yearTerms
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTemplateOffices.name, e));
        }
    };

    private resolveGetTemplateActions = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetTemplateActions.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    actions: result.data,
                    isLoadingAction: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTemplateActions.name, e));
        }
    };

    private resolveGetTemplateDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetTemplateDetail.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    task
                } = this.state;

                if (result.data.checklist.academicYear && result.data.checklist.academicTerm) {
                    task.academicYear = result.data.checklist.academicYear;
                    task.academicTerm = result.data.checklist.academicTerm;
                    task.yearTermSelected = `${result.data.checklist.academicYear}/${result.data.checklist.academicTerm}`;
                }
                const yearTerm: IYearTerm = {
                    term: result.data.checklist.academicTerm ? result.data.checklist.academicTerm : '',
                    year: result.data.checklist.academicYear ? Number(result.data.checklist.academicYear) : 0
                };
                Requests.getSessions(yearTerm, this.resolveGetSessions);

                if (result.data.checklist.academicSession) {
                    task.academicSession = result.data.checklist.academicSession;
                }

                task.dueDate = result.data.checklist.dueDate;
                if (result.data.checklist.dueTime.length > 5) {
                    task.dueTime = result.data.checklist.dueTime.substring(0, 5);
                }
                else {
                    task.dueTime = result.data.checklist.dueTime;
                }
                task.instruction = result.data.checklist.instruction;
                task.isRequired = result.data.checklist.isRequired;
                task.note = result.data.checklist.note;
                task.priority = result.data.checklist.priority;
                task.checklistTemplateId = result.data.checklist.TemplateId;

                this.setState({
                    isLoadingResponsible: false,
                    responsibles: result.data.responsibles,
                    task: task
                });
            }

            const {
                resources,
                responsibles
            } = this.state;
            if (resources) {
                const otherOption: IDropDownOption = {
                    description: resources.checklistTaskResources.lblOther,
                    value: -1,
                    complement: '-1'
                };
                responsibles?.push(otherOption);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTemplateDetail.name, e));
        }
    };

    private resolveGetSessions = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetSessions.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    sessions: result.data,
                    isLoadingSession: false
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSessions.name, e));
        }
    };

    private resolveSaveAction = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveSaveAction.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    this.cleanTask();

                    this.setState({
                        openChecklistTask: false
                    });
                    Requests.getMyTasks(this.resolveGetMyTasks, this.props.impersonateInfo);
                    LayoutActions.hidePageLoader();
                    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
                    if (layoutResources) {
                        LayoutActions.setAlert({
                            message: layoutResources.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveAction.name, e));
        }
    };

    private resolveGetContactInformation = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetContactInformation.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    task,
                    resources,
                    responsibles
                } = this.state;

                task.responsibleDetail = result.data.contact;
                task.responsible = result.data.contact.avatar;

                if (responsibles && resources && task && task.responsibleId) {
                    const id: number = responsibles.findIndex(x => x.value === task.responsibleId);
                    if (id === -1) {
                        responsibles.splice(responsibles.findIndex(x => x.value === -1), 1);
                        const otherOption: IDropDownOption = {
                            description: resources.checklistTaskResources.lblOther,
                            value: task.responsibleId,
                            complement: '-1'
                        };
                        responsibles.push(otherOption);
                        this.setState({
                            showSearchButton: true
                        });
                    }
                }

                this.setState({
                    openPeopleSearchModal: false,
                    task
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSessions.name, e));
        }
    };
    // #endregion checklisttask

    private resolveSaveReassign = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveReassign.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    activeStep: 0,
                    numSteps: 2,
                    reassignTask: undefined,
                    isPeopleSearch: false,
                    openReassignModal: false,
                    stepErrors: [false, false]
                });
                Requests.getMyTasks(this.resolveGetMyTasks, this.props.impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveReassign.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            RequestsLayout.getPermissions(this.idModule, this.idPage,
                this.resolveGetPermissions,
                this.logError);
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

    public componentWillUnmount(): void {
        PeopleSearchStore.removeSelectedPersonListener(this.onSelect);
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            anchorEl,
            allExpanded,
            avatarInfo,
            cancelReasons,
            canceled,
            canViewNotes,
            canViewDetails,
            category,
            checkListPermissions,
            completed,
            componentError,
            completeTask,
            cultures,
            difference,
            editResponsibles,
            editTask,
            isPeopleSearch,
            isPerDay,
            isCancelReason,
            isLoading,
            isProcessedOpen,
            myTasks,
            myTaskAddress,
            myTaskEditPopper,
            myTaskViewDetailPopper,
            myTaskDetail,
            myProcessedTaskDetail,
            myProcessedTasks,
            myTaskViewDetail,
            openInfo,
            openInfoViewDetails,
            openCancelWaiveModal,
            openCompleteModal,
            openEditModal,
            openPopperEdit,
            openMyTaskDetailModal,
            openMyTaskDetailProcessedModal,
            openReassignModal,
            reassignTask,
            saveReasons,
            selectedPerson,
            taskActionName,
            waiveReasons,
            waived,
            yearTerm,
            resources,

            // #region Pagination
            page,
            rowsPerPage,
            // #endregion Pagination

            // #region ChecklistTask
            actions,
            isLoadingAction,
            isLoadingResponsible,
            isLoadingSession,
            offices,
            openChecklistTask,
            openPopperAdd,
            openPeopleSearchModal,
            responsibles,
            sessions,
            showSearchButton,
            task,
            yearTerms,
            // #endregion ChecklistTask
            // #region Stepper
            activeStep,
            numSteps,
            stepErrors
            // #endregion Stepper
        } = this.state;

        const {
            classes,
            createActionClaim,
            isAdviseeProfile
        } = this.props;

        const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
        let cancelWaiveModal: JSX.Element | undefined;
        let myTaskCompleteModal: JSX.Element | undefined;
        let myTaskEditModal: JSX.Element | undefined;
        let myTaskEditPopperM: JSX.Element | undefined;
        let myTaskReassignModal: JSX.Element | undefined;
        let contentPage: JSX.Element | JSX.Element[] | undefined;
        let contentDetail: JSX.Element | undefined;
        let emptyContent: JSX.Element | undefined;
        let emptyContentTask: JSX.Element | undefined;
        let myTaskDetailModal: JSX.Element | undefined;
        let taskDetail: JSX.Element | undefined;
        let taskProcessedDetail: JSX.Element | undefined;
        let taskProcessedPopperViewDetail: JSX.Element | undefined;
        let taskViewDetail: JSX.Element | undefined;
        const phoneFormat: string = '@';

        if (isLoading && isAdviseeProfile) {
            return (
                <ContainerLoader id="ldrGradeReport" height="md" />
            );
        }
        else if (!componentError && resources) {
            emptyContent = (
                <Illustration
                    color="secondary"
                    name="under-maintenance"
                    text={resources.lblNoScheduledTasks}
                />
            );

            emptyContentTask = (
                <Illustration
                    color="secondary"
                    internalName="no-activities"
                    text={resources.lblToStartWork}
                />
            );

            if (myTaskDetail) {
                taskDetail = (
                    <>
                        <Popper
                            arrow
                            id="popPrimaryRequiredInfo"
                            open={openInfo}
                            placement="bottom-start"
                            anchorEl={anchorEl}
                            onClickAway={this.onClosePopper}
                            transition={false}
                            TextTypographyProps={{ className: classes.popperText }}
                        >
                            <Grid container>
                                <Grid item>
                                    <Text
                                        weight="strong"
                                    >
                                        {this.props.impersonateInfo?.personId === undefined ? resources.lblContact : resources.checklistTaskResources.lblResponsible}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="phone"
                                    />
                                </Grid>
                                <Grid item>
                                    <Text>
                                        {Format.toPhone(myTaskDetail.phoneNumber ? myTaskDetail.phoneNumber : '',
                                            myTaskDetail.phoneFormat ? myTaskDetail.phoneFormat : '', phoneFormat)}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="email"
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        id="btnSendEmail"
                                        align="left"
                                        textVariantStyling="inherit"
                                        variant="text"
                                    >
                                        {myTaskDetail.email}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="location"
                                    />
                                </Grid>
                                {myTaskDetail && (
                                    <Grid item>
                                        <Text>
                                            <span dangerouslySetInnerHTML={{
                                                __html: Format.toString(resources.formatAddress, [
                                                    myTaskDetail.addressLine1,
                                                    myTaskDetail.addressLine2,
                                                    myTaskDetail.addressLine3,
                                                    myTaskDetail.addressLine4,
                                                    myTaskDetail.houseNumber,
                                                    myTaskDetail.city,
                                                    myTaskDetail.state,
                                                    myTaskDetail.zipCode,
                                                    myTaskDetail.country
                                                ])
                                            }}
                                            />
                                        </Text>
                                    </Grid>
                                )}
                            </Grid>
                        </Popper>
                    </>
                );
            }

            if (myTaskViewDetail && myTaskAddress && openInfoViewDetails && myTaskViewDetailPopper) {
                taskViewDetail = (
                    <>
                        <Popper
                            arrow
                            id="popViewDetail"
                            open={openInfoViewDetails}
                            anchorEl={anchorEl}
                            onClickAway={this.onClosePopperViewDetail}
                            transition={false}
                            TextTypographyProps={{ className: classes.popperText }}
                        >
                            <Grid container>
                                <Grid item>
                                    <Text
                                        weight="strong"
                                    >
                                        {this.props.impersonateInfo?.personId === undefined ? resources.lblContact : resources.checklistTaskResources.lblResponsible}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="phone"
                                    />
                                </Grid>
                                <Grid item>
                                    <Text>
                                        {Format.toPhone(myTaskAddress.phoneNumber ? myTaskAddress.phoneNumber : '',
                                            myTaskAddress.phoneFormat ? myTaskAddress.phoneFormat : '', phoneFormat)}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="email"
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        id="btnSendEmail"
                                        align="left"
                                        textVariantStyling="inherit"
                                        variant="text"
                                    >
                                        {myTaskAddress.email}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="location"
                                    />
                                </Grid>
                                <Grid item>
                                    <Text>
                                        <span dangerouslySetInnerHTML={{
                                            __html: Format.toString(resources.formatAddress, [
                                                myTaskAddress.addressLine1,
                                                myTaskAddress.addressLine2,
                                                myTaskAddress.addressLine3,
                                                myTaskAddress.addressLine4,
                                                myTaskAddress.houseNumber,
                                                myTaskAddress.city,
                                                myTaskAddress.state,
                                                myTaskAddress.zipCode,
                                                myTaskAddress.country
                                            ])
                                        }}
                                        />
                                    </Text>
                                </Grid>

                            </Grid>
                        </Popper>
                    </>
                );
            }

            if (openCancelWaiveModal) {
                cancelWaiveModal = (
                    <CancelWaiveModal
                        checkListPermissions={checkListPermissions}
                        canViewNotes={canViewNotes}
                        onClose={this.onCloseModal}
                        isCancelReason={isCancelReason}
                        onDropdownChange={this.onDropDownChange}
                        onSaveReasons={this.onSaveReasons}
                        onTextFieldChange={this.onTextFieldChange}
                        cancelWaivedReasons={isCancelReason ? cancelReasons : waiveReasons}
                        open={openCancelWaiveModal}
                        taskName={taskActionName}
                        saveReasons={saveReasons}
                        resources={resources}
                    />
                );
            }

            if (openMyTaskDetailModal && myTaskViewDetail) {
                myTaskDetailModal = (
                    <MyTasksViewDetailModal
                        category={category}
                        canViewDetails={canViewDetails}
                        canViewNotes={canViewNotes}
                        checkListPermissions={checkListPermissions}
                        difference={difference}
                        isPerDay={isPerDay}
                        onClose={this.onCloseViewDetailModal}
                        open={openMyTaskDetailModal}
                        onOpenPopper={this.onOpenPopperViewDetails}
                        impersonateInfo={this.props.impersonateInfo}
                        myTaskViewDetail={myTaskViewDetail}
                        resources={resources}
                    />
                );
            }

            if (openCompleteModal) {
                myTaskCompleteModal = (
                    <MyTasksCompletedModal
                        checkListPermissions={checkListPermissions}
                        cultures={cultures}
                        isPeopleSearch={isPeopleSearch}
                        open={openCompleteModal}
                        impersonateInfo={this.props.impersonateInfo}
                        resources={resources}
                        saveComplete={completeTask}
                        onChange={this.onChangePerson}
                        onClose={this.onCloseCompleteModal}
                        onCloseSearch={this.onCloseSearch}
                        onDatePickerChange={this.onDatePickerChange}
                        onNext={this.onNext}
                        onSaveCompleted={this.onSaveCompleted}
                        onTextFieldChange={this.onTextFieldChange}
                        onTimePickerChange={this.onTimePickerChange}
                    />
                );
            }

            let peopleSearchModal: JSX.Element | undefined;
            if (openPeopleSearchModal) {
                peopleSearchModal = (
                    <Modal
                        id="searchModal"
                        header={resources.checklistTaskResources.lblSearchResponsible}
                        maxWidth="md"
                        footer={(
                            <ButtonGroup id="bgAddCampaign">
                                <Button
                                    disabled={isLoading}
                                    color="secondary"
                                    id="btnCloseAddCampaign"
                                    onClick={this.onClosePeopleSearchModal}
                                >
                                    {resources.checklistTaskResources.btnCancel}
                                </Button>
                                <Button
                                    loading={isLoading}
                                    id="btnAddCampaign"
                                    onClick={this.onSavePeopleSearchModal}
                                >
                                    {resources.checklistTaskResources.btnAdd}
                                </Button>
                            </ButtonGroup>
                        )}
                        open={openPeopleSearchModal}
                        onClose={this.onClosePeopleSearchModal}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <PeopleSearch
                                    modalResources={resources.peopleSearchModal}
                                    open={openPeopleSearchModal}
                                    onClose={this.onCloseSearch}
                                />
                            </Grid>
                        </Grid>
                    </Modal>
                );
            }

            let addingTask: JSX.Element | undefined;
            const resourcesLayout: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
            const emptyOption: IDropDownOption = {
                description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
                value: 0
            };
            const dateMinFormat: string = moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
            const dateMaxFormat: string = moment().add(100, 'years').format(cultures.shortDatePattern.toUpperCase());

            if (openChecklistTask) {
                addingTask = (
                    <>
                        <ChecklistTask
                            actions={actions}
                            anchorEl={anchorEl}
                            avatarInfo={avatarInfo}
                            cultures={cultures}
                            dateMaxFormat={dateMaxFormat}
                            dateMinFormat={dateMinFormat}
                            emptyOption={emptyOption}
                            isLoadingAction={isLoadingAction}
                            isLoadingResponsible={isLoadingResponsible}
                            isLoadingSession={isLoadingSession}
                            offices={offices}
                            openPopperAdd={openPopperAdd}
                            responsibles={responsibles}
                            sessions={sessions}
                            showSearchButton={showSearchButton}
                            task={task}
                            yearTerms={yearTerms}
                            resources={resources.checklistTaskResources}
                            onCancel={this.onCancelAddTask}
                            onCheckboxChange={this.onCheckboxChange}
                            onClickAssociatedTaskLink={this.onClickAssociatedTaskLink}
                            onClosePopperAdd={this.onClosePopperAdd}
                            onDatePickerChange={this.onDatePickerChecklistTaskChange}
                            onDropdownChange={this.onDropDownAddTaskChange}
                            onOpenPopperAdd={this.onOpenPopperAdd}
                            onSave={this.onSaveTask}
                            onSearchResponsible={this.onSearchResponsible}
                            onTextFieldChange={this.onTextFieldAddTaskChange}
                            onTimePickerChange={this.onTimePickerChecklistTaskChange}
                        />
                        {peopleSearchModal}
                    </>
                );
            }

            if (openReassignModal) {
                myTaskReassignModal = (
                    <MyTasksReassignModal
                        activeStep={activeStep}
                        isPeopleSearch={isPeopleSearch}
                        open={openReassignModal}
                        onClickStep={this.onClickStep}
                        onClose={this.onCloseCompleteModal}
                        onSaveReassign={this.onSaveReassign}
                        numSteps={numSteps}
                        saveReassign={reassignTask}
                        selectedPerson={selectedPerson}
                        stepErrors={stepErrors}
                        resources={resources}
                    />
                );
            }

            if (myTasks && myTasks?.length > 0) {
                contentDetail = (
                    <MyTasksListDetail
                        allExpanded={allExpanded}
                        checkListPermissions={checkListPermissions}
                        impersonateInfo={this.props.impersonateInfo}
                        key="myTasksDetail"
                        myTasks={myTasks}
                        onCancel={this.onCancelAction}
                        onComplete={this.onCompleteAction}
                        onClickDetails={this.onViewDetails}
                        onEdit={this.onEditAction}
                        onExpand={this.onExpandedCategory}
                        onOpenPopper={this.onOpenPopper}
                        onWaive={this.onWaiveAction}
                        onReassign={this.onReassignAction}
                        resources={resources}
                    />
                );
                contentPage = (
                    <>
                        <Card>
                            <CardContent>
                                {isAdviseeProfile && (
                                    openChecklistTask ? addingTask :
                                        (
                                            <Grid container spacing={3} justifyContent="space-between">
                                                <Grid item>
                                                    <Text
                                                        size="h3"
                                                        weight="strong"
                                                    >
                                                        {resources.lblAssociatedTasks}
                                                    </Text>
                                                </Grid>
                                                {createActionClaim && (
                                                    <Grid item>
                                                        <Tooltip
                                                            id="tltAddTask"
                                                            title={resources.btnAddTask}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnAddTask}
                                                                onClick={this.onAddTask}
                                                                id="btnAddAddress"
                                                            >
                                                                <Icon name="add" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        )
                                )}
                                {!openChecklistTask ?
                                    (
                                        <>
                                            <Grid container spacing={3} justifyContent="space-between">
                                                <Grid item>
                                                    <Grid container spacing={1} justifyContent="space-between">
                                                        <Grid item>
                                                            <Icon name="history" type="info" />
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                id="btnViewProcessed"
                                                                textVariantStyling="inherit"
                                                                variant="text"
                                                                onClick={this.onViewProcessed}
                                                            >
                                                                {resources.lblViewProcessed}
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                {layoutResources && (
                                                    <Grid item>
                                                        <Button
                                                            data-expanded={!allExpanded}
                                                            id="btnExpandCollapseAll"
                                                            variant="text"
                                                            onClick={this.onExpandAll}
                                                        >
                                                            {allExpanded ? layoutResources.lblCollapseAll : layoutResources.lblExpandAll}
                                                        </Button>
                                                    </Grid>
                                                )}
                                            </Grid>
                                            <br />
                                            {contentDetail}
                                            {taskDetail}
                                            {taskViewDetail}
                                            {cancelWaiveModal}
                                            {myTaskDetailModal}
                                            {myTaskCompleteModal}
                                            {myTaskReassignModal}
                                        </>
                                    ) : undefined}
                            </CardContent>
                        </Card>
                    </>
                );

            }
            else {
                contentPage = (
                    <>
                        <Card>
                            <CardContent>
                                {isAdviseeProfile ?
                                    openChecklistTask ? addingTask :
                                        (
                                            <>
                                                <Grid container spacing={3} justifyContent="space-between">
                                                    <Grid item>
                                                        <Grid container spacing={1} justifyContent="space-between">
                                                            <Grid item>
                                                                <Icon name="history" type="info" />
                                                            </Grid>
                                                            <Grid item>
                                                                <Button
                                                                    id="btnViewProcessed"
                                                                    textVariantStyling="inherit"
                                                                    variant="text"
                                                                    onClick={this.onViewProcessed}
                                                                >
                                                                    {resources.lblViewProcessed}
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    {createActionClaim && (
                                                        <Grid item>
                                                            <Tooltip
                                                                id="tltAddTask"
                                                                title={resources.btnAddTask}
                                                                placement="top"
                                                            >
                                                                <IconButton
                                                                    aria-label={resources.btnAddTask}
                                                                    onClick={this.onAddTask}
                                                                    id="btnAddAddress"
                                                                >
                                                                    <Icon name="add" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                                {createActionClaim ?
                                                    (
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12}>
                                                                {emptyContentTask}
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                    :
                                                    (
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12}>
                                                                {emptyContent}
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                }
                                            </>
                                        )
                                    :
                                    (
                                        <>
                                            <Grid container spacing={1}>
                                                <Grid item>
                                                    <Icon name="history" type="info" />
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        id="btnViewProcessed"
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={this.onViewProcessed}
                                                    >
                                                        {resources.lblViewProcessed}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    {emptyContent}
                                                </Grid>
                                            </Grid>
                                        </>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </>
                );
            }

            if (isProcessedOpen) {
                if (myProcessedTaskDetail) {
                    taskProcessedDetail = (
                        <Popper
                            arrow
                            id="popPrimaryRequiredInfo"
                            open={openInfo}
                            placement="bottom-start"
                            anchorEl={anchorEl}
                            onClickAway={this.onClosePopper}
                            transition={false}
                            TextTypographyProps={{ className: classes.popperText }}
                        >
                            <Grid container>
                                <Grid item>
                                    <Text
                                        weight="strong"
                                    >
                                        {this.props.impersonateInfo?.personId === undefined ? resources.lblContact : resources.checklistTaskResources.lblResponsible}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="phone"
                                    />
                                </Grid>
                                <Grid item>
                                    <Text>
                                        {Format.toPhone(myProcessedTaskDetail.phoneNumber ? myProcessedTaskDetail.phoneNumber : '',
                                            myProcessedTaskDetail.phoneFormat ? myProcessedTaskDetail.phoneFormat : '', phoneFormat)}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="email"
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        id="btnSendEmail"
                                        align="left"
                                        textVariantStyling="inherit"
                                        variant="text"
                                    >
                                        {myProcessedTaskDetail.email}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="location"
                                    />
                                </Grid>
                                {myProcessedTaskDetail && (
                                    <Grid item>
                                        <Text>
                                            <span dangerouslySetInnerHTML={{
                                                __html: Format.toString(resources.formatAddress, [
                                                    myProcessedTaskDetail.addressLine1,
                                                    myProcessedTaskDetail.addressLine2,
                                                    myProcessedTaskDetail.addressLine3,
                                                    myProcessedTaskDetail.addressLine4,
                                                    myProcessedTaskDetail.houseNumber,
                                                    myProcessedTaskDetail.city,
                                                    myProcessedTaskDetail.state,
                                                    myProcessedTaskDetail.zipCode,
                                                    myProcessedTaskDetail.country
                                                ])
                                            }}
                                            />
                                        </Text>
                                    </Grid>
                                )}
                            </Grid>
                        </Popper>
                    );
                }

                if (openInfoViewDetails && myTaskAddress) {
                    taskProcessedPopperViewDetail = (
                        <Popper
                            arrow
                            id="popPrimaryRequiredInfo"
                            open={openInfoViewDetails}
                            placement="bottom-start"
                            anchorEl={anchorEl}
                            onClickAway={this.onClosePopperProcessedViewDetail}
                            transition={false}
                            TextTypographyProps={{ className: classes.popperText }}
                        >
                            <Grid container>
                                <Grid item>
                                    <Text
                                        weight="strong"
                                    >
                                        {this.props.impersonateInfo?.personId === undefined ? resources.lblContact : resources.checklistTaskResources.lblResponsible}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="phone"
                                    />
                                </Grid>
                                <Grid item>
                                    <Text>
                                        {Format.toPhone(myTaskAddress.phoneNumber ? myTaskAddress.phoneNumber : '',
                                            myTaskAddress.phoneFormat ? myTaskAddress.phoneFormat : '', phoneFormat)}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="email"
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        id="btnSendEmail"
                                        align="left"
                                        textVariantStyling="inherit"
                                        variant="text"
                                    >
                                        {myTaskAddress.email}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="location"
                                    />
                                </Grid>
                                <Grid item>
                                    <Text>
                                        <span dangerouslySetInnerHTML={{
                                            __html: Format.toString(resources.formatAddress, [
                                                myTaskAddress.addressLine1,
                                                myTaskAddress.addressLine2,
                                                myTaskAddress.addressLine3,
                                                myTaskAddress.addressLine4,
                                                myTaskAddress.houseNumber,
                                                myTaskAddress.city,
                                                myTaskAddress.state,
                                                myTaskAddress.zipCode,
                                                myTaskAddress.country
                                            ])
                                        }}
                                        />
                                    </Text>
                                </Grid>
                            </Grid>
                        </Popper>
                    );
                }

                if (myProcessedTasks && myProcessedTasks.myTasks.length > 0) {
                    const totalRows: number = myProcessedTasks.overallCount ? myProcessedTasks.overallCount : 0;
                    if (openMyTaskDetailProcessedModal) {
                        myTaskDetailModal = (
                            <MyTasksViewDetailModal
                                checkListPermissions={checkListPermissions}
                                canViewDetails={canViewDetails}
                                canViewNotes={canViewNotes}
                                canceled={canceled}
                                completed={completed}
                                category={category}
                                difference={difference}
                                impersonateInfo={this.props.impersonateInfo}
                                isPerDay={isPerDay}
                                onClose={this.onCloseViewDetailModal}
                                open={openMyTaskDetailProcessedModal}
                                onOpenPopper={this.onOpenPopperViewDetails}
                                myTaskViewDetail={myTaskViewDetail}
                                waived={waived}
                                resources={resources}
                            />
                        );
                    }
                    if (myTaskViewDetail) {
                        taskViewDetail = (
                            <>
                                <Popper
                                    arrow
                                    id="popViewDetail"
                                    open={openInfo}
                                    placement="bottom-start"
                                    anchorEl={anchorEl}
                                    onClickAway={this.onClosePopperViewDetail}
                                    transition={false}
                                    TextTypographyProps={{ className: classes.popperText }}
                                >
                                    <Grid container>
                                        <Grid item>
                                            <Text
                                                weight="strong"
                                            >
                                                {this.props.impersonateInfo?.personId === undefined ?
                                                    resources.lblContact : resources.checklistTaskResources.lblResponsible}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item>
                                            <Icon name="phone" />
                                        </Grid>
                                        <Grid item>
                                            <Text>
                                                {Format.toPhone(myTaskViewDetail.phoneNumber ? myTaskViewDetail.phoneNumber : '',
                                                    myTaskViewDetail.phoneFormat ? myTaskViewDetail.phoneFormat : '', phoneFormat)}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item>
                                            <Icon
                                                name="email"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                id="btnSendEmail"
                                                align="left"
                                                textVariantStyling="inherit"
                                                variant="text"
                                            >
                                                {myTaskViewDetail.email}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item>
                                            <Icon
                                                name="location"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Text>
                                                <span dangerouslySetInnerHTML={{
                                                    __html: Format.toString(resources.formatAddress, [
                                                        myTaskViewDetail.addressLine1,
                                                        myTaskViewDetail.addressLine2,
                                                        myTaskViewDetail.addressLine3,
                                                        myTaskViewDetail.addressLine4,
                                                        myTaskViewDetail.houseNumber,
                                                        myTaskViewDetail.city,
                                                        myTaskViewDetail.state,
                                                        myTaskViewDetail.zipCode,
                                                        myTaskViewDetail.country
                                                    ])
                                                }}
                                                />
                                            </Text>
                                        </Grid>

                                    </Grid>
                                </Popper>
                            </>
                        );
                    }
                    contentPage = (
                        <>
                            <Card>
                                <CardContent>
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
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <MyTasksProcessed
                                                key="myTasksProcessed"
                                                onClickDetails={this.onViewDetails}
                                                myTasks={myProcessedTasks.myTasks}
                                                onOpenPopper={this.onOpenPopperProcessed}
                                                resources={resources}
                                            />
                                        </Grid>
                                    </Grid>
                                    {rowsPerPage > 0 && (
                                        <Grid container>
                                            <Grid item xs>
                                                <Pagination
                                                    count={totalRows}
                                                    page={page}
                                                    rowsPerPage={rowsPerPage}
                                                    rowsPerPageOptions={this.getRowsPerPageOptions(totalRows)}
                                                    onPageChange={this.onChangePage}
                                                    onRowsPerPageChange={this.onChangeRowsPerPage}
                                                />
                                            </Grid>
                                        </Grid >
                                    )}
                                </CardContent>
                            </Card>
                            {taskProcessedDetail}
                            {taskProcessedPopperViewDetail}
                            {taskViewDetail}
                            {myTaskDetailModal}
                        </>
                    );
                }
                else {
                    contentPage = (
                        <>
                            <Card>
                                <CardContent>
                                    <Grid container>
                                        <Grid item>
                                            <Paragraph
                                                gutterBottom
                                                id="prgBreadcrumbs"
                                                text={isAdviseeProfile ? resources.lblBreadcrumbsAssociated : resources.lblBreadcrumbs}
                                                events={[this.onReturnToList]}
                                            />
                                            <br />
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Illustration
                                        color="secondary"
                                        name="under-maintenance"
                                        text={resources.lblNoProcessedTasks}
                                    />
                                </CardContent>
                            </Card>
                        </>
                    );
                }
            }

            if (openEditModal) {
                if (openPopperEdit && myTaskEditPopper) {
                    myTaskEditPopperM = (
                        <Popper
                            arrow
                            id="popEditTaskInfo"
                            open={openPopperEdit}
                            placement="bottom-start"
                            anchorEl={anchorEl}
                            onClickAway={this.onClosePopperEdit}
                            transition={false}
                            TextTypographyProps={{ className: classes.popperText }}
                        >
                            <Grid container>
                                <Grid item>
                                    <Text
                                        weight="strong"
                                    >
                                        {this.props.impersonateInfo?.personId === undefined ? resources.lblContact : resources.checklistTaskResources.lblResponsible}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="phone"
                                    />
                                </Grid>
                                <Grid item>
                                    <Text>
                                        {Format.toPhone(myTaskEditPopper.phoneNumber ? myTaskEditPopper.phoneNumber : '',
                                            myTaskEditPopper.phoneFormat ? myTaskEditPopper.phoneFormat : '', phoneFormat)}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="email"
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        id="btnSendEmail"
                                        align="left"
                                        textVariantStyling="inherit"
                                        variant="text"
                                    >
                                        {myTaskEditPopper.email}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Icon
                                        name="location"
                                    />
                                </Grid>
                                <Grid item>
                                    <Text>
                                        <span dangerouslySetInnerHTML={{
                                            __html: Format.toString(resources.formatAddress, [
                                                myTaskEditPopper.addressLine1,
                                                myTaskEditPopper.addressLine2,
                                                myTaskEditPopper.addressLine3,
                                                myTaskEditPopper.addressLine4,
                                                myTaskEditPopper.houseNumber,
                                                myTaskEditPopper.city,
                                                myTaskEditPopper.state,
                                                myTaskEditPopper.zipCode,
                                                myTaskEditPopper.country
                                            ])
                                        }}
                                        />
                                    </Text>
                                </Grid>
                            </Grid>
                        </Popper>
                    );
                }

                myTaskEditModal = (
                    <MyTasksViewEdit
                        canViewNotes={canViewNotes}
                        checkListPermissions={checkListPermissions}
                        cultures={cultures}
                        impersonateInfo={this.props.impersonateInfo}
                        isPeopleSearch={isPeopleSearch}
                        myEditTask={editTask}
                        open={openReassignModal}
                        onChange={this.onChangePerson}
                        onClickStep={this.onClickStep}
                        onCloseSearch={this.onCloseSearch}
                        onNextEdit={this.onNextEdit}
                        onReturnToList={this.onReturnToList}
                        onCheckboxChange={this.onCheckboxEditChange}
                        onDatePickerChange={this.onDatePickerEditChange}
                        onDropdownChange={this.onYearTermSessionChange}
                        onOpenContactPopper={this.onOpenPopperEdit}
                        onSaveEdit={this.onSaveEdit}
                        onTextFieldChange={this.onTextFieldEditChange}
                        onTimePickerChange={this.onTimePickerEditChange}
                        responsibles={editResponsibles}
                        session={sessions}
                        yearTerm={yearTerm}
                        activeStep={activeStep}
                        numSteps={numSteps}
                        stepErrors={stepErrors}
                        selectedPerson={selectedPerson}
                        resources={resources}
                    />
                );
                contentPage = (
                    <>
                        {myTaskEditModal}
                        {myTaskEditPopperM}
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

// Component
export default withStyles(styles)(MyTasksMain);