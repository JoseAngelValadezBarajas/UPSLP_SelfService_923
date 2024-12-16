// --------------------------------------------------------------------
// <copyright file="CoursesController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Navigation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Course;
using SelfService.Models.Resources;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Courses route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class CoursesController : BaseEndpointController
    {
        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<CoursesController> _logger;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The search service
        /// </summary>
        private readonly ISearchService _searchService;

        /// <summary>
        /// The section service
        /// </summary>
        private readonly ISectionService _sectionService;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The setting service
        /// </summary>
        private readonly ISettingService _settingService;

        /// <summary>
        /// The site map service
        /// </summary>
        private readonly ISiteMapService _siteMapService;

        /// <summary>
        /// Initializes a new instance of the <see cref="CoursesController"/> class.
        /// </summary>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="searchService">The search service.</param>
        /// <param name="sectionService">The section service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="siteMapService">The site map service.</param>
        /// <param name="logger">The logger.</param>
        public CoursesController(
            IInstitutionSettingService institutionSettingService,
            IResourcesHelper resourcesHelper,
            ISearchService searchService,
            ISectionService sectionService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            ISettingService settingService,
            ISiteMapService siteMapService,
            IAppLogger<CoursesController> logger)
            : base(serializationHelper)
        {
            _institutionSettingService = institutionSettingService;
            _resourcesHelper = resourcesHelper;
            _searchService = searchService;
            _sectionService = sectionService;
            _settingHelper = settingHelper;
            _settingService = settingService;
            _siteMapService = siteMapService;

            _logger = logger;
        }

        /// <summary>
        /// Indexes the specified course code model.
        /// </summary>
        /// <param name="searchByCodeModel">The search by code model.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("Courses")]
        [AllowAnonymous]
        public JsonResult Index([FromBody] SearchByCodeModel searchByCodeModel)
        {
            try
            {
                string courseCode = searchByCodeModel.CourseCode;
                int? startIndex = searchByCodeModel.StartIndex;
                int? length = searchByCodeModel.Length;

                int startIndexWildCard = 0;
                int lengthWildCard = 0;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                if (string.IsNullOrEmpty(courseCode))
                    return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
                if (startIndex != null)
                    startIndexWildCard = (int)startIndex;
                if (length != null)
                    lengthWildCard = (int)length;
                string wildcard = _settingService.GetWildcard();
                if (courseCode.Contains(wildcard))
                {
                    CourseCatalogList courseCatalog = _searchService.GetCourseCatalogWildCard(courseCode.Replace(wildcard[0], '*'), startIndexWildCard, lengthWildCard);
                    return Json(SerializationHelper.ToJsonResult(courseCatalog.ToViewModel()));
                }
                CourseCatalog course = _searchService.GetCourseCatalog(courseCode);
                string language = _settingHelper.GetLanguage(Account);
                DegReqsResources degReqsResources = _resourcesHelper.GetServerResourceType<DegReqsResources>(language, "DegReqs", ValidationHelper.IsValidResource);
                if (course != null)
                {
                    List<SiteMapOptionNameFormat> nameFormats = _siteMapService.GetNameFormats();
                    return Json(SerializationHelper.ToJsonResult(course.ToViewModel(degReqsResources,
                    FormatHelper.GetNameFormat("DegreeRequirementsId", nameFormats), general, FormatHelper.GetShowMiddleNameInitial("DegreeRequirementsId", nameFormats))));
                }

                return Json(SerializationHelper.ToJsonResult(null, null, 0, true));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CoursesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the courses that match the search parameters
        /// </summary>
        /// <param name="searchModel">The search model.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public JsonResult Search([FromBody] SearchModel searchModel)
        {
            try
            {
                CourseCatalogSearch courseCatalogSearch = searchModel.CourseCatalogSearch;
                int? startIndex = searchModel.StartIndex;
                int? length = searchModel.Length;

                int startIndexWildCard = 0;
                int lengthWildCard = 0;
                if (courseCatalogSearch == null)
                    return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
                if (startIndex != null)
                    startIndexWildCard = (int)startIndex;
                if (length != null)
                    lengthWildCard = (int)length;
                CourseCatalogList courseCatalog = _searchService.GetCourseCatalogWildCard(courseCatalogSearch, startIndexWildCard, lengthWildCard);
                return Json(SerializationHelper.ToJsonResult(courseCatalog.ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CoursesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the options to search course catalog
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Courses/Search/Options")]
        public JsonResult SearchOptions()
        {
            try
            {
                CourseCatalogSearchOption options = _searchService.GetCatalogSearchOptions();
                return Json(SerializationHelper.ToJsonResult(options.ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CoursesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}