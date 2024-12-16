// --------------------------------------------------------------------
// <copyright file="FormsSetupPermissions.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    /// <summary>
    /// FormsSetupPermissions
    /// </summary>
    public class FormsSetupPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether [application forms setup].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [application forms setup]; otherwise, <c>false</c>.
        /// </value>
        public bool ApplicationFormsSetup { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [inquiry form setup].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [inquiry form setup]; otherwise, <c>false</c>.
        /// </value>
        public bool InquiryFormSetup { get; set; }
    }
}