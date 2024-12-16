/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AppSendToModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAppSendToModalResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppSendToModalProps {
    availableSteps: IDropDownOption[];
    fieldGroupId: string;
    open: boolean;
    selectedStep?: number;

    // events
    onChangeDropDown: (optionSelected: IDropDownOption) => void;
    onClose: () => void;
    onSave: () => void;

    resources: IAppSendToModalResources;
}
// #endregion Types

// #region Component
const AppSendToModal: React.FC<IAppSendToModalProps> = (props: IAppSendToModalProps): JSX.Element => {
    const {
        availableSteps,
        fieldGroupId,
        selectedStep,

        onChangeDropDown,
        onClose,
        onSave,

        // resources
        resources
    } = props;

    const emptyOption: IDropDownOption = {
        description: String(resources.lblSelect),
        value: -1
    };

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
            id="appSendToModal"
            header={`${resources.lblTitle} ${fieldGroupId}`}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="stepsDropdown"
                        label={resources.lblSendToStep}
                        options={availableSteps}
                        value={selectedStep !== undefined ? selectedStep : -1}
                        onChange={onChangeDropDown}
                    />
                </Grid>
                <br />
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AppSendToModal;