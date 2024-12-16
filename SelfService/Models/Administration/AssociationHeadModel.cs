// --------------------------------------------------------------------
// <copyright file="AssociationHeadModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Administration
{
    /// <summary>
    /// AssociationHeadModel class
    /// </summary>
    public class AssociationHeadModel
    {
        /// <summary>
        /// Gets or sets the association identifier.
        /// </summary>
        /// <value>
        /// The association identifier.
        /// </value>
        public int AssociationId { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }
    }
}