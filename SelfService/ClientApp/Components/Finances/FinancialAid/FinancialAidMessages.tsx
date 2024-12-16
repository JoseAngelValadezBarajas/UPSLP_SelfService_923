/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: FinancialAidMeages.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion

// #region Internal types
export interface IFinancialAidMessagesTableProps {
    FinancialAidMessagesList: string[];

    resources: IFinancialAidMessagesTableResProps;
}

export interface IFinancialAidMessagesTableResProps {
    lblMessages: string;
    lblMessagesLeyend: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '35%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '20%'
            }
        }
    }
}));

type PropsWithStyles = IFinancialAidMessagesTableProps & WithStyles<typeof styles>;

// #endregion

// #region Component
const FinancialAidMessages: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        FinancialAidMessagesList,
        resources
    } = props;

    return (
        <>
            <br />
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {resources.lblMessages}
                    </Text>
                </Grid>
            </Grid>
            <br />
            <Grid container>
                <Grid item>
                    <Text size="h4">
                        {resources.lblMessagesLeyend}
                    </Text>
                </Grid>
            </Grid>
            <br />
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblFinancialAidMessages"
            >
                <TableBody>
                    {FinancialAidMessagesList.map((row, i) =>
                        (
                            <TableRow key={`messages_${i}`}>
                                <TableCell>
                                    <span>
                                        {'- '}
                                        {row}
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
export default withStyles(styles)(FinancialAidMessages);