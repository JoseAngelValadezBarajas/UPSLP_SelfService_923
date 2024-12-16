// --------------------------------------------------------------------
// <copyright file="SectionFeeViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Course;

namespace SelfService.Models.Section
{
    /// <summary>
    /// Class CourseFeeViewModel.
    /// </summary>
    public class SectionFeeViewModel : CourseFeeViewModel
    {
        /// <summary>
        /// Gets or sets the fee group description.
        /// </summary>
        /// <value>
        /// The fee group description.
        /// </value>
        public string FeeGroupDescription { get; set; }

        /// <summary>
        /// Gets or sets the fee group identifier.
        /// </summary>
        /// <value>
        /// The fee group identifier.
        /// </value>
        public string FeeGroupId { get; set; }
    }
}