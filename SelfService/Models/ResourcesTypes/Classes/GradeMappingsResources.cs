// --------------------------------------------------------------------
// <copyright file="GradeMappingsResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Classes
{
    public class GradeMappingsResources
    {
        public string BtnApplyDefaults { get; set; }
        public string BtnCancel { get; set; }
        public string BtnCopy { get; set; }
        public string BtnCopyGradeMappings { get; set; }
        public string BtnDelete { get; set; }
        public string BtnDeleteAllMappings { get; set; }
        public string BtnSave { get; set; }
        public GradeMappingsTable GradeMappingsTable { get; set; }
        public string LblChooseSection { get; set; }
        public string LblCopyGradeMappings { get; set; }
        public string LblCourse { get; set; }
        public string LblDeleteGradeMappings { get; set; }
        public string LblDescription { get; set; }
        public string LblFinal { get; set; }
        public string LblMidterm { get; set; }
        public string LblNoCreditData { get; set; }
        public string LblNoResults { get; set; }
        public string LblPeriod { get; set; }
        public string LblShowPoints { get; set; }
        public string LblTitleConfirmationDialog { get; set; }
        public string LblToStartWorking { get; set; }
        public string LblTotalPoints { get; set; }
    }

    public class GradeMappingsTable
    {
        public string LblFinalMin { get; set; }
        public string LblFinalMinPoints { get; set; }
        public string LblGrade { get; set; }
        public string LblGradeMappingRepeated { get; set; }
        public string LblIncorrectAmount { get; set; }
        public string LblInvalidAmount { get; set; }
        public string LblMidTermMin { get; set; }
        public string LblMidTermMinPoints { get; set; }
    }
}