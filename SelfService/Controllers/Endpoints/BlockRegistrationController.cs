// --------------------------------------------------------------------
// <copyright file="BlockRegistrationController.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Administration;
using SelfService.Models.Registration;
using SelfService.Models.Resources;
using SelfService.Models.Schedule;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// BlockRegistrationController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class BlockRegistrationController : BaseEndpointController
    {
        /// <summary>
        /// The block registration service
        /// </summary>
        private readonly IBlockRegistrationService _blockRegistrationService;

        /// <summary>
        /// The cart service
        /// </summary>
        private readonly ICartService _cartService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<BlockRegistrationController> _logger;

        /// <summary>
        /// The period service
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The registration service
        /// </summary>
        private readonly IRegistrationService _registrationService;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The schedule service
        /// </summary>
        private readonly IScheduleService _scheduleService;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The wait list service
        /// </summary>
        private readonly IWaitListService _waitListService;

        /// <summary>
        /// Initializes a new instance of the <see cref="BlockRegistrationController"/> class.
        /// </summary>
        /// <param name="blockRegistrationService">The block registration service.<seealso cref="IBlockRegistrationService"/></param>
        /// <param name="cartService">The cart service.<seealso cref="ICartService"/></param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="periodService">The period service.<seealso cref="IPeriodService"/></param>
        /// <param name="registrationService">The registration service.<seealso cref="IRegistrationService"/></param>
        /// <param name="resourcesHelper">The resources helper.<seealso cref="IResourcesHelper"/></param>
        /// <param name="scheduleService">The schedule service.<seealso cref="IScheduleService"/></param>
        /// <param name="serializationHelper">The serialization helper.<seealso cref="ISerializationHelper"/></param>
        /// <param name="settingHelper">The setting helper.<seealso cref="ISettingHelper"/></param>
        /// <param name="waitListService">The wait list service.<seealso cref="IWaitListService"/></param>
        /// <param name="logger">The logger.<seealso cref="IAppLogger{BlockRegistrationController}"/></param>
        public BlockRegistrationController(
            IBlockRegistrationService blockRegistrationService,
            ICartService cartService,
            IInstitutionSettingService institutionSettingService,
            IPeriodService periodService,
            IRegistrationService registrationService,
            IResourcesHelper resourcesHelper,
            IScheduleService scheduleService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            IWaitListService waitListService,
            IAppLogger<BlockRegistrationController> logger)
            : base(serializationHelper)
        {
            _blockRegistrationService = blockRegistrationService;
            _cartService = cartService;
            _institutionSettingService = institutionSettingService;
            _periodService = periodService;
            _registrationService = registrationService;
            _resourcesHelper = resourcesHelper;
            _scheduleService = scheduleService;
            _settingHelper = settingHelper;
            _waitListService = waitListService;

            _logger = logger;
        }

        /// <summary>
        /// Adds the block.
        /// </summary>
        /// <param name="block">The block.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistration/Block/Add")]
        public JsonResult AddBlock([FromBody] StudentBlockRegRuleGroupBlockModel block)
        {
            try
            {
                bool result = false;
                bool success = false;
                if (block != null)
                {
                    bool exists = _blockRegistrationService.Exists(Account.PersonId, block.BlockRegRuleGroupBlockId);
                    if (!exists)
                        success = _blockRegistrationService.Create(Account.PersonId, block.BlockRegRuleGroupBlockId);
                    result = success || exists;
                    if (result)
                    {
                        if (block.CartSections?.Count > 0)
                        {
                            foreach (int sectionId in block.CartSections)
                                _cartService.Create(Account.PersonId, sectionId);
                        }
                        if (block.WaitlistSections?.Count > 0)
                        {
                            foreach (int sectionId in block.WaitlistSections)
                                _waitListService.Create(Account.PersonId, sectionId);
                        }
                    }
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Blocks the specified block registration model.
        /// </summary>
        /// <param name="blockRegistrationModel">The block registration model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistration/Block")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Block([FromBody] BlockRegistrationModel blockRegistrationModel)
        {
            try
            {
                int blockRegistrationRuleGroupId = blockRegistrationModel.BlockRegistrationRuleGroupId;
                int blockRegRuleGroupBlockId = blockRegistrationModel.BlockRegRuleGroupBlockId;
                YearTermModel yearTerm = blockRegistrationModel.YearTerm;
                List<BlockRegRuleGroupViewModel> blockRegRuleGroups = null;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Registration registration = _institutionSettingService.GetRegistration();
                bool enableWaitList = _institutionSettingService.GetRegistration().EnableWaitList;
                int personId = Account.PersonId;
                List<BlockRegRuleGroup> blockRegRuleGroupBlocks = _blockRegistrationService.GetBlocksByGroup(blockRegistrationRuleGroupId, yearTerm.Year, yearTerm.Term, personId);
                blockRegRuleGroups = blockRegRuleGroupBlocks.ToViewModel(CurrentNameFormat, CurrentNameSort, enableWaitList, general, ShowMiddleNameInitial, registration);
                BlockRegRuleGroupViewModel blockRegRuleGroup = null;
                if (blockRegRuleGroups?.Count > 0)
                    blockRegRuleGroup = blockRegRuleGroups.Find(b => b.BlockRegRuleGroupBlockId == blockRegRuleGroupBlockId);
                return Json(SerializationHelper.ToJsonResult(blockRegRuleGroup));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Blockses the specified block registration model.
        /// </summary>
        /// <param name="blockRegistrationModel">The block registration model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistration/Blocks")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Blocks([FromBody] BlockRegistrationModel blockRegistrationModel)
        {
            try
            {
                int blockRegistrationRuleGroupId = blockRegistrationModel.BlockRegistrationRuleGroupId;
                YearTermModel yearTerm = blockRegistrationModel.YearTerm;
                List<BlockRegRuleGroupViewModel> blockRegRuleGroups = null;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Registration registration = _institutionSettingService.GetRegistration();
                bool enableWaitList = _institutionSettingService.GetRegistration().EnableWaitList;
                int personId = Account.PersonId;
                List<BlockRegRuleGroup> blockRegRuleGroupBlocks = _blockRegistrationService.GetBlocksByGroup(blockRegistrationRuleGroupId, yearTerm.Year, yearTerm.Term, personId);
                blockRegRuleGroups = blockRegRuleGroupBlocks.ToViewModel(CurrentNameFormat, CurrentNameSort, enableWaitList, general, ShowMiddleNameInitial, registration);
                return Json(SerializationHelper.ToJsonResult(blockRegRuleGroups));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Drops the block.
        /// </summary>
        /// <param name="block">The block.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistration/Block/Drop")]
        public JsonResult DropBlock([FromBody] StudentBlockRegRuleGroupBlockModel block)
        {
            try
            {
                InstitutionSettings.Registration registrationSettings = _institutionSettingService.GetRegistration();
                if (!registrationSettings.AllowDrops)
                {
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        id = block.BlockRegRuleGroupBlockId,
                        notAllowed = true
                    }));
                }

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                string language = _settingHelper.GetLanguage(Account);
                ValidationMessagesResources registrationResources = _resourcesHelper.GetResourceType<ValidationMessagesResources>(language, new("Registration", "ValidationMessages"));
                if (block != null)
                {
                    RegistrationMessage registrationMessage = null;
                    if (block.DropSections?.Count > 0)
                    {
                        StudentRegistration studentRegistration = new()
                        {
                            AcademicTerm = block.YearTerm.Term,
                            AcademicYear = block.YearTerm.Year.ToString(),
                            AddSections = new Dictionary<int, string>(),
                            DropSections = block.DropSections
                        };
                        registrationMessage = _registrationService.PerformRegistration(Account.PersonId, studentRegistration,
                            registrationSettings, _institutionSettingService.GetFinancial(), _scheduleService);
                    }
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        id = block.BlockRegRuleGroupBlockId,
                        registrationValidation = registrationMessage.ToViewModel(registrationResources, true, general, true)
                    }));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Removes the block.
        /// </summary>
        /// <param name="block">The block.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistration/Block/Remove")]
        public JsonResult RemoveBlock([FromBody] StudentBlockRegRuleGroupBlockModel block)
        {
            try
            {
                if (block != null)
                {
                    if (block.CartSections?.Count > 0)
                    {
                        foreach (int sectionId in block.CartSections)
                            _cartService.Delete(Account.PersonId, sectionId);
                    }

                    if (block.WaitlistSections?.Count > 0)
                    {
                        foreach (int sectionId in block.WaitlistSections)
                            _waitListService.Delete(Account.PersonId, sectionId);
                    }

                    if (block.CartSections?.Count > 0 || block.WaitlistSections?.Count > 0)
                        _blockRegistrationService.DeleteEmpty(Account.PersonId);

                    return Json(SerializationHelper.ToJsonResult(block.BlockRegRuleGroupBlockId));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Removes the cart sections.
        /// </summary>
        /// <param name="sections">The sections.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistration/RemoveCartSections")]
        public JsonResult RemoveCartSections([FromBody] List<int> sections)
        {
            try
            {
                bool result = false;
                if (sections?.Count > 0)
                {
                    sections.ForEach(sectionId => _cartService.Delete(Account.PersonId, sectionId));
                    result = true;
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Rules the specified year term.
        /// </summary>
        /// <param name="yearTerm">The year term.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistration/Rule")]
        public JsonResult Rule([FromBody] YearTermModel yearTerm)
        {
            try
            {
                BlockRegistrationRuleDetailViewModel blockRegistrationRule = null;
                BlockRegistrationRule blockRegistrationRuleApplied;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                if (yearTerm?.Year > 0 && !string.IsNullOrEmpty(yearTerm.Term))
                {
                    int termPeriodId = _periodService.GetTermPeriodId(yearTerm.Year, yearTerm.Term);
                    blockRegistrationRuleApplied = _blockRegistrationService.GetRule(Account.PersonId, termPeriodId);
                    bool existsRule = blockRegistrationRuleApplied?.BlockRegistrationRuleId > 0;
                    if (existsRule)
                        blockRegistrationRule = blockRegistrationRuleApplied.ToViewModel(general);
                }
                return Json(SerializationHelper.ToJsonResult(blockRegistrationRule));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}