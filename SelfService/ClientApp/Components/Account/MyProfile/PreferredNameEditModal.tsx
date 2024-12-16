/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File:PreferredNameEditModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

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
import { IPreferredName } from '../../../Types/Account/IPreferredName';
import { IPreferredNameOptions } from '../../../Types/Account/IPreferredNameOptions';
import { IPreferredNameMainResources } from '../../../Types/Resources/Account/IPreferredNameMainResources';

// #endregion

// #region Internal types
export interface IPreferredEditModalProps {
    preferredNameOptions: IPreferredNameOptions;
    preferredOptionsValues: IPreferredName;
    open: boolean;
    onClose: () => void;
    onDropdownChange: (optionSelected: IDropDownOption, _id: string) => void;
    onTextFieldChange: (event: any) => void;
    onSave: () => void;

    resources: IPreferredNameMainResources;
}

const styles = () => createStyles({
    marginLeft: {
        marginLeft: Tokens.sizingLarge
    }
});

type PropsWithStyles = IPreferredEditModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const PreferredNameEditModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        preferredNameOptions,
        preferredOptionsValues,
        open,
        resources,
        onDropdownChange,
        onTextFieldChange,
        onClose,
        onSave
    } = props;

    let emptyOption: IDropDownOption;
    emptyOption = {
        description: resources.lblDropDownEmptyText,
        value: 'null'
    };

    let contentTable: JSX.Element | undefined;
    contentTable = (
        <>
            {preferredOptionsValues.settings.preferredName ?
                (
                    <Grid container key="displayName">
                        <Grid item xs={12}>
                            <TextField
                                error={preferredOptionsValues.settings.preferredName && (preferredOptionsValues.genderIdentity.displayName === '' ||
                                    preferredOptionsValues.genderIdentity.displayName === 'null') ? true : false}
                                helperText={preferredOptionsValues.settings.preferredName && (preferredOptionsValues.genderIdentity.displayName === '' ||
                                    preferredOptionsValues.genderIdentity.displayName === 'null') ?
                                    resources.lblDisplayNameRequired : undefined}
                                id="txtDisplayName"
                                label={resources.lblDisplayNameRequired}
                                required={preferredOptionsValues.settings.preferredName}
                                value={preferredOptionsValues.genderIdentity.displayName}
                                onChange={onTextFieldChange}
                            />
                        </Grid>
                    </Grid>
                ) : undefined}
            {preferredOptionsValues.settings.genderIdentity ?
                (
                    <Grid container key="genderIdentity">
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlGenderIdentity"
                                label={resources.lblGenderIdentity}
                                options={preferredNameOptions.genderIdentities}
                                value={preferredOptionsValues.genderIdentity.id ? preferredOptionsValues.genderIdentity.id : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                ) : undefined}
            {preferredOptionsValues.settings.pronoun ?
                (
                    <Grid container key="pronoun">
                        <Grid item xs={12}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlPronoun"
                                label={resources.lblPronoun}
                                options={preferredNameOptions.pronouns}
                                value={preferredOptionsValues.genderIdentity.pronounId ?
                                    preferredOptionsValues.genderIdentity.pronounId : emptyOption.value}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                ) : undefined}
        </>
    );

    return (
        <Modal
            disableBackdropClick
            disableHeaderTypography
            id="preferredEditModal"
            footer={(
                <ButtonGroup id="btgEditPreferredName">
                    <Button
                        id="btnCancel"
                        color="secondary"
                        onClick={onClose}
                    >
                        {resources.btnCancel}
                    </Button>
                    <Button
                        id="btnSave"
                        onClick={onSave}
                    >
                        {resources.btnSave}
                    </Button>
                </ButtonGroup>
            )}
            header={(
                <>
                    <Text size="h2">
                        {resources.lblPreferredName}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item xs={12} sm={6}>
                    {contentTable}
                </Grid>
            </Grid>
        </Modal>
    );

};
// #endregion

export default withStyles(styles)(PreferredNameEditModal);