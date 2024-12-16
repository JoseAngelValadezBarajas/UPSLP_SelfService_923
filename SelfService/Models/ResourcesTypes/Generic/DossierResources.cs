// --------------------------------------------------------------------
// <copyright file="DossierResources.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Shared;

namespace SelfService.Models.ResourcesTypes.Generic
{
    public class DossierAcademicResources
    {
        public string FormatAcademicPlan { get; set; }
        public string FormatPeriod { get; set; }
        public string FormatPeriodSession { get; set; }
        public string LblAcademic { get; set; }
        public string LblAttemptedCredits { get; set; }
        public string LblCumulativeGpa { get; set; }
        public string LblCurrentGpa { get; set; }
        public string LblEarnedCredits { get; set; }
        public string LblGpa { get; set; }
        public string LblGpaCredits { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblPeriod { get; set; }
        public string LblQualityPoints { get; set; }
        public string LblTotalCredits { get; set; }
        public string LblTransferCredits { get; set; }
    }

    public class DossierAssociationsResources
    {
        public string FormatPeriod { get; set; }
        public string FormatPeriodSession { get; set; }
        public string FormatWhenHeldPeriod { get; set; }
        public string FormatWhenHeldPeriodSession { get; set; }
        public string LblAssociation { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblOfficeHeld { get; set; }
        public string LblWhenHeld { get; set; }
    }

    public class DossierContactResources
    {
        public string FormatAddress { get; set; }
        public string FormatEmergency { get; set; }
        public string FormatPhone { get; set; }
        public string FormatResidency { get; set; }
        public string LblContact { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblPrimaryAddress { get; set; }
        public string LblPrimaryEmergencyContact { get; set; }
        public string LblPrimaryPhone { get; set; }
        public string LblResidency { get; set; }
        public string LblSecondaryEmergencyContact { get; set; }
    }

    public class DossierCustomViewResources
    {
        public string LblNotAvailable { get; set; }
    }

    public class DossierHeaderResources
    {
        public string FormatEmailAddress { get; set; }
        public string FormatReleaseInformation { get; set; }
        public string LblCourseSchedule { get; set; }
        public string LblFacultySchedule { get; set; }
        public string LblInformation { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblStudentSchedule { get; set; }
        public string LblTeachingSchedule { get; set; }
    }

    public class DossierOfficesResources
    {
        public string LblBuilding { get; set; }
        public string LblCampus { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblOffice { get; set; }
        public string LblPhoneNumber { get; set; }
        public string LblRoom { get; set; }
    }

    public class DossierPositionsResources
    {
        public string LblCollege { get; set; }
        public string LblDepartment { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblPosition { get; set; }
        public string LblProgram { get; set; }
    }

    public class DossierResources
    {
        public DossierAcademicResources DossierAcademic { get; set; }
        public DossierAssociationsResources DossierAssociations { get; set; }
        public DossierContactResources DossierContact { get; set; }
        public DossierCustomViewResources DossierCustomView { get; set; }
        public DossierHeaderResources DossierHeader { get; set; }
        public DossierOfficesResources DossierOffices { get; set; }
        public DossierPositionsResources DossierPositions { get; set; }
        public DossierScheduleResources DossierSchedule { get; set; }
        public PermissionRequestStatusResources PermissionRequestStatus { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
        public StudentCourseMessagesResources StudentCourseMessages { get; set; }
        public StudentCourseStatusResources StudentCourseStatus { get; set; }
    }

    public class DossierScheduleResources
    {
        public string LblContinuingEducation { get; set; }
        public string LblDeniedCourses { get; set; }
        public string LblEmpty { get; set; }
        public string LblPeriod { get; set; }
        public SectionsResources Sections { get; set; }
    }
}