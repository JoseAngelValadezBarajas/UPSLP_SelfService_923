// --------------------------------------------------------------------
// <copyright file="FormsController.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Recruitment;
using Hedtech.PowerCampus.Core.DTO.Settings;
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

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Forms route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class FormsController : BaseEndpointController
    {
        /// <summary>
        /// The application service
        /// </summary>
        private readonly IApplicationService _applicationService;

        /// <summary>
        /// The form service
        /// </summary>
        private readonly IFormService _formService;

        /// <summary>
        /// The inquiry service
        /// </summary>
        private readonly IInquiryService _inquiryService;

        /// <summary>
        /// The institution Setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<FormsController> _logger;

        /// <summary>
        /// The setting service
        /// </summary>
        private readonly ISettingService _settingService;

        /// <summary>
        /// Initializes a new instance of the <see cref="FormsController" /> class.
        /// </summary>
        /// <param name="applicationService">The application service.</param>
        /// <param name="formService">The form service.</param>
        /// <param name="inquiryService">The inquiry service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="logger">The logger.</param>
        public FormsController(
            IApplicationService applicationService,
            IFormService formService,
            IInquiryService inquiryService,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            ISettingService settingService,
            IAppLogger<FormsController> logger)
            : base(serializationHelper)
        {
            _applicationService = applicationService;
            _formService = formService;
            _inquiryService = inquiryService;
            _institutionSettingService = institutionSettingService;
            _settingService = settingService;

            _logger = logger;
        }

        /// <summary>
        /// Get form details for the specific id and specific type
        /// </summary>
        /// <param name="formModel">The form model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Forms/Details")]
        [AllowAnonymous]
        public JsonResult Details([FromBody] FormModel formModel)
        {
            try
            {
                int id = formModel.Id;
                int type = formModel.Type;
                FormSettings formSettings = null;
                int formLayoutId = 0;
                FormSettings form = null;
                switch (type)
                {
                    case 0:
                        formSettings = _applicationService.GetFormSettingsById(id);
                        if (formSettings.IsActive)
                        {
                            form = _formService.GetApplicationById(id);
                            formSettings = GetFormSettings(id, formSettings);
                            formLayoutId = _formService.GetLayoutId(0, id);
                        }
                        break;

                    case 1:
                        formSettings = _inquiryService.GetFormSettingsById(id);
                        if (formSettings.IsActive)
                        {
                            form = _formService.GetInquiryById(id);
                            formLayoutId = _formService.GetLayoutId(1, id);
                        }
                        break;
                }
                if (formSettings?.IsActive == true)
                {
                    FormLayout formLayout = _formService.GetLayout(formLayoutId);
                    formSettings.Name = (form != null ? form.Name : string.Empty);
                    if (formLayout != null)
                        formLayout.FormJsonDetail = SerializationHelper.ToObject<FormJsonDetail>(formLayout.FormJson);

                    if (Account != null && !string.IsNullOrEmpty(Account?.Email) && Account.PersonId > 0 && type == 0)
                    {
                        return Json(SerializationHelper.ToJsonResult(formSettings.ToViewModel(_institutionSettingService, id,
                           formLayoutId, formLayout, _settingService, Account.Email, Account.PersonId)));
                    }
                    else if (Account != null && !string.IsNullOrEmpty(Account?.TemporaryEmail) && Account.TemporaryUserId > 0 && type == 0)
                    {
                        return Json(SerializationHelper.ToJsonResult(formSettings.ToViewModel(_institutionSettingService, id,
                           formLayoutId, formLayout, _settingService, null, null, Account.TemporaryEmail, Account.TemporaryUserId)));
                    }
                    else
                    {
                        return Json(SerializationHelper.ToJsonResult(formSettings.ToViewModel(_institutionSettingService, id,
                           formLayoutId, formLayout, _settingService)));
                    }
                }
                else
                {
                    _logger.LogError(Constants._product, GetType().Name, "form is inactive");
                    return Json(SerializationHelper.ToJsonResult(null, "form is inactive", 404, false));
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FormsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Lists the specified type.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Forms/List")]
        [AllowAnonymous]
        public JsonResult List([FromBody] int type)
        {
            try
            {
                List<FormSettings> forms = null;
                switch (type)
                {
                    case 0:
                        forms = _formService.GetApplication();
                        break;

                    case 1:
                        forms = _formService.GetInquiry();
                        break;
                }

                if (type == 0)
                {
                    List<SavedApplication> savedApplications = null;
                    if (Account != null)
                    {
                        if (Account.PersonId > -1)
                            savedApplications = _applicationService.GetSaved(Account.PersonId);
                        else if (Account.TemporaryUserId > -1)
                            savedApplications = _applicationService.GetSaved(Account.TemporaryEmail);
                    }
                    List<SavedApplicationViewModel> savedApplicationViewModel = new();
                    if (savedApplications != null)
                    {
                        InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                        savedApplicationViewModel = savedApplications.ToViewModel(general);
                    }
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        forms,
                        savedApplicationViewModel,
                        logged = Account != null
                    }));
                }

                return Json(SerializationHelper.ToJsonResult(forms));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FormsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Saves the specified application by token.
        /// </summary>
        /// <param name="savedApplicationToken">The saved application token.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Forms/Saved")]
        public JsonResult Saved([FromBody] Guid savedApplicationToken)
        {
            try
            {
                int savedApplicationId = _applicationService.GetSaved(savedApplicationToken);
                if (savedApplicationId > 0)
                {
                    SavedApplication savedApplication = _applicationService.GetSavedForWeb(savedApplicationId, Account.PersonId, Account.Email);
                    if (savedApplication == null)
                    {
                        _logger.LogWarning(Constants._product, typeof(FormsController).FullName,
                            $"Permission Evaluation - Failed: User {Account.UserName} tried to access to an unauthorized " +
                                        $"saved application form with the token {savedApplicationToken}");
                        return Json(SerializationHelper.ToJsonResult(null, null, 403, false));
                    }

                    // Get Form Layout without values
                    FormSettings formSettings = _applicationService.GetFormSettingsById(savedApplication.ApplicationFormSettingId);
                    formSettings = GetFormSettings(savedApplication.ApplicationFormSettingId, formSettings);

                    FormLayout formLayout = null;
                    if (savedApplication.FormLayoutId != null)
                        formLayout = _formService.GetLayout(savedApplication.FormLayoutId.GetValueOrDefault());

                    if (formLayout != null)
                    {
                        formLayout.FormJsonDetail = SerializationHelper.ToObject<FormJsonDetail>(formLayout.FormJson);
                        ApplicationFormViewModel formViewModel = null;
                        int formLayoutId = _formService.GetLayoutId(0, savedApplication.ApplicationFormSettingId);
                        if (Account != null && !string.IsNullOrEmpty(Account?.Email))
                            formViewModel =
                                formSettings.ToViewModel(_institutionSettingService, savedApplication.ApplicationFormSettingId, formLayoutId, formLayout,
                                _settingService, Account.Email);
                        else if (Account != null && !string.IsNullOrEmpty(Account?.TemporaryEmail))
                            formViewModel =
                                formSettings.ToViewModel(_institutionSettingService, savedApplication.ApplicationFormSettingId, formLayoutId, formLayout,
                                _settingService, null, null, Account.TemporaryEmail, Account.TemporaryUserId);
                        else
                            formViewModel = formSettings.ToViewModel(_institutionSettingService, savedApplication.ApplicationFormSettingId, formLayoutId,
                                formLayout, _settingService);

                        ApplicationFormViewModel appFormSaved = SerializationHelper.ToObject<ApplicationFormViewModel>(savedApplication.JsonDetail);
                        //Compare models
                        if (LayoutHasChanges(formViewModel, appFormSaved))
                            return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
                        appFormSaved.SavedApplicationId = savedApplicationId;
                        appFormSaved.ApplicationFormId = savedApplication.ApplicationFormSettingId;
                        appFormSaved.CanSaveApplication = _institutionSettingService.GetApplication().EnableSave;
                        appFormSaved.FooterSaveMessage = _institutionSettingService.GetApplication().FooterSaveMessage;
                        appFormSaved.ConfirmationSaveMessage = _institutionSettingService.GetApplication().ConfirmationSaveMessage;
                        appFormSaved.EnableOnlinePayment = formViewModel.EnableOnlinePayment;
                        appFormSaved.FeeAmount = formViewModel.FeeAmount;
                        appFormSaved.IsFlatFee = formViewModel.IsFlatFee;
                        if (formViewModel.Person != null)
                        {
                            appFormSaved.Person.Email = formViewModel.Person.Email;
                            appFormSaved.Person.PersonId = formViewModel.Person.PersonId;
                            appFormSaved.Person.TemporaryEmail = formViewModel.Person.TemporaryEmail;
                            appFormSaved.Person.TemporaryUserId = formViewModel.Person.TemporaryUserId;
                        }

                        return Json(SerializationHelper.ToJsonResult(appFormSaved));
                    }

                    return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
                }

                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(FormsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        #region Private Methods

        /// <summary>
        /// Gets the form settings.
        /// </summary>
        /// <param name="applicationFormSettingId">The application form setting identifier.</param>
        /// <param name="formSettings">The form settings.</param>
        /// <returns></returns>
        private FormSettings GetFormSettings(int applicationFormSettingId, FormSettings formSettings)
        {
            FormSettings form = _formService.GetApplicationById(applicationFormSettingId);
            if (form != null)
            {
                formSettings.EnableOnlinePayment = (form?.EnableOnlinePayment == true);
                formSettings.IsFlatFee = (form?.IsFlatFee == true);
                formSettings.FeeAmount = form?.FeeAmount;
                formSettings.Name = form != null ? form.Name : string.Empty;
                formSettings.AllowAttachment = form.AllowAttachment;
                formSettings.MaxApplicationAttachmentSize = form.MaxApplicationAttachmentSize;
                formSettings.MaxAttachmentSize = form.MaxAttachmentSize;
                formSettings.NumberOfAttachments = form.NumberOfAttachments;

                if (formSettings.AllowAttachment)
                    formSettings.FileTypes = _applicationService.GetValidExtensions(applicationFormSettingId);
            }
            return formSettings;
        }

        /// <summary>
        /// Layouts the has changes.
        /// </summary>
        /// <param name="formLayout">The form layout.</param>
        /// <param name="savedFormLayout">The saved form layout.</param>
        /// <returns></returns>
        private bool LayoutHasChanges(ApplicationFormViewModel formLayout, ApplicationFormViewModel savedFormLayout)
        {
            if ((formLayout.DateTimeMax ?? string.Empty) != (savedFormLayout.DateTimeMax ?? string.Empty)
                || (formLayout.DateTimeMin ?? string.Empty) != (savedFormLayout.DateTimeMin ?? string.Empty)
                || (formLayout.Description ?? string.Empty) != (savedFormLayout.Description ?? string.Empty)
                || (formLayout.EmailRegExpression ?? string.Empty) != (savedFormLayout.EmailRegExpression ?? string.Empty)
                || (formLayout.GovernmentIdMask ?? string.Empty) != (savedFormLayout.GovernmentIdMask ?? string.Empty)
                || formLayout.GovernmentIdMaxLength != savedFormLayout.GovernmentIdMaxLength
                || formLayout.LayoutId != savedFormLayout.LayoutId
                || formLayout.Name != savedFormLayout.Name)
            {
                return true;
            }
            for (int i = 0; i < formLayout.Steps.Count; i++)
            {
                if ((formLayout.Steps[i].Instructions ?? string.Empty) != (savedFormLayout.Steps[i].Instructions ?? string.Empty) ||
                        formLayout.Steps[i].StepNumber != savedFormLayout.Steps[i].StepNumber ||
                        (formLayout.Steps[i].Title ?? string.Empty) != (savedFormLayout.Steps[i].Title ?? string.Empty))
                {
                    return true;
                }

                for (int j = 0; j < formLayout.Steps[i].FieldsGroups.Count; j++)
                {
                    if ((formLayout.Steps[i].FieldsGroups[j].ErrorMessageDuplicate ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].ErrorMessageDuplicate ?? string.Empty) ||
                        (formLayout.Steps[i].FieldsGroups[j].ErrorMessageFormat ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].ErrorMessageFormat ?? string.Empty) ||
                        (formLayout.Steps[i].FieldsGroups[j].ErrorMessageNotValid ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].ErrorMessageNotValid ?? string.Empty) ||
                        (formLayout.Steps[i].FieldsGroups[j].ErrorMessageNumeric ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].ErrorMessageNumeric ?? string.Empty) ||
                        (formLayout.Steps[i].FieldsGroups[j].ErrorMessagePrimary ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].ErrorMessagePrimary ?? string.Empty) ||
                        (formLayout.Steps[i].FieldsGroups[j].ErrorMessageRange ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].ErrorMessageRange ?? string.Empty) ||
                        (formLayout.Steps[i].FieldsGroups[j].ErrorMessageRequired ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].ErrorMessageRequired ?? string.Empty) ||
                        formLayout.Steps[i].FieldsGroups[j].Id != savedFormLayout.Steps[i].FieldsGroups[j].Id ||
                        (formLayout.Steps[i].FieldsGroups[j].Instructions ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].Instructions ?? string.Empty) ||
                        formLayout.Steps[i].FieldsGroups[j].IsCustom != savedFormLayout.Steps[i].FieldsGroups[j].IsCustom ||
                        formLayout.Steps[i].FieldsGroups[j].IsExpansionPanel != savedFormLayout.Steps[i].FieldsGroups[j].IsExpansionPanel ||
                        formLayout.Steps[i].FieldsGroups[j].IsHorizontalAligned != savedFormLayout.Steps[i].FieldsGroups[j].IsHorizontalAligned ||
                        formLayout.Steps[i].FieldsGroups[j].IsMultiple != savedFormLayout.Steps[i].FieldsGroups[j].IsMultiple ||
                        formLayout.Steps[i].FieldsGroups[j].IsRequired != savedFormLayout.Steps[i].FieldsGroups[j].IsRequired ||
                        (formLayout.Steps[i].FieldsGroups[j].Label ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].Label ?? string.Empty) ||
                        formLayout.Steps[i].FieldsGroups[j].MaximumAllowed != savedFormLayout.Steps[i].FieldsGroups[j].MaximumAllowed ||
                        formLayout.Steps[i].FieldsGroups[j].SortOrder != savedFormLayout.Steps[i].FieldsGroups[j].SortOrder)
                    {
                        return true;
                    }

                    for (int k = 0; k < formLayout.Steps[i].FieldsGroups[j].Fields.Count; k++)
                    {
                        if (formLayout.Steps[i].FieldsGroups[j].Fields[k].ActionUrl != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].ActionUrl ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].Alt != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Alt ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].ChildEndPoint != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].ChildEndPoint ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].ChildField != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].ChildField ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].Color != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Color ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].ComponentType != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].ComponentType ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].CustomScript != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].CustomScript ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].DataType != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].DataType ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].Default != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Default ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].GridSize != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].GridSize ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].IsExpansionPanelHeader != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].IsExpansionPanelHeader ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].IsRequired != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].IsRequired ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].IsUploading != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].IsUploading ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].IsUserDefined != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].IsUserDefined ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].IsWithLink != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].IsWithLink ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].MaxLength != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].MaxLength ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].ParentId != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].ParentId ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].Size != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Size ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].Src != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Src ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.AllowMultipleSelection != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.AllowMultipleSelection ||
                            (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageDuplicate ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageDuplicate ?? string.Empty) ||
                            (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageFormat ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageFormat ?? string.Empty) ||
                            (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageNotValid ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageNotValid ?? string.Empty) ||
                            (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageNumeric ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageNumeric ?? string.Empty) ||
                            (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessagePrimary ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessagePrimary ?? string.Empty) ||
                            (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageRange ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageRange ?? string.Empty) ||
                            (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageRequired ?? string.Empty) != (savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ErrorMessageRequired ?? string.Empty) ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Id != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Id ||
                            formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Label != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Label)
                        {
                            return true;
                        }
                        if (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions != null)
                        {
                            for (int l = 0; l < formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions.Count; l++)
                            {
                                if (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Description != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Description ||
                                    formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Value != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Value)
                                {
                                    return true;
                                }

                                if (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Options != null)
                                {
                                    for (int m = 0; m < formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Options.Count; m++)
                                    {
                                        if (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Options[m].Description != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Options[m].Description ||
                                    formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Options[m].Value != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.ComplexOptions[l].Options[m].Value)
                                        {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }

                        if (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Options != null)
                        {
                            for (int n = 0; n < formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Options.Count; n++)
                            {
                                if (formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Options[n].Description != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Options[n].Description ||
                                    formLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Options[n].Value != savedFormLayout.Steps[i].FieldsGroups[j].Fields[k].Data.Options[n].Value)
                                {
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                }
            }

            return false;
        }

        #endregion Private Methods
    }
}