// --------------------------------------------------------------------
// <copyright file="RegistrationMapper.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Infrastructure.DataAccess;
using SelfService.Models.Registration;
using SelfService.Models.Resources;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Xml;

namespace SelfService.Mappers
{
    /// <summary>
    /// RegistrationMapper
    /// </summary>
    internal static class RegistrationMapper
    {
        /// <summary>
        /// The format provider
        /// </summary>
        private static IFormatProvider _formatProvider;

        /// <summary>
        /// Converts from RegistrationLog to RegistrationSummaryViewModel.
        /// </summary>
        /// <param name="registrationLogDTO">The registration log dto.<seealso cref="RegistrationLog"/></param>
        /// <returns>
        /// The RegistrationSummaryViewModel. <seealso cref="RegistrationSummaryViewModel"/>
        /// </returns>
        internal static RegistrationSummaryViewModel ToViewModel(this RegistrationLog registrationLogDTO)
        {
            RegistrationSummaryViewModel registrationSummary = null;
            if (registrationLogDTO != null)
            {
                registrationSummary = new()
                {
                    Blocks = registrationLogDTO.Blocks
                    .Select(b => new RegistrationBlockSummaryViewModel()
                    {
                        BlockDisplayName = b.BlockDisplayName,
                        GroupDisplayName = b.GroupDisplayName,
                        Sections = b.Sections.ToViewModel()
                    }).ToList(),
                    Term = registrationLogDTO.AcademicTerm,
                    Year = registrationLogDTO.AcademicYear,
                    Sections = registrationLogDTO.Sections.ToViewModel()
                };
            }
            return registrationSummary;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="registrationSectionLogsDTO">The registration section logs dto.<seealso cref="List{RegistrationSectionLog}"/></param>
        /// <returns>
        /// The List&lt;RegistrationSectionSummaryViewModel&gt;. <seealso cref="List{RegistrationSectionSummaryViewModel}"/>
        /// </returns>
        internal static List<RegistrationSectionSummaryViewModel> ToViewModel(this List<RegistrationSectionLog> registrationSectionLogsDTO)
        {
            return registrationSectionLogsDTO.Select(s => new RegistrationSectionSummaryViewModel()
            {
                EventId = s.EventId,
                EventName = s.EventName,
                EventSubType = s.EventSubType,
                Section = s.Section,
                Session = s.AcademicSession,
                Status = s.Status,
                Term = s.AcademicTerm,
                Year = s.AcademicYear
            }).ToList();
        }

        /// <summary>
        /// Converts from RegistrationLog to RegistrationSummaryViewModel.
        /// </summary>
        /// <param name="registrationLogDTO">The registration log dto.<seealso cref="RegistrationLog"/></param>
        /// <returns>
        /// The RegistrationSummaryViewModel. <seealso cref="RegistrationSummaryViewModel"/>
        /// </returns>
        internal static List<RegistrationSummaryViewModel> ToViewModel(this List<RegistrationLog> registrationLogDTOs, CultureInfo datetimeCulture)
        {
            List<RegistrationSummaryViewModel> registrationLogs = new();
            if (registrationLogDTOs != null)
            {
                foreach (RegistrationLog registrationLogDTO in registrationLogDTOs)
                {
                    registrationLogs.Add(new RegistrationSummaryViewModel
                    {
                        CreationDatetime = $"{FormatHelper.ToShortDate(registrationLogDTO.CreationDatetime, datetimeCulture)} {FormatHelper.ToShortTime(registrationLogDTO.CreationDatetime, datetimeCulture)}",
                        Id = registrationLogDTO.Id,
                        Term = registrationLogDTO.AcademicTerm,
                        Title = registrationLogDTO.CreationDatetime.ToString("yyyyMMddHHmm"),
                        Year = registrationLogDTO.AcademicYear,
                    });
                }
            }
            return registrationLogs;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="registrationMessageDTO">The registration message dto.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="isDrop">if set to <c>true</c> [is drop].</param>
        /// <param name="general">The general.</param>
        /// <param name="severalDrops">if set to <c>true</c> [several drops].</param>
        /// <returns>
        /// RegistrationValidationViewModel.
        /// </returns>
        internal static RegistrationValidationViewModel ToViewModel(this RegistrationMessage registrationMessageDTO, ValidationMessagesResources resources,
            bool isDrop, InstitutionSettings.General general, bool severalDrops = false)
        {
            RegistrationValidationViewModel registrationValidation = new();
            if (resources != null)
            {
                if (registrationMessageDTO != null)
                {
                    registrationValidation.IsSuccessful = registrationMessageDTO.IsSuccessful;
                    registrationValidation.RegistrationLogId = registrationMessageDTO.RegistrationLogId;
                    if (isDrop)
                    {
                        if (severalDrops)
                            registrationValidation.Message = registrationValidation.IsSuccessful ? resources.LblDropsSuccess : resources.LblDropsFailed;
                        else
                            registrationValidation.Message = registrationValidation.IsSuccessful ? resources.LblDropSuccess : resources.LblDropFailed;
                    }
                    else
                        registrationValidation.Message = registrationValidation.IsSuccessful ? resources.LblSuccess : resources.LblFailed;
                    if (!registrationMessageDTO.IsSuccessful && registrationMessageDTO.XMLString != null)
                        registrationValidation.ValidationMessages = ReadXMLError(registrationMessageDTO.XMLString, resources, general).ToList();
                }
                else
                {
                    registrationValidation.IsSuccessful = false;
                    registrationValidation.Message = resources.LblFailed;
                }
            }
            return registrationValidation;
        }

        #region Private Methods

        /// <summary>
        /// Creates the validation message.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="description">The description.</param>
        /// <returns></returns>
        private static ValidationMessageViewModel CreateValidationMessage(int sectionId, string description)
        {
            ValidationMessageViewModel regMessage = new()
            {
                SectionId = sectionId,
                Description = description
            };
            return regMessage;
        }

        /// <summary>
        /// Gets the academic missing message.
        /// </summary>
        /// <param name="academicRecordMissingNodes">The academic record missing nodes.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="lstValidationMessageViewModel">The LST validation message view model.</param>
        /// <returns></returns>
        private static Collection<ValidationMessageViewModel> GetAcademicMissingMessage(XmlNodeList academicRecordMissingNodes, ValidationMessagesResources resources,
            Collection<ValidationMessageViewModel> lstValidationMessageViewModel)
        {
            string messageValidation = string.Empty;
            if (academicRecordMissingNodes?.Count > 0)
            {
                foreach (XmlNode node in academicRecordMissingNodes)
                {
                    messageValidation = string.Format(_formatProvider, resources.LblRegistrationValidationAcademicMissing);
                    lstValidationMessageViewModel.Add(CreateValidationMessage(0, messageValidation));
                }
            }
            return lstValidationMessageViewModel;
        }

        /// <summary>
        /// Gets the class availability message.
        /// </summary>
        /// <param name="xmlNode">The XML node.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="lstValidationMessageViewModel">The LST validation message view model.</param>
        /// <returns>
        /// Collection ValidationMessageViewModel
        /// </returns>
        private static Collection<ValidationMessageViewModel> GetClassAvailabilityMessage(
            XmlNode xmlNode, int sectionId, ValidationMessagesResources resources,
            Collection<ValidationMessageViewModel> lstValidationMessageViewModel)
        {
            XmlNodeList classAvailabilityNodes =
                xmlNode.ParentNode.SelectNodes("Error[@Type='ClassAvailability' and SectionId=" + sectionId.ToString(_formatProvider) + "]");
            string messageValidation = string.Empty;
            if (classAvailabilityNodes?.Count > 0)
            {
                foreach (XmlNode node in classAvailabilityNodes)
                {
                    #region ClassAvailability

                    if (node.SelectSingleNode("OthersAllowedType") != null)
                    {
                        switch (node.SelectSingleNode("OthersAllowedType").InnerText)
                        {
                            case "Campus":
                                messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationClassAvailability1,
                                                              node.SelectSingleNode("OthersAllowedDescription").InnerText);
                                break;

                            case "Program":
                                messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationClassAvailability2,
                                                            node.SelectSingleNode("OthersAllowedDescription").InnerText);
                                break;

                            case "College":
                                messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationClassAvailability3,
                                                            node.SelectSingleNode("OthersAllowedDescription").InnerText);
                                break;

                            case "Department":
                                messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationClassAvailability4,
                                                            node.SelectSingleNode("OthersAllowedDescription").InnerText);
                                break;

                            case "Curriculum":
                                messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationClassAvailability5,
                                                            node.SelectSingleNode("OthersAllowedDescription").InnerText);
                                break;

                            case "ClassLevel":
                                messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationClassAvailability6,
                                                            node.SelectSingleNode("OthersAllowedDescription").InnerText);
                                break;

                            case "Nontraditional":
                                messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationClassAvailability7,
                                                           node.SelectSingleNode("OthersAllowedDescription").InnerText);
                                break;

                            case "Population":
                                messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationClassAvailability8,
                                                           node.SelectSingleNode("OthersAllowedDescription").InnerText);
                                break;
                        }
                    }
                    else
                    {
                        messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationClassAvailability9);
                    }

                    #endregion ClassAvailability

                    lstValidationMessageViewModel.Add(CreateValidationMessage(sectionId, messageValidation));
                }
            }
            return lstValidationMessageViewModel;
        }

        /// <summary>
        /// Gets the corequisite message.
        /// </summary>
        /// <param name="xmlNode">The XML node.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="lstValidationMessageViewModel">The LST validation message view model.</param>
        /// <returns>
        /// Collection ValidationMessageViewModel
        /// </returns>
        private static Collection<ValidationMessageViewModel> GetCorequisiteMessage(XmlNode xmlNode, int sectionId, ValidationMessagesResources resources,
            Collection<ValidationMessageViewModel> lstValidationMessageViewModel)
        {
            string messageValidation = string.Empty;
            XmlNodeList corequisiteNodes =
                xmlNode.ParentNode.SelectNodes("Error[@Type='Corequisite' and SectionId=" + sectionId.ToString(_formatProvider) + "]");
            if (corequisiteNodes?.Count > 0)
            {
                foreach (XmlNode node in corequisiteNodes)
                {
                    if (node.SelectSingleNode("SectionId").InnerText == sectionId.ToString(_formatProvider))
                    {
                        messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationCorequisite1,
                                                    node.SelectSingleNode("CorequisiteEventId").InnerText,
                                                    node.SelectSingleNode("CorequisiteSubType").InnerText);
                        lstValidationMessageViewModel.Add(CreateValidationMessage(sectionId, messageValidation));
                    }
                }
            }
            return lstValidationMessageViewModel;
        }

        /// <summary>
        /// Gets the credit limit message.
        /// </summary>
        /// <param name="creditLimitNodes">The credit limit nodes.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="lstValidationMessageViewModel">The LST validation message view model.</param>
        /// <param name="formatCredits">The format credits.</param>
        /// <returns>
        /// Collection ValidationMessageViewModel
        /// </returns>
        private static Collection<ValidationMessageViewModel> GetCreditLimitMessage(XmlNodeList creditLimitNodes, ValidationMessagesResources resources,
            Collection<ValidationMessageViewModel> lstValidationMessageViewModel, string formatCredits)
        {
            string messageValidation;
            if (creditLimitNodes?.Count > 0)
            {
                foreach (XmlNode node in creditLimitNodes)
                {
                    decimal allowed = XmlHelper.RetrieveChildNodeDecimal(node, "@Allowed");
                    if (string.IsNullOrEmpty(node.InnerText))
                    {
                        messageValidation = string.Format(_formatProvider, resources.LblRegistrationValidationCreditLimitNoOverloaded,
                                              FormatHelper.ToCredits(allowed, formatCredits));
                    }
                    else
                    {
                        messageValidation = string.Format(_formatProvider, resources.LblRegistrationValidationCreditLimitOverloaded,
                                             FormatHelper.ToCredits(allowed, formatCredits));
                    }

                    lstValidationMessageViewModel.Add(CreateValidationMessage(0, messageValidation));
                }
            }
            return lstValidationMessageViewModel;
        }

        /// <summary>
        /// Gets the cross tally message.
        /// </summary>
        /// <param name="xmlNode">The XML node.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="lstValidationMessageViewModel">The LST validation message view model.</param>
        /// <returns>
        /// Collection ValidationMessageViewModel
        /// </returns>
        private static Collection<ValidationMessageViewModel> GetCrossTallyMessage(XmlNode xmlNode, int sectionId, ValidationMessagesResources resources,
            Collection<ValidationMessageViewModel> lstValidationMessageViewModel)
        {
            XmlNodeList crossTallyNodes =
                xmlNode.ParentNode.SelectNodes("Error[@Type='CrossTally' and SectionId=" + sectionId.ToString(_formatProvider) + "]");
            string messageValidation;
            if (crossTallyNodes?.Count > 0)
            {
                foreach (XmlNode errorNode in crossTallyNodes)
                {
                    messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationCrosstally,
                                                      errorNode.SelectSingleNode("ConflictingEventId").InnerText,
                                                      errorNode.SelectSingleNode("ConflictingSubType").InnerText,
                                                      errorNode.SelectSingleNode("ConflictingSection").InnerText);
                    lstValidationMessageViewModel.Add(CreateValidationMessage(sectionId, messageValidation));
                }
            }

            return lstValidationMessageViewModel;
        }

        /// <summary>
        /// Gets the prerequisite message.
        /// </summary>
        /// <param name="xmlNode">The XML node.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="lstValidationMessageViewModel">The LST validation message view model.</param>
        /// <param name="general">The general.</param>
        /// <returns>
        /// Collection ValidationMessageViewModel
        /// </returns>
        private static Collection<ValidationMessageViewModel> GetPrerequisiteMessage(XmlNode xmlNode, int sectionId, ValidationMessagesResources resources,
             Collection<ValidationMessageViewModel> lstValidationMessageViewModel, InstitutionSettings.General general)
        {
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
            string messageValidation;
            XmlNodeList errorNodes =
                xmlNode.ParentNode.SelectNodes("Error[@Type='Prerequisite' and SectionId=" + sectionId.ToString(_formatProvider) + "]");
            if (errorNodes?.Count > 0)
            {
                foreach (XmlNode node in errorNodes)
                {
                    if (node.SelectSingleNode("SectionId").InnerText == sectionId.ToString(_formatProvider))
                    {
                        XmlNode xNodeCopy = node;
                        string prereqs = "Prerequisite";
                        if (xNodeCopy.SelectNodes(prereqs).Count >= 1)
                        {
                            while (xNodeCopy.SelectNodes(prereqs).Count > 0)
                                prereqs += "/Prerequisite";
                            prereqs = prereqs.Substring(0, prereqs.Length - 13);
                        }

                        while (prereqs.Length > 13 || prereqs.Length == 12)
                        {
                            XmlNodeList conditionNodeList = xNodeCopy.SelectNodes(prereqs + "/Condition");
                            foreach (XmlNode prereqNode in conditionNodeList)
                            {
                                #region prereqNodeForeach

                                messageValidation = string.Empty;
                                XmlAttribute typeAtt = prereqNode.Attributes["FailureReason"];
                                XmlAttribute andorAtt = prereqNode.Attributes["Operator"];
                                if (andorAtt != null)
                                {
                                    if (andorAtt.Value == "and")
                                        messageValidation = resources.LblRegistrationValidationPrereqAnd;
                                    else if (andorAtt.Value == "or")
                                        messageValidation = resources.LblRegistrationValidationPrereqOr;
                                }
                                if (typeAtt != null)
                                {
                                    #region Prerequisite is missing

                                    //It can be Course, Permission or Test
                                    XmlNode courseNode = prereqNode.SelectSingleNode("Course");
                                    if (courseNode != null)
                                    {
                                        messageValidation += string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationPrereqCourse,
                                                    courseNode.SelectSingleNode("EventId").InnerText,
                                                    courseNode.SelectSingleNode("SubType").InnerText);
                                        if (typeAtt.Value == "missing")
                                            messageValidation += resources.LblRegistrationValidationPrereqNotTaken;
                                        else
                                            messageValidation += resources.LblRegistrationValidationPrereqNotMet;
                                        lstValidationMessageViewModel.Add(CreateValidationMessage(sectionId, messageValidation));
                                    }

                                    XmlNode permissionNode = prereqNode.SelectSingleNode("Permission");
                                    if (permissionNode != null)
                                    {
                                        messageValidation += string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationPrereqPermission,
                                                    permissionNode.SelectSingleNode("FirstName").InnerText,
                                                    permissionNode.SelectSingleNode("LastName").InnerText);
                                        if (typeAtt.Value == "missing")
                                            messageValidation += resources.LblRegistrationValidationPrereqPermission1;
                                        else
                                            messageValidation += resources.LblRegistrationValidationPrereqPermission2;
                                        lstValidationMessageViewModel.Add(CreateValidationMessage(sectionId, messageValidation));
                                    }

                                    XmlNode testNode = prereqNode.SelectSingleNode("Test");
                                    if (testNode != null)
                                    {
                                        messageValidation += string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationTestPermission,
                                                    testNode.SelectSingleNode("@TestId").InnerText,
                                                    testNode.SelectSingleNode("Description").InnerText);
                                        if (typeAtt.Value == "missing")
                                        {
                                            messageValidation += resources.LblRegistrationValidationPrereqNotTaken;
                                        }
                                        else
                                        {
                                            decimal minimumScore = Convert.ToDecimal(testNode.SelectSingleNode("MinimumScore").InnerText, CultureInfo.CurrentCulture);
                                            messageValidation += string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationPrereqTest2,
                                            testNode.SelectSingleNode("MinimumScore").InnerText != "" ? FormatHelper.ToDecimal(minimumScore, formatProvider) : "");
                                        }
                                        lstValidationMessageViewModel.Add(CreateValidationMessage(sectionId, messageValidation));
                                    }

                                    #endregion Prerequisite is missing
                                }

                                #endregion prereqNodeForeach
                            }
                            if (prereqs.Length == 12)
                                prereqs = prereqs.Substring(0, prereqs.Length - 12);
                            else
                                prereqs = prereqs.Substring(0, prereqs.Length - 13);
                        }
                    }
                }
            }
            return lstValidationMessageViewModel;
        }

        /// <summary>
        /// Gets the time conflict message.
        /// </summary>
        /// <param name="xmlNode">The XML node.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="lstValidationMessageViewModel">The LST validation message view model.</param>
        /// <returns>
        /// Collection ValidationMessageViewModel
        /// </returns>
        private static Collection<ValidationMessageViewModel> GetTimeConflictMessage(XmlNode xmlNode, int sectionId, ValidationMessagesResources resources,
            Collection<ValidationMessageViewModel> lstValidationMessageViewModel)
        {
            string messageValidation = string.Empty;
            XmlNodeList timeConflictNodes =
                xmlNode.ParentNode.SelectNodes("Error[@Type='TimeConflict' and SectionId=" + sectionId.ToString(_formatProvider) + "]");
            if (timeConflictNodes?.Count > 0)
            {
                foreach (XmlNode node in timeConflictNodes)
                {
                    messageValidation = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationTimeConflict,
                                                    node.SelectSingleNode("ConflictingEventId").InnerText,
                                                    node.SelectSingleNode("ConflictingSubType").InnerText,
                                                    node.SelectSingleNode("ConflictingSection").InnerText);
                    lstValidationMessageViewModel.Add(CreateValidationMessage(sectionId, messageValidation));
                }
            }
            return lstValidationMessageViewModel;
        }

        /// <summary>
        /// Reads the XML registrationMessage.
        /// </summary>
        /// <param name="registrationResult">The registration result.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        private static Collection<ValidationMessageViewModel> ReadXMLError(string registrationResult, ValidationMessagesResources resources, InstitutionSettings.General general)
        {
            Collection<ValidationMessageViewModel> lstValidationMessageViewModel = new();
            XmlDocument xmlDoc = new();
            xmlDoc.LoadXml(registrationResult);
            XmlNodeList sectionList = xmlDoc.SelectNodes("SessionErrors/Error/SectionId");
            _formatProvider = CultureInfo.CurrentCulture;
            //Get All SectionIds and build
            Collection<int> sections = new();
            foreach (XmlNode node in sectionList)
            {
                if (!sections.Contains(Convert.ToInt32(node.InnerText, _formatProvider)))
                    sections.Add(Convert.ToInt32(node.InnerText, _formatProvider));
            }

            //Credit Limit is not for a specific section.
            ValidationMessageViewModel regMessage = new()
            {
                Message = resources.LblRegistrationValidation
            };
            lstValidationMessageViewModel.Add(regMessage);
            lstValidationMessageViewModel = GetAcademicMissingMessage(xmlDoc.SelectNodes("/SessionErrors/Error[@Type='MissingAcademicRecord']"), resources, lstValidationMessageViewModel);
            if (lstValidationMessageViewModel.Count == 1)
                lstValidationMessageViewModel = GetCreditLimitMessage(xmlDoc.SelectNodes("/SessionErrors/Error[@Type='CreditLimit']"), resources, lstValidationMessageViewModel, general.Credits);
            else
                return lstValidationMessageViewModel;
            for (int i = 0; i < sections.Count; i++)
            {
                regMessage = new()
                {
                    SectionId = sections[i],
                    Message = resources.LblRegistrationValidation
                };
                XmlNode sectionNode = xmlDoc.SelectSingleNode("/SessionErrors/Error[SectionId=" + sections[i].ToString(_formatProvider) + "]");
                regMessage.Description = string.Format(CultureInfo.CurrentCulture, resources.LblRegistrationValidationTitle,
                    sectionNode.SelectSingleNode("EventId").InnerText,
                    sectionNode.SelectSingleNode("SubType").InnerText,
                    sectionNode.SelectSingleNode("Section").InnerText);
                lstValidationMessageViewModel.Add(regMessage);
                foreach (XmlNode xmlNode in sectionList)
                {
                    if (xmlNode.InnerText == sections[i].ToString(_formatProvider))
                    {
                        lstValidationMessageViewModel = GetClassAvailabilityMessage(xmlNode.ParentNode, sections[i], resources, lstValidationMessageViewModel);
                        lstValidationMessageViewModel = GetCrossTallyMessage(xmlNode.ParentNode, sections[i], resources, lstValidationMessageViewModel);
                        lstValidationMessageViewModel = GetCorequisiteMessage(xmlNode.ParentNode, sections[i], resources, lstValidationMessageViewModel);
                        lstValidationMessageViewModel = GetPrerequisiteMessage(xmlNode.ParentNode, sections[i], resources, lstValidationMessageViewModel, general);
                        lstValidationMessageViewModel = GetTimeConflictMessage(xmlNode.ParentNode, sections[i], resources, lstValidationMessageViewModel);
                        break;
                    }
                }
            }
            return lstValidationMessageViewModel;
        }
    }

    #endregion Private Methods
}