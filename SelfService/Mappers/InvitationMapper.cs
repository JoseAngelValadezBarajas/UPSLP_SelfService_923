// --------------------------------------------------------------------
// <copyright file="InvitationMapper.cs" company="Ellucian">
//     Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Invitations;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// InvitationMapper
    /// </summary>
    internal static class InvitationMapper
    {
        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="relatives">The relatives.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="showStudentPicture">if set to <c>true</c> [show student picture].</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static List<RelativeViewModel> ToViewModel(this List<Relative> relatives, string nameFormat, string nameSort,
            IPeopleService peopleService, bool showStudentPicture, bool showMiddleNameInitial, string dateTimeCultureFormat, IPictureHelper pictureHelper)
        {
            List<RelativeViewModel> relativeViewModels = new();
            RelativeViewModel relativeViewModel = null;
            Relative relative;
            if (relatives?.Count > 0)
            {
                List<People> relativeSortedList = new();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);

                foreach (Relative item in relatives)
                    relativeSortedList.Add(item.People);
                relativeSortedList = FormatHelper.GetSortedList(relativeSortedList.Cast<object>(), nameSort).Cast<People>().ToList();
                foreach (People people in relativeSortedList)
                {
                    relative = relatives.Find(x => x.People == people);
                    if (relative != null)
                    {
                        relativeViewModel = new RelativeViewModel
                        {
                            Avatar = relative.People.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                            ExpiryDate = FormatHelper.ToShortDate(relative.ExpiryDate, datetimeCulture),
                            Id = relative.Id,
                            RelationshipDesc = relative.RelationshipDesc
                        };
                        relativeViewModel.Avatar.HasPicture = showStudentPicture && people.HasPicture && pictureHelper.GetPictureAsync(peopleService.GetPicture(people.PersonId.Value)) != null;
                        relativeViewModels.Add(relativeViewModel);
                    }
                }
            }
            return relativeViewModels;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="invitationDetail">The invitation detail.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns></returns>
        internal static RelativeDetailsViewModel ToViewModel(this InvitationDetail invitationDetail, string nameFormat, string nameSort, bool showMiddleNameInitial, string dateTimeCultureFormat)
        {
            RelativeDetailsViewModel relativeDetails = null;
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);

            if (invitationDetail != null)
            {
                relativeDetails = new RelativeDetailsViewModel
                {
                    AcceptedDate = FormatHelper.ToShortDate(invitationDetail.Invitation.AcceptedDate, datetimeCulture),
                    Options = new SharedAccessClaimModel
                    {
                        AcademicPlan = invitationDetail.Invitation.CanViewAcademicPlan,
                        ActivityGrades = invitationDetail.Invitation.CanViewActivityGrades,
                        Address = invitationDetail.Invitation.CanViewAddress,
                        Balance = invitationDetail.Invitation.CanViewBalance,
                        FinancialAid = invitationDetail.Invitation.CanViewFinancialAid,
                        GradeReport = invitationDetail.Invitation.CanViewGradeReport,
                        Schedule = invitationDetail.Invitation.CanViewSchedule,
                        StopList = invitationDetail.Invitation.CanViewStopList,
                        Transcript = invitationDetail.Invitation.CanViewTranscript
                    },
                    RelationshipDesc = invitationDetail.Relative.RelationshipDesc,
                    Avatar = invitationDetail.Relative.People.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                    Id = invitationDetail.Invitation.InvitationId
                };
            }

            return relativeDetails;
        }
    }
}