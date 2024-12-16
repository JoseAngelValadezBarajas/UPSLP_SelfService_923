// --------------------------------------------------------------------
// <copyright file="AdviseeClaimSettingsModel.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeViewModel
    /// </summary>
    public class AdviseeClaimSettingModel
    {
        /// <summary>
        /// Gets or sets the email setting.
        /// </summary>
        /// <value>
        /// The email setting.
        /// </value>
        public EmailSettingsViewModel EmailSettings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has attendance claim.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has attendance claim; otherwise, <c>false</c>.
        /// </value>
        public bool HasAttendanceClaim { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="MyAdviseesListViewModel"/> is dossier.
        /// </summary>
        /// <value>
        ///   <c>true</c> if dossier; otherwise, <c>false</c>.
        /// </value>
        public bool HasDossierClaim { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has grade report claim.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has grade report claim; otherwise, <c>false</c>.
        /// </value>
        public bool HasGradeReportClaim { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="MyAdviseesListViewModel"/> is profile.
        /// </summary>
        /// <value>
        ///   <c>true</c> if profile; otherwise, <c>false</c>.
        /// </value>
        public bool HasProfileClaim { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has schedule claim.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has schedule claim; otherwise, <c>false</c>.
        /// </value>
        public bool HasScheduleClaim { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has schedule requests claim.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has schedule requests claim; otherwise, <c>false</c>.
        /// </value>
        public bool HasScheduleRequestsClaim { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has share claim.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has share claim; otherwise, <c>false</c>.
        /// </value>
        public bool HasShareClaim { get; set; }
    }
}