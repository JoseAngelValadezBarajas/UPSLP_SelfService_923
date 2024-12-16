// --------------------------------------------------------------------
// <copyright file="CoursesMapper.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Course;
using SelfService.Models.Resources;
using SelfService.Models.Section;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Text;

namespace SelfService.Mappers
{
    /// <summary>
    /// A mapper to format the data from DTOs to ViewModels(namespace SelfService.Models.Course)
    /// </summary>
    internal static class CoursesMapper
    {
        /// <summary>
        /// Map from CartItem To CartItemViewModel.
        /// </summary>
        /// <param name="cartItemsDTO">The cart items dto.</param>
        /// <returns></returns>
        internal static List<CartItemViewModel> ToViewModel(this List<CartItem> cartItemsDTO)
        {
            List<CartItemViewModel> cartItemViewModels = new();
            int countConEd = 0;
            CartItemViewModel cartItemViewModel;
            if (cartItemsDTO != null)
            {
                foreach (CartItem cartItem in cartItemsDTO)
                {
                    if (cartItem.IsConEd)
                        countConEd += cartItem.Items;
                    else
                    {
                        cartItemViewModel = new CartItemViewModel
                        {
                            Count = cartItem.Items,
                            Value = $"{cartItem.AcademicYear}/{cartItem.AcademicTerm}",
                            Description = $"{cartItem.AcademicYear}/{cartItem.AcademicTermDesc}",
                            Type = CartItemType.Traditional
                        };
                        cartItemViewModels.Add(cartItemViewModel);
                    }
                }
                if (countConEd > 0)
                {
                    cartItemViewModel = new CartItemViewModel
                    {
                        Count = countConEd,
                        Type = CartItemType.ContinuingEducation
                    };
                    cartItemViewModels.Insert(0, cartItemViewModel);
                }
            }
            return cartItemViewModels;
        }

        /// <summary>
        /// Map from CourseCatalog to CourseCatalogViewModel.
        /// </summary>
        /// <param name="courseCatalogDTO">The course catalog dto.</param>
        /// <param name="resources">The resources for formats.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns>
        /// CourseCatalogViewModel.
        /// </returns>
        internal static CourseCatalogViewModel ToViewModel(this CourseCatalog courseCatalogDTO, DegReqsResources resources,
            string nameFormat, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            CourseCatalogViewModel courseCatalog = new()
            {
                Code = courseCatalogDTO.Code,
                Name = courseCatalogDTO.Name,
                Description = courseCatalogDTO.Description
            };

            #region SubType Section

            if (courseCatalogDTO.SubTypeList.Count > 0)
            {
                IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
                List<SubTypeViewModel> subTypeList = new();
                SubTypeViewModel subType;
                foreach (SubType subTypeDTO in courseCatalogDTO.SubTypeList)
                {
                    subType = new SubTypeViewModel
                    {
                        CourseCatalogCode = subTypeDTO.CourseCatalogCode,
                        Code = subTypeDTO.Code,
                        Name = subTypeDTO.Name,
                        Description = subTypeDTO.Description,
                        Credits = FormatHelper.ToCredits(subTypeDTO.Credits, general.Credits),
                        SortOrder = subTypeDTO.SortOrder
                    };

                    subType.PrerequisiteList = subTypeDTO.PrerequisiteList.ToViewModel(resources, out string prereqCondition, nameFormat,
                        general, showMiddleNameInitial, out List<string> prereqConditionList);
                    subType.PrerequisiteCondition = prereqCondition;

                    subType.CorequisiteList = subTypeDTO.CorequisiteList.ToViewModel(resources.LblSeparator3, resources.LblSeparator4, out string corequisiteCondition);
                    subType.CorequisiteCondition = corequisiteCondition;

                    subType.CreditTypeList = subTypeDTO.CreditTypeList.ToViewModel(resources.LblSeparator3, out string creditTypeCondition);
                    subType.CreditTypeCondition = creditTypeCondition;

                    subType.CourseFeeList = subTypeDTO.CourseFeeList.ToViewModel(resources.LblSeparator3, resources.LblSeparator4, formatCurrency, out string courseFeeCondition);
                    subType.CourseFeeCondition = courseFeeCondition;

                    subTypeList.Add(subType);
                }
                courseCatalog.SubTypeList = subTypeList;
            }

            #endregion SubType Section

            return courseCatalog;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="courseCatalogList">The course catalog list.</param>
        /// <returns></returns>
        internal static CourseCatalogViewModelList ToViewModel(this CourseCatalogList courseCatalogList)
        {
            CourseCatalogViewModelList courseCatalogViewModelList = new();
            List<CourseCatalogViewModel> courseCatalogListViewModel = new();
            CourseCatalogViewModel courseCatalogViewModel = null;
            foreach (CourseCatalogItem row in courseCatalogList.Courses)
            {
                courseCatalogViewModel = new()
                {
                    Code = row.Code,
                    Name = row.Name,
                    Description = row.Description,
                    Subtypes = row.Subtypes?.Count > 0 ? string.Join(", ", row.Subtypes) : string.Empty
                };
                courseCatalogListViewModel.Add(courseCatalogViewModel);
            }
            courseCatalogViewModelList.CourseCatalogList = courseCatalogListViewModel;
            courseCatalogViewModelList.OverallCount = courseCatalogList.OverallCount;
            return courseCatalogViewModelList;
        }

        /// <summary>
        /// Map from List(Prerequisite) to List(PrerequisiteViewModel).
        /// </summary>
        /// <param name="prerequisiteListDTO">The list of prerequisits dto.</param>
        /// <param name="resources">The resources for formats.</param>
        /// <param name="condition">The prerequisits condition.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="conditionList">The condition list.</param>
        /// <returns></returns>
        internal static List<PrerequisiteViewModel> ToViewModel(this List<Prerequisite> prerequisiteListDTO, DegReqsResources resources,
            out string condition, string nameFormat, InstitutionSettings.General general, bool showMiddleNameInitial, out List<string> conditionList)
        {
            List<PrerequisiteViewModel> prerequisiteList = null;
            StringBuilder prerequisiteListCondition = new();
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
            conditionList = new List<string>();
            if (prerequisiteListDTO.Count > 0)
            {
                prerequisiteList = new List<PrerequisiteViewModel>();
                PrerequisiteViewModel prerequisite = null;
                CourseEventViewModel courseEvent = null;
                AvatarViewModel instructor = null;
                TestScoreViewModel testScore = null;
                StringBuilder prerequisiteCondition = null;
                foreach (Prerequisite prerequisiteDTO in prerequisiteListDTO)
                {
                    prerequisite = new PrerequisiteViewModel
                    {
                        Id = prerequisiteDTO.Id
                    };

                    #region CourseEvent Section

                    courseEvent = new CourseEventViewModel
                    {
                        Id = prerequisiteDTO.Course.Id,
                        Name = prerequisiteDTO.Course.Name,
                        EventSubType = prerequisiteDTO.Course.EventSubType,
                        SubTypeDescription = prerequisiteDTO.Course.SubTypeDescription,
                        MinimumCredits = prerequisiteDTO.Course.MinimumCredits != null ? FormatHelper.ToCredits(prerequisiteDTO.Course.MinimumCredits, general.Credits) : string.Empty,
                        Concurrent = prerequisiteDTO.Course.Concurrent,
                        MinGrade = prerequisiteDTO.Course.MinGrade
                    };
                    prerequisite.CourseEvent = courseEvent;

                    #endregion CourseEvent Section

                    #region Instructor Section

                    instructor = new AvatarViewModel
                    {
                        PersonId = prerequisiteDTO.Instructor.PersonId ?? null,
                        Percentage = FormatHelper.ToDecimal(prerequisiteDTO.Instructor.Percentage, formatProvider)
                    };
                    instructor.FullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(
                        new string[]
                        {
                            prerequisiteDTO.Instructor.Prefix,
                            prerequisiteDTO.Instructor.FirstName,
                            prerequisiteDTO.Instructor.MiddleName,
                            prerequisiteDTO.Instructor.LastNamePrefix,
                            prerequisiteDTO.Instructor.LastName,
                            prerequisiteDTO.Instructor.DisplayName,
                            prerequisiteDTO.Instructor.Pronoun,
                            prerequisiteDTO.Instructor.Suffix
                        }), nameFormat, showMiddleNameInitial);
                    prerequisite.Instructor = instructor;

                    #endregion Instructor Section

                    #region Test Score Section

                    testScore = new TestScoreViewModel
                    {
                        Id = prerequisiteDTO.TestScore.Id,
                        Type = prerequisiteDTO.TestScore.Type,
                        Description = prerequisiteDTO.TestScore.Description,
                        MinimumScore = FormatHelper.ToDecimal(prerequisiteDTO.TestScore.MinimumScore, formatProvider)
                    };
                    prerequisite.TestScore = testScore;

                    #endregion Test Score Section

                    #region Prerequisite Condition

                    prerequisiteCondition = new StringBuilder();

                    if (!prerequisiteCondition.Equals(""))
                        prerequisiteCondition.Append(resources.LblSeparator4);

                    prerequisiteCondition.Append(prerequisiteDTO.OpenParens);

                    switch (prerequisiteDTO.Type)
                    {
                        case "C":
                            prerequisite.PrerequisiteType = PrerequisiteType.Course;
                            prerequisiteCondition.AppendFormat(resources.FormatSeparator1, prerequisite.CourseEvent.Id, prerequisite.CourseEvent.SubTypeDescription);
                            if (!prerequisite.CourseEvent.MinGrade.Equals(""))
                                prerequisiteCondition.AppendFormat(resources.FormatMinGrade, prerequisite.CourseEvent.MinGrade);
                            if (decimal.Parse(prerequisite.CourseEvent.MinimumCredits) > decimal.Zero)
                                prerequisiteCondition.AppendFormat(resources.FormatMinCredit, prerequisite.CourseEvent.MinimumCredits);
                            if (prerequisite.CourseEvent.Concurrent ?? true)
                                prerequisiteCondition.Append(resources.LblConcurrent);
                            break;

                        case "P":
                            prerequisite.PrerequisiteType = PrerequisiteType.Permission;
                            prerequisiteCondition.AppendFormat(resources.LblInstructorPermissionRequired, prerequisite.Instructor.FullName);
                            break;

                        case "T":
                            prerequisite.PrerequisiteType = PrerequisiteType.TestScore;
                            prerequisiteCondition.AppendFormat(resources.FormatSeparator1, prerequisite.TestScore.Id, prerequisite.TestScore.Description);
                            prerequisiteCondition.AppendFormat(resources.FormatMinScore, prerequisite.TestScore.MinimumScore);
                            break;
                    }

                    prerequisiteCondition.Append(prerequisiteDTO.CloseParens);

                    if (!prerequisiteDTO.LogicalOperator.Trim().Equals(""))
                    {
                        prerequisiteCondition.Append(resources.LblSeparator4);
                        prerequisiteCondition.Append(prerequisiteDTO.LogicalOperator.Equals("A") ? resources.LblAnd : resources.LblOr);
                        prerequisiteCondition.Append(resources.LblSeparator4);
                    }

                    prerequisite.PrerequisiteCondition = prerequisiteCondition.ToString();
                    prerequisiteListCondition.Append(prerequisiteCondition);
                    conditionList.Add(prerequisiteCondition.ToString());

                    #endregion Prerequisite Condition

                    prerequisiteList.Add(prerequisite);
                }
            }

            condition = prerequisiteListCondition.ToString();
            return prerequisiteList;
        }

        /// <summary>
        /// Map from List(Corequisite) to List(CorequisiteViewModel).
        /// </summary>
        /// <param name="corequisiteListDTO">The list of corequisits dto.</param>
        /// <param name="separator1">The separator1.</param>
        /// <param name="separator2">The separator2.</param>
        /// <param name="condition">The condition.</param>
        /// <returns></returns>
        internal static List<CorequisiteViewModel> ToViewModel(this List<Corequisite> corequisiteListDTO, string separator1, string separator2, out string condition)
        {
            StringBuilder conditionList = new();
            List<CorequisiteViewModel> corequisiteList = null;
            if (corequisiteListDTO.Count > 0)
            {
                corequisiteList = new List<CorequisiteViewModel>();
                CorequisiteViewModel corequisite = null;
                foreach (Corequisite corequisiteDTO in corequisiteListDTO)
                {
                    if (conditionList.Length > 0)
                        conditionList.Append(separator1);
                    corequisite = new CorequisiteViewModel
                    {
                        EventId = corequisiteDTO.EventId,
                        SubType = corequisiteDTO.SubType,
                        SubTypeDescription = corequisiteDTO.SubTypeDescription
                    };
                    conditionList.Append(corequisite.EventId);
                    conditionList.Append(separator2);
                    conditionList.Append(corequisite.SubTypeDescription);

                    corequisiteList.Add(corequisite);
                }
            }
            condition = conditionList.ToString();
            return corequisiteList;
        }

        /// <summary>
        /// Map from List(CreditType) to List(CreditTypeViewModel).
        /// </summary>
        /// <param name="creditTypeListDTO">The list of credit types dto.</param>
        /// <param name="separator">The separator.</param>
        /// <param name="condition">The condition.</param>
        /// <returns></returns>
        internal static List<CreditTypeViewModel> ToViewModel(this List<CreditType> creditTypeListDTO, string separator, out string condition)
        {
            StringBuilder conditionList = new();
            List<CreditTypeViewModel> creditTypeList = null;
            if (creditTypeListDTO.Count > 0)
            {
                creditTypeList = new List<CreditTypeViewModel>();
                CreditTypeViewModel creditType = null;
                foreach (CreditType creditTypeDTO in creditTypeListDTO)
                {
                    if (conditionList.Length > 0)
                        conditionList.Append(separator);
                    creditType = new CreditTypeViewModel
                    {
                        Type = creditTypeDTO.Type,
                        Description = creditTypeDTO.Description
                    };
                    conditionList.Append(creditType.Description);

                    creditTypeList.Add(creditType);
                }
            }
            condition = conditionList.ToString();
            return creditTypeList;
        }

        /// <summary>
        /// Map from List(CourseFee) to List(CourseFeeViewModel).
        /// </summary>
        /// <param name="courseFeeListDTO">The list of fees for the course dto.</param>
        /// <param name="separator1">The separator1.</param>
        /// <param name="separator2">The separator2.</param>
        /// <param name="formatCurrency">The format currency.</param>
        /// <param name="condition">The condition.</param>
        /// <returns></returns>
        internal static List<CourseFeeViewModel> ToViewModel(this List<CourseFee> courseFeeListDTO, string separator1, string separator2,
            IFormatProvider formatCurrency, out string condition)
        {
            StringBuilder conditionList = new();
            List<CourseFeeViewModel> courseFeeList = null;
            if (courseFeeListDTO.Count > 0)
            {
                courseFeeList = new List<CourseFeeViewModel>();
                CourseFeeViewModel courseFee = null;
                foreach (CourseFee courseFeeDTO in courseFeeListDTO)
                {
                    if (conditionList.Length > 0)
                        conditionList.Append(separator1);
                    courseFee = new CourseFeeViewModel
                    {
                        Amount = FormatHelper.ToCurrency(courseFeeDTO.Amount, formatCurrency),
                        ChargeDescription = courseFeeDTO.ChargeDescription,
                        FeeType = courseFeeDTO.FeeType
                    };
                    conditionList.Append(courseFee.ChargeDescription);
                    conditionList.Append(separator2);
                    conditionList.Append(courseFee.Amount);

                    courseFeeList.Add(courseFee);
                }
            }
            condition = conditionList.ToString();
            return courseFeeList;
        }

        /// <summary>
        /// Map from TakenCourseEvent to TakenCourseEventViewModel
        /// </summary>
        /// <param name="takenCourseEventDTO">The taken course event dto.</param>
        /// <param name="status">The status.</param>
        /// <param name="formatCredits">The format credits.</param>
        /// <returns></returns>
        internal static TakenCourseEventViewModel ToViewModel(this TakenCourseEvent takenCourseEventDTO, string status, string formatCredits)
        {
            TakenCourseEventViewModel takenCourse = null;
            if (takenCourseEventDTO != null)
            {
                return new TakenCourseEventViewModel
                {
                    Credits = FormatHelper.ToCredits(takenCourseEventDTO.Credits, formatCredits),
                    EventId = takenCourseEventDTO.Id,
                    EventName = takenCourseEventDTO.Name,
                    FinalGrade = takenCourseEventDTO.FinalGrade,
                    Section = takenCourseEventDTO.Section,
                    Session = takenCourseEventDTO.SessionDesc,
                    Status = status,
                    SubType = takenCourseEventDTO.EventSubType,
                    YearTerm = $"{takenCourseEventDTO.Year}/{takenCourseEventDTO.TermDesc}"
                };
            }
            return takenCourse;
        }

        /// <summary>
        /// Converts CourseCatalogSearchOption to viewmodel.
        /// </summary>
        /// <param name="catalogSearchOptionDTO">The catalog search option dto.</param>
        /// <returns></returns>
        internal static CatalogSearchOptionsViewModel ToViewModel(this CourseCatalogSearchOption catalogSearchOptionDTO)
        {
            CatalogSearchOptionsViewModel catalogSearchOptionsViewModel = null;
            if (catalogSearchOptionDTO != null)
            {
                catalogSearchOptionsViewModel = new()
                {
                    ClassLevels = catalogSearchOptionDTO.ClassLevels.ToViewModel(),
                    Colleges = catalogSearchOptionDTO.Colleges.ToViewModel(),
                    CreditTypes = catalogSearchOptionDTO.CreditTypes.ToViewModel(true),
                    Curriculums = catalogSearchOptionDTO.Curriculums.ToViewModel(),
                    Departments = catalogSearchOptionDTO.Departments.ToViewModel(),
                    NontraditionalPrograms = catalogSearchOptionDTO.NontraditionalPrograms.ToViewModel(),
                    Populations = catalogSearchOptionDTO.Populations.ToViewModel(),
                    Programs = catalogSearchOptionDTO.Programs.ToViewModel(),
                    SubTypes = catalogSearchOptionDTO.SubTypes.ToViewModel()
                };
            }
            return catalogSearchOptionsViewModel;
        }
    }
}