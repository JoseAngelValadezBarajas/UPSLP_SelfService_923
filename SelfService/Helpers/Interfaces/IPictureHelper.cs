// --------------------------------------------------------------------
// <copyright file="IPictureHelper.cs" company="Ellucian">
//     Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace SelfService.Helpers.Interfaces
{
    /// <summary>
    /// The Picture Helper interface.
    /// </summary>
    public interface IPictureHelper
    {
        /// <summary>
        /// Gets the picture.
        /// </summary>
        /// <param name="picture">The picture.</param>
        /// <returns></returns>
        Task<FileStreamResult> GetPictureAsync(Picture picture);

        /// <summary>
        /// Converts to base64.
        /// </summary>
        /// <param name="picture">The picture.</param>
        /// <returns></returns>
        string ToBase64(Picture picture);
    }
}