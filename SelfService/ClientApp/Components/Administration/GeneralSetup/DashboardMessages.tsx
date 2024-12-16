/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DashboardMessages.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Internal components
import DashboardMessagesEdit, { IDashboardMessagesEditResProps } from './DashboardMessagesEdit';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { DashboardMessageType } from '../../../Types/Dashboard/IDashboardMessage';
import { IDashboardMessageDetail } from '../../../Types/Dashboard/IDashboardMessageDetail';
import { IDashboardMessageDetailValidations } from '../../../Types/Dashboard/IDashboardMessageDetailValidations';
import { IDashboardMessages } from '../../../Types/Dashboard/IDashboardMessages';
import { IDashboardMessagesResources } from '../../../Types/Resources/Administration/IDashboardMessagesResources';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';
import { IDashboardMessageCardResProps } from '../../Generic/DashboardMessageCard';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/DashboardMessages';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IDashboardMessagesProps {
    lblDropDownEmptyText: string;
    lblSuccessSave: string;
}

interface IDashboardMessagesRes extends IDashboardMessagesResources {
    deleteMessageConfirmation: IConfirmationDialogResources;
    dashboardMessagesEdit: IDashboardMessagesEditResProps;
    dashboardMessageCard: IDashboardMessageCardResProps;
}

interface IDashboardMessagesState {
    componentError: boolean;
    confirmationModal: boolean;
    cultures: ICultures;
    dashboardMessages?: IDashboardMessages;
    dashboardMessageSelected?: IDashboardMessageDetail;
    dashboardMessageValidations?: IDashboardMessageDetailValidations;
    generalMessage: string;
    generalMessageBackup: string;
    generalMessageModal: boolean;
    groupViewsOptions?: IDropDownOption[];
    hours: IDropDownOption[];
    idToDetele: number;
    minutes: IDropDownOption[];
    nameToDelete: string;
    resources?: IDashboardMessagesRes;
    typeOptions?: IDropDownOption[];

    // Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '35%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '15%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '10%'
            },
            '& > thead > tr > th:nth-child(4)': {
                width: '15%'
            },
            '& > thead > tr > th:nth-child(5)': {
                width: '15%'
            },
            '& > thead > tr > th:nth-child(6)': {
                width: '10%'
            }
        }
    }
}));

type PropsWithStyles = IDashboardMessagesProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class DashboardMessages extends React.Component<PropsWithStyles, IDashboardMessagesState> {
    private dateFormat: string;
    private idModule: string;
    private idPage: string;
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<IDashboardMessagesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.dateFormat = 'YYYY-MM-DD';
        this.idModule = 'Administration';
        this.idPage = 'DashboardMessages';
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDashboardMessagesState {
        let resources: IDashboardMessagesRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        const hours: IDropDownOption[] = [];
        for (let i = 0; i < 24; i++) {
            hours.push({
                description: i.toString(),
                value: i
            } as IDropDownOption);
        }
        const minutes: IDropDownOption[] = [];
        for (let i = 0; i < 60; i++) {
            minutes.push({
                description: i.toString(),
                value: i
            } as IDropDownOption);
        }
        return {
            componentError: false,
            confirmationModal: false,
            cultures: LayoutStore.getCultures(),
            generalMessage: '',
            generalMessageBackup: '',
            generalMessageModal: false,
            hours: hours,
            idToDetele: 0,
            minutes: minutes,
            nameToDelete: '',
            resources: resources,

            // Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: []
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
                rowsPerPage
            } = this.state;

            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                page
            }, () => {
                LayoutActions.setLoading(true);
                Requests.getDashboardMessages(page * rowsPerPage, rowsPerPage, this.resolveGetDashboardMessages, this.logError);
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

    // #region New-Edit
    private onBlurName = (): void => {
        try {
            const {
                dashboardMessageSelected,
                dashboardMessageValidations
            } = this.state;

            if (dashboardMessageSelected
                && dashboardMessageValidations
                && Boolean(dashboardMessageSelected.name)) {
                if (dashboardMessageSelected.name !== dashboardMessageSelected.nameOriginal) {
                    Requests.postValidateName(dashboardMessageSelected.name, this.resolveGetValidateName, this.logError);
                }
                else {
                    dashboardMessageValidations.nameDuplicated = false;
                    dashboardMessageValidations.nameModified = true;
                    this.setState({
                        dashboardMessageValidations: dashboardMessageValidations
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurName.name, e));
        }
    };

    private onBlurSort = (): void => {
        try {
            const {
                dashboardMessageSelected,
                dashboardMessageValidations
            } = this.state;

            if (dashboardMessageSelected
                && dashboardMessageValidations
                && Boolean(dashboardMessageSelected.sort)
                && !dashboardMessageValidations.sortInvalid) {
                if (Number(dashboardMessageSelected.sort) !== Number(dashboardMessageSelected.sortOriginal)) {
                    Requests.postValidateSort(Number(dashboardMessageSelected.sort), this.resolveGetValidateSort, this.logError);
                }
                else {
                    dashboardMessageValidations.sortDuplicated = false;
                    dashboardMessageValidations.sortModified = true;
                    this.setState({
                        dashboardMessageValidations: dashboardMessageValidations
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurSort.name, e));
        }
    };

    private onCancelDashboardMessage = (): void => {
        try {
            this.setState({
                dashboardMessageSelected: undefined,
                dashboardMessageValidations: undefined,
                groupViewsOptions: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelDashboardMessage.name, e));
        }
    };

    private onEndTimePickerChange = (value: string) => {
        try {
            const {
                dashboardMessageSelected,
                dashboardMessageValidations
            } = this.state;

            if (dashboardMessageSelected && dashboardMessageValidations) {
                dashboardMessageSelected.endTime = value;
                dashboardMessageValidations.endTimeModified = true;
                this.setState({
                    dashboardMessageSelected: dashboardMessageSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEndTimePickerChange.name, e));
        }
    };

    private onStartTimePickerChange = (value: string) => {
        try {
            const {
                dashboardMessageSelected,
                dashboardMessageValidations
            } = this.state;

            if (dashboardMessageSelected && dashboardMessageValidations) {
                dashboardMessageSelected.startTime = value;
                dashboardMessageValidations.startTimeModified = true;
                this.setState({
                    dashboardMessageSelected: dashboardMessageSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onStartTimePickerChange.name, e));
        }
    };

    private onChangeDatePicker = (date: string, id: string, isValid: boolean): void => {
        try {
            const {
                dashboardMessageSelected,
                dashboardMessageValidations
            } = this.state;

            if (dashboardMessageSelected && dashboardMessageValidations) {
                switch (id) {
                    case 'dtpStartDate':
                        dashboardMessageSelected.startDate = date;
                        dashboardMessageValidations.startDateModified = true;
                        dashboardMessageValidations.startDateInvalid = !isValid;
                        dashboardMessageValidations.startDateRangeError = this.isDateRangeInvalid();
                        if (dashboardMessageValidations.startTimeRangeError) {
                            dashboardMessageValidations.startTimeModified = true;
                        }
                        break;
                    case 'dtpEndDate':
                        dashboardMessageSelected.endDate = date;
                        dashboardMessageValidations.endDateModified = true;
                        dashboardMessageValidations.endDateInvalid = !isValid;
                        dashboardMessageValidations.startDateRangeError = this.isDateRangeInvalid();
                        if (dashboardMessageValidations.startTimeRangeError) {
                            dashboardMessageValidations.startTimeModified = true;
                        }
                        break;
                }
                this.setState({
                    dashboardMessageSelected: dashboardMessageSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDatePicker.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                dashboardMessageSelected,
                dashboardMessageValidations
            } = this.state;

            if (dashboardMessageSelected && dashboardMessageValidations) {
                switch (id) {
                    case 'ddlViewName':
                        dashboardMessageSelected.groupViewName = String(optionSelected.value);
                        dashboardMessageValidations.groupViewNameModified = true;
                        break;
                    case 'ddlType':
                        dashboardMessageSelected.type = Number(optionSelected.value);
                        dashboardMessageValidations.typeModified = true;
                        break;
                }
                this.setState({
                    dashboardMessageSelected: dashboardMessageSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                dashboardMessageSelected,
                dashboardMessageValidations
            } = this.state;

            const id: string = event.target.id;
            const value: string = event.target.value;
            if (dashboardMessageSelected && dashboardMessageValidations) {
                switch (id) {
                    case 'txtMessage':
                        if (value.length <= 255) {
                            dashboardMessageSelected.message = value;
                        }
                        dashboardMessageValidations.messageModified = true;
                        break;
                    case 'txtName':
                        if (value.length <= 40) {
                            dashboardMessageSelected.name = value;
                        }
                        dashboardMessageValidations.nameModified = true;
                        break;
                    case 'txtSort':
                        dashboardMessageSelected.sort = value;
                        dashboardMessageValidations.sortInvalid = !this.validateSort(value);
                        dashboardMessageValidations.sortModified = true;
                        break;
                    case 'txtTitle':
                        if (value.length <= 100) {
                            dashboardMessageSelected.title = value;
                        }
                        dashboardMessageValidations.titleModified = true;
                        break;
                    case 'txtUrl':
                        if (value.length <= 2048) {
                            dashboardMessageSelected.url = value;
                        }
                        break;
                    case 'txtUrlText':
                        if (value.length <= 40) {
                            dashboardMessageSelected.urlText = value;
                        }
                        break;
                }
                this.setState({
                    dashboardMessageSelected: dashboardMessageSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onSaveDashboardMessage = (process: boolean): void => {
        try {
            const {
                dashboardMessageSelected,
                dashboardMessageValidations
            } = this.state;

            if (dashboardMessageSelected && dashboardMessageValidations) {
                // Validate save
                dashboardMessageValidations.endDateModified = true;
                dashboardMessageValidations.endTimeModified = true;
                dashboardMessageValidations.groupViewNameModified = true;
                dashboardMessageValidations.messageModified = true;
                dashboardMessageValidations.nameModified = true;
                dashboardMessageValidations.startDateModified = true;
                dashboardMessageValidations.startTimeRangeError = false;
                dashboardMessageValidations.startTimeModified = true;
                dashboardMessageValidations.sortInvalid = !this.validateSort(dashboardMessageSelected.sort.toString());
                dashboardMessageValidations.sortModified = true;
                dashboardMessageValidations.titleModified = true;
                dashboardMessageValidations.typeModified = true;

                dashboardMessageValidations.startDateRangeError = this.isDateRangeInvalid();
                this.setState({
                    dashboardMessageValidations: dashboardMessageValidations
                });

                if (!dashboardMessageValidations.startDateRangeError
                    && !dashboardMessageValidations.startTimeRangeError
                    && !dashboardMessageValidations.endDateInvalid
                    && !dashboardMessageValidations.startDateInvalid
                    && !dashboardMessageValidations.nameDuplicated
                    && !dashboardMessageValidations.sortInvalid
                    && !dashboardMessageValidations.sortDuplicated
                    && Boolean(dashboardMessageSelected.message)
                    && Boolean(dashboardMessageSelected.name)
                    && Boolean(dashboardMessageSelected.groupViewName)
                    && Boolean(dashboardMessageSelected.sort)
                    && Boolean(dashboardMessageSelected.title)
                    && dashboardMessageSelected.type >= 0
                    && dashboardMessageSelected.startTime
                    && dashboardMessageSelected.endTime) {
                    LayoutActions.setLoading(true);
                    if (dashboardMessageSelected.startTime.length > 5) {
                        dashboardMessageSelected.startTime = dashboardMessageSelected.startTime.substring(0, 5);
                    }
                    if (dashboardMessageSelected.endTime.length > 5) {
                        dashboardMessageSelected.endTime = dashboardMessageSelected.endTime.substring(0, 5);
                    }
                    Requests.postPostSaveDashboardMessage(dashboardMessageSelected, process, this.resolvePostSaveDashboardMessage, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveDashboardMessage.name, e));
        }
    };
    // #endregion New-Edit

    // #region General
    private onChangeGeneralMessage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const value: string = event.target.value;
            this.setState({
                generalMessage: value
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeGeneralMessage.name, e));
        }
    };

    private onCloseGeneralMessageModal = (): void => {
        try {
            const {
                generalMessageBackup
            } = this.state;

            this.setState({
                generalMessage: generalMessageBackup,
                generalMessageModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseGeneralMessageModal.name, e));
        }
    };

    private onSaveGeneralMessage = (): void => {
        try {
            const {
                generalMessage
            } = this.state;

            LayoutActions.setLoading(true);
            Requests.postPostSaveGeneralMessage(generalMessage, this.resolvePostSaveGeneralMessage, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveGeneralMessage.name, e));
        }
    };
    // #endregion General Message

    private onAddDashboardMessage = (): void => {
        try {
            LayoutActions.setLoading(true);
            Requests.getDashboardMessage(0, this.resolveGetNewDashboardMessage, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddDashboardMessage.name, e));
        }
    };

    private onAddGeneralMessage = (): void => {
        try {
            LayoutActions.setLoading(true);
            Requests.getGeneral(this.resolveGetGeneralMessage, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddGeneralMessage.name, e));
        }
    };

    private onClickDashboardMessage = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            LayoutActions.setLoading(true);
            const id: string[] = event.currentTarget.id.split('_');
            Requests.getDashboardMessage(Number(id[1]), this.resolveGetDashboardMessage, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickDashboardMessage.name, e));
        }
    };

    private onCloseDeleteConfirmModal = (): void => {
        try {
            this.setState({
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
                idToDetele
            } = this.state;

            Requests.postDeleteDashboardMessage(idToDetele, this.resolvePostDeleteDashboardMessage, this.logError);

            this.setState({
                confirmationModal: false,
                idToDetele: 0,
                nameToDelete: ''
            });
            LayoutActions.setLoading(true);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteConfirm.name, e));
        }
    };

    private onDeleteItem = (event: any): void => {
        try {

            const value: string[] = event.currentTarget.id.split('_');
            const id: number = Number(value[1]);
            const name: string = value[2];

            this.setState({
                confirmationModal: true,
                idToDetele: id,
                nameToDelete: name
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteItem.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private getDefaultValidations(): IDashboardMessageDetailValidations {
        return {
            endDateModified: false,
            endTimeModified: false,
            groupViewNameModified: false,
            nameModified: false,
            sortModified: false,
            startDateModified: false,
            startTimeModified: false,
            titleModified: false,
            typeModified: false,
            endDateInvalid: false,
            nameDuplicated: false,
            sortDuplicated: false,
            sortInvalid: false,
            startDateInvalid: false,
            startDateRangeError: false,
            startTimeRangeError: false
        } as IDashboardMessageDetailValidations;
    }

    private getTypeDescription(type: DashboardMessageType, resources: IDashboardMessagesResources): string | undefined {
        let description: string | undefined;
        try {
            switch (type) {
                case DashboardMessageType.Alert:
                    description = resources.lblTypeAlert;
                    break;
                case DashboardMessageType.Congratulation:
                    description = resources.lblTypeCongratulation;
                    break;
                case DashboardMessageType.News:
                    description = resources.lblTypeNews;
                    break;
                case DashboardMessageType.Reminder:
                    description = resources.lblTypeReminder;
                    break;
                case DashboardMessageType.Schedule:
                    description = resources.lblTypeSchedule;
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.getTypeDescription.name, e));
        }
        return description;
    }

    private isDateRangeInvalid = (): boolean => {
        const {
            dashboardMessageSelected,
            dashboardMessageValidations
        } = this.state;

        let isInvalid: boolean = false;

        if (dashboardMessageSelected && dashboardMessageValidations) {
            isInvalid = moment(dashboardMessageSelected.startDate, this.dateFormat)
                > moment(dashboardMessageSelected.endDate, this.dateFormat);
        }

        return isInvalid;
    };

    private setTypeOptions = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                const typeOptions: IDropDownOption[] = [];
                typeOptions.push({
                    description: resources.lblTypeAlert,
                    value: DashboardMessageType.Alert
                } as IDropDownOption);
                typeOptions.push({
                    description: resources.lblTypeCongratulation,
                    value: DashboardMessageType.Congratulation
                } as IDropDownOption);
                typeOptions.push({
                    description: resources.lblTypeNews,
                    value: DashboardMessageType.News
                } as IDropDownOption);
                typeOptions.push({
                    description: resources.lblTypeReminder,
                    value: DashboardMessageType.Reminder
                } as IDropDownOption);
                typeOptions.push({
                    description: resources.lblTypeSchedule,
                    value: DashboardMessageType.Schedule
                } as IDropDownOption);

                this.setState({
                    typeOptions: typeOptions
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setTypeOptions.name, e));
        }
    };

    private validateSort(value: string): boolean {
        let isValid: boolean = false;
        let numberTest: number;
        if (value.match(/^\d+$/g)) {
            isValid = true;
        }
        if (isValid) {
            numberTest = Number(value);
            isValid = !(isNaN(numberTest)) && (numberTest >= 0 && numberTest <= 999);
        }
        return isValid;
    }
    // #endregion Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    private showError(message?: string): void {
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetNewDashboardMessage = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetNewDashboardMessage.name);

            if (result?.status) {
                const dashboardMessageDetail: IDashboardMessageDetail = result.data.dashboardMessageDetail;
                dashboardMessageDetail.endDate = '';
                dashboardMessageDetail.endTime = '';
                dashboardMessageDetail.sort = '';
                dashboardMessageDetail.startDate = '';
                dashboardMessageDetail.startTime = '';
                dashboardMessageDetail.type = -1;
                this.setState({
                    dashboardMessageSelected: dashboardMessageDetail,
                    dashboardMessageValidations: this.getDefaultValidations(),
                    groupViewsOptions: result.data.groupViewsOptions
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNewDashboardMessage.name, e));
        }
    };

    private resolveGetDashboardMessage = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDashboardMessage.name);

            if (result?.status) {
                const dashboardMessageDetail: IDashboardMessageDetail = result.data.dashboardMessageDetail;
                dashboardMessageDetail.nameOriginal = dashboardMessageDetail.name;
                dashboardMessageDetail.sortOriginal = dashboardMessageDetail.sort;
                this.setState({
                    dashboardMessageSelected: dashboardMessageDetail,
                    dashboardMessageValidations: this.getDefaultValidations(),
                    groupViewsOptions: result.data.groupViewsOptions
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDashboardMessage.name, e));
        }
    };

    private resolveGetDashboardMessages = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDashboardMessages.name);

            if (result?.status) {
                const dashboardMessages: IDashboardMessages = result.data;
                if (dashboardMessages) {
                    const page: number = this.preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(dashboardMessages.overallCount);
                    const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                    this.setState({
                        dashboardMessages: dashboardMessages,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: rowsPerPageOptions
                    }, () => LayoutActions.setLoading(false));
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDashboardMessages.name, e));
        }
    };

    private resolveGetGeneralMessage = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetGeneralMessage.name);

            if (result?.status) {
                this.setState({
                    generalMessage: result.data,
                    generalMessageBackup: result.data,
                    generalMessageModal: true
                });
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetGeneralMessage.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);

            if (result?.status) {
                this.setState({
                    cultures: LayoutStore.getCultures(),
                    resources: result.data
                }, this.setTypeOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetValidateName = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetValidateName.name);

            if (result?.status) {
                const {
                    dashboardMessageSelected,
                    dashboardMessageValidations
                } = this.state;

                if (dashboardMessageSelected && dashboardMessageValidations) {
                    if (result.data) {
                        dashboardMessageValidations.nameDuplicated = false;
                        dashboardMessageValidations.nameModified = true;
                    }
                    else {
                        if (dashboardMessageSelected.name === dashboardMessageSelected.nameOriginal) {
                            dashboardMessageValidations.nameDuplicated = false;
                            dashboardMessageValidations.nameModified = true;
                        }
                        else {
                            dashboardMessageValidations.nameDuplicated = true;
                            dashboardMessageValidations.nameModified = true;
                        }
                    }
                    this.setState({
                        dashboardMessageValidations: dashboardMessageValidations
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetValidateName.name, e));
        }
    };

    private resolveGetValidateSort = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetValidateSort.name);

            if (result?.status) {
                const {
                    dashboardMessageSelected,
                    dashboardMessageValidations
                } = this.state;

                if (dashboardMessageSelected && dashboardMessageValidations) {
                    if (result.data) {
                        dashboardMessageValidations.sortDuplicated = false;
                        dashboardMessageValidations.sortModified = true;
                    }
                    else {
                        if (Number(dashboardMessageSelected.sort) === Number(dashboardMessageSelected.sortOriginal)) {
                            dashboardMessageValidations.sortDuplicated = false;
                            dashboardMessageValidations.sortModified = true;
                        }
                        else {
                            dashboardMessageValidations.sortDuplicated = true;
                            dashboardMessageValidations.sortModified = true;
                        }
                    }
                    this.setState({
                        dashboardMessageValidations: dashboardMessageValidations
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetValidateSort.name, e));
        }
    };

    private resolvePostDeleteDashboardMessage = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                page,
                rowsPerPage
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteDashboardMessage.name);

            if (result?.status) {
                if (result.data) {
                    Requests.getDashboardMessages(page * rowsPerPage, rowsPerPage, this.resolveGetDashboardMessages, this.logError);
                    LayoutActions.setAlert({
                        message: lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteDashboardMessage.name, e));
        }
    };

    private resolvePostSaveDashboardMessage = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                page,
                rowsPerPage
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveDashboardMessage.name);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        dashboardMessageSelected: undefined,
                        dashboardMessageValidations: undefined,
                        groupViewsOptions: undefined,
                        rowsPerPage: rowsPerPage
                    }, () => {
                        Requests.getDashboardMessages(page * rowsPerPage, rowsPerPage, this.resolveGetDashboardMessages, this.logError);
                        LayoutActions.setAlert({
                            message: lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveDashboardMessage.name, e));
        }
    };

    private resolvePostSaveGeneralMessage = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                generalMessage
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveGeneralMessage.name);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        generalMessageBackup: generalMessage,
                        generalMessageModal: false
                    }, () => {
                        LayoutActions.setAlert({
                            message: lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveGeneralMessage.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                page,
                rowsPerPage
            } = this.state;

            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getDashboardMessages(page * rowsPerPage, rowsPerPage, this.resolveGetDashboardMessages, this.logError);
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
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes,
            lblDropDownEmptyText
        } = this.props;

        const {
            componentError,
            confirmationModal,
            cultures,
            generalMessage,
            generalMessageModal,
            groupViewsOptions,
            hours,
            minutes,
            nameToDelete,
            dashboardMessages,
            dashboardMessageSelected,
            dashboardMessageValidations,
            resources,
            typeOptions,

            // Pagination
            page,
            rowsPerPage,
            rowsPerPageOptions
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (typeOptions && groupViewsOptions && dashboardMessageSelected && dashboardMessageValidations && cultures) {
                contentPage = (
                    <DashboardMessagesEdit
                        cultures={cultures}
                        dashboardMessage={dashboardMessageSelected}
                        dashboardMessageValidations={dashboardMessageValidations}
                        groupViewsOptions={groupViewsOptions}
                        hours={hours}
                        lblDropDownEmptyText={lblDropDownEmptyText}
                        minutes={minutes}
                        dashboardCardResources={resources.dashboardMessageCard}
                        resources={resources.dashboardMessagesEdit}
                        typeOptions={typeOptions}
                        onBlurName={this.onBlurName}
                        onBlurSort={this.onBlurSort}
                        onCancel={this.onCancelDashboardMessage}
                        onChangeDatePicker={this.onChangeDatePicker}
                        onEndTimePickerChange={this.onEndTimePickerChange}
                        onStartTimePickerChange={this.onStartTimePickerChange}
                        onChangeDropdown={this.onChangeDropdown}
                        onChangeTextField={this.onChangeTextField}
                        onSave={this.onSaveDashboardMessage}
                    />
                );
            }
            else if (dashboardMessages) {
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <ButtonGroup id="btgUpDashboardMessage">
                                    <Button
                                        id="btnAddDashboardMessage"
                                        onClick={this.onAddDashboardMessage}
                                    >
                                        {resources.btnAdd}
                                    </Button>
                                    <Button
                                        color="secondary"
                                        id="btnAddGeneralMessage"
                                        onClick={this.onAddGeneralMessage}
                                    >
                                        {resources.btnAddGeneral}
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                        <br />
                        {dashboardMessages.dashboardMessageList ?
                            (
                                <Grid container>
                                    <Grid item xs>
                                        <Table
                                            breakpoint="sm"
                                            classes={{ root: classes.table }}
                                            id="tblDashboardMessages"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell component="th">
                                                        {resources.lblName}
                                                    </TableCell>
                                                    <TableCell component="th">
                                                        {resources.lblType}
                                                    </TableCell>
                                                    <TableCell component="th">
                                                        {resources.lblSort}
                                                    </TableCell>
                                                    <TableCell component="th">
                                                        {resources.lblStartDate}
                                                    </TableCell>
                                                    <TableCell component="th">
                                                        {resources.lblEndDate}
                                                    </TableCell>
                                                    <TableCell component="th">
                                                        {resources.lblDelete}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {dashboardMessages.dashboardMessageList.map((row, i) =>
                                                    (
                                                        <TableRow key={`${i}_${row.id}`}>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                <Button
                                                                    align="left"
                                                                    id={`lnk_${row.id}`}
                                                                    textVariantStyling="inherit"
                                                                    variant="text"
                                                                    onClick={this.onClickDashboardMessage}
                                                                >
                                                                    {row.name}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell
                                                                columnName={resources.lblType}
                                                            >
                                                                <span>
                                                                    {this.getTypeDescription(row.type, resources)}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell
                                                                columnName={resources.lblSort}
                                                            >
                                                                <span>
                                                                    {row.sort}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell
                                                                columnName={resources.lblStartDate}
                                                            >
                                                                <span>
                                                                    {row.startDate}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell
                                                                columnName={resources.lblEndDate}
                                                            >
                                                                <span>
                                                                    {row.endDate}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell
                                                                columnName={resources.lblDelete}
                                                            >
                                                                <IconButton
                                                                    aria-label={resources.lblDelete}
                                                                    color="secondary"
                                                                    id={`del_${row.id}_${row.name}`}
                                                                    onClick={this.onDeleteItem}
                                                                >
                                                                    <Icon name="trash" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Grid>
                            ) :
                            (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Illustration
                                            internalName="no-activities"
                                            text={resources.lblEmpty}
                                        />
                                    </Grid>
                                </Grid>
                            )
                        }
                        {rowsPerPage > 0 && dashboardMessages.dashboardMessageList ? (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={dashboardMessages.overallCount}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        onPageChange={this.onChangePage}
                                        onRowsPerPageChange={this.onChangeRowsPerPage}
                                    />
                                </Grid>
                            </Grid >
                        ) : undefined}
                        {confirmationModal ?
                            (
                                <ConfirmationDialog
                                    contentText={Format.toString(resources.deleteMessageConfirmation.formatContent, [nameToDelete])}
                                    open={confirmationModal}
                                    primaryActionOnClick={this.onCloseDeleteConfirmModal}
                                    primaryActionText={resources.deleteMessageConfirmation.btnDecline}
                                    secondaryActionOnClick={this.onDeleteConfirm}
                                    secondaryActionText={resources.deleteMessageConfirmation.btnAccept}
                                    title={resources.deleteMessageConfirmation.lblTitle}
                                />
                            )
                            : undefined}
                        <Modal
                            disableBackdropClick
                            id="generalMessageModal"
                            header={resources.lblGeneralMessageTitle}
                            footer={(
                                <ButtonGroup id="btgGeneralMessage">
                                    <Button
                                        id={'btnCancel'}
                                        color="secondary"
                                        onClick={this.onCloseGeneralMessageModal}
                                    >
                                        {resources.btnCancel}
                                    </Button>
                                    <Button
                                        id={'btnSave'}
                                        onClick={this.onSaveGeneralMessage}
                                    >
                                        {resources.btnSave}
                                    </Button>
                                </ButtonGroup>
                            )}
                            maxWidth="lg"
                            open={generalMessageModal}
                            onClose={this.onCloseGeneralMessageModal}
                        >
                            <Grid container>
                                <Grid item xs>
                                    <TextField
                                        helperText={resources.lblContentHelpText}
                                        id="txtGeneralMessage"
                                        label={resources.lblGeneralMessage}
                                        multiline
                                        value={generalMessage}
                                        onChange={this.onChangeGeneralMessage}
                                    />
                                </Grid>
                            </Grid>
                        </Modal>
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
export default withStyles(styles)(DashboardMessages);