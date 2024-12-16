/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: AddressSave.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAddressDetail } from '../../../Types/Account/IAddressDetail';
import { IAddressOptions } from '../../../Types/Account/IAddressOptions';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface IAddressSaveProps {
    address: IAddressDetail;
    addressOptions: IAddressOptions;
    cultures: ICultures;
    isAddressRequest?: boolean;
    resources: IAddressSaveResProps;
    onCancelSave: () => void;
    onChangeCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDatePicker: (date: string, id: string, isValid: boolean) => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveAddress: () => void;
}

export interface IAddressSaveResProps {
    btnCancel: string;
    btnSave: string;
    lblAddAddress: string;
    lblAddressLine1: string;
    lblAddressLine2: string;
    lblAddressLine3: string;
    lblAddressLine4: string;
    lblAddressType: string;
    lblCity: string;
    lblCountry: string;
    lblDateInfomation: string;
    lblDateInvalid: string;
    lblEditAddress: string;
    lblEffectiveDate: string;
    lblErrorAddressLine: string;
    lblErrorAddressType: string;
    lblErrorCity: string;
    lblErrorCountry: string;
    lblErrorEffectiveDate: string;
    lblHouseNumber: string;
    lblPostalCode: string;
    lblPreferred: string;
    lblRecurring: string;
    lblSelect: string;
    lblStateProvince: string;
}

const styles = (theme: Theme) => createStyles({
    icon: {
        color: theme.palette.action.active,
        cursor: 'pointer'
    },
    iconInfo: {
        alignSelf: 'center',
        padding: `${Tokens.spacing35} 0 ${Tokens.spacing35}!important`
    },
    popperText: {
        maxWidth: '15rem'
    }
});

type PropsWithStyles = IAddressSaveProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const AddressSave: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        address,
        addressOptions,
        classes,
        cultures,
        isAddressRequest,
        resources,
        onCancelSave,
        onChangeCheckbox,
        onChangeDatePicker,
        onChangeDropdown,
        onChangeTextField,
        onSaveAddress
    } = props;

    const emptyOption: IDropDownOption = {
        description: resources.lblSelect,
        value: 0
    };

    const [openInfo, setOpenInfo] = useState(false);
    const onChangeOpen = (): void => {
        setOpenInfo(!openInfo);
    };

    const [anchorEl, setAnchorEl] = useState(undefined);
    const onChangeInfo = (event: any): void => {
        setAnchorEl(event.currentTarget);
        onChangeOpen();
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Text size="h2">
                    {address.sequenceNumber ?
                        resources.lblEditAddress : resources.lblAddAddress}
                </Text>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Dropdown
                    id="ddlAddressType"
                    label={resources.lblAddressType}
                    options={addressOptions.addressTypes}
                    value={address.addressTypeId}
                    error={address.isAddressTypeInvalid}
                    required
                    helperText={address.isAddressTypeInvalid ? resources.lblErrorAddressType : ''}
                    onChange={onChangeDropdown}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="txtHouseNumber"
                    label={resources.lblHouseNumber}
                    maxCharacters={10}
                    value={address.houseNumber}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="txtAddressLine1"
                    label={resources.lblAddressLine1}
                    required
                    error={address.isAddressLine1Invalid}
                    helperText={address.isAddressLine1Invalid ? resources.lblErrorAddressLine : ''}
                    maxCharacters={75}
                    value={address.addressLine1}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="txtAddressLine2"
                    label={resources.lblAddressLine2}
                    maxCharacters={75}
                    value={address.addressLine2}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="txtAddressLine3"
                    label={resources.lblAddressLine3}
                    maxCharacters={75}
                    value={address.addressLine3}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="txtAddressLine4"
                    label={resources.lblAddressLine4}
                    maxCharacters={75}
                    value={address.addressLine4}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="txtPostalCode"
                    label={resources.lblPostalCode}
                    maxCharacters={15}
                    value={address.zipCode}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} sm={6} />
            <Grid item xs={12} sm={6}>
                <TextField
                    id="txtCity"
                    label={resources.lblCity}
                    maxCharacters={50}
                    required
                    error={address.isCityInvalid}
                    helperText={address.isCityInvalid ? resources.lblErrorCity : ''}
                    value={address.city}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Dropdown
                    emptyOption={emptyOption}
                    id="ddlStateProvince"
                    label={resources.lblStateProvince}
                    options={addressOptions.states}
                    value={address.stateProvinceId}
                    onChange={onChangeDropdown}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Dropdown
                    emptyOption={emptyOption}
                    id="ddlCountry"
                    label={resources.lblCountry}
                    required
                    error={address.isCountryInvalid}
                    helperText={address.isCountryInvalid ? resources.lblErrorCountry : ''}
                    options={addressOptions.countries}
                    value={address.countryId}
                    onChange={onChangeDropdown}
                />
            </Grid>
            <Grid item xs={11} sm={5}>
                <DatePicker
                    culture={cultures.dateTimeCulture}
                    flip
                    format={cultures.shortDatePattern}
                    error={address.isEffectiveDateInvalid || address.isEffectiveDateEmtpy}
                    helperText={address.isEffectiveDateInvalid ? resources.lblDateInvalid :
                        (address.isEffectiveDateEmtpy ? resources.lblErrorEffectiveDate : '')
                    }
                    id="dtpEffectiveDate"
                    label={resources.lblEffectiveDate}
                    required
                    value={address.effectiveDate}
                    onChange={onChangeDatePicker}
                />
            </Grid>
            {address.sequenceNumber || isAddressRequest ? (
                <Grid item xs={1} className={classes.iconInfo}>
                    <Icon
                        className={classes.icon}
                        name="info"
                        onClick={onChangeInfo}
                    />
                    <Popper
                        arrow
                        id="pop_Info"
                        open={openInfo}
                        placement="bottom-end"
                        anchorEl={anchorEl}
                        onClickAway={onChangeOpen}
                        text={resources.lblDateInfomation}
                        transition={false}
                        TextTypographyProps={{ className: classes.popperText }}
                    />
                </Grid>
            ) : undefined}
            {addressOptions.recurAnually ? (
                <Grid item xs={12}>
                    <Checkbox
                        checked={address.isRecurring}
                        id="chkRecurring"
                        label={resources.lblRecurring}
                        onChange={onChangeCheckbox}
                    />
                </Grid>
            ) : undefined}
            <Grid item xs={12}>
                <ButtonGroup id="bgSaveAddress">
                    <Button
                        id="btnSave"
                        onClick={onSaveAddress}
                    >
                        {resources.btnSave}
                    </Button>
                    <Button
                        color="secondary"
                        id={'btnCancel'}
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
export default withStyles(styles)(AddressSave);