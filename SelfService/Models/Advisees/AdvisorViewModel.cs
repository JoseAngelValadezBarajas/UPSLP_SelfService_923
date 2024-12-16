// --------------------------------------------------------------------
// <copyright file="AdvisorViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdvisorViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Shared.AvatarViewModel" />
    public class AdvisorViewModel : AvatarViewModel
    {
        /// <summary>
        /// Gets or sets the shared advisee identifier.
        /// </summary>
        /// <value>
        /// The shared advisee identifier.
        /// </value>
        public int SharedAdviseeId { get; set; }
    }
}