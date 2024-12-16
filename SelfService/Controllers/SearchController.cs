// --------------------------------------------------------------------
// <copyright file="SearchController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Search.
    /// </summary>
    /// <seealso cref="BaseController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { false, true })]
    public class SearchController : BaseController
    {
        /// <summary>
        /// Courses the catalog.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "CourseSearchId" } })]
        public ActionResult Course(CourseCatalogSearch courseCatalogSearch)
        {
            if (courseCatalogSearch != null)
            {
                ViewBag.ClassLevel = courseCatalogSearch.ClassLevel;
                ViewBag.College = courseCatalogSearch.College;
                ViewBag.CourseCode = courseCatalogSearch.CourseCode;
                ViewBag.CreditType = courseCatalogSearch.CreditType;
                ViewBag.Curriculum = courseCatalogSearch.Curriculum;
                ViewBag.Department = courseCatalogSearch.Department;
                ViewBag.EventSubType = courseCatalogSearch.SubType;
                ViewBag.Keywords = courseCatalogSearch.Keywords;
                ViewBag.NonTradProgram = courseCatalogSearch.NonTradProgram;
                ViewBag.Population = courseCatalogSearch.Population;
                ViewBag.Program = courseCatalogSearch.Program;
            }
            return View();
        }

        /// <summary>
        /// Sections this instance.
        /// </summary>
        /// <returns>ActionResult</returns>
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "SectionSearchId" } })]
        public ActionResult Section(SectionSearch sectionSearch)
        {
            if (sectionSearch != null)
            {
                ViewBag.InstructorId = sectionSearch.InstructorId;
                ViewBag.CampusId = sectionSearch.CampusId;
                ViewBag.ClassLevel = sectionSearch.ClassLevel;
                ViewBag.College = sectionSearch.College;
                ViewBag.CreditType = sectionSearch.CreditType;
                ViewBag.Curriculum = sectionSearch.Curriculum;
                ViewBag.Department = sectionSearch.Department;
                ViewBag.EndDate = sectionSearch.EndDate;
                ViewBag.EndTime = sectionSearch.EndTime;
                ViewBag.EventId = sectionSearch.EventId;
                ViewBag.EventSubType = sectionSearch.EventSubType;
                ViewBag.EventType = sectionSearch.EventType;
                ViewBag.GeneralEd = sectionSearch.GeneralEd;
                ViewBag.Keywords = sectionSearch.Keywords;
                ViewBag.Meeting = sectionSearch.Meeting;
                ViewBag.NonTradProgram = sectionSearch.NonTradProgram;
                ViewBag.Period = sectionSearch.Period;
                ViewBag.Population = sectionSearch.Population;
                ViewBag.Program = sectionSearch.Program;
                ViewBag.Session = sectionSearch.Session;
                ViewBag.StartDate = sectionSearch.StartDate;
                ViewBag.StartTime = sectionSearch.StartTime;
                ViewBag.Status = sectionSearch.Status;
                ViewBag.Program = sectionSearch.Program;
                if (sectionSearch.Term != null)
                    ViewBag.AcademicTerm = sectionSearch.Term;
                if (sectionSearch.Year != null)
                    ViewBag.AcademicYear = sectionSearch.Year;
                ViewBag.Year = sectionSearch.AcademicYear;
            }

            return View();
        }

        /// <summary>
        /// Shares the courses.
        /// </summary>
        /// <param name="courseCatalogSearch">The course catalog search.</param>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "CourseSearchId" } })]
        [Route("Search/Course/Share")]
        public ActionResult ShareCourses(CourseCatalogSearch courseCatalogSearch)
        {
            if (courseCatalogSearch != null)
            {
                ViewBag.ClassLevel = courseCatalogSearch.ClassLevel;
                ViewBag.College = courseCatalogSearch.College;
                ViewBag.CourseCode = courseCatalogSearch.CourseCode;
                ViewBag.CreditType = courseCatalogSearch.CreditType;
                ViewBag.Curriculum = courseCatalogSearch.Curriculum;
                ViewBag.Department = courseCatalogSearch.Department;
                ViewBag.EventSubType = courseCatalogSearch.SubType;
                ViewBag.Keywords = courseCatalogSearch.Keywords;
                ViewBag.NonTradProgram = courseCatalogSearch.NonTradProgram;
                ViewBag.Population = courseCatalogSearch.Population;
                ViewBag.Program = courseCatalogSearch.Program;
            }
            return View("Course");
        }

        /// <summary>
        /// Shares the sections.
        /// </summary>
        /// <param name="sectionSearch">The section search.</param>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "SectionSearchId" } })]
        [Route("Search/Section/Share")]
        public ActionResult ShareSections(SectionSearch sectionSearch)
        {
            if (sectionSearch != null)
            {
                ViewBag.InstructorId = sectionSearch.InstructorId;
                ViewBag.CampusId = sectionSearch.CampusId;
                ViewBag.ClassLevel = sectionSearch.ClassLevel;
                ViewBag.College = sectionSearch.College;
                ViewBag.CreditType = sectionSearch.CreditType;
                ViewBag.Curriculum = sectionSearch.Curriculum;
                ViewBag.Department = sectionSearch.Department;
                ViewBag.EndDate = sectionSearch.EndDate;
                ViewBag.EndTime = sectionSearch.EndTime;
                ViewBag.EventId = sectionSearch.EventId;
                ViewBag.EventSubType = sectionSearch.SubType;
                ViewBag.EventType = sectionSearch.EventType;
                ViewBag.GeneralEd = sectionSearch.GeneralEd;
                ViewBag.Keywords = sectionSearch.Keywords;
                ViewBag.Meeting = sectionSearch.Meeting;
                ViewBag.NonTradProgram = sectionSearch.NonTradProgram;
                ViewBag.Period = sectionSearch.Period;
                ViewBag.Population = sectionSearch.Population;
                ViewBag.Program = sectionSearch.Program;
                ViewBag.Session = sectionSearch.Session;
                ViewBag.StartDate = sectionSearch.StartDate;
                ViewBag.StartTime = sectionSearch.StartTime;
                ViewBag.Status = sectionSearch.Status;
                ViewBag.Program = sectionSearch.Program;
            }

            return View("Section");
        }
    }
}