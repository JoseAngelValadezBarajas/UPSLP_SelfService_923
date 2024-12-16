// --------------------------------------------------------------------
// <copyright file="CodeTablesController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /CodeTables route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class CodeTablesController : BaseEndpointController
    {
        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The form service
        /// </summary>
        private readonly IFormService _formService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<CodeTablesController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="CodeTablesController"/> class.
        /// </summary>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="formService">The form service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public CodeTablesController(
            ICodeTableService codeTableService,
            IFormService formService,
            ISerializationHelper serializationHelper,
            IAppLogger<CodeTablesController> logger)
            : base(serializationHelper)
        {
            _codeTableService = codeTableService;
            _formService = formService;

            _logger = logger;
        }

        /// <summary>
        /// Gets Associations
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("CodeTables/Association")]
        public JsonResult Association()
        {
            try
            {
                List<CodeTable> organizations = _codeTableService.GetByName(CodeTableName.Association, true);
                return Json(SerializationHelper.ToJsonResult(organizations.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CodeTablesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Campuses this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("CodeTables/Campuses")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupCampusCoordinator
         }})]
        public JsonResult Campuses()
        {
            try
            {
                List<CodeTable> organizations = _codeTableService.GetCampuses();
                return Json(SerializationHelper.ToJsonResult(organizations.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CodeTablesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets Countries
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }, true })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Country()
        {
            try
            {
                List<CodeTable> countries = _codeTableService.GetByName(CodeTableName.Country, true);
                return Json(SerializationHelper.ToJsonResult(countries.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CodeTablesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets Counties
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }, true })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult County()
        {
            try
            {
                List<CodeTable> counties = _codeTableService.GetByName(CodeTableName.County, true);
                return Json(SerializationHelper.ToJsonResult(counties.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CodeTablesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets Departments
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("CodeTables/Departments")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupDepartmentHead
         }})]
        public JsonResult Departments()
        {
            try
            {
                List<CodeTable> deparments = _codeTableService.GetByName(CodeTableName.Department, true);
                return Json(SerializationHelper.ToJsonResult(deparments.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CodeTablesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets Grade Activities
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("CodeTables/GradeActivity")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivities,
            ClaimsConstants.DepartmentCourseManagementActivities
         }, true })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult GradeActivity()
        {
            try
            {
                List<CodeTable> activities = _codeTableService.GetByName(CodeTableName.AssignmentType, true);
                return Json(SerializationHelper.ToJsonResult(activities.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CodeTablesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets Programs
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }, true })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Program()
        {
            try
            {
                List<CodeTable> programs = _codeTableService.GetByName(CodeTableName.Program, true);
                return Json(SerializationHelper.ToJsonResult(programs.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CodeTablesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Programs the of study.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }, true })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult ProgramOfStudy()
        {
            try
            {
                List<FormOptions> options = _formService.GetProgramOfStudy(Constants._applicationFormSettingId);
                return Json(SerializationHelper.ToJsonResult(options));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CodeTablesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets States Province
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }, true })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult StateProvince()
        {
            try
            {
                List<CodeTable> states = _codeTableService.GetByName(CodeTableName.State, true);
                return Json(SerializationHelper.ToJsonResult(states.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CodeTablesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}