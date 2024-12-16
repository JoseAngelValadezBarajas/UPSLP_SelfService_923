// --------------------------------------------------------------------
// <copyright file="SiteConfigurationHelper.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Helpers.Interfaces
{
    /// <summary>
    /// ISiteConfigurationHelper
    /// </summary>
    public interface ISiteConfigurationHelper
    {
        /// <summary>
        /// Gets a value indicating whether this instance is configuration missing.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is configuration missing; otherwise, <c>false</c>.
        /// </value>
        bool IsConfigurationMissing { get; }

        /// <summary>
        /// Restarts this instance.
        /// </summary>
        void Restart();
    }
}