// --------------------------------------------------------------------
// <copyright file="SaveCopyModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.GradeMappings
{
    /// <summary>
    /// SaveCopyModel
    /// </summary>
    public class SaveCopyModel
    {
        /// <summary>
        /// Gets or sets the destination section identifier.
        /// </summary>
        /// <value>
        /// The destination section identifier.
        /// </value>
        public int DestinationSectionId { get; set; }

        /// <summary>
        /// Gets or sets the source section identifier.
        /// </summary>
        /// <value>
        /// The source section identifier.
        /// </value>
        public int SourceSectionId { get; set; }
    }
}