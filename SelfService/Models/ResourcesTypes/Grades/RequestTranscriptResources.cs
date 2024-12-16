// --------------------------------------------------------------------
// <copyright file="RequestTranscriptResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Grades
{
    public class ConfirmRequestModal
    {
        public string BtnBillMeLater { get; set; }
        public string BtnConfirm { get; set; }
        public string BtnPayNow { get; set; }
        public string LblAddressLine1 { get; set; }
        public string LblAddressLine2 { get; set; }
        public string LblAddressLine3 { get; set; }
        public string LblAddressLine4 { get; set; }
        public string LblAmount { get; set; }
        public string LblCity { get; set; }
        public string LblConfirmRequest { get; set; }
        public string LblCopies { get; set; }
        public string LblCountry { get; set; }
        public string LblDetail { get; set; }
        public string LblHouseNumber { get; set; }
        public string LblInstructionsFreeModal { get; set; }
        public string LblNameOfRecipient { get; set; }
        public string LblNumberOfCopies { get; set; }
        public string LblPostalCode { get; set; }
        public string LblReasonOfRequest { get; set; }
        public string LblRequestTranscript { get; set; }
        public string LblReviewInformation { get; set; }
        public string LblState { get; set; }
        public string LblTotal { get; set; }
    }

    public class RequestTranscriptResources : LayoutResources
    {
        public string BtnAddAnother { get; set; }
        public string BtnOk { get; set; }
        public string BtnSubmitRequest { get; set; }
        public string BtnViewBalance { get; set; }
        public ConfirmRequestModal ConfirmRequestModal { get; set; }
        public string LblAddressLine1 { get; set; }
        public string LblAddressLine2 { get; set; }
        public string LblAddressLine3 { get; set; }
        public string LblAddressLine4 { get; set; }
        public string LblAmount { get; set; }
        public string LblAuthorizationCode { get; set; }
        public string LblCity { get; set; }
        public string LblCopies { get; set; }
        public string LblCopiesInvalid { get; set; }
        public string LblCountry { get; set; }
        public string LblDelete { get; set; }
        public string LblDescription { get; set; }
        public string LblDisclosureRead { get; set; }
        public string LblDisclosureStatement { get; set; }
        public string LblDisclosureStatementTitle { get; set; }
        public string LblEnterInfo { get; set; }
        public string LblErrorAddressLine1 { get; set; }
        public string LblErrorCity { get; set; }
        public string LblErrorCountry { get; set; }
        public string LblErrorNameRecipient { get; set; }
        public string LblErrorNumberOfCopies { get; set; }
        public string LblErrorPostalCode { get; set; }
        public string LblErrorReasonOfRequest { get; set; }
        public string LblErrorState { get; set; }
        public string LblFeeInstructions { get; set; }
        public string LblGeneralInstructions { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblHouseNumber { get; set; }
        public string LblInstructionsBalance { get; set; }
        public string LblInstructionsFreeModal { get; set; }
        public string LblNameOfRecipient { get; set; }
        public string LblNew { get; set; }
        public string LblNoDisclosureStatement { get; set; }
        public string LblNumberOfCopies { get; set; }
        public string LblPageTitle { get; set; }
        public string LblPaymentNotProcessed { get; set; }
        public string LblPostalCode { get; set; }
        public string LblReasonOfRequest { get; set; }
        public string LblRequestTranscript { get; set; }
        public string LblState { get; set; }
    }
}