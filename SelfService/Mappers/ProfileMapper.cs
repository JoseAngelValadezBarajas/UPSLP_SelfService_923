// --------------------------------------------------------------------
// <copyright file="ProfileMapper.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Account.MyProfile;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace SelfService.Mappers
{
    /// <summary>
    /// ProfileMapper
    /// </summary>
    internal static class ProfileMapper
    {
        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="academic">The academic.</param>
        /// <param name="academicGpas">The academic gpas.</param>
        /// <param name="people">The people.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showPicture">if set to <c>true</c> [show picture].</param>
        /// <param name="picture">The picture.</param>
        /// <param name="general">The general.</param>
        /// <param name="mail">The mail.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static ProfileViewModel ToViewModel(this Academic academic, List<AcademicGpa> academicGpas, People people, string nameFormat, string nameSort,
            bool showPicture, Picture picture, InstitutionSettings.General general, InstitutionSettings.Mail mail, INameFormatService nameFormatService, bool showMiddleNameInitial,
            IPictureHelper pictureHelper)
        {
            ProfileViewModel profile = new();
            if (string.IsNullOrEmpty(nameFormat))
                nameFormat = nameFormatService.GetByCategory(NameFormatCategoryType.FullNameFormat);

            if (string.IsNullOrEmpty(nameSort))
                nameSort = nameFormatService.GetSortByCategory(NameFormatCategoryType.FullNameFormat);

            AvatarViewModel peopleAvatar = people.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);

            profile.Person = new PersonViewModel
            {
                ColorFirstLetter = peopleAvatar != null ? peopleAvatar.ColorFirstLetter : 0,
                Email = people?.Email,
                FirstLetter = peopleAvatar?.FirstLetter,
                FullName = peopleAvatar?.FullName,
                HasPicture = people != null && showPicture && people.HasPicture,
                PersonId = people?.PersonId.Value
            };

            if (academic != null)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                profile.CurriculumGpa = FormatHelper.ToGpa(academic.CurriculumGpa, general.GPA);
                profile.EnrolledCredits = FormatHelper.ToCredits(academic.Credits, general.Credits);
                profile.OverallGpa = FormatHelper.ToGpa(academic.OverallGpa, general.GPA);
                profile.ProgramFormalTitle = academic.ProgramFormalTitle;
                profile.ProgramId = academic.ProgramId;
                profile.RemainingCredits =
                    FormatHelper.ToCredits((academic.CreditsMin - academic.CreditsTaken) < 0 ? 0 : (academic.CreditsMin - academic.CreditsTaken), general.Credits);
                profile.TermAttemptedCredits = FormatHelper.ToCredits(academic.AttemptedCredits, general.Credits);
                profile.TermEarnedCredits = FormatHelper.ToCredits(academic.EarnedCredits, general.Credits);
                profile.Academic = new AcademicViewModel
                {
                    Campus = academic.Campus,
                    ClassLevel = academic.ClassLevel,
                    College = academic.College,
                    CollegeAttend = academic.CollegeAttend,
                    Curriculum = academic.CurriculumDesc,
                    Degree = academic.DegreeDesc,
                    Department = academic.Department,
                    ExpectedGraduation = (!string.IsNullOrEmpty(academic.ExpectedGradMonth) && !string.IsNullOrEmpty(academic.ExpectedGradYear)) ?
                        $"{academic.ExpectedGradMonth}/{academic.ExpectedGradYear}" : string.Empty,
                    FullPart = academic.FullPart,
                    GraduationSession = academic.GraduatedSession,
                    GraduationStatus = academic.Graduated,
                    GraduationTerm = academic.GraduatedTerm,
                    GraduationYear = academic.GraduatedYear,
                    MatriculationPeriod = (academic.IsMatriculated
                        && (!string.IsNullOrEmpty(academic.MatricYear) || !string.IsNullOrEmpty(academic.MatricTerm))) ?
                        $"{academic.MatricYear}/{academic.MatricTerm}/{academic.MatricSession}" : string.Empty,
                    MatriculationDate = FormatHelper.ToShortDate(academic.MatricDate, datetimeCulture),
                    NonTradProgram = academic.NonTradProgram,
                    Population = academic.Population,
                    Program = academic.ProgramDesc,
                    Rating = academic.Rating,
                    Term = academic.Term,
                    TermCreditLimit = FormatHelper.ToCredits(academic.RegisterLimit, general.Credits),
                    TranscriptSequence = academic.TranscriptSeq,
                    Year = academic.Year
                };

                if (academic.Advisor?.PersonId > 0)
                {
                    AvatarViewModel advisorAvatar = academic.Advisor.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                    profile.Academic.Advisor = new PersonViewModel
                    {
                        ColorFirstLetter = advisorAvatar.ColorFirstLetter,
                        Email = academic.Advisor.Email,
                        FirstLetter = advisorAvatar.FirstLetter,
                        FullName = advisorAvatar.FullName,
                        PersonId = academic.Advisor.PersonId.Value
                    };
                    profile.Academic.Advisor.HasPicture = showPicture && academic.Advisor.HasPicture;
                }
                profile.EmailSettings = new EmailSettingsViewModel
                {
                    CanEditRecipient = mail.CanEditRecipient,
                    CanEditSender = mail.CanEditSender,
                    Email = mail.Email,
                    EmailProvider = mail.EmailProvider,
                    Sender = mail.Sender,
                    StaffSeparator = mail.StaffSeparator,
                    StaffUrl = mail.StaffUrl,
                    StudentSeparator = mail.StudentSeparator,
                    StudentUrl = mail.StudentUrl
                };
            }
            if (profile.Academic != null)
                profile.Academic.HistoricalGpa = ToAcademicGpaList(academicGpas, general.GPA);
            if (profile.ProgramId > 0)
                profile.HasProgramPicture = pictureHelper.GetPictureAsync(picture) != null;
            return profile;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="addressTypes">The address types.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<ProfileAddressViewModel> ToViewModel(this List<AddressType> addressTypes, InstitutionSettings.General general)
        {
            List<ProfileAddressViewModel> profileAddressViewModelList = new();
            if (addressTypes != null)
            {
                foreach (AddressType addressType in addressTypes)
                {
                    profileAddressViewModelList.Add(new ProfileAddressViewModel
                    {
                        Addresses = ToProfileAddressList(addressType.Address, general),
                        IsPreferred = addressType.IsPreferred,
                        TypeDesc = addressType.TypeDesc,
                        TypeId = addressType.TypeId
                    });
                }
            }
            return profileAddressViewModelList.OrderByDescending(x => x.IsPreferred).ThenBy(x => x.TypeDesc).ToList();
        }

        /// <summary>
        /// To the ProfileDemographicViewModel list.
        /// </summary>
        /// <param name="demographicDTO">The demographic settings.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <returns></returns>
        internal static List<ProfileDemographicViewModel> ToViewModel(this Demographic demographicDTO, IInstitutionSettingService institutionSettingService)
        {
            List<ProfileDemographicViewModel> profileDemographicDetails = null;
            InstitutionSettings.Demographic settings = institutionSettingService.GetDemographic();
            if (demographicDTO != null && settings != null)
            {
                profileDemographicDetails = new List<ProfileDemographicViewModel>();
                if (settings.Gender.Equals("1") || settings.Gender.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "gender",
                        Description = demographicDTO.GenderDesc,
                        IsRequired = settings.Gender.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending != null ? demographicDTO.DemographicPending.GenderDesc : string.Empty,
                        Value = demographicDTO.Gender
                    });
                }
                if (settings.Ethnicity.Equals("1") || settings.Ethnicity.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "ethnicity",
                        Description = demographicDTO.EthnicityDesc,
                        IsRequired = settings.Ethnicity.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.EthnicityDesc,
                        Value = demographicDTO.EthnicityId
                    });
                }
                if (settings.MaritalStatus.Equals("1") || settings.MaritalStatus.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "maritalStatus",
                        Description = demographicDTO.MaritalStatusDesc,
                        IsRequired = settings.MaritalStatus.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.MaritalStatusDesc,
                        Value = demographicDTO.MaritalStatusId
                    });
                }
                if (settings.Religion.Equals("1") || settings.Religion.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "religion",
                        Description = demographicDTO.ReligionDesc,
                        IsRequired = settings.Religion.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.ReligionDesc,
                        Value = demographicDTO.ReligionId
                    });
                }
                if (settings.RetirementStatus.Equals("1") || settings.RetirementStatus.Equals("2"))
                {
                    string isRetired = string.Empty;
                    string isPendingRetired = string.Empty;

                    if (demographicDTO.IsRetired == null)
                        isRetired = "2";
                    else if ((bool)demographicDTO.IsRetired)
                        isRetired = "1";
                    else
                        isRetired = "0";

                    if (demographicDTO.DemographicPending != null)
                    {
                        if (demographicDTO.DemographicPending.IsRetired == null)
                            isPendingRetired = "2";
                        else if ((bool)demographicDTO.DemographicPending.IsRetired)
                            isPendingRetired = "1";
                        else
                            isPendingRetired = "0";
                    }

                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "retirementStatus",
                        Description = isRetired,
                        IsRequired = settings.RetirementStatus.Equals("2"),
                        PendingDescription = isPendingRetired,
                        Value = Convert.ToInt32(isRetired)
                    });
                }
                if (settings.VeteranStatus.Equals("1") || settings.VeteranStatus.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "veteran",
                        Description = demographicDTO.VeteranDesc,
                        IsRequired = settings.VeteranStatus.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.VeteranDesc,
                        Value = demographicDTO.VeteranId
                    });
                }
                if (settings.PrimaryCitizenship.Equals("1") || settings.PrimaryCitizenship.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "primaryCitizenship",
                        Description = demographicDTO.CitizenshipDesc,
                        IsRequired = settings.PrimaryCitizenship.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.CitizenshipDesc,
                        Value = demographicDTO.CitizenshipId
                    });
                }
                if (settings.SecondaryCitizenship.Equals("1") || settings.SecondaryCitizenship.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "secondaryCitizenship",
                        Description = demographicDTO.SecondaryCitizenshipDesc,
                        IsRequired = settings.SecondaryCitizenship.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.SecondaryCitizenshipDesc,
                        Value = demographicDTO.SecondaryCitizenshipId
                    });
                }
                if (settings.Visa.Equals("1") || settings.Visa.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "visa",
                        Description = demographicDTO.VisaDesc,
                        IsRequired = settings.Visa.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.VisaDesc,
                        Value = demographicDTO.VisaId
                    });
                }
                if (settings.CountryOfBirth.Equals("1") || settings.CountryOfBirth.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "countryOfBirth",
                        Description = demographicDTO.CountryOfBirthDesc,
                        IsRequired = settings.CountryOfBirth.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.CountryOfBirthDesc,
                        Value = demographicDTO.CountryOfBirthId
                    });
                }
                if (settings.PrimaryLanguage.Equals("1") || settings.PrimaryLanguage.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "primaryLanguage",
                        Description = demographicDTO.Language,
                        IsRequired = settings.PrimaryLanguage.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.Language,
                        Value = demographicDTO.LanguageId
                    });
                }
                if (settings.SecondaryLanguage.Equals("1") || settings.SecondaryLanguage.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "secondaryLanguage",
                        Description = demographicDTO.SecondaryLanguageDesc,
                        IsRequired = settings.SecondaryLanguage.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending?.SecondaryLanguageDesc,
                        Value = demographicDTO.SecondaryLanguageId
                    });
                }
                if (settings.MonthsInCountry.Equals("1") || settings.MonthsInCountry.Equals("2"))
                {
                    profileDemographicDetails.Add(new ProfileDemographicViewModel
                    {
                        Id = "monthsInCountry",
                        Description = demographicDTO.MonthsInCountry.ToString(),
                        IsRequired = settings.MonthsInCountry.Equals("2"),
                        PendingDescription = demographicDTO.DemographicPending != null ? demographicDTO.DemographicPending.MonthsInCountry.ToString() : string.Empty
                    });
                }
            }
            return profileDemographicDetails;
        }

        /// <summary>
        /// To the historical gpa list.
        /// </summary>
        /// <param name="academicGpas">The academic gpas.</param>
        /// <param name="formatGpa">The format gpa.</param>
        /// <returns></returns>
        /// <exception cref="System.NotImplementedException"></exception>
        private static List<AcademicGpaViewModel> ToAcademicGpaList(List<AcademicGpa> academicGpas, string formatGpa)
        {
            List<AcademicGpaViewModel> academicGpaListViewModel = null;
            if (academicGpas?.Count() > 0)
            {
                academicGpas = academicGpas.OrderByDescending(x => x.Year).ThenByDescending(x => x.TermSortOrder).ToList();
                academicGpaListViewModel = new List<AcademicGpaViewModel>();
                foreach (AcademicGpa academicGpaDTO in academicGpas)
                {
                    academicGpaListViewModel.Add(new AcademicGpaViewModel
                    {
                        Gpa = FormatHelper.ToGpa(academicGpaDTO.Gpa, formatGpa),
                        YearTerm = $"{academicGpaDTO.Year}/{academicGpaDTO.Term}"
                    });
                }
            }
            return academicGpaListViewModel;
        }

        /// <summary>
        /// To the profile address list.
        /// </summary>
        /// <param name="addressTypeDetailList">The address type detail list.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        private static List<ProfileAddressDetailViewModel> ToProfileAddressList(List<AddressTypeDetail> addressTypeDetailList, InstitutionSettings.General general)
        {
            List<ProfileAddressDetailViewModel> addresses = null;
            if (addressTypeDetailList?.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                addresses = new List<ProfileAddressDetailViewModel>();
                foreach (AddressTypeDetail detail in addressTypeDetailList.OrderBy(x => x.StartDate))
                {
                    StringBuilder line5 = new();
                    if (!string.IsNullOrEmpty(detail.City))
                        line5.Append(detail.City).Append(", ");
                    if (!string.IsNullOrEmpty(detail.State))
                        line5.Append(detail.State).Append(' ');
                    if (!string.IsNullOrEmpty(detail.ZipCode))
                        line5.Append(detail.ZipCode).Append(' ');
                    addresses.Add(new ProfileAddressDetailViewModel
                    {
                        ActiveDate = FormatHelper.ToShortDate(detail.StartDate, datetimeCulture),
                        AddressApprovalRequestId = detail.AddressApprovalRequestId,
                        AddressLine1 = detail.AddressLine1,
                        AddressLine2 = detail.AddressLine2,
                        AddressLine3 = detail.AddressLine3,
                        AddressLine4 = detail.AddressLine4,
                        AddressLine5 = line5.ToString(),
                        ApprovedStatus = detail.ApprovedStatus,
                        EffectiveDate = FormatHelper.ToDatePicker(detail.StartDate),
                        HouseNumber = detail.HouseNumber,
                        IsCurrentAddress = detail.IsCurrentAddress,
                        IsPreferred = detail.IsPreferred,
                        SequenceNumber = detail.SequenceNo,
                    });
                }
            }
            return addresses;
        }
    }
}