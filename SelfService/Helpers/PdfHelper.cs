// --------------------------------------------------------------------
// <copyright file="PdfHelper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Aspose.Pdf;
using Aspose.Pdf.Text;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;

namespace SelfService.Helpers
{
    /// <summary>
    /// PdfHelper
    /// </summary>
    public class PdfHelper
    {
        #region Private Fields

        /// <summary>
        /// The PDF license
        /// </summary>
        private static readonly License _pdfLicense = new();

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="PdfHelper"/> class.
        /// </summary>
        /// <param name="location">The location.</param>
        public PdfHelper(string location) => EncryptDecryptLicense(location);

        /// <summary>
        /// Gets the PDF memory stream.
        /// </summary>
        /// <param name="templateName">Name of the template.</param>
        /// <param name="pdfConfiguration">The PDF configuration.</param>
        /// <param name="data">The data.</param>
        /// <param name="printDefaultValues">if set to <c>true</c> [print default values].</param>
        /// <returns></returns>
        public MemoryStream GetPdfMemoryStream(string templateName, string pdfConfiguration, IXPathNavigable data, bool printDefaultValues)
        {
            List<PdfTextProperties> stampTextDetailsList = printDefaultValues ? RetrieveDefaultTextProperties(pdfConfiguration) : RetrieveTextProperties(pdfConfiguration, data);
            MemoryStream finalStream = new();
            if (stampTextDetailsList?.Count > 0)
            {
                using Document pdfDocument = StampDetails(templateName, stampTextDetailsList);
                pdfDocument.Save(finalStream);
            }
            return finalStream;
        }

        #region Private Methods

        /// <summary>
        /// Applies the license.
        /// </summary>
        private void ApplyLicense()
        {
            _pdfLicense.SetLicense("Aspose.Pdf.lic");
            _pdfLicense.Embedded = true;
        }

        /// <summary>
        /// A method used for encrypting and decrypting data using XOR.
        /// </summary>
        private byte[] EncryptDecryptLicense(byte[] licBytes, byte[] key)
        {
            byte[] output = new byte[licBytes.Length];
            for (int i = 0; i < licBytes.Length; i++)
                output[i] = Convert.ToByte(licBytes[i] ^ key[i]);
            return output;
        }

        /// <summary>
        /// Encrypts the decrypt license.
        /// </summary>
        private void EncryptDecryptLicense(string location)
        {
            string encryptedFilePath = $"{location}//EncryptedLicense.txt";

            // Load the contents of the license into a byte array.
            Assembly a = Assembly.GetExecutingAssembly();
            byte[] licBytes = null;
            using (Stream resFilestream = a.GetManifestResourceStream($"{a.GetName().Name}.App_Data.licenses.Aspose.Pdf.lic"))
            {
                licBytes = new byte[resFilestream.Length];
                _ = resFilestream.Read(licBytes, 0, licBytes.Length);
            }
            // Use this key only once for this license file.
            // To protect another file first generate a new key.
            byte[] key = GenerateKey(licBytes.Length);

            // Write the encrypted license to disk.
            File.WriteAllBytes(encryptedFilePath, EncryptDecryptLicense(licBytes, key));

            // Load the encrypted license and decrypt it using the key.
            byte[] decryptedLicense;
            decryptedLicense = EncryptDecryptLicense(File.ReadAllBytes(encryptedFilePath), key);

            // Load the decrypted license into a stream and set the license.
            MemoryStream licenseStream = new(decryptedLicense);

            _pdfLicense.SetLicense(licenseStream);
        }

        /// <summary>
        /// Generates a random key the same length as the license (a one time pad).
        /// </summary>
        private byte[] GenerateKey(long size)
        {
            byte[] strongBytes = new byte[size];
            using (RNGCryptoServiceProvider rng = new())
                rng.GetBytes(strongBytes);
            return strongBytes;
        }

        /// <summary>
        /// Retrieves the default text properties.
        /// </summary>
        /// <param name="pdfConfiguration">The PDF configuration.</param>
        /// <returns></returns>
        /// <exception cref="Exception">ConfigurationFileIncorrect</exception>
        private List<PdfTextProperties> RetrieveDefaultTextProperties(string pdfConfiguration)
        {
            List<PdfTextProperties> stampTextDetailsList = new();

            if (File.Exists(pdfConfiguration))
            {
                const string Xposition = "Xposition";
                const string Yposition = "Yposition";
                const string RotationAngle = "RotationAngle";
                const string TargetPageNumber = "TargetPageNumber";
                const string FontStyle = "FontStyle";
                const string TextSize = "TextSize";
                const string Default = "DefaultValue";

                XDocument pdfConfig = XDocument.Load(pdfConfiguration);
                IEnumerable<XElement> XElement = pdfConfig.Elements("Entities");
                IEnumerable<XNode> xnode = XElement.Elements();

                foreach (XNode table in xnode)
                {
                    string tableName = ((XElement)table).Name.ToString();
                    if (!string.IsNullOrEmpty(tableName) && tableName.Contains("PdfTextProperties"))
                    {
                        XElement xElement = pdfConfig.Descendants(tableName).Single();
                        IEnumerable<XElement> rows = xElement.Elements("row");

                        PdfTextProperties stampTextDetails;
                        foreach (XElement textItem in rows)
                        {
                            if (textItem.Attribute(Xposition) != null
                                && textItem.Attribute(Yposition) != null
                                && textItem.Attribute(RotationAngle) != null
                                && textItem.Attribute(TargetPageNumber) != null
                                && textItem.Attribute(FontStyle) != null
                                && textItem.Attribute(TextSize) != null
                                && textItem.Attribute(Default) != null)
                            {
                                stampTextDetails = new PdfTextProperties()
                                {
                                    Text = string.IsNullOrEmpty(textItem.Attribute(Default).Value) ?
                                        "" : textItem.Attribute(Default).Value,
                                    Xposition = string.IsNullOrEmpty(textItem.Attribute(Xposition).Value) ?
                                        0 : int.Parse(textItem.Attribute(Xposition).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                    Yposition = string.IsNullOrEmpty(textItem.Attribute(Yposition).Value) ?
                                        0 : int.Parse(textItem.Attribute(Yposition).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                    Orientation = string.IsNullOrEmpty(textItem.Attribute(RotationAngle).Value) ?
                                        0 : int.Parse(textItem.Attribute(RotationAngle).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                    FontSize = string.IsNullOrEmpty(textItem.Attribute(TextSize).Value) ?
                                        0 : int.Parse(textItem.Attribute(TextSize).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                    FontStyle = !string.IsNullOrEmpty(textItem.Attribute(FontStyle).Value),
                                    PageNumber = string.IsNullOrEmpty(textItem.Attribute(TargetPageNumber).Value) ?
                                        0 : int.Parse(textItem.Attribute(TargetPageNumber).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                };
                                stampTextDetailsList.Add(stampTextDetails);
                            }
                            else
                            {
                                throw new Exception("ConfigurationFileIncorrect");
                            }
                        }
                    }
                }
            }
            return stampTextDetailsList;
        }

        /// <summary>
        /// Retrieves the text properties.
        /// </summary>
        /// <param name="pdfConfiguration">The PDF configuration.</param>
        /// <param name="studentData">The student data.</param>
        /// <returns></returns>
        /// <exception cref="Exception">
        /// ConfigurationFileIncorrect
        /// or
        /// ConfigurationFileIncorrect
        /// </exception>
        private List<PdfTextProperties> RetrieveTextProperties(string pdfConfiguration, IXPathNavigable studentData)
        {
            List<PdfTextProperties> stampTextDetailsList = new();
            XmlDocument studentInfo = (XmlDocument)studentData;

            if (File.Exists(pdfConfiguration))
            {
                string Xposition = "Xposition";
                string Yposition = "Yposition";
                string RotationAngle = "RotationAngle";
                string TargetPageNumber = "TargetPageNumber";
                string FontStyle = "FontStyle";
                string TextSize = "TextSize";
                string Default = "DefaultValue";
                string ColumnType = "ColumnType";

                XDocument pdfConfig = XDocument.Load(pdfConfiguration);
                IEnumerable<XElement> XElement = pdfConfig.Elements("Entities");
                IEnumerable<XNode> xnode = XElement.Elements();

                foreach (XNode table in xnode)
                {
                    string tableName = ((XElement)table).Name.ToString();
                    if (!string.IsNullOrEmpty(tableName) && tableName.Contains("PdfTextProperties"))
                    {
                        XElement xElement = pdfConfig.Descendants(tableName).Single();
                        IEnumerable<XElement> rows = xElement.Elements("row");

                        PdfTextProperties stampTextDetails;
                        foreach (XElement textItem in rows)
                        {
                            if (textItem.Attribute(ColumnType).Value == "Column")
                            {
                                string studentpath = "/Entities/PdfTextProperties/" + textItem.Attribute("Name").Value;
                                XmlNode childnode = studentInfo.SelectSingleNode(studentpath);
                                if (childnode != null)
                                {
                                    string student1098tdata = childnode.InnerText;
                                    if (!string.IsNullOrEmpty(student1098tdata))
                                    {
                                        if (textItem.Attribute(Xposition) != null
                                            && textItem.Attribute(Yposition) != null
                                            && textItem.Attribute(RotationAngle) != null
                                            && textItem.Attribute(TargetPageNumber) != null
                                            && textItem.Attribute(FontStyle) != null
                                            && textItem.Attribute(TextSize) != null
                                            && textItem.Attribute(Default) != null)
                                        {
                                            stampTextDetails = new()
                                            {
                                                Text = childnode.InnerText,
                                                Xposition = string.IsNullOrEmpty(textItem.Attribute(Xposition).Value) ?
                                                    0 : int.Parse(textItem.Attribute(Xposition).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                                Yposition = string.IsNullOrEmpty(textItem.Attribute(Yposition).Value) ?
                                                    0 : int.Parse(textItem.Attribute(Yposition).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                                Orientation = string.IsNullOrEmpty(textItem.Attribute(RotationAngle).Value) ?
                                                    0 : int.Parse(textItem.Attribute(RotationAngle).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                                FontSize = string.IsNullOrEmpty(textItem.Attribute(TextSize).Value) ?
                                                    0 : int.Parse(textItem.Attribute(TextSize).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                                FontStyle = !string.IsNullOrEmpty(textItem.Attribute(FontStyle).Value),
                                                PageNumber = string.IsNullOrEmpty(textItem.Attribute(TargetPageNumber).Value) ?
                                                    0 : int.Parse(textItem.Attribute(TargetPageNumber).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                            };
                                            stampTextDetailsList.Add(stampTextDetails);
                                        }
                                        else
                                        {
                                            throw new Exception("ConfigurationFileIncorrect");
                                        }
                                    }
                                }
                            }
                            else
                            {
                                if (textItem.Attribute(Xposition) != null
                                    && textItem.Attribute(Yposition) != null
                                    && textItem.Attribute(RotationAngle) != null
                                    && textItem.Attribute(TargetPageNumber) != null
                                    && textItem.Attribute(FontStyle) != null
                                    && textItem.Attribute(TextSize) != null
                                    && textItem.Attribute(Default) != null)
                                {
                                    stampTextDetails = new()
                                    {
                                        Text = string.IsNullOrEmpty(textItem.Attribute(Default).Value) ? "" : textItem.Attribute(Default).Value,
                                        Xposition = string.IsNullOrEmpty(textItem.Attribute(Xposition).Value) ?
                                            0 : int.Parse(textItem.Attribute(Xposition).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                        Yposition = string.IsNullOrEmpty(textItem.Attribute(Yposition).Value) ?
                                            0 : int.Parse(textItem.Attribute(Yposition).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                        Orientation = string.IsNullOrEmpty(textItem.Attribute(RotationAngle).Value) ?
                                            0 : int.Parse(textItem.Attribute(RotationAngle).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                        FontSize = string.IsNullOrEmpty(textItem.Attribute(TextSize).Value) ?
                                            0 : int.Parse(textItem.Attribute(TextSize).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                        FontStyle = !string.IsNullOrEmpty(textItem.Attribute(FontStyle).Value),
                                        PageNumber = string.IsNullOrEmpty(textItem.Attribute(TargetPageNumber).Value) ?
                                            0 : int.Parse(textItem.Attribute(TargetPageNumber).Value, NumberStyles.Number, CultureInfo.InvariantCulture),
                                    };
                                    stampTextDetailsList.Add(stampTextDetails);
                                }
                                else
                                {
                                    throw new Exception("ConfigurationFileIncorrect");
                                }
                            }
                        }
                    }
                }
            }
            return stampTextDetailsList;
        }

        /// <summary>
        /// Stamps the details.
        /// </summary>
        /// <param name="pdfTemplateFileLocation">The PDF template file location.</param>
        /// <param name="pdfTextList">The PDF text list.</param>
        /// <returns></returns>
        /// <exception cref="Exception">
        /// PdftemplateFileloactionNotFound
        /// or
        /// NoPdfCollection
        /// or
        /// NoPages
        /// </exception>
        private Document StampDetails(string pdfTemplateFileLocation, List<PdfTextProperties> pdfTextList)
        {
            if (string.IsNullOrEmpty(pdfTemplateFileLocation))
                throw new ArgumentNullException(nameof(pdfTemplateFileLocation));

            if (pdfTextList is null)
                throw new ArgumentNullException(nameof(pdfTextList));

            if (pdfTextList.Count < 1)
                throw new ArgumentOutOfRangeException(nameof(pdfTextList), "Condition: < 1");

            Document pdfDocument = new(pdfTemplateFileLocation);
            if (pdfDocument.Pages.Count < 1)
            {
                throw new Exception("NoPages");
            }

            Page pdfPage = pdfDocument.Pages[1];
            int currentPageNo = 1;
            foreach (PdfTextProperties textProperty in pdfTextList)
            {
                if (textProperty.Text.Trim().Length > 0)
                {
                    if (currentPageNo != textProperty.PageNumber)
                    {
                        pdfPage = pdfDocument.Pages[textProperty.PageNumber > 0 ? textProperty.PageNumber : 1];
                        currentPageNo = textProperty.PageNumber;
                    }
                    TextFragment textFragment = new(textProperty.Text)
                    {
                        Position = new Position(textProperty.Xposition, textProperty.Yposition)
                    };
                    textFragment.TextState.FontSize = textProperty.FontSize > 0 ? textProperty.FontSize : 10;
                    textFragment.TextState.Font = FontRepository.FindFont(string.IsNullOrEmpty(textProperty.Font) ? "TimesNewRoman" : textProperty.Font);
                    textFragment.TextState.FontStyle = textProperty.FontStyle ? FontStyles.Bold : FontStyles.Regular;
                    TextBuilder textBuilder = new(pdfPage);
                    textBuilder.AppendText(textFragment);
                }
            }
            return pdfDocument;
        }

        #endregion Private Methods
    }
}