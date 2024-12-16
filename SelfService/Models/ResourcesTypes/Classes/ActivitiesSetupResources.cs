// --------------------------------------------------------------------
// <copyright file="ActivitiesSetupResources.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Classes
{
    public class Activities
    {
        public ActivitiesTable ActivitiesTable { get; set; }
        public string LblComma { get; set; }
        public string LblItem { get; set; }
        public string LblPoints { get; set; }
    }

    public class ActivitiesModal
    {
        public string BtnSave { get; set; }
        public string FormatAdd { get; set; }
        public string FormatEdit { get; set; }
        public string LblActivityType { get; set; }
        public string LblActivityTypeRequired { get; set; }
        public string LblAssigned { get; set; }
        public string LblCountsTowardFinal { get; set; }
        public string LblCountsTowardMidterm { get; set; }
        public string LblDescription { get; set; }
        public string LblDue { get; set; }
        public string LblDueValidate { get; set; }
        public string LblEqually { get; set; }
        public string LblExtraCredit { get; set; }
        public string LblFinalWeight { get; set; }
        public string LblGeneral { get; set; }
        public string LblHelperText { get; set; }
        public string LblMidtermWeight { get; set; }
        public string LblPossiblePoints { get; set; }
        public string LblPossiblePointsValidate { get; set; }
        public string LblSelectActivity { get; set; }
        public string LblSelectDate { get; set; }
        public string LblTitle { get; set; }
        public string LblTitleRequired { get; set; }
    }

    public class ActivitiesSetupResources
    {
        public Activities Activities { get; set; }
        public ActivitiesModal ActivitiesAddModal { get; set; }
        public ActivitiesModal ActivitiesEditModal { get; set; }
        public string BtnAddActivity { get; set; }
        public string BtnChange { get; set; }
        public string BtnCopyActivities { get; set; }
        public string BtnDeleteAll { get; set; }
        public string BtnSave { get; set; }
        public ChangeActivitiesModal ChangeActivitiesModal { get; set; }
        public string FormatCurrentConfig { get; set; }
        public string FormatFinalDropsWithUnequalWeights { get; set; }
        public string FormatHasTooManyFinalDrops { get; set; }
        public string FormatMidtermDropsWithUnequalWeights { get; set; }
        public string FormatTooManyMidtermDrops { get; set; }
        public string FormatTotalFinalPoints { get; set; }
        public string FormatTotalMidtermPoints { get; set; }
        public string LblActivities { get; set; }
        public string LblByPossiblePoints { get; set; }
        public string LblByPossiblePointsLegend { get; set; }
        public string LblEnterForEachActivity { get; set; }
        public string LblEnterForEachActivityLegend { get; set; }
        public string LblEqually { get; set; }
        public string LblEquallyLegend { get; set; }
        public string LblHowToWeight { get; set; }
        public string LblLegend { get; set; }
        public string LblNoActivities { get; set; }
        public string LblNoResults { get; set; }
        public string LblOptions { get; set; }
        public string LblWeightByType { get; set; }
        public string LblWeightByTypeLegend { get; set; }
    }

    public class ActivitiesTable
    {
        public string BtnCopy { get; set; }
        public string BtnDelete { get; set; }
        public string BtnEdit { get; set; }
        public string BtnFinish { get; set; }
        public string BtnView { get; set; }
        public string FormatPercentage { get; set; }
        public string LblActivityWithExtraCredit { get; set; }
        public string LblAssigned { get; set; }
        public string LblAsterisk { get; set; }
        public string LblBetweenOne { get; set; }
        public string LblChooseSection { get; set; }
        public string LblCopyActivities { get; set; }
        public string LblCountsTowardFinal { get; set; }
        public string LblCountsTowardMidterm { get; set; }
        public string LblCourse { get; set; }
        public string LblDescription { get; set; }
        public string LblDropDownEmptyText { get; set; }
        public string LblDropHighest { get; set; }
        public string LblDropLowest { get; set; }
        public string LblDropMessage { get; set; }
        public string LblDue { get; set; }
        public string LblExtraCredit { get; set; }
        public string LblFinal { get; set; }
        public string LblFinalWeight { get; set; }
        public string LblGradesDue { get; set; }
        public string LblMidterm { get; set; }
        public string LblMidtermWeight { get; set; }
        public string LblMoreInfo { get; set; }
        public string LblPeriod { get; set; }
        public string LblPossiblePoints { get; set; }
        public string LblTitle { get; set; }
        public string LblToStartWorking { get; set; }
        public string LblType { get; set; }
        public string LblWeight { get; set; }
    }

    public class ChangeActivitiesModal
    {
        public string BtnChange { get; set; }
        public string LblByPossiblePoints { get; set; }
        public string LblEnterForEachActivity { get; set; }
        public string LblEqually { get; set; }
        public string LblHowToWeight { get; set; }
        public string LblWeightByType { get; set; }
    }
}