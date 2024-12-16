// --------------------------------------------------------------------
// <copyright file="OfficesSetupResources.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class OfficesSetupEditModal
    {
        public string BtnCancel { get; set; }
        public string BtnDelete { get; set; }
        public string BtnDeleteAll { get; set; }
        public string FormatConfirmDelete { get; set; }
        public string FormatConfirmDeleteAll { get; set; }
        public string FormatDeleteOffice { get; set; }
        public string FormatEditingName { get; set; }
        public string LblActions { get; set; }
        public string LblDelete { get; set; }
        public string LblDeleteAllTitle { get; set; }
        public string LblEditTasks { get; set; }
        public string LblOffice { get; set; }
        public string LblViewNotes { get; set; }
    }

    public class OfficesSetupResources
    {
        public string LblActions { get; set; }
        public string LblAddStaffMember { get; set; }
        public string LblEdit { get; set; }
        public string LblInstructions { get; set; }
        public string LblName { get; set; }
        public string LblNoOfficesAvailable { get; set; }
        public string LblOffice { get; set; }
        public string LblSelect { get; set; }
        public string LblSelectOrAdd { get; set; }
        public OfficesSetupEditModal OfficesSetupEditModal { get; set; }
    }
}