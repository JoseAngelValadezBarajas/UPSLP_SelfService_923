/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: RegistrationGroups.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import RegistrationGroupsEdit, { IRegistrationGroupsEditResProps } from './RegistrationGroupsEdit';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IRegistrationGroup } from '../../../Types/RegistrationGroups/IRegistrationGroup';
import { IRegistrationGroupDetail } from '../../../Types/RegistrationGroups/IRegistrationGroupDetail';
import { IRegistrationGroupDetailValidations } from '../../../Types/RegistrationGroups/IRegistrationGroupDetailValidations';
import { IRegistrationGroups } from '../../../Types/RegistrationGroups/IRegistrationGroups';
import { IRegistrationGroupsResources } from '../../../Types/Resources/Administration/IRegistrationGroupsResources';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/RegistrationGroups';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IRegistrationGroupsProps {
    lblDropDownEmptyText: string;
    lblSuccessSave: string;
}

interface IRegistrationGroupsRes extends IRegistrationGroupsResources {
    deleteGroupConfirmation: IConfirmationDialogResources;
    registrationGroupsEdit: IRegistrationGroupsEditResProps;
}

interface IRegistrationGroupsState {
    componentError: boolean;
    confirmationModal: boolean;
    cultures: ICultures;
    dateBasesOptions?: IDropDownOption[];
    groupViewsOptions?: IDropDownOption[];
    hours: IDropDownOption[];
    idToDetele: number;
    minutes: IDropDownOption[];
    nameToDelete: string;
    preRegDate?: string;
    regDate?: string;
    registrationGroups?: IRegistrationGroups;
    registrationGroupSelected?: IRegistrationGroupDetail;
    registrationGroupValidations?: IRegistrationGroupDetailValidations;
    resources?: IRegistrationGroupsRes;

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
                width: '30%'
            }
        }
    }
}));

type PropsWithStyles = IRegistrationGroupsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class RegistrationGroups extends React.Component<PropsWithStyles, IRegistrationGroupsState> {
    private dateFormat: string;
    private idModule: string;
    private idPage: string;
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<IRegistrationGroupsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.dateFormat = 'YYYY-MM-DD';
        this.idModule = 'Administration';
        this.idPage = 'RegistrationGroups';
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IRegistrationGroupsState {
        let resources: IRegistrationGroupsRes | undefined;
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
                Requests.getRegistrationGroups(page * rowsPerPage, rowsPerPage, this.resolveGetRegistrationGroups, this.logError);
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
                registrationGroupSelected,
                registrationGroupValidations
            } = this.state;

            if (registrationGroupSelected
                && registrationGroupValidations
                && Boolean(registrationGroupSelected.name)) {
                if (registrationGroupSelected.name !== registrationGroupSelected.nameOriginal) {
                    Requests.postValidateName(registrationGroupSelected.name, this.resolveGetValidateName, this.logError);
                }
                else {
                    registrationGroupValidations.nameDuplicated = false;
                    registrationGroupValidations.nameModified = true;
                    this.setState({
                        registrationGroupValidations: registrationGroupValidations
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
                registrationGroupSelected,
                registrationGroupValidations
            } = this.state;

            if (registrationGroupSelected
                && registrationGroupValidations
                && Boolean(registrationGroupSelected.sort)
                && !registrationGroupValidations.sortInvalid) {
                if (Number(registrationGroupSelected.sort) !== Number(registrationGroupSelected.sortOriginal)) {
                    Requests.postValidateSort(Number(registrationGroupSelected.sort), this.resolveGetValidateSort, this.logError);
                }
                else {
                    registrationGroupValidations.sortDuplicated = false;
                    registrationGroupValidations.sortModified = true;
                    this.setState({
                        registrationGroupValidations: registrationGroupValidations
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurSort.name, e));
        }
    };

    private onCancelRegistrationGroup = (): void => {
        try {
            this.setState({
                dateBasesOptions: undefined,
                groupViewsOptions: undefined,
                preRegDate: undefined,
                regDate: undefined,
                registrationGroupSelected: undefined,
                registrationGroupValidations: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelRegistrationGroup.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                registrationGroupSelected
            } = this.state;

            const id: string = event.target.id;
            if (registrationGroupSelected) {
                switch (id) {
                    case 'chkActive':
                        registrationGroupSelected.isActive = !registrationGroupSelected.isActive;
                        break;
                    case 'chkAdvisorAuthorization':
                        registrationGroupSelected.authorizationRequired = !registrationGroupSelected.authorizationRequired;
                        break;
                    case 'chkAdvisorApproval':
                        registrationGroupSelected.advisorApprovalRequired = !registrationGroupSelected.advisorApprovalRequired;
                        break;
                    case 'chkDropAdvisorApproval':
                        registrationGroupSelected.dropApprovalRequired = !registrationGroupSelected.dropApprovalRequired;
                        break;
                }
                this.setState({
                    registrationGroupSelected: registrationGroupSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeDatePicker = (date: string, id: string, isValid: boolean): void => {
        try {
            const {
                preRegDate,
                regDate,
                registrationGroupSelected,
                registrationGroupValidations
            } = this.state;

            if (registrationGroupSelected && registrationGroupValidations && preRegDate && regDate) {
                switch (id) {
                    case 'dtpStartDate':
                        registrationGroupSelected.startRegistrationDate = date;
                        registrationGroupValidations.startRegistrationDateModified = true;
                        registrationGroupValidations.startRegistrationDateInvalid = !isValid;
                        registrationGroupValidations.startRegistrationDateRangeError = this.isDateRangeInvalid();
                        registrationGroupValidations.startRegistrationTimeRangeError = this.isTimeRangeInvalid();
                        if (registrationGroupValidations.startRegistrationTimeRangeError) {
                            registrationGroupValidations.startRegistrationHourModified = true;
                        }
                        registrationGroupValidations.startRegistrationDateWarningPre = this.warningStartPreReg();
                        registrationGroupValidations.startRegistrationDateWarning = this.warningStartReg();
                        break;
                    case 'dtpEndDate':
                        registrationGroupSelected.endRegistrationDate = date;
                        registrationGroupValidations.endRegistrationDateModified = true;
                        registrationGroupValidations.endRegistrationDateInvalid = !isValid;
                        registrationGroupValidations.startRegistrationDateRangeError = this.isDateRangeInvalid();
                        registrationGroupValidations.startRegistrationTimeRangeError = this.isTimeRangeInvalid();
                        if (registrationGroupValidations.startRegistrationTimeRangeError) {
                            registrationGroupValidations.startRegistrationHourModified = true;
                        }
                        registrationGroupValidations.endRegistrationDateWarningPre = this.warningEndPreReg();
                        registrationGroupValidations.endRegistrationDateWarning = this.warningEndReg();
                        break;
                }
                this.setState({
                    registrationGroupSelected: registrationGroupSelected
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
                registrationGroupSelected,
                registrationGroupValidations
            } = this.state;

            if (registrationGroupSelected && registrationGroupValidations) {
                switch (id) {
                    case 'ddlViewName':
                        registrationGroupSelected.groupViewName = String(optionSelected.value);
                        registrationGroupValidations.groupViewNameModified = true;
                        break;
                    case 'ddlBaseDateStart':
                        registrationGroupSelected.startRegistrationType = String(optionSelected.value);
                        registrationGroupValidations.startRegistrationTypeModified = true;
                        if (registrationGroupSelected.startRegistrationType === 'EXACT') {
                            registrationGroupSelected.startOffset = undefined;
                            registrationGroupValidations.startOffsetInvalid = false;
                        }
                        else {
                            registrationGroupSelected.startRegistrationDate = '';
                            registrationGroupValidations.startRegistrationDateInvalid = false;
                            registrationGroupValidations.startRegistrationDateRangeError = false;
                            registrationGroupValidations.startRegistrationTimeRangeError = false;
                            registrationGroupValidations.startRegistrationDateWarning = false;
                            registrationGroupValidations.startRegistrationDateWarningPre = false;
                        }
                        break;
                    case 'ddlStartHour':
                        registrationGroupSelected.startRegistrationHour = Number(optionSelected.value);
                        registrationGroupValidations.startRegistrationTimeRangeError = this.isTimeRangeInvalid();
                        registrationGroupValidations.startRegistrationHourModified = true;
                        break;
                    case 'ddlStartMinute':
                        registrationGroupSelected.startRegistrationMinute = Number(optionSelected.value);
                        registrationGroupValidations.startRegistrationTimeRangeError = this.isTimeRangeInvalid();
                        registrationGroupValidations.startRegistrationMinuteModified = true;
                        break;
                    case 'ddlBaseDateEnd':
                        registrationGroupSelected.endRegistrationType = String(optionSelected.value);
                        registrationGroupValidations.endRegistrationTypeModified = true;
                        if (registrationGroupSelected.endRegistrationType === 'EXACT') {
                            registrationGroupSelected.endOffset = undefined;
                            registrationGroupValidations.endOffsetInvalid = false;
                        }
                        else {
                            registrationGroupSelected.endRegistrationDate = '';
                            registrationGroupValidations.endRegistrationDateInvalid = false;
                            registrationGroupValidations.startRegistrationDateRangeError = false;
                            registrationGroupValidations.startRegistrationTimeRangeError = false;
                            registrationGroupValidations.endRegistrationDateWarning = false;
                            registrationGroupValidations.endRegistrationDateWarningPre = false;
                        }
                        break;
                    case 'ddlEndHour':
                        registrationGroupSelected.endRegistrationHour = Number(optionSelected.value);
                        registrationGroupValidations.startRegistrationTimeRangeError = this.isTimeRangeInvalid();
                        registrationGroupValidations.endRegistrationHourModified = true;
                        break;
                    case 'ddlEndMinute':
                        registrationGroupSelected.endRegistrationMinute = Number(optionSelected.value);
                        registrationGroupValidations.startRegistrationTimeRangeError = this.isTimeRangeInvalid();
                        registrationGroupValidations.endRegistrationMinuteModified = true;
                        break;
                }
                this.setState({
                    registrationGroupSelected: registrationGroupSelected,
                    registrationGroupValidations: registrationGroupValidations
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
                registrationGroupSelected,
                registrationGroupValidations
            } = this.state;

            const id: string = event.target.id;
            const value: string = event.target.value;
            if (registrationGroupSelected && registrationGroupValidations) {
                switch (id) {
                    case 'txtGroupName':
                        registrationGroupSelected.name = value;
                        registrationGroupValidations.nameModified = true;
                        break;
                    case 'txtSort':
                        registrationGroupSelected.sort = value;
                        registrationGroupValidations.sortInvalid = !this.validateSort(value);
                        registrationGroupValidations.sortModified = true;
                        break;
                    case 'txtStartOffset':
                        registrationGroupSelected.startOffset = value;
                        registrationGroupValidations.startOffsetInvalid = !this.validateOffset(value);
                        registrationGroupValidations.startOffsetModified = true;
                        break;
                    case 'txtEndOffset':
                        registrationGroupSelected.endOffset = value;
                        registrationGroupValidations.endOffsetInvalid = !this.validateOffset(value);
                        registrationGroupValidations.endOffsetModified = true;
                        break;
                }
                this.setState({
                    registrationGroupSelected: registrationGroupSelected,
                    registrationGroupValidations: registrationGroupValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onSaveRegistrationGroup = (): void => {
        try {
            const {
                registrationGroupSelected,
                registrationGroupValidations
            } = this.state;

            if (registrationGroupSelected && registrationGroupValidations) {
                // Validate save
                registrationGroupValidations.endOffsetModified = true;
                registrationGroupValidations.endRegistrationDateModified = true;
                registrationGroupValidations.endRegistrationHourModified = true;
                registrationGroupValidations.endRegistrationMinuteModified = true;
                registrationGroupValidations.endRegistrationTypeModified = true;
                registrationGroupValidations.groupViewNameModified = true;
                registrationGroupValidations.nameModified = true;
                registrationGroupValidations.sortModified = true;
                registrationGroupValidations.startOffsetModified = true;
                registrationGroupValidations.startRegistrationDateModified = true;
                registrationGroupValidations.startRegistrationTimeRangeError = false;
                registrationGroupValidations.startRegistrationHourModified = true;
                registrationGroupValidations.startRegistrationMinuteModified = true;
                registrationGroupValidations.startRegistrationTypeModified = true;
                registrationGroupValidations.sortInvalid = !this.validateSort(registrationGroupSelected.sort.toString());

                if (registrationGroupSelected.endRegistrationType === 'EXACT') {
                    registrationGroupValidations.startRegistrationDateRangeError = this.isDateRangeInvalid();
                    registrationGroupValidations.startRegistrationTimeRangeError = this.isTimeRangeInvalid();
                    registrationGroupValidations.endRegistrationDateWarningPre = this.warningEndPreReg();
                    registrationGroupValidations.endRegistrationDateWarning = this.warningEndReg();
                }
                else {
                    registrationGroupValidations.endOffsetInvalid = !this.validateOffset(registrationGroupSelected.endOffset?.toString());
                }

                if (registrationGroupSelected.startRegistrationType === 'EXACT') {
                    registrationGroupValidations.startRegistrationDateRangeError = this.isDateRangeInvalid();
                    registrationGroupValidations.startRegistrationTimeRangeError = this.isTimeRangeInvalid();
                    registrationGroupValidations.startRegistrationDateWarningPre = this.warningStartPreReg();
                    registrationGroupValidations.startRegistrationDateWarning = this.warningStartReg();
                }
                else {
                    registrationGroupValidations.startOffsetInvalid = !this.validateOffset(registrationGroupSelected.startOffset?.toString());
                }

                this.setState({
                    registrationGroupValidations: registrationGroupValidations
                });

                if (!registrationGroupValidations.startRegistrationDateInvalid
                    && !registrationGroupValidations.startRegistrationDateRangeError
                    && !registrationGroupValidations.startRegistrationTimeRangeError
                    && !registrationGroupValidations.endRegistrationDateInvalid
                    && !registrationGroupValidations.endOffsetInvalid
                    && !registrationGroupValidations.nameDuplicated
                    && !registrationGroupValidations.sortInvalid
                    && !registrationGroupValidations.sortDuplicated
                    && !registrationGroupValidations.startOffsetInvalid
                    && Boolean(registrationGroupSelected.name)
                    && Boolean(registrationGroupSelected.groupViewName)
                    && Boolean(registrationGroupSelected.sort)
                    && Boolean(registrationGroupSelected.startRegistrationType)
                    && ((registrationGroupSelected.startRegistrationType === 'EXACT'
                        && registrationGroupSelected.startRegistrationDate)
                        || (registrationGroupSelected.startRegistrationType !== 'EXACT'
                            && registrationGroupSelected.startOffset !== null
                            && registrationGroupSelected.startOffset !== undefined
                            && registrationGroupSelected.startOffset !== ''))
                    && registrationGroupSelected.startRegistrationHour !== null
                    && registrationGroupSelected.startRegistrationHour !== undefined
                    && registrationGroupSelected.startRegistrationHour >= 0
                    && registrationGroupSelected.startRegistrationMinute !== null
                    && registrationGroupSelected.startRegistrationMinute !== undefined
                    && registrationGroupSelected.startRegistrationMinute >= 0
                    && Boolean(registrationGroupSelected.endRegistrationType)
                    && ((registrationGroupSelected.endRegistrationType === 'EXACT'
                        && registrationGroupSelected.endRegistrationDate)
                        || (registrationGroupSelected.endRegistrationType !== 'EXACT'
                            && registrationGroupSelected.endOffset !== null
                            && registrationGroupSelected.endOffset !== undefined
                            && registrationGroupSelected.endOffset !== ''))
                    && registrationGroupSelected.endRegistrationHour !== null
                    && registrationGroupSelected.endRegistrationHour !== undefined
                    && registrationGroupSelected.endRegistrationHour >= 0
                    && registrationGroupSelected.endRegistrationMinute !== null
                    && registrationGroupSelected.endRegistrationMinute !== undefined
                    && registrationGroupSelected.endRegistrationMinute >= 0) {
                    LayoutActions.setLoading(true);
                    Requests.postPostSaveRegistrationGroup(registrationGroupSelected, this.resolvePostSaveRegistrationGroup, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveRegistrationGroup.name, e));
        }
    };
    // #endregion New-Edit

    private onAddRegistrationGroup = (): void => {
        try {
            LayoutActions.setLoading(true);
            Requests.getRegistrationGroup(0, this.resolveGetNewRegistrationGroup, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddRegistrationGroup.name, e));
        }
    };

    private onChangeEnableDisable = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                registrationGroups
            } = this.state;

            const id: string[] = event.target.id.split('_');
            const registrationId: number = Number(id[2]);
            const isActive: boolean = !Boolean(event.target.value);
            if (registrationGroups && registrationGroups.registrationGroupList) {
                const registerModified: IRegistrationGroup | undefined
                    = registrationGroups.registrationGroupList.find(rg => rg.id === registrationId);
                if (registerModified) {
                    registerModified.isActiveChanged = isActive;
                    this.setState({
                        registrationGroups: registrationGroups
                    });
                    Requests.postStatus(registrationId, isActive, this.resolvePostStatus, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeEnableDisable.name, e));
        }
    };

    private onClickRegistrationGroup = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            LayoutActions.setLoading(true);
            const id: string[] = event.currentTarget.id.split('_');
            Requests.getRegistrationGroup(Number(id[1]), this.resolveGetRegistrationGroup, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickRegistrationGroup.name, e));
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

            Requests.postDeleteRegistrationGroup(idToDetele, this.resolvePostDeleteRegistrationGroup, this.logError);

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
    private getDefaultValidations(): IRegistrationGroupDetailValidations {
        return {
            endOffsetModified: false,
            endRegistrationDateModified: false,
            endRegistrationHourModified: false,
            endRegistrationMinuteModified: false,
            endRegistrationTypeModified: false,
            groupViewNameModified: false,
            nameModified: false,
            sortModified: false,
            startOffsetModified: false,
            startRegistrationDateModified: false,
            startRegistrationHourModified: false,
            startRegistrationMinuteModified: false,
            startRegistrationTypeModified: false,

            endOffsetInvalid: false,
            endRegistrationDateInvalid: false,
            endRegistrationDateRangeError: false,
            endRegistrationDateWarning: false,
            endRegistrationDateWarningPre: false,
            nameDuplicated: false,
            sortDuplicated: false,
            sortInvalid: false,
            startOffsetInvalid: false,
            startRegistrationDateInvalid: false,
            startRegistrationDateRangeError: false,
            startRegistrationDateWarning: false,
            startRegistrationDateWarningPre: false,
            startRegistrationTimeRangeError: false
        } as IRegistrationGroupDetailValidations;
    }

    private isDateRangeInvalid = (): boolean => {
        const {
            registrationGroupSelected,
            registrationGroupValidations
        } = this.state;

        let isInvalid: boolean = false;

        if (registrationGroupSelected && registrationGroupValidations) {
            isInvalid = moment(registrationGroupSelected.startRegistrationDate, this.dateFormat)
                > moment(registrationGroupSelected.endRegistrationDate, this.dateFormat);
        }

        return isInvalid;
    };

    private isTimeRangeInvalid = (): boolean => {
        const {
            registrationGroupSelected,
            registrationGroupValidations
        } = this.state;

        let isInvalid: boolean = false;

        if (registrationGroupSelected && registrationGroupValidations) {
            if (registrationGroupSelected.startRegistrationType === 'EXACT'
                && registrationGroupSelected.endRegistrationType === 'EXACT'
                && !registrationGroupValidations.startRegistrationDateRangeError
                && Boolean(registrationGroupSelected.startRegistrationDate)
                && Boolean(registrationGroupSelected.endRegistrationDate)
                && registrationGroupSelected.startRegistrationHour !== null
                && registrationGroupSelected.startRegistrationHour !== undefined
                && registrationGroupSelected.startRegistrationHour >= 0
                && registrationGroupSelected.startRegistrationMinute !== null
                && registrationGroupSelected.startRegistrationMinute !== undefined
                && registrationGroupSelected.startRegistrationMinute >= 0
                && registrationGroupSelected.endRegistrationHour !== null
                && registrationGroupSelected.endRegistrationHour !== undefined
                && registrationGroupSelected.endRegistrationHour >= 0
                && registrationGroupSelected.endRegistrationMinute !== null
                && registrationGroupSelected.endRegistrationMinute !== undefined
                && registrationGroupSelected.endRegistrationMinute >= 0) {
                if (registrationGroupSelected.startRegistrationDate === registrationGroupSelected.endRegistrationDate) {
                    if (registrationGroupSelected.startRegistrationHour > registrationGroupSelected.endRegistrationHour) {
                        isInvalid = true;
                    }
                    else if (registrationGroupSelected.startRegistrationHour === registrationGroupSelected.endRegistrationHour
                        && registrationGroupSelected.startRegistrationMinute > registrationGroupSelected.endRegistrationMinute) {
                        isInvalid = true;
                    }
                }
            }
        }
        return isInvalid;
    };

    private validateOffset(value?: string): boolean {
        let isValid: boolean = false;
        let numberTest: number;
        if (value?.match(/^-?\d*$/g)) {
            isValid = true;
        }
        if (isValid) {
            numberTest = Number(value);
            isValid = !(isNaN(numberTest)) && (numberTest >= -9999 && numberTest <= 9999);
        }
        return isValid;
    }

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

    private warningEndPreReg = (): boolean => {
        const {
            preRegDate,
            registrationGroupSelected,
            registrationGroupValidations
        } = this.state;

        let isValid: boolean = false;

        if (preRegDate && registrationGroupSelected && registrationGroupValidations) {
            isValid = moment(registrationGroupSelected.endRegistrationDate, this.dateFormat)
                < moment(preRegDate, this.dateFormat);
        }

        return isValid;
    };

    private warningEndReg = (): boolean => {
        const {
            regDate,
            registrationGroupSelected,
            registrationGroupValidations
        } = this.state;

        let isValid: boolean = false;

        if (regDate && registrationGroupSelected && registrationGroupValidations) {
            isValid = moment(registrationGroupSelected.endRegistrationDate, this.dateFormat)
                > moment(regDate, this.dateFormat);
        }

        return isValid;
    };

    private warningStartPreReg = (): boolean => {
        const {
            preRegDate,
            registrationGroupSelected,
            registrationGroupValidations
        } = this.state;

        let isValid: boolean = false;

        if (preRegDate && registrationGroupSelected && registrationGroupValidations) {
            isValid = moment(registrationGroupSelected.startRegistrationDate, this.dateFormat)
                < moment(preRegDate, this.dateFormat);
        }

        return isValid;
    };

    private warningStartReg = (): boolean => {
        const {
            regDate,
            registrationGroupSelected,
            registrationGroupValidations
        } = this.state;

        let isValid: boolean = false;

        if (regDate && registrationGroupSelected && registrationGroupValidations) {
            isValid = moment(registrationGroupSelected.startRegistrationDate, this.dateFormat)
                > moment(regDate, this.dateFormat);
        }

        return isValid;
    };
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
    private resolveGetNewRegistrationGroup = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetNewRegistrationGroup.name);

            if (result?.status) {
                const registrationGroupDetail: IRegistrationGroupDetail = result.data.registrationGroupDetail;
                registrationGroupDetail.sort = '';
                registrationGroupDetail.endOffset = '';
                registrationGroupDetail.startOffset = '';
                registrationGroupDetail.endRegistrationHour = -1;
                registrationGroupDetail.endRegistrationMinute = -1;
                registrationGroupDetail.startRegistrationHour = -1;
                registrationGroupDetail.startRegistrationMinute = -1;
                this.setState({
                    dateBasesOptions: result.data.dateBasesOptions,
                    groupViewsOptions: result.data.groupViewsOptions,
                    preRegDate: result.data.preRegDate,
                    regDate: result.data.regDate,
                    registrationGroupSelected: registrationGroupDetail,
                    registrationGroupValidations: this.getDefaultValidations()
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNewRegistrationGroup.name, e));
        }
    };

    private resolveGetRegistrationGroup = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRegistrationGroup.name);

            if (result?.status) {
                const registrationGroupDetail: IRegistrationGroupDetail = result.data.registrationGroupDetail;
                registrationGroupDetail.nameOriginal = registrationGroupDetail.name;
                registrationGroupDetail.sortOriginal = registrationGroupDetail.sort;
                this.setState({
                    dateBasesOptions: result.data.dateBasesOptions,
                    groupViewsOptions: result.data.groupViewsOptions,
                    preRegDate: result.data.preRegDate,
                    regDate: result.data.regDate,
                    registrationGroupSelected: registrationGroupDetail,
                    registrationGroupValidations: this.getDefaultValidations()
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetRegistrationGroup.name, e));
        }
    };

    private resolveGetRegistrationGroups = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRegistrationGroups.name);

            if (result?.status) {
                const registrationGroups: IRegistrationGroups = result.data;
                if (registrationGroups) {
                    const page: number = this.preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(registrationGroups.overallCount);
                    const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                    this.setState({
                        page: page,
                        registrationGroups: registrationGroups,
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
            this.logError(LogData.fromException(this.resolveGetRegistrationGroups.name, e));
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
                });
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
                    registrationGroupSelected,
                    registrationGroupValidations
                } = this.state;

                if (registrationGroupSelected && registrationGroupValidations) {
                    if (result.data) {
                        registrationGroupValidations.nameDuplicated = false;
                        registrationGroupValidations.nameModified = true;
                    }
                    else {
                        if (registrationGroupSelected.name === registrationGroupSelected.nameOriginal) {
                            registrationGroupValidations.nameDuplicated = false;
                            registrationGroupValidations.nameModified = true;
                        }
                        else {
                            registrationGroupValidations.nameDuplicated = true;
                            registrationGroupValidations.nameModified = true;
                        }
                    }
                    this.setState({
                        registrationGroupValidations: registrationGroupValidations
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
                    registrationGroupSelected,
                    registrationGroupValidations
                } = this.state;

                if (registrationGroupSelected && registrationGroupValidations) {
                    if (result.data) {
                        registrationGroupValidations.sortDuplicated = false;
                        registrationGroupValidations.sortModified = true;
                    }
                    else {
                        if (Number(registrationGroupSelected.sort) === Number(registrationGroupSelected.sortOriginal)) {
                            registrationGroupValidations.sortDuplicated = false;
                            registrationGroupValidations.sortModified = true;
                        }
                        else {
                            registrationGroupValidations.sortDuplicated = true;
                            registrationGroupValidations.sortModified = true;
                        }
                    }
                    this.setState({
                        registrationGroupValidations: registrationGroupValidations
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetValidateSort.name, e));
        }
    };

    private resolvePostDeleteRegistrationGroup = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                page,
                rowsPerPage
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteRegistrationGroup.name);

            if (result?.status) {
                if (result.data) {
                    Requests.getRegistrationGroups(page * rowsPerPage, rowsPerPage, this.resolveGetRegistrationGroups, this.logError);

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
            this.logError(LogData.fromException(this.resolvePostDeleteRegistrationGroup.name, e));
        }
    };

    private resolvePostStatus = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                registrationGroups
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostStatus.name);

            if (result?.status) {
                if (registrationGroups && registrationGroups.registrationGroupList) {
                    const registerModified: IRegistrationGroup | undefined
                        = registrationGroups.registrationGroupList.find(nf => nf.id === result.data.id);
                    if (result.data.result && registerModified) {
                        registerModified.isActive = registerModified.isActiveChanged;
                        registerModified.isActiveChanged = false;
                        this.setState({
                            registrationGroups: registrationGroups
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
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostStatus.name, e));
        }
    };

    private resolvePostSaveRegistrationGroup = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                page,
                rowsPerPage
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveRegistrationGroup.name);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        dateBasesOptions: undefined,
                        groupViewsOptions: undefined,
                        preRegDate: undefined,
                        regDate: undefined,
                        registrationGroupSelected: undefined,
                        registrationGroupValidations: undefined
                    }, () => {
                        Requests.getRegistrationGroups(page * rowsPerPage, rowsPerPage, this.resolveGetRegistrationGroups, this.logError);
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
            this.logError(LogData.fromException(this.resolvePostSaveRegistrationGroup.name, e));
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
            Requests.getRegistrationGroups(page * rowsPerPage, rowsPerPage, this.resolveGetRegistrationGroups, this.logError);
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
            dateBasesOptions,
            groupViewsOptions,
            hours,
            minutes,
            nameToDelete,
            registrationGroups,
            registrationGroupSelected,
            registrationGroupValidations,
            resources,

            // Pagination
            page,
            rowsPerPage,
            rowsPerPageOptions
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (dateBasesOptions && groupViewsOptions && registrationGroupSelected && registrationGroupValidations && cultures) {
                contentPage = (
                    <RegistrationGroupsEdit
                        cultures={cultures}
                        dateBasesOptions={dateBasesOptions}
                        groupViewsOptions={groupViewsOptions}
                        hours={hours}
                        lblDropDownEmptyText={lblDropDownEmptyText}
                        minutes={minutes}
                        registrationGroup={registrationGroupSelected}
                        registrationGroupValidations={registrationGroupValidations}
                        resources={resources.registrationGroupsEdit}
                        onBlurName={this.onBlurName}
                        onBlurSort={this.onBlurSort}
                        onCancel={this.onCancelRegistrationGroup}
                        onChangeCheckbox={this.onChangeCheckbox}
                        onChangeDatePicker={this.onChangeDatePicker}
                        onChangeDropdown={this.onChangeDropdown}
                        onChangeTextField={this.onChangeTextField}
                        onSave={this.onSaveRegistrationGroup}
                    />
                );
            }
            else if (registrationGroups && registrationGroups.registrationGroupList) {
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Text size="h4">
                                    {resources.lblInstructions}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Button
                                    id="btnAddGroup"
                                    onClick={this.onAddRegistrationGroup}
                                >
                                    {resources.btnAdd}
                                </Button>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblRegistrationGroups"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblGroupName}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblStatus}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblEnableDisable}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblSort}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblDelete}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {registrationGroups.registrationGroupList.map((row, i) =>
                                            (
                                                <TableRow key={`${i}_${row.id}`}>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        <Link onClick={this.onClickRegistrationGroup} id={`lnk_${row.id}`}>
                                                            <span>
                                                                {row.name}
                                                            </span>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell
                                                        columnName={resources.lblStatus}
                                                    >
                                                        <StatusLabel
                                                            id={`stat_${i}_${row.id}`}
                                                            text={row.isActive ? resources.lblActive : resources.lblNotActive}
                                                            type={row.isActive ? 'success' : 'default'}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        columnName={resources.lblEnableDisable}
                                                    >
                                                        <Switch
                                                            checked={row.isActive}
                                                            id={`swt_${i}_${row.id}`}
                                                            inputProps={{
                                                                'aria-label': Format.toString(resources.formatEnableGroup, [row.name])
                                                            }}
                                                            onChange={this.onChangeEnableDisable}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        columnName={resources.lblSort}
                                                    >
                                                        <span>
                                                            {row.sort}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        columnName={resources.lblDelete}
                                                    >
                                                        <IconButton
                                                            aria-label={Format.toString(resources.formatDeleteGroup, [row.name])}
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
                        {rowsPerPage > 0 ? (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={registrationGroups.overallCount}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        onPageChange={this.onChangePage}
                                        onRowsPerPageChange={this.onChangeRowsPerPage}
                                    />
                                </Grid>
                            </Grid >
                        ) : undefined}
                        {confirmationModal && (
                            <ConfirmationDialog
                                contentText={Format.toString(resources.deleteGroupConfirmation.formatContent, [nameToDelete])}
                                open={confirmationModal}
                                primaryActionOnClick={this.onCloseDeleteConfirmModal}
                                primaryActionText={resources.deleteGroupConfirmation.btnDecline}
                                secondaryActionOnClick={this.onDeleteConfirm}
                                secondaryActionText={resources.deleteGroupConfirmation.btnAccept}
                                title={resources.deleteGroupConfirmation.lblTitle}
                            />
                        )}
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
export default withStyles(styles)(RegistrationGroups);