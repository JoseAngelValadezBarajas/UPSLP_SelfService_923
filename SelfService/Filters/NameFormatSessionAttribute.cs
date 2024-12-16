// --------------------------------------------------------------------
// <copyright file="NameFormatSessionAttribute.cs" company="Ellucian">
//     Copyright 2021 - 2024 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Navigation;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using SelfService.Helpers;
using System;
using System.Collections.Generic;
using System.Text;

namespace SelfService.Filters
{
    /// <summary>
    /// Custom filter to validate if the session has expired.
    /// </summary>
    /// <seealso cref="Attribute" />
    /// <seealso cref="IResourceFilter" />
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class NameFormatSessionAttribute : Attribute, IResourceFilter
    {
        #region Private Fields

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<NameFormatSessionAttribute> _logger;

        /// <summary>
        /// The site map service
        /// </summary>
        private readonly ISiteMapService _siteMapService;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="NameFormatSessionAttribute"/> class.
        /// </summary>
        /// <param name="siteMapService">The site map service.</param>
        /// <param name="logger">The logger.</param>
        public NameFormatSessionAttribute(
            ISiteMapService siteMapService,
            IAppLogger<NameFormatSessionAttribute> logger) : base()
        {
            _siteMapService = siteMapService;

            _logger = logger;
        }

        /// <summary>
        /// Executes the resource filter. Called after execution of the remainder of the pipeline.
        /// </summary>
        /// <param name="context">The <see cref="T:Microsoft.AspNetCore.Mvc.Filters.ResourceExecutedContext" />.</param>
        public void OnResourceExecuted(ResourceExecutedContext context)
        {
            // Method intentionally left empty.
        }

        /// <summary>
        /// Executes the resource filter. Called before execution of the remainder of the pipeline.
        /// </summary>
        /// <param name="context">The <see cref="T:Microsoft.AspNetCore.Mvc.Filters.ResourceExecutingContext" />.</param>
        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            try
            {
                string currentLinkId = context.HttpContext.Request.Headers[Constants._xCurrentPage];
                if (string.IsNullOrEmpty(currentLinkId))
                    currentLinkId = context.HttpContext.Request.Query[Constants._currentPageQueryString].ToString();
                if (!string.IsNullOrEmpty(currentLinkId))
                {
                    currentLinkId = Encoding.UTF8.GetString(Convert.FromBase64String(currentLinkId));
                    List<SiteMapOptionNameFormat> nameFormats = _siteMapService.GetNameFormats();
                    SiteMapOptionNameFormat siteMapOptionNameFormat = nameFormats?.Find(x => x.LinkId == currentLinkId);
                    context.HttpContext.Session.SetObject(Constants._nameFormatSession, siteMapOptionNameFormat);
                }
                else
                {
                    context.HttpContext.Session.Remove(Constants._nameFormatSession);
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