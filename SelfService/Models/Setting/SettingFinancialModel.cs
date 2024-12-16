// --------------------------------------------------------------------
// <copyright file="SettingFinancialModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using System.Collections.Generic;

namespace SelfService.Models.Setting
{
    /// <summary>
    /// SettingFinancialModel class
    /// </summary>
    public class SettingFinancialModel
    {
        /// <summary>
        /// Gets or sets the financial.
        /// </summary>
        /// <value>
        /// The financial.
        /// </value>
        public InstitutionSettings.Financial Financial { get; set; }

        /// <summary>
        /// Gets or sets the payment periods.
        /// </summary>
        /// <value>
        /// The payment periods.
        /// </value>
        public List<PaymentPeriod> PaymentPeriods { get; set; }
    }
}