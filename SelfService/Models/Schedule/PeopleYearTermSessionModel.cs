// --------------------------------------------------------------------
// <copyright file="PeopleYearTermSessionModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Schedule
{
    /// <summary>
    /// PeopleYearTermSessionModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Schedule.YearTermSessionModel" />
    public class PeopleYearTermSessionModel : YearTermSessionModel
    {
        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }
    }
}