// --------------------------------------------------------------------
// <copyright file="AlertReportViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Grades
{
    /// <summary>
    /// AlertReportViewModel
    /// </summary>
    public class AlertReportViewModel : SectionCourse
    {
        /// <summary>
        /// Gets the avatar.
        /// </summary>
        /// <value>
        /// The avatar.
        /// </value>
        public AvatarViewModel Avatar { get; internal set; }

        /// <summary>
        /// Gets or sets the credit type desc.
        /// </summary>
        /// <value>
        /// The credit type desc.
        /// </value>
        public string CreditTypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the date edited.
        /// </summary>
        /// <value>
        /// The date edited.
        /// </value>
        public string DateEdited { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the session desc.
        /// </summary>
        /// <value>
        /// The session desc.
        /// </value>
        public string SessionDesc { get; set; }

        /// <summary>
        /// Gets or sets the violation category desc.
        /// </summary>
        /// <value>
        /// The violation category desc.
        /// </value>
        public string ViolationCategoryDesc { get; set; }

        /// <summary>
        /// Gets or sets the violation date.
        /// </summary>
        /// <value>
        /// The violation date.
        /// </value>
        public string ViolationDate { get; set; }

        /// <summary>
        /// Gets or sets the violation desc.
        /// </summary>
        /// <value>
        /// The violation desc.
        /// </value>
        public string ViolationDesc { get; set; }
    }

    /// <summary>
    /// AlertsReportViewModel
    /// </summary>
    public class AlertsReportViewModel
    {
        /// <summary>
        /// Gets or sets the academic session.
        /// </summary>
        /// <value>
        /// The academic session.
        /// </value>
        public string AcademicSession { get; set; }

        /// <summary>
        /// Gets or sets the alerts.
        /// </summary>
        /// <value>
        /// The alerts.
        /// </value>
        public List<AlertReportViewModel> List { get; set; }
    }
}