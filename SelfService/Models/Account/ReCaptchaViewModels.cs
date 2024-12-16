// --------------------------------------------------------------------
// <copyright file="ReCaptchaViewModels.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Runtime.Serialization;

namespace SelfService.Models.Account
{
    /// <summary>
    /// ReCaptchaOrigin enumerator
    /// </summary>
    public enum ReCaptchaOrigin
    {
        /// <summary>
        /// The forgot password send email
        /// </summary>
        ForgotPasswordSendEmail = 1,

        /// <summary>
        /// The continuing education registration
        /// </summary>
        ContinuingEducationRegistration = 2
    }

    /// <summary>
    /// ReCaptchaRequest
    /// </summary>
    public class ReCaptchaRequest
    {
        /// <summary>
        /// Gets or sets the response.
        /// </summary>
        /// <value>
        /// The response.
        /// </value>
        public string Response { get; set; }

        /// <summary>
        /// Gets or sets the secret.
        /// </summary>
        /// <value>
        /// The secret.
        /// </value>
        public string Secret { get; set; }
    }

    /// <summary>
    /// ReCaptchaResponse
    /// </summary>
    [DataContract]
    public class ReCaptchaResponse
    {
        /// <summary>
        /// Gets or sets the challenge ts.
        /// </summary>
        /// <value>
        /// The challenge ts.
        /// </value>
        [DataMember(Name = "challenge_ts")]
        public string ChallengeTs { get; set; }

        /// <summary>
        /// Gets or sets the error codes.
        /// </summary>
        /// <value>
        /// The error codes.
        /// </value>
        [DataMember(Name = "error-codes")]
        public string[] ErrorCodes { get; set; }

        /// <summary>
        /// Gets or sets the hostname.
        /// </summary>
        /// <value>
        /// The hostname.
        /// </value>
        [DataMember(Name = "hostname")]
        public string Hostname { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ReCaptchaResponse" /> is success.
        /// </summary>
        /// <value>
        ///   <c>true</c> if success; otherwise, <c>false</c>.
        /// </value>
        [DataMember(Name = "success")]
        public bool Success { get; set; }
    }

    /// <summary>
    /// ReCaptchaResponseModel
    /// </summary>
    public class ReCaptchaResponseModel
    {
        /// <summary>
        /// Gets or sets the re captcha response.
        /// </summary>
        /// <value>
        /// The re captcha response.
        /// </value>
        public string ReCaptchaResponse { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; }
    }
}