// --------------------------------------------------------------------
// <copyright file="CheckListController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for CheckList.
    /// </summary>
    /// <seealso cref="Controller" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { false, true })]
    public class ChecklistController : Controller
    {
        [TypeFilter(typeof(RoleAuthorizeAttribute), Arguments = new object[] { new string[] { "MyTasksId" } })]
        public ActionResult MyTasks(int checklistItemId = 0)
        {
            if (checklistItemId > 0)
                ViewBag.ChecklistItemId = checklistItemId;
            return View("MyTasks");
        }
    }
}