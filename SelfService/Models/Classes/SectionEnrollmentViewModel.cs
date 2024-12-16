// --------------------------------------------------------------------
// <copyright file="SectionEnrollmentViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Downloads;
using SelfService.Models.Shared;
using SelfService.Models.Students;
using System.Collections.Generic;

namespace SelfService.Models.Classes
{
    /// <summary>
    /// PermissionRequestViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Classes.SectionListViewModel" />
    public class PermissionRequestViewModel : SectionListViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PermissionRequestViewModel"/> class.
        /// </summary>
        public PermissionRequestViewModel()
        { }

        /// <summary>
        /// Gets or sets the prerequisites.
        /// </summary>
        /// <value>
        /// The prerequisites.
        /// </value>
        public string Prerequisites { get; set; }

        /// <summary>
        /// Gets or sets the students.
        /// </summary>
        /// <value>
        /// The students.
        /// </value>
        public List<StudentPermissionRequestViewModel> Students { get; set; }
    }

    /// <summary>
    /// Class EnrollmentViewModel.
    /// </summary>
    /// <seealso cref="SelfService.Models.Classes.SectionListViewModel" />
    public class SectionEnrollmentViewModel : SectionListViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SectionEnrollmentViewModel"/> class.
        /// </summary>
        public SectionEnrollmentViewModel()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="SectionEnrollmentViewModel" /> class.
        /// </summary>
        /// <param name="sectionEnrollmentViewModel">The section enrollment view model.</param>
        public SectionEnrollmentViewModel(SectionEnrollmentViewModel sectionEnrollmentViewModel) : base(sectionEnrollmentViewModel) { }

        /// <summary>
        /// Gets or sets the students.
        /// </summary>
        /// <value>The students.</value>
        public List<StudentClassListViewModel> Students { get; set; }
    }

    /// <summary>
    /// Class SectionListViewModel.
    /// </summary>
    public class SectionListViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SectionListViewModel"/> class.
        /// </summary>
        public SectionListViewModel()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="SectionListViewModel"/> class.
        /// </summary>
        /// <param name="section">The section.</param>
        public SectionListViewModel(SectionListViewModel section)
        {
            this.StudentCount = section.StudentCount;
            this.TotalCeu = section.TotalCeu;
            this.TotalCredits = section.TotalCredits;
        }

        /// <summary>
        /// Gets or sets the email settings.
        /// </summary>
        /// <value>
        /// The email settings.
        /// </value>
        public EmailSettingsViewModel EmailSettings { get; set; }

        /// <summary>
        /// Gets or sets the student count.
        /// </summary>
        /// <value>The student count.</value>
        public string StudentCount { get; set; }

        /// <summary>
        /// Gets or sets the total ceu.
        /// </summary>
        /// <value>The total ceu.</value>
        public string TotalCeu { get; set; }

        /// <summary>
        /// Gets or sets the total credits.
        /// </summary>
        /// <value>The total credits.</value>
        public string TotalCredits { get; set; }
    }

    /// <summary>
    /// Class StudentAcademicRecordViewModel.
    /// </summary>
    public class StudentAcademicRecordViewModel
    {
        /// <summary>
        /// Gets or sets the class level.
        /// </summary>
        /// <value>The class level.</value>
        public string ClassLevel { get; set; }

        /// <summary>
        /// Gets or sets the class load.
        /// </summary>
        /// <value>The class load.</value>
        public string ClassLoad { get; set; }

        /// <summary>
        /// Gets or sets the PDC description.
        /// </summary>
        /// <value>The PDC description.</value>
        public string PDCDescription { get; set; }
    }

    /// <summary>
    /// Class StudentClassListViewModel.
    /// </summary>
    /// <seealso cref="SelfService.Models.Classes.StudentEnrollmentViewModel" />
    public class StudentClassListViewModel : StudentEnrollmentViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StudentClassListViewModel" /> class.
        /// </summary>
        public StudentClassListViewModel()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="StudentClassListViewModel" /> class.
        /// </summary>
        /// <param name="classListViewModel">The class ListView model.</param>
        public StudentClassListViewModel(StudentClassListViewModel classListViewModel) : base(classListViewModel)
        {
            this.StudentAcademicRecords = classListViewModel.StudentAcademicRecords;
            this.CreditType = classListViewModel.CreditType;
            this.Attendance = classListViewModel.Attendance;
            this.ColorFirstLetter = classListViewModel.ColorFirstLetter;
            this.FirstLetter = classListViewModel.FirstLetter;
            this.Withdrawn = classListViewModel.Withdrawn;
        }

        /// <summary>
        /// Gets or sets the attendance.
        /// </summary>
        /// <value>The attendance.</value>
        public string Attendance { get; set; }

        /// <summary>
        /// Gets or sets the avatar report.
        /// </summary>
        /// <value>
        /// The avatar report.
        /// </value>
        public string AvatarReport { get; set; }

        /// <summary>
        /// Gets or sets the class level report.
        /// </summary>
        /// <value>
        /// The class level report.
        /// </value>
        public string ClassLevelReport { get; set; }

        /// <summary>
        /// Gets or sets the class load report.
        /// </summary>
        /// <value>
        /// The class load report.
        /// </value>
        public string ClassLoadReport { get; set; }

        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>The type of the credit.</value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the PDC report.
        /// </summary>
        /// <value>
        /// The PDC report.
        /// </value>
        public string PDCReport { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="StudentClassListViewModel"/> is withdrawn.
        /// </summary>
        /// <value>
        ///   <c>true</c> if withdrawn; otherwise, <c>false</c>.
        /// </value>
        public bool Withdrawn { get; set; }
    }

    /// <summary>
    /// Class StudentEnrollmentViewModel.
    /// </summary>
    public class StudentEnrollmentViewModel : AvatarViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StudentEnrollmentViewModel"/> class.
        /// </summary>
        public StudentEnrollmentViewModel()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="StudentEnrollmentViewModel"/> class.
        /// </summary>
        /// <param name="student">The student.</param>
        public StudentEnrollmentViewModel(StudentEnrollmentViewModel student)
        {
            this.FullName = student.FullName;
            this.PersonId = student.PersonId;
            this.PeopleId = student.PeopleId;
            this.EmailAddress = student.EmailAddress;
            this.Credits = student.Credits;
            this.HasPicture = student.HasPicture;
            this.StatusCode = student.StatusCode;
            this.StudentAcademicRecords = student.StudentAcademicRecords;
        }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>The credits.</value>
        public string Credits { get; set; }

        /// <summary>
        /// Gets or sets the email address.
        /// </summary>
        /// <value>The email address.</value>
        public string EmailAddress { get; set; }

        /// <summary>
        /// Gets or sets the status code.
        /// </summary>
        /// <value>The status code.</value>
        public string StatusCode { get; set; }

        /// <summary>
        /// Gets or sets the student academic records.
        /// </summary>
        /// <value>The student academic records.</value>
        public List<StudentAcademicRecordViewModel> StudentAcademicRecords { get; set; }
    }

    /// <summary>
    /// StudentPermissionRequestViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Classes.StudentEnrollmentViewModel" />
    public class StudentPermissionRequestViewModel : StudentEnrollmentViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance has override.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has override; otherwise, <c>false</c>.
        /// </value>
        public bool HasOverride { get; set; }

        /// <summary>
        /// Gets or sets the colleagues.
        /// </summary>
        /// <value>
        /// The colleagues.
        /// </value>
        public List<PermissionRequestInfoViewModel> PermissionRequestInfo { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public int StatusPermisionRequest { get; set; }
    }

    /// <summary>
    /// Class WaitlistViewModel.
    /// </summary>
    /// <seealso cref="SelfService.Models.Classes.StudentEnrollmentViewModel" />
    public class StudentWaitlistViewModel : StudentEnrollmentViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StudentWaitlistViewModel" /> class.
        /// </summary>
        public StudentWaitlistViewModel()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="StudentWaitlistViewModel" /> class.
        /// </summary>
        /// <param name="studentWaitlistViewModel">The waitlist view model.</param>
        public StudentWaitlistViewModel(StudentWaitlistViewModel studentWaitlistViewModel) : base(studentWaitlistViewModel)
        {
            this.Attempts = studentWaitlistViewModel.Attempts;
            this.ColorFirstLetter = studentWaitlistViewModel.ColorFirstLetter;
            this.CreditType = studentWaitlistViewModel.CreditType;
            this.DateAdded = studentWaitlistViewModel.DateAdded;
            this.FirstLetter = studentWaitlistViewModel.FirstLetter;
            this.Rank = studentWaitlistViewModel.Rank;
        }

        /// <summary>
        /// Gets or sets the attempts.
        /// </summary>
        /// <value>The attempts.</value>
        public string Attempts { get; set; }

        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>The type of the credit.</value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the date added.
        /// </summary>
        /// <value>The date added.</value>
        public string DateAdded { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is editable.
        /// </summary>
        /// <value><c>true</c> if this instance is editable; otherwise, <c>false</c>.</value>
        public bool IsEditable { get; set; }

        /// <summary>
        /// Gets or sets the rank.
        /// </summary>
        /// <value>The rank.</value>
        public string Rank { get; set; }
    }

    /// <summary>
    /// Class WaitlistViewModel.
    /// </summary>
    /// <seealso cref="SelfService.Models.Classes.SectionListViewModel" />
    public class WaitlistViewModel : SectionListViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="WaitlistViewModel" /> class.
        /// </summary>
        public WaitlistViewModel()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="WaitlistViewModel"/> class.
        /// </summary>
        /// <param name="waitlistViewModel">The waitlist view model.</param>
        public WaitlistViewModel(WaitlistViewModel waitlistViewModel) : base(waitlistViewModel) => Students = waitlistViewModel.Students;

        /// <summary>
        /// Gets or sets a value indicating whether this instance allow save.
        /// </summary>
        /// <value><c>true</c> if this instance allow save; otherwise, <c>false</c>.</value>
        public bool AllowSave { get; set; }

        /// <summary>
        /// Gets or sets the students.
        /// </summary>
        /// <value>The students.</value>
        public List<StudentWaitlistViewModel> Students { get; set; }
    }

    #region Enrollment Download

    /// <summary>
    /// SectionEnrollmentDownloadViewModel
    /// </summary>
    public class SectionEnrollmentDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the resources.
        /// </summary>
        /// <value>
        /// The resources.
        /// </value>
        public SectionEnrollmentResources Resources { get; set; }

        /// <summary>
        /// Gets or sets the advisees.
        /// </summary>
        /// <value>
        /// The advisees.
        /// </value>
        public List<StudentEnrollmentDownload> Students { get; set; }
    }

    /// <summary>
    /// StudentEnrollmentDownload
    /// </summary>
    public class StudentEnrollmentDownload
    {
        /// <summary>
        /// Gets or sets the attendance.
        /// </summary>
        /// <value>
        /// The attendance.
        /// </value>
        public string Attendance { get; set; }

        /// <summary>
        /// Gets or sets the class level.
        /// </summary>
        /// <value>
        /// The class level.
        /// </value>
        public string ClassLevel { get; set; }

        /// <summary>
        /// Gets or sets the class load.
        /// </summary>
        /// <value>
        /// The class load.
        /// </value>
        public string ClassLoad { get; set; }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public string Credits { get; set; }

        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>
        /// The type of the credit.
        /// </value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the curriculum.
        /// </summary>
        /// <value>
        /// The curriculum.
        /// </value>
        public string Curriculum { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public string Status { get; set; }

        /// <summary>
        /// Gets or sets the withdrawn.
        /// </summary>
        /// <value>
        /// The withdrawn.
        /// </value>
        public bool Withdrawn { get; set; }
    }

    #endregion Enrollment Download
}