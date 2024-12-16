// --------------------------------------------------------------------
// <copyright file="GradesMapper.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Models.Grades;
using SelfService.Models.Shared;
using SelfService.Models.UnofficialTranscript;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;

namespace SelfService.Mappers
{
    /// <summary>
    /// GradesMapper
    /// </summary>
    internal static class GradesMapper
    {
        /// <summary>
        /// To the GradeReportViewModel view model.
        /// </summary>
        /// <param name="gradeReportDTO">The grade report dto.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <returns>
        /// GradeReportViewModel
        /// </returns>
        internal static GradeReportViewModel ToViewModel(this GradeReport gradeReportDTO, IInstitutionSettingService institutionSettingService)
        {
            InstitutionSettings.General generalSettings = institutionSettingService.GetGeneral();
            GradeReportViewModel gradeReport = new();
            TranscriptSequenceViewModel sequence = null;
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(generalSettings.NumberCulture);
            bool gradeReportMidSessionGrades = institutionSettingService.GetStudentRecords().DisplayMidSessionGrades;
            if (gradeReportDTO != null)
            {
                gradeReport.InstitutionName = gradeReportDTO.Institution.Name;
                gradeReport.Line1 = gradeReportDTO.Institution.Address.Line1;
                gradeReport.Line2 = gradeReportDTO.Institution.Address.Line2;
                gradeReport.Line3 = gradeReportDTO.Institution.Address.Line3;
                gradeReport.Line4 = gradeReportDTO.Institution.Address.Line4;
                gradeReport.HouseNumber = gradeReportDTO.Institution.Address.HouseNumber;
                gradeReport.City = gradeReportDTO.Institution.Address.City;
                gradeReport.StateProvince = gradeReportDTO.Institution.Address.StateProvince;
                gradeReport.PostalCode = gradeReportDTO.Institution.Address.PostalCode;
                gradeReport.Country = gradeReportDTO.Institution.Address.Country;
                gradeReport.TranscriptSequences = new List<TranscriptSequenceViewModel>();
                gradeReport.ShowMidTermGrades = gradeReportMidSessionGrades;
                gradeReport.ShowProjectedGrades = institutionSettingService.GetCourseManagement().EnableProjectedGrade;
                gradeReport.ShowInstitutionName = institutionSettingService.GetStudentRecords().DisplayInstitutionName;
                gradeReport.ShowInstitutionAddress = institutionSettingService.GetStudentRecords().DisplayInstitutionAddress;
                gradeReport.Sequences = new List<ListOptionViewModel>();
                string formatGpa = generalSettings.GPA;
                string formatCredits = generalSettings.Credits;
                foreach (TranscriptSequence transcriptSequence in gradeReportDTO.TranscriptSequenceList)
                {
                    gradeReport.Sequences.Add(new ListOptionViewModel { Value = transcriptSequence.SequenceNumber, Description = transcriptSequence.SequenceNumber });
                    sequence = new TranscriptSequenceViewModel
                    {
                        SequenceNumber = transcriptSequence.SequenceNumber,
                        CreditsAttempted = FormatHelper.ToCredits(transcriptSequence.Credits.Attempted, formatCredits),
                        CreditsEarned = FormatHelper.ToCredits(transcriptSequence.Credits.Earned, formatCredits),
                        GpaTerm = transcriptSequence.Gpa.Term != null ? FormatHelper.ToGpa(transcriptSequence.Gpa.Term, formatGpa) :
                            FormatHelper.ToGpa(0, formatGpa),
                        GpaOverall = transcriptSequence.Gpa.Overall != null ? FormatHelper.ToGpa(transcriptSequence.Gpa.Overall, formatGpa) : FormatHelper.ToGpa(0, formatGpa),
                        AwardsTerm = transcriptSequence.Awards.Term,
                        AwardsOverall = transcriptSequence.Awards.Overall
                    };

                    if (transcriptSequence.CoursesList?.Count() > 0)
                    {
                        List<IGrouping<string, Course>> sessionGroups = transcriptSequence.CoursesList.GroupBy(x => x.SessionDesc).ToList();
                        if (sessionGroups != null)
                        {
                            sequence.Sessions = new List<TranscriptSequenceSessionViewModel>();
                            List<CourseViewModel> coursesBySession = null;
                            foreach (IGrouping<string, Course> session in sessionGroups)
                            {
                                coursesBySession = new List<CourseViewModel>();
                                foreach (Course courseDTO in session)
                                {
                                    coursesBySession.Add(new CourseViewModel
                                    {
                                        Credits = FormatHelper.ToCredits(courseDTO.Credit, formatCredits),
                                        CreditTypeDesc = courseDTO.CreditTypeDesc,
                                        EventId = courseDTO.EventId,
                                        EventTypeDesc = courseDTO.EventTypeDesc,
                                        FinalGrade = courseDTO.FinalGrade,
                                        MidtermGrade = gradeReportMidSessionGrades ? courseDTO.MidGrade : string.Empty,
                                        Name = courseDTO.EventName,
                                        ProjectedGrade = courseDTO.ProjectedGrade,
                                        ProjectedGradePercentage = FormatHelper.ToDecimal(courseDTO.ProjectedGradePercentage, formatProvider),
                                        QualityPoints = FormatHelper.ToQualityPoints(courseDTO.QualityPoints, generalSettings.QualityPoints),
                                        Section = courseDTO.Section,
                                        SectionId = courseDTO.SectionId,
                                        Session = courseDTO.SessionDesc,
                                        SubType = courseDTO.SubTypeDesc,
                                        MidGradeComments = courseDTO.MidGradeComments,
                                        FinalGradeComments = courseDTO.FinalGradeComments,
                                        CourseComments = courseDTO.CourseComments
                                    });
                                }
                                sequence.Sessions.Add(new TranscriptSequenceSessionViewModel
                                {
                                    SessionDesc = session.Key,
                                    Courses = coursesBySession
                                });
                            }
                        }
                    }
                    gradeReport.TranscriptSequences.Add(sequence);
                }
            }
            return gradeReport;
        }

        /// <summary>
        /// To the ActivityGradeReportViewModel view model.
        /// </summary>
        /// <param name="activityGradeReportDTO">The activity grade report dto.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="general">The general.</param>
        /// <returns>
        /// ActivityGradeReportViewModel.
        /// </returns>
        internal static ActivityGradeReportViewModel ToViewModel(this ActivityGradeReport activityGradeReportDTO,
            ISettingService settingService, InstitutionSettings.General general)
        {
            ActivityGradeReportViewModel report = null;

            if (activityGradeReportDTO != null)
            {
                report = new ActivityGradeReportViewModel
                {
                    SectionName = activityGradeReportDTO.SectionName,
                    Faculties = GetFaculties(activityGradeReportDTO.Faculties),
                    FinaltermAssignments = GetAssignmentTypes(activityGradeReportDTO.Students, false, general)
                };
                if (activityGradeReportDTO.Students.Count > 0)
                {
                    report.FinalScore = GetScore(activityGradeReportDTO.Students[0], false, general);
                    report.MidtermScore = GetScore(activityGradeReportDTO.Students[0], true, general);
                }

                if (settingService.IsMidtermGradesEnabled())
                {
                    report.MidtermAssignments = GetAssignmentTypes(activityGradeReportDTO.Students, true, general);
                    if (report.MidtermAssignments is null || report.MidtermAssignments.Count == 0)
                        report.MidtermAssignments = null;
                }
                else
                {
                    report.MidtermAssignments = null;
                }
            }
            return report;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="alertReportDTO">The alert report dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<AlertsReportViewModel> ToViewModel(this List<AlertReport> alertReportDTO, string nameFormat, string nameSort, bool showMiddleNameInitial,
            InstitutionSettings.General general)
        {
            List<AlertsReportViewModel> alertReports = new();
            List<AlertReportViewModel> alerts = null;
            AlertsReportViewModel alertReport = null;
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            if (alertReportDTO.Count > 0)
            {
                List<IGrouping<string, AlertReport>> sessionGroups = alertReportDTO.GroupBy(x => x.SessionDesc).ToList();
                if (sessionGroups != null)
                {
                    foreach (IGrouping<string, AlertReport> session in sessionGroups)
                    {
                        alertReport = new();
                        alertReport.AcademicSession = session.Key;
                        alerts = new List<AlertReportViewModel>();
                        foreach (AlertReport row in session)
                        {
                            alerts.Add(new AlertReportViewModel
                            {
                                AcademicSession = row.AcademicSession,
                                Avatar = row.EditedBy.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                                CreditTypeDesc = row.CreditTypeDesc,
                                DateEdited = FormatHelper.ToShortDate(row.DateEdited, datetimeCulture),
                                Description = row.Description,
                                EventId = row.EventId,
                                EventName = row.EventName,
                                EventSubType = row.EventSubType,
                                EventSubTypeDesc = row.EventSubTypeDesc,
                                EventTypeDesc = row.EventTypeDesc,
                                Section = row.Section,
                                SectionId = row.SectionId,
                                SessionDesc = row.SessionDesc,
                                ViolationCategoryDesc = row.ViolationCategoryDesc,
                                ViolationDate = FormatHelper.ToShortDate(row.ViolationDate, datetimeCulture),
                                ViolationDesc = row.ViolationDesc
                            });
                        }
                        alertReport.List = alerts;
                        alertReports.Add(alertReport);
                    }
                }
            }
            return alertReports;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="unofficialTranscriptDTO">The unofficial transcript dto.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns>
        /// UnofficialTranscriptViewModel.
        /// </returns>
        internal static UnofficialTranscriptViewModel ToViewModel(this UnofficialTranscript unofficialTranscriptDTO,
            IInstitutionSettingService institutionSettingService, string nameFormat, bool showMiddleNameInitial)
        {
            InstitutionSettings.General generalSettings = institutionSettingService.GetGeneral();
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(generalSettings.NumberCulture);
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(generalSettings.DateTimeCulture);
            UnofficialTranscriptViewModel unofficialTranscriptViewModel = new();
            HeaderInformationViewModel headerViewModel = null;
            TranscriptYearTermViewModel yearTermViewModel = null;
            TranscriptCoursesViewModel courseViewModel = null;
            TranscriptGPAViewModel gpaViewModel = null;
            if (unofficialTranscriptDTO != null)
            {
                InstitutionSettings.StudentRecords settings = institutionSettingService.GetStudentRecords();
                string formatGpa = generalSettings.GPA;
                string formatCredits = generalSettings.Credits;
                string formatGovernmentId = generalSettings.GovernmentIdFormat.Replace("X", "#");
                unofficialTranscriptViewModel = new UnofficialTranscriptViewModel
                {
                    ShowAlternateGrade = settings.ShowAlternateGrade,
                    ShowLegend = settings.ShowLegend,
                    Legend = WebUtility.HtmlDecode(settings.Legend),
                    ShowClassInformation = settings.ShowClassInformation,
                    ShowFiceCode = settings.ShowFiceCode,
                    ShowGovernmentId = settings.ShowGovernmentId,
                    ShowDateOfBirth = settings.ShowDateOfBirth,
                    ShowTotalsAtEnd = settings.ShowTotalsAtEnd
                };

                unofficialTranscriptViewModel.HeaderInformation = new List<HeaderInformationViewModel>();
                foreach (HeaderInformation headerDTO in unofficialTranscriptDTO.HeaderInformation)
                {
                    headerViewModel = new HeaderInformationViewModel()
                    {
                        OrgName = settings.ShowFiceCode ? $"{headerDTO.OrgName} - {headerDTO.FiceCode} " : headerDTO.OrgName,
                        HouseNumber = headerDTO.HouseNumber,
                        AddressLine1 = headerDTO.AddressLine1,
                        AddressLine2 = headerDTO.AddressLine2,
                        AddressLine3 = headerDTO.AddressLine3,
                        AddressLine4 = headerDTO.AddressLine4,
                        AddressLine5 = string.IsNullOrWhiteSpace(headerDTO.City) ?
                        $"{headerDTO.State} {headerDTO.ZipCode}" :
                            $"{headerDTO.City}, {headerDTO.State} {headerDTO.ZipCode}",
                        FullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(
                            new People
                            {
                                Prefix = headerDTO.Prefix,
                                FirstName = headerDTO.FirstName,
                                MiddleName = headerDTO.MiddleName,
                                LastNamePrefix = headerDTO.LastNamePrefix,
                                LastName = headerDTO.LastName,
                                Suffix = headerDTO.Suffix
                            })), nameFormat, showMiddleNameInitial),
                        GovernmentId = settings.ShowGovernmentId ? FormatHelper.ToGovernmentId(headerDTO.GovernmentId, formatGovernmentId) : string.Empty,
                        BirthDate = settings.ShowDateOfBirth && headerDTO.DateOfBirth != "" ? FormatHelper.ToLongDate(DateTime.Parse(headerDTO.DateOfBirth), datetimeCulture) : string.Empty,
                        CumGpa = FormatHelper.ToGpa(headerDTO.CumGpa, formatGpa)
                    };
                    headerViewModel.TranscriptDegree = new List<TranscriptDegreeViewModel>();
                    foreach (TranscriptDegree degreeDTO in headerDTO.TranscriptDegree)
                    {
                        headerViewModel.TranscriptDegree.Add(new TranscriptDegreeViewModel
                        {
                            PDCDesc = $"{degreeDTO.ProgramDesc}/{degreeDTO.DegreeDesc}/{degreeDTO.FormalTitle}",
                            DegreeDesc = degreeDTO.DegreeDesc,
                            DateGranted = string.IsNullOrEmpty(degreeDTO.GraduationDate) ? string.Empty : FormatHelper.ToShortDate(DateTime.Parse(degreeDTO.GraduationDate), datetimeCulture)
                        });
                    }

                    headerViewModel.PreviousInstitutions = new List<string>();
                    foreach (TranscriptInstitution transcriptInstitutionDTO in headerDTO.PreviousInstitutions)
                        headerViewModel.PreviousInstitutions.Add($"{transcriptInstitutionDTO.SchoolName}, {transcriptInstitutionDTO.DegreeDesc}");
                    StringBuilder honors = new();
                    foreach (TranscriptHonors honorDTO in headerDTO.TranscriptHonors)
                        honors.Append(honorDTO.HonorsDesc).Append(",");
                    headerViewModel.Honors = honors.ToString();
                    if (headerDTO.TranscriptHonors.Count > 0)
                        headerViewModel.Honors = headerViewModel.Honors.Remove(headerViewModel.Honors.Length - 1, 1);

                    TranscriptOrganizationViewModel organization = null;
                    headerViewModel.TranscriptYearTerm = new List<TranscriptYearTermViewModel>();
                    foreach (TranscriptYearTerm yearTermDTO in headerDTO.TranscriptYearTerm)
                    {
                        yearTermViewModel = new TranscriptYearTermViewModel
                        {
                            Period = settings.ShowDatesForTerms ? $"{yearTermDTO.AcademicYear} {yearTermDTO.TermDesc} " +
                            $"({FormatHelper.ToShortDate(yearTermDTO.StartDate, datetimeCulture)} - {FormatHelper.ToShortDate(yearTermDTO.EndDate, datetimeCulture)})" :
                                $"{yearTermDTO.AcademicYear} {yearTermDTO.TermDesc}"
                        };
                        yearTermViewModel.TranscriptOrganization = new List<TranscriptOrganizationViewModel>();
                        foreach (TranscriptOrganization transcriptOrganizationDTO in yearTermDTO.TranscriptOrganization)
                        {
                            organization = new TranscriptOrganizationViewModel
                            {
                                OrganizationName = transcriptOrganizationDTO.OrgName
                            };
                            organization.TranscriptCourses = new List<TranscriptCoursesViewModel>();
                            foreach (TranscriptCourses courseDTO in transcriptOrganizationDTO.TranscriptCourses)
                            {
                                courseViewModel = new TranscriptCoursesViewModel
                                {
                                    EventId = courseDTO.EventId,
                                    EventName = courseDTO.EventName,
                                    EventSubType = courseDTO.SubTypeDesc,
                                    FinalGrade = courseDTO.RepeatedFlag && !string.IsNullOrEmpty(courseDTO.FinalGradeDisplay) ?
                                        $"[{courseDTO.FinalGradeDisplay}]"
                                        : !courseDTO.RepeatedFlag ?
                                            $"{courseDTO.FinalGradeDisplay}" : string.Empty,
                                    AlternateGrade = settings.ShowAlternateGrade ? courseDTO.AlternateGrade : string.Empty,
                                    Credits = FormatHelper.ToCredits(courseDTO.CreditGrade, formatCredits),
                                    QualityPoints = FormatHelper.ToQualityPoints(courseDTO.FinalQualityPoints, generalSettings.QualityPoints),
                                    Comments = courseDTO.CourseComments,
                                    FinalGradeComments = courseDTO.FinalGradeComments
                                };
                                organization.TranscriptCourses.Add(courseViewModel);
                            }
                            if (!settings.ShowCoursesInProgress)
                                organization.TranscriptCourses.RemoveAll(x => x.FinalGrade.Length == 0);
                            yearTermViewModel.TranscriptOrganization.Add(organization);
                        }

                        yearTermViewModel.TranscriptGpa = new List<TranscriptGPAViewModel>();
                        foreach (TranscriptGpa gpaDTO in yearTermDTO.TranscriptGPA)
                        {
                            gpaViewModel = new TranscriptGPAViewModel()
                            {
                                GpaType = gpaDTO.GpaType,
                                AttemptedCredits = FormatHelper.ToCredits(gpaDTO.AttemptedCredits, formatCredits),
                                EarnedCredits = FormatHelper.ToCredits(gpaDTO.EarnedCredits, formatCredits),
                                TotalCredits = FormatHelper.ToCredits(gpaDTO.TotalCredits, formatCredits),
                                TransferCredits = FormatHelper.ToCredits(gpaDTO.TransferCredits, formatCredits),
                                QualityPoints = FormatHelper.ToQualityPoints(gpaDTO.QualityPoints, generalSettings.QualityPoints),
                                Gpa = FormatHelper.ToGpa(gpaDTO.Gpa, formatGpa),
                                ClassRank = FormatHelper.ToNumber(gpaDTO.ClassRank, formatProvider),
                                ClassSize = FormatHelper.ToNumber(gpaDTO.ClassSize, formatProvider),
                                GpaCredits = FormatHelper.ToCredits(gpaDTO.GpaCredits, formatCredits),
                            };
                            yearTermViewModel.TranscriptGpa.Add(gpaViewModel);
                        }

                        yearTermViewModel.YearTermNotes = new List<string>();
                        foreach (TranscriptYearTermNote yearTermNoteDTO in yearTermDTO.YearTermNotes)
                            yearTermViewModel.YearTermNotes.Add(yearTermNoteDTO.Notes);

                        yearTermViewModel.YearTermAwards = new List<string>();
                        foreach (TranscriptYearTermAward yearTermAwardDTO in yearTermDTO.YearTermAwards)
                            yearTermViewModel.YearTermAwards.Add(yearTermAwardDTO.AwardDesc);
                        headerViewModel.TranscriptYearTerm.Add(yearTermViewModel);
                    }
                    if (unofficialTranscriptViewModel.ShowTotalsAtEnd)
                    {
                        headerViewModel.TotalCredits = new TotalCreditsViewModel
                        {
                            CreditsTaken = FormatHelper.ToCredits(headerDTO.TotalCredits?.Credits, formatCredits),
                            CreditsOverall = FormatHelper.ToCredits(headerDTO.TotalCredits?.OverallCredits, formatCredits),
                            CreditsTransfer = FormatHelper.ToCredits(headerDTO.TotalCredits?.TransferCredits, formatCredits)
                        };
                    }
                    unofficialTranscriptViewModel.TestScores = new List<TranscriptTestScoreViewModel>();
                    foreach (TranscriptTestScore testScoreDTO in unofficialTranscriptDTO.TestScores)
                    {
                        unofficialTranscriptViewModel.TestScores.Add(new TranscriptTestScoreViewModel
                        {
                            Description = testScoreDTO.TestDesc,
                            TypeDescription = testScoreDTO.TestTypeDesc,
                            Date = FormatHelper.ToShortDate(testScoreDTO.TestDate, datetimeCulture),
                            Score = FormatHelper.ToDecimal(testScoreDTO.RawScore, formatProvider)
                        });
                    }
                    headerViewModel.TranscriptNotes = headerDTO.TranscriptNotes;

                    unofficialTranscriptViewModel.HeaderInformation.Add(headerViewModel);
                }
            }
            return unofficialTranscriptViewModel;
        }

        #region Private Methods

        /// <summary>
        /// Gets the assignments.
        /// </summary>
        /// <param name="assignmentsDTO">The assignments dto.</param>
        /// <param name="isMidTerm">if set to <c>true</c> [is mid term].</param>
        /// <param name="general">The general.</param>
        /// <returns>
        /// List of AssignmentViewModel
        /// </returns>
        private static List<StudentAssignmentViewModel> GetAssignments(List<Assignment> assignmentsDTO, bool isMidTerm, InstitutionSettings.General general)
        {
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
            List<StudentAssignmentViewModel> assignmentsViewModel = null;
            StudentAssignmentViewModel assignmentViewModel = null;
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            if (assignmentsDTO?.Count > 0)
            {
                assignmentsViewModel = new List<StudentAssignmentViewModel>();
                foreach (Assignment assignment in assignmentsDTO)
                {
                    assignmentViewModel = new StudentAssignmentViewModel
                    {
                        CountsForMidterm = assignment.CountsForMidterm,
                        CountsForFinal = assignment.CountsForFinal,
                        Title = assignment.AssignmentTitle,
                        DueDate = FormatHelper.ToShortDate(assignment.DueDate, datetimeCulture),
                        GradeEntryDate = FormatHelper.ToShortDate(assignment.GradeEntryDate, datetimeCulture),
                        EarnedPoints = FormatHelper.ToDecimal(assignment.EarnedPoints, formatProvider),
                        PossiblePoints = assignment.PossiblePoints,
                        IsEarned = assignment.IsEarned
                    };
                    if (isMidTerm && (assignment.MidtermScoreDetail != null))
                    {
                        assignmentViewModel.EarnedPercentage = $"{FormatHelper.ToDecimal(assignment.MidtermScoreDetail.EarnedPercentage, formatProvider)} %";
                        assignmentViewModel.IsDroppedHighest = assignment.MidtermScoreDetail.IsDroppedHighest;
                        assignmentViewModel.IsDroppedLowest = assignment.MidtermScoreDetail.IsDroppedLowest;
                        assignmentViewModel.PossiblePercentage = $"{FormatHelper.ToDecimal(assignment.MidtermScoreDetail.PossiblePercentage, formatProvider)} %";

                        if (!string.IsNullOrEmpty(assignment.MidtermScoreDetail.ActivityScore))
                            assignmentViewModel.ActivityScore = $"{FormatHelper.ToDecimal(decimal.Parse(assignment.MidtermScoreDetail.ActivityScore), formatProvider)} %";
                    }
                    else if (!isMidTerm && (assignment.FinalScoreDetail != null))
                    {
                        assignmentViewModel.EarnedPercentage = $"{FormatHelper.ToDecimal(assignment.FinalScoreDetail.EarnedPercentage, formatProvider)} %";
                        assignmentViewModel.IsDroppedHighest = assignment.FinalScoreDetail.IsDroppedHighest;
                        assignmentViewModel.IsDroppedLowest = assignment.FinalScoreDetail.IsDroppedLowest;
                        assignmentViewModel.PossiblePercentage = $"{FormatHelper.ToDecimal(assignment.FinalScoreDetail.PossiblePercentage, formatProvider)} %";

                        if (!string.IsNullOrEmpty(assignment.FinalScoreDetail?.ActivityScore))
                            assignmentViewModel.ActivityScore = $"{ FormatHelper.ToDecimal(decimal.Parse(assignment.FinalScoreDetail.ActivityScore), formatProvider)} %";
                    }
                    assignmentsViewModel.Add(assignmentViewModel);
                }
            }
            if (isMidTerm)
                return assignmentsViewModel.Where(x => x.CountsForMidterm).ToList();
            return assignmentsViewModel.Where(x => x.CountsForFinal).ToList();
        }

        /// <summary>
        /// Gets the assignment types.
        /// </summary>
        /// <param name="studentsDTO">The students dto.</param>
        /// <param name="isMidTerm">if set to <c>true</c> [is mid term].</param>
        /// <param name="general">The general.</param>
        /// <returns>
        /// List of StudentAssignmentTypeViewModel
        /// </returns>
        private static List<StudentAssignmentTypeViewModel> GetAssignmentTypes(List<Student> studentsDTO, bool isMidTerm, InstitutionSettings.General general)
        {
            StudentAssignmentTypeViewModel assignmentTypeViewModel;
            List<StudentAssignmentTypeViewModel> assignmentTypeVieModelList = null;
            if (studentsDTO.Count > 0 && studentsDTO[0].AssignmentTypeRules?.Count > 0)
            {
                assignmentTypeVieModelList = new();
                foreach (AssignmentTypeRule assignmentType in studentsDTO[0].AssignmentTypeRules)
                {
                    assignmentTypeViewModel = new()
                    {
                        Description = assignmentType.AssignmentTypeDesc,
                        StudentAssignments = GetAssignments(assignmentType.Assignments, isMidTerm, general)
                    };
                    if (assignmentTypeViewModel.StudentAssignments.Count > 0)
                        assignmentTypeVieModelList.Add(assignmentTypeViewModel);
                }
            }
            return assignmentTypeVieModelList;
        }

        /// <summary>
        /// Gets the faculties.
        /// </summary>
        /// <param name="facultiesDTO">The faculties.</param>
        /// <returns></returns>
        private static string GetFaculties(List<Faculty> facultiesDTO)
        {
            StringBuilder facultylist = new();
            if (facultiesDTO?.Count > 0)
            {
                foreach (Faculty faculty in facultiesDTO)
                    facultylist.Append(faculty.FacultyFullName).Append(" / ");
                facultylist.Remove(facultylist.Length - 2, 2);
            }
            return facultylist.ToString();
        }

        /// <summary>
        /// Gets the score.
        /// </summary>
        /// <param name="student">The student.</param>
        /// <param name="isMidTerm">if set to <c>true</c> [is mid term].</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        private static string GetScore(Student student, bool isMidTerm, InstitutionSettings.General general)
        {
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
            string score = string.Empty;
            if (student.AssignmentTypeRules?.Count > 0 && student.AssignmentTypeRules[0].Assignments?.Count > 0)
            {
                if (isMidTerm)
                    score = FormatHelper.ToDecimal(student.AssignmentTypeRules[0].Assignments[0].MidtermScore, formatProvider);
                else
                    score = FormatHelper.ToDecimal(student.AssignmentTypeRules[0].Assignments[0].FinalScore, formatProvider);
            }
            return score;
        }

        #endregion Private Methods
    }
}