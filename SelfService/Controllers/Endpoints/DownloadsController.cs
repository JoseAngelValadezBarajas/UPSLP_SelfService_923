// --------------------------------------------------------------------
// <copyright file="DownloadsController.cs" company="Ellucian">
//     Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Advisees;
using SelfService.Models.Classes;
using SelfService.Models.Download;
using SelfService.Models.ResourcesTypes.Downloads;
using SelfService.Models.Section;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Run = DocumentFormat.OpenXml.Wordprocessing.Run;
using Table = DocumentFormat.OpenXml.Wordprocessing.Table;
using Text = DocumentFormat.OpenXml.Wordprocessing.Text;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Downloads route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class DownloadsController : BaseEndpointController
    {
        /// <summary>
        /// The advisee service
        /// </summary>
        private readonly IAdviseeService _adviseeService;

        /// <summary>
        /// The attendance service
        /// </summary>
        private readonly IAttendanceService _attendanceService;

        /// <summary>
        /// The department head service
        /// </summary>
        private readonly IDepartmentHeadService _departmentHeadService;

        /// <summary>
        /// The faculty assistant service
        /// </summary>
        private readonly IFacultyAssistantService _facultyAssistantService;

        /// <summary>
        /// The grade service
        /// </summary>
        private readonly IGradeService _gradeService;

        /// <summary>
        /// The institution Setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<DownloadsController> _logger;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

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
        /// The view engine
        /// </summary>
        private readonly ICompositeViewEngine _viewEngine;

        /// <summary>
        /// The violation service
        /// </summary>
        private readonly IViolationService _violationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="DownloadsController" /> class.
        /// </summary>
        /// <param name="adviseeService">The advisee service.</param>
        /// <param name="attendanceService">The attendance service.</param>
        /// <param name="departmentHeadService">The department head service.</param>
        /// <param name="facultyAssistantService">The faculty assistant service.</param>
        /// <param name="gradeService">The grade service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="sectionService">The section service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="viewEngine">The view engine.</param>
        /// <param name="violationService">The violation service.</param>
        /// <param name="logger">The logger.</param>
        public DownloadsController(
            IAdviseeService adviseeService,
            IAttendanceService attendanceService,
            ICompositeViewEngine viewEngine,
            IDepartmentHeadService departmentHeadService,
            IFacultyAssistantService facultyAssistantService,
            IGradeService gradeService,
            IInstitutionSettingService institutionSettingService,
            IPeopleService peopleService,
            IPictureHelper pictureHelper,
            IResourcesHelper resourcesHelper,
            ISectionService sectionService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            ISettingService settingService,
            IViolationService violationService,
            IAppLogger<DownloadsController> logger)
            : base(serializationHelper)
        {
            _adviseeService = adviseeService;
            _attendanceService = attendanceService;
            _departmentHeadService = departmentHeadService;
            _facultyAssistantService = facultyAssistantService;
            _gradeService = gradeService;
            _institutionSettingService = institutionSettingService;
            _peopleService = peopleService;
            _pictureHelper = pictureHelper;
            _resourcesHelper = resourcesHelper;
            _sectionService = sectionService;
            _settingHelper = settingHelper;
            _settingService = settingService;
            _viewEngine = viewEngine;
            _violationService = violationService;

            _logger = logger;
        }

        /// <summary>
        /// Get download model
        /// </summary>
        /// <param name="filename">The filename.</param>
        /// <param name="fileType">Type of the file.</param>
        /// <param name="view">The view.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [Route("Downloads/{filename}/{fileType}/{view}/{sectionId?}")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public async Task<FileContentResult> Index(string filename, int fileType, int view, int? sectionId)
        {
            try
            {
                DownloadModel downloadModel = new()
                {
                    FileName = filename,
                    FileType = (EnumDownloadFileType)fileType,
                    View = (EnumDownloadView)view
                };

                switch (downloadModel.FileType)
                {
                    case EnumDownloadFileType.Html:
                    case EnumDownloadFileType.Doc:
                    case EnumDownloadFileType.Xls:
                        return await GetHtmlContent(downloadModel.View, downloadModel, sectionId);

                    case EnumDownloadFileType.Docx:
                    case EnumDownloadFileType.Xlsx:
                    case EnumDownloadFileType.Tsv:
                        return GetFileContent(downloadModel.View, downloadModel, '\t', sectionId);

                    case EnumDownloadFileType.Csv:
                        return GetFileContent(downloadModel.View, downloadModel, ',', sectionId);
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return null;
        }

        /// <summary>Manages the advisees.</summary>
        /// <param name="adviseeSearchModel">The advisee search model.</param>
        /// <param name="downloadModel">The download model.</param>
        /// <returns></returns>
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public async Task<FileContentResult> ManageAdvisees(AdviseeSearchModel adviseeSearchModel, DownloadModel downloadModel)
        {
            try
            {
                switch (downloadModel.FileType)
                {
                    case EnumDownloadFileType.Html:
                    case EnumDownloadFileType.Doc:
                    case EnumDownloadFileType.Xls:
                        return await GetHtmlContentAdvisees(adviseeSearchModel, downloadModel);

                    case EnumDownloadFileType.Docx:
                    case EnumDownloadFileType.Xlsx:
                    case EnumDownloadFileType.Tsv:
                        return GetFileContentAdvisees(adviseeSearchModel, downloadModel, '\t');

                    case EnumDownloadFileType.Csv:
                        return GetFileContentAdvisees(adviseeSearchModel, downloadModel, ',');
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return null;
        }

        #region Private Methods

        /// <summary>
        /// Construct the cells requires for a excel document
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="dataType">The data type.</param>
        /// <returns></returns
        private static Cell ConstructCell(string value, CellValues dataType)
        {
            return new Cell()
            {
                CellValue = new CellValue(value),
                DataType = new EnumValue<CellValues>(dataType)
            };
        }

        /// <summary>
        /// Construct the cells requires for a word document
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns></returns
        private static TableCell ConstructCell(string value) => new(new Paragraph(new Run(new Text(value))));

        /// <summary>
        /// Create a excel document with the xlsx extension
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns
        private static byte[] CreateExcelDocument(object model)
        {
            MemoryStream memoryStream = new();
            SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Create(memoryStream, SpreadsheetDocumentType.Workbook);

            WorkbookPart workbookpart = spreadsheetDocument.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();
            WorksheetPart worksheetPart = workbookpart.AddNewPart<WorksheetPart>();

            SheetData sheetData = new();
            worksheetPart.Worksheet = new Worksheet(sheetData);
            Sheets sheets = spreadsheetDocument.WorkbookPart.Workbook.AppendChild(new Sheets());
            Sheet sheet = new() { Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "Sheet1" };
            sheets.Append(sheet);

            Row headerRow = new();

            switch (model)
            {
                case SectionEnrollmentDownloadViewModel sectionEnrollmentDownload:
                    headerRow.Append(
                        ConstructCell(sectionEnrollmentDownload.Resources.LblFullname, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblPeopleId, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblWithdrawn, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblEmail, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblCurriculum, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblClassLevel, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblClassLoad, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblCreditType, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblCredits, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblAttendance, CellValues.String),
                        ConstructCell(sectionEnrollmentDownload.Resources.LblStatusHeader, CellValues.String)
                    );

                    sheetData.AppendChild(headerRow);

                    foreach (StudentEnrollmentDownload student in sectionEnrollmentDownload.Students)
                    {
                        Row dataRow = new();
                        string statusName = student.Status switch
                        {
                            "A" => "Add",
                            "D" => "Drop",
                            "H" => "Hold",
                            _ => "-",
                        };

                        dataRow.Append(
                            ConstructCell(student.FullName, CellValues.String),
                            ConstructCell(student.PeopleId, CellValues.String),
                            ConstructCell(student.Withdrawn ? sectionEnrollmentDownload.Resources.LblWithdrawn : string.Empty, CellValues.String),
                            ConstructCell(student.Email, CellValues.String),
                            ConstructCell(student.Curriculum, CellValues.String),
                            ConstructCell(student.ClassLevel, CellValues.String),
                            ConstructCell(student.ClassLoad, CellValues.String),
                            ConstructCell(student.CreditType, CellValues.String),
                            ConstructCell(student.Credits, CellValues.String),
                            ConstructCell(student.Attendance, CellValues.String),
                            ConstructCell(statusName, CellValues.String)
                        );

                        sheetData.AppendChild(dataRow);
                    }
                    break;

                case SectionViolationDownloadViewModel sectionViolations:
                    headerRow.Append(
                        ConstructCell(sectionViolations.Resources.LblName, CellValues.String),
                        ConstructCell(sectionViolations.Resources.LblPeopleId, CellValues.String),
                        ConstructCell(sectionViolations.Resources.LblWithdrawn, CellValues.String),
                        ConstructCell(sectionViolations.Resources.LblCategory, CellValues.String),
                        ConstructCell(sectionViolations.Resources.LblViolation, CellValues.String),
                        ConstructCell(sectionViolations.Resources.LblDate, CellValues.String)
                    );

                    sheetData.AppendChild(headerRow);

                    foreach (StudentViolationDownloadModel student in sectionViolations.Students)
                    {
                        Row dataRow = new();

                        dataRow.Append(
                            ConstructCell(student.FullName, CellValues.String),
                            ConstructCell(student.PeopleId, CellValues.String),
                            ConstructCell(student.Withdrawn ? sectionViolations.Resources.LblWithdrawn : string.Empty, CellValues.String),
                            ConstructCell(student.CategoryDesc, CellValues.String),
                            ConstructCell(student.ViolationDesc, CellValues.String),
                            ConstructCell(student.Date, CellValues.String)
                        );

                        sheetData.AppendChild(dataRow);
                    }
                    break;

                case SectionAttendanceDownloadViewModel sectionAttendanceDownloadViewModel:
                    headerRow.Append(
                        ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblName, CellValues.String),
                        ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblPeopleId, CellValues.String),
                        ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblWithdrawn, CellValues.String),
                        ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblEmail, CellValues.String),
                        ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblOverallAttendance, CellValues.String),
                        ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblLastDateAttended, CellValues.String)
                    );

                    sheetData.AppendChild(headerRow);

                    foreach (SectionAttendanceStudentDownloadViewModel student in sectionAttendanceDownloadViewModel.Students)
                    {
                        Row dataRow = new();

                        dataRow.Append(
                            ConstructCell(student.FullName, CellValues.String),
                            ConstructCell(student.PeopleId, CellValues.String),
                            ConstructCell(student.Withdrawn ? sectionAttendanceDownloadViewModel.Resources.LblWithdrawn : string.Empty, CellValues.String),
                            ConstructCell(student.Email, CellValues.String),
                            ConstructCell(student.OverallAttendance, CellValues.String),
                            ConstructCell(student.LastDateAttended, CellValues.String)
                        );

                        sheetData.AppendChild(dataRow);
                    }
                    break;

                case SectionStatisticsDownloadViewModel sectionStatisticDownloadViewModel:
                    headerRow.Append(
                        ConstructCell(sectionStatisticDownloadViewModel.Resources.LblPeriod, CellValues.String),
                        ConstructCell(sectionStatisticDownloadViewModel.Resources.LblPercentIncluded, CellValues.String),
                        ConstructCell(sectionStatisticDownloadViewModel.Resources.LblAverageScore, CellValues.String),
                        ConstructCell(sectionStatisticDownloadViewModel.Resources.LblHighScore, CellValues.String),
                        ConstructCell(sectionStatisticDownloadViewModel.Resources.LblLowScore, CellValues.String),
                        ConstructCell(sectionStatisticDownloadViewModel.Resources.LblStandardDeviation, CellValues.String),
                        ConstructCell(sectionStatisticDownloadViewModel.Resources.LblVariance, CellValues.String)
                    );

                    sheetData.AppendChild(headerRow);

                    foreach (SectionStatisticDownloadViewModel statistic in sectionStatisticDownloadViewModel.Statistic)
                    {
                        Row dataRow = new();

                        dataRow.Append(
                            ConstructCell(statistic.IsMidterm ? sectionStatisticDownloadViewModel.Resources.LblMidTerm : sectionStatisticDownloadViewModel.Resources.LblFinal, CellValues.String),
                            ConstructCell(statistic.PercentIncluded, CellValues.String),
                            ConstructCell(statistic.AverageScore, CellValues.String),
                            ConstructCell(statistic.HighScore, CellValues.String),
                            ConstructCell(statistic.LowScore, CellValues.String),
                            ConstructCell(statistic.StandardDeviation, CellValues.String),
                            ConstructCell(statistic.Variance, CellValues.String)
                        );

                        sheetData.AppendChild(dataRow);
                    }
                    break;

                case OverallGradesDownloadViewModel gradesDownload:
                    headerRow.Append(
                        ConstructCell(gradesDownload.Resources.LblName, CellValues.String),
                        ConstructCell(gradesDownload.Resources.LblPeopleId, CellValues.String),
                        ConstructCell(gradesDownload.Resources.LblWithdrawn, CellValues.String),
                        ConstructCell(gradesDownload.Resources.LblCreditType, CellValues.String),
                        ConstructCell(gradesDownload.Resources.LblMidtermScore, CellValues.String),
                        ConstructCell(gradesDownload.Resources.LblMidtermSubmitted, CellValues.String),
                        ConstructCell(gradesDownload.Resources.LblMidtermApproved, CellValues.String),
                        ConstructCell(gradesDownload.Resources.LblFinalScore, CellValues.String),
                        ConstructCell(gradesDownload.Resources.LblFinalSubmitted, CellValues.String),
                        ConstructCell(gradesDownload.Resources.LblFinalApproved, CellValues.String)
                    );

                    sheetData.AppendChild(headerRow);

                    foreach (OverallGradeStudentDownloadViewModel student in gradesDownload.Students)
                    {
                        Row dataRow = new();

                        dataRow.Append(
                            ConstructCell(student.Name, CellValues.String),
                            ConstructCell(student.PeopleId, CellValues.String),
                            ConstructCell(student.Withdrawn ? gradesDownload.Resources.LblWithdrawn : string.Empty, CellValues.String),
                            ConstructCell(student.CreditType, CellValues.String),
                            ConstructCell(student.MidtermPoints, CellValues.String),
                            ConstructCell(student.MidtermInstructorGrade, CellValues.String),
                            ConstructCell(student.MidtermTranscriptGrade, CellValues.String),
                            ConstructCell(student.FinalPoints, CellValues.String),
                            ConstructCell(student.FinalInstructorGrade, CellValues.String),
                            ConstructCell(student.FinalTranscriptGrade, CellValues.String)
                        );

                        sheetData.AppendChild(dataRow);
                    }
                    break;

                case SectionAttendanceDailyDownloadViewModel sectionAttendanceDailyDownloadViewModel:
                    headerRow.Append(
                        ConstructCell(sectionAttendanceDailyDownloadViewModel.Resources.LblName, CellValues.String),
                        ConstructCell(sectionAttendanceDailyDownloadViewModel.Resources.LblPeopleId, CellValues.String),
                        ConstructCell(sectionAttendanceDailyDownloadViewModel.Resources.LblWithdrawn, CellValues.String),
                        ConstructCell(sectionAttendanceDailyDownloadViewModel.Resources.LblEmail, CellValues.String)
                    );

                    foreach (StudentMeetingAttendanceCalendarViewModel attendance in sectionAttendanceDailyDownloadViewModel.Students[0].MeetingAttendances)
                    {
                        headerRow.Append(ConstructCell(attendance.CalendarDate, CellValues.String));
                    }

                    sheetData.AppendChild(headerRow);

                    foreach (StudentMeetingAttendanceDownloadViewModel student in sectionAttendanceDailyDownloadViewModel.Students)
                    {
                        Row dataRow = new();

                        dataRow.Append(
                            ConstructCell(student.FullName, CellValues.String),
                            ConstructCell(student.PeopleId, CellValues.String),
                            ConstructCell(student.MeetingAttendances[0].Withdrawn ? sectionAttendanceDailyDownloadViewModel.Resources.LblWithdrawn : string.Empty, CellValues.String),
                            ConstructCell(student.Email, CellValues.String)
                        );

                        foreach (StudentMeetingAttendanceCalendarViewModel attendance in student.MeetingAttendances)
                        {
                            dataRow.Append(ConstructCell(attendance.AttendanceStatusDesc, CellValues.String));
                        }

                        sheetData.AppendChild(dataRow);
                    }
                    break;

                case AdviseeDownloadViewModel adviseeDownloadViewModel:
                    headerRow.Append(
                        ConstructCell(adviseeDownloadViewModel.Resources.LblFullname, CellValues.String),
                        ConstructCell(adviseeDownloadViewModel.Resources.LblPendingSchedule, CellValues.String),
                        ConstructCell(adviseeDownloadViewModel.Resources.LblStoplist, CellValues.String),
                        ConstructCell(adviseeDownloadViewModel.Resources.LblPeopleId, CellValues.String)
                    );

                    sheetData.AppendChild(headerRow);

                    foreach (AdviseesDownloadViewModel advise in adviseeDownloadViewModel.Advisees)
                    {
                        Row dataRow = new();

                        dataRow.Append(
                            ConstructCell(advise.FullName, CellValues.String),
                            ConstructCell(advise.HasPendingSchedules, CellValues.String),
                            ConstructCell(advise.HasStoplist, CellValues.String),
                            ConstructCell(advise.PeopleId, CellValues.String)
                        );

                        sheetData.AppendChild(dataRow);
                    }
                    break;
            }

            workbookpart.Workbook.Save();
            spreadsheetDocument.Close();
            byte[] data = memoryStream.ToArray();

            return data;
        }

        /// <summary>
        /// Create a word document with the docx extension
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns
        private static byte[] CreateWordDocument(object model)
        {
            MemoryStream memoryStream = new();

            using (WordprocessingDocument doc = WordprocessingDocument.Create(memoryStream, WordprocessingDocumentType.Document))
            {
                MainDocumentPart mainPart = doc.AddMainDocumentPart();

                mainPart.Document = new Document();
                Body body = mainPart.Document.AppendChild(new Body());

                Table table = new();
                TableProperties tableProperties = new();
                TableWidth tableWidth = new() { Width = "5000", Type = TableWidthUnitValues.Pct };

                tableProperties.Append(tableWidth);
                table.AppendChild(tableProperties);

                TableRow headerRow = new();

                switch (model)
                {
                    case SectionEnrollmentDownloadViewModel sectionEnrollmentDownload:
                        TableGrid tableGridList = new(new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(),
                            new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn());
                        table.AppendChild(tableGridList);

                        headerRow.Append(
                            ConstructCell(sectionEnrollmentDownload.Resources.LblFullname),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblPeopleId),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblWithdrawn),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblEmail),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblCurriculum),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblClassLevel),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblClassLoad),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblCreditType),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblCredits),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblAttendance),
                            ConstructCell(sectionEnrollmentDownload.Resources.LblStatusHeader)
                        );

                        table.AppendChild(headerRow);

                        foreach (StudentEnrollmentDownload student in sectionEnrollmentDownload.Students)
                        {
                            TableRow dataRow = new();

                            string statusName = student.Status switch
                            {
                                "A" => "Add",
                                "D" => "Drop",
                                "H" => "Hold",
                                _ => "-",
                            };

                            dataRow.Append(
                                ConstructCell(student.FullName),
                                ConstructCell(student.PeopleId),
                                ConstructCell(student.Withdrawn ? sectionEnrollmentDownload.Resources.LblWithdrawn : string.Empty),
                                ConstructCell(student.Email),
                                ConstructCell(student.Curriculum),
                                ConstructCell(student.ClassLevel),
                                ConstructCell(student.ClassLoad),
                                ConstructCell(student.CreditType),
                                ConstructCell(student.Credits),
                                ConstructCell(student.Attendance),
                                ConstructCell(statusName)
                            );

                            table.AppendChild(dataRow);
                        }
                        break;

                    case SectionViolationDownloadViewModel sectionViolations:
                        TableGrid tableGridViolation = new(new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn());
                        table.AppendChild(tableGridViolation);

                        headerRow.Append(
                            ConstructCell(sectionViolations.Resources.LblName),
                            ConstructCell(sectionViolations.Resources.LblPeopleId),
                            ConstructCell(sectionViolations.Resources.LblWithdrawn),
                            ConstructCell(sectionViolations.Resources.LblCategory),
                            ConstructCell(sectionViolations.Resources.LblViolation),
                            ConstructCell(sectionViolations.Resources.LblDate)
                        );

                        table.AppendChild(headerRow);

                        foreach (StudentViolationDownloadModel student in sectionViolations.Students)
                        {
                            TableRow dataRow = new();

                            dataRow.Append(
                                ConstructCell(student.FullName),
                                ConstructCell(student.PeopleId),
                                ConstructCell(student.Withdrawn ? sectionViolations.Resources.LblWithdrawn : string.Empty),
                                ConstructCell(student.CategoryDesc),
                                ConstructCell(student.ViolationDesc),
                                ConstructCell(student.Date)
                            );

                            table.AppendChild(dataRow);
                        }
                        break;

                    case SectionAttendanceDownloadViewModel sectionAttendanceDownloadViewModel:
                        TableGrid tableGridAttendance = new(new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn());
                        table.AppendChild(tableGridAttendance);

                        headerRow.Append(
                            ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblName),
                            ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblPeopleId),
                            ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblWithdrawn),
                            ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblEmail),
                            ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblOverallAttendance),
                            ConstructCell(sectionAttendanceDownloadViewModel.Resources.LblLastDateAttended)
                        );

                        table.AppendChild(headerRow);

                        foreach (SectionAttendanceStudentDownloadViewModel student in sectionAttendanceDownloadViewModel.Students)
                        {
                            TableRow dataRow = new();

                            dataRow.Append(
                                ConstructCell(student.FullName),
                                ConstructCell(student.PeopleId),
                                ConstructCell(student.Withdrawn ? sectionAttendanceDownloadViewModel.Resources.LblWithdrawn : string.Empty),
                                ConstructCell(student.Email),
                                ConstructCell(student.OverallAttendance),
                                ConstructCell(student.LastDateAttended)
                            );

                            table.AppendChild(dataRow);
                        }
                        break;

                    case SectionStatisticsDownloadViewModel sectionStatisticDownloadViewModel:
                        TableGrid tableGridStatistics = new(new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(),
                        new GridColumn(), new GridColumn());
                        table.AppendChild(tableGridStatistics);

                        headerRow.Append(
                            ConstructCell(sectionStatisticDownloadViewModel.Resources.LblPeriod),
                            ConstructCell(sectionStatisticDownloadViewModel.Resources.LblPercentIncluded),
                            ConstructCell(sectionStatisticDownloadViewModel.Resources.LblAverageScore),
                            ConstructCell(sectionStatisticDownloadViewModel.Resources.LblHighScore),
                            ConstructCell(sectionStatisticDownloadViewModel.Resources.LblLowScore),
                            ConstructCell(sectionStatisticDownloadViewModel.Resources.LblStandardDeviation),
                            ConstructCell(sectionStatisticDownloadViewModel.Resources.LblVariance)
                        );

                        table.AppendChild(headerRow);

                        foreach (SectionStatisticDownloadViewModel statistic in sectionStatisticDownloadViewModel.Statistic)
                        {
                            TableRow dataRow = new();

                            dataRow.Append(
                                ConstructCell(statistic.IsMidterm ? sectionStatisticDownloadViewModel.Resources.LblMidTerm : sectionStatisticDownloadViewModel.Resources.LblFinal),
                                ConstructCell(statistic.PercentIncluded),
                                ConstructCell(statistic.AverageScore),
                                ConstructCell(statistic.HighScore),
                                ConstructCell(statistic.LowScore),
                                ConstructCell(statistic.StandardDeviation),
                                ConstructCell(statistic.Variance)
                            );

                            table.AppendChild(dataRow);
                        }
                        break;

                    case OverallGradesDownloadViewModel gradesDownload:
                        TableGrid tableGridOverallGrades = new(new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(),
                        new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn());
                        table.AppendChild(tableGridOverallGrades);

                        headerRow.Append(
                            ConstructCell(gradesDownload.Resources.LblName),
                            ConstructCell(gradesDownload.Resources.LblPeopleId),
                            ConstructCell(gradesDownload.Resources.LblWithdrawn),
                            ConstructCell(gradesDownload.Resources.LblCreditType),
                            ConstructCell(gradesDownload.Resources.LblMidtermScore),
                            ConstructCell(gradesDownload.Resources.LblMidtermSubmitted),
                            ConstructCell(gradesDownload.Resources.LblMidtermApproved),
                            ConstructCell(gradesDownload.Resources.LblFinalScore),
                            ConstructCell(gradesDownload.Resources.LblFinalSubmitted),
                            ConstructCell(gradesDownload.Resources.LblFinalApproved)
                        );

                        table.AppendChild(headerRow);

                        foreach (OverallGradeStudentDownloadViewModel student in gradesDownload.Students)
                        {
                            TableRow dataRow = new();

                            dataRow.Append(
                                ConstructCell(student.Name),
                                ConstructCell(student.PeopleId),
                                ConstructCell(student.Withdrawn ? gradesDownload.Resources.LblWithdrawn : string.Empty),
                                ConstructCell(student.CreditType),
                                ConstructCell(student.MidtermPoints),
                                ConstructCell(student.MidtermInstructorGrade),
                                ConstructCell(student.MidtermTranscriptGrade),
                                ConstructCell(student.FinalPoints),
                                ConstructCell(student.FinalInstructorGrade),
                                ConstructCell(student.FinalTranscriptGrade)
                            );

                            table.AppendChild(dataRow);
                        }
                        break;

                    case AdviseeDownloadViewModel adviseeDownloadViewModel:
                        TableGrid tableGridAdvisee = new(new GridColumn(), new GridColumn(), new GridColumn(), new GridColumn());
                        table.AppendChild(tableGridAdvisee);

                        headerRow.Append(
                            ConstructCell(adviseeDownloadViewModel.Resources.LblFullname),
                            ConstructCell(adviseeDownloadViewModel.Resources.LblPendingSchedule),
                            ConstructCell(adviseeDownloadViewModel.Resources.LblStoplist),
                            ConstructCell(adviseeDownloadViewModel.Resources.LblPeopleId)
                        );

                        table.AppendChild(headerRow);

                        foreach (AdviseesDownloadViewModel advise in adviseeDownloadViewModel.Advisees)
                        {
                            TableRow dataRow = new();

                            dataRow.Append(
                                ConstructCell(advise.FullName),
                                ConstructCell(advise.HasPendingSchedules),
                                ConstructCell(advise.HasStoplist),
                                ConstructCell(advise.PeopleId)
                            );

                            table.AppendChild(dataRow);
                        }
                        break;
                }

                doc.MainDocumentPart.Document.Body.Append(table);
                doc.MainDocumentPart.Document.Save();
            }

            byte[] data = memoryStream.ToArray();

            return data;
        }

        /// <summary>
        /// Gets the advisees to string.
        /// </summary>
        /// <param name="adviseeDownloadViewModel">The advisee download view model.</param>
        /// <param name="separator">The separator.</param>
        /// <returns></returns>
        private string AdviseesToString(AdviseeDownloadViewModel adviseeDownloadViewModel, char separator)
        {
            StringBuilder rows = new();
            try
            {
                rows.Append(adviseeDownloadViewModel.Resources.LblFullname).Append(separator);
                rows.Append(adviseeDownloadViewModel.Resources.LblPendingSchedule).Append(separator);
                rows.Append(adviseeDownloadViewModel.Resources.LblStoplist).Append(separator);
                rows.AppendLine(adviseeDownloadViewModel.Resources.LblPeopleId);
                foreach (AdviseesDownloadViewModel item in adviseeDownloadViewModel.Advisees)
                {
                    StringBuilder row = new();
                    if (separator == ',')
                        item.FullName = @"""" + item.FullName + @"""";
                    row.Append(item.FullName).Append(separator);
                    row.Append(item.HasPendingSchedules).Append(separator);
                    row.Append(item.HasStoplist).Append(separator);
                    row.AppendLine(item.PeopleId);
                    rows.Append(row);
                }
                rows.Remove(rows.Length - 1, 1);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return rows.ToString();
        }

        /// <summary>
        /// Gets the attendance to string.
        /// </summary>
        /// <param name="attendanceDailyDownloadViewModel">The section attendance download view model.</param>
        /// <param name="separator">The separator.</param>
        /// <returns></returns>
        /// <exception cref="System.NotImplementedException"></exception>
        private string AttendanceDailyToString(SectionAttendanceDailyDownloadViewModel attendanceDailyDownloadViewModel, char separator)
        {
            StringBuilder rows = new();
            int countStudent = 0;

            try
            {
                rows.Append(attendanceDailyDownloadViewModel.Resources.LblName).Append(separator);
                rows.Append(attendanceDailyDownloadViewModel.Resources.LblPeopleId).Append(separator);
                rows.Append(attendanceDailyDownloadViewModel.Resources.LblWithdrawn).Append(separator);
                rows.Append(attendanceDailyDownloadViewModel.Resources.LblEmail).Append(separator);
                foreach (StudentMeetingAttendanceCalendarViewModel item in attendanceDailyDownloadViewModel.Students[countStudent].MeetingAttendances)
                    rows.Append(item.CalendarDate).Append(separator);
                rows.AppendLine();
                foreach (StudentMeetingAttendanceDownloadViewModel student in attendanceDailyDownloadViewModel.Students)
                {
                    StringBuilder row = new();
                    if (separator == ',')
                        student.FullName = @"""" + student.FullName + @"""";
                    row.Append(student.FullName).Append(separator);
                    row.Append(student.PeopleId).Append(separator);
                    row.Append(student.MeetingAttendances[0].Withdrawn ? attendanceDailyDownloadViewModel.Resources.LblWithdrawn : string.Empty).Append(separator);
                    row.Append(student.Email).Append(separator);
                    foreach (StudentMeetingAttendanceCalendarViewModel status in student.MeetingAttendances)
                        row.Append(status.AttendanceStatusDesc).Append(separator);
                    rows.AppendLine();
                    rows.Append(row);
                    countStudent++;
                }
                rows.Remove(rows.Length - 1, 1);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return rows.ToString();
        }

        /// <summary>
        /// Gets the attendance to string.
        /// </summary>
        /// <param name="attendanceDownloadViewModel">The section attendance download view model.</param>
        /// <param name="separator">The separator.</param>
        /// <param name="courseManagement">Settings to show/hide columns</param>
        /// <returns></returns>
        /// <exception cref="System.NotImplementedException"></exception>
        private string AttendanceToString(SectionAttendanceDownloadViewModel attendanceDownloadViewModel, char separator, InstitutionSettings.CourseManagement courseManagement)
        {
            StringBuilder rows = new();
            try
            {
                rows.Append(attendanceDownloadViewModel.Resources.LblName).Append(separator);
                rows.Append(attendanceDownloadViewModel.Resources.LblPeopleId).Append(separator);
                rows.Append(attendanceDownloadViewModel.Resources.LblWithdrawn).Append(separator);
                rows.Append(attendanceDownloadViewModel.Resources.LblEmail).Append(separator);
                if (courseManagement.ShowDailyAttendance)
                {
                    rows.Append(attendanceDownloadViewModel.Resources.LblExcusedAbsence).Append(separator);
                    rows.Append(attendanceDownloadViewModel.Resources.LblUnexcusedAbsence).Append(separator);
                    rows.Append(attendanceDownloadViewModel.Resources.LblExcusedTardiness).Append(separator);
                    if (!courseManagement.ShowOverallAttendance)
                        rows.AppendLine(attendanceDownloadViewModel.Resources.LblUnexcusedTardiness);
                    else
                        rows.Append(attendanceDownloadViewModel.Resources.LblUnexcusedTardiness).Append(separator);
                }
                if (courseManagement.ShowOverallAttendance)
                {
                    rows.Append(attendanceDownloadViewModel.Resources.LblOverallAttendance).Append(separator);
                    rows.AppendLine(attendanceDownloadViewModel.Resources.LblLastDateAttended);
                }
                foreach (SectionAttendanceStudentDownloadViewModel item in attendanceDownloadViewModel.Students)
                {
                    StringBuilder row = new();
                    if (separator == ',')
                        item.FullName = @"""" + item.FullName + @"""";
                    row.Append(item.FullName).Append(separator);
                    row.Append(item.PeopleId).Append(separator);
                    row.Append(item.Withdrawn ? attendanceDownloadViewModel.Resources.LblWithdrawn : string.Empty).Append(separator);
                    row.Append(item.Email).Append(separator);
                    if (courseManagement.ShowDailyAttendance)
                    {
                        row.Append(item.ExcusedAbsence).Append(separator);
                        row.Append(item.UnexcusedAbsence).Append(separator);
                        row.Append(item.ExcusedTardiness).Append(separator);
                        if (!courseManagement.ShowOverallAttendance)
                            row.AppendLine(item.UnexcusedTardiness.ToString());
                        else
                            row.Append(item.UnexcusedTardiness).Append(separator);
                    }
                    if (courseManagement.ShowOverallAttendance)
                    {
                        row.Append(item.OverallAttendance).Append(separator);
                        row.AppendLine(item.LastDateAttended);
                    }
                    rows.Append(row);
                }
                rows.Remove(rows.Length - 1, 1);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return rows.ToString();
        }

        /// <summary>
        /// Gets the class list to string.
        /// </summary>
        /// <param name="sectionEnrollmentDownload">The section enrollment download.</param>
        /// <param name="separator">The separator.</param>
        /// <returns></returns>
        private string ClassListToString(SectionEnrollmentDownloadViewModel sectionEnrollmentDownload, char separator)
        {
            StringBuilder rows = new();
            try
            {
                rows.Append(sectionEnrollmentDownload.Resources.LblFullname).Append(separator);
                rows.Append(sectionEnrollmentDownload.Resources.LblPeopleId).Append(separator);
                rows.Append(sectionEnrollmentDownload.Resources.LblWithdrawn).Append(separator);
                rows.Append(sectionEnrollmentDownload.Resources.LblEmail).Append(separator);
                rows.Append(sectionEnrollmentDownload.Resources.LblCurriculum).Append(separator);
                rows.Append(sectionEnrollmentDownload.Resources.LblClassLevel).Append(separator);
                rows.Append(sectionEnrollmentDownload.Resources.LblClassLoad).Append(separator);
                rows.Append(sectionEnrollmentDownload.Resources.LblCreditType).Append(separator);
                rows.Append(sectionEnrollmentDownload.Resources.LblCredits).Append(separator);
                rows.Append(sectionEnrollmentDownload.Resources.LblAttendance).Append(separator);
                rows.AppendLine(sectionEnrollmentDownload.Resources.LblStatusHeader);
                foreach (StudentEnrollmentDownload studentDownload in sectionEnrollmentDownload.Students)
                {
                    StringBuilder row = new();
                    if (separator == ',')
                        studentDownload.FullName = @"""" + studentDownload.FullName + @"""";
                    row.Append(studentDownload.FullName).Append(separator);
                    row.Append(studentDownload.PeopleId).Append(separator);
                    if (studentDownload.Withdrawn)
                        row.Append(sectionEnrollmentDownload.Resources.LblWithdrawn).Append(separator);
                    else
                        row.Append(string.Empty).Append(separator);
                    row.Append(studentDownload.Email).Append(separator);
                    row.Append(studentDownload.Curriculum).Append(separator);
                    row.Append(studentDownload.ClassLevel).Append(separator);
                    row.Append(studentDownload.ClassLoad).Append(separator);
                    row.Append(studentDownload.CreditType).Append(separator);
                    row.Append(studentDownload.Credits).Append(separator);
                    row.Append(studentDownload.Attendance).Append(separator);
                    switch (studentDownload.Status)
                    {
                        case "A":
                            row.AppendLine(sectionEnrollmentDownload.Resources.LblStatusAdd);
                            break;

                        case "D":
                            row.AppendLine(sectionEnrollmentDownload.Resources.LblStatusDrop);
                            break;

                        case "H":
                            row.AppendLine(sectionEnrollmentDownload.Resources.LblStatusHold);
                            break;
                    }
                    rows.Append(row);
                }
                rows.Remove(rows.Length - 1, 1);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return rows.ToString();
        }

        /// <summary>
        /// Gets the advisee download list.
        /// </summary>
        /// <param name="adviseeSearchModel">The advisee search model.</param>
        /// <param name="view">The view.</param>
        /// <returns></returns>
        private List<AdviseesDownloadViewModel> GetAdviseeDownloadList(AdviseeSearchModel adviseeSearchModel, EnumDownloadView view)
        {
            string formatPeopleId = _institutionSettingService.GetGeneral().PeopleIdFormat;
            return view switch
            {
                EnumDownloadView.ManageAdvisees => GetAdviseeList(AdviseeView.MyAdvisees, formatPeopleId, adviseeSearchModel),
                EnumDownloadView.ManageMyStudents => GetAdviseeList(AdviseeView.MyStudents, formatPeopleId, adviseeSearchModel),
                EnumDownloadView.ManageMyAssociations => GetAdviseeList(AdviseeView.MyAssociations, formatPeopleId, adviseeSearchModel),
                EnumDownloadView.ManageAllStudents => GetAdviseeList(AdviseeView.AllStudents, formatPeopleId, adviseeSearchModel),
                EnumDownloadView.ManageFormerAdvisees => GetAdviseeList(AdviseeView.FormerAdvisees, formatPeopleId, adviseeSearchModel),
                EnumDownloadView.ManageAlumni => GetAdviseeList(AdviseeView.Alumni, formatPeopleId, adviseeSearchModel),
                EnumDownloadView.ManageMyCampus => GetAdviseeList(AdviseeView.MyCampus, formatPeopleId, adviseeSearchModel),
                EnumDownloadView.ManageMyDepartment => GetAdviseeList(AdviseeView.MyDepartment, formatPeopleId, adviseeSearchModel),
                EnumDownloadView.ManageMySharedAdvisees => GetAdviseeList(AdviseeView.MySharedAdvisees, formatPeopleId, adviseeSearchModel),
                _ => new List<AdviseesDownloadViewModel>(),
            };
        }

        /// <summary>
        /// Gets the advisee list.
        /// </summary>
        /// <param name="view">The view.</param>
        /// <param name="formatPeopleId">The format people identifier.</param>
        /// <param name="adviseeSearchModel">The advisee search model.</param>
        /// <returns></returns>
        private List<AdviseesDownloadViewModel> GetAdviseeList(AdviseeView view, string formatPeopleId, AdviseeSearchModel adviseeSearchModel)
        {
            if (adviseeSearchModel.IsAdvancedSearch)
            {
                AdviseeSearchCriteria adviseeSearchCriteria = new()
                {
                    AdvisorId = adviseeSearchModel.AdvisorId,
                    Campus = adviseeSearchModel.Campus,
                    ClassLevel = adviseeSearchModel.ClassLevel,
                    ClassYear = adviseeSearchModel.ClassYear,
                    College = adviseeSearchModel.College,
                    Curriculum = adviseeSearchModel.Curriculum,
                    Degree = adviseeSearchModel.Degree,
                    Department = adviseeSearchModel.Department,
                    DisplayName = adviseeSearchModel.DisplayName,
                    EventId = adviseeSearchModel.EventId,
                    EventSubtype = adviseeSearchModel.EventSubtype,
                    FulltimePartTime = adviseeSearchModel.FulltimePartTime,
                    LastName = adviseeSearchModel.LastName,
                    LastNamePrefix = adviseeSearchModel.LastNamePrefix,
                    MiddleName = adviseeSearchModel.MiddleName,
                    PeopleId = adviseeSearchModel.PeopleId,
                    Program = adviseeSearchModel.Program,
                    Section = adviseeSearchModel.Section,
                    SessionId = adviseeSearchModel.SessionId,
                    TermPeriodId = adviseeSearchModel.TermPeriodId
                };

                return _adviseeService.GetManageAdviseesAdvanced(Account.PersonId, adviseeSearchCriteria, view, 0, adviseeSearchModel.OverallCount ?? 0, adviseeSearchModel.Filter ?? 0)
                               .ToViewModel(CurrentNameFormat, CurrentNameSort, formatPeopleId, ShowMiddleNameInitial);
            }

            return _adviseeService.GetManageAdviseesBasic(Account.PersonId, adviseeSearchModel.Keyword, view, 0, adviseeSearchModel.OverallCount ?? 0)
                           .ToViewModel(CurrentNameFormat, CurrentNameSort, formatPeopleId, ShowMiddleNameInitial);
        }

        /// <summary>
        /// Gets the type of the content.
        /// </summary>
        /// <param name="fileType">Type of the file.</param>
        /// <returns></returns>
        private string GetContentType(EnumDownloadFileType fileType)
        {
            try
            {
                switch (fileType)
                {
                    case EnumDownloadFileType.Html:
                        return "text/html";

                    case EnumDownloadFileType.Doc:
                        return "application/msword";

                    case EnumDownloadFileType.Xls:
                        return "application/vnd.ms-excel";

                    case EnumDownloadFileType.Tsv:
                        return "text/tab-separated-values";

                    case EnumDownloadFileType.Csv:
                        return "text/comma-separated-values";

                    case EnumDownloadFileType.Docx:
                        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

                    case EnumDownloadFileType.Xlsx:
                        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return string.Empty;
        }

        /// <summary>
        /// Gets the content of the file.
        /// </summary>
        /// <param name="view">The view.</param>
        /// <param name="downloadModel">The download model.</param>
        /// <param name="separator">The separator.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        private FileContentResult GetFileContent(EnumDownloadView view, DownloadModel downloadModel, char separator, int? sectionId)
        {
            try
            {
                SectionEnrollmentViewModel classList = null;
                List<SectionViolationViewModel> violations = null;
                SectionAttendanceViewModel sectionAttendance = null;
                List<SectionStatisticViewModel> sectionStatistics = null;
                List<StudentMeetingAttendanceDownloadViewModel> studentMeetingAttendanceViewModels = null;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                InstitutionSettings.CourseManagement courseManagement = _institutionSettingService.GetCourseManagement();
                string language = _settingHelper.GetLanguage(Account);
                switch (view)
                {
                    case EnumDownloadView.ClassList:
                    case EnumDownloadView.ClassListAdd:
                    case EnumDownloadView.ClassListDrop:
                    case EnumDownloadView.ClassListHold:
                        int status = (view == EnumDownloadView.ClassListAdd ? 1 : (view == EnumDownloadView.ClassListDrop ? 2 : (view == EnumDownloadView.ClassListHold ? 3 : 0)));
                        classList = _sectionService.GetEnrollment(sectionId.Value, status).ToClassListViewModel(CurrentNameFormat, CurrentNameSort, general, mail,
                            ShowMiddleNameInitial, _peopleService, _pictureHelper);
                        SectionEnrollmentDownloadViewModel sectionEnrollmentDownload = new()
                        {
                            Students = classList.ToViewModel(),
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionEnrollmentResources>(language, new("Downloads", "SectionEnrollment"))
                        };

                        if (downloadModel.FileType.ToString() == EnumDownloadFileType.Xlsx.ToString())
                        {
                            byte[] data = CreateExcelDocument(sectionEnrollmentDownload);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else if (downloadModel.FileType.ToString() == EnumDownloadFileType.Docx.ToString())
                        {
                            byte[] data = CreateWordDocument(sectionEnrollmentDownload);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else
                        {
                            return File(new UTF8Encoding().GetBytes(ClassListToString(sectionEnrollmentDownload, separator)), GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }

                    case EnumDownloadView.Violations:
                        violations = _violationService.GetBySection(sectionId.Value).ToViewModel(CurrentNameFormat, CurrentNameSort, Account.PersonId, general, ShowMiddleNameInitial);
                        SectionViolationDownloadViewModel sectionViolations = new()
                        {
                            Students = violations.ToViewModel(general),
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionViolationResources>(language, new("Downloads", "SectionViolation"))
                        };

                        if (downloadModel.FileType.ToString() == EnumDownloadFileType.Xlsx.ToString())
                        {
                            byte[] data = CreateExcelDocument(sectionViolations);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else if (downloadModel.FileType.ToString() == EnumDownloadFileType.Docx.ToString())
                        {
                            byte[] data = CreateWordDocument(sectionViolations);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else
                        {
                            return File(new UTF8Encoding().GetBytes(ViolationsToString(sectionViolations, separator)), GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }

                    case EnumDownloadView.Attendance:
                        sectionAttendance = _sectionService.GetAttendance(sectionId.Value).ToViewModel(CurrentNameFormat, CurrentNameSort, general, mail,
                            courseManagement, ShowMiddleNameInitial);
                        SectionAttendanceDownloadViewModel sectionAttendanceDownloadViewModel = new()
                        {
                            Students = sectionAttendance.StudentList.ToViewModel(general),
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionAttendanceResources>(language, new("Downloads", "SectionAttendance"))
                        };

                        if (downloadModel.FileType.ToString() == EnumDownloadFileType.Xlsx.ToString())
                        {
                            byte[] data = CreateExcelDocument(sectionAttendanceDownloadViewModel);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else if (downloadModel.FileType.ToString() == EnumDownloadFileType.Docx.ToString())
                        {
                            byte[] data = CreateWordDocument(sectionAttendanceDownloadViewModel);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else
                        {
                            return File(new UTF8Encoding().GetBytes(AttendanceToString(sectionAttendanceDownloadViewModel, separator,
                            courseManagement)), GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }

                    case EnumDownloadView.OverallGradesStatistics:
                        sectionStatistics = _sectionService.GetStatistic(sectionId.Value).ToViewModel(general);
                        SectionStatisticsDownloadViewModel sectionStatisticDownloadViewModel = new()
                        {
                            Statistic = sectionStatistics.ToViewModel(_institutionSettingService.GetCourseManagement().MidtermGrades),
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionStatisticsResources>(language, new("Downloads", "SectionStatistics"))
                        };

                        if (downloadModel.FileType.ToString() == EnumDownloadFileType.Xlsx.ToString())
                        {
                            byte[] data = CreateExcelDocument(sectionStatisticDownloadViewModel);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else if (downloadModel.FileType.ToString() == EnumDownloadFileType.Docx.ToString())
                        {
                            byte[] data = CreateWordDocument(sectionStatisticDownloadViewModel);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else
                        {
                            return File(new UTF8Encoding().GetBytes(StatisticsToString(sectionStatisticDownloadViewModel, separator)), GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }

                    case EnumDownloadView.OverallGrades:
                        bool showMidterm = _institutionSettingService.GetCourseManagement().MidtermGrades;
                        bool showProjectedGrade = _institutionSettingService.GetCourseManagement().EnableProjectedGrade;
                        SectionOverallGradeListViewModel overallGrades = GetSectionOverallGradeListViewModel(sectionId.Value, showProjectedGrade, general);
                        OverallGradesDownloadViewModel gradesDownload = new()
                        {
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionOverallGradesResources>(language, new("Downloads", "SectionOverallGrades")),
                            ShowMidterm = showMidterm,
                            ShowProjectedGrade = showProjectedGrade,
                            Students = overallGrades.ToViewModel(showMidterm, showProjectedGrade)
                        };

                        if (downloadModel.FileType.ToString() == EnumDownloadFileType.Xlsx.ToString())
                        {
                            byte[] data = CreateExcelDocument(gradesDownload);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else if (downloadModel.FileType.ToString() == EnumDownloadFileType.Docx.ToString())
                        {
                            byte[] data = CreateWordDocument(gradesDownload);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else
                        {
                            return File(new UTF8Encoding().GetBytes(OverallGradesToString(gradesDownload, separator)), GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }

                    case EnumDownloadView.AttendanceDaily:
                        List<StudentMeetingAttendanceDownload> studentMeetingAttendanceDownloads = _attendanceService.GetSectionMeetingById(sectionId.Value);
                        studentMeetingAttendanceViewModels = studentMeetingAttendanceDownloads.ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                        SectionAttendanceDailyDownloadViewModel sectionAttendanceDailyDownloadViewModel = new()
                        {
                            Students = studentMeetingAttendanceViewModels,
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionAttendanceDailyResources>(language, new("Downloads", "SectionAttendance"))
                        };

                        if (downloadModel.FileType.ToString() == EnumDownloadFileType.Xlsx.ToString())
                        {
                            byte[] data = CreateExcelDocument(sectionAttendanceDailyDownloadViewModel);
                            return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                        else
                        {
                            return File(new UTF8Encoding().GetBytes(AttendanceDailyToString(sectionAttendanceDailyDownloadViewModel, separator)),
                                GetContentType(downloadModel.FileType), downloadModel.FileName);
                        }
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return null;
        }

        /// <summary>
        /// Gets the file content advisees.
        /// </summary>
        /// <param name="adviseeSearchModel">The advisee search model.</param>
        /// <param name="downloadModel">The download model.</param>
        /// <param name="separator">The separator.</param>
        /// <returns></returns>
        private FileContentResult GetFileContentAdvisees(AdviseeSearchModel adviseeSearchModel, DownloadModel downloadModel, char separator)
        {
            try
            {
                string language = _settingHelper.GetLanguage(Account);
                AdviseeDownloadViewModel adviseeDownloadModel = new()
                {
                    Advisees = GetAdviseeDownloadList(adviseeSearchModel, downloadModel.View),
                    Resources = _resourcesHelper.GetResourceType<ManageAdviseesResources>(language, new("Downloads", "ManageAdvisees"))
                };

                if (downloadModel.FileType.ToString() == EnumDownloadFileType.Xlsx.ToString())
                {
                    byte[] data = CreateExcelDocument(adviseeDownloadModel);
                    return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                }
                else if (downloadModel.FileType.ToString() == EnumDownloadFileType.Docx.ToString())
                {
                    byte[] data = CreateWordDocument(adviseeDownloadModel);
                    return File(data, GetContentType(downloadModel.FileType), downloadModel.FileName);
                }
                else
                {
                    return File(new UTF8Encoding().GetBytes(AdviseesToString(adviseeDownloadModel, separator)), GetContentType(downloadModel.FileType), downloadModel.FileName);
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return null;
        }

        /// <summary>
        /// Gets the content of the HTML.
        /// </summary>
        /// <param name="view">The view.</param>
        /// <param name="downloadModel">The download model.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        private async Task<FileContentResult> GetHtmlContent(EnumDownloadView view, DownloadModel downloadModel, int? sectionId)
        {
            try
            {
                string htmlContent = string.Empty;
                SectionEnrollmentViewModel classList = null;
                List<SectionViolationViewModel> violations = null;
                SectionAttendanceViewModel sectionAttendance = null;
                List<SectionStatisticViewModel> sectionStatistic = null;
                List<StudentMeetingAttendanceDownloadViewModel> studentMeetingAttendanceViewModels = null;
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.CourseManagement courseManagement = _institutionSettingService.GetCourseManagement();
                string language = _settingHelper.GetLanguage(Account);
                switch (view)
                {
                    case EnumDownloadView.ClassList:
                    case EnumDownloadView.ClassListAdd:
                    case EnumDownloadView.ClassListDrop:
                    case EnumDownloadView.ClassListHold:
                        int status = (view == EnumDownloadView.ClassListAdd ? 1 : (view == EnumDownloadView.ClassListDrop ? 2 : (view == EnumDownloadView.ClassListHold ? 3 : 0)));
                        classList = _sectionService.GetEnrollment(sectionId.Value, status).ToClassListViewModel(CurrentNameFormat, CurrentNameSort, general, mail,
                            ShowMiddleNameInitial, _peopleService, _pictureHelper);
                        SectionEnrollmentDownloadViewModel sectionEnrollmentDownload = new()
                        {
                            Students = classList.ToViewModel(),
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionEnrollmentResources>(language, new("Downloads", "SectionEnrollment"))
                        };
                        htmlContent = await RenderPartialViewToString("SectionEnrollment", sectionEnrollmentDownload);
                        break;

                    case EnumDownloadView.Violations:
                        violations = _violationService.GetBySection(sectionId.Value).ToViewModel(CurrentNameFormat, CurrentNameSort, Account.PersonId, general, ShowMiddleNameInitial);
                        SectionViolationDownloadViewModel sectionViolationDownloadViewModel = new()
                        {
                            Students = violations.ToViewModel(general),
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionViolationResources>(language, new("Downloads", "SectionViolation"))
                        };
                        htmlContent = await RenderPartialViewToString("SectionViolation", sectionViolationDownloadViewModel);
                        break;

                    case EnumDownloadView.Attendance:
                        sectionAttendance = _sectionService.GetAttendance(sectionId.Value).ToViewModel(CurrentNameFormat, CurrentNameSort, general, mail, courseManagement, ShowMiddleNameInitial);
                        SectionAttendanceDownloadViewModel sectionAttendanceDownloadViewModel = new()
                        {
                            Students = sectionAttendance.StudentList.ToViewModel(general),
                            ShowOverallAttendance = courseManagement.ShowOverallAttendance,
                            ShowDailyAttendance = courseManagement.ShowDailyAttendance,
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionAttendanceResources>(language, new("Downloads", "SectionAttendance"))
                        };
                        htmlContent = await RenderPartialViewToString("SectionAttendance", sectionAttendanceDownloadViewModel);
                        break;

                    case EnumDownloadView.OverallGradesStatistics:
                        sectionStatistic = _sectionService.GetStatistic(sectionId.Value).ToViewModel(general);
                        SectionStatisticsDownloadViewModel sectionStatisticDownloadViewModel = new()
                        {
                            Statistic = sectionStatistic.ToViewModel(_institutionSettingService.GetCourseManagement().MidtermGrades),
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionStatisticsResources>(language, new("Downloads", "SectionStatistics"))
                        };
                        htmlContent = await RenderPartialViewToString("SectionStatistics", sectionStatisticDownloadViewModel);
                        break;

                    case EnumDownloadView.OverallGrades:
                        bool showMidterm = _institutionSettingService.GetCourseManagement().MidtermGrades;
                        bool showProjectedGrade = _institutionSettingService.GetCourseManagement().EnableProjectedGrade;
                        SectionOverallGradeListViewModel overallGrades = GetSectionOverallGradeListViewModel(sectionId.Value, showProjectedGrade, general);
                        OverallGradesDownloadViewModel gradesDownload = new()
                        {
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionOverallGradesResources>(language, new("Downloads", "SectionOverallGrades")),
                            ShowMidterm = showMidterm,
                            ShowProjectedGrade = showProjectedGrade,
                            Students = overallGrades.ToViewModel(showMidterm, showProjectedGrade)
                        };
                        htmlContent = await RenderPartialViewToString("SectionOverallGrades", gradesDownload);
                        break;

                    case EnumDownloadView.AttendanceDaily:
                        List<StudentMeetingAttendanceDownload> studentMeetingAttendanceDownloads = _attendanceService.GetSectionMeetingById(sectionId.Value);
                        studentMeetingAttendanceViewModels = studentMeetingAttendanceDownloads.ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                        SectionAttendanceDailyDownloadViewModel sectionAttendanceDailyDownloadViewModel = new()
                        {
                            Students = studentMeetingAttendanceViewModels,
                            Resources = _resourcesHelper.GetResourceTypeWithLayout<SectionAttendanceDailyResources>(language, new("Downloads", "SectionAttendance"))
                        };
                        htmlContent = await RenderPartialViewToString("SectionAttendanceDaily", sectionAttendanceDailyDownloadViewModel);
                        break;
                }
                byte[] byteArray = Encoding.ASCII.GetBytes(htmlContent);
                Response.Headers.Add("Content-Disposition", $"attachment; filename={downloadModel.FileName}");
                return new FileContentResult(byteArray, GetContentType(downloadModel.FileType));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return null;
        }

        /// <summary>
        /// Gets the HTML content advisees.
        /// </summary>
        /// <param name="adviseeSearchModel">The advisee search model.</param>
        /// <param name="downloadModel">The download model.</param>
        /// <returns></returns>
        private async Task<FileContentResult> GetHtmlContentAdvisees(AdviseeSearchModel adviseeSearchModel, DownloadModel downloadModel)
        {
            try
            {
                string htmlContent = string.Empty;
                string language = _settingHelper.GetLanguage(Account);
                AdviseeDownloadViewModel adviseeDownloadViewModel = new()
                {
                    Advisees = GetAdviseeDownloadList(adviseeSearchModel, downloadModel.View),
                    Resources = _resourcesHelper.GetResourceType<ManageAdviseesResources>(language, new("Downloads", "ManageAdvisees"))
                };
                htmlContent = await RenderPartialViewToString("ManageAdvisees", adviseeDownloadViewModel);

                byte[] byteArray = Encoding.ASCII.GetBytes(htmlContent);
                Response.Headers.Add("Content-Disposition", $"attachment; filename={downloadModel.FileName}");
                return new FileContentResult(byteArray, GetContentType(downloadModel.FileType));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return null;
        }

        /// <summary>
        /// Gets the section overall grade ListView model.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="showProjectedGrade">if set to <c>true</c> [show projected].</param>
        /// <returns></returns>
        private SectionOverallGradeListViewModel GetSectionOverallGradeListViewModel(int sectionId, bool showProjectedGrade, InstitutionSettings.General general)
        {
            SectionOverallGradeListViewModel sectionOverallGradeListViewModel = null;
            try
            {
                bool isApprovalRequired = _gradeService.IsApprovalRequired(sectionId);
                SectionStudentGrade sectionStudentGrade = _sectionService.GetStudentGradesBySection(sectionId, showProjectedGrade, Account.PersonId);
                sectionOverallGradeListViewModel = sectionStudentGrade.ToViewModel(sectionId, Account.PersonId, showProjectedGrade,
                    isApprovalRequired, CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial, _settingService, _sectionService, _departmentHeadService,
                    _facultyAssistantService);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return sectionOverallGradeListViewModel;
        }

        /// <summary>
        /// Gets the overall grades to string.
        /// </summary>
        /// <param name="overallGradesDownloadViewModel">The section enrollment download.</param>
        /// <param name="separator">The separator.</param>
        /// <returns></returns>
        private string OverallGradesToString(OverallGradesDownloadViewModel overallGradesDownloadViewModel, char separator)
        {
            StringBuilder rows = new();
            try
            {
                rows.Append(overallGradesDownloadViewModel.Resources.LblName).Append(separator);
                rows.Append(overallGradesDownloadViewModel.Resources.LblPeopleId).Append(separator);
                rows.Append(overallGradesDownloadViewModel.Resources.LblWithdrawn).Append(separator);
                rows.Append(overallGradesDownloadViewModel.Resources.LblCreditType).Append(separator);
                if (overallGradesDownloadViewModel.ShowMidterm)
                {
                    rows.Append(overallGradesDownloadViewModel.Resources.LblMidtermScore).Append(separator);
                    rows.Append(overallGradesDownloadViewModel.Resources.LblMidtermSubmitted).Append(separator);
                    rows.Append(overallGradesDownloadViewModel.Resources.LblMidtermApproved).Append(separator);
                }
                if (overallGradesDownloadViewModel.ShowProjectedGrade)
                    rows.Append(overallGradesDownloadViewModel.Resources.LblProjected).Append(separator);
                rows.Append(overallGradesDownloadViewModel.Resources.LblFinalScore).Append(separator);
                rows.Append(overallGradesDownloadViewModel.Resources.LblFinalSubmitted).Append(separator);
                rows.AppendLine(overallGradesDownloadViewModel.Resources.LblFinalApproved);
                foreach (OverallGradeStudentDownloadViewModel studentDownload in overallGradesDownloadViewModel.Students)
                {
                    StringBuilder row = new();
                    if (separator == ',')
                        studentDownload.Name = @"""" + studentDownload.Name + @"""";
                    row.Append(studentDownload.Name).Append(separator);
                    row.Append(studentDownload.PeopleId).Append(separator);
                    row.Append(studentDownload.Withdrawn ? overallGradesDownloadViewModel.Resources.LblWithdrawn : string.Empty).Append(separator);
                    row.Append(studentDownload.CreditType).Append(separator);
                    if (overallGradesDownloadViewModel.ShowMidterm)
                    {
                        if (separator == ',')
                            studentDownload.MidtermPoints = @"""" + studentDownload.MidtermPoints + @"""";
                        row.Append(studentDownload.MidtermPoints).Append(separator);
                        row.Append(studentDownload.MidtermInstructorGrade).Append(separator);
                        row.Append(studentDownload.MidtermTranscriptGrade).Append(separator);
                    }
                    if (overallGradesDownloadViewModel.ShowProjectedGrade)
                    {
                        if (separator == ',')
                            studentDownload.ProjectedGrade = @"""" + studentDownload.ProjectedGrade + @"""";
                        row.Append(studentDownload.ProjectedGrade).Append(separator);
                    }
                    if (separator == ',')
                        studentDownload.FinalPoints = @"""" + studentDownload.FinalPoints + @"""";
                    row.Append(studentDownload.FinalPoints).Append(separator);
                    row.Append(studentDownload.FinalInstructorGrade).Append(separator);
                    row.AppendLine(studentDownload.FinalTranscriptGrade);
                    rows.Append(row);
                }
                rows.Remove(rows.Length - 1, 1);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return rows.ToString();
        }

        /// <summary>
        /// Renders the partial view to string.
        /// </summary>
        /// <param name="viewName">Name of the view.</param>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        private async Task<string> RenderPartialViewToString(string viewName, object model)
        {
            try
            {
                ViewData.Model = model;

                ViewEngineResult viewResult =
                    _viewEngine.FindView(ControllerContext, viewName, false);
                if (viewResult.View != null)
                {
                    using StringWriter stringWriter = new();
                    ViewContext viewContext = new(
                        ControllerContext,
                        viewResult.View,
                        ViewData,
                        TempData,
                        stringWriter,
                        new HtmlHelperOptions()
                    );

                    await viewResult.View.RenderAsync(viewContext);

                    return stringWriter.GetStringBuilder().ToString();
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return string.Empty;
        }

        /// <summary>
        /// Gets the statistics list to string.
        /// </summary>
        /// <param name="sectionStatisticsDownload">The section statistics download.</param>
        /// <param name="separator">The separator.</param>
        /// <returns></returns>
        private string StatisticsToString(SectionStatisticsDownloadViewModel sectionStatisticsDownload, char separator)
        {
            StringBuilder rows = new();
            try
            {
                rows.Append(sectionStatisticsDownload.Resources.LblPeriod).Append(separator);
                rows.Append(sectionStatisticsDownload.Resources.LblPercentIncluded).Append(separator);
                rows.Append(sectionStatisticsDownload.Resources.LblAverageScore).Append(separator);
                rows.Append(sectionStatisticsDownload.Resources.LblHighScore).Append(separator);
                rows.Append(sectionStatisticsDownload.Resources.LblLowScore).Append(separator);
                rows.Append(sectionStatisticsDownload.Resources.LblStandardDeviation).Append(separator);
                rows.AppendLine(sectionStatisticsDownload.Resources.LblVariance);
                foreach (SectionStatisticDownloadViewModel item in sectionStatisticsDownload.Statistic)
                {
                    StringBuilder row = new();
                    row.Append(item.IsMidterm ? sectionStatisticsDownload.Resources.LblMidTerm : sectionStatisticsDownload.Resources.LblFinal).Append(separator);
                    row.Append(item.PercentIncluded).Append(separator);
                    row.Append(item.AverageScore).Append(separator);
                    row.Append(item.HighScore).Append(separator);
                    row.Append(item.LowScore).Append(separator);
                    row.Append(item.StandardDeviation).Append(separator);
                    if (separator == ',')
                        item.Variance = @"""" + item.Variance + @"""";
                    row.AppendLine(item.Variance);
                    rows.Append(row);
                }
                rows.Remove(rows.Length - 1, 1);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return rows.ToString();
        }

        /// <summary>
        /// Gets the violations to string.
        /// </summary>
        /// <param name="violationsDownload">The violations download.</param>
        /// <param name="separator">The separator.</param>
        /// <returns></returns>
        private string ViolationsToString(SectionViolationDownloadViewModel violationsDownload, char separator)
        {
            StringBuilder rows = new();
            try
            {
                rows.Append(violationsDownload.Resources.LblName).Append(separator);
                rows.Append(violationsDownload.Resources.LblPeopleId).Append(separator);
                rows.Append(violationsDownload.Resources.LblWithdrawn).Append(separator);
                rows.Append(violationsDownload.Resources.LblCategory).Append(separator);
                rows.Append(violationsDownload.Resources.LblViolation).Append(separator);
                rows.AppendLine(violationsDownload.Resources.LblDate);
                foreach (StudentViolationDownloadModel item in violationsDownload.Students)
                {
                    StringBuilder row = new();
                    if (separator == ',')
                        item.FullName = @"""" + item.FullName + @"""";
                    row.Append(item.FullName).Append(separator);
                    row.Append(item.PeopleId).Append(separator);
                    if (item.Withdrawn)
                        row.Append(violationsDownload.Resources.LblWithdrawn).Append(separator);
                    else
                        row.Append(string.Empty).Append(separator);
                    row.Append(item.CategoryDesc).Append(separator);
                    row.Append(item.ViolationDesc).Append(separator);
                    row.AppendLine(item.Date);
                    rows.Append(row);
                }
                rows.Remove(rows.Length - 1, 1);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DownloadsController).FullName, exception.Message, exception);
            }
            return rows.ToString();
        }

        #endregion Private Methods
    }
}