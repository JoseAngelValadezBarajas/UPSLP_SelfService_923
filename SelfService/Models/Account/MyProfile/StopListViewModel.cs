// --------------------------------------------------------------------
// <copyright file="StopListViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Account.MyProfile
{
    /// <summary>
    /// StopListViewModel
    /// </summary>
    public class StopListViewModel
    {
        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public string Comments { get; set; }

        /// <summary>
        /// Gets or sets the date.
        /// </summary>
        /// <value>
        /// The date.
        /// </value>
        public string Date { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is grades stop.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is grades stop; otherwise, <c>false</c>.
        /// </value>
        public bool IsGradesStop { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is registration stop.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is registration stop; otherwise, <c>false</c>.
        /// </value>
        public bool IsRegistrationStop { get; set; }

        /// <summary>
        /// Gets or sets the reason.
        /// </summary>
        /// <value>
        /// The reason.
        /// </value>
        public string Reason { get; set; }
    }
}