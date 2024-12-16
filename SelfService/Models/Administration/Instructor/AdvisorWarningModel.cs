// --------------------------------------------------------------------
// <copyright file="AdvisorWarningModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Administration.Instructor
{
    /// <summary>
    /// AdvisorWarningModel
    /// </summary>
    public class AdvisorWarningModel
    {
        /// <summary>
        /// Gets or sets the excused absences.
        /// </summary>
        /// <value>
        /// The excused absences.
        /// </value>
        public int? ExcusedAbsences { get; set; }

        /// <summary>
        /// Gets or sets the excused tardiness.
        /// </summary>
        /// <value>
        /// The excused tardiness.
        /// </value>
        public int? ExcusedTardiness { get; set; }

        /// <summary>
        /// Gets or sets the selected grades.
        /// </summary>
        /// <value>
        /// The selected grades.
        /// </value>
        public List<int> SelectedGrades { get; set; }

        /// <summary>
        /// Gets or sets the selected violations.
        /// </summary>
        /// <value>
        /// The selected violations.
        /// </value>
        public List<int> SelectedViolations { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowAttendance { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show grades].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show grades]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowGrades { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show violations].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show violations]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowViolations { get; set; }

        /// <summary>
        /// Gets or sets the attendance unexcused absences.
        /// </summary>
        /// <value>
        /// The attendance unexcused absences.
        /// </value>
        public int? UnexcusedAbsences { get; set; }

        /// <summary>
        /// Gets or sets the attendance unexcused tardiness.
        /// </summary>
        /// <value>
        /// The attendance unexcused tardiness.
        /// </value>
        public int? UnexcusedTardiness { get; set; }
    }
}