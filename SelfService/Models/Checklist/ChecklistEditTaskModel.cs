// --------------------------------------------------------------------
// <copyright file="ChecklistEditTaskModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Checklist
{
    /// <summary>
    /// ChecklistEditTaskModel class
    /// </summary>
    public class ChecklistEditTaskModel
    {
        /// <summary>
        /// Gets or sets the checklist my task.
        /// </summary>
        /// <value>
        /// The checklist my task.
        /// </value>
        public ChecklistEditTaskDetailModel ChecklistMyTask { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is impersonate.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is impersonate; otherwise, <c>false</c>.
        /// </value>
        public bool IsImpersonate { get; set; }
    }
}