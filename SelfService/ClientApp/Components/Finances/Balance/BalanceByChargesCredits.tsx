/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: BalanceByChargesCredits.tsx
 * Type: Presentation  component */

// #region Imports
import React from 'react';


// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
// import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';

// Internal Components
import BalanceDetailTable, { IBalanceDetailTableResProps } from './BalanceDetailTable';

// Types
import { IBalanceByCharges } from '../../../Types/Balance/IBalanceByCharges';
// #endregion Imports

// #region Types
export interface IBalanceByChargesCreditsProps {
    balance: IBalanceByCharges;
    resources: IBalanceByChargesCreditsResProps;
    resourcesTable: IBalanceDetailTableResProps;
}

export interface IBalanceByChargesCreditsResProps {
    lblAnticipatedFinancialAidHeader: string;
    lblChargesHeader: string;
    lblCreditsHeader: string;
    lblNoAnticipatedFinancialAid: string;
    lblNoCharges: string;
    lblNoCredits: string;
}
// #endregion Types

// #region Component
const BalanceByChargesCredits: React.FC<IBalanceByChargesCreditsProps> = (props: IBalanceByChargesCreditsProps): JSX.Element => {
    const {
        balance,
        resources,
        resourcesTable
    } = props;


    return (
        <>
            <ExpansionPanel
                background="gray"
                header={(
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Text size="h4">
                                {resources.lblChargesHeader}
                            </Text>
                        </Grid>

                        <Grid item xs>
                            {balance.totalAmountCharges ?
                                (
                                    <Text align="right">
                                        {`${balance.totalAmountCharges}`}
                                    </Text>
                                ) : undefined}
                        </Grid>
                    </Grid>
                )}
                defaultExpanded={true}
                id="epnlCharges"
            >
                {balance.charges && balance.charges.length > 0 ?
                    (
                        <BalanceDetailTable
                            detail={balance.charges}
                            displayDueDate={balance.displayDueDate}
                            displayEstimatedLateFees={balance.displayEstimatedLateFees}
                            id="charges"
                            resources={resourcesTable}
                        />
                    )
                    : (
                        <Text>
                            {resources.lblNoCharges}
                        </Text>
                    )}
            </ExpansionPanel>
            <ExpansionPanel
                background="gray"
                id="epnlCredit"
                header={(
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Text size="h4">
                                {resources.lblCreditsHeader}
                            </Text>
                        </Grid>

                        <Grid item xs>
                            {balance.totalAmountCredits ?
                                (
                                    <Text align="right">
                                        {`${balance.totalAmountCredits}`}
                                    </Text>
                                ) : undefined}
                        </Grid>
                    </Grid>
                )}
                defaultExpanded={true}
            >
                {balance.credits && balance.credits.length > 0 ?
                    (
                        <BalanceDetailTable
                            detail={balance.credits}
                            displayDueDate={balance.displayDueDate}
                            displayEstimatedLateFees={balance.displayEstimatedLateFees}
                            id="credit"
                            resources={resourcesTable}
                        />
                    )
                    : (
                        <Text>
                            {resources.lblNoCredits}
                        </Text>
                    )}
            </ExpansionPanel>

            {balance.includeAnticipatedAid ? (
                <ExpansionPanel
                    background="gray"
                    id="epnlFinancialAid"
                    header={(
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="h4">
                                    {resources.lblAnticipatedFinancialAidHeader}
                                </Text>
                            </Grid>
                            <Grid item xs>
                                {balance.totalAmountFinancialAids ?
                                    (
                                        <Text align="right">
                                            {`${balance.totalAmountFinancialAids}`}
                                        </Text>
                                    ) : undefined}
                            </Grid>
                        </Grid>
                    )}
                    defaultExpanded={true}
                >
                    {balance.financialAids && balance.financialAids.length > 0 ?
                        (
                            <BalanceDetailTable
                                detail={balance.financialAids}
                                displayDueDate={balance.displayDueDate}
                                displayEstimatedLateFees={balance.displayEstimatedLateFees}
                                id="financialAid"
                                resources={resourcesTable}
                            />
                        )
                        : (
                            <Text>
                                {resources.lblNoAnticipatedFinancialAid}
                            </Text>
                        )}
                </ExpansionPanel>
            ) : undefined}
        </>
    );
};
// #endregion Component

// Export: Component
export default BalanceByChargesCredits;