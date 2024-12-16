/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: BalanceMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';

// Internal components
import FailedPaymentModal from '../../Generic/FailedPaymentModal';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import ProcessPaymentModal from '../../Generic/ProcessPaymentModal';
import SuccessfulPaymentModal from '../../Generic/SuccessfulPaymentModal';
import BalanceByChargesCredits, { IBalanceByChargesCreditsResProps } from '../../Finances/Balance/BalanceByChargesCredits';
import { IBalanceDetailTableResProps } from './BalanceDetailTable';
import BalanceBySummary, { IBalanceBySummaryResProps } from '../../Finances/Balance/BalanceBySummary';
import BalanceBySummaryType, { IBalanceBySummaryTypeResProps } from '../../Finances/Balance/BalanceBySummaryType';
import BalanceFooter, { IBalanceFooterResProps } from '../../Finances/Balance/BalanceFooter';
import BalanceHeader, { IBalanceHeaderResProps } from '../../Finances/Balance/BalanceHeader';
import BalanceOptions, { IBalanceOptionsResProps } from '../../Finances/Balance/BalanceOptions';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
import { IBalanceByCharges } from '../../../Types/Balance/IBalanceByCharges';
import { IBalanceBySummary } from '../../../Types/Balance/IBalanceBySummary';
import { IBalanceBySummaryType } from '../../../Types/Balance/IBalanceBySummaryType';
import { IBalancePayment } from '../../../Types/Balance/IBalancePayment';
import { PaymentOrigin } from '../../../Types/Enum/PaymentOrigin';
import { IPaymentTransaction } from '../../../Types/Payment/IPaymentTransaction';
import { IBalanceMainResources } from '../../../Types/Resources/Finances/IBalanceMainResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Finances/Balance';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
// #endregion Imports

// #region Types
interface IBalanceMainProps {
    personId?: number;
    isRelative?: boolean;
}

interface IBalanceRes extends IBalanceMainResources {
    balanceByChargesCredits: IBalanceByChargesCreditsResProps;
    balanceBySummary: IBalanceBySummaryResProps;
    balanceBySummaryType: IBalanceBySummaryTypeResProps;
    balanceDetailTable: IBalanceDetailTableResProps;
    balanceFooter: IBalanceFooterResProps;
    balanceHeader: IBalanceHeaderResProps;
    balanceOptions: IBalanceOptionsResProps;
}

interface IBalanceMainState {
    balance?: IBalanceByCharges | IBalanceBySummaryType | IBalanceBySummary;
    componentError: boolean;
    isLoading: boolean;
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    resources?: IBalanceRes;
    viewSelected: string;
    yearTermFixed?: string;

    // Payment
    balancePayment?: IBalancePayment;
    paymentModalOpenFail: boolean;
    paymentModalOpenProcess: boolean;
    paymentModalOpenSuccess: boolean;
    paymentTransaction?: IPaymentTransaction;
}

const styles = ((theme: Theme) => createStyles({
    balanceContainer: {
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        flexDirection: 'row-reverse',
        flexWrap: 'wrap-reverse'
    }
}));

type PropsWithStyles = IBalanceMainProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class BalanceMainView extends React.Component<PropsWithStyles, IBalanceMainState> {
    private idModule: string;
    private idPage: string;
    private views: IRadioOption[];

    public readonly state: Readonly<IBalanceMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Finances';
        this.idPage = 'BalanceMain';
        this.views = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IBalanceMainState {
        let resources: IBalanceRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            isLoading: true,
            resources: resources,
            viewSelected: '3',

            // Payment
            paymentModalOpenFail: false,
            paymentModalOpenProcess: false,
            paymentModalOpenSuccess: false
        };
    }

    // #region Events

    // #region Payment
    private onChangePaymentAmount = (event: any): void => {
        try {
            const {
                balancePayment
            } = this.state;

            if (balancePayment) {
                balancePayment.amount = event.target.value;
                balancePayment.invalidAmount = !this.validateAmount(balancePayment.amount);
                balancePayment.modifiedAmount = true;
                this.setState({
                    balancePayment: balancePayment
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePaymentAmount.name, e));
        }
    };

    private onChangePeriodToPayment = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                balancePayment
            } = this.state;

            if (balancePayment) {
                balancePayment.periodSelected = optionSelected;
                balancePayment.modifiedPeriod = true;
                this.setState({
                    balancePayment: balancePayment
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriodToPayment.name, e));
        }
    };

    private onClosePaymentModalFail = (): void => {
        try {
            this.setState({
                paymentModalOpenFail: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePaymentModalFail.name, e));
        }
    };

    private onClosePaymentModalProcess = (): void => {
        try {
            this.setState({
                paymentModalOpenProcess: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePaymentModalProcess.name, e));
        }
    };

    private onClosePaymentModalSuccess = (): void => {
        try {
            this.setState({
                paymentModalOpenSuccess: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePaymentModalSuccess.name, e));
        }
    };
    // #endregion Payment

    private onChangePeriod = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                viewSelected
            } = this.state;

            LayoutActions.showPageLoader();
            this.setState({
                periodSelected: optionSelected
            });
            Requests.getBalance(String(optionSelected.value), viewSelected, this.resolveGetBalance, this.logError, this.props.personId);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onChangeView = (event: any): void => {

        try {
            const {
                periodSelected
            } = this.state;

            LayoutActions.showPageLoader();
            this.setState({
                viewSelected: event.target.value
            });
            if (periodSelected) {
                Requests.getBalance(periodSelected.value as string, event.target.value, this.resolveGetBalance, this.logError, this.props.personId);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeView.name, e));
        }
    };

    private onMakePayment = (): void => {
        try {
            const {
                balancePayment
            } = this.state;

            if (balancePayment) {
                if (Boolean(balancePayment.amount)
                    && !balancePayment.invalidAmount
                    && balancePayment.periodSelected
                    && balancePayment.periodSelected.value !== '') {
                    this.setState({
                        paymentModalOpenProcess: true
                    });
                }
                else {
                    balancePayment.modifiedPeriod = true;
                    balancePayment.modifiedAmount = true;
                    this.setState({
                        balancePayment: balancePayment
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onMakePayment.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private onMakeReferencePayment = (): void => {
        // Variables
        let newPersonId: number | null = null;
        let academicYear = '';
        let academicTerm = '';
        let academicSession = '';
    
        // Recuperar y mostrar el item de localStorage con la clave 'selectedCheckboxesInfo'
        const selectedCheckboxesInfo = localStorage.getItem('selectedCheckboxesInfo');
        const periodSelected = localStorage.getItem('periodSelected');
        const userInfo = localStorage.getItem('userInfo');
    
        // Convertir los valores a objetos JSON
        const selectedCheckboxesJson = selectedCheckboxesInfo ? JSON.parse(selectedCheckboxesInfo) : [];
        const periodSelectedJson = periodSelected ? JSON.parse(periodSelected) : null;
        const userInfoJson = userInfo ? JSON.parse(userInfo) : null;
    
        // Extraer valores del periodSelectedJson
        if (periodSelectedJson && periodSelectedJson.value) {
            const regex = /^(\d{4})\/(\w+?)\/(.+)$/;
            const matches = periodSelectedJson.value.match(regex);
    
            if (matches) {
                academicYear = matches[1];  // 2024
                academicTerm = matches[2];   // C2
                academicSession = matches[3]; // UNILINEA
            }
    
        } else {
            console.log('No hay información de período seleccionada.');
        }
    
        // Extraer y guardar newPersonId del userInfoJson
        if (userInfoJson && userInfoJson.newPersonId) {
            newPersonId = userInfoJson.newPersonId;
        } else {
            console.log('No hay información de userInfo disponible o newPersonId no está definido.');
        }
    
        // Mostrar y generar URLs para cada texto seleccionado
        if (Array.isArray(selectedCheckboxesJson) && newPersonId !== null) {
            if (selectedCheckboxesJson.length > 1) {
                // Mostrar el mensaje de error si hay más de un elemento seleccionado
                this.logError(LogData.fromMessage(this.onMakeReferencePayment.name, "Selecciona únicamente un cargo a la vez"));
            } else {
                selectedCheckboxesJson.forEach((text, index) => {
                    const filterText = encodeURIComponent(text); // Asegúrate de que el texto esté codificado
                    const url = `${Constants.webUrl}/Students/GenerateReport?PersonId=${newPersonId}&academicYear=${academicYear}&academicTerm=${academicTerm}&academicSession=${academicSession}&FilterText=${filterText}`;
                    // Abrir la URL con un pequeño retraso entre cada una
                    setTimeout(() => {
                        window.open(url, '_blank');
                    }, index * 200); // Retraso de 200ms entre cada URL
                });
            }
        } else {
            console.log('No hay elementos seleccionados o no se ha encontrado el Person ID.');
        }

    }
    

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

    // #endregion Error Functions

    // #region Resolvers
    private resolveGetBalance = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetBalance.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    balance: result.data,
                    isLoading: false
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetBalance.name, e));
        }
    };

    private resolveGetPeriods = (json: string): void => {
        try {

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    resources,
                    viewSelected,
                    yearTermFixed
                } = this.state;
                // #region AddPagosReferenciados

                localStorage.setItem('userInfo', JSON.stringify(result.data.userAccountDetails));

                // #endregion AddPagosReferenciados
                let periods: IDropDownOption[] = result.data.periods;
                const periodsToPayment: IDropDownOption[] = result.data.periodsToPayment;
                let periodSelected: IDropDownOption = result.data.defaultPeriod;
                const displayOverallBalance: boolean = result.data.displayOverallBalance;
                const enableOnlinePayment: boolean = result.data.enableOnlinePayment;

                if (periods) {
                    if (displayOverallBalance && resources) {
                        const allOption = {
                            description: resources.lblAll,
                            value: '0'
                        } as IDropDownOption;
                        periods.unshift(allOption);
                        if (!Boolean(periods)) {
                            periods = [];
                            periodSelected = allOption;
                        }
                    }
                    if (yearTermFixed) {
                        const yearTermToSearch: string = yearTermFixed;
                        periods.forEach(period => {
                            if (period.value === yearTermToSearch) {
                                periodSelected.description = period.description;
                                periodSelected.value = period.value;
                            }
                        });
                    }
                }

                const balancePayment: IBalancePayment = {
                    amount: '',
                    enableOnlinePayment: enableOnlinePayment,
                    periods: periodsToPayment,
                    periodSelected: undefined,

                    invalidAmount: false,
                    modifiedAmount: false,
                    modifiedPeriod: false
                } as IBalancePayment;

                this.setState({
                    balancePayment: balancePayment,
                    periods: periods,
                    periodSelected: periodSelected
                });

                if (periods && periodSelected) {
                    Requests.getBalance(String(periodSelected.value), viewSelected, this.resolveGetBalance, this.logError, this.props.personId);
                }
                else {
                    this.setState({
                        isLoading: false
                    });
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                // The views list is based on the resources
                this.views.push({ value: '1', description: result.data.lblOptionByCharges });
                this.views.push({ value: '2', description: result.data.lblOptionBySummaryType });
                this.views.push({ value: '3', description: result.data.lblOptionBySummary });

                const hdnYearTerm: HTMLInputElement | undefined =
                    document.getElementById('hdnYearTerm') as HTMLInputElement;
                const hdnTransactionId: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionId') as HTMLInputElement;
                const hdnTransactionStatus: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionStatus') as HTMLInputElement;
                const hdnTransactionAmount: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionAmount') as HTMLInputElement;
                const hdnTransactionDescription: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionDescription') as HTMLInputElement;
                const hdnTransactionAuthorizationNumber: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionAuthorizationNumber') as HTMLInputElement;
                if (hdnYearTerm && hdnYearTerm.value) {
                    this.setState({
                        yearTermFixed: hdnYearTerm.value
                    });
                    hdnYearTerm.remove();
                }
                if (hdnTransactionId && hdnTransactionId.value
                    && hdnTransactionStatus
                    && hdnTransactionAmount
                    && hdnTransactionDescription
                    && hdnTransactionAuthorizationNumber) {
                    const paymentTransaction: IPaymentTransaction = {
                        amount: hdnTransactionAmount.value,
                        authorizationNumber: hdnTransactionAuthorizationNumber.value,
                        description: hdnTransactionDescription.value,
                        status: Number(hdnTransactionStatus.value),
                        transactionId: Number(hdnTransactionAmount.value)
                    } as IPaymentTransaction;
                    this.setState({
                        paymentModalOpenFail: Number(hdnTransactionStatus.value) === 0,
                        paymentModalOpenSuccess: Number(hdnTransactionStatus.value) === 1,
                        paymentTransaction: paymentTransaction
                    });
                    hdnTransactionId.remove();
                    hdnTransactionStatus.remove();
                    hdnTransactionAmount.remove();
                    hdnTransactionDescription.remove();
                    hdnTransactionAuthorizationNumber.remove();
                }
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getPeriods(this.resolveGetPeriods, this.logError, this.props.personId);
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
            balance,
            componentError,
            isLoading,
            periods,
            periodSelected,
            resources,
            viewSelected,

            // Payment
            balancePayment,
            paymentModalOpenFail,
            paymentModalOpenProcess,
            paymentModalOpenSuccess,
            paymentTransaction
        } = this.state;

        const {
            classes,
            isRelative
        } = this.props;
        // #region AddPago Referenciados


        localStorage.setItem('periodSelected', JSON.stringify(periodSelected));

        // #endregion AddPago Referenciados
        // #region Payment modals
        let processPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenProcess && balancePayment && balancePayment.periodSelected) {
            processPaymentModal = (
                <ProcessPaymentModal
                    amount={Number(balancePayment.amount)}
                    open={paymentModalOpenProcess}
                    paymentOrigin={PaymentOrigin.MakePayment}
                    personId={this.props.personId}
                    termSessionId={String(balancePayment.periodSelected.value)}
                    onClose={this.onClosePaymentModalProcess}
                />
            );
        }

        let successfulPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenSuccess) {
            successfulPaymentModal = (
                <SuccessfulPaymentModal
                    open={paymentModalOpenSuccess}
                    paymentOrigin={PaymentOrigin.MakePayment}
                    paymentTransaction={paymentTransaction}
                    onClose={this.onClosePaymentModalSuccess}
                />
            );
        }

        let failedPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenFail) {
            failedPaymentModal = (
                <FailedPaymentModal
                    open={paymentModalOpenFail}
                    paymentOrigin={PaymentOrigin.MakePayment}
                    onClose={this.onClosePaymentModalFail}
                />
            );
        }
        // #endregion Payment modals

        let contentPage: JSX.Element | undefined;
        if (isLoading && isRelative) {
            return (
                <ContainerLoader id="ldrBalance" height="md" />
            );
        }
        else if (!componentError && resources) {
            let balanceSection: JSX.Element | undefined;
            if (balance) {
                switch (viewSelected) {
                    case '1':
                        const balance1: IBalanceByCharges = balance as IBalanceByCharges;
                        if ((balance1.charges && balance1.charges.length > 0)
                            || (balance1.credits && balance1.credits.length > 0)
                            || (balance1.financialAids && balance1.financialAids.length > 0)) {
                            balanceSection = (
                                <BalanceByChargesCredits
                                    balance={balance1}
                                    resources={resources.balanceByChargesCredits}
                                    resourcesTable={resources.balanceDetailTable}
                                />
                            );
                        }
                        break;
                    case '2':
                        const balance2: IBalanceBySummaryType = balance as IBalanceBySummaryType;
                        if (balance2.detailSummaryTypes && balance2.detailSummaryTypes.length > 0) {
                            balanceSection = (
                                <BalanceBySummaryType
                                    balance={balance2}
                                    resources={resources.balanceBySummaryType}
                                    resourcesTable={resources.balanceDetailTable}
                                />
                            );
                        }
                        break;
                    case '3':
                        const balance3: IBalanceBySummary = balance as IBalanceBySummary;
                        if (balance3.summaryTypes && balance3.summaryTypes.length > 0) {
                            balanceSection = (
                                <BalanceBySummary
                                    balance={balance3}
                                    resources={resources.balanceBySummary}
                                />
                            );
                        }
                        break;
                }
            }

            contentPage = (
                <Grid container spacing={3} className={classes.balanceContainer}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                {periods && periodSelected ? (
                                    <>
                                        <BalanceHeader
                                            periodSelected={periodSelected}
                                            resources={resources.balanceHeader}
                                            total={balance && balance.periodTotal !== '' ?
                                                balance.periodTotal : undefined}
                                            viewSelected={viewSelected}
                                        />
                                        {balanceSection ? balanceSection : (
                                            <MessageStyled
                                                classMessage="noResults"
                                                message={resources.lblNoBalanceForPeriod}
                                            />
                                        )}
                                        <BalanceFooter
                                            balance={balance}
                                            periodSelected={periodSelected}
                                            resources={resources.balanceFooter}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Illustration
                                            color="secondary"
                                            name="under-maintenance"
                                            text={resources.lblNoBalance}
                                        />
                                    </>
                                )}

                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <BalanceOptions
                            balancePayment={balancePayment}
                            lblDropDownEmptyText={resources.lblDropDownEmptyText}
                            periods={periods}
                            periodSelected={String(periodSelected?.value)}
                            resources={resources.balanceOptions}
                            views={this.views}
                            viewSelected={viewSelected}
                            onChangePaymentAmount={this.onChangePaymentAmount}
                            onChangePeriod={this.onChangePeriod}
                            onChangePeriodToPayment={this.onChangePeriodToPayment}
                            onChangeView={this.onChangeView}
                            onMakePayment={this.onMakePayment}
                            onMakeReferencePayment = {this.onMakeReferencePayment}
                        />
                    </Grid>
                </Grid>
            );
        }

        return (
            <>
                {contentPage}
                {processPaymentModal}
                {successfulPaymentModal}
                {failedPaymentModal}
            </>
        );
    }
}
// #endregion Component

// RenderDOM: Component
export default withStyles(styles)(BalanceMainView);