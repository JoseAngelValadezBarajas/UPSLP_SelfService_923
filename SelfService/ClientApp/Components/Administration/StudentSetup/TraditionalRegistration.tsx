/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: TraditionalRegistration.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ITraditionalRegistration } from '../../../Types/InstitutionSettings/ITraditionalRegistration';
import { ITraditionalRegistrationResources } from '../../../Types/Resources/Administration/ITraditionalRegistrationResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/TraditionalRegistration';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
interface ITraditionalRegistrationProps {
    lblDropDownEmptyText: string;
    lblSuccessSave: string;
}

interface ITraditionalRegistrationState {
    agreements?: IDropDownOption[];
    assessmentTypeOptions?: IDropDownOption[];
    cashReceiptCodes?: IDropDownOption[];
    cashReceiptOffices?: IDropDownOption[];
    componentError: boolean;
    resources?: ITraditionalRegistrationResources;
    statementOptions?: IDropDownOption[];
    traditionalRegistration?: ITraditionalRegistration;
}

const styles = createStyles({
    indentBlock: {
        paddingLeft: `${Tokens.spacing60}!important`
    },
    spaceBlocks: {
        paddingTop: Tokens.spacing40
    }
});

type PropsWithStyles = ITraditionalRegistrationProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class TraditionalRegistration extends React.Component<PropsWithStyles, ITraditionalRegistrationState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ITraditionalRegistrationState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'TraditionalRegistration';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ITraditionalRegistrationState {
        let resources: ITraditionalRegistrationResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            resources: resources
        };
    }

    // #region Events
    private onCheckboxChange = (event: any): void => {
        try {
            const {
                traditionalRegistration
            } = this.state;

            const checked: boolean = event.target.checked;

            if (traditionalRegistration) {
                switch (event.target.id) {
                    case 'chkAllowDrop':
                        traditionalRegistration.allowDrops = checked;
                        break;
                    case 'chkAllowChangeOfCreditType':
                        traditionalRegistration.allowChangeOfCreditType = checked;
                        break;
                    case 'chkEnableAssessment':
                        traditionalRegistration.enableAssessment = checked;
                        break;
                    case 'chkEnableWaitlist':
                        traditionalRegistration.enableWaitList = checked;
                        break;
                    case 'chkEnableRegisterForPendingCourses':
                        traditionalRegistration.enableRegisterForPendingCourses = checked;
                        break;
                    case 'chkEnableStudentAgreement':
                        traditionalRegistration.enableStudentAgreement = checked;
                        if (!checked) {
                            traditionalRegistration.agreementIdModified = false;
                        }
                        break;
                    case 'chkEnableBlockRegistration':
                        traditionalRegistration.enableBlockRegistration = checked;
                        break;
                    case 'chkHoldForAdvisorApproval':
                        traditionalRegistration.holdForAdvisorApproval = checked;
                        break;
                    case 'chkEnableInstructorPermissionRequest':
                        traditionalRegistration.enableInstructorPermissionRequest = checked;
                        if (traditionalRegistration.enableInstructorPermissionRequest) {
                            traditionalRegistration.validatePrerequisites = true;
                        }
                        break;
                    case 'chkEnableOnlinePayment':
                        if (checked) {
                            Requests.postValidateRegistrationPayment(this.resolvePostValidateRegistrationPayment, this.logError);
                        }
                        else {
                            traditionalRegistration.enableOnlinePayment = checked;
                            traditionalRegistration.requireOnlinePayment = false;
                            traditionalRegistration.enableOnlinePaymentIsValid = true;
                            traditionalRegistration.cashReceiptCodeModified = false;
                            traditionalRegistration.cashReceiptOfficeModified = false;
                        }
                        break;
                    case 'chkEnableAssessmentAfterApproval':
                        traditionalRegistration.enableAssessmentAfterApproval = checked;
                        break;
                    case 'chkRequireOnlinePayment':
                        traditionalRegistration.requireOnlinePayment = checked;
                        if (traditionalRegistration.requireOnlinePayment) {
                            traditionalRegistration.enableOnlinePayment = true;
                        }
                        break;
                    case 'chkValidateTimeConflicts':
                        traditionalRegistration.validateTimeConflicts = checked;
                        break;
                    case 'chkValidateCorequisites':
                        traditionalRegistration.validateCorequisites = checked;
                        break;
                    case 'chkValidatePrerequisites':
                        traditionalRegistration.validatePrerequisites = checked;
                        if (!traditionalRegistration.validatePrerequisites) {
                            traditionalRegistration.enableInstructorPermissionRequest = false;
                        }
                        break;
                    case 'chkValidateClassAvailability':
                        traditionalRegistration.validateClassAvailability = checked;
                        break;
                    case 'chkValidateCreditLimit':
                        traditionalRegistration.validateCreditLimit = checked;
                        break;
                    case 'chkValidateCrosstally':
                        traditionalRegistration.validateCrosstally = checked;
                        break;
                    case 'chkValidateTimeConflicts':
                        traditionalRegistration.validateTimeConflicts = checked;
                        break;
                }
                this.setState({
                    traditionalRegistration: traditionalRegistration
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
                traditionalRegistration
            } = this.state;

            if (traditionalRegistration) {
                switch (id) {
                    case 'ddlAgreement':
                        traditionalRegistration.agreementIdModified = true;
                        traditionalRegistration.agreementId = Number(option.value);
                        break;
                    case 'ddlAssessmentType':
                        traditionalRegistration.assessmentType = String(option.value);
                        break;
                    case 'ddlStatementType':
                        traditionalRegistration.statementType = String(option.value);
                        break;
                    case 'ddlCashReceiptCode':
                        traditionalRegistration.cashReceiptCodeModified = true;
                        traditionalRegistration.cashReceiptCode = Number(option.value);
                        break;
                    case 'ddlCashReceiptOffice':
                        traditionalRegistration.cashReceiptOfficeModified = true;
                        traditionalRegistration.cashReceiptOffice = Number(option.value);
                        break;
                }

                this.setState({
                    traditionalRegistration: traditionalRegistration
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
                traditionalRegistration
            } = this.state;

            if (traditionalRegistration) {
                if (traditionalRegistration.enableOnlinePayment || traditionalRegistration.enableStudentAgreement) {
                    if (traditionalRegistration.enableOnlinePayment) {
                        traditionalRegistration.cashReceiptCodeModified = true;
                        traditionalRegistration.cashReceiptOfficeModified = true;
                    }
                    if (traditionalRegistration.enableStudentAgreement) {
                        traditionalRegistration.agreementIdModified = true;
                    }
                    this.setState({
                        traditionalRegistration: traditionalRegistration
                    });
                }
                if ((!traditionalRegistration.enableOnlinePayment
                    || (traditionalRegistration.cashReceiptCode && traditionalRegistration.cashReceiptOffice))
                    && (!traditionalRegistration.enableStudentAgreement || traditionalRegistration.agreementId)) {
                    LayoutActions.setLoading(true);
                    Requests.postSaveSettings(traditionalRegistration, this.resolvePostSaveSettings, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private getAssessmentType(resources: ITraditionalRegistrationResources): IDropDownOption[] {
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

    private getStatementList(resources: ITraditionalRegistrationResources): IDropDownOption[] {
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
                const resources: ITraditionalRegistrationResources = result.data;
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
                const traditionalRegistration: ITraditionalRegistration = result.data.settings;
                let assessmentTypeOptions: IDropDownOption[] | undefined;
                let statementOptions: IDropDownOption[] | undefined;
                if (traditionalRegistration) {
                    traditionalRegistration.enableOnlinePaymentIsValid = true;

                    if (resources) {
                        assessmentTypeOptions = this.getAssessmentType(resources);
                        statementOptions = this.getStatementList(resources);
                        if (!traditionalRegistration.assessmentType) {
                            traditionalRegistration.assessmentType = String(assessmentTypeOptions[0].value);
                        }
                        if (!traditionalRegistration.statementType) {
                            traditionalRegistration.statementType = String(statementOptions[0].value);
                        }
                        this.setState({
                            assessmentTypeOptions: assessmentTypeOptions,
                            statementOptions: statementOptions,
                            traditionalRegistration: traditionalRegistration
                        });
                    }
                }
                this.setState({
                    agreements: result.data.agreements,
                    assessmentTypeOptions: assessmentTypeOptions,
                    cashReceiptCodes: result.data.cashReceiptCodes,
                    cashReceiptOffices: result.data.cashReceiptOffices,
                    statementOptions: statementOptions,
                    traditionalRegistration: traditionalRegistration
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
                    traditionalRegistration
                } = this.state;

                if (traditionalRegistration) {
                    traditionalRegistration.enableOnlinePaymentIsValid = result.data;
                    if (traditionalRegistration.enableOnlinePaymentIsValid) {
                        traditionalRegistration.enableOnlinePayment = true;
                    }
                    this.setState({
                        traditionalRegistration: traditionalRegistration
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
            agreements,
            assessmentTypeOptions,
            componentError,
            cashReceiptCodes,
            cashReceiptOffices,
            resources,
            statementOptions,
            traditionalRegistration
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && traditionalRegistration) {
            const emptyOption: IDropDownOption = {
                description: lblDropDownEmptyText,
                value: ''
            };

            contentPage = (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblOptions}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.allowDrops}
                                        id="chkAllowDrop"
                                        label={resources.lblAllowDrop}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.allowChangeOfCreditType}
                                        id="chkAllowChangeOfCreditType"
                                        label={resources.lblAllowChangeOfCreditType}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.enableWaitList}
                                        id="chkEnableWaitlist"
                                        label={resources.lblEnableWaitList}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.enableRegisterForPendingCourses}
                                        id="chkEnableRegisterForPendingCourses"
                                        label={resources.lblEnableRegisterForPendingCourses}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.holdForAdvisorApproval}
                                        id="chkHoldForAdvisorApproval"
                                        label={resources.lblHoldForAdvisorApproval}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.enableBlockRegistration}
                                        id="chkEnableBlockRegistration"
                                        label={resources.lblEnableBlockRegistration}
                                        onChange={this.onCheckboxChange}
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
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.validateTimeConflicts}
                                        id="chkValidateTimeConflicts"
                                        label={resources.lblTimeConflicts}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.validateCorequisites}
                                        id="chkValidateCorequisites"
                                        label={resources.lblCorequisites}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.validatePrerequisites}
                                        id="chkValidatePrerequisites"
                                        label={resources.lblPrerequisites}
                                        onChange={this.onCheckboxChange}
                                    />
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12} md={6}>
                                            <Checkbox
                                                checked={traditionalRegistration.enableInstructorPermissionRequest}
                                                disabled={!traditionalRegistration.validatePrerequisites}
                                                id="chkEnableInstructorPermissionRequest"
                                                label={resources.lblEnableInstructorPermissionRequest}
                                                onChange={this.onCheckboxChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.validateClassAvailability}
                                        id="chkValidateClassAvailability"
                                        label={resources.lblClassAvailability}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.validateCreditLimit}
                                        id="chkValidateCreditLimit"
                                        label={resources.lblCreditLimit}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.validateCrosstally}
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
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.enableAssessment}
                                        id="chkEnableAssessment"
                                        label={resources.lblAssessStudent}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        checked={traditionalRegistration.enableAssessmentAfterApproval}
                                        id="chkEnableAssessmentAfterApproval"
                                        label={resources.lblEnableAssessmentAfterApproval}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Dropdown
                                        id="ddlAssessmentType"
                                        label={resources.lblAssessmentType}
                                        options={assessmentTypeOptions}
                                        value={traditionalRegistration.assessmentType}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Dropdown
                                        id="ddlStatementType"
                                        label={resources.lblStatementType}
                                        options={statementOptions}
                                        value={traditionalRegistration.statementType}
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
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Checkbox
                                        checked={traditionalRegistration.enableOnlinePayment}
                                        error={!traditionalRegistration.enableOnlinePaymentIsValid}
                                        helperText={!traditionalRegistration.enableOnlinePaymentIsValid ?
                                            resources.lblEnableOnlinePaymentInvalid : undefined}
                                        id="chkEnableOnlinePayment"
                                        label={resources.lblEnableOnlinePayment}
                                        onChange={this.onCheckboxChange}
                                    />
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12} md={6}>
                                            <Checkbox
                                                checked={traditionalRegistration.requireOnlinePayment}
                                                disabled={!traditionalRegistration.enableOnlinePayment}
                                                id="chkRequireOnlinePayment"
                                                label={resources.lblRequireOnlinePayment}
                                                onChange={this.onCheckboxChange}
                                            />
                                            <br />
                                            <br />
                                            <Dropdown
                                                disabled={!traditionalRegistration.enableOnlinePayment}
                                                emptyOption={emptyOption}
                                                error={traditionalRegistration.cashReceiptCodeModified
                                                    && !traditionalRegistration.cashReceiptCode}
                                                helperText={traditionalRegistration.cashReceiptCodeModified
                                                    && !traditionalRegistration.cashReceiptCode ?
                                                    resources.lblCashReceiptCodeRequired : undefined}
                                                id="ddlCashReceiptCode"
                                                label={resources.lblCashReceiptCode}
                                                options={cashReceiptCodes}
                                                value={traditionalRegistration.cashReceiptCode ?
                                                    traditionalRegistration.cashReceiptCode : ''}
                                                onChange={this.onDropdownChange}
                                            />
                                            <br />
                                            <br />
                                            <Dropdown
                                                disabled={!traditionalRegistration.enableOnlinePayment}
                                                emptyOption={emptyOption}
                                                error={traditionalRegistration.cashReceiptOfficeModified
                                                    && !traditionalRegistration.cashReceiptOffice}
                                                helperText={traditionalRegistration.cashReceiptOfficeModified
                                                    && !traditionalRegistration.cashReceiptOffice ?
                                                    resources.lblCashReceiptOfficeRequired : undefined}
                                                id="ddlCashReceiptOffice"
                                                label={resources.lblCashReceiptOffice}
                                                options={cashReceiptOffices}
                                                value={traditionalRegistration.cashReceiptOffice ?
                                                    traditionalRegistration.cashReceiptOffice : ''}
                                                onChange={this.onDropdownChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.spaceBlocks}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblAgreement}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Checkbox
                                        checked={traditionalRegistration.enableStudentAgreement}
                                        id="chkEnableStudentAgreement"
                                        label={resources.lblEnableStudentAgreement}
                                        onChange={this.onCheckboxChange}
                                    />
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12} md={6}>
                                            <Dropdown
                                                disabled={!traditionalRegistration.enableStudentAgreement}
                                                emptyOption={emptyOption}
                                                error={traditionalRegistration.agreementIdModified
                                                    && !traditionalRegistration.agreementId}
                                                helperText={traditionalRegistration.agreementIdModified
                                                    && !traditionalRegistration.agreementId ?
                                                    resources.lblAgreementRequired : undefined}
                                                id="ddlAgreement"
                                                label={resources.lblAgreementName}
                                                options={agreements}
                                                value={traditionalRegistration.agreementId ?
                                                    traditionalRegistration.agreementId : ''}
                                                onChange={this.onDropdownChange}
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
export default withStyles(styles)(TraditionalRegistration);