// --------------------------------------------------------------------
// <copyright file="DossierSetupResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class DossierSetupEdit
    {
        public string BtnAdd { get; set; }
        public string BtnCancel { get; set; }
        public string BtnDelete { get; set; }
        public string BtnEdit { get; set; }
        public string BtnSave { get; set; }
        public string BtnVisible { get; set; }
        public string LblAcademic { get; set; }
        public string LblAddress { get; set; }
        public string LblAssociation { get; set; }
        public string LblContact { get; set; }
        public string LblCourseSchedule { get; set; }
        public string LblEmailAddress { get; set; }
        public string LblEmergencyContact { get; set; }
        public string LblFacultySchedule { get; set; }
        public string LblFacultyTitle { get; set; }
        public string LblGeneralTitle { get; set; }
        public string LblHeader { get; set; }
        public string LblInstructions { get; set; }
        public string LblOffice { get; set; }
        public string LblPhoneNumber { get; set; }
        public string LblPosition { get; set; }
        public string LblReleaseInformation { get; set; }
        public string LblResidencyInformation { get; set; }
        public string LblStudentSchedule { get; set; }
        public string LblStudentTitle { get; set; }
        public string LblTeachingSchedule { get; set; }
    }

    public class DossierSetupEditCustom
    {
        public string BtnApply { get; set; }
        public string BtnCancel { get; set; }
        public string LblDisplayMode { get; set; }
        public string LblDisplayModeRequired { get; set; }
        public string LblList { get; set; }
        public string LblName { get; set; }
        public string LblNameDuplicated { get; set; }
        public string LblNameRequired { get; set; }
        public string LblTable { get; set; }
        public string LblTitleAdd { get; set; }
        public string LblTitleEditing { get; set; }
        public string LblViewName { get; set; }
        public string LblViewNameRequired { get; set; }
        public string LblVisible { get; set; }
    }

    public class DossierSetupResources
    {
        public string BtnFacultyDossier { get; set; }
        public string BtnGeneralDossier { get; set; }
        public string BtnStudentDossier { get; set; }
        public DossierSetupEdit DossierSetupEdit { get; set; }
        public DossierSetupEditCustom DossierSetupEditCustom { get; set; }
        public string LblDossierInstructions { get; set; }
        public string LblName { get; set; }
    }
}