// --------------------------------------------------------------------
// <copyright file="DeleteModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.FacultyAssistants
{
    /// <summary>
    /// DeleteModel
    /// </summary>
    public class DeleteModel
    {
        /// <summary>
        /// Gets or sets the assistant identifier.
        /// </summary>
        /// <value>
        /// The assistant identifier.
        /// </value>
        public int AssistantId { get; set; }

        /// <summary>
        /// Gets or sets the faculty assistant identifier.
        /// </summary>
        /// <value>
        /// The faculty assistant identifier.
        /// </value>
        public int FacultyAssistantId { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}