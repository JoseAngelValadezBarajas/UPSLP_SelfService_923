// --------------------------------------------------------------------
// <copyright file="ChecklistMapper.cs" company="Ellucian">
//     Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Checklist;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    internal static class ChecklistMapper
    {
        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="checklistDetails">The checklist details.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<ChecklistTasksViewModel> ToViewModel(this List<ChecklistDetail> checklistDetails, InstitutionSettings.General general)
        {
            List<ChecklistTasksViewModel> checklistsViewModels = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            if (checklistDetails?.Count > 0)
            {
                IEnumerable<IGrouping<string, ChecklistDetail>> groupsOffice = checklistDetails.GroupBy(x => x.OfficeDesc).ToList();
                string officeDesc = string.Empty;
                int officeId;
                foreach (IGrouping<string, ChecklistDetail> checklistDetail in groupsOffice)
                {
                    officeDesc = checklistDetails.Find(x => x.OfficeDesc == checklistDetail.Key).OfficeDesc;
                    officeId = checklistDetails.Find(x => x.OfficeDesc == checklistDetail.Key).OfficeId;
                    checklistsViewModels.Add(new ChecklistTasksViewModel
                    {
                        OfficeDesc = officeDesc,
                        OfficeId = officeId,
                        Actions = GetActionsForOffice(checklistDetail.Key, checklistDetails, datetimeCulture)
                    });
                }
            }
            return checklistsViewModels;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="checklistMyTaskDTO">The checklist my task dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<ChecklistMyTasksViewModel> ToViewModel(this List<ChecklistMyTask> checklistMyTaskDTO, string nameFormat,
            string nameSort, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            List<ChecklistMyTasksViewModel> checklistsViewModels = new();
            if (checklistMyTaskDTO?.Count > 0)
            {
                IEnumerable<IGrouping<int, ChecklistMyTask>> groupsCategory = checklistMyTaskDTO.GroupBy(x => x.Category.Value).ToList();
                int category = 0;
                foreach (IGrouping<int, ChecklistMyTask> checklisMyTask in groupsCategory)
                {
                    category = checklistMyTaskDTO.Find(x => x.Category == checklisMyTask.Key).Category.Value;
                    checklistsViewModels.Add(new ChecklistMyTasksViewModel
                    {
                        Category = category,
                        MyTasks = GetMyTask(checklisMyTask.Key, checklistMyTaskDTO, nameFormat, nameSort, general, showMiddleNameInitial)
                    });
                }
            }
            return checklistsViewModels;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="checklistMyTaskDTO">The checklist my task dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static ChecklistMyTaskViewModel ToViewModel(this ChecklistMyTask checklistMyTaskDTO, string nameFormat,
            string nameSort, bool showMiddleNameInitial, InstitutionSettings.General general)
        {
            ChecklistMyTaskViewModel checklistsDetailViewModels = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            checklistsDetailViewModels.AcademicSession = checklistMyTaskDTO.AcademicSession;
            checklistsDetailViewModels.AcademicTerm = checklistMyTaskDTO.AcademicTerm;
            checklistsDetailViewModels.AcademicYear = checklistMyTaskDTO.AcademicYear;
            checklistsDetailViewModels.ActionName = checklistMyTaskDTO.ActionName;
            checklistsDetailViewModels.ActionScheduledId = checklistMyTaskDTO.ActionScheduleId;
            checklistsDetailViewModels.AddressLine1 = checklistMyTaskDTO.People.Address.AddressLine1;
            checklistsDetailViewModels.AddressLine2 = checklistMyTaskDTO.People.Address.AddressLine2;
            checklistsDetailViewModels.AddressLine3 = checklistMyTaskDTO.People.Address.AddressLine3;
            checklistsDetailViewModels.AddressLine4 = checklistMyTaskDTO.People.Address.AddressLine4;
            checklistsDetailViewModels.AssignedDate = checklistMyTaskDTO.AssignedDate.HasValue ? FormatHelper.ToShortDate(checklistMyTaskDTO.AssignedDate.Value, datetimeCulture) : string.Empty;
            checklistsDetailViewModels.AssignedTime = checklistMyTaskDTO.AssignedTime.HasValue ? FormatHelper.ToShortTime(checklistMyTaskDTO.AssignedTime.Value, datetimeCulture) : string.Empty;
            checklistsDetailViewModels.Avatar = checklistMyTaskDTO.People.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
            checklistsDetailViewModels.AvatarCompleted = checklistMyTaskDTO.PeopleCompleted.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
            checklistsDetailViewModels.AvatarResp = checklistMyTaskDTO.PeopleResp.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
            checklistsDetailViewModels.Canceled = checklistMyTaskDTO.Canceled;
            checklistsDetailViewModels.CancelReason = checklistMyTaskDTO.CancelReason;
            checklistsDetailViewModels.City = checklistMyTaskDTO.People.Address.City;
            checklistsDetailViewModels.Completed = checklistMyTaskDTO.Completed;
            checklistsDetailViewModels.CompletedDate = FormatHelper.ToShortDate(checklistMyTaskDTO.CompletedDate, datetimeCulture);
            checklistsDetailViewModels.Country = checklistMyTaskDTO.People.Address.Country;
            checklistsDetailViewModels.Email = checklistMyTaskDTO.Email;
            checklistsDetailViewModels.HouseNumber = checklistMyTaskDTO.People.Address.HouseNumber;
            checklistsDetailViewModels.Instruction = checklistMyTaskDTO.Instruction;
            checklistsDetailViewModels.Notes = checklistMyTaskDTO.Note;
            checklistsDetailViewModels.OfficeDesc = checklistMyTaskDTO.OfficeDesc;
            checklistsDetailViewModels.PeopleCodeId = !string.IsNullOrEmpty(checklistMyTaskDTO.PeopleCodeId) ?
                                                      FormatHelper.ToPeopleId(checklistMyTaskDTO.PeopleCodeId.Substring(1, checklistMyTaskDTO.PeopleCodeId.Length - 1), general.PeopleIdFormat)
                                                      : string.Empty;
            checklistsDetailViewModels.PeopleOrgCodeId = !string.IsNullOrEmpty(checklistMyTaskDTO.PeopleOrgCodeId) ?
                                                         FormatHelper.ToPeopleId(checklistMyTaskDTO.PeopleOrgCodeId.Substring(1, checklistMyTaskDTO.PeopleOrgCodeId.Length - 1), general.PeopleIdFormat)
                                                         : string.Empty;
            checklistsDetailViewModels.PhoneFormat = checklistMyTaskDTO.PhoneFormat;
            checklistsDetailViewModels.PhoneNumber = checklistMyTaskDTO.PhoneNumber;
            checklistsDetailViewModels.Priority = checklistMyTaskDTO.Priority;
            checklistsDetailViewModels.Required = checklistMyTaskDTO.Required;
            checklistsDetailViewModels.ScheduleDate = checklistMyTaskDTO.ScheduleDate.HasValue ? FormatHelper.ToShortDate(checklistMyTaskDTO.ScheduleDate.Value, datetimeCulture) : string.Empty;
            checklistsDetailViewModels.ScheduleTime = checklistMyTaskDTO.ScheduleTime.HasValue ? FormatHelper.ToShortTime(checklistMyTaskDTO.ScheduleTime.Value, datetimeCulture) : string.Empty;
            checklistsDetailViewModels.State = checklistMyTaskDTO.People.Address.State;
            checklistsDetailViewModels.Waived = checklistMyTaskDTO.Waived;
            checklistsDetailViewModels.WaivedReason = checklistMyTaskDTO.WaiveReason;
            checklistsDetailViewModels.ZipCode = checklistMyTaskDTO.People.Address.ZipCode;
            return checklistsDetailViewModels;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="checklist">The checklist detail.</param>
        /// <returns></returns>
        internal static ChecklistViewModel ToViewModel(this Checklist checklist)
        {
            ChecklistViewModel checklistViewModel = null;
            if (checklist?.ChecklistTemplateId > 0)
                checklistViewModel = new()
                {
                    AcademicSession = checklist.AcademicSession,
                    AcademicTerm = checklist.AcademicTerm,
                    AcademicYear = checklist.AcademicYear,
                    ActionId = checklist.ActionId,
                    ChecklistTemplateId = checklist.ChecklistTemplateId,
                    DueDate = FormatHelper.ToDatePicker(checklist.DueDate),
                    DueTime = FormatHelper.ToTimePicker(checklist.DueDate),
                    Instruction = checklist.Instruction,
                    IsActive = checklist.IsActive,
                    IsRequired = checklist.IsRequired,
                    Note = checklist.Note,
                    OfficeId = checklist.OfficeId,
                    OffsetDays = checklist.OffsetDays,
                    Priority = checklist.Priority
                };
            return checklistViewModel;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="checklistDetailsDTO">The checklist details dto.</param>
        /// <returns></returns>
        internal static ChecklistActionViewModel ToViewModel(this ChecklistDetail checklistDetailsDTO)
        {
            ChecklistActionViewModel checklistActionViewModel = new()
            {
                AcademicSession = checklistDetailsDTO.AcademicSession,
                AcademicTerm = checklistDetailsDTO.AcademicTerm,
                AcademicYear = checklistDetailsDTO.AcademicYear,
                ActionId = checklistDetailsDTO.ActionId,
                IsActive = checklistDetailsDTO.IsActive,
                OfficeId = checklistDetailsDTO.OfficeId
            };

            return checklistActionViewModel;
        }

        #region Private

        /// <summary>
        /// Gets the actions for office.
        /// </summary>
        /// <param name="officeDesc">The office desc.</param>
        /// <param name="checklistDetailsDTO">The checklist details dto.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <returns></returns>
        private static List<ChecklistActionViewModel> GetActionsForOffice(string officeDesc, List<ChecklistDetail> checklistDetailsDTO,
        CultureInfo datetimeCulture)
        {
            List<ChecklistDetail> checklistDetails = checklistDetailsDTO.FindAll(x => x.OfficeDesc == officeDesc).ToList();
            List<ChecklistActionViewModel> checklistActionViewModel = new();
            foreach (ChecklistDetail checklistDetail in checklistDetails)
            {
                checklistActionViewModel.Add(new ChecklistActionViewModel
                {
                    AcademicTerm = checklistDetail.AcademicTerm,
                    AcademicYear = checklistDetail.AcademicYear,
                    AcademicSession = checklistDetail.AcademicSession,
                    ActionId = checklistDetail.ActionId,
                    ActionName = checklistDetail.ActionName,
                    IsActive = checklistDetail.IsActive,
                    ChecklistTemplateId = checklistDetail.ChecklistTemplateId,
                    OfficeId = checklistDetail.OfficeId,
                    CreateDate = FormatHelper.ToShortDate(checklistDetail.CreateDatetime, datetimeCulture)
                });
            }
            return checklistActionViewModel;
        }

        /// <summary>
        /// Gets my task.
        /// </summary>
        /// <param name="category">The category.</param>
        /// <param name="checklistDetailsDTO">The checklist details dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        private static List<ChecklistMyTaskViewModel> GetMyTask(int category, List<ChecklistMyTask> checklistDetailsDTO,
            string nameFormat, string nameSort, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            List<ChecklistMyTask> checklistMyTasks = checklistDetailsDTO.FindAll(x => x.Category == category).ToList();
            List<ChecklistMyTaskViewModel> checklistMyTaskViewModel = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            bool isPerDay = false;
            int difference = 0;
            foreach (ChecklistMyTask checklistMyTask in checklistMyTasks)
            {
                difference = Math.Abs(checklistMyTask.HoursDifference.Value);
                isPerDay = difference > 23;
                checklistMyTaskViewModel.Add(new ChecklistMyTaskViewModel
                {
                    AcademicSession = checklistMyTask.AcademicSession,
                    AcademicTerm = checklistMyTask.AcademicTerm,
                    AcademicYear = checklistMyTask.AcademicYear,
                    ActionName = checklistMyTask.ActionName,
                    ActionScheduledId = checklistMyTask.ActionScheduleId,
                    AddressLine1 = checklistMyTask.People.Address.AddressLine1,
                    AddressLine2 = checklistMyTask.People.Address.AddressLine2,
                    AddressLine3 = checklistMyTask.People.Address.AddressLine3,
                    AddressLine4 = checklistMyTask.People.Address.AddressLine4,
                    AssignedDate = checklistMyTask.AssignedDate.HasValue ? FormatHelper.ToShortDate(checklistMyTask.AssignedDate.Value, datetimeCulture) : string.Empty,
                    AssignedTime = checklistMyTask.AssignedTime.HasValue ? FormatHelper.ToShortTime(checklistMyTask.AssignedTime.Value, datetimeCulture) : string.Empty,
                    Avatar = checklistMyTask.People.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                    AvatarResp = checklistMyTask.PeopleResp.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                    CanViewDetails = checklistMyTask.CanViewDetails,
                    CanEditTasks = checklistMyTask.CanEditTasks,
                    CanViewNotes = checklistMyTask.CanViewNotes,
                    Canceled = checklistMyTask.Canceled,
                    City = checklistMyTask.People.Address.City,
                    Completed = checklistMyTask.Completed,
                    Country = checklistMyTask.People.Address.Country,
                    Difference = isPerDay ? difference / 24 : difference,
                    Email = checklistMyTask.Email,
                    HouseNumber = checklistMyTask.People.Address.HouseNumber,
                    Instruction = checklistMyTask.Instruction,
                    IsPerDay = isPerDay,
                    Notes = checklistMyTask.Note,
                    OfficeDesc = checklistMyTask.OfficeDesc,
                    PersonId = checklistMyTask.PersonId,
                    PeopleCodeId = !string.IsNullOrEmpty(checklistMyTask.PeopleCodeId) ?
                                   FormatHelper.ToPeopleId(checklistMyTask.PeopleCodeId.Substring(1, checklistMyTask.PeopleCodeId.Length - 1), general.PeopleIdFormat) : string.Empty,
                    PeopleOrgCodeId = !string.IsNullOrEmpty(checklistMyTask.PeopleOrgCodeId) ?
                                   FormatHelper.ToPeopleId(checklistMyTask.PeopleOrgCodeId.Substring(1, checklistMyTask.PeopleOrgCodeId.Length - 1), general.PeopleIdFormat) : string.Empty,
                    PhoneFormat = checklistMyTask.PhoneFormat,
                    PhoneNumber = checklistMyTask.PhoneNumber,
                    Priority = checklistMyTask.Priority,
                    Required = checklistMyTask.Required,
                    ScheduleDate = checklistMyTask.ScheduleDate.HasValue ? FormatHelper.ToDatePicker(checklistMyTask.ScheduleDate.Value) : string.Empty,
                    ScheduleTime = checklistMyTask.ScheduleTime.HasValue ? FormatHelper.ToTimePicker(checklistMyTask.ScheduleTime.Value) : string.Empty,
                    State = checklistMyTask.People.Address.State,
                    Waived = checklistMyTask.Waived,
                    ZipCode = checklistMyTask.People.Address.ZipCode
                });
            }
            return checklistMyTaskViewModel;
        }

        #endregion Private
    }
}