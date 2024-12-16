// --------------------------------------------------------------------
// <copyright file="ChecklistTaskModel.cs" company="Ellucian">
//     Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.Checklist
{
    /// <summary>
    /// ChecklistTaskModel class
    /// </summary>
    public class ChecklistTaskModel
    {
        /// <summary>
        /// Gets or sets the action schedule identifier.
        /// </summary>
        /// <value>
        /// The action schedule identifier.
        /// </value>
        public int ActionScheduleId { get; set; }

        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }
    }
}