// --------------------------------------------------------------------
// <copyright file="RegistrationGroupsController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Administration;
using SelfService.Models.RegistrationGroups;
using System;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /RegistrationGroups route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class RegistrationGroupsController : BaseEndpointController
    {
        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<RegistrationGroupsController> _logger;

        /// <summary>
        /// The registration group service
        /// </summary>
        private readonly IRegistrationGroupService _registrationGroupService;

        /// <summary>
        /// Initializes a new instance of the <see cref="RegistrationGroupsController"/> class.
        /// </summary>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="registrationGroupService">The registration group service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public RegistrationGroupsController(
            IInstitutionSettingService institutionSettingService,
            IRegistrationGroupService registrationGroupService,
            ISerializationHelper serializationHelper,
            IAppLogger<RegistrationGroupsController> logger)
            : base(serializationHelper)
        {
            _institutionSettingService = institutionSettingService;
            _registrationGroupService = registrationGroupService;

            _logger = logger;
        }

        /// <summary>
        /// Deletes the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("RegistrationGroups/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupRegistrationGroups } })]
        public JsonResult Delete([FromBody] int id)
        {
            try
            {
                bool result = false;
                if (id > 0)
                    result = _registrationGroupService.Delete(id);

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RegistrationGroupsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Detailses the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("RegistrationGroups/Details/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupRegistrationGroups } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Details(int? id)
        {
            try
            {
                RegistrationGroupDetails registrationGroupDetails = _registrationGroupService.GetDetail(id ?? 0);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    registrationGroupDetails.GroupViewsOptions,
                    registrationGroupDetails.DateBasesOptions,
                    PreRegDate = FormatHelper.ToDatePicker(registrationGroupDetails.StartRegDate),
                    RegDate = FormatHelper.ToDatePicker(registrationGroupDetails.LastRegDate),
                    RegistrationGroupDetail = registrationGroupDetails.RegistrationGroupDetail.ToViewModel()
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RegistrationGroupsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Indexes this instance.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("RegistrationGroups/{startIndex}/{length}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupRegistrationGroups } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Index(int startIndex, int length)
        {
            try
            {
                if (startIndex < 0)
                    return Json(SerializationHelper.ToJsonResult(null, "startIndex is less than zero.", 404, false));
                if (length <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "length is less than or equal to zero.", 404, false));
                RegistrationGroups registrationGroupList = _registrationGroupService.Get(startIndex, length);
                return Json(SerializationHelper.ToJsonResult(registrationGroupList));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RegistrationGroupsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified registration group detail.
        /// </summary>
        /// <param name="registrationGroupDetail">The registration group detail.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("RegistrationGroups/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupRegistrationGroups } })]
        public JsonResult Save([FromBody] RegistrationGroupDetailViewModel registrationGroupDetail)
        {
            try
            {
                bool result = false;
                RegistrationGroupDetail registrationGroupDetailDTO = registrationGroupDetail.ToDTO();
                if (registrationGroupDetail.Id > 0)
                    result = _registrationGroupService.Update(registrationGroupDetailDTO);
                else
                    result = _registrationGroupService.Create(registrationGroupDetailDTO) > 0;
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RegistrationGroupsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Statuses the specified block registration group status model.
        /// </summary>
        /// <param name="blockRegistrationGroupStatusModel">The block registration group status model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("RegistrationGroups/Status")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupRegistrationGroups } })]
        public JsonResult Status([FromBody] BlockRegistrationGroupStatusModel blockRegistrationGroupStatusModel)
        {
            try
            {
                int id = blockRegistrationGroupStatusModel.Id;
                bool isActive = blockRegistrationGroupStatusModel.IsActive;
                bool result = false;
                if (id > 0)
                    result = _registrationGroupService.UpdateStatus(id, isActive);
                return Json(SerializationHelper.ToJsonResult(new { id, result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RegistrationGroupsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Validates the name.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("RegistrationGroups/ValidateName")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupRegistrationGroups } })]
        public JsonResult ValidateName([FromBody] string name)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(!_registrationGroupService.Exists(name)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RegistrationGroupsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Checks the sort number available.
        /// </summary>
        /// <param name="sortId">The sort identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("RegistrationGroups/ValidateSort")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupRegistrationGroups } })]
        public JsonResult ValidateSort([FromBody] int sortId)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_registrationGroupService.ValidateSort(sortId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RegistrationGroupsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}