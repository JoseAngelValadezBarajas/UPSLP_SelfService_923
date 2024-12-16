// --------------------------------------------------------------------
// <copyright file="ValidationMessageViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// Class RegistrationValidationViewModel.
    /// </summary>
    public class RegistrationValidationViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is successful.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is successful; otherwise, <c>false</c>.
        /// </value>
        public bool IsSuccessful { get; set; }

        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the registration log identifier.
        /// </summary>
        /// <value>
        /// The registration log identifier.
        /// </value>
        public int RegistrationLogId { get; set; }

        /// <summary>
        /// Gets or sets the validation messages.
        /// </summary>
        /// <value>
        /// The validation messages.
        /// </value>
        public List<ValidationMessageViewModel> ValidationMessages { get; set; }
    }
}