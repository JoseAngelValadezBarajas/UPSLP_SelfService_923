/* Copyright 2019 - 2024 Ellucian Company L.P. and its affiliates.
 * File: PaymentDetailModal.tsx
 * Type: Container component */

// #region Imports
import classnames from 'classnames';
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import RadioGroup from '@hedtech/powercampus-design-system/react/core/RadioGroup';
import Table, { TableBody, TableCell, TableFooter, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Internal components
import Print from './Print';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';
import { IPaymentDiscountCoupon } from '../../Types/Payment/IPaymentDiscountCoupon';
import { IPaymentInfo } from '../../Types/Payment/IPaymentInfo';
import { IPaymentDetailModalResources } from '../../Types/Resources/Generic/IPaymentDetailModalResources';
import { IPrintResources } from '../../Types/Resources/Generic/IPrintResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IPaymentDetailModalProps {
    coupons: IPaymentDiscountCoupon[];
    enableOnlinePayment: boolean;
    open: boolean;
    paymentInfo: IPaymentInfo;
    paymentInfoNoChanges: IPaymentInfo;
    paymentMethod?: string;
    paymentOrigin: PaymentOrigin;
    titleName?: string;
    yearTerm?: string;
    onApplyCoupon?: () => void;
    onChangeCouponCode?: (event: any) => void;
    onChangePaymentAnotherAmount?: (event: any) => void;
    onChangePaymentMethod?: (event: any) => void;
    onClose: () => void;
    onPay: () => void;
    onRemoveCoupon?: (event: any) => void;
}

interface IPaymentDetailModalRes extends IPaymentDetailModalResources {
    printing: IPrintResources;
}

interface IPaymentDetailModalState {
    componentError: boolean;
    resources?: IPaymentDetailModalRes;
}

const styles = (theme: Theme) => createStyles({
    amountContainer: {
        backgroundColor: Tokens.colorBrandNeutral200,
        height: '100px',
        marginBottom: Tokens.spacing50,
        paddingBottom: Tokens.spacing50,
        paddingLeft: Tokens.spacing40,
        paddingRight: Tokens.spacing40,
        paddingTop: Tokens.spacing50,
        width: 'auto'
    },
    discountApplied: {
        color: Tokens.colorTextAlertNeutral
    },
    footerPayment: {
        backgroundColor: Tokens.colorBrandNeutral200,
        paddingBottom: Tokens.spacing40,
        paddingTop: Tokens.spacing30
    },
    footerTextSpacing: {
        marginTop: Tokens.spacing30
    },
    instructionsContainer: {
        marginBottom: Tokens.sizingSmall,
        marginTop: Tokens.sizingSmall
    },
    noBottomBorder: {
        borderBottomColor: `${Tokens.colorBrandNeutral100}!important`
    },
    noDeleteButton: {
        width: Tokens.spacing70
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '50%'
            }
        }
    }
});

type PropsWithStyles = IPaymentDetailModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class PaymentDetailModal extends React.Component<PropsWithStyles, IPaymentDetailModalState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IPaymentDetailModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'PaymentDetailModal';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IPaymentDetailModalState {
        let resources: IPaymentDetailModalRes | undefined;
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
            coupons,
            enableOnlinePayment,
            open,
            paymentInfo,
            paymentInfoNoChanges,
            paymentMethod,
            paymentOrigin,
            titleName,
            yearTerm,
            onApplyCoupon,
            onChangeCouponCode,
            onChangePaymentAnotherAmount,
            onChangePaymentMethod,
            onClose,
            onPay,
            onRemoveCoupon
        } = this.props;

        const {
            componentError,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            let paymentMethods: IRadioOption[] | undefined;
            let hasCharges: boolean = false;

            if (paymentOrigin === PaymentOrigin.Registration) {
                paymentMethods = [];
                hasCharges = paymentInfo.currentBalanceValue > 0 || paymentInfo.totalAmountValue > 0;

                if (hasCharges) {
                    paymentMethods.push({
                        description: Format.toString(resources.formatBalance, [paymentInfo.currentBalance]),
                        disabled: paymentInfo.currentBalanceValue < 0,
                        value: '1'
                    } as IRadioOption);
                    // TODO: Review if this code is useful for the next story about the total charges and taxes
                    // paymentMethods.push({
                    //    description: Format.toString(resources.formatTotal, [paymentInfo.totalAmount]),
                    //    disabled: paymentInfo.totalAmountValue < 0,
                    //    value: '2'
                    // } as IRadioOption);

                    let errorAnotherAmount: boolean = false;
                    let errorTextAnotherAmount: string | undefined;
                    if (paymentMethod === '0' && paymentInfo.modified) {
                        errorAnotherAmount = !Boolean(paymentInfo.anotherAmount)
                            || paymentInfo.invalidAnotherAmount;
                        errorTextAnotherAmount = !Boolean(paymentInfo.anotherAmount) ?
                            resources.lblAnotherAmountRequired
                            : (paymentInfo.invalidAnotherAmount ?
                                resources.lblAnotherAmountInvalid
                                : undefined);
                    }

                    paymentMethods.push({
                        description: resources.lblAnotherAmount,
                        nodeComplement: (
                            <TextField
                                disabled={paymentMethod !== '0'}
                                error={errorAnotherAmount}
                                helperText={errorTextAnotherAmount}
                                id="txtAmount"
                                size="small"
                                value={paymentMethod === '0' ? paymentInfo.anotherAmount : ''}
                                onChange={onChangePaymentAnotherAmount}
                            />
                        ),
                        value: '0'
                    } as IRadioOption);
                }
            }
            else if (paymentOrigin === PaymentOrigin.ConEdRegistration && !paymentInfo.useTransactionChargesOnly) {
                hasCharges = paymentInfo.paymentDueValue > 0;
            }
            else {
                hasCharges = paymentInfo.totalAmountValue > 0;
            }

            let headerModal: JSX.Element;
            headerModal = (
                <>
                    <Text size="h2">
                        {Format.toString(resources.formatTitle, [yearTerm || titleName || ''])}
                    </Text>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs>
                            <Text className={classes.instructionsContainer}>
                                {resources.lblInstructions}
                            </Text>
                        </Grid>
                        {((paymentOrigin === PaymentOrigin.Registration
                            || paymentOrigin === PaymentOrigin.ConEdRegistration)
                            && paymentInfo.statementNumber) && (
                                <Grid item>
                                    <Print
                                        lblPrint={resources.printing.lblPrintStatement}
                                        resources={resources.printing}
                                        link={`${Constants.webUrl}/Students/StatementsReport?statementNumber=${paymentInfo.statementNumber}&currentPage=${Constants.headersRequestsJson['X-Current-Page']}`}
                                    />
                                </Grid>
                            )}
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            {paymentOrigin === PaymentOrigin.Registration
                                && paymentMethods && hasCharges && (
                                    <RadioGroup
                                        id="rbgPaymentMethods"
                                        name="paymentMethods"
                                        options={paymentMethods}
                                        value={paymentMethod}
                                        onChange={onChangePaymentMethod}
                                    />
                                )}
                            {paymentOrigin !== PaymentOrigin.Registration && (
                                <div className={classes.amountContainer}>
                                    <Grid
                                        container
                                        alignItems="center"
                                        direction="column"
                                        justifyContent="center"
                                        spacing={1}
                                    >
                                        {paymentOrigin === PaymentOrigin.ConEdRegistration
                                            && !paymentInfo.useTransactionChargesOnly ? (
                                                <>
                                                    <Grid item xs>
                                                        <Text size="h3">
                                                            {paymentInfo.paymentDue}
                                                        </Text>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Text>
                                                            {resources.lblPaymentDue}
                                                        </Text>
                                                    </Grid>
                                                </>
                                            ) : (
                                                <>
                                                    <Grid item xs>
                                                        {paymentInfoNoChanges.totalAmountValue !== paymentInfo.totalAmountValue ? (
                                                            <Text className={classes.discountApplied} color="primary" size="h3">
                                                                {paymentInfo.totalAmount}
                                                            </Text>
                                                        ) : (
                                                                <Text size="h3">
                                                                    {paymentInfo.totalAmount}
                                                                </Text>
                                                            )}
                                                    </Grid>
                                                    <Grid item xs>
                                                        {paymentInfoNoChanges.totalAmountValue !== paymentInfo.totalAmountValue ? (
                                                            <Text className={classes.discountApplied}>
                                                                {resources.lblDiscountedTotal}
                                                            </Text>
                                                        ) : (
                                                                <Text>
                                                                    {resources.lblTotal}
                                                                </Text>
                                                            )}
                                                    </Grid>
                                                </>
                                            )}
                                    </Grid>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </>
            );

            let footerModal: JSX.Element;
            footerModal = enableOnlinePayment && hasCharges ? (
                <ButtonGroup id="btgPaymentDetail">
                    {!paymentInfo.requireOnlinePayment &&
                        (paymentOrigin === PaymentOrigin.Registration
                            || paymentOrigin === PaymentOrigin.ConEdRegistration) && (
                            <Button
                                id={'btnBillMeLater'}
                                color="secondary"
                                onClick={onClose}
                            >
                                {resources.btnBillMeLater}
                            </Button>
                        )}
                    <Button
                        id={'btnPay'}
                        onClick={onPay}
                    >
                        {resources.btnPay}
                    </Button>
                </ButtonGroup>
            ) : (
                    <Button
                        id={'btnOk'}
                        onClick={onClose}
                    >
                        {resources.btnOk}
                    </Button>
                );

            let rowClassName: string | undefined;
            let isFirstRow: boolean;
            contentPage = (
                <Modal
                    disableBackdropClick
                    disableEscapeKeyDown
                    disableHeaderTypography
                    id="paymentDetailModal"
                    header={headerModal}
                    maxWidth="md"
                    footer={footerModal}
                    open={open}
                    showTitleBarClose={false}
                    onClose={onClose}
                >
                    {paymentOrigin === PaymentOrigin.ConEdRegistration && (
                        <Grid container>
                            <Grid item xs={12}>
                                <Text size="h4">
                                    {resources.lblDiscountTitle}
                                </Text>
                                <Text>
                                    {resources.lblDiscountInstructions}
                                </Text>
                            </Grid>
                            <Grid item xs={12}>
                                {coupons.map((coupon, ci) => (
                                    <Grid container alignItems="center" key={`coupon_${ci}`}>
                                        <Grid item xs={12} sm={8} md={9} lg={6}>
                                            <Grid container alignItems="center">
                                                <Grid item>
                                                    {!coupon.isNew ? (
                                                        <IconButton
                                                            aria-label={resources.btnDeleteCoupon}
                                                            color="secondary"
                                                            id={`btnRemoveDiscount_${ci}`}
                                                            onClick={onRemoveCoupon}
                                                        >
                                                            <Icon large name="trash" />
                                                        </IconButton>
                                                    ) : (<div className={classes.noDeleteButton} />)}
                                                </Grid>
                                                <Grid item xs>
                                                    <TextField
                                                        disabled={coupon.isApplied}
                                                        error={coupon.isModified && (!Boolean(coupon.code) || !coupon.isValid)}
                                                        helperText={coupon.isModified ? (!Boolean(coupon.code) ?
                                                            resources.lblDiscountCouponRequired
                                                            : (!coupon.isValid ?
                                                                resources.lblDiscountCouponInvalid
                                                                : undefined))
                                                            : undefined}
                                                        id={`txtDiscountCoupon_${ci}`}
                                                        label={resources.lblDiscountCoupon}
                                                        maxCharacters={20}
                                                        value={coupon.code || ''}
                                                        onChange={onChangeCouponCode}
                                                        onEnterPress={onApplyCoupon}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={3} lg={6}>
                                            <Grid container>
                                                <Grid item xs>
                                                    {!coupon.isApplied && (
                                                        <Button
                                                            id="btnApplyDiscount"
                                                            onClick={onApplyCoupon}
                                                        >
                                                            {resources.btnApplyCoupon}
                                                        </Button>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                    <Grid container>
                        <Grid item xs={12}>
                            <Text size="h4">
                                {resources.lblDetail}
                            </Text>
                        </Grid>
                    </Grid>
                    {paymentInfo.chargeCredits && (
                        <Grid container spacing={0}>
                            <Grid item xs>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblPaymentCharges"
                                >
                                    <TableHead>
                                        <TableRow>
                                            {paymentOrigin === PaymentOrigin.ConEdRegistration && (
                                                <TableCell component="th">
                                                    {resources.lblCourse}
                                                </TableCell>
                                            )}
                                            <TableCell component="th">
                                                {resources.lblCharge}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                {resources.lblAmount}
                                            </TableCell>
                                            {paymentOrigin === PaymentOrigin.ConEdRegistration
                                                && paymentInfo.chargeCredits.find(c => c.isCredit)
                                                && (
                                                    <TableCell component="th" align="right">
                                                        {resources.lblDiscount}
                                                    </TableCell>
                                                )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentInfo.chargeCredits.map((row, cci) => {
                                            if (paymentOrigin === PaymentOrigin.ConEdRegistration) {
                                                rowClassName = undefined;
                                                isFirstRow = true;
                                                if (cci < paymentInfo.chargeCredits.length - 1
                                                    && row.sectionId === paymentInfo.chargeCredits[cci + 1].sectionId) {
                                                    rowClassName = classes.noBottomBorder;
                                                }
                                                if (cci > 0
                                                    && row.sectionId === paymentInfo.chargeCredits[cci - 1].sectionId) {
                                                    isFirstRow = false;
                                                }
                                            }
                                            return (
                                                <TableRow
                                                    key={`paymentCredit_${cci}`}
                                                >
                                                    {paymentOrigin === PaymentOrigin.ConEdRegistration && (
                                                        <TableCell
                                                            classes={{ root: rowClassName }}
                                                            columnName={resources.lblCharge}
                                                            component="th"
                                                            scope="row"
                                                        >
                                                            {isFirstRow && !row.isCredit && !row.isOther && (
                                                                <span>
                                                                    {(row.eventId && row.eventName) ? Format.toString(resources.formatTitleSection, [row.eventId, row.eventName]) : '' }
                                                                </span>
                                                            )}
                                                            {isFirstRow && row.isOther && (
                                                                <span>
                                                                    {resources.lblOthers}
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                    )}
                                                    <TableCell
                                                        classes={{ root: rowClassName }}
                                                        columnName={resources.lblCharge}
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        <span>
                                                            {row.description}
                                                        </span>
                                                        {paymentOrigin === PaymentOrigin.Application
                                                            && paymentInfo.chargeCredits
                                                            && paymentInfo.chargeCredits.length > 0
                                                            && paymentInfo.totalAmount !== paymentInfo.chargeCredits[0].amount && (
                                                                <>
                                                                    <br />
                                                                    <span>
                                                                        {resources.lblProgramFees}
                                                                    </span>
                                                                </>
                                                            )}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        classes={{ root: rowClassName }}
                                                        columnName={resources.lblAmount}
                                                    >
                                                        <span>
                                                            {row.amount}
                                                        </span>
                                                    </TableCell>
                                                    {paymentOrigin === PaymentOrigin.ConEdRegistration
                                                        && paymentInfo.chargeCredits.find(c => c.isCredit)
                                                        && (
                                                            <TableCell
                                                                align="right"
                                                                classes={{ root: rowClassName }}
                                                                columnName={resources.lblDiscount}
                                                            >
                                                                <span>
                                                                    {row.discountAmount || '-'}
                                                                </span>
                                                            </TableCell>
                                                        )}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <td colSpan={4} className={classes.footerPayment}>
                                                {paymentInfoNoChanges.totalAmountValue !== paymentInfo.totalAmountValue ? (
                                                    <Text
                                                        align="right"
                                                        className={classnames(classes.footerTextSpacing, classes.discountApplied)}
                                                    >
                                                        {Format.toString(resources.formatDiscountedTotal, [paymentInfo.totalAmount])}
                                                    </Text>
                                                ) : (
                                                        <Text
                                                            align="right"
                                                            className={classes.footerTextSpacing}
                                                        >
                                                            {Format.toString(resources.formatTotal, [paymentInfo.totalAmount])}
                                                        </Text>
                                                    )}
                                                {paymentOrigin === PaymentOrigin.Registration && (
                                                    <Text align="right" className={classes.footerTextSpacing}>
                                                        {Format.toString(resources.formatPaymentDue, [paymentInfo.paymentDue])}
                                                    </Text>
                                                )}
                                                {paymentOrigin === PaymentOrigin.ConEdRegistration
                                                    && !paymentInfo.useTransactionChargesOnly && (
                                                        <Text align="right" className={classes.footerTextSpacing}>
                                                            {Format.toString(resources.formatPaymentDue, [paymentInfo.paymentDue])}
                                                        </Text>
                                                    )}
                                            </td>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </Grid>
                        </Grid>
                    )}
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
export default withStyles(styles)(PaymentDetailModal);