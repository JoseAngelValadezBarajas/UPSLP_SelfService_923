// --------------------------------------------------------------------
// <copyright file="AttendanceDetailsRequestModel.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;

namespace SelfService.Models.Students
{
    /// <summary>
    /// AttendanceDetailsRequestModel class.
    /// </summary>
    public class AttendanceDetailsRequestModel
    {
        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }

        /// <summary>
        /// Gets or sets the transcript detail identifier.
        /// </summary>
        /// <value>
        /// The transcript detail identifier.
        /// </value>
        public int TranscriptDetailId { get; set; }
    }
}