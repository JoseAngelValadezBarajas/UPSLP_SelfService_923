// --------------------------------------------------------------------
// <copyright file="RegistrationGroupsViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;

namespace SelfService.Models.RegistrationGroups
{
    /// <summary>
    /// RegistrationGroupDetailViewModel
    /// </summary>
    /// <seealso cref="Hedtech.PowerCampus.Core.DTO.Student.RegistrationGroup" />
    public class RegistrationGroupDetailViewModel : RegistrationGroup
    {
        /// <summary>
        /// Gets or sets a value indicating whether [advisor approval required].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [advisor approval required]; otherwise, <c>false</c>.
        /// </value>
        public bool AdvisorApprovalRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [authorization required].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [authorization required]; otherwise, <c>false</c>.
        /// </value>
        public bool AuthorizationRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [drop approval required].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [drop approval required]; otherwise, <c>false</c>.
        /// </value>
        public bool DropApprovalRequired { get; set; }

        /// <summary>
        /// Gets or sets the end offset.
        /// </summary>
        /// <value>
        /// The end offset.
        /// </value>
        public int EndOffset { get; set; }

        /// <summary>
        /// Gets or sets the end registration date.
        /// </summary>
        /// <value>
        /// The end registration date.
        /// </value>
        public string EndRegistrationDate { get; set; }

        /// <summary>
        /// Gets or sets the end registration hour.
        /// </summary>
        /// <value>
        /// The end registration hour.
        /// </value>
        public int EndRegistrationHour { get; set; }

        /// <summary>
        /// Gets or sets the end registration minute.
        /// </summary>
        /// <value>
        /// The end registration minute.
        /// </value>
        public int EndRegistrationMinute { get; set; }

        /// <summary>
        /// Gets or sets the end type of the registration.
        /// </summary>
        /// <value>
        /// The end type of the registration.
        /// </value>
        public string EndRegistrationType { get; set; }

        /// <summary>
        /// Gets or sets the name of the group view.
        /// </summary>
        /// <value>
        /// The name of the group view.
        /// </value>
        public string GroupViewName { get; set; }

        /// <summary>
        /// Gets or sets the start offset.
        /// </summary>
        /// <value>
        /// The start offset.
        /// </value>
        public int StartOffset { get; set; }

        /// <summary>
        /// Gets or sets the start registration date.
        /// </summary>
        /// <value>
        /// The start registration date.
        /// </value>
        public string StartRegistrationDate { get; set; }

        /// <summary>
        /// Gets or sets the start registration hour.
        /// </summary>
        /// <value>
        /// The start registration hour.
        /// </value>
        public int StartRegistrationHour { get; set; }

        /// <summary>
        /// Gets or sets the start registration minute.
        /// </summary>
        /// <value>
        /// The start registration minute.
        /// </value>
        public int StartRegistrationMinute { get; set; }

        /// <summary>
        /// Gets or sets the start type of the registration.
        /// </summary>
        /// <value>
        /// The start type of the registration.
        /// </value>
        public string StartRegistrationType { get; set; }
    }
}