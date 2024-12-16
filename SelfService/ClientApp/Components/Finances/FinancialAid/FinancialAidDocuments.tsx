/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: FinancialAidDocuments.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IFinancialAidDocuments } from '../../../Types/FinancialAid/IFinancialAidDocuments';

// #endregion

// #region Internal types
export interface IFinancialAidDocumentsTableProps {
    FinancialAidDocumentsList: IFinancialAidDocuments[];
    periodSelected?: IDropDownOption;
    resources: IFinancialAidDocumentsTableResProps;
}

export interface IFinancialAidDocumentsTableResProps {
    formatFinancialAidFor: string;
    lblDocuments: string;
    lblDocumentName: string;
    lblDocumentStatus: string;
    lblDocumentStatusDate: string;
    lblSeparator: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '38%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '20%'
            }
        }
    }
}));

type PropsWithStyles = IFinancialAidDocumentsTableProps & WithStyles<typeof styles>;

// #endregion

// #region Component
const FinancialAidDocuments: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        FinancialAidDocumentsList,
        periodSelected,
        resources
    } = props;

    return (
        <>
            {periodSelected ? (
                <>
                    <Grid container>
                        <Grid item>
                            <Text size="h3">
                                {Format.toString(resources.formatFinancialAidFor,
                                    [periodSelected[0] ? periodSelected[0].description : periodSelected.description])}
                            </Text>
                        </Grid>
                    </Grid>
                    <br />
                </>
            ) : undefined}
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {resources.lblDocuments}
                    </Text>
                </Grid>
            </Grid>
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblFinancialAidDocuments"
            >
                <TableHead>
                    <TableRow>
                        <TableCell component="th">
                            {resources.lblDocumentName}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblDocumentStatus}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblDocumentStatusDate}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {FinancialAidDocumentsList.map((row, i) =>
                        (
                            <TableRow key={`document_${i}`}>
                                <TableCell columnName={`${resources.lblDocumentName}${resources.lblSeparator}`}>
                                    <span>
                                        {row.docName}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblDocumentStatus}${resources.lblSeparator}`}>
                                    <span>
                                        {row.docStatusDescription}
                                    </span>
                                </TableCell>
                                <TableCell columnName={`${resources.lblDocumentStatusDate}${resources.lblSeparator}`}>
                                    <span>
                                        {row.statusEffectiveDate}
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
export default withStyles(styles)(FinancialAidDocuments);