// --------------------------------------------------------------------
// <copyright file="AssociationHeadResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class AssociationHeadResources
    {
        public string BtnCancel { get; set; }
        public string BtnDelete { get; set; }
        public string BtnEdit { get; set; }
        public string BtnSave { get; set; }
        public string BtnSearch { get; set; }
        public ConfirmationDialogResources DeleteAssociationHeadConfirmation { get; set; }
        public string LblAssociation { get; set; }
        public string LblAssociationHeadTitle { get; set; }
        public string LblAssociationRequired { get; set; }
        public string LblDuplicatedAssociationHead { get; set; }
        public string LblNoAssociationHeads { get; set; }
        public string LblResponsible { get; set; }
        public PeopleSearchAssignModalExtraResources PeopleSearchAssignModalExtra { get; set; }
    }
}