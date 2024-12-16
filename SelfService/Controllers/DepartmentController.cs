// --------------------------------------------------------------------
// <copyright file="DepartmentController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Department Head.
    /// </summary>
    /// <seealso cref="Controller" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { false, true })]
    public class DepartmentController : Controller
    {
        /// <summary>
        /// Approves the grades.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "ApproveGradesId" } })]
        public ActionResult ApproveGrades() => View();

        /// <summary>
        /// Courses the management.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "CourseManagementId" } })]
        public ActionResult CourseManagement() => View();

        /// <summary>
        /// Course templates.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "CourseTemplatesId" } })]
        public ActionResult CourseTemplates() => View();

        /// <summary>
        /// Setups the approvals.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "SetupApprovalsId" } })]
        public ActionResult SetupApprovals() => View();
    }
}