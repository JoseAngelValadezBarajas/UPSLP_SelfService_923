// --------------------------------------------------------------------
// <copyright file="FormLayoutModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Forms
{
    /// <summary>
    /// FormLayoutModel class
    /// </summary>
    public class FormLayoutModel
    {
        /// <summary>
        /// Gets or sets the application setup form layout.
        /// </summary>
        /// <value>
        /// The application setup form layout.
        /// </value>
        public AppSetupFormViewModel AppSetupFormLayout { get; set; }

        /// <summary>
        /// Gets or sets the type of the form.
        /// </summary>
        /// <value>
        /// The type of the form.
        /// </value>
        public int FormType { get; set; }
    }
}