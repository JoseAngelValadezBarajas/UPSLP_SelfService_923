// --------------------------------------------------------------------
// <copyright file="AccountInvitationViewModel.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System;

namespace SelfService.Models.Invitations
{
    /// <summary>
    /// AccountInvitationViewModel
    /// </summary>
    public class AccountInvitationViewModel
    {
        /// <summary>
        /// Gets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets the first name.
        /// </summary>
        /// <value>
        /// The first name.
        /// </value>
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance has account.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has account; otherwise, <c>false</c>.
        /// </value>
        public bool HasAccount { get; set; }

        /// <summary>
        /// Gets the last name.
        /// </summary>
        /// <value>
        /// The last name.
        /// </value>
        public string LastName { get; set; }

        /// <summary>
        /// Gets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; internal set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int? PersonId { get; set; }

        /// <summary>
        /// Gets the token.
        /// </summary>
        /// <value>
        /// The token.
        /// </value>
        public Guid? Token { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; }
    }

    /// <summary>
    /// RelativeDetailsViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Invitations.RelativeViewModel" />
    public class RelativeDetailsViewModel : RelativeViewModel
    {
        /// <summary>
        /// Gets or sets the accepted date.
        /// </summary>
        /// <value>
        /// The accepted date.
        /// </value>
        public string AcceptedDate { get; set; }

        /// <summary>
        /// Gets or sets the options.
        /// </summary>
        /// <value>
        /// The options.
        /// </value>
        public SharedAccessClaimModel Options { get; set; }
    }

    /// <summary>
    /// RelativeViewModel
    /// </summary>
    public class RelativeViewModel
    {
        /// <summary>
        /// Gets or sets the avatar.
        /// </summary>
        /// <value>
        /// The avatar.
        /// </value>
        public AvatarViewModel Avatar { get; set; }

        /// <summary>
        /// Gets or sets the expiry date.
        /// </summary>
        /// <value>
        /// The expiry date.
        /// </value>
        public string ExpiryDate { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the relationship desc.
        /// </summary>
        /// <value>
        /// The relationship desc.
        /// </value>
        public string RelationshipDesc { get; set; }
    }
}