// --------------------------------------------------------------------
// <copyright file="ImpersonateAttribute.cs" company="Ellucian">
//     Copyright 2022 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Account;
using SelfService.Models.Enum;
using SelfService.Models.Session;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;

namespace SelfService.Filters
{
    /// <summary>
    /// Attribute class to validate impersonate authorization
    /// </summary>
    /// <seealso cref="Attribute" />
    /// <seealso cref="IAuthorizationFilter" />
    [AttributeUsage(AttributeTargets.Method)]
    public class ImpersonateAttribute : Attribute, IAuthorizationFilter
    {
        #region Private Fields

        /// <summary>
        /// The advising helper
        /// </summary>
        private readonly IAdvisingHelper _advisingHelper;

        /// <summary>
        /// The ignore tab identifier
        /// </summary>
        private readonly bool _ignoreTabId;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<ImpersonateAttribute> _logger;

        /// <summary>
        /// The serialization helper
        /// </summary>
        private readonly ISerializationHelper _serializationHelper;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="ImpersonateAttribute" /> class.
        /// </summary>
        /// <param name="advisingHelper">The advising helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="logger">The logger.</param>
        /// <param name="ignoreTabId">if set to <c>true</c> [ignore tab identifier].</param>
        public ImpersonateAttribute(
            IAdvisingHelper advisingHelper,
            ISerializationHelper serializationHelper,
            IInstitutionSettingService institutionSettingService,
            IAppLogger<ImpersonateAttribute> logger,
            bool ignoreTabId = false)
        {
            _advisingHelper = advisingHelper;
            _serializationHelper = serializationHelper;
            _ignoreTabId = ignoreTabId;
            _institutionSettingService = institutionSettingService;
            _logger = logger;
        }

        /// <summary>
        /// Called early in the filter pipeline to confirm request is authorized.
        /// </summary>
        /// <param name="context">The <see cref="T:Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext" />.</param>
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                Account account = context.HttpContext.Session.GetObject<Account>(Constants._accountSession);
                if (account != null
                    && context.HttpContext.GetRouteData()?.Values["controller"] != null
                    && context.HttpContext.GetRouteData().Values["action"] != null)
                {
                    RouteValueDictionary routeDataValues = context.HttpContext.GetRouteData().Values;
                    string controller = routeDataValues["controller"].ToString();
                    string action = routeDataValues["action"].ToString();

                    bool hasProcessValue = false;
                    bool hassAdvisingData = false;
                    ImpersonateProcess process = ImpersonateProcess.Advising;
                    int viewId = -1;
                    int tabId = -1;
                    int requestedPersonId = -1;

                    if (context.HttpContext.Request.Method == HttpMethod.Post.Method)
                    {
                        HttpRequest request = context.HttpContext.Request;
                        if (!request.Body.CanSeek)
                            request.EnableBuffering();
                        request.Body.Position = 0;
                        string bodyString = new StreamReader(request.Body).ReadToEnd();
                        request.Body.Position = 0;

                        ImpersonateModel impersonateModel = _serializationHelper.ToObject<ImpersonateModel>(bodyString);
                        if (impersonateModel is null || impersonateModel.ImpersonateInfo is null || impersonateModel.ImpersonateInfo.PersonId == 0)
                            return;

                        requestedPersonId = impersonateModel.ImpersonateInfo.PersonId;
                        if (requestedPersonId > 0)
                        {
                            process = impersonateModel.ImpersonateInfo.Process;

                            #region Advising

                            hassAdvisingData = process is ImpersonateProcess.Advising
                                && impersonateModel.ImpersonateInfo.ViewId != null
                                && (_ignoreTabId || impersonateModel.ImpersonateInfo.TabId != null);

                            if (hassAdvisingData)
                            {
                                viewId = impersonateModel.ImpersonateInfo.ViewId.Value;
                                tabId = _ignoreTabId ? -1 : impersonateModel.ImpersonateInfo.TabId.Value;
                            }

                            #endregion Advising
                        }
                    }
                    // The else content is only for those endpoints that must be GET methods, such as reports.
                    // Otherwise change the endpoint to be a POST method
                    else if (context.HttpContext.Request.Method == HttpMethod.Get.Method
                        && ((controller.Equals("Schedule") && action.Equals("StudentReport"))
                           || (controller.Equals("Students") && action.Equals("GradesReport"))
                           || (controller.Equals("AcademicPlans") && action.Equals("Report"))
                           || (controller.Equals("Students") && action.Equals("UnofficialTranscriptsReport"))))
                    {
                        if (routeDataValues["ImpersonateInfo.PersonId"] is null
                            || !int.TryParse(routeDataValues["ImpersonateInfo.PersonId"].ToString(), out requestedPersonId)
                            || requestedPersonId == 0)
                        {
                            return;
                        }

                        if (requestedPersonId > 0)
                        {
                            hasProcessValue = routeDataValues["ImpersonateInfo.Process"] != null
                                && Enum.TryParse(routeDataValues["ImpersonateInfo.Process"].ToString(), out process);

                            #region Advising

                            hassAdvisingData = hasProcessValue
                                && process is ImpersonateProcess.Advising
                                && routeDataValues["ImpersonateInfo.ViewId"] != null
                                && routeDataValues["ImpersonateInfo.TabId"] != null
                                && int.TryParse(routeDataValues["ImpersonateInfo.ViewId"].ToString(), out viewId)
                                && int.TryParse(routeDataValues["ImpersonateInfo.TabId"].ToString(), out tabId);

                            #endregion Advising
                        }
                    }

                    IEnumerable<Claim> claims = context.HttpContext.User.Claims;
                    if (requestedPersonId >= 0 && (hassAdvisingData || process == ImpersonateProcess.SharedAccess))
                    {
                        switch (process)
                        {
                            case ImpersonateProcess.Advising:
                                if ((account.PersonId == requestedPersonId
                                    || _advisingHelper.IsAuthorized(viewId, account.PersonId, requestedPersonId))
                                  && _advisingHelper.GetProfilePermission((AdviseeView)viewId, claims)
                                  && (_ignoreTabId || _advisingHelper.GetTabPermission((AdviseeView)viewId, (AdviseeProfileTab)tabId, claims)))
                                {
                                    return;
                                }
                                break;

                            case ImpersonateProcess.SharedAccess:
                                // TODO: Add validation for shared access
                                // return _invitationService.IsValidStudent(account.PersonId, requestedPersonId);
                                return;

                            default:
                                break;
                        }
                    }

                    InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
                    if (logging.EnablePermissionEvaluationFailure)
                    {
                        Claim userGuidClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                        string personIdInformation = logging.IncludePersonId ?
                            $", AuthenticatedPersonId: {account.PersonId}, RequestedPersonId: {requestedPersonId}" : null;
                        _logger.LogPermissionEvaluation(Constants._product,
                            $"{Constants._permissionEvaluationFailed} (Process: {process}, View: {viewId}, Tab: {tabId}{personIdInformation})",
                            success: false,
                            userGuidClaim?.Value != null ? Guid.Parse(userGuidClaim.Value) : null,
                            logging.IncludeClientIp ? _logger.GetIpAddress(context.HttpContext) : null,
                            logging.IncludePrincipalId ? context.HttpContext.User.Identity?.Name : null);
                    }
                    else
                    {
                        _logger.LogError(Constants._product, typeof(ImpersonateAttribute).FullName, Constants._permissionEvaluationFailed);
                    }
                }

                context.HttpContext.Response.StatusCode = 403;
                context.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Errors", action = "Error403" }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SessionExpiredAttribute).FullName, exception.Message, exception);
                context.Result = new RedirectToRouteResult(new
                               RouteValueDictionary(new { controller = "Errors", action = "Error500", area = "" }));
            }
        }
    }
}