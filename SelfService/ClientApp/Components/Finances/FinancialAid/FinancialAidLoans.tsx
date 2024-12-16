/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: FinancialAidLoans.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IFinancialAidLoans } from '../../../Types/FinancialAid/IFinancialAidLoans';

// #endregion

// #region Internal types
export interface IFinancialAidLoansTableProps {
    FinancialAidLoansList: IFinancialAidLoans[];

    resources: IFinancialAidLoansTableResProps;
}

export interface IFinancialAidLoansTableResProps {
    lblApplicationReceived: string;
    lblInterestRate: string;
    lblLenderApprovedDate: string;
    lblLenderName: string;
    lblLoanIdentifier: string;
    lblLoanRequested: string;
    lblLoans: string;
    lblPeriodBeginDate: string;
    lblPeriodEndDate: string;
    lblSeparator: string;
    lblSignatureDate: string;
    lblStatus: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '15%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '10%'
            }
        }
    }
}));

type PropsWithStyles = IFinancialAidLoansTableProps & WithStyles<typeof styles>;

// #endregion

// #region Component
const FinancialAidLoans: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        FinancialAidLoansList,
        resources
    } = props;

    return (
        <>
            <br />
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {resources.lblLoans}
                    </Text>
                </Grid>
            </Grid>
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblFinancialAidLoans"
            >
                <TableHead>
                    <TableRow>
                        <TableCell component="th">
                            {resources.lblLoanIdentifier}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblInterestRate}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblLoanRequested}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblLenderName}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblStatus}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblApplicationReceived}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblSignatureDate}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblLenderApprovedDate}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblPeriodBeginDate}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblPeriodEndDate}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {FinancialAidLoansList.map((row, i) =>
                        (
                            <TableRow key={`document_${i}`}>
                                <TableCell columnName={`${resources.lblLoanIdentifier}${resources.lblSeparator}`}>
                                    <span>
                                        {row.loanIdentifier}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblInterestRate}${resources.lblSeparator}`}>
                                    <span>
                                        {row.interestRate}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblLoanRequested}${resources.lblSeparator}`}>
                                    <span>
                                        {row.loanRequested}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblLenderName}${resources.lblSeparator}`}>
                                    <span>
                                        {row.lenderName}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblStatus}${resources.lblSeparator}`}>
                                    <span>
                                        {row.status}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblApplicationReceived}${resources.lblSeparator}`}>
                                    <span>
                                        {row.applicationReceived}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblSignatureDate}${resources.lblSeparator}`}>
                                    <span>
                                        {row.signatureDate}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblLenderApprovedDate}${resources.lblSeparator}`}>
                                    <span>
                                        {row.lenderApprovedDate}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblPeriodBeginDate}${resources.lblSeparator}`}>
                                    <span>
                                        {row.periodBeginDate}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblPeriodEndDate}${resources.lblSeparator}`}>
                                    <span>
                                        {row.periodEndDate}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(FinancialAidLoans);