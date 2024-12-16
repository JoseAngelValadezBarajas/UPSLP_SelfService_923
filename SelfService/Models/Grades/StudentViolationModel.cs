// --------------------------------------------------------------------
// <copyright file="StudentViolationModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Grades
{
    /// <summary>
    /// StudentViolationModel
    /// </summary>
    public class StudentViolationModel
    {
        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the student identifier.
        /// </summary>
        /// <value>
        /// The student identifier.
        /// </value>
        public int StudentId { get; set; }

        /// <summary>
        /// Gets or sets the violation date.
        /// </summary>
        /// <value>
        /// The violation date.
        /// </value>
        public string ViolationDate { get; set; }

        /// <summary>
        /// Gets or sets the violation identifier.
        /// </summary>
        /// <value>
        /// The violation identifier.
        /// </value>
        public int ViolationId { get; set; }

        /// <summary>
        /// Gets or sets the violation type identifier.
        /// </summary>
        /// <value>
        /// The violation type identifier.
        /// </value>
        public int ViolationTypeId { get; set; }
    }
}