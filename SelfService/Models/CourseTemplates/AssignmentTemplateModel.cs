// --------------------------------------------------------------------
// <copyright file="AssignmentTemplateModel.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentTemplateModel
    /// </summary>
    public class AssignmentTemplateModel
    {
        /// <summary>
        /// Gets or sets the assigned date.
        /// </summary>
        /// <value>
        /// The assigned date.
        /// </value>
        public string AssignedDate { get; set; }

        /// <summary>
        /// Gets or sets the assignment end date.
        /// </summary>
        /// <value>
        /// The assignment end date.
        /// </value>
        public string AssignmentEndDate { get; set; }

        /// <summary>
        /// Gets or sets the assignment identifier.
        /// </summary>
        /// <value>
        /// The assignment identifier.
        /// </value>
        public int? AssignmentId { get; set; }

        /// <summary>
        /// Gets or sets the type of the assignment.
        /// </summary>
        /// <value>
        /// The type of the assignment.
        /// </value>
        public string AssignmentType { get; set; }

        /// <summary>
        /// Gets or sets the assignment type identifier.
        /// </summary>
        /// <value>
        /// The assignment type identifier.
        /// </value>
        public int? AssignmentTypeId { get; set; }

        /// <summary>
        /// Gets or sets the assignment type rule identifier.
        /// </summary>
        /// <value>
        /// The assignment type rule identifier.
        /// </value>
        public int? AssignmentTypeRuleId { get; set; }

        /// <summary>
        /// Gets or sets the counts for final.
        /// </summary>
        /// <value>
        /// The counts for final.
        /// </value>
        public bool? CountsForFinal { get; set; }

        /// <summary>
        /// Gets or sets the counts for midterm.
        /// </summary>
        /// <value>
        /// The counts for midterm.
        /// </value>
        public bool? CountsForMidterm { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the due date.
        /// </summary>
        /// <value>
        /// The due date.
        /// </value>
        public string DueDate { get; set; }

        /// <summary>
        /// Gets or sets the final weight.
        /// </summary>
        /// <value>
        /// The final weight.
        /// </value>
        public decimal? FinalWeight { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int? Id { get; set; }

        /// <summary>
        /// Gets or sets the is extra credit.
        /// </summary>
        /// <value>
        /// The is extra credit.
        /// </value>
        public bool? IsExtraCredit { get; set; }

        /// <summary>
        /// Gets or sets the midterm weight.
        /// </summary>
        /// <value>
        /// The midterm weight.
        /// </value>
        public decimal? MidtermWeight { get; set; }

        /// <summary>
        /// Gets or sets the possible points.
        /// </summary>
        /// <value>
        /// The possible points.
        /// </value>
        public decimal? PossiblePoints { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }
    }
}