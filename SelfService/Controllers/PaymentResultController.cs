// --------------------------------------------------------------------
// <copyright file="PaymentResultController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Resources;
using System;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with endpoints for Payment Results.
    /// </summary>
    /// <seealso cref="BaseController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class PaymentResultController : BaseController
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<PaymentResultController> _logger;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="PaymentResultController"/> class.
        /// </summary>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="logger">The logger.</param>
        public PaymentResultController(
            IResourcesHelper resourcesHelper,
            ISettingHelper settingHelper,
            IAppLogger<PaymentResultController> logger) : base()
        {
            _resourcesHelper = resourcesHelper;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        /// <summary>
        /// Index View
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            try
            {
                PaymentResources paymentResources = null;
                if (TempData[Constants._paymentTransactionTempData] != null)
                {
                    string language = _settingHelper.GetLanguage(Account);
                    paymentResources = _resourcesHelper.GetServerResourceType<PaymentResources>(language,
                        "PaymentModal", ValidationHelper.IsValidResource);
                    ViewBag.PaymentTransaction = TempData[Constants._paymentTransactionTempData];
                }
                return View(paymentResources);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, nameof(PaymentResultController), exception.Message, exception);
                return RedirectToAction("Error500", "Errors");
            }
        }
    }
}