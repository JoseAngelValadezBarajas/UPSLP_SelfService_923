// --------------------------------------------------------------------
// <copyright file="PhoneNumberMainResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Account
{
    public class PhoneNumberMainResources
    {
        public string BtnAdd { get; set; }
        public string BtnDelete { get; set; }
        public string BtnSetAsPrimary { get; set; }
        public ConfirmationDialogResources DeletePhoneNumberConfirmationDialog { get; set; }
        public string LblActions { get; set; }
        public string LblCountry { get; set; }
        public string LblDescription { get; set; }
        public string LblDoNotCallReason { get; set; }
        public string LblNoPhoneNumbers { get; set; }
        public string LblNoResults { get; set; }
        public string LblPhoneNumber { get; set; }
        public string LblPhoneNumbersHeader { get; set; }
        public string LblPhoneType { get; set; }
        public string LblPrimary { get; set; }
        public PhoneNumberSave PhoneNumberSave { get; set; }
    }

    public class PhoneNumberSave
    {
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string LblAddPhoneNumber { get; set; }
        public string LblCountry { get; set; }
        public string LblCountryRequired { get; set; }
        public string LblDescription { get; set; }
        public string LblDoNotCallReason { get; set; }
        public string LblEditPhoneNumber { get; set; }
        public string LblNumber { get; set; }
        public string LblNumberRequired { get; set; }
        public string LblPhoneNumberIsDuplicated { get; set; }
        public string LblType { get; set; }
        public string LblTypeRequired { get; set; }
    }
}