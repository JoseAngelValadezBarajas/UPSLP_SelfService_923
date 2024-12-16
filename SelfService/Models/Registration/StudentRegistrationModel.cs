// --------------------------------------------------------------------
// <copyright file="StudentRegistrationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// StudentRegistrationModel class
    /// </summary>
    public class StudentRegistrationModel
    {
        /// <summary>
        /// Gets or sets the sections.
        /// </summary>
        /// <value>
        /// The sections.
        /// </value>
        public Dictionary<int, string> Sections { get; set; }

        /// <summary>
        /// Gets or sets the year term.
        /// </summary>
        /// <value>
        /// The year term.
        /// </value>
        public string YearTerm { get; set; }
    }
}