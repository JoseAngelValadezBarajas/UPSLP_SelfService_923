// --------------------------------------------------------------------
// <copyright file="SavedApplicationViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Forms
{
    public class ApplicationAttachmentViewModel
    {
        /// <summary>
        /// Gets or sets the application attachment identifier.
        /// </summary>
        /// <value>
        /// The application attachment identifier.
        /// </value>
        public int ApplicationAttachmentId { get; set; }

        /// <summary>
        /// Gets or sets the attachment title.
        /// </summary>
        /// <value>
        /// The attachment title.
        /// </value>
        public string AttachmentTitle { get; set; }

        /// <summary>
        /// Gets or sets the extension.
        /// </summary>
        /// <value>
        /// The extension.
        /// </value>
        public string Extension { get; set; }

        /// <summary>
        /// Gets or sets the size of the file.
        /// </summary>
        /// <value>
        /// The size of the file.
        /// </value>
        public string FileSize { get; set; }
    }
}