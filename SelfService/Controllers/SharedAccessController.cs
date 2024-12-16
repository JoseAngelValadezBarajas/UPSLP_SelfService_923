// --------------------------------------------------------------------
// <copyright file="SharedAccessController.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using System;
using System.Linq;
using System.Security.Claims;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Shared Access.
    /// </summary>
    /// <seealso cref="BaseController" />
    [TypeFilter(typeof(SessionExpiredAttribute))]
    public class SharedAccessController : BaseController
    {
        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The invitation service
        /// </summary>
        private readonly IInvitationService _invitationService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<SharedAccessController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="SharedAccessController"/> class.
        /// </summary>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="invitationService">The invitation service.</param>
        /// <param name="logger">The logger.</param>
        public SharedAccessController(
            IInstitutionSettingService institutionSettingService,
            IInvitationService invitationService,
            IAppLogger<SharedAccessController> logger) : base()
        {
            _institutionSettingService = institutionSettingService;
            _invitationService = invitationService;
            _logger = logger;
        }

        /// <summary>
        /// Shows the student profile.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "StudentsId" } })]
        [Route("SharedAccess/StudentProfile/{personId}")]
        public ActionResult StudentProfile(int personId)
        {
            try
            {
                if (personId <= 0)
                {
                    _logger.LogError(Constants._product, GetType().Name, "PersonId is less than or equal to zero.");
                    return RedirectToAction("Error404", "Errors");
                }

                bool hasAuthorization = _invitationService.IsValidStudent(Account.PersonId, personId);

                if (!hasAuthorization)
                {
                    InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
                    if (logging.EnablePermissionEvaluationFailure)
                    {
                        Claim userGuidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                        string personIdInformation = logging.IncludePersonId ?
                            $", AuthenticatedPersonId: {Account.PersonId}, RequestedPersonId: {personId}" : null;
                        _logger.LogPermissionEvaluation(Constants._product,
                            $"{Constants._permissionEvaluationFailed} (Process: SharedAccess{personIdInformation})",
                            success: false,
                            userGuidClaim?.Value != null ? Guid.Parse(userGuidClaim.Value) : null,
                            logging.IncludeClientIp ? _logger.GetIpAddress(HttpContext) : null,
                            logging.IncludePrincipalId ? HttpContext.User.Identity?.Name : null);
                    }
                    else
                    {
                        _logger.LogError(Constants._product, typeof(SharedAccessController).FullName, Constants._permissionEvaluationFailed);
                    }
                    return RedirectToAction("Error403", "Errors");
                }

                ViewBag.PersonId = personId;

                if (TempData[Constants._paymentTransactionTempData] != null)
                    ViewBag.PaymentTransaction = TempData[Constants._paymentTransactionTempData];

                return View();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, GetType().Name, exception.Message);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Shows the StudentsView
        /// </summary>
        /// <returns>ActionResult</returns>
        [Route("SharedAccess/Students")]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "StudentsId" } })]
        public ActionResult Students() => View();
    }
}