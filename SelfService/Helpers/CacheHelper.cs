// --------------------------------------------------------------------
// <copyright file="CacheHelper.cs" company="Ellucian">
//     Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO;
using Microsoft.Extensions.Caching.Memory;
using System;

namespace SelfService.Helpers
{
    /// <summary>
    /// CacheHelper
    /// </summary>
    internal static class CacheHelper
    {
        /// <summary>
        /// Gets the application identifier.
        /// </summary>
        /// <param name="cache">The cache.</param>
        /// <returns></returns>
        internal static int? GetApplicationId(this IMemoryCache cache)
                          => cache.TryGetValue(Constants._applicationIdCache, out int value) ? value : null;

        /// <summary>
        /// Gets the build information.
        /// </summary>
        /// <param name="cache">The cache.</param>
        /// <returns></returns>
        internal static BuildInformation GetBuildInfo(this IMemoryCache cache)
            => cache.TryGetValue(Constants._buildInfoCache, out BuildInformation value) ? value : null;

        /// <summary>
        /// Sets the application identifier.
        /// </summary>
        /// <param name="cache">The cache.</param>
        /// <param name="value">The value.</param>
        internal static void SetApplicationId(this IMemoryCache cache, int value) => SetCache(Constants._applicationIdCache, cache, value);

        /// <summary>
        /// Sets the build information.
        /// </summary>
        /// <param name="cache">The cache.</param>
        /// <param name="value">The value.</param>
        internal static void SetBuildInfo(this IMemoryCache cache, BuildInformation value)
        {
            MemoryCacheEntryOptions cacheEntryOptions
                = new MemoryCacheEntryOptions()
                    .SetPriority(CacheItemPriority.NeverRemove);
            _ = cache.Set(Constants._buildInfoCache, value, cacheEntryOptions);
        }

        #region Private Methods

        /// <summary>
        /// Sets the cache.
        /// </summary>
        /// <param name="application">The application.<seealso cref="string"/></param>
        /// <param name="cache">The cache.<seealso cref="IMemoryCache"/></param>
        /// <param name="value">The value.<seealso cref="int"/></param>
        private static void SetCache(string application, IMemoryCache cache, object value)
        {
            MemoryCacheEntryOptions cacheEntryOptions
                     = new MemoryCacheEntryOptions().SetSlidingExpiration(new TimeSpan(0, Constants._cacheExpirationTime, 0));
            _ = cache.Set(application, value, cacheEntryOptions);
        }

        #endregion Private Methods
    }
}