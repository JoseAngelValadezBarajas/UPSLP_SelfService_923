// --------------------------------------------------------------------
// <copyright file="StudentsController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Finance;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Navigation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Entities.PowerFaids;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Account;
using SelfService.Models.Account.MyProfile;
using SelfService.Models.Finances;
using SelfService.Models.Grades;
using SelfService.Models.Payment;
using SelfService.Models.Registration;
using SelfService.Models.Resources;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Data.SqlClient;
using System.Text.Json;
using System.Threading.Tasks;
using Hedtech.PowerCampus.Logger;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Students route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class StudentsController : BaseEndpointController
    {
        /// <summary>
        /// The academic service
        /// </summary>
        private readonly IAcademicService _academicService;

        /// <summary>
        /// The finance service
        /// </summary>
        private readonly IFinanceService _financeService;

        /// <summary>
        /// The grade service
        /// </summary>
        private readonly IGradeService _gradeService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<StudentsController> _logger;

        /// <summary>
        /// The name format service
        /// </summary>
        private readonly INameFormatService _nameFormatService;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;


        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The permission request service
        /// </summary>
        private readonly IPermissionRequestService _permissionRequestService;

        /// <summary>
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// The program service
        /// </summary>
        private readonly IProgramService _programService;

        /// <summary>
        /// The registration service
        /// </summary>
        private readonly IRegistrationService _registrationService;

        /// <summary>
        /// The report helper
        /// </summary>
        private readonly IReportHelper _reportHelper;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The schedule service
        /// </summary>
        private readonly IScheduleService _scheduleService;

        /// <summary>
        /// The section service
        /// </summary>
        private readonly ISectionService _sectionService;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The setting service
        /// </summary>
        private readonly ISettingService _settingService;

        /// <summary>
        /// The site map service
        /// </summary>
        private readonly ISiteMapService _siteMapService;

        /// <summary>
        /// The violation service
        /// </summary>
        private readonly IViolationService _violationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="StudentsController"/> class.
        /// </summary>
        /// <param name="academicService">The academic service.<seealso cref="IAcademicService"/></param>
        /// <param name="financeService">The finance service.<seealso cref="IFinanceService"/></param>
        /// <param name="gradeService">The grade service.<seealso cref="IGradeService"/></param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="nameFormatService">The name format service.<seealso cref="INameFormatService"/></param>
        /// <param name="notificationsHelper">The notifications helper.<seealso cref="INotificationsHelper"/></param>
        /// <param name="peopleService">The people service.<seealso cref="IPeopleService"/></param>
        /// <param name="permissionRequestService">The permission request service.<seealso cref="IPermissionRequestService"/></param>
        /// <param name="pictureHelper">The picture helper.<seealso cref="IPictureHelper"/></param>
        /// <param name="programService">The program service.<seealso cref="IProgramService"/></param>
        /// <param name="registrationService">The registration service.<seealso cref="IRegistrationService"/></param>
        /// <param name="reportHelper">The report helper.<seealso cref="IReportHelper"/></param>
        /// <param name="resourcesHelper">The resources helper.<seealso cref="IResourcesHelper"/></param>
        /// <param name="scheduleService">The schedule service.<seealso cref="IScheduleService"/></param>
        /// <param name="sectionService">The section service.<seealso cref="ISectionService"/></param>
        /// <param name="serializationHelper">The serialization helper.<seealso cref="ISerializationHelper"/></param>
        /// <param name="settingHelper">The setting helper.<seealso cref="ISettingHelper"/></param>
        /// <param name="settingService">The setting service.<seealso cref="ISettingService"/></param>
        /// <param name="siteMapService">The site map service.<seealso cref="ISiteMapService"/></param>
        /// <param name="violationService">The violation service.<seealso cref="IViolationService"/></param>
        /// <param name="logger">The logger.<seealso cref="IAppLogger{StudentsController}"/></param>
        public StudentsController(
            IAcademicService academicService,
            IFinanceService financeService,
            IGradeService gradeService,
            IInstitutionSettingService institutionSettingService,
            INameFormatService nameFormatService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPermissionRequestService permissionRequestService,
            IPictureHelper pictureHelper,
            IProgramService programService,
            IRegistrationService registrationService,
            IReportHelper reportHelper,
            IResourcesHelper resourcesHelper,
            IScheduleService scheduleService,
            ISectionService sectionService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            ISettingService settingService,
            ISiteMapService siteMapService,
            IViolationService violationService,
            IAppLogger<StudentsController> logger)
            : base(serializationHelper)
        {
            _academicService = academicService;
            _financeService = financeService;
            _gradeService = gradeService;
            _institutionSettingService = institutionSettingService;
            _nameFormatService = nameFormatService;
            _notificationsHelper = notificationsHelper;
            _permissionRequestService = permissionRequestService;
            _peopleService = peopleService;
            _pictureHelper = pictureHelper;
            _programService = programService;
            _registrationService = registrationService;
            _reportHelper = reportHelper;
            _resourcesHelper = resourcesHelper;
            _scheduleService = scheduleService;
            _sectionService = sectionService;
            _settingHelper = settingHelper;
            _settingService = settingService;
            _siteMapService = siteMapService;
            _violationService = violationService;

            _logger = logger;
        }

        #region Courses

        /// <summary>
        /// Cons the ed apply discount coupon.
        /// </summary>
        /// <param name="discountCoupon">The discount coupon.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/ConEdApplyDiscountCoupon")]
        public JsonResult ConEdApplyDiscountCoupon([FromBody] PaymentDiscountCouponViewModel discountCoupon)
        {
            try
            {
                PaymentInfoViewModel paymentInfo = null;
                int discountOrder = 0;
                if (HttpContext.Session.GetObject<PaymentInfoViewModel>(Constants._paymentInfoSession) != null && !string.IsNullOrEmpty(discountCoupon.Code) && _registrationService.ValidateCoupon(discountCoupon.Code))
                {
                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
                    string assessmentType = _institutionSettingService.GetConEdRegistration().AssessmentType;
                    paymentInfo = ApplyDiscounts(formatCurrency);
                    Discount discount = null;
                    decimal amount = 0;
                    discountCoupon.IsValid = false;
                    if (paymentInfo.ChargeCredits.Find(x => x.DiscountCode == discountCoupon.Code) != null)
                    {
                        discountCoupon.IsValid = false;
                    }
                    else
                    {
                        List<ChargeCredit> registrationChargeCredits = null;
                        int sectionId = 0;
                        foreach (DiscountChargeCreditViewModel row in paymentInfo.ChargeCredits.FindAll(x => !x.IsCredit))
                        {
                            if (sectionId != row.SectionId)
                            {
                                discount = _registrationService.GetDiscountByChargeCreditNumber(Account.PersonId, row.Code, discountCoupon.Code);
                                if (discount != null)
                                {
                                    discountOrder = _registrationService.InsTranscriptSourceDiscount(Account.PersonId, row.SectionId,
                                        discount.Code, discount.ChargeCreditCode, discount.PercentageFlat, discount.Amount, discount.Percentage);
                                    if (discountOrder > 0)
                                    {
                                        if ((discount.PercentageFlat == "F" && row.AmountValue > discount.Amount) ||
                                            (discount.PercentageFlat == "P" && discount.Percentage <= 100))
                                        {
                                            registrationChargeCredits = _financeService.ProcessAssessment(Account.PersonId, assessmentType,
                                       row.AcademicYear, row.AcademicTerm, row.AcademicSession, paymentInfo.ConEdTransactionId);
                                            if (registrationChargeCredits.Count > 0)
                                            {
                                                amount = registrationChargeCredits.Where(x => x.IsCredit).Sum(x => x.Amount) ?? 0;
                                                paymentInfo.ChargeCredits.Add(new DiscountChargeCreditViewModel
                                                {
                                                    AcademicSession = row.AcademicSession,
                                                    AcademicTerm = row.AcademicTerm,
                                                    AcademicYear = row.AcademicYear,
                                                    Code = row.Code,
                                                    Description = discount.CodeDesc,
                                                    DiscountAmount = FormatHelper.ToCurrency(amount, formatCurrency),
                                                    DiscountAmountValue = amount,
                                                    DiscountCode = discount.Code,
                                                    EventId = row.EventId,
                                                    SectionId = row.SectionId,
                                                    IsCredit = true
                                                });
                                                paymentInfo.ChargeCredits.Find(x => x.Code == row.Code && !x.IsCredit).AmountValue = amount;
                                                paymentInfo.TotalAmountValue -= amount;
                                                paymentInfo.TotalAmount = FormatHelper.ToCurrency(paymentInfo.TotalAmountValue, formatCurrency);
                                                if (!paymentInfo.UseTransactionChargesOnly)
                                                {
                                                    paymentInfo.PaymentDueValue -= amount;
                                                    paymentInfo.PaymentDue = FormatHelper.ToCurrency(paymentInfo.PaymentDueValue, formatCurrency);
                                                }
                                                discountCoupon.IsValid = true;
                                            }
                                            else
                                                _registrationService.DeleteDiscountApplied(Account.PersonId, row.SectionId, discountCoupon.Code);
                                        }
                                        else
                                        {
                                            _registrationService.DeleteDiscountApplied(Account.PersonId, row.SectionId, discountCoupon.Code);
                                        }
                                    }
                                }
                                sectionId = row.SectionId;
                            }
                        }
                    }
                    paymentInfo.ChargeCredits = paymentInfo.ChargeCredits.OrderBy(x => x.IsOther).ThenBy(x => x.EventId).ToList();
                    return Json(SerializationHelper.ToJsonResult(new { discountCoupon, paymentInfo }));
                }
                discountCoupon.IsValid = false;
                return Json(SerializationHelper.ToJsonResult(new { discountCoupon, paymentInfo }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Cons the ed registration.
        /// </summary>
        /// <param name="sections">The sections.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/ConEdRegistration")]
        public JsonResult ConEdRegistration([FromBody] Dictionary<int, string> sections)
        {
            try
            {
                if (sections == null || sections.Count == 0)
                    return Json(SerializationHelper.ToJsonResult(null, "No sections to register", 0, false));
                string language = _settingHelper.GetLanguage(Account);
                InstitutionSettings.ConEdRegistration conEdRegistrationSettings = _institutionSettingService.GetConEdRegistration();
                // Validate dates before to init the registration process
                DateTime regEndDate;
                SectionDetail sectionDetail;
                List<int> sectionsDateConflict = new();
                foreach (KeyValuePair<int, string> addSection in sections)
                {
                    sectionDetail = _sectionService.GetDetail(addSection.Key);
                    regEndDate = sectionDetail.StartDate.AddDays(conEdRegistrationSettings.RegistrationEndPeriod);
                    if (DateTime.Today > regEndDate)
                        sectionsDateConflict.Add(addSection.Key);
                }
                if (sectionsDateConflict.Count > 0)
                {
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        sectionsDateConflict
                    }));
                }

                // Registration
                StudentRegistration studentRegistration = new()
                {
                    AddSections = sections,
                    IsConEd = true,
                    DropSections = new List<int>()
                };
                ValidationMessagesResources registrationResources = _resourcesHelper.GetResourceType<ValidationMessagesResources>(language, new("Registration", "ValidationMessages"));
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                RegistrationMessage registrationMessage =
                    _registrationService.PerformConEdRegistration(
                        Account.PersonId,
                        studentRegistration,
                        _institutionSettingService.GetConEdRegistration(),
                        _institutionSettingService.GetFinancial());
                RegistrationValidationViewModel registrationValidation = registrationMessage.ToViewModel(registrationResources, false, general);

                // Send notification
                if (registrationValidation.IsSuccessful)
                    _ = SendRegistrationNotificationAsync(sections.Select(s => s.Key).ToList(), true);

                // Payment or Assessment info
                bool enableOnlinePayment = conEdRegistrationSettings.EnableOnlinePayment;
                PaymentInfoViewModel paymentInfo = null;
                PaymentInfoViewModel paymentInfoDiscounts = null;
                List<string> discountCoupons = null;
                if (registrationMessage.StatementNumber != null && registrationMessage.ChargeCredits?.Count > 0)
                {
                    IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
                    decimal totalAmount = 0;
                    StatementTotals statementTotals = _financeService.GetStatementTotals(Account.PersonId, (int)registrationMessage.StatementNumber);
                    paymentInfo = new PaymentInfoViewModel
                    {
                        RequireOnlinePayment = conEdRegistrationSettings.RequireOnlinePayment,
                        UseTransactionChargesOnly = conEdRegistrationSettings.UseTransactionChargesOnly,
                        StatementNumber = registrationMessage.StatementNumber,
                        CurrentBalance = FormatHelper.ToCurrency(statementTotals.CurrentBalance, formatCurrency),
                        CurrentBalanceValue = statementTotals.CurrentBalance,
                        PaymentDue = FormatHelper.ToCurrency(statementTotals.PaymentDue, formatCurrency),
                        PaymentDueValue = statementTotals.PaymentDue,
                        ConEdTransactionId = registrationMessage.ConEdTransactionId
                    };
                    foreach (RegistrationChargeCredit row in registrationMessage.ChargeCredits)
                    {
                        SectionCourse sectionCourse = _registrationService.GetSectionInfoByChargeCredit(Account.PersonId
                            , row.ChargeCreditNumber);
                        if (sectionCourse != null)
                        {
                            paymentInfo.ChargeCredits.Add(new DiscountChargeCreditViewModel
                            {
                                AcademicYear = sectionCourse.AcademicYear,
                                AcademicTerm = sectionCourse.AcademicTerm,
                                AcademicSession = sectionCourse.AcademicSession,
                                Amount = FormatHelper.ToCurrency(row.Amount, formatCurrency),
                                AmountValue = row.Amount,
                                Code = row.ChargeCreditNumber,
                                Description = row.Description,
                                EventId = sectionCourse.EventId,
                                EventName = sectionCourse.EventName,
                                IsCredit = row.IsCredit,
                                SectionId = sectionCourse.SectionId
                            });
                        }
                        else
                        {
                            paymentInfo.ChargeCredits.Add(new DiscountChargeCreditViewModel
                            {
                                Amount = FormatHelper.ToCurrency(row.Amount, formatCurrency),
                                AmountValue = row.Amount,
                                Code = row.ChargeCreditNumber,
                                Description = row.Description,
                                IsCredit = row.IsCredit,
                                IsOther = true,
                                SectionId = -1
                            });
                        }
                        if (row.IsCredit)
                            totalAmount += (row.Amount * -1);
                        totalAmount += row.Amount;
                    }
                    paymentInfo.TotalAmount = FormatHelper.ToCurrency(totalAmount, formatCurrency);
                    paymentInfo.TotalAmountValue = totalAmount;
                    if (registrationMessage?.ChargeCredits?.Count > 0)
                    {
                        HttpContext.Session.SetObject(Constants._paymentInfoSession, paymentInfo);
                        paymentInfo.ChargeCredits = paymentInfo.ChargeCredits.OrderBy(x => x.IsOther)
                            .ThenBy(x => x.EventId).ToList();

                        paymentInfoDiscounts = ApplyDiscounts(formatCurrency);
                        if (paymentInfoDiscounts?.ChargeCredits?.Count > 0)
                        {
                            paymentInfoDiscounts.ChargeCredits = paymentInfoDiscounts.ChargeCredits.Where(x => x.AmountValue > 0 || x.DiscountAmountValue > 0)
                                .OrderBy(x => x.IsOther).ThenBy(x => x.EventId).ToList();
                            discountCoupons = paymentInfoDiscounts.ChargeCredits.Where(x => x.IsCredit)
                                .Select(x => x.DiscountCode).Distinct().ToList();
                        }
                    }
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    registrationValidation,
                    enableOnlinePayment,
                    paymentInfo,
                    paymentInfoDiscounts,
                    discountCoupons
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Cons the ed remove discount coupon.
        /// </summary>
        /// <param name="discountCoupon">The discount coupon.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/ConEdRemoveDiscountCoupon")]
        public JsonResult ConEdRemoveDiscountCoupon([FromBody] PaymentDiscountCouponViewModel discountCoupon)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
                PaymentInfoViewModel paymentInfo = ApplyDiscounts(formatCurrency);
                string assessmentType = _institutionSettingService.GetConEdRegistration().AssessmentType;
                bool result = true;
                bool temporalResult = true;
                decimal amount = 0;
                List<ChargeCredit> registrationChargeCredits = null;
                int sectionId = 0;
                foreach (DiscountChargeCreditViewModel row in paymentInfo.ChargeCredits.FindAll(x => string.Equals(x.DiscountCode, discountCoupon.Code, StringComparison.OrdinalIgnoreCase)))
                {
                    if (sectionId != row.SectionId)
                    {
                        temporalResult = _registrationService.DeleteDiscountApplied(Account.PersonId, row.SectionId,
                        discountCoupon.Code) > 0;
                        if (temporalResult)
                        {
                            registrationChargeCredits = _financeService.ProcessAssessment(Account.PersonId, assessmentType,
                                        row.AcademicYear, row.AcademicTerm, row.AcademicSession, paymentInfo.ConEdTransactionId);
                            if (registrationChargeCredits.Count > 0)
                            {
                                paymentInfo.ChargeCredits.RemoveAll(x => x.SectionId == row.SectionId && x.IsCredit);
                                amount = registrationChargeCredits.Sum(x => x.Amount) ?? 0;
                                paymentInfo.TotalAmountValue -= amount;
                                paymentInfo.TotalAmount = FormatHelper.ToCurrency(paymentInfo.TotalAmountValue, formatCurrency);
                                paymentInfo.PaymentDueValue -= amount;
                                paymentInfo.PaymentDue = FormatHelper.ToCurrency(paymentInfo.PaymentDueValue, formatCurrency);
                                paymentInfo.CurrentBalanceValue -= amount;
                                paymentInfo.CurrentBalance = FormatHelper.ToCurrency(paymentInfo.CurrentBalanceValue, formatCurrency);
                            }
                        }
                    }
                    sectionId = row.SectionId;
                    result = result && temporalResult;
                }
                return Json(SerializationHelper.ToJsonResult(new { result, paymentInfo }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Delete a registration log.
        /// </summary>
        /// <param name="id">The registration log identifier.<seealso cref="int"/></param>
        /// <returns>
        /// The JsonResult. <seealso cref="JsonResult"/>
        /// </returns>
        [HttpPost]
        [Route("Students/DeleteRegistrationLog")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult DeleteRegistrationLog([FromBody] RegistrationLogDeletionModelModel model)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_registrationService.DeleteRegistrationLog(model.RegistrationLogId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Drops the con ed registration.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/DropConEdRegistration")]
        public JsonResult DropConEdRegistration([FromBody] int sectionId)
        {
            try
            {
                if (sectionId <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "Section Id is < 0", 0, false));
                string language = _settingHelper.GetLanguage(Account);
                InstitutionSettings.ConEdRegistration conEdRegistrationSettings = _institutionSettingService.GetConEdRegistration();
                if (!conEdRegistrationSettings.AllowDrops)
                {
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        id = sectionId,
                        notAllowed = true
                    }));
                }

                SectionCourseDate sectionDates = _registrationService.GetTranscriptDetailRegistrationDate(Account.PersonId, sectionId);
                DateTime dropTimeLimit = sectionDates.StartDate.AddDays(conEdRegistrationSettings.DropTimeLimit);
                if (DateTime.Today > dropTimeLimit)
                {
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        id = sectionId,
                        dateConflict = true
                    }));
                }
                ValidationMessagesResources registrationResources = _resourcesHelper.GetResourceType<ValidationMessagesResources>(language, new("Registration", "ValidationMessages"));
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<int> dropSections = new()
                {
                    sectionId
                };
                StudentRegistration studentRegistration = new()
                {
                    AddSections = new Dictionary<int, string>(),
                    DropSections = dropSections,
                    IsConEd = true
                };
                RegistrationMessage registrationMessage =
                    _registrationService.PerformConEdRegistration(
                        Account.PersonId,
                        studentRegistration,
                        conEdRegistrationSettings,
                        _institutionSettingService.GetFinancial());
                _registrationService.DeleteDiscountsApplied(Account.PersonId, sectionId);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    id = sectionId,
                    registrationValidation = registrationMessage.ToViewModel(registrationResources, true, general)
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Drops the registration.
        /// </summary>
        /// <param name="registrationCourseModel">The registration course model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/DropRegistration")]
        public JsonResult DropRegistration([FromBody] RegistrationCourseModel registrationCourseModel)
        {
            try
            {
                string yearTerm = registrationCourseModel.YearTerm;
                int sectionId = registrationCourseModel.SectionId;
                if (string.IsNullOrEmpty(yearTerm))
                    return Json(SerializationHelper.ToJsonResult(null, "Year/Term is empty", 0, false));
                if (sectionId <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "Section Id is < 0", 0, false));
                string language = _settingHelper.GetLanguage(Account);
                InstitutionSettings.Registration registrationSettings = _institutionSettingService.GetRegistration();
                if (!registrationSettings.AllowDrops)
                {
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        id = sectionId,
                        notAllowed = true
                    }));
                }

                string[] yt = yearTerm.Split('/');
                if (yt?.Length >= 2
                    && !string.IsNullOrEmpty(yt[0])
                    && !string.IsNullOrEmpty(yt[1]))
                {
                    ValidationMessagesResources registrationResources = _resourcesHelper.GetResourceType<ValidationMessagesResources>(language, new("Registration", "ValidationMessages"));
                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    List<int> dropSections = new()
                    {
                        sectionId
                    };
                    StudentRegistration studentRegistration = new()
                    {
                        AcademicTerm = yt[1],
                        AcademicYear = yt[0],
                        AddSections = new Dictionary<int, string>(),
                        DropSections = dropSections
                    };
                    RegistrationMessage registrationMessage =
                        _registrationService.PerformRegistration(
                            Account.PersonId,
                            studentRegistration,
                            registrationSettings,
                            _institutionSettingService.GetFinancial(),
                            _scheduleService);
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        id = sectionId,
                        registrationValidation = registrationMessage.ToViewModel(registrationResources, true, general)
                    }));
                }
                return Json(SerializationHelper.ToJsonResult(null, "Year/Term format is invalid", 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Edits the permission request.
        /// </summary>
        /// <param name="permissionRequest">The permission request.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/EditPermissionRequest")]
        public JsonResult EditPermissionRequest([FromBody] PermissionRequestModel permissionRequest)
        {
            try
            {
                bool result = permissionRequest?.Id > 0 && !string.IsNullOrEmpty(permissionRequest.Comments);
                if (result && _permissionRequestService.UpdateStudentComments(permissionRequest.Id, permissionRequest.Comments))
                    return Json(SerializationHelper.ToJsonResult(permissionRequest.Id));
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Registrations the specified student registration model.
        /// </summary>
        /// <param name="studentRegistrationModel">The student registration model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/Registration")]
        public JsonResult Registration([FromBody] StudentRegistrationModel studentRegistrationModel)
        {
            try
            {
                string yearTerm = studentRegistrationModel.YearTerm;
                Dictionary<int, string> sections = studentRegistrationModel.Sections;
                if (string.IsNullOrEmpty(yearTerm))
                    return Json(SerializationHelper.ToJsonResult(null, "Year/Term is empty", 0, false));
                if (sections == null || sections.Count <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "No sections to register", 0, false));
                string language = _settingHelper.GetLanguage(Account);
                string[] yt = yearTerm.Split('/');
                if (yt?.Length >= 2
                    && !string.IsNullOrEmpty(yt[0])
                    && !string.IsNullOrEmpty(yt[1]))
                {
                    InstitutionSettings.Registration registrationSettings = _institutionSettingService.GetRegistration();
                    // Verify agreement
                    if (registrationSettings.EnableStudentAgreement
                        && !_peopleService.HasAgreementAccepted(Account.PersonId, AgreementType.Registration, int.Parse(yt[0]), yt[1]))
                    {
                        return Json(SerializationHelper.ToJsonResult(null, "The student did not accept the agreement", 0, false));
                    }

                    // Registration
                    StudentRegistration studentRegistration = new()
                    {
                        AcademicYear = yt[0],
                        AcademicTerm = yt[1],
                        AddSections = sections,
                        DropSections = new List<int>()
                    };
                    ValidationMessagesResources registrationResources = _resourcesHelper.GetResourceType<ValidationMessagesResources>(language, new("Registration", "ValidationMessages"));
                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();

                    RegistrationMessage registrationMessage =
                        _registrationService.PerformRegistration(
                            Account.PersonId,
                            studentRegistration,
                            registrationSettings,
                            _institutionSettingService.GetFinancial(),
                            _scheduleService);

                    RegistrationValidationViewModel registrationValidation = registrationMessage.ToViewModel(registrationResources, false, general);

                    HttpContext.Session.SetInt32(Constants._registrationLogIdSession, registrationMessage.RegistrationLogId);

                    // Send notification
                    if (registrationValidation.IsSuccessful)
                        _ = SendRegistrationNotificationAsync(sections.Select(s => s.Key).ToList(), false);

                    // Payment or Assessment info
                    bool enableOnlinePayment = registrationSettings.EnableOnlinePayment;
                    PaymentInfoViewModel paymentInfo = null;
                    if (registrationMessage.StatementNumber != null && registrationMessage.ChargeCredits?.Count > 0)
                    {
                        IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
                        decimal totalAmount = 0;
                        StatementTotals statementTotals = _financeService.GetStatementTotals(Account.PersonId, (int)registrationMessage.StatementNumber);
                        paymentInfo = new PaymentInfoViewModel
                        {
                            RequireOnlinePayment = registrationSettings.RequireOnlinePayment,
                            StatementNumber = registrationMessage.StatementNumber,
                            CurrentBalance = FormatHelper.ToCurrency(statementTotals.CurrentBalance, formatCurrency),
                            CurrentBalanceValue = statementTotals.CurrentBalance,
                            PaymentDue = FormatHelper.ToCurrency(statementTotals.PaymentDue, formatCurrency),
                            PaymentDueValue = statementTotals.PaymentDue
                        };
                        foreach (RegistrationChargeCredit row in registrationMessage.ChargeCredits)
                        {
                            paymentInfo.ChargeCredits.Add(new DiscountChargeCreditViewModel
                            {
                                Amount = FormatHelper.ToCurrency(row.Amount, formatCurrency),
                                Code = row.ChargeCreditNumber,
                                Description = row.Description,
                                IsCredit = row.IsCredit
                            });
                            if (row.IsCredit)
                                totalAmount += (row.Amount * -1);
                            totalAmount += row.Amount;
                        }
                        paymentInfo.TotalAmount = FormatHelper.ToCurrency(totalAmount, formatCurrency);
                        paymentInfo.TotalAmountValue = totalAmount;
                    }

                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        registrationValidation,
                        enableOnlinePayment,
                        paymentInfo
                    }));
                }
                return Json(SerializationHelper.ToJsonResult(null, "Year/Term format is invalid", 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Registrations the summary.
        /// </summary>
        /// <param name="id">The identifier.<seealso cref="int"/></param>
        /// <returns>
        /// The JsonResult. <seealso cref="JsonResult"/>
        /// </returns>
        [HttpPost]
        [Route("Students/RegistrationSummary")]
        public JsonResult RegistrationSummary([FromBody] int id)
        {
            try
            {
                if (id <= 0 && HttpContext.Session.GetInt32(Constants._registrationLogIdSession) != null)
                {
                    id = HttpContext.Session.GetInt32(Constants._registrationLogIdSession).Value;
                    HttpContext.Session.Remove(Constants._registrationLogIdSession);
                }
                return Json(SerializationHelper.ToJsonResult(_registrationService.GetRegistrationLog(id).ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the registration summary for a person.
        /// </summary>
        /// <param name="impersonateInfo">The impersonate information model.<seealso cref="ImpersonateInfoModel"/></param>
        /// <returns>
        /// The JsonResult. <seealso cref="JsonResult"/>
        /// </returns>
        [HttpPost]
        [Route("Students/RegistrationSummaryByPerson")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult RegistrationSummaryByPerson([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                List<RegistrationLog> registrationLogs = _registrationService.GetRegistrationLogsByPerson(personId);

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);

                return Json(SerializationHelper.ToJsonResult(registrationLogs.ToViewModel(datetimeCulture)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the permission request.
        /// </summary>
        /// <param name="permissionRequest">The permission request.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/SavePermissionRequest")]
        public JsonResult SavePermissionRequest([FromBody] PermissionRequestModel permissionRequest)
        {
            try
            {
                bool result = permissionRequest?.Id > 0 && !string.IsNullOrEmpty(permissionRequest.Comments);
                if (result)
                {
                    result = _permissionRequestService.Create(
                       Account.PersonId,
                       permissionRequest.Id,
                       permissionRequest.Comments);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Sends the registration notification asynchronous.
        /// </summary>
        /// <param name="sectionIds">The section ids.</param>
        /// <param name="isConEd">if set to <c>true</c> [is con ed].</param>
        private async Task SendRegistrationNotificationAsync(List<int> sectionIds, bool isConEd)
        {
            try
            {
                if (sectionIds?.Count > 0)
                {
                    string eventNotification = string.Empty;
                    // Verify notification type
                    if (isConEd)
                        eventNotification = NotificationEvent.ConEdRegistrationSuccess;
                    else
                        eventNotification = NotificationEvent.TradRegRegistrationSuccess;
                    bool isActive = await _notificationsHelper.EventIsActiveAsync(eventNotification).ConfigureAwait(false);
                    if (!isActive)
                        return;
                    List<NotificationToken> currentTokens = _notificationsHelper.GetPersonNotificationTokensByPersonId(_peopleService, Account.PersonId);
                    List<SectionDetail> sections = new();
                    foreach (int sectionId in sectionIds)
                        sections.Add(_sectionService.GetDetail(sectionId));
                    NotificationTokenDetail sectionsTokens = new()
                    {
                        Id = "sections",
                        ValueList = new List<NotificationToken>()
                    };
                    foreach (SectionDetail section in sections)
                    {
                        sectionsTokens.ValueList.Add(new NotificationToken
                        {
                            Token = new NotificationTokenDetail
                            {
                                Id = "section",
                                ValueList = new List<NotificationToken>
                                    {
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.academicyear", Value = section.AcademicYear } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.academicterm", Value = section.AcademicTermDesc } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.academicsession", Value = section.AcademicSessionDesc } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.eventid", Value = section.EventId } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.eventsubtype", Value = section.EventSubTypeDesc } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.section", Value = section.SectionEvent } },
                                        new NotificationToken { Token = new NotificationTokenDetail { Id = "section.eventlongname", Value = section.EventLongName } },
                                    }
                            }
                        });
                    }
                    currentTokens.Add(new NotificationToken { Token = sectionsTokens });
                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = eventNotification,
                        Tokens = currentTokens
                    });
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
            }
        }

        #endregion Courses

        #region Finances

        /// <summary>
        /// Balances the specified student balance model.
        /// </summary>
        /// <param name="studentBalanceModel">The student balance model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/Balance")]
        public JsonResult Balance([FromBody] StudentBalanceModel studentBalanceModel)
        {
            try
            {
                string yearTermSession = studentBalanceModel.YearTermSession;
                string option = studentBalanceModel.Option;
                int? personId = studentBalanceModel.PersonId;
                /*  option 1 - Detail by Charges/Credits
                    option 2 - Detail by Summary Type
                    option 3 - Balance Summary */
                if (!string.IsNullOrEmpty(yearTermSession))
                {
                    string year = string.Empty;
                    string term = string.Empty;
                    string session = string.Empty;
                    InstitutionSettings.Financial financialSettings = _institutionSettingService.GetFinancial();
                    InstitutionSettings.General generalSettings = _institutionSettingService.GetGeneral();
                    if (yearTermSession != "0")
                    {
                        string[] yts = yearTermSession.Split('/');
                        if (yts?.Length > 0)
                        {
                            year = yts[0];
                            term = yts[1];
                            if (yts.Length >= 3)
                                session = yts[2];
                        }
                    }

                    Balance balance = null;
                    personId ??= Account.PersonId;
                    switch (option)
                    {
                        case "1":
                            balance = _financeService.GetBalance(personId.Value, year, term, session,
                                true, financialSettings.DisplayWashoutTransactions, financialSettings.IncludeAnticipatedAid);
                            return Json(SerializationHelper.ToJsonResult(balance.ToChargesViewModel(financialSettings, generalSettings, _settingService)));

                        case "2":
                            balance = _financeService.GetBalance(personId.Value, year, term, session,
                                true, financialSettings.DisplayWashoutTransactions, financialSettings.IncludeAnticipatedAid);
                            return Json(SerializationHelper.ToJsonResult(balance.ToSummaryTypeViewModel(financialSettings, generalSettings, _settingService)));

                        case "3":
                            balance = _financeService.GetBalance(personId.Value, year, term, session,
                                false, financialSettings.DisplayWashoutTransactions, financialSettings.IncludeAnticipatedAid);
                            return Json(SerializationHelper.ToJsonResult(balance.ToSummaryViewModel(financialSettings, generalSettings, _settingService)));

                        default:
                            return Json(SerializationHelper.ToJsonResult(balance));
                    }
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Retrieve the Financial Aid Report by Award Year Token
        /// </summary>
        /// <param name="studentFinancialAidModel">The student financial aid model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/FinancialAids")]
        public JsonResult FinancialAids([FromBody] StudentFinancialAidModel studentFinancialAidModel)
        {
            try
            {
                int awardYearToken = studentFinancialAidModel.AwardYearToken;
                int? personId = studentFinancialAidModel.PersonId;
                personId ??= Account.PersonId;
                string language = _settingHelper.GetLanguage(Account);
                FinancialAidResources resources = _resourcesHelper.GetResourceType<FinancialAidResources>(language, new("Finances", "FinancialAidMain"));
                return Json(SerializationHelper.ToJsonResult(
                    _financeService.GetFinancialAid(awardYearToken, personId.Value).ToViewModel(resources, _institutionSettingService)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Get the Statements
        /// </summary>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpGet]
        [Route("Students/Statements")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Statements()
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(
                    _financeService.GetStatements(Account.PersonId).ToViewModel(general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Statementses the specified statement number.
        /// </summary>
        /// <param name="statementNumber">The statement number.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("Students/Statements")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Statements([FromBody] int statementNumber)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(
                    _financeService.GetStatement(Account.PersonId, statementNumber).ToViewModel(CurrentNameFormat, general, ShowMiddleNameInitial)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Statementses the report.
        /// </summary>
        /// <param name="statementNumber">The statement number.</param>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public ActionResult StatementsReport(int statementNumber, int? personId)
        {
            try
            {
                personId ??= Account.PersonId;
                string language = _settingHelper.GetLanguage(Account);
                byte[] report = _reportHelper.GetStatements(personId.Value, statementNumber, CurrentNameFormat, ShowMiddleNameInitial, language);
                return File(report, "application/pdf", "StatementsReport.pdf");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        public class ConnectionStringsInterno
        {
            public int CommandTimeOut { get; set; }

            public string PowerCampusAuthDbContext { get; set; }

            public string PowerCampusDbContext { get; set; }

            public string PowerFaidsDbContext { get; set; }
        }

        public class ConnectionStringsInternoJson
        {

            public ConnectionStringsInterno ConnectionStrings { get; set; }

        }

        [HttpGet]
        [Route("Students/GenerateReport")]
        public ActionResult GenerateReport(string PersonId, string academicYear, string academicTerm,string academicSession, string FilterText)
        {
            try
            {
                /*string fileName = "Config/ConnectionSettings.json";
                string jsonString = System.IO.File.ReadAllText(fileName);
                ConnectionStringsInternoJson _conn = JsonSerializer.Deserialize<ConnectionStringsInternoJson>(jsonString)!;

                using (SqlConnection conn = new SqlConnection(_conn.ConnectionStrings.PowerCampusDbContext))
                {
                    using (SqlCommand cmd = new SqlCommand("dbo.zAdd_spSaveAccountBalanceSummary", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Asignar valores a los parámetros del procedimiento almacenado.
                        cmd.Parameters.Add("@personId", SqlDbType.Int).Value = int.Parse(PersonId); // Suponiendo que UserId es un entero.
                        cmd.Parameters.Add("@academicYear", SqlDbType.NVarChar, 4).Value = academicYear; // Asumido como NVARCHAR(4)
                        cmd.Parameters.Add("@academicTerm", SqlDbType.NVarChar, 10).Value = academicTerm; // Asumido como NVARCHAR(10)
                        cmd.Parameters.Add("@academicSession", SqlDbType.NVarChar, 10).Value = string.IsNullOrEmpty(academicSession) ? (object)DBNull.Value : academicSession; // Asignar NULL si Period está vacío
                        cmd.Parameters.Add("@filterText", SqlDbType.NVarChar, 255).Value = string.IsNullOrEmpty(FilterText) ? (object)DBNull.Value : FilterText; // Asignar NULL si FilterText está vacío

                        conn.Open();
                        cmd.ExecuteNonQuery();
                        conn.Close();
                    }
                }*/

                byte[] report = _reportHelper.GetPaymentReference(PersonId, academicYear, academicTerm, academicSession, FilterText);

                return File(report, "application/pdf", "referenciabancaria.pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, ex.Message, ex);
                return new EmptyResult();
            }
        }


        #endregion Finances

        #region Grades

        /// <summary>
        /// Activities the grades.
        /// </summary>
        /// <param name="studentSectionModel">The student section model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/ActivityGrades")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult ActivityGrades([FromBody] StudentSectionModel studentSectionModel)
        {
            try
            {
                if (studentSectionModel is null)
                    throw new ArgumentNullException(nameof(studentSectionModel));
                int sectionId = studentSectionModel.SectionId;
                int id = studentSectionModel.ImpersonateInfo?.PersonId > 0 ? studentSectionModel.ImpersonateInfo.PersonId : Account.PersonId;
                string language = _settingHelper.GetLanguage(Account);
                bool IsMidtermGradesEnabled = _institutionSettingService.GetCourseManagement().MidtermGrades;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                ActivityGradeReport activityGradeReport =
                    _gradeService.GetActivityGradesReport(id, sectionId, IsMidtermGradesEnabled);
                return Json(SerializationHelper.ToJsonResult(activityGradeReport.ToViewModel(_settingService, general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Deletes the violation.
        /// </summary>
        /// <param name="violationId">The violation identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/Violations/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementAlerts,
            ClaimsConstants.DepartmentCourseManagementAlerts
         }, true })]
        public JsonResult DeleteViolation([FromBody] int violationId)
        {
            try
            {
                bool result;
                if (violationId <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "violation id is not valid", 404, false));
                result = _violationService.Delete(violationId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Reports the specified term period identifier.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException">model</exception>
        [HttpPost]
        [Route("Students/Grades")]
        public JsonResult Grades([FromBody] TermPeriodPeopleModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int termPeriodId = model.TermPeriodId;
                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                GradeReport report = _gradeService.GetReport(personId, termPeriodId, _institutionSettingService.GetCourseManagement().EnableProjectedGrade);
                return Json(SerializationHelper.ToJsonResult(report.ToViewModel(_institutionSettingService)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gradeses the report.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException">model</exception>
        [HttpGet]
        [Route("Students/GradesReport/{Sequence}/{TermPeriodId}/{ImpersonateInfo.Process?}/{ImpersonateInfo.PersonId?}/{ImpersonateInfo.ViewId?}/{ImpersonateInfo.TabId?}")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public ActionResult GradesReport(StudentGradeReportModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));
                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                string language = _settingHelper.GetLanguage(Account);
                byte[] report = _reportHelper.GetGrades(personId, model.TermPeriodId, language, model.Sequence);

                return File(report, "application/pdf", "GradesReport.pdf");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        /// <summary>
        /// Saves the violation.
        /// </summary>
        /// <param name="studentViolationModel">The student violation model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/Violations/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementAlerts,
            ClaimsConstants.DepartmentCourseManagementAlerts
         }, true })]
        public JsonResult SaveViolation([FromBody] StudentViolationModel studentViolationModel)
        {
            try
            {
                bool result = false;
                if (studentViolationModel != null)
                {
                    ViolationInfo violationInfo = ToViolationInfo(studentViolationModel, Account.PersonId);
                    if (studentViolationModel.ViolationId == 0)
                        result = _violationService.Create(violationInfo);
                    else
                        result = _violationService.Update(violationInfo);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Unofficials the transcripts.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult UnofficialTranscripts([FromBody] ImpersonateModel model)
        {
            try
            {
                int id = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                UnofficialTranscript unofficialTranscript =
                    _gradeService.GetUnofficialTranscript(id, true, id);
                List<SiteMapOptionNameFormat> nameFormats = _siteMapService.GetNameFormats();
                string nameFormat = FormatHelper.GetNameFormat("UnofficialTranscriptId", nameFormats);
                bool showMiddleNameInitial = FormatHelper.GetShowMiddleNameInitial("UnofficialTranscriptId", nameFormats);
                return Json(SerializationHelper.ToJsonResult(unofficialTranscript.ToViewModel(_institutionSettingService, nameFormat, showMiddleNameInitial)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Unofficials the transcripts report.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Students/UnofficialTranscriptsReport/{ImpersonateInfo.Process?}/{ImpersonateInfo.PersonId?}/{ImpersonateInfo.ViewId?}/{ImpersonateInfo.TabId?}")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public ActionResult UnofficialTranscriptsReport(ImpersonateModel model)
        {
            try
            {
                int id = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                List<SiteMapOptionNameFormat> nameFormats = _siteMapService.GetNameFormats();
                string language = _settingHelper.GetLanguage(Account);
                string nameFormat = FormatHelper.GetNameFormat("UnofficialTranscriptId", nameFormats);
                bool showMiddleNameInitial = FormatHelper.GetShowMiddleNameInitial("UnofficialTranscriptId", nameFormats);
                byte[] report = _reportHelper.GetUnofficialTranscript(id, nameFormat, showMiddleNameInitial, language);
                return File(report, "application/pdf", "UnofficialTranscript.pdf");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        #endregion Grades

        #region Profile

        /// <summary>
        /// Get the academic record
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Academic([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                Academic primaryAcademic = null;
                Picture picture = null;
                List<AcademicGpa> academicGpas = new();
                string currentNameFormat = string.Empty;
                string currentNameSort = string.Empty;
                bool showMiddleNameInitial = false;

                People people = _peopleService.Get(personId);

                if (people != null)
                    primaryAcademic = _academicService.GetPrimary(personId);

                if (primaryAcademic != null)
                {
                    currentNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                    currentNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.General);
                    showMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);
                    academicGpas = _academicService.GetGpas(personId, primaryAcademic);
                    if (primaryAcademic.ProgramId != null)
                        picture = _programService.GetPicture(primaryAcademic.ProgramId.Value);
                }

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();

                return Json(SerializationHelper.ToJsonResult(
                    primaryAcademic.ToViewModel(academicGpas, people, currentNameFormat, currentNameSort,
                    _institutionSettingService.GetStudentRecords().ShowStudentPicture, picture,
                    general, mail, _nameFormatService, showMiddleNameInitial, _pictureHelper)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Profile

        #region Alerts Report

        /// <summary>
        /// Alerts the report.
        /// </summary>
        /// <param name="model">The student term period model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Students/AlertsReport")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult AlertsReport([FromBody] StudentTermPeriodModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int termPeriodId = model.TermPeriodId;
                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<AlertsReportViewModel> alertReports = _violationService.GetAlertsReport(personId, termPeriodId).ToViewModel(CurrentNameFormat, CurrentNameSort,
                    ShowMiddleNameInitial, general);
                return Json(SerializationHelper.ToJsonResult(alertReports));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Alerts Report

        #region Private Methods

        /// <summary>
        /// Applies the discounts.
        /// </summary>
        /// <param name="formatCurrency">The format currency.</param>
        /// <returns></returns>
        private PaymentInfoViewModel ApplyDiscounts(IFormatProvider formatCurrency)
        {
            PaymentInfoViewModel paymentInfo = new();
            try
            {
                List<Discount> discountApplies = null;
                DiscountChargeCreditViewModel discountChargeCreditApplies = null;
                decimal amountDiscountApplies = 0;
                int sectionId = 0;
                paymentInfo.ChargeCredits = new();
                PaymentInfoViewModel paymentInfoOrigin = HttpContext.Session.GetObject<PaymentInfoViewModel>(Constants._paymentInfoSession);
                paymentInfo.CurrentBalance = paymentInfoOrigin.CurrentBalance;
                paymentInfo.CurrentBalanceValue = paymentInfoOrigin.CurrentBalanceValue;
                paymentInfo.PaymentDue = paymentInfoOrigin.PaymentDue;
                paymentInfo.PaymentDueValue = paymentInfoOrigin.PaymentDueValue;
                paymentInfo.TotalAmount = paymentInfoOrigin.TotalAmount;
                paymentInfo.TotalAmountValue = paymentInfoOrigin.TotalAmountValue;
                paymentInfo.RequireOnlinePayment = paymentInfoOrigin.RequireOnlinePayment;
                paymentInfo.UseTransactionChargesOnly = paymentInfoOrigin.UseTransactionChargesOnly;
                paymentInfo.StatementNumber = paymentInfoOrigin.StatementNumber;
                paymentInfo.ConEdTransactionId = paymentInfoOrigin.ConEdTransactionId;
                foreach (DiscountChargeCreditViewModel item in paymentInfoOrigin.ChargeCredits)
                {
                    if (item.IsCredit)
                        continue;
                    paymentInfo.ChargeCredits.Add(new DiscountChargeCreditViewModel
                    {
                        AcademicSession = item.AcademicSession,
                        AcademicTerm = item.AcademicTerm,
                        AcademicYear = item.AcademicYear,
                        Amount = item.Amount,
                        AmountValue = item.AmountValue,
                        Code = item.Code,
                        Description = item.Description,
                        DiscountAmount = item.DiscountAmount,
                        DiscountAmountValue = item.DiscountAmountValue,
                        DiscountCode = item.DiscountCode,
                        EventId = item.EventId,
                        EventName = item.EventName,
                        IsCredit = item.IsCredit,
                        IsOther = item.IsOther,
                        SectionId = item.SectionId
                    });
                    discountApplies = _registrationService.GetCourseDiscountAppliedByPerson(Account.PersonId, item.SectionId);
                    foreach (Discount discount in discountApplies)
                    {
                        if (discount.PercentageFlat == "F" && sectionId != item.SectionId)
                            amountDiscountApplies = discount.Amount;
                        else
                            amountDiscountApplies = discount.Percentage * item.AmountValue / 100;
                        paymentInfo.ChargeCredits.Add(new DiscountChargeCreditViewModel
                        {
                            AcademicSession = item.AcademicSession,
                            AcademicTerm = item.AcademicTerm,
                            AcademicYear = item.AcademicYear,
                            Code = item.Code,
                            Description = discount.CodeDesc,
                            DiscountAmount = FormatHelper.ToCurrency(amountDiscountApplies, formatCurrency),
                            DiscountAmountValue = amountDiscountApplies,
                            DiscountCode = discount.Code,
                            EventId = item.EventId,
                            SectionId = item.SectionId,
                            IsCredit = true
                        });
                        discountChargeCreditApplies = paymentInfo.ChargeCredits.Find(x => x.Code == item.Code);
                        discountChargeCreditApplies.AmountValue -= amountDiscountApplies;
                        paymentInfo.CurrentBalanceValue -= amountDiscountApplies;
                        paymentInfo.PaymentDueValue -= amountDiscountApplies;
                        paymentInfo.TotalAmountValue -= amountDiscountApplies;
                    }
                    sectionId = item.SectionId;
                }
                paymentInfo.CurrentBalance = FormatHelper.ToCurrency(paymentInfo.CurrentBalanceValue, formatCurrency);
                paymentInfo.PaymentDue = FormatHelper.ToCurrency(paymentInfo.PaymentDueValue, formatCurrency);
                paymentInfo.TotalAmount = FormatHelper.ToCurrency(paymentInfo.TotalAmountValue, formatCurrency);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(StudentsController).FullName, exception.Message, exception);
            }
            return paymentInfo;
        }

        /// <summary>
        /// To the violation information.
        /// </summary>
        /// <param name="studentViolationModel">The student violation model.</param>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        /// <exception cref="System.NotImplementedException"></exception>
        private ViolationInfo ToViolationInfo(StudentViolationModel studentViolationModel, int personId)
        {
            InstitutionSettings.General general = _institutionSettingService.GetGeneral();
            return new ViolationInfo
            {
                StudentId = studentViolationModel.StudentId,
                Violation = new()
                {
                    CreatedDate = DateTime.Today,
                    Description = studentViolationModel.Description,
                    ReportedById = personId,
                    SectionId = studentViolationModel.SectionId,
                    ViolationDate = (DateTime)FormatHelper.FromDatePicker(studentViolationModel.ViolationDate),
                    ViolationId = studentViolationModel.ViolationId,
                    ViolationTypeId = studentViolationModel.ViolationTypeId
                }
            };
        }

        #endregion Private Methods
    }
}