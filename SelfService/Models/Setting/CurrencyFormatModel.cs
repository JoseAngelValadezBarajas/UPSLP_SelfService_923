// --------------------------------------------------------------------
// <copyright file="CurrencyFormatModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Setting
{
    /// <summary>
    /// The currency format model
    /// </summary>
    public class CurrencyFormatModel
    {
        /// <summary>
        /// Gets or sets the decimal digits.
        /// </summary>
        /// <value>
        /// The decimal digits.
        /// </value>
        public int DecimalDigits { get; set; }

        /// <summary>
        /// Gets or sets the decimal separator.
        /// </summary>
        /// <value>
        /// The decimal separator.
        /// </value>
        public string DecimalSeparator { get; set; }

        /// <summary>
        /// Gets or sets the group separator.
        /// </summary>
        /// <value>
        /// The group separator.
        /// </value>
        public string GroupSeparator { get; set; }

        /// <summary>
        /// Gets or sets the negative pattern.
        /// </summary>
        /// <value>
        /// The negative pattern.
        /// </value>
        public string NegativePattern { get; set; }

        /// <summary>
        /// Gets or sets the positive pattern.
        /// </summary>
        /// <value>
        /// The positive pattern.
        /// </value>
        public string PositivePattern { get; set; }

        /// <summary>
        /// Gets or sets the symbol.
        /// </summary>
        /// <value>
        /// The symbol.
        /// </value>
        public string Symbol { get; set; }

        /// <summary>
        /// Gets or sets the symbol description.
        /// </summary>
        /// <value>
        /// The symbol description.
        /// </value>
        public string SymbolDescription { get; set; }
    }
}