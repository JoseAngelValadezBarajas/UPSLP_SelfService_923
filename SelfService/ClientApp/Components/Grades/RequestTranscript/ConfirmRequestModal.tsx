/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ConfirmRequestModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Generic components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IRequestTranscript } from '../../../Types/Grades/IRequestTranscript';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
// #endregion Imports

// #region Types
export interface IConfirmRequestModalProps {
    currencyCulture: string;
    currencySymbol: string;
    enableOnlinePayment: boolean;
    onClose: (modal: string) => () => void;
    onPayNow: () => void;
    onProcessTranscript: () => void;
    open: boolean;
    requestTranscript: IRequestTranscript[];
    requireOnlinePayment: boolean;
    resources: IConfirmRequestModalResProps;
    totalAmount: number;
}

export interface IConfirmRequestModalResProps {
    btnBillMeLater: string;
    btnConfirm: string;
    btnPayNow: string;
    lblAddressLine1: string;
    lblAddressLine2: string;
    lblAddressLine3: string;
    lblAddressLine4: string;
    lblAmount: string;
    lblCity: string;
    lblConfirmRequest: string;
    lblCopies: string;
    lblCountry: string;
    lblDetail: string;
    lblHouseNumber: string;
    lblNameOfRecipient: string;
    lblNumberOfCopies: string;
    lblPostalCode: string;
    lblReasonOfRequest: string;
    lblReviewInformation: string;
    lblState: string;
    lblTotal: string;
}

const styles = createStyles({
    headerPayment: {
        backgroundColor: Tokens.colorBackgroundDefault,
        marginBottom: Tokens.spacing40
    },
    spacingLeft: {
        marginLeft: Tokens.spacing40
    },
    totalAmount: {
        fontSize: Tokens.fontSizeHeader1
    }
});

type PropsWithStyles = IConfirmRequestModalProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
const ConfirmRequestModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        currencyCulture,
        currencySymbol,
        enableOnlinePayment,
        onClose,
        onPayNow,
        onProcessTranscript,
        open,
        requestTranscript,
        requireOnlinePayment,
        totalAmount,
        width,

        resources
    } = props;

    return (
        <Modal
            disableHeaderTypography
            disableBackdropClick
            id="courseDetailModalTitle"
            header={(
                <Text size="h2">
                    {resources.lblConfirmRequest}
                </Text>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose('Request')}
        >
            <Grid container spacing={3}>
                <Grid item xs>
                    {totalAmount > 0 ? (
                        <>
                            <Text size="h3">
                                {resources.lblReviewInformation}
                            </Text>
                            <br />
                            <Grid container spacing={3} justifyContent="center" className={classes.headerPayment}>
                                <Grid item xs>
                                    <Text className={classes.totalAmount} align="center">
                                        {`${currencySymbol}${totalAmount.toLocaleString(currencyCulture)}`}
                                    </Text>
                                    <br />
                                    <Text align="center">
                                        {resources.lblTotal}
                                    </Text>
                                </Grid>
                            </Grid>
                        </>
                    ) : undefined}
                    <Grid
                        container
                        spacing={3}
                        justifyContent={isWidthUp('sm', width) ? 'flex-end' : undefined}
                    >
                        <Grid item xs={isWidthUp('sm', width) ? undefined : 12}>
                            {enableOnlinePayment && totalAmount > 0 ? (
                                <ButtonGroup id="btgPayment">
                                    {!requireOnlinePayment ? (
                                        <Button
                                            id="btnBillMeLater"
                                            color="secondary"
                                            onClick={onProcessTranscript}
                                        >
                                            {resources.btnBillMeLater}
                                        </Button>
                                    ) : undefined}
                                    <Button
                                        id="btnPayNow"
                                        onClick={onPayNow}
                                    >
                                        {resources.btnPayNow}
                                    </Button>
                                </ButtonGroup>
                            ) : (
                                    <Button
                                        id="btnConfirm"
                                        onClick={onProcessTranscript}
                                    >
                                        {resources.btnConfirm}
                                    </Button>
                                )}
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Text size="h3">
                                {resources.lblDetail}
                            </Text>
                            <br />
                            {requestTranscript.map((request, i) => (
                                <ExpansionPanel
                                    background="gray"
                                    header={(
                                        <Grid container justifyContent="space-between" alignItems="center">
                                            <Grid item xs={isWidthUp('sm', width) ? undefined : 9}>
                                                <Text>
                                                    {request.name}
                                                </Text>
                                            </Grid>
                                            <Grid item xs={isWidthUp('sm', width) ? undefined : 3}>
                                                {isWidthUp('sm', width) ? (
                                                    <Text
                                                        className={classes.spacingLeft}
                                                        display="inline"
                                                    >
                                                        {`${resources.lblCopies}: ${request.numberCopies}`}
                                                    </Text>
                                                ) : undefined}
                                                {totalAmount > 0 ? (
                                                    <Text
                                                        className={classes.spacingLeft}
                                                        display="inline"
                                                    >
                                                        {isWidthUp('sm', width) ? `${resources.lblAmount}: ${currencySymbol}${request.totalAmount.toLocaleString(currencyCulture)}`
                                                            : `${currencySymbol}${request.totalAmount.toLocaleString(currencyCulture)}`}
                                                    </Text>
                                                ) : undefined}
                                            </Grid>
                                        </Grid>
                                    )}
                                    key={`expandedPanelId_${i}`}
                                >
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtNameOfRecipient_${i}`}
                                            >
                                                {resources.lblNameOfRecipient + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtNameOfRecipientReq_${i}`}
                                                >
                                                    {request.name}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtNameOfRecipientReq_${i}`}
                                                >
                                                    {request.name}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtHouseNumber_${i}`}
                                            >
                                                {resources.lblHouseNumber + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtHouseNumberReq_${i}`}
                                                >
                                                    {request.houseNumber}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtHouseNumberReq_${i}`}
                                                >
                                                    {request.houseNumber}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtAddressLine1_${i}`}
                                            >
                                                {resources.lblAddressLine1 + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtAddressLine1Req_${i}`}
                                                >
                                                    {request.addressLine1}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtAddressLine1Req_${i}`}
                                                >
                                                    {request.addressLine1}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtAddressLine2_${i}`}
                                            >
                                                {resources.lblAddressLine2 + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtAddressLine2Req_${i}`}
                                                >
                                                    {request.addressLine2}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtAddressLine2Req_${i}`}
                                                >
                                                    {request.addressLine2}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtAddressLine3_${i}`}
                                            >
                                                {resources.lblAddressLine3 + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtAddressLine3Req_${i}`}
                                                >
                                                    {request.addressLine3}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtAddressLine3Req_${i}`}
                                                >
                                                    {request.addressLine3}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtAddressLine4_${i}`}
                                            >
                                                {resources.lblAddressLine4 + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtAddressLine4Req_${i}`}
                                                >
                                                    {request.addressLine4}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtAddressLine4Req_${i}`}
                                                >
                                                    {request.addressLine4}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtCity_${i}`}
                                            >
                                                {resources.lblCity + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtCityReq_${i}`}
                                                >
                                                    {request.city}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtCityReq_${i}`}
                                                >
                                                    {request.city}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtState_${i}`}
                                            >
                                                {resources.lblState + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtStateReq_${i}`}
                                                >
                                                    {request.stateProvinceName}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtStateReq_${i}`}
                                                >
                                                    {request.stateProvinceName}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtPostalCode_${i}`}
                                            >
                                                {resources.lblPostalCode + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtPostalCodeReq_${i}`}
                                                >
                                                    {request.postalCode}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtPostalCodeReq_${i}`}
                                                >
                                                    {request.postalCode}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtCountry_${i}`}
                                            >
                                                {resources.lblCountry + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtCountryReq_${i}`}
                                                >
                                                    {request.countryName}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtCountryReq_${i}`}
                                                >
                                                    {request.countryName}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtNumberOfCopies_${i}`}
                                            >
                                                {resources.lblNumberOfCopies + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtNumberOfCopiesReq_${i}`}
                                                >
                                                    {request.numberCopies}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtNumberOfCopiesReq_${i}`}
                                                >
                                                    {request.numberCopies}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                    {totalAmount > 0 ? (
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    weight="strong"
                                                    id={`txtAmount_${i}`}
                                                >
                                                    {resources.lblAmount + ':'}
                                                </Text>
                                                {isWidthUp('sm', width) ? undefined : (
                                                    <Text
                                                        id={`txtAmount_${i}`}
                                                    >
                                                        {`${currencySymbol}${request.totalAmount.toLocaleString(currencyCulture)}`}
                                                    </Text>
                                                )}
                                            </Grid>
                                            {isWidthUp('sm', width) ? (
                                                <Grid item xs={12} sm={6}>
                                                    <Text
                                                        id={`txtAmount_${i}`}
                                                    >
                                                        {`${currencySymbol}${request.totalAmount.toLocaleString(currencyCulture)}`}
                                                    </Text>
                                                </Grid>
                                            ) : undefined}
                                        </Grid>
                                    ) : undefined}
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Text
                                                weight="strong"
                                                id={`txtReason_${i}`}
                                            >
                                                {resources.lblReasonOfRequest + ':'}
                                            </Text>
                                            {isWidthUp('sm', width) ? undefined : (
                                                <Text
                                                    id={`txtReasonReq_${i}`}
                                                >
                                                    {request.requestReason}
                                                </Text>
                                            )}
                                        </Grid>
                                        {isWidthUp('sm', width) ? (
                                            <Grid item xs={12} sm={6}>
                                                <Text
                                                    id={`txtReasonReq_${i}`}
                                                >
                                                    {request.requestReason}
                                                </Text>
                                            </Grid>
                                        ) : undefined}
                                    </Grid>
                                </ExpansionPanel>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Modal >
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(ConfirmRequestModal));