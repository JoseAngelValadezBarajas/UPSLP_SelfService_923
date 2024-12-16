// --------------------------------------------------------------------
// <copyright file="SectionSearchOptionsViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Course;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionSearchOptionsViewModel
    /// </summary>
    public class SectionSearchOptionsViewModel : CatalogSearchOptionsViewModel
    {
        /// <summary>
        /// Gets or sets the campus.
        /// </summary>
        /// <value>
        /// The campuses.
        /// </value>
        public List<ListOptionViewModel> Campus { get; set; }

        /// <summary>
        /// Gets or sets the event types.
        /// </summary>
        /// <value>
        /// The event types.
        /// </value>
        public List<ListOptionViewModel> EventTypes { get; set; }

        /// <summary>
        /// Gets or sets the general education list.
        /// </summary>
        /// <value>
        /// The general education list.
        /// </value>
        public List<ListOptionViewModel> GeneralEducationList { get; set; }

        /// <summary>
        /// Gets or sets the list of hours.
        /// </summary>
        /// <value>
        /// The list of hours..
        /// </value>
        public List<ListOptionViewModel> Hours { get; set; }

        /// <summary>
        /// Gets or sets the instructors.
        /// </summary>
        /// <value>
        /// The instructors.
        /// </value>
        public List<ListOptionViewModel> Instructors { get; set; }

        /// <summary>
        /// Gets or sets the meetings.
        /// </summary>
        /// <value>
        /// The meetings.
        /// </value>
        public List<ListOptionViewModel> Meetings { get; set; }

        /// <summary>
        /// Gets or sets the periods.
        /// </summary>
        /// <value>
        /// The periods.
        /// </value>
        public List<ListOptionViewModel> Periods { get; set; }

        /// <summary>
        /// Gets or sets the sessions.
        /// </summary>
        /// <value>
        /// The sessions.
        /// </value>
        public List<ListOptionViewModel> Sessions { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The statuses.
        /// </value>
        public List<ListOptionViewModel> Status { get; set; }

        /// <summary>
        /// Gets or sets the types of course
        /// </summary>
        /// <value>
        /// The types.
        /// </value>
        public List<ListOptionViewModel> Types { get; set; }
    }
}