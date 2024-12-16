// <copyright file="WebsiteSetupPermissions.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    public class WebsiteSetupPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether [email provider].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [email provider]; otherwise, <c>false</c>.
        /// </value>
        public bool EmailProvider { get; set; }

        /// <summary>
        /// Get or sets the permission for the NameFormatCategories tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </value>
        public bool NameFormatCategories { get; set; }

        /// <summary>
        /// Get or sets the permission for the NameFormats tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </value>
        public bool NameFormats { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [payment provider].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [payment provider]; otherwise, <c>false</c>.
        /// </value>
        public bool PaymentProvider { get; set; }

        /// <summary>
        /// Get or sets the permission for the PermissionStore tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </summary>
        public bool PermissionStore { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [re captcha].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [re captcha]; otherwise, <c>false</c>.
        /// </value>
        public bool ReCaptcha { get; set; }

        /// <summary>
        /// Get or sets the permission for the CourseMaterials tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </summary>
        public bool CourseMaterials { get; set; }

        /// <summary>
        /// Get or sets the permission for the SiteSettings tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </summary>
        public bool SiteSettings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [system formats].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [system formats]; otherwise, <c>false</c>.
        /// </value>
        public bool SystemFormats { get; set; }

        /// <summary>
        /// Get or sets the permission for the SystemInformation tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </summary>
        public bool SystemInformation { get; set; }

        /// <summary>
        /// Gets or sets the permission for the theme tab.
        /// </summary>
        /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </value>
        public bool Theme { get; set; }
    }
}