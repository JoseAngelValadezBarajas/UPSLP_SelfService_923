// --------------------------------------------------------------------
// <copyright file="ApprovalRequestViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Schedule
{
    /// <summary>
    /// Class ApprovalRequestViewModel
    /// </summary>
    public class ApprovalRequestViewModel
    {
        /// <summary>
        /// Gets or sets the awaiting drop list.
        /// </summary>
        /// <value>
        /// The awaiting drop list.
        /// </value>
        public List<SectionCourseViewModel> AwaitingDropList { get; set; }

        /// <summary>
        /// Gets or sets the awaiting registration list.
        /// </summary>
        /// <value>
        /// The awaiting registration list.
        /// </value>
        public List<SectionCourseViewModel> AwaitingRegistrationList { get; set; }

        /// <summary>
        /// Gets or sets the drop requests.
        /// </summary>
        /// <value>
        /// The drop requests.
        /// </value>
        public List<SectionCourseViewModel> DropRequests { get; set; }

        /// <summary>
        /// Gets or sets the registration requests.
        /// </summary>
        /// <value>
        /// The registration requests.
        /// </value>
        public List<SectionCourseViewModel> RegistrationRequests { get; set; }
    }

    /// <summary>
    /// Class SectionCourseViewModel
    /// </summary>
    public class SectionCourseViewModel : ApprovalRequestModel
    {
        /// <summary>
        /// Gets or sets the name of the block.
        /// </summary>
        /// <value>
        /// The name of the block.
        /// </value>
        public string BlockName { get; set; }

        /// <summary>
        /// Gets or sets the decision date.
        /// </summary>
        /// <value>
        /// The decision date.
        /// </value>
        public string DecisionDate { get; set; }

        /// <summary>
        /// Gets or sets the decision time.
        /// </summary>
        /// <value>
        /// The decision time.
        /// </value>
        public string DecisionTime { get; set; }

        /// <summary>
        /// Gets or sets the event credit type desc.
        /// </summary>
        /// <value>
        /// The event credit type desc.
        /// </value>
        public string EventCreditTypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public string EventId { get; set; }

        /// <summary>
        /// Gets or sets the name of the event.
        /// </summary>
        /// <value>
        /// The name of the event.
        /// </value>
        public string EventName { get; set; }

        /// <summary>
        /// Gets or sets the event section.
        /// </summary>
        /// <value>
        /// The event section.
        /// </value>
        public string EventSection { get; set; }

        /// <summary>
        /// Gets or sets the event sub type desc.
        /// </summary>
        /// <value>
        /// The event sub type desc.
        /// </value>
        public string EventSubTypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the event type desc.
        /// </summary>
        /// <value>
        /// The event type desc.
        /// </value>
        public string EventTypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the name of the group.
        /// </summary>
        /// <value>
        /// The name of the group.
        /// </value>
        public string GroupName { get; set; }

        /// <summary>
        /// Gets or sets the request date.
        /// </summary>
        /// <value>
        /// The request date.
        /// </value>
        public string RequestDate { get; set; }

        /// <summary>
        /// Gets or sets the request time.
        /// </summary>
        /// <value>
        /// The request time.
        /// </value>
        public string RequestTime { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}