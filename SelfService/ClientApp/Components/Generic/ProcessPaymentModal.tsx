/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ProcessPaymentModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';
import { IYearTerm } from '../../Types/Generic/IYearTerm';
import { IRequestTranscript } from '../../Types/Grades/IRequestTranscript';
import { IPaymentPeriod } from '../../Types/Payment/IPaymentPeriod';
import { IPaymentRequest } from '../../Types/Payment/IPaymentRequest';
import { IGiftCampaign } from '../../Types/MakeGift/IGiftCampaign';
import { IProcessPaymentModalResources } from '../../Types/Resources/Generic/IProcessPaymentModalResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../Requests/Generic/ProcessPaymentModal';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IProcessPaymentModalProps {
    amount: number;
    applicationId?: number;
    conEdTransactionId?: number;
    giftCampaigns?: IGiftCampaign[];
    open: boolean;
    paymentOrigin: PaymentOrigin;
    personId?: number;
    requestTranscripts?: IRequestTranscript[];
    returnUrl?: string;
    termSessionId?: string;
    yearTerm?: string;
    onClose: () => void;
}

interface IProcessPaymentModalState {
    componentError: boolean;
    resources?: IProcessPaymentModalResources;
}
// #endregion Types

// #region Component
class ProcessPaymentModal extends React.Component<IProcessPaymentModalProps, IProcessPaymentModalState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IProcessPaymentModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'ProcessPaymentModal';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IProcessPaymentModalState {
        let resources: IProcessPaymentModalResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            resources: resources
        };
    }

    // #region Events
    private onOk = (): void => {
        try {
            const {
                amount,
                applicationId,
                conEdTransactionId,
                giftCampaigns,
                paymentOrigin,
                personId,
                requestTranscripts,
                returnUrl,
                termSessionId,
                yearTerm
            } = this.props;

            const paymentRequest: IPaymentRequest = {
                amount: amount,
                applicationId: applicationId,
                conEdTransactionId: conEdTransactionId,
                paymentOrigin: paymentOrigin,
                personId: personId,
                returnUrl: returnUrl
            } as IPaymentRequest;
            if (termSessionId) {
                const periodId = termSessionId.split('/');
                paymentRequest.paymentPeriod = {
                    sessionPeriodId: periodId[1] ? Number(periodId[1]) : null,
                    termPeriodId: periodId[0] ? Number(periodId[0]) : null
                } as IPaymentPeriod;
            }
            else if (yearTerm) {
                const split = yearTerm.split('/');
                paymentRequest.yearTerm = {
                    term: split[1],
                    year: Number(split[0])
                } as IYearTerm;
            }
            if (requestTranscripts) {
                Requests.postProcessTranscriptPayment(paymentRequest, this.resolvePostProcessPayment, this.logError, requestTranscripts);
            }
            else if (giftCampaigns) {
                Requests.postProcessDonationPayment(paymentRequest, this.resolvePostProcessPayment, this.logError, giftCampaigns);
            }
            else {
                Requests.postProcessPayment(paymentRequest, this.resolvePostProcessPayment, this.logError);
            }
            LayoutActions.setLoading(true);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOk.name, e));
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

    private resolvePostProcessPayment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostProcessPayment.name);
            if (result?.status) {
                if (result.data) {
                    window.location.replace(encodeURI(result.data));
                    LayoutActions.setLoading(false);
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostProcessPayment.name, e));
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
            open,
            onClose
        } = this.props;

        const {
            componentError,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            contentPage = (
                <Modal
                    disableBackdropClick
                    disableEscapeKeyDown
                    header={resources.lblTitle}
                    id="processPaymentModal"
                    footer={(
                        <ButtonGroup id="btgProcessPayment">
                            <Button
                                id={'btnCancel'}
                                color="secondary"
                                onClick={onClose}
                            >
                                {resources.btnCancel}
                            </Button>
                            <Button
                                id={'btnOk'}
                                onClick={this.onOk}
                            >
                                {resources.btnOk}
                            </Button>
                        </ButtonGroup>
                    )}
                    maxWidth="sm"
                    open={open}
                    showTitleBarClose={false}
                    onClose={onClose}
                >
                    <Grid container>
                        <Grid item xs>
                            <Alert
                                id="msgProcessPayment"
                                open
                                text={resources.lblContentText}
                                type={ResultType.info}
                            />
                        </Grid>
                    </Grid>
                </Modal>
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
export default ProcessPaymentModal;