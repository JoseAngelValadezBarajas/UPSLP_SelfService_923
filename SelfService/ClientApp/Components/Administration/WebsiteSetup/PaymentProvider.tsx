/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: PaymentProvider.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IPayment } from '../../../Types/InstitutionSettings/IPayment';
import { IPaymentProviderResources } from '../../../Types/Resources/Administration/IPaymentProviderResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/PaymentProvider';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IPaymentProviderProps {
    lblSuccessSave: string;
}

interface IPaymentProviderState {
    componentError: boolean;
    resources?: IPaymentProviderResources;
    urls?: IPayment;
}
// #endregion Types

// #region Component
class PaymentProvider extends React.Component<IPaymentProviderProps, IPaymentProviderState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IPaymentProviderState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'PaymentProvider';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IPaymentProviderState {
        let resources: IPaymentProviderResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            resources: resources
        };
    }

    // #region Events
    private onChangeTextfield = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                urls
            } = this.state;

            const id: string = event.target.id;
            const value: string = event.target.value.trim();
            if (value.length <= 2048 && urls) {
                switch (id) {
                    case 'txtRegistrationPayment':
                        urls.registration = value;
                        if (!urls.registration) {
                            Requests.postValidateRegistrationPayment(this.resolvePostValidateRegistrationPayment, this.logError);
                        }
                        else {
                            urls.registrationIsValid = true;
                        }
                        break;

                    case 'txtBalancePayment':
                        urls.balance = value;
                        if (!urls.balance) {
                            Requests.postValidateBalancePayment(this.resolvePostValidateBalancePayment, this.logError);
                        }
                        else {
                            urls.balanceIsValid = true;
                        }
                        break;

                    case 'txtApplicationPayment':
                        urls.application = value;
                        break;

                    case 'txtTranscriptRequestPayment':
                        urls.transcriptRequest = value;
                        if (!urls.transcriptRequest) {
                            Requests.postValidateTranscriptRequestPayment(this.resolvePostValidateTranscriptRequestPayment,
                                this.logError);
                        }
                        else {
                            urls.transcriptRequestIsValid = true;
                        }
                        break;

                    case 'txtConEdRegistrationPayment':
                        urls.conEdRegistration = value;
                        if (!urls.conEdRegistration) {
                            Requests.postValidateConEdRegistrationPayment(this.resolvePostValidateConEdRegistrationPayment,
                                this.logError);
                        }
                        else {
                            urls.conEdRegistrationIsValid = true;
                        }
                        break;

                    case 'txtDonationsPayment':
                        urls.donations = value;
                        break;
                }
            }
            this.setState({
                urls: urls
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextfield.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                urls
            } = this.state;

            if (urls && urls.registrationIsValid && urls.balanceIsValid && urls.transcriptRequestIsValid && urls.conEdRegistrationIsValid) {
                LayoutActions.setLoading(true);
                Requests.postSaveSettings(urls, this.resolvePostSaveSettings, this.logError);
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
                const urls: IPayment = result.data;
                if (urls) {
                    urls.balanceIsValid = true;
                    urls.conEdRegistrationIsValid = true;
                    urls.registrationIsValid = true;
                    urls.transcriptRequestIsValid = true;
                }
                this.setState({
                    urls: urls
                });
                LayoutActions.setLoading(false);
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
                    urls
                } = this.state;

                if (urls) {
                    urls.registrationIsValid = result.data;
                    this.setState({
                        urls: urls
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidateRegistrationPayment.name, e));
        }
    };

    private resolvePostValidateBalancePayment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostValidateBalancePayment.name);

            if (result?.status) {
                const {
                    urls
                } = this.state;

                if (urls) {
                    urls.balanceIsValid = result.data;
                    this.setState({
                        urls: urls
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidateBalancePayment.name, e));
        }
    };

    private resolvePostValidateTranscriptRequestPayment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostValidateTranscriptRequestPayment.name);

            if (result?.status) {
                const {
                    urls
                } = this.state;

                if (urls) {
                    urls.transcriptRequestIsValid = result.data;
                    this.setState({
                        urls: urls
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidateTranscriptRequestPayment.name, e));
        }
    };

    private resolvePostValidateConEdRegistrationPayment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostValidateConEdRegistrationPayment.name);

            if (result?.status) {
                const {
                    urls
                } = this.state;

                if (urls) {
                    urls.conEdRegistrationIsValid = result.data;
                    this.setState({
                        urls: urls
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidateConEdRegistrationPayment.name, e));
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
            componentError,
            resources,
            urls
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && urls) {
            contentPage = (
                <>
                    <Grid container>
                        <Grid item xs>
                            <Text size="large">
                                {resources.lblInstructions}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs>
                            <Text>
                                {resources.lblParametersInstructions}
                            </Text>
                            <Text>
                                {'{0} - Transaction id'}
                            </Text>
                            <Text>
                                {'{1} - Transaction amount'}
                            </Text>
                            <Text>
                                {'{2} - Transaction description'}
                            </Text>
                            <Text>
                                {'? - Merchant id / Company id / Order type'}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                error={!urls.registrationIsValid}
                                helperText={!urls.registrationIsValid ? resources.lblRegistrationInvalid : undefined}
                                id="txtRegistrationPayment"
                                label={resources.lblRegistration}
                                maxCharacters={2048}
                                value={urls.registration}
                                onChange={this.onChangeTextfield}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={!urls.balanceIsValid}
                                helperText={!urls.balanceIsValid ? resources.lblBalanceInvalid : undefined}
                                id="txtBalancePayment"
                                label={resources.lblBalance}
                                maxCharacters={2048}
                                value={urls.balance}
                                onChange={this.onChangeTextfield}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="txtApplicationPayment"
                                label={resources.lblApplication}
                                maxCharacters={2048}
                                value={urls.application}
                                onChange={this.onChangeTextfield}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={!urls.transcriptRequestIsValid}
                                helperText={!urls.transcriptRequestIsValid ?
                                    resources.lblTranscriptRequestValid : undefined}
                                id="txtTranscriptRequestPayment"
                                label={resources.lblTranscriptRequest}
                                maxCharacters={2048}
                                value={urls.transcriptRequest}
                                onChange={this.onChangeTextfield}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={!urls.conEdRegistrationIsValid}
                                helperText={!urls.conEdRegistrationIsValid ?
                                    resources.lblConEdRegistrationValid : undefined}
                                id="txtConEdRegistrationPayment"
                                label={resources.lblConEdRegistration}
                                maxCharacters={2048}
                                value={urls.conEdRegistration}
                                onChange={this.onChangeTextfield}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="txtDonationsPayment"
                                label={resources.lblDonations}
                                maxCharacters={2048}
                                value={urls.donations}
                                onChange={this.onChangeTextfield}
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Grid container>
                        <Grid item xs>
                            <Button
                                id="btnSavePaymentProvider"
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
export default PaymentProvider;