// --------------------------------------------------------------------
// <copyright file="PasswordChangeResponse.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Enum;

namespace SelfService.Models.Account.MyProfile
{
    public class PasswordChangeViewModel
    {
        /// <summary>
        /// Gets or sets the configuration.
        /// </summary>
        /// <value>
        /// The configuration.
        /// </value>
        public AppConfig Configuration { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public PasswordValidation Status { get; set; }
    }
}