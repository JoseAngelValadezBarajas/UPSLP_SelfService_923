// --------------------------------------------------------------------
// <copyright file="AgreementController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Models.Agreements;
using System;
using System.Collections.Generic;
using static Hedtech.PowerCampus.Core.DTO.Settings.InstitutionSettings;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Agreements route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class AgreementsController : BaseEndpointController
    {
        /// <summary>
        /// The agreement service
        /// </summary>
        private readonly IAgreementService _agreementService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<AgreementsController> _logger;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// Initializes a new instance of the <see cref="AgreementsController"/> class.
        /// </summary>
        /// <param name="agreementService">The agreement service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public AgreementsController(
            IAgreementService agreementService,
            IInstitutionSettingService institutionSettingService,
            IPeopleService peopleService,
            ISerializationHelper serializationHelper,
            IAppLogger<AgreementsController> logger)
            : base(serializationHelper)
        {
            _agreementService = agreementService;
            _institutionSettingService = institutionSettingService;
            _peopleService = peopleService;

            _logger = logger;
        }

        /// <summary>
        /// Detailses the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Agreements/Details/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupAgreements } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Details(int id)
        {
            try
            {
                AgreementDetail agreementDetail = null;
                bool isAssignedToRegistration = false;
                if (id <= 0)
                {
                    _logger.LogError(Constants._product, typeof(AgreementsController).FullName, "Id is zero");
                }
                else
                {
                    agreementDetail = _agreementService.GetById(id);
                    if (agreementDetail != null)
                    {
                        Registration registrationSettings = _institutionSettingService.GetRegistration();
                        isAssignedToRegistration = registrationSettings.AgreementId == id;
                    }
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    agreementDetail,
                    isAssignedToRegistration
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Details of the form1098 t.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult DetailsForm1098T()
        {
            try
            {
                List<AgreementDetail> agreements = _agreementService.GetByType(AgreementType.Form1098T);
                AgreementDetail agreement1098T = agreements?.Count > 0 ?
                    agreements[0]
                    : new AgreementDetail
                    {
                        Acceptance = string.Empty,
                        AgreementType = AgreementType.Form1098T,
                        Content = string.Empty,
                        Title = string.Empty
                    };
                return Json(SerializationHelper.ToJsonResult(agreement1098T));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Form1098s the t.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Form1098T()
        {
            try
            {
                List<AgreementDetail> agreements = _agreementService.GetByType(AgreementType.Form1098T);
                AgreementDetail agreement = agreements?.Count > 0 && agreements[0].Status == AgreementStatus.Active ? agreements[0] : null;

                List<PeopleAgreement> peopleAgreementList = _peopleService.GetAgreementByType(Account.PersonId, AgreementType.Form1098T);
                PeopleAgreement peopleAgreement = peopleAgreementList?.Count > 0 ? peopleAgreementList[0] : null;

                bool isAccepted = false;
                int peopleAgreementId = 0;
                if (peopleAgreement != null)
                {
                    isAccepted = peopleAgreement.IsAccepted;
                    peopleAgreementId = peopleAgreement.PeopleAgreementId;
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    agreement,
                    isAccepted,
                    peopleAgreementId
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Indexes the specified type.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="length">The length.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Agreements/{type}/{startIndex}/{length}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupAgreements } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Index(AgreementType type, int startIndex, int length)
        {
            try
            {
                Agreements agreements = _agreementService.Get(type, startIndex, length);
                return Json(SerializationHelper.ToJsonResult(agreements));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the specified agreement detail.
        /// </summary>
        /// <param name="agreementDetail">The agreement detail.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Agreements/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupAgreements } })]
        public JsonResult Save([FromBody] AgreementDetail agreementDetail)
        {
            try
            {
                bool isAvailable = true;
                bool result = false;
                int returnStatus = 0;
                if (agreementDetail.Id > 0)
                {
                    returnStatus = _agreementService.Update(agreementDetail, Account.PersonId);
                }
                else
                {
                    isAvailable = !_agreementService.NameExists(agreementDetail.Name);
                    if (isAvailable)
                        returnStatus = _agreementService.Create(agreementDetail, Account.PersonId);
                }
                if (returnStatus > 0)
                    result = true;
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the form1098 t.
        /// </summary>
        /// <param name="agreementDetail">The agreement detail.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Agreements/SaveForm1098T")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        public JsonResult SaveForm1098T([FromBody] AgreementDetail agreementDetail)
        {
            try
            {
                agreementDetail.Name = "1098T";
                agreementDetail.AgreementType = AgreementType.Form1098T;
                bool isAvailable = true;
                bool result = false;
                int returnStatus = 0;
                if (agreementDetail.Id > 0)
                {
                    returnStatus = _agreementService.Update(agreementDetail, Account.PersonId);
                }
                else
                {
                    isAvailable = !_agreementService.NameExists(agreementDetail.Name);
                    if (isAvailable)
                    {
                        returnStatus = _agreementService.Create(agreementDetail, Account.PersonId);
                        agreementDetail.Id = returnStatus;
                    }
                }
                if (returnStatus > 0)
                    result = true;
                return Json(SerializationHelper.ToJsonResult(new
                {
                    result,
                    id = agreementDetail.Id
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Statuses the specified agreement status model.
        /// </summary>
        /// <param name="agreementStatusModel">The agreement status model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Agreements/Status")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupAgreements } })]
        public JsonResult Status([FromBody] AgreementStatusModel agreementStatusModel)
        {
            try
            {
                int id = agreementStatusModel.Id;
                AgreementStatus status = agreementStatusModel.Status;
                bool result = false;
                bool isAssignedToRegistration = false;
                if (id <= 0)
                {
                    _logger.LogError(Constants._product, typeof(AgreementsController).FullName, "Id is zero");
                }
                else if (status == AgreementStatus.Active)
                {
                    _logger.LogError(Constants._product, typeof(AgreementsController).FullName, "Active status cannot be set directly");
                }
                else
                {
                    if (status == AgreementStatus.Inactive)
                    {
                        Registration registrationSettings = _institutionSettingService.GetRegistration();
                        isAssignedToRegistration = registrationSettings.AgreementId == id;
                        if (isAssignedToRegistration)
                            _logger.LogError(Constants._product, typeof(AgreementsController).FullName, "The agreement is assigned to registration");
                    }
                    if (!isAssignedToRegistration)
                    {
                        int returnStatus = _agreementService.UpdateStatus(id, status, Account.PersonId);
                        if (returnStatus > 0)
                            result = true;
                    }
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Statuses the form1098 t.
        /// </summary>
        /// <param name="agreementStatusModel">The agreement status model.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        public JsonResult StatusForm1098T([FromBody] AgreementStatusModel agreementStatusModel)
        {
            try
            {
                int id = agreementStatusModel.Id;
                AgreementStatus status = agreementStatusModel.Status;
                bool result = false;
                if (id <= 0)
                {
                    _logger.LogError(Constants._product, typeof(AgreementsController).FullName, "Id is zero");
                }
                else if (status != AgreementStatus.Publish)
                {
                    int returnStatus = _agreementService.UpdateStatus(id, status, Account.PersonId);
                    if (returnStatus > 0)
                        result = true;
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Validates the name.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Agreements/ValidateName")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupAgreements } })]
        public JsonResult ValidateName([FromBody] string name)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(!_agreementService.NameExists(name)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AgreementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}