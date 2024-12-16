// --------------------------------------------------------------------
// <copyright file="RuleResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class RuleAddEditResources
    {
        public BlockItem BlockItemRes { get; set; }
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string LblActive { get; set; }
        public string LblAddBlocks { get; set; }
        public string LblAddGroup { get; set; }
        public string LblBlockRegistrationOnly { get; set; }
        public string LblBlockRegistrationOnlyDesc { get; set; }
        public string LblBlocks { get; set; }
        public string LblDelete { get; set; }
        public string LblDragDropInstructions { get; set; }
        public string LblDuplicateNameError { get; set; }
        public string LblDuplicatePriorityError { get; set; }
        public string LblGroups { get; set; }
        public string LblHideDetails { get; set; }
        public string LblMaximumNumberGroups { get; set; }
        public string LblName { get; set; }
        public string LblNameError { get; set; }
        public string LblNoBlocks { get; set; }
        public string LblNoGroups { get; set; }
        public string LblPriority { get; set; }
        public string LblPriorityNumberError { get; set; }
        public string LblRuleInUse { get; set; }
        public string LblShowDetails { get; set; }
        public string LblViewName { get; set; }
        public string LblViewNameError { get; set; }
    }

    public class RuleAddGroupResources
    {
        public string BtnApply { get; set; }
        public string BtnApplyAndSearch { get; set; }
        public string BtnApplySelect { get; set; }
        public string BtnCancel { get; set; }
        public string BtnClearSearch { get; set; }
        public string BtnSearch { get; set; }
        public string LblAddGroup { get; set; }
        public string LblAssignBlocks { get; set; }
        public string LblDisplayName { get; set; }
        public string LblDisplayNameError { get; set; }
        public string LblEditingGroup { get; set; }
        public string LblMessageCoursesAdded { get; set; }
        public string LblName { get; set; }
        public string LblNameDuplicated { get; set; }
        public string LblNameError { get; set; }
    }

    public class RuleResources
    {
        public string FormatTitlePeriod { get; set; }
        public string LblActive { get; set; }
        public string LblAddRule { get; set; }
        public string LblAddRuleTitle { get; set; }
        public string LblEditingRule { get; set; }
        public string LblEmptyRule { get; set; }
        public string LblEnable { get; set; }
        public string LblInactive { get; set; }
        public string LblName { get; set; }
        public string LblNoResults { get; set; }
        public string LblOptions { get; set; }
        public string LblPriority { get; set; }
        public string LblRetrieveAll { get; set; }
        public RuleAddEditResources RuleAddEditRes { get; set; }
        public RuleAddGroupResources RuleAddGroupRes { get; set; }
    }
}