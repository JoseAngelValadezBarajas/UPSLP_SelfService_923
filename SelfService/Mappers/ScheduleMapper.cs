// --------------------------------------------------------------------
// <copyright file="ScheduleMapper.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Models.Schedule;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace SelfService.Mappers
{
    /// <summary>
    /// Class ScheduleMapper.
    /// </summary>
    internal static class ScheduleMapper
    {
        /// <summary>
        /// To the ScheduleRequest Dto List.
        /// </summary>
        /// <param name="approvalRequestModelList">The approval request model list.</param>
        /// <returns></returns>
        internal static List<ScheduleRequest> ToDto(this List<ApprovalRequestModel> approvalRequestModelList)
        {
            List<ScheduleRequest> scheduleRequests = new();
            foreach (ApprovalRequestModel item in approvalRequestModelList)
            {
                scheduleRequests.Add(new()
                {
                    ScheduleRequestId = item.ScheduleRequestId,
                    Decision = (ScheduleRequestDecision)item.Decision,
                    Reason = item.Reason
                });
            }
            return scheduleRequests;
        }

        /// <summary>
        /// Gets the view model for the student schedule.
        /// </summary>
        /// <param name="classDetailsListDTO">The class details list dto.</param>
        /// <param name="institutionSetttingService">The institution settting service.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<List<StudentScheduleViewModel>> ToStudentViewModel(this List<List<ClassDetail>> classDetailsListDTO,
            IInstitutionSettingService institutionSetttingService, string nameFormat, string nameSort, bool showMiddleNameInitial)
        {
            List<List<StudentScheduleViewModel>> studentScheduleList = null;
            if (classDetailsListDTO?.Count > 0)
            {
                InstitutionSettings.General generalSettings = institutionSetttingService.GetGeneral();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(generalSettings.DateTimeCulture);
                InstitutionSettings.ConEdRegistration conEdRegistrationSettings = institutionSetttingService.GetConEdRegistration();
                InstitutionSettings.Registration registrationSettings = institutionSetttingService.GetRegistration();

                studentScheduleList = classDetailsListDTO.Select(cd => cd.Select(x => x.ToViewModel(datetimeCulture,
                    generalSettings, registrationSettings, conEdRegistrationSettings, nameFormat, nameSort, showMiddleNameInitial))
                    .ToList()).ToList();
            }

            return studentScheduleList;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="classDetailsList">The class details list.</param>
        /// <param name="settings">The settings.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns></returns>
        internal static List<List<StudentScheduleViewModel>> ToViewModel(this List<List<ClassDetail>> classDetailsList,
            IInstitutionSettingService settings, string nameFormat, string nameSort, bool showMiddleNameInitial, string dateTimeCultureFormat)
        {
            List<List<StudentScheduleViewModel>> studentSchedulesListViewModel = new();
            List<StudentScheduleViewModel> studentSchedulesViewModel;
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);
            InstitutionSettings.General generalSettings = settings.GetGeneral();
            InstitutionSettings.ConEdRegistration conEdRegistrationSettings = settings.GetConEdRegistration();
            InstitutionSettings.Registration registrationSettings = settings.GetRegistration();
            foreach (List<ClassDetail> classDetails in classDetailsList)
            {
                studentSchedulesViewModel = new List<StudentScheduleViewModel>();
                foreach (ClassDetail classDetail in classDetails)
                    studentSchedulesViewModel.Add(classDetail.ToViewModel(datetimeCulture,
                        generalSettings, registrationSettings, conEdRegistrationSettings,
                        nameFormat, nameSort, showMiddleNameInitial));
                studentSchedulesListViewModel.Add(studentSchedulesViewModel);
            }

            return studentSchedulesListViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="academicsDTO">The academics dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<AcademicInformationViewModel> ToViewModel(this List<Academic> academicsDTO, string nameFormat, bool showMiddleNameInitial)
        {
            List<AcademicInformationViewModel> academics = null;
            if (academicsDTO?.Count > 0)
            {
                academics = new List<AcademicInformationViewModel>();
                List<Academic> academicPrograms = academicsDTO.GroupBy(x => new { x.ProgramDesc, x.DegreeDesc, x.CurriculumDesc })
                   .Select(ap => new Academic
                   {
                       Program = ap.Key.ProgramDesc,
                       Degree = ap.Key.DegreeDesc,
                       Curriculum = ap.Key.CurriculumDesc
                   }).ToList();
                foreach (Academic academic in academicPrograms)
                {
                    StringBuilder advisorNames = new();
                    List<Academic> academicAdvisors = academicsDTO.Where(
                        x => x.ProgramDesc == academic.Program
                        && x.DegreeDesc == academic.Degree
                        && x.CurriculumDesc == academic.Curriculum).ToList();

                    if (academicAdvisors.Count > 0)
                    {
                        foreach (Academic academicItem in academicAdvisors.Distinct().ToList())
                        {
                            advisorNames.Append(FormatHelper.ToNameFormat(
                                FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(new People
                                {
                                    Prefix = academicItem.Advisor.Prefix,
                                    FirstName = academicItem.Advisor.FirstName,
                                    MiddleName = academicItem.Advisor.MiddleName,
                                    LastNamePrefix = academicItem.Advisor.LastNamePrefix,
                                    LastName = academicItem.Advisor.LastName,
                                    DisplayName = academicItem.Advisor.DisplayName,
                                    Pronoun = academicItem.Advisor.Pronoun,
                                    Suffix = academicItem.Advisor.Suffix
                                })), nameFormat, showMiddleNameInitial)).Append(", ");
                        }
                        if (advisorNames.Length > 0)
                            advisorNames.Remove(advisorNames.Length - 2, 2);
                    }

                    academics.Add(new AcademicInformationViewModel
                    {
                        ProgramDegree = $"{academic.Program}, {academic.Degree}",
                        Curriculum = academic.Curriculum,
                        Advisors = advisorNames.ToString()
                    });
                }
            }
            return academics;
        }

        /// <summary>
        /// To the approval request view model.
        /// </summary>
        /// <param name="scheduleRequests">The schedule requests.</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns></returns>
        internal static ApprovalRequestViewModel ToViewModel(this List<ScheduleRequest> scheduleRequests, string dateTimeCultureFormat)
        {
            ApprovalRequestViewModel approvalRequestViewModel = null;
            if (scheduleRequests?.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);
                approvalRequestViewModel = new ApprovalRequestViewModel();
                List<ScheduleRequest> awaitingRegistrationList = scheduleRequests.FindAll(x => x.Decision == (ScheduleRequestDecision)1 && x.RequestType == (ScheduleRequestType)1).ToList();
                if (awaitingRegistrationList?.Count > 0)
                {
                    approvalRequestViewModel.AwaitingRegistrationList = new List<SectionCourseViewModel>();
                    foreach (ScheduleRequest item in awaitingRegistrationList)
                        approvalRequestViewModel.AwaitingRegistrationList.Add(ToSectionCourseViewModel(item, datetimeCulture));
                }

                List<ScheduleRequest> awaitingDropList = scheduleRequests.FindAll(x => x.Decision == (ScheduleRequestDecision)1 && x.RequestType == (ScheduleRequestType)2).ToList();
                if (awaitingDropList?.Count > 0)
                {
                    approvalRequestViewModel.AwaitingDropList = new List<SectionCourseViewModel>();
                    foreach (ScheduleRequest item in awaitingDropList)
                        approvalRequestViewModel.AwaitingDropList.Add(ToSectionCourseViewModel(item, datetimeCulture));
                }

                List<ScheduleRequest> registrationRequests = scheduleRequests.FindAll(x => x.Decision != (ScheduleRequestDecision)1 && x.RequestType == (ScheduleRequestType)1).ToList();
                if (registrationRequests?.Count > 0)
                {
                    approvalRequestViewModel.RegistrationRequests = new List<SectionCourseViewModel>();
                    foreach (ScheduleRequest item in registrationRequests)
                        approvalRequestViewModel.RegistrationRequests.Add(ToSectionCourseViewModel(item, datetimeCulture));
                }

                List<ScheduleRequest> dropRequests = scheduleRequests.FindAll(x => x.Decision != (ScheduleRequestDecision)1 && x.RequestType == (ScheduleRequestType)2).ToList();
                if (dropRequests?.Count > 0)
                {
                    approvalRequestViewModel.DropRequests = new List<SectionCourseViewModel>();
                    foreach (ScheduleRequest item in dropRequests)
                        approvalRequestViewModel.DropRequests.Add(ToSectionCourseViewModel(item, datetimeCulture));
                }
            }
            return approvalRequestViewModel;
        }

        /// <summary>
        /// Gets the view model for the faculty schedule.
        /// </summary>
        /// <param name="classDetails">The class details.</param>
        /// <param name="settings">The settings.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns></returns>
        internal static List<FacultyScheduleViewModel> ToViewModel(this List<ClassDetail> classDetails,
            IInstitutionSettingService settings, string nameFormat, string nameSort, bool showMiddleNameInitial, string dateTimeCultureFormat)
        {
            List<FacultyScheduleViewModel> facultyScheduleList = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);
            foreach (ClassDetail classDetail in classDetails)
                facultyScheduleList.Add(classDetail.ToViewModel(datetimeCulture, settings.GetGeneral(), nameFormat, nameSort, showMiddleNameInitial));
            return facultyScheduleList;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="facultySessionClassesDTO">The faculty session classes dto.</param>
        /// <param name="settings">The settings.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns></returns>
        internal static List<FacultyScheduleBySessionViewModel> ToViewModel(this List<FacultySessionClasses> facultySessionClassesDTO,
            IInstitutionSettingService settings, string nameFormat, string nameSort, bool showMiddleNameInitial, string dateTimeCultureFormat)
        {
            List<FacultyScheduleBySessionViewModel> facultyScheduleBySessionList = new();
            if (facultySessionClassesDTO != null)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);
                FacultyScheduleBySessionViewModel facultyScheduleBySession;
                foreach (FacultySessionClasses facultySessionClasses in facultySessionClassesDTO)
                {
                    facultyScheduleBySession = new FacultyScheduleBySessionViewModel
                    {
                        Sections = new List<FacultyScheduleViewModel>(),
                        Session = facultySessionClasses.AcademicSession,
                        SessionDesc = facultySessionClasses.AcademicSessionDesc
                    };
                    foreach (ClassDetail classDetail in facultySessionClasses.ClassDetailList)
                        facultyScheduleBySession.Sections.Add(classDetail.ToViewModel(datetimeCulture, settings.GetGeneral(), nameFormat, nameSort, showMiddleNameInitial));
                    facultyScheduleBySessionList.Add(facultyScheduleBySession);
                }
            }
            return facultyScheduleBySessionList;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="PermissionRequestInfoList">The permission request information list.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<PermissionRequestInfoViewModel> ToViewModel(this List<PermissionRequestInfo> PermissionRequestInfoList,
            string nameFormat, string nameSort, CultureInfo datetimeCulture, bool showMiddleNameInitial)
        {
            PermissionRequestInfoViewModel permissionRequestInfoViewModel = null;
            List<PermissionRequestInfoViewModel> permissionRequestInfoViewModelList = new();
            foreach (PermissionRequestInfo row in PermissionRequestInfoList)
            {
                permissionRequestInfoViewModel = new PermissionRequestInfoViewModel
                {
                    FacultyInfo = row.FacultyInfo.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                    OverrideInfo = row.OverrideInfo.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                    OverrideId = row.OverrideId,
                    OverrideComments = row.OverrideComments,
                    OverrideDate = row.OverrideDate == Convert.ToDateTime("1900-01-01 00:00:00.000") ? string.Empty : FormatHelper.ToShortDate(row.OverrideDate, datetimeCulture),
                    PermissionComments = row.PermissionComments,
                    PermissionDate = row.PermissionDate == Convert.ToDateTime("1900-01-01 00:00:00.000") ? string.Empty : FormatHelper.ToShortDate(row.PermissionDate, datetimeCulture),
                    Id = row.Id,
                    RequestDate = FormatHelper.ToShortDate(row.RequestDate, datetimeCulture),
                    StatusPermisionRequest = row.Status,
                    StudentComments = row.StudentComments
                };
                permissionRequestInfoViewModelList.Add(permissionRequestInfoViewModel);
            }
            return permissionRequestInfoViewModelList;
        }

        #region Private Methods

        /// <summary>
        /// Converts schedule request to the section course view model.
        /// </summary>
        /// <param name="scheduleRequest">The schedule request.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <returns></returns>
        private static SectionCourseViewModel ToSectionCourseViewModel(ScheduleRequest scheduleRequest, CultureInfo datetimeCulture) => new()
        {
            BlockName = scheduleRequest.BlockName,
            Decision = (int)scheduleRequest.Decision,
            DecisionDate = FormatHelper.ToShortDate(scheduleRequest.DecisionDate, datetimeCulture),
            DecisionTime = FormatHelper.ToShortTime(scheduleRequest.DecisionTime, datetimeCulture),
            EventCreditTypeDesc = scheduleRequest.SectionCourse?.EventCreditTypeDesc,
            EventId = scheduleRequest.SectionCourse?.EventId,
            EventName = scheduleRequest.SectionCourse?.EventName,
            EventSection = scheduleRequest.SectionCourse?.Section,
            EventSubTypeDesc = scheduleRequest.SectionCourse?.EventSubTypeDesc,
            EventTypeDesc = scheduleRequest.SectionCourse?.EventTypeDesc,
            GroupName = scheduleRequest.GroupName,
            Reason = scheduleRequest.Reason ?? string.Empty,
            RequestDate = FormatHelper.ToShortDate(scheduleRequest.RequestDate, datetimeCulture),
            RequestTime = FormatHelper.ToShortTime(scheduleRequest.RequestTime, datetimeCulture),
            ScheduleRequestId = scheduleRequest.ScheduleRequestId,
            SectionId = scheduleRequest.SectionCourse.SectionId
        };

        /// <summary>
        /// Converts to student schedule viewmodel.
        /// </summary>
        /// <param name="classDetail">The class detail.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <param name="generalSettings">The general settings.</param>
        /// <param name="registrationSettings">The registration settings.</param>
        /// <param name="conEdRegistrationSettings">The con ed registration settings.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        private static StudentScheduleViewModel ToViewModel(this ClassDetail classDetail,
             CultureInfo datetimeCulture, InstitutionSettings.General generalSettings,
            InstitutionSettings.Registration registrationSettings, InstitutionSettings.ConEdRegistration conEdRegistrationSettings,
            string nameFormat, string nameSort, bool showMiddleNameInitial)
        {
            StudentScheduleViewModel studentScheduleViewModel = new()
            {
                AdvisorApprovalInfo = classDetail.AdvisorApprovalInfo?.ToViewModel(nameFormat, nameSort, datetimeCulture, showMiddleNameInitial),
                AreFeesApplicable = classDetail.HasFees,
                AuthorizationNeeded = classDetail.AuthorizationNeeded,
                Ceu = FormatHelper.ToCredits(classDetail.CEU, generalSettings.Credits),
                Credits = FormatHelper.ToCredits(classDetail.Credits, generalSettings.Credits),
                CreditType = classDetail.CreditType,
                CreditTypeDescription = classDetail.CreditTypeDesc,
                DefaultCreditType = classDetail.DefaultCreditType,
                DefaultCreditTypeDesc = classDetail.DefaultCreditTypeDesc,
                EndDate = FormatHelper.ToShortDate(classDetail.EndDate, datetimeCulture),
                EventId = classDetail.EventId,
                EventName = classDetail.Description,
                EventSubType = classDetail.EventSubTypeDesc,
                EventType = classDetail.EventTypeDesc,
                Id = classDetail.SectionId,
                InstructorsCount = classDetail.InstructorsCount,
                IsConEd = classDetail.IsConEd,
                IsApproved = classDetail.IsApproved,
                IsDenied = classDetail.IsDenied,
                IsHolding = classDetail.IsHolding,
                IsInCart = classDetail.IsInCart,
                IsInWaitlist = classDetail.IsInWaitlist,
                IsPending = classDetail.IsPending,
                IsRegistered = classDetail.IsRegistered,
                IsWaitListPending = classDetail.IsWaitListPending,
                PendingExpiresDate = classDetail.PendingExpires != null ?
                        FormatHelper.ToLongDate((DateTime)classDetail.PendingExpires, datetimeCulture)
                        : string.Empty,
                PendingExpiresTime = classDetail.PendingExpires != null ?
                        FormatHelper.ToShortTime((DateTime)classDetail.PendingExpires, datetimeCulture)
                        : string.Empty,
                PermissionRequestInfo = classDetail.PermissionRequestInfo?.ToViewModel(nameFormat, nameSort, datetimeCulture, showMiddleNameInitial),
                IsPermissionRequired = classDetail.IsPermissionRequired,
                SchedulesCount = classDetail.SchedulesCount,
                Section = classDetail.SectionEvent,
                SessionDesc = classDetail.AcademicSessionDesc,
                Session = classDetail.AcademicSession,
                ShowDrop = classDetail.IsConEd ?
                        string.IsNullOrEmpty(classDetail.FinalGrade)
                        && classDetail.IsRegistered
                        && conEdRegistrationSettings.AllowDrops
                        : string.IsNullOrEmpty(classDetail.FinalGrade)
                        && classDetail.IsRegistered
                        && classDetail.IsDroppable
                        && registrationSettings.AllowDrops,
                StartDate = FormatHelper.ToShortDate(classDetail.StartDate, datetimeCulture),
                CreditTypes = classDetail.CreditTypes?.Count() > 0 ? classDetail.CreditTypes.ToViewModel() : null,
                Instructors = classDetail.Instructors.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                Schedules = classDetail.Schedules.ToViewModel(datetimeCulture)
            };
            return studentScheduleViewModel;
        }

        /// <summary>
        /// Converts to faculty schedule viewmodel.
        /// </summary>
        /// <param name="classDetail">The class detail.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <param name="generalSettings">The general settings.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        private static FacultyScheduleViewModel ToViewModel(this ClassDetail classDetail,
            CultureInfo datetimeCulture, InstitutionSettings.General generalSettings,
            string nameFormat, string nameSort, bool showMiddleNameInitial)
        {
            FacultyScheduleViewModel facultyScheduleViewModel = new()
            {
                AreFeesApplicable = classDetail.HasFees,
                Ceu = FormatHelper.ToCredits(classDetail.CEU, generalSettings.Credits),
                Credits = FormatHelper.ToCredits(classDetail.Credits, generalSettings.Credits),
                CreditType = classDetail.CreditType,
                CreditTypeDescription = classDetail.CreditTypeDesc,
                DefaultCreditType = classDetail.DefaultCreditType,
                DefaultCreditTypeDesc = classDetail.DefaultCreditTypeDesc,
                EndDate = FormatHelper.ToShortDate(classDetail.EndDate, datetimeCulture),
                EventId = classDetail.EventId,
                EventName = classDetail.Description,
                EventSubType = classDetail.EventSubTypeDesc,
                EventType = classDetail.EventTypeDesc,
                Id = classDetail.SectionId,
                InstructorsCount = classDetail.InstructorsCount,
                IsConEd = classDetail.IsConEd,
                SchedulesCount = classDetail.SchedulesCount,
                Section = classDetail.SectionEvent,
                SessionDesc = classDetail.AcademicSessionDesc,
                Session = classDetail.AcademicSession,
                StartDate = FormatHelper.ToShortDate(classDetail.StartDate, datetimeCulture),
                Term = classDetail.AcademicTerm,
                Year = classDetail.AcademicYear.ToString(),
                Instructors = classDetail.Instructors.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                Schedules = classDetail.Schedules.ToViewModel(datetimeCulture)
            };
            return facultyScheduleViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="AdvisorApprovalInfo">The advisor approval information.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        private static AdvisorApprovalInfoViewModel ToViewModel(this AdvisorApprovalInfo AdvisorApprovalInfo, string nameFormat,
            string nameSort, CultureInfo datetimeCulture, bool showMiddleNameInitial) => new()
            {
                FacultyInfo = AdvisorApprovalInfo.FacultyInfo.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                Reason = AdvisorApprovalInfo.Reason,
                DecisionDate = FormatHelper.ToShortDate(AdvisorApprovalInfo.DecisionDate, datetimeCulture)
            };

        #endregion Private Methods
    }
}