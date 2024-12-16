// --------------------------------------------------------------------
// <copyright file="AdministrationMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Administration;
using SelfService.Models.Shared;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using static Hedtech.PowerCampus.Core.DTO.Settings.InstitutionSettings;

namespace SelfService.Mappers
{
    /// <summary>
    /// AdministrationMapper
    /// </summary>
    internal static class AdministrationMapper
    {
        /// <summary>
        /// Converts to view model.
        /// </summary>
        /// <param name="npmPackageViewModel">The NPM package view model.</param>
        /// <param name="buildInfoViewModel">The build information view model.</param>
        /// <param name="generalSettings">The general settings.</param>
        /// <param name="connectionStrings">The connection strings.</param>
        /// <returns></returns>
        internal static SystemInformationViewModel ToViewModel(
            this NodePackageManagerViewModel npmPackageViewModel,
            BuildInformation buildInfoViewModel,
            InstitutionSettings.General generalSettings,
            ConnectionStrings connectionStrings)
        {
            string selfServiceVersion = string.Empty;
            if (buildInfoViewModel != null)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(generalSettings.DateTimeCulture);
                selfServiceVersion = $"{buildInfoViewModel.Version} - {buildInfoViewModel.Build} ({FormatHelper.ToShortDate(buildInfoViewModel.Date.Date, datetimeCulture)})";
            }
            string connectionPowerCampus = FormatHelper.GetConnectionSettingValue(connectionStrings.PowerCampusDbContext);
            string connectionPowerCampusAuth = FormatHelper.GetConnectionSettingValue(connectionStrings.PowerCampusAuthDbContext);

            return new()
            {
                ClassNames = npmPackageViewModel.Dependencies.ClassNames,
                ConnectionPowerCampus = connectionPowerCampus,
                ConnectionPowerCampusAuth = connectionPowerCampusAuth,
                CoreJs = npmPackageViewModel.Dependencies.CoreJs,
                DesignSystem = npmPackageViewModel.Dependencies.PowercampusDesignSystem,
                ICalGenerator = npmPackageViewModel.Dependencies.ICalGenerator,
                Lodash = npmPackageViewModel.Dependencies.Lodash,
                React = npmPackageViewModel.Dependencies.React,
                ReactDom = npmPackageViewModel.Dependencies.ReactDom,
                ReactMedia = npmPackageViewModel.Dependencies.ReactMedia,
                SelfServiceVersion = selfServiceVersion,
                Typescript = npmPackageViewModel.Dependencies.Typescript,
                UrlParams = npmPackageViewModel.Dependencies.UngapUrlSearchParams
            };
        }

        #region Advisor Warnings

        /// <summary>
        /// To the AdvisorWarningViewModel.
        /// </summary>
        /// <param name="advisorWarningDTO">The advisor warning dto.</param>
        /// <param name="gradeValuesDTO">The grade values dto.</param>
        /// <param name="violations">The violations.</param>
        /// <returns></returns>
        internal static AdvisorWarningViewModel ToViewModel(this AdvisorWarning advisorWarningDTO, List<GradeValue> gradeValuesDTO, List<InstitutionSettingFilter> violations)
        {
            AdvisorWarningViewModel advisorWarningViewModel = null;
            if (advisorWarningDTO != null)
            {
                advisorWarningViewModel = new()
                {
                    ExcusedAbsences = advisorWarningDTO.ExcusedAbsences,
                    ExcusedTardiness = advisorWarningDTO.ExcusedTardiness,
                    ShowAttendance = advisorWarningDTO.ShowAttendance,
                    ShowGrades = advisorWarningDTO.ShowGrades,
                    ShowViolations = advisorWarningDTO.ShowViolations,
                    UnexcusedAbsences = advisorWarningDTO.UnexcusedAbsences,
                    UnexcusedTardiness = advisorWarningDTO.UnexcusedTardiness,
                    Violations = violations
                };

                if (gradeValuesDTO?.Count > 0)
                {
                    foreach (IGrouping<int, GradeValue> creditTypeGroup in gradeValuesDTO.GroupBy(x => x.CreditType.Id).ToList())
                    {
                        GradeValue grade = gradeValuesDTO.Find(x => x.CreditType.Id == creditTypeGroup.Key);
                        if (grade != null)
                        {
                            advisorWarningViewModel.CreditTypes.Add(new()
                            {
                                Complement = grade.CreditType?.IsActive,
                                Description = grade.CreditType?.Description,
                                Grades = ToGrades(creditTypeGroup),
                                Value = creditTypeGroup.Key
                            });
                        }
                    }
                }
            }
            return advisorWarningViewModel;
        }

        #endregion Advisor Warnings

        #region PeriodFilter

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="periodsDTO">The periods dto.</param>
        /// <param name="periodsRelatedDTO">The periods related dto.</param>
        /// <returns></returns>
        internal static List<PeriodFilterViewModel> ToViewModel(this List<SessionPeriodFilterInfo> periodsDTO,
            List<SessionPeriodFilterInfo> periodsRelatedDTO = null)
        {
            List<PeriodFilterViewModel> periods = new();
            PeriodFilterViewModel period = null;
            if (periodsDTO?.Count > 0)
            {
                foreach (SessionPeriodFilterInfo row in periodsDTO)
                {
                    period = new()
                    {
                        Id = row.SessionPeriodId,
                        IsIncluded = row.IsIncluded,
                        Session = row.Session,
                        Term = row.Term
                    };
                    periods.Add(period);
                }
            }

            if (periodsRelatedDTO?.Count > 0)
            {
                foreach (SessionPeriodFilterInfo row in periodsRelatedDTO)
                {
                    if ((period = periods.Find(p => p.Id == row.SessionPeriodId)) != null)
                        period.IsRelatedIncluded = row.IsIncluded;
                }
            }
            return periods;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="periodDTO">The period dto.</param>
        /// <returns></returns>
        internal static PeriodStatusViewModel ToViewModel(this Period periodDTO)
        {
            PeriodStatusViewModel period = null;

            if (periodDTO != null)
            {
                period = new()
                {
                    Value = $"{periodDTO.Year}/{periodDTO.TermCode}",
                    Status = periodDTO.AuthorizationStatus
                };
            }
            return period;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="periodsDTO">The periods dto.</param>
        /// <returns></returns>
        internal static List<PeriodStatusViewModel> ToViewModelStatus(this List<Period> periodsDTO)
        {
            List<PeriodStatusViewModel> periods = null;

            if (periodsDTO?.Count > 0)
                periods = periodsDTO.Select(p => p.ToViewModel()).ToList();

            return periods;
        }

        #endregion PeriodFilter

        #region Private Methods

        /// <summary>
        /// To the grades.
        /// </summary>
        /// <param name="creditTypeGroup">Type of the grade.</param>
        /// <returns></returns>
        private static List<ListOptionViewModel> ToGrades(IGrouping<int, GradeValue> creditTypeGroup)
        {
            List<ListOptionViewModel> gradesViewModel = new();
            foreach (GradeValue gradeValue in creditTypeGroup)
            {
                gradesViewModel.Add(new()
                {
                    Complement = gradeValue.IsInclude,
                    Description = gradeValue.Grade,
                    Value = gradeValue.Id
                });
            }
            return gradesViewModel;
        }

        #endregion Private Methods

        #region DepartmentHead

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="departmentHeadDetails">The department head details.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<DepartmentHeadViewModel> ToViewModel(this List<DepartmentHeadDetail> departmentHeadDetails,
            string nameFormat, string nameSort, string peopleFormat, bool showMiddleNameInitial)
        {
            List<DepartmentHeadViewModel> departmentHeadViewModels = new();
            DepartmentHeadViewModel deparmentHeadViewModel = null;
            if (departmentHeadDetails.Count > 0)
            {
                List<People> studentSortedList = new();
                foreach (DepartmentHeadDetail item in departmentHeadDetails)
                    studentSortedList.Add(item.PeopleDepartmentHead);
                studentSortedList = FormatHelper.GetSortedList(studentSortedList.Cast<object>(), nameSort).Cast<People>().ToList();
                DepartmentHeadDetail departmentHeadDetail;
                AvatarViewModel peopleAvatar = null;
                foreach (People people in studentSortedList)
                {
                    departmentHeadDetail = departmentHeadDetails.Find(x => x.PeopleDepartmentHead == people);
                    if (departmentHeadDetail != null)
                    {
                        peopleAvatar = departmentHeadDetail.PeopleDepartmentHead.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                        deparmentHeadViewModel = new()
                        {
                            ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                            FirstLetter = peopleAvatar.FirstLetter,
                            FullName = peopleAvatar.FullName,
                            DepartmentDesc = departmentHeadDetail.DepartmentDesc,
                            DepartmentHeadId = departmentHeadDetail.DepartmentHeadId,
                            DepartmentId = departmentHeadDetail.DepartmentId,
                            PersonId = departmentHeadDetail.PersonId,
                            PeopleId = FormatHelper.ToPeopleId(departmentHeadDetail.PeopleDepartmentHead.PeopleId, peopleFormat)
                        };
                        departmentHeadViewModels.Add(deparmentHeadViewModel);
                    }
                }
            }
            return departmentHeadViewModels;
        }

        #endregion DepartmentHead

        #region AssociationHead

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="associationHeadDetails">The association head details.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<AssociationHeadViewModel> ToViewModel(this List<AssociationHeadDetail> associationHeadDetails,
            string nameFormat, string nameSort, string peopleFormat, bool showMiddleNameInitial)
        {
            List<AssociationHeadViewModel> associationHeadViewModels = new();
            AssociationHeadViewModel associationHeadViewModel = null;
            if (associationHeadDetails.Count > 0)
            {
                List<People> studentSortedList = new();
                foreach (AssociationHeadDetail item in associationHeadDetails)
                    studentSortedList.Add(item.PeopleAssociationHead);
                studentSortedList = FormatHelper.GetSortedList(studentSortedList.Cast<object>(), nameSort).Cast<People>().ToList();
                AssociationHeadDetail associationHeadDetail;
                AvatarViewModel peopleAvatar = null;
                foreach (People people in studentSortedList)
                {
                    associationHeadDetail = associationHeadDetails.Find(x => x.PeopleAssociationHead == people);
                    if (associationHeadDetail != null)
                    {
                        peopleAvatar = associationHeadDetail.PeopleAssociationHead.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                        associationHeadViewModel = new()
                        {
                            AssociationDesc = associationHeadDetail.AssociationDesc,
                            AssociationHeadId = associationHeadDetail.AssociationHeadId,
                            AssociationId = associationHeadDetail.AssociationId,
                            ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                            FirstLetter = peopleAvatar.FirstLetter,
                            FullName = peopleAvatar.FullName,
                            PeopleId = FormatHelper.ToPeopleId(associationHeadDetail.PeopleAssociationHead.PeopleId, peopleFormat),
                            PersonId = associationHeadDetail.PersonId
                        };
                        associationHeadViewModels.Add(associationHeadViewModel);
                    }
                }
            }
            return associationHeadViewModels;
        }

        #endregion AssociationHead

        #region CampusCoordinator

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="campusCoordinatorDetails">The campus coordinator details.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<CampusCoordinatorViewModel> ToViewModel(this List<CampusCoordinatorDetail> campusCoordinatorDetails,
            string nameFormat, string nameSort, string peopleFormat, bool showMiddleNameInitial)
        {
            List<CampusCoordinatorViewModel> campusCoordinatorViewModels = new();
            CampusCoordinatorViewModel campusCoordinatorViewModel = null;
            if (campusCoordinatorDetails.Count > 0)
            {
                List<People> studentSortedList = new();
                foreach (CampusCoordinatorDetail item in campusCoordinatorDetails)
                    studentSortedList.Add(item.PeopleCampusCoordinator);
                studentSortedList = FormatHelper.GetSortedList(studentSortedList.Cast<object>(), nameSort).Cast<People>().ToList();
                CampusCoordinatorDetail campusCoordinatorDetail;
                AvatarViewModel peopleAvatar = null;
                foreach (People people in studentSortedList)
                {
                    campusCoordinatorDetail = campusCoordinatorDetails.Find(x => x.PeopleCampusCoordinator == people);
                    if (campusCoordinatorDetail != null)
                    {
                        peopleAvatar = campusCoordinatorDetail.PeopleCampusCoordinator.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                        campusCoordinatorViewModel = new()
                        {
                            CampusCoordinatorId = campusCoordinatorDetail.CampusCoordinatorId,
                            CampusName = campusCoordinatorDetail.CampusName,
                            ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                            FirstLetter = peopleAvatar.FirstLetter,
                            FullName = peopleAvatar.FullName,
                            OrganizationId = campusCoordinatorDetail.OrganizationId,
                            PeopleId = FormatHelper.ToPeopleId(campusCoordinatorDetail.PeopleCampusCoordinator.PeopleId, peopleFormat),
                            PersonId = campusCoordinatorDetail.PersonId
                        };
                        campusCoordinatorViewModels.Add(campusCoordinatorViewModel);
                    }
                }
            }
            return campusCoordinatorViewModels;
        }

        #endregion CampusCoordinator

        #region Office

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="staffMembers">The staff members.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<OfficeStaffViewModel> ToViewModel(this List<OfficeStaffMember> staffMembers,
            string nameFormat, string nameSort, string peopleFormat, bool showMiddleNameInitial)
        {
            List<OfficeStaffViewModel> officeStaffViewModels = new();
            OfficeStaffViewModel officeStaffViewModel = null;
            if (staffMembers.Count > 0)
            {
                AvatarViewModel peopleAvatar = null;
                foreach (OfficeStaffMember staffMember in staffMembers)
                {
                    if (staffMember != null)
                    {
                        peopleAvatar = staffMember.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                        officeStaffViewModel = new()
                        {
                            ColorFirstLetter = peopleAvatar.ColorFirstLetter,
                            FirstLetter = peopleAvatar.FirstLetter,
                            FullName = peopleAvatar.FullName,
                            OfficeId = staffMember.OfficeId,
                            PersonId = staffMember.PersonId ?? 0,
                            PeopleId = FormatHelper.ToPeopleId(staffMember.PeopleId, peopleFormat)
                        };
                        officeStaffViewModels.Add(officeStaffViewModel);
                    }
                }
            }
            return officeStaffViewModels;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="staffPermissionsDTO">The staff permissions dto.</param>
        /// <returns></returns>
        internal static List<StaffPermissionViewModel> ToViewModel(this List<OfficeStaffPermission> staffPermissionsDTO)
        {
            List<StaffPermissionViewModel> staffPermissions = null;
            if (staffPermissionsDTO?.Count > 0)
            {
                staffPermissions = staffPermissionsDTO.Select(sp => new StaffPermissionViewModel
                {
                    CanEditTasks = sp.CanEditTasks,
                    CanViewNotes = sp.CanViewNotes,
                    OfficeDesc = sp.OfficeDesc,
                    OfficeId = sp.OfficeId ?? 0,
                    StaffMemberId = sp.StaffMemberId ?? 0
                }).ToList();
            }

            return staffPermissions;
        }

        #endregion Office
    }
}