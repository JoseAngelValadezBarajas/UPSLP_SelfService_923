/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FailedPaymentModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';
import { IFailedPaymentModalResources } from '../../Types/Resources/Generic/IFailedPaymentModalResources';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IFailedPaymentModalProps {
    open: boolean;
    paymentOrigin: PaymentOrigin;
    yearTerm?: string;
    onClose: () => void;
    onTryAgain?: () => void;
}

interface IFailedPaymentModalState {
    componentError: boolean;
    resources?: IFailedPaymentModalResources;
}
// #endregion Types

// #region Component
class FailedPaymentModal extends React.Component<IFailedPaymentModalProps, IFailedPaymentModalState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IFailedPaymentModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'FailedPaymentModal';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IFailedPaymentModalState {
        let resources: IFailedPaymentModalResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            resources: resources
        };
    }

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
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
            paymentOrigin,
            yearTerm,
            onClose
        } = this.props;

        const {
            componentError,
            resources
        } = this.state;

        const onGoBalance = () => {
            if (yearTerm) {
                window.location.assign(`${Constants.webUrl}/Finances/Balance/${yearTerm}`);
            }
            else {
                window.location.assign(`${Constants.webUrl}/Finances/Balance`);
            }
        };

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            let footerModal: JSX.Element;
            switch (paymentOrigin) {
                case PaymentOrigin.ConEdRegistration:
                case PaymentOrigin.Registration:
                    footerModal = (
                        <ButtonGroup id="btgFailedPayment">
                            <Button
                                id={'btnGoBalance'}
                                onClick={onGoBalance}
                            >
                                {resources.btnGoBalance}
                            </Button>
                        </ButtonGroup>
                    );
                    break;
                case PaymentOrigin.OnlineDonation:
                    footerModal = (
                        <ButtonGroup id="btgFailedPayment">
                            <Button
                                id={'btnTryAgain'}
                                onClick={onClose}
                            >
                                {resources.btnOk}
                            </Button>
                        </ButtonGroup>
                    );
                    break;
                default:
                    footerModal = (
                        <ButtonGroup id="btgFailedPayment">
                            <Button
                                id={'btnOk'}
                                onClick={onClose}
                            >
                                {resources.btnOk}
                            </Button>
                        </ButtonGroup>
                    );
                    break;
            }

            contentPage = (
                <Modal
                    disableBackdropClick
                    disableEscapeKeyDown
                    id="failedPaymentModal"
                    header={resources.lblTitle}
                    footer={footerModal}
                    maxWidth="sm"
                    open={open}
                    onClose={onClose}
                >
                    <Grid container>
                        <Grid item xs>
                            <Text>
                                {paymentOrigin === PaymentOrigin.Application ?
                                    resources.lblContentTextApplication :
                                    paymentOrigin === PaymentOrigin.OnlineDonation ?
                                        resources.lblContentTextOnlineDonation :
                                        resources.lblContentText}
                            </Text>
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
export default FailedPaymentModal;