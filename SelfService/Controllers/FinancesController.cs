// --------------------------------------------------------------------
// <copyright file="FinancesController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Models.Schedule;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Finances.
    /// </summary>
    /// <seealso cref="Controller" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { false, true })]
    public class FinancesController : Controller
    {
        /// <summary>
        /// Balances this instance.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "BalanceId" } })]
        [Route("Finances/Balance/{Year?}/{Term?}/{Session?}")]
        public ActionResult Balance(YearTermSessionModel yearTermSession)
        {
            if (yearTermSession?.Year > 0 && !string.IsNullOrEmpty(yearTermSession.Term))
            {
                ViewBag.YearTerm = string.IsNullOrEmpty(yearTermSession.Session)
                    ? $"{yearTermSession.Year}/{yearTermSession.Term}"
                    : $"{yearTermSession.Year}/{yearTermSession.Term}/{yearTermSession.Session}";
            }
            if (TempData[Constants._paymentTransactionTempData] != null)
                ViewBag.PaymentTransaction = TempData[Constants._paymentTransactionTempData];

            return View();
        }

        /// <summary>
        /// Shows FinancialAid view.
        /// </summary>
        /// <param name="studentAwardYearToken">The student award year token.</param>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "FinancialAidId" } })]
        public ActionResult FinancialAid(string studentAwardYearToken)
        {
            if (!string.IsNullOrEmpty(studentAwardYearToken))
                ViewBag.AwardYearToken = studentAwardYearToken;
            return View("FinancialAid");
        }

        /// <summary>
        /// Statements this instance.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "Form1098TId" } })]
        public ActionResult Form1098T() => View();

        /// <summary>
        /// Statements this instance.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "StatementId" } })]
        public ActionResult Statement() => View();
    }
}