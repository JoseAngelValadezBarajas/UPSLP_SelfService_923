// --------------------------------------------------------------------
// <copyright file="ActivityModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Forms
{
    /// <summary>
    /// ActivityModel
    /// </summary>
    public class ActivityModel
    {
        /// <summary>
        /// Gets or sets the form identifier.
        /// </summary>
        /// <value>
        /// The form identifier.
        /// </value>
        public int FormId { get; set; }

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
        /// Gets or sets a value indicating whether this instance is application form.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is application form; otherwise, <c>false</c>.
        /// </value>
        public bool IsApplicationForm { get; set; }

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