// --------------------------------------------------------------------
// <copyright file="AccountMainResources.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Account
{
    public class AccountMainResources
    {
        public string LblAccountInformation { get; set; }
        public string LblContactInformation { get; set; }
        public string LblFirstName { get; set; }
        public string LblGenericError { get; set; }
        public string LblLastName { get; set; }
        public string LblLastNamePrefix { get; set; }
        public string LblMiddleName { get; set; }
        public string LblPassword { get; set; }
        public string LblPrefix { get; set; }
        public string LblSuffix { get; set; }
        public string LblSystemId { get; set; }
        public string LblTitleName { get; set; }
        public string LblUserName { get; set; }
        public PasswordResetResources PasswordResetResources { get; set; }
    }

    public class PasswordResetResources
    {
        public string LblCancelPassword { get; set; }
        public string LblChangePassword { get; set; }
        public string LblChangePwdLegend { get; set; }
        public string LblCurrentPassword { get; set; }
        public string LblCurrentPasswordError { get; set; }
        public string LblCurrentPasswordInvalid { get; set; }
        public string LblErrorConfirmPassword { get; set; }
        public string LblSavePassword { get; set; }
        public string LblSuccess { get; set; }
        public PasswordConfirmationResources PasswordConfirmation { get; set; }
    }
}