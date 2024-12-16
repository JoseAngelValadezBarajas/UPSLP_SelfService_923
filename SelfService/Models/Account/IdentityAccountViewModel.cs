// --------------------------------------------------------------------
// <copyright file="IdentityAccountViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System;

namespace SelfService.Models.Account
{
    /// <summary>
    /// IdentityAccount View Model
    /// </summary>
    public class IdentityAccountViewModel
    {
        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the first name.
        /// </summary>
        /// <value>
        /// The first name.
        /// </value>
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name.
        /// </summary>
        /// <value>
        /// The last name.
        /// </value>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        /// <value>
        /// The password.
        /// </value>
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int? PersonId { get; set; }

        /// <summary>
        /// Gets or sets the token.
        /// </summary>
        /// <value>
        /// The token.
        /// </value>
        public Guid? Token { get; set; }
    }

    /// <summary>
    /// ResultSignUpViewModel
    /// </summary>
    public class ResultSignUpViewModel
    {
        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// -1 error
        /// 0 success
        /// </value>
        public int Status { get; set; }

        /// <summary>
        /// Gets or sets the user account status.
        /// </summary>
        /// <value>
        /// The user account status.
        /// </value>
        public int UserAccountStatus { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; }
    }
}