// --------------------------------------------------------------------
// <copyright file="AdviseeWarningViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeWarningViewModel
    /// </summary>
    public class AdviseeWarningViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance has attendance warning.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has attendance warning; otherwise, <c>false</c>.
        /// </value>
        public bool HasAttendanceWarning { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has grades warning.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has grades warning; otherwise, <c>false</c>.
        /// </value>
        public bool HasGradesWarning { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has violation warning.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has violation warning; otherwise, <c>false</c>.
        /// </value>
        public bool HasViolationWarning { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }
    }
}