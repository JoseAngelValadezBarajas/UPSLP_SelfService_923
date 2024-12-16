// --------------------------------------------------------------------
// <copyright file="DossierViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Dossier
{
    /// <summary>
    /// DossierAcademicGpaViewModel
    /// </summary>
    public class DossierAcademicGpaViewModel
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
        /// Gets or sets the attempted credits.
        /// </summary>
        /// <value>
        /// The attempted credits.
        /// </value>
        public string AttemptedCredits { get; set; }

        /// <summary>
        /// Gets or sets the earned credits.
        /// </summary>
        /// <value>
        /// The earned credits.
        /// </value>
        public string EarnedCredits { get; set; }

        /// <summary>
        /// Gets or sets the gpa credits.
        /// </summary>
        /// <value>
        /// The gpa credits.
        /// </value>
        public string GpaCredits { get; set; }

        /// <summary>
        /// Gets or sets the overall gpa.
        /// </summary>
        /// <value>
        /// The overall gpa.
        /// </value>
        public string OverallGpa { get; set; }

        /// <summary>
        /// Gets or sets the quality points.
        /// </summary>
        /// <value>
        /// The quality points.
        /// </value>
        public string QualityPoints { get; set; }

        /// <summary>
        /// Gets or sets the total credits.
        /// </summary>
        /// <value>
        /// The total credits.
        /// </value>
        public string TotalCredits { get; set; }

        /// <summary>
        /// Gets or sets the transfer credits.
        /// </summary>
        /// <value>
        /// The transfer credits.
        /// </value>
        public string TransferCredits { get; set; }
    }

    /// <summary>
    /// DossierAcademicViewModel
    /// </summary>
    public class DossierAcademicViewModel
    {
        /// <summary>
        /// Gets or sets the academic detail.
        /// </summary>
        /// <value>
        /// The academic detail.
        /// </value>
        public DossierAcademicDetail AcademicDetail { get; set; }

        /// <summary>
        /// Gets or sets the cumulative gpa.
        /// </summary>
        /// <value>
        /// The cumulative gpa.
        /// </value>
        public DossierAcademicGpaViewModel CumulativeGpa { get; set; }

        /// <summary>
        /// Gets or sets the current gpa.
        /// </summary>
        /// <value>
        /// The current gpa.
        /// </value>
        public DossierAcademicGpaViewModel CurrentGpa { get; set; }
    }

    /// <summary>
    /// DossierAddressViewModel
    /// </summary>
    public class DossierAddressViewModel
    {
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
        /// Gets or sets the house number.
        /// </summary>
        /// <value>
        /// The house number.
        /// </value>
        public string HouseNumber { get; set; }

        /// <summary>
        /// Gets or sets the line1.
        /// </summary>
        /// <value>
        /// The line1.
        /// </value>
        public string Line1 { get; set; }

        /// <summary>
        /// Gets or sets the line2.
        /// </summary>
        /// <value>
        /// The line2.
        /// </value>
        public string Line2 { get; set; }

        /// <summary>
        /// Gets or sets the line3.
        /// </summary>
        /// <value>
        /// The line3.
        /// </value>
        public string Line3 { get; set; }

        /// <summary>
        /// Gets or sets the line4.
        /// </summary>
        /// <value>
        /// The line4.
        /// </value>
        public string Line4 { get; set; }

        /// <summary>
        /// Gets or sets the state.
        /// </summary>
        /// <value>
        /// The state.
        /// </value>
        public string State { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets the zip code.
        /// </summary>
        /// <value>
        /// The zip code.
        /// </value>
        public string ZipCode { get; set; }
    }

    /// <summary>
    /// DossierContactViewModel
    /// </summary>
    public class DossierContactViewModel
    {
        /// <summary>
        /// Gets or sets the address.
        /// </summary>
        /// <value>
        /// The address.
        /// </value>
        public DossierAddressViewModel Address { get; set; }

        /// <summary>
        /// Gets or sets the emergency contact.
        /// </summary>
        /// <value>
        /// The emergency contact.
        /// </value>
        public DossierEmergencyContactViewModel EmergencyContact { get; set; }

        /// <summary>
        /// Gets or sets the phone.
        /// </summary>
        /// <value>
        /// The phone.
        /// </value>
        public DossierPhoneViewModel Phone { get; set; }

        /// <summary>
        /// Gets or sets the residency.
        /// </summary>
        /// <value>
        /// The residency.
        /// </value>
        public DossierResidencyViewModel Residency { get; set; }
    }

    /// <summary>
    /// DossierEmergencyContact
    /// </summary>
    public class DossierEmergencyContactViewModel
    {
        /// <summary>
        /// Gets or sets the contact country desc1.
        /// </summary>
        /// <value>
        /// The contact country desc1.
        /// </value>
        public string ContactCountryDesc1 { get; set; }

        /// <summary>
        /// Gets or sets the contact country desc2.
        /// </summary>
        /// <value>
        /// The contact country desc2.
        /// </value>
        public string ContactCountryDesc2 { get; set; }

        /// <summary>
        /// Gets or sets the emg contact email1.
        /// </summary>
        /// <value>
        /// The emg contact email1.
        /// </value>
        public string ContactEmail1 { get; set; }

        /// <summary>
        /// Gets or sets the emg contact email2.
        /// </summary>
        /// <value>
        /// The emg contact email2.
        /// </value>
        public string ContactEmail2 { get; set; }

        /// <summary>
        /// Gets or sets the emg contact name1.
        /// </summary>
        /// <value>
        /// The emg contact name1.
        /// </value>
        public string ContactName1 { get; set; }

        /// <summary>
        /// Gets or sets the emg contact name2.
        /// </summary>
        /// <value>
        /// The emg contact name2.
        /// </value>
        public string ContactName2 { get; set; }

        /// <summary>
        /// Gets or sets the emg contact notes1.
        /// </summary>
        /// <value>
        /// The emg contact notes1.
        /// </value>
        public string ContactNotes1 { get; set; }

        /// <summary>
        /// Gets or sets the emg contact notes2.
        /// </summary>
        /// <value>
        /// The emg contact notes2.
        /// </value>
        public string ContactNotes2 { get; set; }

        /// <summary>
        /// Gets or sets the emg contact phone1.
        /// </summary>
        /// <value>
        /// The emg contact phone1.
        /// </value>
        public string ContactPhone1 { get; set; }

        /// <summary>
        /// Gets or sets the emg contact phone2.
        /// </summary>
        /// <value>
        /// The emg contact phone2.
        /// </value>
        public string ContactPhone2 { get; set; }

        /// <summary>
        /// Gets or sets the contact relative desc1.
        /// </summary>
        /// <value>
        /// The contact relative desc1.
        /// </value>
        public string ContactRelDesc1 { get; set; }

        /// <summary>
        /// Gets or sets the contact relative desc2.
        /// </summary>
        /// <value>
        /// The contact relative desc2.
        /// </value>
        public string ContactRelDesc2 { get; set; }
    }

    /// <summary>
    /// DossierHeaderViewModel
    /// </summary>
    public class DossierHeaderViewModel
    {
        /// <summary>
        /// Gets or sets the avatar.
        /// </summary>
        /// <value>
        /// The avatar.
        /// </value>
        public AvatarViewModel Avatar { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the release information.
        /// </summary>
        /// <value>
        /// The release information.
        /// </value>
        public string ReleaseInfo { get; set; }
    }

    /// <summary>
    /// DossierPhoneViewModel
    /// </summary>
    public class DossierPhoneViewModel
    {
        /// <summary>
        /// Gets or sets the country desc.
        /// </summary>
        /// <value>
        /// The country desc.
        /// </value>
        public string CountryDesc { get; set; }

        /// <summary>
        /// Gets or sets the do not call reason desc.
        /// </summary>
        /// <value>
        /// The do not call reason desc.
        /// </value>
        public string DoNotCallReasonDesc { get; set; }

        /// <summary>
        /// Gets or sets the number.
        /// </summary>
        /// <value>
        /// The number.
        /// </value>
        public string Number { get; set; }

        /// <summary>
        /// Gets or sets the type desc.
        /// </summary>
        /// <value>
        /// The type desc.
        /// </value>
        public string TypeDesc { get; set; }
    }

    /// <summary>
    /// DossierResidencyViewModel
    /// </summary>
    public class DossierResidencyViewModel
    {
        /// <summary>
        /// Gets or sets the building.
        /// </summary>
        /// <value>
        /// The building.
        /// </value>
        public string Building { get; set; }

        /// <summary>
        /// Gets or sets the campus country.
        /// </summary>
        /// <value>
        /// The campus country.
        /// </value>
        public string CampusCountry { get; set; }

        /// <summary>
        /// Gets or sets the campus phone.
        /// </summary>
        /// <value>
        /// The campus phone.
        /// </value>
        public string CampusPhone { get; set; }

        /// <summary>
        /// Gets or sets the dorm campus.
        /// </summary>
        /// <value>
        /// The dorm campus.
        /// </value>
        public string DormCampus { get; set; }

        /// <summary>
        /// Gets or sets the room.
        /// </summary>
        /// <value>
        /// The room.
        /// </value>
        public string Room { get; set; }

        /// <summary>
        /// Gets or sets the room identifier.
        /// </summary>
        /// <value>
        /// The room identifier.
        /// </value>
        public string RoomId { get; set; }

        /// <summary>
        /// Gets or sets the room phone.
        /// </summary>
        /// <value>
        /// The room phone.
        /// </value>
        public string RoomPhone { get; set; }
    }

    /// <summary>
    /// DossierViewModel
    /// </summary>
    public class DossierViewModel
    {
        /// <summary>
        /// Gets or sets the dossier academic.
        /// </summary>
        /// <value>
        /// The dossier academic.
        /// </value>
        public DossierAcademicViewModel Academic { get; set; }

        /// <summary>
        /// Gets or sets the dossier association.
        /// </summary>
        /// <value>
        /// The dossier association.
        /// </value>
        public List<DossierAssociation> Associations { get; set; }

        /// <summary>
        /// Gets or sets the dossier contact.
        /// </summary>
        /// <value>
        /// The dossier contact.
        /// </value>
        public DossierContactViewModel Contact { get; set; }

        /// <summary>
        /// Gets or sets the dossier header.
        /// </summary>
        /// <value>
        /// The dossier header.
        /// </value>
        public DossierHeaderViewModel Header { get; set; }

        /// <summary>
        /// Gets or sets the dossier offices.
        /// </summary>
        /// <value>
        /// The dossier offices.
        /// </value>
        public List<DossierResidencyViewModel> Offices { get; set; }

        /// <summary>
        /// Gets or sets the dossier positions.
        /// </summary>
        /// <value>
        /// The dossier positions.
        /// </value>
        public List<DossierPosition> Positions { get; set; }

        /// <summary>
        /// Gets or sets the view details list.
        /// </summary>
        /// <value>
        /// The view details list.
        /// </value>
        public List<DossierViewDetails> ViewDetailsList { get; set; }
    }
}