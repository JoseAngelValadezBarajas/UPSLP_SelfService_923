// --------------------------------------------------------------------
// <copyright file="StudentReportFilterModel.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.Schedule
{
    /// <summary>
    /// StudentReportFilterModel class.
    /// </summary>
    public class StudentReportFilterModel
    {
        /// <summary>
        /// Gets or sets the filter.
        /// </summary>
        /// <value>
        /// The filter.
        /// </value>
        public int Filter { get; set; }

        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the year term session.
        /// </summary>
        /// <value>
        /// The year term session.
        /// </value>
        public YearTermSessionModel YearTermSession { get; set; }
    }
}