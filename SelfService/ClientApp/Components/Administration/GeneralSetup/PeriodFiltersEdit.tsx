/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: PeriodFiltersEdit.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IPeriodFilter } from '../../../Types/Periods/IPeriodFilter';
// #endregion Imports

// #region Types
export interface IPeriodFiltersEditProps {
    isLoadingPeriodFilters: boolean;
    isLoadingSwitch: boolean;
    isLoadingYears: boolean;
    periodFilters: IPeriodFilter[];
    positionChanges: number[];
    resources: IPeriodFiltersEditResProps;
    title: string;
    withRelated: boolean;
    years: IDropDownOption[];
    yearSelected?: string;
    onChangeEnableDisable: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeYear: (optionSelected: IDropDownOption, id: string) => void;
    onClose: () => void;
}

export interface IPeriodFiltersEditResProps {
    btnReturn: string;
    formatTermSession: string;
    lblYears: string;
    lblTermSessionTitle: string;
    lblEnableDisable: string;
    lblTraditionalRegistration: string;
    lblSectionSearch: string;
}
// #endregion Types

// #region Component
const PeriodFiltersEdit: React.FC<IPeriodFiltersEditProps> = (props: IPeriodFiltersEditProps): JSX.Element => {
    const {
        isLoadingPeriodFilters,
        isLoadingSwitch,
        isLoadingYears,
        periodFilters,
        positionChanges,
        resources,
        title,
        withRelated,
        years,
        yearSelected,
        onChangeEnableDisable,
        onChangeYear,
        onClose
    } = props;

    let switchLoading: boolean;
    return (
        <>
            <Grid container>
                <Grid item xs>
                    <Text id="lblSubAreaTitle" size="h2">
                        {title}
                    </Text>
                </Grid>
            </Grid>
            <br />
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        id="ddlPeriodYear"
                        label={resources.lblYears}
                        loading={isLoadingYears}
                        options={years}
                        value={yearSelected}
                        onChange={onChangeYear}
                    />
                </Grid>
            </Grid>
            {isLoadingPeriodFilters ? (
                <Grid container>
                    <Grid item xs>
                        <ContainerLoader id="ldrArea" height="sm" />
                    </Grid>
                </Grid>
            ) : (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Table
                                    breakpoint="sm"
                                    id="tblPeriods"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblTermSessionTitle}
                                            </TableCell>
                                            {withRelated ? (
                                                <>
                                                    <TableCell
                                                        align="left"
                                                        component="th"
                                                    >
                                                        {resources.lblTraditionalRegistration}
                                                    </TableCell>
                                                    <TableCell
                                                        align="left"
                                                        component="th"
                                                    >
                                                        {resources.lblSectionSearch}
                                                    </TableCell>
                                                </>
                                            ) : (
                                                    <TableCell
                                                        align="left"
                                                        component="th"
                                                    >
                                                        {resources.lblEnableDisable}
                                                    </TableCell>
                                                )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {periodFilters.map((row, i) => {
                                            switchLoading = positionChanges.findIndex(p => p === row.id) >= 0;
                                            return (
                                                <TableRow key={`period_${i}`}>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {Format.toString(resources.formatTermSession, [row.term, row.session])}
                                                    </TableCell>
                                                    {withRelated ? (
                                                        <>
                                                            <TableCell
                                                                align="left"
                                                                columnName={resources.lblTraditionalRegistration}
                                                            >
                                                                <Switch
                                                                    align="horizontal"
                                                                    checked={row.isRelatedIncluded}
                                                                    id={`swt_1_${row.id}`}
                                                                    loading={isLoadingSwitch && switchLoading}
                                                                    onChange={onChangeEnableDisable}
                                                                />
                                                            </TableCell>
                                                            <TableCell
                                                                align="left"
                                                                columnName={resources.lblSectionSearch}
                                                            >
                                                                <Switch
                                                                    align="horizontal"
                                                                    checked={row.isIncluded}
                                                                    id={`swt_0_${row.id}`}
                                                                    loading={isLoadingSwitch && switchLoading}
                                                                    onChange={onChangeEnableDisable}
                                                                />
                                                            </TableCell>
                                                        </>
                                                    ) : (
                                                            <TableCell
                                                                align="left"
                                                                columnName={resources.lblEnableDisable}
                                                            >
                                                                <Switch
                                                                    align="horizontal"
                                                                    checked={row.isIncluded}
                                                                    id={`swt_0_${row.id}`}
                                                                    loading={isLoadingSwitch && switchLoading}
                                                                    onChange={onChangeEnableDisable}
                                                                />
                                                            </TableCell>
                                                        )}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item>
                                <Button
                                    id="btnReturnPeriodFilters"
                                    onClick={onClose}
                                >
                                    {resources.btnReturn}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )}
        </>
    );
};
// #endregion Component

// Export: Component
export default PeriodFiltersEdit;