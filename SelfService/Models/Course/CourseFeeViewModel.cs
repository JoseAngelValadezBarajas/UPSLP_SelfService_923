// --------------------------------------------------------------------
// <copyright file="CourseFeeViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Course
{
    /// <summary>
    /// Class CourseFeeViewModel.
    /// </summary>
    public class CourseFeeViewModel
    {
        /// <summary>
        /// Gets or sets the code.
        /// </summary>
        /// <value>The code.</value>
        public string Amount { get; set; }

        /// <summary>
        /// Gets or sets the charge description.
        /// </summary>
        /// <value>The charge description.</value>
        public string ChargeDescription { get; set; }

        /// <summary>
        /// Gets or sets the type of the fee.
        /// </summary>
        /// <value>The type of the fee.</value>
        public string FeeType { get; set; }
    }
}