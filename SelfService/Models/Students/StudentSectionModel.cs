// --------------------------------------------------------------------
// <copyright file="StudentSectionModel.cs" company="Ellucian">
//     Copyright 2021-2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.Students
{
    /// <summary>
    /// StudentSectionModel class
    /// </summary>
    public class StudentSectionModel
    {
        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo{ get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}