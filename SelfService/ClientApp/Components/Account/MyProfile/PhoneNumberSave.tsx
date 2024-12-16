/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: PhoneNumberSave.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IPersonPhone } from '../../../Types/Account/IPersonPhone';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IPhoneNumberSaveProps {
    countryOptions?: IDropDownOption[];
    doNotCallReasons?: IDropDownOption[];
    phoneNumber: IPersonPhone;
    phoneTypeOptions?: IDropDownOption[];
    resources: IPhoneNumberSaveResProps;
    onCancelSave: () => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

export interface IPhoneNumberSaveResProps {
    btnCancel: string;
    btnSave: string;
    lblAddPhoneNumber: string;
    lblCountry: string;
    lblCountryRequired: string;
    lblDescription: string;
    lblDoNotCallReason: string;
    lblEditPhoneNumber: string;
    lblNumber: string;
    lblNumberRequired: string;
    lblPhoneNumberIsDuplicated: string;
    lblType: string;
    lblTypeRequired: string;
}
// #endregion Types

// #region Component
const PhoneNumberSave: React.FC<IPhoneNumberSaveProps> = (props: IPhoneNumberSaveProps): JSX.Element => {
    const {
        countryOptions,
        doNotCallReasons,
        phoneNumber,
        phoneTypeOptions,
        resources,
        onCancelSave,
        onChangeDropdown,
        onChangeTextField,
        onSave
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

    const emptyOption: IDropDownOption = {
        description: layoutResources ? layoutResources.lblDropDownEmptyText : '',
        value: 0
    };

    return (
        <Grid container alignItems="center">
            {phoneNumber.isDuplicated && (
                <Grid item xs={12}>
                    <Alert
                        id="msgPhoneNumberIsDuplicated"
                        open={phoneNumber.isDuplicated}
                        text={resources.lblPhoneNumberIsDuplicated}
                        type={ResultType.error}
                        userDismissable={false}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <Text size="h2">
                    {phoneNumber.id ?
                        resources.lblEditPhoneNumber : resources.lblAddPhoneNumber}
                </Text>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Dropdown
                    emptyOption={emptyOption}
                    error={phoneNumber.typeModified && !Boolean(phoneNumber.type)}
                    helperText={phoneNumber.typeModified && !Boolean(phoneNumber.type) ?
                        resources.lblTypeRequired : ''}
                    id="ddlType"
                    label={resources.lblType}
                    options={phoneTypeOptions}
                    required
                    value={phoneNumber.type}
                    onChange={onChangeDropdown}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Dropdown
                    emptyOption={emptyOption}
                    error={phoneNumber.countryIdModified && !Boolean(phoneNumber.countryId)}
                    helperText={phoneNumber.countryIdModified && !Boolean(phoneNumber.countryId) ?
                        resources.lblCountryRequired : ''}
                    id="ddlCountry"
                    label={resources.lblCountry}
                    options={countryOptions}
                    required
                    value={phoneNumber.countryId}
                    onChange={onChangeDropdown}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    error={phoneNumber.numberModified && !Boolean(phoneNumber.number)}
                    helperText={phoneNumber.numberModified && !Boolean(phoneNumber.number) ?
                        resources.lblNumberRequired : ''}
                    id="txtNumber"
                    label={resources.lblNumber}
                    maxCharacters={30}
                    required
                    value={phoneNumber.number || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Text>
                    {phoneNumber.format ? phoneNumber.formattedNumber : phoneNumber.number}
                </Text>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="txtDescription"
                    label={resources.lblDescription}
                    maxCharacters={40}
                    multiline
                    value={phoneNumber.description || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    id="ddlDoNotCallReason"
                    label={resources.lblDoNotCallReason}
                    options={doNotCallReasons}
                    value={phoneNumber.doNotCallReasonId}
                    onChange={onChangeDropdown}
                />
            </Grid>
            <Grid item xs={12}>
                <ButtonGroup id="bgSavePhoneNumber">
                    <Button
                        id="btnSave"
                        onClick={onSave}
                    >
                        {resources.btnSave}
                    </Button>
                    <Button
                        color="secondary"
                        id="btnCancel"
                        onClick={onCancelSave}
                    >
                        {resources.btnCancel}
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
};
// #endregion Component

// Export: Component
export default PhoneNumberSave;