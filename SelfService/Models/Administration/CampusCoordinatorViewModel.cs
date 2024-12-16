// --------------------------------------------------------------------
// <copyright file="CampusCoordinatorViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Administration
{
    /// <summary>
    /// CampusCoordinatorViewModel
    /// </summary>
    public class CampusCoordinatorViewModel
    {
        /// <summary>
        /// Gets or sets the campus coordinator identifier.
        /// </summary>
        /// <value>
        /// The campus coordinator identifier.
        /// </value>
        public int CampusCoordinatorId { get; set; }

        /// <summary>
        /// Gets or sets the name of the campus.
        /// </summary>
        /// <value>
        /// The name of the campus.
        /// </value>
        public string CampusName { get; set; }

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
        /// Gets or sets the organization identifier.
        /// </summary>
        /// <value>
        /// The organization identifier.
        /// </value>
        public int OrganizationId { get; set; }

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