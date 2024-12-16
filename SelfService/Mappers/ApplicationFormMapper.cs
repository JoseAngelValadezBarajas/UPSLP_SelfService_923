// --------------------------------------------------------------------
// <copyright file="ApplicationFormMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Recruitment;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Models.Forms;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Globalization;

namespace SelfService.Mappers
{
    /// <summary>
    /// ApplicationFormMapper
    /// </summary>
    internal static class ApplicationFormMapper
    {
        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="applicationDTO">The application dto.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="applicationFormId">The application form identifier.</param>
        /// <param name="formLayoutId">The form layout identifier.</param>
        /// <param name="formLayout">The form layout.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="email">The email.</param>
        /// <param name="personId">The person identifier.</param>
        /// <param name="temporaryEmail">The temporary email.</param>
        /// <param name="temporaryUserId">The temporary user identifier.</param>
        /// <returns></returns>
        internal static ApplicationFormViewModel ToViewModel(
            this FormSettings applicationDTO, IInstitutionSettingService institutionSettingService,
            int applicationFormId, int formLayoutId, FormLayout formLayout, ISettingService settingService,
            string email = null, int? personId = null, string temporaryEmail = null, int? temporaryUserId = null)
        {
            InstitutionSettings.General generalSettings = institutionSettingService.GetGeneral();
            IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(generalSettings.CurrencyCulture);
            ApplicationFormViewModel applicationFormViewModel = new()
            {
                ApplicationFormId = applicationFormId,
                EnableOnlinePayment = applicationDTO.EnableOnlinePayment,
                FeeAmount = applicationDTO.FeeAmount != null ? FormatHelper.ToCurrency((decimal)applicationDTO.FeeAmount, formatCurrency) : string.Empty,
                Name = string.IsNullOrEmpty(formLayout.FormJsonDetail.Title) ? applicationDTO.Name : formLayout.FormJsonDetail.Title,
                IsFlatFee = applicationDTO.IsFlatFee,
                LayoutId = formLayoutId,
                AllowAttachment = applicationDTO.AllowAttachment,
                MaxApplicationAttachmentSize = applicationDTO.MaxApplicationAttachmentSize,
                MaxAttachmentSize = applicationDTO.MaxAttachmentSize,
                NumberOfAttachments = applicationDTO.NumberOfAttachments,
                Steps = new List<StepViewModel>(),
                FileTypes = applicationDTO.FileTypes
            };
            StepViewModel stepViewModel;
            int stepNumber = 0;
            foreach (Step step in formLayout.FormJsonDetail.Steps)
            {
                stepViewModel = new StepViewModel
                {
                    Title = step.StepTitle,
                    Instructions = step.StepInstructions,
                    StepNumber = stepNumber
                };
                stepViewModel.FieldsGroups = GetFieldGroup(applicationDTO, step.StepFieldGroups);
                if (stepViewModel.FieldsGroups?.Count > 0)
                    applicationFormViewModel.Steps.Add(stepViewModel);
                stepNumber++;
            }
            applicationFormViewModel.GovernmentIdMask = generalSettings.GovernmentIdFormat;
            applicationFormViewModel.GovernmentIdMaxLength = generalSettings.GovernmentIdMaxLength;
            applicationFormViewModel.EmailRegExpression = settingService.GetEmailTypeRegexExpression();
            applicationFormViewModel.DateTimeMin = ((DateTime)SqlDateTime.MinValue).Year.ToString();
            applicationFormViewModel.DateTimeMax = ((DateTime)SqlDateTime.MaxValue).Year.ToString();
            applicationFormViewModel.FieldsGroups = ToFieldsGroupViewModel(formLayout.FormJsonDetail.FieldGroups);
            applicationFormViewModel.Person = (new PersonInformationViewModel
            {
                Email = email,
                PersonId = personId,
                TemporaryEmail = temporaryEmail,
                TemporaryUserId = temporaryUserId
            });
            applicationFormViewModel.CanSaveApplication = institutionSettingService.GetApplication().EnableSave;
            applicationFormViewModel.FooterSaveMessage = institutionSettingService.GetApplication().FooterSaveMessage;
            applicationFormViewModel.ConfirmationSaveMessage = institutionSettingService.GetApplication().ConfirmationSaveMessage;

            //Expansion Panels
            if (applicationDTO.ExpansionPanel != null)
            {
                applicationFormViewModel.ExpansionPanel.ActivityCount = applicationDTO.ExpansionPanel.ActivityCount;
                applicationFormViewModel.ExpansionPanel.AddressessCount = applicationDTO.ExpansionPanel.AddressessCount;
                applicationFormViewModel.ExpansionPanel.EducationCount = applicationDTO.ExpansionPanel.EducationCount;
                applicationFormViewModel.ExpansionPanel.EmergencyContactsCount = applicationDTO.ExpansionPanel.EmergencyContactsCount;
                applicationFormViewModel.ExpansionPanel.EmployeeCount = applicationDTO.ExpansionPanel.EmployeeCount;
                applicationFormViewModel.ExpansionPanel.PhoneCount = applicationDTO.ExpansionPanel.PhoneCount;
                applicationFormViewModel.ExpansionPanel.ProgramsCount = applicationDTO.ExpansionPanel.ProgramsCount;
                applicationFormViewModel.ExpansionPanel.RelativesCount = applicationDTO.ExpansionPanel.RelativesCount;
                applicationFormViewModel.ExpansionPanel.TestScoresCount = applicationDTO.ExpansionPanel.TestScoresCount;
            }
            return applicationFormViewModel;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="appAttachmentList">The application attachment list.</param>
        /// <param name="numberCultureFormat">The number culture format.</param>
        /// <returns></returns>
        internal static List<ApplicationAttachmentViewModel> ToViewModel(this List<ApplicationAttachment> appAttachmentList, string numberCultureFormat)
        {
            List<ApplicationAttachmentViewModel> appAttachmentViewModelList =
                new();
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(numberCultureFormat);
            foreach (ApplicationAttachment appAttchment in appAttachmentList)
            {
                ApplicationAttachmentViewModel appAttachmentViewModel = new()
                {
                    ApplicationAttachmentId = appAttchment.ApplicationAttachmentId,
                    AttachmentTitle = appAttchment.AttachmentTitle,
                    Extension = appAttchment.Extension,
                    FileSize = FormatHelper.ToDecimal(decimal.Round(appAttchment.FileSize, 4, MidpointRounding.AwayFromZero), formatProvider)
                };
                appAttachmentViewModelList.Add(appAttachmentViewModel);
            }
            return appAttachmentViewModelList;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="appAttachmenntsTotals">The application attachmennts totals.</param>
        /// <param name="numberCultureFormat">The number culture format.</param>
        /// <returns></returns>
        internal static ApplicationAttachmentTotalsViewModel ToViewModel(this ApplicationAttachmentTotals appAttachmenntsTotals, string numberCultureFormat)
        {
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(numberCultureFormat);
            ApplicationAttachmentTotalsViewModel appAttachmentTotalsViewModal = new();
            if (appAttachmenntsTotals != null)
            {
                appAttachmentTotalsViewModal = new()
                {
                    ApplicationId = appAttachmenntsTotals.ApplicationId,
                    TotalAttachmentSize = FormatHelper.ToDecimal(decimal.Round(appAttachmenntsTotals.TotalAttachmentSize, 4, MidpointRounding.AwayFromZero), formatProvider),
                    TotalAttachmentSizeNumber = appAttachmenntsTotals.TotalAttachmentSize,
                    TotalNumberOfAttachments = appAttachmenntsTotals.TotalNumberOfAttachments
                };
            }
            return appAttachmentTotalsViewModal;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="submittedApplicationList">The submitted application list.</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns></returns>
        internal static List<SubmittedApplicationViewModel> ToViewModel(this List<SubmittedApplication> submittedApplicationList, string dateTimeCultureFormat)
        {
            List<SubmittedApplicationViewModel> submittedApplicationViewModelList = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);
            foreach (SubmittedApplication submittedApplication in submittedApplicationList)
            {
                SubmittedApplicationViewModel submittedApplicationViewModel = new()
                {
                    AcademicSessionDesc = submittedApplication.AcademicSessionDesc,
                    AcademicTermDesc = submittedApplication.AcademicTermDesc,
                    AcademicYear = submittedApplication.AcademicYear,
                    AdmitSessionDesc = submittedApplication.AdmitSessionDesc,
                    AdmitTermDesc = submittedApplication.AdmitTermDesc,
                    AdmitYear = submittedApplication.AdmitYear,
                    College = submittedApplication.College,
                    CollegeAttendance = submittedApplication.CollegeAttend,
                    Curriculum = submittedApplication.Curriculum,
                    Decision = submittedApplication.ApplicationDecision,
                    DecisionDate = FormatHelper.ToShortDate(submittedApplication.ApplicationDecisionDate, datetimeCulture),
                    Degree = submittedApplication.Degree,
                    Program = submittedApplication.Program,
                    ReceiptDate = FormatHelper.ToShortDate(submittedApplication.ApplicationDate, datetimeCulture),
                    Status = submittedApplication.ApplicationStatus,
                    StatusDate = FormatHelper.ToShortDate(submittedApplication.ApplicationStatusDate, datetimeCulture)
                };
                submittedApplicationViewModelList.Add(submittedApplicationViewModel);
            }
            return submittedApplicationViewModelList;
        }

        #region Private Methods

        /// <summary>
        /// Gets the complex options view model.
        /// </summary>
        /// <param name="complexOptions">The complex options.</param>
        /// <returns></returns>
        private static List<ComplexOptionsViewModel> GetComplexOptionsViewModel(List<FormComplexOptions> complexOptions)
        {
            List<ComplexOptionsViewModel> complexOptionsViewModel = null;
            if (complexOptions?.Count > 0)
            {
                complexOptionsViewModel = new List<ComplexOptionsViewModel>();
                foreach (FormComplexOptions complexOptionDTO in complexOptions)
                {
                    complexOptionsViewModel.Add(new ComplexOptionsViewModel
                    {
                        Description = complexOptionDTO.Description,
                        Options = GetOptionsViewModel(complexOptionDTO.Options),
                        Value = complexOptionDTO.Value
                    });
                }
            }
            return complexOptionsViewModel;
        }

        /// <summary>
        /// Gets the field group.
        /// </summary>
        /// <param name="applicationDTO">The application dto.</param>
        /// <param name="stepFieldGroups">The step field groups.</param>
        /// <returns></returns>
        private static List<FieldsGroupViewModel> GetFieldGroup(FormSettings applicationDTO, List<StepFieldGroup> stepFieldGroups)
        {
            List<FieldsGroupViewModel> fieldsGroups = null;
            FieldsGroupViewModel groupViewModel = null;

            if (stepFieldGroups?.Count > 0)
            {
                fieldsGroups = new List<FieldsGroupViewModel>();

                foreach (StepFieldGroup stepFieldGroup in stepFieldGroups)
                {
                    if (stepFieldGroup.IsCustom)
                    {
                        groupViewModel = new FieldsGroupViewModel
                        {
                            Id = stepFieldGroup.Id,
                            Fields = ToFieldViewModel(stepFieldGroup.Fields),
                            IsCustom = true
                        };
                        if (groupViewModel.Fields?.Count > 0)
                            fieldsGroups.Add(groupViewModel);
                    }
                    else
                    {
                        foreach (FormSection applicationFormSection in applicationDTO.Sections)
                        {
                            groupViewModel = new FieldsGroupViewModel
                            {
                                Id = stepFieldGroup.Id,
                                Instructions = (string.IsNullOrEmpty(stepFieldGroup.Instructions) ?
                                        string.Empty : stepFieldGroup.Instructions),
                                IsExpansionPanel = stepFieldGroup.IsExpansionPanel,
                                IsMultiple = applicationFormSection.IsMultiple ||
                                        (stepFieldGroup.Id == "programOfStudyGroup") ||
                                        (stepFieldGroup.Id == "phoneGroup"),
                                IsRequired = applicationFormSection.IsRequired,
                                IsHorizontalAligned =
                                        stepFieldGroup.Id == "phoneGroup" ||
                                        stepFieldGroup.Id == "testScoreGroup" ||
                                        stepFieldGroup.Id == "programOfStudyGroup" ||
                                        stepFieldGroup.Id == "employmentGroup" ||
                                        stepFieldGroup.IsHorizontalAligned,
                                Label = (string.IsNullOrEmpty(stepFieldGroup.Label) ? string.Empty :
                                        stepFieldGroup.Label),
                                Fields = GetFieldsByGroup(applicationFormSection, stepFieldGroup),
                                ErrorMessageDuplicate = (stepFieldGroup?.ValidatorMessages?.Count > 0) ?
                                        stepFieldGroup.ValidatorMessages[0].IsDuplicated : string.Empty,
                                ErrorMessageFormat = (stepFieldGroup?.ValidatorMessages?.Count > 0) ?
                                        stepFieldGroup.ValidatorMessages[0].InvalidFormat : string.Empty,
                                ErrorMessageNotValid = (stepFieldGroup?.ValidatorMessages?.Count > 0) ?
                                        stepFieldGroup.ValidatorMessages[0].NotValid : string.Empty,
                                ErrorMessageNumeric = (stepFieldGroup?.ValidatorMessages?.Count > 0) ?
                                        stepFieldGroup.ValidatorMessages[0].NotNumeric : string.Empty,
                                ErrorMessagePrimary = (stepFieldGroup?.ValidatorMessages?.Count > 0) ?
                                        stepFieldGroup.ValidatorMessages[0].IsPrimary : string.Empty,
                                ErrorMessageRange = (stepFieldGroup?.ValidatorMessages?.Count > 0) ?
                                        stepFieldGroup.ValidatorMessages[0].OutOfRange : string.Empty,
                                ErrorMessageRequired = (stepFieldGroup?.ValidatorMessages?.Count > 0) ?
                                        stepFieldGroup.ValidatorMessages[0].IsRequired : string.Empty,
                                MaximumAllowed = stepFieldGroup.MaximumAllowed
                            };
                            if (groupViewModel.Fields?.Count > 0)
                                fieldsGroups.Add(groupViewModel);
                        }
                    }
                }
            }
            return fieldsGroups;
        }

        /// <summary>
        /// Gets the fields by group.
        /// </summary>
        /// <param name="applicationFormSection">The application form section.</param>
        /// <param name="stepFieldGroup">The step field group.</param>
        /// <returns></returns>
        private static List<FieldViewModel> GetFieldsByGroup(FormSection applicationFormSection, StepFieldGroup stepFieldGroup)
        {
            List<FieldViewModel> fieldViewModels = new();
            FormField field;
            foreach (StepField stepField in stepFieldGroup.Fields)
            {
                field = applicationFormSection.Fields.Find(x => x.Data.Id == stepField.Id);
                if (field != null)
                {
                    if (stepField.Size != null)
                        field.Size = stepField.Size;
                    if (stepField.Value != null)
                        field.Value = stepField.Value;
                    if (field.Data.Options != null)
                        fieldViewModels.Add(GetFieldViewModel(field, stepField, GetOptionsViewModel(field.Data.Options)));
                    else
                        fieldViewModels.Add(GetFieldViewModel(field, stepField, null, GetComplexOptionsViewModel(field.Data.ComplexOptions)));
                }
            }
            return fieldViewModels;
        }

        /// <summary>
        /// Gets the field view model.
        /// </summary>
        /// <param name="field">The field.</param>
        /// <param name="stepField">The step field.</param>
        /// <param name="optionsViewModel">The options view model.</param>
        /// <param name="complexOptionsViewModel">The complex options view model.</param>
        /// <returns></returns>
        private static FieldViewModel GetFieldViewModel(FormField field, StepField stepField, List<OptionsViewModel> optionsViewModel, List<ComplexOptionsViewModel> complexOptionsViewModel = null)
        {
            FieldViewModel fieldViewModel = new()
            {
                ComponentType = field.ComponentType,
                Data = new DataViewModel
                {
                    AllowMultipleSelection = field.Data.AllowMultipleSelection,
                    ErrorMessageDuplicate = (stepField?.ValidatorMessages?.Count > 0) ? stepField.ValidatorMessages[0].IsDuplicated : string.Empty,
                    ErrorMessageFormat = (stepField?.ValidatorMessages?.Count > 0) ? stepField.ValidatorMessages[0].InvalidFormat : string.Empty,
                    ErrorMessageNotValid = (stepField?.ValidatorMessages?.Count > 0) ? stepField.ValidatorMessages[0].NotValid : string.Empty,
                    ErrorMessageNumeric = (stepField?.ValidatorMessages?.Count > 0) ? stepField.ValidatorMessages[0].NotNumeric : string.Empty,
                    ErrorMessagePrimary = (stepField?.ValidatorMessages?.Count > 0) ? stepField.ValidatorMessages[0].IsPrimary : string.Empty,
                    ErrorMessageRange = (stepField?.ValidatorMessages?.Count > 0) ? stepField.ValidatorMessages[0].OutOfRange : string.Empty,
                    ErrorMessageRequired = (stepField?.ValidatorMessages?.Count > 0) ? stepField.ValidatorMessages[0].IsRequired : string.Empty,
                    Id = field.Data.Id,
                    Label = stepField != null && stepField.Label != string.Empty ? stepField.Label : field.Data.Description,
                    Modified = field.Data.Modified,
                    Options = optionsViewModel,
                    Section = field.Data.Section,
                    ComplexOptions = complexOptionsViewModel,
                },
                IsRequired = field.IsRequired,
                IsExpansionPanelHeader = stepField.IsExpansionPanelHeader,
                ParentId = field.ParentId,
                Value = field.Value,
                GridSize = stepField.GridSize,
                Default = stepField.Default,
                Size = stepField.Size,
                OnClick = stepField.OnClick
            };

            if (fieldViewModel.ParentId == "testScoreGroup" && fieldViewModel.Data.Id == "testId")
            {
                fieldViewModel.ChildField = "testTypeId";
                fieldViewModel.ChildEndPoint = "testScores/types/";
            }
            if (fieldViewModel.ParentId == "activityGroup" && fieldViewModel.Data.Id == "activityTypeId")
            {
                fieldViewModel.ChildField = "activityId";
                fieldViewModel.ChildEndPoint = "activities/";
            }
            if (fieldViewModel.ParentId == "residencyGroup" && fieldViewModel.Data.Id == "campusOptionsId")
            {
                fieldViewModel.ChildField = "dormPlanOptionsId";
                fieldViewModel.ChildEndPoint = "organizations/buildings/";
            }
            return fieldViewModel;
        }

        /// <summary>
        /// Gets the options view model.
        /// </summary>
        /// <param name="options">The options.</param>
        /// <returns></returns>
        private static List<OptionsViewModel> GetOptionsViewModel(List<FormOptions> options)
        {
            List<OptionsViewModel> optionsViewModel = null;
            if (options?.Count > 0)
            {
                optionsViewModel = new List<OptionsViewModel>();
                foreach (FormOptions optionsDTO in options)
                {
                    optionsViewModel.Add(new OptionsViewModel
                    {
                        Description = optionsDTO.Description,
                        Value = optionsDTO.Value
                    });
                }
            }
            return optionsViewModel;
        }

        /// <summary>
        /// To the fields group view model.
        /// </summary>
        /// <param name="stepFieldGroups">The step field groups.</param>
        /// <returns></returns>
        private static List<FieldsGroupViewModel> ToFieldsGroupViewModel(List<StepFieldGroup> stepFieldGroups)
        {
            List<FieldsGroupViewModel> fieldGroups = null;
            int sortOrder = 0;
            if (stepFieldGroups?.Count > 0)
            {
                fieldGroups = new List<FieldsGroupViewModel>();
                foreach (StepFieldGroup stepFieldGroup in stepFieldGroups)
                {
                    fieldGroups.Add(new FieldsGroupViewModel
                    {
                        Fields = ToFieldViewModel(stepFieldGroup.Fields),
                        Id = stepFieldGroup.Id,
                        Instructions = stepFieldGroup.Instructions,
                        Label = stepFieldGroup.Label,
                        SortOrder = sortOrder
                    });
                    sortOrder++;
                }
            }
            return fieldGroups;
        }

        /// <summary>
        /// To the field view model.
        /// </summary>
        /// <param name="stepFields">The step fields.</param>
        /// <returns></returns>
        private static List<FieldViewModel> ToFieldViewModel(List<StepField> stepFields)
        {
            List<FieldViewModel> fields = null;
            if (stepFields?.Count > 0)
            {
                fields = new List<FieldViewModel>();
                foreach (StepField stepField in stepFields)
                {
                    fields.Add(new FieldViewModel
                    {
                        ComponentType = stepField.Type,
                        Data = new DataViewModel
                        {
                            Id = stepField.Id,
                            Label = stepField.Label,
                            ErrorMessageRequired =
                                (stepField?.ValidatorMessages?.Count > 0) ?
                                stepField.ValidatorMessages[0].IsRequired : string.Empty,
                            ErrorMessageRange =
                                (stepField?.ValidatorMessages?.Count > 0) ?
                                stepField.ValidatorMessages[0].OutOfRange : string.Empty,
                            Options = ToOptionsViewModel(stepField.Options),
                            Modified = stepField.Modified
                        },
                        ActionUrl = stepField.ActionUrl,
                        Alt = stepField.Alt,
                        Color = stepField.Color,
                        IsWithLink = stepField.IsWithLink,
                        Size = stepField.Size,
                        Src = stepField.Src,
                        Value = stepField.Value,
                        IsRequired = stepField.IsRequired,
                        IsUserDefined = stepField.IsUserDefined,
                        MaxLength = stepField.MaxLength,
                        IsUploading = stepField.IsUploading,
                        CustomScript = stepField.CustomScript,
                        DataType = stepField.DataType,
                        GridSize = stepField.GridSize,
                        Default = stepField.Default,
                        IsExpansionPanelHeader = stepField.IsExpansionPanelHeader,
                        OnClick = stepField.OnClick
                    });
                }
            }
            return fields;
        }

        /// <summary>
        /// Converts to optionsviewmodel.
        /// </summary>
        /// <param name="options">The options.</param>
        /// <returns></returns>
        private static List<OptionsViewModel> ToOptionsViewModel(List<FormOptions> options)
        {
            List<OptionsViewModel> optionsViews = null;
            if (options?.Count > 0)
            {
                optionsViews = new List<OptionsViewModel>();
                foreach (FormOptions option in options)
                {
                    optionsViews.Add(new OptionsViewModel
                    {
                        Description = option.Description,
                        Value = option.Value
                    });
                }
            }
            return optionsViews;
        }

        #endregion Private Methods
    }
}