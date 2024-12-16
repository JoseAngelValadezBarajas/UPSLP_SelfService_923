/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: BalanceDetailTable.tsx
 * Type: Presentation  component */

// #region Imports
import React from 'react';
import { useState } from 'react';
// Core components
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';

// Types
import { IChargeCredit } from '../../../Types/Balance/IChargeCredit';
// #endregion Imports
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
// #region Types
export interface IBalanceDetailTableProps {
    detail: IChargeCredit[];
    displayDueDate: boolean;
    displayEstimatedLateFees: boolean;
    id: string;
    resources: IBalanceDetailTableResProps;
}

export interface IBalanceDetailTableResProps {
    lblAmount: string;
    lblDate: string;
    lblDescription: string;
    lblDueDate: string;
    lblEstimatedLateFee: string;
    lblPeriod: string;
    lblType: string;
    lblTypeChargeDesc: string;
    lblTypeCreditDesc: string;
    lblTypeFinAidDesc: string;
    lblTypeReceiptDesc: string;
}
// #endregion Types

// #region Component
const BalanceDetailTable: React.FC<IBalanceDetailTableProps> = (props: IBalanceDetailTableProps): JSX.Element => {
    const {
        detail,
        displayDueDate,
        displayEstimatedLateFees,
        id,
        resources
    } = props;

    function setTypeDesc(status: string): string {
        let typeDesc: string = '';
        switch (status) {
            case 'C':
                typeDesc = resources.lblTypeChargeDesc;
                break;
            case 'D':
                typeDesc = resources.lblTypeCreditDesc;
                break;
            case 'R':
                typeDesc = resources.lblTypeReceiptDesc;
                break;
            case 'F':
                typeDesc = resources.lblTypeFinAidDesc;
                break;
        }
        return typeDesc;
    }

    const [selectedCheckboxes, setSelectedCheckboxes] = useState<boolean[]>(detail.map(() => false));

    const handleCheckboxChangeS = (index: number) => {
        const newSelectedCheckboxes = [...selectedCheckboxes];
        newSelectedCheckboxes[index] = !newSelectedCheckboxes[index];
        setSelectedCheckboxes(newSelectedCheckboxes);
    
        // Guardar en localStorage
        localStorage.setItem('selectedCheckboxes', JSON.stringify(newSelectedCheckboxes));

    
        // Mostrar en consola los elementos seleccionados en formato texto
        const selectedItems = detail
            .filter((_, idx) => newSelectedCheckboxes[idx])
            .map(item => item.description); // Solo el texto
    
        localStorage.setItem('selectedCheckboxesInfo', JSON.stringify(selectedItems));
        
        console.log(selectedItems);
        
    };

    return (
        <Table
            breakpoint="sm"
            id="tblBalanceDetail"
        >
            <TableHead>
                <TableRow>
                    <TableCell component="th">
                        "Selecciona"
                    </TableCell>
                    <TableCell component="th">
                        {resources.lblDate}
                    </TableCell>
                    <TableCell component="th">
                        {resources.lblPeriod}
                    </TableCell>
                    <TableCell component="th">
                        {resources.lblType}
                    </TableCell>
                    <TableCell component="th">
                        {resources.lblDescription}
                    </TableCell>
                    {displayDueDate ? (
                        <TableCell component="th">
                            {resources.lblDueDate}
                        </TableCell>
                    ) : undefined}
                    {displayEstimatedLateFees ? (
                        <TableCell align="right">
                            {resources.lblEstimatedLateFee}
                        </TableCell>
                    ) : undefined}
                    <TableCell component="th" align="right">
                        {resources.lblAmount}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {detail.map((row, i) =>
                    (
                        <TableRow key={`${id}_${i}`}>
                            <Checkbox
                                checked={selectedCheckboxes[i]}
                                onChange={() => handleCheckboxChangeS(i)}
                            />
                            <TableCell columnName={resources.lblDate}>
                                <span>
                                    {row.entryDate}
                                </span>
                            </TableCell>
                            <TableCell columnName={resources.lblPeriod}>
                                <span>
                                    {row.period}
                                </span>
                            </TableCell>
                            <TableCell columnName={resources.lblType}>
                                <span>
                                    {setTypeDesc(row.type)}
                                </span>
                            </TableCell>
                            <TableCell columnName={resources.lblDescription}>
                                <span>
                                    {row.description}
                                </span>
                            </TableCell>
                            {displayDueDate ? (
                                <TableCell columnName={resources.lblDueDate}>
                                    <span>
                                        {row.dueDate}
                                    </span>
                                </TableCell>
                            ) : undefined}
                            {displayEstimatedLateFees ? (
                                <TableCell columnName={resources.lblEstimatedLateFee} align="right">
                                    <span>
                                        {row.estimatedLateFeeAmount}
                                    </span>
                                </TableCell>
                            ) : undefined}
                            <TableCell columnName={resources.lblAmount} align="right">
                                <span>
                                    {row.amount}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
};
// #endregion Component

// Export: Component
export default BalanceDetailTable;