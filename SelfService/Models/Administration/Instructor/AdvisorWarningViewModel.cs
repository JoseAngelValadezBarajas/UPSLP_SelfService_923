// --------------------------------------------------------------------
// <copyright file="AdvisorWarningViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using SelfService.Models.Administration.Instructor;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Mappers
{
    /// <summary>
    /// AdvisorWarningViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Administration.Instructor.AdvisorWarningModel" />
    public class AdvisorWarningViewModel : AdvisorWarningModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AdvisorWarningViewModel"/> class.
        /// </summary>
        public AdvisorWarningViewModel() => this.CreditTypes = new List<ListCreditTypeOptionViewModel>();

        /// <summary>
        /// Gets or sets the credit types.
        /// </summary>
        /// <value>
        /// The credit types.
        /// </value>
        public List<ListCreditTypeOptionViewModel> CreditTypes { get; set; }

        /// <summary>
        /// Gets or sets the violations.
        /// </summary>
        /// <value>
        /// The violations.
        /// </value>
        public List<InstitutionSettingFilter> Violations { get; set; }
    }

    /// <summary>
    /// ListCreditTypeOptionViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Shared.ListOptionViewModel" />
    public class ListCreditTypeOptionViewModel : ListOptionViewModel
    {
        /// <summary>
        /// Gets or sets the grades.
        /// </summary>
        /// <value>
        /// The grades.
        /// </value>
        public List<ListOptionViewModel> Grades { get; set; }
    }
}