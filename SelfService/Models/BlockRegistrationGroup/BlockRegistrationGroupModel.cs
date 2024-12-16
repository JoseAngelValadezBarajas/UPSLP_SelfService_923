// --------------------------------------------------------------------
// <copyright file="BlockRegistrationGroupModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Administration
{
    /// <summary>
    /// BlockRegistrationGroupModel class
    /// </summary>
    public class BlockRegistrationGroupModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [allow changes].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [allow changes]; otherwise, <c>false</c>.
        /// </value>
        public bool AllowChanges { get; set; }

        /// <summary>
        /// Gets or sets the block registration group identifier.
        /// </summary>
        /// <value>
        /// The block registration group identifier.
        /// </value>
        public int BlockRegistrationGroupId { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the sections to add.
        /// </summary>
        /// <value>
        /// The sections to add.
        /// </value>
        public List<int> SectionsToAdd { get; set; }

        /// <summary>
        /// Gets or sets the sections to remove.
        /// </summary>
        /// <value>
        /// The sections to remove.
        /// </value>
        public List<int> SectionsToRemove { get; set; }

        /// <summary>
        /// Gets or sets the term period identifier.
        /// </summary>
        /// <value>
        /// The term period identifier.
        /// </value>
        public int TermPeriodId { get; set; }
    }
}