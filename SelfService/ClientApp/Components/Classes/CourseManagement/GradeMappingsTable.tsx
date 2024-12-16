/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: GradeMappingsTable.tsx
 * Type: Presentation  component */

// #region Imports
import React from 'react';

// Core components
import Table, { TableBody, TableCell, TableEditableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ISectionGradeMapping } from '../../../Types/Section/ISectionGradeMapping';
// #endregion

// #region Internal types
export interface IGradeMappingsTableProps {
    detail: ISectionGradeMapping[];
    id: string;
    resources: IGradeMappingsTableResProps;
    showMidTerm: boolean;
    showPoints: boolean;
    onChangePercent: (event: any) => void;
    onChangePoint: (event: any) => void;
}

export interface IGradeMappingsTableResProps {
    lblFinalMin: string;
    lblFinalMinPoints: string;
    lblGrade: string;
    lblGradeMappingRepeated: string;
    lblIncorrectAmount: string;
    lblInvalidAmount: string;
    lblMidTermMin: string;
    lblMidTermMinPoints: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(n+2)': {
                width: '20%'
            }
        }
    }
}));

type PropsWithStyles = IGradeMappingsTableProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const GradeMappingsTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        detail,
        id,
        resources,
        showMidTerm,
        showPoints,
        onChangePercent,
        onChangePoint
    } = props;

    return (
        <Table
            breakpoint="sm"
            classes={{ root: classes.table }}
            id="tblGradeMappings"
        >
            <TableHead>
                <TableRow>
                    <TableCell component="th">
                        {resources.lblGrade}
                    </TableCell>
                    {showMidTerm && showPoints ? (
                        <TableCell component="th" align="right">
                            {resources.lblMidTermMinPoints}
                        </TableCell>
                    ) : undefined}
                    {showMidTerm ? (
                        <TableCell component="th" align="right">
                            {resources.lblMidTermMin}
                        </TableCell>
                    ) : undefined}
                    {showPoints ? (
                        <TableCell component="th" align="right">
                            {resources.lblFinalMinPoints}
                        </TableCell>
                    ) : undefined}
                    <TableCell component="th" align="right">
                        {resources.lblFinalMin}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {detail.map((row, i) =>
                    (
                        <TableRow key={`tableGradesD_${id}_${i}`}>
                            <TableCell
                                columnName={resources.lblGrade}
                                component="th"
                                scope="row"
                            >
                                <span>
                                    {row.gradeValue}
                                </span>
                            </TableCell>
                            {showMidTerm && showPoints ? (
                                <TableEditableCell
                                    columnName={resources.lblMidTermMinPoints}
                                    editableComponent={
                                        (
                                            <TextField
                                                cell
                                                error={row.invalidMinimumMidtermPoints
                                                    || row.incorrectMinimumMidtermPoints}
                                                helperText={row.invalidMinimumMidtermPoints ?
                                                    resources.lblInvalidAmount
                                                    : (row.incorrectMinimumMidtermPoints ?
                                                        resources.lblIncorrectAmount : undefined)}
                                                id={`txtMidPt_${id}_${i}`}
                                                label=""
                                                numeric
                                                size="small"
                                                value={row.minimumMidtermPoints !== undefined
                                                    && row.minimumMidtermPoints !== null
                                                    ? row.minimumMidtermPoints : ''}
                                                onChange={onChangePoint}
                                            />
                                        )}
                                    align="right"
                                />
                            ) : undefined}
                            {showMidTerm ? (
                                <TableEditableCell
                                    columnName={resources.lblMidTermMin}
                                    editableComponent={
                                        (
                                            <TextField
                                                cell
                                                error={row.errorMidtermPercentage
                                                    || row.invalidMinimumMidtermPercentage
                                                    || row.incorrectMinimumMidtermPercentage}
                                                helperText={row.errorMidtermPercentage ?
                                                    resources.lblGradeMappingRepeated
                                                    : (row.invalidMinimumMidtermPercentage ?
                                                        resources.lblInvalidAmount
                                                        : (row.incorrectMinimumMidtermPercentage ?
                                                            resources.lblIncorrectAmount : undefined))}
                                                id={`txtMid_${id}_${i}`}
                                                label=""
                                                numeric
                                                size="small"
                                                value={row.minimumMidtermPercentage !== undefined
                                                    && row.minimumMidtermPercentage !== null
                                                    ? row.minimumMidtermPercentage : ''}
                                                onChange={onChangePercent}
                                            />
                                        )}
                                    align="right"
                                    error={row.errorMidtermPercentage
                                        || row.invalidMinimumMidtermPercentage
                                        || row.incorrectMinimumMidtermPercentage}
                                />
                            ) : undefined}
                            {showPoints ? (
                                <TableEditableCell
                                    columnName={resources.lblFinalMinPoints}
                                    editableComponent={
                                        (
                                            <TextField
                                                error={row.invalidMinimumFinalPoints
                                                    || row.incorrectMinimumFinalPoints}
                                                helperText={row.invalidMinimumFinalPoints ?
                                                    resources.lblInvalidAmount
                                                    : (row.incorrectMinimumFinalPoints ?
                                                        resources.lblIncorrectAmount : undefined)}
                                                cell
                                                id={`txtFinalPt_${id}_${i}`}
                                                label=""
                                                numeric
                                                size="small"
                                                value={row.minimumFinalPoints !== undefined
                                                    && row.minimumFinalPoints !== null
                                                    ? row.minimumFinalPoints : ''}
                                                onChange={onChangePoint}
                                            />
                                        )}
                                    align="right"
                                />
                            ) : undefined}
                            <TableEditableCell
                                columnName={resources.lblFinalMin}
                                editableComponent={
                                    (
                                        <TextField
                                            cell
                                            error={row.errorFinalPercentage
                                                || row.invalidMinimumFinalPercentage
                                                || row.incorrectMinimumFinalPercentage}
                                            helperText={row.errorFinalPercentage ?
                                                resources.lblGradeMappingRepeated
                                                : (row.invalidMinimumFinalPercentage ?
                                                    resources.lblInvalidAmount
                                                    : (row.incorrectMinimumFinalPercentage ?
                                                        resources.lblIncorrectAmount : undefined))}
                                            id={`txtFinal_${id}_${i}`}
                                            label=""
                                            numeric
                                            size="small"
                                            value={row.minimumFinalPercentage !== undefined
                                                && row.minimumFinalPercentage !== null
                                                ? row.minimumFinalPercentage : ''}
                                            onChange={onChangePercent}
                                        />
                                    )}
                                align="right"
                                error={row.errorFinalPercentage
                                    || row.invalidMinimumFinalPercentage
                                    || row.incorrectMinimumFinalPercentage}
                            />
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(GradeMappingsTable);