// --------------------------------------------------------------------
// <copyright file="TaxYearSettingsController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Finance;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.XPath;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /TaxYearSettings route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class TaxYearSettingsController : BaseEndpointController
    {
        /// <summary>
        /// The environment
        /// </summary>
        private readonly IWebHostEnvironment _environment;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<TaxYearSettingsController> _logger;

        /// <summary>
        /// The tax year service
        /// </summary>
        private readonly ITaxYearService _taxYearService;

        /// <summary>
        /// Initializes a new instance of the <see cref="TaxYearSettingsController"/> class.
        /// </summary>
        /// <param name="environment">The environment.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="taxYearService">The tax year service.</param>
        /// <param name="logger">The logger.</param>
        public TaxYearSettingsController(
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            ITaxYearService taxYearService,
            IWebHostEnvironment environment,
            IAppLogger<TaxYearSettingsController> logger)
            : base(serializationHelper)
        {
            _environment = environment;
            _institutionSettingService = institutionSettingService;
            _taxYearService = taxYearService;

            _logger = logger;
        }

        /// <summary>
        /// Deletes the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("TaxYearSettings/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        public JsonResult Delete([FromBody] int id)
        {
            try
            {
                bool result = false;
                if (id > 0)
                    result = _taxYearService.DeleteSetting(id);

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TaxYearSettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Detailses the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("TaxYearSettings/Details/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Details(int? id)
        {
            try
            {
                TaxYearSettingDetail taxYearSettingDetail = _taxYearService.GetSetting(id ?? 0);
                List<string> taxYearsList = _taxYearService.Get();
                List<ListOptionViewModel> taxYears = null;
                List<ListOptionViewModel> pdfFiles = null;
                List<ListOptionViewModel> xmlFiles = null;
                if (taxYearsList?.Count > 0)
                {
                    taxYears = new List<ListOptionViewModel>();
                    foreach (string taxYear in taxYearsList)
                    {
                        taxYears.Add(new ListOptionViewModel
                        {
                            Description = taxYear,
                            Value = taxYear
                        });
                    }
                }
                string path = Path.Combine(_environment.ContentRootPath, _institutionSettingService.Get1098TLocation());
                string[] pdfFileNames = FormatHelper.GetFileNames(path, "*.pdf");
                if (pdfFileNames?.Length > 0)
                {
                    pdfFiles = new List<ListOptionViewModel>();
                    foreach (string pdfFileName in pdfFileNames)
                    {
                        pdfFiles.Add(new ListOptionViewModel
                        {
                            Description = pdfFileName,
                            Value = pdfFileName
                        });
                    }
                    pdfFiles = pdfFiles.OrderByDescending(f => f.Description).ToList();
                }
                string[] xmlFilesNames = FormatHelper.GetFileNames(path, "*.xml");
                if (xmlFilesNames?.Length > 0)
                {
                    xmlFiles = new List<ListOptionViewModel>();
                    foreach (string xmlFileName in xmlFilesNames)
                    {
                        xmlFiles.Add(new ListOptionViewModel
                        {
                            Description = xmlFileName,
                            Value = xmlFileName
                        });
                    }

                    xmlFiles = xmlFiles.OrderByDescending(f => f.Description).ToList();
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    taxYears,
                    pdfFiles,
                    xmlFiles,
                    taxYearSettingDetail
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TaxYearSettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Downloads the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("TaxYearSettings/Download/{id}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public ActionResult Download(int id)
        {
            try
            {
                if (id > 0)
                {
                    byte[] pdfFile;
                    TaxYearSettingDetail taxYearSettingDetail = _taxYearService.GetSetting(id);
                    if (taxYearSettingDetail?.IsActive == true)
                    {
                        string folderlocation = _institutionSettingService.Get1098TLocation();
                        string configurationFileName = Path.Combine(_environment.ContentRootPath, folderlocation, taxYearSettingDetail.XmlFileName);
                        string pdfTemplateFileName = Path.Combine(_environment.ContentRootPath, folderlocation, taxYearSettingDetail.PdfFileName);
                        if (System.IO.File.Exists(configurationFileName) && System.IO.File.Exists(pdfTemplateFileName))
                        {
                            PdfHelper pdfHelper = new(GetLicensePath());
                            string fileName = $"{Guid.NewGuid()}.pdf";
                            IXPathNavigable studentData = _taxYearService.Get1098TData(Account.PersonId, taxYearSettingDetail.TaxYear);
                            if (!string.IsNullOrEmpty(((XmlDocument)studentData).InnerXml))
                            {
                                using (MemoryStream finalStream = pdfHelper.GetPdfMemoryStream(pdfTemplateFileName, configurationFileName, studentData, false))
                                    pdfFile = finalStream.ToArray();

                                return File(pdfFile, "application/pdf", fileName);
                            }
                        }
                    }
                }
                return new EmptyResult();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TaxYearSettingsController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        /// <summary>
        /// Fors the student.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("TaxYearSettings/ForStudent")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult ForStudent()
        {
            try
            {
                List<TaxYearSetting> taxYearSettingsList = _taxYearService.GetSettings();
                List<TaxYearSetting> taxYearSettingsListFiltered = null;
                if (taxYearSettingsList?.Count > 0)
                {
                    taxYearSettingsList = taxYearSettingsList.Where(ty => ty.IsActive).ToList();
                    if (taxYearSettingsList?.Count > 0)
                    {
                        taxYearSettingsListFiltered = new List<TaxYearSetting>();
                        XmlDocument studentData = null;
                        foreach (TaxYearSetting taxYearSetting in taxYearSettingsList)
                        {
                            studentData = (XmlDocument)_taxYearService.Get1098TData(Account.PersonId, taxYearSetting.TaxYear);
                            if (studentData != null && !string.IsNullOrEmpty(studentData.InnerXml))
                                taxYearSettingsListFiltered.Add(taxYearSetting);
                        }
                    }
                }
                return Json(SerializationHelper.ToJsonResult(taxYearSettingsListFiltered));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TaxYearSettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Get all the tax year settings
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("TaxYearSettings")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Index()
        {
            try
            {
                List<TaxYearSetting> taxYearSettingsList = _taxYearService.GetSettings();
                return Json(SerializationHelper.ToJsonResult(taxYearSettingsList));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TaxYearSettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Previews the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("TaxYearSettings/Preview/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public ActionResult Preview(int id)
        {
            try
            {
                if (id > 0)
                {
                    byte[] pdfFile;
                    TaxYearSettingDetail taxYearSettingDetail = _taxYearService.GetSetting(id);
                    if (taxYearSettingDetail != null)
                    {
                        string folderlocation = _institutionSettingService.Get1098TLocation();
                        string configurationFileName = Path.Combine(_environment.ContentRootPath, folderlocation, taxYearSettingDetail.XmlFileName);
                        string pdfTemplateFileName = Path.Combine(_environment.ContentRootPath, folderlocation, taxYearSettingDetail.PdfFileName);
                        if (System.IO.File.Exists(configurationFileName) && System.IO.File.Exists(pdfTemplateFileName))
                        {
                            PdfHelper pdfHelper = new(GetLicensePath());
                            string fileName = $"{Guid.NewGuid().ToString()}.pdf";
                            using (MemoryStream finalStream = pdfHelper.GetPdfMemoryStream(pdfTemplateFileName, configurationFileName, null, true))
                                pdfFile = finalStream.ToArray();

                            return File(pdfFile, "application/pdf", fileName);
                        }
                    }
                }
                return new EmptyResult();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TaxYearSettingsController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        /// <summary>
        /// Previews the before save.
        /// </summary>
        /// <param name="pdfFileName">Name of the PDF file.</param>
        /// <param name="xmlFileName">Name of the XML file.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("TaxYearSettings/PreviewBeforeSave/{pdfFileName}/{xmlFileName}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public ActionResult PreviewBeforeSave(string pdfFileName, string xmlFileName)
        {
            try
            {
                if (!string.IsNullOrEmpty(pdfFileName) && !string.IsNullOrEmpty(xmlFileName))
                {
                    byte[] pdfFile;
                    string folderlocation = _institutionSettingService.Get1098TLocation();
                    string configurationFileName = Path.Combine(_environment.ContentRootPath, folderlocation, $"{xmlFileName}.xml");
                    string pdfTemplateFileName = Path.Combine(_environment.ContentRootPath, folderlocation, $"{pdfFileName}.pdf");
                    if (System.IO.File.Exists(configurationFileName) && System.IO.File.Exists(pdfTemplateFileName))
                    {
                        PdfHelper pdfHelper = new(GetLicensePath());
                        string fileName = $"{Guid.NewGuid()}.pdf";
                        using (MemoryStream finalStream = pdfHelper.GetPdfMemoryStream(pdfTemplateFileName, configurationFileName, null, true))
                            pdfFile = finalStream.ToArray();

                        return File(pdfFile, "application/pdf", fileName);
                    }
                }
                return new EmptyResult();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TaxYearSettingsController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        /// <summary>
        /// Saves the specified tax year setting detail.
        /// </summary>
        /// <param name="taxYearSettingDetail">The tax year setting detail.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("TaxYearSettings/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        public JsonResult Save([FromBody] TaxYearSettingDetail taxYearSettingDetail)
        {
            try
            {
                bool result = false;
                if (taxYearSettingDetail.Id > 0)
                {
                    result = _taxYearService.UpdateSetting(taxYearSettingDetail, Account.PersonId);
                }
                else
                {
                    taxYearSettingDetail.Id = _taxYearService.CreateSetting(taxYearSettingDetail, Account.PersonId);
                    result = taxYearSettingDetail.Id > 0;
                }

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TaxYearSettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Statuses the specified status model.
        /// </summary>
        /// <param name="statusModel">The status model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("TaxYearSettings/Status")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        public JsonResult Status([FromBody] StatusModel statusModel)
        {
            try
            {
                int id = statusModel.Id;
                bool isActive = statusModel.IsActive;
                bool result = false;
                if (id > 0)
                    result = _taxYearService.UpdateSettingStatus(id, isActive, Account.PersonId) > 0;
                return Json(SerializationHelper.ToJsonResult(new { id, result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NameFormatsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Validates the tax year.
        /// </summary>
        /// <param name="taxYear">The tax year.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("TaxYearSettings/ValidateTaxYear")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSettings1098T } })]
        public JsonResult ValidateTaxYear([FromBody] string taxYear)
        {
            try
            {
                List<TaxYearSetting> taxYearSettingsList = _taxYearService.GetSettings();
                bool result = !(taxYearSettingsList?.Count > 0
                    && taxYearSettingsList.Find(ty => ty.TaxYear == taxYear) != null);

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TaxYearSettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the license path.
        /// </summary>
        /// <returns></returns>
        private string GetLicensePath() => Path.Combine(_environment.ContentRootPath, @"App_Data\licenses");
    }
}