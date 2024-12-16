// --------------------------------------------------------------------
// <copyright file="SectionAssignmentSetupViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionAssignmentSetupViewModel
    /// </summary>
    public class SectionAssignmentSetupViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [allow delete all].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [allow delete all]; otherwise, <c>false</c>.
        /// </value>
        public bool AllowDeleteAll { get; set; }

        /// <summary>
        /// Gets or sets the assignment types.
        /// </summary>
        /// <value>
        /// The assignment types.
        /// </value>
        public List<SectionAssignmentTypeViewModel> AssignmentTypes { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is weight by type.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is weight by type; otherwise, <c>false</c>.
        /// </value>
        public bool IsWeightByType { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show midterm].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show midterm]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowMidterm { get; set; }

        /// <summary>
        /// Gets or sets the total final points.
        /// </summary>
        /// <value>
        /// The total final points.
        /// </value>
        public string TotalFinalPoints { get; set; }

        /// <summary>
        /// Gets or sets the possible points total.
        /// </summary>
        /// <value>
        /// The possible points total.
        /// </value>
        public string TotalMidtermPoints { get; set; }

        /// <summary>
        /// Gets or sets the weight method [0 = By Possible Points, 1 = Equally, 2 = Each Activity]
        /// </summary>
        /// <value>
        /// The weight method.
        /// </value>
        public int WeightMethod { get; set; }
    }

    /// <summary>
    /// SectionAssignmentTypeViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Section.AssignmentTypeModel" />
    public class SectionAssignmentTypeViewModel : AssignmentTypeModel
    {
        /// <summary>
        /// Gets or sets the assignments count.
        /// </summary>
        /// <value>
        /// The assignments count.
        /// </value>
        public int AssignmentsCount { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the final maximum drop.
        /// </summary>
        /// <value>
        /// The final maximum drop.
        /// </value>
        public int FinalMaxDrop { get; set; }

        /// <summary>
        /// Gets or sets the midterm maximum drop.
        /// </summary>
        /// <value>
        /// The midterm maximum drop.
        /// </value>
        public int MidtermMaxDrop { get; set; }

        /// <summary>
        /// Gets or sets the section assignments.
        /// </summary>
        /// <value>
        /// The section assignments.
        /// </value>
        public List<SectionAssignmentViewModel> SectionAssignments { get; set; }

        /// <summary>
        /// Gets or sets the total points.
        /// </summary>
        /// <value>
        /// The total points.
        /// </value>
        public string TotalPoints { get; set; }
    }

    /// <summary>
    /// SectionAssignmentViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Section.AssignmentModel" />
    public class SectionAssignmentViewModel : AssignmentModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [allow delete].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [allow delete]; otherwise, <c>false</c>.
        /// </value>
        public bool AllowDelete { get; set; }

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
        /// Gets or sets a value indicating whether this instance is extra credit.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is extra credit; otherwise, <c>false</c>.
        /// </value>
        public bool IsExtraCredit { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }
    }
}