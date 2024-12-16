// --------------------------------------------------------------------
// <copyright file="ClassesController.cs" company="Ellucian">
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
    /// Controller with views for Classes.
    /// </summary>
    /// <seealso cref="Controller" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { false, true })]
    public class ClassesController : Controller
    {
        /// <summary>
        /// Courses management View.
        /// </summary>
        /// <returns></returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "FacultyCourseManagementId" } })]
        [Route("Classes/CourseManagement/{Year?}/{Term?}/{Session?}/{sectionId?}/{option?}")]
        public ActionResult CourseManagement(YearTermSessionModel yearTermSession, int? sectionId, int? option)
        {
            if (option > 0)
                ViewBag.Option = option;
            if (sectionId > 0)
                ViewBag.SectionId = sectionId;
            if (yearTermSession != null)
            {
                ViewBag.Year = yearTermSession.Year;
                ViewBag.Term = yearTermSession.Term;
                ViewBag.Session = yearTermSession.Session is not null and not "-" and not "/"
                    ? yearTermSession.Session : "";
            }
            return View();
        }

        /// <summary>
        /// MySchedule View.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "FacultyScheduleId" } })]
        public ActionResult Schedule() => View();
    }
}