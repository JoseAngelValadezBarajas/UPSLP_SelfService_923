// --------------------------------------------------------------------
// <copyright file="PrerequisiteViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;

namespace SelfService.Models.Course
{
    /// <summary>
    /// PrerequisiteViewModel
    /// </summary>
    public class PrerequisiteViewModel
    {
        /// <summary>
        /// Gets or sets the course event.
        /// </summary>
        /// <value>The course event.</value>
        public CourseEventViewModel CourseEvent { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>The identifier.</value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the instructor.
        /// </summary>
        /// <value>The instructor.</value>
        public AvatarViewModel Instructor { get; set; }

        /// <summary>
        /// Gets or sets the prerequisite condition.
        /// </summary>
        /// <value>The prerequisite condition.</value>
        public string PrerequisiteCondition { get; set; }

        /// <summary>
        /// Gets or sets the type of the prerequisite.
        /// </summary>
        /// <value>
        /// The type of the prerequisite.
        /// </value>
        public PrerequisiteType PrerequisiteType { get; set; }

        /// <summary>
        /// Gets or sets the test score.
        /// </summary>
        /// <value>The test score.</value>
        public TestScoreViewModel TestScore { get; set; }
    }
}