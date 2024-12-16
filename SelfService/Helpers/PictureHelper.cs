// --------------------------------------------------------------------
// <copyright file="PictureHelper.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Helpers.Interfaces;
using System;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Runtime.Versioning;
using System.Threading.Tasks;

namespace SelfService.Helpers
{
    /// <summary>
    /// PictureHelper
    /// </summary>
    public class PictureHelper : IPictureHelper
    {
        #region Private Fields

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<PictureHelper> _logger;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="PictureHelper" /> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        public PictureHelper(IAppLogger<PictureHelper> logger) : base() => _logger = logger;

        /// <summary>
        /// Gets the picture.
        /// </summary>
        /// <param name="picture">The picture.</param>
        /// <returns></returns>
        public async Task<FileStreamResult> GetPictureAsync(Picture picture)
        {
            Stream stream = null;
            try
            {
                if (!string.IsNullOrEmpty(picture?.Url))
                {
                    Uri imagePath = new(picture.Url);

                    if (imagePath.IsFile && File.Exists(imagePath.AbsolutePath))
                    {
                        stream = new FileStream(imagePath.AbsolutePath, FileMode.Open, FileAccess.Read);
                    }
                    else if (imagePath.IsAbsoluteUri)
                    {
                        HttpClient client = new();
                        HttpResponseMessage response = await client.GetAsync(picture.Url);
                        response.EnsureSuccessStatusCode();
                        stream = response.Content.ReadAsStream();
                    }

                    switch (picture.FileExtension)
                    {
                        case ".bmp":
                            return new FileStreamResult(stream, "image/bmp");

                        case ".jpg":
                            return new FileStreamResult(stream, "image/jpg");

                        case ".jpeg":
                            return new FileStreamResult(stream, "image/jpeg");

                        case ".png":
                            return new FileStreamResult(stream, "image/png");

                        default:
                            break;
                    }
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(IPictureHelper).FullName, "No picture response for " + picture?.Url, exception);
            }
            return null;
        }

        /// <summary>
        /// Converts to base64.
        /// </summary>
        /// <param name="picture">The picture.</param>
        /// <returns></returns>
        [SupportedOSPlatform("windows")]
        public string ToBase64(Picture picture)
        {
            Image image = null;
            try
            {
                if (!string.IsNullOrEmpty(picture?.Url))
                {
                    Uri imagePath = new(picture.Url);
                    if (imagePath.IsFile)
                    {
                        if (File.Exists(imagePath.AbsolutePath))
                            image = Image.FromFile(imagePath.AbsolutePath);
                    }
                    else if (imagePath.IsAbsoluteUri)
                    {
                        HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(picture.Url);
                        HttpWebResponse webResponse = (HttpWebResponse)webRequest.GetResponse();
                        if (webResponse != null)
                            return Convert.ToBase64String(ReadAllBytes(webResponse));
                    }
                    image?.Dispose();
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(IPictureHelper).FullName, "Cannot convert ToBase64 " + picture?.Url, exception);
            }

            return string.Empty;
        }

        #region Private Methods

        /// <summary>
        /// Reads all bytes.
        /// </summary>
        /// <param name="webResponse">The web response.</param>
        /// <returns></returns>
        private byte[] ReadAllBytes(HttpWebResponse webResponse)
        {
            byte[] buffer = null;
            try
            {
                BinaryReader breader = new(webResponse.GetResponseStream());
                buffer = breader.ReadBytes((int)webResponse.ContentLength);
                breader.Dispose();
                return buffer;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(IPictureHelper).FullName, exception.Message, exception);
                return buffer;
            }
        }

        #endregion Private Methods
    }
}