// --------------------------------------------------------------------
// <copyright file="AssignmentTemplateDetailModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

// TODO: Check if gonna use
namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentTemplateDetailModel
    /// </summary>
    public class AssignmentTemplateDetailModel
    {
        /// <summary>
        /// Gets or sets the assigned date.
        /// </summary>
        /// <value>
        /// The assigned date.
        /// </value>
        public string AssignedDate { get; set; }

        /// <summary>
        /// Gets or sets the assignment identifier.
        /// </summary>
        /// <value>
        /// The assignment identifier.
        /// </value>
        public int AssignmentId { get; set; }

        /// <summary>
        /// Gets or sets the assignment title.
        /// </summary>
        /// <value>
        /// The assignment title.
        /// </value>
        public string AssignmentTitle { get; set; }

        /// <summary>
        /// Gets or sets the assignment type identifier.
        /// </summary>
        /// <value>
        /// The assignment type identifier.
        /// </value>
        public int AssignmentTypeId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [counts for final].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [counts for final]; otherwise, <c>false</c>.
        /// </value>
        public bool CountsForFinal { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [counts for midterm].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [counts for midterm]; otherwise, <c>false</c>.
        /// </value>
        public bool CountsForMidterm { get; set; }

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
        public decimal FinalWeight { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is extra credit.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is extra credit; otherwise, <c>false</c>.
        /// </value>
        public bool IsExtraCredit { get; set; }

        /// <summary>
        /// Gets or sets the midterm weight.
        /// </summary>
        /// <value>
        /// The midterm weight.
        /// </value>
        public decimal MidtermWeight { get; set; }

        /// <summary>
        /// Gets or sets the possible points.
        /// </summary>
        /// <value>
        /// The possible points.
        /// </value>
        public decimal PossiblePoints { get; set; }
    }
}