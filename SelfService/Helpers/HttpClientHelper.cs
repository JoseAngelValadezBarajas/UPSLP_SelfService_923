// --------------------------------------------------------------------
// <copyright file="HttpClientHelper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Logger;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Account;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SelfService.Helpers
{
    /// <summary>
    /// HttpClientHelper
    /// </summary>
    public class HttpClientHelper : IHttpClientHelper
    {
        #region Private Fields

        /// <summary>
        /// The HTTP client factory
        /// </summary>
        private readonly IHttpClientFactory _httpClientFactory;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<HttpClientHelper> _logger;

        /// <summary>
        /// The serialization helper
        /// </summary>
        private readonly ISerializationHelper _serializationHelper;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="HttpClientHelper" /> class.
        /// </summary>
        /// <param name="httpClientFactory">The HTTP client factory.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public HttpClientHelper(
            IHttpClientFactory httpClientFactory,
            ISerializationHelper serializationHelper,
            IAppLogger<HttpClientHelper> logger)
        {
            _httpClientFactory = httpClientFactory;
            _serializationHelper = serializationHelper;

            _logger = logger;
        }

        /// <summary>
        /// Sends the notifications URI.
        /// </summary>
        /// <param name="httpMethod">The HTTP method.</param>
        /// <param name="uri">The URI.</param>
        /// <param name="content">The content.</param>
        /// <returns></returns>
        public async Task<(bool, HttpStatusCode, string)> SendNotificationsURI(
            HttpMethod httpMethod, string uri, object content = null)
        {
            try
            {
                bool isSuccessStatusCode = false;
                HttpStatusCode httpStatusCode;
                string apiResponse = null;
                using (HttpClient client = _httpClientFactory.CreateClient(Constants._notificationsClient))
                {
                    HttpRequestMessage request = new()
                    {
                        Method = httpMethod,
                        RequestUri = new Uri($"{client.BaseAddress}{uri}")
                    };
                    if (content != null)
                    {
                        Type t = content.GetType();
                        if (t.IsPrimitive || t == typeof(string))
                            request.RequestUri = new Uri($"{client.BaseAddress}/{uri}/{content}");
                        else
                            request.Content = new StringContent((string)_serializationHelper.ToJsonObject(content, false), Encoding.UTF8, "application/json");
                    }

                    using HttpResponseMessage response = await client.SendAsync(request);
                    isSuccessStatusCode = response.IsSuccessStatusCode;
                    httpStatusCode = response.StatusCode;
                    if (isSuccessStatusCode)
                        apiResponse = await response.Content.ReadAsStringAsync();
                    else
                        _logger.LogError(Constants._product, typeof(IHttpClientHelper).FullName, $"API status code: {response.StatusCode} - URI: {uri}");
                }
                return (isSuccessStatusCode, httpStatusCode, apiResponse);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(IHttpClientHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Sends the re captcha URI.
        /// </summary>
        /// <param name="reCaptchaSecret">The re captcha secret.</param>
        /// <param name="reCaptchaClientResponse">The re captcha client response.</param>
        /// <param name="userHostAddress">The user host address.</param>
        /// <returns></returns>
        public (HttpStatusCode, ReCaptchaResponse) SendReCaptchaURI(
            string apiAddress, string reCaptchaSecret, string reCaptchaClientResponse, string userHostAddress)
        {
            try
            {
                HttpResponseMessage httpResponseMessage = null;
                using (HttpClient client = _httpClientFactory.CreateClient(Constants._reCaptchaClient))
                {
                    FormUrlEncodedContent content = new(new KeyValuePair<string, string>[]
                    {
                        new KeyValuePair<string, string>("secret", reCaptchaSecret),
                        new KeyValuePair<string, string>("response", reCaptchaClientResponse),
                        new KeyValuePair<string, string>("remoteip", userHostAddress)
                    });
                    httpResponseMessage = client.PostAsync(apiAddress, content).Result;
                }
                ReCaptchaResponse reCaptchaResponse = null;
                if (httpResponseMessage.StatusCode == HttpStatusCode.OK)
                {
                    string jsonString = httpResponseMessage.Content.ReadAsStringAsync().Result;
                    reCaptchaResponse = _serializationHelper.ToObject<ReCaptchaResponse>(jsonString);
                }
                return (httpResponseMessage.StatusCode, reCaptchaResponse);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(IHttpClientHelper).FullName, exception.Message, exception);
                throw;
            }
        }
    }
}