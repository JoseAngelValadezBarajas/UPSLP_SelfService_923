/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: BalanceBySummary.tsx
 * Type: Presentation component */

import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
// import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';

// Types
import { IBalanceBySummary } from '../../../Types/Balance/IBalanceBySummary';

export interface IBalanceBySummaryProps {
    balance: IBalanceBySummary;
    resources: IBalanceBySummaryResProps;
}

export interface IBalanceBySummaryResProps {
    lblAmount: string;
    lblSeparator: string;
    lblSummaryType: string;
}

const BalanceBySummary: React.FC<IBalanceBySummaryProps> = (props: IBalanceBySummaryProps): JSX.Element => {
    const {
        balance,
        resources
    } = props;

    // Estado para manejar los checkboxes seleccionados
    // const [selectedCheckboxes, setSelectedCheckboxes] = useState<boolean[]>(balance.summaryTypes.map(() => false));

    // const handleCheckboxChange = (index: number) => {
    //    const newSelectedCheckboxes = [...selectedCheckboxes];
    //    newSelectedCheckboxes[index] = !newSelectedCheckboxes[index];
    //    setSelectedCheckboxes(newSelectedCheckboxes);
    //    // Guardar en localStorage
    //    localStorage.setItem('selectedCheckboxes', JSON.stringify(newSelectedCheckboxes));

    //    // Mostrar en consola los elementos seleccionados en formato texto
    //    const selectedItems = balance.summaryTypes
    //        .filter((_, idx) => newSelectedCheckboxes[idx])
    //        .map(item => item.description); // Solo el texto
    //    localStorage.setItem('selectedCheckboxesInfo', JSON.stringify(selectedItems));
    // };

    return (
        <>
            {balance.summaryTypes ? (
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Table breakpoint="sm" id="tblBalanceBySummary">
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">{resources.lblSummaryType}</TableCell>
                                    <TableCell component="th" align="right">{resources.lblAmount}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {balance.summaryTypes.map((row, i) => {
                                    return (
                                        <TableRow key={`balanceSummary_${i}`}>
                                            <TableCell
                                                columnName={resources.lblSummaryType}
                                                component="th"
                                                scope="row"
                                            >
                                                <span>{row.description}</span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblAmount} align="right">
                                                <span>{row.amount}</span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            ) : undefined}
        </>
    );    
};

export default BalanceBySummary;


