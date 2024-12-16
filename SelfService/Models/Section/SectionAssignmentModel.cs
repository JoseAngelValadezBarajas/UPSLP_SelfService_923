// --------------------------------------------------------------------
// <copyright file="SectionAssignmentModel.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionAssignmentModel
    /// </summary>
    public class SectionAssignmentModel
    {
        /// <summary>
        /// Gets or sets the assigned date.
        /// </summary>
        /// <value>
        /// The assigned date.
        /// </value>
        public string AssignedDate { get; set; }

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
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

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

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public int Type { get; set; }
    }

    /// <summary>
    /// SectionAssignmentWeightModel
    /// </summary>
    public class SectionAssignmentWeightModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is by type.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is by type; otherwise, <c>false</c>.
        /// </value>
        public bool IsWeightByType { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the method.
        /// 1 - By possible points
        /// 2 - Equally
        /// 3 - For each activity
        /// </summary>
        /// <value>
        /// The method.
        /// </value>
        public int WeightMethod { get; set; }
    }
}