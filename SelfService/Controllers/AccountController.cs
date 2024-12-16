// --------------------------------------------------------------------
// <copyright file="AccountController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Account.
    /// </summary>
    /// <seealso cref="Controller" />
    [Authorize]
    public class AccountController : Controller
    {
        /// <summary>
        /// Profile View
        /// </summary>
        /// <returns>ActionResult</returns>
        [Route("Account/Profile")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfile } })]
        public ActionResult MyProfile() => View();
    }
}