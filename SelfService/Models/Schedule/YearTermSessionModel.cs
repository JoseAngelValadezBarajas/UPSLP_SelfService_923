// --------------------------------------------------------------------
// <copyright file="YearTermSessionModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Schedule
{
    /// <summary>
    /// YearTermSessionModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Schedule.YearTermModel" />
    public class YearTermSessionModel : YearTermModel
    {
        /// <summary>
        /// Gets or sets the session.
        /// </summary>
        /// <value>
        /// The session.
        /// </value>
        public string Session { get; set; }
    }
}