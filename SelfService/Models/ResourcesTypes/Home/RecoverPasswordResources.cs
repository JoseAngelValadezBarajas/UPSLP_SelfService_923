// --------------------------------------------------------------------
// <copyright file="RecoverPasswordResources.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Home
{
    public class RecoverPasswordResources
    {
        public string BtnCancel { get; set; }
        public string BtnChangePassword { get; set; }
        public string LblGenericError { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
        public string LblRecoverPasswordInstructions { get; set; }
        public string LblRecoverPasswordTitle { get; set; }
        public PasswordConfirmationResources PasswordConfirmation { get; set; }
    }
}