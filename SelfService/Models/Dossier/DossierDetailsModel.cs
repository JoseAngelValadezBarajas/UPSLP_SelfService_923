// --------------------------------------------------------------------
// <copyright file="DossierDetailsModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;

namespace SelfService.Models.Dossier
{
    /// <summary>
    /// DossierDetailsModel
    /// </summary>
    public class DossierDetailsModel
    {
        /// <summary>
        /// Gets or sets the type of the dossier.
        /// </summary>
        /// <value>
        /// The type of the dossier.
        /// </value>
        public DossierType DossierType { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }
    }
}