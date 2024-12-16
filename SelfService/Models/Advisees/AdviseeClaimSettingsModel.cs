// --------------------------------------------------------------------
// <copyright file="AdviseeClaimSettingsModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeClaimSettingsModel class
    /// </summary>
    public class AdviseeClaimSettingsModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is authorize registration.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is authorize registration; otherwise, <c>false</c>.
        /// </value>
        public bool IsAuthorizeRegistration { get; set; }

        /// <summary>
        /// Gets or sets the view.
        /// </summary>
        /// <value>
        /// The view.
        /// </value>
        public AdviseeView View { get; set; }
    }
}