/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: BalanceOptions.tsx
 * Type: Presentation  component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import RadioGroup from '@hedtech/powercampus-design-system/react/core/RadioGroup';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
import { IBalancePayment } from '../../../Types/Balance/IBalancePayment';
// #endregion Imports

// #region Types
export interface IBalanceOptionsProps {
    balancePayment?: IBalancePayment;
    lblDropDownEmptyText: string;
    periods: IDropDownOption[] | undefined;
    periodSelected: string | undefined;
    resources: IBalanceOptionsResProps;
    views: IRadioOption[];
    viewSelected: string;
    onChangePaymentAmount: (event: any) => void;
    onChangePeriod: (optionSelected: IDropDownOption, id: string) => void;
    onChangePeriodToPayment: (optionSelected: IDropDownOption, id: string) => void;
    onChangeView: (event: React.ChangeEvent<any>, value: string) => void;
    onMakePayment: () => void;
    onMakeReferencePayment: () => void;
}

export interface IBalanceOptionsResProps {
    btnMakePayment: string;
    lblMakePayment: string;
    lblOptions: string;
    lblPaymentAmount: string;
    lblPaymentAmountInvalid: string;
    lblPaymentAmountRequired: string;
    lblPaymentPeriod: string;
    lblPaymentPeriodRequired: string;
    lblPeriod: string;
    lblView: string;
}
// #endregion Types

// #region Component
const BalanceOptions: React.FC<IBalanceOptionsProps> = (props: IBalanceOptionsProps): JSX.Element => {
    const {
        balancePayment,
        lblDropDownEmptyText,
        periods,
        periodSelected,
        resources,
        views,
        viewSelected,
        onChangePaymentAmount,
        onChangePeriod,
        onChangePeriodToPayment,
        onChangeView,
        onMakePayment,
        onMakeReferencePayment
    } = props;

    let emptyOption: IDropDownOption;
    emptyOption = {
        description: lblDropDownEmptyText,
        value: ''
    };

    let errorAmount: boolean = false;
    let errorTextAmount: string | undefined;
    let errorPeriod: boolean = false;
    let errorTextPeriod: string | undefined;
    if (balancePayment) {
        if (balancePayment.modifiedAmount) {
            errorAmount = !Boolean(balancePayment.amount)
                || balancePayment.invalidAmount;
            errorTextAmount = !Boolean(balancePayment.amount) ?
                resources.lblPaymentAmountRequired
                : (balancePayment.invalidAmount ?
                    resources.lblPaymentAmountInvalid
                    : undefined);
        }
        if (balancePayment.modifiedPeriod) {
            errorPeriod = !Boolean(balancePayment.periodSelected)
                || Boolean(balancePayment.periodSelected && balancePayment.periodSelected.value === '');
            errorTextPeriod = errorPeriod ?
                resources.lblPaymentPeriodRequired
                : undefined;
        }
    }

    const header: JSX.Element = (
        <Text size="h2">
            {resources.lblOptions}
        </Text>
    );

    const content: JSX.Element = (
        <>
            {periods && periodSelected && (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Dropdown
                                id="ddlPeriod"
                                label={resources.lblPeriod}
                                options={periods}
                                value={periodSelected}
                                onChange={onChangePeriod}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <RadioGroup
                                id="rbgView"
                                labelElement={(
                                    <Text size="large">
                                        {resources.lblView}
                                    </Text>
                                )}
                                name="views"
                                options={views}
                                value={viewSelected}
                                onChange={onChangeView}
                            />
                        </Grid>
                    </Grid>
                </>
            )}
            <Divider />
            {balancePayment && balancePayment.enableOnlinePayment && balancePayment.periods ? (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Text size="h2">
                                {resources.lblMakePayment}
                            </Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={errorPeriod}
                                helperText={errorTextPeriod}
                                id="ddlPaymentPeriod"
                                label={resources.lblPaymentPeriod}
                                options={balancePayment.periods}
                                required
                                value={balancePayment.periodSelected ? balancePayment.periodSelected.value : emptyOption.value}
                                onChange={onChangePeriodToPayment}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={errorAmount}
                                helperText={errorTextAmount}
                                id="txtPaymentAmount"
                                label={resources.lblPaymentAmount}
                                required
                                value={balancePayment.amount}
                                onChange={onChangePaymentAmount}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                id="btnMakePayment"
                                onClick={onMakePayment}
                            >
                                {resources.btnMakePayment}
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                id="btnMakeReferencePayment"
                                onClick={onMakeReferencePayment}
                            >
                                Genera Ficha de Pago
                            </Button>
                        </Grid>
                    </Grid>
                </>
            ) : undefined}
        </>
    );

    return (
        <Media query={Tokens.mqSmallDown}>
            {(matches: boolean): JSX.Element => matches ? (
                <ExpansionPanel
                    header={header}
                >
                    {content}
                </ExpansionPanel>
            ) : (
                <Card>
                    <CardContent>
                        {header}
                        {content}
                    </CardContent>
                </Card >
            )
            }
        </Media>
    );
};
// #endregion Component

// Export: Component
export default BalanceOptions;