// --------------------------------------------------------------------
// <copyright file="AssignmentTemplateViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System;
using System.Collections.Generic;

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentDepartmentViewModel
    /// </summary>
    public class AssignmentDepartmentViewModel
    {
        /// <summary>
        /// Gets or sets the name of the assigned by.
        /// </summary>
        /// <value>
        /// The name of the assigned by.
        /// </value>
        public string AssignedByName { get; set; }

        /// <summary>
        /// Gets or sets the assigned date.
        /// </summary>
        /// <value>
        /// The assigned date.
        /// </value>
        public string AssignedDate { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance is automatic overall grades.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is automatic overall grades; otherwise, <c>false</c>.
        /// </value>
        public bool IsAutomaticOverallGrades { get; internal set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }
    }

    /// <summary>
    /// AssignmentTemplateDetail
    /// </summary>
    public class AssignmentTemplateDetailViewModel
    {
        /// <summary>
        /// Gets or sets the assignment date.
        /// </summary>
        /// <value>
        /// The assignment date.
        /// </value>
        public DateTime? AssignmentDate { get; set; }

        /// <summary>
        /// Gets or sets the assignment template detail identifier.
        /// </summary>
        /// <value>
        /// The assignment template detail identifier.
        /// </value>
        public int AssignmentTemplateDetailId { get; set; }

        /// <summary>
        /// Gets or sets the assignment template type rule identifier.
        /// </summary>
        /// <value>
        /// The assignment template type rule identifier.
        /// </value>
        public int AssignmentTemplateTypeRuleId { get; set; }

        /// <summary>
        /// Gets or sets the end date.
        /// </summary>
        /// <value>
        /// The end date.
        /// </value>
        public DateTime? EndDate { get; set; }

        /// <summary>
        /// Gets or sets the percentage final.
        /// </summary>
        /// <value>
        /// The percentage final.
        /// </value>
        public decimal PercentageFinal { get; set; }

        /// <summary>
        /// Gets or sets the percentage mid.
        /// </summary>
        /// <value>
        /// The percentage mid.
        /// </value>
        public decimal PercentageMid { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the total grade points.
        /// </summary>
        /// <value>
        /// The total grade points.
        /// </value>
        public decimal TotalGradePoints { get; set; }

        /// <summary>
        /// Gets or sets the view first date.
        /// </summary>
        /// <value>
        /// The view first date.
        /// </value>
        public DateTime? ViewFirstDate { get; set; }

        /// <summary>
        /// Gets or sets the view first time.
        /// </summary>
        /// <value>
        /// The view first time.
        /// </value>
        public DateTime? ViewFirstTime { get; set; }

        /// <summary>
        /// Gets or sets the view last date.
        /// </summary>
        /// <value>
        /// The view last date.
        /// </value>
        public DateTime? ViewLastDate { get; set; }

        /// <summary>
        /// Gets or sets the view last time.
        /// </summary>
        /// <value>
        /// The view last time.
        /// </value>
        public DateTime? ViewLastTime { get; set; }
    }

    /// <summary>
    /// AssignmentTemplateTypeRule
    /// </summary>
    public class AssignmentTemplateTypeRuleViewModel
    {
        /// <summary>
        /// Gets or sets the assignment template detail.
        /// </summary>
        /// <value>
        /// The assignment template detail.
        /// </value>
        public List<AssignmentTemplateDetailViewModel> AssignmentTemplateDetailList { get; set; }

        /// <summary>
        /// Gets or sets the assignment template header identifier.
        /// </summary>
        /// <value>
        /// The assignment template header identifier.
        /// </value>
        public int AssignmentTemplateHeaderId { get; set; }

        /// <summary>
        /// Gets or sets the assignment template type rule identifier.
        /// </summary>
        /// <value>
        /// The assignment template type rule identifier.
        /// </value>
        public int AssignmentTemplateTypeRuleId { get; set; }
    }

    /// <summary>
    /// AssignmentTemplateViewModel
    /// </summary>
    public class AssignmentTemplateViewModel
    {
        /// <summary>
        /// Gets or sets the assignment weighting method.
        /// </summary>
        /// <value>
        /// The assignment weighting method.
        /// </value>
        public int AssignmentWeightingMethod { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [automatic overall grades].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [automatic overall grades]; otherwise, <c>false</c>.
        /// </value>
        public bool AutomaticOverallGrades { get; set; }

        /// <summary>
        /// Gets or sets the created by.
        /// </summary>
        /// <value>
        /// The created by.
        /// </value>
        public int CreatedBy { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [default grade mapping].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [default grade mapping]; otherwise, <c>false</c>.
        /// </value>
        public bool DefaultGradeMapping { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is date by assignment type.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is date by assignment type; otherwise, <c>false</c>.
        /// </value>
        public bool? IsDateByAssignmentType { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is restrictive.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is restrictive; otherwise, <c>false</c>.
        /// </value>
        public bool IsRestrictive { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the session period.
        /// </summary>
        /// <value>
        /// The session period.
        /// </value>
        public int? SessionPeriodId { get; set; }

        /// <summary>
        /// Gets or sets the assignment template header identifier.
        /// </summary>
        /// <value>
        /// The assignment template header identifier.
        /// </value>
        public int TemplateId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [use weighted assignment types].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [use weighted assignment types]; otherwise, <c>false</c>.
        /// </value>
        public bool UseWeightedAssignmentTypes { get; set; }
    }
}