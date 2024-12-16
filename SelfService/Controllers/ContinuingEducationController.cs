// --------------------------------------------------------------------
// <copyright file="ContinuingEducationController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for ContinuingEducation.
    /// </summary>
    /// <seealso cref="Controller" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { false, true })]
    public class ContinuingEducationController : Controller
    {
        /// <summary>
        /// Cons the ed courses.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ConEdCoursesId" } })]
        [Route("ContinuingEducation/ConEdCourses/{option?}")]
        public ActionResult ConEdCourses(string option)
        {
            if (!string.IsNullOrEmpty(option) && option.Equals("Cart"))
                ViewBag.ShowCart = true;
            if (TempData[Constants._paymentTransactionTempData] != null)
                ViewBag.PaymentTransaction = TempData[Constants._paymentTransactionTempData];

            return View();
        }
    }
}