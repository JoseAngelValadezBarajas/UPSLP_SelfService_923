// --------------------------------------------------------------------
// <copyright file="DossierMapper.cs" company="Ellucian">
//     Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Dossier;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Mappers
{
    /// <summary>
    /// DossierMapper
    /// </summary>
    internal static class DossierMapper
    {
        /// <summary>
        /// Converts to dossier view model.
        /// </summary>
        /// <param name="dossier">The dossier.</param>
        /// <param name="dossierSetup">The dossier setup.</param>
        /// <param name="personId">The person identifier.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showPicture">if set to <c>true</c> [show picture].</param>
        /// <param name="general">The general.</param>
        /// <param name="emergencySettings">The emergency settings.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static DossierViewModel ToViewModel(this Dossier dossier, List<DossierSetup> dossierSetup, int personId,
            string nameFormat, string nameSort, bool showPicture, InstitutionSettings.General general,
            InstitutionSettings.EmergencyContacts emergencySettings, bool showMiddleNameInitial)
        {
            if (dossier == null || dossierSetup == null || dossierSetup?.Count == 0)
                return null;

            DossierViewModel dossierViewModel = new()
            {
                Header = GetDossierHeader(dossier.Header, personId, nameFormat, nameSort, showPicture, general, showMiddleNameInitial),
                Academic = GetAcademic(dossier.Academic, general),
                Contact = GetContact(dossier.Contact, emergencySettings),
                Associations = dossier.Associations,
                Offices = GetOffices(dossier.Offices),
                Positions = dossier.Positions,
                ViewDetailsList = dossier.ViewDetailsList
            };

            return dossierViewModel;
        }

        #region Private Methods

        /// <summary>
        /// Gets the academic.
        /// </summary>
        /// <param name="dossierAcademic">The dossier academic.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        private static DossierAcademicViewModel GetAcademic(DossierAcademic dossierAcademic, InstitutionSettings.General general)
        {
            if (dossierAcademic == null)
                return null;
            DossierAcademicViewModel dossierAcademicViewModel = new();
            if (dossierAcademic.AcademicDetail != null)
            {
                dossierAcademicViewModel.AcademicDetail = new DossierAcademicDetail
                {
                    AcademicSession = dossierAcademic.AcademicDetail.AcademicSession,
                    AcademicTerm = dossierAcademic.AcademicDetail.AcademicTerm,
                    AcademicYear = dossierAcademic.AcademicDetail.AcademicYear,
                    Curriculum = dossierAcademic.AcademicDetail.Curriculum,
                    Degree = dossierAcademic.AcademicDetail.Degree,
                    FormalTitle = dossierAcademic.AcademicDetail.FormalTitle,
                    Program = dossierAcademic.AcademicDetail.Program
                };
            }
            dossierAcademicViewModel.CumulativeGpa = GetAcademicGpa(dossierAcademic.CumulativeGpa, general);
            dossierAcademicViewModel.CurrentGpa = GetAcademicGpa(dossierAcademic.CurrentGpa, general);
            return dossierAcademicViewModel;
        }

        /// <summary>
        /// Gets the academic gpa.
        /// </summary>
        /// <param name="dossierAcademicGpa">The dossier academic gpa.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        private static DossierAcademicGpaViewModel GetAcademicGpa(DossierAcademicGpa dossierAcademicGpa, InstitutionSettings.General general)
        {
            if (dossierAcademicGpa == null)
                return null;
            return new DossierAcademicGpaViewModel
            {
                AcademicSession = dossierAcademicGpa.AcademicSession,
                AcademicTerm = dossierAcademicGpa.AcademicTerm,
                AcademicYear = dossierAcademicGpa.AcademicYear,
                AttemptedCredits = FormatHelper.ToCredits(dossierAcademicGpa.AttemptedCredits, general.Credits),
                EarnedCredits = FormatHelper.ToCredits(dossierAcademicGpa.EarnedCredits, general.Credits),
                GpaCredits = FormatHelper.ToCredits(dossierAcademicGpa.GpaCredits, general.Credits),
                OverallGpa = FormatHelper.ToGpa(dossierAcademicGpa.OverallGpa, general.GPA),
                QualityPoints = FormatHelper.ToQualityPoints(dossierAcademicGpa.QualityPoints, general.QualityPoints),
                TotalCredits = FormatHelper.ToCredits(dossierAcademicGpa.TotalCredits, general.Credits),
                TransferCredits = FormatHelper.ToCredits(dossierAcademicGpa.TransferCredits, general.Credits)
            };
        }

        /// <summary>
        /// Gets the contact.
        /// </summary>
        /// <param name="dossierContact">The dossier contact.</param>
        /// <param name="emergencySettings">The emergency settings.</param>
        /// <returns></returns>
        private static DossierContactViewModel GetContact(DossierContact dossierContact, InstitutionSettings.EmergencyContacts emergencySettings)
        {
            if (dossierContact == null)
                return null;
            return new DossierContactViewModel
            {
                Address = GetDossierAddress(dossierContact.Address),
                EmergencyContact = GetDossierEmergency(dossierContact.EmergencyContact, emergencySettings),
                Phone = GetDossierPhone(dossierContact.Phone),
                Residency = GetDossierResidency(dossierContact.Residency)
            };
        }

        /// <summary>
        /// Gets the dossier address.
        /// </summary>
        /// <param name="addressInformation">The address information.</param>
        /// <returns></returns>
        private static DossierAddressViewModel GetDossierAddress(DossierAddress addressInformation)
        {
            if (addressInformation == null)
                return null;
            return new DossierAddressViewModel
            {
                City = addressInformation.City,
                Country = addressInformation.Country,
                HouseNumber = addressInformation.HouseNumber,
                Line1 = addressInformation.AddLine1,
                Line2 = addressInformation.AddLine2,
                Line3 = addressInformation.AddLine3,
                Line4 = addressInformation.AddLine4,
                State = addressInformation.State,
                Type = addressInformation.TypeDesc,
                ZipCode = addressInformation.ZipCode
            };
        }

        /// <summary>
        /// Gets the dossier emergency.
        /// </summary>
        /// <param name="emergencyContactInfo">The emergency contact information.</param>
        /// <param name="settings">The emergency settings.</param>
        /// <returns></returns>
        private static DossierEmergencyContactViewModel GetDossierEmergency(PeopleEmergencyDetail emergencyContactInfo,
            InstitutionSettings.EmergencyContacts settings)
        {
            if (emergencyContactInfo == null)
                return null;
            return new DossierEmergencyContactViewModel
            {
                ContactCountryDesc1 = settings.Country.Equals("1") ? emergencyContactInfo.ContactCountryDesc1 : string.Empty,
                ContactCountryDesc2 = settings.Country.Equals("1") ? emergencyContactInfo.ContactCountryDesc2 : string.Empty,
                ContactEmail1 = settings.Email.Equals("1") ? emergencyContactInfo.ContactEmail1 : string.Empty,
                ContactEmail2 = settings.Email.Equals("1") ? emergencyContactInfo.ContactEmail2 : string.Empty,
                ContactName1 = emergencyContactInfo.ContactName1,
                ContactName2 = emergencyContactInfo.ContactName2,
                ContactNotes1 = settings.Notes.Equals("1") ? emergencyContactInfo.ContactNotes1 : string.Empty,
                ContactNotes2 = settings.Notes.Equals("1") ? emergencyContactInfo.ContactNotes2 : string.Empty,
                ContactPhone1 = FormatHelper.ToPhoneNumber(emergencyContactInfo.PhoneFormat1, emergencyContactInfo.ContactPhone1),
                ContactPhone2 = FormatHelper.ToPhoneNumber(emergencyContactInfo.PhoneFormat2, emergencyContactInfo.ContactPhone2),
                ContactRelDesc1 = emergencyContactInfo.ContactRelDesc1,
                ContactRelDesc2 = emergencyContactInfo.ContactRelDesc2
            };
        }

        /// <summary>
        /// Gets the dossier header.
        /// </summary>
        /// <param name="dossierHeader">The dossier header.</param>
        /// <param name="personId">The person identifier.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showPicture">if set to <c>true</c> [show picture].</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        private static DossierHeaderViewModel GetDossierHeader(DossierHeader dossierHeader, int personId,
            string nameFormat, string nameSort, bool showPicture, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            People people = new()
            {
                DisplayName = dossierHeader.DisplayName,
                FirstName = dossierHeader.FirstName,
                LastName = dossierHeader.LastName,
                LastNamePrefix = dossierHeader.LastNamePrefix,
                MiddleName = dossierHeader.MiddleName,
                PeopleId = dossierHeader.PeopleId,
                PersonId = personId,
                Prefix = dossierHeader.Prefix,
                Pronoun = dossierHeader.Pronoun,
                Suffix = dossierHeader.Suffix
            };
            AvatarViewModel avatar = people.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
            avatar.HasPicture = dossierHeader.HasPicture && showPicture;
            avatar.PeopleId = FormatHelper.ToPeopleId(avatar.PeopleId, general.PeopleIdFormat);
            DossierHeaderViewModel dossierHeaderViewModel = new()
            {
                Avatar = avatar,
                Email = dossierHeader.Email,
                ReleaseInfo = dossierHeader.ReleaseInfo
            };
            return dossierHeaderViewModel;
        }

        /// <summary>
        /// Gets the dossier phone.
        /// </summary>
        /// <param name="phoneInformation">The phone information.</param>
        /// <returns></returns>
        private static DossierPhoneViewModel GetDossierPhone(PersonPhone phoneInformation)
        {
            if (phoneInformation == null)
                return null;
            return new DossierPhoneViewModel
            {
                CountryDesc = phoneInformation.CountryDesc,
                DoNotCallReasonDesc = phoneInformation.DoNotCallReasonDesc,
                TypeDesc = phoneInformation.TypeDesc,
                Number = FormatHelper.ToPhoneNumber(phoneInformation.Format, phoneInformation.Number)
            };
        }

        /// <summary>
        /// Gets the dossier residency.
        /// </summary>
        /// <param name="residencyInformation">The residency information.</param>
        /// <returns></returns>
        private static DossierResidencyViewModel GetDossierResidency(DossierResidency residencyInformation)
        {
            if (residencyInformation == null)
                return null;
            return new DossierResidencyViewModel
            {
                Building = residencyInformation.Building,
                CampusCountry = residencyInformation.CampusCountry,
                CampusPhone = FormatHelper.ToPhoneNumber(residencyInformation.PhoneFormat, residencyInformation.CampusPhone),
                DormCampus = residencyInformation.DormCampus,
                Room = residencyInformation.Room,
                RoomId = residencyInformation.RoomId,
                RoomPhone = FormatHelper.ToPhoneNumber(residencyInformation.PhoneFormat, residencyInformation.RoomPhone)
            };
        }

        /// <summary>
        /// Gets the offices.
        /// </summary>
        /// <param name="offices">The offices.</param>
        /// <returns></returns>
        private static List<DossierResidencyViewModel> GetOffices(List<DossierResidency> offices)
        {
            List<DossierResidencyViewModel> officesViewModel = null;
            if (offices != null)
            {
                officesViewModel = new List<DossierResidencyViewModel>();
                foreach (DossierResidency office in offices)
                    officesViewModel.Add(GetDossierResidency(office));
            }
            return officesViewModel;
        }

        #endregion Private Methods
    }
}