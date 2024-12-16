// --------------------------------------------------------------------
// <copyright file="RegistrationLogDeletionModel.cs" company="Ellucian">
//     Copyright 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Account.MyProfile
{
    /// <summary>
    /// RegistrationLogDeletionModelModel
    /// </summary>
    public class RegistrationLogDeletionModelModel
    {
        /// <summary>
        /// Gets or sets the impersonate information model.
        /// </summary>
        /// <value>
        /// The impersonate information model.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the registration log identifier.
        /// </summary>
        /// <value>
        /// The registration log identifier.
        /// </value>
        public int RegistrationLogId { get; set; }
    }
}