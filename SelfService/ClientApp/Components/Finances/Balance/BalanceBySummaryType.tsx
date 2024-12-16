/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: BalanceBySummaryType.tsx
 * Type: Presentation  component */

// #region Imports
import React from 'react';

// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal Components
import BalanceDetailTable, { IBalanceDetailTableResProps } from './BalanceDetailTable';

// Types
import { IBalanceBySummaryType } from '../../../Types/Balance/IBalanceBySummaryType';
// #endregion Imports

// #region Types
export interface IBalanceBySummaryTypeProps {
    balance: IBalanceBySummaryType;
    resources: IBalanceBySummaryTypeResProps;
    resourcesTable: IBalanceDetailTableResProps;
}

export interface IBalanceBySummaryTypeResProps {
    lblDetailsNotAvailable: string;
}
// #endregion Types

// #region Component
const BalanceBySummaryType: React.FC<IBalanceBySummaryTypeProps> = (props: IBalanceBySummaryTypeProps): JSX.Element => {
    const {
        balance,
        resources,
        resourcesTable
    } = props;

    return (
        <>
            {balance.detailSummaryTypes ?
                balance.detailSummaryTypes.map((item, i) =>
                    (
                    <ExpansionPanel
                            id={`epnlSummaryType_${i}`}
                            key={`summary_${i}`}
                            background="gray"
                            header={(
                                <Grid container spacing={3}>
                                    <Grid item xs>
                                        <Text size="h4">
                                            {`${item.description}`}
                                        </Text>
                                    </Grid>

                                    <Grid item xs>
                                        {item.totalAmount && item.totalAmount !== '' ?
                                            (
                                                <Text align="right">
                                                    {`${item.totalAmount}`}
                                                </Text>
                                            ) : undefined}
                                    </Grid>
                                </Grid>
                            )}
                            defaultExpanded={false}
                        >
                            {item.charges && item.charges.length > 0 ?
                                (
                                    <BalanceDetailTable
                                        detail={item.charges}
                                        displayDueDate={balance.displayDueDate}
                                        displayEstimatedLateFees={balance.displayEstimatedLateFees}
                                        id={`summaryType_${i}`}
                                        resources={resourcesTable}
                                    />
                                ) :
                                (
                                    <Text>
                                        {resources.lblDetailsNotAvailable}
                                    </Text>
                                )}
                    </ExpansionPanel>
                    )) : undefined}
        </>
    );
};
// #endregion Component

// Export: Component
export default BalanceBySummaryType;