/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: SaveSettingsModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { ISaveSettings } from '../../../Types/Resources/Administration/ILayoutListResources';
// #endregion Imports

// #region Types
export interface ISaveSettingsModalProps {
    confirmationMessage?: string;
    emptyConfirmationMessage: boolean;
    emptySaveMessage: boolean;
    open: boolean;
    saveMessage?: string;

    onChangeTextField: (event: any) => void;
    onClose: () => void;
    onSave: (event: any) => void;
    resources: ISaveSettings;
}
// #endregion Types

// #region Component
const SaveSettingsModal: React.FC<ISaveSettingsModalProps> = (props: ISaveSettingsModalProps): JSX.Element => {
    const {
        confirmationMessage,
        emptyConfirmationMessage,
        emptySaveMessage,
        open,
        saveMessage,

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
                    {resources.lblSaveButton}
                </Button>
            )}
            id="saveSettingsModal"
            header={resources.lblSaveSettingsTitle}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptySaveMessage}
                        helperText={emptySaveMessage ?
                            resources.lblEnterSaveMessage : ''}
                        id="txtSaveMessage"
                        label={resources.lblSaveMessage}
                        required={true}
                        type="text"
                        placeholder={resources.lblEnterText}
                        value={saveMessage}
                        onChange={onChangeTextField}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyConfirmationMessage}
                        helperText={emptyConfirmationMessage ?
                            resources.lblEnterConfirmationMsj : ''}
                        id="txtConfirmationMessage"
                        label={resources.lblConfirmationMessage}
                        required={true}
                        type="text"
                        value={confirmationMessage}
                        placeholder={resources.lblEnterText}
                        onChange={onChangeTextField}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default SaveSettingsModal;