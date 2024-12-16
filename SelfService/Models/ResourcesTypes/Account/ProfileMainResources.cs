// --------------------------------------------------------------------
// <copyright file="ProfileResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Account
{
    public class ProfileDetail
    {
        public string LblApplied { get; set; }
        public string LblCampus { get; set; }
        public string LblCertified { get; set; }
        public string LblClassLevel { get; set; }
        public string LblCollege { get; set; }
        public string LblCollegeAttend { get; set; }
        public string LblContactAdvisor { get; set; }
        public string LblCurriculum { get; set; }
        public string LblCurriculumGpa { get; set; }
        public string LblDegree { get; set; }
        public string LblDepartment { get; set; }
        public string LblEnrolledCredits { get; set; }
        public string LblExpectedGraduation { get; set; }
        public string LblFullPartTime { get; set; }
        public string LblGraduated { get; set; }
        public string LblGraduation { get; set; }
        public string LblGraduationStatus { get; set; }
        public string LblHistoricalGpa { get; set; }
        public string LblLowAttendance { get; set; }
        public string LblLowGrades { get; set; }
        public string LblMatriculated { get; set; }
        public string LblMatriculationDate { get; set; }
        public string LblNo { get; set; }
        public string LblNonTraditional { get; set; }
        public string LblNotApplied { get; set; }
        public string LblOverallGpa { get; set; }
        public string LblPopulation { get; set; }
        public string LblPrimaryProgram { get; set; }
        public string LblProgram { get; set; }
        public string LblRemainingCredits { get; set; }
        public string LblTermCreditLimit { get; set; }
        public string LblViolation { get; set; }
        public string LblYearTerm { get; set; }
        public string LblYes { get; set; }
        public string LblProfilePicture { get; set; }
    }

    public class ProfileMainResources
    {
        public string FormatBreadcrumbs { get; set; }
        public string LblAdvisor { get; set; }
        public ProfileDetail ProfileDetail { get; set; }
    }
}