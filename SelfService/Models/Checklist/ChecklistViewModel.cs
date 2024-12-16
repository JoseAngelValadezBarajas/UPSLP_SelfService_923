// --------------------------------------------------------------------
// <copyright file="ChecklistViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Checklist
{
    // <summary>
    /// <summary>
    /// ChecklistActionViewModel
    /// </summary>
    public class ChecklistActionViewModel
    {
        /// <summary>
        /// Gets or sets the academic session.
        /// </summary>
        /// <value>
        /// The academic session.
        /// </value>
        public string AcademicSession { get; set; }

        /// <summary>
        /// Gets or sets the academic term.
        /// </summary>
        /// <value>
        /// The academic term.
        /// </value>
        public string AcademicTerm { get; set; }

        /// <summary>
        /// Gets or sets the academic year.
        /// </summary>
        /// <value>
        /// The academic year.
        /// </value>
        public string AcademicYear { get; set; }

        /// <summary>
        /// Gets or sets the action identifier.
        /// </summary>
        /// <value>
        /// The action identifier.
        /// </value>
        public string ActionId { get; set; }

        /// <summary>
        /// Gets or sets the name of the action.
        /// </summary>
        /// <value>
        /// The name of the action.
        /// </value>
        public string ActionName { get; set; }

        /// <summary>
        /// Gets or sets the checklist template identifier.
        /// </summary>
        /// <value>
        /// The checklist template identifier.
        /// </value>
        public int ChecklistTemplateId { get; set; }

        /// <summary>
        /// Gets or sets the create datetime.
        /// </summary>
        /// <value>
        /// The create datetime.
        /// </value>
        public string CreateDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets the office identifier.
        /// </summary>
        /// <value>
        /// The office identifier.
        /// </value>
        public int OfficeId { get; set; }
    }

    /// <summary>
    /// ChecklistDetailViewModel
    /// </summary>
    public class ChecklistDetailViewModel
    {
        /// <summary>
        /// Gets or sets the name of the action.
        /// </summary>
        /// <value>
        /// The name of the action.
        /// </value>
        public string ActionName { get; set; }

        /// <summary>
        /// Gets or sets the checklist template identifier.
        /// </summary>
        /// <value>
        /// The checklist template identifier.
        /// </value>
        public int ChecklistTemplateId { get; set; }

        /// <summary>
        /// Gets or sets the create datetime.
        /// </summary>
        /// <value>
        /// The create datetime.
        /// </value>
        public string CreateDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets the office identifier.
        /// </summary>
        /// <value>
        /// The office identifier.
        /// </value>
        public int OfficeId { get; set; }
    }

    /// <summary>
    /// ChecklistMyTasksViewModel
    /// </summary>
    public class ChecklistMyTasksViewModel
    {
        /// <summary>
        /// Gets or sets the office.
        /// </summary>
        /// <value>
        /// The office.
        /// </value>
        public int Category { get; set; }

        /// <summary>
        /// Gets or sets the actions.
        /// </summary>
        /// <value>
        /// The actions.
        /// </value>
        public List<ChecklistMyTaskViewModel> MyTasks { get; set; }
    }

    /// <summary>
    /// ChecklistMyTaskViewModel
    /// </summary>
    public class ChecklistMyTaskViewModel
    {
        /// <summary>
        /// Gets or sets the academic session.
        /// </summary>
        /// <value>
        /// The academic session.
        /// </value>
        public string AcademicSession { get; set; }

        /// <summary>
        /// Gets or sets the academic term.
        /// </summary>
        /// <value>
        /// The academic term.
        /// </value>
        public string AcademicTerm { get; set; }

        /// <summary>
        /// Gets or sets the academic year.
        /// </summary>
        /// <value>
        /// The academic year.
        /// </value>
        public string AcademicYear { get; set; }

        /// <summary>
        /// Gets or sets the action identifier.
        /// </summary>
        /// <value>
        /// The action identifier.
        /// </value>
        public string ActionId { get; set; }

        /// <summary>
        /// Gets or sets the name of the action.
        /// </summary>
        /// <value>
        /// The name of the action.
        /// </value>
        public string ActionName { get; set; }

        /// <summary>
        /// Gets or sets the action scheduled identifier.
        /// </summary>
        /// <value>
        /// The action scheduled identifier.
        /// </value>
        public int ActionScheduledId { get; set; }

        /// <summary>
        /// Gets or sets the address line1.
        /// </summary>
        /// <value>
        /// The address line1.
        /// </value>
        public string AddressLine1 { get; set; }

        /// <summary>
        /// Gets or sets the address line2.
        /// </summary>
        /// <value>
        /// The address line2.
        /// </value>
        public string AddressLine2 { get; set; }

        /// <summary>
        /// Gets or sets the address line3.
        /// </summary>
        /// <value>
        /// The address line3.
        /// </value>
        public string AddressLine3 { get; set; }

        /// <summary>
        /// Gets or sets the address line4.
        /// </summary>
        /// <value>
        /// The address line4.
        /// </value>
        public string AddressLine4 { get; set; }

        /// <summary>
        /// Gets or sets the assigned date.
        /// </summary>
        /// <value>
        /// The assigned date.
        /// </value>
        public string AssignedDate { get; set; }

        /// <summary>
        /// Gets or sets the assigned time.
        /// </summary>
        /// <value>
        /// The assigned time.
        /// </value>
        public string AssignedTime { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public AvatarViewModel Avatar { get; set; }

        /// <summary>
        /// Gets or sets the avatar completed.
        /// </summary>
        /// <value>
        /// The avatar completed.
        /// </value>
        public AvatarViewModel AvatarCompleted { get; set; }

        /// <summary>
        /// Gets or sets the avatar resp.
        /// </summary>
        /// <value>
        /// The avatar resp.
        /// </value>
        public AvatarViewModel AvatarResp { get; set; }

        /// <summary>
        /// Gets or sets the canceled.
        /// </summary>
        /// <value>
        /// The canceled.
        /// </value>
        public bool Canceled { get; set; }

        /// <summary>
        /// Gets or sets the cancel reason.
        /// </summary>
        /// <value>
        /// The cancel reason.
        /// </value>
        public string CancelReason { get; set; }

        /// <summary>
        /// Gets or sets the can edit tasks.
        /// </summary>
        /// <value>
        /// The can edit tasks.
        /// </value>
        public int CanEditTasks { get; set; }

        /// <summary>
        /// Gets or sets the can view details.
        /// </summary>
        /// <value>
        /// The can view details.
        /// </value>
        public int CanViewDetails { get; set; }

        /// <summary>
        /// Gets or sets the can view notes.
        /// </summary>
        /// <value>
        /// The can view notes.
        /// </value>
        public int CanViewNotes { get; set; }

        /// <summary>
        /// Gets or sets the city.
        /// </summary>
        /// <value>
        /// The city.
        /// </value>
        public string City { get; set; }

        /// <summary>
        /// Gets or sets the completed.
        /// </summary>
        /// <value>
        /// The completed.
        /// </value>
        public bool Completed { get; set; }

        /// <summary>
        /// Gets or sets the completed date.
        /// </summary>
        /// <value>
        /// The completed date.
        /// </value>
        public string CompletedDate { get; set; }

        /// <summary>
        /// Gets or sets the country.
        /// </summary>
        /// <value>
        /// The country.
        /// </value>
        public string Country { get; set; }

        /// <summary>
        /// Gets or sets the difference.
        /// </summary>
        /// <value>
        /// The difference.
        /// </value>
        public int Difference { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the house number.
        /// </summary>
        /// <value>
        /// The house number.
        /// </value>
        public string HouseNumber { get; set; }

        /// <summary>
        /// Gets or sets the instruction.
        /// </summary>
        /// <value>
        /// The instruction.
        /// </value>
        public string Instruction { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is per day.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is per day; otherwise, <c>false</c>.
        /// </value>
        public bool IsPerDay { get; set; }

        /// <summary>
        /// Gets or sets the note.
        /// </summary>
        /// <value>
        /// The note.
        /// </value>
        public string Notes { get; set; }

        /// <summary>
        /// Gets or sets the office desc.
        /// </summary>
        /// <value>
        /// The office desc.
        /// </value>
        public string OfficeDesc { get; set; }

        /// <summary>
        /// Gets or sets the office identifier.
        /// </summary>
        /// <value>
        /// The office identifier.
        /// </value>
        public int OfficeId { get; set; }

        /// <summary>
        /// Gets or sets the people code identifier.
        /// </summary>
        /// <value>
        /// The people code identifier.
        /// </value>
        public string PeopleCodeId { get; set; }

        /// <summary>
        /// Gets or sets the people org code identifier.
        /// </summary>
        /// <value>
        /// The people org code identifier.
        /// </value>
        public string PeopleOrgCodeId { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the phone format.
        /// </summary>
        /// <value>
        /// The phone format.
        /// </value>
        public string PhoneFormat { get; set; }

        /// <summary>
        /// Gets or sets the phone number.
        /// </summary>
        /// <value>
        /// The phone number.
        /// </value>
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Gets or sets the priority.
        /// </summary>
        /// <value>
        /// The priority.
        /// </value>
        public string Priority { get; set; }

        /// <summary>
        /// Gets or sets the required.
        /// </summary>
        /// <value>
        /// The required.
        /// </value>
        public string Required { get; set; }

        /// <summary>
        /// Gets or sets the schedule date.
        /// </summary>
        /// <value>
        /// The schedule date.
        /// </value>
        public string ScheduleDate { get; set; }

        /// <summary>
        /// Gets or sets the schedule time.
        /// </summary>
        /// <value>
        /// The schedule time.
        /// </value>
        public string ScheduleTime { get; set; }

        /// <summary>
        /// Gets or sets the state.
        /// </summary>
        /// <value>
        /// The state.
        /// </value>
        public string State { get; set; }

        /// <summary>
        /// Gets or sets the waived.
        /// </summary>
        /// <value>
        /// The waived.
        /// </value>
        public bool Waived { get; set; }

        /// <summary>
        /// Gets or sets the waived reason.
        /// </summary>
        /// <value>
        /// The waived reason.
        /// </value>
        public string WaivedReason { get; set; }

        /// <summary>
        /// Gets or sets the zip code.
        /// </summary>
        /// <value>
        /// The zip code.
        /// </value>
        public string ZipCode { get; set; }
    }

    /// <summary>
    /// ChecklistViewModel
    /// </summary>
    public class ChecklistTasksViewModel
    {
        /// <summary>
        /// Gets or sets the actions.
        /// </summary>
        /// <value>
        /// The actions.
        /// </value>
        public List<ChecklistActionViewModel> Actions { get; set; }

        /// <summary>
        /// Gets or sets the office.
        /// </summary>
        /// <value>
        /// The office.
        /// </value>
        public string OfficeDesc { get; set; }

        /// <summary>
        /// Gets or sets the office identifier.
        /// </summary>
        /// <value>
        /// The office identifier.
        /// </value>
        public int OfficeId { get; set; }
    }

    /// <summary>
    /// ChecklistViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Checklist.ChecklistDetailViewModel" />
    public class ChecklistViewModel : ChecklistDetailViewModel
    {
        /// <summary>
        /// Gets or sets the academic session.
        /// </summary>
        /// <value>
        /// The academic session.
        /// </value>
        public string AcademicSession { get; set; }

        /// <summary>
        /// Gets or sets the academic term.
        /// </summary>
        /// <value>
        /// The academic term.
        /// </value>
        public string AcademicTerm { get; set; }

        /// <summary>
        /// Gets or sets the academic year.
        /// </summary>
        /// <value>
        /// The academic year.
        /// </value>
        public string AcademicYear { get; set; }

        /// <summary>
        /// Gets or sets the action identifier.
        /// </summary>
        /// <value>
        /// The action identifier.
        /// </value>
        public string ActionId { get; set; }

        /// <summary>
        /// Gets or sets the due date.
        /// </summary>
        /// <value>
        /// The due date.
        /// </value>
        public string DueDate { get; set; }

        /// <summary>
        /// Gets or sets the due time.
        /// </summary>
        /// <value>
        /// The due time.
        /// </value>
        public string DueTime { get; set; }

        /// <summary>
        /// Gets or sets the instruction.
        /// </summary>
        /// <value>
        /// The instruction.
        /// </value>
        public string Instruction { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is required; otherwise, <c>false</c>.
        /// </value>
        public bool IsRequired { get; set; }

        /// <summary>
        /// Gets or sets the note.
        /// </summary>
        /// <value>
        /// The note.
        /// </value>
        public string Note { get; set; }

        /// <summary>
        /// Gets or sets the offset days.
        /// </summary>
        /// <value>
        /// The offset days.
        /// </value>
        public short? OffsetDays { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the priority.
        /// </summary>
        /// <value>
        /// The priority.
        /// </value>
        public string Priority { get; set; }
    }
}