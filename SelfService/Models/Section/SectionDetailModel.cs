// --------------------------------------------------------------------
// <copyright file="SectionDetailModel.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionDetailModel
    /// </summary>
    public class SectionDetailModel
    {
        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance with is cartable.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance with is cartable; otherwise, <c>false</c>.
        /// </value>
        public bool WithIsCartable { get; set; }
    }
}