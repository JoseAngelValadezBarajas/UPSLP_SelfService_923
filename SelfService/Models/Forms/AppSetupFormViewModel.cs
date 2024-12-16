// --------------------------------------------------------------------
// <copyright file="AppSetupFormViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Recruitment;
using System.Collections.Generic;

namespace SelfService.Models.Forms
{
    /// <summary>
    /// AppSetupFormViewModel
    /// </summary>
    public class AppSetupFormViewModel
    {
        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the fields groups.
        /// </summary>
        /// <value>
        /// The fields groups.
        /// </value>
        public List<FieldsGroupSetupViewModel> FieldsGroups { get; set; }

        /// <summary>
        /// Gets or sets the form layout identifier.
        /// </summary>
        /// <value>
        /// The form layout identifier.
        /// </value>
        public int FormLayoutId { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the steps.
        /// </summary>
        /// <value>
        /// The steps.
        /// </value>
        public List<StepSetupViewModel> Steps { get; set; }
    }

    /// <summary>
    /// FieldSetupViewModel
    /// </summary>
    public class FieldSetupViewModel
    {
        /// <summary>
        /// Gets or sets the action URL.
        /// </summary>
        /// <value>
        /// The action URL.
        /// </value>
        public string ActionUrl { get; set; }

        /// <summary>
        /// Gets or sets the alt.
        /// </summary>
        /// <value>
        /// The alt.
        /// </value>
        public string Alt { get; set; }

        /// <summary>
        /// Gets or sets the color.
        /// </summary>
        /// <value>
        /// The color.
        /// </value>
        public string Color { get; set; }

        /// <summary>
        /// Gets or sets the custom script.
        /// </summary>
        /// <value>
        /// The custom script.
        /// </value>
        public string CustomScript { get; set; }

        /// <summary>
        /// Gets or sets the type of the data.
        /// </summary>
        /// <value>
        /// The type of the data.
        /// </value>
        public string DataType { get; set; }

        /// <summary>
        /// Gets or sets the default.
        /// </summary>
        /// <value>
        /// The default.
        /// </value>
        public dynamic Default { get; set; }

        /// <summary>
        /// Gets or sets the size of the grid.
        /// </summary>
        /// <value>
        /// The size of the grid.
        /// </value>
        public string GridSize { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is expansion panel header.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is expansion panel header; otherwise, <c>false</c>.
        /// </value>
        public bool IsExpansionPanelHeader { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is required; otherwise, <c>false</c>.
        /// </value>
        public bool IsRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is uploading.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is uploading; otherwise, <c>false</c>.
        /// </value>
        public bool IsUploading { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is user defined.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is user defined; otherwise, <c>false</c>.
        /// </value>
        public bool IsUserDefined { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is with link.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is with link; otherwise, <c>false</c>.
        /// </value>
        public bool IsWithLink { get; set; }

        /// <summary>
        /// Gets or sets the label.
        /// </summary>
        /// <value>
        /// The label.
        /// </value>
        public string Label { get; set; }

        /// <summary>
        /// Gets or sets the maximum length.
        /// </summary>
        /// <value>
        /// The maximum length.
        /// </value>
        public int MaxLength { get; set; }

        /// <summary>
        /// Gets or sets the options.
        /// </summary>
        /// <value>
        /// The options.
        /// </value>
        public List<FormOptions> Options { get; set; }

        /// <summary>
        /// Gets or sets the size.
        /// </summary>
        /// <value>
        /// The size.
        /// </value>
        public string Size { get; set; }

        /// <summary>
        /// Gets or sets the sort order.
        /// </summary>
        /// <value>
        /// The sort order.
        /// </value>
        public int SortOrder { get; set; }

        /// <summary>
        /// Gets or sets the source.
        /// </summary>
        /// <value>
        /// The source.
        /// </value>
        public string Src { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets the validator messages.
        /// </summary>
        /// <value>
        /// The validator messages.
        /// </value>
        public List<ValidatorMessage> ValidatorMessages { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        /// <value>
        /// The value.
        /// </value>
        public string Value { get; set; }
    }

    /// <summary>
    /// FieldsGroupSetupViewModel
    /// </summary>
    public class FieldsGroupSetupViewModel
    {
        /// <summary>
        /// Gets or sets the fields.
        /// </summary>
        /// <value>
        /// The fields.
        /// </value>
        public List<FieldSetupViewModel> Fields { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the instructions.
        /// </summary>
        /// <value>
        /// The instructions.
        /// </value>
        public string Instructions { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is custom.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is custom; otherwise, <c>false</c>.
        /// </value>
        public bool IsCustom { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is expansion panel.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is expansion panel; otherwise, <c>false</c>.
        /// </value>
        public bool IsExpansionPanel { get; set; }

        /// <summary>
        /// Gets or sets the label.
        /// </summary>
        /// <value>
        /// The label.
        /// </value>
        public string Label { get; set; }

        /// <summary>
        /// Gets or sets the maximum allowed.
        /// </summary>
        /// <value>
        /// The maximum allowed.
        /// </value>
        public int MaximumAllowed { get; set; }

        /// <summary>
        /// Gets or sets the sort order.
        /// </summary>
        /// <value>
        /// The sort order.
        /// </value>
        public int SortOrder { get; set; }

        /// <summary>
        /// Gets or sets the validator messages.
        /// </summary>
        /// <value>
        /// The validator messages.
        /// </value>
        public List<ValidatorMessage> ValidatorMessages { get; set; }
    }

    /// <summary>
    /// StepSetupViewModel
    /// </summary>
    public class StepSetupViewModel
    {
        /// <summary>
        /// Gets or sets the fields groups.
        /// </summary>
        /// <value>
        /// The fields groups.
        /// </value>
        public List<FieldsGroupSetupViewModel> StepFieldGroups { get; set; }

        /// <summary>
        /// Gets or sets the instructions.
        /// </summary>
        /// <value>
        /// The instructions.
        /// </value>
        public string StepInstructions { get; set; }

        /// <summary>
        /// Gets or sets the step number.
        /// </summary>
        /// <value>
        /// The step number.
        /// </value>
        public int StepNumber { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string StepTitle { get; set; }
    }
}