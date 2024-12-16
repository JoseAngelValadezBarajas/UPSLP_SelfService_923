// --------------------------------------------------------------------
// <copyright file="AddressController.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Account.MyProfile;
using SelfService.Models.Administration.Requests;
using SelfService.Models.Forms;
using SelfService.Models.Shared;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// AddressController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class AddressController : BaseEndpointController
    {
        /// <summary>
        /// The address request service
        /// </summary>
        private readonly IAddressRequestService _addressRequestService;

        /// <summary>
        /// The address service
        /// </summary>
        private readonly IAddressService _addressService;

        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The institution setting filter service
        /// </summary>
        private readonly IInstitutionSettingFilterService _institutionSettingFilterService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<AddressController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="AddressController"/> class.
        /// </summary>
        /// <param name="addressRequestService">The address request service.</param>
        /// <param name="addressService">The address service.</param>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="institutionSettingFilterService">The institution setting filter service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public AddressController(
            IAddressRequestService addressRequestService,
            IAddressService addressService,
            ICodeTableService codeTableService,
            IInstitutionSettingFilterService institutionSettingFilterService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPictureHelper pictureHelper,
            ISerializationHelper serializationHelper,
            IAppLogger<AddressController> logger)
            : base(serializationHelper)
        {
            _addressRequestService = addressRequestService;
            _addressService = addressService;
            _codeTableService = codeTableService;
            _institutionSettingFilterService = institutionSettingFilterService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _pictureHelper = pictureHelper;

            _logger = logger;
        }

        /// <summary>
        /// Gets the addresses
        /// </summary>
        /// <param name="startIndex">The start index.</param>
        /// <param name="length">The length.</param>
        /// <param name="zipCode">The zip code.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address")]
        [AllowAnonymous]
        public JsonResult Index([FromBody] AddressZipCodeModel addressZipCodeModel)
        {
            try
            {
                int startIndex = addressZipCodeModel.StartIndex ?? 0;
                int length = addressZipCodeModel.Length ?? 5;
                string zipCode = addressZipCodeModel.ZipCode;
                List<Address> addresses = null;
                if (startIndex >= 0 && length > 0 && !string.IsNullOrEmpty(zipCode))
                    addresses = _addressService.GetByZipCode(startIndex, length, zipCode + '%');

                int overallCount = 0;
                if (addresses?.Count > 0)
                    overallCount = addresses[0].OverallCount;

                return Json(SerializationHelper.ToJsonResult(new { addresses, overallCount }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #region Address

        /// <summary>
        /// Get the addresses of the specified person
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("Address/List")]
        public JsonResult Addresses([FromBody] int? personId)
        {
            try
            {
                personId ??= Account.PersonId;
                List<InstitutionSettingFilter> addressSettings = _institutionSettingFilterService.Get(InstitutionSettingFilterType.Address);
                List<AddressType> addressTypeList = null;
                bool addressTypesExist = false;
                if (addressSettings != null)
                    addressTypesExist = addressSettings.Any(x => x.IsActive && x.IsInclude);
                bool allowChange = _institutionSettingService.GetAddress().AllowChange;
                bool approvalRequired = _institutionSettingService.GetAddress().ApprovalRequired;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();

                if (addressTypesExist)
                    addressTypeList = _peopleService.GetAddresses(personId.Value, addressSettings.Where(x => x.IsInclude && x.IsActive).Select(x => int.Parse(x.Id)).ToList());
                else
                    _logger.LogError(Constants._product, typeof(AddressController).FullName, "There are no addresses configured in Address Settings");

                List<ProfileAddressViewModel> profileAddress = addressTypeList.ToViewModel(general);
                return Json(SerializationHelper.ToJsonResult(new { profileAddress, allowChange, addressTypesExist, approvalRequired }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the address options
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/Options")]
        public JsonResult AddressOptions()
        {
            try
            {
                List<InstitutionSettingFilter> addressSettings = _institutionSettingFilterService.Get(InstitutionSettingFilterType.Address);
                List<ListOptionViewModel> addressCodeTable = _codeTableService.GetByName(CodeTableName.AddressType).ToViewModel();
                List<ListOptionViewModel> addressTypes = new();
                foreach (InstitutionSettingFilter addressSetting in addressSettings.Where(x => x.IsActive && x.IsInclude))
                    addressTypes.Add(addressCodeTable.Find(x => x.Value == int.Parse(addressSetting.Id)));
                List<ListOptionViewModel> states = _codeTableService.GetByName(CodeTableName.State).ToViewModel();
                List<ListOptionViewModel> countries = _codeTableService.GetByName(CodeTableName.Country).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new { addressTypes, states, countries, _institutionSettingService.GetAddress().RecurAnually }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the address.
        /// </summary>
        /// <param name="sequenceNumber">The sequence number.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/Delete")]
        public JsonResult DeleteAddress([FromBody] int sequenceNumber)
        {
            try
            {
                bool result = false;
                int preferredAddressId = _peopleService.GetPreferredAddress(Account.PersonId).SequenceNumber;
                if (sequenceNumber != preferredAddressId)
                    result = _peopleService.DeleteAddress(Account.PersonId, sequenceNumber);
                else
                    result = false;
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the address detail.
        /// </summary>
        /// <param name="sequenceNumber">The sequence number.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/Details")]
        public JsonResult GetAddress([FromBody] int sequenceNumber)
        {
            try
            {
                InstitutionSettings.Address address = _institutionSettingService.GetAddress();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                bool editFutureAddress = address.EditFutureAddress;
                AddressDetailViewModel addressDetail = _peopleService.GetAddress(sequenceNumber).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new { addressDetail, editFutureAddress }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the address.
        /// </summary>
        /// <param name="addressDetailViewModel">The address detail view model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/Save")]
        public JsonResult SaveAddress([FromBody] AddressDetailViewModel addressDetailViewModel)
        {
            try
            {
                bool result = false;
                if (addressDetailViewModel != null)
                {
                    AddressDetail addressDetail = new()
                    {
                        AddressLine1 = addressDetailViewModel.AddressLine1,
                        AddressLine2 = addressDetailViewModel.AddressLine2,
                        AddressLine3 = addressDetailViewModel.AddressLine3,
                        AddressLine4 = addressDetailViewModel.AddressLine4,
                        AddressTypeId = addressDetailViewModel.AddressTypeId,
                        City = addressDetailViewModel.City,
                        CountryId = addressDetailViewModel.CountryId,
                        StartDate = FormatHelper.FromDatePicker(addressDetailViewModel.EffectiveDate),
                        HouseNumber = addressDetailViewModel.HouseNumber,
                        IsPreferred = addressDetailViewModel.IsPreferred,
                        IsRecurring = addressDetailViewModel.IsRecurring,
                        SequenceNumber = addressDetailViewModel.SequenceNumber,
                        StateProvinceId = addressDetailViewModel.StateProvinceId,
                        ZipCode = addressDetailViewModel.ZipCode
                    };
                    InstitutionSettings.Address address = _institutionSettingService.GetAddress();
                    if (!address.ApprovalRequired)
                        _peopleService.SaveAddress(Account.PersonId, addressDetail, _institutionSettingService.GetAddress(), false);
                    else
                        _addressRequestService.Save(0, Account.PersonId, Account.PersonId, addressDetail);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the preferred address.
        /// </summary>
        /// <param name="studentAddressModel">The student address model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/Preferred/Save")]
        public JsonResult SavePreferredAddress([FromBody] StudentAddressModel studentAddressModel)
        {
            try
            {
                bool result = _peopleService.UpdatePreferredAddress(Account.PersonId, studentAddressModel.AddressTypeId, studentAddressModel.SequenceNumber);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Address

        #region AddressChangeRequest

        /// <summary>
        /// Approves the address change request.
        /// </summary>
        /// <param name="addressRequestApproveModels">The address request approve models.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/ChangeRequest/Approve")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupAddress } })]
        public JsonResult ApproveAddressChangeRequest([FromBody] List<AddressRequestApproveModel> addressRequestApproveModels)
        {
            try
            {
                bool isApproved = false;
                int requestIdResult = 0;
                InstitutionSettings.Address addressSettings = _institutionSettingService.GetAddress();
                if (addressRequestApproveModels?.Count > 0)
                {
                    foreach (AddressRequestApproveModel addressRequestApproveModel in addressRequestApproveModels)
                    {
                        isApproved = _addressRequestService.Approve(addressRequestApproveModel.PersonId, addressRequestApproveModel.RequestId, Account.PersonId, addressSettings) > 0;
                        if (!isApproved)
                        {
                            requestIdResult = addressRequestApproveModel.RequestId;
                            return Json(SerializationHelper.ToJsonResult(new { requestIdResult, isApproved }));
                        }
                    }
                }
                requestIdResult = 0;
                return Json(SerializationHelper.ToJsonResult(new { requestIdResult, isApproved }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the address notification.
        /// </summary>
        /// <param name="notificationRequest">The notification request.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/ChangeRequest/Notification")]
        public async Task<JsonResult> CreateAddressNotification([FromBody] NotificationRequest notificationRequest)
        {
            try
            {
                bool notificationSend = true;
                bool notificationType = false;
                string notificationEventKey = string.Empty;
                int personId = Account.PersonId;
                switch (notificationRequest.Type)
                {
                    case 0:
                        notificationType = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.ProfileAddressRequestApproved);
                        notificationEventKey = NotificationEvent.ProfileAddressRequestApproved;
                        personId = notificationRequest.PersonId;
                        break;

                    case 1:
                        notificationType = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.ProfileAddressRequestDenied);
                        notificationEventKey = NotificationEvent.ProfileAddressRequestDenied;
                        personId = notificationRequest.PersonId;
                        break;

                    case 2:
                        notificationType = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.ProfileAddressRequestSubmitted);
                        notificationEventKey = NotificationEvent.ProfileAddressRequestSubmitted;
                        break;
                }

                if (notificationType)
                {
                    People person = _peopleService.Get(personId);
                    List<NotificationToken> currentTokens = new()
                    {
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = person.Email } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.prefix", Value = person.Prefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.firstname", Value = person.FirstName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.middlename", Value = person.MiddleName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastname", Value = person.LastName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.suffix", Value = person.Suffix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.nickname", Value = person.Nickname } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastnameprefix", Value = person.LastNamePrefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.legalname", Value = person.LegalName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.displayname", Value = person.DisplayName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "addressrequest.decision", Value = notificationRequest.Decision } }
                    };

                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = notificationEventKey,
                        Tokens = currentTokens
                    });

                    return Json(SerializationHelper.ToJsonResult(notificationSend));
                }
                notificationSend = false;
                return Json(SerializationHelper.ToJsonResult(notificationSend));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PreferredNamesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the address request.
        /// </summary>
        /// <param name="addressApprovalRequestId">The address approval request identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/ChangeRequest/Delete")]
        public JsonResult DeleteAddressRequest([FromBody] int addressApprovalRequestId)
        {
            try
            {
                bool result = addressApprovalRequestId > 0 && _addressRequestService.Delete(Account.PersonId, addressApprovalRequestId) > 0;
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Denies the address change request.
        /// </summary>
        /// <param name="requestsId">The requests identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/ChangeRequest/Deny")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupAddress } })]
        public JsonResult DenyAddressChangeRequest([FromBody] List<int> requestsId)
        {
            try
            {
                bool isDenied = false;
                int requestIdResult = 0;
                if (requestsId?.Count > 0)
                {
                    foreach (int requestId in requestsId)
                    {
                        isDenied = _addressRequestService.Deny(requestId, Account.PersonId);
                        if (!isDenied)
                        {
                            requestIdResult = requestId;
                            return Json(SerializationHelper.ToJsonResult(new { requestIdResult, isDenied }));
                        }
                    }
                }
                requestIdResult = 0;
                return Json(SerializationHelper.ToJsonResult(new { requestIdResult, isDenied }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the address approval request.
        /// </summary>
        /// <param name="addressApprovalRequestId">The address approval request identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/ChangeRequest/Edit")]
        public JsonResult GetAddressApprovalRequest([FromBody] int addressApprovalRequestId)
        {
            try
            {
                AddressRequest addressRequest = _addressRequestService.Get(addressApprovalRequestId);
                AddressDetailViewModel addressDetail = addressRequest.ToViewModel();
                return Json(SerializationHelper.ToJsonResult(addressDetail));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets wether pending or denied requests exist.
        /// </summary>
        [HttpPost]
        [Route("Address/DeniedPendingRequests/Exist")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupAddress } })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult GetDeniedPendingRequestsExist()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_addressRequestService.GetPendingDeniedExist()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the address approval requests.
        /// </summary>
        /// <param name="addressApprovalModel">The address approval model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/ChangeRequest/List")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupAddress } })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult GetAddressApprovalRequests([FromBody] AddressApprovalModel addressApprovalModel)
        {
            try
            {
                int startIndex = addressApprovalModel.StartIndex ?? 0;
                int length = addressApprovalModel.Length ?? 5;
                int filter = addressApprovalModel.Filter;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<AddressRequest> addressRequests = _addressRequestService.Get(startIndex, length, filter);
                for (int i = 0; i < addressRequests.Count; i++)
                    addressRequests[i].HasPicture = _pictureHelper.GetPictureAsync(_peopleService.GetPicture(addressRequests[i].PeopleChangeRequest.PersonId.Value)) != null;
                int overallCount = 0;
                List<AddressRequestViewModel> addressRequestList = addressRequests.ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                if (addressRequests?.Count > 0)
                    overallCount = addressRequests[0].OverallCount;
                return Json(SerializationHelper.ToJsonResult(new { addressRequestList, overallCount }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the address change request.
        /// </summary>
        /// <param name="addressChangeRequestModel">The address change request model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Address/ChangeRequest/Save")]
        public JsonResult SaveAddressChangeRequest([FromBody] AddressChangeRequestModel addressChangeRequestModel)
        {
            try
            {
                bool result = false;
                if (addressChangeRequestModel != null)
                {
                    int requestNumber = addressChangeRequestModel.RequestNumber;
                    AddressDetailViewModel addressDetail = addressChangeRequestModel.AddressDetail;
                    int requestPersonId = addressChangeRequestModel.PersonId ?? Account.PersonId;
                    if (addressDetail != null)
                    {
                        AddressDetail addressDetailDTO = new()
                        {
                            AddressLine1 = addressDetail.AddressLine1,
                            AddressLine2 = addressDetail.AddressLine2,
                            AddressLine3 = addressDetail.AddressLine3,
                            AddressLine4 = addressDetail.AddressLine4,
                            AddressTypeId = addressDetail.AddressTypeId,
                            City = addressDetail.City,
                            CountryId = addressDetail.CountryId,
                            StartDate = FormatHelper.FromDatePicker(addressDetail.EffectiveDate),
                            HouseNumber = addressDetail.HouseNumber,
                            IsPreferred = addressDetail.IsPreferred,
                            IsRecurring = addressDetail.IsRecurring,
                            SequenceNumber = addressDetail.SequenceNumber,
                            StateProvinceId = addressDetail.StateProvinceId,
                            ZipCode = addressDetail.ZipCode
                        };
                        result = _addressRequestService.Save(requestNumber, requestPersonId, Account.PersonId, addressDetailDTO);
                    }
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AddressController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion AddressChangeRequest
    }
}