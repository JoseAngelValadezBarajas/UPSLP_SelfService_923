/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: FinancialAidPackaging.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IFinancialAidPackaging } from '../../../Types/FinancialAid/IFinancialAidPackaging';

// #endregion

// #region Internal types
export interface IFinancialAidPackagingTableProps {
    FinancialAidPackagingList: IFinancialAidPackaging[];
    displayUnmetNeed: boolean;
    resources: IFinancialAidPackagingTableResProps;
}

export interface IFinancialAidPackagingTableResProps {
    lblAmount: string;
    lblCategory: string;
    lblNoPackaging: string;
    lblPackaging: string;
    lblSeparator: string;
    lblStudentBudget: string;
    lblStudentFinancialAidPackage: string;
    lblStudentNeed: string;
    lblTotalStudentBudget: string;
    lblTotalStudentNeed: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '30%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '20%'
            }
        }
    }
}));

type PropsWithStyles = IFinancialAidPackagingTableProps & WithStyles<typeof styles>;

// #endregion

// #region Component
const FinancialAidPackaging: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        displayUnmetNeed,
        FinancialAidPackagingList,
        resources
    } = props;

    return (
        <>
            <br />
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {resources.lblPackaging}
                    </Text>
                </Grid>
            </Grid>
            <br />
            <Grid container>
                <Grid item>
                    <Text size="h4">
                        {resources.lblStudentBudget}
                    </Text>
                </Grid>
            </Grid>
            {FinancialAidPackagingList[0].studentBudget.length > 0 ? (
                <Table
                    breakpoint="sm"
                    classes={{ root: classes.table }}
                    id="tblFinancialAidPackaging"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell component="th">
                                {resources.lblCategory}
                            </TableCell>
                            <TableCell align="right" component="th">
                                {resources.lblAmount}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {FinancialAidPackagingList[0].studentBudget.map((row, i) =>
                            (
                                <TableRow key={`studentBudget_${i}`}>
                                    <TableCell columnName={`${resources.lblCategory}${resources.lblSeparator}`}>
                                        <span>
                                            {row.category}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right" columnName={`${resources.lblAmount}${resources.lblSeparator}`}>
                                        <span>
                                            {row.amount}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            ) : (
                    <MessageStyled
                        classMessage="noResults"
                        message={resources.lblNoPackaging}
                    />
                )}
            <br />
            <Grid container>
                <Grid item>
                    <Text size="h4">
                        {resources.lblStudentFinancialAidPackage}
                    </Text>
                </Grid>
            </Grid>
            {FinancialAidPackagingList[0].studentFinancialAid.length > 0 ?
                (
                    <Table
                        breakpoint="sm"
                        classes={{ root: classes.table }}
                        id="tblStudentFinancialAidPackage"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">
                                    {resources.lblCategory}
                                </TableCell>
                                <TableCell align="right" component="th">
                                    {resources.lblAmount}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {FinancialAidPackagingList[0].studentFinancialAid.map((row, i) =>
                                (
                                    <TableRow key={`studentFinancialAid_${i}`}>
                                        <TableCell columnName={`${resources.lblCategory}${resources.lblSeparator}`}>
                                            <span>
                                                {row.category}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right" columnName={`${resources.lblAmount}${resources.lblSeparator}`}>
                                            <span>
                                                {row.amount}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>

                    </Table>
                )
                :
                (
                    <MessageStyled
                        classMessage="noResults"
                        message={resources.lblNoPackaging}
                    />
                )
            }
            <br />
            <Grid container>
                <Grid item>
                    <Text size="h4">
                        {resources.lblStudentNeed}
                    </Text>
                </Grid>
            </Grid>
            {FinancialAidPackagingList[0].studentNeed.length > 0 ?
                (
                    <Table
                        breakpoint="sm"
                        classes={{ root: classes.table }}
                        id="tblStudentNeed"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">
                                    {resources.lblCategory}
                                </TableCell>
                                <TableCell align="right" component="th">
                                    {resources.lblAmount}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {!displayUnmetNeed ?
                            (
                                <TableBody>
                                    {FinancialAidPackagingList[0].studentNeed.map((row, i) =>
                                        (
                                            i !== 4 ?
                                                (
                                                    <TableRow key={`studentNeed_${i}`}>
                                                        <TableCell columnName={`${resources.lblCategory}${resources.lblSeparator}`}>
                                                            <span>
                                                                {row.category}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell align="right" columnName={`${resources.lblAmount}${resources.lblSeparator}`}>
                                                            <span>
                                                                {row.amount}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                                : undefined
                                        )
                                    )}
                                </TableBody>
                            )
                            : (
                                <TableBody>
                                    {FinancialAidPackagingList[0].studentNeed.map((row, i) =>
                                        (
                                            <TableRow key={`studentNeed_${i}`}>
                                                <TableCell columnName={`${resources.lblCategory}${resources.lblSeparator}`}>
                                                    <span>
                                                        {row.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="right" columnName={`${resources.lblAmount}${resources.lblSeparator}`}>
                                                    <span>
                                                        {row.amount}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            )
                        }
                    </Table>
                )
                :
                (
                    <MessageStyled
                        classMessage="noResults"
                        message={resources.lblNoPackaging}
                    />
                )
            }
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(FinancialAidPackaging);