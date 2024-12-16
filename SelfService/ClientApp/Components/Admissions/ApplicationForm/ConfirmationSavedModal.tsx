/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ConfirmationSavedModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Generic components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IConfirmationSavedModal } from '../../../Types/Resources/Admissions/IApplicationFormResources';
// #endregion Imports

// #region Types
export interface IConfirmationSavedModalProps {
    confirmationMessage: string;
    open: boolean;
    resources: IConfirmationSavedModal;
    onCloseModal: () => void;
}
// #endregion Types

// #region Component
const ConfirmationSavedModal: React.FC<IConfirmationSavedModalProps> = (props: IConfirmationSavedModalProps): JSX.Element => {
    const {
        confirmationMessage,
        open,
        resources,
        onCloseModal
    } = props;

    return (
        <Modal
            disableBackdropClick
            footer={(
                <Button
                    id="btnOk"
                    onClick={onCloseModal}
                >
                    {resources.btnOk}
                </Button>
            )}
            id="confirmationSaveModal"
            header={resources.lblTitle}
            maxWidth="md"
            open={open}
            onClose={onCloseModal}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Text>
                        {confirmationMessage}
                    </Text>
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default ConfirmationSavedModal;