// --------------------------------------------------------------------
// <copyright file="AdviseesListViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Downloads;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeViewModel
    /// </summary>
    public class AdviseeViewModel : AvatarViewModel
    {
        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [HasStoplist].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [HasStoplist]; otherwise, <c>false</c>.
        /// </value>
        public bool HasStopList { get; set; }
    }

    #region Authorize Registration

    /// <summary>
    /// AdviseeAuthorizeViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Advisees.AdviseeViewModel" />
    public class AdviseeAuthorizeViewModel : AdviseeViewModel
    {
        /// <summary>
        /// Gets or sets the registration authorization identifier.
        /// </summary>
        /// <value>
        /// The registration authorization identifier.
        /// </value>
        public int? RegistrationAuthorizationId { get; set; }
    }

    /// <summary>
    /// AuthorizeRegistrationListViewModel
    /// </summary>
    public class AuthorizeRegistrationListViewModel
    {
        /// <summary>
        /// Gets or sets the advisees.
        /// </summary>
        /// <value>
        /// The advisees.
        /// </value>
        public List<AdviseeAuthorizeViewModel> Advisees { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has dossier claim.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has dossier claim; otherwise, <c>false</c>.
        /// </value>
        public bool HasDossierClaim { get; set; }

        /// <summary>
        /// Gets or sets the mail separator.
        /// </summary>
        /// <value>
        /// The mail separator.
        /// </value>
        public string MailSeparator { get; set; }

        /// <summary>
        /// Gets or sets the mail to URL.
        /// </summary>
        /// <value>
        /// The mail to URL.
        /// </value>
        public string MailToUrl { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }
    }

    #endregion Authorize Registration

    #region My Advisees

    /// <summary>
    /// AdviseeDownloadViewModel
    /// </summary>
    public class AdviseeDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the advisees.
        /// </summary>
        /// <value>
        /// The advisees.
        /// </value>
        public List<AdviseesDownloadViewModel> Advisees { get; set; }

        /// <summary>
        /// Gets or sets the resources.
        /// </summary>
        /// <value>
        /// The resources.
        /// </value>
        public ManageAdviseesResources Resources { get; set; }
    }

    /// <summary>
    /// AdviseesDownloadViewModel
    /// </summary>
    public class AdviseesDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the has pending schedules.
        /// </summary>
        /// <value>
        /// The has pending schedules.
        /// </value>
        public string HasPendingSchedules { get; set; }

        /// <summary>
        /// Gets or sets the has stoplist.
        /// </summary>
        /// <value>
        /// The has stoplist.
        /// </value>
        public string HasStoplist { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }
    }

    /// <summary>
    /// AdviseesListViewModel
    /// </summary>
    public class MyAdviseesListViewModel
    {
        /// <summary>
        /// Gets or sets the Advisees
        /// </summary>
        /// <value>
        /// The Advisees.
        /// </value>
        public List<MyAdviseeViewModel> Advisees { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show attendance warning].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show attendance warning]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowAttendanceWarning { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show attendance warning].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show attendance warning]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowGradesWarning { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show violation warning].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show violation warning]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowViolationWarning { get; set; }
    }

    /// <summary>
    /// MyAdviseeViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Advisees.MyAdviseeViewModel" />
    public class MyAdviseeViewModel : AdviseeViewModel
    {
        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public new string Email { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [HasPendingSchedules].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [HasPendingSchedules]; otherwise, <c>false</c>.
        /// </value>
        public bool HasPendingSchedules { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [IsSharedAdvisee].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [IsSharedAdvisee]; otherwise, <c>false</c>.
        /// </value>
        public bool IsSharedAdvisee { get; set; }
    }

    #endregion My Advisees
}