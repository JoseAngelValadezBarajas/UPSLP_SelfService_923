// --------------------------------------------------------------------
// <copyright file="CourseTemplatesController.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Core.Logic;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.CourseTemplates;
using SelfService.Models.Section;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// CourseTemplatesController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class CourseTemplatesController : BaseEndpointController
    {
        /// <summary>
        /// The assignment template service
        /// </summary>
        private readonly IAssignmentTemplateService _assignmentTemplateService;

        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

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
        private readonly IAppLogger<CourseTemplatesController> _logger;

        /// <summary>
        /// The setting service
        /// </summary>
        private readonly ISettingService _settingService;

        /// <summary>
        /// Initializes a new instance of the <see cref="CourseTemplatesController"/> class.
        /// </summary>
        /// <param name="assignmentTemplateService">The assignment template service.</param>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="departmentHeadService">The department head service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="logger">The logger.</param>
        public CourseTemplatesController(
            IAssignmentTemplateService assignmentTemplateService,
            ICodeTableService codeTableService,
            IDepartmentHeadService departmentHeadService,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            ISettingService settingService,
            IAppLogger<CourseTemplatesController> logger)
            : base(serializationHelper)
        {
            _assignmentTemplateService = assignmentTemplateService;
            _codeTableService = codeTableService;
            _departmentHeadService = departmentHeadService;
            _institutionSettingService = institutionSettingService;
            _settingService = settingService;

            _logger = logger;
        }

        /// <summary>
        /// Assigns the specified assign sections.
        /// </summary>
        /// <param name="assignSections">The assign sections.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Assign")]
        public JsonResult Assign([FromBody] List<AssignmentTemplateSection> assignSections)
        {
            try
            {
                bool result = _assignmentTemplateService.Assign(assignSections, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(new { result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Copies the assignment template.
        /// </summary>
        /// <param name="copyAssignmentTemplateModel">The copy assignment template model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Assignment/Copy")]
        public JsonResult CopyAssignmentTemplate([FromBody] AssignmentTemplateCopyModel copyAssignmentTemplateModel)
        {
            try
            {
                int fromTemplateId = copyAssignmentTemplateModel.FromTemplateId;
                int toTemplateId = copyAssignmentTemplateModel.ToTemplateId;

                bool result = _assignmentTemplateService.Copy(fromTemplateId, toTemplateId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the assignment.
        /// </summary>
        /// <param name="assignment">The assignment.</param>
        /// <param name="templateId">The template identifier.</param>
        /// <param name="useManualWeights">if set to <c>true</c> [use manual weights].</param>
        /// <returns>
        /// -1 - When the assigned date its rather than due date
        /// -2 - Indicates exception error
        /// 0 Updates successfull
        /// > 0 Creates successfull
        /// </returns>
        [HttpPost]
        [Route("CourseTemplates/Assignment/Create")]
        public JsonResult CreateAssignment([FromBody] AssignmentCreationModel createAssignmentModel)
        {
            try
            {
                AssignmentTemplateDetail assignment = new()
                {
                    AssignmentDate = FormatHelper.FromDatePicker(createAssignmentModel.Assignment.AssignedDate),
                    AssignmentTemplateDetailId = createAssignmentModel.Assignment.AssignmentId,
                    AssignmentTypeId = createAssignmentModel.Assignment.AssignmentTypeId,
                    CountsForFinal = createAssignmentModel.Assignment.CountsForFinal,
                    CountsForMidterm = createAssignmentModel.Assignment.CountsForMidterm,
                    Description = createAssignmentModel.Assignment.Description,
                    DueDate = FormatHelper.FromDatePicker(createAssignmentModel.Assignment.DueDate),
                    FinalWeight = createAssignmentModel.Assignment.FinalWeight,
                    IsExtraCredit = createAssignmentModel.Assignment.IsExtraCredit,
                    MidtermWeight = createAssignmentModel.Assignment.MidtermWeight,
                    Title = createAssignmentModel.Assignment.AssignmentTitle,
                    TotalGradePoints = createAssignmentModel.Assignment.PossiblePoints,
                };

                int templateId = createAssignmentModel.TemplateId;
                bool useManualWeights = createAssignmentModel.UseManualWeights;
                int result = -1;
                if (assignment.AssignmentDate > assignment.DueDate)
                    return Json(SerializationHelper.ToJsonResult(result));
                result = _assignmentTemplateService.CreateDetail(assignment, templateId, useManualWeights);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the assignment template share.
        /// </summary>
        /// <param name="createAssignmentTemplateShareModel">The create assignment template share model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Share/Create")]
        public JsonResult CreateAssignmentTemplateShare([FromBody] AssignmentTemplateShareCreationModel createAssignmentTemplateShareModel)
        {
            try
            {
                List<int> assignmentTemplateHeaders = createAssignmentTemplateShareModel.AssignmentTemplateHeaders;
                int sharedTo = createAssignmentTemplateShareModel.SharedTo;

                bool result = false;
                foreach (int assignmentTemplateHeaderId in assignmentTemplateHeaders)
                    result = _assignmentTemplateService.Share(assignmentTemplateHeaderId, sharedTo, Account.PersonId);

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the specified assignment template.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Delete")]
        public JsonResult Delete([FromBody] int id)
        {
            try
            {
                bool result = _assignmentTemplateService.Delete(id);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the assignments.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Assignment/DeleteAll")]
        public JsonResult DeleteAllAssignment([FromBody] int id)
        {
            try
            {
                bool result = _assignmentTemplateService.DeleteAssignments(id);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the assign.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Assign/Delete")]
        public JsonResult DeleteAssign([FromBody] int sectionId)
        {
            try
            {
                bool result = _assignmentTemplateService.UnAssign(sectionId);
                return Json(SerializationHelper.ToJsonResult(new { result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the assignment.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Assignment/Delete")]
        public JsonResult DeleteAssignment([FromBody] int id)
        {
            try
            {
                bool result = _assignmentTemplateService.DeleteDetail(id);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the assignment share.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Share/Delete")]
        public JsonResult DeleteAssignmentShare([FromBody] int id)
        {
            try
            {
                bool result = _assignmentTemplateService.UnShare(id);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the assignment section by dept head.
        /// </summary>
        /// <param name="assignmentSectionByDeptHeadModel">The assignment section by dept head model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Assign/List")]
        public JsonResult GetAssignmentSectionByDeptHead([FromBody] AssignmentSectionByDeptHeadModel assignmentSectionByDeptHeadModel)
        {
            try
            {
                int startIndex = assignmentSectionByDeptHeadModel.StartIndex;
                int length = assignmentSectionByDeptHeadModel.Length;
                int templateId = assignmentSectionByDeptHeadModel.TemplateId;

                (List<SectionCourseDate> sectionCourseDates, int overallCount) = _assignmentTemplateService.Get(startIndex, length, templateId, Account.PersonId);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<AssignmentSectionViewModel> assignmentSections = sectionCourseDates.ToViewModel(general);
                return Json(SerializationHelper.ToJsonResult(new { assignmentSections, overallCount }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Indexes the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates")]
        public JsonResult Index([FromBody] int id)
        {
            try
            {
                AssignmentTemplate assignmentTemplateDto = _assignmentTemplateService.Get(id, Account.PersonId);
                AssignmentTemplateGradeValidationResult sectionAssignmentValidationResult = _assignmentTemplateService.ValidateGrading(id, Account.PersonId);
                AssignmentTemplateViewModel assignmentTemplate = assignmentTemplateDto.ToViewModel();
                bool midtermGrades = _institutionSettingService.GetCourseManagement().MidtermGrades;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                SectionAssignmentSetupViewModel sectionAssignmentSetup = _assignmentTemplateService.GetTypeRules(id, Account.PersonId).ToViewModel(_settingService, general);
                return Json(SerializationHelper.ToJsonResult(new { assignmentTemplate, sectionAssignmentSetup, midtermGrades, sectionAssignmentValidationResult }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Validate the assignment name.
        /// </summary>
        /// <param name="isValidAssignmentNameModel">The is valid assignment name model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Assignment/IsValidName")]
        public JsonResult IsValidAssignmentName([FromBody] AssignmentNameValidationModel isValidAssignmentNameModel)
        {
            try
            {
                AssignmentTemplateDetail assignment = new()
                {
                    AssignmentDate = FormatHelper.FromDatePicker(isValidAssignmentNameModel.Assignment.AssignedDate),
                    AssignmentTemplateDetailId = isValidAssignmentNameModel.Assignment.AssignmentId,
                    AssignmentTypeId = isValidAssignmentNameModel.Assignment.AssignmentTypeId,
                    CountsForFinal = isValidAssignmentNameModel.Assignment.CountsForFinal,
                    CountsForMidterm = isValidAssignmentNameModel.Assignment.CountsForMidterm,
                    Description = isValidAssignmentNameModel.Assignment.Description,
                    DueDate = FormatHelper.FromDatePicker(isValidAssignmentNameModel.Assignment.DueDate),
                    FinalWeight = isValidAssignmentNameModel.Assignment.FinalWeight,
                    IsExtraCredit = isValidAssignmentNameModel.Assignment.IsExtraCredit,
                    MidtermWeight = isValidAssignmentNameModel.Assignment.MidtermWeight,
                    Title = isValidAssignmentNameModel.Assignment.AssignmentTitle,
                    TotalGradePoints = isValidAssignmentNameModel.Assignment.PossiblePoints
                };
                int templateId = isValidAssignmentNameModel.TemplateId;

                bool result = _assignmentTemplateService.IsValidDetailName(assignment, templateId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Retrieves the course templates with pagination
        /// </summary>
        /// <param name="listModel">The list model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/List")]
        public JsonResult List([FromBody] TemplateListModel listModel)
        {
            try
            {
                int sessionPeriodId = listModel.SessionPeriodId;
                int startIndex = listModel.StartIndex;
                int length = listModel.Length;

                (List<CourseTemplate> courseTemplatesDto, int overallCount) = _assignmentTemplateService.GetBySessionPeriod(startIndex, length, Account.PersonId, sessionPeriodId);
                List<CourseTemplateViewModel> courseTemplates = courseTemplatesDto.ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new { overallCount, courseTemplates }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Optionses this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Options")]
        public JsonResult Options()
        {
            try
            {
                List<ListOptionViewModel> departments = _departmentHeadService.GetDepartments(Account.PersonId).ToViewModel();
                List<ListOptionViewModel> subtypes = _codeTableService.GetByName(CodeTableName.EventSubType).ToViewModel();
                List<ListOptionViewModel> classLevels = _codeTableService.GetByName(CodeTableName.ClassLevel).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new { departments, subtypes, classLevels }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified assignment template.
        /// </summary>
        /// <param name="assignmentTemplateViewModel">The assignment template view model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Save")]
        public JsonResult Save([FromBody] AssignmentTemplateViewModel assignmentTemplateViewModel)
        {
            try
            {
                AssignmentTemplate assignmentTemplate = new()
                {
                    AssignmentTemplateHeaderId = assignmentTemplateViewModel.TemplateId,
                    AssignmentWeightingMethod = assignmentTemplateViewModel.AssignmentWeightingMethod,
                    AutomaticOverallGrades = assignmentTemplateViewModel.AutomaticOverallGrades,
                    CreatedBy = Account.PersonId,
                    DefaultGradeMapping = assignmentTemplateViewModel.DefaultGradeMapping,
                    IsDateByAssignmentType = assignmentTemplateViewModel.IsDateByAssignmentType,
                    IsRestrictive = assignmentTemplateViewModel.IsRestrictive,
                    Name = assignmentTemplateViewModel.Name,
                    SessionPeriodId = assignmentTemplateViewModel.SessionPeriodId ?? 0,
                    UseWeightedAssignmentTypes = assignmentTemplateViewModel.UseWeightedAssignmentTypes
                };
                int templateId = _assignmentTemplateService.Save(assignmentTemplate);
                return Json(SerializationHelper.ToJsonResult(templateId));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Shareds the specified assignment template header identifier.
        /// </summary>
        /// <param name="assignmentTemplateHeaderId">The assignment template header identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Share/List")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Shared([FromBody] int assignmentTemplateHeaderId)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<AssignmentTemplateShareViewModel> assignmentTemplateShares = _assignmentTemplateService.GetShared(
                    Account.PersonId, assignmentTemplateHeaderId, CurrentLinkId)
                    .ToViewModel(CurrentNameFormat, CurrentNameSort, general.PeopleIdFormat, ShowMiddleNameInitial);

                return Json(SerializationHelper.ToJsonResult(assignmentTemplateShares));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Templates the options.
        /// </summary>
        /// <param name="templateOptionsModel">The template options model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Assignment/Options")]
        public JsonResult TemplateOptions([FromBody] TemplateOptionsModel templateOptionsModel)
        {
            try
            {
                int sessionPeriodId = templateOptionsModel.SessionPeriodId;
                int assignmentTemplateHeader = templateOptionsModel.AssignmentTemplateHeader;

                AssignmentTemplateOptions options = _assignmentTemplateService.GetOptions(Account.PersonId, sessionPeriodId, assignmentTemplateHeader, false);
                List<ListOptionViewModel> periods = options.Periods.ToViewModel();
                List<ListOptionViewModel> templates = options.Templates.ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new { periods, templates }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Updates the assignment.
        /// </summary>
        /// <param name="updateAssignmentModel">The update assignment model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CourseTemplates/Assignment/Update")]
        public JsonResult UpdateAssignment([FromBody] AssignmentUpdateModel updateAssignmentModel)
        {
            try
            {
                List<Assignment> assignmentList = updateAssignmentModel.AssignmentList.ConvertAll(a =>
                {
                    return new Assignment()
                    {
                        AssignedDate = FormatHelper.FromDatePicker(a.AssignedDate),
                        AssignmentEndDate = FormatHelper.FromDatePicker(a.AssignmentEndDate),
                        AssignmentId = a.AssignmentId ?? 0,
                        AssignmentTemplateDetailId = a.Id ?? 0,
                        AssignmentTitle = a.Title,
                        AssignmentTypeDesc = a.AssignmentType,
                        AssignmentTypeId = a.AssignmentTypeId ?? 0,
                        AssignmentTypeRuleId = a.AssignmentTypeRuleId ?? 0,
                        CountsForFinal = a.CountsForFinal ?? false,
                        CountsForMidterm = a.CountsForMidterm ?? false,
                        Description = a.Description,
                        DueDate = FormatHelper.FromDatePicker(a.DueDate),
                        FinalWeight = a.FinalWeight ?? 0,
                        IsExtraCredit = a.IsExtraCredit ?? false,
                        MidtermWeight = a.MidtermWeight ?? 0,
                        PossiblePoints = a.PossiblePoints ?? 0,
                        TotalPoints = 0
                    };
                });

                List<AssignmentTypeRule> assignmentTypeList = updateAssignmentModel.AssignmentTypeList.ConvertAll(at =>
                {
                    return new AssignmentTypeRule()
                    {
                        AssignmentTypeRuleId = at.AssignmentTypeRuleId ?? 0,
                        AssignmentTypeDesc = at.Description,
                        EndDate = FormatHelper.FromDatePicker(at.EndDate),
                        FinalDropHighest = at.FinalDropHighest,
                        FinalDropLowest = at.FinalDropLowest,
                        FinalWeight = at.FinalWeight,
                        AssignmentTypeId = at.Id,
                        MidtermDropHighest = at.MidtermDropHighest,
                        MidtermDropLowest = at.MidtermDropLowest,
                        MidtermWeight = at.MidtermWeight,
                        Assignments = at.SectionAssignments.ConvertAll(a =>
                        {
                            return new Assignment()
                            {
                                AssignedDate = FormatHelper.FromDatePicker(a.AssignedDate),
                                AssignmentEndDate = FormatHelper.FromDatePicker(a.AssignmentEndDate),
                                AssignmentId = a.AssignmentId ?? 0,
                                AssignmentTitle = a.Title,
                                AssignmentTypeDesc = a.AssignmentType,
                                AssignmentTypeId = a.AssignmentTypeId ?? 0,
                                AssignmentTypeRuleId = a.AssignmentTypeRuleId ?? 0,
                                CountsForFinal = a.CountsForFinal ?? false,
                                CountsForMidterm = a.CountsForMidterm ?? false,
                                Description = a.Description,
                                DueDate = FormatHelper.FromDatePicker(a.DueDate),
                                PossiblePoints = a.PossiblePoints ?? 0,
                                FinalWeight = (decimal)a.FinalWeight,
                                IsExtraCredit = a.IsExtraCredit ?? false,
                                MidtermWeight = a.MidtermWeight ?? 0,
                                SectionId = a.Id ?? 0,
                                TotalPoints = 0
                            };
                        })
                    };
                });

                bool result = _assignmentTemplateService.UpdateAssignments(assignmentList, assignmentTypeList);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}