// --------------------------------------------------------------------
// <copyright file="ChecklistMyTaskModel.cs" company="Ellucian">
//     Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Checklist
{
    /// <summary>
    /// ChecklistMyTaskModel class
    /// </summary>
    public class ChecklistMyTaskModel
    {
        /// <summary>
        /// Gets or sets the action schedule identifier.
        /// </summary>
        /// <value>
        /// The action schedule identifier.
        /// </value>
        public int ActionScheduleId { get; set; }

        /// <summary>
        /// Gets or sets the completed by.
        /// </summary>
        /// <value>
        /// The completed by.
        /// </value>
        public string CompletedBy { get; set; }

        /// <summary>
        /// Gets or sets the completed date.
        /// </summary>
        /// <value>
        /// The completed date.
        /// </value>
        public string CompletedDate { get; set; }

        /// <summary>
        /// Gets or sets the completed time.
        /// </summary>
        /// <value>
        /// The completed time.
        /// </value>
        public string CompletedTime { get; set; }

        /// <summary>
        /// Gets or sets the notes.
        /// </summary>
        /// <value>
        /// The notes.
        /// </value>
        public string Notes { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public string Status { get; set; }
    }
}