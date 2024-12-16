// --------------------------------------------------------------------
// <copyright file="AdvisingHelper.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Navigation;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Enum;
using SelfService.Models.Resources;
using SelfService.Models.Session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace SelfService.Helpers
{
    public class AdvisingHelper : IAdvisingHelper
    {
        #region Private Fields

        /// <summary>
        /// The advising service
        /// </summary>
        private readonly IAdvisingService _advisingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<AdvisingHelper> _logger;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="AdvisingHelper"/> class.
        /// </summary>
        /// <param name="advisingService">The advising service.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="logger">The logger.</param>
        public AdvisingHelper(
            IAdvisingService advisingService,
            IResourcesHelper resourcesHelper,
            ISettingHelper settingHelper,
            IAppLogger<AdvisingHelper> logger)
        {
            _advisingService = advisingService;
            _resourcesHelper = resourcesHelper;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        /// <summary>
        /// Gets the profile permission.
        /// </summary>
        /// <param name="viewId">The view identifier.</param>
        /// <param name="claims">The claims.</param>
        /// <returns></returns>
        public bool GetProfilePermission(AdviseeView viewId, IEnumerable<Claim> claims)
        {
            return viewId switch
            {
                AdviseeView.MyAdvisees => claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfile),
                AdviseeView.MyStudents => claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfile),
                AdviseeView.MyAssociations => claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfile),
                AdviseeView.AllStudents => claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfile),
                AdviseeView.FormerAdvisees => claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfile),
                AdviseeView.Alumni => claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfile),
                AdviseeView.MyDepartment => claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfile),
                AdviseeView.MyCampus => claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfile),
                AdviseeView.MySharedAdvisees => claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfile),
                _ => false,
            };
        }

        /// <summary>
        /// Gets the tab permission.
        /// </summary>
        /// <param name="viewId">The view identifier.</param>
        /// <param name="tabId">The tab identifier.</param>
        /// <param name="claims">The claims.</param>
        /// <returns></returns>
        public bool GetTabPermission(AdviseeView viewId, AdviseeProfileTab tabId, IEnumerable<Claim> claims)
        {
            bool isValid = false;
            switch (viewId)
            {
                case AdviseeView.MyAdvisees:
                    switch (tabId)
                    {
                        case AdviseeProfileTab.Profile:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfile);
                            break;

                        case AdviseeProfileTab.ScheduleRequests:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileScheduleRequests);
                            break;

                        case AdviseeProfileTab.Schedule:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileSchedule);
                            break;

                        case AdviseeProfileTab.Grades:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileGradeReport);
                            break;

                        case AdviseeProfileTab.AcademicPlan:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAcademicPlan);
                            break;

                        case AdviseeProfileTab.UnofficialTranscript:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileUnofficialTranscript);
                            break;

                        case AdviseeProfileTab.Agreements:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAgreements);
                            break;

                        case AdviseeProfileTab.Disabilities:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileDisabilities);
                            break;

                        case AdviseeProfileTab.TestScores:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileTestScores);
                            break;

                        case AdviseeProfileTab.Attendance:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAttendance);
                            break;

                        case AdviseeProfileTab.WhatIf:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileWhatIf);
                            break;

                        case AdviseeProfileTab.Alerts:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAlerts);
                            break;

                        case AdviseeProfileTab.Checklist:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileChecklist);
                            break;

                        case AdviseeProfileTab.RegistrationSummary:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileRegistrationSummary);
                            break;
                    }
                    break;

                case AdviseeView.MyStudents:
                    switch (tabId)
                    {
                        case AdviseeProfileTab.Profile:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfile);
                            break;

                        case AdviseeProfileTab.ScheduleRequests:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileScheduleRequests);
                            break;

                        case AdviseeProfileTab.Schedule:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileSchedule);
                            break;

                        case AdviseeProfileTab.Grades:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileGradeReport);
                            break;

                        case AdviseeProfileTab.AcademicPlan:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAcademicPlan);
                            break;

                        case AdviseeProfileTab.UnofficialTranscript:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileUnofficialTranscript);
                            break;

                        case AdviseeProfileTab.Agreements:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAgreements);
                            break;

                        case AdviseeProfileTab.Disabilities:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileDisabilities);
                            break;

                        case AdviseeProfileTab.TestScores:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileTestScores);
                            break;

                        case AdviseeProfileTab.Attendance:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAttendance);
                            break;

                        case AdviseeProfileTab.WhatIf:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileWhatIf);
                            break;

                        case AdviseeProfileTab.Alerts:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAlerts);
                            break;

                        case AdviseeProfileTab.Checklist:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileChecklist);
                            break;

                        case AdviseeProfileTab.RegistrationSummary:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileRegistrationSummary);
                            break;
                    }
                    break;

                case AdviseeView.MyAssociations:
                    switch (tabId)
                    {
                        case AdviseeProfileTab.Profile:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfile);
                            break;

                        case AdviseeProfileTab.ScheduleRequests:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileScheduleRequests);
                            break;

                        case AdviseeProfileTab.Schedule:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileSchedule);
                            break;

                        case AdviseeProfileTab.Grades:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileGradeReport);
                            break;

                        case AdviseeProfileTab.AcademicPlan:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAcademicPlan);
                            break;

                        case AdviseeProfileTab.UnofficialTranscript:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileUnofficialTranscript);
                            break;

                        case AdviseeProfileTab.Agreements:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAgreements);
                            break;

                        case AdviseeProfileTab.Disabilities:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileDisabilities);
                            break;

                        case AdviseeProfileTab.TestScores:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileTestScores);
                            break;

                        case AdviseeProfileTab.Attendance:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAttendance);
                            break;

                        case AdviseeProfileTab.WhatIf:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileWhatIf);
                            break;

                        case AdviseeProfileTab.Alerts:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAlerts);
                            break;

                        case AdviseeProfileTab.Checklist:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileChecklist);
                            break;

                        case AdviseeProfileTab.RegistrationSummary:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileRegistrationSummary);
                            break;
                    }
                    break;

                case AdviseeView.AllStudents:
                    switch (tabId)
                    {
                        case AdviseeProfileTab.Profile:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfile);
                            break;

                        case AdviseeProfileTab.ScheduleRequests:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileScheduleRequests);
                            break;

                        case AdviseeProfileTab.Schedule:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileSchedule);
                            break;

                        case AdviseeProfileTab.Grades:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileGradeReport);
                            break;

                        case AdviseeProfileTab.AcademicPlan:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAcademicPlan);
                            break;

                        case AdviseeProfileTab.UnofficialTranscript:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileUnofficialTranscript);
                            break;

                        case AdviseeProfileTab.Agreements:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAgreements);
                            break;

                        case AdviseeProfileTab.Disabilities:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileDisabilities);
                            break;

                        case AdviseeProfileTab.TestScores:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileTestScores);
                            break;

                        case AdviseeProfileTab.Attendance:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAttendance);
                            break;

                        case AdviseeProfileTab.WhatIf:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileWhatIf);
                            break;

                        case AdviseeProfileTab.Alerts:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAlerts);
                            break;

                        case AdviseeProfileTab.Checklist:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileChecklist);
                            break;

                        case AdviseeProfileTab.RegistrationSummary:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileRegistrationSummary);
                            break;
                    }
                    break;

                case AdviseeView.FormerAdvisees:
                    switch (tabId)
                    {
                        case AdviseeProfileTab.Profile:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfile);
                            break;

                        case AdviseeProfileTab.ScheduleRequests:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileScheduleRequests);
                            break;

                        case AdviseeProfileTab.Schedule:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileSchedule);
                            break;

                        case AdviseeProfileTab.Grades:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileGradeReport);
                            break;

                        case AdviseeProfileTab.AcademicPlan:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAcademicPlan);
                            break;

                        case AdviseeProfileTab.UnofficialTranscript:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileUnofficialTranscript);
                            break;

                        case AdviseeProfileTab.Agreements:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAgreements);
                            break;

                        case AdviseeProfileTab.Disabilities:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileDisabilities);
                            break;

                        case AdviseeProfileTab.TestScores:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileTestScores);
                            break;

                        case AdviseeProfileTab.Attendance:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAttendance);
                            break;

                        case AdviseeProfileTab.WhatIf:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileWhatIf);
                            break;

                        case AdviseeProfileTab.Alerts:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAlerts);
                            break;

                        case AdviseeProfileTab.Checklist:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileChecklist);
                            break;

                        case AdviseeProfileTab.RegistrationSummary:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileRegistrationSummary);
                            break;
                    }
                    break;

                case AdviseeView.Alumni:
                    switch (tabId)
                    {
                        case AdviseeProfileTab.Profile:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfile);
                            break;

                        case AdviseeProfileTab.ScheduleRequests:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileScheduleRequests);
                            break;

                        case AdviseeProfileTab.Schedule:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileSchedule);
                            break;

                        case AdviseeProfileTab.Grades:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileGradeReport);
                            break;

                        case AdviseeProfileTab.AcademicPlan:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAcademicPlan);
                            break;

                        case AdviseeProfileTab.UnofficialTranscript:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileUnofficialTranscript);
                            break;

                        case AdviseeProfileTab.Agreements:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAgreements);
                            break;

                        case AdviseeProfileTab.Disabilities:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileDisabilities);
                            break;

                        case AdviseeProfileTab.TestScores:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileTestScores);
                            break;

                        case AdviseeProfileTab.Attendance:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAttendance);
                            break;

                        case AdviseeProfileTab.WhatIf:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileWhatIf);
                            break;

                        case AdviseeProfileTab.Alerts:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAlerts);
                            break;

                        case AdviseeProfileTab.Checklist:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileChecklist);
                            break;

                        case AdviseeProfileTab.RegistrationSummary:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileRegistrationSummary);
                            break;
                    }
                    break;

                case AdviseeView.MyDepartment:
                    switch (tabId)
                    {
                        case AdviseeProfileTab.Profile:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfile);
                            break;

                        case AdviseeProfileTab.ScheduleRequests:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileScheduleRequests);
                            break;

                        case AdviseeProfileTab.Schedule:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileSchedule);
                            break;

                        case AdviseeProfileTab.Grades:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileGradeReport);
                            break;

                        case AdviseeProfileTab.AcademicPlan:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAcademicPlan);
                            break;

                        case AdviseeProfileTab.UnofficialTranscript:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileUnofficialTranscript);
                            break;

                        case AdviseeProfileTab.Agreements:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAgreements);
                            break;

                        case AdviseeProfileTab.Disabilities:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileDisabilities);
                            break;

                        case AdviseeProfileTab.TestScores:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileTestScores);
                            break;

                        case AdviseeProfileTab.Attendance:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAttendance);
                            break;

                        case AdviseeProfileTab.WhatIf:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileWhatIf);
                            break;

                        case AdviseeProfileTab.Alerts:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAlerts);
                            break;

                        case AdviseeProfileTab.Checklist:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileChecklist);
                            break;

                        case AdviseeProfileTab.RegistrationSummary:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileRegistrationSummary);
                            break;
                    }
                    break;

                case AdviseeView.MyCampus:
                    switch (tabId)
                    {
                        case AdviseeProfileTab.Profile:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfile);
                            break;

                        case AdviseeProfileTab.ScheduleRequests:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileScheduleRequests);
                            break;

                        case AdviseeProfileTab.Schedule:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileSchedule);
                            break;

                        case AdviseeProfileTab.Grades:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileGradeReport);
                            break;

                        case AdviseeProfileTab.AcademicPlan:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAcademicPlan);
                            break;

                        case AdviseeProfileTab.UnofficialTranscript:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileUnofficialTranscript);
                            break;

                        case AdviseeProfileTab.Agreements:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAgreements);
                            break;

                        case AdviseeProfileTab.Disabilities:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileDisabilities);
                            break;

                        case AdviseeProfileTab.TestScores:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileTestScores);
                            break;

                        case AdviseeProfileTab.Attendance:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAttendance);
                            break;

                        case AdviseeProfileTab.WhatIf:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileWhatIf);
                            break;

                        case AdviseeProfileTab.Alerts:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAlerts);
                            break;

                        case AdviseeProfileTab.Checklist:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileChecklist);
                            break;

                        case AdviseeProfileTab.RegistrationSummary:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileRegistrationSummary);
                            break;
                    }
                    break;

                case AdviseeView.MySharedAdvisees:
                    switch (tabId)
                    {
                        case AdviseeProfileTab.Profile:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfile);
                            break;

                        case AdviseeProfileTab.ScheduleRequests:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileScheduleRequests);
                            break;

                        case AdviseeProfileTab.Schedule:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileSchedule);
                            break;

                        case AdviseeProfileTab.Grades:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileGradeReport);
                            break;

                        case AdviseeProfileTab.AcademicPlan:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAcademicPlan);
                            break;

                        case AdviseeProfileTab.UnofficialTranscript:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileUnofficialTranscript);
                            break;

                        case AdviseeProfileTab.Agreements:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAgreements);
                            break;

                        case AdviseeProfileTab.Disabilities:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileDisabilities);
                            break;

                        case AdviseeProfileTab.TestScores:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileTestScores);
                            break;

                        case AdviseeProfileTab.Attendance:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAttendance);
                            break;

                        case AdviseeProfileTab.WhatIf:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileWhatIf);
                            break;

                        case AdviseeProfileTab.Alerts:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAlerts);
                            break;

                        case AdviseeProfileTab.Checklist:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileChecklist);
                            break;

                        case AdviseeProfileTab.RegistrationSummary:
                            isValid = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileRegistrationSummary);
                            break;
                    }
                    break;
            }
            return isValid;
        }

        /// <summary>
        /// Gets the tab text.
        /// </summary>
        /// <param name="tabId">The tab identifier.</param>
        /// <param name="account">The account.</param>
        /// <returns></returns>
        public string GetTabText(int tabId, Account account)
        {
            try
            {
                string tabText = string.Empty;

                string language = _settingHelper.GetLanguage(account);
                ManageAdviseesResources manageAdviseesResources
                    = _resourcesHelper.GetResourceType<ManageAdviseesResources>(language, new SiteMapPage("Advising", "ManageAdvisees"));
                return tabId switch
                {
                    0 => HtmlEncoder.Default.Encode(manageAdviseesResources.LblMyAdvisees),
                    1 => HtmlEncoder.Default.Encode(manageAdviseesResources.LblMyStudents),
                    2 => HtmlEncoder.Default.Encode(manageAdviseesResources.LblMyAssociations),
                    3 => HtmlEncoder.Default.Encode(manageAdviseesResources.LblAllStudents),
                    4 => HtmlEncoder.Default.Encode(manageAdviseesResources.LblFormerAdvisees),
                    5 => HtmlEncoder.Default.Encode(manageAdviseesResources.LblAlumni),
                    6 => HtmlEncoder.Default.Encode(manageAdviseesResources.LblMyDepartment),
                    7 => HtmlEncoder.Default.Encode(manageAdviseesResources.LblMyCampus),
                    8 => HtmlEncoder.Default.Encode(manageAdviseesResources.LblMySharedAdvisees),
                    _ => tabText,
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(IHttpClientHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Determines whether the specified tab identifier is authorized.
        /// </summary>
        /// <param name="tabId">The tab identifier.</param>
        /// <param name="advisorId">The advisor identifier.</param>
        /// <param name="adviseeId">The advisee identifier.</param>
        /// <returns>
        ///   <c>true</c> if the specified tab identifier is authorized; otherwise, <c>false</c>.
        /// </returns>
        public bool IsAuthorized(int tabId, int advisorId, int adviseeId)
        {
            try
            {
                return tabId switch
                {
                    0 => _advisingService.IsMyAdvisee(advisorId, adviseeId),
                    1 => _advisingService.IsMyStudent(advisorId, adviseeId),
                    2 => _advisingService.IsMyAssociationMember(advisorId, adviseeId),
                    3 => _advisingService.IsAStudent(adviseeId),
                    4 => _advisingService.IsAFormerAdvisee(advisorId, adviseeId),
                    5 => _advisingService.IsAnAlumni(adviseeId),
                    6 => _advisingService.IsInMyDepartment(advisorId, adviseeId),
                    7 => _advisingService.IsInMyCampus(advisorId, adviseeId),
                    8 => _advisingService.IsInMySharedAdvisee(advisorId, adviseeId),
                    _ => false,
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(IHttpClientHelper).FullName, exception.Message, exception);
                throw;
            }
        }
    }
}