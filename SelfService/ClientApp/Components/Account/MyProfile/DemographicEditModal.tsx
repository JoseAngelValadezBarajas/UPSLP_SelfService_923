/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File:DemographicEditModal.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IDemographicMain } from '../../../Types/Account/IDemographicMain';
import { IDemographicOptions } from '../../../Types/Account/IDemographicOptions';
import { IDemographicMainResources } from '../../../Types/Resources/Account/IDemographicMainResources';
import { IDemographicList } from '../../../Types/Account/IDemographicList';
// #endregion

// #region Internal types
export interface IDemographicEditModalProps {
    demographicOptions: IDemographicOptions;
    demographicOptionsValues: IDemographicMain;
    open: boolean;
    onClose: () => void;
    onDropdownChange: (optionSelected: IDropDownOption, _id: string) => void;
    onTextFieldChange: (event: any) => void;
    onSave: () => void;

    resources: IDemographicMainResources;
}

const styles = () => createStyles({
    marginLeft: {
        marginLeft: Tokens.sizingLarge
    }
});

type PropsWithStyles = IDemographicEditModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const DemographicEditModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        demographicOptions,
        demographicOptionsValues,
        open,
        resources,
        onDropdownChange,
        onTextFieldChange,
        onClose,
        onSave
    } = props;

    const [key, setKey] = useState(0);

    function invalidItem(item: IDemographicList) {
        if (item.firstLoad) {
            return false;
        }
        return isNaN(item.value) || item.value === -1 || item.value === null;
    }

    const emptyOption: IDropDownOption = {
        description: resources.lblDropDownEmptyText,
        value: 'null'
    };

    const retirementOption: IDropDownOption[] = [
        emptyOption,
        {
            description: resources.lblNo,
            value: 0
        },
        {
            description: resources.lblYes,
            value: 1
        },
        {
            description: resources.lblUnknown,
            value: 2
        }
    ];

    const contentTable: JSX.Element[] | undefined = [];
    const contentTableRight: JSX.Element[] | undefined = [];
    demographicOptionsValues.editedDemographicViewModelList.forEach((item, i) => {
        switch (item.id) {
            case 'gender':
                contentTable.push(
                    <Grid container key={`demographicGender_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblGenderRequired : undefined}
                                id={`ddlGender_${i}`}
                                label={resources.lblGender}
                                options={demographicOptions.genders}
                                required={item.isRequired}
                                value={isNaN(item.value) ? emptyOption.value : item.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'ethnicity':
                contentTableRight.push(
                    <Grid container key={`demographicEthnicity_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblEthnicityRequired : undefined}
                                id={`ddlEtnicithy_${i}`}
                                label={resources.lblEthnicity}
                                options={demographicOptions.ethnicities}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'maritalStatus':
                contentTable.push(
                    <Grid container key={`demographicMaritalStatus_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblMaritalStatusRequired : undefined}
                                id={`ddlMaritalStatus_${i}`}
                                label={resources.lblMaritalStatus}
                                options={demographicOptions.maritalStatus}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'religion':
                contentTableRight.push(
                    <Grid container key={`demographicReligion_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblReligionRequired : undefined}
                                id={`ddlReligion_${i}`}
                                label={resources.lblReligion}
                                options={demographicOptions.religions}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'retirementStatus':
                contentTable.push(
                    <Grid container key={`demographicRetirementStatus_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblRetiredRequired : undefined}
                                id={`ddlRetirementStatus_${i}`}
                                label={resources.lblRetired}
                                options={retirementOption}
                                required={item.isRequired}
                                value={item.value >= 0 ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'veteran':
                contentTableRight.push(
                    <Grid container key={`demographicVeteran_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblVeteranRequired : undefined}
                                id={`ddlVeteran_${i}`}
                                label={resources.lblVeteran}
                                options={demographicOptions.veteranStatus}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'primaryCitizenship':
                contentTable.push(
                    <Grid container key={`demographicPrimaryCitizenship_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblCitizenshipRequired : undefined}
                                id={`ddlPrimaryCitizenship_${i}`}
                                label={resources.lblPrimaryCitizenship}
                                options={demographicOptions.countries}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'secondaryCitizenship':
                contentTableRight.push(
                    <Grid container key={`demographicSecondaryCitizenship_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblSecondaryCitizenshipRequired : undefined}
                                id={`ddlSecondaryCitizenship_${i}`}
                                label={resources.lblSecondaryCitizenship}
                                options={demographicOptions.countries}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'visa':
                contentTable.push(
                    <Grid container key={`demographicVisa_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                error={item.isRequired && invalidItem(item)}
                                emptyOption={emptyOption}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblVisaRequired : undefined}
                                id={`ddlVisa_${i}`}
                                label={resources.lblVisa}
                                options={demographicOptions.visas}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'countryOfBirth':
                contentTableRight.push(
                    <Grid container key={`demographicCountryOfBirth_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblCountryOfBirthRequired : undefined}
                                id={`ddlCountryOfBirth_${i}`}
                                label={resources.lblCountryOfBirth}
                                options={demographicOptions.countries}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'primaryLanguage':
                contentTable.push(
                    <Grid container key={`demographicPrimaryLanguage_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblLanguageRequired : undefined}
                                id={`ddlPrimaryLanguage_${i}`}
                                label={resources.lblLanguage}
                                options={demographicOptions.languages}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'secondaryLanguage':
                contentTableRight.push(
                    <Grid container key={`demographicSecondaryLanguage_${i}`}>
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={item.isRequired && invalidItem(item)}
                                helperText={item.isRequired && invalidItem(item) ?
                                    resources.lblSecondaryLanguageRequired : undefined}
                                id={`ddlSecondaryLanguage_${i}`}
                                label={resources.lblSecondaryLanguage}
                                options={demographicOptions.languages}
                                required={item.isRequired}
                                value={item.value ? item.value : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;

            case 'monthsInCountry':
                contentTable.push(
                    <Grid container key={`demographicMonthsInCountry_${i}`}>
                        <Grid item xs={12}>
                            <TextField
                                error={item.isRequired && item.description === ''}
                                helperText={item.isRequired && item.description === '' ?
                                    resources.lblMonthsInCountryRequired : undefined}
                                id={`txtMonths_${i}`}
                                label={resources.lblMonthsInCountry}
                                required={item.isRequired}
                                value={item.description}
                                onChange={onTextFieldChange}
                            />
                        </Grid>
                    </Grid>
                );
                break;
        }
    });

    return (
        <Modal
            disableBackdropClick
            disableHeaderTypography
            id="demographicEditModal"
            footer={(
                <ButtonGroup id="btgEditDemographic">
                    <Button
                        id="btnCancel"
                        color="secondary"
                        onClick={onClose}
                    >
                        {resources.btnCancel}
                    </Button>
                    <Button
                        id="btnSave"
                        onClick={() => {
                            onSave();
                            setKey(k => k + 1);
                        }}
                    >
                        {resources.btnSave}
                    </Button>
                </ButtonGroup>
            )}
            header={(
                <>
                    <Text size="h2">
                        {resources.lblDemographicInformation}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container key={key}>
                <Grid item xs={12} sm={6}>
                    {contentTable}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {contentTableRight}
                </Grid>
            </Grid>
        </Modal>
    );

};
// #endregion

export default withStyles(styles)(DemographicEditModal);