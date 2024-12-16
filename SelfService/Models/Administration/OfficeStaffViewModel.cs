// --------------------------------------------------------------------
// <copyright file="OfficeStaffViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Administration
{
    public class OfficeStaffViewModel
    {
        /// <summary>
        /// Gets or sets the color first letter.
        /// </summary>
        /// <value>
        /// The color first letter.
        /// </value>
        public int ColorFirstLetter { get; set; }

        /// <summary>
        /// Gets or sets the first letter.
        /// </summary>
        /// <value>
        /// The first letter.
        /// </value>
        public string FirstLetter { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the office identifier.
        /// </summary>
        /// <value>
        /// The office identifier.
        /// </value>
        public int OfficeId { get; set; }

        /// <summary>
        /// Gets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; internal set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }
    }
}