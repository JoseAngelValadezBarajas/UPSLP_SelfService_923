// --------------------------------------------------------------------
// <copyright file="IHttpClientHelper.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace SelfService.Helpers.Interfaces
{
    /// <summary>
    /// The HttpClient Helper interface.
    /// </summary>
    public interface IHttpClientHelper
    {
        /// <summary>
        /// Sends the notifications URI.
        /// </summary>
        /// <param name="httpMethod">The HTTP method.</param>
        /// <param name="uri">The URI.</param>
        /// <param name="content">The content.</param>
        /// <returns></returns>
        Task<(bool, HttpStatusCode, string)> SendNotificationsURI(HttpMethod httpMethod, string uri, object content = null);

        /// <summary>
        /// Sends the re captcha URI.
        /// </summary>
        /// <param name="apiAddress">The API address.</param>
        /// <param name="reCaptchaSecret">The re captcha secret.</param>
        /// <param name="reCaptchaClientResponse">The re captcha client response.</param>
        /// <param name="userHostAddress">The user host address.</param>
        /// <returns></returns>
        (HttpStatusCode, ReCaptchaResponse) SendReCaptchaURI(string apiAddress, string reCaptchaSecret, string reCaptchaClientResponse, string userHostAddress);
    }
}