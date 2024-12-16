// --------------------------------------------------------------------
// <copyright file="Settings1098TResources.cs" company="Ellucian">
//     Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class AgreementForm1098TEdit
    {
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string LblAcceptance { get; set; }
        public string LblAcceptanceRequired { get; set; }
        public string LblAgreementTitle { get; set; }
        public string LblContent { get; set; }
        public string LblContentHelpText { get; set; }
        public string LblContentRequired { get; set; }
        public string LblEnable { get; set; }
        public string LblGeneralTitle { get; set; }
        public string LblPreview { get; set; }
        public string LblTitle { get; set; }
        public string LblTitleRequired { get; set; }
    }

    public class Settings1098TResources
    {
        public AgreementForm1098TEdit AgreementForm1098TEdit { get; set; }
        public ConfirmationDialogResources DeleteTaxYearSettingConfirmation { get; set; }
        public TaxYearSettings TaxYearSettings { get; set; }
        public TaxYearsettingsEdit TaxYearsettingsEdit { get; set; }
    }

    public class TaxYearSettings
    {
        public string BtnAdd { get; set; }
        public string BtnDelete { get; set; }
        public string BtnEdit { get; set; }
        public string BtnPreview { get; set; }
        public string LblAvailable { get; set; }
        public string LblNoResults { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblTaxYearsSettingsTitle { get; set; }
    }

    public class TaxYearsettingsEdit
    {
        public string BtnCancel { get; set; }
        public string BtnPreview { get; set; }
        public string BtnSave { get; set; }
        public string LblAddTitle { get; set; }
        public string LblAvailable { get; set; }
        public string LblEditTitle { get; set; }
        public string LblPdfFileName { get; set; }
        public string LblPdfFileNameRequired { get; set; }
        public string LblTaxYear { get; set; }
        public string LblTaxYearRequired { get; set; }
        public string LblXmlFileName { get; set; }
        public string LblXmlFileNameRequired { get; set; }
        public string LblYearDuplicated { get; set; }
    }
}