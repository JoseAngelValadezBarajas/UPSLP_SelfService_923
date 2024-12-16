// --------------------------------------------------------------------
// <copyright file="UserInterfaceHelper.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Navigation;

namespace SelfService.Helpers
{
    internal static class ValidationHelper
    {
        /// <summary>
        /// Determines whether [is valid resource] [the specified site map page].
        /// </summary>
        /// <param name="siteMapPage">The site map page.</param>
        /// <returns>
        ///   <c>true</c> if [is valid resource] [the specified site map page]; otherwise, <c>false</c>.
        /// </returns>
        internal static bool IsValidResource(SiteMapPage siteMapPage)
        {
            if (siteMapPage is null || string.IsNullOrEmpty(siteMapPage.IdModule) || string.IsNullOrEmpty(siteMapPage.IdPage))
                return false;

            bool result = false;
            switch (siteMapPage.IdModule)
            {
                case "Account":
                    result = siteMapPage.IdPage.Equals("MyProfile")
                        || siteMapPage.IdPage.Equals("AccountMain")
                        || siteMapPage.IdPage.Equals("AddressesMain")
                        || siteMapPage.IdPage.Equals("DemographicMain")
                        || siteMapPage.IdPage.Equals("EthnicityMain")
                        || siteMapPage.IdPage.Equals("PhoneNumberMain")
                        || siteMapPage.IdPage.Equals("PreferredNameMain")
                        || siteMapPage.IdPage.Equals("ProfileMain")
                        || siteMapPage.IdPage.Equals("SharedAccessMain");
                    break;

                case "Administration":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("AddressRequests")
                        || siteMapPage.IdPage.Equals("Agreements")
                        || siteMapPage.IdPage.Equals("ApplicationSetup")
                        || siteMapPage.IdPage.Equals("BlockRegistration")
                        || siteMapPage.IdPage.Equals("Block")
                        || siteMapPage.IdPage.Equals("BlockList")
                        || siteMapPage.IdPage.Equals("Rule")
                        || siteMapPage.IdPage.Equals("ConEdSetup")
                        || siteMapPage.IdPage.Equals("ConEdDefaults")
                        || siteMapPage.IdPage.Equals("ConEdRegistration")
                        || siteMapPage.IdPage.Equals("DonationsSetup")
                        || siteMapPage.IdPage.Equals("DashboardMessages")
                        || siteMapPage.IdPage.Equals("DemographicRequests")
                        || siteMapPage.IdPage.Equals("DossierSetup")
                        || siteMapPage.IdPage.Equals("FacultyPages")
                        || siteMapPage.IdPage.Equals("FinancialSettings")
                        || siteMapPage.IdPage.Equals("Form")
                        || siteMapPage.IdPage.Equals("FormsSetup")
                        || siteMapPage.IdPage.Equals("GeneralSetup")
                        || siteMapPage.IdPage.Equals("GlobalSettings")
                        || siteMapPage.IdPage.Equals("InquirySetup")
                        || siteMapPage.IdPage.Equals("InstructorSetup")
                        || siteMapPage.IdPage.Equals("LayoutList")
                        || siteMapPage.IdPage.Equals("EmailProvider")
                        || siteMapPage.IdPage.Equals("GiftBatchDefaults")
                        || siteMapPage.IdPage.Equals("NameFormatCategories")
                        || siteMapPage.IdPage.Equals("NameFormats")
                        || siteMapPage.IdPage.Equals("NamePart")
                        || siteMapPage.IdPage.Equals("NotificationEvents")
                        || siteMapPage.IdPage.Equals("NotificationsSetup")
                        || siteMapPage.IdPage.Equals("PaymentProvider")
                        || siteMapPage.IdPage.Equals("PeriodsFilters")
                        || siteMapPage.IdPage.Equals("ProfileSetup")
                        || siteMapPage.IdPage.Equals("RegistrationGroups")
                        || siteMapPage.IdPage.Equals("RequestsSetup")
                        || siteMapPage.IdPage.Equals("Settings1098T")
                        || siteMapPage.IdPage.Equals("SharedAccess")
                        || siteMapPage.IdPage.Equals("StudentRecords")
                        || siteMapPage.IdPage.Equals("StudentSetup")
                        || siteMapPage.IdPage.Equals("SystemInformation")
                        || siteMapPage.IdPage.Equals("Theme")
                        || siteMapPage.IdPage.Equals("TraditionalDefaults")
                        || siteMapPage.IdPage.Equals("TraditionalRegistration")
                        || siteMapPage.IdPage.Equals("TranscriptRequest")
                        || siteMapPage.IdPage.Equals("WebsiteSetup");
                    break;

                case "Admissions":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("Applications")
                        || siteMapPage.IdPage.Equals("Inquiries")
                        || siteMapPage.IdPage.Equals("ApplicationForm")
                        || siteMapPage.IdPage.Equals("InquiryForm");
                    break;

                case "Advising":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("AdvisorApproval")
                        || siteMapPage.IdPage.Equals("AuthorizeAdvisees")
                        || siteMapPage.IdPage.Equals("ManageAdvisees")
                        || siteMapPage.IdPage.Equals("SharedAdvisees")
                        || siteMapPage.IdPage.Equals("AdviseeProfile");
                    break;

                case "Checklist":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("MyTasksMain")
                        || siteMapPage.IdPage.Equals("MyTasks");
                    break;

                case "Classes":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("ActivitiesSetup")
                        || siteMapPage.IdPage.Equals("ActivityGrades")
                        || siteMapPage.IdPage.Equals("Alerts")
                        || siteMapPage.IdPage.Equals("Attendance")
                        || siteMapPage.IdPage.Equals("ClassList")
                        || siteMapPage.IdPage.Equals("CourseManagementMain")
                        || siteMapPage.IdPage.Equals("DailyAttendance")
                        || siteMapPage.IdPage.Equals("FacultyCourseManagement")
                        || siteMapPage.IdPage.Equals("FacultySchedule")
                        || siteMapPage.IdPage.Equals("GradeMappings")
                        || siteMapPage.IdPage.Equals("OverallGrades")
                        || siteMapPage.IdPage.Equals("PermissionRequests")
                        || siteMapPage.IdPage.Equals("Waitlist")
                        || siteMapPage.IdPage.Equals("ManageAssistants");
                    break;

                case "ContinuingEducation":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("ConEdCourses");
                    break;

                case "Department":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("SetupApprovals")
                        || siteMapPage.IdPage.Equals("ApproveGrades")
                        || siteMapPage.IdPage.Equals("CourseTemplates")
                        || siteMapPage.IdPage.Equals("CourseManagement");
                    break;

                case "Errors":
                    result = siteMapPage.IdPage.Equals("Error400")
                            || siteMapPage.IdPage.Equals("Error401")
                            || siteMapPage.IdPage.Equals("Error403")
                            || siteMapPage.IdPage.Equals("Error404")
                            || siteMapPage.IdPage.Equals("Error500")
                            || siteMapPage.IdPage.Equals("Error503")
                            || siteMapPage.IdPage.Equals("ExpiredInvitation")
                            || siteMapPage.IdPage.Equals("InvalidInvitation")
                            || siteMapPage.IdPage.Equals("InvalidToken");
                    break;

                case "Finances":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("FinancialAid")
                        || siteMapPage.IdPage.Equals("FinancialAidMain")
                        || siteMapPage.IdPage.Equals("Form1098T")
                        || siteMapPage.IdPage.Equals("Balance")
                        || siteMapPage.IdPage.Equals("BalanceMain")
                        || siteMapPage.IdPage.Equals("Statement");
                    break;

                case "General":
                    result = siteMapPage.IdPage.Equals("UICulture");
                    break;

                case "Generic":
                    result = siteMapPage.IdPage.Equals("AgreementModal")
                        || siteMapPage.IdPage.Equals("CompleteProfileModal")
                        || siteMapPage.IdPage.Equals("Dossier")
                        || siteMapPage.IdPage.Equals("DownloadModal")
                        || siteMapPage.IdPage.Equals("FailedPaymentModal")
                        || siteMapPage.IdPage.Equals("PasswordConfirmation")
                        || siteMapPage.IdPage.Equals("PaymentDetailModal")
                        || siteMapPage.IdPage.Equals("PeopleSearchModal")
                        || siteMapPage.IdPage.Equals("ProcessPaymentModal")
                        || siteMapPage.IdPage.Equals("SignIn")
                        || siteMapPage.IdPage.Equals("SignUp")
                        || siteMapPage.IdPage.Equals("StopList")
                        || siteMapPage.IdPage.Equals("SuccessfulPaymentModal");
                    break;

                case "Grades":
                    result = siteMapPage.IdPage.Equals("GradeReport")
                        || siteMapPage.IdPage.Equals("GradeReportMain")
                        || siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("UnofficialTranscript")
                        || siteMapPage.IdPage.Equals("UnofficialTranscriptMain")
                        || siteMapPage.IdPage.Equals("RequestTranscript")
                        || siteMapPage.IdPage.Equals("AlertReport")
                        || siteMapPage.IdPage.Equals("AttendanceReport");
                    break;

                case "Home":
                    result = siteMapPage.IdPage.Equals("AccountConfirmation")
                        || siteMapPage.IdPage.Equals("Dashboard")
                        || siteMapPage.IdPage.Equals("LogIn")
                        || siteMapPage.IdPage.Equals("RecoverPassword")
                        || siteMapPage.IdPage.Equals("SignOutConfirmation");
                    break;

                case "MakeGift":
                    result = siteMapPage.IdPage.Equals("Menu") ||
                        siteMapPage.IdPage.Equals("MakeGift") ||
                        siteMapPage.IdPage.Equals("PersonalInformationModal");
                    break;

                case "Planning":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("DegreeRequirements")
                        || siteMapPage.IdPage.Equals("TransferCourseEquivalencies");
                    break;

                case "Registration":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("AcademicPlan")
                        || siteMapPage.IdPage.Equals("AcademicPlanMain")
                        || siteMapPage.IdPage.Equals("Courses")
                        || siteMapPage.IdPage.Equals("Schedule")
                        || siteMapPage.IdPage.Equals("StudentSchedule")
                        || siteMapPage.IdPage.Equals("ValidationMessages")
                        || siteMapPage.IdPage.Equals("WhatIf")
                        || siteMapPage.IdPage.Equals("WhatIfMain");
                    break;

                case "Search":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("Section")
                        || siteMapPage.IdPage.Equals("Course");
                    break;

                case "Server":
                    result = siteMapPage.IdPage.Equals("DegReqs")
                        || siteMapPage.IdPage.Equals("PaymentModal");
                    break;

                case "Shared":
                    result = siteMapPage.IdPage.Equals("MainMenu");
                    break;

                case "SharedAccess":
                    result = siteMapPage.IdPage.Equals("Menu")
                        || siteMapPage.IdPage.Equals("Students")
                        || siteMapPage.IdPage.Equals("StudentProfile");
                    break;

                default:
                    break;
            }
            return result;
        }

        /// <summary>
        /// Validates the govt identifier format.
        /// </summary>
        /// <param name="governmentIdFormat">The government identifier format.</param>
        /// <param name="maskLength">Length of the mask.</param>
        /// <returns></returns>
        internal static bool ValidateGovtIdFormat(string governmentIdFormat, int? maskLength)
            => CompareIdLengthWithoutSeparators(governmentIdFormat, (int)maskLength);

        /// <summary>
        /// Validates the identifier format.
        /// </summary>
        /// <param name="peopleIdFormat">The people identifier format.</param>
        /// <returns></returns>
        internal static bool ValidateIdFormat(string peopleIdFormat)
        {
            int poundCount = 0;
            if (peopleIdFormat.Length >= 9)
            {
                for (int i = 0; i < peopleIdFormat.Length; i++)
                {
                    if (peopleIdFormat[i] is '#' or 'X')
                        poundCount++;
                }
            }
            return poundCount == 9;
        }

        #region Private Methods

        /// <summary>
        /// Compares the identifier length without separators.
        /// </summary>
        /// <param name="currentId">The current identifier.</param>
        /// <param name="expectedLength">The expected length.</param>
        /// <returns></returns>
        private static bool CompareIdLengthWithoutSeparators(string currentId, int expectedLength)
        {
            int maskCharCount = 0;
            if (currentId.Length >= maskCharCount)
            {
                for (int i = 0; i < currentId.Length; i++)
                    if (currentId[i] is '#' or 'X') maskCharCount++;
            }
            return maskCharCount == expectedLength;
        }

        #endregion Private Methods
    }
}