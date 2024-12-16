// --------------------------------------------------------------------
// <copyright file="FacultyAssistantViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using SelfService.Models.Shared;

namespace SelfService.Models.FacultyAssistants
{
    /// <summary>
    /// FacultyAssistantDetailViewModel
    /// </summary>
    /// <seealso cref="SelfServiceUnifier.DTO.FacultyAssistant" />
    public class FacultyAssistantDetailViewModel : FacultyAssistant
    {
        /// <summary>
        /// Gets or sets the assistant.
        /// </summary>
        /// <value>
        /// The assistant.
        /// </value>
        public AvatarViewModel Assistant { get; set; }

        /// <summary>
        /// Gets or sets the create date.
        /// </summary>
        /// <value>
        /// The create date.
        /// </value>
        public string CreateDate { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance is withdrawn.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is withdrawn; otherwise, <c>false</c>.
        /// </value>
        public bool IsWithdrawn { get; internal set; }

        /// <summary>
        /// Gets or sets the revision date.
        /// </summary>
        /// <value>
        /// The revision date.
        /// </value>
        public string RevisionDate { get; set; }
    }
}