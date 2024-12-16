// --------------------------------------------------------------------
// <copyright file="DegreeModel.cs" company="Ellucian">
//     Copyright 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.Programs
{
    /// <summary>
    /// ProgramModel
    /// </summary>
    public class ProgramModel
    {
        /// <summary>
        /// Gets or sets the term period identifier.
        /// </summary>
        /// <value>
        /// The term period identifier.
        /// </value>
        public int TermPeriodId { get; set; }

        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }
    }
}
