// --------------------------------------------------------------------
// <copyright file="SectionCommentModel.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionCommentModel class
    /// </summary>
    public class SectionCommentModel
    {
        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}