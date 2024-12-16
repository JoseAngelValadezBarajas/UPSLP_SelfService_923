// --------------------------------------------------------------------
// <copyright file="CampusCoordinatorResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class CampusCoordinatorResources
    {
        public string BtnCancel { get; set; }
        public string BtnDelete { get; set; }
        public string BtnEdit { get; set; }
        public string BtnSave { get; set; }
        public string BtnSearch { get; set; }
        public ConfirmationDialogResources DeleteCampusCoordinatorConfirmation { get; set; }
        public string LblCampusCoordinator { get; set; }
        public string LblCampusCoordinatorTitle { get; set; }
        public string LblDuplicatedCampusCoordinator { get; set; }
        public string LblNoCampusCoordinators { get; set; }
        public string LblOrganization { get; set; }
        public string LblOrganizationRequired { get; set; }
        public PeopleSearchAssignModalExtraResources PeopleSearchAssignModalExtra { get; set; }
    }
}