// --------------------------------------------------------------------
// <copyright file="StudentGradeReportModel.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.Students
{
    /// <summary>
    /// StudentGradeReportModel class
    /// </summary>
    public class StudentGradeReportModel
    {
        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the sequence.
        /// </summary>
        /// <value>
        /// The sequence.
        /// </value>
        public string Sequence { get; set; }

        /// <summary>
        /// Gets or sets the term period identifier.
        /// </summary>
        /// <value>
        /// The term period identifier.
        /// </value>
        public int TermPeriodId { get; set; }
    }
}