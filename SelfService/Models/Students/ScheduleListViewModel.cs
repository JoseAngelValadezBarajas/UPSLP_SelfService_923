// --------------------------------------------------------------------
// <copyright file="ScheduleListViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Schedule;
using System.Collections.Generic;

namespace SelfService.Models.Students
{
    /// <summary>
    /// ScheduleListItemViewModel
    /// </summary>
    public class ScheduleListItemViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ScheduleListItemViewModel"/> class.
        /// </summary>
        public ScheduleListItemViewModel()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="ScheduleListViewModel" /> class.
        /// </summary>
        /// <param name="scheduleListItemViewModel">The schedule list item view model.</param>
        public ScheduleListItemViewModel(ScheduleListItemViewModel scheduleListItemViewModel)
        {
            DurationDays = scheduleListItemViewModel.DurationDays;
            DurationTime = scheduleListItemViewModel.DurationTime;
            StartTime = scheduleListItemViewModel.StartTime;
            EndTime = scheduleListItemViewModel.EndTime;
            ScheduledDays = scheduleListItemViewModel.ScheduledDays;
        }

        /// <summary>
        /// Gets or sets the duration days.
        /// </summary>
        /// <value>
        /// The duration days.
        /// </value>
        public string DurationDays { get; set; }

        /// <summary>
        /// Gets or sets the duration time.
        /// </summary>
        /// <value>
        /// The duration time.
        /// </value>
        public string DurationTime { get; set; }

        /// <summary>
        /// Gets or sets the end time.
        /// </summary>
        /// <value>
        /// The end time.
        /// </value>
        public List<int> EndTime { get; set; }

        /// <summary>
        /// Gets or sets the scheduled days.
        /// </summary>
        /// <value>
        /// The scheduled days.
        /// </value>
        public List<int> ScheduledDays { get; set; }

        /// <summary>
        /// Gets or sets the start time.
        /// </summary>
        /// <value>
        /// The start time.
        /// </value>
        public List<int> StartTime { get; set; }
    }

    /// <summary>
    /// ScheduleListViewModel Class
    /// </summary>
    public class ScheduleListViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ScheduleListViewModel"/> class.
        /// </summary>
        public ScheduleListViewModel()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="ScheduleListViewModel"/> class.
        /// </summary>
        /// <param name="scheduleListViewModel">The schedule ListView model.</param>
        public ScheduleListViewModel(ScheduleListViewModel scheduleListViewModel)
        {
            ClassId = scheduleListViewModel.ClassId;
            Description = scheduleListViewModel.Description;
            Schedules = scheduleListViewModel.Schedules;
            Status = scheduleListViewModel.Status;
            Duration = scheduleListViewModel.Duration;
            Session = scheduleListViewModel.Session;
            Credits = scheduleListViewModel.Credits;
            CreditType = scheduleListViewModel.CreditType;
            StatusCart = scheduleListViewModel.StatusCart;
        }

        /// <summary>
        /// Gets or sets the class identifier.
        /// </summary>
        /// <value>
        /// The class identifier.
        /// </value>
        public int ClassId { get; set; }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public string Credits { get; set; }

        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>
        /// The type of the credit.
        /// </value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the credit type description.
        /// </summary>
        /// <value>
        /// The credit type description.
        /// </value>
        public string CreditTypeDescription { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the duration.
        /// </summary>
        /// <value>
        /// The duration.
        /// </value>
        public string Duration { get; set; }

        /// <summary>
        /// Gets the final grade.
        /// </summary>
        /// <value>
        /// The final grade.
        /// </value>
        public string FinalGrade { get; set; }

        /// <summary>
        /// Gets or sets the instructors.
        /// </summary>
        /// <value>
        /// The instructors.
        /// </value>
        public List<string> Instructors { get; set; }

        /// <summary>
        /// Gets or sets the schedules.
        /// </summary>
        /// <value>
        /// The schedules.
        /// </value>
        public List<ScheduleListItemViewModel> Schedules { get; set; }

        /// <summary>
        /// Gets or sets the session.
        /// </summary>
        /// <value>
        /// The session.
        /// </value>
        public string Session { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show drop].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show drop]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowDrop { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public string Status { get; set; }

        /// <summary>
        /// Gets or Sets status of the section in the cart.
        /// </summary>
        /// <value>
        /// The status of the section in the cart.
        /// </value>
        public bool StatusCart { get; set; }
    }

    /// <summary>
    /// BlockRegRuleGroupBlockCartModel
    /// </summary>
    public class StudentBlockRegRuleGroupBlockModel
    {
        /// <summary>
        /// Gets or sets the block reg rule group block identifier.
        /// </summary>
        /// <value>
        /// The block reg rule group block identifier.
        /// </value>
        public int BlockRegRuleGroupBlockId { get; set; }

        /// <summary>
        /// Gets or sets the cart sections.
        /// </summary>
        /// <value>
        /// The cart sections.
        /// </value>
        public List<int> CartSections { get; set; }

        /// <summary>
        /// Gets or sets the drop sections.
        /// </summary>
        /// <value>
        /// The drop sections.
        /// </value>
        public List<int> DropSections { get; set; }

        /// <summary>
        /// Gets or sets the waitlist sections.
        /// </summary>
        /// <value>
        /// The waitlist sections.
        /// </value>
        public List<int> WaitlistSections { get; set; }

        /// <summary>
        /// Gets or sets the year term.
        /// </summary>
        /// <value>
        /// The year term.
        /// </value>
        public YearTermModel YearTerm { get; set; }
    }
}