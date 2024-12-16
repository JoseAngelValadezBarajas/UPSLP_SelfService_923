// --------------------------------------------------------------------
// <copyright file="SavedApplicationViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System;

namespace SelfService.Models.Forms
{
    public class SavedApplicationViewModel
    {
        /// <summary>
        /// Gets or sets the application form description.
        /// </summary>
        /// <value>
        /// The application form description.
        /// </value>
        public string ApplicationFormDescription { get; set; }

        /// <summary>
        /// Gets or sets the name of the application form.
        /// </summary>
        /// <value>
        /// The name of the application form.
        /// </value>
        public string ApplicationFormName { get; set; }

        /// <summary>
        /// Gets or sets the create datetime.
        /// </summary>
        /// <value>
        /// The create datetime.
        /// </value>
        public string CreateDatetime { get; set; }

        /// <summary>
        /// Gets or sets the revision datetime.
        /// </summary>
        /// <value>
        /// The revision datetime.
        /// </value>
        public string RevisionDatetime { get; set; }

        /// <summary>
        /// Gets or sets the saved application identifier.
        /// </summary>
        /// <value>
        /// The saved application identifier.
        /// </value>
        public int? SavedApplicationId { get; set; }

        /// <summary>
        /// Gets or sets the token.
        /// </summary>
        /// <value>The token.</value>
        public Guid? Token { get; set; }
    }
}