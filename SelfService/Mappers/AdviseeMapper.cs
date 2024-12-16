// --------------------------------------------------------------------
// <copyright file="AdviseeMapper.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Advisees;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// AdviseeMapper
    /// </summary>
    internal static class AdviseeMapper
    {
        /// <summary>
        /// To the authorize registration view model.
        /// </summary>
        /// <param name="advisees">The advisees.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="formatPeopleId">The format people identifier.</param>
        /// <param name="showPicture">if set to <c>true</c> [show picture].</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static AuthorizeRegistrationListViewModel ToAuthorizeRegistrationViewModel(this List<Advisee> advisees, string nameFormat, string nameSort, string formatPeopleId,
            bool showPicture, IPeopleService peopleService, bool showMiddleNameInitial, IPictureHelper pictureHelper)
        {
            AuthorizeRegistrationListViewModel authorizeRegistrationListViewModel = new();
            if (advisees?.Count > 0)
            {
                authorizeRegistrationListViewModel.Advisees = new();
                AvatarViewModel peopleAvatar;
                foreach (Advisee adviseeDTO in advisees)
                {
                    peopleAvatar = adviseeDTO.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                    authorizeRegistrationListViewModel.Advisees.Add(new()
                    {
                        ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                        Email = adviseeDTO.Email,
                        FirstLetter = peopleAvatar.FirstLetter,
                        FullName = peopleAvatar.FullName,
                        HasPicture = (showPicture && pictureHelper.GetPictureAsync(peopleService.GetPicture(adviseeDTO.PersonId.Value)) != null && adviseeDTO.HasPicture),
                        HasStopList = adviseeDTO.HasStopList,
                        PeopleId = FormatHelper.ToPeopleId(adviseeDTO.PeopleId, formatPeopleId),
                        PersonId = adviseeDTO.PersonId.Value,
                        RegistrationAuthorizationId = adviseeDTO.RegistrationAuthorizationId
                    });
                }
                authorizeRegistrationListViewModel.OverallCount = advisees[0].OverallCount;
            }
            return authorizeRegistrationListViewModel;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="adviseeAttendanceDetailsDTO">The advisee attendance details dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<AdviseeAttendanceDetailViewModel> ToViewModel(this List<AdviseeAttendanceDetail> adviseeAttendanceDetailsDTO,
            InstitutionSettings.General general)
        {
            List<AdviseeAttendanceDetailViewModel> attendanceDetails = null;
            if (adviseeAttendanceDetailsDTO?.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                attendanceDetails = new();
                foreach (AdviseeAttendanceDetail attendanceDetail in adviseeAttendanceDetailsDTO)
                {
                    attendanceDetails.Add(new()
                    {
                        Category = (int)attendanceDetail.Category,
                        Comments = attendanceDetail.Comments,
                        Date = FormatHelper.ToShortDate(attendanceDetail.Date, datetimeCulture),
                        EndTime = attendanceDetail.EndTime == null ? string.Empty : FormatHelper.ToShortTimeDaily(attendanceDetail.EndTime.Value, datetimeCulture),
                        StartTime = attendanceDetail.StartTime == null ? string.Empty : FormatHelper.ToShortTimeDaily(attendanceDetail.StartTime.Value, datetimeCulture),
                        Status = attendanceDetail.StatusDesc
                    });
                }
            }
            return attendanceDetails;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="adviseeAttendancesDTO">The advisee attendances dto.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<AdviseeAttendanceViewModel> ToViewModel(this List<AdviseeAttendance> adviseeAttendancesDTO, IInstitutionSettingService institutionSettingService,
            InstitutionSettings.General general)
        {
            List<AdviseeAttendanceViewModel> adviseeAttendanceViewModel = null;
            InstitutionSettings.AdvisorWarning settings = institutionSettingService.GetAdvisorWarnings();
            InstitutionSettings.CourseManagement settingsCourseManagement = institutionSettingService.GetCourseManagement();
            if (adviseeAttendancesDTO?.Count > 0)
            {
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                adviseeAttendanceViewModel = new();
                IEnumerable<IGrouping<string, AdviseeAttendance>> groupsAttendance = adviseeAttendancesDTO.GroupBy(x => x.SessionCode).ToList();
                string sessionDesc = string.Empty;
                foreach (IGrouping<string, AdviseeAttendance> sessionGroup in groupsAttendance)
                {
                    sessionDesc = adviseeAttendancesDTO.Find(x => x.SessionCode == sessionGroup.Key).SessionDesc;
                    adviseeAttendanceViewModel.Add(new()
                    {
                        SessionDesc = sessionDesc,
                        ShowLowAttendanceWarning = settings.ShowAttendance,
                        ShowOverallAttendance = settingsCourseManagement.ShowOverallAttendance,
                        ShowDailyAttendance = settingsCourseManagement.ShowDailyAttendance,
                        AttendanceCourses = GetCoursesForSession(sessionGroup.Key, adviseeAttendancesDTO, datetimeCulture, formatProvider)
                    });
                }
            }
            return adviseeAttendanceViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="advisees">The advisees.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="formatPeopleId">The format people identifier.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<AdviseesDownloadViewModel> ToViewModel(this List<Advisee> advisees, string nameFormat, string nameSort, string formatPeopleId, bool showMiddleNameInitial)
        {
            List<AdviseesDownloadViewModel> adviseesDownloadViewModel = new();
            if (advisees?.Count > 0)
            {
                foreach (Advisee adviseeDTO in FormatHelper.GetSortedList(advisees.Cast<object>(), nameSort).Cast<Advisee>().ToList())
                {
                    adviseesDownloadViewModel.Add(new()
                    {
                        FullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(adviseeDTO)), nameFormat, showMiddleNameInitial),
                        PeopleId = FormatHelper.ToPeopleId(adviseeDTO.PeopleId, formatPeopleId),
                        HasPendingSchedules = adviseeDTO.HasPendingSchedules ? "X" : string.Empty,
                        HasStoplist = adviseeDTO.HasStopList ? "X" : string.Empty
                    });
                }
            }
            return adviseesDownloadViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="advisees">The advisees.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="showPicture">if set to <c>true</c> [show picture].</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static MyAdviseesListViewModel ToViewModel(this List<Advisee> advisees, string nameFormat, string nameSort,
            IPeopleService peopleService, IInstitutionSettingService institutionSettingService, bool showPicture, bool showMiddleNameInitial, IPictureHelper pictureHelper)
        {
            MyAdviseesListViewModel adviseesListViewModel = new();
            if (advisees?.Count > 0)
            {
                InstitutionSettings.AdvisorWarning settings = institutionSettingService.GetAdvisorWarnings();
                adviseesListViewModel.ShowAttendanceWarning = settings.ShowAttendance;
                adviseesListViewModel.ShowGradesWarning = settings.ShowGrades;
                adviseesListViewModel.ShowViolationWarning = settings.ShowViolations;
                adviseesListViewModel.Advisees = new();
                AvatarViewModel peopleAvatar;

                foreach (Advisee adviseeDTO in advisees)
                {
                    peopleAvatar = adviseeDTO.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);

                    adviseesListViewModel.Advisees.Add(new()
                    {
                        ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                        Email = adviseeDTO.Email,
                        FirstLetter = peopleAvatar.FirstLetter,
                        FullName = peopleAvatar.FullName,
                        HasPendingSchedules = adviseeDTO.HasPendingSchedules,
                        HasPicture = (showPicture && adviseeDTO.HasPicture && pictureHelper.GetPictureAsync(peopleService.GetPicture(adviseeDTO.PersonId.Value)) != null),
                        HasStopList = adviseeDTO.HasStopList,
                        IsSharedAdvisee = adviseeDTO.IsSharedAdvisee,
                        PeopleId = FormatHelper.ToPeopleId(adviseeDTO.PeopleId, institutionSettingService.GetGeneral().PeopleIdFormat),
                        PersonId = adviseeDTO.PersonId.Value
                    });
                }
                adviseesListViewModel.OverallCount = advisees[0].OverallCount;
            }
            return adviseesListViewModel;
        }

        /// <summary>
        /// Converts to AdviseeSearchOptionViewModel.
        /// </summary>
        /// <param name="optionsDTO">The options dto.</param>
        /// <returns></returns>
        internal static AdviseeSearchOptionViewModel ToViewModel(this List<AdviseeSearchOptions> optionsDTO)
        {
            AdviseeSearchOptionViewModel adviseeSearchOption = new();
            if (optionsDTO?.Count > 0)
            {
                foreach (AdviseeSearchOptions searchOption in optionsDTO)
                {
                    switch (searchOption.OptionDescription)
                    {
                        case "advisors":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Advisors.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "campus":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Campus.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "classLevels":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.ClassLevels.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "classyears":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.ClassYears.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "colleges":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Colleges.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "curriculums":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Curriculums.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "degrees":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Degrees.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "departments":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Departments.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "events":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Events.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "programs":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Programs.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "sections":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Sections.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "sessions":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Sessions.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "fullTimePart":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.Status.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "yearterms":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.YearTerms.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;

                        case "subtypes":
                            foreach (AdviseeSearchOption searchOptionItem in searchOption.Options)
                                adviseeSearchOption.SubTypes.Add(new ListOptionViewModel { Value = searchOptionItem.Id, Description = searchOptionItem.Description });
                            break;
                    }
                }
            }
            return adviseeSearchOption;
        }

        /// <summary>
        /// Converts to AdviseeSharedViewModel List View Model.
        /// </summary>
        /// <param name="sharedAdvisees">The shared advisees.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <param name="showStudentPicture">if set to <c>true</c> [show student picture].</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static AdviseesSharedViewModel ToViewModel(this List<StudentShared> sharedAdvisees, string nameFormat, string nameSort,
             IPeopleService peopleService, string peopleFormat, bool showStudentPicture, bool showMiddleNameInitial, IPictureHelper pictureHelper)
        {
            AdviseesSharedViewModel adviseesSharedViewModel = new();
            if (sharedAdvisees?.Count > 0)
            {
                List<AdviseeSharedViewModel> adviseesShared = new();
                foreach (StudentShared student in sharedAdvisees)
                {
                    AdviseeSharedViewModel adviseeSharedViewModel = new(student.ToViewModel(nameFormat, nameSort, peopleFormat, showMiddleNameInitial))
                    {
                        Email = student.Email,
                        HasPicture =
                            showStudentPicture && student.HasPicture && pictureHelper.GetPictureAsync(peopleService.GetPicture(student.PersonId)) != null,
                    };
                    adviseesShared.Add(adviseeSharedViewModel);
                }
                adviseesSharedViewModel.Advisees = adviseesShared;
                adviseesSharedViewModel.OverallCount = sharedAdvisees[0].OverallCount;
            }

            return adviseesSharedViewModel;
        }

        /// <summary>
        /// Converts the list of SharedAdvisee to list of AvatarViewModel
        /// </summary>
        /// <param name="sharedAdvisees">The shared advisees.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <param name="showPicture">if set to <c>true</c> [show picture].</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static List<AdvisorViewModel> ToViewModel(this List<SharedAdvisee> sharedAdvisees, string nameFormat, string nameSort,
            IPeopleService peopleService, string peopleFormat, bool showPicture, bool showMiddleNameInitial, IPictureHelper pictureHelper)
        {
            List<AdvisorViewModel> advisorsViewModel = null;
            if (sharedAdvisees?.Count > 0)
            {
                advisorsViewModel = new();
                List<People> peopleList = new();
                Dictionary<int, int> sharedAdviseeAdvisors = new();
                foreach (SharedAdvisee sharedAdvisee in sharedAdvisees)
                {
                    peopleList.Add(GetPeople(sharedAdvisee.Advisor.Name, sharedAdvisee.Advisor.PersonId, sharedAdvisee.Advisor.PeopleCodeId));
                    sharedAdviseeAdvisors.Add(sharedAdvisee.Advisor.PersonId, sharedAdvisee.Id);
                }

                List<People> peopleListSorted = FormatHelper.GetSortedList(peopleList.Cast<object>(), nameSort).Cast<People>().ToList();
                foreach (People people in peopleListSorted)
                {
                    AvatarViewModel avatarViewModel = people.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);

                    advisorsViewModel.Add(new()
                    {
                        ColorFirstLetter = avatarViewModel.ColorFirstLetter,
                        FirstLetter = avatarViewModel.FirstLetter,
                        FullName = avatarViewModel.FullName,
                        HasPicture = showPicture && pictureHelper.GetPictureAsync(peopleService.GetPicture(people.PersonId.Value)) != null,
                        PeopleId = FormatHelper.ToPeopleId(avatarViewModel.PeopleId, peopleFormat),
                        PersonId = avatarViewModel.PersonId,
                        SharedAdviseeId = people.PersonId != null ? sharedAdviseeAdvisors[people.PersonId.Value] : 0
                    });
                }
            }
            return advisorsViewModel;

            #region Private Methods
        }

        /// <summary>
        /// Gets the courses for session.
        /// </summary>
        /// <param name="sessionCode">The session code.</param>
        /// <param name="adviseeAttendancesDTO">The advisee attendances dto.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <param name="formatProvider">The format provider.</param>
        /// <returns></returns>
        private static List<AttendanceCourseViewModel> GetCoursesForSession(string sessionCode, List<AdviseeAttendance> adviseeAttendancesDTO,
            CultureInfo datetimeCulture, IFormatProvider formatProvider)
        {
            List<AdviseeAttendance> adviseeAttendances = new();
            List<AttendanceCourseViewModel> attendanceCoursesViewModel = new();
            adviseeAttendances = adviseeAttendancesDTO.FindAll(x => x.SessionCode == sessionCode).ToList();
            foreach (AdviseeAttendance adviseeAttendance in adviseeAttendances)
            {
                attendanceCoursesViewModel.Add(new()
                {
                    ExcusedAbsences = adviseeAttendance.ExcusedAbsences == null ? "0" : FormatHelper.ToNumber(adviseeAttendance.ExcusedAbsences.Value, formatProvider),
                    ExcusedTardiness = adviseeAttendance.ExcusedTardy == null ? "0" : FormatHelper.ToNumber(adviseeAttendance.ExcusedTardy.Value, formatProvider),
                    HasLowAttendance = adviseeAttendance.HasLowAttendance,
                    LastDateAttended = FormatHelper.ToShortDate(adviseeAttendance.LastAttendDate, datetimeCulture),
                    OverallAttendance = adviseeAttendance.OverallAttendanceDesc,
                    Present = FormatHelper.ToNumber(adviseeAttendance.Present, formatProvider),
                    Section = adviseeAttendance.Section,
                    SectionCreditType = adviseeAttendance.SectionCreditType,
                    SectionEventId = adviseeAttendance.EventId,
                    SectionEventSubType = adviseeAttendance.EventSubType,
                    SectionId = adviseeAttendance.SectionId,
                    SectionLongName = adviseeAttendance.SectionLongName,
                    SectionType = adviseeAttendance.SectionType,
                    TranscriptDetailId = adviseeAttendance.TranscriptDetailId,
                    UnexcusedAbsences = adviseeAttendance.UnexcusedAbsences == null ? "0" : FormatHelper.ToNumber(adviseeAttendance.UnexcusedAbsences.Value, formatProvider),
                    UnexcusedTardiness = adviseeAttendance.UnexcusedTardy == null ? "0" : FormatHelper.ToNumber(adviseeAttendance.UnexcusedTardy.Value, formatProvider)
                });
            }
            return attendanceCoursesViewModel;
        }

        /// <summary>
        /// Gets the people.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="personId">The person identifier.</param>
        /// <param name="peopleCodeId">The people code identifier.</param>
        /// <returns></returns>
        private static People GetPeople(PeopleName name, int personId, string peopleCodeId) => new()
        {
            DisplayName = name.DisplayName,
            FirstName = name.FirstName,
            LastName = name.LastName,
            LastNamePrefix = name.LastName,
            MiddleName = name.MiddleName,
            PeopleCodeId = peopleCodeId,
            PersonId = personId,
            Prefix = name.Prefix,
            Pronoun = name.Pronoun,
            Suffix = name.Suffix
        };

        #endregion Private Methods
    }
}