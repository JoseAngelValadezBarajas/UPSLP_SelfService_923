// --------------------------------------------------------------------
// <copyright file="BlockRegistrationGroupController.cs" company="Ellucian">
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
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// BlockRegistrationController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class BlockRegistrationGroupController : BaseEndpointController
    {
        /// <summary>
        /// The block registration group service
        /// </summary>
        private readonly IBlockRegistrationGroupService _blockRegistrationGroupService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<BlockRegistrationGroupController> _logger;

        /// <summary>
        /// The section service
        /// </summary>
        private readonly ISectionService _sectionService;

        /// <summary>
        /// Initializes a new instance of the <see cref="BlockRegistrationGroupController" /> class.
        /// </summary>
        /// <param name="blockRegistrationGroupService">The block registration group service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public BlockRegistrationGroupController(
            IBlockRegistrationGroupService blockRegistrationGroupService,
            IInstitutionSettingService institutionSettingService,
            ISectionService sectionService,
            ISerializationHelper serializationHelper,
            IAppLogger<BlockRegistrationGroupController> logger)
            : base(serializationHelper)
        {
            _blockRegistrationGroupService = blockRegistrationGroupService;
            _institutionSettingService = institutionSettingService;
            _sectionService = sectionService;

            _logger = logger;
        }

        /// <summary>
        /// Details the specified block registration group identifier.
        /// </summary>
        /// <param name="blockRegistrationGroupId">The block registration group identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationGroup/Details")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationBlocks } })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Details([FromBody] int blockRegistrationGroupId)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                bool enableWaitList = _institutionSettingService.GetRegistration().EnableWaitList;
                BlockRegistrationGroupDetail blockRegistrationGroupDetail = _blockRegistrationGroupService.Get(blockRegistrationGroupId);
                List<int> sections = _blockRegistrationGroupService.GetSectionIds(blockRegistrationGroupId);
                if (sections?.Count > 0)
                {
                    Section section;
                    foreach (ScheduleValidate schedule in _sectionService.ValidateTimeConflicts(sections))
                    {
                        section = blockRegistrationGroupDetail.Sections.SectionsList.Find(x => x.SectionId == schedule.SectionId);
                        foreach (Schedule row in section.Schedules)
                        {
                            if (row.StartTime == schedule.StartTime && row.EndTime == schedule.EndTime)
                            {
                                row.HasTimeConflict = true;
                                section.HasTimeConflict = true;
                            }
                        }
                    }
                }
                InstitutionSettings.Registration registration = _institutionSettingService.GetRegistration();
                BlockRegistrationGroupDetailViewModel blockRegistrationGroups = blockRegistrationGroupDetail.ToViewModel(
                    CurrentNameFormat, CurrentNameSort, enableWaitList, general, ShowMiddleNameInitial, registration);

                return Json(SerializationHelper.ToJsonResult(blockRegistrationGroups));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationGroupController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Determines whether a block has time conflicts.
        /// </summary>
        /// <param name="blockRegistrationGroupId">The block registration group identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationGroup/HasTimeConflict")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationBlocks } })]
        public JsonResult HasTimeConflict([FromBody] int blockRegistrationGroupId)
        {
            try
            {
                List<int> sections = _blockRegistrationGroupService.GetSectionIds(blockRegistrationGroupId);
                bool result = false;
                if (sections?.Count > 0)
                {
                    List<ScheduleValidate> sectionsWithConflicts = _sectionService.ValidateTimeConflicts(sections);
                    result = sectionsWithConflicts?.Count > 0;
                }
                return Json(SerializationHelper.ToJsonResult(new { result, blockRegistrationGroupId }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationGroupController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the block registration groups that match the search parameters.
        /// </summary>
        /// <param name="blockRegistrationGroupSearchModel">The block registration group search model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationGroup")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationBlocks } })]
        public JsonResult Index([FromBody] BlockRegistrationGroupSearchModel blockRegistrationGroupSearch)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                BlockRegistrationGroupHeadersViewModel blockRegistrationGroups = _blockRegistrationGroupService.Get(
                    blockRegistrationGroupSearch.StartIndex.Value, blockRegistrationGroupSearch.Length.Value, blockRegistrationGroupSearch.TermPeriodId,
                    blockRegistrationGroupSearch.Filter, blockRegistrationGroupSearch.Name ?? string.Empty).ToViewModel(general);
                return Json(SerializationHelper.ToJsonResult(blockRegistrationGroups));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationGroupController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified block registration group model.
        /// </summary>
        /// <param name="blockRegistrationGroupModel">The block registration group model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationGroup/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationBlocks } })]
        public JsonResult Save([FromBody] BlockRegistrationGroupModel blockRegistrationGroupModel)
        {
            try
            {
                bool result = false;
                if (blockRegistrationGroupModel != null)
                {
                    BlockRegistrationGroup blockRegistrationGroup = new()
                    {
                        AllowChanges = blockRegistrationGroupModel.AllowChanges,
                        IsActive = blockRegistrationGroupModel.IsActive,
                        SectionsToAdd = blockRegistrationGroupModel.SectionsToAdd,
                        SectionsToRemove = blockRegistrationGroupModel.SectionsToRemove,
                        BlockRegistrationGroupId = blockRegistrationGroupModel.BlockRegistrationGroupId,
                        Description = blockRegistrationGroupModel.Description,
                        DisplayName = blockRegistrationGroupModel.DisplayName,
                        Name = blockRegistrationGroupModel.Name,
                        PersonId = Account.PersonId,
                        TermPeriodId = blockRegistrationGroupModel.TermPeriodId
                    };
                    if (blockRegistrationGroup.BlockRegistrationGroupId > 0)
                        result = _blockRegistrationGroupService.Update(blockRegistrationGroup);
                    else
                        result = _blockRegistrationGroupService.Create(blockRegistrationGroup);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationGroupController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Statuses the specified block registration group header view model.
        /// </summary>
        /// <param name="blockRegistrationGroupHeaderViewModel">The block registration group header view model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationGroup/Status")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationBlocks } })]
        public JsonResult Status([FromBody] BlockRegistrationGroupHeaderViewModel blockRegistrationGroupHeaderViewModel)
        {
            try
            {
                BlockRegistrationGroup blockRegistrationGroup = new()
                {
                    BlockRegistrationGroupId = blockRegistrationGroupHeaderViewModel.BlockRegistrationGroupId,
                    IsActive = blockRegistrationGroupHeaderViewModel.IsActive,
                    PersonId = Account.PersonId
                };
                bool result = _blockRegistrationGroupService.Update(blockRegistrationGroup);
                return Json(SerializationHelper.ToJsonResult(new { blockRegistrationGroupId = blockRegistrationGroup.BlockRegistrationGroupId, result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationGroupController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Validates the specified block registration group search model.
        /// </summary>
        /// <param name="blockRegistrationGroupSearchModel">The block registration group search model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BlockRegistrationGroup/Validate")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupBlockRegistrationBlocks } })]
        public JsonResult Validate([FromBody] BlockRegistrationGroupSearchModel blockRegistrationGroupSearchModel)
        {
            try
            {
                bool result = _blockRegistrationGroupService.Exists(blockRegistrationGroupSearchModel.Name, blockRegistrationGroupSearchModel.TermPeriodId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(BlockRegistrationGroupController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}