// --------------------------------------------------------------------
// <copyright file="StudentSetupPermissions.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    public class StudentSetupPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="GeneralSetupPermissions"/> is agreements.
        /// </summary>
        /// <value>
        ///   <c>true</c> if agreements; otherwise, <c>false</c>.
        /// </value>
        public bool Agreements { get; set; }

        /// <summary>
        /// Gets a value indicating whether [block registration].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [block registration]; otherwise, <c>false</c>.
        /// </value>
        public bool BlockRegistration { get; internal set; }

        /// <summary>
        /// Gets a value indicating whether [block registration blocks].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [block registration blocks]; otherwise, <c>false</c>.
        /// </value>
        public bool BlockRegistrationBlocks { get; internal set; }

        /// <summary>
        /// Gets a value indicating whether [block registration rules].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [block registration rules]; otherwise, <c>false</c>.
        /// </value>
        public bool BlockRegistrationRules { get; internal set; }

        /// <summary>
        /// Get or sets the permission for the FinancialSettings tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </value>
        public bool FinancialSettings { get; set; }

        /// <summary>
        /// Get or sets the permission for the GradeMappings tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </summary>
        public bool GradeMappings { get; set; }

        /// <summary>
        /// Get or sets the permission for the RegistrationGroups tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </summary>
        public bool RegistrationGroups { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [settings1098 t].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [settings1098 t]; otherwise, <c>false</c>.
        /// </value>
        public bool Settings1098T { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [shared access].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [shared access]; otherwise, <c>false</c>.
        /// </value>
        public bool SharedAccess { get; set; }

        /// <summary>
        /// Get or sets the permission for the StudentRecords tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </value>
        public bool StudentRecords { get; set; }

        /// <summary>
        /// Get or sets the permission for the TraditionalDefaults tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </value>
        public bool TraditionalDefaults { get; set; }

        /// <summary>
        /// Get or sets the permission for the TraditionalRegistration tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </value>
        public bool TraditionalRegistration { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [transcript request].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [transcript request]; otherwise, <c>false</c>.
        /// </value>
        public bool TranscriptRequest { get; set; }
    }
}