/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ActivityGrades.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableEditableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import EmailModal from '../../Generic/EmailModal';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IActivityGradesResources } from '../../../Types/Resources/Classes/IActivityGradesResources';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import {
    ISectionActivityGrades,
    IStudentActivityGrade,
    IStudentActivityGradeToSave
} from '../../../Types/Section/ISectionActivityGrades';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/ActivityGrades';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
export interface IActivityGradesProps {
    cultures: ICultures;
    myPosition: number;
    sectionId: number;
}

interface IActivityGradesState {
    activityGrades?: ISectionActivityGrades;
    checkboxHeader: boolean;
    componentError: boolean;
    isDateToday: boolean;
    isIndeterminate: boolean;
    isLoading: boolean;
    isLoadingSave: boolean;
    isLoadingTable: boolean;
    isStudentSelected: boolean;
    isRestricted: boolean;
    resources?: IActivityGradesResources;

    // #region Date Modal
    dateIndex?: number;
    dateModal: boolean;
    dateSelected?: string;
    // #endregion Date Modal

    // #region Email Modal
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

const styles = ((theme: Theme) => createStyles({
    checkboxHeader: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: `${Tokens.spacing35}!important`
        },
        marginLeft: `${Tokens.spacing40}!important`
    },
    containerDate: {
        paddingLeft: Tokens.spacing30
    },
    containerDateButton: {
        alignItems: 'center',
        display: 'flex',
        width: '100%'
    },
    containerDateMobile: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    containerPossiblePoints: {
        width: '100%'
    },
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    iconInline: {
        display: 'inline'
    },
    marginExtraCredit: {
        marginLeft: Tokens.spacing30,
        marginTop: Tokens.spacing40
    },
    marginTopActionsLeft: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: Tokens.sizingXSmall
        }
    },
    marginTopActionsRight: {
        [theme.breakpoints.up('md')]: {
            marginRight: Tokens.sizingXxLarge
        }
    },
    table: {
        [theme.breakpoints.up('sm')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '30%'
            }
        }
    }
}));

type PropsWithStyles = IActivityGradesProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class ActivityGrades extends React.Component<PropsWithStyles, IActivityGradesState> {
    private dateFormat: string;
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IActivityGradesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.dateFormat = 'YYYY-MM-DD';
        this.idModule = 'Classes';
        this.idPage = 'ActivityGrades';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IActivityGradesState {
        let resources: IActivityGradesResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            checkboxHeader: false,
            componentError: false,
            isDateToday: false,
            isIndeterminate: false,
            isLoading: true,
            isLoadingSave: false,
            isLoadingTable: false,
            isRestricted: false,
            isStudentSelected: false,
            resources: resources,

            // #region Date Modal
            dateModal: false,
            // #endregion Date Modal

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onBlur = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                activityGrades
            } = this.state;

            if (activityGrades) {
                const studentsActivityGrade: IStudentActivityGrade[] = activityGrades.studentsActivityGrade;
                const idSplit: string[] = event.target.id.split('_');
                const position: number = Number(idSplit[2]);

                if (studentsActivityGrade[position].earnedPoints !== null
                    && studentsActivityGrade[position].earnedPoints !== undefined
                    && studentsActivityGrade[position].earnedPoints !== ''
                    && !studentsActivityGrade[position].earnedPointsInvalid) {
                    studentsActivityGrade[position].percentaje =
                        ((Number(studentsActivityGrade[position].earnedPoints) * 100
                            / activityGrades.activityGrade.totalPointsValue).toFixed(2)).toString();
                    if (!Boolean(studentsActivityGrade[position].gradeReceived)) {
                        studentsActivityGrade[position].gradeReceived = moment().format(this.dateFormat);
                        studentsActivityGrade[position].dateKey++;
                    }
                }
                else {
                    studentsActivityGrade[position].percentaje = '';
                }
                this.setState({
                    activityGrades: activityGrades
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlur.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                activityGrades
            } = this.state;

            const checked: boolean = event.target.checked;
            let isIndeterminate: boolean = false;
            let checkboxHeader: boolean = true;
            if (activityGrades) {
                const studentsActivityGrade: IStudentActivityGrade[] = activityGrades.studentsActivityGrade;
                const idSplit: string[] = event.target.id.split('_');
                const position: number = Number(idSplit[2]);
                studentsActivityGrade[position].checkbox = checked;
                if (studentsActivityGrade.findIndex(s => s.checkbox === false || s.checkbox === undefined) !== -1) {
                    checkboxHeader = false;
                }
                if (studentsActivityGrade.findIndex(s => s.checkbox === true) !== -1) {
                    isIndeterminate = true;
                }
                this.setState({
                    activityGrades: activityGrades,
                    checkboxHeader: checkboxHeader,
                    isIndeterminate: isIndeterminate,
                    isStudentSelected: studentsActivityGrade.find(students => students.checkbox) ? true : false
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
                activityGrades
            } = this.state;

            const value: string = date;

            if (activityGrades) {
                const studentsActivityGrade: IStudentActivityGrade[] = activityGrades.studentsActivityGrade;
                const idSplit: string[] = id.split('_');
                const position: number = Number(idSplit[2]);
                studentsActivityGrade[position].gradeReceivedModified = true;
                studentsActivityGrade[position].gradeReceived = value;
                studentsActivityGrade[position].gradeReceivedInvalid = Boolean(value) && !isValid;
                this.setState({
                    activityGrades: activityGrades
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDatePicker.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                activityGrades
            } = this.state;

            if (activityGrades) {
                activityGrades.activitySelected = optionSelected;
                this.setState({
                    activityGrades: activityGrades
                });
                this.showLoaderTable();
                Requests.getActivityGradesById(sectionId,
                    Number(optionSelected.value),
                    this.resolveGetActivityGradesById);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));
        }
    };

    private onChangeSelectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                activityGrades,
                isIndeterminate
            } = this.state;

            let checked: boolean = event.target.checked;
            if (activityGrades && activityGrades.activityGrade && activityGrades.studentsActivityGrade.length > 0) {
                const studentsActivityGrade: IStudentActivityGrade[] = activityGrades.studentsActivityGrade;
                if (isIndeterminate) {
                    checked = false;
                }
                studentsActivityGrade.forEach(student => student.checkbox = checked);
                this.setState({
                    activityGrades: activityGrades,
                    checkboxHeader: checked,
                    isIndeterminate: false,
                    isStudentSelected: checked
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSelectAll.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                activityGrades
            } = this.state;

            const value: string = event.target.value;

            if (activityGrades) {
                const studentsActivityGrade: IStudentActivityGrade[] = activityGrades.studentsActivityGrade;
                const idSplit: string[] = event.target.id.split('_');
                const position: number = Number(idSplit[2]);
                switch (idSplit[0]) {
                    case 'txtPointsEarned':
                        studentsActivityGrade[position].earnedPointsModified = true;
                        studentsActivityGrade[position].earnedPoints = value;
                        studentsActivityGrade[position].earnedPointsInvalid = Boolean(value) &&
                            !this.validateEarnedPoints(value, activityGrades.activityGrade.totalPointsValue);
                        break;
                    case 'txtGrade':
                        studentsActivityGrade[position].gradeModified = true;
                        studentsActivityGrade[position].grade = value;
                        break;
                    case 'txtComments':
                        studentsActivityGrade[position].instructorComments = value;
                        break;
                }
                this.setState({
                    activityGrades: activityGrades
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onSave = (): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                activityGrades
            } = this.state;

            if (activityGrades
                && activityGrades.studentsActivityGrade
                && activityGrades.studentsActivityGrade.length > 0) {
                this.showLoaderSave();
                if (!Boolean(activityGrades.studentsActivityGrade.find(s =>
                    s.earnedPointsInvalid
                    || s.gradeInvalid
                    || s.gradeReceivedInvalid
                    || (s.earnedPoints !== null && s.earnedPoints !== undefined && s.earnedPoints !== '' && !Boolean(s.gradeReceived))
                    || ((s.earnedPoints === null || s.earnedPoints === undefined || s.earnedPoints === '') && Boolean(s.gradeReceived))))) {
                    const studentsActivityGradesToSave: IStudentActivityGradeToSave[] = [];
                    activityGrades.studentsActivityGrade.forEach(student => studentsActivityGradesToSave.push({
                        assignmentId: student.assignmentId,
                        earnedPoints: student.earnedPoints !== null && student.earnedPoints !== undefined && student.earnedPoints !== ''
                            ? Number(student.earnedPoints) : null,
                        grade: student.grade,
                        gradeReceived: student.gradeReceived,
                        instructorComments: student.instructorComments,
                        studentAssignmentId: student.studentAssignmentId,
                        studentId: student.personId
                    } as IStudentActivityGradeToSave));
                    Requests.postSaveActivityGrades(sectionId,
                        studentsActivityGradesToSave,
                        this.resolvePostSaveActivityGrades);
                }
                else {
                    activityGrades.studentsActivityGrade.forEach(student => {
                        student.earnedPointsModified = true;
                        student.gradeModified = true;
                        student.gradeReceivedModified = true;
                    });
                    this.setState({
                        activityGrades: activityGrades
                    }, this.hideLoaderSave);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
        }
    };

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
                activityGrades,
                dateIndex
            } = this.state;

            if (activityGrades && dateIndex !== undefined) {
                activityGrades.studentsActivityGrade[dateIndex].gradeReceivedModified = true;
                activityGrades.studentsActivityGrade[dateIndex].gradeReceived = '';
                this.setState({
                    activityGrades: activityGrades,
                    dateIndex: undefined,
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
                dateIndex: undefined,
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
                activityGrades,
                dateIndex,
                dateSelected
            } = this.state;

            if (activityGrades && dateIndex !== undefined) {
                activityGrades.studentsActivityGrade[dateIndex].gradeReceivedModified = true;
                activityGrades.studentsActivityGrade[dateIndex].gradeReceived = dateSelected ? dateSelected : '';
                this.setState({
                    activityGrades: activityGrades,
                    dateIndex: undefined,
                    dateModal: false,
                    dateSelected: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOkDate.name, e));
        }
    };

    private onOpenDate = (position: number): void => {
        try {
            const {
                activityGrades
            } = this.state;

            if (activityGrades) {
                this.setState({
                    dateIndex: position,
                    dateModal: true,
                    dateSelected: activityGrades.studentsActivityGrade[position].gradeReceived
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDate.name, e));
        }
    };
    // #endregion Date Modal

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                activityGrades
            } = this.state;

            if (activityGrades) {
                const emailSettings: IEmailSettings = activityGrades.emailSettings;
                if (emailSettings.emailProvider === EmailProviderOption.SelfService) {
                    LayoutActions.showPageLoader();
                    this.setState({
                        recipientsEmailAddresses: emailAddresses,
                        openEmailModal: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenEmailModal.name, e));
        }
    };

    private onCloseEmailModal = (): void => {
        try {
            this.setState({
                openEmailModal: false,
                recipientsEmailAddresses: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEmailModal.name, e));
        }
    };
    // #endregion Email Modal

    // #endregion Events

    // #region Functions
    private setUIValues(possiblePoints: number, students: IStudentActivityGrade[]): IStudentActivityGrade[] {
        try {
            if (students && students.length > 0) {
                students.forEach(student => {
                    if (student.earnedPoints !== null && student.earnedPoints !== undefined && student.earnedPoints !== '' && possiblePoints > 0) {
                        student.percentaje = ((Number(student.earnedPoints) * 100 / possiblePoints).toFixed(2)).toString();
                    }
                    else {
                        student.percentaje = '';
                    }
                    student.dateKey = Math.floor(Math.random() * 100);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setUIValues.name, e));
        }
        return students;
    }

    private validateEarnedPoints(value: string, possiblePoints: number): boolean {
        let isValid: boolean = false;
        let numberTest: number;
        if (value.match(/^(\d+\.?\d{0,2}|\.\d{1,2})$/g)) {
            isValid = true;
        }
        if (isValid) {
            numberTest = Number(value);
            isValid = !(isNaN(numberTest)) && numberTest >= 0 && numberTest <= possiblePoints;
        }
        return isValid;
    }
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingSave: false,
            isLoadingTable: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoaderSave = (): void => {
        this.setState({
            isLoadingSave: false
        });
    };

    private showLoaderSave = (): void => {
        this.setState({
            isLoadingSave: true
        });
    };

    private hideLoaderTable = (): void => {
        this.setState({
            isLoadingTable: false
        });
    };

    private showLoaderTable = (): void => {
        this.setState({
            isLoadingTable: true
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
    private resolveGetActivityGrades = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetActivityGrades.name, this.hideAllLoaders);

            if (result?.status) {
                const activityGrades: ISectionActivityGrades = result.data;
                if (activityGrades && activityGrades.activities && activityGrades.activities.length > 0) {
                    activityGrades.activitySelected = activityGrades.activities[0];
                    activityGrades.studentsActivityGrade
                        = this.setUIValues(
                            activityGrades.activityGrade ? activityGrades.activityGrade.totalPointsValue : 0,
                            activityGrades.studentsActivityGrade);
                }
                this.setState({
                    activityGrades: activityGrades,
                    isDateToday: activityGrades.isDateToday,
                    isRestricted: activityGrades.isRestricted
                }, this.hideLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetActivityGrades.name, e));
        }
    };

    private resolveGetActivityGradesById = (json: string): void => {
        try {
            const {
                activityGrades
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetActivityGradesById.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    if (activityGrades) {
                        activityGrades.activityGrade = result.data.activityGrade;
                        activityGrades.studentsActivityGrade = result.data.studentsActivityGrade;
                        activityGrades.studentsActivityGrade
                            = this.setUIValues(
                                activityGrades.activityGrade ? activityGrades.activityGrade.totalPointsValue : 0,
                                activityGrades.studentsActivityGrade);
                    }

                    this.setState({
                        activityGrades: activityGrades,
                        isDateToday: result.data.isDateToday
                    }, this.hideLoaderTable);
                }
                else {
                    this.hideLoaderTable();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetActivityGradesById.name, e));
        }
    };

    private resolvePostSaveActivityGrades = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveActivityGrades.name, this.hideAllLoaders);

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
                }
                else {
                    this.showError();
                }
                this.hideLoaderSave();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveActivityGrades.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                Store.setResources(this.props.myPosition, result.data);
                this.setState({
                    resources: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                sectionId
            } = this.props;
            const {
                resources
            } = this.state;

            if (!resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
            Requests.getActivityGrades(sectionId, this.resolveGetActivityGrades);
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
            cultures
        } = this.props;

        const {
            activityGrades,
            componentError,
            isDateToday,
            isIndeterminate,
            isLoading,
            isLoadingSave,
            isLoadingTable,
            isRestricted,
            isStudentSelected,
            checkboxHeader,
            resources,

            // #region Date Modal
            dateModal,
            dateSelected,
            // #endregion Date Modal

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let emailModal: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrActivityGrades" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (activityGrades
                && activityGrades.activities
                && activityGrades.activitySelected
                && activityGrades.activityGrade
                && activityGrades.studentsActivityGrade
                && activityGrades.studentsActivityGrade.length > 0) {
                const dateMinFormat: string = moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
                const dateMaxFormat: string = moment().add(100, 'years').format(cultures.shortDatePattern.toUpperCase());

                const onClickEmail = (): void => {
                    const emails: string[] = [];
                    activityGrades.studentsActivityGrade.forEach(status => {
                        if (status.checkbox && Boolean(status.email)) {
                            emails.push(status.email);
                        }
                    });

                    if (activityGrades.emailSettings.emailProvider === EmailProviderOption.External) {
                        window.open(Format.toString(activityGrades.emailSettings.staffUrl, [emails.join(activityGrades.emailSettings.staffSeparator)]),
                            activityGrades.emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
                    }
                    else {
                        this.onOpenEmailModal(emails);
                    }
                };

                const changeDateModal: JSX.Element = (
                    <Modal
                        header={resources.lblGradeReceived}
                        id="changeDateModal"
                        footer={(
                            <ButtonGroup id="bgDateModal">
                                <Button
                                    color="secondary"
                                    id="btnClearDate"
                                    onClick={this.onClearDate}
                                >
                                    {resources.btnClear}
                                </Button>
                                <Button
                                    id="btnChangeDate"
                                    onClick={this.onOkDate}
                                >
                                    {resources.btnOk}
                                </Button>
                            </ButtonGroup>
                        )}
                        maxWidth="xs"
                        open={dateModal}
                        onClose={this.onCloseDate}
                    >
                        <Grid container justifyContent="center">
                            <Grid item>
                                <DatePicker
                                    culture={cultures.dateTimeCulture}
                                    format={cultures.shortDatePattern}
                                    id="dtpChangeDate"
                                    selectedDates={dateSelected ? [dateSelected] : undefined}
                                    value={dateSelected || ''}
                                    variant="standalone"
                                    onChange={this.onChangeDate}
                                />
                            </Grid>
                        </Grid>
                    </Modal>
                );

                contentPage = (
                    <>
                        {isRestricted && (
                            <>
                                <Grid container>
                                    <Grid item md={12}>
                                        <Alert
                                            id="msgIsRestricted"
                                            open
                                            text={resources.lblLegend}
                                            type={ResultType.info}
                                        />
                                    </Grid>
                                </Grid>
                                <br />
                            </>
                        )}
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <Dropdown
                                    id="ddlActivity"
                                    label={resources.lblActivity}
                                    options={activityGrades.activities}
                                    value={activityGrades.activitySelected.value}
                                    onChange={this.onChangeDropdown}
                                />
                            </Grid>
                            {!isLoadingTable ? (
                                <>
                                    <Grid item xs={12}>
                                        <Text>
                                            {activityGrades.activityGrade.description}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Text display="inline">
                                            {Format.toString(resources.formatActivityInfo, [
                                                activityGrades.activityGrade.dueDate,
                                                activityGrades.activityGrade.totalPoints,
                                                activityGrades.isRestricted ? activityGrades.activityGrade.gradeDueDate : '',
                                                activityGrades.activityGrade.isExtraCredit ? resources.lblExtraCredit : ''
                                            ])}
                                        </Text>
                                        {activityGrades.activityGrade.isExtraCredit ? (
                                            <Tooltip
                                                id="tltExtraCredit"
                                                title={resources.lblWithExtraCredit}
                                                aria-label={resources.lblWithExtraCredit}
                                                placement="top"
                                            >
                                                <Icon
                                                    className={classes.marginExtraCredit}
                                                    name="info"
                                                    type="info"
                                                />
                                            </Tooltip>
                                        ) : undefined}
                                    </Grid>
                                </>
                            ) : undefined}
                        </Grid>
                        {isLoadingTable ? (
                            <ContainerLoader id="ldrActivityGradesTable" height="md" />
                        ) : (
                            <>
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item className={classes.marginTopActionsLeft}>
                                        <Checkbox
                                            checked={isIndeterminate || checkboxHeader}
                                            classes={{
                                                focused: classes.checkboxHeader,
                                                root: classes.checkboxHeader
                                            }}
                                            id="chkSelectAll"
                                            indeterminate={isIndeterminate && !checkboxHeader}
                                            inputProps={{
                                                'aria-label': this.layoutResources?.lblSelectAll
                                            }}
                                            onChange={this.onChangeSelectAll}
                                        />
                                        <Tooltip
                                            id="tltEmailSelected"
                                            title={resources.btnSendEmail}
                                            placement="top"
                                        >
                                            <div className={classes.iconInline}>
                                                <IconButton
                                                    title={resources.btnSendEmail}
                                                    classes={{ root: classes.iconHeader }}
                                                    color="secondary"
                                                    disabled={!isStudentSelected}
                                                    onClick={onClickEmail}
                                                    id="btnSentEmail"
                                                >
                                                    <Icon large name="email" />
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item className={classes.marginTopActionsRight}>
                                        {/* <Hidden smDown>
                                <Button
                                    TextProps={{
                                        display: 'inline',
                                    }}
                                    IconProps={{
                                        name: 'download'
                                    }}
                                    id="download"
                                    align="left"
                                    textVariantStyling="inherit"
                                    variant="text"
                                    onClick={onDownloadModal}
                                >
                                    {resources.lblDownload}
                                </Button>
                            <IconButton
                                title={resources.btnStatistics}
                                classes={{ root: classes.iconHeader }}
                                color="secondary"
                                id="btnStatistics"
                            >
                                <Icon large name="bar-chart" />
                            </IconButton>
                    </Hidden>
                    <Hidden mdUp>
                        <ButtonGroup id="bgDownloadStatistics">
                                <IconButton
                                    title={resources.btnDownload}
                                    classes={{ root: classes.iconHeader }}
                                    color="secondary"
                                    id="btnDownload"
                                >
                                    <Icon large name="download" />
                                </IconButton>
                                <IconButton
                                    title={resources.btnStatistics}
                                    classes={{ root: classes.iconHeader }}
                                    color="secondary"
                                    id="btnStatistics"
                                >
                                    <Icon large name="bar-chart" />
                                </IconButton>
                        </ButtonGroup>
                    </Hidden>*/}
                                    </Grid>
                                </Grid>
                                <br />
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblActivityGrades"
                                    variant="expansionPanels"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblName}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                {resources.lblPointsEarned}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblPossiblePoints}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblGrade}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblGradeReceived}
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {activityGrades.studentsActivityGrade.map((row, i) => {
                                            const openDateFunc = this.onOpenDate;
                                            const callbackOpenDate = function (): void { openDateFunc(i); };
                                            return (
                                                <TableExpandableRow
                                                    key={`studentsList_${row.personId}`}
                                                    expandedRowContent={
                                                        (
                                                            <div>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={12} md={4}>
                                                                        <Text weight="strong">
                                                                            {resources.lblGradeDetails}
                                                                        </Text>
                                                                    </Grid>
                                                                    {row.createDate ? (
                                                                        <Grid item xs={12} sm={4}>
                                                                            <Text>
                                                                                {Format.toString(resources.formatCreatedGrade,
                                                                                    [row.createDate || '', row.enteredFullName || ''])}
                                                                            </Text>
                                                                        </Grid>
                                                                    ) : undefined}
                                                                    {row.revisionDate ? (
                                                                        <Grid item xs={12} sm={4}>
                                                                            <Text>
                                                                                {Format.toString(resources.formatModifiedDate,
                                                                                    [row.revisionDate || '', row.modifiedFullName || ''])}
                                                                            </Text>
                                                                        </Grid>
                                                                    ) : undefined}
                                                                </Grid>
                                                                {activityGrades.enableActivityGradeComments ? (
                                                                    <Grid container>
                                                                        <Grid item xs={12}>
                                                                            <TextField
                                                                                id={`txtComments_${row.personId}_${i}`}
                                                                                label={resources.lblComments}
                                                                                value={row.instructorComments || ''}
                                                                                onChange={this.onChangeTextField}
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                ) : undefined}
                                                            </div>
                                                        )
                                                    }
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        <AvatarText
                                                            CheckboxProps={{
                                                                checked: Boolean(row.checkbox),
                                                                id: `chkName_${row.personId}_${i}`,
                                                                inputProps: {
                                                                    'aria-label': Format.toString(resources.formatSelectStudent, [row.fullName])
                                                                },
                                                                onChange: this.onChangeCheckbox
                                                            }}
                                                            avatarInfo={row}
                                                            complement={row.withdrawn ? (
                                                                <StatusLabel
                                                                    id={`stsLbl_${i}_${row.personId}`}
                                                                    text={resources.lblWithdrawn}
                                                                    type="draft"
                                                                />
                                                            ) : undefined}
                                                        />
                                                    </TableCell>
                                                    <TableEditableCell
                                                        columnName={resources.lblPointsEarned}
                                                        editableComponent={
                                                            (
                                                                <TextField
                                                                    cell
                                                                    disabled={isRestricted && isDateToday}
                                                                    error={row.earnedPointsModified
                                                                        && (row.earnedPointsInvalid
                                                                            || ((row.earnedPoints === null
                                                                                || row.earnedPoints === undefined
                                                                                || row.earnedPoints === '')
                                                                                && Boolean(row.gradeReceived)))}
                                                                    helperText={row.earnedPointsModified
                                                                        ? (row.earnedPointsInvalid ?
                                                                            Format.toString(resources.formatPointsEarnedInvalid,
                                                                                [activityGrades.activityGrade.totalPoints])
                                                                            : ((row.earnedPoints === null
                                                                                || row.earnedPoints === undefined
                                                                                || row.earnedPoints === '')
                                                                                && Boolean(row.gradeReceived) ?
                                                                                resources.lblPointsEarnedRequired
                                                                                : undefined)
                                                                        ) : undefined}
                                                                    id={`txtPointsEarned_${row.personId}_${i}`}
                                                                    label=""
                                                                    numeric
                                                                    size="small"
                                                                    value={(row.earnedPoints === null
                                                                        || row.earnedPoints === undefined
                                                                        || row.earnedPoints === '') ?
                                                                        ''
                                                                        : row.earnedPoints}
                                                                    onBlur={this.onBlur}
                                                                    onChange={this.onChangeTextField}
                                                                />
                                                            )}
                                                        error={row.earnedPointsModified
                                                            && (row.earnedPointsInvalid
                                                                || ((row.earnedPoints === null
                                                                    || row.earnedPoints === undefined
                                                                    || row.earnedPoints === '')
                                                                    && Boolean(row.gradeReceived)))}
                                                        align="right"
                                                    />
                                                    <TableCell
                                                        columnName={resources.lblPossiblePoints}
                                                    >
                                                        <span className={classes.containerPossiblePoints}>
                                                            {Format.toString(resources.formatPosiblePoints, [
                                                                activityGrades.activityGrade.totalPoints,
                                                                row.percentaje
                                                            ])}
                                                        </span>
                                                    </TableCell>
                                                    <TableEditableCell
                                                        columnName={resources.lblGrade}
                                                        editableComponent={
                                                            (
                                                                <TextField
                                                                    cell
                                                                    disabled={isRestricted && isDateToday}
                                                                    error={row.gradeModified && row.gradeInvalid}
                                                                    helperText={row.gradeModified
                                                                        ? (row.gradeInvalid ?
                                                                            resources.lblGradeInvalid
                                                                            : undefined)
                                                                        : undefined}
                                                                    id={`txtGrade_${row.personId}_${i}`}
                                                                    label=""
                                                                    maxCharacters={4}
                                                                    size="small"
                                                                    value={row.grade || ''}
                                                                    onChange={this.onChangeTextField}
                                                                />
                                                            )}
                                                        error={row.gradeModified && row.gradeInvalid}
                                                    />
                                                    <TableEditableCell
                                                        columnName={resources.lblGradeReceived}
                                                        editableComponent={
                                                            (
                                                                <>
                                                                    <div className={classes.containerDateMobile}>
                                                                        <div className={classes.containerDateButton}>
                                                                            <IconButton
                                                                                title={resources.lblGradeReceived}
                                                                                onClick={callbackOpenDate}
                                                                                id={'btnDate_{i}'}
                                                                            >
                                                                                <Icon name="calendar" />
                                                                            </IconButton>
                                                                            {row.gradeReceived ? (
                                                                                <span className={classes.containerDate}>
                                                                                    {moment(row.gradeReceived, this.dateFormat)
                                                                                        .format(cultures.shortDatePattern.toUpperCase())}
                                                                                </span>
                                                                            ) : undefined}
                                                                        </div>
                                                                        {row.gradeReceivedModified
                                                                            && (row.gradeReceivedInvalid
                                                                                || (row.earnedPoints !== null
                                                                                    && row.earnedPoints !== undefined
                                                                                    && row.earnedPoints !== ''
                                                                                    && !Boolean(row.gradeReceived))) ? (
                                                                            <Text color="error">
                                                                                {row.gradeReceivedInvalid ?
                                                                                    Format.toString(resources.formatDateOutOfRange,
                                                                                        [dateMinFormat, dateMaxFormat])
                                                                                    : (row.earnedPoints !== null
                                                                                        && row.earnedPoints !== undefined
                                                                                        && row.earnedPoints !== ''
                                                                                        && !Boolean(row.gradeReceived) ?
                                                                                        resources.lblGradeReceivedRequired
                                                                                        : undefined)}
                                                                            </Text>
                                                                        ) : undefined}
                                                                    </div>
                                                                </>
                                                            )}
                                                        error={row.gradeReceivedModified
                                                            && (row.gradeReceivedInvalid
                                                                || (row.earnedPoints !== null
                                                                    && row.earnedPoints !== undefined
                                                                    && row.earnedPoints !== ''
                                                                    && !Boolean(row.gradeReceived)))}
                                                    />
                                                </TableExpandableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                <br />
                                <Grid container alignItems="flex-end">
                                    <Grid item xs>
                                        <Button
                                            id="btnSave"
                                            loading={isLoadingSave}
                                            onClick={this.onSave}
                                        >
                                            {resources.btnSave}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        {changeDateModal}
                    </>
                );

                if (openEmailModal) {
                    emailModal = (
                        <EmailModal
                            emailSettings={activityGrades.emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    );
                }
            }
            else if (!activityGrades
                || !(activityGrades.activities)
                || activityGrades.activities.length <= 0
                || !(activityGrades.activitySelected)
                || !(activityGrades.activityGrade)) {
                contentPage = (
                    <Illustration
                        color="secondary"
                        height="lg"
                        internalName="no-activities"
                        text={resources.lblNoActivities}
                    />
                );
            }
            else {
                contentPage = (
                    <Illustration
                        color="secondary"
                        height="lg"
                        internalName="no-enrolled"
                        text={resources.lblNoResultsFound}
                    />
                );
            }
        }

        return (
            <>
                {contentPage}
                {emailModal}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(ActivityGrades);