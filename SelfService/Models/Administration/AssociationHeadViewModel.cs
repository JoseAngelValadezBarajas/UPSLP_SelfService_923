// --------------------------------------------------------------------
// <copyright file="AssociationHeadViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Administration
{
    /// <summary>
    /// AssociationHeadViewModel
    /// </summary>
    public class AssociationHeadViewModel
    {
        /// <summary>
        /// Gets or sets the association desc.
        /// </summary>
        /// <value>
        /// The association desc.
        /// </value>
        public string AssociationDesc { get; set; }

        /// <summary>
        /// Gets or sets the association head identifier.
        /// </summary>
        /// <value>
        /// The association head identifier.
        /// </value>
        public int AssociationHeadId { get; set; }

        /// <summary>
        /// Gets or sets the association identifier.
        /// </summary>
        /// <value>
        /// The association identifier.
        /// </value>
        public int AssociationId { get; set; }

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
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }
    }
}