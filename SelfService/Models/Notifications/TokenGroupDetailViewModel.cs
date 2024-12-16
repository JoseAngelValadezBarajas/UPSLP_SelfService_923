// --------------------------------------------------------------------
// <copyright file="TokenGroupDetailViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Notifications
{
    /// <summary>
    ///  TokenGroupDetailViewModel
    /// </summary>
    public class TokenGroupDetailViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is collection.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is collection; otherwise, <c>false</c>.
        /// </value>
        public bool IsCollection { get; set; }

        /// <summary>
        /// Gets or sets the token key.
        /// </summary>
        /// <value>
        /// The token key.
        /// </value>
        public string TokenKey { get; set; }
    }
}