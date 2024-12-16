// --------------------------------------------------------------------
// <copyright file="ChecklistsController.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Account;
using SelfService.Models.Checklist;
using SelfService.Models.Generic;
using SelfService.Models.Shared;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Linq;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Manages setup and data for Dossiers
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class ChecklistsController : BaseEndpointController
    {
        /// <summary>
        /// The checklist service
        /// </summary>
        private readonly IChecklistService _checklistService;

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
        private readonly IAppLogger<ChecklistsController> _logger;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The period service
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// Initializes a new instance of the <see cref="ChecklistsController"/> class.
        /// </summary>
        /// <param name="checklistService">The checklist service.</param>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public ChecklistsController(
            IChecklistService checklistService,
            ICodeTableService codeTableService,
            IInstitutionSettingService institutionSettingService,
            IPeopleService peopleService,
            IPeriodService periodService,
            ISerializationHelper serializationHelper,
            IAppLogger<ChecklistsController> logger)
            : base(serializationHelper)
        {
            _checklistService = checklistService;
            _codeTableService = codeTableService;
            _institutionSettingService = institutionSettingService;
            _peopleService = peopleService;
            _periodService = periodService;

            _logger = logger;
        }

        /// <summary>
        /// Gets the actions of the specified office.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/Actions")]
        public JsonResult Actions([FromBody] int id)
        {
            try
            {
                List<ListOptionViewModel> actions = _checklistService.GetActionByOffice(id).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(actions));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the cancel reasons.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/CancelReasons")]
        public JsonResult CancelReasons()
        {
            try
            {
                List<ListOptionViewModel> cancelReasons = _codeTableService.GetByName(CodeTableName.CancelReason).ToChecklistViewModel();
                return Json(SerializationHelper.ToJsonResult(cancelReasons));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the contact information of the specified person.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/Template/ContactInformation")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult ContactInformation([FromBody] int personId)
        {
            try
            {
                ContactInformationViewModel contact = null;
                IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
                if (claims.Any(c => c.Type == ClaimsConstants.ChecklistMyTasksEditActionItem) ||
                    claims.Any(c => c.Type == ClaimsConstants.ChecklistMyTasksCreateActionItem) ||
                    claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileChecklist) ||
                    claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileChecklist) ||
                    claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileChecklist) ||
                    claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileChecklist) ||
                    claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileChecklist) ||
                    claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileChecklist) ||
                    claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileChecklist) ||
                    claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileChecklist))
                {
                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    contact =
                        _peopleService.GetContactInformation(personId).ToContactViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial, general.PeopleIdFormat);
                }
                return Json(SerializationHelper.ToJsonResult(new { contact }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Deletes the specified checklist template.
        /// </summary>
        /// <param name="checklistTemplateId">The checklist template identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/Delete")]
        public JsonResult Delete([FromBody] int checklistTemplateId)
        {
            try
            {
                bool result = false;
                if (checklistTemplateId > 0)
                    result = _checklistService.DeleteTemplate(checklistTemplateId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the details of the specified checklist template.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/Details")]
        public JsonResult Details([FromBody] int id)
        {
            try
            {
                ChecklistViewModel checklistDetail = null;
                if (id <= 0)
                    _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, "Id is zero");
                else
                    checklistDetail = _checklistService.GetTemplateById(id).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new { checklistDetail }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the list of checklist templates and additional lists (offices and periods).
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists")]
        public JsonResult Index()
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<ChecklistTasksViewModel> checklists = _checklistService.GetTemplates().ToViewModel(general);
                List<ListOptionViewModel> offices = _checklistService.GetOffice().ToViewModel(true);
                List<ListOptionViewModel> yearTerms = _periodService.GetForChecklist().ToViewModel(false, true);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    checklists,
                    offices,
                    yearTerms
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the edit task of the specified person and action schedule.
        /// </summary>
        /// <param name="checklistTaskModel">The checklist task model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/MyEditTask")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult MyEditTask([FromBody] ChecklistTaskModel checklistTaskModel)
        {
            try
            {
                if (checklistTaskModel is null)
                    throw new ArgumentNullException(nameof(checklistTaskModel));
                bool isImpersonate = checklistTaskModel?.ImpersonateInfo?.PersonId != null;
                int id = checklistTaskModel?.ImpersonateInfo?.PersonId > 0 ? checklistTaskModel.ImpersonateInfo.PersonId : Account.PersonId;
                int actionScheduleId = checklistTaskModel.ActionScheduleId;
                List<ListOptionViewModel> offices = new();
                if (isImpersonate)
                    offices = _checklistService.GetTemplateOffice().ToViewModel(true);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<ChecklistMyTasksViewModel> MyTasks = _checklistService.GetMyTask(id, isImpersonate).ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                ChecklistMyTasksViewModel myEditTasks = new();

                foreach (ChecklistMyTasksViewModel myTask in MyTasks)
                {
                    myEditTasks.MyTasks = myTask.MyTasks.Where(t => t.ActionScheduledId == actionScheduleId).ToList();
                    if (myEditTasks.MyTasks.Count > 0)
                    {
                        string officeId = offices.Where(o => o.Description == myEditTasks.MyTasks[0].OfficeDesc).Select(m => m.Value).FirstOrDefault();
                        myEditTasks.MyTasks[0].OfficeId = Convert.ToInt32(officeId);
                        List<ListOptionViewModel> actions = _checklistService.GetTemplateActionByOffice(Convert.ToInt32(officeId)).ToViewModel(false);
                        myEditTasks.MyTasks[0].ActionId = actions.Where(a => a.Description == myEditTasks.MyTasks[0].ActionName).Select(m => m.Value).FirstOrDefault();
                        break;
                    }
                }

                return Json(SerializationHelper.ToJsonResult(myEditTasks.MyTasks));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Mies the tasks.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/MyTasks")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult MyTasks([FromBody] ImpersonateModel model)
        {
            try
            {
                bool isImpersonate = model?.ImpersonateInfo?.PersonId != null;
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<ChecklistMyTasksViewModel> MyTasks = null;
                if (isImpersonate)
                {
                    MyTasks = _checklistService.GetMyAdvisorTask(personId, Account.PersonId).ToViewModel(CurrentNameFormat, CurrentNameSort,
                        general, ShowMiddleNameInitial);
                }
                else
                {
                    MyTasks = _checklistService.GetMyTask(personId, isImpersonate).ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                }
                return Json(SerializationHelper.ToJsonResult(MyTasks));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the task detail for the specified action schedule and person.
        /// </summary>
        /// <param name="checklistTaskModel">The checklist task model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/MyTasksDetail")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult MyTasksDetail([FromBody] ChecklistTaskModel checklistTaskModel)
        {
            try
            {
                if (checklistTaskModel is null)
                    throw new ArgumentNullException(nameof(checklistTaskModel));
                bool isImpersonate = checklistTaskModel?.ImpersonateInfo?.PersonId != null;
                int id = checklistTaskModel?.ImpersonateInfo?.PersonId > 0 ? checklistTaskModel.ImpersonateInfo.PersonId : Account.PersonId;
                int actionScheduleId = checklistTaskModel.ActionScheduleId;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                ChecklistMyTask checklistMyTaskDetail = _checklistService.GetMyTasksDetail(actionScheduleId, id, isImpersonate);
                if (checklistMyTaskDetail != null)
                {
                    ChecklistMyTaskViewModel MyTasks = checklistMyTaskDetail.ToViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial, general);
                    return Json(SerializationHelper.ToJsonResult(MyTasks));
                }
                else
                {
                    _logger.LogWarning(Constants._product, typeof(ChecklistsController).FullName,
                        $"Permission Evaluation - Failed: User {Account.UserName} tried to access to an unauthorized task.");
                    return Json(SerializationHelper.ToJsonResult(null, null, 403, false));
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Processeds the specified people model.
        /// </summary>
        /// <param name="model">The people model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/MyTasks/Processed")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Processed([FromBody] PeopleModel peopleModel)
        {
            try
            {
                if (peopleModel is null)
                    throw new ArgumentNullException(nameof(peopleModel));

                int personId = peopleModel.ImpersonateInfo?.PersonId > 0 ? peopleModel.ImpersonateInfo.PersonId : Account.PersonId;
                int startIndex = peopleModel.StartIndex.Value;
                int length = peopleModel.Length.Value;
                bool isImpersonate = peopleModel.ImpersonateInfo != null;

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                ChecklistMyTasks checklistMyTasks = _checklistService.GetMyTaskProcessed(personId, startIndex, length, isImpersonate);
                List<ChecklistMyTasksViewModel> MyTasks = checklistMyTasks.ChecklistMyTask.ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                int overallCount = checklistMyTasks.OverallCount;
                return Json(SerializationHelper.ToJsonResult(new { MyTasks, overallCount }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the specified checklist.
        /// </summary>
        /// <param name="checklist">The checklist.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/Save")]
        public JsonResult Save([FromBody] ChecklistModel checklist)
        {
            try
            {
                bool result = false;
                DateTime? dueDateTime = null;
                short? OffsetDays = null;
                if (checklist != null)
                {
                    DateTime dueDate;
                    if (checklist.Option == 2)
                    {
                        dueDate = DateTime.Parse("1900-01-01");
                        OffsetDays = checklist.OffsetDays;
                    }
                    else
                    {
                        dueDate = (DateTime)FormatHelper.FromDatePicker(checklist.DueDate);
                    }

                    DateTime dueTime = (DateTime)FormatHelper.FromTimePicker(checklist.DueTime + ":00");
                    dueDateTime = dueDate.AddHours(dueTime.Hour).AddMinutes(dueTime.Minute);

                    Checklist checklistDTO = new()
                    {
                        AcademicSession = checklist.AcademicSession,
                        AcademicTerm = checklist.AcademicTerm,
                        AcademicYear = checklist.AcademicYear,
                        ActionId = checklist.ActionId,
                        ChecklistTemplateId = checklist.ChecklistTemplateId,
                        DueDate = dueDateTime,
                        Instruction = checklist.Instruction,
                        IsActive = checklist.IsActive,
                        IsRequired = checklist.IsRequired,
                        Note = checklist.Note,
                        OfficeId = checklist.OfficeId,
                        OffsetDays = OffsetDays,
                        PersonId = Account.PersonId,
                        Priority = checklist.Priority
                    };
                    if (checklist.ChecklistTemplateId > 0)
                        result = _checklistService.UpdateTemplate(checklistDTO);
                    else
                        result = _checklistService.CreateTemplate(checklistDTO);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the action.
        /// </summary>
        /// <param name="checklistAction">The checklist.</param>
        /// <returns></returns>
        [Route("Checklists/Template/Action")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult SaveAction([FromBody] ChecklistActionModel checklistAction)
        {
            try
            {
                if (checklistAction is null)
                    throw new ArgumentNullException(nameof(checklistAction));
                bool result = false;
                if (checklistAction != null)
                {
                    int personId = checklistAction?.ImpersonateInfo?.PersonId > 0 ? checklistAction.ImpersonateInfo.PersonId : Account.PersonId;
                    DateTime dueDate = (DateTime)FormatHelper.FromDatePicker(checklistAction.DueDate);
                    DateTime time = (DateTime)FormatHelper.FromTimePicker(checklistAction.DueTime + ":00");
                    DateTime dateTime = Convert.ToDateTime("1900-01-01").AddHours(time.Hour).AddMinutes(time.Minute);
                    Checklist checklistDTO = new()
                    {
                        AcademicSession = checklistAction.AcademicSession,
                        AcademicTerm = checklistAction.AcademicTerm,
                        AcademicYear = checklistAction.AcademicYear,
                        ActionId = checklistAction.ActionId,
                        ActionScheduleId = checklistAction.ActionScheduleId,
                        DueDate = FormatHelper.FromDatePicker(checklistAction.DueDate),
                        Instruction = checklistAction.Instruction,
                        IsRequired = checklistAction.IsRequired,
                        Note = checklistAction.Note,
                        OfficeId = checklistAction.OfficeId,
                        PersonId = personId,
                        Priority = checklistAction.Priority,
                        ResponsibleId = checklistAction.ResponsibleId,
                        ScheduledDate = dueDate,
                        ScheduledTime = dateTime
                    };
                    result = _checklistService.CreateTemplateAction(checklistDTO);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the edit my task.
        /// </summary>
        /// <param name="checklistEditTaskModel">The checklist edit task model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/SaveEditMyTask")]
        public JsonResult SaveEditMyTask([FromBody] ChecklistEditTaskModel checklistEditTaskModel)
        {
            try
            {
                bool result = false;
                if (checklistEditTaskModel != null)
                {
                    DateTime dueDate = FormatHelper.FromDatePicker(checklistEditTaskModel.ChecklistMyTask.DueDate).Value;
                    DateTime dueTime = FormatHelper.FromTimePicker(checklistEditTaskModel.ChecklistMyTask.DueTime).Value;

                    ChecklistMyTask checklistMyTask = new()
                    {
                        ActionScheduleId = checklistEditTaskModel.ChecklistMyTask.ActionScheduleId,
                        IsRequired = checklistEditTaskModel.ChecklistMyTask.IsRequired,
                        AcademicYear = checklistEditTaskModel.ChecklistMyTask.AcademicYear,
                        AcademicTerm = checklistEditTaskModel.ChecklistMyTask.AcademicTerm,
                        AcademicSession = checklistEditTaskModel.ChecklistMyTask.AcademicSession,
                        Priority = checklistEditTaskModel.ChecklistMyTask.Priority,
                        DueDate = dueDate.AddHours(dueTime.Hour).AddMinutes(dueTime.Minute),
                        Instruction = checklistEditTaskModel.ChecklistMyTask.Instruction,
                        Note = checklistEditTaskModel.ChecklistMyTask.Note,
                        PersonId = checklistEditTaskModel.ChecklistMyTask.PersonId,
                    };
                    result = _checklistService.UpdateTemplateAction(checklistMyTask, checklistEditTaskModel.IsImpersonate);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the status of the specified checklist template.
        /// </summary>
        /// <param name="statusModel">The checklist status model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/Status")]
        public JsonResult Status([FromBody] StatusModel statusModel)
        {
            try
            {
                bool result = false;
                if (statusModel.Id > 0)
                    result = _checklistService.UpdateTemplateIsActive(statusModel.Id, statusModel.IsActive);
                return Json(SerializationHelper.ToJsonResult(new { id = statusModel.Id, result, isActive = statusModel.IsActive }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the template actions of the specified office.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/Template/Actions")]
        public JsonResult TemplateActions([FromBody] int id)
        {
            try
            {
                List<ListOptionViewModel> actions = _checklistService.GetTemplateActionByOffice(id).ToViewModel(false);
                return Json(SerializationHelper.ToJsonResult(actions));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the template detail for the checklist responsible.
        /// </summary>
        /// <param name="checklistResponsible">The checklist responsible.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/Template/Detail")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult TemplateDetail([FromBody] ChecklistResponsibleModel checklistResponsible)
        {
            try
            {
                if (checklistResponsible is null)
                    throw new ArgumentNullException(nameof(checklistResponsible));

                int id = checklistResponsible.ImpersonateInfo?.PersonId > 0 ? checklistResponsible.ImpersonateInfo.PersonId : Account.PersonId;
                ChecklistDetailResponsible checklistDetailResponsible = _checklistService.GetTemplateByOfficeAction(
                    checklistResponsible.OfficeId, checklistResponsible.ActionId, checklistResponsible.ImpersonateInfo.PersonId, Account.PersonId);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<ListOptionViewModel> responsibles = checklistDetailResponsible.Responsibles.ToOptionComplementViewModel(CurrentNameFormat, CurrentNameSort,
                    ShowMiddleNameInitial, general.PeopleIdFormat);
                ChecklistViewModel checklist = checklistDetailResponsible.Checklist.ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    responsibles,
                    checklist
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Templates the offices.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/Template/Offices")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult TemplateOffices([FromBody] ImpersonateModel model)
        {
            try
            {
                int id = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                List<ListOptionViewModel> offices = _checklistService.GetTemplateOffice().ToViewModel(true);
                List<ListOptionViewModel> yearTerms = _periodService.GetForChecklist().ToViewModel(false, true);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                AvatarViewModel avatar = _peopleService.Get(id).ToViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial, general.PeopleIdFormat);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    offices,
                    yearTerms,
                    avatar
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Updates the checklist completed status.
        /// </summary>
        /// <param name="checklistMyTask">The checklist my task.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/UpdateCompletedStatus")]
        public JsonResult UpdateChecklistCompletedStatus([FromBody] ChecklistMyTaskModel checklistMyTaskModel)
        {
            try
            {
                bool result = false;
                if (checklistMyTaskModel != null)
                {
                    DateTime completedDate = (DateTime)FormatHelper.FromDatePicker(checklistMyTaskModel.CompletedDate);
                    DateTime completedTime = (DateTime)FormatHelper.FromTimePicker(checklistMyTaskModel.CompletedTime);

                    ChecklistMyTask checklistMyTask = new()
                    {
                        ActionScheduleId = checklistMyTaskModel.ActionScheduleId,
                        CompletedBy = checklistMyTaskModel.CompletedBy,
                        CompletedDate = completedDate.AddHours(completedTime.Hour).AddMinutes(completedTime.Minute),
                        Note = checklistMyTaskModel.Notes,
                        Status = checklistMyTaskModel.Status
                    };
                    result = _checklistService.UpdateCompletedStatus(checklistMyTask);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Updates the checklist reassign.
        /// </summary>
        /// <param name="checklistActionModel">The checklist action model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/UpdateReassign")]
        public JsonResult UpdateChecklistReassign([FromBody] ChecklistActionModel checklistActionModel)
        {
            try
            {
                bool result = _checklistService.UpdateReassign(checklistActionModel.ActionScheduleId, checklistActionModel.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Updates the reasons.
        /// </summary>
        /// <param name="checklist">The checklist.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/UpdateReasons")]
        public JsonResult UpdateReasons([FromBody] ChecklistAction checklist)
        {
            try
            {
                bool result = _checklistService.UpdateStatus(checklist);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the waive reasons.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/WaiveReasons")]
        public JsonResult WaiveReasons()
        {
            try
            {
                List<ListOptionViewModel> waiveReasons = _codeTableService.GetByName(CodeTableName.WaivedReason).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(waiveReasons));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Years the term sessions.
        /// </summary>
        /// <param name="yearTermModel">The year term model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Checklists/YearTermSessions")]
        public JsonResult YearTermSessions([FromBody] YearTermModel yearTermModel)
        {
            try
            {
                string year = yearTermModel.Year;
                string term = yearTermModel.Term;
                List<ListOptionViewModel> sessions = null;
                List<ListOptionViewModel> yearTerms = _periodService.GetForChecklist().ToViewModel(false, true);
                if (year != "" && term != "")
                    sessions = _periodService.GetForChecklist(year, term).ToViewModel(false, false);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    yearTerms,
                    sessions
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}