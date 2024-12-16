// --------------------------------------------------------------------
// <copyright file="SiteConfigurationHelper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Enum;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;

namespace SelfService.Helpers
{
    /// <summary>
    /// SiteConfigurationHelper
    /// </summary>
    /// <seealso cref="ISiteConfigurationHelper" />
    public class SiteConfigurationHelper : ISiteConfigurationHelper
    {
        #region Private Fields

        /// <summary>
        /// The authentication settings file path
        /// </summary>
        private readonly string _authenticationSettingsFilePath;

        /// <summary>
        /// The connection settings file path
        /// </summary>
        private readonly string _connectionSettingsFilePath;

        /// <summary>
        /// The connection strings
        /// </summary>
        private readonly ConnectionStrings _connectionStrings;

        /// <summary>
        /// The errors
        /// </summary>
        private readonly List<SiteConfigurationError> _errors;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<SiteConfigurationHelper> _logger;

        /// <summary>
        /// The is configuration missing
        /// </summary>
        private bool _isConfigurationMissing;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="SiteConfigurationHelper"/> class.
        /// </summary>
        /// <param name="connectionStrings">The connection strings.</param>
        /// <param name="webHostEnvironment">The web host environment.</param>
        /// <param name="logger">The logger.</param>
        public SiteConfigurationHelper(
            IOptions<ConnectionStrings> connectionStrings,
            IWebHostEnvironment webHostEnvironment,
            IAppLogger<SiteConfigurationHelper> logger) : base()
        {
            _connectionStrings = connectionStrings.Value;

            _logger = logger;

            string fileEnvironment = webHostEnvironment.IsDevelopment() ?
                $".{webHostEnvironment.EnvironmentName}" : string.Empty;
            _authenticationSettingsFilePath = Path.Combine(webHostEnvironment.ContentRootPath,
                $@"Config\AuthenticationSettings{fileEnvironment}.json");
            _connectionSettingsFilePath = Path.Combine(webHostEnvironment.ContentRootPath,
                $@"Config\ConnectionSettings{fileEnvironment}.json");

            _errors = new();
            _isConfigurationMissing = true;
        }

        /// <summary>
        /// Gets a value indicating whether this instance is configuration missing.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is configuration missing; otherwise, <c>false</c>.
        /// </value>
        public bool IsConfigurationMissing
            => _isConfigurationMissing ? ValidateSiteConfiguration() : _isConfigurationMissing;

        /// <summary>
        /// Restarts this instance.
        /// </summary>
        public void Restart() => _isConfigurationMissing = true;

        #region Private Methods

        /// <summary>
        /// Validates the connection strings.
        /// </summary>
        private void ValidateConnectionStrings()
        {
            try
            {
                if (_connectionStrings is null)
                    _errors.Add(SiteConfigurationError.ConnectionSettingsFileMissing);
                if (string.IsNullOrEmpty(_connectionStrings.PowerCampusDbContext.Trim()))
                    _errors.Add(SiteConfigurationError.ConnectionSettingPowerCampusMissing);
                if (string.IsNullOrEmpty(_connectionStrings.PowerCampusAuthDbContext.Trim()))
                    _errors.Add(SiteConfigurationError.ConnectionSettingsPowerCampusAuthMissing);

                try
                {
                    using SqlConnection conn = new(_connectionStrings.PowerCampusDbContext);
                    conn.Open(); // throws if invalid
                }
                catch (Exception)
                {
                    _errors.Add(SiteConfigurationError.ConnectionSettingPowerCampusInvalid);
                }

                try
                {
                    using SqlConnection conn = new(_connectionStrings.PowerCampusAuthDbContext);
                    conn.Open(); // throws if invalid
                }
                catch (Exception)
                {
                    _errors.Add(SiteConfigurationError.ConnectionSettingsPowerCampusAuthInvalid);
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SiteConfigurationHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Validates the required files.
        /// </summary>
        private void ValidateRequiredFiles()
        {
            try
            {
                if (!File.Exists(_authenticationSettingsFilePath))
                    _errors.Add(SiteConfigurationError.AuthenticationSettingsFileMissing);

                if (!File.Exists(_connectionSettingsFilePath))
                    _errors.Add(SiteConfigurationError.ConnectionSettingsFileMissing);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SiteConfigurationHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Validates the site configuration.
        /// </summary>
        /// <returns></returns>
        private bool ValidateSiteConfiguration()
        {
            try
            {
                _errors.Clear();

                ValidateRequiredFiles();
                ValidateConnectionStrings();

                _isConfigurationMissing = _errors.Count > 0;

                if (_isConfigurationMissing)
                {
                    foreach (SiteConfigurationError item in _errors)
                    {
                        switch (item)
                        {
                            case SiteConfigurationError.AuthenticationSettingsFileMissing:
                                _logger.LogError(Constants._product, nameof(SiteConfigurationHelper),
                                    "AuthenticationSettings.json can not be found.");
                                break;

                            case SiteConfigurationError.ConnectionSettingsFileMissing:
                                _logger.LogError(Constants._product, nameof(SiteConfigurationHelper),
                                    "ConnectionSettings.json can not be found.");
                                break;

                            case SiteConfigurationError.ConnectionSettingPowerCampusMissing:
                                _logger.LogError(Constants._product, nameof(SiteConfigurationHelper),
                                    "Connection string for PowerCampus can not be found");
                                break;

                            case SiteConfigurationError.ConnectionSettingsPowerCampusAuthMissing:
                                _logger.LogError(Constants._product, nameof(SiteConfigurationHelper),
                                    "Connection string for PowerCampus.Auth can not be found");
                                break;

                            case SiteConfigurationError.ConnectionSettingPowerCampusInvalid:
                                _logger.LogError(Constants._product, nameof(SiteConfigurationHelper),
                                    "Connection string for PowerCampus is not configured correctly.");
                                break;

                            case SiteConfigurationError.ConnectionSettingsPowerCampusAuthInvalid:
                                _logger.LogError(Constants._product, nameof(SiteConfigurationHelper),
                                    "Connection string for PowerCampus.Auth is not configured correctly.");
                                break;
                        }
                    }
                }

                return _isConfigurationMissing;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SiteConfigurationHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        #endregion Private Methods
    }
}