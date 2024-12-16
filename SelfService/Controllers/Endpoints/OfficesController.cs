// --------------------------------------------------------------------
// <copyright file="OfficesController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Administration;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Manages setup and data for offices
    /// </summary>
    /// <seealso cref="SelfService.Controllers.Endpoints.BaseEndpointController" />
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationInstructorSetupOffices } })]
    public class OfficesController : BaseEndpointController
    {
        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<OfficesController> _logger;

        /// <summary>
        /// The office service
        /// </summary>
        private readonly IOfficeService _officeService;

        /// <summary>
        /// Initializes a new instance of the <see cref="OfficesController"/> class.
        /// </summary>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="officeService">The office service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public OfficesController(
            ICodeTableService codeTableService,
            IInstitutionSettingService institutionSettingService,
            IOfficeService officeService,
            ISerializationHelper serializationHelper,
            IAppLogger<OfficesController> logger)
            : base(serializationHelper)
        {
            _codeTableService = codeTableService;
            _institutionSettingService = institutionSettingService;
            _officeService = officeService;

            _logger = logger;
        }

        /// <summary>
        /// Lists this instance.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Offices/AvailableForStaff")]
        public JsonResult AvailableOfficesForStaff([FromBody] int personId)
        {
            try
            {
                List<ListOptionViewModel> availableOffices = _officeService.GetAvailableForStaff(personId).ToViewModel(true);
                return Json(SerializationHelper.ToJsonResult(new { availableOffices }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(OfficesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Deletes the specified staff member identifier.
        /// </summary>
        /// <param name="staffMemberId">The staff member identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Offices/Delete")]
        public JsonResult Delete([FromBody] int staffMemberId)
        {
            try
            {
                bool result = false;
                if (staffMemberId > 0)
                    result = _officeService.DeleteStaffMember(staffMemberId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(OfficesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes all.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Offices/DeleteAll")]
        public JsonResult DeleteAll([FromBody] int personId)
        {
            try
            {
                bool result = false;
                if (personId > 0)
                    result = _officeService.DeleteStaffMemberByPerson(personId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(OfficesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Offices list.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Offices")]
        public JsonResult Index()
        {
            try
            {
                List<ListOptionViewModel> officesWithStaff = _officeService.GetWithStaff().ToViewModel(true);
                bool hasActiveOffices = officesWithStaff.Count > 0 || _codeTableService.GetByName(CodeTableName.Office, true).Count > 0;
                return Json(SerializationHelper.ToJsonResult(new
                {
                    hasActiveOffices,
                    officesWithStaff
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(OfficesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Offices the staff.
        /// </summary>
        /// <param name="officeId">The office identifier.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="length">The length.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Offices/OfficeStaff/{officeId}/{startIndex}/{length}")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult OfficeStaff(int officeId, int startIndex, int length)
        {
            try
            {
                StaffMembers staffMembers = _officeService.GetStaff(officeId, startIndex, length);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    overallCount = staffMembers.OverallCount,
                    staffMembers = staffMembers.StaffMembersList.ToViewModel(CurrentNameFormat, CurrentNameSort, general.PeopleIdFormat, ShowMiddleNameInitial)
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(OfficesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the office staff.
        /// </summary>
        /// <param name="officeModel">The office model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Offices/OfficeStaff/Save")]
        public JsonResult SaveOfficeStaff([FromBody] OfficeModel officeModel)
        {
            try
            {
                bool result = false;
                if (officeModel.StaffPermissions != null)
                    result = _officeService.SaveStaff(officeModel.PersonId, officeModel.StaffPermissions, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(OfficesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Staffs the permissions.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Offices/StaffPermissions")]
        public JsonResult StaffPermissions([FromBody] int personId)
        {
            try
            {
                List<OfficeStaffPermission> staffPermissions = _officeService.GetStaffPermissions(personId);
                return Json(SerializationHelper.ToJsonResult(new { staffPermissions = staffPermissions.ToViewModel() }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(OfficesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Updates the staff permission.
        /// </summary>
        /// <param name="staffPermission">The staff permission.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Offices/StaffPermissions/Update")]
        public JsonResult UpdateStaffPermission([FromBody] OfficeStaffPermission staffPermission)
        {
            try
            {
                bool result = false;
                if (staffPermission != null)
                    result = _officeService.UpdateStaffPermission(staffPermission, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(OfficesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}