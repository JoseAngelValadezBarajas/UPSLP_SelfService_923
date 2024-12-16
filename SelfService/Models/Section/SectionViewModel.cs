// --------------------------------------------------------------------
// <copyright file="SectionViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionsListViewModel
    /// </summary>
    public class SectionsListViewModel
    {
        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }

        /// <summary>
        /// Gets or sets the sections.
        /// </summary>
        /// <value>
        /// The sections.
        /// </value>
        public List<SectionViewModel> Sections { get; set; }
    }

    /// <summary>
    /// SectionViewModel
    /// </summary>
    public class SectionViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [fees applicable].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [fees applicable]; otherwise, <c>false</c>.
        /// </value>
        public bool AreFeesApplicable { get; set; }

        /// <summary>
        /// Gets or sets the block reg group section identifier.
        /// </summary>
        /// <value>
        /// The block reg group section identifier.
        /// </value>
        public int? BlockRegGroupSectionId { get; set; }

        /// <summary>
        /// Gets or sets the ceu.
        /// </summary>
        /// <value>
        /// The ceu.
        /// </value>
        public string Ceu { get; set; }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public string Credits { get; set; }

        /// <summary>
        /// Gets or sets the default type of the credit.
        /// </summary>
        /// <value>
        /// The default type of the credit.
        /// </value>
        public string DefaultCreditType { get; set; }

        /// <summary>
        /// Gets or sets the default credit type desc.
        /// </summary>
        /// <value>
        /// The default credit type desc.
        /// </value>
        public string DefaultCreditTypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the end date.
        /// </summary>
        /// <value>
        /// The duration.
        /// </value>
        public string EndDate { get; set; }

        /// <summary>
        /// Gets or sets the event EventId.
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
        /// Gets or sets the event sub type desc.
        /// </summary>
        /// <value>
        /// The event sub type desc.
        /// </value>
        public string EventSubType { get; set; }

        /// <summary>
        /// Gets or sets the event type desc.
        /// </summary>
        /// <value>
        /// The event type desc.
        /// </value>
        public string EventType { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has time conflict.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has time conflict; otherwise, <c>false</c>.
        /// </value>
        public bool HasTimeConflict { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the full name of the instructor.
        /// </summary>
        /// <value>
        /// The full name of the instructor.
        /// </value>
        public List<AvatarViewModel> Instructors { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is cartable.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is cartable; otherwise, <c>false</c>.
        /// </value>
        public bool IsCartable { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is con ed.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is con ed; otherwise, <c>false</c>.
        /// </value>
        public bool IsConEd { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is open.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is open; otherwise, <c>false</c>.
        /// </value>
        public bool IsOpen { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is waitable.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is waitable; otherwise, <c>false</c>.
        /// </value>
        public bool IsWaitable { get; set; }

        /// <summary>
        /// Gets or sets the maximum of seats.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public int MaximumSeats { get; set; }

        /// <summary>
        /// Gets or sets the schedule list.
        /// </summary>
        /// <value>
        /// The schedule list.
        /// </value>
        public List<ScheduleViewModel> Schedules { get; set; }

        /// <summary>
        /// Gets or sets the seats left.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public int SeatsLeft { get; set; }

        /// <summary>
        /// Gets or sets the seats waiting.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public string SeatsWaiting { get; set; }

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
        /// Gets or sets the session desc.
        /// </summary>
        /// <value>
        /// The session desc.
        /// </value>
        public string SessionDesc { get; set; }

        /// <summary>
        /// Gets or sets the start date.
        /// </summary>
        /// <value>
        /// The duration.
        /// </value>
        public string StartDate { get; set; }

        /// <summary>
        /// Gets or sets the start long date.
        /// </summary>
        /// <value>
        /// The start long date.
        /// </value>
        public string StartLongDate { get; set; }

        /// <summary>
        /// Gets or sets the term.
        /// </summary>
        /// <value>
        /// The term.
        /// </value>
        public string Term { get; set; }

        /// <summary>
        /// Gets or sets the term desc.
        /// </summary>
        /// <value>
        /// The term desc.
        /// </value>
        public string TermDesc { get; set; }

        /// <summary>
        /// Gets or sets the term sort.
        /// </summary>
        /// <value>
        /// The term sort.
        /// </value>
        public int TermSort { get; set; }

        /// <summary>
        /// Gets or sets the year.
        /// </summary>
        /// <value>
        /// The year.
        /// </value>
        public string Year { get; set; }
    }
}