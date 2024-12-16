/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: AddCampaign.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core Components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
// #endregion Imports

// #region Types
export interface IAddCampaignProps {
    emptyOption: IDropDownOption;
    isDuplicated: boolean;
    isInvalid: boolean;
    isLoading: boolean;
    open: boolean;
    pcCampaigns: IDropDownOption[];
    resources: IAddCampaignResProps;
    selectedCampaign: number;
    onSave: () => void;
    onClose: () => void;
    onDropdownChange: (optionSelected: IDropDownOption, id: string) => void;
}

export interface IAddCampaignResProps {
    btnAdd: string;
    btnCancel: string;
    lblAddCampaign: string;
    lblCampaign: string;
    lblSelectCampaign: string;
    lblUniqueCampaign: string;
}
// #endregion Types

// #region Component
const AddCampaign: React.FC<IAddCampaignProps> = (props: IAddCampaignProps): JSX.Element => {
    const {
        emptyOption,
        isDuplicated,
        isInvalid,
        isLoading,
        open,
        pcCampaigns,
        resources,
        selectedCampaign,
        onSave,
        onClose,
        onDropdownChange
    } = props;

    return (
        <Modal
            id="searchModal"
            header={resources.lblAddCampaign}
            maxWidth="md"
            footer={(
                <ButtonGroup id="bgAddCampaign">
                    <Button
                        disabled={isLoading}
                        color="secondary"
                        id="btnCloseAddCampaign"
                        onClick={onClose}
                    >
                        {resources.btnCancel}
                    </Button>
                    <Button
                        loading={isLoading}
                        id="btnAddCampaign"
                        onClick={onSave}
                    >
                        {resources.btnAdd}
                    </Button>
                </ButtonGroup>
            )}
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <br/>
                    <Dropdown
                        disabled={isLoading}
                        emptyOption={emptyOption}
                        error={isInvalid || isDuplicated}
                        helperText={isInvalid ? resources.lblSelectCampaign : (
                            isDuplicated ? resources.lblUniqueCampaign : undefined
                        )}
                        id="ddlCampaigns"
                        label={resources.lblCampaign}
                        options={pcCampaigns}
                        value={selectedCampaign}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AddCampaign;