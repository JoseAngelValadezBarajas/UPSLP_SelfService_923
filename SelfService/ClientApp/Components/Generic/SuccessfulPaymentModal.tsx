/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: SuccessfulPaymentModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';
import { IPaymentTransaction } from '../../Types/Payment/IPaymentTransaction';
import { ISuccessfulPaymentModalResources } from '../../Types/Resources/Generic/ISuccessfulPaymentModalResources';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface ISuccessfulPaymentModalProps {
    instructions?: string;
    open: boolean;
    paymentOrigin: PaymentOrigin;
    paymentTransaction?: IPaymentTransaction;
    title?: string;
    yearTerm?: string;
    onClose: () => void;
}

interface ISuccessfulPaymentModalState {
    componentError: boolean;
    resources?: ISuccessfulPaymentModalResources;
}

const styles = createStyles({
    containerDetails: {
        backgroundColor: Tokens.colorBrandNeutral200,
        padding: Tokens.spacing50
    }
});

type PropsWithStyles = ISuccessfulPaymentModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class SuccessfulPaymentModal extends React.Component<PropsWithStyles, ISuccessfulPaymentModalState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ISuccessfulPaymentModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'SuccessfulPaymentModal';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ISuccessfulPaymentModalState {
        let resources: ISuccessfulPaymentModalResources | undefined;
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
            classes,
            instructions,
            open,
            paymentOrigin,
            paymentTransaction,
            title,
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
                        <ButtonGroup id="btgSuccessfulPayment">
                            <Button
                                id={'btnGoBalance'}
                                onClick={onGoBalance}
                            >
                                {resources.btnGoBalance}
                            </Button>
                        </ButtonGroup>
                    );
                    break;
                default:
                    footerModal = (
                        <ButtonGroup id="btgSuccessfulPayment">
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
                    id="successfulPaymentModal"
                    header={title ? title : resources.lblTitle}
                    footer={footerModal}
                    maxWidth="sm"
                    open={open}
                    onClose={onClose}
                >
                    {instructions ? (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Text>
                                    {instructions}
                                </Text>
                            </Grid>
                        </Grid>
                    ) : undefined}
                    {paymentTransaction ? (
                        <Grid container>
                            <Grid item xs>
                                <div className={classes.containerDetails}>
                                    <Text size="large">
                                        {resources.lblTitleDetails}
                                    </Text>
                                    <Divider />
                                    <Grid container>
                                        <Grid item xs>
                                            <Text align="right">
                                                {resources.lblAmount}
                                            </Text>
                                        </Grid>
                                        <Grid item xs>
                                            <Text>
                                                {paymentTransaction.amount}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs>
                                            <Text align="right">
                                                {resources.lblDescription}
                                            </Text>
                                        </Grid>
                                        <Grid item xs>
                                            <Text>
                                                {paymentTransaction.description}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs>
                                            <Text align="right">
                                                {resources.lblAuthorizationCode}
                                            </Text>
                                        </Grid>
                                        <Grid item xs>
                                            <Text>
                                                {paymentTransaction.authorizationNumber}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    ) : undefined}
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
export default withStyles(styles)(SuccessfulPaymentModal);