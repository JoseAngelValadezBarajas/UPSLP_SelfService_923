// --------------------------------------------------------------------
// <copyright file="SettingHelper.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Models.Enum;
using Hedtech.PowerCampus.Core.DTO;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Net.Http.Headers;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Session;
using System;
using System.Collections.Generic;
using System.IO;

namespace SelfService.Helpers
{
    /// <summary>
    /// SettingHelper
    /// </summary>
    /// <seealso cref="ISettingHelper" />
    public class SettingHelper : ISettingHelper
    {
        #region Private Fields

        /// <summary>
        /// The application catalog service
        /// </summary>
        private readonly IAppCatalogService _appCatalogService;

        /// <summary>
        /// The cache
        /// </summary>
        private readonly IMemoryCache _cache;

        /// <summary>
        /// The HTTP context accessor
        /// </summary>
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// The Institution Setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<SettingHelper> _logger;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The serialization helper
        /// </summary>
        private readonly ISerializationHelper _serializationHelper;

        /// <summary>
        /// The web host environment
        /// </summary>
        private readonly IWebHostEnvironment _webHostEnvironment;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingHelper"/> class.
        /// </summary>
        /// <param name="cache">The cache.</param>
        /// <param name="appCatalogService">The application catalog service.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="webHostEnvironment">The web host environment.</param>
        /// <param name="logger">The logger.</param>
        public SettingHelper(
            IMemoryCache cache,
            IHttpContextAccessor httpContextAccessor,
            IAppCatalogService appCatalogService,
            IInstitutionSettingService institutionSettingService,
            IResourcesHelper resourcesHelper,
            ISerializationHelper serializationHelper,
            IWebHostEnvironment webHostEnvironment,
            IAppLogger<SettingHelper> logger) : base()
        {
            _cache = cache;
            _httpContextAccessor = httpContextAccessor;
            _appCatalogService = appCatalogService;
            _institutionSettingService = institutionSettingService;
            _resourcesHelper = resourcesHelper;
            _serializationHelper = serializationHelper;
            _webHostEnvironment = webHostEnvironment;

            _logger = logger;
        }

        /// <summary>
        /// Gets the application identifier.
        /// </summary>
        /// <returns></returns>
        public int GetApplicationId()
        {
            try
            {
                int applicationId = _cache.GetApplicationId() ?? 0;
                if (applicationId <= 0)
                {
                    applicationId = _appCatalogService.GetApplicationId(AppCatalogId.SelfService);

                    if (applicationId > 0)
                        _cache.SetApplicationId(applicationId);
                }
                return applicationId;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Gets the build information.
        /// </summary>
        /// <returns></returns>
        public BuildInformation GetBuildInfo()
        {
            try
            {
                if (!_cache.TryGetValue(Constants._buildInfoCache, out BuildInformation buildInformation))
                {
                    string buildInfoJson = _resourcesHelper.ReadJson(
                        Path.Combine(_webHostEnvironment.ContentRootPath, "App_Data"), "buildInfo");
                    buildInformation = _serializationHelper.ToObject<BuildInformation>(buildInfoJson);
                    _cache.SetBuildInfo(buildInformation);
                }
                return buildInformation;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Gets the language.
        /// </summary>
        /// <param name="account">The account.</param>
        /// <returns></returns>
        public string GetLanguage(Account account)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                string language = account?.Language ?? general.UICulture ?? string.Empty;
                if (string.IsNullOrEmpty(language.Trim()))
                {
                    IList<StringWithQualityHeaderValue> acceptedLanguages = _httpContextAccessor.HttpContext.Request.GetTypedHeaders().AcceptLanguage;
                    if (acceptedLanguages?.Count > 0)
                        language = acceptedLanguages[0].Value.Value;
                }

                if (string.IsNullOrEmpty(language.Trim()))
                    language = "en";

                return language;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingHelper).FullName, exception.Message, exception);
                throw;
            }
        }
    }
}