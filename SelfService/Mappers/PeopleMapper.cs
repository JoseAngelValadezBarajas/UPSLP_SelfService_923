// --------------------------------------------------------------------
// <copyright file="PeopleMapper.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
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
using SelfService.Models.Administration.Requests;
using SelfService.Models.Checklist;
using SelfService.Models.Session;
using SelfService.Models.Shared;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace SelfService.Mappers
{
    /// <summary>
    /// A mapper for people
    /// </summary>
    internal static class PeopleMapper
    {
        /// <summary>
        /// Converts to contactviewmodel.
        /// </summary>
        /// <param name="people">The people.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <returns></returns>
        internal static ContactInformationViewModel ToContactViewModel(this People people, string nameFormat, string nameSort, bool showMiddleNameInitial, string peopleFormat = null)
        {
            ContactInformationViewModel contactInformationViewModel = new()
            {
                AddressLine1 = people.Address.AddLine1,
                AddressLine2 = people.Address.AddLine2,
                AddressLine3 = people.Address.AddLine3,
                AddressLine4 = people.Address.AddLine4,
                Avatar = people.ToViewModel(nameFormat, nameSort, showMiddleNameInitial, peopleFormat),
                City = people.Address.City,
                Country = people.Address.Country,
                Email = people.Email,
                HouseNumber = people.Address.HouseNumber,
                PhoneFormat = people.Phone.Format,
                PhoneNumber = people.Phone.Number,
                State = people.Address.State,
                ZipCode = people.Address.ZipCode,
            };
            return contactInformationViewModel;
        }

        /// <summary>
        /// Converts to model.
        /// </summary>
        /// <param name="profileGenderIdentityModel">The profile gender identity model.</param>
        /// <returns></returns>
        internal static GenderIdentity ToModel(this ProfileGenderIdentityModel profileGenderIdentityModel)
        {
            if (profileGenderIdentityModel == null)
                return null;
            return new GenderIdentity
            {
                Id = profileGenderIdentityModel.GenderIdentityId,
                DisplayName = profileGenderIdentityModel.DisplayName,
                PronounId = profileGenderIdentityModel.PronounId
            };
        }

        /// <summary>
        /// Map from People to full name of people
        /// </summary>
        /// <param name="peopleDTO">The people dto.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns>
        /// string.
        /// </returns>
        internal static string ToViewModel(this People peopleDTO, INameFormatService nameFormatService, bool showMiddleNameInitial)
        {
            string people = string.Empty;

            if (peopleDTO != null)
            {
                string formatFullName = nameFormatService.GetByCategory(NameFormatCategoryType.FullNameFormat);
                people = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(
                    new string[]
                    {
                        peopleDTO.Prefix,
                        peopleDTO.FirstName,
                        peopleDTO.MiddleName,
                        peopleDTO.LastNamePrefix,
                        peopleDTO.LastName,
                        peopleDTO.DisplayName,
                        peopleDTO.Pronoun,
                        peopleDTO.Suffix
                    }), formatFullName, showMiddleNameInitial);
            }

            return people;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="stopLists">The stop lists.</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns></returns>
        internal static List<StopListViewModel> ToViewModel(this List<StopList> stopLists, string dateTimeCultureFormat)
        {
            List<StopListViewModel> stopListViewModelList = null;
            if (stopLists?.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);
                stopListViewModelList = new List<StopListViewModel>();
                foreach (StopList stopList in stopLists)
                {
                    stopListViewModelList.Add(new StopListViewModel
                    {
                        Comments = stopList.Comments,
                        Date = FormatHelper.ToShortDate(stopList.Date, datetimeCulture),
                        IsGradesStop = stopList.IsGradesStop,
                        IsRegistrationStop = stopList.IsRegistrationStop,
                        Reason = stopList.Reason
                    });
                }
            }
            return stopListViewModelList;
        }

        /// <summary>
        /// Map People to ProfileAccountViewModel
        /// </summary>
        /// <param name="people">The people.</param>
        /// <param name="account">The account.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static ProfileAccountViewModel ToViewModel(this People people, Account account, InstitutionSettings.General general)
        {
            ProfileAccountViewModel profileAccountViewModel = null;
            if (people != null)
            {
                StringBuilder address = new();
                if (!string.IsNullOrEmpty(people.Address?.AddLine1))
                    address.Append(people.Address?.AddLine1).Append(' ');
                if (!string.IsNullOrEmpty(people.Address?.City))
                    address.Append(people.Address?.City).Append(' ');
                if (!string.IsNullOrEmpty(people.Address?.State))
                    address.Append(people.Address?.State);
                profileAccountViewModel = new ProfileAccountViewModel
                {
                    Address = address.ToString(),
                    Email = people.Email,
                    FirstName = people.FirstName,
                    LastName = people.LastName,
                    LastNamePrefix = people.LastNamePrefix,
                    MiddleName = people.MiddleName,
                    Nickname = people.Nickname,
                    PeopleId = FormatHelper.ToPeopleId(people.PeopleId, general.PeopleIdFormat),
                    Phone = FormatHelper.ToPhoneNumber(people.Phone?.Format, people.Phone?.Number),
                    Prefix = people.Prefix,
                    Suffix = people.Suffix,
                    UserName = account.UserName
                };
            }
            return profileAccountViewModel;
        }

        /// <summary>
        /// To the ProfilePhoneViewModel list view model.
        /// </summary>
        /// <param name="personPhonesDTO">The person phones dto.</param>
        /// <returns></returns>
        internal static List<ProfilePhoneViewModel> ToViewModel(this List<PersonPhone> personPhonesDTO)
        {
            List<ProfilePhoneViewModel> phoneViewModelList = null;
            if (personPhonesDTO?.Count > 0)
            {
                phoneViewModelList = new();
                foreach (PersonPhone personPhone in personPhonesDTO)
                {
                    phoneViewModelList.Add(new ProfilePhoneViewModel
                    {
                        CountryDesc = personPhone.CountryDesc,
                        CountryId = personPhone.CountryId,
                        Description = personPhone.Description,
                        DoNotCallReasonDesc = personPhone.DoNotCallReasonDesc,
                        Id = personPhone.Id,
                        IsPrimary = personPhone.IsPrimary,
                        Format = personPhone.Format,
                        Number = personPhone.Number,
                        FormattedNumber = FormatHelper.ToPhoneNumber(personPhone.Format, personPhone.Number),
                        Type = personPhone.Type,
                        TypeDesc = personPhone.TypeDesc
                    });
                }
            }
            return phoneViewModelList;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="peopleAgreementsDTO">The people agreements dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static PeopleAgreementsViewModel ToViewModel(this PeopleAgreements peopleAgreementsDTO, InstitutionSettings.General general)
        {
            List<PeopleAgreementViewModel> peopleAgreementViewModelList = new();
            PeopleAgreementsViewModel peopleAgreementsViewModel = new();
            if (peopleAgreementsDTO.OverallCount > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                peopleAgreementsViewModel.OverallCount = peopleAgreementsDTO.OverallCount;
                foreach (PeopleAgreement peopleAgreement in peopleAgreementsDTO.PeopleAgreementList.OrderByDescending(x => x.CreateDatetime))
                {
                    peopleAgreementViewModelList.Add(new PeopleAgreementViewModel
                    {
                        AcademicTerm = peopleAgreement.AcademicTerm,
                        AcademicYear = peopleAgreement.AcademicYear.ToString(),
                        CreateDatetime = FormatHelper.ToShortDate(peopleAgreement.CreateDatetime, datetimeCulture) + " " + FormatHelper.ToShortTime(peopleAgreement.CreateDatetime, datetimeCulture),
                        PeopleAgreementId = peopleAgreement.PeopleAgreementId,
                        Title = peopleAgreement.Title
                    });
                }
                peopleAgreementsViewModel.PeopleAgreementList = peopleAgreementViewModelList;
            }
            return peopleAgreementsViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="agreementDetailDTO">The agreement detail dto.</param>
        /// <returns></returns>
        internal static PeopleAgreementDetailViewModel ToViewModel(this AgreementDetail agreementDetailDTO)
        {
            PeopleAgreementDetailViewModel agreementViewModel = null;
            if (agreementDetailDTO != null)
            {
                agreementViewModel = new PeopleAgreementDetailViewModel
                {
                    Acceptance = agreementDetailDTO.Acceptance,
                    Content = agreementDetailDTO.Content,
                    Title = agreementDetailDTO.Title
                };
            }
            return agreementViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="testScoreDetailsDTO">The test score details dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<TestScoreViewModel> ToViewModel(this List<TestScoreDetail> testScoreDetailsDTO, InstitutionSettings.General general)
        {
            List<TestScoreViewModel> testScoresViewModelList = null;
            List<TestScoreDetail> testByDescription = testScoreDetailsDTO.GroupBy(x => new { x.TestDescription, x.IsAlpha })
                .Select(svm => new TestScoreDetail
                {
                    TestDescription = svm.Key.TestDescription,
                    IsAlpha = svm.Key.IsAlpha
                }).ToList();

            if (testScoreDetailsDTO?.Count > 0)
            {
                testScoresViewModelList = new List<TestScoreViewModel>();
                foreach (TestScoreDetail testScoreDetail in testByDescription)
                {
                    testScoresViewModelList.Add(new TestScoreViewModel
                    {
                        Description = testScoreDetail.TestDescription,
                        IsAlpha = testScoreDetail.IsAlpha,
                        TestScoreTypes = GetTestScoreTypes(testScoreDetail.TestDescription, testScoreDetailsDTO, general)
                    });
                }
            }
            return testScoresViewModelList?.OrderBy(x => x.Description).ToList();
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="addressDetailDTO">The address detail dto.</param>
        /// <returns></returns>
        internal static AddressDetailViewModel ToViewModel(this AddressDetail addressDetailDTO) => new()
        {
            AddressLine1 = addressDetailDTO.AddressLine1 ?? string.Empty,
            AddressLine2 = addressDetailDTO.AddressLine2 ?? string.Empty,
            AddressLine3 = addressDetailDTO.AddressLine3 ?? string.Empty,
            AddressLine4 = addressDetailDTO.AddressLine4 ?? string.Empty,
            AddressTypeId = addressDetailDTO.AddressTypeId,
            City = addressDetailDTO.City ?? string.Empty,
            CountryId = addressDetailDTO.CountryId ?? 0,
            EffectiveDate = FormatHelper.ToDatePicker(addressDetailDTO.StartDate) ?? string.Empty,
            HouseNumber = addressDetailDTO.HouseNumber ?? string.Empty,
            IsPreferred = addressDetailDTO.IsPreferred,
            IsRecurring = addressDetailDTO.IsRecurring,
            SequenceNumber = addressDetailDTO.SequenceNumber,
            StateProvinceId = addressDetailDTO.StateProvinceId ?? 0,
            ZipCode = addressDetailDTO.ZipCode ?? string.Empty
        };

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="profileRequestDTO">The people demographic requests dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static List<ProfileRequestViewModel> ToViewModel(this List<ProfileRequest> profileRequestDTO,
            string nameFormat, string nameSort, IPeopleService peopleService, InstitutionSettings.General general, bool showMiddleNameInitial, IPictureHelper pictureHelper)
        {
            List<ProfileRequestViewModel> profileRequestViewModel = null;
            if (profileRequestDTO?.Count > 0)
            {
                profileRequestViewModel = new List<ProfileRequestViewModel>();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                foreach (ProfileRequest request in profileRequestDTO)
                {
                    profileRequestViewModel.Add(new ProfileRequestViewModel
                    {
                        Avatar = request.People.ToViewModel(nameFormat, nameSort, showMiddleNameInitial),
                        DateOfRequest = FormatHelper.ToShortDate(request.SubmittedDate, datetimeCulture),
                        HasPicture = pictureHelper.GetPictureAsync(peopleService.GetPicture(request.People.PersonId.Value)) != null,
                        Id = request.Id,
                        PeopleId = FormatHelper.ToPeopleId(request.People.PeopleId, general.PeopleIdFormat)
                    });
                }
            }
            return profileRequestViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="addressRequestDTO">The address request dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<AddressRequestViewModel> ToViewModel(this List<AddressRequest> addressRequestDTO, string nameFormat,
            string nameSort, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            AddressRequestViewModel addressRequestViewModel = null;
            List<AddressRequestViewModel> addressRequestViewModels = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            foreach (AddressRequest addressRequest in addressRequestDTO)
            {
                AvatarViewModel peopleAvatar = addressRequest.PeopleChangeRequest.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                addressRequestViewModel = new AddressRequestViewModel
                {
                    AddressApprovalRequestId = addressRequest.AddressApprovalRequestId,
                    Avatar = peopleAvatar,
                    CurrentAddress = addressRequest.CurrentAddress != null ? new AddressDetailViewModel
                    {
                        AddressLine1 = addressRequest.CurrentAddress.AddressLine1 ?? string.Empty,
                        AddressLine2 = addressRequest.CurrentAddress.AddressLine2 ?? string.Empty,
                        AddressLine3 = addressRequest.CurrentAddress.AddressLine3 ?? string.Empty,
                        AddressLine4 = addressRequest.CurrentAddress.AddressLine4 ?? string.Empty,
                        AddressTypeId = addressRequest.CurrentAddress.AddressTypeId,
                        AddressTypeDesc = addressRequest.CurrentAddress.AddressTypeDesc,
                        City = addressRequest.CurrentAddress.City ?? string.Empty,
                        CountryDesc = addressRequest.CurrentAddress.Country,
                        CountryId = addressRequest.CurrentAddress.CountryId ?? 0,
                        EffectiveDate = FormatHelper.ToShortDate(addressRequest.CurrentAddress.StartDate, datetimeCulture) ?? string.Empty,
                        HouseNumber = addressRequest.CurrentAddress.HouseNumber ?? string.Empty,
                        IsRecurring = addressRequest.CurrentAddress.IsRecurring,
                        SequenceNumber = addressRequest.CurrentAddress.SequenceNumber,
                        StateDesc = addressRequest.CurrentAddress.State,
                        StateProvinceId = addressRequest.CurrentAddress.StateProvinceId ?? 0,
                        ZipCode = addressRequest.CurrentAddress.ZipCode ?? string.Empty
                    } : null,
                    HasPicture = addressRequest.HasPicture,
                    NewAddress = new AddressDetailViewModel
                    {
                        AddressLine1 = addressRequest.NewAddress.AddressLine1 ?? string.Empty,
                        AddressLine2 = addressRequest.NewAddress.AddressLine2 ?? string.Empty,
                        AddressLine3 = addressRequest.NewAddress.AddressLine3 ?? string.Empty,
                        AddressLine4 = addressRequest.NewAddress.AddressLine4 ?? string.Empty,
                        AddressTypeId = addressRequest.NewAddress.AddressTypeId,
                        AddressTypeDesc = addressRequest.NewAddress.AddressTypeDesc,
                        City = addressRequest.NewAddress.City ?? string.Empty,
                        CountryDesc = addressRequest.NewAddress.Country,
                        CountryId = addressRequest.NewAddress.CountryId ?? 0,
                        EffectiveDate = FormatHelper.ToShortDate(addressRequest.NewAddress.StartDate, datetimeCulture) ?? string.Empty,
                        HouseNumber = addressRequest.NewAddress.HouseNumber ?? string.Empty,
                        IsRecurring = addressRequest.NewAddress.IsRecurring,
                        SequenceNumber = addressRequest.NewAddress.SequenceNumber,
                        StateDesc = addressRequest.NewAddress.State,
                        StateProvinceId = addressRequest.NewAddress.StateProvinceId ?? 0,
                        ZipCode = addressRequest.NewAddress.ZipCode ?? string.Empty
                    },
                    RequestDate = FormatHelper.ToShortDate(addressRequest.NewAddress.CreateDateTime, datetimeCulture),
                    PeopleId = FormatHelper.ToPeopleId(addressRequest.PeopleChangeRequest.PeopleId, general.PeopleIdFormat),
                };
                addressRequestViewModels.Add(addressRequestViewModel);
            }
            return addressRequestViewModels;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="addressRequestDTO">The address request dto.</param>
        /// <returns></returns>
        internal static AddressDetailViewModel ToViewModel(this AddressRequest addressRequestDTO) => new()
        {
            AddressLine1 = addressRequestDTO.NewAddress.AddressLine1 ?? string.Empty,
            AddressLine2 = addressRequestDTO.NewAddress.AddressLine2 ?? string.Empty,
            AddressLine3 = addressRequestDTO.NewAddress.AddressLine3 ?? string.Empty,
            AddressLine4 = addressRequestDTO.NewAddress.AddressLine4 ?? string.Empty,
            AddressTypeId = addressRequestDTO.NewAddress.AddressTypeId,
            AddressTypeDesc = addressRequestDTO.NewAddress.AddressTypeDesc,
            City = addressRequestDTO.NewAddress.City ?? string.Empty,
            CountryDesc = addressRequestDTO.NewAddress.Country,
            CountryId = addressRequestDTO.NewAddress.CountryId ?? 0,
            EffectiveDate = FormatHelper.ToDatePicker(addressRequestDTO.NewAddress.StartDate) ?? string.Empty,
            HouseNumber = addressRequestDTO.NewAddress.HouseNumber ?? string.Empty,
            IsRecurring = addressRequestDTO.NewAddress.IsRecurring,
            SequenceNumber = addressRequestDTO.NewAddress.SequenceNumber,
            StateDesc = addressRequestDTO.NewAddress.State,
            StateProvinceId = addressRequestDTO.NewAddress.StateProvinceId ?? 0,
            ZipCode = addressRequestDTO.NewAddress.ZipCode ?? string.Empty
        };

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="peopleSearchesDTO">The people searches dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static PeopleSearchesViewModel ToViewModel(this PeopleSearches peopleSearchesDTO, string nameFormat,
             IPeopleService peopleService, string nameSort, string peopleFormat, bool showMiddleNameInitial, IPictureHelper pictureHelper)
        {
            List<AvatarViewModel> avatarList = new();
            PeopleSearchesViewModel peopleSearchesViewModel = new();
            if (peopleSearchesDTO.OverallCount > 0)
            {
                peopleSearchesViewModel.OverallCount = peopleSearchesDTO.OverallCount;
                AvatarViewModel peopleAvatar = null;
                foreach (People people in peopleSearchesDTO.PeopleSearchList)
                {
                    peopleAvatar = people.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                    peopleAvatar.HasPicture = pictureHelper.GetPictureAsync(peopleService.GetPicture(people.PersonId.Value)) != null;
                    peopleAvatar.PeopleId = FormatHelper.ToPeopleId(people.PeopleId, peopleFormat);
                    avatarList.Add(peopleAvatar);
                }
                peopleSearchesViewModel.PeopleSearchList = avatarList;
            }
            return peopleSearchesViewModel;
        }

        #region Private Methods

        /// <summary>
        /// Gets the test score types.
        /// </summary>
        /// <param name="testDescription">The test description.</param>
        /// <param name="testScoreDetailsDTO">The test score details dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        private static List<TestScoreTypeViewModel> GetTestScoreTypes(string testDescription, List<TestScoreDetail> testScoreDetailsDTO, InstitutionSettings.General general)
        {
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
            List<TestScoreTypeViewModel> testScoreTypesViewModel = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            foreach (TestScoreDetail testScoreDetail in testScoreDetailsDTO.FindAll(x => x.TestDescription.Equals(testDescription)))
            {
                testScoreTypesViewModel.Add(new TestScoreTypeViewModel
                {
                    Date = FormatHelper.ToShortDate(testScoreDetail.TestDate, datetimeCulture),
                    Description = testScoreDetail.TestTypeDescription,
                    Score1 = testScoreDetail.IsAlpha ? testScoreDetail.AlphaScore1 : FormatHelper.ToDecimal(testScoreDetail.RawScore, formatProvider),
                    Score2 = testScoreDetail.IsAlpha ? testScoreDetail.AlphaScore2 : FormatHelper.ToDecimal(testScoreDetail.ConvertedScore, formatProvider),
                    Score3 = testScoreDetail.IsAlpha ? testScoreDetail.AlphaScore3 : testScoreDetail.AlphaScore
                });
            }
            return testScoreTypesViewModel.OrderBy(x => x.Description).ToList();
        }

        #endregion Private Methods
    }
}