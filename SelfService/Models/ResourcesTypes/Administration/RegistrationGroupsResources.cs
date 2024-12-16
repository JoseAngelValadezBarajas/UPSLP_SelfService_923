// --------------------------------------------------------------------
// <copyright file="RegistrationGroupsResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class RegistrationGroupsEdit
    {
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string FormatDateOutOfRange { get; set; }
        public string FormatTitleEditing { get; set; }
        public string LblActive { get; set; }
        public string LblAdvisorApprovals { get; set; }
        public string LblAdvisorAuthorization { get; set; }
        public string LblBaseDate { get; set; }
        public string LblBaseDateRequired { get; set; }
        public string LblCourseAdvisorApproval { get; set; }
        public string LblDate { get; set; }
        public string LblDateRequired { get; set; }
        public string LblDaysFromBaseDate { get; set; }
        public string LblDaysFromBaseDateRequired { get; set; }
        public string LblDropAdvisorApproval { get; set; }
        public string LblEndHour { get; set; }
        public string LblEndHourRequired { get; set; }
        public string LblEndMinute { get; set; }
        public string LblEndMinuteRequired { get; set; }
        public string LblEndRegistrationCriteria { get; set; }
        public string LblErrorDatesRange { get; set; }
        public string LblErrorTimesRange { get; set; }
        public string LblGeneralInformation { get; set; }
        public string LblGroupName { get; set; }
        public string LblGroupNameRequired { get; set; }
        public string LblInvalidDaysFromBaseDate { get; set; }
        public string LblInvalidSort { get; set; }
        public string LblNameDuplicated { get; set; }
        public string LblRegistrationCriteria { get; set; }
        public string LblSort { get; set; }
        public string LblSortDuplicated { get; set; }
        public string LblSortRequired { get; set; }
        public string LblStartHour { get; set; }
        public string LblStartHourRequired { get; set; }
        public string LblStartMinute { get; set; }
        public string LblStartMinuteRequired { get; set; }
        public string LblStartRegistrationCriteria { get; set; }
        public string LblViewName { get; set; }
        public string LblViewNameRequired { get; set; }
        public string LblWarningPreRegistrationDate { get; set; }
        public string LblWarningRegistrationDate { get; set; }
    }

    public class RegistrationGroupsResources
    {
        public string BtnAdd { get; set; }
        public ConfirmationDialogResources DeleteGroupConfirmation { get; set; }
        public string FormatDeleteGroup { get; set; }
        public string FormatEnableGroup { get; set; }
        public string LblActive { get; set; }
        public string LblDelete { get; set; }
        public string LblEnableDisable { get; set; }
        public string LblGroupName { get; set; }
        public string LblInstructions { get; set; }
        public string LblNotActive { get; set; }
        public string LblSort { get; set; }
        public string LblStatus { get; set; }
        public RegistrationGroupsEdit RegistrationGroupsEdit { get; set; }
    }
}