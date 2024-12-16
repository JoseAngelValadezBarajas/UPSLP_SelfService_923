/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: RequestTranscriptView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Generic components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Internal components
import ProcessPaymentModal from '../../Generic/ProcessPaymentModal';
import SuccessfulPaymentModal from '../../Generic/SuccessfulPaymentModal';
import ConfirmRequestModal, { IConfirmRequestModalResProps } from './ConfirmRequestModal';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { PaymentOrigin } from '../../../Types/Enum/PaymentOrigin';
import { IRequestTranscript } from '../../../Types/Grades/IRequestTranscript';
import { IRequestTranscriptResources } from '../../../Types/Resources/Grades/IRequestTranscriptResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Requests
import Requests from '../../../Requests/Grades/RequestTranscript';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import { IPaymentTransaction } from '../../../Types/Payment/IPaymentTransaction';
// #endregion Imports

// #region Types
interface IRequestTranscriptRes extends IRequestTranscriptResources {
    confirmRequestModal: IConfirmRequestModalResProps;
}

interface IRequestTranscriptState {
    componentError: boolean;
    countryOptions: IDropDownOption[];
    cultures: ICultures;
    disclosureStatement: string;
    errorsInRequest: boolean[];
    expandedPanel: string;
    feeAmount: number;
    isDisclosureRead: boolean;
    openDisclosureModal: boolean;
    openRequestModal: boolean;
    requestTranscript: IRequestTranscript[];
    requireConsent: boolean;
    requireOnlinePayment: boolean;
    stateOptions: IDropDownOption[];
    totalAmount: number;

    // Payment
    enableOnlinePayment: boolean;
    openFreeModal: boolean;
    openNoPaymentModal: boolean;
    openProcessPaymentModal: boolean;
    paymentModalOpenFail: boolean;
    paymentModalOpenSuccess: boolean;
    paymentTransaction?: IPaymentTransaction;

    resources?: IRequestTranscriptRes;
}

const styles = (theme: Theme) => createStyles({
    alertMargin: {
        marginBottom: Tokens.spacing50,
        marginTop: Tokens.spacing60
    },
    spacingLeft: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: Tokens.spacing40
        }
    }
});

type PropsWithStyles = WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class RequestTranscriptView extends React.Component<PropsWithStyles, IRequestTranscriptState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IRequestTranscriptState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Grades';
        this.idPage = 'RequestTranscript';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IRequestTranscriptState {
        let resources: IRequestTranscriptRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            countryOptions: [],
            cultures: LayoutStore.getCultures(),
            disclosureStatement: '',
            enableOnlinePayment: false,
            errorsInRequest: [],
            expandedPanel: 'panel_0',
            feeAmount: 0,
            isDisclosureRead: false,
            openDisclosureModal: false,
            openFreeModal: false,
            openNoPaymentModal: false,
            openProcessPaymentModal: false,
            openRequestModal: false,
            paymentModalOpenFail: false,
            paymentModalOpenSuccess: false,
            requestTranscript: [],
            requireConsent: false,
            requireOnlinePayment: false,
            stateOptions: [],
            totalAmount: 0,

            resources: resources
        };
    }

    // #region Events
    private fillEmptyRequestTranscript = (): IRequestTranscript => ({
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        city: '',
        country: 0,
        countryName: '',
        disclosureAccepted: false,
        houseNumber: '',
        name: '',
        numberCopies: '',
        postalCode: '',
        requestReason: '',
        stateProvince: 0,
        stateProvinceName: '',
        totalAmount: 0,

        invalidCopies: false,
        isAddressLine1Invalid: false,
        isCityInvalid: false,
        isCountryInvalid: false,
        isNameInvalid: false,
        isNumberCopiesInvalid: false,
        isPostalCodeInvalid: false,
        isRequestReasonInvalid: false,
        isStateProvinceInvalid: false
    });

    private validateAmount(value: string): boolean {
        let isValid: boolean = false;
        let numberTest: number;
        if (value.match(/^(\d+)$/g)) {
            isValid = true;
        }
        if (isValid) {
            numberTest = Number(value);
            isValid = !(isNaN(numberTest)) && numberTest > 0;
        }
        return isValid;
    }

    private cleanRequests = () => {
        try {
            const newRequestTranscript: IRequestTranscript[] = [];
            newRequestTranscript.push(this.fillEmptyRequestTranscript());

            this.setState({
                isDisclosureRead: false,
                openRequestModal: false,
                requestTranscript: newRequestTranscript
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.cleanRequests.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                feeAmount,
                requestTranscript
            } = this.state;
            const ids: string[] = event.target.id.split('_');
            const position: number = Number(ids[1]);
            if (requestTranscript) {
                switch (ids[0]) {
                    case 'txtNameOfRecipient':
                        requestTranscript[position].name = event.target.value;
                        requestTranscript[position].isNameInvalid = false;
                        break;
                    case 'txtHouseNumber':
                        requestTranscript[position].houseNumber = event.target.value;
                        break;
                    case 'txtAddressLine1':
                        requestTranscript[position].addressLine1 = event.target.value;
                        requestTranscript[position].isAddressLine1Invalid = false;
                        break;
                    case 'txtAddressLine2':
                        requestTranscript[position].addressLine2 = event.target.value;
                        break;
                    case 'txtAddressLine3':
                        requestTranscript[position].addressLine3 = event.target.value;
                        break;
                    case 'txtAddressLine4':
                        requestTranscript[position].addressLine4 = event.target.value;
                        break;
                    case 'txtCity':
                        requestTranscript[position].city = event.target.value;
                        requestTranscript[position].isCityInvalid = false;
                        break;
                    case 'txtPostalCode':
                        requestTranscript[position].postalCode = event.target.value;
                        requestTranscript[position].isPostalCodeInvalid = false;
                        break;
                    case 'txtNumberOfCopies':
                        requestTranscript[position].numberCopies = event.target.value;
                        requestTranscript[position].invalidCopies = !this.validateAmount(requestTranscript[position].numberCopies);
                        requestTranscript[position].isNumberCopiesInvalid = false;
                        if (!requestTranscript[position].invalidCopies) {
                            requestTranscript[position].totalAmount = feeAmount * Number(requestTranscript[position].numberCopies);
                        }
                        break;
                    case 'txtReasonOfRequest':
                        requestTranscript[position].requestReason = event.target.value;
                        requestTranscript[position].isRequestReasonInvalid = false;
                        break;
                }
            }
            this.setState({
                requestTranscript
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onDropdownChange = (option: IDropDownOption, id: string): void => {
        try {
            const {
                requestTranscript
            } = this.state;
            const ids: string[] = id.split('_');
            const position: number = Number(ids[1]);
            if (requestTranscript) {
                switch (ids[0]) {
                    case 'ddlState':
                        requestTranscript[position].stateProvince = Number(option.value);
                        requestTranscript[position].stateProvinceName = option.description;
                        requestTranscript[position].isStateProvinceInvalid = false;
                        break;
                    case 'ddlCountry':
                        requestTranscript[position].country = Number(option.value);
                        requestTranscript[position].countryName = option.description;
                        requestTranscript[position].isCountryInvalid = false;
                        break;
                }
                this.setState({
                    requestTranscript
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onDeleteTranscript = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                requestTranscript
            } = this.state;
            const ids: string[] = event.currentTarget.id.split('_');
            const position: number = Number(ids[1]);
            if (requestTranscript) {
                requestTranscript.splice(position, 1);
                this.setState({
                    requestTranscript
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteTranscript.name, e));
        }
    };

    private onCloseModal = (modal: string) => () => {
        try {

            switch (modal) {
                case 'NoPayment':
                    this.setState({
                        openNoPaymentModal: false,
                        paymentModalOpenFail: false
                    });
                    break;
                case 'Free':
                    this.setState({
                        openFreeModal: false
                    });
                    break;
                case 'DisclosureStatement':
                    this.setState({
                        openDisclosureModal: false
                    });
                    break;
                case 'Request':
                    this.setState({
                        openRequestModal: false
                    });
                    break;
                case 'ProcessPayment':
                    this.setState({
                        openProcessPaymentModal: false
                    });
                    break;
                case 'SuccessPayment':
                    this.setState({
                        paymentModalOpenSuccess: false
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onOpenDisclosureModal = (): void => {
        try {
            this.setState({
                openDisclosureModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDisclosureModal.name, e));
        }
    };

    private onPayNow = (): void => {
        try {
            // Case 4 and 5: Pay now (Succed and Failed)
            this.setState({
                openProcessPaymentModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onPayNow.name, e));
        }
    };

    private onProcessTranscript = () => {
        try {
            const {
                requestTranscript
            } = this.state;

            LayoutActions.setLoading(true);
            Requests.createTranscriptRequest(requestTranscript,
                this.resolveCreateTranscriptRequest,
                this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onProcessTranscript.name, e));
        }
    };

    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            this.setState({
                isDisclosureRead: event.target.checked
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onAddAnotherRequest = (): void => {
        try {
            const {
                requestTranscript,
                errorsInRequest,
                expandedPanel
            } = this.state;

            let newExpandedPanel: string = expandedPanel;
            const newRequestTranscript: IRequestTranscript[] = [...requestTranscript];
            if (newRequestTranscript) {
                newRequestTranscript.forEach(request => {
                    if (!request.name) {
                        request.isNameInvalid = true;
                        errorsInRequest.push(request.isNameInvalid);
                    }
                    if (!request.addressLine1) {
                        request.isAddressLine1Invalid = true;
                        errorsInRequest.push(request.isAddressLine1Invalid);
                    }
                    if (!request.city) {
                        request.isCityInvalid = true;
                        errorsInRequest.push(request.isCityInvalid);
                    }
                    if (!request.stateProvince) {
                        request.isStateProvinceInvalid = true;
                        errorsInRequest.push(request.isStateProvinceInvalid);
                    }
                    if (!request.postalCode) {
                        request.isPostalCodeInvalid = true;
                        errorsInRequest.push(request.isPostalCodeInvalid);
                    }
                    if (!request.country) {
                        request.isCountryInvalid = true;
                        errorsInRequest.push(request.isCountryInvalid);
                    }
                    if (!request.numberCopies) {
                        request.isNumberCopiesInvalid = true;
                        errorsInRequest.push(request.isNumberCopiesInvalid);
                    }
                    if (!request.requestReason) {
                        request.isRequestReasonInvalid = true;
                        errorsInRequest.push(request.isRequestReasonInvalid);
                    }
                });

                if (!errorsInRequest.includes(true)) {
                    newRequestTranscript.push(this.fillEmptyRequestTranscript());
                    newExpandedPanel = `panel_${newRequestTranscript.length - 1}`;
                }
                this.setState({
                    errorsInRequest: [],
                    requestTranscript: newRequestTranscript
                }, () => {
                    this.setState({
                        expandedPanel: newExpandedPanel
                    });
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddAnotherRequest.name, e));
        }
    };

    private onChangeExpansionPanel = (panel: string) => () => {
        try {
            this.setState({
                expandedPanel: panel
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeExpansionPanel.name, e));
        }
    };

    private onSubmitRequest = (): void => {
        const {
            requestTranscript,
            isDisclosureRead,
            errorsInRequest
        } = this.state;

        try {
            if (requestTranscript) {
                let newTotalAmount: number = 0;
                requestTranscript.forEach(request => {
                    if (!request.name) {
                        request.isNameInvalid = true;
                        errorsInRequest.push(request.isNameInvalid);
                    }
                    if (!request.addressLine1) {
                        request.isAddressLine1Invalid = true;
                        errorsInRequest.push(request.isAddressLine1Invalid);
                    }
                    if (!request.city) {
                        request.isCityInvalid = true;
                        errorsInRequest.push(request.isCityInvalid);
                    }
                    if (!request.stateProvince) {
                        request.isStateProvinceInvalid = true;
                        errorsInRequest.push(request.isStateProvinceInvalid);
                    }
                    if (!request.postalCode) {
                        request.isPostalCodeInvalid = true;
                        errorsInRequest.push(request.isPostalCodeInvalid);
                    }
                    if (!request.country) {
                        request.isCountryInvalid = true;
                        errorsInRequest.push(request.isCountryInvalid);
                    }
                    if (!request.numberCopies) {
                        request.isNumberCopiesInvalid = true;
                        errorsInRequest.push(request.isNumberCopiesInvalid);
                    }
                    if (!request.requestReason) {
                        request.isRequestReasonInvalid = true;
                        errorsInRequest.push(request.isRequestReasonInvalid);
                    }
                    newTotalAmount += request.totalAmount;
                    request.disclosureAccepted = isDisclosureRead;
                });

                this.setState({
                    errorsInRequest: [],
                    openRequestModal: !errorsInRequest.includes(true),
                    requestTranscript,
                    totalAmount: newTotalAmount
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSubmitRequest.name, e));
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

    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = () => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
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
                Requests.getRequestOptions(this.resolveGetRequestOptiones, this.logError);
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveGetRequestOptiones = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRequestOptiones.name);
            if (result?.status) {
                const countryOptions: IDropDownOption[] = result.data.countryOptions ? result.data.countryOptions : [];
                const stateOptions: IDropDownOption[] = result.data.stateOptions ? result.data.stateOptions : [];
                const enableOnlinePayment: boolean = Boolean(result.data.enableOnlinePayment);
                const requireOnlinePayment: boolean = Boolean(result.data.requireOnlinePayment);
                const requireConsent: boolean = Boolean(result.data.requireConsent);
                const feeAmount: number = result.data.feeAmount ? result.data.feeAmount : 0;
                const disclosureStatement: string = result.data.disclosureStatement ? result.data.disclosureStatement : '';
                this.setState({
                    countryOptions: countryOptions,
                    disclosureStatement: disclosureStatement,
                    enableOnlinePayment: enableOnlinePayment,
                    feeAmount: feeAmount,
                    requireConsent: requireConsent,
                    requireOnlinePayment: requireOnlinePayment,
                    stateOptions: stateOptions
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetRequestOptiones.name, e));
        }
    };

    private resolveCreateTranscriptRequest = (json: string): void => {
        try {
            const {
                totalAmount
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveCreateTranscriptRequest.name);
            if (result?.status && result.data) {
                this.cleanRequests();
                this.setState({
                    openRequestModal: false
                }, () => {
                    // Case 1: Bill me later
                    // Case 2: No online payment but there is a fee amount
                    if (totalAmount > 0) {
                        this.setState({
                            openNoPaymentModal: true
                        }, () => LayoutActions.setLoading(false));
                    }
                    // Case 3: No online payment and no fee amount (Free transcript)
                    else {
                        this.setState({
                            openFreeModal: true
                        }, () => LayoutActions.setLoading(false));
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveCreateTranscriptRequest.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const {
            requestTranscript
        } = this.state;

        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IRequestTranscriptRes | undefined = LayoutStore.getResources();
        const cultures: ICultures | undefined = LayoutStore.getCultures();

        // Initialize requestTranscript array with 1 element
        requestTranscript.push(this.fillEmptyRequestTranscript());

        if (ready) {
            this.setState({
                cultures,
                requestTranscript,
                resources
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
            componentError,
            countryOptions,
            cultures,
            disclosureStatement,
            enableOnlinePayment,
            expandedPanel,
            feeAmount,
            isDisclosureRead,
            openDisclosureModal,
            openFreeModal,
            openNoPaymentModal,
            openProcessPaymentModal,
            openRequestModal,
            paymentModalOpenSuccess,
            paymentModalOpenFail,
            requestTranscript,
            requireConsent,
            requireOnlinePayment,
            stateOptions,
            paymentTransaction,
            totalAmount,

            resources
        } = this.state;

        const {
            classes,
            width
        } = this.props;

        const onGoBalance = () => {
            window.location.assign(`${Constants.webUrl}/Finances/Balance/`);
        };

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {

            const emptyOption: IDropDownOption = {
                description: resources.lblDropDownEmptyText,
                value: ''
            };

            const setContent = (request: IRequestTranscript, i: number): JSX.Element => (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtNameOfRecipient_${i}`}
                                label={resources.lblNameOfRecipient}
                                value={request.name}
                                error={request.isNameInvalid}
                                helperText={request.isNameInvalid ?
                                    resources.lblErrorNameRecipient : undefined}
                                required
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtHouseNumber_${i}`}
                                label={resources.lblHouseNumber}
                                value={request.houseNumber}
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtAddressLine1_${i}`}
                                label={resources.lblAddressLine1}
                                value={request.addressLine1}
                                error={request.isAddressLine1Invalid}
                                helperText={request.isAddressLine1Invalid ?
                                    resources.lblErrorAddressLine1 : undefined}
                                required
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtAddressLine2_${i}`}
                                label={resources.lblAddressLine2}
                                value={request.addressLine2}
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtAddressLine3_${i}`}
                                label={resources.lblAddressLine3}
                                value={request.addressLine3}
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtAddressLine4_${i}`}
                                label={resources.lblAddressLine4}
                                value={request.addressLine4}
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtCity_${i}`}
                                label={resources.lblCity}
                                value={request.city}
                                error={request.isCityInvalid}
                                helperText={request.isCityInvalid ?
                                    resources.lblErrorCity : undefined}
                                required
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <Dropdown
                                id={`ddlState_${i}`}
                                emptyOption={emptyOption}
                                error={request.isStateProvinceInvalid}
                                helperText={request.isStateProvinceInvalid ?
                                    resources.lblErrorState : undefined}
                                label={resources.lblState}
                                options={stateOptions}
                                required
                                value={request.stateProvince}
                                onChange={this.onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtPostalCode_${i}`}
                                label={resources.lblPostalCode}
                                value={request.postalCode}
                                error={request.isPostalCodeInvalid}
                                helperText={request.isPostalCodeInvalid ?
                                    resources.lblErrorPostalCode : undefined}
                                maxCharacters={15}
                                required
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <Dropdown
                                id={`ddlCountry_${i}`}
                                emptyOption={emptyOption}
                                error={request.isCountryInvalid}
                                helperText={request.isCountryInvalid ?
                                    resources.lblErrorCountry : undefined}
                                label={resources.lblCountry}
                                options={countryOptions}
                                required
                                value={request.country}
                                onChange={this.onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtNumberOfCopies_${i}`}
                                label={resources.lblNumberOfCopies}
                                value={request.numberCopies}
                                error={request.isNumberCopiesInvalid || request.invalidCopies}
                                helperText={request.isNumberCopiesInvalid ?
                                    resources.lblErrorNumberOfCopies : (request.invalidCopies ?
                                        resources.lblCopiesInvalid : undefined)}
                                required
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id={`txtReasonOfRequest_${i}`}
                                label={resources.lblReasonOfRequest}
                                value={request.requestReason}
                                error={request.isRequestReasonInvalid}
                                helperText={request.isRequestReasonInvalid ?
                                    resources.lblErrorReasonOfRequest : undefined}
                                multiline
                                required
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                </>
            );
            contentPage = (
                <>
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs>
                                    <Text size="h2">
                                        {resources.lblEnterInfo}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    {feeAmount > 0 ? (
                                        <Text
                                            id="txtFormatInstructions"
                                            display="inline"
                                        >
                                            {Format.toString(resources.lblFeeInstructions,
                                                [cultures.currencySymbol,
                                                feeAmount.toLocaleString(cultures.currencyCulture)])
                                            }
                                        </Text>
                                    ) : undefined}
                                    <Text
                                        id="txtGeneralInstructions"
                                        display="inline"
                                    >
                                        {resources.lblGeneralInstructions}
                                    </Text>
                                </Grid>
                            </Grid>
                            <br />
                            {requestTranscript.length > 1 ? (
                                requestTranscript.map((request, i) => (
                                    <ExpansionPanel
                                        background="gray"
                                        expandIcon={<Icon name="edit" />}
                                        expanded={expandedPanel === `panel_${i}`}
                                        header={
                                            (request.name
                                                || request.numberCopies) ? (
                                                    <Grid container justifyContent="space-between" alignItems="center">
                                                        <Grid item xs={isWidthUp('sm', width) ? undefined : 9}>
                                                            <Text
                                                                color={(request.isNameInvalid
                                                                    || request.isAddressLine1Invalid
                                                                    || request.isCityInvalid
                                                                    || request.isCountryInvalid
                                                                    || request.isStateProvinceInvalid
                                                                    || request.isPostalCodeInvalid
                                                                    || request.isNumberCopiesInvalid
                                                                    || request.isRequestReasonInvalid) ?
                                                                    'error' : undefined}
                                                            >
                                                                {request.name}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={isWidthUp('sm', width) ? undefined : 3}>
                                                            {isWidthUp('sm', width) ? (
                                                                <>
                                                                    <Text
                                                                        className={classes.spacingLeft}
                                                                        display="inline"
                                                                        color={(request.isNameInvalid
                                                                            || request.isAddressLine1Invalid
                                                                            || request.isCityInvalid
                                                                            || request.isCountryInvalid
                                                                            || request.isStateProvinceInvalid
                                                                            || request.isPostalCodeInvalid
                                                                            || request.isNumberCopiesInvalid
                                                                            || request.isRequestReasonInvalid) ?
                                                                            'error' : undefined}
                                                                    >
                                                                        {`${resources.lblCopies}: ${request.numberCopies}`}
                                                                    </Text>
                                                                    <Text
                                                                        className={classes.spacingLeft}
                                                                        display="inline"
                                                                        color={(request.isNameInvalid
                                                                            || request.isAddressLine1Invalid
                                                                            || request.isCityInvalid
                                                                            || request.isCountryInvalid
                                                                            || request.isStateProvinceInvalid
                                                                            || request.isPostalCodeInvalid
                                                                            || request.isNumberCopiesInvalid
                                                                            || request.isRequestReasonInvalid) ?
                                                                            'error' : undefined}
                                                                    >
                                                                        {`${resources.lblAmount}: ${
                                                                            cultures.currencySymbol}${request.totalAmount.toLocaleString(cultures.currencyCulture)}`}
                                                                    </Text>
                                                                </>
                                                            ) : undefined}
                                                            <IconButton
                                                                aria-label={resources.lblDelete}
                                                                className={classes.spacingLeft}
                                                                color="primary"
                                                                id={`btnDelete_${i}`}
                                                                onClick={this.onDeleteTranscript}
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    <Grid container justifyContent="space-between" alignItems="center">
                                                        <Grid item>
                                                            <Text
                                                                display="inline"
                                                                color={(request.isNameInvalid
                                                                    || request.isAddressLine1Invalid
                                                                    || request.isCityInvalid
                                                                    || request.isCountryInvalid
                                                                    || request.isStateProvinceInvalid
                                                                    || request.isPostalCodeInvalid
                                                                    || request.isNumberCopiesInvalid
                                                                    || request.isRequestReasonInvalid) ?
                                                                    'error' : undefined}
                                                            >
                                                                {resources.lblNew}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item>
                                                            <IconButton
                                                                aria-label={resources.lblDelete}
                                                                color="primary"
                                                                id={`btnDelete_${i}`}
                                                                onClick={this.onDeleteTranscript}
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                        key={`expandedPanelId_${i}`}
                                        onChange={this.onChangeExpansionPanel(`panel_${i}`)}
                                    >
                                        {setContent(request, i)}
                                    </ExpansionPanel>
                                ))
                            ) : setContent(requestTranscript[0], 0)}
                            <br />
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    <Button
                                        color="secondary"
                                        id="btnAddAnother"
                                        onClick={this.onAddAnotherRequest}
                                    >
                                        {resources.btnAddAnother}
                                    </Button>
                                </Grid>
                            </Grid>
                            {requireConsent ? (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={5}>
                                        <Checkbox
                                            id="chkDisclosureRead"
                                            checked={isDisclosureRead}
                                            inputProps={{
                                                'aria-label': `${resources.lblDisclosureRead} ${resources.lblDisclosureStatement}`
                                            }}
                                            onChange={this.onCheckboxChange}
                                        />
                                        <Text id="lblDisclosureRead" display="inline">
                                            {resources.lblDisclosureRead}
                                        </Text>
                                        <Link
                                            id="lnkDisclosureState"
                                            onClick={this.onOpenDisclosureModal}
                                        >
                                            <Text color="inherit" display="inline">
                                                {resources.lblDisclosureStatement}
                                            </Text>
                                        </Link>
                                    </Grid>
                                </Grid>
                            ) : undefined}
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    <Button
                                        disabled={requireConsent && !isDisclosureRead}
                                        id="btnSumitRequest"
                                        onClick={this.onSubmitRequest}
                                    >
                                        {resources.btnSubmitRequest}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    {openRequestModal && requestTranscript.length > 0 ? (
                        <ConfirmRequestModal
                            currencyCulture={cultures.currencyCulture}
                            currencySymbol={cultures.currencySymbol}
                            enableOnlinePayment={enableOnlinePayment}
                            onClose={this.onCloseModal}
                            onPayNow={this.onPayNow}
                            onProcessTranscript={this.onProcessTranscript}
                            open={openRequestModal}
                            requestTranscript={requestTranscript}
                            requireOnlinePayment={requireOnlinePayment}
                            resources={resources.confirmRequestModal}
                            totalAmount={totalAmount}
                        />
                    ) : undefined}
                    {openDisclosureModal ? (
                        <Modal
                            disableHeaderTypography
                            disableBackdropClick
                            id="disclosureModal"
                            header={(
                                <Text size="h2">
                                    {resources.lblDisclosureStatementTitle}
                                </Text>
                            )}
                            maxWidth="md"
                            open={openDisclosureModal}
                            onClose={this.onCloseModal('DisclosureStatement')}
                            showTitleBarClose
                            footer={(
                                <Button
                                    id="btnOkDisclosureModal"
                                    onClick={this.onCloseModal('DisclosureStatement')}
                                >
                                    {resources.btnOk}
                                </Button>
                            )}
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    {disclosureStatement ? (
                                        <Text>
                                            <span dangerouslySetInnerHTML={{ __html: disclosureStatement }} />
                                        </Text>
                                    ) : (
                                            <Text>
                                                {resources.lblNoDisclosureStatement}
                                            </Text>
                                        )}
                                </Grid>
                            </Grid>
                        </Modal>
                    ) : undefined}
                    {openFreeModal ? (
                        <Modal
                            disableHeaderTypography
                            disableBackdropClick
                            id="freeModal"
                            header={(
                                <Text size="h2">
                                    {resources.lblRequestTranscript}
                                </Text>
                            )}
                            maxWidth="md"
                            open={openFreeModal}
                            onClose={this.onCloseModal('Free')}
                            footer={(
                                <Button
                                    id="btnOkFreeModal"
                                    onClick={this.onCloseModal('Free')}
                                >
                                    {resources.btnOk}
                                </Button>
                            )}
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Text>
                                        {resources.lblInstructionsFreeModal}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Modal>
                    ) : undefined}
                    {openNoPaymentModal || paymentModalOpenFail ? (
                        <Modal
                            disableHeaderTypography
                            disableBackdropClick
                            id="noPaymentModal"
                            header={(
                                <>
                                    {paymentModalOpenFail ? (
                                        <Alert
                                            className={classes.alertMargin}
                                            id="failedPaymentWarning"
                                            variant="inline"
                                            open={paymentModalOpenFail}
                                            text={resources.lblPaymentNotProcessed}
                                            type={ResultType.error}
                                        />
                                    ) : undefined}
                                    <Text size="h2">
                                        {resources.lblRequestTranscript}
                                    </Text>
                                </>
                            )}
                            maxWidth="md"
                            open={openNoPaymentModal || paymentModalOpenFail}
                            onClose={this.onCloseModal('NoPayment')}
                            showTitleBarClose
                            footer={(
                                <Button
                                    id="btnViewBalance"
                                    onClick={onGoBalance}
                                >
                                    {resources.btnViewBalance}
                                </Button>
                            )}
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Text>
                                        {resources.lblInstructionsFreeModal}
                                    </Text>
                                    <Text>
                                        {resources.lblInstructionsBalance}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Modal>
                    ) : undefined}
                    {openProcessPaymentModal ? (
                        <ProcessPaymentModal
                            amount={totalAmount}
                            open={openProcessPaymentModal}
                            paymentOrigin={PaymentOrigin.TranscriptRequest}
                            returnUrl=""
                            requestTranscripts={requestTranscript}
                            onClose={this.onCloseModal('ProcessPayment')}
                        />

                    ) : undefined}
                    {paymentModalOpenSuccess ? (
                        <SuccessfulPaymentModal
                            title={resources.lblRequestTranscript}
                            instructions={resources.lblInstructionsFreeModal}
                            open={paymentModalOpenSuccess}
                            paymentOrigin={PaymentOrigin.TranscriptRequest}
                            paymentTransaction={paymentTransaction}
                            onClose={this.onCloseModal('SuccessPayment')}
                        />
                    ) : undefined}
                </>
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
            </Layout>
        );
    }
}

const RequestTranscriptViewWithLayout = withLayout(withStyles(styles)(withWidth()(RequestTranscriptView)));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<RequestTranscriptViewWithLayout />, document.getElementById('root'));