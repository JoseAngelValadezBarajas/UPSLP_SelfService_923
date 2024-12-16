// --------------------------------------------------------------------
// <copyright file="ReportHelper.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Reporting.NETCore;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Classes;
using SelfService.Models.Course;
using SelfService.Models.Grades;
using SelfService.Models.Registration;
using SelfService.Models.ResourcesTypes.Classes;
using SelfService.Models.ResourcesTypes.Finances;
using SelfService.Models.ResourcesTypes.Grades;
using SelfService.Models.ResourcesTypes.Registration;
using SelfService.Models.Schedule;
using SelfService.Models.Section;
using SelfService.Models.Shared;
using SelfService.Models.Statement;
using SelfService.Models.Students;
using SelfService.Models.UnofficialTranscript;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text.Json;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Runtime.InteropServices;
using System.Text;
using Aspose.Pdf.Operators;
using SelfService.Data;

namespace SelfService.Helpers
{
    /// <summary>
    /// The Report Helper
    /// </summary>
    /// <seealso cref="IReportHelper" />
    public class ReportHelper : IReportHelper
    {
        /// <summary>
        /// The academic plan report path
        /// </summary>
        private const string AcademicPlanReportPath = @"Reports\AcademicPlan\AcademicPlan.rdlc";

        /// <summary>
        /// The class list report path
        /// </summary>
        private const string ClassListReportPath = @"Reports\ClassList\ClassList.rdlc";

        /// <summary>
        /// The faculty schedule report path
        /// </summary>
        private const string FacultyScheduleReportPath = @"Reports\FacultySchedule\FacultySchedule.rdlc";

        /// <summary>
        /// The grades report path
        /// </summary>
        private const string GradesReportPath = @"Reports\GradesReport\GradesReport.rdlc";

        /// <summary>
        /// The statements report path
        /// </summary>
        private const string StatementsReportPath = @"Reports\StatementsReport\StatementsReport.rdlc";

        /// <summary>
        /// The student schedule report path
        /// </summary>
        private const string StudentScheduleReportPath = @"Reports\StudentSchedule\StudentSchedule.rdlc";

        /// <summary>
        /// The unofficial transcript report path
        /// </summary>
        private const string UnofficialTranscriptReportPath = @"Reports\UnofficialTranscript\UnofficialTranscript.rdlc";

        /// <summary>
        /// Referencia de pago
        /// ipasos 08/20/2024
        /// </summary>
        private const string PaymentReferenceReportPath = @"Reports\ReferenceReport\referencePayment.rdlc";

        /// <summary>
        /// The academic service
        /// </summary>
        private readonly IAcademicService _academicService;

        /// <summary>
        /// The environment
        /// </summary>
        private readonly IWebHostEnvironment _environment;

        /// <summary>
        /// The finance service
        /// </summary>
        private readonly IFinanceService _financeService;

        /// <summary>
        /// The grade service
        /// </summary>
        private readonly IGradeService _gradeService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<ReportHelper> _logger;

        /// <summary>
        /// The name format service
        /// </summary>
        private readonly INameFormatService _nameFormatService;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The period service
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The schedule service
        /// </summary>
        private readonly IScheduleService _scheduleService;

        /// <summary>
        /// The section service
        /// </summary>
        private readonly ISectionService _sectionService;

        /// <summary>
        /// Initializes a new instance of the <see cref="ReportHelper" /> class.
        /// </summary>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="environment">The environment.</param>
        /// <param name="academicService">The academic service.</param>
        /// <param name="financeService">The finance service.</param>
        /// <param name="gradeService">The grade service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="scheduleService">The schedule service.</param>
        /// <param name="sectionService">The section service.</param>
        /// <param name="logger">The logger.</param>
        public ReportHelper(
            IPictureHelper pictureHelper,
            IResourcesHelper resourcesHelper,
            IWebHostEnvironment environment,
            IAcademicService academicService,
            IFinanceService financeService,
            IGradeService gradeService,
            IInstitutionSettingService institutionSettingService,
            INameFormatService nameFormatService,
            IPeriodService periodService,
            IPeopleService peopleService,
            IScheduleService scheduleService,
            ISectionService sectionService,
            IAppLogger<ReportHelper> logger)
        {
            _pictureHelper = pictureHelper;
            _resourcesHelper = resourcesHelper;
            _environment = environment;
            _academicService = academicService;
            _financeService = financeService;
            _gradeService = gradeService;
            _institutionSettingService = institutionSettingService;
            _nameFormatService = nameFormatService;
            _periodService = periodService;
            _peopleService = peopleService;
            _scheduleService = scheduleService;
            _sectionService = sectionService;
            _logger = logger;
        }

        #region ipasos 13/02/2023

        private readonly ConnectionStrings _connectionStrings;

        public class ConnectionStringsInterno
        {
            public int CommandTimeOut { get; set; }

            public string PowerCampusAuthDbContext { get; set; }

            public string PowerCampusDbContext { get; set; }

            public string PowerFaidsDbContext { get; set; }
        }

        public class ConnectionStringsInternoJson
        {

            public ConnectionStringsInterno ConnectionStrings { get; set; }

        }

        #endregion

        public byte[] GetPagoReferAdmission(int _IdApp)
        {
            try
            {
                string _legalname;
                string  _programid;
                string _grado;
                string _entero;
                string _decimales;
                string _programa;
                string _fechalimite;
                string _curriculum;
                string _aca_year;
                string _aca_term;
                string _aca_session;
                string _curp;
                string ficha;
                string idficha;
                string reffinal;
                string _date;
                string FecLim_Aux;
                string referencia;
                int _formid;
                string _Code_Charge;
                string _Status;
                string _Referencia;
                decimal _amount;
                string importe;
                string fic;
                string txt1;
                string txt2;
                string txt3;
                string referenciabanamex;
                int day;
                int month;
                int year;
                DateTime localtime;
                string fechavencimiento;
                cRetEvPay objRetEvPay;
                IFormatProvider formatCurrency = new System.Globalization.CultureInfo("es-MX");

                MemoryStream objMs = new MemoryStream();

                DataTable dtbDatos = new DataTable();

                dtbDatos = IAdmissions.GetDataApplication(_IdApp);

                _legalname = dtbDatos.Rows[0]["NOMBRE"].ToString();
                _curriculum = dtbDatos.Rows[0]["CURRICULUM"].ToString();
                _grado = dtbDatos.Rows[0]["GRADO"].ToString();
                _amount = decimal.Parse(dtbDatos.Rows[0]["AMOUNT"].ToString(), formatCurrency);
                _decimales = dtbDatos.Rows[0]["RESIDUO"].ToString();
                _programa = dtbDatos.Rows[0]["PROGRAMA"].ToString();
                _programid = dtbDatos.Rows[0]["ProgramOfStudyId"].ToString();
                _fechalimite = dtbDatos.Rows[0]["DueDate"].ToString();
                _aca_year = dtbDatos.Rows[0]["ACADEMIC_YEAR"].ToString();
                _aca_term = dtbDatos.Rows[0]["ACADEMIC_TERM"].ToString();
                _aca_session = dtbDatos.Rows[0]["ACADEMIC_SESSION"].ToString();
                _curp = dtbDatos.Rows[0]["CURP"].ToString();
                _formid = int.Parse(dtbDatos.Rows[0]["ApplicationFormSettingId"].ToString());
                _Code_Charge = dtbDatos.Rows[0]["COD_CARG"].ToString();

                /*Add New Register*/
                DateTime _fechaexp = DateTime.Now;

                /*Fecha limite*/
                DateTime FecLim = DateTime.Now;
                FecLim = Convert.ToDateTime(_fechalimite);
                _date = FecLim.ToString("MM/dd/yyyy");

                objRetEvPay = IAdmissions.PayLoadReg(_IdApp,_formid,_programid,_legalname,_curp,_amount,
                                                    FecLim,_Code_Charge,_aca_year,_aca_term,_aca_session,
                                                    _fechaexp);

                day = Convert.ToInt32(_date.Substring(0, 2));
                month = Convert.ToInt32(_date.Substring(3, 2));
                year = Convert.ToInt32(_date.Substring(6, 4));

                fic = objRetEvPay.idFicha.ToString();
                ficha = "0000" + objRetEvPay.idFicha.ToString();
                _programid = "00" + _programid;
                _programid = _programid.Substring(_programid.Length - 2);
                idficha = ficha.Substring(ficha.Length - 4);

                //numero de ficha
                reffinal = "001" + idficha + _curp.Substring(0, 9);

                Algoritmo cadref = new Algoritmo();
                cadref.referencia(reffinal);
                referenciabanamex = cadref.refe;

                IAdmissions.UpdateReferEvPay(objRetEvPay.id, referenciabanamex);

                /*información de la ficha*/
                if (_programid != "13")
                {

                    localtime = Convert.ToDateTime(_date);
                    fechavencimiento = localtime.ToString("MM/dd/yyyy");

                    //nuevo

                    txt1 = "Una vez hecho el pago, esperar dos días hábiles y presentarse, de lunes a viernes de 08:00 a 18:00 hrs. en el Departamento de Servicios Escolares (excepto los siguientes días: del 22 de diciembre de 2022 al 4 de enero de 2023, 6 de febrero de 2023, 10 y 20 de marzo de 2023, del 3 al 7 de abril de 2023 y 1º. de mayo de 2023)  con la documentación correspondiente.";

                    txt2 = "";

                    txt3 = "";

                }
                else
                {
                    //importe = "1200.00";

                    localtime = Convert.ToDateTime(_date);
                    fechavencimiento = localtime.ToString("01/01/2020");

                    txt1 = "";
                    txt2 = "";
                    txt3 = "";

                }

                pdf fichaadm = new pdf();
                objMs = fichaadm.formato("EXAMEN DE ADMISIÓN", idficha, _legalname, _curriculum, fechavencimiento, referenciabanamex, "",
                                 Convert.ToDecimal(_amount).ToString("C", formatCurrency), 
                                 "FECHA DEL EXAMEN", _programa, _programid, txt1, txt2, txt3,_aca_year,_aca_term);

                byte[] renderBytes = objMs.ToArray();
                return renderBytes;

            }
            catch (Exception exception)
            {
                IErrorLog.SaveErrorLog("Error GetPagoReferAdmision " + exception.ToString());
                _logger.LogError(Constants._product, typeof(ReportHelper).FullName, exception.Message, exception);
                return default;
            }
        }

        /// <summary>
        /// Gets the academic plan.
        /// </summary>
        /// <param name="academicPlanReport">The academic plan report.</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        public byte[] GetAcademicPlan(AcademicPlanReportModel academicPlanReport, string language)
        {
            try
            {
                AcademicPlanMainResources resources = _resourcesHelper.GetResourceType<AcademicPlanMainResources>(language, new("Registration", "AcademicPlanMain"));
                LocalReport localReport = new();
                localReport.EnableHyperlinks = true;
                localReport.ReportPath = Path.Combine(_environment.ContentRootPath, AcademicPlanReportPath);
                localReport.ShowDetailedSubreportMessages = true;
                localReport.SubreportProcessing += (object sender, SubreportProcessingEventArgs e) =>
                {
                    int disciplineIndex, classificationIndex;
                    DisciplineViewModel discipline;
                    ClassificationViewModel classification;

                    try
                    {
                        switch (e.ReportPath)
                        {
                            case "Discipline":

                                disciplineIndex = Convert.ToInt32(e.Parameters["DisciplineIndex"].Values[0]);
                                discipline = academicPlanReport.StudentDegreeRequirement.DisciplineList[disciplineIndex];

                                e.DataSources.Add(new ReportDataSource("Classification",
                                    discipline.ClassificationList.Select(c => new
                                    {
                                        ClassificationIndex = discipline.ClassificationList.IndexOf(c),
                                        c.Description,
                                        c.CreditsTaken,
                                        c.CreditMin,
                                        c.CreditMax,
                                        c.CreditsCompleted,
                                        c.CreditsRemaining,
                                    })));
                                break;

                            case "Classification":
                                disciplineIndex = Convert.ToInt32(e.Parameters["DisciplineIndex"].Values[0]);
                                discipline = academicPlanReport.StudentDegreeRequirement.DisciplineList[disciplineIndex];

                                classificationIndex = Convert.ToInt32(e.Parameters["ClassificationIndex"].Values[0]);
                                classification = discipline.ClassificationList[classificationIndex];

                                e.DataSources.Add(new ReportDataSource("Courses", classification.CourseEventList));
                                break;

                            case "ExtraCourses":
                                e.DataSources.Add(new ReportDataSource("Courses", academicPlanReport.StudentDegreeRequirement.SectionsNotCounted));
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(Constants._product, typeof(ReportHelper).FullName, ex.Message, ex);
                    }
                };

                ReportDataSource dataSource = new("Discipline",
                        academicPlanReport.StudentDegreeRequirement.DisciplineList.Select(d => new
                        {
                            DisciplineIndex = academicPlanReport.StudentDegreeRequirement.DisciplineList.IndexOf(d),
                            d.Description,
                            d.CreditsTaken,
                            d.CreditMin,
                            d.CreditMax,
                            d.CreditsCompleted,
                            d.CreditsRemaining,
                        }));

                localReport.DataSources.Clear();
                localReport.DataSources.Add(dataSource);

                ReportParameter[] reportParameters = new ReportParameter[]
                {
                new ReportParameter("StudentName", academicPlanReport.StudentName),
                new ReportParameter("Period", $"{academicPlanReport.StudentDegreeRequirement.MatricYear}/{academicPlanReport.StudentDegreeRequirement.MatricTerm}"),
                new ReportParameter("ShowSequence", academicPlanReport.ShowSequence.ToString()),
                new ReportParameter("CreditMin", academicPlanReport.StudentDegreeRequirement.CreditMin),
                new ReportParameter("CreditMax", academicPlanReport.StudentDegreeRequirement.CreditsMax),
                new ReportParameter("CreditsCompleted", academicPlanReport.StudentDegreeRequirement.CreditsCompleted),
                new ReportParameter("CreditsRemaining", academicPlanReport.StudentDegreeRequirement.CreditsRemaining),
                new ReportParameter("CreditsTaken", academicPlanReport.StudentDegreeRequirement.CreditsTaken),
                new ReportParameter("CoursesMin", academicPlanReport.StudentDegreeRequirement.CoursesMin.ToString()),
                new ReportParameter("CoursesMax", academicPlanReport.StudentDegreeRequirement.CoursesMax.ToString()),
                new ReportParameter("Disciplines", academicPlanReport.StudentDegreeRequirement.Discipline.ToString()),
                new ReportParameter("Name", $"{academicPlanReport.StudentDegreeRequirement.ProgramDesc} {academicPlanReport.StudentDegreeRequirement.DegreeDesc} {academicPlanReport.StudentDegreeRequirement.CurriculumDesc}"),
                new ReportParameter("DegreeGpa", academicPlanReport.StudentDegreeRequirement.DegreeGpa),
                new ReportParameter("OverallGpa", academicPlanReport.StudentDegreeRequirement.OverallGpa),
                new ReportParameter("GraduationPeriod", academicPlanReport.GraduationPeriod),
                new ReportParameter("ExpectedGraduationDate", academicPlanReport.ExpectedGraduationDate),

                //Resources
                new ReportParameter("LblCompleted", resources.AcademicPlanDisciplines.LblCompleted),
                new ReportParameter("LblGpa", resources.AcademicPlanHeader.LblGpa),
                new ReportParameter("LblOverall", resources.AcademicPlanHeader.LblOverall),
                new ReportParameter("LblRequiredCredits", resources.AcademicPlanHeader.LblRequiredCredits),
                new ReportParameter("LblDiscipline", resources.AcademicPlanHeader.LblDiscipline),
                new ReportParameter("LblMin", resources.AcademicPlanDisciplines.AcademicPlanClassification.LblMinDot),
                new ReportParameter("LblMax", resources.AcademicPlanDisciplines.AcademicPlanClassification.LblMaxDot),
                new ReportParameter("LblCourse", resources.AcademicPlanHeader.LblCourse),
                new ReportParameter("LblCredits", resources.AcademicPlanHeader.LblCredits),
                new ReportParameter("LblRemaining", resources.AcademicPlanHeader.LblRemaining),
                new ReportParameter("LblPercentage", resources.AcademicPlanHeader.LblPercentage),
                new ReportParameter("LblSubTypeDetail", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblSubTypeDetail),
                new ReportParameter("LblCourseDetail", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblCourseDetail),
                new ReportParameter("LblSequence", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblSequence),
                new ReportParameter("LblRequired", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblRequired),
                new ReportParameter("LblMinimumGrade", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblMinimumGrade),
                new ReportParameter("LblPage", resources.LblPage),
                new ReportParameter("LblOf", resources.LblOf),
                new ReportParameter("LblAcademicPlanReport", resources.LblAcademicPlanReport),
                new ReportParameter("LblCoursesNotAssignedAcaPlan", resources.AcademicPlanExtraCourses.LblCoursesNotAssignedAcaPlan),
                new ReportParameter("LblYes", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblYes),
                new ReportParameter("LblAnd", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblAnd),
                new ReportParameter("LblOr", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblOr),
                new ReportParameter("LblInProgress", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblInProgress),
                new ReportParameter("LblGraduationPeriod", resources.AcademicPlanHeader.LblGraduationPeriod),
                new ReportParameter("LblExpectedGraduationDate", resources.AcademicPlanHeader.LblExpectedGraduationDate),
                new ReportParameter("LblFinalGrade", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblFinalGrade),
                new ReportParameter("LblCompletedSingular", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblCompleted),
                new ReportParameter("LblMinGrade", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblMinGrade),
                new ReportParameter("LblStatus", resources.AcademicPlanDisciplines.AcademicPlanClassification.AcademicPlanCourses.LblStatus)
                };

                localReport.SetParameters(reportParameters);

                localReport.Refresh();

                byte[] renderBytes = localReport.Render("PDF", null);
                return renderBytes;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ReportHelper).FullName, exception.Message, exception);
                return default;
            }
        }

        /// <summary>
        /// Gets the class list.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="status">The status.</param>
        /// <param name="currentNameFormat">The current name format.</param>
        /// <param name="currentNameSort">The current name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        public byte[] GetClassList(int sectionId, int status, string currentNameFormat, string currentNameSort,
                bool showMiddleNameInitial, string language)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                InstitutionSettings.StudentRecords studentRecords = _institutionSettingService.GetStudentRecords();
                SectionDetail sectionDetail = _sectionService.GetDetail(sectionId);
                SectionEnrollmentViewModel sectionEnrollment = _sectionService.GetEnrollment(sectionId, status).
                    ToClassListViewModel(currentNameFormat, currentNameSort, general, mail, showMiddleNameInitial, _peopleService, _pictureHelper, studentRecords.ShowStudentPicture, true);

                // Report section
                ClassListResources resources = _resourcesHelper.GetResourceType<ClassListResources>(language, new("Classes", "ClassList"));

                LocalReport localReport = new();
                localReport.EnableHyperlinks = true;
                localReport.ReportPath = Path.Combine(_environment.ContentRootPath, ClassListReportPath);
                localReport.ShowDetailedSubreportMessages = true;
                localReport.SubreportProcessing += (object sender, SubreportProcessingEventArgs e) =>
                {
                };

                ReportDataSource studentsDataSource = new("Students", sectionEnrollment.Students);

                localReport.DataSources.Clear();
                localReport.DataSources.Add(studentsDataSource);

                ReportParameter[] reportParameters = new ReportParameter[]
                {
                    new ReportParameter("StudentCount",sectionEnrollment.StudentCount),
                    new ReportParameter("EventId",sectionDetail.EventId),
                    new ReportParameter("EventLongName",sectionDetail.EventLongName),
                    new ReportParameter("EventSubTypeDesc",sectionDetail.EventSubTypeDesc),
                    new ReportParameter("SectionIdentifier",sectionDetail.SectionEvent),
                    new ReportParameter("SessionDesc",sectionDetail.AcademicSessionDesc),
                    new ReportParameter("AcademicYear",sectionDetail.AcademicYear),
                    new ReportParameter("AcademicTermDesc",sectionDetail.AcademicTermDesc),

                    //Resources
                    new ReportParameter("lblNameDetail",resources.LblNameDetail),
                    new ReportParameter("lblCurriculumDetail",resources.LblCurriculumDetail),
                    new ReportParameter("lblClassLevelDetail", resources.LblClassLevelDetail),
                    new ReportParameter("lblClassLoadDetail",resources.LblClassLoadDetail),
                    new ReportParameter("lblCreditTypeDetail",resources.LblCreditTypeDetail),
                    new ReportParameter("lblStatusDetail",resources.LblStatusDetail),
                    new ReportParameter("lblTotalStudents",resources.LblTotalStudents),
                    new ReportParameter("lblAdd",resources.LblAdd),
                    new ReportParameter("lblHold",resources.LblHold),
                    new ReportParameter("lblDrop",resources.LblDrop),
                    new ReportParameter("lblPage",resources.LblPage),
                    new ReportParameter("lblOf",resources.LblOf),
                    new ReportParameter("lblWithdrawn",resources.LblWithdrawn)
                };
                localReport.EnableExternalImages = true;
                localReport.SetParameters(reportParameters);

                localReport.Refresh();

                byte[] renderBytes = localReport.Render("PDF", null);
                return renderBytes;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ReportHelper).FullName, exception.Message, exception);
                return default(byte[]);
            }
        }

        /// <summary>
        /// Gets the faculty schedule.
        /// </summary>
        /// <param name="traditionalSessions">The traditional sessions.</param>
        /// <param name="conEdSections">The con ed sections.</param>
        /// <param name="fullName">The full name.</param>
        /// <param name="period">The period.</param>
        /// <param name="conEd">if set to <c>true</c> [con ed].</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        public byte[] GetFacultySchedule(List<FacultyScheduleBySessionViewModel> traditionalSessions, List<FacultyScheduleViewModel> conEdSections,
            string fullName, string period, bool conEd, string language)
        {
            try
            {
                FacultyScheduleResources resources = _resourcesHelper.GetResourceType<FacultyScheduleResources>(language, new("Classes", "FacultySchedule"));

                if (conEd && conEdSections?.Count > 0)
                {
                    traditionalSessions.Add(new FacultyScheduleBySessionViewModel
                    {
                        Session = resources.FacultyScheduleDetail.LblContinuingEducation,
                        SessionDesc = resources.FacultyScheduleDetail.LblContinuingEducation,
                        Sections = conEdSections
                    });
                }

                traditionalSessions.ForEach(ts => ts.Sections.ForEach(fs =>
                {
                    fs.SchedulesCount = fs.Schedules != null ? fs.Schedules.Count : 0;
                    fs.InstructorsCount = fs.Schedules != null ? fs.Instructors.Count : 0;
                    if (fs.Schedules == null)
                        fs.Schedules = new List<ScheduleViewModel>();
                    if (fs.Instructors == null)
                        fs.Instructors = new List<AvatarViewModel>();
                }));

                LocalReport localReport = new();
                localReport.EnableHyperlinks = true;
                localReport.ReportPath = Path.Combine(_environment.ContentRootPath, FacultyScheduleReportPath);

                localReport.ShowDetailedSubreportMessages = true;
                localReport.SubreportProcessing += (object sender, SubreportProcessingEventArgs e) =>
                {
                    int sessionIndex, sectionIndex;
                    FacultyScheduleBySessionViewModel session;
                    FacultyScheduleViewModel section;

                    try
                    {
                        switch (e.ReportPath)
                        {
                            case "Session":

                                sessionIndex = Convert.ToInt32(e.Parameters["SessionIndex"].Values[0]);
                                session = traditionalSessions[sessionIndex];

                                e.DataSources.Add(new ReportDataSource("Section",
                                    session.Sections.Select(fs => new
                                    {
                                        SectionIndex = session.Sections.IndexOf(fs),
                                        fs.EndDate,
                                        fs.EventId,
                                        fs.EventName,
                                        fs.EventSubType,
                                        fs.EventType,
                                        fs.Id,
                                        fs.InstructorsCount,
                                        fs.IsConEd,
                                        fs.SchedulesCount,
                                        fs.Section,
                                        fs.SessionDesc,
                                        fs.Session,
                                        fs.StartDate
                                    })));
                                break;

                            case "Section":
                                sessionIndex = Convert.ToInt32(e.Parameters["SessionIndex"].Values[0]);
                                session = traditionalSessions[sessionIndex];

                                sectionIndex = Convert.ToInt32(e.Parameters["SectionIndex"].Values[0]);
                                section = session.Sections[sectionIndex];

                                e.DataSources.Add(new ReportDataSource("Instructor", section.Instructors));
                                e.DataSources.Add(new ReportDataSource("Schedule", section.Schedules));
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(Constants._product, typeof(ReportHelper).FullName, ex.Message, ex);
                    }
                };

                ReportDataSource dataSource = new("Session",
                        traditionalSessions.Select(ts => new
                        {
                            SessionIndex = traditionalSessions.IndexOf(ts),
                            ts.Session,
                            ts.SessionDesc
                        }));

                localReport.DataSources.Clear();
                localReport.DataSources.Add(dataSource);

                ReportParameter[] reportParameters = new ReportParameter[]
                {
                    new ReportParameter("FacultyName", fullName),
                    new ReportParameter("Period", period),

                    //Resources
                    new ReportParameter("LblFacultySchedule", resources.LblFacultySchedule),
                    new ReportParameter("LblSubtype", resources.FacultyScheduleDetail.FacultyScheduleItem.LblSubtype),
                    new ReportParameter("LblSection", resources.FacultyScheduleDetail.FacultyScheduleItem.LblSection),
                    new ReportParameter("LblType", resources.FacultyScheduleDetail.FacultyScheduleItem.LblType),
                    new ReportParameter("LblDuration", resources.FacultyScheduleDetail.FacultyScheduleItem.LblDuration),
                    new ReportParameter("LblPage", resources.LblPage),
                    new ReportParameter("LblOf", resources.LblOf),
                    new ReportParameter("LblNoSchedule", resources.FacultyScheduleDetail.FacultyScheduleItem.LblNoSchedule),
                    new ReportParameter("LblRoom", resources.FacultyScheduleDetail.FacultyScheduleItem.LblRoom),
                    new ReportParameter("LblFloor", resources.FacultyScheduleDetail.FacultyScheduleItem.LblFloor),
                };

                localReport.SetParameters(reportParameters);

                localReport.Refresh();

                byte[] renderBytes = localReport.Render("PDF", null);
                return renderBytes;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ReportHelper).FullName, exception.Message, exception);
                return default(byte[]);
            }
        }

        /// <summary>
        /// Gets the grades.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="termPeriodId">The term period identifier.</param>
        /// <param name="language">The language.</param>
        /// <param name="sequence">The sequence.</param>
        /// <returns></returns>
        public byte[] GetGrades(int id, int termPeriodId, string language, string sequence = null)
        {
            try
            {
                People people = _peopleService.Get(id);
                GradeReport gradesReport = _gradeService.GetReport(id, termPeriodId, _institutionSettingService.GetCourseManagement().EnableProjectedGrade);
                GradeReportViewModel gradesReportViewModel = gradesReport.ToViewModel(_institutionSettingService);
                List<ListOptionViewModel> periods = _periodService.GetForGradeReport(id).ToViewModel(true);
                string yearTerm = periods.First(p => p.Value == termPeriodId).Description;
                GradeReportMainResources resources = _resourcesHelper.GetUnionResourceType<GradeReportMainResources>(language,
                    new DynamicValue("Grades", "GradeReportMain"),
                    new DynamicValue("Generic", "SectionDetailModal"));
                string nameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.Grade);
                bool showMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.Grade);
                string studentName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(people)), nameFormat, showMiddleNameInitial);

                if (sequence != null)
                    gradesReportViewModel.TranscriptSequences = gradesReportViewModel.TranscriptSequences.Where(ts => ts.SequenceNumber == sequence).ToList();

                LocalReport localReport = new();
                localReport.EnableHyperlinks = true;
                localReport.ReportPath = Path.Combine(_environment.ContentRootPath, GradesReportPath);
                localReport.ShowDetailedSubreportMessages = true;
                localReport.SubreportProcessing += (object sender, SubreportProcessingEventArgs e) =>
                {
                    int transcriptSequenceIndex;
                    TranscriptSequenceViewModel transcriptSequence;
                    switch (e.ReportPath)
                    {
                        case "TranscriptSequences":

                            transcriptSequenceIndex = Convert.ToInt32(e.Parameters["TranscriptSequenceIndex"].Values[0]);
                            transcriptSequence = gradesReportViewModel.TranscriptSequences[transcriptSequenceIndex];

                            e.DataSources.Add(new ReportDataSource("Sessions",
                                   transcriptSequence.Sessions.Select(s => new
                                   {
                                       s.SessionDesc,
                                       SessionIndex = transcriptSequence.Sessions.IndexOf(s)
                                   })));

                            break;

                        case "Sessions":

                            transcriptSequenceIndex = Convert.ToInt32(e.Parameters["TranscriptSequenceIndex"].Values[0]);
                            transcriptSequence = gradesReportViewModel.TranscriptSequences[transcriptSequenceIndex];

                            int sessionIndex = Convert.ToInt32(e.Parameters["SessionIndex"].Values[0]);
                            TranscriptSequenceSessionViewModel session = transcriptSequence.Sessions[sessionIndex];

                            e.DataSources.Add(new ReportDataSource("Courses", session.Courses));

                            break;
                    }
                };

                ReportDataSource dataSource = new("TranscriptSequences",
                    gradesReportViewModel.TranscriptSequences.Select(ts => new
                    {
                        TranscriptSequenceIndex = gradesReportViewModel.TranscriptSequences.IndexOf(ts),
                        ts.AwardsOverall,
                        ts.AwardsTerm,
                        ts.CreditsAttempted,
                        ts.CreditsEarned,
                        ts.GpaOverall,
                        ts.GpaTerm,
                        ts.SequenceNumber,
                        ts.Sessions
                    }));

                localReport.DataSources.Clear();
                localReport.DataSources.Add(dataSource);

                ReportParameter[] reportParameters = new ReportParameter[]
                {
                    new ReportParameter("YearTerm",yearTerm),
                    new ReportParameter("StudentName", studentName),
                    new ReportParameter("InstitutionName",gradesReportViewModel.InstitutionName),
                    new ReportParameter("Line1",gradesReportViewModel.Line1),
                    new ReportParameter("Line2",gradesReportViewModel.Line2),
                    new ReportParameter("Line3",gradesReportViewModel.Line3),
                    new ReportParameter("Line4",gradesReportViewModel.Line4),
                    new ReportParameter("HouseNumber",gradesReportViewModel.HouseNumber),
                    new ReportParameter("City",gradesReportViewModel.City),
                    new ReportParameter("StateProvince",gradesReportViewModel.StateProvince),
                    new ReportParameter("PostalCode",gradesReportViewModel.PostalCode),
                    new ReportParameter("Country",gradesReportViewModel.Country),
                    new ReportParameter("ShowInstitutionName",gradesReportViewModel.ShowInstitutionName.ToString()),
                    new ReportParameter("ShowInstitutionAddress",gradesReportViewModel.ShowInstitutionAddress.ToString()),
                    new ReportParameter("ShowMidTermGrades",gradesReportViewModel.ShowMidTermGrades.ToString()),
                    new ReportParameter("ShowProjectedGrades",gradesReportViewModel.ShowProjectedGrades.ToString()),
                    // Resources
                    new ReportParameter("LblAttempted", resources.GradeReport.LblAttempted),
                    new ReportParameter("LblEarned", resources.GradeReport.LblEarned),
                    new ReportParameter("LblTerm", resources.GradeReport.LblTerm),
                    new ReportParameter("LblOverall", resources.GradeReport.LblOverall),
                    new ReportParameter("LblCredits", resources.GradeReport.LblCredits),
                    new ReportParameter("LblGpa", resources.GradeReport.LblGpa),
                    new ReportParameter("LblCourseDetail", resources.GradeReport.LblCourseDetail),
                    new ReportParameter("LblSubtype", resources.GradeReport.LblSubtype),
                    new ReportParameter("LblSectionDetail", resources.GradeReport.LblSectionDetail),
                    new ReportParameter("LblCreditsDetail", resources.GradeReport.LblCreditsDetail),
                    new ReportParameter("LblQualityPoints", resources.GradeReport.LblQualityPointsDetail),
                    new ReportParameter("LblMidtermGradeDetail", resources.GradeReport.LblMidtermGradeDetail),
                    new ReportParameter("LblProjectedGradeDetail", resources.GradeReport.LblProjectedGradeDetail),
                    new ReportParameter("LblFinalGradeDetail", resources.GradeReport.LblFinalGradeDetail),
                    new ReportParameter("LblAwards", resources.GradeReport.LblAwards),
                    new ReportParameter("LblTermAward", resources.GradeReport.LblTermAward),
                    new ReportParameter("LblOverallAward", resources.GradeReport.LblOverallAward),
                    new ReportParameter("LblGradesReportFor", resources.GradeReport.LblGradesReportFor),
                    new ReportParameter("LblSequence", resources.GradeReport.LblSequence),
                    new ReportParameter("LblSession", resources.GradeReport.LblSession),
                    new ReportParameter("LblPage", resources.GradeReport.LblPage),
                    new ReportParameter("LblOf", resources.GradeReport.LblOf),
                    new ReportParameter("LblCourseComments", resources.GradeReport.LblCourseComments),
                    new ReportParameter("LblFinalGradeComments", resources.GradeReport.LblFinalGradeComments),
                    new ReportParameter("LblMidGradeComments", resources.GradeReport.LblMidGradeComments),
                    new ReportParameter("LblFinalGradeComments", resources.GradeReport.LblFinalGradeComments)
                };

                localReport.SetParameters(reportParameters);

                localReport.Refresh();

                byte[] renderBytes = localReport.Render("PDF", null);
                return renderBytes;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ReportHelper).FullName, exception.Message, exception);
                return default(byte[]);
            }
        }

        /// <summary>
        /// Gets the statements report.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <param name="statementNumber">The statement number.</param>
        /// <param name="currentNameFormat">The current name format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        public byte[] GetStatements(int personId, int statementNumber, string currentNameFormat, bool showMiddleNameInitial, string language)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                StatementViewModel statementViewModel = _financeService.GetStatement(personId, statementNumber).ToViewModel(currentNameFormat, general, showMiddleNameInitial);
                StatementResources resources = _resourcesHelper.GetResourceTypeWithLayout<StatementResources>(language, new("Finances", "Statement"));
                LocalReport localReport = new();
                localReport.EnableHyperlinks = true;
                localReport.ReportPath = Path.Combine(_environment.ContentRootPath, StatementsReportPath);
                localReport.ShowDetailedSubreportMessages = true;
                localReport.SubreportProcessing += (object sender, SubreportProcessingEventArgs e) =>
                {
                };

                ReportDataSource chargesDataSource = new("Charges", statementViewModel.Charges);
                ReportDataSource creditsDataSource = new("Credits", statementViewModel.Credits);
                ReportDataSource anticipatedAidsDataSource = new("AnticipatedAids", statementViewModel.AnticipatedAids);
                ReportDataSource paymentplanCharges = new("PaymentPlanCharges", statementViewModel.PaymentPlanCharges);

                localReport.DataSources.Clear();
                localReport.DataSources.Add(chargesDataSource);
                localReport.DataSources.Add(creditsDataSource);
                localReport.DataSources.Add(anticipatedAidsDataSource);
                localReport.DataSources.Add(paymentplanCharges);

                ReportParameter[] reportParameters = new ReportParameter[]
                {
                    new ReportParameter("Title",statementViewModel.Title),
                    new ReportParameter("Number",statementViewModel.Number.ToString()),
                    new ReportParameter("Date",statementViewModel.Date),
                    new ReportParameter("FullName",statementViewModel.Student.FullName),
                    new ReportParameter("AddressHouseNumber",statementViewModel.Student.Address.HouseNumber),
                    new ReportParameter("AddressLine1",statementViewModel.Student.Address.Line1),
                    new ReportParameter("AddressLine2",statementViewModel.Student.Address.Line2),
                    new ReportParameter("AddressLine3",statementViewModel.Student.Address.Line3),
                    new ReportParameter("AddressLine4",statementViewModel.Student.Address.Line4),
                    new ReportParameter("AddressLine5",statementViewModel.Student.Address.Line5),
                    new ReportParameter("PeopleId",statementViewModel.Student.PeopleId),
                    new ReportParameter("TotalCharges",statementViewModel.TotalCharges),
                    new ReportParameter("TotalChargesHasValue",statementViewModel.TotalChargesHasValue.ToString()),
                    new ReportParameter("TotalCredits",statementViewModel.TotalCredits),
                    new ReportParameter("TotalCreditsHasValue",statementViewModel.TotalCreditsHasValue.ToString()),
                    new ReportParameter("TotalAnticipatedAid",statementViewModel.TotalAnticipatedAid),
                    new ReportParameter("TotalAnticipatedAidHasValue",statementViewModel.TotalAnticipatedAidHasValue.ToString()),
                    new ReportParameter("OtherAmountDue",statementViewModel.OtherAmountDue),
                    new ReportParameter("OtherAmountDueHasValue",statementViewModel.OtherAmountDueHasValue.ToString()),
                    new ReportParameter("PaymentDue",statementViewModel.PaymentDue),
                    new ReportParameter("DueDate",statementViewModel.DueDate),
                    new ReportParameter("AnticipatedMessage",statementViewModel.AnticipatedMessage),
                    new ReportParameter("PosNegMessage",statementViewModel.PosNegMessage),
                    new ReportParameter("GeneralMessage",statementViewModel.GeneralMessage),
                    new ReportParameter("LessAnticipatedCredits",statementViewModel.LessAnticipatedCredits),
                    new ReportParameter("AmountEnclosed",""),
                    new ReportParameter("CreditCardTypes",statementViewModel.CreditCardTypes),
                    new ReportParameter("MailToFullName",statementViewModel.MailTo.FullName),
                    new ReportParameter("MailToHouseNumber",statementViewModel.MailTo.Address.HouseNumber),
                    new ReportParameter("MailToLine1",statementViewModel.MailTo.Address.Line1),
                    new ReportParameter("MailToLine2",statementViewModel.MailTo.Address.Line2),
                    new ReportParameter("MailToLine3",statementViewModel.MailTo.Address.Line3),
                    new ReportParameter("MailToLine4",statementViewModel.MailTo.Address.Line4),
                    new ReportParameter("MailToLine5",statementViewModel.MailTo.Address.Line5),
                    new ReportParameter("MailToPeopleId",statementViewModel.MailTo.PeopleId),
                    new ReportParameter("OrganizationName",statementViewModel.Organization.Name),
                    new ReportParameter("OrganizationHouseNumber",statementViewModel.Organization.Address.HouseNumber),
                    new ReportParameter("OrganizationLine1",statementViewModel.Organization.Address.Line1),
                    new ReportParameter("OrganizationLine2",statementViewModel.Organization.Address.Line2),
                    new ReportParameter("OrganizationLine3",statementViewModel.Organization.Address.Line3),
                    new ReportParameter("OrganizationLine4",statementViewModel.Organization.Address.Line4),
                    new ReportParameter("OrganizationLine5",statementViewModel.Organization.Address.Line5),
                    //Resources
                    new ReportParameter("LblAmount",resources.StatementInformation.LblAmount),
                    new ReportParameter("LblAmountEnclosed",resources.StatementInformation.LblAmountEnclosed),
                    new ReportParameter("LblAmountNotCovered",resources.StatementInformation.LblAmountNotCovered),
                    new ReportParameter("LblAnticipatedAids",resources.StatementInformation.LblAnticipatedAids),
                    new ReportParameter("LblCharges",resources.StatementInformation.LblCharges),
                    new ReportParameter("LblCreditCardNumber",resources.StatementInformation.LblCreditCardNumber),
                    new ReportParameter("LblCreditCardType",resources.StatementInformation.LblCreditCardType),
                    new ReportParameter("LblCredits",resources.StatementInformation.LblCredits),
                    new ReportParameter("LblCurrentBalance",resources.StatementInformation.LblCurrentBalance),
                    new ReportParameter("LblDate",resources.StatementInformation.LblDate),
                    new ReportParameter("LblDescription",resources.StatementInformation.LblDescription),
                    new ReportParameter("LblDueDate",resources.StatementInformation.LblDueDate),
                    new ReportParameter("LblError",resources.LblError),
                    new ReportParameter("LblExpirationDate",resources.StatementInformation.LblExpirationDate),
                    new ReportParameter("LblFor",resources.StatementInformation.LblFor),
                    new ReportParameter("LblHeaderTitle",resources.LblHeaderTitle),
                    new ReportParameter("LblId",resources.StatementInformation.LblId),
                    new ReportParameter("LblInstructions",resources.StatementInformation.LblInstructions),
                    new ReportParameter("LblLessAnticipatedCredits",resources.StatementInformation.LblLessAnticipatedCredits),
                    new ReportParameter("LblLine",resources.StatementInformation.LblLine),
                    new ReportParameter("LblNoConnection",resources.LblNoConnection),
                    new ReportParameter("LblNoStatementsAvailable",resources.LblNoStatemenstAvailable),
                    new ReportParameter("LblNumber",resources.StatementOptions.LblNumber),
                    new ReportParameter("LblOtherAmount",resources.StatementInformation.LblOtherAmount),
                    new ReportParameter("LblPageInstructions",resources.StatementInformation.LblPageInstructions),
                    new ReportParameter("LblPageTitle",resources.LblPageTitle),
                    new ReportParameter("LblPageTitleGeneral",resources.LblPageTitleGeneral),
                    new ReportParameter("LblPaymentDue",resources.StatementInformation.LblPaymentDue),
                    new ReportParameter("LblPaymentDueBy",resources.StatementInformation.LblPaymentDueBy),
                    new ReportParameter("LblPaymentPlanInformation",resources.StatementInformation.LblPaymentPlanInformation),
                    new ReportParameter("LblPeriod",resources.StatementInformation.LblPeriod),
                    new ReportParameter("LblPreviousBalance",resources.StatementInformation.LblPreviousBalance),
                    new ReportParameter("LblSeparator",resources.StatementInformation.LblSeparator),
                    new ReportParameter("LblSignature",resources.StatementInformation.LblSignature),
                    new ReportParameter("LblStatementNumber",resources.StatementInformation.LblStatementNumber),
                    new ReportParameter("LblTotalAnticipated",resources.StatementInformation.LblTotalAnticipated),
                    new ReportParameter("LblTotalCharges",resources.StatementInformation.LblTotalCharges),
                    new ReportParameter("LblTotalCredits",resources.StatementInformation.LblTotalCredits),
                    new ReportParameter("LblPage",resources.LblPage),
                    new ReportParameter("LblOf",resources.LblOf),
                    // Missing parameters
                    new ReportParameter("PreviousBalance",statementViewModel.PreviousBalance),
                    new ReportParameter("BalanceTypeDesc",statementViewModel.BalanceTypeDesc),
                    new ReportParameter("ShowPreviousBalance",statementViewModel.ShowPreviousBalance.ToString()),
                    new ReportParameter("CurrentBalance",statementViewModel.CurrentBalance),
                    new ReportParameter("Description",statementViewModel.Description)
                };
                localReport.SetParameters(reportParameters);

                localReport.Refresh();

                byte[] renderBytes = localReport.Render("PDF", null);
                return renderBytes;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ReportHelper).FullName, exception.Message, exception);
                return default(byte[]);
            }
        }

        /// <summary>
        /// Gets the student schedule.
        /// </summary>
        /// <param name="peopleYearTermSession">The people year term session.</param>
        /// <param name="currentNameFormat">The current name format.</param>
        /// <param name="currentNameSort">The current name sort.</param>
        /// <param name="filter">The filter.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        public byte[] GetStudentSchedule(PeopleYearTermSessionModel peopleYearTermSession, string currentNameFormat, string currentNameSort, int filter,
            bool showMiddleNameInitial, string language)
        {
            try
            {
                List<List<ClassDetail>> classDetails;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Registration registrationSettings = _institutionSettingService.GetRegistration();

                // Report only variables
                string yearReport = peopleYearTermSession.Year.ToString();
                string termReport = peopleYearTermSession.Term;
                string sessionReport = string.Empty;

                ClassDetailFilter classDetailFilter = new()
                {
                    PersonId = peopleYearTermSession.PersonId,
                    CreditTypes = registrationSettings.AllowChangeOfCreditType,
                    Cart = true,
                    Denied = true,
                    Pending = true,
                    Waitlist = true,
                    Registered = true,
                    PermissionRequest = registrationSettings.EnableInstructorPermissionRequest,
                    RegisterForPendingCourses = registrationSettings.EnableRegisterForPendingCourses,
                    Term = peopleYearTermSession.Term,
                    Year = peopleYearTermSession.Year
                };
                (classDetails, _) = _scheduleService.GetForStudent(classDetailFilter);
                List<List<StudentScheduleViewModel>> scheduleStudentViewModel = classDetails.ToStudentViewModel(_institutionSettingService, currentNameFormat, currentNameSort, showMiddleNameInitial);

                List<Academic> studentAcademics =
                    _academicService.GetInformation(
                        peopleYearTermSession.PersonId, peopleYearTermSession.Year.ToString(), peopleYearTermSession.Term, peopleYearTermSession.Session);

                List<SectionsSessionViewModel> sectionsSessionList = null;
                SectionsSessionViewModel sectionsSessionViewModel = null;
                if (scheduleStudentViewModel?.Count > 0)
                {
                    sectionsSessionList = new List<SectionsSessionViewModel>();
                    if (!string.IsNullOrEmpty(peopleYearTermSession.Session))
                    {
                        sectionsSessionViewModel = new SectionsSessionViewModel
                        {
                            Session = peopleYearTermSession.Session,
                            Sections = new List<List<StudentScheduleViewModel>>()
                        };

                        List<StudentScheduleViewModel> tempList = null;
                        string sessionDesc = string.Empty;
                        foreach (List<StudentScheduleViewModel> list in scheduleStudentViewModel)
                        {
                            tempList = list.FindAll(s => s.Session == peopleYearTermSession.Session);
                            sectionsSessionViewModel.Sections.Add(tempList);
                            if (tempList?.Count > 0 && string.IsNullOrEmpty(sessionDesc))
                                sessionDesc = tempList[0].SessionDesc;
                        }
                        sectionsSessionViewModel.SessionDesc = sessionDesc;
                        sectionsSessionList.Add(sectionsSessionViewModel);
                        sessionReport = sessionDesc;
                    }
                    else
                    {
                        for (int j = 0; j < scheduleStudentViewModel.Count; j++)
                        {
                            for (int i = 0; i < scheduleStudentViewModel[j].Count; i++)
                            {
                                sectionsSessionViewModel = sectionsSessionList.Find(s => s.Session == scheduleStudentViewModel[j][i].Session);
                                if (sectionsSessionViewModel == null)
                                {
                                    sectionsSessionViewModel = new SectionsSessionViewModel
                                    {
                                        Session = scheduleStudentViewModel[j][i].Session,
                                        SessionDesc = scheduleStudentViewModel[j][i].SessionDesc,
                                        Sections = new List<List<StudentScheduleViewModel>>()
                                    };
                                    for (int z = 0; z < 5; z++)
                                        sectionsSessionViewModel.Sections.Add(new List<StudentScheduleViewModel>());
                                    sectionsSessionList.Add(sectionsSessionViewModel);
                                }
                                sectionsSessionViewModel.Sections[j].Add(scheduleStudentViewModel[j][i]);
                            }
                        }
                        sectionsSessionList = sectionsSessionList.OrderBy(s => s.Session).ToList();
                    }
                }

                List<AcademicInformationViewModel> academicInformation = studentAcademics.ToViewModel(currentNameFormat, showMiddleNameInitial);
                string registeredCredits = FormatHelper.ToCredits(classDetails?[3]?.Count > 0 ? classDetails[3].Sum(x => x.Credits) : 0, general.Credits);

                // Get Registered sections
                int registeredCount = 0;
                for (int i = 0; i < sectionsSessionList.Count; i++)
                {
                    // Registered sections are in position [3] of sectionsSessionList[i].Sections
                    registeredCount += sectionsSessionList[i].Sections[3].Count;
                }

                // Get student name
                People people = _peopleService.Get(peopleYearTermSession.PersonId);
                string fullName = people.ToViewModel(_nameFormatService, showMiddleNameInitial) ?? string.Empty;

                // Report section
                StudentScheduleResources resources = _resourcesHelper.GetResourceType<StudentScheduleResources>(language, new("Registration", "StudentSchedule"));

                LocalReport localReport = new();
                localReport.EnableHyperlinks = true;
                localReport.ReportPath = Path.Combine(_environment.ContentRootPath, StudentScheduleReportPath);
                localReport.ShowDetailedSubreportMessages = true;
                localReport.SubreportProcessing += (object sender, SubreportProcessingEventArgs e) =>
                {
                    int scheduleIndex;
                    try
                    {
                        switch (e.ReportPath)
                        {
                            case "Schedule":

                                scheduleIndex = Convert.ToInt32(e.Parameters["ScheduleIndex"].Values[0]);
                                SectionsSessionViewModel schedule = sectionsSessionList[scheduleIndex];

                                schedule.Sections.ForEach(s => s.ForEach(x =>
                                {
                                    x.InstructorsCount = x.Instructors?.Count ?? 0;
                                    x.InstructorName = x.Instructors?.Count == 1 ? x.Instructors[0].FullName : string.Empty;
                                    x.SchedulesCount = x.Schedules?.Count ?? 0;
                                    x.ScheduleOrgName = x.Schedules?.Count == 1 ? x.Schedules[0].OrgName : string.Empty;
                                    x.ScheduleBldgName = x.Schedules?.Count == 1 ? x.Schedules[0].BldgName : string.Empty;
                                    x.ScheduleFloorId = x.Schedules?.Count == 1 ? x.Schedules[0].FloorId : string.Empty;
                                    x.ScheduleRoomId = x.Schedules?.Count == 1 ? x.Schedules[0].RoomId : string.Empty;
                                    x.ScheduleStartTime = x.Schedules?.Count == 1 ? x.Schedules[0].StartTime : string.Empty;
                                    x.ScheduleEndTime = x.Schedules?.Count == 1 ? x.Schedules[0].EndTime : string.Empty;
                                    x.ScheduleDayDesc = x.Schedules?.Count == 1 ? x.Schedules[0].DayDesc : string.Empty;
                                }));

                                e.DataSources.Clear();
                                e.DataSources.Add(new ReportDataSource("WaitList", schedule.Sections[0]));
                                e.DataSources.Add(new ReportDataSource("InCart", schedule.Sections[1]));
                                e.DataSources.Add(new ReportDataSource("Pending", schedule.Sections[2]));
                                e.DataSources.Add(new ReportDataSource("Registered", schedule.Sections[3]));
                                e.DataSources.Add(new ReportDataSource("Denied", schedule.Sections[4]));
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(Constants._product, typeof(ReportHelper).FullName, ex.Message, ex);
                    }
                };

                ReportDataSource studentsDataSource = new("AcademicInformation", academicInformation ?? new List<AcademicInformationViewModel>());
                ReportDataSource scheduleDataSource = new("Schedule", sectionsSessionList.Select(s => new
                {
                    s.Session,
                    s.SessionDesc,
                    ScheduleIndex = sectionsSessionList.IndexOf(s),
                    Filter = filter,
                }));

                localReport.DataSources.Clear();
                localReport.DataSources.Add(studentsDataSource);
                localReport.DataSources.Add(scheduleDataSource);

                ReportParameter[] reportParameters = new ReportParameter[]
                {
                    new ReportParameter("RegisteredCredits", registeredCredits),
                    new ReportParameter("FullName", fullName),
                    new ReportParameter("Year", yearReport),
                    new ReportParameter("Term", termReport),
                    new ReportParameter("Session", sessionReport),
                    new ReportParameter("RegisteredCount", registeredCount.ToString()),
                    //Resources
                    new ReportParameter("lblAdvisors", resources.ScheduleDetail.LblAdvisors),
                    new ReportParameter("lblRegisteredCourses", resources.ScheduleDetail.LblRegisteredCourses),
                    new ReportParameter("lblRegisteredCredits", resources.ScheduleDetail.LblRegisteredCredits),
                    new ReportParameter("lblSection", resources.ScheduleDetail.ScheduleItem.LblSection),
                    new ReportParameter("lblSession", resources.ScheduleDetail.ScheduleItem.LblSession),
                    new ReportParameter("lblSubtype", resources.ScheduleDetail.ScheduleItem.LblSubtype),
                    new ReportParameter("lblType", resources.ScheduleDetail.ScheduleItem.LblType),
                    new ReportParameter("lblDuration", resources.ScheduleDetail.ScheduleItem.LblDuration),
                    new ReportParameter("lblCreditType", resources.ScheduleDetail.ScheduleItem.LblCreditType),
                    new ReportParameter("lblFees", resources.ScheduleDetail.ScheduleItem.LblFees),
                    new ReportParameter("lblNoSchedule", resources.ScheduleDetail.ScheduleItem.LblNoSchedule),
                    new ReportParameter("lblMultipleMeetingTimes", resources.ScheduleDetail.ScheduleItem.LblMultipleMeetingTimes),
                    new ReportParameter("lblFloor", resources.ScheduleDetail.ScheduleItem.LblFloor),
                    new ReportParameter("lblRoom", resources.ScheduleDetail.ScheduleItem.LblRoom),
                    new ReportParameter("lblNoInstructor", resources.ScheduleDetail.ScheduleItem.LblNoInstructor),
                    new ReportParameter("lblMultipleInstructors", resources.ScheduleDetail.ScheduleItem.LblMultipleInstructors),
                    new ReportParameter("lblDropPendingApproval", resources.ScheduleDetail.ScheduleItem.LblDropPendingApproval),
                    new ReportParameter("lblDropDenied", resources.ScheduleDetail.ScheduleItem.LblDropDenied),
                    new ReportParameter("lblPermissionDenied", resources.ScheduleDetail.ScheduleItem.LblPermissionDenied),
                    new ReportParameter("lblApprovalDenied", resources.ScheduleDetail.ScheduleItem.LblApprovalDenied),
                    new ReportParameter("lblOnWaitlist", resources.ScheduleDetail.ScheduleItem.LblOnWaitlist),
                    new ReportParameter("lblPermissionRequested", resources.ScheduleDetail.ScheduleItem.LblPermissionRequested),
                    new ReportParameter("lblAwaitingApproval", resources.ScheduleDetail.ScheduleItem.LblAwaitingApproval),
                    new ReportParameter("lblRegisterNow", resources.ScheduleDetail.ScheduleItem.LblRegisterNow),
                    new ReportParameter("lblSeatAvailable", resources.ScheduleDetail.ScheduleItem.LblSeatAvailable),
                    new ReportParameter("lblSeatDeadline", resources.ScheduleDetail.ScheduleItem.LblSeatDeadline),
                    new ReportParameter("lblPermissionApproved", resources.ScheduleDetail.ScheduleItem.LblPermissionApproved),
                    new ReportParameter("lblDenied", resources.ScheduleDetail.ScheduleCalendar.LblDenied),
                    new ReportParameter("lblInCart", resources.ScheduleDetail.ScheduleCalendar.LblInCart),
                    new ReportParameter("lblPending", resources.ScheduleDetail.ScheduleCalendar.LblPending),
                    new ReportParameter("lblRegistered", resources.ScheduleDetail.ScheduleCalendar.LblRegistered),
                    new ReportParameter("lblCredits", resources.ScheduleDetail.ScheduleItem.LblCredits),
                    new ReportParameter("lblInstructors", resources.ScheduleDetail.ScheduleItem.LblInstructors),
                    new ReportParameter("lblStatus", resources.ScheduleDetail.ScheduleItem.LblStatus),
                    new ReportParameter("lblPage", resources.ScheduleDetail.LblPage),
                    new ReportParameter("lblOf", resources.ScheduleDetail.LblOf),
                    new ReportParameter("lblAdvisorAuthorizationNeeded", resources.ScheduleDetail.ScheduleItem.LblAdvisorAuthorizationNeeded),
                };
                localReport.EnableExternalImages = true;
                localReport.SetParameters(reportParameters);

                localReport.Refresh();

                byte[] renderBytes = localReport.Render("PDF", null);
                return renderBytes;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ReportHelper).FullName, exception.Message, exception);
                return default(byte[]);
            }
        }

        /// <summary>
        /// Gets the UnofficialTranscript report
        /// </summary>
        /// <param name="id">The identifier of the student</param>
        /// <param name="currentNameFormat">Current format used</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        public byte[] GetUnofficialTranscript(int id, string currentNameFormat, bool showMiddleNameInitial, string language)
        {
            try
            {
                Hedtech.PowerCampus.Core.DTO.Student.UnofficialTranscript unofficialTranscript = _gradeService.GetUnofficialTranscript(id, true, id);
                UnofficialTranscriptViewModel unofficialTranscriptViewModel = unofficialTranscript.ToViewModel(_institutionSettingService, currentNameFormat, showMiddleNameInitial);
                UnofficialTranscriptMainResources resources = _resourcesHelper.GetResourceType<UnofficialTranscriptMainResources>(language, new("Grades", "UnofficialTranscriptMain"));

                LocalReport localReport = new();
                localReport.EnableHyperlinks = true;
                localReport.ReportPath = Path.Combine(_environment.ContentRootPath, UnofficialTranscriptReportPath);
                localReport.ShowDetailedSubreportMessages = true;
                localReport.SubreportProcessing += (object sender, SubreportProcessingEventArgs e) =>
                {
                    int headerInformationIndex, transcriptYearTermIndex;
                    HeaderInformationViewModel headerInformation;
                    TranscriptYearTermViewModel transcriptYearTerm;
                    try
                    {
                        switch (e.ReportPath)
                        {
                            case "HeaderInformation":

                                headerInformationIndex = Convert.ToInt32(e.Parameters["HeaderInformationIndex"].Values[0]);
                                headerInformation = unofficialTranscriptViewModel.HeaderInformation[headerInformationIndex];

                                e.DataSources.Clear();
                                e.DataSources.Add(new ReportDataSource("TranscriptYearTerm",
                                    headerInformation.TranscriptYearTerm.Select(t => new
                                    {
                                        TranscriptYearTermIndex = headerInformation.TranscriptYearTerm.IndexOf(t),
                                        t.Period
                                    })));
                                e.DataSources.Add(new ReportDataSource("TranscriptDegree", headerInformation.TranscriptDegree));
                                e.DataSources.Add(new ReportDataSource("TestScores", unofficialTranscriptViewModel.TestScores));
                                e.DataSources.Add(new ReportDataSource("TranscriptNotes", headerInformation.TranscriptNotes
                                    .Select(n => new { TranscriptNote = n })));

                                break;

                            case "TranscriptYearTerm":
                                headerInformationIndex = Convert.ToInt32(e.Parameters["HeaderInformationIndex"].Values[0]);
                                headerInformation = unofficialTranscriptViewModel.HeaderInformation[headerInformationIndex];

                                transcriptYearTermIndex = Convert.ToInt32(e.Parameters["TranscriptYearTermIndex"].Values[0]);
                                transcriptYearTerm = headerInformation.TranscriptYearTerm[transcriptYearTermIndex];

                                e.DataSources.Add(new ReportDataSource("TranscriptGpa", transcriptYearTerm.TranscriptGpa));
                                e.DataSources.Add(new ReportDataSource("TranscriptOrganization", transcriptYearTerm.TranscriptOrganization.Select(o =>
                                 new
                                 {
                                     o.OrganizationName,
                                     o.TranscriptCourses,
                                     TranscriptOrganizationIndex = transcriptYearTerm.TranscriptOrganization.IndexOf(o)
                                 })));
                                e.DataSources.Add(new ReportDataSource("YearTermAwards", transcriptYearTerm.YearTermAwards
                                                                .Select(a => new { YearTermAward = a })));

                                break;

                            case "TranscriptYearTermNotes":

                                headerInformationIndex = Convert.ToInt32(e.Parameters["HeaderInformationIndex"].Values[0]);
                                headerInformation = unofficialTranscriptViewModel.HeaderInformation[headerInformationIndex];

                                transcriptYearTermIndex = Convert.ToInt32(e.Parameters["TranscriptYearTermIndex"].Values[0]);
                                transcriptYearTerm = headerInformation.TranscriptYearTerm[transcriptYearTermIndex];

                                e.DataSources.Add(new ReportDataSource("YearTermNotes", transcriptYearTerm.YearTermNotes
                                                                .Select(ytm => new { YearTermNote = ytm })));

                                break;

                            case "TranscriptOrganization":
                                headerInformationIndex = Convert.ToInt32(e.Parameters["HeaderInformationIndex"].Values[0]);
                                headerInformation = unofficialTranscriptViewModel.HeaderInformation[headerInformationIndex];

                                transcriptYearTermIndex = Convert.ToInt32(e.Parameters["TranscriptYearTermIndex"].Values[0]);
                                transcriptYearTerm = headerInformation.TranscriptYearTerm[transcriptYearTermIndex];

                                int transcriptOrganizationIndex = Convert.ToInt32(e.Parameters["TranscriptOrganizationIndex"].Values[0]);
                                TranscriptOrganizationViewModel transcriptOrganization = transcriptYearTerm.TranscriptOrganization[transcriptOrganizationIndex];

                                e.DataSources.Clear();
                                e.DataSources.Add(new ReportDataSource("TranscriptCourses", transcriptOrganization.TranscriptCourses));
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(Constants._product, typeof(ReportHelper).FullName, ex.Message, ex);
                    }
                };

                ReportDataSource dataSource = new("HeaderInformation",
                    unofficialTranscriptViewModel.HeaderInformation.Select(h => new
                    {
                        HeaderInformationIndex = unofficialTranscriptViewModel.HeaderInformation.IndexOf(h),
                        h.OrgName,
                        h.HouseNumber,
                        h.AddressLine1,
                        h.AddressLine2,
                        h.AddressLine3,
                        h.AddressLine4,
                        h.AddressLine5,
                        h.FullName,
                        h.GovernmentId,
                        h.BirthDate,
                        h.Honors,
                        PreviousInstitutions = string.Join(",", h.PreviousInstitutions),
                        h.CumGpa,
                        h.TotalCredits?.CreditsTaken,
                        h.TotalCredits?.CreditsTransfer,
                        h.TotalCredits?.CreditsOverall
                    }));

                localReport.DataSources.Clear();
                localReport.DataSources.Add(dataSource);

                ReportParameter[] reportParameters = new ReportParameter[]
                {
                    new ReportParameter("Legend", Regex.Replace(unofficialTranscriptViewModel.Legend, "<.*?>", string.Empty)),
                    new ReportParameter("ShowLegend", unofficialTranscriptViewModel.ShowLegend.ToString()),
                    new ReportParameter("ShowDateOfBirth", unofficialTranscriptViewModel.ShowDateOfBirth.ToString()),
                    new ReportParameter("ShowGovernmentId", unofficialTranscriptViewModel.ShowGovernmentId.ToString()),
                    new ReportParameter("ShowAlternateGrade", unofficialTranscriptViewModel.ShowAlternateGrade.ToString()),
                    new ReportParameter("ShowClassInformation", unofficialTranscriptViewModel.ShowClassInformation.ToString()),
                    new ReportParameter("ShowFiceCode", unofficialTranscriptViewModel.ShowFiceCode.ToString()),
                    new ReportParameter("ShowTotalsAtEnd", unofficialTranscriptViewModel.ShowTotalsAtEnd.ToString()),
                    //Resources
                    new ReportParameter("LblUnofficialTranscript", resources.UnofficialTranscriptInfo.LblUnofficialTranscript),
                    new ReportParameter("LblName", resources.UnofficialTranscriptInfo.LblName),
                    new ReportParameter("LblDob", resources.UnofficialTranscriptInfo.LblDob),
                    new ReportParameter("LblId", resources.UnofficialTranscriptInfo.LblId),
                    new ReportParameter("LblProgramDegreeCurriculum", resources.UnofficialTranscriptInfo.LblProgramDegreeCurriculum),
                    new ReportParameter("LblDegreeAwarded", resources.UnofficialTranscriptInfo.LblDegreeAwarded),
                    new ReportParameter("LblDateGranted", resources.UnofficialTranscriptInfo.LblDateGranted),
                    new ReportParameter("LblHonors", resources.UnofficialTranscriptInfo.LblHonors),
                    new ReportParameter("LblPreviousInstitution", resources.UnofficialTranscriptInfo.LblPreviousInstitution),
                    new ReportParameter("LblCumulativeGpa", resources.UnofficialTranscriptInfo.LblCumulativeGpa),
                    new ReportParameter("LblCourse", resources.UnofficialTranscriptInfo.UnofficialTranscriptOrganization.LblCourse),
                    new ReportParameter("LblCourseComments", resources.UnofficialTranscriptInfo.UnofficialTranscriptOrganization.LblCourseComments),
                    new ReportParameter("LblFinalGradeComments", resources.UnofficialTranscriptInfo.UnofficialTranscriptOrganization.LblFinalGradeComments),
                    new ReportParameter("LblTitle", resources.UnofficialTranscriptInfo.UnofficialTranscriptOrganization.LblTitle),
                    new ReportParameter("LblSubType", resources.UnofficialTranscriptInfo.UnofficialTranscriptOrganization.LblSubType),
                    new ReportParameter("LblGrade", resources.UnofficialTranscriptInfo.UnofficialTranscriptOrganization.LblGrade),
                    new ReportParameter("LblCredits", resources.UnofficialTranscriptInfo.UnofficialTranscriptOrganization.LblCredits),
                    new ReportParameter("LblQualityPoints", resources.UnofficialTranscriptInfo.UnofficialTranscriptOrganization.LblQualityPoints),
                    new ReportParameter("LblAttemptedCredit", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblAttemptedCredit),
                    new ReportParameter("LblEarnedCredits", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblEarnedCredits),
                    new ReportParameter("LblTotalCredits", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblTotalCredits),
                    new ReportParameter("LblGpaCredits", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblGpaCredits),
                    new ReportParameter("LblTransferCredits", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblTransferCredits),
                    new ReportParameter("LblGpaQualityPoints", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblQualityPoints),
                    new ReportParameter("LblGpa", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblGpa),
                    new ReportParameter("LblClassRank", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblClassRank),
                    new ReportParameter("LblClassSize", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblClassSize),
                    new ReportParameter("LblYearTermNotes", resources.UnofficialTranscriptInfo.LblYearTermNotes),
                    new ReportParameter("LblTestScores", resources.UnofficialTranscriptInfo.LblTestScores),
                    new ReportParameter("LblGeneralNotes", resources.UnofficialTranscriptInfo.LblGeneralNotes),
                    new ReportParameter("LblTotalCreditsTaken", resources.UnofficialTranscriptInfo.LblTotalCreditsTaken),
                    new ReportParameter("LblTotalTransferCredits", resources.UnofficialTranscriptInfo.LblTotalTransferCredits),
                    new ReportParameter("LblOverallCredits", resources.UnofficialTranscriptInfo.LblOverallCredits),
                    new ReportParameter("LblOfficeRegistrar", resources.UnofficialTranscriptInfo.LblOfficeRegistrar),
                    new ReportParameter("LblTest", resources.UnofficialTranscriptInfo.LblTest),
                    new ReportParameter("LblTestDate", resources.UnofficialTranscriptInfo.LblTestDate),
                    new ReportParameter("LblTerm", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblTerm),
                    new ReportParameter("LblOverall", resources.UnofficialTranscriptInfo.UnofficialTranscriptGpa.LblOverall),
                    new ReportParameter("LblAwards", resources.UnofficialTranscriptInfo.LblAwards),
                    new ReportParameter("LblPage", resources.UnofficialTranscriptInfo.LblPage),
                    new ReportParameter("LblOf", resources.UnofficialTranscriptInfo.LblOf)
                };

                localReport.SetParameters(reportParameters);

                localReport.Refresh();

                byte[] renderBytes = localReport.Render("PDF", null);
                return renderBytes;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ReportHelper).FullName, exception.Message, exception);
                return default(byte[]);
            }
        }


        /// <summary>
        /// Obtiene el reporte de referencia de pago
        /// ipasos 08/20/2024
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        public byte[] GetPaymentReference(string PersonId, string academicYear, string academicTerm, string academicSession, string FilterText)
        {
            try
            {
                // Crear instancia de LocalReport y configurar su ruta
                LocalReport localReport = new LocalReport
                {
                    EnableHyperlinks = true,
                    ReportPath = Path.Combine(_environment.ContentRootPath, PaymentReferenceReportPath),
                    ShowDetailedSubreportMessages = false
                };

                // Cargar la configuración de conexión desde un archivo JSON
                string fileName = "Config/ConnectionSettings.json";
                string jsonString = File.ReadAllText(fileName);
                ConnectionStringsInternoJson _conn = JsonSerializer.Deserialize<ConnectionStringsInternoJson>(jsonString);

                // Crear un DataSet para almacenar los datos obtenidos del SP
                DataSet ds = new DataSet();

                // Conexión a la base de datos y ejecución del SP
                using (SqlConnection conn = new SqlConnection(_conn.ConnectionStrings.PowerCampusDbContext))
                {
                    using (SqlCommand cmd = new SqlCommand("dbo.zAdd_spRetrieveAccountBalance", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@personId", SqlDbType.Int).Value = int.Parse(PersonId);
                        cmd.Parameters.Add("@academicYear", SqlDbType.NVarChar, 4).Value = academicYear;
                        cmd.Parameters.Add("@academicTerm", SqlDbType.NVarChar, 10).Value = academicTerm;
                        cmd.Parameters.Add("@academicSession", SqlDbType.NVarChar, 10).Value = string.IsNullOrEmpty(academicSession) ? (object)DBNull.Value : academicSession;
                        cmd.Parameters.Add("@filterText", SqlDbType.NVarChar, 255).Value = string.IsNullOrEmpty(FilterText) ? (object)DBNull.Value : FilterText;

                        conn.Open();
                        SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(cmd);
                        sqlDataAdapter.Fill(ds);
                    }
                }

                // Configuración del ReportDataSource
                ReportDataSource dataSource = new ReportDataSource("DataSet", ds.Tables[0]);
                localReport.DataSources.Clear();
                localReport.DataSources.Add(dataSource);
                localReport.EnableExternalImages = true;
                localReport.Refresh();

                // Renderizar el reporte como PDF
                byte[] renderBytes = localReport.Render("PDF", null, out _, out _, out _, out _, out Warning[] warnings);

                // Manejo de advertencias
                foreach (var warning in warnings)
                {
                    LogErrorToDatabase(new Exception($"Warning: {warning.Message}"));
                }

                return renderBytes;
            }
            catch (Exception ex)
            {
                LogErrorToDatabase(ex);
                return default(byte[]);
            }
        }


        private void LogErrorToDatabase(Exception exception)
        {
            try
            {
                // Leer la cadena de conexión desde el archivo JSON
                string fileName = "Config/ConnectionSettings.json";
                string jsonString = System.IO.File.ReadAllText(fileName);
                ConnectionStringsInternoJson _conn = JsonSerializer.Deserialize<ConnectionStringsInternoJson>(jsonString)!;

                // Usar la cadena de conexión para conectar a la base de datos
                using (SqlConnection conn = new SqlConnection(_conn.ConnectionStrings.PowerCampusDbContext))
                {
                    string query = "INSERT INTO zAdd_ErrorLog (ErrorMessage, StackTrace) VALUES (@ErrorMessage, @StackTrace)";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ErrorMessage", exception.Message);
                        cmd.Parameters.AddWithValue("@StackTrace", exception.StackTrace);

                        conn.Open();
                        cmd.ExecuteNonQuery();
                        conn.Close();
                    }
                }
            }
            catch (Exception logException)
            {
                // Si ocurre un error al intentar registrar el error, puedes manejarlo aquí
                // Podrías hacer un log en archivo, enviar un correo, etc.
                LogErrorToFile(logException);
                Console.WriteLine($"Error logging exception: {logException.Message}");
            }
        }

        private void LogErrorToFile(Exception exception)
        {
            try
            {
                // Definir la ruta del archivo de log
                string logFilePath = Path.Combine(_environment.ContentRootPath, "Logs", "ErrorLog.txt");

                // Asegurarse de que el directorio de logs exista
                Directory.CreateDirectory(Path.GetDirectoryName(logFilePath));

                // Escribir el error en el archivo de log
                using (StreamWriter writer = new StreamWriter(logFilePath, true))
                {
                    writer.WriteLine("Date: " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                    writer.WriteLine("Message: " + exception.Message);
                    writer.WriteLine("StackTrace: " + exception.StackTrace);
                    writer.WriteLine(new string('-', 50)); // Separador entre logs
                }
            }
            catch (Exception fileLogException)
            {
                Console.WriteLine($"Failed to log to file: {fileLogException.Message}");
            }
        }

        private void LogToConsoleFile(string message)
        {
            string logFilePath = Path.Combine(_environment.ContentRootPath, "Logs", "console.log");

            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(logFilePath)); // Asegura que el directorio de logs exista
                using (StreamWriter sw = new StreamWriter(logFilePath, true))
                {
                    sw.WriteLine($"{DateTime.Now}: {message}");
                }
            }
            catch (Exception ex)
            {
                // En caso de error al escribir en el archivo, podrías loguearlo de alguna otra forma.
                Console.WriteLine($"Failed to log to file: {ex.Message}");
            }
        }

        public void LogToConsoleDatabase(string message)
        {
            try
            {
                // Leer el archivo de configuración JSON para obtener la cadena de conexión
                string fileName = "Config/ConnectionSettings.json";
                string jsonString = System.IO.File.ReadAllText(fileName);

                ConnectionStringsInternoJson _conn = JsonSerializer.Deserialize<ConnectionStringsInternoJson>(jsonString)!;

                // Conectarse a la base de datos utilizando la cadena de conexión obtenida
                using (SqlConnection conn = new SqlConnection(_conn.ConnectionStrings.PowerCampusDbContext))
                {
                    using (SqlCommand cmd = new SqlCommand("INSERT INTO zAdd_LogConsole (Message) VALUES (@message)", conn))
                    {
                        cmd.Parameters.Add("@message", SqlDbType.NVarChar).Value = message;

                        conn.Open();
                        cmd.ExecuteNonQuery();
                        conn.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                // Manejo de errores (podrías hacer un log adicional si falla esta parte)
                Console.WriteLine($"Failed to log to file: {ex.Message}");
            }
        }

     
    }
}