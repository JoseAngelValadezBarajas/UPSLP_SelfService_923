// --------------------------------------------------------------------
// <copyright file="DegreeModel.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.Degrees
{
    /// <summary>
    /// DegreeModel class
    /// </summary>
    public class DegreeModel
    {
        /// <summary>
        /// Gets or sets the program.
        /// </summary>
        /// <value>
        /// The program.
        /// </value>
        public string Program { get; set; }

        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the term period identifier.
        /// </summary>
        /// <value>
        /// The term period identifier.
        /// </value>
        public int TermPeriodId { get; set; }
    }
}