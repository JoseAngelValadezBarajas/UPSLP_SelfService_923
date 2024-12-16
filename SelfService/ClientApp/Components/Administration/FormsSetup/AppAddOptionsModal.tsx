/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AppAddOptionsModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAppAddOptionsModalResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppAddOptionsModalProps {
    emptyDescription: boolean;
    emptyValue: boolean;
    open: boolean;
    optionDescription?: string;
    optionValue?: string;

    onChangeTextField: (event: any) => void;
    onClose: () => void;
    onSave: () => void;

    resources: IAppAddOptionsModalResources;
}
// #endregion Types

// #region Component
const AppAddOptionsModal: React.FC<IAppAddOptionsModalProps> = (props: IAppAddOptionsModalProps): JSX.Element => {
    const {
        emptyDescription,
        emptyValue,
        open,
        optionDescription,
        optionValue,

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
            id="appAddOptionModal"
            header={resources.lblTitle}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyDescription}
                        helperText={emptyDescription ?
                            resources.lblEnterDescription : ''}
                        id="txtOptionDescription"
                        label={resources.lblDescription}
                        required={true}
                        type="text"
                        value={optionDescription || ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyValue}
                        helperText={emptyValue ?
                            resources.lblEnterValue : ''}
                        id="txtOptionValue"
                        label={resources.lblValue}
                        required={true}
                        type="text"
                        value={optionValue || ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AppAddOptionsModal;