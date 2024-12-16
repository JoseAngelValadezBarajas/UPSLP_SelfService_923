/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AppNameSetup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
// #endregion Imports

// #region Types
export interface IAppNameSetupProps {
    layoutDescription?: string;
    layoutName?: string;
    layoutNameIsEmpty: boolean;
    layoutNameNotValid: boolean;
    open: boolean;

    // events
    onChangeTextField: (event: any) => void;
    onClose: () => void;
    onSave: () => void;

    resources: IAppNameSetupResProps;
}

export interface IAppNameSetupResProps {
    btnSave: string;
    lblDescription: string;
    lblDescriptionIsRequired: string;
    lblName: string;
    lblNameDuplicated: string;
    lblNameIsRequired: string;
    lblTitle: string;
}
// #endregion Types

// #region Component
const AppNameSetup: React.FC<IAppNameSetupProps> = (props: IAppNameSetupProps): JSX.Element => {
    const {
        layoutDescription,
        layoutName,
        layoutNameIsEmpty,
        layoutNameNotValid,

        onChangeTextField,
        onClose,
        onSave,

        resources
    } = props;

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
            id="appNameSetupModal"
            header={resources.lblTitle}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={layoutNameIsEmpty || layoutNameNotValid}
                        helperText={layoutNameIsEmpty ? resources.lblNameIsRequired :
                            layoutNameNotValid ? resources.lblNameDuplicated : ''}
                        id="txtName"
                        label={resources.lblName}
                        maxCharacters={50}
                        required={true}
                        type="text"
                        value={layoutName || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onSave}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        id="txtDescription"
                        label={resources.lblDescription}
                        type="text"
                        value={layoutDescription || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onSave}
                    />
                </Grid>
                <br />
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AppNameSetup;