// --------------------------------------------------------------------
// <copyright file="FormLayoutsController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Recruitment;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /FormLayouts route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class FormLayoutsController : BaseEndpointController
    {
        /// <summary>
        /// The form service
        /// </summary>
        private readonly IFormService _formService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<FormLayoutsController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="FormLayoutsController" /> class.
        /// </summary>
        /// <param name="formService">The form service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public FormLayoutsController(
            IFormService formService,
            ISerializationHelper serializationHelper,
            IAppLogger<FormLayoutsController> logger)
            : base(serializationHelper)
        {
            _formService = formService;

            _logger = logger;
        }

        /// <summary>
        /// Get the default form layout
        /// </summary>
        /// <param name="type">The type.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("FormLayouts/Default")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }})]
        public JsonResult Default([FromBody] int type)
        {
            try
            {
                FormLayout formLayout = _formService.GetDefaultLayout(type);
                return Json(SerializationHelper.ToJsonResult(formLayout.ToViewModel(SerializationHelper)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FormLayoutsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Get details for the specified form layout.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("FormLayouts/Details")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }})]
        public JsonResult Details([FromBody] int id)
        {
            try
            {
                if (id > 0)
                {
                    FormLayout formLayout = _formService.GetLayout(id);
                    return Json(SerializationHelper.ToJsonResult(formLayout.ToViewModel(SerializationHelper)));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FormLayoutsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Existses the specified form model.
        /// </summary>
        /// <param name="formModel">The form model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("FormLayouts/Exists")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }})]
        public JsonResult Exists([FromBody] FormModel formModel)
        {
            try
            {
                bool exists = _formService.LayoutNameExists(formModel.Name, formModel.Type);
                return Json(SerializationHelper.ToJsonResult(exists));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RegistrationGroupsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Indexes the specified form search model.
        /// </summary>
        /// <param name="formSearchModel">The form search model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("FormLayouts")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }})]
        public JsonResult Index([FromBody] FormSearchModel formSearchModel)
        {
            try
            {
                int startIndex = formSearchModel.StartIndex ?? 0;
                int length = formSearchModel.Length ?? 5;
                int type = formSearchModel.Type;
                if (type == 0 || type == 1)
                {
                    List<FormLayout> formLayouts = null;
                    if (startIndex >= 0 && length > 0)
                        formLayouts = _formService.GetLayouts(startIndex, length, type);

                    int overallCount = 0;
                    if (formLayouts?.Count > 0)
                        overallCount = formLayouts[0].OverallCount;

                    return Json(SerializationHelper.ToJsonResult(new { formLayouts, overallCount }));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FormLayoutsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the specified form layout model.
        /// </summary>
        /// <param name="formLayoutModel">The form layout model.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationFormsSetupApplication,
            ClaimsConstants.AdministrationFormsSetupInquiry
         }})]
        public JsonResult Save([FromBody] JsonElement body)
        {
            try
            {
                FormLayoutModel formLayoutModel = SerializationHelper.ToObject<FormLayoutModel>(body.ToString());

                AppSetupFormViewModel appSetupFormLayout = formLayoutModel.AppSetupFormLayout;
                int formType = formLayoutModel.FormType;
                int formLayoutId = -1;
                if (appSetupFormLayout != null)
                {
                    if (_formService.GetDefaultLayout(formType).FormLayoutId == appSetupFormLayout.FormLayoutId)
                        return Json(SerializationHelper.ToJsonResult(null, "Default Layout cannot be updated", 500, false));
                    formLayoutId = _formService.SaveLayout(ToFormLayout(appSetupFormLayout), formType);
                    if (formLayoutId < 0)
                        return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
                }
                return Json(SerializationHelper.ToJsonResult(formLayoutId));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FormLayoutsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        #region Private Methods

        /// <summary>
        /// Gets the bottom field groups.
        /// </summary>
        /// <param name="fieldsGroupSetup">The fields group setup.</param>
        /// <returns></returns>
        private List<StepFieldGroup> GetBottomFieldGroups(List<FieldsGroupSetupViewModel> fieldsGroupSetup)
        {
            List<StepFieldGroup> stepFieldGroups = null;
            if (fieldsGroupSetup?.Count > 0)
            {
                stepFieldGroups = new();
                fieldsGroupSetup = fieldsGroupSetup.Where(x => x.Id.Equals("confirmationGroup") || x.Id.Equals("footerGroup")).ToList();
                foreach (FieldsGroupSetupViewModel fieldGroupSetup in fieldsGroupSetup)
                {
                    stepFieldGroups.Add(new StepFieldGroup
                    {
                        Fields = GetFields(fieldGroupSetup.Fields),
                        Id = fieldGroupSetup.Id,
                        Instructions = fieldGroupSetup.Instructions,
                        IsExpansionPanel = fieldGroupSetup.IsExpansionPanel,
                        Label = fieldGroupSetup.Label,
                        ValidatorMessages = fieldGroupSetup.ValidatorMessages
                    });
                }
            }
            return stepFieldGroups;
        }

        /// <summary>
        /// Gets the fields.
        /// </summary>
        /// <param name="fieldsSetup">The fields setup.</param>
        /// <returns></returns>
        private List<StepField> GetFields(List<FieldSetupViewModel> fieldsSetup)
        {
            List<StepField> stepFields = null;
            if (fieldsSetup?.Count > 0)
            {
                fieldsSetup = fieldsSetup.OrderBy(x => x.SortOrder).ToList();
                stepFields = new();
                foreach (FieldSetupViewModel fieldSetupViewModel in fieldsSetup)
                {
                    stepFields.Add(new()
                    {
                        ActionUrl = fieldSetupViewModel.ActionUrl,
                        CustomScript = fieldSetupViewModel.CustomScript,
                        Color = fieldSetupViewModel.Color,
                        DataType = fieldSetupViewModel.DataType,
                        Default = fieldSetupViewModel.Default,
                        GridSize = fieldSetupViewModel.GridSize,
                        Id = fieldSetupViewModel.Id,
                        IsRequired = fieldSetupViewModel.IsRequired,
                        IsUploading = fieldSetupViewModel.IsUploading,
                        IsUserDefined = fieldSetupViewModel.IsUserDefined,
                        IsWithLink = fieldSetupViewModel.IsWithLink,
                        Label = fieldSetupViewModel.Label,
                        MaxLength = fieldSetupViewModel.MaxLength,
                        Options = fieldSetupViewModel.Options,
                        Size = fieldSetupViewModel.Size,
                        Type = fieldSetupViewModel.Type,
                        ValidatorMessages = fieldSetupViewModel.ValidatorMessages,
                        Alt = fieldSetupViewModel.Alt,
                        Src = fieldSetupViewModel.Src,
                        Value = fieldSetupViewModel.Value,
                        IsExpansionPanelHeader = fieldSetupViewModel.IsExpansionPanelHeader,
                    });
                }
            }
            return stepFields;
        }

        /// <summary>
        /// Gets the step field groups.
        /// </summary>
        /// <param name="fieldsGroupSetup">The fields group setup.</param>
        /// <returns></returns>
        private List<StepFieldGroup> GetStepFieldGroups(List<FieldsGroupSetupViewModel> fieldsGroupSetup)
        {
            List<StepFieldGroup> stepFieldGroups = null;
            if (fieldsGroupSetup?.Count > 0)
            {
                stepFieldGroups = new();
                fieldsGroupSetup = fieldsGroupSetup.OrderBy(x => x.SortOrder).ToList();
                foreach (FieldsGroupSetupViewModel fieldGroupSetup in fieldsGroupSetup)
                {
                    stepFieldGroups.Add(new()
                    {
                        Fields = GetFields(fieldGroupSetup.Fields),
                        Id = fieldGroupSetup.Id,
                        Instructions = fieldGroupSetup.Instructions,
                        IsCustom = fieldGroupSetup.IsCustom,
                        IsExpansionPanel = fieldGroupSetup.IsExpansionPanel,
                        Label = fieldGroupSetup.Label,
                        MaximumAllowed = fieldGroupSetup.MaximumAllowed,
                        ValidatorMessages = fieldGroupSetup.ValidatorMessages
                    });
                }
            }
            return stepFieldGroups;
        }

        /// <summary>
        /// To the form layout.
        /// </summary>
        /// <param name="appSetupFormLayout">The application setup form layout.</param>
        /// <returns></returns>
        private FormLayout ToFormLayout(AppSetupFormViewModel appSetupFormLayout)
        {
            if (appSetupFormLayout == null)
                return null;

            FormJsonDetail formJsonDetail = null;
            if (appSetupFormLayout.Steps?.Count > 0)
            {
                formJsonDetail = new FormJsonDetail
                {
                    Steps = new(),
                    Title = string.Empty,
                    FieldGroups = GetBottomFieldGroups(appSetupFormLayout.FieldsGroups)
                };
                foreach (StepSetupViewModel stepSetupViewModel in appSetupFormLayout.Steps)
                {
                    formJsonDetail.Steps.Add(new()
                    {
                        StepFieldGroups = GetStepFieldGroups(stepSetupViewModel.StepFieldGroups),
                        StepInstructions = stepSetupViewModel.StepInstructions,
                        StepTitle = stepSetupViewModel.StepTitle
                    });
                }
            }
            return new FormLayout
            {
                Description = appSetupFormLayout.Description,
                FormJson = (string)SerializationHelper.ToJsonObject(formJsonDetail),
                FormJsonDetail = formJsonDetail,
                FormLayoutId = appSetupFormLayout.FormLayoutId,
                Name = appSetupFormLayout.Name
            };
        }

        #endregion Private Methods
    }
}