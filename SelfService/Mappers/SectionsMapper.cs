// --------------------------------------------------------------------
// <copyright file="SectionsMapper.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Models.Resources;
using SelfService.Models.Section;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// A mapper to format the data from DTOs to ViewModels(namespace SelfService.Models.Section)
    /// </summary>
    internal static class SectionsMapper
    {
        /// <summary>
        /// Map from Sections to List(SectionViewModel).
        /// </summary>
        /// <param name="sectionsDTO">The sections dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="enableWaitList">if set to <c>true</c> [enable wait list].</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="registration">The registration.</param>
        /// <returns></returns>
        internal static List<SectionViewModel> ToViewModel(this Sections sectionsDTO, string nameFormat, string nameSort,
            bool enableWaitList, InstitutionSettings.General general, bool showMiddleNameInitial, InstitutionSettings.Registration registration)
        {
            List<SectionViewModel> sectionList = null;
            if (sectionsDTO?.SectionsList?.Count > 0)
            {
                sectionList = new List<SectionViewModel>();
                SectionViewModel section;
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                foreach (Section sectionDTO in sectionsDTO.SectionsList)
                {
                    bool detail = sectionDTO.RegistrationType == RegistrationType.ContinuingEducation;
                    section = sectionDTO.ToViewModel(detail, nameFormat, nameSort, enableWaitList, general, datetimeCulture, formatProvider, showMiddleNameInitial, registration);
                    sectionList.Add(section);
                }
            }
            return sectionList;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="comments">The comments.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<GradeCommentsDetailViewModel> ToViewModel(this List<GradeCommentsDetail> comments, string nameFormat, string nameSort, bool showMiddleNameInitial, InstitutionSettings.General general, bool showMidterm)
        {
            List<GradeCommentsDetailViewModel> gradeCommentsDetailViewModels = new();
            if (comments?.Count > 0)
            {
                gradeCommentsDetailViewModels = new List<GradeCommentsDetailViewModel>();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                foreach (GradeCommentsDetail gradeCommentsDetail in comments)
                {
                    if (gradeCommentsDetail.GradeType == GradeType.FinalGrade || (gradeCommentsDetail.GradeType == GradeType.MidtermGrade && showMidterm))
                    {
                        gradeCommentsDetailViewModels.Add(new GradeCommentsDetailViewModel()
                        {
                            InstructorComments = gradeCommentsDetail.FacultyComments,
                            TranscriptComments = gradeCommentsDetail.TranscriptComments,
                            EnteredDate = FormatHelper.ToShortDate(gradeCommentsDetail.EnteredDatetime, datetimeCulture),
                            EnteredFullName = gradeCommentsDetail.Created != null ? gradeCommentsDetail.Created.ToViewModel(nameFormat, nameSort, showMiddleNameInitial).FullName : string.Empty,
                            EnteredTime = FormatHelper.ToShortTime(gradeCommentsDetail.EnteredDatetime, datetimeCulture),
                            Grade = gradeCommentsDetail.Grade,
                            GradeType = gradeCommentsDetail.GradeType,
                            IsPending = gradeCommentsDetail.IsPending,
                            IsPosted = gradeCommentsDetail.IsPosted,
                            ModifiedDate = FormatHelper.ToShortDate(gradeCommentsDetail.ModifiedDatetime, datetimeCulture),
                            ModifiedFullName = gradeCommentsDetail.Modified != null ? gradeCommentsDetail.Modified.ToViewModel(nameFormat, nameSort, showMiddleNameInitial).FullName : string.Empty,
                            ModifiedTime = FormatHelper.ToShortTime(gradeCommentsDetail.ModifiedDatetime, datetimeCulture),
                            StudentGradeId = gradeCommentsDetail.StudentGradeId,
                            SubmissionDate = FormatHelper.ToShortDate(gradeCommentsDetail.SubmissionDatetime, datetimeCulture),
                            SubmissionFullName = gradeCommentsDetail.Submitted != null ? gradeCommentsDetail.Submitted.ToViewModel(nameFormat, nameSort, showMiddleNameInitial).FullName : string.Empty,
                            SubmissionTime = FormatHelper.ToShortTime(gradeCommentsDetail.SubmissionDatetime, datetimeCulture),
                        });
                    }
                }
            }
            return gradeCommentsDetailViewModels;
        }

        /// <summary>
        /// Map from Section and SectionDetail to SectionDetailViewModel.
        /// </summary>
        /// <param name="sectionDetailDTO">The section detail dto.</param>
        /// <param name="resourcesDegReqs">The resources for formats.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="enableWaitList">if set to <c>true</c> [enable wait list].</param>
        /// <param name="general">The general.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <param name="formatProvider">The format provider.</param>
        /// <param name="formatCurrency">The format currency.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="registration">The registration.</param>
        /// <param name="courseMaterials">The course materials link text to display.</param>
        /// <param name="courseMaterialsUrl">The course materials url.</param>
        /// <returns></returns>
        internal static SectionDetailViewModel ToViewModel(this SectionDetail sectionDetailDTO,
            DegReqsResources resourcesDegReqs, string nameFormat, string nameSort, bool enableWaitList, InstitutionSettings.General general,
            CultureInfo datetimeCulture, IFormatProvider formatProvider, IFormatProvider formatCurrency, bool showMiddleNameInitial, InstitutionSettings.Registration registration,
            string? courseMaterials, string? courseMaterialsUrl)
        {
            SectionDetailViewModel sectionDetail = null;
            if (sectionDetailDTO != null)
            {
                SectionViewModel section = sectionDetailDTO.ToViewModel(true, nameFormat, nameSort, enableWaitList, general, datetimeCulture, formatProvider,
                    showMiddleNameInitial, registration);

                sectionDetail = new SectionDetailViewModel(section)
                {
                    AcademicTermDesc = sectionDetailDTO.AcademicTermDesc,
                    AcademicYear = sectionDetailDTO.AcademicYear,
                    CourseMaterials = courseMaterials,
                    Description = sectionDetailDTO.Description,
                    IsConEd = sectionDetailDTO.IsConEd
                };

                if (courseMaterials != null && courseMaterialsUrl != null)
                {
                    sectionDetail.CourseMaterials = courseMaterials;
                    sectionDetail.CourseMaterialsUrl = courseMaterialsUrl;
                }
                sectionDetail.Prerequisites = sectionDetailDTO.Prerequisites.ToViewModel(resourcesDegReqs, out string prereqCondition, nameFormat,
                    general, showMiddleNameInitial, out List<string> prereqConditionList);
                sectionDetail.PrerequisiteConditionList = prereqConditionList;
                sectionDetail.Corequisistes = sectionDetailDTO.Corequisistes.ToViewModel(string.Empty, string.Empty, out string corequisiteCondition);
                sectionDetail.CreditTypes = sectionDetailDTO.CreditTypes.ToViewModel(string.Empty, out string creditTypeCondition);

                sectionDetail.SectionFees = sectionDetailDTO.Fees.ToViewModel(formatCurrency);
            }
            return sectionDetail;
        }

        /// <summary>
        /// Map from Section to SectionViewModel.
        /// </summary>
        /// <param name="section">The section.</param>
        /// <param name="detail">if set to <c>true</c> [detail].</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="enableWaitList">if set to <c>true</c> [enable wait list].</param>
        /// <param name="general">The general.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <param name="formatProvider">The format provider.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="registration">The registration.</param>
        /// <returns></returns>
        internal static SectionViewModel ToViewModel(this Section section, bool detail, string nameFormat, string nameSort,
            bool enableWaitList, InstitutionSettings.General general, CultureInfo datetimeCulture, IFormatProvider formatProvider,
            bool showMiddleNameInitial, InstitutionSettings.Registration registration)

        {
            SectionViewModel sectionViewModel = null;
            if (section != null)
            {
                sectionViewModel = new SectionViewModel
                {
                    AreFeesApplicable = section.HasFees,
                    EventId = section.EventId,
                    EventName = section.EventLongName,
                    Id = section.SectionId,
                    IsCartable = section.IsCartable,
                    IsOpen = section.SecEnrollStatus != null && (section.SecEnrollStatus.Equals("OPEN") || section.SecEnrollStatus.Equals("MIN") || section.SecEnrollStatus.Equals("TARGET")),
                    IsWaitable = enableWaitList && section.IsWaitable
                };
                bool holdForAdvisorApproval = false;
                if (section.RegistrationType == RegistrationType.Traditional)
                {
                    sectionViewModel.BlockRegGroupSectionId = section.BlockRegGroupSectionId;
                    sectionViewModel.Credits = FormatHelper.ToCredits(section.Credits, general.Credits);
                    sectionViewModel.DefaultCreditType = section.DefaultCreditType;
                    sectionViewModel.DefaultCreditTypeDesc = section.DefaultCreditTypeDesc;
                    sectionViewModel.EndDate = FormatHelper.ToShortDate(section.EndDate, datetimeCulture);
                    sectionViewModel.EventSubType = section.EventSubTypeDesc;
                    sectionViewModel.EventType = section.EventTypeDesc;
                    sectionViewModel.HasTimeConflict = section.HasTimeConflict;
                    sectionViewModel.MaximumSeats = section.MaximumParticipants;
                    sectionViewModel.Section = section.SectionEvent;
                    sectionViewModel.Session = section.AcademicSession;
                    sectionViewModel.SessionDesc = section.AcademicSessionDesc;
                    sectionViewModel.StartDate = FormatHelper.ToShortDate(section.StartDate, datetimeCulture);
                    sectionViewModel.Term = section.AcademicTerm;
                    sectionViewModel.TermDesc = section.AcademicTermDesc;
                    sectionViewModel.TermSort = string.IsNullOrEmpty(section.AcademicTermSort) ? 0 : Convert.ToInt16(section.AcademicTermSort);
                    sectionViewModel.Year = section.AcademicYear;
                    holdForAdvisorApproval = registration.HoldForAdvisorApproval;
                }
                else
                {
                    sectionViewModel.Ceu = FormatHelper.ToCredits(section.CEU, general.Credits);
                    sectionViewModel.Description = section.Description;
                    sectionViewModel.StartLongDate = FormatHelper.ToLongDate(section.StartDate, datetimeCulture);
                    sectionViewModel.Section = section.SectionEvent;
                    sectionViewModel.EventSubType = section.EventSubType;
                    if (detail)
                    {
                        sectionViewModel.Credits = FormatHelper.ToCredits(section.Credits, general.Credits);
                        sectionViewModel.DefaultCreditType = section.DefaultCreditType;
                        sectionViewModel.DefaultCreditTypeDesc = section.DefaultCreditTypeDesc;
                        sectionViewModel.EndDate = FormatHelper.ToShortDate(section.EndDate, datetimeCulture);
                        sectionViewModel.EventType = section.EventTypeDesc;
                        sectionViewModel.MaximumSeats = section.MaximumParticipants;
                        sectionViewModel.SessionDesc = section.AcademicSessionDesc;
                        sectionViewModel.StartDate = FormatHelper.ToShortDate(section.StartDate, datetimeCulture);
                    }
                }
                int seatsLeft = section.MaximumParticipants - section.AddCount - (holdForAdvisorApproval ? section.WaitlistCount : 0);
                if (seatsLeft < 0)
                    seatsLeft = 0;
                sectionViewModel.SeatsLeft = seatsLeft;
                if (section.WaitlistCount > 0)
                    sectionViewModel.SeatsWaiting = FormatHelper.ToNumber(section.WaitlistCount, formatProvider);

                sectionViewModel.Instructors = section.Instructors.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                sectionViewModel.Schedules = section.Schedules.ToViewModel(datetimeCulture);
            }
            return sectionViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sections">The sections.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<SectionDepartmentHeadViewModel> ToViewModel(this List<SectionPeriodDetail> sections, string nameFormat, string nameSort, bool showMiddleNameInitial,
            InstitutionSettings.General general)
        {
            List<SectionDepartmentHeadViewModel> sectionsDepartmentViewModel = null;
            if (sections?.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                sectionsDepartmentViewModel = sections.GroupBy(section => section.DepartmentDesc, section => new SectionApprovalViewModel
                {
                    DefaultCreditTypeDesc = section.CreditTypeDesc,
                    EndDate = FormatHelper.ToShortDate(section.EndDate, datetimeCulture),
                    EventId = section.EventId,
                    EventName = section.EventName,
                    EventSubType = section.EventSubTypeDesc,
                    EventType = section.EventTypeDesc,
                    Id = section.Id,
                    RequireApproval = section.RequireApproval,
                    Section = section.Section,
                    Session = section.SessionDesc,
                    SessionDesc = section.SessionDesc,
                    StartDate = FormatHelper.ToShortDate(section.StartDate, datetimeCulture),
                    Instructors = section.Instructors.ToViewModel(nameFormat, nameSort, showMiddleNameInitial)
                }, (key, g) => new SectionDepartmentHeadViewModel { DepartmentDesc = key, SectionsApproval = g.ToList() }).ToList();
            }
            return sectionsDepartmentViewModel;
        }

        /// <summary>
        /// Map from List(SectionFee) to List(SectionFeeViewModel).
        /// </summary>
        /// <param name="sectionFeeListDTO">The list of fees for the course dto.</param>
        /// <param name="formatCurrency">The format currency.</param>
        /// <returns></returns>
        internal static List<SectionFeeViewModel> ToViewModel(this List<SectionFee> sectionFeeListDTO, IFormatProvider formatCurrency)
        {
            List<SectionFeeViewModel> sectionFeeList = null;
            if (sectionFeeListDTO.Count > 0)
            {
                sectionFeeList = new List<SectionFeeViewModel>();
                SectionFeeViewModel sectionFee = null;
                foreach (SectionFee sectionFeeDTO in sectionFeeListDTO)
                {
                    sectionFee = new SectionFeeViewModel()
                    {
                        Amount = FormatHelper.ToCurrency(sectionFeeDTO.Amount, formatCurrency),
                        ChargeDescription = sectionFeeDTO.ChargeDescription,
                        FeeType = sectionFeeDTO.FeeType,
                        FeeGroupId = sectionFeeDTO.FeeGroupId,
                        FeeGroupDescription = sectionFeeDTO.FeeGroupDescription
                    };

                    sectionFeeList.Add(sectionFee);
                }
            }
            return sectionFeeList;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="scheduleValidates">The schedule validates.</param>
        /// <returns></returns>
        internal static List<ScheduleTimeViewModel> ToViewModel(this List<ScheduleValidate> scheduleValidates)
        {
            List<ScheduleTimeViewModel> sectionSchedules = new();
            ScheduleTimeViewModel sectionSchedule;
            if (scheduleValidates.Count > 0)
            {
                foreach (ScheduleValidate scheduleValidate in scheduleValidates)
                {
                    sectionSchedule = new()
                    {
                        ScheduledEndTime = new()
                        {
                            scheduleValidate.EndTime.Hour,
                            scheduleValidate.EndTime.Minute,
                            scheduleValidate.EndTime.Second
                        },
                        SectionId = scheduleValidate.SectionId,
                        ScheduledStartTime = new()
                        {
                            scheduleValidate.StartTime.Hour,
                            scheduleValidate.StartTime.Minute,
                            scheduleValidate.StartTime.Second
                        }
                    };

                    sectionSchedules.Add(sectionSchedule);
                }
            }
            return sectionSchedules;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="sectionSearchOptionDTO">The section search option dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="isBlockRegistration">if set to <c>true</c> [is block registration].</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static SectionSearchOptionsViewModel ToViewModel(this SectionSearchOption sectionSearchOptionDTO,
            string nameFormat, string nameSort, bool isBlockRegistration, bool showMiddleNameInitial, InstitutionSettings.General general)
        {
            SectionSearchOptionsViewModel sectionSearchOption = null;
            if (sectionSearchOptionDTO != null)
            {
                sectionSearchOption = new SectionSearchOptionsViewModel();

                if (!isBlockRegistration)
                {
                    #region Periods

                    if (sectionSearchOptionDTO.Periods?.Count > 0)
                        sectionSearchOption.Periods = sectionSearchOptionDTO.Periods.ToViewModel(false, false);

                    #endregion Periods

                    #region Status

                    sectionSearchOption.Status = new List<ListOptionViewModel>
                    {
                        new ListOptionViewModel
                        {
                            Value = "Open"
                        },
                        new ListOptionViewModel
                        {
                            Value = "Closed"
                        },
                        new ListOptionViewModel
                        {
                            Value = "Waitlist"
                        }
                    };

                    #endregion Status

                    #region CreditTypes

                    if (sectionSearchOptionDTO.CreditTypes?.Count > 0)
                        sectionSearchOption.CreditTypes = sectionSearchOptionDTO.CreditTypes.ToViewModel(false);

                    #endregion CreditTypes

                    #region Programs

                    if (sectionSearchOptionDTO.Programs?.Count > 0)
                        sectionSearchOption.Programs = sectionSearchOptionDTO.Programs.ToViewModel();

                    #endregion Programs

                    #region Departments

                    if (sectionSearchOptionDTO.Departments?.Count > 0)
                        sectionSearchOption.Departments = sectionSearchOptionDTO.Departments.ToViewModel();

                    #endregion Departments

                    #region Colleges

                    if (sectionSearchOptionDTO.Colleges?.Count > 0)
                        sectionSearchOption.Colleges = sectionSearchOptionDTO.Colleges.ToViewModel();

                    #endregion Colleges

                    #region Curriculums

                    if (sectionSearchOptionDTO.Curriculums?.Count > 0)
                        sectionSearchOption.Curriculums = sectionSearchOptionDTO.Curriculums.ToViewModel();

                    #endregion Curriculums

                    #region ClassLevels

                    if (sectionSearchOptionDTO.ClassLevels?.Count > 0)
                        sectionSearchOption.ClassLevels = sectionSearchOptionDTO.ClassLevels.ToViewModel();

                    #endregion ClassLevels

                    #region Populations

                    if (sectionSearchOptionDTO.Populations?.Count > 0)
                        sectionSearchOption.Populations = sectionSearchOptionDTO.Populations.ToViewModel();

                    #endregion Populations

                    #region NontraditionalPrograms

                    if (sectionSearchOptionDTO.NontraditionalPrograms?.Count > 0)
                        sectionSearchOption.NontraditionalPrograms = sectionSearchOptionDTO.NontraditionalPrograms.ToViewModel();

                    #endregion NontraditionalPrograms

                    #region GeneralEducationList

                    if (sectionSearchOptionDTO.GeneralEducationList?.Count > 0)
                        sectionSearchOption.GeneralEducationList = sectionSearchOptionDTO.GeneralEducationList.ToViewModel();

                    #endregion GeneralEducationList

                    #region Types

                    sectionSearchOption.Types = new List<ListOptionViewModel>
                    {
                        new ListOptionViewModel
                        {
                            Value = "TRAD"
                        },
                        new ListOptionViewModel
                        {
                            Value = "CONED"
                        },
                        new ListOptionViewModel
                        {
                            Value = "BOTH"
                        }
                    };

                    #endregion Types
                }

                #region Sessions

                if (sectionSearchOptionDTO.Sessions?.Count > 0)
                    sectionSearchOption.Sessions = sectionSearchOptionDTO.Sessions.ToViewModel(false);

                #endregion Sessions

                #region Meetings

                if (sectionSearchOptionDTO.Meetings?.Count > 0)
                    sectionSearchOption.Meetings = sectionSearchOptionDTO.Meetings.ToViewModel();

                #endregion Meetings

                #region Hours

                sectionSearchOption.Hours = GetHours(general);

                #endregion Hours

                #region Campus

                if (sectionSearchOptionDTO.Campuses?.Count > 0)
                    sectionSearchOption.Campus = sectionSearchOptionDTO.Campuses.ToViewModel();

                #endregion Campus

                #region EventTypesList

                if (sectionSearchOptionDTO.EventTypes?.Count > 0)
                    sectionSearchOption.EventTypes = sectionSearchOptionDTO.EventTypes.ToViewModel();

                #endregion EventTypesList

                #region SubTypes

                if (sectionSearchOptionDTO.SubTypes?.Count > 0)
                    sectionSearchOption.SubTypes = sectionSearchOptionDTO.SubTypes.ToViewModel();

                #endregion SubTypes

                #region Instructors

                sectionSearchOption.Instructors = sectionSearchOptionDTO.Instructors.ToOptionsViewModel(nameFormat, nameSort, showMiddleNameInitial);

                #endregion Instructors
            }
            return sectionSearchOption;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="gradeMappings">The grade mappings.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="sectionService">The section service.</param>
        /// <param name="settingService">The setting service.</param>
        /// <returns></returns>
        internal static SectionMappingViewModel ToViewModel(this List<CreditTypeGradeMapping> gradeMappings, int sectionId, ISectionService sectionService, ISettingService settingService)
        {
            GradeMappingViewModel gradeMappingViewModel = null;
            SectionGradeMappingViewModel sectionGradeMappingViewModel = null;
            SectionMappingViewModel sectionMappingViewModel = new()
            {
                GradeMappingList = new()
            };
            if (sectionId > 0)
            {
                SectionPoint sectionPoint = sectionService.GetTotalPoints(sectionId);
                sectionMappingViewModel.FinalPoint = sectionPoint?.FinalTotal != null ? sectionPoint.FinalTotal : null;
                sectionMappingViewModel.MidTermPoint = sectionPoint?.MidtermTotal != null ? sectionPoint.MidtermTotal : null;
            }
            bool showMidTerm = settingService.IsMidtermGradesEnabled();
            if (gradeMappings != null)
            {
                sectionMappingViewModel.ShowMidTerm = showMidTerm;
                foreach (CreditTypeGradeMapping creditType in gradeMappings)
                {
                    List<SectionGradeMappingViewModel> sectionGradeMappingViewModelList = new();
                    gradeMappingViewModel = new GradeMappingViewModel
                    {
                        CreditType = creditType.Description,
                        CreditTypeId = creditType.Id
                    };
                    foreach (SectionGradeMapping section in creditType.SectionList)
                    {
                        sectionGradeMappingViewModel = new SectionGradeMappingViewModel
                        {
                            CreditTypeId = section.CreditTypeId,
                            GradeValue = section.GradeValue,
                            GradeValueId = section.GradeValueId,
                            MappingId = section.MappingId,
                            MinimumFinalPercentage = section.MinimumFinalPercentage,
                            MinimumMidtermPercentage = section.MinimumMidtermPercentage,
                            MinimumMidtermPercentageCurrent = section.MinimumMidtermPercentage,
                            Rank = section.Rank
                        };
                        sectionGradeMappingViewModelList.Add(sectionGradeMappingViewModel);
                    }
                    gradeMappingViewModel.SectionList = sectionGradeMappingViewModelList;
                    sectionMappingViewModel.GradeMappingList.Add(gradeMappingViewModel);
                }
            }
            return sectionMappingViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sectionViolation">The section violation.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="personId">The person identifier.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<SectionViolationViewModel> ToViewModel(this SectionViolation sectionViolation,
            string nameFormat, string nameSort, int personId, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            SectionViolationViewModel sectionViolationViewModel = null;
            List<SectionViolationViewModel> sectionViolationViewModelList = new();
            sectionViolation.StudentList =
                FormatHelper.GetSortedList(sectionViolation.StudentList.Cast<object>(), nameSort).Cast<StudentViolation>().ToList();
            People studentName;
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            foreach (StudentViolation studentViolation in sectionViolation.StudentList)
            {
                studentName = new People
                {
                    Prefix = studentViolation.Prefix,
                    DisplayName = studentViolation.DisplayName,
                    FirstName = studentViolation.FirstName,
                    MiddleName = studentViolation.MiddleName,
                    LastName = studentViolation.LastName,
                    LastNamePrefix = studentViolation.LastNamePrefix,
                    Suffix = studentViolation.Suffix,
                    Pronoun = studentViolation.Pronoun
                };
                AvatarViewModel peopleAvatar = studentName.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                sectionViolationViewModel = new()
                {
                    Email = studentViolation.Email,
                    PersonId = studentViolation.StudentId,
                    FullName = peopleAvatar.FullName,
                    ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                    FirstLetter = peopleAvatar.FirstLetter,
                    DisplayName = studentViolation.DisplayName,
                    PeopleId = FormatHelper.ToPeopleId(studentViolation.PeopleId, general.PeopleIdFormat),
                    Withdrawn = studentViolation.Withdrawn
                };
                sectionViolationViewModel.ViolationCategoryList = new();
                sectionViolationViewModel.ViolationList = new();
                foreach (ViolationCategories violationCategories in studentViolation.ViolationCategoryList)
                {
                    ViolationCategoriesViewModel violationCategoriesViewModel = new()
                    {
                        ViolationCategoryId = violationCategories.ViolationCategoryId,
                        ViolationCategory = violationCategories.ViolationCategory
                    };
                    foreach (Violation violation in violationCategories.ViolationList)
                    {
                        ViolationViewModel violationViewModel = new()
                        {
                            IsEditable = violation.ReportedById == personId,
                            ViolationId = violation.ViolationId,
                            ViolationTypeId = violation.ViolationTypeId,
                            ViolationType = violation.ViolationType,
                            ViolationDate = FormatHelper.ToDatePicker(violation.ViolationDate),
                            ViolationDateTable = FormatHelper.ToShortDate(violation.ViolationDate, datetimeCulture),
                            ReportedByFullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(
                                new()
                                {
                                    Prefix = violation.ReportedByPrefix,
                                    DisplayName = violation.ReportedByDisplayName,
                                    FirstName = violation.ReportedByFirstName,
                                    MiddleName = violation.ReportedByMiddleName,
                                    LastName = violation.ReportedByLastName,
                                    LastNamePrefix = string.Empty,
                                    Suffix = violation.ReportedBySuffix,
                                    Pronoun = violation.ReportedByPronoun
                                })), nameFormat, showMiddleNameInitial),
                            CreatedDate = FormatHelper.ToDatePicker(violation.CreatedDate),
                            Description = violation.Description,
                            ViolationCategoryId = violationCategories.ViolationCategoryId
                        };
                        sectionViolationViewModel.ViolationList.Add(violationViewModel);
                    }
                    sectionViolationViewModel.ViolationCategoryList.Add(violationCategoriesViewModel);
                }
                sectionViolationViewModelList.Add(sectionViolationViewModel);
            }
            return sectionViolationViewModelList;
        }

        /// <summary>
        /// To the List SectionStatisticViewModel view model.
        /// </summary>
        /// <param name="sectionStatistic">The section statistic.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<SectionStatisticViewModel> ToViewModel(this SectionStatistic sectionStatistic, InstitutionSettings.General general)
        {
            List<SectionStatisticViewModel> sectionStatistics = null;
            if (sectionStatistic.Midterm != null && sectionStatistic.Final != null)
            {
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                sectionStatistics = new()
                {
                    new()
                    {
                        IsMidterm = true,
                        PercentIncluded = FormatHelper.ToDecimal((sectionStatistic.Midterm.SampleSize / sectionStatistic.StudentCount) * 100, formatProvider),
                        AverageScore = FormatHelper.ToDecimal(sectionStatistic.Midterm.Average, formatProvider),
                        HighScore = FormatHelper.ToDecimal(sectionStatistic.Midterm.Maximum, formatProvider),
                        LowScore = FormatHelper.ToDecimal(sectionStatistic.Midterm.Minimum, formatProvider),
                        StandardDeviation = FormatHelper.ToDecimal(sectionStatistic.Midterm.StandardDeviation, formatProvider),
                        Variance = FormatHelper.ToDecimal(sectionStatistic.Midterm.Variance, formatProvider)
                    },
                    new()
                    {
                        IsMidterm = false,
                        PercentIncluded = FormatHelper.ToDecimal((sectionStatistic.Final.SampleSize / sectionStatistic.StudentCount) * 100, formatProvider),
                        AverageScore = FormatHelper.ToDecimal(sectionStatistic.Final.Average, formatProvider),
                        HighScore = FormatHelper.ToDecimal(sectionStatistic.Final.Maximum, formatProvider),
                        LowScore = FormatHelper.ToDecimal(sectionStatistic.Final.Minimum, formatProvider),
                        StandardDeviation = FormatHelper.ToDecimal(sectionStatistic.Final.StandardDeviation, formatProvider),
                        Variance = FormatHelper.ToDecimal(sectionStatistic.Final.Variance, formatProvider)
                    }
                };
            }
            return sectionStatistics;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sectionStudentGrade">The section student grade.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="currentPersonId">The person identifier.</param>
        /// <param name="showProjectedGrade">if set to <c>true</c> [show projected grade].</param>
        /// <param name="isApprovalRequired">if set to <c>true</c> [is approval required].</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="sectionService">The section service.</param>
        /// <param name="departmentHeadService">The department head service.</param>
        /// <param name="facultyAssistantService">The faculty assistant service.</param>
        /// <returns>
        /// SectionOverallGradeListViewModel
        /// </returns>
        internal static SectionOverallGradeListViewModel ToViewModel(this SectionStudentGrade sectionStudentGrade, int sectionId,
            int currentPersonId, bool showProjectedGrade, bool isApprovalRequired, string nameFormat, string nameSort,
             InstitutionSettings.General general, bool showMiddleNameInitial, ISettingService settingService, ISectionService sectionService,
             IDepartmentHeadService departmentHeadService, IFacultyAssistantService facultyAssistantService)
        {
            SectionOverallGradeListViewModel model = new();
            bool showMidterm = settingService.IsMidtermGradesEnabled();
            bool isMidtermOpen = sectionService.IsOpenForGrading(sectionId, true);
            bool isFinaltermOpen = sectionService.IsOpenForGrading(sectionId, false);
            bool isAuthorized = true; //TODO: This is the claim
            bool isFacultyMember = sectionService.IsFacultyMember(currentPersonId, sectionId);
            bool isDeptHeadMember = departmentHeadService.IsDepartmentHead(currentPersonId, sectionId);
            bool isFacultyAssistantMember = false;
            if (!isFacultyMember && !isDeptHeadMember)
            {
                FacultyAssistant facultyAssistant = facultyAssistantService.Get(currentPersonId, sectionId);
                if (facultyAssistant != null)
                    isFacultyAssistantMember = true;
            }

            List<StudentOverallGradeViewModel> studentList = new();
            StudentOverallGradeViewModel student;
            if (sectionStudentGrade?.Students.Count > 0)
            {
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                List<StudentName> studentSortedList = new();
                foreach (StudentGrade item in sectionStudentGrade.Students)
                    studentSortedList.Add(item.Name);

                studentSortedList = FormatHelper.GetSortedList(studentSortedList.Cast<object>(), nameSort).Cast<StudentName>().ToList();
                StudentGrade studentGrade;
                foreach (StudentName studentName in studentSortedList)
                {
                    studentGrade = sectionStudentGrade.Students.Find(x => x.Name == studentName);
                    if (studentGrade != null)
                    {
                        AvatarViewModel peopleAvatar = studentName.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                        student = new StudentOverallGradeViewModel
                        {
                            StudentId = studentGrade.StudentId,
                            FullName = peopleAvatar.FullName,
                            ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                            FirstLetter = peopleAvatar.FirstLetter,
                            PeopleId = FormatHelper.ToPeopleId(studentName.StudentPeopleId, general.PeopleIdFormat),
                            Email = studentName.Email,
                            HasEmail = !string.IsNullOrEmpty(studentName.Email),
                            CreditType = studentGrade.CreditType,
                            CreditTypeValues = GetCreditTypeDropdown(studentGrade.CreditTypeId, sectionStudentGrade.GradeValues),
                            Midterm = showMidterm ? GetTermInfo(isMidtermOpen, studentGrade.Midterm, isFacultyMember, isDeptHeadMember,
                                isApprovalRequired, isAuthorized, isFacultyAssistantMember, formatProvider) : null,
                            Finalterm = GetTermInfo(isFinaltermOpen, studentGrade.Final, isFacultyMember, isDeptHeadMember,
                                isApprovalRequired, isAuthorized, isFacultyAssistantMember, formatProvider),
                            ProjectedGrade = showProjectedGrade && !string.IsNullOrEmpty(studentGrade.ProjectedGradeValue) ?
                                FormatHelper.ToDecimal(studentGrade.ProjectedGradePercentage, formatProvider) + "   (" + studentGrade.ProjectedGradeValue + ")" : string.Empty,
                            Withdrawn = studentGrade.Withdrawn
                        };
                        if (student.Finalterm.IsPosted)
                            student.ProjectedGrade = "-";
                        studentList.Add(student);
                    }
                }
                model.OverallGradeList = studentList;
                model.ShowMidtermGrade = showMidterm;
                model.ShowMidtermCalculatedScore = true;
                model.ShowProjectedGrade = showProjectedGrade;
                model.ShowFinaltermCalculatedScore = true;
                model.IsMidtermOpen = isMidtermOpen;
                model.IsFinaltermOpen = isFinaltermOpen;
            }
            return model;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sectionAttendanceDTO">The section attendance dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="mail">The mail.</param>
        /// <param name="courseManagement">The course management.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static SectionAttendanceViewModel ToViewModel(this SectionAttendance sectionAttendanceDTO, string nameFormat,
            string nameSort, InstitutionSettings.General general, InstitutionSettings.Mail mail, InstitutionSettings.CourseManagement courseManagement, bool showMiddleNameInitial)
        {
            SectionAttendanceViewModel sectionAttendance = null;
            if (sectionAttendanceDTO?.Students?.Count() > 0)
            {
                sectionAttendance = new()
                {
                    StudentList = new()
                };
                People studentName = null;
                List<StudentAttendance> studentSortedList = new();
                sectionAttendanceDTO.Students.ForEach(c => studentSortedList.Add(c));
                studentSortedList = FormatHelper.GetSortedList(studentSortedList.Cast<object>(), nameSort).Cast<StudentAttendance>().ToList();
                foreach (StudentAttendance studentAttendance in studentSortedList)
                {
                    studentName = new()
                    {
                        Prefix = studentAttendance.Prefix,
                        DisplayName = studentAttendance.DisplayName,
                        FirstName = studentAttendance.FirstName,
                        MiddleName = studentAttendance.MiddleName,
                        LastName = studentAttendance.LastName,
                        LastNamePrefix = studentAttendance.LastNamePrefix,
                        Suffix = studentAttendance.Suffix,
                        Pronoun = studentAttendance.Pronoun
                    };
                    AvatarViewModel peopleAvatar = studentName.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                    sectionAttendance.StudentList.Add(new()
                    {
                        ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                        Email = studentAttendance.Email,
                        ExcusedAbsence = studentAttendance.ExcusedAbsence,
                        ExcusedTardiness = studentAttendance.ExcusedTardiness,
                        FirstLetter = peopleAvatar.FirstLetter,
                        FullName = peopleAvatar.FullName,
                        Id = studentAttendance.StudentSectionAttendanceId,
                        LastAttendedDate = FormatHelper.ToDatePicker(studentAttendance.LastAttendedDate),
                        OverallAttendance = studentAttendance.SectionAttendanceDescription,
                        PeopleId = FormatHelper.ToPeopleId(studentAttendance.PeopleId, general.PeopleIdFormat),
                        SectionAttendanceId = studentAttendance.SectionAttendanceId,
                        UnexcusedAbsence = studentAttendance.UnexcusedAbsence,
                        UnexcusedTardiness = studentAttendance.UnexcusedTardiness,
                        Withdrawn = studentAttendance.Withdrawn,
                        PersonId = peopleAvatar.PersonId
                    });
                }
                if (sectionAttendanceDTO.AttendStatusCodes?.Count > 0)
                {
                    sectionAttendance.AttendStatusCodes = new();
                    foreach (CodeTable code in sectionAttendanceDTO.AttendStatusCodes)
                    {
                        sectionAttendance.AttendStatusCodes.Add(new()
                        {
                            Value = code.Id,
                            Description = code.Description
                        });
                    }
                }
                sectionAttendance.EmailSettings = new()
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
                sectionAttendance.ShowDailyAttendance = courseManagement.ShowDailyAttendance;
                sectionAttendance.ShowOverallAttendance = courseManagement.ShowOverallAttendance;
            }
            return sectionAttendance;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="calendarDatesDTO">The calendar dates dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static SectionCalendarDateViewModel ToViewModel(this List<DateAttendance> calendarDatesDTO, InstitutionSettings.General general)
        {
            SectionCalendarDateViewModel sectionCalendarDateViewModel = new();
            List<DateAttendanceViewModel> calendarDates = new();
            DateAttendanceViewModel dateAttendanceViewModel;
            DateTime dateSelected = default;
            DateTime today = DateTime.Today;
            if (calendarDatesDTO?.Count > 0)
            {
                long min = Math.Abs(today.Ticks - calendarDatesDTO[0].CalendarDate.Ticks);
                long diff;
                foreach (DateAttendance dateAttendance in calendarDatesDTO)
                {
                    diff = Math.Abs(today.Ticks - dateAttendance.CalendarDate.Ticks);
                    if (diff <= min)
                    {
                        min = diff;
                        dateSelected = dateAttendance.CalendarDate;
                    }
                    dateAttendanceViewModel = new()
                    {
                        CalendarDate = FormatHelper.ToDatePicker(dateAttendance.CalendarDate),
                        MissingAttendance = dateAttendance.MissingAttendance
                    };
                    calendarDates.Add(dateAttendanceViewModel);
                }
                sectionCalendarDateViewModel.CalendarDateSelected = FormatHelper.ToDatePicker(dateSelected);
                sectionCalendarDateViewModel.CalendarDates = calendarDates;
            }
            return sectionCalendarDateViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="studentMeetingAttendancesDTO">The student meeting attendances dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<StudentMeetingAttendanceViewModel> ToViewModel(this List<StudentMeetingAttendance>
            studentMeetingAttendancesDTO, string nameFormat, string nameSort, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            StudentMeetingAttendanceViewModel studentMeetingAttendanceViewModel = null;
            List<StudentMeetingAttendanceViewModel> studentMeetingAttendanceViewModels = new();

            if (studentMeetingAttendancesDTO?.Count > 0)
            {
                List<People> studentSortedList = new();
                studentMeetingAttendancesDTO.ForEach(c => studentSortedList.Add(c.PeopleAttendance));
                studentSortedList = FormatHelper.GetSortedList(studentSortedList.Cast<object>(), nameSort).Cast<People>().ToList();
                StudentMeetingAttendance studentMeetingAttendance;
                AvatarViewModel peopleAvatar = null;
                foreach (People studentName in studentSortedList)
                {
                    studentMeetingAttendance = studentMeetingAttendancesDTO.Find(x => x.PeopleAttendance == studentName);
                    if (studentMeetingAttendance != null)
                    {
                        peopleAvatar = studentMeetingAttendance.PeopleAttendance.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                        studentMeetingAttendanceViewModel = new StudentMeetingAttendanceViewModel
                        {
                            AttendanceStatus = studentMeetingAttendance.AttendanceStatus,
                            AttendanceStatusDesc = studentMeetingAttendance.AttendanceStatusDesc,
                            ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                            Comments = studentMeetingAttendance.Comments,
                            FirstLetter = peopleAvatar.FirstLetter,
                            FullName = peopleAvatar.FullName,
                            HasPicture = false,
                            PeopleId = FormatHelper.ToPeopleId(studentMeetingAttendance.PeopleAttendance.PeopleId, general.PeopleIdFormat),
                            PersonId = peopleAvatar.PersonId,
                            StudentMeetingAttendanceId = studentMeetingAttendance.StudentMeetingAttendanceId,
                            Withdrawn = studentMeetingAttendance.Withdrawn,
                        };
                        studentMeetingAttendanceViewModels.Add(studentMeetingAttendanceViewModel);
                    }
                }
            }
            return studentMeetingAttendanceViewModels;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="studentMeetingAttendancesDTO">The student meeting attendances dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<StudentMeetingAttendanceDownloadViewModel> ToViewModel(this List<StudentMeetingAttendanceDownload>
            studentMeetingAttendancesDTO, string nameFormat, string nameSort, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            StudentMeetingAttendanceDownloadViewModel studentMeetingAttendanceViewModel = null;
            List<StudentMeetingAttendanceDownloadViewModel> studentMeetingAttendanceViewModels = new();

            if (studentMeetingAttendancesDTO?.Count > 0)
            {
                List<People> studentSortedList = new();
                studentMeetingAttendancesDTO.ForEach(c => studentSortedList.Add(c.PeopleAttendance));
                studentSortedList = FormatHelper.GetSortedList(studentSortedList.Cast<object>(), nameSort).Cast<People>().ToList();
                StudentMeetingAttendanceDownload studentMeetingAttendance;
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                foreach (People studentName in studentSortedList)
                {
                    studentMeetingAttendance = studentMeetingAttendancesDTO.Find(x => x.PeopleAttendance == studentName);
                    if (studentMeetingAttendance != null)
                    {
                        studentMeetingAttendanceViewModel = new()
                        {
                            Email = studentName.Email,
                            FullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(studentName)), nameFormat, showMiddleNameInitial),
                            PeopleId = FormatHelper.ToPeopleId(studentName.PeopleId.Remove(0, 1), general.PeopleIdFormat),
                            MeetingAttendances = studentMeetingAttendance.MeetingAttendances.ToViewModel(datetimeCulture)
                        };
                        studentMeetingAttendanceViewModels.Add(studentMeetingAttendanceViewModel);
                    }
                }
            }
            return studentMeetingAttendanceViewModels;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="studentMeetingAttendanceCalendars">The student meeting attendances dto.</param>
        /// <param name="datetimeCulture">The name format.</param>
        /// <returns></returns>
        internal static List<StudentMeetingAttendanceCalendarViewModel> ToViewModel(this List<StudentMeetingAttendanceCalendar> studentMeetingAttendanceCalendars, CultureInfo datetimeCulture)
        {
            StudentMeetingAttendanceCalendarViewModel studentMeetingAttendanceCalendarViewModel;
            List<StudentMeetingAttendanceCalendarViewModel> studentMeetingAttendanceCalendarViewModels = new();
            foreach (StudentMeetingAttendanceCalendar students in studentMeetingAttendanceCalendars)
            {
                studentMeetingAttendanceCalendarViewModel = new StudentMeetingAttendanceCalendarViewModel
                {
                    AttendanceStatusDesc = students.AttendanceStatusDesc,
                    CalendarDate = $"{FormatHelper.ToShortDateDaily(students.CalendarDate, datetimeCulture)} " +
                    $"{FormatHelper.ToShortTimeDaily(students.StartTime, datetimeCulture)} " +
                    $"{FormatHelper.ToShortTimeDaily(students.EndTime, datetimeCulture)}",
                    Withdrawn = students.Withdrawn
                };

                studentMeetingAttendanceCalendarViewModels.Add(studentMeetingAttendanceCalendarViewModel);
            }

            return studentMeetingAttendanceCalendarViewModels;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sectionMeetingCalendarDTO">The section meeting calendar dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<SectionMeetingCalendarViewModel> ToViewModel(this List<SectionMeetingCalendar> sectionMeetingCalendarDTO, InstitutionSettings.General general)
        {
            SectionMeetingCalendarViewModel sectionMeetingCalendarViewModel = null;
            List<SectionMeetingCalendarViewModel> sectionMeetingCalendarViewModels = new();

            if (sectionMeetingCalendarDTO?.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                foreach (SectionMeetingCalendar sectionMeetingCalendar in sectionMeetingCalendarDTO)
                {
                    sectionMeetingCalendarViewModel = new()
                    {
                        BuildingName = sectionMeetingCalendar.BuildingName,
                        CalendarKey = sectionMeetingCalendar.CalendarKey,
                        CampusName = sectionMeetingCalendar.CampusName,
                        EndTime = FormatHelper.ToShortTime(sectionMeetingCalendar.EndTime, datetimeCulture),
                        FloorId = sectionMeetingCalendar.FloorId,
                        MissingAttendance = sectionMeetingCalendar.MissingAttendance,
                        Notes = sectionMeetingCalendar.Notes,
                        RoomId = sectionMeetingCalendar.RoomId,
                        RoomName = sectionMeetingCalendar.RoomName,
                        StartTime = FormatHelper.ToShortTime(sectionMeetingCalendar.StartTime, datetimeCulture),
                    };
                    sectionMeetingCalendarViewModels.Add(sectionMeetingCalendarViewModel);
                }
            }
            return sectionMeetingCalendarViewModels;
        }

        #region Classes Grading Download

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sectionViolationViewModelList">The section violation view model list.</param>
        /// /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<StudentViolationDownloadModel> ToViewModel(this List<SectionViolationViewModel> sectionViolationViewModelList, InstitutionSettings.General general)
        {
            List<StudentViolationDownloadModel> studentViolations = null;
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            if (sectionViolationViewModelList?.Count > 0)
            {
                studentViolations = new List<StudentViolationDownloadModel>();
                foreach (SectionViolationViewModel item in sectionViolationViewModelList)
                {
                    if (item.ViolationList?.Count > 0)
                    {
                        foreach (ViolationViewModel violationItem in item.ViolationList)
                        {
                            studentViolations.Add(new StudentViolationDownloadModel
                            {
                                CategoryDesc = item.ViolationCategoryList.Find(x => x.ViolationCategoryId == violationItem.ViolationCategoryId).ViolationCategory,
                                Date = FormatHelper.ToShortDate(FormatHelper.FromDatePicker(violationItem.ViolationDate), datetimeCulture),
                                FullName = item.FullName,
                                PeopleId = item.PeopleId,
                                ViolationDesc = violationItem.ViolationType,
                                Withdrawn = item.Withdrawn
                            });
                        }
                    }
                    else
                    {
                        studentViolations.Add(new StudentViolationDownloadModel
                        {
                            CategoryDesc = string.Empty,
                            Date = string.Empty,
                            FullName = item.FullName,
                            PeopleId = item.PeopleId,
                            ViolationDesc = string.Empty,
                            Withdrawn = item.Withdrawn
                        });
                    }
                }
            }
            return studentViolations;
        }

        /// <summary>
        /// To the SectionAttendanceStudentDownloadViewModel list view model.
        /// </summary>
        /// <param name="sectionAttendanceViewModelList">The section attendance view model list.</param>
        /// /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<SectionAttendanceStudentDownloadViewModel> ToViewModel(this List<SectionAttendanceStudentViewModel> sectionAttendanceViewModelList, InstitutionSettings.General general)
        {
            List<SectionAttendanceStudentDownloadViewModel> students = null;
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            if (sectionAttendanceViewModelList?.Count > 0)
            {
                students = new List<SectionAttendanceStudentDownloadViewModel>();
                foreach (SectionAttendanceStudentViewModel student in sectionAttendanceViewModelList)
                {
                    students.Add(new SectionAttendanceStudentDownloadViewModel
                    {
                        Comments = student.Comments,
                        Email = student.Email,
                        ExcusedAbsence = student.ExcusedAbsence,
                        ExcusedTardiness = student.ExcusedTardiness,
                        FullName = student.FullName,
                        LastDateAttended = student.LastAttendedDate.Length > 0 ? FormatHelper.ToShortDate(FormatHelper.FromDatePicker(student.LastAttendedDate), datetimeCulture) : string.Empty,
                        OverallAttendance = student.OverallAttendance,
                        PeopleId = student.PeopleId,
                        Status = student.Status,
                        UnexcusedAbsence = student.UnexcusedAbsence,
                        UnexcusedTardiness = student.UnexcusedTardiness,
                        Withdrawn = student.Withdrawn
                    });
                }
            }
            return students;
        }

        /// <summary>
        /// To the SectionStatisticDownloadViewModel list view model.
        /// </summary>
        /// <param name="sectionStatisticViewModelList">The section statistic view model list.</param>
        /// <param name="midTermGrades">The midTermGrade.</param>
        /// <returns></returns>
        internal static List<SectionStatisticDownloadViewModel> ToViewModel(this List<SectionStatisticViewModel> sectionStatisticViewModelList, bool midTermGrades)
        {
            List<SectionStatisticDownloadViewModel> statistics = null;
            if (sectionStatisticViewModelList?.Count > 0)
            {
                statistics = new List<SectionStatisticDownloadViewModel>();
                foreach (SectionStatisticViewModel statistic in sectionStatisticViewModelList)
                {
                    if (statistic.IsMidterm && midTermGrades)
                    {
                        statistics.Add(new SectionStatisticDownloadViewModel
                        {
                            AverageScore = statistic.AverageScore,
                            HighScore = statistic.HighScore,
                            IsMidterm = statistic.IsMidterm,
                            LowScore = statistic.LowScore,
                            PercentIncluded = statistic.PercentIncluded,
                            StandardDeviation = statistic.StandardDeviation,
                            Variance = statistic.Variance
                        });
                    }
                    else if (!statistic.IsMidterm)
                    {
                        statistics.Add(new SectionStatisticDownloadViewModel
                        {
                            AverageScore = statistic.AverageScore,
                            HighScore = statistic.HighScore,
                            IsMidterm = statistic.IsMidterm,
                            LowScore = statistic.LowScore,
                            PercentIncluded = statistic.PercentIncluded,
                            StandardDeviation = statistic.StandardDeviation,
                            Variance = statistic.Variance
                        });
                    }
                }
            }

            return statistics;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="studentOverallGradeViewModelList">The student overall grade view model list.</param>
        /// <param name="isMidtermEnabled">if set to <c>true</c> [is midterm enabled].</param>
        /// <param name="showProjected">if set to <c>true</c> [show projected].</param>
        /// <returns></returns>
        internal static List<OverallGradeStudentDownloadViewModel> ToViewModel(this SectionOverallGradeListViewModel studentOverallGradeViewModelList, bool isMidtermEnabled, bool showProjected)
        {
            List<OverallGradeStudentDownloadViewModel> downloadList = null;
            if (studentOverallGradeViewModelList?.OverallGradeList?.Count > 0)
            {
                downloadList = new List<OverallGradeStudentDownloadViewModel>();
                foreach (StudentOverallGradeViewModel student in studentOverallGradeViewModelList.OverallGradeList)
                {
                    downloadList.Add(new OverallGradeStudentDownloadViewModel
                    {
                        CreditType = student.CreditType,
                        FinalInstructorGrade = student.Finalterm.InstructorGrade,
                        FinalPoints = student.Finalterm.CalculatedScore,
                        FinalTranscriptGrade = student.Finalterm.TranscriptGrade,
                        MidtermInstructorGrade = isMidtermEnabled ? student.Midterm.InstructorGrade : string.Empty,
                        MidtermPoints = isMidtermEnabled ? student.Midterm.CalculatedScore : string.Empty,
                        MidtermTranscriptGrade = isMidtermEnabled ? student.Midterm.TranscriptGrade : string.Empty,
                        Name = student.FullName,
                        PeopleId = student.PeopleId,
                        ProjectedGrade = showProjected ? student.ProjectedGrade : string.Empty,
                        Withdrawn = student.Withdrawn
                    });
                }
            }

            return downloadList;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sectionAssignmentSetupDTO">The section assignment setup dto.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static SectionAssignmentSetupViewModel ToViewModel(this SectionAssignmentSetup sectionAssignmentSetupDTO, ISettingService settingService, InstitutionSettings.General general)
        {
            SectionAssignmentSetupViewModel sectionAssignmentSetupViewModel = null;
            if (sectionAssignmentSetupDTO != null)
            {
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                sectionAssignmentSetupViewModel = new SectionAssignmentSetupViewModel
                {
                    AllowDeleteAll = !sectionAssignmentSetupDTO.AssignmentTypeRules.Any(x => x.Assignments.Any(t => t.HasGrade)),
                    AssignmentTypes = GetAssignmentTypes(sectionAssignmentSetupDTO.AssignmentTypeRules, general),
                    IsWeightByType = sectionAssignmentSetupDTO.IsWeightByType,
                    ShowMidterm = settingService.IsMidtermGradesEnabled(),
                    TotalFinalPoints = FormatHelper.ToDecimal(CalculateTotalPoints(false, sectionAssignmentSetupDTO.AssignmentTypeRules), formatProvider),
                    TotalMidtermPoints = FormatHelper.ToDecimal(CalculateTotalPoints(true, sectionAssignmentSetupDTO.AssignmentTypeRules), formatProvider),
                    WeightMethod = sectionAssignmentSetupDTO.WeightMethod
                };
            }
            return sectionAssignmentSetupViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="studentActivityGradesDTO">The student activity grades dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<StudentActivityGradeViewModel> ToViewModel(this List<StudentActivityGrade> studentActivityGradesDTO,
            string nameFormat, string nameSort, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            List<StudentActivityGradeViewModel> studentActivityGradeViewModels = new();
            if (studentActivityGradesDTO?.Count > 0)
            {
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                List<StudentName> studentSortedList = new();
                foreach (StudentActivityGrade item in studentActivityGradesDTO)
                    studentSortedList.Add(item.StudentFullName);

                studentSortedList = FormatHelper.GetSortedList(studentSortedList.Cast<object>(), nameSort).Cast<StudentName>().ToList();

                StudentActivityGrade studentActivityGrade = null;
                StudentActivityGradeViewModel studentActivityGradeViewModel = null;
                AvatarViewModel peopleAvatar = null;
                foreach (StudentName studentName in studentSortedList)
                {
                    studentActivityGrade = studentActivityGradesDTO.Find(x => x.StudentFullName == studentName);
                    if (studentActivityGrade != null)
                    {
                        peopleAvatar = studentName.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                        studentActivityGradeViewModel = new StudentActivityGradeViewModel
                        {
                            AssignmentId = studentActivityGrade.AssignmentId,
                            CreateDate = FormatHelper.ToShortDate(studentActivityGrade.CreateDate, datetimeCulture),
                            EarnedPoints = studentActivityGrade.EarnedPoints,
                            Email = studentActivityGrade.Email,
                            EnteredFullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(
                            new People
                            {
                                Prefix = studentActivityGrade.EnteredFullName.Prefix,
                                DisplayName = studentActivityGrade.EnteredFullName.DisplayName,
                                FirstName = studentActivityGrade.EnteredFullName.FirstName,
                                MiddleName = studentActivityGrade.EnteredFullName.MiddleName,
                                LastName = studentActivityGrade.EnteredFullName.LastName,
                                LastNamePrefix = studentActivityGrade.EnteredFullName.LastNamePrefix,
                                Suffix = studentActivityGrade.EnteredFullName.Suffix,
                                Pronoun = studentActivityGrade.EnteredFullName.Pronoun
                            })), nameFormat, showMiddleNameInitial),
                            FullName = peopleAvatar.FullName,
                            Grade = studentActivityGrade.Grade,
                            ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                            FirstLetter = peopleAvatar.FirstLetter,
                            GradeReceived = FormatHelper.ToDatePicker(studentActivityGrade.GradeReceived),
                            InstructorComments = studentActivityGrade.InstructorComments,
                            ModifiedFullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(
                            new People
                            {
                                Prefix = studentActivityGrade.ModifiedFullName.Prefix,
                                DisplayName = studentActivityGrade.ModifiedFullName.DisplayName,
                                FirstName = studentActivityGrade.ModifiedFullName.FirstName,
                                MiddleName = studentActivityGrade.ModifiedFullName.MiddleName,
                                LastName = studentActivityGrade.ModifiedFullName.LastName,
                                LastNamePrefix = studentActivityGrade.ModifiedFullName.LastNamePrefix,
                                Suffix = studentActivityGrade.ModifiedFullName.Suffix,
                                Pronoun = studentActivityGrade.ModifiedFullName.Pronoun
                            })), nameFormat, showMiddleNameInitial),
                            PeopleId = FormatHelper.ToPeopleId(studentActivityGrade.PeopleId, general.PeopleIdFormat),
                            Percentaje = FormatHelper.ToDecimal(studentActivityGrade.PercentageFinal, formatProvider),
                            RevisionDate = FormatHelper.ToShortDate(studentActivityGrade.RevisionDate, datetimeCulture),
                            StudentAssignmentId = studentActivityGrade.StudentAssignmentId,
                            PersonId = studentActivityGrade.StudentId,
                            Withdrawn = studentActivityGrade.Withdrawn
                        };
                        studentActivityGradeViewModels.Add(studentActivityGradeViewModel);
                    }
                }
            }
            return studentActivityGradeViewModels;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="assignmentDTO">The assignment dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static ActivityGradeViewModel ToViewModel(this Assignment assignmentDTO, InstitutionSettings.General general)
        {
            ActivityGradeViewModel activityGradeViewModel = null;
            if (assignmentDTO != null)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                activityGradeViewModel = new ActivityGradeViewModel
                {
                    Description = assignmentDTO.Description,
                    DueDate = FormatHelper.ToShortDate(assignmentDTO.DueDate, datetimeCulture),
                    GradeDueDate = FormatHelper.ToShortDate(assignmentDTO.GradeDueDate, datetimeCulture),
                    IsExtraCredit = assignmentDTO.IsExtraCredit,
                    TotalPoints = FormatHelper.ToDecimal(assignmentDTO.TotalPoints, formatProvider),
                    TotalPointsValue = assignmentDTO.TotalPoints,
                };
            }
            return activityGradeViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="studentMeetingAttendanceViewModel">The studentMeetingAttendance view model.</param>
        /// <returns></returns>
        internal static List<SectionAttendanceStudentDownloadViewModel> ToViewModel(this List<StudentMeetingAttendanceViewModel> studentMeetingAttendanceViewModel)
        {
            List<SectionAttendanceStudentDownloadViewModel> students = null;
            if (studentMeetingAttendanceViewModel?.Count > 0)
            {
                students = new List<SectionAttendanceStudentDownloadViewModel>();
                foreach (StudentMeetingAttendanceViewModel student in studentMeetingAttendanceViewModel)
                {
                    students.Add(new SectionAttendanceStudentDownloadViewModel
                    {
                        Comments = student.Comments,
                        FullName = student.FullName,
                        Status = student.AttendanceStatusDesc,
                        Withdrawn = student.Withdrawn
                    });
                }
            }
            return students;
        }

        #endregion Classes Grading Download

        #region CourseTemplates

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sectionAssignmentsDTO">The section assignments dto.</param>
        /// <returns></returns>
        internal static List<SectionAssignmentsViewModel> ToViewModel(this List<SectionAssignment> sectionAssignmentsDTO)
        {
            List<SectionAssignmentsViewModel> sectionList = null;
            if (sectionAssignmentsDTO?.Count > 0)
            {
                sectionList = new();
                SectionAssignmentsViewModel section;
                foreach (SectionAssignment sectionDTO in sectionAssignmentsDTO)
                {
                    section = new()
                    {
                        SectionId = sectionDTO.SectionId,
                        SessionPeriodId = sectionDTO.SessionPeriodId,
                        AcademicYear = sectionDTO.AcademicYear,
                        AcademicTerm = sectionDTO.AcademicTerm,
                        TermDesc = sectionDTO.AcademicTermDesc,
                        AcademicSession = sectionDTO.AcademicSession,
                        SessionDesc = sectionDTO.AcademicSessionDesc,
                        EventId = sectionDTO.EventId,
                        EventSubType = sectionDTO.EventSubType,
                        SectionIdentifier = sectionDTO.SectionEvent,
                        EventName = sectionDTO.EventLongName,
                        HasGrades = sectionDTO.HasGrades,
                        HasActivities = sectionDTO.HasActivities,
                        HasTemplate = sectionDTO.HasTemplate,
                        HasPostedGrades = sectionDTO.HasPostedGrades
                    };
                    sectionList.Add(section);
                }
            }
            return sectionList;
        }

        #endregion CourseTemplates

        #region Private Methods

        /// <summary>
        /// Calculates the maximum drop.
        /// </summary>
        /// <param name="isMidterm">if set to <c>true</c> [is midterm].</param>
        /// <param name="assignments">The assignments.</param>
        /// <returns></returns>
        private static int CalculateMaxDrop(bool isMidterm, List<Assignment> assignments)
        {
            return isMidterm ? (assignments.Count(x => x.MidtermWeight == 1) - assignments.Count(x => x.MidtermWeight == 1 && x.IsExtraCredit))
                         : (assignments.Count(x => x.FinalWeight == 1) - assignments.Count(x => x.FinalWeight == 1 && x.IsExtraCredit));
        }

        /// <summary>
        /// Calculates the total points.
        /// </summary>
        /// <param name="isMidterm">if set to <c>true</c> [is midterm].</param>
        /// <param name="assignmentTypes">The assignment types.</param>
        /// <returns></returns>
        private static decimal? CalculateTotalPoints(bool isMidterm, List<AssignmentTypeRule> assignmentTypes)
        {
            decimal? totalPoints = 0;
            if (isMidterm)
            {
                foreach (AssignmentTypeRule assignmentType in assignmentTypes)
                {
                    totalPoints += assignmentType.Assignments?.Where(x => x.MidtermWeight == 1).Sum(x => x.PossiblePoints)
                        - assignmentType.Assignments?.Where(x => x.MidtermWeight == 1 && x.IsExtraCredit).Sum(x => x.PossiblePoints);
                }
            }
            else
            {
                foreach (AssignmentTypeRule assignmentType in assignmentTypes)
                {
                    totalPoints += assignmentType.Assignments?.Where(x => x.FinalWeight == 1).Sum(x => x.PossiblePoints)
                        - assignmentType.Assignments?.Where(x => x.FinalWeight == 1 && x.IsExtraCredit).Sum(x => x.PossiblePoints);
                }
            }
            return totalPoints;
        }

        /// <summary>
        /// Gets the assignment types.
        /// </summary>
        /// <param name="assignmentTypes">The assignment types.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        private static List<SectionAssignmentTypeViewModel> GetAssignmentTypes(List<AssignmentTypeRule> assignmentTypes, InstitutionSettings.General general)
        {
            List<SectionAssignmentTypeViewModel> sectionAssignmentTypesViewModel = null;
            if (assignmentTypes?.Count > 0)
            {
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                sectionAssignmentTypesViewModel = new List<SectionAssignmentTypeViewModel>();
                foreach (AssignmentTypeRule assignmentType in assignmentTypes)
                {
                    sectionAssignmentTypesViewModel.Add(new SectionAssignmentTypeViewModel
                    {
                        AssignmentsCount = assignmentType.Assignments.Count,
                        AssignmentTypeRuleId = assignmentType.AssignmentTypeRuleId,
                        Description = assignmentType.AssignmentTypeDesc,
                        EndDate = FormatHelper.ToDatePicker(assignmentType.EndDate),
                        FinalDropHighest = assignmentType.FinalDropHighest,
                        FinalDropLowest = assignmentType.FinalDropLowest,
                        FinalMaxDrop = CalculateMaxDrop(false, assignmentType.Assignments),
                        FinalWeight = assignmentType.FinalWeight,
                        Id = assignmentType.AssignmentTypeId,
                        MidtermDropHighest = assignmentType.MidtermDropHighest,
                        MidtermDropLowest = assignmentType.MidtermDropLowest,
                        MidtermWeight = assignmentType.MidtermWeight,
                        MidtermMaxDrop = CalculateMaxDrop(true, assignmentType.Assignments),
                        SectionAssignments = GetSectionAssignments(assignmentType.Assignments, datetimeCulture),
                        TotalPoints = FormatHelper.ToDecimal(assignmentType.Assignments.Sum(x => x.PossiblePoints), formatProvider),
                    });
                }
            }
            return sectionAssignmentTypesViewModel;
        }

        /// <summary>
        /// Gets the credit type dropdown.
        /// </summary>
        /// <param name="creditTypeId">The credit type identifier.</param>
        /// <param name="gradeValues">The grade values.</param>
        /// <returns></returns>
        private static List<ListOptionViewModel> GetCreditTypeDropdown(int creditTypeId, GradeValues[] gradeValues)
        {
            if (gradeValues.Length > 0)
                gradeValues[0].Values = gradeValues[0].Values?.OrderByDescending(x => x.QualityPoints).ThenBy(x => x.Rank).ToArray();
            List<ListOptionViewModel> dropdown = new()
            {
                new ListOptionViewModel { Value = string.Empty, Description = string.Empty }
            };
            for (int i = 0; i < gradeValues.Length; i++)
            {
                if (creditTypeId == gradeValues[i].Id)
                {
                    for (int j = 0; j < gradeValues[i].Values?.Length; j++)
                    {
                        dropdown.Add(new ListOptionViewModel
                        {
                            Value = gradeValues[i].Values[j].Grade,
                            Description = gradeValues[i].Values[j].Grade
                        });
                    }
                }
            }
            return dropdown;
        }

        /// <summary>
        /// Function that retrieves all the hours of a day.
        /// </summary>
        /// <param name="general">The general.</param>
        /// <returns>
        /// List(ListOptionViewModel)
        /// </returns>
        private static List<ListOptionViewModel> GetHours(InstitutionSettings.General general)
        {
            List<ListOptionViewModel> hours = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            DateTime today = DateTime.Today;
            for (int i = 1; i <= 24; i++)
            {
                hours.Add(new()
                {
                    Value = FormatHelper.ToTimeDropDown(today),
                    Description = FormatHelper.ToShortTime(today, datetimeCulture)
                });
                today = today.AddHours(1);
            }

            return hours;
        }

        /// <summary>
        /// Gets the section assignments.
        /// </summary>
        /// <param name="assignments">The assignments.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <returns></returns>
        private static List<SectionAssignmentViewModel> GetSectionAssignments(List<Assignment> assignments, CultureInfo datetimeCulture)
        {
            List<SectionAssignmentViewModel> sectionAssignmentViewModel = null;
            if (assignments?.Count > 0)
            {
                sectionAssignmentViewModel = new List<SectionAssignmentViewModel>();
                foreach (Assignment assignment in assignments)
                {
                    sectionAssignmentViewModel.Add(new SectionAssignmentViewModel
                    {
                        AllowDelete = !assignment.HasGrade,
                        AssignedDate = FormatHelper.ToDatePicker(assignment.AssignedDate),
                        AssignmentEndDate = FormatHelper.ToShortDate(assignment.AssignmentEndDate, datetimeCulture),
                        CountsForFinal = assignment.FinalWeight > 0,
                        CountsForMidterm = assignment.MidtermWeight > 0,
                        Description = assignment.Description,
                        DueDate = FormatHelper.ToShortDate(assignment.DueDate, datetimeCulture),
                        FinalWeight = assignment.FinalWeight,
                        Id = assignment.AssignmentId,
                        IsExtraCredit = assignment.IsExtraCredit,
                        MidtermWeight = assignment.MidtermWeight,
                        PossiblePoints = assignment.PossiblePoints,
                        Title = assignment.AssignmentTitle
                    });
                }
            }

            return sectionAssignmentViewModel;
        }

        /// <summary>
        /// Gets the midterm information.
        /// </summary>
        /// <param name="isOpen">if set to <c>true</c> [is open].</param>
        /// <param name="gradeDetail">The grade information.</param>
        /// <param name="isFacultyMember">if set to <c>true</c> [is faculty member].</param>
        /// <param name="isDeptHeadMember">if set to <c>true</c> [is dept head member].</param>
        /// <param name="isApprovalRequired">if set to <c>true</c> [is approval required].</param>
        /// <param name="isAuthorized">if set to <c>true</c> [is authorized].</param>
        /// <param name="isFacultyAssistantMember">if set to <c>true</c> [is faculty assistant member].</param>
        /// <param name="formatProvider">The format provider.</param>
        /// <returns>
        /// OverallGradeViewModel
        /// </returns>
        private static OverallGradeViewModel GetTermInfo(bool isOpen, GradeDetail gradeDetail, bool isFacultyMember,
            bool isDeptHeadMember, bool isApprovalRequired, bool isAuthorized, bool isFacultyAssistantMember,
            IFormatProvider formatProvider)
        {
            OverallGradeViewModel overallGradeViewModel = new()
            {
                StudentGradeId = gradeDetail.StudentGradeId,
                CalculatedScore = gradeDetail.Score < 0 ? "-" : FormatHelper.ToDecimal(gradeDetail.Score, formatProvider) + "   (" + gradeDetail.MappedGrade + ")",
                InstructorGrade = gradeDetail.InstructorGrade != null ? gradeDetail.InstructorGrade : gradeDetail.MappedGrade,
                TranscriptGrade = gradeDetail.TranscriptGrade,
                ApprovedGrade = gradeDetail.ApprovedGrade,
                InstructorComments = gradeDetail.InstructorComments,
                TranscriptComments = gradeDetail.TranscriptComments,
                ApprovedComments = gradeDetail.ApprovedComments,
                GradeApprovalId = gradeDetail.GradeApprovalId,
                IsAllowedToChange = isOpen && (!isApprovalRequired && isAuthorized && (isFacultyMember || isDeptHeadMember || isFacultyAssistantMember)),
                TranscriptDetailId = gradeDetail.TranscriptDetailId
            };
            if (gradeDetail.Score == 0 && !string.IsNullOrEmpty(gradeDetail.MappedGrade))
                overallGradeViewModel.CalculatedScore = "-";
            else if (!string.IsNullOrEmpty(gradeDetail.MappedGrade))
                overallGradeViewModel.CalculatedScore = FormatHelper.ToDecimal(gradeDetail.Score, formatProvider) + "   (" + gradeDetail.MappedGrade + ")";
            else
                overallGradeViewModel.CalculatedScore = FormatHelper.ToDecimal(gradeDetail.Score, formatProvider);

            if (!string.IsNullOrEmpty(overallGradeViewModel.TranscriptGrade))
            {
                overallGradeViewModel.IsPosted = true;
                overallGradeViewModel.IsAllowedToChange = false;
            }
            else
            {
                if (isApprovalRequired && gradeDetail.ApproverId > 0 && !string.IsNullOrEmpty(gradeDetail.ApprovedGrade))
                {
                    overallGradeViewModel.IsApproved = true;
                }
                else
                {
                    if (isApprovalRequired && gradeDetail.GradeApprovalId > 0)
                    {
                        overallGradeViewModel.IsPending = true;
                        overallGradeViewModel.IsAllowedToChange = true;
                    }
                }
            }
            if (!overallGradeViewModel.IsPosted && !overallGradeViewModel.IsApproved && !overallGradeViewModel.IsPending)
                overallGradeViewModel.IsAllowedToChange = true;
            return overallGradeViewModel;
        }

        #endregion Private Methods
    }
}