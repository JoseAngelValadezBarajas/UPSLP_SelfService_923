/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AlertModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAlertList } from '../../../Types/Section/IAlertList';
import { IStudentViolation } from '../../../Types/Students/IStudentViolation';
// #endregion Imports

// #region Types
export interface IAlertModalProps {
    alerts: IAlertList;
    alertSaved: IStudentViolation;
    dateTimeCulture: string;
    errorDateAlert: boolean;
    isAlertDateInvalid: boolean;
    isAlertModalOpen: boolean;
    isAlertToInvalid: boolean;
    isAlertTypeInvalid: boolean;
    isLoadingSave: boolean;
    lblDropDownEmptyText: string;
    resources: IAlertModalResProps;
    shortDatePattern: string;
    onChangeDatePicker: (date: string, _id: string, isValid: boolean) => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCloseAlertModal: () => void;
    onOpenConfirmationModal: () => void;
    onSaveAlerts: () => void;
}

export interface IAlertModalResProps {
    btnCancel: string;
    btnDelete: string;
    btnSave: string;
    formatDeleteAlertTitle: string;
    lblAddAlert: string;
    lblAlertTo: string;
    lblAlertType: string;
    lblConfirmationContent: string;
    lblCreated: string;
    lblCreatedBy: string;
    lblDateOcurred: string;
    lblDescription: string;
    lblDetailtsAlert: string;
    lblEditAlert: string;
    lblEdited: string;
    lblEditedBy: string;
    lblErrorDate: string;
    lblErrorMessage: string;
}
// #endregion Types

// #region Component
const AlertModal: React.FC<IAlertModalProps> = (props: IAlertModalProps): JSX.Element => {
    const {
        alerts,
        alertSaved,
        dateTimeCulture,
        errorDateAlert,
        isAlertDateInvalid,
        isAlertToInvalid,
        isAlertTypeInvalid,
        isAlertModalOpen,
        isLoadingSave,
        lblDropDownEmptyText,
        resources,
        shortDatePattern,
        onChangeDatePicker,
        onChangeDropdown,
        onChangeTextField,
        onCloseAlertModal,
        onOpenConfirmationModal,
        onSaveAlerts
    } = props;

    const alertToOptions: IDropDownOption[] = [
        {
            description: lblDropDownEmptyText,
            value: -1
        }
    ];

    alerts.sectionViolations.forEach(student => {
        alertToOptions.push({
            description: student.fullName,
            value: student.personId
        });
    });

    const alertTypesOptions: IDropDownOption[] = [
        {
            description: lblDropDownEmptyText,
            value: -1
        },
        ...alerts.violationTypes as IDropDownOption[]
    ];

    const footerModal: JSX.Element = (
        <ButtonGroup id="btnDownloadModal">
            {alertSaved.isEditable && alertSaved.violationId > 0 ? (
                <Button
                    disabled={isLoadingSave}
                    id={'btnOnDelete'}
                    color="secondary"
                    onClick={onOpenConfirmationModal}
                >
                    {resources.btnDelete}
                </Button>
            ) : undefined}
            <Button
                disabled={isLoadingSave}
                id={'btnOnCloseModal'}
                color="secondary"
                onClick={onCloseAlertModal}
            >
                {resources.btnCancel}
            </Button>
            <Button
                id={'btnOnDownload'}
                loading={isLoadingSave}
                onClick={onSaveAlerts}
            >
                {resources.btnSave}
            </Button>
        </ButtonGroup>
    );

    return (
        <Modal
            disableBackdropClick
            footer={alertSaved.isEditable || alertSaved.violationId === 0 ? footerModal : undefined}
            header={alertSaved.violationId > 0 ?
                (alertSaved.isEditable ? resources.lblEditAlert : resources.lblDetailtsAlert)
                : resources.lblAddAlert}
            id="modalViolation"
            open={isAlertModalOpen}
            onClose={onCloseAlertModal}
        >

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Dropdown
                        disabled={isLoadingSave || alertSaved.violationId > 0}
                        error={isAlertToInvalid}
                        helperText={isAlertToInvalid ? resources.lblErrorMessage : ''}
                        id="ddlAlertTo"
                        label={resources.lblAlertTo}
                        options={alertToOptions}
                        required
                        value={alertSaved.studentId}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Dropdown
                        disabled={isLoadingSave || (alertSaved.violationId > 0 && !alertSaved.isEditable)}
                        error={isAlertTypeInvalid}
                        helperText={isAlertTypeInvalid ? resources.lblErrorMessage : ''}
                        id="ddlAlertType"
                        label={resources.lblAlertType}
                        options={alertTypesOptions}
                        required
                        value={alertSaved.violationTypeId}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        disabled={isLoadingSave || (alertSaved.violationId > 0 && !alertSaved.isEditable)}
                        id="txtDescrition"
                        label={resources.lblDescription}
                        multiline
                        value={alertSaved.description}
                        onChange={onChangeTextField}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        disabled
                        id="txtViolationCreatedBy"
                        label={alertSaved.violationId > 0 && alertSaved.isEditable ?
                            resources.lblEditedBy : resources.lblCreatedBy}
                        value={alertSaved.createdBy && !alertSaved.isEditable ? alertSaved.createdBy : alerts.createdBy}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        culture={dateTimeCulture}
                        disabled={isLoadingSave || (alertSaved.violationId > 0 && !alertSaved.isEditable)}
                        flip
                        format={shortDatePattern}
                        error={errorDateAlert || isAlertDateInvalid}
                        helperText={isAlertDateInvalid ? resources.lblErrorMessage :
                            (errorDateAlert ? resources.lblErrorDate : '')}
                        id="dtpAlertOcurred"
                        label={resources.lblDateOcurred}
                        required
                        value={alertSaved.isEditable ? alertSaved.violationDate : alerts.createdDate}
                        onChange={onChangeDatePicker}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        culture={dateTimeCulture}
                        disabled
                        flip
                        format={shortDatePattern}
                        id="dptViolationCreatedDate"
                        label={alertSaved.violationId > 0 && alertSaved.isEditable ?
                            resources.lblEdited : resources.lblCreated}
                        value={alertSaved.createdDate && !alertSaved.isEditable ? alertSaved.createdDate : alerts.createdDate}
                    />
                </Grid>
            </Grid >
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AlertModal;