/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: InqFieldGroupSetup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Table, { TableBody, TableCell, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IFieldSetup } from '../../../Types/Form/IFieldSetup';
import { IAppFieldGroupSetupResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface IInqFieldGroupSetupProps {
    availableCountries: IDropDownOption[];
    availableGridSize: IDropDownOption[];
    emptyFGDuplicatedMessage?: boolean;
    emptyFGFormatMessage?: boolean;
    emptyFGNotValidMessage?: boolean;
    emptyFGRangeMessage?: boolean;
    emptyFGRequiredMessage?: boolean;
    emptyGridSize?: boolean;
    emptyInvFormatMessage?: boolean;
    emptyLabel?: boolean;
    emptyNotNumericMessage?: boolean;
    emptyNotValidMessage?: boolean;
    emptyOutRangeMessage?: boolean;
    emptyRequiredMessage?: boolean;
    fieldGroupId: string;
    fields?: IFieldSetup[];
    instructions?: string;
    label?: string;
    maxAllowed?: string;
    selectedDefault?: string | number;
    selectedGridSize?: string | number;
    open: boolean;
    validatorFGDupMessage?: string;
    validatorFGInvFormatMessage?: string;
    validatorFGNotValidMessage?: string;
    validatorFGRangeMessage?: string;
    validatorFGRequiredMessage?: string;
    validatorInvFormatMessage?: string;
    validatorNotNumericMessage?: string;
    validatorNotValidMessage?: string;
    validatorOutRangeMessage?: string;
    validatorRequiredMessage?: string;

    // events
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: any) => void;
    onClickDownButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickUpButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClose: () => void;
    onEditField: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSave: () => void;

    resources: IAppFieldGroupSetupResources;
}

const styles = (() => createStyles({
    table: {
        '& > tbody > tr > th:nth-child(1)': {
            width: '10%'
        },
        '& > tbody > tr > th:nth-child(2)': {
            width: '70%'
        },
        '& > tbody > tr > th:nth-child(3)': {
            width: '10%'
        },
        '& > tbody > tr > th:nth-child(4)': {
            width: '10%'
        }
    }
}));

type PropsWithStyles = IInqFieldGroupSetupProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const InqFieldGroupSetup: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        availableCountries,
        availableGridSize,
        classes,
        emptyFGDuplicatedMessage,
        emptyFGFormatMessage,
        emptyFGNotValidMessage,
        emptyFGRangeMessage,
        emptyFGRequiredMessage,
        emptyGridSize,
        emptyInvFormatMessage,
        emptyLabel,
        emptyNotNumericMessage,
        emptyNotValidMessage,
        emptyOutRangeMessage,
        emptyRequiredMessage,
        fieldGroupId,
        fields,
        instructions,
        label,
        maxAllowed,
        selectedDefault,
        selectedGridSize,
        open,
        validatorFGDupMessage,
        validatorFGInvFormatMessage,
        validatorFGNotValidMessage,
        validatorFGRangeMessage,
        validatorFGRequiredMessage,
        validatorInvFormatMessage,
        validatorNotNumericMessage,
        validatorNotValidMessage,
        validatorOutRangeMessage,
        validatorRequiredMessage,

        onChangeDropDown,
        onChangeTextField,
        onClickDownButton,
        onClickUpButton,
        onClose,
        onEditField,
        onSave,

        resources
    } = props;

    let bodyModal: JSX.Element | undefined;
    // Field groups with one field
    if (fieldGroupId !== 'addressInformationGroup' &&
        fieldGroupId !== 'educationGroup' &&
        fieldGroupId !== 'phoneGroup' &&
        fieldGroupId !== 'ipedsGroup' &&
        fieldGroupId !== 'programOfStudyGroup' &&
        fieldGroupId !== 'activityGroup') {

        let validationMessages: JSX.Element | undefined;

        if (fieldGroupId !== 'seekingDegreeGroup' &&
            fieldGroupId !== 'financialAidGroup' &&
            fieldGroupId !== 'extraCurricularActivityGroup' &&
            fieldGroupId !== 'otherSourceGroup' &&
            fieldGroupId !== 'governmentIdGroup' &&
            fieldGroupId !== 'emailGroup' &&
            fieldGroupId !== 'monthsInCountryGroup' &&
            fieldGroupId !== 'retiredGroup') {
            validationMessages = (
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyRequiredMessage}
                        helperText={emptyRequiredMessage ?
                            resources.lblValidatorReqMsgError : ''}
                        id="txtRequired"
                        label={resources.lblValidatorRequired}
                        required={true}
                        type="text"
                        value={validatorRequiredMessage || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onSave}
                    />
                </Grid>
            );
        }

        if (fieldGroupId === 'governmentIdGroup') {
            validationMessages = (
                <>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyRequiredMessage}
                            helperText={emptyRequiredMessage ?
                                resources.lblValidatorReqMsgError : ''}
                            id="txtRequired"
                            label={resources.lblValidatorRequired}
                            required={true}
                            type="text"
                            value={validatorRequiredMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyInvFormatMessage}
                            helperText={emptyInvFormatMessage ?
                                resources.lblValidatorInvFormatError : ''}
                            id="txtInvFormat"
                            label={resources.lblValidatorInvalidFormat}
                            required={true}
                            type="text"
                            value={validatorInvFormatMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                </>
            );
        }

        if (fieldGroupId === 'emailGroup') {
            validationMessages = (
                <>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyRequiredMessage}
                            helperText={emptyRequiredMessage ?
                                resources.lblValidatorReqMsgError : ''}
                            id="txtRequired"
                            label={resources.lblValidatorRequired}
                            required={true}
                            type="text"
                            value={validatorRequiredMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyNotValidMessage}
                            helperText={emptyNotValidMessage ?
                                resources.lblValidatorNotValidError : ''}
                            id="txtNotValid"
                            label={resources.lblValidatorNotValid}
                            required={true}
                            type="text"
                            value={validatorNotValidMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                </>
            );
        }

        if (fieldGroupId === 'monthsInCountryGroup') {
            validationMessages = (
                <>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyRequiredMessage}
                            helperText={emptyRequiredMessage ?
                                resources.lblValidatorReqMsgError : ''}
                            id="txtRequired"
                            label={resources.lblValidatorRequired}
                            required={true}
                            type="text"
                            value={validatorRequiredMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyNotNumericMessage}
                            helperText={emptyNotNumericMessage ?
                                resources.lblValidatorNotNumError : ''}
                            id="txtNotNumeric"
                            label={resources.lblValidatorNotNumeric}
                            required={true}
                            type="text"
                            value={validatorNotNumericMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyOutRangeMessage}
                            helperText={emptyOutRangeMessage ?
                                resources.lblValidatorOutRangeError : ''}
                            id="txtOutRange"
                            label={resources.lblValidatorOutRange}
                            required={true}
                            type="text"
                            value={validatorOutRangeMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                </>
            );
        }

        if (fieldGroupId === 'dateOfEntryGroup' ||
            fieldGroupId === 'dateOfBirthGroup' ||
            fieldGroupId === 'visaExpirationDateGroup' ||
            fieldGroupId === 'passportExpirationDateGroup') {
            validationMessages = (
                <>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyRequiredMessage}
                            helperText={emptyRequiredMessage ?
                                resources.lblValidatorReqMsgError : ''}
                            id="txtRequired"
                            label={resources.lblValidatorRequired}
                            required={true}
                            type="text"
                            value={validatorRequiredMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyInvFormatMessage}
                            helperText={emptyInvFormatMessage ?
                                resources.lblValidatorInvFormatError : ''}
                            id="txtInvFormat"
                            label={resources.lblValidatorInvalidFormat}
                            required={true}
                            type="text"
                            value={validatorInvFormatMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                </>
            );
        }

        const emptyOption: IDropDownOption = {
            description: String(resources.lblSelect),
            value: ''
        };
        // Default dropdown
        let defaultDrop: JSX.Element | undefined;
        if (fieldGroupId === 'primaryCitizenshipGroup' ||
            fieldGroupId === 'secondayCitizenshipGroup' ||
            fieldGroupId === 'countryOfBirthGroup' ||
            fieldGroupId === 'visaCountryGroup' ||
            fieldGroupId === 'passportCountryGroup') {
            defaultDrop = (
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlDefault"
                        label={resources.lblDefault}
                        options={availableCountries}
                        value={selectedDefault || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
            );
        }

        bodyModal = (
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyLabel}
                            helperText={emptyLabel ?
                                resources.lblLabelRequired : ''}
                            id="txtFieldGroupLabel"
                            label={resources.lblLabel}
                            required={true}
                            type="text"
                            value={label || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    {fieldGroupId !== 'retiredGroup' &&
                        fieldGroupId !== 'interestGroup' &&
                        fieldGroupId !== 'extraCurricularActivityGroup' &&
                        fieldGroupId !== 'financialAidGroup' &&
                        fieldGroupId !== 'seekingDegreeGroup' &&
                        fieldGroupId !== 'criminalConvictionsGroup' ?
                        (
                            <Grid item xs={12} md={12}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    error={emptyGridSize}
                                    helperText={emptyGridSize ?
                                        resources.lblGridSizeRequired : ''}
                                    id="ddlGridSize"
                                    label={resources.lblGridSize}
                                    options={availableGridSize}
                                    required={true}
                                    value={selectedGridSize || ''}
                                    onChange={onChangeDropDown}
                                />
                            </Grid>
                        ) : undefined}
                    {validationMessages}
                    {defaultDrop}
                    <br />
                </Grid>
            </>
        );
    }
    // fields groups
    else {
        let fieldsTable: JSX.Element | undefined;
        const fieldsTableBody: JSX.Element[] = [];
        if (fields && fields.length > 0) {
            fields.sort(function (a, b) {
                if (a.sortOrder > b.sortOrder) {
                    return 1;
                }
                if (a.sortOrder < b.sortOrder) {
                    return -1;
                }
                return 0;
            }).forEach((field, i) => {
                let downIcon: JSX.Element | undefined;
                let upIcon: JSX.Element | undefined;
                if (fieldGroupId !== 'ipedsGroup' &&
                    fieldGroupId !== 'phoneGroup' &&
                    fieldGroupId !== 'programOfStudyGroup') {
                    downIcon = (
                        <Tooltip
                            id="DownFGIcon"
                            placement="top"
                            title={resources.lblDown}
                        >
                            <IconButton
                                color="secondary"
                                id={`iconButtonDown|${field.sortOrder}`}
                                onClick={onClickDownButton}
                            >
                                <Icon name="arrow-down" />
                            </IconButton>
                        </Tooltip>
                    );
                    upIcon = (
                        <Tooltip
                            id="UpFGIcon"
                            placement="top"
                            title={resources.lblUp}
                        >
                            <IconButton
                                color="secondary"
                                id={`iconButtonUp|${field.sortOrder}`}
                                onClick={onClickUpButton}
                            >
                                <Icon name="arrow-up" />
                            </IconButton>
                        </Tooltip>
                    );
                }
                if ((fieldGroupId !== 'ipedsGroup' && i > 0)) {
                    fieldsTableBody.push(
                        <TableRow
                            key={`fieldRow_${i}`}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                <Tooltip
                                    id="EditFGIcon"
                                    placement="top"
                                    title={resources.lblEdit}
                                >
                                    <IconButton
                                        color="secondary"
                                        id={`iconEditFGButton|${field.sortOrder}`}
                                        onClick={onEditField}
                                    >
                                        <Icon name="edit" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                {field.id}
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                {upIcon}
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                {downIcon}
                            </TableCell>
                        </TableRow>
                    );
                }
            });
        }

        fieldsTable = (
            <Table
                classes={{ root: classes.table }}
                id="tblFieldsList"
            >
                <TableBody>
                    {fieldsTableBody}
                </TableBody>
            </Table>
        );

        let validationMessages: JSX.Element | undefined;
        if (fieldGroupId === 'ipedsGroup') {
            validationMessages = (
                <>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyFGNotValidMessage}
                            helperText={emptyFGNotValidMessage ?
                                resources.lblValidatorNotValidError : ''}
                            id="txtFGNotValid"
                            label={resources.lblValidatorNotValid}
                            required={true}
                            type="text"
                            value={validatorFGNotValidMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <br />
                    <Grid item xs={12} md={12}>
                        {fieldsTable}
                    </Grid>
                </>
            );
        }

        if (fieldGroupId === 'educationGroup') {
            validationMessages = (
                <>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyFGDuplicatedMessage}
                            helperText={emptyFGDuplicatedMessage ?
                                resources.lblValidatorDupMsgError : ''}
                            id="txtFGDuplicated"
                            label={resources.lblValidatorDup}
                            required={true}
                            type="text"
                            value={validatorFGDupMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyFGNotValidMessage}
                            helperText={emptyFGNotValidMessage ?
                                resources.lblValidatorNotValidError : ''}
                            id="txtFGNotValid"
                            label={resources.lblValidatorNotValid}
                            required={true}
                            type="text"
                            value={validatorFGNotValidMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyFGFormatMessage}
                            helperText={emptyFGFormatMessage ?
                                resources.lblValidatorInvFormatError : ''}
                            id="txtFGInvFormat"
                            label={resources.lblValidatorInvalidFormat}
                            required={true}
                            type="text"
                            value={validatorFGInvFormatMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyFGRangeMessage}
                            helperText={emptyFGRangeMessage ?
                                resources.lblValidatorOutRangeError : ''}
                            id="txtFGOutRange"
                            label={resources.lblValidatorOutRange}
                            required={true}
                            type="text"
                            value={validatorFGRangeMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <br />
                    <Grid item xs={12} md={12}>
                        {fieldsTable}
                    </Grid>
                </>
            );
        }

        if (fieldGroupId === 'addressInformationGroup') {
            validationMessages = (
                <>
                    {fieldsTable}
                </>
            );
        }

        if (fieldGroupId === 'phoneGroup' ||
            fieldGroupId === 'programOfStudyGroup' ||
            fieldGroupId === 'activityGroup') {
            validationMessages = (
                <>
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyFGDuplicatedMessage}
                            helperText={emptyFGDuplicatedMessage ?
                                resources.lblValidatorDupMsgError : ''}
                            id="txtFGDuplicated"
                            label={resources.lblValidatorDup}
                            required={true}
                            type="text"
                            value={validatorFGDupMessage || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    {fieldsTable}
                </>
            );
        }

        let maxAllow: JSX.Element | undefined;
        if (fieldGroupId !== 'ipedsGroup' &&
            fieldGroupId !== 'addressInformationGroup') {
            maxAllow = (
                <Grid item xs={12} md={12}>
                    <TextField
                        id="txtFGMaxAllowed"
                        label={resources.lblMaxAllowed}
                        type="text"
                        value={maxAllowed || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onSave}
                    />
                </Grid>
            );
        }

        bodyModal = (
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            id="txtFieldGroupLabel"
                            label={resources.lblLabel}
                            type="text"
                            value={label || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            id="txtFGInstructions"
                            label={resources.lblInstructions}
                            type="text"
                            value={instructions || ''}
                            onChange={onChangeTextField}
                            onEnterPress={onSave}
                        />
                    </Grid>
                    {maxAllow}
                    {fieldGroupId === 'ipedsGroup' ||
                        fieldGroupId === 'programOfStudyGroup' ||
                        fieldGroupId === 'educationGroup' ?
                        (
                            <Grid item xs={12} md={12}>
                                <TextField
                                    error={emptyFGRequiredMessage}
                                    helperText={emptyFGRequiredMessage ?
                                        resources.lblValidatorReqMsgError : ''}
                                    id="txtFGRequired"
                                    label={resources.lblValidatorRequired}
                                    required={true}
                                    type="text"
                                    value={validatorFGRequiredMessage || ''}
                                    onChange={onChangeTextField}
                                    onEnterPress={onSave}
                                />
                            </Grid>
                        ) :
                        undefined}
                    {validationMessages}
                    <br />
                </Grid>
            </>
        );
    }

    return (
        <Modal
            disableBackdropClick
            footer={(
                < Button
                    id={'btnSave'}
                    onClick={onSave}
                >
                    {resources.btnSave}
                </Button>
            )}
            id="appFieldGroupSetupModal"
            header={`${resources.lblTitle} ${fieldGroupId}`}
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
export default withStyles(styles)(InqFieldGroupSetup);