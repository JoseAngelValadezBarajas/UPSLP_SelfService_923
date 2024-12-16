/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAppFieldSetup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAppFieldGroupSetupResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppFieldSetupProps {
    availableCounties: IDropDownOption[];
    availableCountries: IDropDownOption[];
    availableGridSize: IDropDownOption[];
    availablePrograms: IDropDownOption[];
    availableStates: IDropDownOption[];
    emptyDuplicatedMessage: boolean;
    emptyGridSize?: boolean;
    emptyInvFormatMessage?: boolean;
    emptyLabel?: boolean;
    emptyNotNumericMessage?: boolean;
    emptyNotValidMessage?: boolean;
    emptyOutRangeMessage?: boolean;
    emptyRequiredMessage?: boolean;
    fieldGroupId: string;
    fieldId: string;
    label?: string;
    selectedDefault?: string | number;
    selectedGridSize?: string | number;
    open: boolean;
    validatorDupValidator?: string;
    validatorNotNumericMessage?: string;
    validatorNotValidMessage?: string;
    validatorOutRangeMessage?: string;
    validatorRequiredMessage?: string;

    // events
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: any) => void;
    onClose: () => void;
    onSave: () => void;

    resources: IAppFieldGroupSetupResources;
}
// #endregion Types

// #region Component
const AppFieldSetup: React.FC<IAppFieldSetupProps> = (props: IAppFieldSetupProps): JSX.Element => {
    const {
        availableCounties,
        availableCountries,
        availableStates,
        availableGridSize,
        availablePrograms,
        emptyDuplicatedMessage,
        emptyGridSize,
        emptyLabel,
        emptyNotNumericMessage,
        emptyNotValidMessage,
        emptyOutRangeMessage,
        emptyRequiredMessage,
        fieldGroupId,
        fieldId,
        label,
        selectedDefault,
        selectedGridSize,
        open,
        validatorDupValidator,
        validatorNotNumericMessage,
        validatorNotValidMessage,
        validatorOutRangeMessage,
        validatorRequiredMessage,

        onChangeDropDown,
        onChangeTextField,
        onClose,
        onSave,

        resources
    } = props;

    const emptyOption: IDropDownOption = {
        description: String(resources.lblSelect),
        value: ''
    };
    let gridSize: JSX.Element | undefined;
    if (fieldGroupId !== 'ipedsGroup' &&
        fieldGroupId !== 'phoneGroup' &&
        fieldGroupId !== 'testScoreGroup' &&
        fieldGroupId !== 'employmentGroup' &&
        fieldGroupId !== 'programOfStudyGroup' &&
        fieldId !== 'participated9Id' &&
        fieldId !== 'participated10Id' &&
        fieldId !== 'participated11Id' &&
        fieldId !== 'participated12Id' &&
        fieldId !== 'participatedPostSecondaryId' &&
        fieldId !== 'relativesAttendedInstitutionId' &&
        fieldId !== 'interestedFoodPlanId' &&
        fieldId !== 'interestedDormPlanId') {
        gridSize = (
            <Grid item xs={12} md={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    error={emptyGridSize}
                    helperText={emptyGridSize ?
                        resources.lblGridSizeRequired : ''}
                    id="ddlFGGridSize"
                    label={resources.lblGridSize}
                    options={availableGridSize}
                    required={true}
                    value={selectedGridSize || ''}
                    onChange={onChangeDropDown}
                />
            </Grid>
        );
    }

    let fieldProperties: JSX.Element | undefined;
    if (fieldId !== 'hispanicRadioGroupId' &&
        fieldId !== 'noHispanicNestedCheckboxListId' &&
        fieldId !== 'participated9Id' &&
        fieldId !== 'participated10Id' &&
        fieldId !== 'participated11Id' &&
        fieldId !== 'participated12Id' &&
        fieldId !== 'participatedPostSecondaryId' &&
        fieldId !== 'relativesAttendedInstitutionId' &&
        fieldId !== 'interestedFoodPlanId' &&
        fieldId !== 'interestedDormPlanId') {
        fieldProperties = (
            <>
                {gridSize}
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyRequiredMessage}
                        helperText={emptyRequiredMessage ?
                            resources.lblValidatorReqMsgError : ''}
                        id="txtFRequired"
                        label={resources.lblValidatorRequired}
                        required={true}
                        type="text"
                        value={validatorRequiredMessage || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onSave}
                    />
                </Grid>
            </>
        );
    }

    let fieldValidations: JSX.Element | undefined;
    if (fieldId === 'educationEtsCodeId') {
        fieldValidations = (
            <Grid item xs={12} md={12}>
                <TextField
                    error={emptyNotValidMessage}
                    helperText={emptyNotValidMessage ?
                        resources.lblValidatorNotValidError : ''}
                    id="txtFNotValid"
                    label={resources.lblValidatorNotValid}
                    required={true}
                    type="text"
                    value={validatorNotValidMessage || ''}
                    onChange={onChangeTextField}
                    onEnterPress={onSave}
                />
            </Grid>
        );
    }
    if (fieldId === 'testDateTakenId') {
        fieldValidations = (
            <>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyNotValidMessage}
                        helperText={emptyNotValidMessage ?
                            resources.lblValidatorNotValidError : ''}
                        id="txtFNotValid"
                        label={resources.lblValidatorNotValid}
                        required={true}
                        type="text"
                        value={validatorNotValidMessage || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onSave}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyOutRangeMessage}
                        helperText={emptyOutRangeMessage ?
                            resources.lblValidatorOutRangeError : ''}
                        id="txtFOutRange"
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
    if (fieldId === 'testScoreId') {
        fieldValidations = (
            <>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyDuplicatedMessage}
                        helperText={emptyDuplicatedMessage ?
                            resources.lblValidatorDupMsgError : ''}
                        id="txtFDuplicated"
                        label={resources.lblValidatorDup}
                        required={true}
                        type="text"
                        value={validatorDupValidator || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onSave}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyNotNumericMessage}
                        helperText={emptyNotNumericMessage ?
                            resources.lblValidatorNotNumError : ''}
                        id="txtFNotNumeric"
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
                        id="txtFOutRange"
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

    // Default dropdown
    let defaultDrop: JSX.Element | undefined;
    if (fieldId === 'addressCountryId' ||
        fieldId === 'phoneCountryId') {
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
    if (fieldId === 'stateProvinceId') {
        defaultDrop = (
            <Grid item xs={12} md={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    id="ddlDefault"
                    label={resources.lblDefault}
                    options={availableStates}
                    value={selectedDefault || ''}
                    onChange={onChangeDropDown}
                />
            </Grid>
        );
    }

    if (fieldId === 'addressCountyId') {
        defaultDrop = (
            <Grid item xs={12} md={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    id="ddlDefault"
                    label={resources.lblDefault}
                    options={availableCounties}
                    value={selectedDefault || ''}
                    onChange={onChangeDropDown}
                />
            </Grid>
        );
    }

    if (fieldId === 'programOfStudydId') {
        defaultDrop = (
            <Grid item xs={12} md={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    id="ddlDefault"
                    label={resources.lblDefault}
                    options={availablePrograms}
                    value={selectedDefault || ''}
                    onChange={onChangeDropDown}
                />
            </Grid>
        );
    }

    return (
        <Modal
            disableBackdropClick
            footer={(
                <Button
                    id={'btnSave'}
                    onClick={onSave}
                >
                    {resources.btnSave}
                </Button>
            )}
            id="appFieldGroupSetupModal"
            header={`${resources.lblTitle} ${fieldId}`}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyLabel}
                        helperText={emptyLabel ?
                            resources.lblLabelRequired : ''}
                        id="txtFieldLabel"
                        label={resources.lblLabel}
                        required={true}
                        type="text"
                        value={label || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onSave}
                    />
                </Grid>
                {fieldProperties}
                {fieldValidations}
                {defaultDrop}
                <br />
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AppFieldSetup;