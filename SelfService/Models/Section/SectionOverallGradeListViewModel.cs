// --------------------------------------------------------------------
// <copyright file="SectionOverallGradeListViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.CourseTemplates;
using SelfService.Models.ResourcesTypes.Downloads;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// OverallGradeViewModel
    /// </summary>
    public class OverallGradeViewModel
    {
        /// <summary>
        /// Gets or sets the approved comments.
        /// </summary>
        /// <value>
        /// The approved comments.
        /// </value>
        public string ApprovedComments { get; set; }

        /// <summary>
        /// Gets or sets the approved grade.
        /// </summary>
        /// <value>
        /// The approved grade.
        /// </value>
        public string ApprovedGrade { get; set; }

        /// <summary>
        /// Gets or sets the calculated grade.
        /// </summary>
        /// <value>
        /// The calculated grade.
        /// </value>
        public string CalculatedGrade { get; set; }

        /// <summary>
        /// Gets or sets the calculated score.
        /// </summary>
        /// <value>
        /// The calculated score.
        /// </value>
        public string CalculatedScore { get; set; }

        /// <summary>
        /// Gets the grade approval identifier.
        /// </summary>
        /// <value>
        /// The grade approval identifier.
        /// </value>
        public int GradeApprovalId { get; set; }

        /// <summary>
        /// Gets or sets the instructor comments.
        /// </summary>
        /// <value>
        /// The instructor comments.
        /// </value>
        public string InstructorComments { get; set; }

        /// <summary>
        /// Gets or sets the instructor grade.
        /// </summary>
        /// <value>
        /// The instructor grade.
        /// </value>
        public string InstructorGrade { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is allowed to change.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is allowed to change; otherwise, <c>false</c>.
        /// </value>
        public bool IsAllowedToChange { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is approved.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is approved; otherwise, <c>false</c>.
        /// </value>
        public bool IsApproved { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is modified.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is modified; otherwise, <c>false</c>.
        /// </value>
        public bool IsModified { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is pending.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is pending; otherwise, <c>false</c>.
        /// </value>
        public bool IsPending { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is posted.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is posted; otherwise, <c>false</c>.
        /// </value>
        public bool IsPosted { get; set; }

        /// <summary>
        /// Gets or sets the student grade identifier.
        /// </summary>
        /// <value>
        /// The student grade identifier.
        /// </value>
        public int StudentGradeId { get; set; }

        /// <summary>
        /// Gets or sets the transcript comments.
        /// </summary>
        /// <value>
        /// The transcript comments.
        /// </value>
        public string TranscriptComments { get; set; }

        /// <summary>
        /// Gets or sets the transcript detail identifier.
        /// </summary>
        /// <value>
        /// The transcript detail identifier.
        /// </value>
        public int TranscriptDetailId { get; set; }

        /// <summary>
        /// Gets or sets the transcript grade.
        /// </summary>
        /// <value>
        /// The transcript grade.
        /// </value>
        public string TranscriptGrade { get; set; }
    }

    /// <summary>
    /// SectionOverallGradeListViewModel
    /// </summary>
    public class SectionOverallGradeListViewModel
    {
        /// <summary>
        /// Gets or sets the assignment department.
        /// </summary>
        /// <value>
        /// The assignment department.
        /// </value>
        public AssignmentDepartmentViewModel AssignmentDepartment { get; set; }

        /// <summary>
        /// Gets or sets the email settings.
        /// </summary>
        /// <value>
        /// The email settings.
        /// </value>
        public EmailSettingsViewModel EmailSettings { get; set; }

        /// <summary>
        /// Gets or sets the errors.
        /// </summary>
        /// <value>
        /// The errors.
        /// </value>
        public List<string> Errors { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is change grade department.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is change grade department; otherwise, <c>false</c>.
        /// </value>
        public bool IsChangeGradeDepartment { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is change grade faculty.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is change grade faculty; otherwise, <c>false</c>.
        /// </value>
        public bool IsChangeGradeFaculty { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is finalterm open.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is finalterm open; otherwise, <c>false</c>.
        /// </value>
        public bool IsFinaltermOpen { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is midterm open.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is midterm open; otherwise, <c>false</c>.
        /// </value>
        public bool IsMidtermOpen { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is submit.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is submit; otherwise, <c>false</c>.
        /// </value>
        public bool IsSubmit { get; set; }

        /// <summary>
        /// Gets or sets the overall grade list.
        /// </summary>
        /// <value>
        /// The overall grade list.
        /// </value>
        public List<StudentOverallGradeViewModel> OverallGradeList { get; set; }

        /// <summary>
        /// Gets or sets the section setup status.
        /// 0 - Valid
        /// 1 - Invalid
        /// 2 - NoAssignmentsExist
        /// </summary>
        /// <value>
        /// The section setup status.
        /// </value>
        public int SectionSetupStatus { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show finalterm apply].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show finalterm apply]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowFinaltermApply { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show finalterm calculated score].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show finalterm calculated score]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowFinaltermCalculatedScore { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show midterm apply].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show midterm apply]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowMidtermApply { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show midterm calculated score].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show midterm calculated score]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowMidtermCalculatedScore { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show midterm grade].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show midterm grade]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowMidtermGrade { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show projected grade].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show projected grade]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowProjectedGrade { get; set; }

        /// <summary>
        /// Gets or sets the type of the submit.
        /// </summary>
        /// <value>
        /// The type of the submit.
        /// </value>
        public int SubmitType { get; set; }
    }

    /// <summary>
    /// SectionOverallGradesChangeViewModel
    /// </summary>
    public class SectionOverallGradesChangeViewModel
    {
        /// <summary>
        /// Gets or sets the grade change reasons.
        /// </summary>
        /// <value>
        /// The grade change reasons.
        /// </value>
        public List<ListOptionViewModel> GradeChangeReasons { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is final grade change reason required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is final grade change reason required; otherwise, <c>false</c>.
        /// </value>
        public bool IsFinalGradeChangeReasonRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is midterm grade change reason required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is midterm grade change reason required; otherwise, <c>false</c>.
        /// </value>
        public bool IsMidtermGradeChangeReasonRequired { get; set; }

        /// <summary>
        /// Gets or sets the narrative grade.
        /// </summary>
        /// <value>
        /// The narrative grade.
        /// </value>
        public string NarrativeGrade { get; set; }
    }

    /// <summary>
    /// SectionOverallGradeValidationError
    /// </summary>
    public class SectionOverallGradeValidationError
    {
        /// <summary>
        /// Gets or sets the type of the assignment.
        /// </summary>
        /// <value>
        /// The type of the assignment.
        /// </value>
        public string AssignmentType { get; set; }

        /// <summary>
        /// Gets or sets the assignment type identifier.
        /// </summary>
        /// <value>
        /// The assignment type identifier.
        /// </value>
        public int AssignmentTypeId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [final drops with unequal weights].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [final drops with unequal weights]; otherwise, <c>false</c>.
        /// </value>
        public bool FinalDropsWithUnequalWeights { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [midterm drops with unequal weights].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [midterm drops with unequal weights]; otherwise, <c>false</c>.
        /// </value>
        public bool MidtermDropsWithUnequalWeights { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [too many final drops].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [too many final drops]; otherwise, <c>false</c>.
        /// </value>
        public bool TooManyFinalDrops { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [too many midterm drops].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [too many midterm drops]; otherwise, <c>false</c>.
        /// </value>
        public bool TooManyMidtermDrops { get; set; }
    }

    /// <summary>
    /// StudentOverallGradeViewModel
    /// </summary>
    public class StudentOverallGradeViewModel : AvatarViewModel
    {
        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>
        /// The type of the credit.
        /// </value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the credit type values.
        /// </summary>
        /// <value>
        /// The credit type values.
        /// </value>
        public List<ListOptionViewModel> CreditTypeValues { get; set; }

        /// <summary>
        /// Gets or sets the student Email.
        /// </summary>
        /// <value>
        /// The student email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the finalterm.
        /// </summary>
        /// <value>
        /// The finalterm.
        /// </value>
        public OverallGradeViewModel Finalterm { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has email.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has email; otherwise, <c>false</c>.
        /// </value>
        public bool HasEmail { get; set; }

        /// <summary>
        /// Gets or sets the midterm.
        /// </summary>
        /// <value>
        /// The midterm.
        /// </value>
        public OverallGradeViewModel Midterm { get; set; }

        /// <summary>
        /// Gets or sets the projected grade.
        /// </summary>
        /// <value>
        /// The projected grade.
        /// </value>
        public string ProjectedGrade { get; set; }

        /// <summary>
        /// Gets or sets the student identifier.
        /// </summary>
        /// <value>
        /// The student identifier.
        /// </value>
        public int StudentId { get; set; }

        /// <summary>
        /// Gets or sets the withdrawn.
        /// </summary>
        /// <value>
        /// The withdrawn.
        /// </value>
        public bool Withdrawn { get; set; }
    }

    #region Overall Grades Download

    /// <summary>
    /// OverallGradesDownloadViewModel
    /// </summary>
    public class OverallGradesDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the resources.
        /// </summary>
        /// <value>
        /// The resources.
        /// </value>
        public SectionOverallGradesResources Resources { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show midterm].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show midterm]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowMidterm { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show projected grade].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show projected grade]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowProjectedGrade { get; set; }

        /// <summary>
        /// Gets or sets the grade download list.
        /// </summary>
        /// <value>
        /// The grade download list.
        /// </value>
        public List<OverallGradeStudentDownloadViewModel> Students { get; set; }
    }

    /// <summary>
    /// OverallGradeStudentDownloadViewModel
    /// </summary>
    public class OverallGradeStudentDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>
        /// The type of the credit.
        /// </value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the final instructor grade.
        /// </summary>
        /// <value>
        /// The final instructor grade.
        /// </value>
        public string FinalInstructorGrade { get; set; }

        /// <summary>
        /// Gets or sets the final points.
        /// </summary>
        /// <value>
        /// The final points.
        /// </value>
        public string FinalPoints { get; set; }

        /// <summary>
        /// Gets or sets the final transcript grade.
        /// </summary>
        /// <value>
        /// The final transcript grade.
        /// </value>
        public string FinalTranscriptGrade { get; set; }

        /// <summary>
        /// Gets or sets the midterm instructor grade.
        /// </summary>
        /// <value>
        /// The midterm instructor grade.
        /// </value>
        public string MidtermInstructorGrade { get; set; }

        /// <summary>
        /// Gets or sets the midterm points.
        /// </summary>
        /// <value>
        /// The midterm points.
        /// </value>
        public string MidtermPoints { get; set; }

        /// <summary>
        /// Gets or sets the midterm transcript grade.
        /// </summary>
        /// <value>
        /// The midterm transcript grade.
        /// </value>
        public string MidtermTranscriptGrade { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }

        /// <summary>
        /// Gets or sets the projected grade.
        /// </summary>
        /// <value>
        /// The projected grade.
        /// </value>
        public string ProjectedGrade { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="OverallGradeStudentDownloadViewModel"/> is withdrawn.
        /// </summary>
        /// <value>
        ///   <c>true</c> if withdrawn; otherwise, <c>false</c>.
        /// </value>
        public bool Withdrawn { get; set; }
    }

    #endregion Overall Grades Download
}