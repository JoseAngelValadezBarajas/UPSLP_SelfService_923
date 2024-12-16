// --------------------------------------------------------------------
// <copyright file="SectionEnrollmentMapper.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Classes;
using SelfService.Models.Shared;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// Class SectionEnrollmentMapper.
    /// </summary>
    internal static class SectionEnrollmentMapper
    {
        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sectionEnrollmentDTO">The section enrollment dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="mail">The mail.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="showPicture">if set to <c>true</c> [show picture].</param>
        /// <param name="isReport">if set to <c>true</c> [is report].</param>
        /// <returns>
        /// ClassListViewModel.
        /// </returns>
        internal static SectionEnrollmentViewModel ToClassListViewModel(this SectionEnrollment sectionEnrollmentDTO, string nameFormat, string nameSort
            , InstitutionSettings.General general, InstitutionSettings.Mail mail, bool showMiddleNameInitial, IPeopleService peopleService, IPictureHelper pictureHelper
            , bool showPicture = false, bool isReport = false
           )
        {
            SectionEnrollmentViewModel sectionEnrollment = new();
            StudentClassListViewModel studentClassListViewModel = null;
            if (sectionEnrollmentDTO != null)
            {
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                sectionEnrollment.Students = new List<StudentClassListViewModel>();
                sectionEnrollmentDTO.Students = FormatHelper.GetSortedList(sectionEnrollmentDTO.Students.Cast<object>(), nameSort).Cast<StudentEnrollment>().ToList();
                foreach (StudentEnrollment studentDTO in sectionEnrollmentDTO.Students)
                {
                    studentClassListViewModel = new StudentClassListViewModel(ToStudentClassListViewModel(studentDTO, nameFormat, nameSort, general, showMiddleNameInitial))
                    {
                        HasPicture = pictureHelper.GetPictureAsync(peopleService.GetPicture(studentDTO.PersonId.Value)) != null,
                        StatusCode = studentDTO.EnrolledStatus
                    };
                    if (studentDTO.StudentAcademicRecords?.Count > 0)
                        studentClassListViewModel.StudentAcademicRecords = GetAcademicRecords(studentDTO.StudentAcademicRecords);
                    sectionEnrollment.Students.Add(studentClassListViewModel);
                    if (isReport)
                    {
                        if (studentClassListViewModel.StudentAcademicRecords?.Count > 0)
                        {
                            // Get ClassLevels for print report
                            IEnumerable<string> classLevels = studentClassListViewModel.StudentAcademicRecords?.Where(s => !string.IsNullOrEmpty(s.ClassLevel)).Select(s => s.ClassLevel);
                            if (classLevels.Any())
                                studentClassListViewModel.ClassLevelReport = string.Join("\n", classLevels);
                            // Get ClassLoads for print report
                            IEnumerable<string> classLoads = studentClassListViewModel.StudentAcademicRecords?.Where(s => !string.IsNullOrEmpty(s.ClassLoad)).Select(s => s.ClassLoad);
                            if (classLoads.Any())
                                studentClassListViewModel.ClassLoadReport = string.Join("\n", classLoads);
                            // Get PDCDescriptions for print report
                            IEnumerable<string> pdcDescriptions = studentClassListViewModel.StudentAcademicRecords?.Where(s => !string.IsNullOrEmpty(s.PDCDescription)).Select(s => s.PDCDescription);
                            if (pdcDescriptions.Any())
                                studentClassListViewModel.PDCReport = string.Join("\n", pdcDescriptions);
                        }
                        if (showPicture && studentClassListViewModel.HasPicture)
                            studentClassListViewModel.AvatarReport = pictureHelper.ToBase64(peopleService.GetPicture(studentDTO.PersonId.Value));
                    }
                }
                if (sectionEnrollmentDTO.Totals != null)
                {
                    sectionEnrollment.StudentCount = FormatHelper.ToNumber(sectionEnrollmentDTO.Totals.StudentCount, formatProvider);
                    sectionEnrollment.TotalCeu = FormatHelper.ToCredits(sectionEnrollmentDTO.Totals.CeuTotal, general.Credits);
                    sectionEnrollment.TotalCredits = FormatHelper.ToCredits(sectionEnrollmentDTO.Totals.CreditTotal, general.Credits);
                }
                sectionEnrollment.EmailSettings = new EmailSettingsViewModel
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
            }
            return sectionEnrollment;
        }

        /// <summary>
        /// To the permission request view model.
        /// </summary>
        /// <param name="sectionPermissionRequestDTO">The section permission request dto.</param>
        /// <param name="idFaculty">The identifier faculty.</param>
        /// <param name="prerequisites">The prerequisites.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="mail">The mail.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns>
        /// PermissionRequestViewModel
        /// </returns>
        internal static PermissionRequestViewModel ToViewModel(this List<StudentPermissionRequest> sectionPermissionRequestDTO,
            string idFaculty, string prerequisites, string nameFormat, string nameSort, InstitutionSettings.General general,
            InstitutionSettings.Mail mail, bool showMiddleNameInitial, string dateTimeCultureFormat)
        {
            PermissionRequestViewModel permissionRequest = new()
            {
                Prerequisites = prerequisites
            };
            if (sectionPermissionRequestDTO?.Count > 0)
            {
                permissionRequest.Students = new List<StudentPermissionRequestViewModel>();
                StudentPermissionRequestViewModel studentViewModel = null;
                sectionPermissionRequestDTO = FormatHelper.GetSortedList(sectionPermissionRequestDTO.Cast<object>(), nameSort).Cast<StudentPermissionRequest>().ToList();
                PermissionRequestInfoViewModel permissionRequestFaculty = null;
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);
                foreach (StudentPermissionRequest student in sectionPermissionRequestDTO)
                {
                    AvatarViewModel peopleAvatar = student.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                    studentViewModel = new StudentPermissionRequestViewModel
                    {
                        ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                        EmailAddress = student.EmailAddress,
                        FirstLetter = peopleAvatar.FirstLetter,
                        FullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(
                            new People
                            {
                                Prefix = student.Prefix,
                                DisplayName = student.DisplayName,
                                FirstName = student.FirstName,
                                MiddleName = student.MiddleName,
                                LastName = student.LastName,
                                LastNamePrefix = student.LastNamePrefix,
                                Suffix = student.Suffix,
                                Pronoun = student.Pronoun
                            })), nameFormat, showMiddleNameInitial),
                        HasPicture = student.HasPicture,
                        PeopleId = FormatHelper.ToPeopleId(student.IdNumber, general.PeopleIdFormat),
                        PersonId = student.PersonId,
                        PermissionRequestInfo = student.PermissionRequestInfo.ToViewModel(nameFormat, nameSort, datetimeCulture, showMiddleNameInitial),
                        StatusPermisionRequest = -1,
                        HasOverride = false,
                    };

                    // Set the last chat for the faculty
                    permissionRequestFaculty =
                        studentViewModel.PermissionRequestInfo.Find(pri => pri.FacultyInfo.PersonId.ToString() == idFaculty);
                    if (permissionRequestFaculty != null)
                    {
                        studentViewModel.PermissionRequestInfo.Remove(permissionRequestFaculty);
                        studentViewModel.PermissionRequestInfo.Insert(0, permissionRequestFaculty);
                        permissionRequestFaculty.IsMyInfo = true;
                        studentViewModel.StatusPermisionRequest = permissionRequestFaculty.StatusPermisionRequest;
                        studentViewModel.HasOverride = !string.IsNullOrEmpty(permissionRequestFaculty.OverrideDate);
                    }
                    if (student.StudentAcademicRecords?.Count > 0)
                        studentViewModel.StudentAcademicRecords = GetAcademicRecords(student.StudentAcademicRecords);
                    permissionRequest.Students.Add(studentViewModel);
                }
                permissionRequest.EmailSettings = new EmailSettingsViewModel
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
            }
            return permissionRequest;
        }

        /// <summary>
        /// To the StudentEnrollmentDownload list.
        /// </summary>
        /// <param name="sectionEnrollmentViewModel">The section enrollment view model.</param>
        /// <returns></returns>
        internal static List<StudentEnrollmentDownload> ToViewModel(this SectionEnrollmentViewModel sectionEnrollmentViewModel)
        {
            List<StudentEnrollmentDownload> sectionEnrollmentDownloadList = new();
            if (sectionEnrollmentViewModel?.Students?.Count > 0)
            {
                foreach (StudentClassListViewModel studentViewModel in sectionEnrollmentViewModel.Students)
                {
                    if (studentViewModel.StudentAcademicRecords != null)
                    {
                        foreach (StudentAcademicRecordViewModel academicRecordViewModel in studentViewModel.StudentAcademicRecords)
                        {
                            sectionEnrollmentDownloadList.Add(new StudentEnrollmentDownload
                            {
                                FullName = studentViewModel.FullName,
                                PeopleId = studentViewModel.PeopleId,
                                Email = studentViewModel.EmailAddress,
                                Curriculum = academicRecordViewModel?.PDCDescription,
                                ClassLevel = academicRecordViewModel?.ClassLevel,
                                ClassLoad = academicRecordViewModel?.ClassLoad,
                                CreditType = studentViewModel.CreditType,
                                Credits = studentViewModel.Credits,
                                Attendance = studentViewModel.Attendance,
                                Status = studentViewModel.StatusCode,
                                Withdrawn = studentViewModel.Withdrawn
                            });
                        }
                    }
                    else
                    {
                        sectionEnrollmentDownloadList.Add(new StudentEnrollmentDownload
                        {
                            FullName = studentViewModel.FullName,
                            PeopleId = studentViewModel.PeopleId,
                            Email = studentViewModel.EmailAddress,
                            Curriculum = string.Empty,
                            ClassLevel = string.Empty,
                            ClassLoad = string.Empty,
                            CreditType = studentViewModel.CreditType,
                            Credits = studentViewModel.Credits,
                            Attendance = studentViewModel.Attendance,
                            Status = studentViewModel.StatusCode
                        });
                    }
                }
            }
            return sectionEnrollmentDownloadList;
        }

        /// <summary>
        /// To the waitlist view model.
        /// </summary>
        /// <param name="sectionWaitlistDTO">The section waitlist dto.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="sectionService">The section service.</param>
        /// <returns>
        /// WaitlistViewModel.
        /// </returns>
        internal static WaitlistViewModel ToWaitlistViewModel(this SectionWaitlist sectionWaitlistDTO, int sectionId,
            IInstitutionSettingService institutionSettingService, string nameFormat, string nameSort, bool showMiddleNameInitial, ISectionService sectionService)
        {
            InstitutionSettings.General generalSettings = institutionSettingService.GetGeneral();
            InstitutionSettings.Mail mail = institutionSettingService.GetMail();
            WaitlistViewModel waitlist = new();
            StudentWaitlistViewModel studentWaitlistViewModel;
            SectionDetail sectionDetail = sectionService.GetDetail(sectionId);
            bool allowChange = !sectionDetail.IsConEd && institutionSettingService.GetCourseManagement().InstructorChangeOfWaitlist;
            bool isEditable = sectionService.AllowUpdateOfWaitlist(sectionId, allowChange);

            if (sectionWaitlistDTO != null)
            {
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(generalSettings.NumberCulture);
                waitlist.AllowSave = allowChange;
                waitlist.Students = new List<StudentWaitlistViewModel>();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(generalSettings.DateTimeCulture);
                foreach (StudentWaitlist studentDTO in sectionWaitlistDTO.Students.OrderBy(x => x.WaitlistRank))
                {
                    studentWaitlistViewModel = new StudentWaitlistViewModel(ToStudentWaitListViewModel(studentDTO, nameFormat, nameSort, generalSettings,
                        datetimeCulture, showMiddleNameInitial))
                    {
                        HasPicture = studentDTO.HasPicture,
                        IsEditable = studentDTO.WaitlistStatus == "W" && isEditable,
                        StatusCode = studentDTO.WaitlistStatus
                    };
                    if (studentDTO.StudentAcademicRecords?.Count > 0)
                        studentWaitlistViewModel.StudentAcademicRecords = GetAcademicRecords(studentDTO.StudentAcademicRecords);
                    waitlist.Students.Add(studentWaitlistViewModel);
                }
                if (sectionWaitlistDTO.Totals != null)
                {
                    waitlist.StudentCount = FormatHelper.ToNumber(sectionWaitlistDTO.Totals.StudentCount, formatProvider);
                    waitlist.TotalCeu = FormatHelper.ToCredits(sectionWaitlistDTO.Totals.CeuTotal, generalSettings.Credits);
                    waitlist.TotalCredits = FormatHelper.ToCredits(sectionWaitlistDTO.Totals.CreditTotal, generalSettings.Credits);
                }
                waitlist.EmailSettings = new EmailSettingsViewModel
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
            }
            return waitlist;
        }

        #region Private Methods

        /// <summary>
        /// Gets the academic records.
        /// </summary>
        /// <param name="studentAcademicRecordsDTO">The student academic records dto.</param>
        /// <returns>
        /// List&lt;StudentAcademicRecordViewModel&gt;.
        /// </returns>
        private static List<StudentAcademicRecordViewModel> GetAcademicRecords(List<StudentAcademicRecord> studentAcademicRecordsDTO)
        {
            List<StudentAcademicRecordViewModel> studentAcademicRecords = new();
            foreach (StudentAcademicRecord academicRecordDTO in studentAcademicRecordsDTO)
            {
                studentAcademicRecords.Add(new StudentAcademicRecordViewModel
                {
                    PDCDescription = $"{academicRecordDTO.Program}/{academicRecordDTO.Degree}/{academicRecordDTO.Curriculum}",
                    ClassLevel = academicRecordDTO.ClassLevel,
                    ClassLoad = academicRecordDTO.ClassLoad
                });
            }
            return studentAcademicRecords;
        }

        /// <summary>
        /// To the student class ListView model.
        /// </summary>
        /// <param name="studentDTO">The student dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns>
        /// StudentClassListViewModel.
        /// </returns>
        private static StudentClassListViewModel ToStudentClassListViewModel(StudentEnrollment studentDTO, string nameFormat,
            string nameSort, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            AvatarViewModel peopleAvatar = studentDTO.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
            return new StudentClassListViewModel
            {
                FullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(
                    new People
                    {
                        Prefix = studentDTO.Prefix,
                        DisplayName = studentDTO.DisplayName,
                        FirstName = studentDTO.FirstName,
                        MiddleName = studentDTO.MiddleName,
                        LastName = studentDTO.LastName,
                        LastNamePrefix = studentDTO.LastNamePrefix,
                        Suffix = studentDTO.Suffix,
                        Pronoun = studentDTO.Pronoun
                    })), nameFormat, showMiddleNameInitial),
                Attendance = studentDTO.AttendanceStatus,
                ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                CreditType = studentDTO.CreditType,
                Credits = FormatHelper.ToCredits(studentDTO.Credits, general.Credits),
                EmailAddress = studentDTO.EmailAddress,
                FirstLetter = peopleAvatar.FirstLetter,
                PersonId = studentDTO.PersonId,
                PeopleId = FormatHelper.ToPeopleId(studentDTO.IdNumber, general.PeopleIdFormat),
                Withdrawn = studentDTO.Withdrawn
            };
        }

        /// <summary>
        /// To the student wait ListView model.
        /// </summary>
        /// <param name="studentDTO">The student dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns>
        /// StudentWaitlistViewModel.
        /// </returns>
        private static StudentWaitlistViewModel ToStudentWaitListViewModel(StudentWaitlist studentDTO, string nameFormat, string nameSort,
            InstitutionSettings.General general, CultureInfo datetimeCulture, bool showMiddleNameInitial)
        {
            AvatarViewModel peopleAvatar = studentDTO.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
            return new StudentWaitlistViewModel
            {
                FullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(
                    new People
                    {
                        Prefix = studentDTO.Prefix,
                        DisplayName = studentDTO.DisplayName,
                        FirstName = studentDTO.FirstName,
                        MiddleName = studentDTO.MiddleName,
                        LastName = studentDTO.LastName,
                        LastNamePrefix = studentDTO.LastNamePrefix,
                        Suffix = studentDTO.Suffix,
                        Pronoun = studentDTO.Pronoun
                    })), nameFormat, showMiddleNameInitial),
                Attempts = $"{studentDTO.WaitlistPendingAttempts.ToString()}/{studentDTO.WaitlistMaxAttempts.ToString()}",
                ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                CreditType = studentDTO.CreditType,
                Credits = FormatHelper.ToCredits(studentDTO.Credits, general.Credits),
                DateAdded = FormatHelper.ToShortDate(studentDTO.WaitlistAddDate, datetimeCulture),
                EmailAddress = studentDTO.EmailAddress,
                FirstLetter = peopleAvatar.FirstLetter,
                PersonId = studentDTO.PersonId,
                PeopleId = FormatHelper.ToPeopleId(studentDTO.IdNumber, general.PeopleIdFormat),
                Rank = (studentDTO.WaitlistRank == "0" && studentDTO.WaitlistStatus == "P") ? "P" : studentDTO.WaitlistRank,
            };
        }

        #endregion Private Methods
    }
}