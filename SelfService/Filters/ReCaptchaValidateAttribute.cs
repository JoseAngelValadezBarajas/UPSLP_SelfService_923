// --------------------------------------------------------------------
// <copyright file="ReCaptchaValidateAttribute.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Account;
using System;
using System.Collections.Generic;
using System.Net;

namespace SelfService.Filters
{
    /// <summary>
    ///  Custom filter to validate the reCaptcha response from the client.
    /// </summary>
    /// <seealso cref="ActionFilterAttribute" />
    [AttributeUsage(AttributeTargets.Method)]
    public class ReCaptchaValidateAttribute : ActionFilterAttribute
    {
        #region Private Fields

        /// <summary>
        /// The HTTP client helper
        /// </summary>
        private readonly IHttpClientHelper _httpClientHelper;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<ReCaptchaValidateAttribute> _logger;

        /// <summary>
        /// ReCaptcha origin
        /// </summary>
        private readonly ReCaptchaOrigin _origin;

        /// <summary>
        /// The serialization helper
        /// </summary>
        private readonly ISerializationHelper _serializationHelper;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="ReCaptchaValidateAttribute"/> class.
        /// </summary>
        /// <param name="httpClientHelper">The HTTP client helper.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="origin">The origin.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public ReCaptchaValidateAttribute(
            IHttpClientHelper httpClientHelper,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            ReCaptchaOrigin origin,
            IAppLogger<ReCaptchaValidateAttribute> logger) : base()
        {
            _httpClientHelper = httpClientHelper;
            _institutionSettingService = institutionSettingService;
            _origin = origin;
            _serializationHelper = serializationHelper;

            _logger = logger;
        }

        /// <summary>
        /// Called by the ASP.NET MVC framework before the action method executes.
        /// </summary>
        /// <param name="context"></param>
        /// <inheritdoc />
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            try
            {
                bool enabled = false;
                InstitutionSettings.ReCaptcha reCaptchaSettings = _institutionSettingService.GetReCaptcha();
                switch (_origin)
                {
                    case ReCaptchaOrigin.ForgotPasswordSendEmail:
                        enabled = reCaptchaSettings.EnableForgotPassword;
                        break;

                    case ReCaptchaOrigin.ContinuingEducationRegistration:
                        enabled = false;
                        break;

                    default:
                        break;
                }

                if (enabled)
                {
                    ReCaptchaResponseModel reCaptchaResponseModel = context.ActionArguments["reCaptchaResponse"] as ReCaptchaResponseModel;
                    HttpRequest request = context.HttpContext.Request;

                    bool reCaptchaResult = false;

                    Dictionary<string, object> errorInfo = new()
                    {
                        { "Origin", _origin },
                        { "UserHostAddress", request.Host.Value }
                    };
                    if (!string.IsNullOrEmpty(reCaptchaResponseModel?.ReCaptchaResponse))
                    {
                        string apiAddress = reCaptchaSettings.GoogleEndpoint;
                        string reCaptchaSecret = reCaptchaSettings.SecretKey;

                        (HttpStatusCode statusCode, ReCaptchaResponse reCaptchaResponse)
                             = _httpClientHelper.SendReCaptchaURI(apiAddress, reCaptchaSecret, reCaptchaResponseModel.ReCaptchaResponse, request.Host.Value);
                        if (statusCode == HttpStatusCode.OK && reCaptchaResponse != null)
                        {
                            if (!reCaptchaResponse.Success)
                            {
                                errorInfo.Add("StatusCode", statusCode);
                                errorInfo.Add("challenge_ts", reCaptchaResponse.ChallengeTs);
                                errorInfo.Add("hostname", reCaptchaResponse.Hostname);
                                if (reCaptchaResponse.ErrorCodes != null)
                                    errorInfo.Add("error-codes", string.Join(", ", reCaptchaResponse.ErrorCodes));

                                _logger.LogWebError(Constants._product, typeof(ReCaptchaValidateAttribute).FullName, "Invalid ReCaptcha", null, errorInfo);
                            }
                            reCaptchaResult = reCaptchaResponse.Success;
                        }
                        else
                        {
                            errorInfo.Add("StatusCode", statusCode);

                            _logger.LogWebError(Constants._product, typeof(ReCaptchaValidateAttribute).FullName, "Invalid ReCaptcha", null, errorInfo);
                        }
                    }
                    if (!reCaptchaResult)
                    {
                        _logger.LogWebError(Constants._product, typeof(ReCaptchaValidateAttribute).FullName, "Invalid ReCaptcha - Client token is null or empty", null, errorInfo);
                        context.Result = new RedirectToRouteResult(new
                                       RouteValueDictionary(new { controller = "Errors", action = "Error404", area = "" }));
                    }
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ReCaptchaValidateAttribute).FullName, exception.Message, exception);
                context.Result = new RedirectToRouteResult(new
                               RouteValueDictionary(new { controller = "Errors", action = "Error500", area = "" }));
            }
        }
    }
}