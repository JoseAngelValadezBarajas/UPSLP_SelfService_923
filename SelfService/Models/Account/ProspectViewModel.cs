// --------------------------------------------------------------------
// <copyright file="ProspectViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;

namespace SelfService.Models.Account
{
    /// <summary>
    /// ProspectViewModel
    /// </summary>
    public class ConEdProspectViewModel : ConEdProspect
    {
        /// <summary>
        /// Gets or sets the birth date formatted.
        /// </summary>
        /// <value>
        /// The birth date formatted.
        /// </value>
        public string BirthDateFormatted { get; set; }
    }
}