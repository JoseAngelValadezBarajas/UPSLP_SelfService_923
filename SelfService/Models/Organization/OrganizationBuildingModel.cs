// --------------------------------------------------------------------
// <copyright file="OrganizationBuildingModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Organization
{
    /// <summary>
    /// OrganizationBuildingModel class
    /// </summary>
    public class OrganizationBuildingModel
    {
        /// <summary>
        /// Gets or sets the group.
        /// </summary>
        /// <value>
        /// The group.
        /// </value>
        public string Group { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the step.
        /// </summary>
        /// <value>
        /// The step.
        /// </value>
        public string Step { get; set; }

        /// <summary>
        /// Gets or sets the target identifier.
        /// </summary>
        /// <value>
        /// The target identifier.
        /// </value>
        public string TargetId { get; set; }
    }
}