// --------------------------------------------------------------------
// <copyright file="AssignmentTypeRuleModel.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentTypeRuleModel
    /// </summary>
    public class AssignmentTypeRuleModel
    {
        /// <summary>
        /// Gets or sets the assignment type rule identifier.
        /// </summary>
        /// <value>
        /// The assignment type rule identifier.
        /// </value>
        public int? AssignmentTypeRuleId { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the end date.
        /// </summary>
        /// <value>
        /// The end date.
        /// </value>
        public string EndDate { get; set; }

        /// <summary>
        /// Gets or sets the final drop highest.
        /// </summary>
        /// <value>
        /// The final drop highest.
        /// </value>
        public int FinalDropHighest { get; set; }

        /// <summary>
        /// Gets or sets the final drop lowest.
        /// </summary>
        /// <value>
        /// The final drop lowest.
        /// </value>
        public int FinalDropLowest { get; set; }

        /// <summary>
        /// Gets or sets the f inal weight.
        /// </summary>
        /// <value>
        /// The f inal weight.
        /// </value>
        public decimal FinalWeight { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the midterm drop highest.
        /// </summary>
        /// <value>
        /// The midterm drop highest.
        /// </value>
        public int MidtermDropHighest { get; set; }

        /// <summary>
        /// Gets or sets the midterm drop lowest.
        /// </summary>
        /// <value>
        /// The midterm drop lowest.
        /// </value>
        public int MidtermDropLowest { get; set; }

        /// <summary>
        /// Gets or sets the midterm weight.
        /// </summary>
        /// <value>
        /// The midterm weight.
        /// </value>
        public decimal MidtermWeight { get; set; }

        /// <summary>
        /// Gets or sets the section assignments.
        /// </summary>
        /// <value>
        /// The section assignments.
        /// </value>
        public List<AssignmentTemplateModel> SectionAssignments { get; set; }
    }
}