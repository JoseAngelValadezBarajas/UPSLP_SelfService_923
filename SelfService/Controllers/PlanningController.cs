// --------------------------------------------------------------------
// <copyright file="PlanningController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Models.DegreeRequirements;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Planning.
    /// </summary>
    /// <seealso cref="BaseController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { false, true })]
    public class PlanningController : BaseController
    {
        /// <summary>
        /// Degree Requirements View.
        /// </summary>
        /// <returns>ActionResult</returns>
        [HttpGet]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "DegreeRequirementsId" } })]
        public ActionResult DegreeRequirements(DegReqParametersViewModel degReqParametersViewModel)
        {
            if (degReqParametersViewModel != null)
            {
                ViewBag.Curriculum = degReqParametersViewModel.Curriculum;
                ViewBag.Degree = degReqParametersViewModel.Degree;
                ViewBag.MatricTerm = degReqParametersViewModel.MatricTerm;
                ViewBag.MatricYear = degReqParametersViewModel.MatricYear;
                ViewBag.Program = degReqParametersViewModel.Program;
            }
            return View();
        }

        /// <summary>
        /// Transfers the course.
        /// </summary>
        /// <returns>ActionResult</returns>
        [HttpGet]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "TransferCourseEquivalenciesId" } })]
        public ActionResult TransferCourse() => View();
    }
}