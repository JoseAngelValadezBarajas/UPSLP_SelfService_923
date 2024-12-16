// --------------------------------------------------------------------
// <copyright file="RegistrationSectionSummaryViewModel.cs" company="Ellucian">
//     Copyright 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// The registration section summary view model class.
    /// </summary>
    public class RegistrationSectionSummaryViewModel
    {
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
        /// Gets or sets the type of the event sub.
        /// </summary>
        /// <value>
        /// The type of the event sub.
        /// </value>
        public string EventSubType { get; set; }

        /// <summary>
        /// Gets or sets the section.
        /// </summary>
        /// <value>
        /// The section.
        /// </value>
        public string Section { get; set; }

        /// <summary>
        /// Gets or sets the session.
        /// </summary>
        /// <value>
        /// The session.
        /// </value>
        public string Session { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public RegistrationSectionLogStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the term.
        /// </summary>
        /// <value>
        /// The term.
        /// </value>
        public string Term { get; set; }

        /// <summary>
        /// Gets or sets the year.
        /// </summary>
        /// <value>
        /// The year.
        /// </value>
        public string Year { get; set; }
    }
}