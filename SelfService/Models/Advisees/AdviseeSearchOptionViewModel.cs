// --------------------------------------------------------------------
// <copyright file="AdviseeSearchOptionViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeSearchOptionViewModel
    /// </summary>
    public class AdviseeSearchOptionViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AdviseeSearchOptionViewModel"/> class.
        /// </summary>
        public AdviseeSearchOptionViewModel()
        {
            Advisors = new List<ListOptionViewModel>();
            Campus = new List<ListOptionViewModel>();
            ClassLevels = new List<ListOptionViewModel>();
            ClassYears = new List<ListOptionViewModel>();
            Colleges = new List<ListOptionViewModel>();
            Curriculums = new List<ListOptionViewModel>();
            Degrees = new List<ListOptionViewModel>();
            Departments = new List<ListOptionViewModel>();
            Events = new List<ListOptionViewModel>();
            HasScheduleRequestsClaim = false;
            Programs = new List<ListOptionViewModel>();
            Sections = new List<ListOptionViewModel>();
            Sessions = new List<ListOptionViewModel>();
            Status = new List<ListOptionViewModel>();
            SubTypes = new List<ListOptionViewModel>();
            YearTerms = new List<ListOptionViewModel>();
        }

        /// <summary>
        /// Gets or sets the advisors.
        /// </summary>
        /// <value>
        /// The advisors.
        /// </value>
        public List<ListOptionViewModel> Advisors { get; set; }

        /// <summary>
        /// Gets or sets the campus.
        /// </summary>
        /// <value>
        /// The campus.
        /// </value>
        public List<ListOptionViewModel> Campus { get; set; }

        /// <summary>
        /// Gets or sets the class levels.
        /// </summary>
        /// <value>
        /// The class levels.
        /// </value>
        public List<ListOptionViewModel> ClassLevels { get; set; }

        /// <summary>
        /// Gets or sets the class years.
        /// </summary>
        /// <value>
        /// The class years.
        /// </value>
        public List<ListOptionViewModel> ClassYears { get; set; }

        /// <summary>
        /// Gets or sets the colleges.
        /// </summary>
        /// <value>
        /// The colleges.
        /// </value>
        public List<ListOptionViewModel> Colleges { get; set; }

        /// <summary>
        /// Gets or sets the curriculums.
        /// </summary>
        /// <value>
        /// The curriculums.
        /// </value>
        public List<ListOptionViewModel> Curriculums { get; set; }

        /// <summary>
        /// Gets or sets the degrees.
        /// </summary>
        /// <value>
        /// The degrees.
        /// </value>
        public List<ListOptionViewModel> Degrees { get; set; }

        /// <summary>
        /// Gets or sets the departments.
        /// </summary>
        /// <value>
        /// The departments.
        /// </value>
        public List<ListOptionViewModel> Departments { get; set; }

        /// <summary>
        /// Gets or sets the events.
        /// </summary>
        /// <value>
        /// The events.
        /// </value>
        public List<ListOptionViewModel> Events { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has schedule requests claim.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has schedule requests claim; otherwise, <c>false</c>.
        /// </value>
        public bool HasScheduleRequestsClaim { get; set; }

        /// <summary>
        /// Gets or sets the programs.
        /// </summary>
        /// <value>
        /// The programs.
        /// </value>
        public List<ListOptionViewModel> Programs { get; set; }

        /// <summary>
        /// Gets or sets the sections.
        /// </summary>
        /// <value>
        /// The sections.
        /// </value>
        public List<ListOptionViewModel> Sections { get; set; }

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
        /// The status.
        /// </value>
        public List<ListOptionViewModel> Status { get; set; }

        /// <summary>
        /// Gets or sets the sub types.
        /// </summary>
        /// <value>
        /// The sub types.
        /// </value>
        public List<ListOptionViewModel> SubTypes { get; set; }

        /// <summary>
        /// Gets or sets the year terms.
        /// </summary>
        /// <value>
        /// The year terms.
        /// </value>
        public List<ListOptionViewModel> YearTerms { get; set; }
    }
}