/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: EmergencyContactSave.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IEmergencyContact, EmergencyContactType } from '../../../Types/Account/IPeopleEmergency';
import { EmergencyContactSettingStatus, IEmergencyContactSettings } from '../../../Types/InstitutionSettings/IEmergencyContactSettings';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IEmergencyContactSaveProps {
    countryOptions?: IDropDownOption[];
    emergencyContact: IEmergencyContact;
    relationTypeOptions?: IDropDownOption[];
    resources: IEmergencyContactSaveResProps;
    settings: IEmergencyContactSettings;
    onCancelSave: () => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

export interface IEmergencyContactSaveResProps {
    btnCancel: string;
    btnSave: string;
    lblCountry: string;
    lblCountryRequired: string;
    lblEditEmergencyContact: string;
    lblEmail: string;
    lblEmailInvalid: string;
    lblEmailRequired: string;
    lblEmergencyContactIsDuplicated: string;
    lblName: string;
    lblNameRequired: string;
    lblNotes: string;
    lblNotesRequired: string;
    lblPhoneNumber: string;
    lblPhoneNumberRequired: string;
    lblRelationship: string;
    lblRelationshipRequired: string;
}
// #endregion Types

// #region Component
const EmergencyContactSave: React.FC<IEmergencyContactSaveProps> = (props: IEmergencyContactSaveProps): JSX.Element => {
    const {
        countryOptions,
        emergencyContact,
        relationTypeOptions,
        resources,
        settings,
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

    const mainFieldsAreRequired: boolean = ((settings.primaryRequired && emergencyContact.contactType === EmergencyContactType.Primary)
        || (settings.secondaryRequired && emergencyContact.contactType === EmergencyContactType.Secondary));
    const emailIsRequired: boolean = settings.email === EmergencyContactSettingStatus.Required;
    const countryIsRequired: boolean = settings.country === EmergencyContactSettingStatus.Required;
    const notesAreRequired: boolean = settings.notes === EmergencyContactSettingStatus.Required;

    return (
        <Grid container alignItems="center">
            {emergencyContact.isDuplicated && (
                <Grid item xs={12}>
                    <Alert
                        id="msgEmergencyContactIsDuplicated"
                        open={emergencyContact.isDuplicated}
                        text={resources.lblEmergencyContactIsDuplicated}
                        type={ResultType.error}
                        userDismissable={false}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <Text size="h2">
                    {resources.lblEditEmergencyContact}
                </Text>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    error={mainFieldsAreRequired
                        && emergencyContact.contactNameModified
                        && !Boolean(emergencyContact.contactName)}
                    helperText={mainFieldsAreRequired
                        && emergencyContact.contactNameModified
                        && !Boolean(emergencyContact.contactName) ?
                        resources.lblNameRequired : ''}
                    id="txtName"
                    label={resources.lblName}
                    maxCharacters={300}
                    required={mainFieldsAreRequired}
                    value={emergencyContact.contactName || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <Dropdown
                    emptyOption={emptyOption}
                    error={mainFieldsAreRequired
                        && emergencyContact.contactRelModified
                        && !Boolean(emergencyContact.contactRel)}
                    helperText={mainFieldsAreRequired
                        && emergencyContact.contactRelModified
                        && !Boolean(emergencyContact.contactRel) ?
                        resources.lblRelationshipRequired : ''}
                    id="ddlRelationship"
                    label={resources.lblRelationship}
                    options={relationTypeOptions}
                    required={mainFieldsAreRequired}
                    value={emergencyContact.contactRel}
                    onChange={onChangeDropdown}
                />
            </Grid>
            <Hidden smDown>
                <Grid item md={4}/>
            </Hidden>
            {settings.country !== EmergencyContactSettingStatus.None && (
                <Grid item xs={12} md={4}>
                    <Dropdown
                        emptyOption={emptyOption}
                        error={countryIsRequired
                            && emergencyContact.contactCountryModified
                            && !Boolean(emergencyContact.contactCountry)}
                        helperText={countryIsRequired
                            && emergencyContact.contactCountryModified
                            && !Boolean(emergencyContact.contactCountry) ?
                            resources.lblCountryRequired : ''}
                        id="ddlCountry"
                        label={resources.lblCountry}
                        options={countryOptions}
                        required={countryIsRequired}
                        value={emergencyContact.contactCountry}
                        onChange={onChangeDropdown}
                    />
                </Grid>
            )}
            <Grid item xs={12} md={4}>
                <TextField
                    error={mainFieldsAreRequired
                        && emergencyContact.contactPhoneModified
                        && !Boolean(emergencyContact.contactPhone)}
                    helperText={mainFieldsAreRequired
                        && emergencyContact.contactPhoneModified
                        && !Boolean(emergencyContact.contactPhone) ?
                        resources.lblPhoneNumberRequired : ''}
                    id="txtPhoneNumber"
                    label={resources.lblPhoneNumber}
                    maxCharacters={30}
                    required={mainFieldsAreRequired}
                    value={emergencyContact.contactPhone || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} md={settings.country !== EmergencyContactSettingStatus.None ? 4 : 8}>
                <Text>
                    {emergencyContact.phoneFormat
                        && settings.country !== EmergencyContactSettingStatus.None ?
                        emergencyContact.formattedNumber
                        : emergencyContact.contactPhone}
                </Text>
            </Grid>
            {settings.email !== EmergencyContactSettingStatus.None && (
                <Grid item xs={12}>
                    <TextField
                        error={(emailIsRequired
                            && emergencyContact.contactEmailModified
                            && !Boolean(emergencyContact.contactEmail))
                            || emergencyContact.emailInvalid}
                        helperText={(emailIsRequired
                            && emergencyContact.contactEmailModified
                            && !Boolean(emergencyContact.contactEmail)) ?
                            resources.lblEmailRequired
                            : (emergencyContact.emailInvalid ?
                                resources.lblEmailInvalid
                                : '')}
                        id="txtEmail"
                        label={resources.lblEmail}
                        maxCharacters={255}
                        required={emailIsRequired}
                        value={emergencyContact.contactEmail || ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
            )}
            {settings.notes !== EmergencyContactSettingStatus.None && (
                <Grid item xs={12}>
                    <TextField
                        error={notesAreRequired
                            && emergencyContact.contactNotesModified
                            && !Boolean(emergencyContact.contactNotes)}
                        helperText={notesAreRequired
                            && emergencyContact.contactNotesModified
                            && !Boolean(emergencyContact.contactNotes) ?
                            resources.lblNotesRequired : ''}
                        id="txtNotes"
                        label={resources.lblNotes}
                        maxCharacters={1000}
                        multiline
                        required={notesAreRequired}
                        value={emergencyContact.contactNotes || ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <ButtonGroup id="bgSaveEmergencyContact">
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
export default EmergencyContactSave;