// --------------------------------------------------------------------
// <copyright file="DateTimeFormatModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Setting
{
    /// <summary>
    /// The Datetime format model
    /// </summary>
    public class DateTimeFormatModel
    {
        /// <summary>
        /// Gets or sets the am designator.
        /// </summary>
        /// <value>
        /// The am designator.
        /// </value>
        public string AMDesignator { get; set; }

        /// <summary>
        /// Gets or sets the first day of week.
        /// </summary>
        /// <value>
        /// The first day of week.
        /// </value>
        public string FirstDayOfWeek { get; set; }

        /// <summary>
        /// Gets or sets the long date example.
        /// </summary>
        /// <value>
        /// The long date example.
        /// </value>
        public string LongDateExample { get; set; }

        /// <summary>
        /// Gets or sets the long date pattern.
        /// </summary>
        /// <value>
        /// The long date pattern.
        /// </value>
        public string LongDatePattern { get; set; }

        /// <summary>
        /// Gets or sets the long time example.
        /// </summary>
        /// <value>
        /// The long time example.
        /// </value>
        public string LongTimeExample { get; set; }

        /// <summary>
        /// Gets or sets the long time pattern.
        /// </summary>
        /// <value>
        /// The long time pattern.
        /// </value>
        public string LongTimePattern { get; set; }

        /// <summary>
        /// Gets or sets the pm designator.
        /// </summary>
        /// <value>
        /// The pm designator.
        /// </value>
        public string PMDesignator { get; set; }

        /// <summary>
        /// Gets or sets the short date example.
        /// </summary>
        /// <value>
        /// The short date example.
        /// </value>
        public string ShortDateExample { get; set; }

        /// <summary>
        /// Gets or sets the short date pattern.
        /// </summary>
        /// <value>
        /// The short date pattern.
        /// </value>
        public string ShortDatePattern { get; set; }

        /// <summary>
        /// Gets or sets the short time example.
        /// </summary>
        /// <value>
        /// The short time example.
        /// </value>
        public string ShortTimeExample { get; set; }

        /// <summary>
        /// Gets or sets the short time pattern.
        /// </summary>
        /// <value>
        /// The short time pattern.
        /// </value>
        public string ShortTimePattern { get; set; }
    }
}