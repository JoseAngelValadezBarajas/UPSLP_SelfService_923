// --------------------------------------------------------------------
// <copyright file="PermissionRequestsResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Shared;

namespace SelfService.Models.ResourcesTypes.Classes
{
    public class PermissionRequestDetail
    {
        public string BtnAccept { get; set; }
        public string BtnCancel { get; set; }
        public string BtnEdit { get; set; }
        public string LblCommentRequired { get; set; }
        public string LblComments { get; set; }
        public string LblNoComments { get; set; }
        public string LblStatusTitle { get; set; }
        public string LblTypeComments { get; set; }
    }

    public class PermissionRequestsResources
    {
        public string FormatSelectStudent { get; set; }
        public string FormatTotalStudents { get; set; }
        public string LblAddStudent { get; set; }
        public string LblApproved { get; set; }
        public string LblClassLevelDetail { get; set; }
        public string LblCurriculumDetail { get; set; }
        public string LblDenied { get; set; }
        public string LblEmailButton { get; set; }
        public string LblIdDetail { get; set; }
        public string LblNameDetail { get; set; }
        public string LblNoResults { get; set; }
        public string LblNoResultsByStatus { get; set; }
        public string LblPrerequisits { get; set; }
        public string LblSaveButton { get; set; }
        public string LblSelectStatus { get; set; }
        public string LblStatusDetail { get; set; }
        public string LblViewAll { get; set; }
        public string LblWaiting { get; set; }
        public string LblWithdrawn { get; set; }
        public PermissionRequestDetail PermissionRequestDetail { get; set; }
        public PermissionRequestStatusResources PermissionRequestStatus { get; set; }
    }
}