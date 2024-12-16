// --------------------------------------------------------------------
// <copyright file="IAdvisingHelper.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using SelfService.Models.Enum;
using SelfService.Models.Session;
using System.Collections.Generic;
using System.Security.Claims;

namespace SelfService.Helpers.Interfaces
{
    /// <summary>
    /// IAdvisingHelper interface.
    /// </summary>
    public interface IAdvisingHelper
    {
        /// <summary>
        /// Gets the profile permission.
        /// </summary>
        /// <param name="viewId">The view identifier.</param>
        /// <param name="claims">The claims.</param>
        /// <returns></returns>
        bool GetProfilePermission(AdviseeView viewId, IEnumerable<Claim> claims);

        /// <summary>
        /// Gets the tab permission.
        /// </summary>
        /// <param name="viewId">The view identifier.</param>
        /// <param name="tabId">The tab identifier.</param>
        /// <param name="claims">The claims.</param>
        /// <returns></returns>
        bool GetTabPermission(AdviseeView viewId, AdviseeProfileTab tabId, IEnumerable<Claim> claims);

        /// <summary>
        /// Gets the tab text.
        /// </summary>
        /// <param name="tabId">The tab identifier.</param>
        /// <param name="account">The account.</param>
        /// <returns></returns>
        string GetTabText(int tabId, Account account);

        /// <summary>
        /// Determines whether the specified tab identifier is authorized.
        /// </summary>
        /// <param name="tabId">The tab identifier.</param>
        /// <param name="advisorId">The advisor identifier.</param>
        /// <param name="adviseeId">The advisee identifier.</param>
        /// <returns>
        ///   <c>true</c> if the specified tab identifier is authorized; otherwise, <c>false</c>.
        /// </returns>
        bool IsAuthorized(int tabId, int advisorId, int adviseeId);
    }
}