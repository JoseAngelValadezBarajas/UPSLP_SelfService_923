// --------------------------------------------------------------------
// <copyright file="FacultyAssistantMapper.cs" company="Ellucian">
//     Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Helpers.Interfaces;
using SelfService.Models.FacultyAssistants;
using SelfService.Models.Shared;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// FacultyAssistantMapper
    /// </summary>
    internal static class FacultyAssistantMapper
    {
        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="facultyAssistantDetails">The faculty assistant details.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static List<FacultyAssistantDetailViewModel> ToViewModel(this List<FacultyAssistantDetail> facultyAssistantDetails, IPeopleService peopleService, string nameFormat, string nameSort
            , InstitutionSettings.General general, bool showMiddleNameInitial, IPictureHelper pictureHelper)
        {
            List<FacultyAssistantDetailViewModel> facultyAssistantDetailViewModels = new();
            if (facultyAssistantDetails == null)
                return facultyAssistantDetailViewModels;
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            FacultyAssistantDetailViewModel facultyAssistantDetailViewModel = null;

            List<People> facultySortedList = new();
            foreach (FacultyAssistantDetail item in facultyAssistantDetails)
                facultySortedList.Add(item.PeopleFacultyAssistant);
            facultySortedList = FormatHelper.GetSortedList(facultySortedList.Cast<object>(), nameSort).Cast<People>().ToList();

            FacultyAssistantDetail facultyAssistantDetail;
            foreach (People people in facultySortedList)
            {
                facultyAssistantDetail = facultyAssistantDetails.Find(faculty => faculty.PeopleFacultyAssistant == people);
                if (facultyAssistantDetail != null)
                {
                    AvatarViewModel avatar = facultyAssistantDetail.PeopleFacultyAssistant.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                    facultyAssistantDetailViewModel = new FacultyAssistantDetailViewModel
                    {
                        Assistant = new AvatarViewModel
                        {
                            ColorFirstLetter = avatar.ColorFirstLetter,
                            FirstLetter = avatar.FirstLetter,
                            FullName = avatar.FullName,
                            HasPicture = pictureHelper.GetPictureAsync(peopleService.GetPicture(facultyAssistantDetail.PeopleFacultyAssistant.PersonId.Value)) != null,
                            PeopleId = FormatHelper.ToPeopleId(facultyAssistantDetail.PeopleFacultyAssistant.PeopleId, general.PeopleIdFormat),
                            PersonId = facultyAssistantDetail.AssistantId
                        },
                        AssistantId = facultyAssistantDetail.AssistantId,
                        CanAccessActivityGrades = facultyAssistantDetail.CanAccessActivityGrades,
                        CanAccessAttendance = facultyAssistantDetail.CanAccessAttendance,
                        CanAccessClassList = facultyAssistantDetail.CanAccessClassList,
                        CanAccessDashboardNotes = facultyAssistantDetail.CanAccessDashboardNotes,
                        CanAccessOverallGrades = facultyAssistantDetail.CanAccessOverallGrades,
                        CanAccessViolations = facultyAssistantDetail.CanAccessViolations,
                        CanAccessWaitlist = facultyAssistantDetail.CanAccessWaitlist,
                        CanSetupActivities = facultyAssistantDetail.CanSetupActivities,
                        CanSetupGradeMappings = facultyAssistantDetail.CanSetupGradeMappings,
                        CanSubmitOverallGrades = facultyAssistantDetail.CanSubmitOverallGrades,
                        CanTakeDailyAttendance = facultyAssistantDetail.CanTakeDailyAttendance,
                        CreateDate = FormatHelper.ToShortDate(facultyAssistantDetail.CreateDate, datetimeCulture),
                        Email = facultyAssistantDetail.Email,
                        IsWithdrawn = facultyAssistantDetail.IsWithdrawn,
                        FacultyAssistantId = facultyAssistantDetail.FacultyAssistantId,
                        RevisionDate = FormatHelper.ToShortDate(facultyAssistantDetail.RevisionDate, datetimeCulture)
                    };
                    facultyAssistantDetailViewModels.Add(facultyAssistantDetailViewModel);
                }
            }
            return facultyAssistantDetailViewModels;
        }
    }
}