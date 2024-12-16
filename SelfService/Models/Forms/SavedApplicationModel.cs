// --------------------------------------------------------------------
// <copyright file="SavedApplicationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Recruitment;

namespace SelfService.Models.Forms
{
    /// <summary>
    /// SavedApplicationModel
    /// </summary>
    public class SavedApplicationModel
    {
        /// <summary>
        /// Gets or sets the components.
        /// </summary>
        /// <value>
        /// The components.
        /// </value>
        public ApplicationFormViewModel Components { get; set; }

        /// <summary>
        /// Gets or sets the saved application.
        /// </summary>
        /// <value>
        /// The saved application.
        /// </value>
        public SavedApplication SavedApplication { get; set; }
    }
}