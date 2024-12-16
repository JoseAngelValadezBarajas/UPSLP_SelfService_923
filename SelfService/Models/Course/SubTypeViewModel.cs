// --------------------------------------------------------------------
// <copyright file="SubTypeViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Course
{
    /// <summary>
    /// Class SubTypeViewModel.
    /// </summary>
    public class SubTypeViewModel
    {
        /// <summary>
        /// Gets or sets the code.
        /// </summary>
        /// <value>The code.</value>
        public string Code { get; set; }

        /// <summary>
        /// Gets or sets the corequisite condition.
        /// </summary>
        /// <value>The corequisite condition.</value>
        public string CorequisiteCondition { get; set; }

        /// <summary>
        /// Gets or sets the corequisite list.
        /// </summary>
        /// <value>The corequisite list.</value>
        public List<CorequisiteViewModel> CorequisiteList { get; set; }

        /// <summary>
        /// Gets or sets the course catalog code.
        /// </summary>
        /// <value>The course catalog code.</value>
        public string CourseCatalogCode { get; set; }

        /// <summary>
        /// Gets or sets the course fee condition.
        /// </summary>
        /// <value>The course fee condition.</value>
        public string CourseFeeCondition { get; set; }

        /// <summary>
        /// Gets or sets the course fee list.
        /// </summary>
        /// <value>The course fee list.</value>
        public List<CourseFeeViewModel> CourseFeeList { get; set; }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>The credits.</value>
        public string Credits { get; set; }

        /// <summary>
        /// Gets or sets the credit type condition.
        /// </summary>
        /// <value>The credit type condition.</value>
        public string CreditTypeCondition { get; set; }

        /// <summary>
        /// Gets or sets the credit type list.
        /// </summary>
        /// <value>The credit type list.</value>
        public List<CreditTypeViewModel> CreditTypeList { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>The description.</value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>The name.</value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the prerequisite condition.
        /// </summary>
        /// <value>The prerequisite condition.</value>
        public string PrerequisiteCondition { get; set; }

        /// <summary>
        /// Gets or sets the prerequisite list.
        /// </summary>
        /// <value>The prerequisite list.</value>
        public List<PrerequisiteViewModel> PrerequisiteList { get; set; }

        /// <summary>
        /// Gets or sets the sort order.
        /// </summary>
        /// <value>The sort order.</value>
        public int SortOrder { get; set; }
    }
}