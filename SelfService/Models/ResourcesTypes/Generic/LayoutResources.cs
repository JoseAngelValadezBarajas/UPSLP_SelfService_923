// --------------------------------------------------------------------
// <copyright file="LayoutResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Generic
{
    #region Components

    public class A11Y
    {
        public string InputDescription { get; set; }
    }

    public class ActionMenu
    {
        public string More { get; set; }
    }

    public class Alert
    {
        public string Close { get; set; }
    }

    public class AvatarGroup
    {
        public string OpenMenu { get; set; }
    }

    public class Calendar
    {
        public string Agenda { get; set; }
        public string AllDay { get; set; }
        public string Date { get; set; }
        public string Day { get; set; }
        public string Event { get; set; }
        public string GoToToday { get; set; }
        public string Month { get; set; }
        public string Next { get; set; }
        public string NoEventsInRange { get; set; }
        public string Previous { get; set; }
        public string Time { get; set; }
        public string Week { get; set; }
        public string WorkWeek { get; set; }
    }

    public class CalendarToolBar
    {
        public string OpenDatePicker { get; set; }
    }

    public class Carousel
    {
        public string StepOfTotal { get; set; }
    }

    public class CarouselStepper
    {
        public string BackButton { get; set; }
        public string NextButton { get; set; }
    }

    public class CategorySearch
    {
        public string All { get; set; }
    }

    public class Component
    {
        public ActionMenu ActionMenu { get; set; }
        public Alert Alert { get; set; }
        public AvatarGroup AvatarGroup { get; set; }
        public Calendar Calendar { get; set; }
        public CalendarToolBar CalendarToolBar { get; set; }
        public Carousel Carousel { get; set; }
        public CarouselStepper CarouselStepper { get; set; }
        public DatePicker DatePicker { get; set; }
        public DateRangePicker DateRangePicker { get; set; }
        public DayPicker DayPicker { get; set; }
        public Dialog Dialog { get; set; }
        public Dropdown Dropdown { get; set; }
        public DropdownTypeahead DropdownTypeahead { get; set; }
        public HeaderBar HeaderBar { get; set; }
        public Logo Logo { get; set; }
        public MasterDetail MasterDetail { get; set; }
        public MegaMenu MegaMenu { get; set; }
        public MobileStepper MobileStepper { get; set; }
        public Pagination Pagination { get; set; }
        public Search Search { get; set; }
        public Slider Slider { get; set; }
        public Snackbar Snackbar { get; set; }
        public StepProgress StepProgress { get; set; }
        public Table Table { get; set; }
        public Tabs Tabs { get; set; }
        public TextField TextField { get; set; }
        public TimePicker TimePicker { get; set; }
    }

    public class DatePicker
    {
        public A11Y A11Y { get; set; }
        public string DateLabel { get; set; }
        public DatePickerError Error { get; set; }
        public string InputCalendarIconButton { get; set; }
        public string JumpToNextMonth { get; set; }
        public string JumpToNextWeek { get; set; }
        public string JumpToPrevMonth { get; set; }
        public string JumpToPrevWeek { get; set; }
        public string MonthPicker { get; set; }
        public string YearPicker { get; set; }
    }

    public class DatePickerError
    {
        public string InvalidDate { get; set; }
    }

    public class DateRangePicker
    {
        public string EndDate { get; set; }
        public DateRangePickerError Error { get; set; }
        public string NextMonth { get; set; }
        public string PreviousMonth { get; set; }
        public string StartDate { get; set; }
    }

    public class DateRangePickerError
    {
        public string InvalidDate { get; set; }
        public string OutOfRange { get; set; }
        public string OverlappingDates { get; set; }
    }

    public class DayPicker
    {
        public string NavDescription { get; set; }
        public string NextMonth { get; set; }
        public string PreviousMonth { get; set; }
    }

    public class Dialog
    {
        public string Close { get; set; }
    }

    public class Dropdown
    {
        public string All { get; set; }
        public string Intermediate { get; set; }
        public string None { get; set; }
        public string SelectAll { get; set; }
        public string TotalSelected { get; set; }
    }

    public class DropdownTypeahead
    {
        public string Close { get; set; }
        public string Open { get; set; }
    }

    public class HeaderBar
    {
        public string Close { get; set; }
        public string CloseSearch { get; set; }
        public string MegaMenu { get; set; }
        public string OpenSearch { get; set; }
        public string PageItems { get; set; }
        public string Search { get; set; }
    }

    public class Logo
    {
        public string LogoLogo { get; set; }
    }

    public class MasterDetail
    {
        public string BackToLinkLabel { get; set; }
    }

    public class MegaMenu
    {
        public string PoweredBy { get; set; }
        public string Utilities { get; set; }
    }

    public class MobileStepper
    {
        public string A11YLabel { get; set; }
        public string AllStepsCompleted { get; set; }
        public string Step { get; set; }
    }

    public class Pagination
    {
        public string FirstPage { get; set; }
        public string LastPage { get; set; }
        public string NextPage { get; set; }
        public string OfTotalCount { get; set; }
        public string Page { get; set; }
        public string PerPage { get; set; }
        public string PreviousPage { get; set; }
        public string TotalResults { get; set; }
    }

    public class Search
    {
        public CategorySearch CategorySearch { get; set; }
        public string Clear { get; set; }
        public string Close { get; set; }
        public string Loading { get; set; }
        public string Noresult { get; set; }
        public string Open { get; set; }
        public string Placeholder { get; set; }
    }

    public class Slider
    {
        public string Thumb { get; set; }
    }

    public class Snackbar
    {
        public string Undo { get; set; }
    }

    public class StepProgress
    {
        public string A11YLabel { get; set; }
        public string ErrorMessage { get; set; }
        public string ErrorMessageTitle { get; set; }
        public string ErrorOnStepLabel { get; set; }
        public string Errors { get; set; }
        public string Open { get; set; }
    }

    public class Table
    {
        public string Edit { get; set; }
        public string Hide { get; set; }
        public string HideAll { get; set; }
        public string SelectAllRows { get; set; }
        public string SelectionCount { get; set; }
        public string SelectionCountSingle { get; set; }
        public string SelectRow { get; set; }
        public string ShowAll { get; set; }
        public string ShowMore { get; set; }
        public string UnselectAllRows { get; set; }
        public string UnselectRow { get; set; }
    }

    public class Tabs
    {
        public string ScrollButtons { get; set; }
    }

    public class TextField
    {
        public string CharacterCounter { get; set; }
        public string Clear { get; set; }
        public string Hide { get; set; }
        public string HidePassword { get; set; }
        public string Search { get; set; }
        public string Show { get; set; }
        public string ShowPassword { get; set; }
    }

    public class TimePicker
    {
        public string AmPm { get; set; }
        public string Hour { get; set; }
        public string Minute { get; set; }
    }

    #endregion Components

    public class CartMessagesResources
    {
        public string LblContinuingEducation { get; set; }
    }

    public class Footer
    {
        public string FormatText { get; set; }
    }

    public class LayoutResources
    {
        public Component Component { get; set; }
        public Footer Footer { get; set; }
        public string LblClose { get; set; }
        public string LblCollapse { get; set; }
        public string LblCollapseAll { get; set; }
        public string LblDropDownEmptyText { get; set; }
        public string LblError { get; set; }
        public string LblExpand { get; set; }
        public string LblExpandAll { get; set; }
        public string LblLoading { get; set; }
        public string LblNoConnection { get; set; }
        public string LblPageTitleGeneral { get; set; }
        public string LblSelectAll { get; set; }
        public string LblShowLess { get; set; }
        public string LblShowMore { get; set; }
        public string LblSuccessSave { get; set; }
        public NavBarResources NavBar { get; set; }
        public TimeoutNotificationResources TimeoutNotification { get; set; }
    }

    public class NavBarResources
    {
        public UtilityNavResources UtilityNav { get; set; }
    }

    public class NotificationMessagesResources
    {
        public string FormatPermissionRequest { get; set; }
    }

    public class ProfileMenuResources
    {
        public string LblLogOut { get; set; }
        public string LblProfile { get; set; }
    }

    public class TimeoutNotificationResources
    {
        public string BtnExtendSession { get; set; }
        public string FormatNotificationMessage { get; set; }
        public string LblNotificationTitle { get; set; }
    }

    public class UtilityNavResources
    {
        public CartMessagesResources CartMessages { get; set; }
        public string LblCart { get; set; }
        public string LblMegaMenuTitle { get; set; }
        public string LblNotifications { get; set; }
        public string LblProfile { get; set; }
        public NotificationMessagesResources NotificationMessages { get; set; }
        public ProfileMenuResources ProfileMenu { get; set; }
    }
}