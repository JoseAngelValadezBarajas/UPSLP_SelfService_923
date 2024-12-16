// --------------------------------------------------------------------
// <copyright file="CartModel.cs" company="Ellucian">
//     Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// CartModel class
    /// </summary>
    public class CartModel
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
    }
}