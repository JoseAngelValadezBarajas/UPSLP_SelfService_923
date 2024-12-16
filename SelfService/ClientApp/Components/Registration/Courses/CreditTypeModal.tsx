/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: CreditTypeModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
// #endregion Imports

// #region Types
export interface ICreditTypeModalProps {
    creditTypeList: IDropDownOption[];
    creditTypeSelected: string;
    eventId: string;
    eventName: string;
    open: boolean;
    resources: ICreditTypeModalResProps;
    onClose: () => void;
    onDropdownChange: (optionSelected: IDropDownOption, id: string) => void;
    onSave: () => void;
}

export interface ICreditTypeModalResProps {
    btnCancel: string;
    btnSave: string;
    formatTitleSection: string;
    lblCreditType: string;
}
// #endregion Types

// #region Component
const CreditTypeModal: React.FC<ICreditTypeModalProps> = (props: ICreditTypeModalProps): JSX.Element => {
    const {
        creditTypeList,
        creditTypeSelected,
        eventId,
        eventName,
        open,
        resources,
        onClose,
        onDropdownChange,
        onSave
    } = props;

    return (
        <Modal
            id="creditTypeModal"
            header={Format.toString(resources.formatTitleSection, [
                eventId,
                eventName
            ])}
            footer={(
                <ButtonGroup id="btgCreditType">
                    <Button
                        id={'btnCancel'}
                        color="secondary"
                        onClick={onClose}
                    >
                        {resources.btnCancel}
                    </Button>
                    <Button
                        id={'btnSave'}
                        onClick={onSave}
                    >
                        {resources.btnSave}
                    </Button>
                </ButtonGroup>
            )}
            maxWidth="sm"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item xs>
                    <Dropdown
                        id="ddlCreditType"
                        label={resources.lblCreditType}
                        options={creditTypeList}
                        value={creditTypeSelected}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default CreditTypeModal;