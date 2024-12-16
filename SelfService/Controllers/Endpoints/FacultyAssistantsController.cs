// --------------------------------------------------------------------
// <copyright file="FacultyAssistantsController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.FacultyAssistants;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RoleQueueDto = Hedtech.PowerCampus.Core.DTO.Foundation.RoleQueue;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// FacultyAssistantsController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class FacultyAssistantsController : BaseEndpointController
    {
        /// <summary>
        /// The application user service
        /// </summary>
        private readonly IAppUserService _appUserService;

        /// <summary>
        /// The faculty assistant service
        /// </summary>
        private readonly IFacultyAssistantService _facultyAssistantService;

        /// <summary>
        /// The institution Setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<FacultyAssistantsController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// The role queue service
        /// </summary>
        private readonly IRoleQueueService _roleQueueService;

        /// <summary>
        /// The section service
        /// </summary>
        private readonly ISectionService _sectionService;

        /// <summary>
        /// Initializes a new instance of the <see cref="FacultyAssistantsController"/> class.
        /// </summary>
        /// <param name="appUserService">The application user service.</param>
        /// <param name="facultyAssistantService">The faculty assistant service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="roleQueueService">The role queue service.</param>
        /// <param name="sectionService">The section service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public FacultyAssistantsController(
            IAppUserService appUserService,
            IFacultyAssistantService facultyAssistantService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPictureHelper pictureHelper,
            IRoleQueueService roleQueueService,
            ISectionService sectionService,
            ISerializationHelper serializationHelper,
            IAppLogger<FacultyAssistantsController> logger)
            : base(serializationHelper)
        {
            _appUserService = appUserService;
            _facultyAssistantService = facultyAssistantService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _pictureHelper = pictureHelper;
            _roleQueueService = roleQueueService;
            _sectionService = sectionService;

            _logger = logger;
        }

        /// <summary>
        /// Gets default role of faculty assistant.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("FacultyAssistants/DefaultRole")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.ClassesFacultyCourseManagementManageAssistants } })]
        public JsonResult DefaultRole()
        {
            try
            {
                bool result = !string.IsNullOrEmpty(_institutionSettingService.GetFacultyAssistant().DefaultRole);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FacultyAssistantsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Deletes the specified faculty assistant identifier.
        /// </summary>
        /// <param name="deleteModel">The delete model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("FacultyAssistants/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.ClassesFacultyCourseManagementManageAssistants } })]
        public JsonResult Delete([FromBody] DeleteModel deleteModel)
        {
            try
            {
                int facultyAssistantId = deleteModel.FacultyAssistantId;
                int assistantId = deleteModel.AssistantId;
                int sectionId = deleteModel.SectionId;

                bool result = _facultyAssistantService.Delete(facultyAssistantId);
                if (result)
                    _ = SendFacultyAssistanNotificationAsync(assistantId, sectionId, true);
                if (result && !_facultyAssistantService.HasSectionAssigned(assistantId))
                {
                    RoleQueueDto roleQueue = new()
                    {
                        Action = "D", // (A)dd or (D)elete
                        CreateById = Account.PersonId,
                        PersonId = assistantId,
                        SectionName = "FacultyAssistant",
                    };
                    _roleQueueService.Create(roleQueue);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FacultyAssistantsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Details the specified section identifier.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("FacultyAssistants/Detail")]
        public JsonResult Detail([FromBody] int sectionId)
        {
            try
            {
                FacultyAssistant facultyAssistant = _facultyAssistantService.Get(Account.PersonId, sectionId);
                return Json(SerializationHelper.ToJsonResult(facultyAssistant));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FacultyAssistantsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Indexes the specified section identifier.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("FacultyAssistants")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.ClassesFacultyCourseManagementManageAssistants } })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Index([FromBody] int sectionId)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                EmailSettingsViewModel emailSettings = new()
                {
                    CanEditRecipient = mail.CanEditRecipient,
                    CanEditSender = mail.CanEditSender,
                    Email = mail.Email,
                    EmailProvider = mail.EmailProvider,
                    Sender = mail.Sender,
                    StaffSeparator = mail.StaffSeparator,
                    StaffUrl = mail.StaffUrl,
                    StudentSeparator = mail.StudentSeparator,
                    StudentUrl = mail.StudentUrl
                };
                FacultyAssistantsViewModel facultyAssistantList = new()
                {
                    FacultyAssistants = _facultyAssistantService.GetDetails(sectionId).ToViewModel(_peopleService,
                    CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial, _pictureHelper),
                    EmailSettings = emailSettings
                };
                return Json(SerializationHelper.ToJsonResult(facultyAssistantList));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FacultyAssistantsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the specified faculty assistants.
        /// </summary>
        /// <param name="facultyAssistants">The faculty assistants.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("FacultyAssistants/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.ClassesFacultyCourseManagementManageAssistants } })]
        public async Task<JsonResult> Save([FromBody] List<FacultyAssistant> facultyAssistants)
        {
            try
            {
                if (facultyAssistants == null)
                    return await Task.FromResult(Json(SerializationHelper.ToJsonResult(null, null, null, false)));

                List<bool> results = new();
                bool result = false;
                AppUser user = null;
                string username = string.Empty;
                string roleName = _institutionSettingService.GetFacultyAssistant().DefaultRole;
                foreach (FacultyAssistant facultyAssistant in facultyAssistants)
                {
                    facultyAssistant.FacultyId = Account.PersonId;
                    result = _facultyAssistantService.Save(facultyAssistant);
                    results.Add(result);
                    if (result && facultyAssistant.FacultyAssistantId == 0)
                        _ = SendFacultyAssistanNotificationAsync(facultyAssistant.AssistantId, facultyAssistant.SectionId, false);
                    //username = await appUserService.Get(facultyAssistant.AssistantId);
                    //TODO: Get username
                    username = string.Empty;

                    if (username != null)
                        user = await _appUserService.Get(username);

                    if (user == null || (!await _appUserService.IsInRole(user.Id, roleName) &&
                        !_roleQueueService.Exists(facultyAssistant.AssistantId, "FacultyAssistant", "A")))
                    {
                        RoleQueueDto roleQueue = new()
                        {
                            Action = "A", // (A)dd or (D)elete
                            CreateById = Account.PersonId,
                            PersonId = facultyAssistant.AssistantId,
                            SectionName = "FacultyAssistant",
                        };
                        _roleQueueService.Create(roleQueue);
                    }
                }
                if (results.Contains(false))
                    return Json(SerializationHelper.ToJsonResult(null, null, null, false));
                return Json(SerializationHelper.ToJsonResult(null));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FacultyAssistantsController).FullName, exception.Message, exception);
                return await Task.FromResult(Json(SerializationHelper.ToJsonResult(null, null, 500, false)));
            }
        }

        /// <summary>
        /// Sends the faculty assistan notification asynchronous.
        /// </summary>
        /// <param name="assistantId">The assistant identifier.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="isDeleted">if set to <c>true</c> [is deleted].</param>
        private async Task SendFacultyAssistanNotificationAsync(int assistantId, int sectionId, bool isDeleted)
        {
            try
            {
                if (sectionId > 0)
                {
                    string eventNotification = string.Empty;
                    eventNotification = isDeleted ? NotificationEvent.CrsMngFacultyAssistantRemovee : NotificationEvent.CrsMngFacultyAssistantAdded;

                    bool isActive = await _notificationsHelper.EventIsActiveAsync(eventNotification).ConfigureAwait(false);
                    if (!isActive)
                        return;

                    List<NotificationToken> currentTokens = _notificationsHelper.GetPersonNotificationTokensByPersonId(_peopleService, assistantId);
                    SectionDetail section = _sectionService.GetDetail(sectionId);
                    NotificationTokenDetail sectionsTokens = new()
                    {
                        Id = "sections",
                        ValueList = new()
                    };

                    sectionsTokens.ValueList.Add(new NotificationToken
                    {
                        Token = new NotificationTokenDetail
                        {
                            Id = "section",
                            ValueList = new List<NotificationToken>
                                    {
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.academicyear", Value = section.AcademicYear } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.academicterm", Value = section.AcademicTermDesc } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.academicsession", Value = section.AcademicSessionDesc } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.eventid", Value = section.EventId } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.eventsubtype", Value = section.EventSubTypeDesc } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.section", Value = section.SectionEvent } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.eventlongname", Value = section.EventLongName } },
                                    }
                        }
                    });

                    currentTokens.Add(new NotificationToken { Token = sectionsTokens });

                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = eventNotification,
                        Tokens = currentTokens
                    });
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FacultyAssistantsController).FullName, exception.Message, exception);
            }
        }
    }
}