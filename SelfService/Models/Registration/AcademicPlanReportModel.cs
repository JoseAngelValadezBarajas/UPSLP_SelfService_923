// --------------------------------------------------------------------
// <copyright file="AcademicPlanReportModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.DegreeRequirements;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// AcademicPlanReportModel class
    /// </summary>
    public class AcademicPlanReportModel
    {
        /// <summary>
        /// Gets or sets the expected graduation date.
        /// </summary>
        /// <value>
        /// The expected graduation date.
        /// </value>
        public string ExpectedGraduationDate { get; set; }

        /// <summary>
        /// Gets or sets the graduation period.
        /// </summary>
        /// <value>
        /// The graduation period.
        /// </value>
        public string GraduationPeriod { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show sequence].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show sequence]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowSequence { get; set; }

        /// <summary>
        /// Gets or sets the student degree requirement.
        /// </summary>
        /// <value>
        /// The student degree requirement.
        /// </value>
        public StudentDegReqViewModel StudentDegreeRequirement { get; set; }

        /// <summary>
        /// Gets or sets the name of the student.
        /// </summary>
        /// <value>
        /// The name of the student.
        /// </value>
        public string StudentName { get; set; }
    }
}