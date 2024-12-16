/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: TranscriptRequest.tsx
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
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ITranscriptRequest } from '../../../Types/InstitutionSettings/ITranscripRequest';
import { ITranscriptRequestResources } from '../../../Types/Resources/Administration/ITranscriptRequestResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/TranscriptRequest';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface ITranscriptRequestProps {
    lblDropDownEmptyText: string;
    lblSuccessSave: string;
}

interface ITranscriptRequestState {
    componentError: boolean;
    resources?: ITranscriptRequestResources;
    cashReceiptCodes?: IDropDownOption[];
    cashReceiptOffices?: IDropDownOption[];
    chargeCreditCodes?: IDropDownOption[];
    transcriptRequestOptions: ITranscriptRequest;
}

const styles = createStyles({
    indentBlock: {
        paddingLeft: `${Tokens.spacing60}!important`
    },
    spaceBlocks: {
        paddingTop: Tokens.spacing40
    }
});

type PropsWithStyles = ITranscriptRequestProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class TranscriptRequest extends React.Component<PropsWithStyles, ITranscriptRequestState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ITranscriptRequestState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'TranscriptRequest';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ITranscriptRequestState {
        let resources: ITranscriptRequestResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            transcriptRequestOptions: {
                cashReceiptCode: 0,
                cashReceiptCodeModified: false,
                cashReceiptOffice: 0,
                cashReceiptOfficeModified: false,
                chargeCreditCode: 0,
                chargeCreditCodeModified: false,
                disclosureStatement: '',
                enableOnlinePayment: false,
                enableOnlinePaymentIsValid: true,
                enableProcessingFee: false,
                feeAmount: '',
                feeAmountModified: false,
                invalidAmount: false,
                requireConsent: false,
                requireOnlinePayment: false
            },

            resources: resources
        };
    }

    // #region Functions
    private validateAmount(value: string): boolean {
        let isValid: boolean = false;
        let numberTest: number;
        if (value.match(/^(\d+\.?\d{0,2}|\.\d{1,2})$/g)) {
            isValid = true;
        }
        if (isValid) {
            numberTest = Number(value);
            isValid = !(isNaN(numberTest)) && numberTest > 0;
        }
        return isValid;
    }
    // #endregion Functions

    // #region Functions
    private onCheckboxChange = (event: any): void => {
        try {
            const {
                transcriptRequestOptions
            } = this.state;

            const isChecked: boolean = event.target.checked;

            if (transcriptRequestOptions) {
                switch (event.target.id) {
                    case 'chkEnableOnlinePayment':
                        if (isChecked) {
                            Requests.validatePayment(this.resolvePostValidatePayment, this.logError);
                        }
                        else {
                            transcriptRequestOptions.enableOnlinePayment = isChecked;
                            transcriptRequestOptions.enableOnlinePaymentIsValid = true;
                            transcriptRequestOptions.cashReceiptCodeModified = false;
                            transcriptRequestOptions.cashReceiptOfficeModified = false;
                        }
                        break;
                    case 'chkRequireConsent':
                        transcriptRequestOptions.requireConsent = isChecked;
                        break;
                    case 'chkRequireOnlinePayment':
                        transcriptRequestOptions.requireOnlinePayment = isChecked;
                        break;
                    case 'chkEnableProcessingFee':
                        transcriptRequestOptions.enableProcessingFee = isChecked;
                        if (isChecked === false) {
                            transcriptRequestOptions.feeAmountModified = false;
                            transcriptRequestOptions.chargeCreditCodeModified = false;
                            transcriptRequestOptions.cashReceiptOfficeModified = false;
                            transcriptRequestOptions.feeAmount = '';
                            transcriptRequestOptions.chargeCreditCode = 0;
                            transcriptRequestOptions.cashReceiptOffice = 0;
                            transcriptRequestOptions.enableOnlinePayment = false;

                        }
                        break;
                }
                this.setState({
                    transcriptRequestOptions
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
                transcriptRequestOptions
            } = this.state;

            if (transcriptRequestOptions) {
                switch (id) {
                    case 'ddlCashReceiptCode':
                        transcriptRequestOptions.cashReceiptCodeModified = true;
                        transcriptRequestOptions.cashReceiptCode = Number(option.value);
                        break;
                    case 'ddlCashReceiptOffice':
                        transcriptRequestOptions.cashReceiptOfficeModified = true;
                        transcriptRequestOptions.cashReceiptOffice = Number(option.value);
                        break;
                    case 'ddlChargeCreditCode':
                        transcriptRequestOptions.chargeCreditCodeModified = true;
                        transcriptRequestOptions.chargeCreditCode = Number(option.value);
                        break;
                }

                this.setState({
                    transcriptRequestOptions
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
                transcriptRequestOptions
            } = this.state;

            if (transcriptRequestOptions) {
                if (transcriptRequestOptions.enableOnlinePayment) {
                    transcriptRequestOptions.cashReceiptCodeModified = true;
                    transcriptRequestOptions.cashReceiptOfficeModified = true;
                }
                if (transcriptRequestOptions.enableProcessingFee) {
                    transcriptRequestOptions.chargeCreditCodeModified = true;
                    transcriptRequestOptions.cashReceiptOfficeModified = true;
                    transcriptRequestOptions.feeAmountModified = true;
                }
                if ((!transcriptRequestOptions.enableOnlinePayment || (transcriptRequestOptions.cashReceiptCode && transcriptRequestOptions.cashReceiptOffice))
                    && (!transcriptRequestOptions.enableProcessingFee
                        || (transcriptRequestOptions.chargeCreditCode && transcriptRequestOptions.feeAmount && transcriptRequestOptions.cashReceiptOffice))) {
                    LayoutActions.showPageLoader();

                    if (transcriptRequestOptions.feeAmount === '') {
                        transcriptRequestOptions.feeAmount = undefined;
                    }
                    else if (this.validateAmount(String(transcriptRequestOptions.feeAmount))) {
                        transcriptRequestOptions.feeAmount = Number(transcriptRequestOptions.feeAmount);
                    }
                    Requests.saveTranscriptSettings(transcriptRequestOptions, this.resolvePostSaveSettings, this.logError);
                }
                this.setState({
                    transcriptRequestOptions
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                transcriptRequestOptions
            } = this.state;
            const id: string = event.target.id;
            if (transcriptRequestOptions) {
                switch (id) {
                    case 'txtDisclosureStatement':
                        transcriptRequestOptions.disclosureStatement = event.target.value;
                        break;
                    case 'txtFeeAmount':
                        transcriptRequestOptions.feeAmount = event.target.value;
                        transcriptRequestOptions.invalidAmount = !this.validateAmount(transcriptRequestOptions.feeAmount);
                        transcriptRequestOptions.feeAmountModified = true;
                        break;
                }
            }
            this.setState({
                transcriptRequestOptions
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
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
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);

            if (result?.status) {
                this.setState({
                    resources: result.data
                });
                Requests.getTranscriptSettings(this.resolveGetTranscriptSettings, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolvePostValidatePayment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostValidatePayment.name);

            if (result?.status) {
                const {
                    transcriptRequestOptions
                } = this.state;

                if (transcriptRequestOptions) {
                    transcriptRequestOptions.enableOnlinePaymentIsValid = result.data;
                    if (transcriptRequestOptions.enableOnlinePaymentIsValid) {
                        transcriptRequestOptions.enableOnlinePayment = true;
                        transcriptRequestOptions.enableProcessingFee = true;
                    }
                    this.setState({
                        transcriptRequestOptions
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidatePayment.name, e));
        }
    };

    private resolveGetTranscriptSettings = (json: string): void => {
        try {
            const {
                transcriptRequestOptions
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTranscriptSettings.name);

            if (result?.status) {
                const newTranscriptRequestOptions: ITranscriptRequest = result.data.settings;
                if (newTranscriptRequestOptions) {
                    transcriptRequestOptions.cashReceiptCode = newTranscriptRequestOptions.cashReceiptCode;
                    transcriptRequestOptions.cashReceiptOffice = newTranscriptRequestOptions.cashReceiptOffice;
                    transcriptRequestOptions.chargeCreditCode = newTranscriptRequestOptions.chargeCreditCode;
                    transcriptRequestOptions.disclosureStatement = newTranscriptRequestOptions.disclosureStatement ?
                        newTranscriptRequestOptions.disclosureStatement : '';
                    transcriptRequestOptions.enableOnlinePayment = newTranscriptRequestOptions.enableOnlinePayment;
                    transcriptRequestOptions.feeAmount = newTranscriptRequestOptions.feeAmount ?
                        newTranscriptRequestOptions.feeAmount : '';
                    transcriptRequestOptions.requireConsent = newTranscriptRequestOptions.requireConsent;
                    transcriptRequestOptions.requireOnlinePayment = newTranscriptRequestOptions.requireOnlinePayment;

                    // Validation of UI Processing fee checkbox
                    transcriptRequestOptions.enableProcessingFee = transcriptRequestOptions.feeAmount !== ''
                        || transcriptRequestOptions.chargeCreditCode > 0;
                }
                this.setState({
                    cashReceiptCodes: result.data.cashReceiptCodes,
                    cashReceiptOffices: result.data.cashReceiptOffices,
                    chargeCreditCodes: result.data.chargeCreditCodes,
                    transcriptRequestOptions
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTranscriptSettings.name, e));
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
            cashReceiptCodes,
            cashReceiptOffices,
            chargeCreditCodes,
            componentError,
            transcriptRequestOptions,

            resources
        } = this.state;

        const {
            classes,
            lblDropDownEmptyText
        } = this.props;

        const emptyOption: IDropDownOption = {
            description: lblDropDownEmptyText,
            value: ''
        };

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            let errorAmount: boolean = false;
            let errorTextAmount: string | undefined;
            if (transcriptRequestOptions.feeAmountModified) {
                errorAmount = !Boolean(transcriptRequestOptions.feeAmount)
                    || transcriptRequestOptions.invalidAmount;

                errorTextAmount = !Boolean(transcriptRequestOptions.feeAmount) ?
                    resources.lblPaymentAmountRequired
                    : (transcriptRequestOptions.invalidAmount ?
                        resources.lblPaymentAmountInvalid
                        : undefined);
            }
            contentPage = (
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Text size="h3">
                                    {resources.lblTranscriptOptions}
                                </Text>
                                <Divider noMarginBottom />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Checkbox
                                    checked={transcriptRequestOptions.requireConsent}
                                    id="chkRequireConsent"
                                    label={resources.lblRequireConsent}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    id="txtDisclosureStatement"
                                    label={resources.lblDisclosureStatement}
                                    value={transcriptRequestOptions.disclosureStatement}
                                    multiline
                                    onChange={this.onChangeTextField}
                                />
                                <Text
                                    size="small"
                                    color="textSecondary"
                                >
                                    {resources.lblHtmlAccepts}
                                </Text>
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
                                    checked={transcriptRequestOptions.enableProcessingFee}
                                    id="chkEnableProcessingFee"
                                    label={resources.lblEnableProcessingFee}
                                    onChange={this.onCheckboxChange}
                                />
                                <Grid
                                    container
                                    className={classes.indentBlock}
                                    spacing={2}
                                    direction="column"
                                >
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            id="txtFeeAmount"
                                            disabled={!transcriptRequestOptions.enableProcessingFee}
                                            label={resources.lblFeeAmount}
                                            value={transcriptRequestOptions.feeAmount}
                                            error={errorAmount}
                                            helperText={errorTextAmount}
                                            onChange={this.onChangeTextField}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Dropdown
                                            disabled={!transcriptRequestOptions.enableProcessingFee}
                                            emptyOption={emptyOption}
                                            error={transcriptRequestOptions.chargeCreditCodeModified
                                                && !transcriptRequestOptions.chargeCreditCode}
                                            helperText={transcriptRequestOptions.chargeCreditCodeModified
                                                && !transcriptRequestOptions.chargeCreditCode ?
                                                resources.lblChargeCreditCodeRequired : undefined}
                                            id="ddlChargeCreditCode"
                                            label={resources.lblChargeCreditCode}
                                            options={chargeCreditCodes}
                                            value={transcriptRequestOptions.chargeCreditCode ?
                                                transcriptRequestOptions.chargeCreditCode : ''}
                                            onChange={this.onDropdownChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Dropdown
                                            disabled={!transcriptRequestOptions.enableProcessingFee}
                                            emptyOption={emptyOption}
                                            error={transcriptRequestOptions.cashReceiptOfficeModified
                                                && !transcriptRequestOptions.cashReceiptOffice
                                                && transcriptRequestOptions.enableProcessingFee}
                                            helperText={transcriptRequestOptions.cashReceiptOfficeModified
                                                && !transcriptRequestOptions.cashReceiptOffice
                                                && transcriptRequestOptions.enableProcessingFee ?
                                                resources.lblCashReceiptOfficeRequired : undefined}
                                            id="ddlCashReceiptOffice"
                                            label={resources.lblCashReceiptOffice}
                                            options={cashReceiptOffices}
                                            value={transcriptRequestOptions.cashReceiptOffice ?
                                                transcriptRequestOptions.cashReceiptOffice : ''}
                                            onChange={this.onDropdownChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Checkbox
                                    checked={transcriptRequestOptions.enableOnlinePayment}
                                    error={!transcriptRequestOptions.enableOnlinePaymentIsValid}
                                    helperText={!transcriptRequestOptions.enableOnlinePaymentIsValid ?
                                        resources.lblEnableOnlinePaymentInvalid : undefined}
                                    id="chkEnableOnlinePayment"
                                    label={resources.lblEnableOnlinePayment}
                                    onChange={this.onCheckboxChange}
                                />
                                <Grid
                                    container
                                    className={classes.indentBlock}
                                    spacing={2}
                                    direction="column"
                                >
                                    <Grid item xs={12} md={4}>
                                        <Checkbox
                                            checked={transcriptRequestOptions.requireOnlinePayment}
                                            disabled={!transcriptRequestOptions.enableOnlinePayment}
                                            id="chkRequireOnlinePayment"
                                            label={resources.lblRequireOnlinePayment}
                                            onChange={this.onCheckboxChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Dropdown
                                            disabled={!transcriptRequestOptions.enableOnlinePayment}
                                            emptyOption={emptyOption}
                                            error={transcriptRequestOptions.cashReceiptCodeModified
                                                && !transcriptRequestOptions.cashReceiptCode}
                                            helperText={transcriptRequestOptions.cashReceiptCodeModified
                                                && !transcriptRequestOptions.cashReceiptCode ?
                                                resources.lblCashReceiptCodeRequired : undefined}
                                            id="ddlCashReceiptCode"
                                            label={resources.lblCashReceiptCode}
                                            options={cashReceiptCodes}
                                            value={transcriptRequestOptions.cashReceiptCode ?
                                                transcriptRequestOptions.cashReceiptCode : ''}
                                            onChange={this.onDropdownChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Button
                                    id="btnSaveSettings"
                                    onClick={this.onSaveSettings}
                                >
                                    {resources.btnSave}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid >
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
export default withStyles(styles)(TranscriptRequest);