// --------------------------------------------------------------------
// <copyright file="ApplicationAttachmentTotalsViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Forms
{
    public class ApplicationAttachmentTotalsViewModel
    {
        /// <summary>
        /// Gets or sets the application identifier.
        /// </summary>
        /// <value>The application identifier.</value>
        public int ApplicationId { get; set; }

        /// <summary>
        /// Gets or sets the total size of the attachment.
        /// </summary>
        /// <value>The total size of the attachment.</value>
        public string TotalAttachmentSize { get; set; }

        /// <summary>
        /// Gets or sets the total attachment size number.
        /// </summary>
        /// <value>The total attachment size number.</value>
        public decimal TotalAttachmentSizeNumber { get; set; }

        /// <summary>
        /// Gets or sets the total number of attachments.
        /// </summary>
        /// <value>The total number of attachments.</value>
        public int TotalNumberOfAttachments { get; set; }
    }
}