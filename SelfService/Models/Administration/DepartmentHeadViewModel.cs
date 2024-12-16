// --------------------------------------------------------------------
// <copyright file="DeparmentHeadViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Administration
{
    /// <summary>
    /// DepartmentHeadViewModel class
    /// </summary>
    public class DepartmentHeadViewModel
    {
        /// <summary>
        /// Gets or sets the color first letter.
        /// </summary>
        /// <value>
        /// The color first letter.
        /// </value>
        public int ColorFirstLetter { get; set; }

        /// <summary>
        /// Gets or sets the department desc.
        /// </summary>
        /// <value>
        /// The department desc.
        /// </value>
        public string DepartmentDesc { get; set; }

        /// <summary>
        /// Gets or sets the department head identifier.
        /// </summary>
        /// <value>
        /// The department head identifier.
        /// </value>
        public int DepartmentHeadId { get; set; }

        /// <summary>
        /// Gets or sets the department identifier.
        /// </summary>
        /// <value>
        /// The department identifier.
        /// </value>
        public int DepartmentId { get; set; }

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