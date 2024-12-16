// --------------------------------------------------------------------
// <copyright file="CourseTemplateViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// CourseTemplateViewModel
    /// </summary>
    public class CourseTemplateViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance has activities.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has activities; otherwise, <c>false</c>.
        /// </value>
        public bool HasActivities { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is assigned.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is assigned; otherwise, <c>false</c>.
        /// </value>
        public bool IsAssigned { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is assigned by user.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is assigned by user; otherwise, <c>false</c>.
        /// </value>
        public bool IsAssignedByUser { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is restrictive.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is restrictive; otherwise, <c>false</c>.
        /// </value>
        public bool IsRestrictive { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is shared.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is shared; otherwise, <c>false</c>.
        /// </value>
        public bool IsShared { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the template identifier.
        /// </summary>
        /// <value>
        /// The template identifier.
        /// </value>
        public int TemplateId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [user is owner].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [user is owner]; otherwise, <c>false</c>.
        /// </value>
        public bool UserIsOwner { get; set; }
    }
}