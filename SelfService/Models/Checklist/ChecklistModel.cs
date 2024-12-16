// --------------------------------------------------------------------
// <copyright file="ChecklistModel.cs" company="Ellucian">
//     Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;
using SelfService.Models.Shared;

namespace SelfService.Models.Checklist
{
    public class ChecklistActionModel : ChecklistModel
    {
        /// <summary>
        /// Gets or sets the action schedule identifier.
        /// </summary>
        /// <value>
        /// The action schedule identifier.
        /// </value>
        public int ActionScheduleId { get; set; }

        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the responsible identifier.
        /// </summary>
        /// <value>
        /// The responsible identifier.
        /// </value>
        public int ResponsibleId { get; set; }
    }

    /// <summary>
    /// ChecklistModel
    /// </summary>
    public class ChecklistModel
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
        /// Gets or sets the checklist template identifier.
        /// </summary>
        /// <value>
        /// The checklist template identifier.
        /// </value>
        public int ChecklistTemplateId { get; set; }

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
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

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
        /// Gets or sets the office identifier.
        /// </summary>
        /// <value>
        /// The office identifier.
        /// </value>
        public int OfficeId { get; set; }

        /// <summary>
        /// Gets or sets the offset days.
        /// </summary>
        /// <value>
        /// The offset days.
        /// </value>
        public short? OffsetDays { get; set; }

        /// <summary>
        /// Gets or sets the option.
        /// </summary>
        /// <value>
        /// The option.
        /// </value>
        public int Option { get; set; }

        /// <summary>
        /// Gets or sets the priority.
        /// </summary>
        /// <value>
        /// The priority.
        /// </value>
        public string Priority { get; set; }
    }

    /// <summary>
    /// ChecklistResponsibleModel
    /// </summary>
    public class ChecklistResponsibleModel
    {
        /// <summary>
        /// Gets or sets the action identifier.
        /// </summary>
        /// <value>
        /// The action identifier.
        /// </value>
        public string ActionId { get; set; }

        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the office identifier.
        /// </summary>
        /// <value>
        /// The office identifier.
        /// </value>
        public int OfficeId { get; set; }
    }

    /// <summary>
    /// ContactInformationViewModel
    /// </summary>
    public class ContactInformationViewModel
    {
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
        /// Gets or sets the avatar.
        /// </summary>
        /// <value>
        /// The avatar.
        /// </value>
        public AvatarViewModel Avatar { get; set; }

        /// <summary>
        /// Gets or sets the city.
        /// </summary>
        /// <value>
        /// The city.
        /// </value>
        public string City { get; set; }

        /// <summary>
        /// Gets or sets the country.
        /// </summary>
        /// <value>
        /// The country.
        /// </value>
        public string Country { get; set; }

        /// <summary>
        /// Gets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; internal set; }

        /// <summary>
        /// Gets the house number.
        /// </summary>
        /// <value>
        /// The house number.
        /// </value>
        public string HouseNumber { get; internal set; }

        /// <summary>
        /// Gets the phone format.
        /// </summary>
        /// <value>
        /// The phone format.
        /// </value>
        public string PhoneFormat { get; internal set; }

        /// <summary>
        /// Gets or sets the phone number.
        /// </summary>
        /// <value>
        /// The phone number.
        /// </value>
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Gets the state.
        /// </summary>
        /// <value>
        /// The state.
        /// </value>
        public string State { get; internal set; }

        /// <summary>
        /// Gets or sets the zip code.
        /// </summary>
        /// <value>
        /// The zip code.
        /// </value>
        public string ZipCode { get; set; }
    }
}