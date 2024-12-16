/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ConEdRegistration.tsx
 * Type: Container component */

// #region ImportsdateOptionValue
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ConEdOptionDate, IConEdRegistration } from '../../../Types/InstitutionSettings/IConEdRegistration';
import { IConEdRegistrationResources } from '../../../Types/Resources/Administration/IConEdRegistrationResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/ConEdRegistration';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
interface IConEdRegistrationProps {
    lblDropDownEmptyText: string;
    lblSuccessSave: string;
}

interface IConEdRegistrationState {
    agreements?: IDropDownOption[];
    assessmentTypeOptions?: IDropDownOption[];
    cashReceiptCodes?: IDropDownOption[];
    cashReceiptOffices?: IDropDownOption[];
    emailTypes?: IDropDownOption[];
    componentError: boolean;
    dateOptionValue: number;
    fileExtensionOptions?: IDropDownOption[];
    pictureDirections?: IDropDownOption[];
    resources?: IConEdRegistrationResources;
    statementOptions?: IDropDownOption[];
    conEdRegistration?: IConEdRegistration;
}

const styles = createStyles({
    indentBlock: {
        paddingLeft: `${Tokens.spacing60}!important`
    },
    spaceBlocks: {
        paddingTop: Tokens.spacing40
    }
});

type PropsWithStyles = IConEdRegistrationProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class ConEdRegistration extends React.Component<PropsWithStyles, IConEdRegistrationState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IConEdRegistrationState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'ConEdRegistration';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IConEdRegistrationState {
        let resources: IConEdRegistrationResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            dateOptionValue: 1,
            resources: resources
        };
    }

    // #region Events

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                conEdRegistration
            } = this.state;
            const id: string = event.target.id;
            const value: string = event.target.value;
            if (conEdRegistration) {
                switch (id) {
                    case 'txtDropTimeLimit':
                        conEdRegistration.dropTimeLimitModified = true;
                        conEdRegistration.dropTimeLimit = value;
                        conEdRegistration.dropTimeLimitInvalid = !this.validateInt(value);
                        break;
                        {/* case 'txtExpirationIncrement':
                        conEdRegistration.expirationIncrementModified = true;
                        conEdRegistration.expirationIncrement = value;
                        conEdRegistration.expirationIncrementInvalid = !this.validateInt(value);
                        break;
                        case 'txtExpirationMaxDuration':
                        conEdRegistration.expirationMaxDurationModified = true;
                        conEdRegistration.expirationMaxDuration = value;
                        conEdRegistration.expirationMaxDurationInvalid = !this.validateInt(value);
                        if (!conEdRegistration.expirationMaxDurationInvalid && !conEdRegistration.expirationIncrementInvalid) {
                            if (Number(conEdRegistration.expirationMaxDuration) < Number(conEdRegistration.expirationIncrement)) {
                                conEdRegistration.expirationMaxDurationLessThan = true;
                            }
                            else {
                                conEdRegistration.expirationMaxDurationLessThan = false;
                            }
                        }
                        break;*/}
                    case 'txtRegistrationStart':
                        conEdRegistration.registrationStartPeriodModified = true;
                        conEdRegistration.registrationStartPeriod = value;
                        conEdRegistration.registrationStartPeriodInvalid = !this.validateInt(value);
                        break;
                    case 'txtRegistrationEnd':
                        conEdRegistration.registrationEndPeriodModified = true;
                        conEdRegistration.registrationEndPeriod = value;
                        conEdRegistration.registrationEndPeriodInvalid = !this.validateInt(value);
                        break;

                }

                this.setState({
                    conEdRegistration: conEdRegistration
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onCheckboxChange = (event: any): void => {
        try {
            const {
                conEdRegistration
            } = this.state;

            const checked: boolean = event.target.checked;

            if (conEdRegistration) {
                switch (event.target.id) {
                    case 'chkAllowDrop':
                        conEdRegistration.allowDrops = checked;
                        if (!conEdRegistration.allowDrops && conEdRegistration.dropTimeLimitInvalid) {
                            conEdRegistration.dropTimeLimit = '0';
                            conEdRegistration.dropTimeLimitInvalid = false;
                        }
                        break;
                    case 'chkAllowChangeOfCreditType':
                        conEdRegistration.allowChangeOfCreditType = checked;
                        break;
                    case 'chkEnableWaitlist':
                        conEdRegistration.enableWaitList = checked;
                        break;
                    // case 'chkEnableStudentAgreement':
                    //    conEdRegistration.enableStudentAgreement = checked;
                    //    if (!checked) {
                    //        conEdRegistration.agreementIdModified = false;
                    //    }
                    //    break;
                    case 'chkEnableInstructorPermissionRequest':
                        conEdRegistration.enableInstructorPermissionRequest = checked;
                        if (conEdRegistration.enableInstructorPermissionRequest) {
                            conEdRegistration.validatePrerequisites = true;
                        }
                        break;
                    case 'chkEnableRegisterForPendingCourses':
                        conEdRegistration.enableRegisterForPendingCourses = checked;
                        break;
                    case 'chkEnableOnlinePayment':
                        if (checked) {
                            Requests.postValidateConEdRegistrationPayment(this.resolvePostValidateRegistrationPayment, this.logError);
                        }
                        else {
                            conEdRegistration.enableOnlinePayment = checked;
                            conEdRegistration.requireOnlinePayment = false;
                            conEdRegistration.enableOnlinePaymentIsValid = true;
                            conEdRegistration.cashReceiptCodeModified = false;
                            conEdRegistration.cashReceiptOfficeModified = false;
                        }
                        break;
                        {/* case 'chkEnableTransactionRollback':
                        conEdRegistration.enableTransactionRollback = checked;
                        if (!conEdRegistration.enableTransactionRollback) {
                            conEdRegistration.expirationIncrementInvalid = false;
                            conEdRegistration.expirationIncrementModified = false;
                            conEdRegistration.expirationMaxDurationInvalid = false;
                            conEdRegistration.expirationMaxDurationModified = false;
                        }
                        break;*/}
                    case 'chkShowCoursePicture':
                        conEdRegistration.showCoursePicture = checked;
                        if (!conEdRegistration.showCoursePicture) {
                            conEdRegistration.locationModified = false;
                            conEdRegistration.fileExtensionModified = false;
                        }
                        break;
                    case 'chkShowSource':
                        conEdRegistration.includeUncategorizedSources = checked;
                        break;
                    case 'chkRequireOnlinePayment':
                        conEdRegistration.requireOnlinePayment = checked;
                        if (conEdRegistration.requireOnlinePayment) {
                            conEdRegistration.enableOnlinePayment = true;
                        }
                        break;
                    case 'chkUseTransactionChargesOnly':
                        conEdRegistration.useTransactionChargesOnly = checked;
                        break;
                    case 'chkValidateTimeConflicts':
                        conEdRegistration.validateTimeConflicts = checked;
                        break;
                    case 'chkValidateCorequisites':
                        conEdRegistration.validateCorequisites = checked;
                        break;
                    case 'chkValidatePrerequisites':
                        conEdRegistration.validatePrerequisites = checked;
                        if (!conEdRegistration.validatePrerequisites) {
                            conEdRegistration.enableInstructorPermissionRequest = false;
                        }
                        break;
                    case 'chkValidateClassAvailability':
                        conEdRegistration.validateClassAvailability = checked;
                        break;
                    case 'chkValidateCreditLimit':
                        conEdRegistration.validateCreditLimit = checked;
                        break;
                    case 'chkValidateCrosstally':
                        conEdRegistration.validateCrosstally = checked;
                        break;
                    case 'chkValidateTimeConflicts':
                        conEdRegistration.validateTimeConflicts = checked;
                        break;
                }
                this.setState({
                    conEdRegistration: conEdRegistration
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onDropdownChange = (option: IDropDownOption, id: string): void => {
        try {
            const {
                conEdRegistration
            } = this.state;

            if (conEdRegistration) {
                switch (id) {
                    // case 'ddlAgreement':
                    //    conEdRegistration.agreementIdModified = true;
                    //    conEdRegistration.agreementId = Number(option.value);
                    //    break;
                    case 'ddlAssessmentType':
                        conEdRegistration.assessmentType = String(option.value);
                        break;
                    case 'ddlStatementType':
                        conEdRegistration.statementType = String(option.value);
                        break;
                    case 'ddlCashReceiptCode':
                        conEdRegistration.cashReceiptCodeModified = true;
                        conEdRegistration.cashReceiptCode = Number(option.value);
                        break;
                    case 'ddlCashReceiptOffice':
                        conEdRegistration.cashReceiptOfficeModified = true;
                        conEdRegistration.cashReceiptOffice = Number(option.value);
                        break;
                    case 'ddlDateOptions':
                        conEdRegistration.registrationEndPeriodOption = Number(option.value);
                        break;
                    case 'ddlDropDateOptions':
                        conEdRegistration.dropTimeLimitOption = Number(option.value);
                        break;
                    case 'ddlEmailType':
                        conEdRegistration.defaultEmailTypeModified = true;
                        conEdRegistration.defaultEmailType = Number(option.value);
                        break;
                    case 'ddlFileExtension':
                        conEdRegistration.fileExtensionModified = true;
                        conEdRegistration.fileExtension = String(option.value);
                        break;
                    case 'ddlLocation':
                        conEdRegistration.locationModified = true;
                        conEdRegistration.location = String(option.value);
                        break;
                    case 'ddlStudentRole':
                        conEdRegistration.defaultConEdStudentRoleModified = true;
                        conEdRegistration.defaultConEdStudentRole = Number(option.value);
                        break;
                }

                this.setState({
                    conEdRegistration: conEdRegistration
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                conEdRegistration
            } = this.state;

            if (conEdRegistration) {
                conEdRegistration.registrationStartPeriodModified = true;
                conEdRegistration.registrationStartPeriodInvalid = !this.validateInt(conEdRegistration.registrationStartPeriod);
                conEdRegistration.registrationEndPeriodModified = true;
                conEdRegistration.registrationEndPeriodInvalid = !this.validateInt(conEdRegistration.registrationEndPeriod);
                conEdRegistration.dropTimeLimitModified = true;
                conEdRegistration.dropTimeLimitInvalid = !this.validateInt(conEdRegistration.dropTimeLimit);
                conEdRegistration.defaultEmailTypeModified = true;
                conEdRegistration.defaultConEdStudentRoleModified = true;
                {/* conEdRegistration.expirationIncrementModified = true;
                conEdRegistration.expirationMaxDurationModified = true;
                if (conEdRegistration.enableTransactionRollback) {
                    conEdRegistration.expirationMaxDurationInvalid = !this.validateInt(conEdRegistration.expirationMaxDuration);
                    conEdRegistration.expirationIncrementInvalid = !this.validateInt(conEdRegistration.expirationIncrement);

                }*/}
                if (conEdRegistration.showCoursePicture) {
                    conEdRegistration.fileExtensionModified = true;
                    conEdRegistration.locationModified = true;

                }
                if (conEdRegistration.enableOnlinePayment || conEdRegistration.enableStudentAgreement) {
                    if (conEdRegistration.enableOnlinePayment) {
                        conEdRegistration.cashReceiptOfficeModified = true;
                        conEdRegistration.cashReceiptCodeModified = true;
                    }
                    // if (conEdRegistration.enableStudentAgreement) {
                    //    conEdRegistration.agreementIdModified = true;
                    // }
                }
                this.setState({
                    conEdRegistration: conEdRegistration
                });
                if ((!conEdRegistration.enableOnlinePayment
                    || (conEdRegistration.cashReceiptCode && conEdRegistration.cashReceiptOffice))
                    && (!conEdRegistration.showCoursePicture
                        || (conEdRegistration.location && conEdRegistration.fileExtension))
                    && !conEdRegistration.dropTimeLimitInvalid
                    && !conEdRegistration.registrationStartPeriodInvalid
                    && !conEdRegistration.registrationEndPeriodInvalid
                    // && !conEdRegistration.expirationIncrementInvalid
                    // && !conEdRegistration.expirationMaxDurationInvalid
                    && conEdRegistration.defaultEmailType > 0) {
                    // && (!conEdRegistration.enableStudentAgreement || conEdRegistration.agreementId))
                    LayoutActions.setLoading(true);
                    Requests.postSaveSettings(conEdRegistration, this.resolvePostSaveSettings, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private validateInt(value: string): boolean {
        let isValid: boolean = false;
        let numberValue: number;
        if (value.toString().match(/^\d+$/g)) {
            isValid = true;
        }
        if (isValid) {
            numberValue = Number(value);
            isValid = !(isNaN(numberValue)) && (numberValue >= 0 && numberValue <= 999);
        }
        return isValid;
    }

    private getAssessmentType(resources: IConEdRegistrationResources): IDropDownOption[] {
        const assessmentTypeOptions: IDropDownOption[] = [];
        assessmentTypeOptions.push({
            description: resources.lblAllTerm,
            value: 'ALLTERM'
        });
        assessmentTypeOptions.push({
            description: resources.lblTermOnly,
            value: 'TERMONLY'
        });
        assessmentTypeOptions.push({
            description: resources.lblSession,
            value: 'SESSION'
        });
        return assessmentTypeOptions;
    }

    private getStatementList(resources: IConEdRegistrationResources): IDropDownOption[] {
        const statementOptions: IDropDownOption[] = [];
        statementOptions.push({
            description: resources.lblAllTermCum,
            value: 'ALLTERMCUM'
        });
        // statementOptions.push({
        //    description: resources.lblAllTerm2,
        //    value: 'ALLTER'
        // });
        statementOptions.push({
            description: resources.lblTermCum,
            value: 'TERMCUM'
        });
        statementOptions.push({
            description: resources.lblTerm,
            value: 'TERM'
        });
        statementOptions.push({
            description: resources.lblAllSess,
            value: 'ALLSESS'
        });
        statementOptions.push({
            description: resources.lblAcademicYear,
            value: 'ACAYR'
        });
        statementOptions.push({
            description: resources.lblFiscaYear,
            value: 'FISCYR'
        });
        return statementOptions;
    }

    private getFileExtensionList(): IDropDownOption[] {
        const fileExtensionOptions: IDropDownOption[] = [];
        fileExtensionOptions.push({
            description: 'bmp',
            value: 'bmp'
        });
        fileExtensionOptions.push({
            description: 'jpeg',
            value: 'jpeg'
        });
        fileExtensionOptions.push({
            description: 'jpg',
            value: 'jpg'
        });
        fileExtensionOptions.push({
            description: 'png',
            value: 'png'
        });

        return fileExtensionOptions;
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
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);

            if (result?.status) {
                const resources: IConEdRegistrationResources = result.data;
                this.setState({
                    resources: resources
                }, () => {
                    Requests.getSettings(this.resolveGetSettings, this.logError);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetSettings = (json: string): void => {
        try {
            const {
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name);

            if (result?.status) {
                const conEdRegistration: IConEdRegistration = result.data.settings;
                let assessmentTypeOptions: IDropDownOption[] | undefined;
                let statementOptions: IDropDownOption[] | undefined;
                let fileExtensionOptions: IDropDownOption[] | undefined;
                if (conEdRegistration) {
                    conEdRegistration.enableOnlinePaymentIsValid = true;

                    if (resources) {
                        assessmentTypeOptions = this.getAssessmentType(resources);
                        statementOptions = this.getStatementList(resources);
                        fileExtensionOptions = this.getFileExtensionList();
                        if (!conEdRegistration.fileExtension) {
                            conEdRegistration.fileExtension = '';
                        }
                        if (!conEdRegistration.assessmentType) {
                            conEdRegistration.assessmentType = String(assessmentTypeOptions[0].value);
                        }
                        if (!conEdRegistration.statementType) {
                            conEdRegistration.statementType = String(statementOptions[0].value);
                        }
                        this.setState({
                            assessmentTypeOptions: assessmentTypeOptions,
                            conEdRegistration: conEdRegistration,
                            fileExtensionOptions: fileExtensionOptions,
                            statementOptions: statementOptions
                        });
                    }
                }
                this.setState({
                    agreements: result.data.agreements,
                    assessmentTypeOptions: assessmentTypeOptions,
                    cashReceiptCodes: result.data.cashReceiptCodes,
                    cashReceiptOffices: result.data.cashReceiptOffices,
                    conEdRegistration: conEdRegistration,
                    emailTypes: result.data.emailTypes,
                    fileExtensionOptions: fileExtensionOptions,
                    pictureDirections: result.data.pictureDirections,
                    statementOptions: statementOptions
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name);

            if (result?.status) {
                if (result.data) {
                    if (resources) {
                        LayoutActions.setAlert({
                            message: lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }
                    LayoutActions.setLoading(false);
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveSettings.name, e));
        }
    };

    private resolvePostValidateRegistrationPayment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostValidateRegistrationPayment.name);

            if (result?.status) {
                const {
                    conEdRegistration
                } = this.state;

                if (conEdRegistration) {
                    conEdRegistration.enableOnlinePaymentIsValid = result.data;
                    if (conEdRegistration.enableOnlinePaymentIsValid) {
                        conEdRegistration.enableOnlinePayment = true;
                    }
                    this.setState({
                        conEdRegistration: conEdRegistration
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidateRegistrationPayment.name, e));
        }
    };
    // #endregion Resolvers

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
            // agreements,
            assessmentTypeOptions,
            cashReceiptCodes,
            cashReceiptOffices,
            componentError,
            conEdRegistration,
            emailTypes,
            fileExtensionOptions,
            pictureDirections,
            resources,
            statementOptions
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && conEdRegistration) {
            const dateOptions: IDropDownOption[] = [
                { value: ConEdOptionDate.BeforeStartDate, description: resources.lblRegistrationBeforeStartDate },
                { value: ConEdOptionDate.AfterStartDate, description: resources.lblRegistrationAfterStartDate }
            ];

            const emptyOption: IDropDownOption = {
                description: lblDropDownEmptyText,
                value: ''
            };
            // #region StartDate
            let errorStartDate: boolean = false;
            let errorTextStartDate: string | undefined;
            if (conEdRegistration.registrationStartPeriodModified) {
                errorStartDate = (conEdRegistration.registrationStartPeriodModified
                    && ((conEdRegistration.registrationStartPeriod === undefined
                        || conEdRegistration.registrationStartPeriod === null
                        || conEdRegistration.registrationStartPeriod === '')
                        || conEdRegistration.registrationStartPeriodInvalid)
                );
                errorTextStartDate = (
                    conEdRegistration.registrationStartPeriod === undefined
                    || conEdRegistration.registrationStartPeriod === null
                    || conEdRegistration.registrationStartPeriod === '') ?
                    resources.lblRequireStartDate : (conEdRegistration.registrationStartPeriodInvalid ?
                        resources.lblRegistrationStartInvalidValue : undefined);
            }
            const valueStartDate: string = (
                (conEdRegistration.registrationStartPeriod !== undefined
                    && conEdRegistration.registrationStartPeriod !== null
                    && conEdRegistration.registrationStartPeriod !== '') ?
                    conEdRegistration.registrationStartPeriod.toString() : ''
            );
            // #endregion StartDate

            // #region EndDate
            let errorEndDate: boolean = false;
            let errorTextEndDate: string | undefined;
            if (conEdRegistration.registrationEndPeriodModified) {
                errorEndDate = (conEdRegistration.registrationEndPeriodModified
                    && ((conEdRegistration.registrationEndPeriod === undefined
                        || conEdRegistration.registrationEndPeriod === null
                        || conEdRegistration.registrationEndPeriod === '')
                        || conEdRegistration.registrationEndPeriodInvalid)
                );
                errorTextEndDate = (
                    conEdRegistration.registrationEndPeriod === undefined
                    || conEdRegistration.registrationEndPeriod === null
                    || conEdRegistration.registrationEndPeriod === '') ?
                    resources.lblRequireEndDate : (conEdRegistration.registrationEndPeriodInvalid ?
                        resources.lblRegistrationEndInvalidValue : undefined);
            }
            const valueEndDate: string = (
                (conEdRegistration.registrationEndPeriod !== undefined
                    && conEdRegistration.registrationEndPeriod !== null
                    && conEdRegistration.registrationEndPeriod !== '') ?
                    conEdRegistration.registrationEndPeriod.toString() : ''
            );
            // #endregion EndDate

            // #region DropTimeLimit
            let errorDropTimeLimit: boolean = false;
            let errorTextDropTimeLimit: string | undefined;
            if (conEdRegistration.dropTimeLimitModified) {
                errorDropTimeLimit =
                    (conEdRegistration.dropTimeLimitModified
                        && ((conEdRegistration.dropTimeLimit === undefined
                            || conEdRegistration.dropTimeLimit === null
                            || conEdRegistration.dropTimeLimit === '')
                            || conEdRegistration.dropTimeLimitInvalid)
                    );
                errorTextDropTimeLimit = (
                    conEdRegistration.dropTimeLimit === undefined
                    || conEdRegistration.dropTimeLimit === null
                    || conEdRegistration.dropTimeLimit === '') ?
                    resources.lblRequireDropTimeLimit : (conEdRegistration.dropTimeLimitInvalid ?
                        resources.lblDropTimeLimitInvalidValue : undefined);
            }
            const valueDropTimeLimit: string = (
                (conEdRegistration.dropTimeLimit !== undefined
                    && conEdRegistration.dropTimeLimit !== null
                    && conEdRegistration.dropTimeLimit !== '') ?
                    conEdRegistration.dropTimeLimit.toString() : ''
            );
            // #endregion DropTimeLimit

            // #region ExpirationIncrement
            {/* }
            let errorExpirationIncrement: boolean = false;
            let errorTextExpirationIncrement: string | undefined;
            if (conEdRegistration.expirationIncrementModified) {
                errorExpirationIncrement =
                    (conEdRegistration.expirationIncrementModified
                        && ((conEdRegistration.expirationIncrement === undefined
                            || conEdRegistration.expirationIncrement === null
                            || conEdRegistration.expirationIncrement === '')
                            || conEdRegistration.expirationIncrementInvalid)
                    );
                errorTextExpirationIncrement = (
                    conEdRegistration.expirationIncrement === undefined
                    || conEdRegistration.expirationIncrement === null
                    || conEdRegistration.expirationIncrement === '') ?
                    resources.lblRequireExpirationIncrement : (conEdRegistration.expirationIncrementInvalid ?
                        resources.lblExpirationIncrementInvalidValue : undefined);
            }
            const valueExpirationIncrement: string = (
                (conEdRegistration.expirationIncrement !== undefined
                    && conEdRegistration.expirationIncrement !== null
                    && conEdRegistration.expirationIncrement !== '') ?
                    conEdRegistration.expirationIncrement.toString() : ''
            );*/}
            // #endregion ExpirationIncrement

            // #region ExpirationMaxDuration
            {/* }
            let errorExpirationMaxDuration: boolean = false;
            let errorTextExpirationMaxDuration: string | undefined;
            if (conEdRegistration.expirationMaxDurationModified) {
                errorExpirationMaxDuration =
                    (conEdRegistration.expirationMaxDurationModified
                        && ((conEdRegistration.expirationMaxDuration === undefined
                    || conEdRegistration.expirationMaxDuration === null
                    || conEdRegistration.expirationIncrement === '')
                    || conEdRegistration.expirationMaxDurationInvalid
                    || conEdRegistration.expirationMaxDurationLessThan)
                    );
                errorTextExpirationMaxDuration = (
                    conEdRegistration.expirationMaxDuration === undefined
                    || conEdRegistration.expirationMaxDuration === null
                    || conEdRegistration.expirationMaxDuration === '') ?
                    resources.lblRequireExpirationMaxDuration : (conEdRegistration.expirationMaxDurationInvalid ?
                        resources.lblExpirationMaxDurationInvalidValue : conEdRegistration.expirationMaxDurationLessThan ?
                            resources.lblExpirationMaxDurationLessThan : undefined);
            }
            const valueExpirationMaxDuration: string = (
                (conEdRegistration.expirationMaxDuration !== undefined
                    && conEdRegistration.expirationMaxDuration !== null
                    && conEdRegistration.expirationMaxDuration !== '') ?
                    conEdRegistration.expirationMaxDuration.toString() : ''
            );*/}
            // #endregion ExpirationIncrement
            contentPage = (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Grid container spacing={3} className={classes.spaceBlocks}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblRegistrationTime}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} alignItems="center" className={classes.spaceBlocks}>
                                <Grid item xs={12}>
                                    <Text size="h4">
                                        {resources.lblRegistrationStart}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} alignItems="center" className={classes.indentBlock}>
                                <Grid item xs={12}>
                                    <Text size="h5">
                                        {resources.lblRegistrationStartDays}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} alignItems="center" className={classes.indentBlock}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        error={errorStartDate}
                                        helperText={errorTextStartDate}
                                        id="txtRegistrationStart"
                                        label={resources.lblRegistrationNumberDays}
                                        maxCharacters={3}
                                        required
                                        type="text"
                                        value={valueStartDate}
                                        onChange={this.onChangeTextField}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} alignItems="center" className={classes.spaceBlocks}>
                                <Grid item xs={12}>
                                    <Text size="h4">
                                        {resources.lblRegistrationEnd}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} alignItems="center" className={classes.indentBlock}>
                                <Grid item xs={12}>
                                    <Text size="h5">
                                        {resources.lblRegistrationEndDays}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} alignItems="center" className={classes.indentBlock}>
                                <Grid item xs={12} md={3}>
                                    <Dropdown
                                        id="ddlDateOptions"
                                        label={resources.lblRegistrationEnds}
                                        options={dateOptions}
                                        value={conEdRegistration.registrationEndPeriodOption}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} alignItems="center" className={classes.indentBlock}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        error={errorEndDate}
                                        helperText={errorTextEndDate}
                                        id="txtRegistrationEnd"
                                        label={resources.lblRegistrationNumberDays}
                                        maxCharacters={3}
                                        required
                                        type="text"
                                        value={valueEndDate}
                                        onChange={this.onChangeTextField}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.spaceBlocks}>
                                <Grid xs={12}>
                                    <Text size="h3">
                                        {resources.lblAccountConfiguration}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container className={classes.indentBlock}>
                                <Grid item xs={12} sm={6}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        error={conEdRegistration.defaultEmailTypeModified
                                            && !conEdRegistration.defaultEmailType}
                                        helperText={conEdRegistration.defaultEmailTypeModified
                                            && !conEdRegistration.defaultEmailType ?
                                            resources.lblEmailTypeRequired : undefined}
                                        id="ddlEmailType"
                                        label={resources.lblEmailType}
                                        options={emailTypes}
                                        required
                                        value={conEdRegistration.defaultEmailType ?
                                            conEdRegistration.defaultEmailType : ''}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.spaceBlocks}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblOptions}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.indentBlock}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.includeUncategorizedSources}
                                        id="chkShowSource"
                                        label={resources.lblShowSources}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.allowChangeOfCreditType}
                                        id="chkAllowChangeOfCreditType"
                                        label={resources.lblAllowChangeOfCreditType}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.enableWaitList}
                                        id="chkEnableWaitlist"
                                        label={resources.lblEnableWaitList}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.enableRegisterForPendingCourses}
                                        id="chkEnableRegisterForPendingCourses"
                                        label={resources.lblEnableRegisterForPendingCourses}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.allowDrops}
                                        id="chkAllowDrop"
                                        label={resources.lblAllowDrop}
                                        onChange={this.onCheckboxChange}
                                    />
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12}>
                                            <Text size="h5">
                                                {resources.lblDropTimeLimitDays}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12} md={6}>
                                            <Dropdown
                                                disabled={!conEdRegistration.allowDrops}
                                                id="ddlDropDateOptions"
                                                label={resources.lblDropTimeLimitEnds}
                                                onChange={this.onDropdownChange}
                                                options={dateOptions}
                                                value={conEdRegistration.dropTimeLimitOption}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                disabled={!conEdRegistration.allowDrops}
                                                error={errorDropTimeLimit}
                                                helperText={errorTextDropTimeLimit}
                                                id="txtDropTimeLimit"
                                                label={resources.lblDropTimeLimit}
                                                maxCharacters={3}
                                                onChange={this.onChangeTextField}
                                                required
                                                type="text"
                                                value={valueDropTimeLimit}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.spaceBlocks}>
                                <Grid xs={12}>
                                    <Text size="h3">
                                        {resources.lblPicture}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container className={classes.indentBlock}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.showCoursePicture}
                                        id="chkShowCoursePicture"
                                        label={resources.lblShowCoursePicture}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container className={classes.indentBlock}>
                                <Grid xs={12} sm={6}>
                                    <Dropdown
                                        disabled={!conEdRegistration.showCoursePicture}
                                        emptyOption={emptyOption}
                                        error={conEdRegistration.fileExtensionModified
                                            && !conEdRegistration.fileExtension}
                                        helperText={conEdRegistration.fileExtensionModified
                                            && !conEdRegistration.fileExtension ?
                                            resources.lblFileExtensionRequired : undefined}
                                        id="ddlFileExtension"
                                        label={resources.lblFileExtension}
                                        onChange={this.onDropdownChange}
                                        options={fileExtensionOptions}
                                        value={conEdRegistration.fileExtension ?
                                            conEdRegistration.fileExtension : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Dropdown
                                        disabled={!conEdRegistration.showCoursePicture}
                                        emptyOption={emptyOption}
                                        error={conEdRegistration.locationModified
                                            && !conEdRegistration.location}
                                        helperText={conEdRegistration.locationModified
                                            && !conEdRegistration.location ?
                                            resources.lblLocationRequired : undefined}
                                        id="ddlLocation"
                                        label={resources.lblLocation}
                                        options={pictureDirections}
                                        onChange={this.onDropdownChange}
                                        value={conEdRegistration.location ?
                                            conEdRegistration.location : ''}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.spaceBlocks}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblRegistrationValidations}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.indentBlock}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.validateTimeConflicts}
                                        id="chkValidateTimeConflicts"
                                        label={resources.lblTimeConflicts}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.validateCorequisites}
                                        id="chkValidateCorequisites"
                                        label={resources.lblCorequisites}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.validatePrerequisites}
                                        id="chkValidatePrerequisites"
                                        label={resources.lblPrerequisites}
                                        onChange={this.onCheckboxChange}
                                    />
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12} md={6}>
                                            <Checkbox
                                                checked={conEdRegistration.enableInstructorPermissionRequest}
                                                disabled={!conEdRegistration.validatePrerequisites}
                                                id="chkEnableInstructorPermissionRequest"
                                                label={resources.lblEnableInstructorPermissionRequest}
                                                onChange={this.onCheckboxChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.validateClassAvailability}
                                        id="chkValidateClassAvailability"
                                        label={resources.lblClassAvailability}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.validateCreditLimit}
                                        id="chkValidateCreditLimit"
                                        label={resources.lblCreditLimit}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={conEdRegistration.validateCrosstally}
                                        id="chkValidateCrosstally"
                                        label={resources.lblCrosstally}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.spaceBlocks}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblFinancial}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.indentBlock}>
                                <Grid item xs={12} md={6}>
                                    <Dropdown
                                        id="ddlAssessmentType"
                                        label={resources.lblAssessmentType}
                                        options={assessmentTypeOptions}
                                        value={conEdRegistration.assessmentType}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Dropdown
                                        id="ddlStatementType"
                                        label={resources.lblStatementType}
                                        options={statementOptions}
                                        value={conEdRegistration.statementType}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.spaceBlocks}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblOnlinePayment}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.indentBlock}>
                                <Grid item xs={12}>
                                    <Checkbox
                                        checked={conEdRegistration.enableOnlinePayment}
                                        error={!conEdRegistration.enableOnlinePaymentIsValid}
                                        helperText={!conEdRegistration.enableOnlinePaymentIsValid ?
                                            resources.lblEnableOnlinePaymentInvalid : undefined}
                                        id="chkEnableOnlinePayment"
                                        label={resources.lblEnableOnlinePayment}
                                        onChange={this.onCheckboxChange}
                                    />
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12} md={6}>
                                            <Checkbox
                                                checked={conEdRegistration.requireOnlinePayment}
                                                disabled={!conEdRegistration.enableOnlinePayment}
                                                id="chkRequireOnlinePayment"
                                                label={resources.lblRequireOnlinePayment}
                                                onChange={this.onCheckboxChange}
                                            />
                                            <br />
                                            <Dropdown
                                                disabled={!conEdRegistration.enableOnlinePayment}
                                                emptyOption={emptyOption}
                                                error={conEdRegistration.cashReceiptCodeModified
                                                    && !conEdRegistration.cashReceiptCode}
                                                helperText={conEdRegistration.cashReceiptCodeModified
                                                    && !conEdRegistration.cashReceiptCode ?
                                                    resources.lblCashReceiptCodeRequired : undefined}
                                                id="ddlCashReceiptCode"
                                                label={resources.lblCashReceiptCode}
                                                options={cashReceiptCodes}
                                                value={conEdRegistration.cashReceiptCode ?
                                                    conEdRegistration.cashReceiptCode : ''}
                                                onChange={this.onDropdownChange}
                                            />
                                            <br />
                                            <Dropdown
                                                disabled={!conEdRegistration.enableOnlinePayment}
                                                emptyOption={emptyOption}
                                                error={conEdRegistration.cashReceiptOfficeModified
                                                    && !conEdRegistration.cashReceiptOffice}
                                                helperText={conEdRegistration.cashReceiptOfficeModified
                                                    && !conEdRegistration.cashReceiptOffice ?
                                                    resources.lblCashReceiptOfficeRequired : undefined}
                                                id="ddlCashReceiptOffice"
                                                label={resources.lblCashReceiptOffice}
                                                options={cashReceiptOffices}
                                                value={conEdRegistration.cashReceiptOffice ?
                                                    conEdRegistration.cashReceiptOffice : ''}
                                                onChange={this.onDropdownChange}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12} md={6}>
                                            <Checkbox
                                                checked={conEdRegistration.useTransactionChargesOnly}
                                                disabled={!conEdRegistration.enableOnlinePayment}
                                                id="chkUseTransactionChargesOnly"
                                                label={resources.lblUseTransactionChargesOnly}
                                                onChange={this.onCheckboxChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Grid container>
                        <Grid item xs>
                            <Button
                                id="btnSaveGlobalSettings"
                                onClick={this.onSaveSettings}
                            >
                                {resources.btnSave}
                            </Button>
                        </Grid>
                    </Grid>
                </>
            );
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
export default withStyles(styles)(ConEdRegistration);