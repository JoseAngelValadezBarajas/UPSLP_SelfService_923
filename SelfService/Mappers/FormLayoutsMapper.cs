// --------------------------------------------------------------------
// <copyright file="FormLayoutsMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Recruitment;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using SelfService.Models.Forms;
using System.Collections.Generic;

namespace SelfService.Mappers
{
    /// <summary>
    /// FormLayoutsMapper
    /// </summary>
    internal static class FormLayoutsMapper
    {
        /// <summary>
        /// Converts FormLayout To AppSetupFormViewModel
        /// </summary>
        /// <param name="formLayoutDTO">The form layout dto.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <returns></returns>
        internal static AppSetupFormViewModel ToViewModel(this FormLayout formLayoutDTO, ISerializationHelper serializationHelper)
        {
            AppSetupFormViewModel appSetupFormViewModel = null;
            if (formLayoutDTO != null)
            {
                formLayoutDTO.FormJsonDetail = serializationHelper.ToObject<FormJsonDetail>(formLayoutDTO.FormJson);
                if (formLayoutDTO.FormJsonDetail != null)
                {
                    appSetupFormViewModel = new AppSetupFormViewModel
                    {
                        FormLayoutId = formLayoutDTO.FormLayoutId,
                        Name = formLayoutDTO.Name,
                        Description = formLayoutDTO.Description,
                        Steps = GetSteps(formLayoutDTO.FormJsonDetail),
                        FieldsGroups = GetBottomGroups(formLayoutDTO.FormJsonDetail)
                    };
                }
            }
            return appSetupFormViewModel;
        }

        #region Private Methods

        /// <summary>
        /// Gets the bottom groups.
        /// </summary>
        /// <param name="formJsonDetail">The form json detail.</param>
        /// <returns></returns>
        private static List<FieldsGroupSetupViewModel> GetBottomGroups(FormJsonDetail formJsonDetail)
        {
            List<FieldsGroupSetupViewModel> fieldsGroupList = null;
            if (formJsonDetail?.FieldGroups?.Count > 0)
            {
                fieldsGroupList = new List<FieldsGroupSetupViewModel>();
                foreach (StepFieldGroup stepFieldGroup in formJsonDetail.FieldGroups)
                {
                    if (stepFieldGroup.Id == "confirmationGroup" || stepFieldGroup.Id == "footerGroup")
                    {
                        fieldsGroupList.Add(new FieldsGroupSetupViewModel
                        {
                            Fields = GetFieldsByGroup(stepFieldGroup.Fields),
                            Id = stepFieldGroup.Id,
                            IsExpansionPanel = stepFieldGroup.IsExpansionPanel,
                            Label = stepFieldGroup.Label
                        });
                    }
                }
            }
            return fieldsGroupList;
        }

        /// <summary>
        /// Gets the fields by group.
        /// </summary>
        /// <param name="stepFieldList">The step field list.</param>
        /// <returns></returns>
        private static List<FieldSetupViewModel> GetFieldsByGroup(List<StepField> stepFieldList)
        {
            List<FieldSetupViewModel> fieldSetupViewModelList = null;
            if (stepFieldList?.Count > 0)
            {
                fieldSetupViewModelList = new List<FieldSetupViewModel>();
                int i = 0;
                foreach (StepField stepField in stepFieldList)
                {
                    fieldSetupViewModelList.Add(new FieldSetupViewModel
                    {
                        ActionUrl = stepField.ActionUrl,
                        Default = stepField.Default,
                        GridSize = stepField.GridSize,
                        Id = stepField.Id,
                        IsWithLink = stepField.IsWithLink,
                        Label = stepField.Label,
                        MaxLength = stepField.MaxLength,
                        Type = stepField.Type,
                        ValidatorMessages = stepField.ValidatorMessages,
                        SortOrder = i++,
                        Options = stepField.Options,
                        IsRequired = stepField.IsRequired,
                        IsUserDefined = stepField.IsUserDefined,
                        IsUploading = stepField.IsUploading,
                        CustomScript = stepField.CustomScript,
                        DataType = stepField.DataType,
                        Color = stepField.Color,
                        Size = stepField.Size,
                        Alt = stepField.Alt,
                        Src = stepField.Src,
                        Value = stepField.Value,
                        IsExpansionPanelHeader = stepField.IsExpansionPanelHeader
                    });
                }
            }
            return fieldSetupViewModelList;
        }

        /// <summary>
        /// Gets the fields groups.
        /// </summary>
        /// <param name="step">The step.</param>
        /// <returns></returns>
        private static List<FieldsGroupSetupViewModel> GetFieldsGroups(Step step)
        {
            List<FieldsGroupSetupViewModel> fieldsGroupSetupViewModelList = new();
            if (step?.StepFieldGroups != null)
            {
                for (int i = 0; i < step?.StepFieldGroups.Count; i++)
                {
                    fieldsGroupSetupViewModelList.Add(new FieldsGroupSetupViewModel
                    {
                        Fields = GetFieldsByGroup(step.StepFieldGroups[i].Fields),
                        Id = step.StepFieldGroups[i].Id,
                        Instructions = step.StepFieldGroups[i].Instructions,
                        IsExpansionPanel = step.StepFieldGroups[i].IsExpansionPanel,
                        Label = step.StepFieldGroups[i].Label,
                        MaximumAllowed = step.StepFieldGroups[i].MaximumAllowed,
                        SortOrder = i,
                        ValidatorMessages = step.StepFieldGroups[i].ValidatorMessages,
                        IsCustom = step.StepFieldGroups[i].IsCustom
                    });
                }
            }
            return fieldsGroupSetupViewModelList;
        }

        /// <summary>
        /// Gets the steps.
        /// </summary>
        /// <param name="formJsonDetail">The form json detail.</param>
        /// <returns></returns>
        private static List<StepSetupViewModel> GetSteps(FormJsonDetail formJsonDetail)
        {
            List<StepSetupViewModel> stepSetupViewModelList = new();
            if (formJsonDetail != null)
            {
                for (int i = 0; i < formJsonDetail.Steps.Count; i++)
                {
                    stepSetupViewModelList.Add(new StepSetupViewModel
                    {
                        StepTitle = formJsonDetail.Steps[i].StepTitle,
                        StepInstructions = formJsonDetail.Steps[i].StepInstructions,
                        StepNumber = i + 1,
                        StepFieldGroups = GetFieldsGroups(formJsonDetail.Steps[i])
                    });
                }
            }
            return stepSetupViewModelList;
        }

        #endregion Private Methods
    }
}