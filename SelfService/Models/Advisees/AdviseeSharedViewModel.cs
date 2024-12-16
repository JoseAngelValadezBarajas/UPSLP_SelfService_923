// --------------------------------------------------------------------
// <copyright file="AdviseeSharedViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeSharedViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Shared.AvatarViewModel" />
    /// <seealso cref="PowerCampus.Identity.Models.AvatarViewModel" />
    public class AdviseeSharedViewModel : AvatarViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AdviseeSharedViewModel" /> class.
        /// </summary>
        /// <param name="avatarViewModel">The avatar view model.</param>
        public AdviseeSharedViewModel(AvatarViewModel avatarViewModel) : base(avatarViewModel)
        {
        }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }
    }

    /// <summary>
    /// AdviseesSharedViewModel
    /// </summary>
    public class AdviseesSharedViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AdviseesSharedViewModel" /> class.
        /// </summary>
        public AdviseesSharedViewModel() => this.Advisees = new List<AdviseeSharedViewModel>();

        /// <summary>
        /// Gets or sets the advisees.
        /// </summary>
        /// <value>
        /// The advisees.
        /// </value>
        public List<AdviseeSharedViewModel> Advisees { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }
    }
}