// --------------------------------------------------------------------
// <copyright file="ScheduleViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Section;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Students
{
    /// <summary>
    /// AcademicInformationViewModel
    /// </summary>
    public class AcademicInformationViewModel
    {
        /// <summary>
        /// Gets or sets the advisors.
        /// </summary>
        /// <value>
        /// The advisors.
        /// </value>
        public string Advisors { get; set; }

        /// <summary>
        /// Gets or sets the curriculum.
        /// </summary>
        /// <value>
        /// The curriculum.
        /// </value>
        public string Curriculum { get; set; }

        /// <summary>
        /// Gets or sets the program degree.
        /// </summary>
        /// <value>
        /// The program degree.
        /// </value>
        public string ProgramDegree { get; set; }
    }

    /// <summary>
    /// AdvisorApprovalInfoViewModel
    /// </summary>
    public class AdvisorApprovalInfoViewModel
    {
        /// <summary>
        /// Gets or sets the request date.
        /// </summary>
        /// <value>
        /// The decision date.
        /// </value>
        public string DecisionDate { get; set; }

        /// <summary>
        /// Gets or sets the faculty information.
        /// </summary>
        /// <value>
        /// The faculty information.
        /// </value>
        public AvatarViewModel FacultyInfo { get; set; }

        /// <summary>
        /// Gets or sets the reason.
        /// </summary>
        /// <value>
        /// The reason.
        /// </value>
        public string Reason { get; set; }
    }

    /// <summary>
    /// BlockStudentScheduleViewModel
    /// </summary>
    public class BlockStudentScheduleViewModel
    {
        /// <summary>
        /// Gets a value indicating whether [allow changes].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [allow changes]; otherwise, <c>false</c>.
        /// </value>
        public bool AllowChanges { get; set; }

        /// <summary>
        /// Gets the block registration rule group identifier.
        /// </summary>
        /// <value>
        /// The block registration rule group identifier.
        /// </value>
        public object BlockRegistrationRuleGroupId { get; set; }

        /// <summary>
        /// Gets or sets the block reg rule group block identifier.
        /// </summary>
        /// <value>
        /// The block reg rule group block identifier.
        /// </value>
        public int? BlockRegRuleGroupBlockId { get; set; }

        /// <summary>
        /// Gets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets the number of sections.
        /// </summary>
        /// <value>
        /// The number of sections.
        /// </value>
        public int NumberOfSections { get; set; }

        /// <summary>
        /// Gets or sets the order.
        /// </summary>
        /// <value>
        /// The order.
        /// </value>
        public short Order { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show drop].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show drop]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowDrop { get; set; }

        /// <summary>
        /// Gets or sets the student schedule.
        /// </summary>
        /// <value>
        /// The student schedule.
        /// </value>
        public List<List<StudentScheduleViewModel>> StudentSchedule { get; set; }
    }

    /// <summary>
    /// PermissionRequestInfoViewModel
    /// </summary>
    public class PermissionRequestInfoViewModel
    {
        /// <summary>
        /// Gets or sets the faculty information.
        /// </summary>
        /// <value>
        /// The faculty information.
        /// </value>
        public AvatarViewModel FacultyInfo { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is my information.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is my information; otherwise, <c>false</c>.
        /// </value>
        public bool IsMyInfo { get; set; }

        /// <summary>
        /// Gets or sets the override comments.
        /// </summary>
        /// <value>
        /// The override comments.
        /// </value>
        public string OverrideComments { get; set; }

        /// <summary>
        /// Gets or sets the override date.
        /// </summary>
        /// <value>
        /// The override date.
        /// </value>
        public string OverrideDate { get; set; }

        /// <summary>
        /// Gets or sets the override identifier.
        /// </summary>
        /// <value>
        /// The override identifier.
        /// </value>
        public string OverrideId { get; set; }

        /// <summary>
        /// Gets or sets the override information.
        /// </summary>
        /// <value>
        /// The override information.
        /// </value>
        public AvatarViewModel OverrideInfo { get; set; }

        /// <summary>
        /// Gets or sets the permission comments.
        /// </summary>
        /// <value>
        /// The permission comments.
        /// </value>
        public string PermissionComments { get; set; }

        /// <summary>
        /// Gets or sets the permission date.
        /// </summary>
        /// <value>
        /// The permission date.
        /// </value>
        public string PermissionDate { get; set; }

        /// <summary>
        /// Gets or sets the request date.
        /// </summary>
        /// <value>
        /// The request date.
        /// </value>
        public string RequestDate { get; set; }

        /// <summary>
        /// Gets or sets the status permision request.
        /// 0 = Approved
        /// 1 = Denied
        /// >=2 Pending
        /// </summary>
        /// <value>
        /// The status permision request.
        /// </value>
        public int StatusPermisionRequest { get; set; }

        /// <summary>
        /// Gets or sets the student comments.
        /// </summary>
        /// <value>
        /// The student comments.
        /// </value>
        public string StudentComments { get; set; }
    }

    /// <summary>
    /// PermissionRequestModel
    /// </summary>
    public class PermissionRequestModel
    {
        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public string Comments { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public int Status { get; set; }
    }

    /// <summary>
    /// SectionsSessionViewModel
    /// </summary>
    public class SectionsSessionViewModel
    {
        /// <summary>
        /// Gets or sets the sections.
        /// </summary>
        /// <value>
        /// The sections.
        /// </value>
        public List<List<StudentScheduleViewModel>> Sections { get; set; }

        /// <summary>
        /// Gets or sets the session code.
        /// </summary>
        /// <value>
        /// The session code.
        /// </value>
        public string Session { get; set; }

        /// <summary>
        /// Gets or sets the session desc.
        /// </summary>
        /// <value>
        /// The session desc.
        /// </value>
        public string SessionDesc { get; set; }
    }

    /// <summary>
    ///  StudentScheduleViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Section.SectionViewModel" />
    public class StudentScheduleViewModel : SectionViewModel
    {
        /// <summary>
        /// Gets or sets the advisor approval information.
        /// </summary>
        /// <value>
        /// The advisor approval information.
        /// </value>
        public AdvisorApprovalInfoViewModel AdvisorApprovalInfo { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [authorization needed].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [authorization needed]; otherwise, <c>false</c>.
        /// </value>
        public bool AuthorizationNeeded { get; set; }

        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>
        /// The type of the credit.
        /// </value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the credit type description.
        /// </summary>
        /// <value>
        /// The credit type description.
        /// </value>
        public string CreditTypeDescription { get; set; }

        /// <summary>
        /// Gets or sets the credit types.
        /// </summary>
        /// <value>
        /// The credit types.
        /// </value>
        public List<ListOptionViewModel> CreditTypes { get; set; }

        /// <summary>
        /// Gets or sets the decision.
        /// </summary>
        /// <value>
        /// The decision.
        /// </value>
        public int Decision { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has attendance.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has attendance; otherwise, <c>false</c>.
        /// </value>
        public bool HasAttendance { get; set; }

        /// <summary>
        /// Gets or sets the name of the instructor.
        /// </summary>
        /// <value>
        /// The name of the instructor.
        /// </value>
        public string InstructorName { get; set; }

        /// <summary>
        /// Gets or sets the instructor.
        /// </summary>
        /// <value>
        /// The instructor.
        /// </value>
        public int InstructorsCount { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is approved.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is approved; otherwise, <c>false</c>.
        /// </value>
        public bool IsApproved { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is denied.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is denied; otherwise, <c>false</c>.
        /// </value>
        public bool IsDenied { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is holding.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is holding; otherwise, <c>false</c>.
        /// </value>
        public bool IsHolding { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is in cart.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is in cart; otherwise, <c>false</c>.
        /// </value>
        public bool IsInCart { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is in waitlist.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is in waitlist; otherwise, <c>false</c>.
        /// </value>
        public bool IsInWaitlist { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is pending.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is pending; otherwise, <c>false</c>.
        /// </value>
        public bool IsPending { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is permission required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is permission required; otherwise, <c>false</c>.
        /// </value>
        public bool IsPermissionRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is registered.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is registered; otherwise, <c>false</c>.
        /// </value>
        public bool IsRegistered { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is wait list pending.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is wait list pending; otherwise, <c>false</c>.
        /// </value>
        public bool IsWaitListPending { get; set; }

        /// <summary>
        /// Gets or sets the pending expires date.
        /// </summary>
        /// <value>
        /// The pending expires date.
        /// </value>
        public string PendingExpiresDate { get; set; }

        /// <summary>
        /// Gets or sets the pending expires time.
        /// </summary>
        /// <value>
        /// The pending expires time.
        /// </value>
        public string PendingExpiresTime { get; set; }

        /// <summary>
        /// Gets or sets the permission request information.
        /// </summary>
        /// <value>
        /// The permission request information.
        /// </value>
        public List<PermissionRequestInfoViewModel> PermissionRequestInfo { get; set; }

        /// <summary>
        /// Gets the name of the schedule BLDG.
        /// </summary>
        /// <value>
        /// The name of the schedule BLDG.
        /// </value>
        public string ScheduleBldgName { get; set; }

        /// <summary>
        /// Gets the schedule day desc.
        /// </summary>
        /// <value>
        /// The schedule day desc.
        /// </value>
        public string ScheduleDayDesc { get; set; }

        /// <summary>
        /// Gets the schedule end time.
        /// </summary>
        /// <value>
        /// The schedule end time.
        /// </value>
        public string ScheduleEndTime { get; set; }

        /// <summary>
        /// Gets the schedule floor identifier.
        /// </summary>
        /// <value>
        /// The schedule floor identifier.
        /// </value>
        public string ScheduleFloorId { get; set; }

        /// <summary>
        /// Gets the name of the schedule org.
        /// </summary>
        /// <value>
        /// The name of the schedule org.
        /// </value>
        public string ScheduleOrgName { get; set; }

        /// <summary>
        /// Gets the schedule room identifier.
        /// </summary>
        /// <value>
        /// The schedule room identifier.
        /// </value>
        public string ScheduleRoomId { get; set; }

        /// <summary>
        /// Gets the schedules count.
        /// </summary>
        /// <value>
        /// The schedules count.
        /// </value>
        public int SchedulesCount { get; set; }

        /// <summary>
        /// Gets the schedule start time.
        /// </summary>
        /// <value>
        /// The schedule start time.
        /// </value>
        public string ScheduleStartTime { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show drop].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show drop]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowDrop { get; set; }
    }
}