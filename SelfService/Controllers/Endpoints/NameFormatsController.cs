// --------------------------------------------------------------------
// <copyright file="NameFormatsController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.NameFormats;
using SelfService.Models.Resources.Administration;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /NameFormats route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class NameFormatsController : BaseEndpointController
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<NameFormatsController> _logger;

        /// <summary>
        /// The name format service
        /// </summary>
        private readonly INameFormatService _nameFormatService;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="NameFormatsController"/> class.
        /// </summary>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="logger">The logger.</param>
        public NameFormatsController(
            INameFormatService nameFormatService,
            IResourcesHelper resourcesHelper,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            IAppLogger<NameFormatsController> logger)
            : base(serializationHelper)
        {
            _nameFormatService = nameFormatService;
            _resourcesHelper = resourcesHelper;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        #region Name Format

        /// <summary>
        /// Deletes the specified name format identifier.
        /// </summary>
        /// <param name="nameFormatId">The name format identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("NameFormats/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupNameFormats } })]
        public JsonResult Delete([FromBody] int nameFormatId)
        {
            try
            {
                bool result = false;
                if (nameFormatId > 0)
                    result = _nameFormatService.Delete(nameFormatId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Get the specified name format.
        /// </summary>
        /// <param name="id">The name format identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupNameFormats } })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Details(int id)
        {
            try
            {
                string language = _settingHelper.GetLanguage(Account);
                NamePartResources namePartsResources = _resourcesHelper.GetResourceType<NamePartResources>(language, new("Administration", "NamePart"));
                List<ListOptionViewModel> nameParts = GetNameParts(namePartsResources);
                NameFormatItemViewModel nameFormat = _nameFormatService.Get(id).ToViewModel(ShowMiddleNameInitial, namePartsResources);
                return Json(SerializationHelper.ToJsonResult(new { nameFormat, nameParts }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Retrieves the list of name formats
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("NameFormats/List/{startIndex}/{length}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupNameFormats } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult List(int startIndex, int length)
        {
            try
            {
                NameFormat nameFormat = _nameFormatService.Get(startIndex, length);
                return Json(SerializationHelper.ToJsonResult(nameFormat.ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the name format. If name format id > 0 then create new one otherwise update.
        /// </summary>
        /// <param name="nameFormatItem">The name format.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("NameFormats/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupNameFormats } })]
        public JsonResult Save([FromBody] NameFormatItemViewModel nameFormatItem)
        {
            try
            {
                if (nameFormatItem != null)
                {
                    int result = ValidateNameFormat(nameFormatItem);
                    NameFormatItem nameFormatDTO = null;

                    if (result == 0)
                    {
                        nameFormatDTO = new()
                        {
                            FormatDefinition = GetFormatDefinition(nameFormatItem),
                            FormatName = nameFormatItem.Name,
                            FormatSort = GetFormatSort(nameFormatItem),
                            IsActive = nameFormatItem.IsActive,
                            NameFormatId = nameFormatItem.Id,
                            ShowMiddleNameInitial = nameFormatItem.ShowMiddleNameInitial
                        };

                        if (nameFormatItem.Id == 0)
                            result = _nameFormatService.Create(nameFormatDTO);
                        else
                            result = _nameFormatService.Update(nameFormatDTO);
                    }
                    return Json(SerializationHelper.ToJsonResult(result));
                }
                return Json(SerializationHelper.ToJsonResult(-1));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Update the isActive status for the specified name format identifier.
        /// </summary>
        /// <param name="nameFormatStatusModel">The name format status model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("NameFormats/Status")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupNameFormats } })]
        public JsonResult Status([FromBody] NameFormatStatusModel nameFormatStatusModel)
        {
            try
            {
                int id = nameFormatStatusModel.Id;
                bool isActive = nameFormatStatusModel.IsActive;
                bool result = false;
                if (id > 0)
                {
                    if (isActive)
                        result = _nameFormatService.UpdateStatus(id, isActive);
                    else if (_nameFormatService.CanInactive())
                        result = _nameFormatService.UpdateStatus(id, isActive);
                    return Json(SerializationHelper.ToJsonResult(new { id, result }));
                }
                return Json(SerializationHelper.ToJsonResult(new { id, result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Name Format

        #region Name Format Category

        /// <summary>
        /// Retrieves the name format categories.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupNameFormatCategories } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Categories()
        {
            try
            {
                List<NameFormatItem> nameFormatList = _nameFormatService.Get().Where(x => x.IsActive).ToList();
                List<ListOptionViewModel> listOptionViewModel = nameFormatList.Select(p => new ListOptionViewModel
                {
                    Value = p.NameFormatId,
                    Description = p.FormatName
                }).ToList();
                NameFormatCategory nameFormatCategories = _nameFormatService.GetCategories();
                return Json(SerializationHelper.ToJsonResult(nameFormatCategories.ToViewModel(listOptionViewModel)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Update category with the specified name format.
        /// </summary>
        /// <param name="nameFormatCategory">The name format category.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("NameFormats/Categories")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupNameFormatCategories } })]
        public JsonResult Categories([FromBody] Dictionary<int, int> nameFormatCategory)
        {
            try
            {
                bool status = _nameFormatService.UpdateCategories(nameFormatCategory);
                return Json(SerializationHelper.ToJsonResult(status));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Name Format Category

        #region Private Methods

        /// <summary>
        /// Gets the format definition.
        /// </summary>
        /// <param name="nameFormatItem">The name format.</param>
        /// <returns>Format Definition</returns>
        private string GetFormatDefinition(NameFormatItemViewModel nameFormatItem)
        {
            try
            {
                StringBuilder formatDefinition = new();
                for (int i = 0; i < nameFormatItem.NamePartList.Count; i++)
                {
                    formatDefinition.Append(nameFormatItem.NamePartList[i].NamePart).Append(nameFormatItem.NamePartList[i].Separator);
                    if (string.IsNullOrEmpty(nameFormatItem.NamePartList[i].Separator) || !nameFormatItem.NamePartList[i].Separator.EndsWith(" "))
                        formatDefinition.Append(" ");
                    formatDefinition.Append("|");
                }
                return formatDefinition.Remove(formatDefinition.Length - 1, 1).ToString().Trim();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return string.Empty;
            }
        }

        /// <summary>
        /// Gets the format sort.
        /// </summary>
        /// <param name="nameFormatItem">The name format.</param>
        /// <returns>Format Sort</returns>
        private string GetFormatSort(NameFormatItemViewModel nameFormatItem)
        {
            try
            {
                StringBuilder formatSort = new();
                foreach (NamePartItemViewModel namePartItem in nameFormatItem.NamePartList.OrderBy(x => x.SortOrder).ToList())
                {
                    if (namePartItem.SortOrder > 0)
                        formatSort.Append(namePartItem.NamePart).Append("|");
                }
                if (formatSort.Length > 0)
                    formatSort.Remove(formatSort.Length - 1, 1);
                return formatSort.ToString();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return string.Empty;
            }
        }

        /// <summary>
        /// Gets the name parts.
        /// </summary>
        /// <param name="namePartsResources">The name parts resources.</param>
        /// <returns></returns>
        private List<ListOptionViewModel> GetNameParts(NamePartResources namePartsResources)
        {
            try
            {
                if (namePartsResources != null)
                {
                    return new List<ListOptionViewModel>
                    {
                        new ListOptionViewModel { Value = "PX", Description = namePartsResources.LblPrefix },
                        new ListOptionViewModel { Value = "FN", Description = namePartsResources.LblFirstName },
                        new ListOptionViewModel { Value = "MN", Description = namePartsResources.LblMiddleName },
                        new ListOptionViewModel { Value = "LP", Description = namePartsResources.LblLastNamePrefix },
                        new ListOptionViewModel { Value = "LN", Description = namePartsResources.LblLastName },
                        new ListOptionViewModel { Value = "DN", Description = namePartsResources.LblDisplayName },
                        new ListOptionViewModel { Value = "PN", Description = namePartsResources.LblPronoun},
                        new ListOptionViewModel { Value = "SX", Description = namePartsResources.LblSuffix }
                    };
                }
                return new List<ListOptionViewModel>();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return new List<ListOptionViewModel>();
            }
        }

        /// <summary>
        /// 0 : No errors
        /// -2 : Name format already exists
        /// -3 : Name format is required
        /// -4 : There are gaps between Name Parts
        /// -5 : Separator cannot contain|
        /// -6 : Sort Order should be &gt; zero
        /// -7 : Sort Order should unique
        /// -8 : Display Name and First Name cannot be at the same time
        /// -9 : Name parts should be unique
        /// -10 : Name part is not valid
        /// -11 : At least one Name Format must be Active
        /// -12 : A name part is required
        /// </summary>
        /// <param name="nameFormatItem">The name format.</param>
        /// <returns>
        /// int
        /// </returns>
        private int ValidateNameFormat(NameFormatItemViewModel nameFormatItem)
        {
            try
            {
                //Validate if name format exists when trying to create a name format
                if (nameFormatItem.Id == 0 && _nameFormatService.Exists(nameFormatItem.Name))
                    return -2;

                //Name format is required
                if (string.IsNullOrEmpty(nameFormatItem.Name))
                    return -3;

                //Validate gaps
                if (nameFormatItem.NamePartList?.Count > 0)
                {
                    for (int i = 0; i < nameFormatItem.NamePartList.Count; i++)
                    {
                        if (nameFormatItem.NamePartList[i].DisplayOrder != i + 1)
                            return -4;
                    }

                    //Separator cannot contain|
                    if (nameFormatItem.NamePartList.Any(x => !string.IsNullOrEmpty(x.Separator) && x.Separator.Contains("|")))
                        return -5;

                    //Sort Order should be > 0
                    if (nameFormatItem.NamePartList.Count(x => x.SortOrder == 0) == nameFormatItem.NamePartList.Count)
                        return -6;

                    //Sort Order should be unique.
                    if (nameFormatItem.NamePartList.Where(x => x.SortOrder > 0).Select(x => x.SortOrder).Distinct().Count() != nameFormatItem.NamePartList.Count(x => x.SortOrder > 0))
                        return -7;

                    //Display Name and First Name cannot be at the same time
                    if (nameFormatItem.NamePartList.Find(x => x.NamePart == "FN") != null && nameFormatItem.NamePartList.Find(x => x.NamePart == "DN") != null)
                        return -8;

                    //Name parts should be unique
                    if (nameFormatItem.NamePartList.Select(x => x.NamePart).Distinct().Count() != nameFormatItem.NamePartList.Count)
                        return -9;

                    //Name part is not valid
                    string[] nameParts = { "PX", "FN", "MN", "LP", "LN", "SX", "DN", "PN" };
                    foreach (NamePartItemViewModel namePartItem in nameFormatItem.NamePartList)
                    {
                        if (!nameParts.Contains(namePartItem.NamePart))
                            return -10;
                    }
                }
                else
                {
                    return -12;
                }

                //At least one name format should be active
                if (!nameFormatItem.IsActive && !_nameFormatService.CanInactive())
                    return -11;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return -1;
            }
            return 0;
        }

        #endregion Private Methods
    }
}