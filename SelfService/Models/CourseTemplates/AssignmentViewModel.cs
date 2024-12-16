// --------------------------------------------------------------------
// <copyright file="AssignmentViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentTemplateShareViewModel
    /// </summary>
    public class AssignmentTemplateShareViewModel
    {
        /// <summary>
        /// Gets or sets the assignment template share identifier.
        /// </summary>
        /// <value>
        /// The assignment template share identifier.
        /// </value>
        public int AssignmentTemplateShareId { get; set; }

        /// <summary>
        /// Gets or sets the people.
        /// </summary>
        /// <value>
        /// The people.
        /// </value>
        public AvatarViewModel Avatar { get; set; }
    }

    /// <summary>
    /// AssignmentViewModel
    /// </summary>
    public class AssignmentViewModel
    {
        /// <summary>
        /// Gets or sets the type of the assignment.
        /// </summary>
        /// <value>
        /// The type of the assignment.
        /// </value>
        public string AssignmentType { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the possible points.
        /// </summary>
        /// <value>
        /// The possible points.
        /// </value>
        public string PossiblePoints { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }
    }
}