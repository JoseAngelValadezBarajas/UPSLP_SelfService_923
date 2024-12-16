// --------------------------------------------------------------------
// <copyright file="SectionDetailViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Course;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionViewModel
    /// </summary>
    public class SectionDetailViewModel : SectionViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SectionDetailViewModel"/> class.
        /// </summary>
        /// <param name="section">The section.</param>
        public SectionDetailViewModel(SectionViewModel section)
        {
            this.Id = section.Id;
            this.AreFeesApplicable = section.AreFeesApplicable;
            this.Credits = section.Credits;
            this.Ceu = section.Ceu;
            this.DefaultCreditType = section.DefaultCreditType;
            this.DefaultCreditTypeDesc = section.DefaultCreditTypeDesc;
            this.Description = section.Description;
            this.EndDate = section.EndDate;
            this.EventId = section.EventId;
            this.EventName = section.EventName;
            this.EventSubType = section.EventSubType;
            this.EventType = section.EventType;
            this.Instructors = section.Instructors;
            this.IsCartable = section.IsCartable;
            this.IsOpen = section.IsOpen;
            this.IsWaitable = section.IsWaitable;
            this.MaximumSeats = section.MaximumSeats;
            this.Schedules = section.Schedules;
            this.SeatsLeft = section.SeatsLeft;
            this.SeatsWaiting = section.SeatsWaiting;
            this.Section = section.Section;
            this.SessionDesc = section.SessionDesc;
            this.StartDate = section.StartDate;
        }

        /// <summary>
        /// Gets or sets the academic term desc.
        /// </summary>
        /// <value>
        /// The academic term desc.
        /// </value>
        public string AcademicTermDesc { get; set; }

        /// <summary>
        /// Gets or sets the academic year.
        /// </summary>
        /// <value>
        /// The academic year.
        /// </value>
        public string AcademicYear { get; set; }

        /// <summary>
        /// Gets or sets the corequisistes.
        /// </summary>
        /// <value>
        /// The corequisistes.
        /// </value>
        public List<CorequisiteViewModel> Corequisistes { get; set; }

        /// <summary>
        /// Gets or sets the course materials link text to display.
        /// </summary>
        /// <value>
        /// The course materials link text to display.
        /// </value>
        public string? CourseMaterials { get; set; }

        /// <summary>
        /// Gets or sets the course materials link.
        /// </summary>
        /// <value>
        /// The course materials link.
        /// </value>
        public string? CourseMaterialsUrl { get; set; }

        /// <summary>
        /// Gets or sets the credit types.
        /// </summary>
        /// <value>
        /// The credit types.
        /// </value>
        public List<CreditTypeViewModel> CreditTypes { get; set; }

        /// <summary>
        /// Gets or sets the prerequisite condition.
        /// </summary>
        /// <value>The prerequisite condition.</value>
        public List<string> PrerequisiteConditionList { get; set; }

        /// <summary>
        /// Gets or sets the prerequisites.
        /// </summary>
        /// <value>
        /// The prerequisite.
        /// </value>
        public List<PrerequisiteViewModel> Prerequisites { get; set; }

        /// <summary>
        /// Gets or sets the fees.
        /// </summary>
        /// <value>
        /// The fees.
        /// </value>
        public List<SectionFeeViewModel> SectionFees { get; set; }
    }
}