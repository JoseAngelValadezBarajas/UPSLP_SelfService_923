// --------------------------------------------------------------------
// <copyright file="AddressRequestsResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class AddressRequestsResources
    {
        public AddressSaveResources AddressSave { get; set; }
        public string BtnApprove { get; set; }
        public string BtnDeny { get; set; }
        public string FormatResultsShowing { get; set; }
        public string FormatSelectUser { get; set; }
        public string LblAddressChangeRequests { get; set; }
        public string LblAddressChanges { get; set; }
        public string LblApproved { get; set; }
        public string LblCurrentAddress { get; set; }
        public string LblDenied { get; set; }
        public string LblEdit { get; set; }
        public string LblFilter { get; set; }
        public string LblId { get; set; }
        public string LblName { get; set; }
        public string LblNewAddress { get; set; }
        public string LblNewAddresses { get; set; }
        public string LblNoResults { get; set; }
        public string LblRequestDate { get; set; }
        public string LblViewAll { get; set; }
    }

    public class AddressSaveResources
    {
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string LblAddAddress { get; set; }
        public string LblAddressLine1 { get; set; }
        public string LblAddressLine2 { get; set; }
        public string LblAddressLine3 { get; set; }
        public string LblAddressLine4 { get; set; }
        public string LblAddressType { get; set; }
        public string LblCity { get; set; }
        public string LblCountry { get; set; }
        public string LblDateInfomation { get; set; }
        public string LblDateInvalid { get; set; }
        public string LblEditAddress { get; set; }
        public string LblEffectiveDate { get; set; }
        public string LblErrorAddressLine { get; set; }
        public string LblErrorAddressType { get; set; }
        public string LblErrorCity { get; set; }
        public string LblErrorCountry { get; set; }
        public string LblErrorEffectiveDate { get; set; }
        public string LblHouseNumber { get; set; }
        public string LblPostalCode { get; set; }
        public string LblPreferred { get; set; }
        public string LblRecurring { get; set; }
        public string LblSelect { get; set; }
        public string LblStateProvince { get; set; }
    }
}