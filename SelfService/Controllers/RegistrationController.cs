// --------------------------------------------------------------------
// <copyright file="RegistrationController.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SelfService.Filters;
using SelfService.Models.Payment;
using SelfService.Models.Schedule;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Registration.
    /// </summary>
    /// <seealso cref="BaseController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute))]
    public class RegistrationController : BaseController
    {
        /// <summary>
        /// Academic Plan View.
        /// </summary>
        /// <returns>
        /// ActionResult
        /// </returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "AcademicPlanId" } })]
        public ActionResult AcademicPlan() => View();

        /// <summary>
        /// Courseses the specified year term.
        /// </summary>
        /// <param name="yearTerm">The year term.</param>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "CoursesId" } })]
        [Route("Registration/Courses/{Year?}/{Term?}")]
        public ActionResult Courses(YearTermModel yearTerm)
        {
            if (yearTerm?.Year > 0 && !string.IsNullOrEmpty(yearTerm.Term))
                ViewBag.YearTerm = $"{yearTerm.Year}/{yearTerm.Term}";
            if (TempData[Constants._paymentTransactionTempData] != null)
                ViewBag.PaymentTransaction = JsonConvert.DeserializeObject<PaymentTransactionViewModel>((string)TempData[Constants._paymentTransactionTempData]);
            return View();
        }

        /// <summary>
        /// My Schedule Student View.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ScheduleId" } })]
        public ActionResult Schedule() => View();

        /// <summary>
        /// Whats if.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "WhatIfId" } })]
        public ActionResult WhatIf() => View();
    }
}