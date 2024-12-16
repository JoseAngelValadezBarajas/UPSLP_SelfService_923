// --------------------------------------------------------------------
// <copyright file="PeopleSearchViewModel.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Pagination;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Students
{
    /// <summary>
    /// Filter
    /// </summary>
    public enum Filter
    {
        /// <summary>
        /// The general
        /// </summary>
        General = 1,

        /// <summary>
        /// The department head
        /// </summary>
        DepartmentHead = 2
    }

    /// <summary>
    /// PeopleSearchesViewModel
    /// </summary>
    public class PeopleSearchesViewModel
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
        public List<AvatarViewModel> PeopleSearchList { get; set; }
    }

    /// <summary>
    /// PeopleSearchModel
    /// </summary>
    public class PeopleSearchModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets the filter.
        /// </summary>
        /// <value>
        /// The filter.
        /// </value>
        public Filter Filter { get; set; }

        /// <summary>
        /// Gets or sets the last name.
        /// </summary>
        /// <value>
        /// The last name.
        /// </value>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the last name prefix.
        /// </summary>
        /// <value>
        /// The last name prefix.
        /// </value>
        public string LastNamePrefix { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [middle name].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [middle name]; otherwise, <c>false</c>.
        /// </value>
        public string MiddleName { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }
    }
}