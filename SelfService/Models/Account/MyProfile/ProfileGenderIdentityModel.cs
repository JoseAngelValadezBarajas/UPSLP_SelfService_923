// --------------------------------------------------------------------
// <copyright file="ProfileGenderIdentityModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Account.MyProfile
{
    /// <summary>
    /// ProfileGenderIdentityModel
    /// </summary>
    public class ProfileGenderIdentityModel
    {
        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets the gender identity identifier.
        /// </summary>
        /// <value>
        /// The gender identity identifier.
        /// </value>
        public int? GenderIdentityId { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int? PersonId { get; set; }

        /// <summary>
        /// Gets or sets the pronoun identifier.
        /// </summary>
        /// <value>
        /// The pronoun identifier.
        /// </value>
        public int? PronounId { get; set; }
    }
}