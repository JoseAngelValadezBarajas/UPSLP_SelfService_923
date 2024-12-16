// --------------------------------------------------------------------
// <copyright file="AdministrationController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using System;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Administration.
    /// </summary>
    /// <seealso cref="BaseController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { false, true })]
    public class AdministrationController : BaseController
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<AdministrationController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="AdministrationController" /> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        public AdministrationController(IAppLogger<AdministrationController> logger) : base() => _logger = logger;

        /// <summary>
        /// Application setup.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Administration/ApplicationSetup/{id}")]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "FormsSetupId" } })]
        public ActionResult ApplicationSetup(int id)
        {
            try
            {
                if (id <= 0)
                {
                    _logger.LogError(Constants._product, GetType().Name, "ApplicationLayotId is less than or equal to zero.");
                    return RedirectToAction("Error404", "Errors");
                }
                ViewBag.LayoutId = id;
                return View();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, GetType().Name, exception.Message);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Cons the ed setup.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ConEdSetupId" } })]
        public ActionResult ConEdSetup() => View();

        /// <summary>
        /// Donations the setup.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "DonationsSetupId" } })]
        public ActionResult DonationsSetup() => View();

        /// <summary>
        /// Formses the setup.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "FormsSetupId" } })]
        public ActionResult FormsSetup() => View();

        /// <summary>
        /// Generals the setup.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "GeneralSetupId" } })]
        public ActionResult GeneralSetup() => View();

        /// <summary>
        /// Formses the setup.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Administration/InquirySetup/{id}")]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "FormsSetupId" } })]
        public ActionResult InquirySetup(int id)
        {
            try
            {
                if (id <= 0)
                {
                    _logger.LogError(Constants._product, GetType().Name, "InquiryLayotId is less than or equal to zero.");
                    return RedirectToAction("Error404", "Errors");
                }
                ViewBag.LayoutId = id;
                return View();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, GetType().Name, exception.Message);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Instructors the setup.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "InstructorSetupId" } })]
        public ActionResult InstructorSetup() => View();

        /// <summary>
        /// Notificationses the setup.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "NotificationsSetupId" } })]
        public ActionResult NotificationsSetup() => View();

        /// <summary>
        /// Profile the setup.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ProfileSetupId" } })]
        public ActionResult ProfileSetup() => View();

        /// <summary>
        /// Requests the setup.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "RequestsSetupId" } })]
        public ActionResult RequestsSetup() => View();

        /// <summary>
        /// Students the setup.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "StudentSetupId" } })]
        public ActionResult StudentSetup() => View();

        /// <summary>
        /// WebsiteSetup View
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "WebsiteSetupId" } })]
        public ActionResult WebsiteSetup() => View();
    }
}