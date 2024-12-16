/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ChecklistSetup.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Internal components
import ChecklistTask from './ChecklistTask';
import ChecklistTaskDefaults, { IChecklistTaskDefaultsResProps } from './ChecklistTaskDefaults';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IChecklistSetupResources } from '../../../Types/Resources/Administration/IChecklistSetupResources';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IChecklistAction } from '../../../Types/Checklist/IChecklistAction';
import { ITask } from '../../../Types/Checklist/ITask';
import { IYearTerm } from '../../../Types/Periods/IYearTerm';
import { ITaskDefaultOffice, ITaskDefault } from '../../../Types/Checklist/IChecklistsTaskDefaults';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Administration/ChecklistSetup';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
// #endregion Imports

// #region Types
export interface IChecklistSetupProps {
    lblSuccessSave: string;
}

interface IChecklistSetupRes extends IChecklistSetupResources {
    checklistTaskDefaults: IChecklistTaskDefaultsResProps;
}

interface IChecklistSetupState {
    allExpanded: boolean;
    cultures: ICultures;
    errorThresholdDays: boolean;
    isDeleteModalOpen: boolean;
    isLoading: boolean;
    isStartDateEmpty: boolean;
    isStartDateInvalid: boolean;
    resources?: IChecklistSetupRes;
    showSummaryDashboard: boolean;
    startDate: string;
    taskDefaultOffices?: ITaskDefaultOffice[];
    thresholdDays: number;

    // checklist task
    actions?: IDropDownOption[];
    actionName: string;
    dueDateTypes: IDropDownOption[];
    isLoadingAction: boolean;
    isLoadingSession: boolean;
    officeDesc: string;
    offices: IDropDownOption[];
    openAddTask: boolean;
    sessions?: IDropDownOption[];
    task: ITask;
    yearTerms: IDropDownOption[];
}
// #endregion Types

// #region Component
class ChecklistSetup extends React.Component<IChecklistSetupProps, IChecklistSetupState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;
    private iOfficeChanged: number;
    private iTaskDefaultChanged: number;
    private deleteTaskDefault?: ITaskDefault;

    public readonly state: Readonly<IChecklistSetupState>;

    public constructor(props: IChecklistSetupProps) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'ChecklistSetup';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.iOfficeChanged = -1;
        this.iTaskDefaultChanged = -1;
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IChecklistSetupState {
        let isLoading: boolean = true;
        let resources: IChecklistSetupRes | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            actionName: '',
            allExpanded: false,
            cultures: LayoutStore.getCultures(),
            errorThresholdDays: false,
            isDeleteModalOpen: false,
            isLoading: isLoading,
            isStartDateEmpty: false,
            isStartDateInvalid: false,
            resources: resources,
            showSummaryDashboard: false,
            startDate: '',
            taskDefaultOffices: [],
            thresholdDays: 7,

            // checklist task
            dueDateTypes: [],
            isLoadingAction: false,
            isLoadingSession: false,
            officeDesc: '',
            offices: [],
            openAddTask: false,
            task: {
                dueDate: '',
                dueTime: '',
                instruction: '',
                isRequired: false,
                note: '',
                offsetDays: 7,
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
                timeModified: false,
            },
            yearTerms: []
        };
    }

    // #region Events
    private onShowSummaryChange = (event: any): void => {
        try {
            const showSummaryDashboard: boolean = Boolean(event.target.checked);
            this.setState({
                showSummaryDashboard
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onShowSummaryChange.name, e));
        }
    };

    private onChangeDaysThreshold = (thresholdDays: number): void => {
        try {
            this.setState({
                thresholdDays
            });
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onChangeDaysThreshold.name, ex));
        }
    };

    private onBlurThresholdTextfield = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            this.setState({
                errorThresholdDays: event.target.value === ''
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurThresholdTextfield.name, e));
        }
    };

    private onChangeDatePicker = (startDate: string, _id: string, isValid: boolean) => {
        try {
            const isStartDateEmpty: boolean = startDate === '';
            const isStartDateInvalid: boolean = !isValid;

            this.setState({
                startDate,
                isStartDateEmpty,
                isStartDateInvalid
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDatePicker.name, e));
        }
    };

    private onSaveOptions = () => {
        try {
            const isStartDateEmpty: boolean = this.state.startDate === '';
            this.setState({
                isStartDateEmpty,
            });

            const {
                startDate,
                errorThresholdDays,
                isStartDateInvalid,
                showSummaryDashboard,
                thresholdDays
            } = this.state;

            if (!isStartDateInvalid && !isStartDateEmpty && !errorThresholdDays) {
                LayoutActions.showPageLoader();
                Requests.saveOptions(showSummaryDashboard, thresholdDays, startDate, this.resolveSaveOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveOptions.name, e));
        }
    };

    private onAddTaskDefault = () => {
        try {
            this.setState({
                openAddTask: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddTaskDefault.name, e));
        }
    };

    private onExpandAll = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                taskDefaultOffices
            } = this.state;

            const allExpanded: boolean = JSON.parse(event.currentTarget.dataset.expanded || 'false');

            if (taskDefaultOffices) {
                taskDefaultOffices.forEach(taskDefaultOffices => {
                    taskDefaultOffices.expanded = allExpanded;
                });
            }

            this.setState({
                allExpanded,
                taskDefaultOffices
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandAll.name, e));
        }
    };

    private onExpandOffice = (iOffice: number, expanded: boolean): void => {
        try {
            const {
                taskDefaultOffices
            } = this.state;

            let newAllExpanded: boolean = false;
            if (taskDefaultOffices) {
                taskDefaultOffices[iOffice].expanded = expanded;

                const tmpAllExpanded: boolean = taskDefaultOffices.every(office => office.expanded);
                const tmpAllCollapsed: boolean = taskDefaultOffices.every(office => !office.expanded);

                if (tmpAllCollapsed) {
                    newAllExpanded = false;
                }
                else if (tmpAllExpanded) {
                    newAllExpanded = true;
                }
            }

            this.setState({
                allExpanded: newAllExpanded,
                taskDefaultOffices
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandOffice.name, e));
        }
    };

    private onChangeStatus = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                taskDefaultOffices
            } = this.state;

            const [, taskDefaultId, iOffice, iTaskDefault] = event.target.id.split('_');
            const newStatus: boolean = !Boolean(event.target.value);
            this.iOfficeChanged = Number(iOffice);
            this.iTaskDefaultChanged = Number(iTaskDefault);

            if (taskDefaultOffices && taskDefaultOffices.length > 0) {
                taskDefaultOffices[iOffice].actions[iTaskDefault].isSwitchLoading = true;
                Requests.postTaskDefaultStatus(Number(taskDefaultId), newStatus, this.resolvePostStatus)
            }

            this.setState({
                taskDefaultOffices
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeStatus.name, e));
        }
    };

    private onClickDelete = (taskDefault: ITaskDefault) => {
        try {
            this.deleteTaskDefault = taskDefault;
            console.log(this.deleteTaskDefault);
            this.setState({
                isDeleteModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickDelete.name, e));
        }
    };

    private onCloseDeleteModal = () => {
        try {
            this.deleteTaskDefault = undefined;
            this.setState({
                isDeleteModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteModal.name, e));
        }
    };

    private onDeleteTaskDefault = () => {
        try {
            if (this.deleteTaskDefault !== undefined) {
                LayoutActions.showPageLoader();
                Requests.deleteTaskDefault(this.deleteTaskDefault.checklistTemplateId,
                    this.resolveDeleteTaskDefault);
                this.onCloseDeleteModal();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteTaskDefault.name, e));
        }
    };

    // #region checklist task
    private onCancelAddTask = () => {
        try {
            const {
                task
            } = this.state;

            task.academicSession = undefined;
            task.academicTerm = undefined;
            task.academicYear = undefined;
            task.actionId = undefined;
            task.checklistTemplateId = undefined;
            task.dueDate = '';
            task.option = undefined;
            task.dueTime = '';
            task.instruction = '';
            task.isActive = undefined;
            task.isRequired = false;
            task.note = '';
            task.officeId = undefined;
            task.offsetDays = 7;
            task.priority = '';
            task.yearTermSelected = undefined;
            task.actionModified = false;
            task.actionInvalid = false;
            task.dueDateInvalid = false;
            task.dueDateModified = false;
            task.officeModified = false;
            task.offsetDaysModified = false;
            task.optionModified = false;
            task.priorityInvalid = false;
            task.priorityModified = false;
            task.timeModified = false;

            this.setState({
                actions: undefined,
                openAddTask: false,
                sessions: [],
                task
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

    private onDatePickerChange = (date: string, id: string, isValid: boolean) => {
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
            this.logError(LogData.fromException(this.onDatePickerChange.name, e));
        }
    };

    private onDropdownChange = (option: IDropDownOption, id: string) => {
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
                    Requests.getActions(Number(option.value), this.resolveGetActions);
                    break;
                case 'ddlAction':
                    task.actionId = option.value.toString();
                    task.actionModified = true;
                    task.actionInvalid = false;

                    const actionDetail: IChecklistAction = option.complement;

                    if (actionDetail !== undefined) {
                        task.isRequired = actionDetail.isRequired;
                        task.priority = actionDetail.priority;
                        task.note = actionDetail.note;
                        task.instruction = actionDetail.instruction;
                    }

                    this.setState({
                        task
                    });

                    break;
                case 'ddlYearTerm':
                    const yearTermSelected: string = option.value.toString();
                    task.yearTermSelected = yearTermSelected ? yearTermSelected : undefined;
                    task.academicSession = undefined;
                    task.actionInvalid = false;
                    if (yearTermSelected) {
                        const value: string[] = yearTermSelected.split('/');
                        const yearTerm: IYearTerm = { term: value[1], year: Number(value[0]) };
                        task.academicTerm = value[1];
                        task.academicYear = value[0];
                        this.setState({
                            isLoadingSession: true
                        });
                        Requests.getSessions(yearTerm, this.resolveGetSessions);
                    }
                    else {
                        task.academicTerm = undefined;
                        task.academicYear = undefined;
                        this.setState({
                            sessions: []
                        });
                    }
                    break;
                case 'ddlSession':
                    const sessionSelected: string = option.value.toString();
                    task.academicSession = sessionSelected ? sessionSelected : undefined;
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
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onSaveTask = () => {
        try {
            const {
                task,
                taskDefaultOffices
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

            if (!Boolean(task.option)) {
                isValid = false;
                task.optionModified = true;
            }
            else {
                if (task.option === 2) {
                    if (task.offsetDays === undefined || task.offsetDays === null || task.offsetDaysInvalid) {
                        isValid = false;
                        task.offsetDaysModified = true;
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
                }
                if (task.option === 1) {
                    if (!Boolean(task.dueDate) || task.dueDateInvalid) {
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
                }
            }

            if (isValid) {
                if (taskDefaultOffices) {
                    if (taskDefaultOffices.findIndex(x => x.officeId === task.officeId) > -1) {
                        const officeIndex: number = taskDefaultOffices.findIndex(x => x.officeId === task.officeId);
                        const itemIndex: number =
                            taskDefaultOffices[officeIndex].actions.findIndex(x =>
                                x.actionId === task.actionId &&
                                x.checklistTemplateId !== task.checklistTemplateId);

                        if (itemIndex > -1) {
                            isValid = false;
                            task.actionInvalid = true;
                        }
                    }
                }
            }

            if (isValid) {
                LayoutActions.setLoading(true);
                Requests.postSaveChecklist(task, this.resolveSaveChecklist);
            }

            this.setState({
                task
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveTask.name, e));
        }
    };

    private onTextFieldChange = (event: any) => {
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
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };

    private onTextFieldNumericChange = (value: number) => {
        try {
            const {
                task
            } = this.state;

            task.offsetDaysInvalid = !(value >= 0 && value <= 999);
            task.offsetDays = value;
            task.offsetDaysModified = true;

            this.setState({
                task
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };

    private onTimePickerChange = (value: string) => {
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
            this.logError(LogData.fromException(this.onTimePickerChange.name, e));
        }
    };

    private onClikEditTask = (event: any) => {
        try {
            const id: string[] = event.currentTarget.id.split('_');
            LayoutActions.setLoading(true);
            this.setState({
                actionName: String(id[3]),
                officeDesc: String(id[2])
            });
            Requests.postTaskDetails(Number(id[1]), this.resolvePostTaskDetails);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClikEditTask.name, e));
        }
    };
    // #endregion checklist task

    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetResources.name);
            if (result?.status) {
                this.setState({
                    resources: result.data
                });
                Requests.getOptions(this.resolveGetOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetOptions.name, this.hideAllLoaders);
            if (result?.status) {
                const startDate: string = result.data.dateFromItemDisplay;
                const thresholdDays: number = result.data.daysShowTask;
                const showSummaryDashboard: boolean = result.data.showTask;

                this.setState({
                    startDate,
                    thresholdDays: thresholdDays >= 1 && thresholdDays <= 199 ? thresholdDays : 7,
                    showSummaryDashboard
                });
                Requests.getChecklistOptions(this.resolveGetChecklistOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveSaveOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveOptions.name, this.hideAllLoaders);
            if (result?.status && result?.data) {
                LayoutActions.setAlert({
                    message: this.props.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
                this.hideAllLoaders();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveOptions.name, e));
        }
    };

    private resolvePostStatus = (json: string): void => {
        try {
            const {
                taskDefaultOffices
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostStatus.name, this.hideAllLoaders);
            if (result?.status) {
                if (taskDefaultOffices && taskDefaultOffices.length > 0) {
                    if (this.iOfficeChanged >= 0 && this.iTaskDefaultChanged >= 0) {
                        taskDefaultOffices[this.iOfficeChanged].actions[this.iTaskDefaultChanged].isActive = result.data.isActive;
                        taskDefaultOffices[this.iOfficeChanged].actions[this.iTaskDefaultChanged].isSwitchLoading = false;
                    }
                }
            }

            this.iOfficeChanged, this.iTaskDefaultChanged = -1;

            this.setState({
                taskDefaultOffices
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostStatus.name, e));
        }
    };

    private resolveDeleteTaskDefault = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteTaskDefault.name, this.hideAllLoaders);

            if (result?.status) {
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                Requests.getChecklistOptions(this.resolveGetChecklistOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteTaskDefault.name, e));
        }
    };

    // #region resolve checklist task
    private resolveGetChecklistOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetChecklistOptions.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    taskDefaultOffices,
                    resources
                } = this.state;

                if (resources) {
                    const duedatesDataTypes: IDropDownOption[] =
                        [
                            { value: 1, description: resources?.checklistTaskResources.lblExactDate },
                            { value: 2, description: resources?.checklistTaskResources.lblDaysAfter }
                        ];

                    const newOffices: ITaskDefaultOffice[] = result.data.checklists;
                    if (taskDefaultOffices) {
                        newOffices.forEach(newOffice => {
                            const previousOffice: ITaskDefaultOffice | undefined
                                = taskDefaultOffices.find(office => office.officeDesc === newOffice.officeDesc);
                            if (previousOffice) {
                                newOffice.expanded = previousOffice.expanded;
                            }
                        });
                    }

                    this.setState({
                        isLoading: false,
                        dueDateTypes: duedatesDataTypes,
                        offices: result.data.offices,
                        taskDefaultOffices: result.data.checklists,
                        yearTerms: result.data.yearTerms
                    }, LayoutActions.hidePageLoader);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetChecklistOptions.name, e));
        }
    };

    private resolveGetActions = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetActions.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    actions: result.data,
                    isLoadingAction: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetActions.name, e));
        }
    };

    private resolveSaveChecklist = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveSaveChecklist.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    const {
                        task
                    } = this.state;

                    task.academicSession = undefined;
                    task.academicTerm = undefined;
                    task.academicYear = undefined;
                    task.actionId = undefined;
                    task.checklistTemplateId = undefined;
                    task.dueDate = '';
                    task.option = undefined;
                    task.dueTime = '';
                    task.instruction = '';
                    task.isActive = undefined;
                    task.isRequired = false;
                    task.note = '';
                    task.officeId = undefined;
                    task.offsetDays = 7;
                    task.priority = '';
                    task.yearTermSelected = undefined;
                    task.actionModified = false;
                    task.actionInvalid = false;
                    task.dueDateInvalid = false;
                    task.dueDateModified = false;
                    task.officeModified = false;
                    task.offsetDaysModified = false;
                    task.optionModified = false;
                    task.priorityInvalid = false;
                    task.priorityModified = false;
                    task.timeModified = false;

                    this.setState({
                        actions: undefined,
                        openAddTask: false,
                        sessions: [],
                        task
                    });
                    Requests.getChecklistOptions(this.resolveGetChecklistOptions);
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveChecklist.name, e));
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

    private resolvePostTaskDetails = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetSessions.name, this.hideAllLoaders);
            if (result?.status) {
                const task: ITask = result.data.checklistDetail;
                this.setState({
                    task
                });

                if (task.offsetDays !== null) {
                    task.option = 2;
                }
                else {
                    task.option = 1;
                    if (task.dueTime.length > 5) {
                        task.dueTime = task.dueTime.substring(0, 5);
                    }
                }

                if (task.academicYear && task.academicTerm) {
                    task.yearTermSelected = `${task.academicYear}/${task.academicTerm}`;
                }
                const yearTerm: IYearTerm = {
                    term: task.academicTerm ? task.academicTerm : '',
                    year: task.academicYear ? Number(task.academicYear) : 0
                };
                Requests.getSessions(yearTerm, this.resolveGetSessionsForEdit);

            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostTaskDetails.name, e));
        }
    };

    private resolveGetSessionsForEdit = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetSessions.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    sessions: result.data
                });
                const {
                    task
                } = this.state;

                if (task.officeId) {
                    Requests.getActions(task.officeId, this.resolveGetActionsForEdit);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSessionsForEdit.name, e));
        }
    };

    private resolveGetActionsForEdit = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetActions.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    actions: result.data,
                    openAddTask: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetActionsForEdit.name, e));
        }

    };
    // #endregion resolve checklist task
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage, this.resolveGetResources);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            actionName,
            allExpanded,
            cultures,
            errorThresholdDays,
            isDeleteModalOpen,
            isLoading,
            isLoadingAction,
            isLoadingSession,
            isStartDateEmpty,
            isStartDateInvalid,
            resources,
            showSummaryDashboard,
            startDate,
            taskDefaultOffices,
            thresholdDays,

            // checklist task
            actions,
            dueDateTypes,
            officeDesc,
            offices,
            openAddTask,
            sessions,
            task,
            yearTerms
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let addTask: JSX.Element | undefined;

        const resourcesLayout: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
        const emptyOption: IDropDownOption = {
            description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
            value: 0
        };

        if (resources) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrChecklistSetup" height="md" />);
            }
            else {
                if (openAddTask) {
                    addTask = (
                        <ChecklistTask
                            actions={actions}
                            actionName={actionName}
                            cultures={cultures}
                            dueDateTypes={dueDateTypes}
                            emptyOption={emptyOption}
                            isLoadingAction={isLoadingAction}
                            isLoadingSession={isLoadingSession}
                            officeDesc={officeDesc}
                            offices={offices}
                            sessions={sessions}
                            task={task}
                            yearTerms={yearTerms}
                            resources={resources.checklistTaskResources}
                            onCancel={this.onCancelAddTask}
                            onCheckboxChange={this.onCheckboxChange}
                            onDatePickerChange={this.onDatePickerChange}
                            onDropdownChange={this.onDropdownChange}
                            onSave={this.onSaveTask}
                            onTextFieldChange={this.onTextFieldChange}
                            onTextFieldNumericChange={this.onTextFieldNumericChange}
                            onTimePickerChange={this.onTimePickerChange}
                        />
                    );
                }

                const dateMinFormat: string = moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
                const dateMaxFormat: string = moment().add(100, 'years').format(cultures.shortDatePattern.toUpperCase());

                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Text size="h2" weight="strong">
                                            {resources.lblOptions}
                                        </Text>
                                        <Divider noMarginBottom />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Switch
                                            id={'swtShowSummary'}
                                            checked={showSummaryDashboard}
                                            label={resources.lblShowSummary}
                                            onChange={this.onShowSummaryChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Text size="large">
                                            {resources.lblInstructionsThreshold}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12} sm={9} md={6} lg={5} xl={3}>
                                        <TextField
                                            error={errorThresholdDays}
                                            helperText={errorThresholdDays ?
                                                resources.lblErrorThresholdDays : undefined}
                                            id="txtThresholdDays"
                                            label={resources.lblThresholdDays}
                                            max={999}
                                            min={1}
                                            required
                                            onBlur={this.onBlurThresholdTextfield}
                                            onChange={this.onChangeDaysThreshold}
                                            precision={0}
                                            step={1}
                                            type="number"
                                            value={thresholdDays}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Text size="large">
                                            {resources.lblInstructionsStartDate}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12} sm={9} md={6} lg={5} xl={3}>
                                        <DatePicker
                                            culture={cultures.dateTimeCulture}
                                            flip
                                            format={cultures.shortDatePattern}
                                            error={isStartDateInvalid || isStartDateEmpty}
                                            helperText={isStartDateEmpty ? resources.lblErrorStartDate
                                                : (isStartDateInvalid ?
                                                    Format.toString(resources.formatDateOutOfRange,
                                                        [dateMinFormat, dateMaxFormat]) : '')
                                            }
                                            id="dtpStartDate"
                                            label={resources.lblStartDate}
                                            required
                                            value={startDate}
                                            yearsAfter={100}
                                            yearsBefore={100}
                                            onChange={this.onChangeDatePicker}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            id="btnSave"
                                            onClick={this.onSaveOptions}
                                        >
                                            {resources.btnSave}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <ChecklistTaskDefaults
                                    allExpanded={allExpanded}
                                    taskDefaultOffices={taskDefaultOffices}
                                    resources={resources.checklistTaskDefaults}
                                    onChangeStatus={this.onChangeStatus}
                                    onClickDelete={this.onClickDelete}
                                    onExpand={this.onExpandOffice}
                                    onExpandAll={this.onExpandAll}
                                    onAddTaskDefault={this.onAddTaskDefault}
                                    onClikEditTask={this.onClikEditTask}
                                />
                            </Grid>
                        </Grid>
                        <ConfirmationDialog
                            contentText={Format.toString(resources.checklistTaskDefaults.formatDeleteConfirmation,
                                [this.deleteTaskDefault?.actionName])}
                            open={isDeleteModalOpen}
                            primaryActionOnClick={this.onCloseDeleteModal}
                            primaryActionText={resources.checklistTaskDefaults.btnDecline}
                            secondaryActionOnClick={this.onDeleteTaskDefault}
                            secondaryActionText={resources.checklistTaskDefaults.btnAccept}
                            title={resources.checklistTaskDefaults.lblConfirmationDialogTitle}
                        />
                    </>
                );
            }
        }

        return (
            <>
                {openAddTask ? addTask : contentPage}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default ChecklistSetup;