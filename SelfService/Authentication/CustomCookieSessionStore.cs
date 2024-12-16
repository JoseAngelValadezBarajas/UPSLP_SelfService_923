// --------------------------------------------------------------------
// <copyright file="CustomCookieSessionStore.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SelfService.Authentication
{
    /// <summary>
    /// The custom cookie session store class.
    /// </summary>
    /// <seealso cref="ITicketStore" />
    public class CustomCookieSessionStore : ITicketStore
    {
        #region Private Fields

        /// <summary>
        /// The cache
        /// </summary>
        private readonly IMemoryCache _cache;

        /// <summary>
        /// The HTTP context accessor
        /// </summary>
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<CustomCookieSessionStore> _logger;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomCookieSessionStore"/> class.
        /// </summary>
        /// <param name="cache">The cache.<seealso cref="IMemoryCache"/></param>
        /// <param name="httpContextAccessor">The HTTP context accessor.<seealso cref="IHttpContextAccessor"/></param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="logger">The logger.<seealso cref="IAppLogger{CustomCookieSessionStore}"/></param>
        public CustomCookieSessionStore(
            IMemoryCache cache,
            IHttpContextAccessor httpContextAccessor,
            IInstitutionSettingService institutionSettingService,
            IAppLogger<CustomCookieSessionStore> logger)
        {
            _cache = cache;
            _httpContextAccessor = httpContextAccessor;
            _institutionSettingService = institutionSettingService;
            _logger = logger;
        }

        /// <summary>
        /// Remove the identity associated with the given key.
        /// </summary>
        /// <param name="key">The key associated with the identity.</param>
        /// <returns></returns>
        public Task RemoveAsync(string key)
        {
            _cache.Remove(key);
            return Task.FromResult(0);
        }

        /// <summary>
        /// Tells the store that the given identity should be updated.
        /// </summary>
        /// <param name="key"></param>
        /// <param name="ticket"></param>
        /// <returns></returns>
        public Task RenewAsync(string key, AuthenticationTicket ticket)
        {
            MemoryCacheEntryOptions options = new();
            if (ticket.Properties.ExpiresUtc.HasValue)
            {
                options.SetAbsoluteExpiration(ticket.Properties.ExpiresUtc.Value);
                options.RegisterPostEvictionCallback(EvictionCallback);
            }
            _cache.Set(key, ticket, options);

            return Task.FromResult(0);
        }

        /// <summary>
        /// Retrieves an identity from the store for the given key.
        /// </summary>
        /// <param name="key">The key associated with the identity.</param>
        /// <returns>
        /// The identity associated with the given key, or if not found.
        /// </returns>
        public Task<AuthenticationTicket> RetrieveAsync(string key)
        {
            _cache.TryGetValue(key, out AuthenticationTicket ticket);
            return Task.FromResult(ticket);
        }

        /// <summary>
        /// Store the identity ticket and return the associated key.
        /// </summary>
        /// <param name="ticket">The identity information to store.</param>
        /// <returns>
        /// The key that can be used to retrieve the identity later.
        /// </returns>
        public async Task<string> StoreAsync(AuthenticationTicket ticket)
        {
            string prefix;
            if (ticket.AuthenticationScheme.Equals(IdentityConstants.ExternalScheme))
                prefix = Constants._externalCookieCachePrefix;
            else
                prefix = Constants._cookieCachePrefix;

            string key = $"{prefix}-{DateTime.Now.Ticks}-{Guid.NewGuid()}";
            await RenewAsync(key, ticket);
            return key;
        }

        /// <summary>
        /// Evictions the callback.
        /// </summary>
        /// <param name="key">The key.<seealso cref="object"/></param>
        /// <param name="value">The value.<seealso cref="object"/></param>
        /// <param name="reason">The reason.<seealso cref="EvictionReason"/></param>
        /// <param name="state">The state.<seealso cref="Nullable{Object}"/></param>
        private void EvictionCallback(object key, object value, EvictionReason reason, object? state)
        {
            InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
            if (logging.EnableLoginLogout
                && reason != EvictionReason.Replaced
                && ((key as string).StartsWith(Constants._cookieCachePrefix)
                    || (key as string).StartsWith(Constants._externalCookieCachePrefix)))
            {
                string type = string.Empty;
                if ((key as string).StartsWith(Constants._externalCookieCachePrefix))
                    type = " SSO";

                AuthenticationTicket authenticationTicket = value != null ? (value as AuthenticationTicket) : null;
                Claim userGuidClaim = authenticationTicket?.Principal.Claims?.FirstOrDefault(c => string.Equals(c.Type, ClaimTypes.NameIdentifier));
                _ = Guid.TryParse(userGuidClaim?.Value, out Guid userGuidClaimValue);
                _logger.LogLogout(Constants._product, $"Authenticated{type} session has ended, reason: {reason}", success: true,
                    userGuidClaimValue != Guid.Empty ? userGuidClaimValue : null,
                    logging.IncludeClientIp ? _logger.GetIpAddress(_httpContextAccessor.HttpContext) : null,
                    logging.IncludePrincipalId ? authenticationTicket?.Principal.Identity?.Name : null);
            }
        }
    }
}