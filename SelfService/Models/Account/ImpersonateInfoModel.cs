// --------------------------------------------------------------------
// <copyright file="ImpersonateInfoModel.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Enum;

namespace SelfService.Models.Account
{
    /// <summary>
    /// ImpersonateInfoModel class.
    /// </summary>
    public class ImpersonateInfoModel
    {
        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the process.
        /// </summary>
        /// <value>
        /// The process.
        /// </value>
        public ImpersonateProcess Process { get; set; }

        /// <summary>
        /// Gets or sets the tab identifier.
        /// </summary>
        /// <value>
        /// The tab identifier.
        /// </value>
        public int? TabId { get; set; }

        /// <summary>
        /// Gets or sets the view identifier.
        /// </summary>
        /// <value>
        /// The view identifier.
        /// </value>
        public int? ViewId { get; set; }
    }
}