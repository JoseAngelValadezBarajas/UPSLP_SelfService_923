/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FinancialSettings.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Chip from '@hedtech/powercampus-design-system/react/core/Chip';
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
import { IFinancialSettings } from '../../../Types/InstitutionSettings/IFinancialSettings';
import { IPaymentPeriod } from '../../../Types/Payment/IPaymentPeriod';
import { IFinancialSettingsResources } from '../../../Types/Resources/Administration/IFinancialSettingsResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/FinancialSettings';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IFinancialSettingsProps {
    lblDropDownEmptyText: string;
    lblSuccessSave: string;
}

interface IFinancialSettingsState {
    cashReceiptCodes?: IDropDownOption[];
    cashReceiptOffices?: IDropDownOption[];
    componentError: boolean;
    financialSettings?: IFinancialSettings;
    paymentPeriods?: IDropDownOption[];
    paymentPeriodSelected?: IDropDownOption;
    paymentPeriodsSelected?: IDropDownOption[];
    resources?: IFinancialSettingsResources;
}

const styles = createStyles({
    indentBlock: {
        paddingLeft: `${Tokens.spacing60}!important`
    },
    spaceBlocks: {
        paddingTop: Tokens.spacing40
    }
});

type PropsWithStyles = IFinancialSettingsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class FinancialSettings extends React.Component<PropsWithStyles, IFinancialSettingsState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IFinancialSettingsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'FinancialSettings';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IFinancialSettingsState {
        let resources: IFinancialSettingsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            resources: resources
        };
    }

    // #region Events
    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                financialSettings
            } = this.state;

            const checked: boolean = event.target.checked;

            if (financialSettings) {
                switch (event.target.id) {
                    case 'chkDueDate':
                        financialSettings.displayDueDate = checked;
                        break;
                    case 'chkEnableOnlinePayment':
                        if (checked) {
                            Requests.postValidateBalancePayment(this.resolvePostValidateBalancePayment, this.logError);
                        }
                        else {
                            financialSettings.enableOnlinePayment = checked;
                            financialSettings.enableOnlinePaymentIsValid = true;
                            financialSettings.cashReceiptCodeModified = false;
                            financialSettings.cashReceiptOfficeModified = false;
                            financialSettings.paymentPeriodsModified = false;
                        }
                        break;
                    case 'chkOverallBalance':
                        financialSettings.displayOverallBalance = checked;
                        break;
                    case 'chkUnmetNeed':
                        financialSettings.displayUnmetNeeds = checked;
                        break;
                    case 'chkWashoutTransactions':
                        financialSettings.displayWashoutTransactions = checked;
                        break;
                    case 'chkAnticipatedAid':
                        financialSettings.includeAnticipatedAid = checked;
                        break;
                }
                this.setState({
                    financialSettings: financialSettings,
                    paymentPeriodSelected: undefined
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
                financialSettings,
                paymentPeriodSelected
            } = this.state;

            let paymentPeriodSelectedChanged: IDropDownOption | undefined = paymentPeriodSelected;
            if (financialSettings) {
                switch (id) {
                    case 'ddlCashReceiptCode':
                        financialSettings.cashReceiptCodeModified = true;
                        financialSettings.cashReceiptCode = Number(option.value);
                        break;
                    case 'ddlCashReceiptOffice':
                        financialSettings.cashReceiptOfficeModified = true;
                        financialSettings.cashReceiptOffice = Number(option.value);
                        break;
                    case 'ddlPaymentPeriod':
                        financialSettings.paymentPeriodsModified = true;
                        paymentPeriodSelectedChanged = option;
                        break;
                }

                this.setState({
                    financialSettings: financialSettings,
                    paymentPeriodSelected: paymentPeriodSelectedChanged
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onAddPaymentPeriod = (): void => {
        try {
            const {
                paymentPeriods,
                paymentPeriodSelected,
                paymentPeriodsSelected
            } = this.state;

            if (paymentPeriods && paymentPeriodSelected && paymentPeriodSelected.value !== '') {
                // Add the period selected to the list of selected periods
                const paymentPeriodsSelectedChanged: IDropDownOption[] = paymentPeriodsSelected ? paymentPeriodsSelected : [];
                paymentPeriodsSelectedChanged.push(paymentPeriodSelected);
                // TODO: Order the paymentPeriodsSelectedChanged list

                // Remove the period of the list of periods to be added
                let indexFound: number;
                if ((indexFound = paymentPeriods.findIndex(pps => pps.value === paymentPeriodSelected.value)) > 0) {
                    paymentPeriods.splice(indexFound, 1);
                }

                this.setState({
                    paymentPeriods: paymentPeriods,
                    paymentPeriodSelected: undefined,
                    paymentPeriodsSelected: paymentPeriodsSelectedChanged
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddPaymentPeriod.name, e));
        }
    };

    private onRemovePaymentPeriod = (value: string): void => {
        try {
            const {
                paymentPeriods,
                paymentPeriodsSelected
            } = this.state;

            if (paymentPeriodsSelected) {
                const paymentPeriodsChanged: IDropDownOption[] = paymentPeriods ? paymentPeriods : [];
                let indexFound: number;
                if ((indexFound = paymentPeriodsSelected.findIndex(pps => pps.value === value)) >= 0) {
                    // Remove the period from the list of selected periods
                    const resultSplice: IDropDownOption[] = paymentPeriodsSelected.splice(indexFound, 1);

                    // Add the period to the list of periods to be added
                    if (resultSplice && resultSplice.length > 0) {
                        paymentPeriodsChanged.unshift(resultSplice[0]);
                    }
                    // TODO: Order the paymentPeriodsChanged list
                }

                this.setState({
                    paymentPeriods: paymentPeriodsChanged,
                    paymentPeriodsSelected: paymentPeriodsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRemovePaymentPeriod.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                financialSettings,
                paymentPeriodsSelected
            } = this.state;

            if (financialSettings) {
                if (financialSettings.enableOnlinePayment) {
                    financialSettings.cashReceiptCodeModified = true;
                    financialSettings.cashReceiptOfficeModified = true;
                    financialSettings.paymentPeriodsModified = true;
                    this.setState({
                        financialSettings: financialSettings
                    });
                }
                if (!financialSettings.enableOnlinePayment
                    || (financialSettings.cashReceiptCode
                        && financialSettings.cashReceiptOffice
                        && paymentPeriodsSelected
                        && paymentPeriodsSelected.length > 0)) {
                    const paymentPeriodsToSave: IPaymentPeriod[] = [];
                    if (paymentPeriodsSelected) {
                        let periodId: string[];
                        paymentPeriodsSelected.forEach(paymentPeriod => {
                            periodId = String(paymentPeriod.value).split('/');
                            paymentPeriodsToSave.push({
                                sessionPeriodId: periodId[1] ? Number(periodId[1]) : null,
                                termPeriodId: periodId[0] ? Number(periodId[0]) : null
                            } as IPaymentPeriod);
                        });
                    }
                    Requests.postSaveSettings(financialSettings, paymentPeriodsToSave, this.resolvePostSaveSettings, this.logError);
                    LayoutActions.setLoading(true);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };
    // #endregion Events

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
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name);

            if (result?.status) {
                const financialSettings: IFinancialSettings = result.data.settings;
                if (financialSettings) {
                    financialSettings.enableOnlinePaymentIsValid = true;
                }

                const paymentPeriods: IDropDownOption[] = result.data.paymentPeriods;
                const paymentPeriodsSelected: IDropDownOption[] = result.data.paymentPeriodsSelected;

                this.setState({
                    cashReceiptCodes: result.data.cashReceiptCodes,
                    cashReceiptOffices: result.data.cashReceiptOffices,
                    financialSettings: financialSettings,
                    paymentPeriods: paymentPeriods,
                    paymentPeriodSelected: undefined,
                    paymentPeriodsSelected: paymentPeriodsSelected
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

    private resolvePostValidateBalancePayment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostValidateBalancePayment.name);

            if (result?.status) {
                const {
                    financialSettings
                } = this.state;

                if (financialSettings) {
                    financialSettings.enableOnlinePaymentIsValid = result.data;
                    if (financialSettings.enableOnlinePaymentIsValid) {
                        financialSettings.enableOnlinePayment = true;
                    }
                    this.setState({
                        financialSettings: financialSettings
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidateBalancePayment.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getSettings(this.resolveGetSettings, this.logError);
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
            cashReceiptCodes,
            cashReceiptOffices,
            financialSettings,
            paymentPeriods,
            paymentPeriodSelected,
            paymentPeriodsSelected,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && financialSettings) {
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
                                    <Text size="h4">
                                        {resources.lblFinancialSettingsLegend}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblDisplayOptions}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Checkbox
                                        id="chkDueDate"
                                        checked={financialSettings.displayDueDate}
                                        label={resources.lblDisplayDueDate}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Checkbox
                                        id="chkOverallBalance"
                                        checked={financialSettings.displayOverallBalance}
                                        label={resources.lblDisplayOverallBalance}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Checkbox
                                        id="chkAnticipatedAid"
                                        checked={financialSettings.includeAnticipatedAid}
                                        label={resources.lblIncludeAnticipatedAid}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Checkbox
                                        id="chkWashoutTransactions"
                                        checked={financialSettings.displayWashoutTransactions}
                                        label={resources.lblDisplayWashout}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} className={classes.spaceBlocks}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblFinancialAid}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Checkbox
                                        id="chkUnmetNeed"
                                        checked={financialSettings.displayUnmetNeeds}
                                        label={resources.lblUnmetNeed}
                                        onChange={this.onCheckboxChange}
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
                                        checked={financialSettings.enableOnlinePayment}
                                        error={!financialSettings.enableOnlinePaymentIsValid}
                                        helperText={!financialSettings.enableOnlinePaymentIsValid ?
                                            resources.lblEnableOnlinePaymentInvalid : undefined}
                                        id="chkEnableOnlinePayment"
                                        label={resources.lblEnableOnlinePayment}
                                        onChange={this.onCheckboxChange}
                                    />
                                    <Grid container className={classes.indentBlock}>
                                        <Grid item xs={12} md={6}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Dropdown
                                                        disabled={!financialSettings.enableOnlinePayment}
                                                        emptyOption={emptyOption}
                                                        error={financialSettings.cashReceiptCodeModified
                                                            && !financialSettings.cashReceiptCode}
                                                        helperText={financialSettings.cashReceiptCodeModified
                                                            && !financialSettings.cashReceiptCode ?
                                                            resources.lblCashReceiptCodeRequired : undefined}
                                                        id="ddlCashReceiptCode"
                                                        label={resources.lblCashReceiptCode}
                                                        options={cashReceiptCodes}
                                                        value={financialSettings.cashReceiptCode ?
                                                            financialSettings.cashReceiptCode : ''}
                                                        onChange={this.onDropdownChange}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <br />
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Dropdown
                                                        disabled={!financialSettings.enableOnlinePayment}
                                                        emptyOption={emptyOption}
                                                        error={financialSettings.cashReceiptOfficeModified
                                                            && !financialSettings.cashReceiptOffice}
                                                        helperText={financialSettings.cashReceiptOfficeModified
                                                            && !financialSettings.cashReceiptOffice ?
                                                            resources.lblCashReceiptOfficeRequired : undefined}
                                                        id="ddlCashReceiptOffice"
                                                        label={resources.lblCashReceiptOffice}
                                                        options={cashReceiptOffices}
                                                        value={financialSettings.cashReceiptOffice ?
                                                            financialSettings.cashReceiptOffice : ''}
                                                        onChange={this.onDropdownChange}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <br />
                                            <Grid container alignItems="center">
                                                <Grid item xs>
                                                    <Dropdown
                                                        disabled={!financialSettings.enableOnlinePayment}
                                                        emptyOption={emptyOption}
                                                        error={financialSettings.paymentPeriodsModified
                                                            && (!paymentPeriodsSelected
                                                                || paymentPeriodsSelected && paymentPeriodsSelected.length === 0)}
                                                        helperText={financialSettings.paymentPeriodsModified
                                                            && (!paymentPeriodsSelected
                                                                || paymentPeriodsSelected && paymentPeriodsSelected.length === 0) ?
                                                            resources.lblPaymentPeriodEmpty : undefined}
                                                        id="ddlPaymentPeriod"
                                                        label={resources.lblPaymentPeriod}
                                                        options={paymentPeriods}
                                                        value={paymentPeriodSelected ?
                                                            paymentPeriodSelected.value : ''}
                                                        onChange={this.onDropdownChange}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        disabled={!financialSettings.enableOnlinePayment}
                                                        id="btnAddPaymentPeriod"
                                                        onClick={this.onAddPaymentPeriod}
                                                    >
                                                        {resources.btnAdd}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            {paymentPeriodsSelected ? (
                                                <Grid container>
                                                    {paymentPeriodsSelected.map((paymentPeriod, ppi) => {
                                                        const onDeleteChip = () => this.onRemovePaymentPeriod(String(paymentPeriod.value));
                                                        return (
                                                            <Grid item key={`paymentPeriod_${ppi}`}>
                                                                <Chip
                                                                    id={`chpPeriod_${paymentPeriod.value}`}
                                                                    label={paymentPeriod.description}
                                                                    onDelete={financialSettings.enableOnlinePayment ? onDeleteChip : undefined}
                                                                />
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            ) : undefined}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Button
                                id="btnSaveFinancialSettings"
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
export default withStyles(styles)(FinancialSettings);