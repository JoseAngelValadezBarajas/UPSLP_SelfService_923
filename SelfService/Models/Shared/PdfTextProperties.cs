// --------------------------------------------------------------------
// <copyright file="PdfTextProperties.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Shared
{
    /// <summary>
    /// PdfTextProperties
    /// </summary>
    public class PdfTextProperties
    {
        /// <summary>
        /// Gets or sets the PDF text font.
        /// </summary>
        /// <value>
        /// The PDF text font.
        /// </value>
        public string Font { get; set; }

        /// <summary>
        /// Gets or sets the size of the PDF text font.
        /// </summary>
        /// <value>
        /// The size of the PDF text font.
        /// </value>
        public int FontSize { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [PDF text bold].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [PDF text bold]; otherwise, <c>false</c>.
        /// </value>
        public bool FontStyle { get; set; }

        /// <summary>
        /// Gets or sets the PDF text orientation.
        /// </summary>
        /// <value>
        /// The PDF text orientation.
        /// </value>
        public int Orientation { get; set; }

        /// <summary>
        /// Gets or sets the PDF page number.
        /// </summary>
        /// <value>
        /// The PDF page number.
        /// </value>
        public int PageNumber { get; set; }

        /// <summary>
        /// Gets or sets the PDF text.
        /// </summary>
        /// <value>
        /// The PDF text.
        /// </value>
        public string Text { get; set; }

        /// <summary>
        /// Gets or sets the PDF text xpos.
        /// </summary>
        /// <value>
        /// The PDF text xpos.
        /// </value>
        public int Xposition { get; set; }

        /// <summary>
        /// Gets or sets the PDF text ypos.
        /// </summary>
        /// <value>
        /// The PDF text ypos.
        /// </value>
        public int Yposition { get; set; }
    }
}