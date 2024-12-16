// --------------------------------------------------------------------
// <copyright file="SectionAssignmentsViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionAssignmentsViewModel
    /// </summary>
    public class SectionAssignmentsViewModel
    {
        /// <summary>
        /// Gets the academic session.
        /// </summary>
        /// <value>
        /// The academic session.
        /// </value>
        public string AcademicSession { get; internal set; }

        /// <summary>
        /// Gets the academic term.
        /// </summary>
        /// <value>
        /// The academic term.
        /// </value>
        public string AcademicTerm { get; internal set; }

        /// <summary>
        /// Gets the academic year.
        /// </summary>
        /// <value>
        /// The academic year.
        /// </value>
        public string AcademicYear { get; internal set; }

        /// <summary>
        /// Gets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public string EventId { get; internal set; }

        /// <summary>
        /// Gets the name of the event.
        /// </summary>
        /// <value>
        /// The name of the event.
        /// </value>
        public string EventName { get; internal set; }

        /// <summary>
        /// Gets the type of the event sub.
        /// </summary>
        /// <value>
        /// The type of the event sub.
        /// </value>
        public string EventSubType { get; internal set; }

        /// <summary>
        /// Gets a value indicating whether this instance has activities.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has activities; otherwise, <c>false</c>.
        /// </value>
        public bool HasActivities { get; internal set; }

        /// <summary>
        /// Gets a value indicating whether this instance has grades.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has grades; otherwise, <c>false</c>.
        /// </value>
        public bool HasGrades { get; internal set; }

        /// <summary>
        /// Gets a value indicating whether this instance has posted grades.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has posted grades; otherwise, <c>false</c>.
        /// </value>
        public bool HasPostedGrades { get; internal set; }

        /// <summary>
        /// Gets a value indicating whether this instance has template.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has template; otherwise, <c>false</c>.
        /// </value>
        public bool HasTemplate { get; internal set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public string SectionIdentifier { get; internal set; }

        /// <summary>
        /// Gets the session desc.
        /// </summary>
        /// <value>
        /// The session desc.
        /// </value>
        public string SessionDesc { get; internal set; }

        /// <summary>
        /// Gets the session period identifier.
        /// </summary>
        /// <value>
        /// The session period identifier.
        /// </value>
        public int SessionPeriodId { get; internal set; }

        /// <summary>
        /// Gets the term desc.
        /// </summary>
        /// <value>
        /// The term desc.
        /// </value>
        public string TermDesc { get; internal set; }
    }
}