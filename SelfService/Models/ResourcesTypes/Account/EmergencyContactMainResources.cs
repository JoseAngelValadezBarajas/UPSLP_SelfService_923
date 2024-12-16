// --------------------------------------------------------------------
// <copyright file="EmergencyContactMainResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Account
{
    public class EmergencyContactMainResources
    {
        public string BtnDelete { get; set; }
        public string BtnEdit { get; set; }
        public ConfirmationDialogResources DeleteEmergencyContactConfirmationDialog { get; set; }
        public EmergencyContactSave EmergencyContactSave { get; set; }
        public string LblCountry { get; set; }
        public string LblEmail { get; set; }
        public string LblEmergencyContactsHeader { get; set; }
        public string LblLegend { get; set; }
        public string LblName { get; set; }
        public string LblNoContact { get; set; }
        public string LblNotes { get; set; }
        public string LblPhoneNumber { get; set; }
        public string LblPrimaryContact { get; set; }
        public string LblRelationship { get; set; }
        public string LblRequiredContacts { get; set; }
        public string LblSecondaryContact { get; set; }
    }

    public class EmergencyContactSave
    {
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string LblCountry { get; set; }
        public string LblCountryRequired { get; set; }
        public string LblEditEmergencyContact { get; set; }
        public string LblEmail { get; set; }
        public string LblEmailInvalid { get; set; }
        public string LblEmailRequired { get; set; }
        public string LblEmergencyContactIsDuplicated { get; set; }
        public string LblName { get; set; }
        public string LblNameRequired { get; set; }
        public string LblNotes { get; set; }
        public string LblNotesRequired { get; set; }
        public string LblPhoneNumber { get; set; }
        public string LblPhoneNumberRequired { get; set; }
        public string LblRelationship { get; set; }
        public string LblRelationshipRequired { get; set; }
    }
}