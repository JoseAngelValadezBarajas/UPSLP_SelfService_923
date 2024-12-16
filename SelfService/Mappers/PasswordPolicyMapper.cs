// --------------------------------------------------------------------
// <copyright file="PasswordPolicyMapper.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models;
using SelfService.Models.Account;

namespace SelfService.Mappers
{
    /// <summary>
    /// PasswordPolicyMapper
    /// </summary>
    internal static class PasswordPolicyMapper
    {
        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="appPasswordPolicy">The application password policy.</param>
        /// <returns></returns>
        internal static PasswordPolicyViewModel ToViewModel(this AppPasswordPolicy appPasswordPolicy)
        {
            if (appPasswordPolicy == null)
                return null;
            return new PasswordPolicyViewModel
            {
                CanChangePassword = appPasswordPolicy.CanChangePassword,
                ChangePasswordUrl = appPasswordPolicy.ChangePasswordUrl,
                CompareAgainstPreviousPwd = appPasswordPolicy.CompareAgainstPreviousPwd,
                IsLowerCaseRequired = appPasswordPolicy.LowerCaseRequired,
                IsNumbersRequired = appPasswordPolicy.NumbersRequired,
                IsSpecialCharacterRequired = appPasswordPolicy.SpecialCharacterRequired,
                IsUpperCaseRequired = appPasswordPolicy.UpperCaseRequired,
                MinimumLength = appPasswordPolicy.MinimumLength,
                PreviousPwdNumber = appPasswordPolicy.PreviousPwdNumber,
                StoreMode = appPasswordPolicy.StoreMode
            };
        }
    }
}