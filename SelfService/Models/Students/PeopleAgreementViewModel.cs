// --------------------------------------------------------------------
// <copyright file="PeopleAgreementViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Students
{
    /// <summary>
    /// PeopleAgreementDetailViewModel
    /// </summary>
    public class PeopleAgreementDetailViewModel
    {
        /// <summary>
        /// Gets or sets the acceptance.
        /// </summary>
        /// <value>
        /// The acceptance.
        /// </value>
        public string Acceptance { get; set; }

        /// <summary>
        /// Gets or sets the content.
        /// </summary>
        /// <value>
        /// The content.
        /// </value>
        public string Content { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }
    }

    /// <summary>
    /// PeopleAgreementsViewModel
    /// </summary>
    public class PeopleAgreementsViewModel
    {
        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }

        /// <summary>
        /// Gets or sets the people agreement list.
        /// </summary>
        /// <value>
        /// The people agreement list.
        /// </value>
        public List<PeopleAgreementViewModel> PeopleAgreementList { get; set; }
    }

    /// <summary>
    /// PeopleAgreementViewModel
    /// </summary>
    public class PeopleAgreementViewModel
    {
        /// <summary>
        /// Gets or sets the academic term.
        /// </summary>
        /// <value>
        /// The academic term.
        /// </value>
        public string AcademicTerm { get; set; }

        /// <summary>
        /// Gets or sets the academic year.
        /// </summary>
        /// <value>
        /// The academic year.
        /// </value>
        public string AcademicYear { get; set; }

        /// <summary>
        /// Gets or sets the create datetime.
        /// </summary>
        /// <value>
        /// The create datetime.
        /// </value>
        public string CreateDatetime { get; set; }

        /// <summary>
        /// Gets or sets the people agreement identifier.
        /// </summary>
        /// <value>
        /// The people agreement identifier.
        /// </value>
        public int PeopleAgreementId { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }
    }
}