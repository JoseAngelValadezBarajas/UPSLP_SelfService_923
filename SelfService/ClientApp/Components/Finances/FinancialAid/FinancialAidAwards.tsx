/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: FinancialAidAwards.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
// import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IFinancialAidAwards } from '../../../Types/FinancialAid/IFinancialAidAwards';

// #endregion

// #region Internal types
export interface IFinancialAidAwardsTableProps {
    FinancialAidAwardsList: IFinancialAidAwards[];

    resources: IFinancialAidAwardsTableResProps;
}

export interface IFinancialAidAwardsTableResProps {
    lblAccepted: string;
    lblAwardsByAcademicTerm: string;
    lblAwardTerm: string;
    lblMessages: string;
    lblFundName: string;
    lblPending; string;
    lblScheduledTermAmount: string;
    lblSeparator: string;
    lblStatus: string;
    lblTotalFundAmount: string;
    lblTotals: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '25%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '20%'
            }
        }
    }
}));

type PropsWithStyles = IFinancialAidAwardsTableProps & WithStyles<typeof styles>;

// #endregion

// #region Component
const FinancialAidAwards: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        FinancialAidAwardsList,
        resources
    } = props;

    return (
        <>
            <br />
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {resources.lblAwardsByAcademicTerm}
                    </Text>
                </Grid>
            </Grid>
            <br />

            {FinancialAidAwardsList.map((awardTerms, i) =>
                (
                    <React.Fragment key={`awardsList_${i}`}>
                        <Grid container>
                            <Grid item>
                                <Text size="h4">
                                    {`${resources.lblAwardTerm}${resources.lblSeparator} ${awardTerms.awardTermDescription}`}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblFinancialAidAwards"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblFundName}
                                    </TableCell>
                                    <TableCell align="right" component="th">
                                        {resources.lblTotalFundAmount}
                                    </TableCell>
                                    <TableCell align="right" component="th">
                                        {resources.lblScheduledTermAmount}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblStatus}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {awardTerms.funds.map((row, j) => (
                                    <TableRow key={`funds_${j}`}>
                                        <TableCell columnName={`${resources.lblFundName}${resources.lblSeparator}`}>
                                            <span>
                                                {row.fundName}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right" columnName={`${resources.lblTotalFundAmount}${resources.lblSeparator}`}>
                                            <span>
                                                {row.actualAmount}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right" columnName={`${resources.lblScheduledTermAmount}${resources.lblSeparator}`}>
                                            <span>
                                                {row.scheduledTermAmount}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={`${resources.lblStatus}${resources.lblSeparator}`}>
                                            <span>
                                                {row.status === 'A' ? resources.lblAccepted : resources.lblPending}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell columnName={`${resources.lblTotals}${resources.lblSeparator}`}>
                                        <span>
                                            {resources.lblTotals}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right" columnName={`${resources.lblTotalFundAmount}${resources.lblSeparator}`}>
                                        <span>
                                            {awardTerms.totalActualAmountByTerm}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right" columnName={`${resources.lblScheduledTermAmount}${resources.lblSeparator}`}>
                                        <span>
                                            {awardTerms.totalScheduledAmountByTerm}
                                        </span>
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableBody>
                            <br />
                        </Table>
                    </React.Fragment>
                ))}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(FinancialAidAwards);