// --------------------------------------------------------------------
// <copyright file="BlockRegistrationRuleController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Administration;
using System;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// BlockRegistrationController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class BlockRegistrationRuleController : BaseEndpointController
    {
        /// <summary>
        /// The block registration rule service
        /// </summary>
        private readonly IBlockRegistrationRuleService _blockRegistrationRuleService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<BlockRegistrationRuleController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="BlockRegistrationRuleController"/> class.
        /// </summary>
        /// <param name="blockRegistrationRuleService">The block registration rule service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public BlockRegistrationRuleController(
            IBlockRegistrationRuleService blockRegistrationRuleService,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            IAppLogger<BlockRegistrationRuleController> logger)
            : base(serializationHelper)
        {
            _blockRegistrationRuleService = blockRegistrationRuleService;
            _institutionSettingService = institutionSettingService;
            _logger = logger;
        }

        /// <summary>
        /// Detailses the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationRule/Details")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationRules } })]
        public JsonResult Details([FromBody] int? id)
        {
            try
            {
                BlockRegistrationRules blockRegistrationRules = _blockRegistrationRuleService.GetDetails(id ?? 0);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    blocksAdded = id > 0 ? blockRegistrationRules.BlocksAdded : null,
                    ruleDetail = id > 0 ? blockRegistrationRules.BlockRegistrationRuleDetail.ToViewModel(general) : null,
                    viewOptions = blockRegistrationRules.ViewOptions,
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationRuleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Indexes the specified block registration rule search.
        /// </summary>
        /// <param name="blockRegistrationRuleSearch">The block registration rule search.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationRule")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationRules } })]
        public JsonResult Index([FromBody] BlockRegistrationRuleSearchModel blockRegistrationRuleSearch)
        {
            try
            {
                BlockRegistrationRuleHeadersViewModel blockRegistrationRules = _blockRegistrationRuleService.Get(
                    blockRegistrationRuleSearch.StartIndex.Value, blockRegistrationRuleSearch.Length.Value, blockRegistrationRuleSearch.TermPeriodId,
                    blockRegistrationRuleSearch.Name ?? string.Empty).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(blockRegistrationRules));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationRuleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified block registration rule.
        /// </summary>
        /// <param name="blockRegistrationRule">The block registration rule.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationRule/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationRules } })]
        public JsonResult Save([FromBody] BlockRegistrationRule blockRegistrationRule)
        {
            try
            {
                bool result;
                blockRegistrationRule.PersonId = Account.PersonId;
                if (blockRegistrationRule.BlockRegistrationRuleId > 0)
                    result = _blockRegistrationRuleService.Update(blockRegistrationRule);
                else
                    result = _blockRegistrationRuleService.Create(blockRegistrationRule);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationRuleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Statuses the specified block registration rule status model.
        /// </summary>
        /// <param name="blockRegistrationRuleStatusModel">The block registration rule status model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationRule/Status")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationRules } })]
        public JsonResult Status([FromBody] BlockRegistrationRuleStatusModel blockRegistrationRuleStatusModel)
        {
            try
            {
                BlockRegistrationRule blockRegistrationRule = new()
                {
                    BlockRegistrationRuleId = blockRegistrationRuleStatusModel.BlockRegistrationRuleId,
                    IsActive = blockRegistrationRuleStatusModel.IsActive,
                    PersonId = Account.PersonId
                };
                bool result = _blockRegistrationRuleService.Update(blockRegistrationRule);
                return Json(SerializationHelper.ToJsonResult(new { blockRegistrationRuleId = blockRegistrationRule.BlockRegistrationRuleId, result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationRuleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Validates the name.
        /// </summary>
        /// <param name="blockRegistrationGroupSearchModel">The block registration group search model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationRule/ValidateName")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationRules } })]
        public JsonResult ValidateName([FromBody] BlockRegistrationGroupSearchModel blockRegistrationGroupSearchModel)
        {
            try
            {
                bool result = _blockRegistrationRuleService.Exists(blockRegistrationGroupSearchModel.Name, blockRegistrationGroupSearchModel.TermPeriodId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationRuleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Validates the priority.
        /// </summary>
        /// <param name="blockRegistrationRuleValidateModel">The block registration rule validate model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationRule/ValidatePriority")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationRules } })]
        public JsonResult ValidatePriority([FromBody] BlockRegistrationRuleValidateModel blockRegistrationRuleValidateModel)
        {
            try
            {
                bool result = _blockRegistrationRuleService.Exists(blockRegistrationRuleValidateModel.Priority, blockRegistrationRuleValidateModel.TermPeriodId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationRuleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}