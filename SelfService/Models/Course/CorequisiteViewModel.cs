// --------------------------------------------------------------------
// <copyright file="CorequisiteViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Course
{
    /// <summary>
    /// CorequisiteViewModel
    /// </summary>
    public class CorequisiteViewModel
    {
        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>The event identifier.</value>
        public string EventId { get; set; }

        /// <summary>
        /// Gets or sets the type of the sub.
        /// </summary>
        /// <value>The type of the sub.</value>
        public string SubType { get; set; }

        /// <summary>
        /// Gets or sets the sub type description.
        /// </summary>
        /// <value>The sub type description.</value>
        public string SubTypeDescription { get; set; }
    }
}