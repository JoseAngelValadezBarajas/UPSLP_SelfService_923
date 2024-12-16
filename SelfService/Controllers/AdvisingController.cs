// --------------------------------------------------------------------
// <copyright file="AdvisingController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Advisees;
using SelfService.Models.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Advising.
    /// </summary>
    /// <seealso cref="BaseController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute))]
    public class AdvisingController : BaseController
    {
        #region Private Fields

        /// <summary>
        /// The advising helper
        /// </summary>
        private readonly IAdvisingHelper _advisingHelper;

        /// <summary>
        /// The advising service
        /// </summary>
        private readonly IAdvisingService _advisingService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<AdvisingController> _logger;

        /// <summary>
        /// The serialization helper
        /// </summary>
        private readonly ISerializationHelper _serializationHelper;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="AdvisingController"/> class.
        /// </summary>
        /// <param name="advisingHelper">The advising helper.</param>
        /// <param name="advisingService">The advising service.</param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="logger">The logger.</param>
        public AdvisingController(
            IAdvisingHelper advisingHelper,
            IAdvisingService advisingService,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            IAppLogger<AdvisingController> logger) : base()
        {
            _advisingHelper = advisingHelper;
            _advisingService = advisingService;
            _institutionSettingService = institutionSettingService;
            _serializationHelper = serializationHelper;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        /// <summary>
        /// Manage Advisees/Profile View.
        /// </summary>
        /// <param name="viewId">The view id form the Dropdown list.</param>
        /// <param name="id">The person id.</param>
        /// <param name="tabId">The navigation tab id.</param>
        /// <returns>
        /// ActionResult
        /// </returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ManageAdviseesId" } })]
        [Route("Advising/ManageAdvisees/{viewId}/AdviseeProfile/{id}/{tabId}")]
        public ActionResult AdviseeProfile(int viewId, int id, int tabId)
        {
            try
            {
                if (viewId < 0)
                {
                    _logger.LogError(Constants._product, GetType().Name, "ViewId is less than zero.");
                    return RedirectToAction("Error404", "Errors");
                }
                if (id <= 0)
                {
                    _logger.LogError(Constants._product, GetType().Name, "PersonId is less than or equal to zero.");
                    return RedirectToAction("Error404", "Errors");
                }
                if (tabId < 0)
                {
                    _logger.LogError(Constants._product, GetType().Name, "TabId is less than zero.");
                    return RedirectToAction("Error404", "Errors");
                }

                bool hasAuthorization = _advisingHelper.IsAuthorized(viewId, Account.PersonId, id);

                if (hasAuthorization)
                {
                    IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity)?.Claims;
                    if (_advisingHelper.GetProfilePermission((AdviseeView)viewId, claims)
                        && _advisingHelper.GetTabPermission((AdviseeView)viewId, (AdviseeProfileTab)tabId, claims))
                    {
                        ViewBag.ViewId = viewId;
                        ViewBag.TabText = _advisingHelper.GetTabText(viewId, Account);
                        ViewBag.PersonId = id;
                        ViewBag.TabId = tabId;
                        return View();
                    }
                }

                InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
                if (logging.EnablePermissionEvaluationFailure)
                {
                    Claim userGuidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                    string personIdInformation = logging.IncludePersonId ?
                        $", AuthenticatedPersonId: {Account.PersonId}, RequestedPersonId: {id}" : null;
                    _logger.LogPermissionEvaluation(Constants._product,
                        $"{Constants._permissionEvaluationFailed} (Process: Advising, View: {viewId}, Tab: {tabId}{personIdInformation})",
                        success: false,
                        userGuidClaim?.Value != null ? Guid.Parse(userGuidClaim.Value) : null,
                        logging.IncludeClientIp ? _logger.GetIpAddress(HttpContext) : null,
                        logging.IncludePrincipalId ? HttpContext.User.Identity?.Name : null);
                }
                else
                {
                    _logger.LogError(Constants._product, typeof(ImpersonateAttribute).FullName, Constants._permissionEvaluationFailed);
                }
                return RedirectToAction("Error403", "Errors");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, GetType().Name, exception.Message);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Authorize advisees View.
        /// </summary>
        /// <param name="tabId">The tab id.</param>
        /// <returns>
        /// ActionResult
        /// </returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "AuthorizeAdviseesId" } })]
        [Route("Advising/AuthorizeAdvisees/{tabId?}")]
        public ActionResult AuthorizeAdvisees(int? tabId)
        {
            if (tabId == null)
                return View("AuthorizeAdvisees");
            if (tabId < 0)
            {
                _logger.LogError(Constants._product, GetType().Name, "TabId is less than to zero.");
                return RedirectToAction("Error404", "Errors");
            }
            ViewBag.TabId = tabId;
            return View("AuthorizeAdvisees");
        }

        /// <summary>
        /// Manage Advisees View.
        /// </summary>
        /// <param name="adviseeSearch">The advisee search.</param>
        /// <returns>
        /// ActionResult
        /// </returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ManageAdviseesId" } })]
        [Route("Advising/ManageAdvisees")]
        public ActionResult ManageAdvisees(AdviseeSearchModel adviseeSearch)
        {
            if (adviseeSearch?.View == null)
                return View("ManageAdvisees");

            if (adviseeSearch?.View < 0)
            {
                _logger.LogError(Constants._product, GetType().Name, "TabId is less than to zero.");
                return RedirectToAction("Error404", "Errors");
            }
            ViewBag.AdviseeSearch = _serializationHelper.ToJsonObject(adviseeSearch);
            return View("ManageAdvisees");
        }

        /// <summary>
        /// Shareds the advisees.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "SharedAdviseesId" } })]
        public ActionResult SharedAdvisees() => View();
    }
}