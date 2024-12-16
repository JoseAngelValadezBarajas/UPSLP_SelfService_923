// --------------------------------------------------------------------
// <copyright file="DossierSetupModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using System.Collections.Generic;

namespace SelfService.Models.Dossier
{
    /// <summary>
    /// DossierSetupModel class
    /// </summary>
    public class DossierSetupModel
    {
        /// <summary>
        /// Gets or sets the adds.
        /// </summary>
        /// <value>
        /// The adds.
        /// </value>
        public List<DossierSetup> Adds { get; set; }

        /// <summary>
        /// Gets or sets the deletes.
        /// </summary>
        /// <value>
        /// The deletes.
        /// </value>
        public List<DossierSetup> Deletes { get; set; }

        /// <summary>
        /// Gets or sets the updates.
        /// </summary>
        /// <value>
        /// The updates.
        /// </value>
        public List<DossierSetup> Updates { get; set; }
    }
}