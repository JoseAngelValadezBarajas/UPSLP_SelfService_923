// --------------------------------------------------------------------
// <copyright file="BaseController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SelfService.Helpers;
using SelfService.Models.Session;
using System.Threading.Tasks;

namespace SelfService.Controllers
{
    /// <summary>
    /// The Base Controller for the View Controllers.
    /// </summary>
    /// <seealso cref="Controller" />
    public class BaseController : Controller
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="BaseController"/> class.
        /// </summary>
        public BaseController() : base()
        {
        }

        /// <summary>
        /// Gets or sets the account.
        /// </summary>
        /// <value>
        /// The account.
        /// </value>
        public Account Account { get; set; }

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
            return base.OnActionExecutionAsync(context, next);
        }
    }
}