// --------------------------------------------------------------------
// <copyright file="StudentScheduleModel.cs" company="Ellucian">
//     Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;
using SelfService.Models.Schedule;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// StudentScheduleModel class
    /// </summary>
    public class StudentScheduleModel
    {
        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the year term session.
        /// </summary>
        /// <value>
        /// The year term session.
        /// </value>
        public YearTermSessionModel YearTermSession { get; set; }
    }
}