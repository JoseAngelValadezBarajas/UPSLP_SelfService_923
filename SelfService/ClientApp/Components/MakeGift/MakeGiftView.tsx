/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: MakeGiftView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import InputAdornment from '@hedtech/powercampus-design-system/react/core/InputAdornment';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import PersonalInformationModal from './PersonalInformationModal';
import FailedPaymentModal from '../Generic/FailedPaymentModal';
import ProcessPaymentModal from '../Generic/ProcessPaymentModal';
import SuccessfulPaymentModal from '../Generic/SuccessfulPaymentModal';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IGiftCampaign } from '../../Types/MakeGift/IGiftCampaign';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IMakeGiftDetails } from '../../Types/MakeGift/IMakeGiftDetails';
import { IMakeGift } from '../../Types/MakeGift/IMakeGift';
import { IMakeGiftResources } from '../../Types/Resources/MakeGift/IMakeGiftResources';
import { IPaymentTransaction } from '../../Types/Payment/IPaymentTransaction';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../Requests/MakeGift/MakeGift';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

// #endregion Imports

// #region Types
interface IMakeGiftState {
    canAddNew: boolean;
    componentError: boolean;
    currentId: number;
    giftCampaigns?: IGiftCampaign[];
    giftDetails?: IMakeGiftDetails[];
    giftData?: IMakeGift;
    totalAmount?: number,
    openPersonalInfoModal: boolean;
    resources?: IMakeGiftResources;

    // Payment
    paymentModalOpenProcess: boolean;
    paymentModalOpenFail: boolean;
    paymentModalOpenSuccess: boolean;
    paymentTransaction?: IPaymentTransaction;
    returnUrl?: string;
}

// #endregion Types

// #region Component
class MakeGiftView extends React.Component<any, IMakeGiftState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IMakeGiftState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'MakeGift';
        this.idPage = 'MakeGift';
        this.state = this.getInitialState();
        this.layoutResources = LayoutStore.getResourcesLayout();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IMakeGiftState {
        let resources: IMakeGiftResources | undefined
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            canAddNew: true,
            componentError: false,
            currentId: 0,
            giftDetails: [{
                amount: '',
                campaignSelected: 0,
                isCampaignsRequired: false,
                isUniqueCampaign: true,
                isValidAmount: true,
                isValidCampaing: true
            } as IMakeGiftDetails],
            openPersonalInfoModal: false,
            resources: resources,

            // Payment
            paymentModalOpenProcess: false,
            paymentModalOpenFail: false,
            paymentModalOpenSuccess: false
        };
    }

    // #region Events
    private onAdd = (): void => {
        try {
            const {
                currentId,
                giftDetails,
                giftData
            } = this.state;

            if (giftData && giftData.campaigns.length > currentId + 1) {
                if (giftDetails && giftDetails[currentId].amount !== "" && Number(giftDetails[currentId].amount) > 0 && giftDetails[currentId].isValidAmount
                    && giftDetails[currentId].isUniqueCampaign && giftDetails[currentId].isValidCampaing
                    && giftDetails[currentId].campaignSelected > 0) {
                    this.setState({
                        currentId: currentId + 1,
                        giftDetails: [...giftDetails,
                            {
                                amount: '',
                                campaignSelected: 0,
                                isCampaignsRequired: true,
                                isUniqueCampaign: true,
                                isValidCampaing: true,
                                isValidAmount: true
                            }]
                    });
                    if (giftData.campaigns.length === currentId + 2) {
                        this.setState({
                            canAddNew: false
                        });
                    }
                }
                else if (giftDetails) {
                    if (Number(giftDetails[currentId].campaignSelected) === 0) {
                        giftDetails[currentId].isValidCampaing = false;
                    }
                    if (String(giftDetails[currentId].amount) === '') {
                        giftDetails[currentId].isValidAmount = false;
                    }

                    this.setState({
                        giftDetails: giftDetails
                    });
                }
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdd.name, e));
        }
    };

    private onDelete = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                currentId,
                giftDetails
            } = this.state;
            const id: number = Number(event.currentTarget.id.split('_')[1]);
            if (giftDetails) {
                giftDetails.splice(id, 1);
                this.setState({
                    canAddNew: true,
                    currentId: currentId - 1,
                    giftDetails: giftDetails
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDelete.name, e));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const ids: string[] = id.split('_');
            const idNum: number = Number(ids[1]);
            const {
                giftDetails
            } = this.state;

            if (giftDetails) {
                // no campaing selected
                if (optionSelected.value && Number(optionSelected.value) === 0 || optionSelected.value === '') {
                    giftDetails[idNum].campaignSelected = Number(optionSelected.value);
                    giftDetails[idNum].isCampaignsRequired = true;
                    giftDetails[idNum].isUniqueCampaign = false;
                    giftDetails[idNum].isValidCampaing = false;
                }
                else {
                    let isUnique: boolean = true;
                    giftDetails.forEach((detail, i) => {
                        if (detail.campaignSelected === Number(optionSelected.value) &&
                            i !== idNum) {
                            isUnique = false;
                        }
                    });

                    giftDetails[idNum].campaignSelected = Number(optionSelected.value);
                    giftDetails[idNum].isCampaignsRequired = false;
                    giftDetails[idNum].isUniqueCampaign = isUnique;
                    giftDetails[idNum].isValidCampaing = isUnique;
                }

                this.setState({
                    giftDetails: giftDetails
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const id: string[] = event.currentTarget.id.split('_');
            const {
                giftDetails
            } = this.state;
            if (giftDetails && giftDetails.length > 0) {
                if (event.target.value.match(/^[0-9.,]*$/g) || event.target.value === '') {
                    giftDetails[id[1]].amount = event.target.value;
                    giftDetails[id[1]].isAmountRequired = false;
                    giftDetails[id[1]].isAmountValid = true;
                    giftDetails[id[1]].isValidAmount = true;
                    this.setState({
                        giftDetails
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onBlurTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const id: string[] = event.currentTarget.id.split('_');
            const {
                giftDetails,
            } = this.state;
            if (giftDetails && giftDetails.length > 0) {
                giftDetails[id[1]].isAmountRequired = event.target.value === '';
                giftDetails[id[1]].isAmountValid = true;
                if (event.target.value.match(/^[0-9.,]*$/g)) {
                    if (Number(event.target.value) > 0) {
                        giftDetails[id[1]].amount = Number(event.target.value).toFixed(2);
                    }
                    else {
                        giftDetails[id[1]].isAmountValid = false;
                        giftDetails[id[1]].isValidAmount = false;
                        giftDetails[id[1]].amount = undefined;
                    }
                }
                this.setState({
                    giftDetails
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurTextField.name, e));
        }
    };

    private onMakePayment = (): void => {
        try {
            if (this.validateGiftCapaing()) {
                const {
                    giftData,
                    giftDetails
                } = this.state;

                let amount: number = 0;
                let giftCampaigns: IGiftCampaign[] = [];
                if (giftDetails) {
                    giftDetails.forEach((giftDetail) => {
                        amount += Number(giftDetail.amount);
                        let giftCampaign: IGiftCampaign =
                        {
                            amount: Number(giftDetail.amount),
                            id: giftDetail.campaignSelected
                        };
                        giftCampaigns.push(giftCampaign);
                    });
                }

                if (amount > 0) {
                    this.setState({
                        giftCampaigns,
                        totalAmount: amount
                    });
                };

                if (giftData && giftData.isAuthenticated) {
                    this.setState({
                        paymentModalOpenProcess: true
                    });
                }
                else {
                    this.setState({
                        openPersonalInfoModal: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onMakePayment.name, e));
        }
    };

    private onClosePersonalInfoModal = (): void => {
        try {
            this.setState({
                openPersonalInfoModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePersonalInfoModal.name, e));
        }
    };

    private onAfterSaveAccount = (): void => {
        try {
            this.setState({
                openPersonalInfoModal: false,
                paymentModalOpenProcess: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAfterSaveAccount.name, e));
        }
    };

    // #region Payment
    private onClosePaymentModalProcess = (): void => {
        try {
            Requests.postCancelPayment(this.resolveCancelPayment, this.logError);
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
    // #endregion Payment
    // #endregion Events

    //#region PrivateFunctions
    private validateGiftCapaing = (): boolean => {
        const {
            giftDetails
        } = this.state;

        let isValid: boolean = true;
        if (giftDetails) {
            giftDetails.forEach((giftDetail) => {
                if (!giftDetail.campaignSelected) {
                    giftDetail.isCampaignsRequired = true;
                    giftDetail.isValidCampaing = false;
                    isValid = false;
                }
                if (!Number(giftDetail.amount)) {
                    giftDetail.isAmountValid = false;
                    giftDetail.isValidAmount = false;
                    isValid = false;
                }

                const details: IMakeGiftDetails[] =
                    giftDetails.filter(x => x.campaignSelected === giftDetail.campaignSelected);

                if (details.length > 1) {
                    isValid = false;
                }
            });


        }
        this.setState({
            giftDetails
        });
        return isValid;
    }
    //#endregion PrivateFunctions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                LayoutActions.setLoading(false);
                Requests.getOptions(this.resolveGetOptions, this.logError);

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

                if (hdnTransactionId && hdnTransactionStatus && hdnTransactionAmount && hdnTransactionDescription
                    && hdnTransactionAuthorizationNumber) {
                    const paymentTransaction: IPaymentTransaction = {
                        amount: hdnTransactionAmount.value,
                        authorizationNumber: hdnTransactionAuthorizationNumber.value,
                        description: hdnTransactionDescription.value,
                        status: Number(hdnTransactionStatus.value),
                        transactionId: Number(hdnTransactionId.value)
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
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveGetOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOptions.name);
            if (result?.status && result.data) {
                const giftData: IMakeGift = result.data;
                const{
                    giftDetails
                } = this.state;

                const existDefaultCampaign: number = giftData.campaigns.findIndex(c => c.value === giftData.defaultCampaign);

                if (giftDetails) {
                    if (existDefaultCampaign !== -1) {
                        giftDetails[0].campaignSelected = giftData.defaultCampaign;
                    }
                    else {
                        giftDetails[0].campaignSelected = 0;
                    }
                }
                this.setState({
                    giftData: giftData,
                    giftDetails: giftDetails
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOptions.name, e));
        }
    };

    private resolveCancelPayment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveCancelPayment.name);
            if (result?.status) {
                this.setState({
                    paymentModalOpenProcess: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveCancelPayment.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IMakeGiftResources | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.setState({
                componentError: true
            }, () => this.logError(LogData.layoutNoReady(this.onLayoutReady.name)));
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
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
            canAddNew,
            componentError,
            giftCampaigns,
            giftData,
            giftDetails,
            openPersonalInfoModal,
            totalAmount,

            resources,

            //payment
            paymentModalOpenProcess,
            paymentModalOpenFail,
            paymentModalOpenSuccess,
            paymentTransaction
        } = this.state;

        // #region Payment modals
        let processPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenProcess && totalAmount && giftCampaigns) {
            processPaymentModal = (
                <ProcessPaymentModal
                    amount={totalAmount}
                    giftCampaigns={giftCampaigns}
                    open={paymentModalOpenProcess}
                    paymentOrigin={PaymentOrigin.OnlineDonation}
                    onClose={this.onClosePaymentModalProcess}
                />
            );
        }

        let successfulPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenSuccess) {
            successfulPaymentModal = (
                <SuccessfulPaymentModal
                    open={paymentModalOpenSuccess}
                    paymentOrigin={PaymentOrigin.OnlineDonation}
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
                    paymentOrigin={PaymentOrigin.OnlineDonation}
                    onClose={this.onClosePaymentModalFail}
                />
            );
        }
        // #endregion Payment modals

        let contentPage: JSX.Element | JSX.Element[] | undefined;
        let emptyContent: JSX.Element | undefined;
        let personalInfoModal: JSX.Element | undefined;

        if (!componentError && resources && this.layoutResources) {
            const emptyOption: IDropDownOption = {
                description: resources.lblDropDownEmptyText,
                value: ''
            };
            emptyContent = (
                <Illustration
                    color="secondary"
                    name="under-maintenance"
                    text={giftData && giftData.campaigns.length === 0
                        || (giftData && !giftData.hasGiftBatch)
                        || (giftData && !giftData.hasPaymentUrl)
                        || (giftData && !giftData.hasEmailType) ?
                        resources.lblNotAvailable :
                        ''}
                />
            );

            if (openPersonalInfoModal) {
                personalInfoModal = (
                    <PersonalInformationModal
                        open={openPersonalInfoModal}
                        onClose={this.onClosePersonalInfoModal}
                        totalDonation={totalAmount}
                        onAfterSave={this.onAfterSaveAccount}
                    />
                );
            }

            contentPage = (
                <Card>
                    <CardContent>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item>
                                <Text>
                                    {resources.lblLegend}
                                </Text>
                            </Grid>
                        </Grid><br />
                        {giftData ? giftData.campaigns.length > 0 && giftData.hasGiftBatch && giftData.hasPaymentUrl && giftData.hasEmailType ?
                            <>
                                {giftDetails ? giftDetails.map((details, i) => (
                                    <Grid key={`item_${i}`} container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <Dropdown
                                                emptyOption={emptyOption}
                                                id={`ddlCampaigns_${i}`}
                                                error={!details.isValidCampaing}
                                                helperText={!details.isValidCampaing ?
                                                    details.isCampaignsRequired ? resources.lblContributingRequired :
                                                        resources.lblUniqueCampaign : undefined}
                                                label={resources.lblContributing}
                                                options={giftData.campaigns}
                                                required
                                                value={details.campaignSelected}
                                                onChange={this.onDropdownChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                error={!details.isValidAmount}
                                                helperText={!details.isValidAmount ?
                                                    resources.lblAmountRequired : undefined}
                                                id={`txtAmountValue_${i}`}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                                }}
                                                label={resources.lblAmount}
                                                required
                                                value={details ? details.amount : ''}
                                                onBlur={this.onBlurTextField}
                                                onChange={this.onChangeTextField}
                                            />
                                        </Grid>
                                        {i > 0 ?
                                            <Grid item xs={12} md={4}>
                                                <Tooltip
                                                    id="deleteGift"
                                                    title={resources.btnDelete}
                                                    aria-label={resources.btnDelete}
                                                >
                                                <IconButton
                                                    aria-label={resources.btnDelete}
                                                    color="secondary"
                                                    id={`btnDelete_${i}`}
                                                    onClick={this.onDelete}
                                                >
                                                    <Icon name="trash" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                            : undefined}
                                    </Grid>
                                )) : undefined}
                                {canAddNew ?
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Button
                                                id="btnAddNew"
                                                onClick={this.onAdd}
                                                color="secondary"
                                            >
                                                {resources.btnAddNew}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                :undefined}
                                <Grid container justifyContent="flex-end">
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Button
                                            id="btnMakePayment"
                                            onClick={this.onMakePayment}
                                        >
                                            {giftData.isAuthenticated ? resources.btnMakePayment
                                                : resources.btnContinue}
                                        </Button>
                                        <Button
                                            id="btnFichaPago"
                                            //onClick={onMakePayment}
                                        >
                                            Genera Ficha de Pago
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                            :
                            (<Grid container spacing={3}>
                                <Grid item xs={12}>
                                    {emptyContent}
                                </Grid>
                            </Grid>) : undefined}
                    </CardContent>
                </Card>
            );
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
                {processPaymentModal}
                {successfulPaymentModal}
                {failedPaymentModal}
                {personalInfoModal}
            </Layout>
        );
    }
}

const MakeGiftViewWithLayout = withLayout(MakeGiftView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<MakeGiftViewWithLayout />, document.getElementById('root'));