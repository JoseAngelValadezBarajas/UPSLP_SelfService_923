/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AppSetupStepModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAppSetupStepModalResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppSetupStepModalProps {
    stepModified: boolean;
    stepTitle?: string;
    open: boolean;

    // events
    onChangeTextField: (event: any) => void;
    onClose: () => void;
    onSave: () => void;

    resources: IAppSetupStepModalResources;
}
// #endregion Types

// #region Component
const AppSetupStepModal: React.FC<IAppSetupStepModalProps> = (props: IAppSetupStepModalProps): JSX.Element => {
    const {
        stepModified,
        stepTitle,
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
            id="appSetupStepModal"
            header={stepModified ? resources.lblTitle : resources.lblConfirmationDialog}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <TextField
                        id="txtStepTitle"
                        label={resources.lblStepTitle}
                        type="text"
                        value={stepTitle || ''}
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
export default AppSetupStepModal;