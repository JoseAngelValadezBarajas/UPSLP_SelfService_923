// --------------------------------------------------------------------
// <copyright file="LoggingController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Logging route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    public class LoggingController : BaseEndpointController
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<LoggingController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="LoggingController" /> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        public LoggingController(
            ISerializationHelper serializationHelper,
            IAppLogger<LoggingController> logger)
            : base(serializationHelper) => _logger = logger;

        /// <summary>
        /// Endpoint to send the error to be logged.
        /// </summary>
        /// <param name="logData">The detail of the error</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Logging/Error")]
        public JsonResult Error([FromBody] ClientLogData logData)
        {
            try
            {
                if (logData == null || string.IsNullOrEmpty(logData.Message))
                    return Json(SerializationHelper.ToJsonResult(null, null, 0, false));

                Dictionary<string, object> clientInfo = new()
                {
                    { "FunctionName", logData.FunctionName },
                    { "IdModule", logData.IdModule },
                    { "IdPage", logData.IdPage },
                    { "Timestamp", logData.Timestamp }
                };
                _logger.LogWebError(Constants._product, typeof(LoggingController).FullName, logData.Message, null, clientInfo);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, true));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(LoggingController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}