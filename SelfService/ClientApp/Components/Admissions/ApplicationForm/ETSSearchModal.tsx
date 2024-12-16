/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ETSSearchModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IInstitution } from '../../../Types/Applications/IInstitution';
import { IETSSearchModal } from '../../../Types/Resources/Admissions/IApplicationFormResources';

// #endregion

// #region Internal types
export interface IETSSearchModalProps {
    city?: string;
    countries: IDropDownOption[];
    country?: number;
    etsCode?: string;
    institutionName?: string;
    institutions?: IInstitution[];
    open: boolean;
    pageNumber: number;
    pageSize: number;
    rowsPerPageOptions: number[];
    state?: number;
    states: IDropDownOption[];
    totalInstitutions: number;

    // events
    onChangeDropDownETSSearch?: (optionSelected: IDropDownOption, id: string) => void;
    onChangePage: (event: any, page: number) => void;
    onChangeRowsPerPage: (event: any) => void;
    onChangeTextFieldETSSearch?: (event: any) => void;
    onClear: () => void;
    onClickLink: (institutionName?: string, etsCode?: string, ficeCode?: string,
        city?: string, stateProvinceId?: number, countryId?: number) => void;
    onClose: () => void;
    onSearch: () => void;

    // resources
    resources: IETSSearchModal;
}
// #endregion

// #region Component
const ETSSearchModal: React.FC<IETSSearchModalProps> = (props: IETSSearchModalProps): JSX.Element => {
    const {
        city,
        countries,
        country,
        etsCode,
        institutionName,
        institutions,
        open,
        pageNumber,
        pageSize,
        rowsPerPageOptions,
        state,
        states,
        totalInstitutions,

        // events
        onChangeDropDownETSSearch,
        onChangePage,
        onChangeRowsPerPage,
        onChangeTextFieldETSSearch,
        onClear,
        onClickLink,
        onClose,
        onSearch,

        // resources
        resources
    } = props;

    const emptyOptionState: IDropDownOption = {
        description: resources.lblEmptyOptionState,
        value: ''
    };

    const emptyOptionCountry: IDropDownOption = {
        description: resources.lblEmptyOptionCountry,
        value: ''
    };

    const footerModal: JSX.Element = (
        <ButtonGroup id="btgETSSearchModal">
            <Button
                id={'btnSearch'}
                onClick={onSearch}
            >
                {resources.btnSearch}
            </Button>
            <Button
                id={'btnClear'}
                color="secondary"
                onClick={onClear}
            >
                {resources.btnClear}
            </Button>
        </ButtonGroup>
    );

    let tableInstitutions: JSX.Element | undefined;
    if (institutions && institutions.length > 0) {
        tableInstitutions = (
            <Grid container spacing={3}>
                <Grid item xs>
                    <Table
                        breakpoint="sm"
                        id="tblInstitutions"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">
                                    {resources.lblInstitutionName}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblETSCode}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblFICECode}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblCity}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblState}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblCountry}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                institutions.map(
                                    (row, i) => (
                                        <TableRow key={`institution_${i}`}>
                                            <TableCell
                                                columnName={resources.lblInstitutionName}
                                                component="th"
                                                scope="row"
                                            >
                                                <Link
                                                    id={`lnk_${i}`}
                                                    onClick={onClickLink(row.name, row.etsCode, row.ficeCode, row.city,
                                                        row.stateProvinceId, row.countryId)}
                                                >
                                                    <span>
                                                        {row.name}
                                                    </span>
                                                </Link>
                                            </TableCell>
                                            <TableCell
                                                columnName={resources.lblETSCode}
                                            >
                                                <span>
                                                    {row.etsCode}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                columnName={resources.lblFICECode}
                                            >
                                                <span>
                                                    {row.ficeCode}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                columnName={resources.lblCity}
                                            >
                                                <span>
                                                    {row.city}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                columnName={resources.lblState}
                                            >
                                                <span>
                                                    {row.stateDesc}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                columnName={resources.lblCountry}
                                            >
                                                <span>
                                                    {row.countryDesc}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
                            }
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        );
    }

    let paginationComponent: JSX.Element | undefined;
    if (institutions && institutions.length > 0) {
        paginationComponent = (
            <Grid container spacing={3}>
                <Grid item xs>
                    <Pagination
                        count={totalInstitutions}
                        page={pageNumber}
                        rowsPerPage={pageSize}
                        rowsPerPageOptions={rowsPerPageOptions}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        );
    }

    let bodyModal: JSX.Element;
    bodyModal = (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="txtInstitutionName"
                        label={resources.lblInstitutionName}
                        type="text"
                        value={institutionName || ''}
                        onChange={onChangeTextFieldETSSearch}
                        onEnterPress={onSearch}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        id="txtEtsCode"
                        label={resources.lblETSCode}
                        type="text"
                        value={etsCode || ''}
                        onChange={onChangeTextFieldETSSearch}
                        onEnterPress={onSearch}
                    />
                </Grid>
                <br />
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="txtCity"
                        label={resources.lblCity}
                        type="text"
                        value={city || ''}
                        onChange={onChangeTextFieldETSSearch}
                        onEnterPress={onSearch}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Dropdown
                        emptyOption={emptyOptionState}
                        id="ddlState"
                        label={resources.lblState}
                        options={states}
                        value={state || ''}
                        onChange={onChangeDropDownETSSearch}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Dropdown
                        emptyOption={emptyOptionCountry}
                        id="ddlCountry"
                        label={resources.lblCountry}
                        options={countries}
                        value={country || ''}
                        onChange={onChangeDropDownETSSearch}
                    />
                </Grid>
                <br />
                <Grid item xs={12}>
                    {footerModal}
                </Grid>
            </Grid>
            <br />
            {tableInstitutions}
            {paginationComponent}
        </>
    );

    return (
        <Modal
            id="etsSearchModal"
            header={resources.lblTitle}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            {bodyModal}
        </Modal>
    );
};
// #endregion

// Export: Component
export default ETSSearchModal;