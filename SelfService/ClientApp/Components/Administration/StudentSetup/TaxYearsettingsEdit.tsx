/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: TaxYearsettingsEdit.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ITaxYearSettingDetail } from '../../../Types/TaxYearSetting/ITaxYearSettingDetail';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
// #endregion Imports

// #region Types
export interface ITaxYearsettingsEditProps {
    lblDropDownEmptyText: string;
    open: boolean;
    pdfFiles?: IDropDownOption[];
    resources: ITaxYearsettingsEditResProps;
    taxYears?: IDropDownOption[];
    taxYearSetting: ITaxYearSettingDetail;
    xmlFiles?: IDropDownOption[];
    onCancel: () => void;
    onChangeCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onSave: () => void;
}

export interface ITaxYearsettingsEditResProps {
    btnCancel: string;
    btnPreview: string;
    btnSave: string;
    formatTitleEditing: string;
    lblAddTitle: string;
    lblAvailable: string;
    lblEditTitle: string;
    lblPdfFileName: string;
    lblPdfFileNameRequired: string;
    lblTaxYear: string;
    lblTaxYearRequired: string;
    lblXmlFileName: string;
    lblXmlFileNameRequired: string;
    lblYearDuplicated: string;
}
// #endregion Types

// #region Component
const TaxYearsettingsEdit: React.FC<ITaxYearsettingsEditProps> = (props: ITaxYearsettingsEditProps): JSX.Element => {
    const {
        lblDropDownEmptyText,
        open,
        pdfFiles,
        resources,
        taxYears,
        taxYearSetting,
        xmlFiles,
        onCancel,
        onChangeCheckbox,
        onChangeDropdown,
        onSave
    } = props;

    let emptyOption: IDropDownOption;
    emptyOption = {
        description: lblDropDownEmptyText,
        value: ''
    };

    const onClickDownload = () => {
        if (taxYearSetting.pdfFileName && taxYearSetting.xmlFileName) {
            window.location.href = `${Constants.webUrl}/TaxYearSettings/PreviewBeforeSave/${encodeURI(taxYearSetting.pdfFileName.replace('.pdf', ''))}/${encodeURI(taxYearSetting.xmlFileName.replace('.xml', ''))}`;
        }
    };

    return (
        <Modal
            disableBackdropClick
            disableHeaderTypography
            id="creditTypeModal"
            header={(
                <>
                    <Text size="h2">
                        {taxYearSetting.id > 0 ? resources.lblEditTitle
                            : resources.lblAddTitle}
                    </Text>
                    <Divider />
                </>
            )}
            footer={(
                <ButtonGroup id="btg1098T">
                    <Button
                        IconProps={{
                            name: 'download'
                        }}
                        id="btnPreview"
                        variant="text"
                        onClick={onClickDownload}
                    >
                        {resources.btnPreview}
                    </Button>
                    <Button
                        color="secondary"
                        id="btnCancel1098T"
                        onClick={onCancel}
                    >
                        {resources.btnCancel}
                    </Button>
                    <Button
                        id="btnSave1098T"
                        onClick={onSave}
                    >
                        {resources.btnSave}
                    </Button>
                </ButtonGroup>
            )
            }
            maxWidth="sm"
            open={open}
            onClose={onCancel}
        >
            <Grid container>
                <Grid item xs={12} spacing={1}>
                    <Dropdown
                        disabled={taxYearSetting.id > 0}
                        emptyOption={emptyOption}
                        error={taxYearSetting.taxYearModified &&
                            (!Boolean(taxYearSetting.taxYear) || taxYearSetting.taxYearDuplicated)}
                        helperText={taxYearSetting.taxYearModified ?
                            (!Boolean(taxYearSetting.taxYear) ?
                                resources.lblTaxYearRequired :
                                (taxYearSetting.taxYearDuplicated ?
                                    resources.lblYearDuplicated
                                    : undefined))
                            : undefined}
                        id="ddlTaxYear"
                        label={resources.lblTaxYear}
                        options={taxYears}
                        required
                        value={taxYearSetting.taxYear}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        error={taxYearSetting.xmlFileNameModified && !Boolean(taxYearSetting.xmlFileName)}
                        helperText={taxYearSetting.xmlFileNameModified && !Boolean(taxYearSetting.xmlFileName) ?
                            resources.lblXmlFileNameRequired : undefined}
                        id="ddlXmlFileName"
                        label={resources.lblXmlFileName}
                        options={xmlFiles}
                        required
                        value={taxYearSetting.xmlFileName}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        error={taxYearSetting.pdfFileNameModified && !Boolean(taxYearSetting.pdfFileName)}
                        helperText={taxYearSetting.pdfFileNameModified && !Boolean(taxYearSetting.pdfFileName) ?
                            resources.lblPdfFileNameRequired : undefined}
                        id="ddlPdfFileName"
                        label={resources.lblPdfFileName}
                        options={pdfFiles}
                        required
                        value={taxYearSetting.pdfFileName}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Checkbox
                        checked={taxYearSetting.isActive}
                        id="chkActive"
                        label={resources.lblAvailable}
                        onChange={onChangeCheckbox}
                    />
                </Grid>
            </Grid>
        </Modal >
    );
};
// #endregion Component

// Export: Component
export default TaxYearsettingsEdit;