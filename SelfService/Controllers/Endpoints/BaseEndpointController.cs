// --------------------------------------------------------------------
// <copyright file="BaseEndpointController.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Navigation;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SelfService.Helpers;
using SelfService.Models.Session;
using System;
using System.Text;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// The Base Endpoint Controller for the Endpoint Controllers.
    /// </summary>
    /// <seealso cref="Controller" />
    public class BaseEndpointController : Controller
    {
        /// <summary>
        /// The serialization helper
        /// </summary>
        public readonly ISerializationHelper SerializationHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="BaseEndpointController" /> class.
        /// </summary>
        /// <param name="serializationHelper">The serialization helper.</param>
        public BaseEndpointController(ISerializationHelper serializationHelper) : base()
            => SerializationHelper = serializationHelper;

        /// <summary>
        /// Gets or sets the account.
        /// </summary>
        /// <value>
        /// The account.
        /// </value>
        public Account Account { get; set; }

        /// <summary>
        /// Gets or sets the current link identifier.
        /// </summary>
        /// <value>
        /// The current link identifier.
        /// </value>
        public string CurrentLinkId { get; set; }

        /// <summary>
        /// Gets or sets the current name format.
        /// </summary>
        /// <value>
        /// The current name format.
        /// </value>
        public string CurrentNameFormat { get; set; }

        /// <summary>
        /// Gets or sets the current name sort.
        /// </summary>
        /// <value>
        /// The current name sort.
        /// </value>
        public string CurrentNameSort { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show middle name initial].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show middle name initial]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowMiddleNameInitial { get; set; }

        /// <summary>
        /// Called before the action method is invoked.
        /// </summary>
        /// <param name="context">The action executing context.</param>
        /// <param name="next">The <see cref="T:Microsoft.AspNetCore.Mvc.Filters.ActionExecutionDelegate" /> to execute. Invoke this delegate in the body
        /// of <see cref="M:Microsoft.AspNetCore.Mvc.Controller.OnActionExecutionAsync(Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext,Microsoft.AspNetCore.Mvc.Filters.ActionExecutionDelegate)" /> to continue execution of the action.</param>
        /// <returns>
        /// A <see cref="T:System.Threading.Tasks.Task" /> instance.
        /// </returns>
        public override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            Account = context.HttpContext.Session.GetObject<Account>(Constants._accountSession);
            string currentLinkId = Request.Headers[Constants._xCurrentPage];
            CurrentLinkId = string.IsNullOrEmpty(currentLinkId) ? string.Empty : Encoding.UTF8.GetString(Convert.FromBase64String(currentLinkId));
            SiteMapOptionNameFormat nameFormat = context.HttpContext.Session.GetObject<SiteMapOptionNameFormat>(Constants._nameFormatSession);
            CurrentNameFormat = FormatHelper.GetNameFormat(nameFormat);
            CurrentNameSort = FormatHelper.GetNameSort(nameFormat);
            ShowMiddleNameInitial = FormatHelper.GetShowMiddleNameInitial(nameFormat);

            return base.OnActionExecutionAsync(context, next);
        }
    }
}