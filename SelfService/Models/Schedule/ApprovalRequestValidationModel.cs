// --------------------------------------------------------------------
// <copyright file="ApprovalRequestValidationModel.cs" company="Ellucian">
//     Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;
using System.Collections.Generic;

namespace SelfService.Models.Schedule
{
    /// <summary>
    /// ApprovalRequestValidationModel
    /// </summary>
    public class ApprovalRequestValidationModel
    {
        /// <summary>
        /// Gets or sets the approval requests.
        /// </summary>
        /// <value>
        /// The approval requests.
        /// </value>
        public List<int> ApprovalRequests { get; set; }

        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the session period identifier.
        /// </summary>
        /// <value>
        /// The session period identifier.
        /// </value>
        public int SessionPeriodId { get; set; }
    }
}