// --------------------------------------------------------------------
// <copyright file="ProfileRequestViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;

namespace SelfService.Models.Administration.Requests
{
    /// <summary>
    /// ProfileRequestViewModel
    /// </summary>
    public class ProfileRequestViewModel
    {
        /// <summary>
        /// Gets or sets the avatar.
        /// </summary>
        /// <value>
        /// The avatar.
        /// </value>
        public AvatarViewModel Avatar { get; set; }

        /// <summary>
        /// Gets or sets the date of request.
        /// </summary>
        /// <value>
        /// The date of request.
        /// </value>
        public string DateOfRequest { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has picture.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has picture; otherwise, <c>false</c>.
        /// </value>
        public bool HasPicture { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the people id.
        /// </summary>
        /// <value>
        /// The people id.
        /// </value>
        public string PeopleId { get; set; }
    }
}