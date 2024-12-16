// --------------------------------------------------------------------
// <copyright file="WhatIfPlanModel.cs" company="Ellucian">
//     Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.WhatIf
{
    /// <summary>
    /// WhatIfPlanHeaderViewModel
    /// </summary>
    public class WhatIfPlanHeaderViewModel
    {
        /// <summary>
        /// Gets or sets the credits completed.
        /// </summary>
        /// <value>
        /// The credits completed.
        /// </value>
        public string CreditsCompleted { get; set; }

        /// <summary>
        /// Gets or sets the credits completed value.
        /// </summary>
        /// <value>
        /// The credits completed value.
        /// </value>
        public decimal CreditsCompletedValue { get; set; }

        /// <summary>
        /// Gets or sets the curriculum code.
        /// </summary>
        /// <value>
        /// The curriculum code.
        /// </value>
        public string CurriculumCode { get; set; }

        /// <summary>
        /// Gets or sets the curriculum desc.
        /// </summary>
        /// <value>
        /// The curriculum desc.
        /// </value>
        public string CurriculumDesc { get; set; }

        /// <summary>
        /// Gets or sets the degree code.
        /// </summary>
        /// <value>
        /// The degree code.
        /// </value>
        public string DegreeCode { get; set; }

        /// <summary>
        /// Gets or sets the degree desc.
        /// </summary>
        /// <value>
        /// The degree desc.
        /// </value>
        public string DegreeDesc { get; set; }

        /// <summary>
        /// Gets or sets the program code.
        /// </summary>
        /// <value>
        /// The program code.
        /// </value>
        public string ProgramCode { get; set; }

        /// <summary>
        /// Gets or sets the program desc.
        /// </summary>
        /// <value>
        /// The program desc.
        /// </value>
        public string ProgramDesc { get; set; }

        /// <summary>
        /// Gets or sets the term code.
        /// </summary>
        /// <value>
        /// The term code.
        /// </value>
        public string TermCode { get; set; }

        /// <summary>
        /// Gets or sets the term desc.
        /// </summary>
        /// <value>
        /// The term desc.
        /// </value>
        public string TermDesc { get; set; }

        /// <summary>
        /// Gets or sets the term period identifier.
        /// </summary>
        /// <value>
        /// The term period identifier.
        /// </value>
        public int TermPeriodId { get; set; }

        /// <summary>
        /// Gets or sets the year.
        /// </summary>
        /// <value>
        /// The year.
        /// </value>
        public string Year { get; set; }
    }

    /// <summary>
    /// WhatIfPlanModel
    /// </summary>
    public class WhatIfPlanModel
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

        /// <summary>
        /// Gets or sets the term period identifier.
        /// </summary>
        /// <value>
        /// The term period identifier.
        /// </value>
        public int TermPeriodId { get; set; }
    }
}