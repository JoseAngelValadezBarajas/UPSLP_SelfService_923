// --------------------------------------------------------------------
// <copyright file="DashboardMessagesController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.DashboardMessages;
using System;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /DashboardMessages route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class DashboardMessagesController : BaseEndpointController
    {
        /// <summary>
        /// The dashboard message service
        /// </summary>
        private readonly IDashboardMessageService _dashboardMessageService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<DashboardMessagesController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="DashboardMessagesController"/> class.
        /// </summary>
        /// <param name="dashboardMessageService">The dashboard message service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public DashboardMessagesController(
            IDashboardMessageService dashboardMessageService,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            IAppLogger<DashboardMessagesController> logger)
            : base(serializationHelper)
        {
            _dashboardMessageService = dashboardMessageService;
            _institutionSettingService = institutionSettingService;

            _logger = logger;
        }

        /// <summary>
        /// Deletes the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DashboardMessages/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDashboardMessages } })]
        public JsonResult Delete([FromBody] int id)
        {
            try
            {
                bool result = false;
                if (id > 0)
                    result = _dashboardMessageService.Delete(id);

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardMessagesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Detailses the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("DashboardMessages/Details/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDashboardMessages } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Details(int? id)
        {
            try
            {
                DashboardMessageDetails dashboardMessageDetails = _dashboardMessageService.GetDetail(id ?? 0);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    dashboardMessageDetails.GroupViewsOptions,
                    DashboardMessageDetail = dashboardMessageDetails.DashboardMessageDetail.ToViewModel()
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardMessagesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the general message.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("DashboardMessages/General")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDashboardMessages } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult GetGeneralMessage()
        {
            try
            {
                string generalMessage = string.Empty;
                InstitutionSettings.DashboardMessage dashboardMessage = _institutionSettingService.GetDashboardMessage();
                if (dashboardMessage != null)
                    generalMessage = dashboardMessage.Comments;
                return Json(SerializationHelper.ToJsonResult(generalMessage));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardMessagesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Indexes the specified start index.
        /// </summary>
        /// <param name="startIndex">The start index.</param>
        /// <param name="length">The length.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("DashboardMessages/{startIndex}/{length}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDashboardMessages } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Index(int startIndex, int length)
        {
            try
            {
                if (startIndex < 0)
                    return Json(SerializationHelper.ToJsonResult(null, "startIndex is less than zero.", 404, false));
                if (length <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "length is less than or equal to zero.", 404, false));

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                DashboardMessagesViewModel dashboardMessagesList = _dashboardMessageService.Get(startIndex, length).ToViewModel(general);
                return Json(SerializationHelper.ToJsonResult(dashboardMessagesList));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardMessagesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified dashboard messages model.
        /// </summary>
        /// <param name="dashboardMessagesModel">The dashboard messages model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DashboardMessages/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDashboardMessages } })]
        public JsonResult Save([FromBody] DashboardMessagesModel dashboardMessagesModel)
        {
            try
            {
                DashboardMessageDetailViewModel dashboardMessageDetail = dashboardMessagesModel.DashboardMessageDetail;
                bool process = dashboardMessagesModel.Process;
                bool result = false;
                DashboardMessageDetail dashboardMessageDetailDTO = dashboardMessageDetail.ToDTO();
                if (dashboardMessageDetail.Id > 0)
                {
                    result = _dashboardMessageService.Update(dashboardMessageDetailDTO, Account.PersonId);
                }
                else
                {
                    dashboardMessageDetail.Id = _dashboardMessageService.Create(dashboardMessageDetailDTO, Account.PersonId);
                    result = dashboardMessageDetail.Id > 0;
                }

                if (process)
                    _dashboardMessageService.CreateGroupOfPerson(dashboardMessageDetail.Id);

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardMessagesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the general.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DashboardMessages/SaveGeneral")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDashboardMessages } })]
        public JsonResult SaveGeneral([FromBody] string message)
        {
            try
            {
                InstitutionSettings.DashboardMessage dashboardMessage = new()
                {
                    Comments = message
                };
                bool result = _institutionSettingService.SaveDashboardMessage(dashboardMessage, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardMessagesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Validates the name.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DashboardMessages/ValidateName")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDashboardMessages } })]
        public JsonResult ValidateName([FromBody] string name)
        {
            try
            {
                bool isAvailable = _dashboardMessageService.NameExists(name);
                return Json(SerializationHelper.ToJsonResult(isAvailable));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardMessagesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Checks the sort number available.
        /// </summary>
        /// <param name="sortId">The sort identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DashboardMessages/ValidateSort")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDashboardMessages } })]
        public JsonResult ValidateSort([FromBody] byte sortId)
        {
            try
            {
                bool isAvailable = _dashboardMessageService.SortExists(sortId);
                return Json(SerializationHelper.ToJsonResult(isAvailable));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardMessagesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}