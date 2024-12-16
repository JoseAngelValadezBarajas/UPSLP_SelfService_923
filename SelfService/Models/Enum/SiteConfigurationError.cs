// --------------------------------------------------------------------
// <copyright file="SiteConfigurationError.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Enum
{
    /// <summary>
    /// Provides the list of possible misconfiguration issues.
    /// </summary>
    public enum SiteConfigurationError
    {
        /// <summary>
        /// The authentication settings file missing
        /// </summary>
        AuthenticationSettingsFileMissing,

        /// <summary>
        /// The connection settings file missing
        /// </summary>
        ConnectionSettingsFileMissing,

        /// <summary>
        /// The connection setting power campus missing
        /// </summary>
        ConnectionSettingPowerCampusMissing,

        /// <summary>
        /// The connection settings power campus authentication missing
        /// </summary>
        ConnectionSettingsPowerCampusAuthMissing,

        /// <summary>
        /// The connection setting power campus invalid
        /// </summary>
        ConnectionSettingPowerCampusInvalid,

        /// <summary>
        /// The connection settings power campus authentication invalid
        /// </summary>
        ConnectionSettingsPowerCampusAuthInvalid
    }
}