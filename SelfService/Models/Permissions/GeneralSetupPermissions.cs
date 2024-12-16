// --------------------------------------------------------------------
// <copyright file="GeneralSetupPermissions.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    /// <summary>
    /// GeneralSetupPermissions
    /// </summary>
    public class GeneralSetupPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether [Checklist] is available.
        /// </summary>
        /// <value>
        ///   <c>true</c> if checklist; otherwise, <c>false</c>.
        /// </value>
        public bool Checklist { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [dashboard messages].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [dashboard messages]; otherwise, <c>false</c>.
        /// </value>
        public bool DashboardMessages { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [Dossier] is available.
        /// </summary>
        /// <value>
        ///   <c>true</c> if dossier is available; otherwise, <c>false</c>.
        /// </value>
        public bool Dossier { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [period filters].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [period filters]; otherwise, <c>false</c>.
        /// </value>
        public bool PeriodFilters { get; set; }
    }
}