// --------------------------------------------------------------------
// <copyright file="ErrorsController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Helpers.Interfaces;
using System;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Errors.
    /// </summary>
    /// <seealso cref="Controller" />
    [AllowAnonymous]
    public class ErrorsController : Controller
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<ErrorsController> _logger;

        /// <summary>
        /// The site configuration helper
        /// </summary>
        private readonly ISiteConfigurationHelper _siteConfigurationHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="ErrorsController"/> class.
        /// </summary>
        /// <param name="siteConfigurationHelper">The site configuration helper.</param>
        /// <param name="logger">The logger.</param>
        public ErrorsController(
            ISiteConfigurationHelper siteConfigurationHelper,
            IAppLogger<ErrorsController> logger) : base()
        {
            _siteConfigurationHelper = siteConfigurationHelper;

            _logger = logger;
        }

        /// <summary>
        /// Error View
        /// </summary>
        /// <returns>
        /// ActionResult
        /// </returns>
        [HttpGet]
        public ActionResult Error()
        {
            try
            {
                _siteConfigurationHelper.Restart();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, nameof(ErrorsController), exception.Message, exception);
            }
            return View();
        }

        /// <summary>
        /// Error 400 View
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Error400()
        {
            ViewBag.ErrorCode = "Error400";
            return View("SpecificError");
        }

        /// <summary>
        /// Error 401 View
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Error401()
        {
            ViewBag.ErrorCode = "Error401";
            return View("SpecificError");
        }

        /// <summary>
        /// Error 403 View
        /// </summary>
        /// <returns>
        /// ActionResult
        /// </returns>
        [HttpGet]
        public ActionResult Error403()
        {
            ViewBag.ErrorCode = "Error403";
            return View("SpecificError");
        }

        /// <summary>
        /// Error 404 View
        /// </summary>
        /// <returns>
        /// ActionResult
        /// </returns>
        [HttpGet]
        public ActionResult Error404()
        {
            ViewBag.ErrorCode = "Error404";
            return View("SpecificError");
        }

        /// <summary>
        /// Error 500 View
        /// </summary>
        /// <returns>
        /// ActionResult
        /// </returns>
        [HttpGet]
        public ActionResult Error500()
        {
            ViewBag.ErrorCode = "Error500";
            return View("SpecificError");
        }

        /// <summary>
        /// Error 503 View
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Error503()
        {
            ViewBag.ErrorCode = "Error503";
            return View("SpecificError");
        }

        /// <summary>
        /// Expired invitation.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ExpiredInvitation()
        {
            ViewBag.ErrorCode = "ExpiredInvitation";
            return View("SpecificError");
        }

        /// <summary>
        /// Invalid invitation.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult InvalidInvitation()
        {
            ViewBag.ErrorCode = "InvalidInvitation";
            return View("SpecificError");
        }

        /// <summary>
        /// Invalid token.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult InvalidToken()
        {
            ViewBag.ErrorCode = "InvalidToken";
            return View("SpecificError");
        }
    }
}