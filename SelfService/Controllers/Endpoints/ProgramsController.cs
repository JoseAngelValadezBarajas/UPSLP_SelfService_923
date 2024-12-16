// --------------------------------------------------------------------
// <copyright file="ProgramsController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Programs;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ProgramDto = Hedtech.PowerCampus.Core.DTO.Student.Program;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Programs route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class ProgramsController : BaseEndpointController
    {
        /// <summary>
        /// The environment
        /// </summary>
        private readonly IWebHostEnvironment _environment;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<ProgramsController> _logger;

        /// <summary>
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// The planning service
        /// </summary>
        private readonly IPlanningService _planningService;

        /// <summary>
        /// The program service
        /// </summary>
        private readonly IProgramService _programService;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProgramsController"/> class.
        /// </summary>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="planningService">The planning service.</param>
        /// <param name="programService">The program service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public ProgramsController(
            IPictureHelper pictureHelper,
            IPlanningService planningService,
            IProgramService programService,
            ISerializationHelper serializationHelper,
            IWebHostEnvironment environment,
            IAppLogger<ProgramsController> logger)
            : base(serializationHelper)
        {
            _pictureHelper = pictureHelper;
            _planningService = planningService;
            _programService = programService;
            _environment = environment;

            _logger = logger;
        }

        /// <summary>
        /// Endpoint to obtain all the periods that match the input parameters.
        /// </summary>
        /// <param name="yearTerm">The year/term identifiers.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Programs/DegreeRequirements")]
        [AllowAnonymous]
        public JsonResult DegreeRequirements([FromBody] string yearTerm)
        {
            try
            {
                if (string.IsNullOrEmpty(yearTerm.Trim()))
                    return Json(SerializationHelper.ToJsonResult(new { yearTerm }, string.Empty, 0, false));
                string[] yearTermArray = yearTerm.Split('/');
                if (yearTermArray?.Length > 0)
                {
                    List<ProgramDto> programs = _planningService.GetPrograms(Account?.PersonId ?? 0, yearTermArray[0], yearTermArray[1], false);
                    List<ListOptionViewModel> options = programs.ToViewModel();

                    return Json(SerializationHelper.ToJsonResult(options));
                }
                return Json(SerializationHelper.ToJsonResult(null, "The year/term value does not have a correct format.", 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ProgramsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the picture for the Program Id
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public async Task<ActionResult> Picture(int? id, string baseAddress)
        {
            try
            {
                Picture picture = id == null
                    ? new Picture
                    {
                        Url = Path.Combine(_environment.WebRootPath, "css/images/Profile_default_background.png"),
                        FileExtension = ".png",
                        FileName = "Profile_default_background"
                    }
                    : _programService.GetPicture(id.Value);
                return await _pictureHelper.GetPictureAsync(picture);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ProgramsController).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Whats if.
        /// </summary>
        /// <param name="termPeriodId">The term period identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Programs/WhatIf")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult WhatIf([FromBody] ProgramModel programModel)
        {
            try
            {
                if (programModel.TermPeriodId <= 0)
                    return Json(SerializationHelper.ToJsonResult(new { programModel.TermPeriodId }, string.Empty, 0, false));
                List<ProgramDto> programs = _programService.GetForWhatIf(programModel?.ImpersonateInfo?.PersonId ?? Account?.PersonId ?? 0, programModel.TermPeriodId);
                List<ListOptionViewModel> options = programs.ToViewModel();
                return Json(SerializationHelper.ToJsonResult(options));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ProgramsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}