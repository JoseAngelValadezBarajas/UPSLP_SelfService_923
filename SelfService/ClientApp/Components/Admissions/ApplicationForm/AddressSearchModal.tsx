/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AddressSearchModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAddress } from '../../../Types/Account/IAddress';
import { IAddressSearchModal } from '../../../Types/Resources/Admissions/IApplicationFormResources';

// #endregion Types

// #region Internal types
export interface IAddressSearchModalProps {
    addresses?: IAddress[];
    hasSearchZipCode: boolean;
    open: boolean;
    pageNumber: number;
    pageSize: number;
    rowsPerPageOptions: number[];
    totalAddress: number;
    zipCode?: string;

    // events
    onChangePage: (event: any, page: number) => void;
    onChangeRowsPerPage: (event: any) => void;
    onChangeTextField?: (event: any) => void;
    onClear: () => void;
    onClickLink: (zipCode?: string, city?: string, stateProvinceId?: number, countryId?: number,
        countyId?: number) => void;
    onClose: () => void;
    onSearch: () => void;

    // resources
    resources: IAddressSearchModal;
}
// #endregion Internal types

// #region Component
const AddressSearchModal: React.FC<IAddressSearchModalProps> = (props: IAddressSearchModalProps): JSX.Element => {
    const {
        addresses,
        hasSearchZipCode,
        open,
        pageNumber,
        pageSize,
        rowsPerPageOptions,
        totalAddress,
        zipCode,

        // events
        onChangePage,
        onChangeRowsPerPage,
        onChangeTextField,
        onClear,
        onClickLink,
        onClose,
        onSearch,

        // resources
        resources
    } = props;

    const footerModal: JSX.Element = (
        <ButtonGroup id="btnAddressSearchModal">
            <Button
                id={'btnAddressSearch'}
                onClick={onSearch}
            >
                {resources.btnSearch}
            </Button>
            <Button
                id={'btnAddressClear'}
                color="secondary"
                onClick={onClear}
            >
                {resources.btnClear}
            </Button>
        </ButtonGroup>
    );

    let table: JSX.Element | undefined;

    if (addresses && addresses.length > 0) {
        const tableBody: JSX.Element[] = [];
        addresses.forEach((address, j) => {
            tableBody.push(
                <TableRow key={`zipCode_${j}`}>
                    <TableCell
                        columnName={resources.lblZipCode}
                        component="th"
                        scope="row"
                    >
                        <Button
                            align="left"
                            id={`btnPostalCode_${j}`}
                            textVariantStyling="inherit"
                            variant="text"
                            onClick={onClickLink(address.zipCode, address.city, address.stateProvinceId, address.countryId, address.countyId)}
                        >
                            {address.zipCode}
                        </Button>
                    </TableCell>
                    <TableCell columnName={resources.lblCity}>
                        <span>
                            {address.city}
                        </span>
                    </TableCell>
                    <TableCell columnName={resources.lblState} >
                        <span>
                            {address.state}
                        </span>
                    </TableCell>
                    <TableCell columnName={resources.lblCounty}>
                        <span>
                            {address.county}
                        </span>
                    </TableCell>
                    <TableCell columnName={resources.lblCountry}>
                        <span>
                            {address.country}
                        </span>
                    </TableCell>
                </TableRow>
            );
        });

        table = (
            <Grid container spacing={3}>
                <Grid item xs>
                    <Table
                        breakpoint="sm"
                        id="tblAddress"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">
                                    {resources.lblZipCode}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblCity}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblState}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblCounty}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblCountry}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableBody}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        );
    }
    else if (hasSearchZipCode) {
        table = (
            <Text>
                {resources.lblNoResults}
            </Text>
        );
    }

    let paginationComponent: JSX.Element | undefined;
    if (addresses && addresses.length > 0) {
        paginationComponent = (
            <Grid container spacing={3}>
                <Grid item xs>
                    <Pagination
                        count={totalAddress}
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
                        id="txtZipCode"
                        label={resources.lblZipCode}
                        type="text"
                        value={zipCode || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onSearch}
                    />
                </Grid>
                <br />
                <Grid item xs={12}>
                    {footerModal}
                </Grid>
            </Grid>
            <br />
            <div aria-live="polite">
                {table}
            </div>
            {paginationComponent}
        </>
    );

    return (
        <Modal
            id="searchModal"
            header={resources.lblTitle}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            {bodyModal}
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AddressSearchModal;