// --------------------------------------------------------------------
// <copyright file="CartItemViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Section
{
    /// <summary>
    /// CartItemType enum
    /// </summary>
    public enum CartItemType
    {
        Traditional = 0,
        ContinuingEducation = 1
    }

    /// <summary>
    /// CartItemViewModel
    /// </summary>
    public class CartItemViewModel
    {
        /// <summary>
        /// Gets or sets the count.
        /// </summary>
        /// <value>
        /// The count.
        /// </value>
        public int Count { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public CartItemType Type { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        /// <value>
        /// The value.
        /// </value>
        public string Value { get; set; }
    }
}