// --------------------------------------------------------------------
// <copyright file="AcademicPlanModel.cs" company="Ellucian">
//     Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;
using SelfService.Models.Generic;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// AcademicPlanModel class
    /// </summary>
    public class AcademicPlanModel : YearTermModel
    {
        /// <summary>
        /// Gets or sets the curriculum.
        /// </summary>
        /// <value>
        /// The curriculum.
        /// </value>
        public string Curriculum { get; set; }

        /// <summary>
        /// Gets or sets the degree.
        /// </summary>
        /// <value>
        /// The degree.
        /// </value>
        public string Degree { get; set; }

        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the program.
        /// </summary>
        /// <value>
        /// The program.
        /// </value>
        public string Program { get; set; }
    }
}