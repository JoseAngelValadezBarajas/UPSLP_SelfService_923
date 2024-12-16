// --------------------------------------------------------------------
// <copyright file="AssignmentModel.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Section
{
    /// <summary>
    /// AssignmentModel
    /// </summary>
    public class AssignmentModel
    {
        /// <summary>
        /// Gets or sets the assignment end date.
        /// </summary>
        /// <value>
        /// The assignment end date.
        /// </value>
        public string AssignmentEndDate { get; set; }

        /// <summary>
        /// Gets or sets the counts for final.
        /// </summary>
        /// <value>The counts for final.</value>
        public bool CountsForFinal { get; set; }

        /// <summary>
        /// Gets or sets the counts for midterm.
        /// </summary>
        /// <value>The counts for midterm.</value>
        public bool CountsForMidterm { get; set; }

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