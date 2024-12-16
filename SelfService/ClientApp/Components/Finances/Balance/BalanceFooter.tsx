/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: BalanceFooter.tsx
 * Type: Presentation  component */

// #region Imports
import React from 'react';

// Core components
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IBalance } from '../../../Types/Balance/IBalance';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
// #endregion Imports

// #region Types
export interface IBalanceFooterProps {
    balance?: IBalance;
    periodSelected: IDropDownOption;
    resources: IBalanceFooterResProps;
}

export interface IBalanceFooterResProps {
    formatPeriodSession: string;
    lblAnticipatedBalance: string;
    lblAnticipatedFinancialAid: string;
    lblBalance: string;
    lblBalanceDue: string;
    lblNotes: string;
    lblOtherPeriodsSessions: string;
    lblSummaryTotal: string;
    lblTotal: string;
}
// #endregion Types

// #region Component
const BalanceFooter: React.FC<IBalanceFooterProps> = (props: IBalanceFooterProps): JSX.Element => {
    const {
        balance,
        periodSelected,
        resources
    } = props;

    let summaryTotal: JSX.Element | undefined;
    if (balance) {
        summaryTotal = (
            <>
                {periodSelected.value !== '0' ?
                    (
                        <>
                            <Divider />
                            <br />
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    <Text align="right" size="h3">
                                        {Format.toString(resources.formatPeriodSession, [periodSelected.description])}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={6} sm={8}>
                                    <Text align="right">
                                        {resources.lblSummaryTotal}
                                    </Text>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Text align="right">
                                        {balance.periodSummaryTotal
                                            ? balance.periodSummaryTotal : ''}
                                    </Text>
                                </Grid>
                            </Grid>
                            {balance.includeAnticipatedAid ? (
                                <>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={8}>
                                            <Text align="right">
                                                {resources.lblAnticipatedFinancialAid}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6} sm={4}>
                                            <Text align="right">
                                                {balance.periodAnticipatedFinAid
                                                    ? balance.periodAnticipatedFinAid : ''}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={8}>
                                            <Text align="right">
                                                {resources.lblTotal}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6} sm={4}>
                                            <Text align="right">
                                                {balance.periodTotal
                                                    ? balance.periodTotal : ''}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                </>
                            ) : undefined}
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    <Text align="right" size="h3">
                                        {resources.lblOtherPeriodsSessions}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={6} sm={8}>
                                    <Text align="right">
                                        {resources.lblBalance}
                                    </Text>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Text align="right">
                                        {balance.otherPeriodsBalance
                                            ? balance.otherPeriodsBalance : ''}
                                    </Text>
                                </Grid>
                            </Grid>
                        </>
                    ) :
                    (
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={8}>
                                <Text align="right">
                                    {resources.lblSummaryTotal}
                                </Text>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Text align="right">
                                    {balance.periodSummaryTotal
                                        ? balance.periodSummaryTotal : ''}
                                </Text>
                            </Grid>
                        </Grid>
                    )}
                <Grid container spacing={3}>
                    <Grid item xs={6} sm={8}>
                        <Text align="right">
                            {resources.lblBalanceDue}
                        </Text>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Text align="right">
                            {balance.otherPeriodsBalanceDue
                                ? balance.otherPeriodsBalanceDue : ''}
                        </Text>
                    </Grid>
                </Grid>
                {balance.includeAnticipatedAid ? (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={8}>
                                <Text align="right">
                                    {resources.lblAnticipatedFinancialAid}
                                </Text>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Text align="right">
                                    {balance.otherPeriodsAnticipatedFinAid
                                        ? balance.otherPeriodsAnticipatedFinAid : ''}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={8}>
                                <Text align="right">
                                    {resources.lblAnticipatedBalance}
                                </Text>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Text align="right">
                                    {balance.otherPeriodsAnticipatedBalance
                                        ? balance.otherPeriodsAnticipatedBalance : ''}
                                </Text>
                            </Grid>
                        </Grid>
                    </>
                ) : undefined}
            </>
        );
    }

    return (
        <>
            <br />
            {summaryTotal}
            {balance && balance.includeAnticipatedAid ? (
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Text>
                            {resources.lblNotes}
                        </Text>
                    </Grid>
                </Grid>
            ) : undefined}
        </>
    );
};
// #endregion Component

// Export: Component
export default BalanceFooter;