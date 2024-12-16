// --------------------------------------------------------------------
// <copyright file="SessionHelper.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace SelfService.Helpers
{
    /// <summary>
    /// SessionHelper
    /// </summary>
    internal static class SessionHelper
    {
        /// <summary>
        /// Gets the object.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session">The session.</param>
        /// <param name="key">The key.</param>
        /// <returns></returns>
        internal static T GetObject<T>(this ISession session, string key)
        {
            string value = session.GetString(key);
            return value == null ? default : JsonConvert.DeserializeObject<T>(value);
        }

        /// <summary>
        /// Sets the object.
        /// </summary>
        /// <param name="session">The session.</param>
        /// <param name="key">The key.</param>
        /// <param name="value">The value.</param>
        internal static void SetObject(this ISession session, string key, object value)
            => session.SetString(key, JsonConvert.SerializeObject(value));
    }
}