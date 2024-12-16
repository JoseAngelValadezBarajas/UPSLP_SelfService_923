// --------------------------------------------------------------------
// <copyright file="AdmissionsController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using System;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Admissions.
    /// </summary>
    /// <seealso cref="Controller" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { false, true })]
    public class AdmissionsController : Controller
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<AdmissionsController> _logger;

        /// <summary>
        /// The serialization helper
        /// </summary>
        private readonly ISerializationHelper _serializationHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="AdmissionsController" /> class.
        /// </summary>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public AdmissionsController(
            ISerializationHelper serializationHelper,
            IAppLogger<AdmissionsController> logger) : base()
        {
            _serializationHelper = serializationHelper;

            _logger = logger;
        }

        /// <summary>
        /// Get the application form by id
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Admissions/ApplicationForm/{id}/{curp}")]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ApplicationsId" } })]
        public ActionResult ApplicationForm(int id,string curp)
        {
            try
            {
                if (id <= 0)
                {
                    _logger.LogError(Constants._product, GetType().Name, "ApplicationId is less than or equal to zero.");
                    return RedirectToAction("Error404", "Errors");
                }
                if (TempData[Constants._paymentTransactionTempData] != null)
                    ViewBag.PaymentTransaction = TempData[Constants._paymentTransactionTempData];

                ViewBag.ApplicationId = id;
                ViewBag.Curp = curp;
                return View();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, GetType().Name, exception.Message);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Applications list view
        /// </summary>
        [HttpGet]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ApplicationsId" } })]
        public ActionResult Applications()
        {
            try
            {
                return View();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, GetType().Name, exception.Message);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Inquirieses this instance.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "InquiriesId" } })]
        public ActionResult Inquiries() => View();

        /// <summary>
        /// Gets the inquiry form by id
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "InquiriesId" } })]
        [Route("Admissions/InquiryForm/{id}")]
        public ActionResult InquiryForm(int id)
        {
            try
            {
                if (id <= 0)
                {
                    _logger.LogError(Constants._product, GetType().Name, "InquiryId is less than or equal to zero.");
                    return RedirectToAction("Error404", "Errors");
                }
                ViewBag.InquiryId = id;
                return View();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, GetType().Name, exception.Message);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Saveds the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("Admissions/ApplicationForm/Saved/{token}")]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ApplicationsId" } })]
        public ActionResult Saved(Guid token)
        {
            try
            {
                if (token == Guid.Empty)
                {
                    _logger.LogError(Constants._product, GetType().Name, "Token is invalid.");
                    return RedirectToAction("Error404", "Errors");
                }
                ViewBag.SavedApplicationToken = token;
                return View("ApplicationForm");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, GetType().Name, exception.Message);
                return RedirectToAction("Error500", "Errors");
            }
        }
    }
}