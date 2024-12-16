// --------------------------------------------------------------------
// <copyright file="ApprovalRequestModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Schedule
{
    /// <summary>
    /// Class ApprovalRequest
    /// </summary>
    public class ApprovalRequestModel
    {
        /// <summary>
        /// Gets or sets the decision.
        /// </summary>
        /// <value>
        /// The decision.
        /// </value>
        public int Decision { get; set; }

        /// <summary>
        /// Gets or sets the reason.
        /// </summary>
        /// <value>
        /// The reason.
        /// </value>
        public string Reason { get; set; }

        /// <summary>
        /// Gets or sets the schedule request identifier.
        /// </summary>
        /// <value>
        /// The schedule request identifier.
        /// </value>
        public int? ScheduleRequestId { get; set; }
    }
}