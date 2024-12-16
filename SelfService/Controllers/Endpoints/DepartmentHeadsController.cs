// --------------------------------------------------------------------
// <copyright file="DepartmentHeadsController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Administration;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// DepartmentHeadsController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class DepartmentHeadsController : BaseEndpointController
    {
        /// <summary>
        /// The department head service
        /// </summary>
        private readonly IDepartmentHeadService _departmentHeadService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<DepartmentHeadsController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="DepartmentHeadsController"/> class.
        /// </summary>
        /// <param name="departmentHeadService">The department head service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public DepartmentHeadsController(
            IDepartmentHeadService departmentHeadService,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            IAppLogger<DepartmentHeadsController> logger)
            : base(serializationHelper)
        {
            _departmentHeadService = departmentHeadService;
            _institutionSettingService = institutionSettingService;

            _logger = logger;
        }

        /// <summary>
        /// Gets the Departments for Department Head Overview
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("DepartmentHeads/Departments")]
        public JsonResult Departments()
        {
            try
            {
                List<CodeTable> departments = _departmentHeadService.GetDepartments(Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(departments.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DepartmentHeadsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the Faculties for Department Head Overview
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("DepartmentHeads/Faculties")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Faculties()
        {
            try
            {
                List<People> faculties = _departmentHeadService.GetFaculties(Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(faculties.ToViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial).ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DepartmentHeadsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the Years for Department Head Overview
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("DepartmentHeads/Years")]
        public JsonResult Years()
        {
            try
            {
                List<string> years = _departmentHeadService.GetYears(Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(years));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DepartmentHeadsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #region AdminDeparmentHead

        /// <summary>
        /// Deletes the specified department head identifier.
        /// </summary>
        /// <param name="departmentHeadId">The department head identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DepartmentHeads/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupDepartmentHead
         }})]
        public JsonResult Delete([FromBody] int departmentHeadId)
        {
            try
            {
                bool result = _departmentHeadService.Delete(departmentHeadId) > 0;
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DepartmentHeadsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Faculties the has department.
        /// </summary>
        /// <param name="departmentHeadModel">The department head model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DepartmentHeads/FacultyHasDepartment")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupDepartmentHead
         }})]
        public JsonResult FacultyHasDepartment([FromBody] DepartmentHeadModel departmentHeadModel)
        {
            try
            {
                bool hasDepartment = _departmentHeadService.FacultyHasDepartment(departmentHeadModel.DepartmentId, departmentHeadModel.PersonId);
                return Json(SerializationHelper.ToJsonResult(hasDepartment));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DepartmentHeadsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Departments the heads.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("DepartmentHeads")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupDepartmentHead
         }})]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Index()
        {
            try
            {
                List<DepartmentHeadDetail> departments = _departmentHeadService.Get();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(departments.ToViewModel(CurrentNameFormat, CurrentNameSort, general.PeopleIdFormat, ShowMiddleNameInitial)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DepartmentHeadsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified department head.
        /// </summary>
        /// <param name="departmentHead">The department head.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DepartmentHeads/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupDepartmentHead
         }})]
        public JsonResult Save([FromBody] DepartmentHead departmentHead)
        {
            try
            {
                bool result = false;
                if (departmentHead != null)
                    result = _departmentHeadService.Save(departmentHead);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DepartmentHeadsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion AdminDeparmentHead
    }
}