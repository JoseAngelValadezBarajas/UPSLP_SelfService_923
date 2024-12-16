// --------------------------------------------------------------------
// <copyright file="SettingHelper.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO;
using SelfService.Models.Session;

namespace SelfService.Helpers.Interfaces
{
    /// <summary>
    /// ISettingHelper
    /// </summary>
    public interface ISettingHelper
    {
        /// <summary>
        /// Gets the application identifier.
        /// </summary>
        /// <returns></returns>
        int GetApplicationId();

        /// <summary>
        /// Gets the build information.
        /// </summary>
        /// <returns></returns>
        BuildInformation GetBuildInfo();

        /// <summary>
        /// Gets the language.
        /// </summary>
        /// <param name="account">The account.</param>
        /// <returns></returns>
        string GetLanguage(Account account);
    }
}