// --------------------------------------------------------------------
// <copyright file="DepartmentHeadResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class DepartmentHeadResources
    {
        public string BtnCancel { get; set; }
        public string BtnDelete { get; set; }
        public string BtnEdit { get; set; }
        public string BtnSave { get; set; }
        public string BtnSearch { get; set; }
        public ConfirmationDialogResources DeleteDepartmentHeadConfirmation { get; set; }
        public string LblActions { get; set; }
        public string LblAddTitle { get; set; }
        public string LblDepartment { get; set; }
        public string LblDepartmentHead { get; set; }
        public string LblDepartmentHeadTitle { get; set; }
        public string LblDepartmentRequired { get; set; }
        public string LblDuplicatedDepartmentHead { get; set; }
        public string LblNoDepartmentHeads { get; set; }
        public PeopleSearchAssignModalExtraResources PeopleSearchAssignModalExtra { get; set; }
    }
}