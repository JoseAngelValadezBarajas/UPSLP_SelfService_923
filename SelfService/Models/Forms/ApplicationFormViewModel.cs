// --------------------------------------------------------------------
// <copyright file="ApplicationFormViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Recruitment;
using System.Collections.Generic;

namespace SelfService.Models.Forms
{
    /// <summary>
    /// ApplicationFormViewModel
    /// </summary>
    public class ApplicationFormViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [allow attachment].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [allow attachment]; otherwise, <c>false</c>.
        /// </value>
        public bool AllowAttachment { get; set; }

        /// <summary>
        /// Gets or sets the application form identifier.
        /// </summary>
        /// <value>
        /// The application form identifier.
        /// </value>
        public int ApplicationFormId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance can save application.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance can save application; otherwise, <c>false</c>.
        /// </value>
        public bool CanSaveApplication { get; set; }

        /// <summary>
        /// Gets or sets the confirmation save message.
        /// </summary>
        /// <value>
        /// The confirmation save message.
        /// </value>
        public string ConfirmationSaveMessage { get; set; }

        /// <summary>
        /// Gets or sets the date time maximum.
        /// </summary>
        /// <value>
        /// The date time maximum.
        /// </value>
        public string DateTimeMax { get; set; }

        /// <summary>
        /// Gets or sets the date time minimum.
        /// </summary>
        /// <value>
        /// The date time minimum.
        /// </value>
        public string DateTimeMin { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the email reg expression.
        /// </summary>
        /// <value>
        /// The email reg expression.
        /// </value>
        public string EmailRegExpression { get; set; }

        /// <summary>
        /// Gets the enable online payment.
        /// </summary>
        /// <value>
        /// The enable online payment.
        /// </value>
        public bool EnableOnlinePayment { get; internal set; }

        /// <summary>
        /// Gets or sets the expansion panel.
        /// </summary>
        /// <value>The expantion panel.</value>
        public ExpansionPanel ExpansionPanel { get; set; }

        /// <summary>
        /// Gets the fee amount.
        /// </summary>
        /// <value>
        /// The fee amount.
        /// </value>
        public string FeeAmount { get; internal set; }

        /// <summary>
        /// Gets or sets the completed view.
        /// </summary>
        /// <value>
        /// The completed view.
        /// </value>
        public List<FieldsGroupViewModel> FieldsGroups { get; set; }

        /// <summary>
        /// Gets or sets the file types.
        /// </summary>
        /// <value>
        /// The file types.
        /// </value>
        public List<AvailableFileType> FileTypes { get; set; }

        /// <summary>
        /// Gets or sets the footer save message.
        /// </summary>
        /// <value>
        /// The footer save message.
        /// </value>
        public string FooterSaveMessage { get; set; }

        /// <summary>
        /// Gets or sets the goverment identifier mask.
        /// </summary>
        /// <value>
        /// The goverment identifier mask.
        /// </value>
        public string GovernmentIdMask { get; set; }

        /// <summary>
        /// Gets or sets the goverment identifier maximum lenght.
        /// </summary>
        /// <value>
        /// The goverment identifier maximum lenght.
        /// </value>
        public int? GovernmentIdMaxLength { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance is flat fee.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is flat fee; otherwise, <c>false</c>.
        /// </value>
        public bool IsFlatFee { get; internal set; }

        /// <summary>
        /// Gets or sets the layout identifier.
        /// </summary>
        /// <value>
        /// The layout identifier.
        /// </value>
        public int? LayoutId { get; set; }

        /// <summary>
        /// Gets or sets the maximum size of the application attachment.
        /// </summary>
        /// <value>
        /// The maximum size of the application attachment.
        /// </value>
        public int MaxApplicationAttachmentSize { get; set; }

        /// <summary>
        /// Gets or sets the maximum size of the attachment.
        /// </summary>
        /// <value>
        /// The maximum size of the attachment.
        /// </value>
        public int MaxAttachmentSize { get; set; }

        /// <summary>
        /// Gets or sets the Application Form name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the number of attachments.
        /// </summary>
        /// <value>
        /// The number of attachments.
        /// </value>
        public int NumberOfAttachments { get; set; }

        /// <summary>
        /// Gets or sets the person.
        /// </summary>
        /// <value>
        /// The person.
        /// </value>
        public PersonInformationViewModel Person { get; set; }

        /// <summary>
        /// Gets or sets the saved application identifier.
        /// </summary>
        /// <value>The saved application identifier.</value>
        public int? SavedApplicationId { get; set; }

        /// <summary>
        /// Gets or sets the steps.
        /// </summary>
        /// <value>
        /// The steps.
        /// </value>
        public List<StepViewModel> Steps { get; set; }
    }

    /// <summary>
    /// ComplexOptionsViewModel
    /// </summary>
    public class ComplexOptionsViewModel
    {
        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the options.
        /// </summary>
        /// <value>
        /// The options.
        /// </value>
        public List<OptionsViewModel> Options { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        /// <value>
        /// The value.
        /// </value>
        public dynamic Value { get; set; }
    }

    /// <summary>
    /// DataViewModel
    /// </summary>
    public class DataViewModel
    {
        /// <summary>
        /// Gets or sets the allow multiple selection.
        /// </summary>
        /// <value>
        /// The allow multiple selection.
        /// </value>
        public bool? AllowMultipleSelection { get; set; }

        /// <summary>
        /// Gets or sets the complex options.
        /// </summary>
        /// <value>
        /// The complex options.
        /// </value>
        public List<ComplexOptionsViewModel> ComplexOptions { get; set; }

        /// <summary>
        /// Gets or sets the error message duplicate.
        /// </summary>
        /// <value>
        /// The error message duplicate.
        /// </value>
        public string ErrorMessageDuplicate { get; set; }

        /// <summary>
        /// Gets or sets the error message format.
        /// </summary>
        /// <value>
        /// The error message format.
        /// </value>
        public string ErrorMessageFormat { get; set; }

        /// <summary>
        /// Gets or sets the error message not valid.
        /// </summary>
        /// <value>
        /// The error message not valid.
        /// </value>
        public string ErrorMessageNotValid { get; set; }

        /// <summary>
        /// Gets or sets the error message numeric.
        /// </summary>
        /// <value>
        /// The error message numeric.
        /// </value>
        public string ErrorMessageNumeric { get; set; }

        /// <summary>
        /// Gets or sets the error message primary.
        /// </summary>
        /// <value>
        /// The error message primary.
        /// </value>
        public string ErrorMessagePrimary { get; set; }

        /// <summary>
        /// Gets or sets the error message range.
        /// </summary>
        /// <value>
        /// The error message range.
        /// </value>
        public string ErrorMessageRange { get; set; }

        /// <summary>
        /// Gets or sets the error message.
        /// </summary>
        /// <value>
        /// The error message.
        /// </value>
        public string ErrorMessageRequired { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the label.
        /// </summary>
        /// <value>
        /// The label.
        /// </value>
        public string Label { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="DataViewModel"/> is modified.
        /// </summary>
        /// <value>
        ///   <c>true</c> if modified; otherwise, <c>false</c>.</value>
        public bool? Modified { get; set; }

        /// <summary>
        /// Gets or sets the options.
        /// </summary>
        /// <value>
        /// The options.
        /// </value>
        public List<OptionsViewModel> Options { get; set; }

        /// <summary>
        /// Gets or sets the section.
        /// </summary>
        /// <value>The section.</value>
        public int? Section { get; set; }
    }

    /// <summary>
    /// ExpantionPanelCount
    /// </summary>
    public class ExpansionPanel
    {
        /// <summary>
        /// Gets or sets the activity count.
        /// </summary>
        /// <value>The activity count.</value>
        public int? ActivityCount { get; set; }

        /// <summary>
        /// Gets or sets the addressess count.
        /// </summary>
        /// <value>The addressess count.</value>
        public int? AddressessCount { get; set; }

        /// <summary>
        /// Gets or sets the education count.
        /// </summary>
        /// <value>The education count.</value>
        public int? EducationCount { get; set; }

        /// <summary>
        /// Gets or sets the emergency contacts count.
        /// </summary>
        /// <value>The emergency contacts count.</value>
        public int? EmergencyContactsCount { get; set; }

        /// <summary>
        /// Gets or sets the employee count.
        /// </summary>
        /// <value>The employee count.</value>
        public int? EmployeeCount { get; set; }

        /// <summary>
        /// Gets or sets the phone count.
        /// </summary>
        /// <value>The phone count.</value>
        public int? PhoneCount { get; set; }

        /// <summary>
        /// Gets or sets the programs count.
        /// </summary>
        /// <value>The programs count.</value>
        public int? ProgramsCount { get; set; }

        /// <summary>
        /// Gets or sets the relatives count.
        /// </summary>
        /// <value>The relatives count.</value>
        public int? RelativesCount { get; set; }

        /// <summary>
        /// Gets or sets the test scores count.
        /// </summary>
        /// <value>The test scores count.</value>
        public int? TestScoresCount { get; set; }
    }

    /// <summary>
    /// SectionViewModel
    /// </summary>
    public class FieldsGroupViewModel
    {
        /// <summary>
        /// Gets or sets the error message duplicate.
        /// </summary>
        /// <value>
        /// The error message duplicate.
        /// </value>
        public string ErrorMessageDuplicate { get; set; }

        /// <summary>
        /// Gets or sets the error message format.
        /// </summary>
        /// <value>
        /// The error message format.
        /// </value>
        public string ErrorMessageFormat { get; set; }

        /// <summary>
        /// Gets or sets the error message not valid.
        /// </summary>
        /// <value>
        /// The error message not valid.
        /// </value>
        public string ErrorMessageNotValid { get; set; }

        /// <summary>
        /// Gets or sets the error message numeric.
        /// </summary>
        /// <value>
        /// The error message numeric.
        /// </value>
        public string ErrorMessageNumeric { get; set; }

        /// <summary>
        /// Gets or sets the error message primary.
        /// </summary>
        /// <value>
        /// The error message primary.
        /// </value>
        public string ErrorMessagePrimary { get; set; }

        /// <summary>
        /// Gets or sets the error message range.
        /// </summary>
        /// <value>
        /// The error message range.
        /// </value>
        public string ErrorMessageRange { get; set; }

        /// <summary>
        /// Gets or sets the error message.
        /// </summary>
        /// <value>
        /// The error message.
        /// </value>
        public string ErrorMessageRequired { get; set; }

        /// <summary>
        /// Gets or sets the field.
        /// </summary>
        /// <value>
        /// The field.
        /// </value>
        public List<FieldViewModel> Fields { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the section instructions.
        /// </summary>
        /// <value>
        /// The section instructions.
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
        /// Gets or sets a value indicating whether this instance is horizontal aligned.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is horizontal aligned; otherwise, <c>false</c>.
        /// </value>
        public bool IsHorizontalAligned { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is multiple.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is multiple; otherwise, <c>false</c>.
        /// </value>
        public bool IsMultiple { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is required; otherwise, <c>false</c>.
        /// </value>
        public bool IsRequired { get; set; }

        /// <summary>
        /// Gets or sets the section title.
        /// </summary>
        /// <value>
        /// The section title.
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
    }

    /// <summary>
    /// FieldViewModel
    /// </summary>
    public class FieldViewModel
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
        /// Gets or sets the child end point.
        /// </summary>
        /// <value>
        /// The child end point.
        /// </value>
        public string ChildEndPoint { get; set; }

        /// <summary>
        /// Gets or sets the child field.
        /// </summary>
        /// <value>
        /// The child field.
        /// </value>
        public string ChildField { get; set; }

        /// <summary>
        /// Gets or sets the color.
        /// </summary>
        /// <value>
        /// The color.
        /// </value>
        public string Color { get; set; }

        /// <summary>
        /// Gets or sets the type of the component.
        /// </summary>
        /// <value>
        /// The type of the component.
        /// </value>
        public string ComponentType { get; set; }

        /// <summary>
        /// Gets or sets the custom script.
        /// </summary>
        /// <value>
        /// The custom script.
        /// </value>
        public string CustomScript { get; set; }

        /// <summary>
        /// Gets or sets the data.
        /// </summary>
        /// <value>
        /// The data.
        /// </value>
        public DataViewModel Data { get; set; }

        /// <summary>
        /// Gets or sets the type of the data.
        /// </summary>
        /// <value>
        /// The type of the data.
        /// </value>
        public string DataType { get; set; }

        /// <summary>
        /// Gets or sets the defualt.
        /// </summary>
        /// <value>
        /// The defualt.
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
        /// Gets or sets a value indicating whether this instance is expansion panel header.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is expansion panel header; otherwise, <c>false</c>.
        /// </value>
        public bool? IsExpansionPanelHeader { get; set; }

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
        public bool? IsUploading { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is user defined.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is user defined; otherwise, <c>false</c>.
        /// </value>
        public bool? IsUserDefined { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is with link.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is with link; otherwise, <c>false</c>.
        /// </value>
        public bool? IsWithLink { get; set; }

        /// <summary>
        /// Gets or sets the maximum length.
        /// </summary>
        /// <value>
        /// The maximum length.
        /// </value>
        public int? MaxLength { get; set; }

        /// <summary>
        /// Gets or sets the on click.
        /// </summary>
        /// <value>The on click.</value>
        public dynamic OnClick { get; set; }

        /// <summary>
        /// Gets or sets the parent identifier.
        /// </summary>
        /// <value>
        /// The parent identifier.
        /// </value>
        public string ParentId { get; set; }

        /// <summary>
        /// Gets or sets the size.
        /// </summary>
        /// <value>
        /// The size.
        /// </value>
        public string Size { get; set; }

        /// <summary>
        /// Gets or sets the source.
        /// </summary>
        /// <value>
        /// The source.
        /// </value>
        public string Src { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        /// <value>
        /// The value.
        /// </value>
        public dynamic Value { get; set; }
    }

    /// <summary>
    /// OptionsViewModel
    /// </summary>
    public class OptionsViewModel
    {
        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        /// <value>
        /// The value.
        /// </value>
        public dynamic Value { get; set; }
    }

    /// <summary>
    /// PersonInformation
    /// </summary>
    public class PersonInformationViewModel
    {
        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>The person identifier.</value>
        public int? PersonId { get; set; }

        /// <summary>
        /// Gets or sets the temporary email.
        /// </summary>
        /// <value>The temporary email.</value>
        public string TemporaryEmail { get; set; }

        /// <summary>
        /// Gets or sets the temporary user identifier.
        /// </summary>
        /// <value>The temporary user identifier.</value>
        public int? TemporaryUserId { get; set; }
    }

    /// <summary>
    /// StepViewModel
    /// </summary>
    public class StepViewModel
    {
        /// <summary>
        /// Gets or sets the fields.
        /// </summary>
        /// <value>
        /// The fields.
        /// </value>
        public List<FieldsGroupViewModel> FieldsGroups { get; set; }

        /// <summary>
        /// Gets or sets the step instructions.
        /// </summary>
        /// <value>
        /// The step instructions.
        /// </value>
        public string Instructions { get; set; }

        /// <summary>
        /// Gets or sets the step number.
        /// </summary>
        /// <value>
        /// The step number.
        /// </value>
        public int StepNumber { get; set; }

        /// <summary>
        /// Gets or sets the step title.
        /// </summary>
        /// <value>
        /// The step title.
        /// </value>
        public string Title { get; set; }
    }
}