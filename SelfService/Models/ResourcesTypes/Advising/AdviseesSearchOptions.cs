// --------------------------------------------------------------------
// <copyright file="AdviseesSearchOptions.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Advising
{
    public class AdvancedSearchModal
    {
        public string BtnClear { get; set; }
        public string BtnSearch { get; set; }
        public string LblAcademic { get; set; }
        public string LblAdvancedSearch { get; set; }
        public string LblAdvisor { get; set; }
        public string LblAlumni { get; set; }
        public string LblCampus { get; set; }
        public string LblClassLevel { get; set; }
        public string LblClassYear { get; set; }
        public string LblCollege { get; set; }
        public string LblCourse { get; set; }
        public string LblCurriculum { get; set; }
        public string LblDegree { get; set; }
        public string LblDepartment { get; set; }
        public string LblEvent { get; set; }
        public string LblFilter { get; set; }
        public string LblFirstName { get; set; }
        public string LblId { get; set; }
        public string LblLastName { get; set; }
        public string LblLastNamePrefix { get; set; }
        public string LblMiddleName { get; set; }
        public string LblName { get; set; }
        public string LblOnStopList { get; set; }
        public string LblPendingSchedules { get; set; }
        public string LblPeriod { get; set; }
        public string LblProgram { get; set; }
        public string LblRetrieveAll { get; set; }
        public string LblSection { get; set; }
        public string LblSelect { get; set; }
        public string LblSession { get; set; }
        public string LblStatus { get; set; }
        public string LblSubType { get; set; }
        public string LblYearTerm { get; set; }
    }

    public class AdviseesSearchModal
    {
        public string LblAdvancedSearch { get; set; }
        public string LblApply { get; set; }
        public string LblFilter { get; set; }
        public string LblFilterSearch { get; set; }
        public string LblList { get; set; }
        public string LblSelect { get; set; }
    }

    public class AdviseesSearchOptions
    {
        public AdvancedSearchModal AdvancedSearchModal { get; set; }
        public AdviseesSearchModal AdviseesSearchModal { get; set; }
        public string LblFilter { get; set; }
        public string LblFilterSearch { get; set; }
        public string LblList { get; set; }
        public string LblSearchMask { get; set; }
    }
}