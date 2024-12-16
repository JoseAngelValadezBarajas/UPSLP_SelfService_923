// --------------------------------------------------------------------
// <copyright file="NumberFormatModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Setting
{
    /// <summary>
    /// The number format model
    /// </summary>
    public class NumberFormatModel
    {
        /// <summary>
        /// Gets or sets the digit grouping.
        /// </summary>
        /// <value>
        /// The digit grouping.
        /// </value>
        public string DigitGrouping { get; set; }

        /// <summary>
        /// Gets or sets the display leading zeros.
        /// </summary>
        /// <value>
        /// The display leading zeros.
        /// </value>
        public string DisplayLeadingZeros { get; set; }

        /// <summary>
        /// Gets or sets the list separator.
        /// </summary>
        /// <value>
        /// The list separator.
        /// </value>
        public string ListSeparator { get; set; }

        /// <summary>
        /// Gets or sets the negative number format.
        /// </summary>
        /// <value>
        /// The negative number format.
        /// </value>
        public string NegativeNumberFormat { get; set; }

        /// <summary>
        /// Gets or sets the negative sign.
        /// </summary>
        /// <value>
        /// The negative sign.
        /// </value>
        public string NegativeSign { get; set; }

        /// <summary>
        /// Gets or sets the number decimal digits.
        /// </summary>
        /// <value>
        /// The number decimal digits.
        /// </value>
        public int NumberDecimalDigits { get; set; }

        /// <summary>
        /// Gets or sets the number decimal separator.
        /// </summary>
        /// <value>
        /// The number decimal separator.
        /// </value>
        public string NumberDecimalSeparator { get; set; }

        /// <summary>
        /// Gets or sets the number group separator.
        /// </summary>
        /// <value>
        /// The number group separator.
        /// </value>
        public string NumberGroupSeparator { get; set; }
    }
}