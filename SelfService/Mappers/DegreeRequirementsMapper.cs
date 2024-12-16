// --------------------------------------------------------------------
// <copyright file="DegreeRequirementsMapper.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Course;
using SelfService.Models.DegreeRequirements;
using System;
using System.Collections.Generic;

namespace SelfService.Mappers
{
    /// <summary>
    /// A mapper to format the data from DTOs to ViewModels(namespace SelfService.Models.DegreeRequirements)
    /// </summary>
    internal static class DegreeRequirementsMapper
    {
        /// <summary>
        /// Map from StudentDegreeRequirement to StudentDegReqViewModel.
        /// </summary>
        /// <param name="studentDegreeRequirementsDTO">The student degree requirements dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static StudentDegReqViewModel ToViewModel(this StudentDegreeRequirement studentDegreeRequirementsDTO, InstitutionSettings.General general)
        {
            if (studentDegreeRequirementsDTO == null)
                return null;
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
            StudentDegReqViewModel studentDegReqViewModel = new()
            {
                Id = studentDegreeRequirementsDTO.Id,
                MatricYear = studentDegreeRequirementsDTO.MatricYear,
                MatricTerm = studentDegreeRequirementsDTO.MatricTerm,
                TermCode = studentDegreeRequirementsDTO.TermCode,
                ProgramDesc = studentDegreeRequirementsDTO.ProgramDesc,
                ProgramCode = studentDegreeRequirementsDTO.ProgramCode,
                DegreeDesc = studentDegreeRequirementsDTO.DegreeDesc,
                DegreeCode = studentDegreeRequirementsDTO.DegreeCode,
                CoursesMax = studentDegreeRequirementsDTO.CoursesMax,
                CoursesMin = studentDegreeRequirementsDTO.CoursesMin,
                CreditsMax = FormatHelper.ToCredits(studentDegreeRequirementsDTO.CreditsMax, general.Credits),
                CreditMin = FormatHelper.ToCredits(studentDegreeRequirementsDTO.CreditMin, general.Credits),
                CreditsRemaining = FormatHelper.ToCredits(studentDegreeRequirementsDTO.CreditsRemaining, general.Credits),
                CreditsTaken = FormatHelper.ToCredits(studentDegreeRequirementsDTO.CreditsTaken, general.Credits),
                CurriculumDesc = studentDegreeRequirementsDTO.CurriculumDesc,
                CurriculumCode = studentDegreeRequirementsDTO.CurriculumCode,
                FormalTitle = studentDegreeRequirementsDTO.FormalTitle,
                OverallGpa = FormatHelper.ToGpa(studentDegreeRequirementsDTO.OverallGpa, general.GPA),
                DegreeGpa = FormatHelper.ToGpa(studentDegreeRequirementsDTO.DegreeGpa, general.GPA),
                PercentageCourses = studentDegreeRequirementsDTO.CoursesMax > 0 ?
                    FormatHelper.ToDecimal((studentDegreeRequirementsDTO.CoursesTaken * 100) / studentDegreeRequirementsDTO.CoursesMax, formatProvider) : string.Empty,
                PercentageDisciplines = studentDegreeRequirementsDTO.DisciplinesRequired > 0 ?
                    FormatHelper.ToDecimal((studentDegreeRequirementsDTO.DisciplinesComplete * 100) / studentDegreeRequirementsDTO.DisciplinesRequired, formatProvider) : string.Empty,
                ProgramOfStudyId = studentDegreeRequirementsDTO.ProgramOfStudyId
            };

            if (studentDegreeRequirementsDTO.CreditsTaken != 0)
            {
                decimal credits = studentDegreeRequirementsDTO.CreditsTaken * 100;
                studentDegReqViewModel.CreditsCompletedValue
                    = studentDegreeRequirementsDTO.CreditMin > 0 ? credits / studentDegreeRequirementsDTO.CreditMin : 0;
            }
            else
                studentDegReqViewModel.CreditsCompletedValue = 0;

            studentDegReqViewModel.CreditsCompleted
                    = FormatHelper.ToDecimal(studentDegReqViewModel.CreditsCompletedValue, formatProvider);

            studentDegReqViewModel.Discipline = studentDegreeRequirementsDTO.DisciplineList?.Count ?? 0;

            #region Discipline

            List<DisciplineViewModel> disciplineViewModelList = new();
            DisciplineViewModel disciplineViewModel = null;
            if (studentDegreeRequirementsDTO.DisciplineList?.Count > 0)
            {
                foreach (Discipline disciplineDTO in studentDegreeRequirementsDTO.DisciplineList)
                {
                    disciplineViewModel = new DisciplineViewModel
                    {
                        Id = disciplineDTO.Id,
                        StudentDegreeRequirementId = disciplineDTO.StudentDegreeRequirementId,
                        Description = disciplineDTO.Description,
                        CreditMax = FormatHelper.ToCredits(disciplineDTO.CreditMax, general.Credits),
                        CreditMin = FormatHelper.ToCredits(disciplineDTO.CreditMin, general.Credits),
                        CreditsRemaining = FormatHelper.ToCredits(disciplineDTO.CreditsRemaining, general.Credits),
                        CreditsTaken = FormatHelper.ToCredits(disciplineDTO.CreditsTaken, general.Credits)
                    };

                    if (disciplineDTO.CreditsTaken != 0)
                    {
                        decimal credits = disciplineDTO.CreditsTaken * 100;
                        disciplineViewModel.CreditsCompletedValue
                            = disciplineDTO.CreditMin > 0 ? credits / disciplineDTO.CreditMin : 0;
                    }
                    else
                        disciplineViewModel.CreditsCompletedValue = 0;

                    disciplineViewModel.CreditsCompleted
                        = FormatHelper.ToDecimal(disciplineViewModel.CreditsCompletedValue, formatProvider);

                    #region Classification

                    List<ClassificationViewModel> classificationViewModelList = new();
                    ClassificationViewModel classificationViewModel = null;
                    foreach (Classification classificationDTO in disciplineDTO.ClassificationList)
                    {
                        classificationViewModel = new ClassificationViewModel
                        {
                            Id = classificationDTO.Id,
                            Description = classificationDTO.Description,
                            CreditMin = FormatHelper.ToCredits(classificationDTO.CreditMin, general.Credits),
                            CreditMax = FormatHelper.ToCredits(classificationDTO.CreditMax, general.Credits),
                            CreditsRemaining = FormatHelper.ToCredits(classificationDTO.CreditsRemaining, general.Credits),
                            CreditsTaken = classificationDTO.CreditsTaken > 0 ?
                                FormatHelper.ToCredits(classificationDTO.CreditsTaken, general.Credits) : string.Empty
                        };

                        if (classificationDTO.CreditsTaken != 0)
                        {
                            decimal credits = classificationDTO.CreditsTaken * 100;
                            classificationViewModel.CreditsCompletedValue
                                = classificationDTO.CreditMin > 0 ? credits / classificationDTO.CreditMin : 0;
                        }
                        else
                        {
                            classificationViewModel.CreditsCompletedValue = 0;
                            classificationViewModel.CreditsTaken = FormatHelper.ToCredits(0, general.Credits);
                        }

                        classificationViewModel.CreditsCompleted
                            = FormatHelper.ToDecimal(classificationViewModel.CreditsCompletedValue, formatProvider);

                        #region CourseEvent

                        List<CourseEventViewModel> courseEventViewModelList = new();
                        CourseEventViewModel courseEvent = null;

                        if (classificationDTO.CourseEventList != null)
                        {
                            foreach (CourseEvent courseEventDTO in classificationDTO.CourseEventList)
                            {
                                courseEvent = new CourseEventViewModel
                                {
                                    ClassificationKey = courseEventDTO.ClassificationKey,
                                    CloseParens = courseEventDTO.CloseParens,
                                    Credits = courseEventDTO.Credits > 0 ? FormatHelper.ToCredits(courseEventDTO.Credits, general.Credits) : string.Empty,
                                    EnrolledSeq = courseEventDTO.EnrolledSeq,
                                    EventSubType = courseEventDTO.EventSubType,
                                    FinalGrade = courseEventDTO.IsComplete ? courseEventDTO.FinalGrade : string.Empty,
                                    Id = courseEventDTO.Id,
                                    IsComplete = courseEventDTO.IsComplete,
                                    IsInProgress = courseEventDTO.IsInProgress,
                                    IsNotInProgress = courseEventDTO.IsNotInProgress,
                                    IsRequired = courseEventDTO.IsRequired,
                                    LogicalOperator = courseEventDTO.LogicalOperator,
                                    MinGrade = courseEventDTO.MinGrade,
                                    Name = courseEventDTO.Name,
                                    OpenParens = courseEventDTO.OpenParens,
                                    SubTypeDescription = courseEventDTO.SubTypeDescription,
                                    TakenEventId = courseEventDTO.TakenEventId,
                                    TakenSection = courseEventDTO.TakenSection,
                                    TakenSession = courseEventDTO.TakenSession,
                                    TakenSubtype = courseEventDTO.TakenSubtype,
                                    TakenTerm = courseEventDTO.TakenTerm,
                                    TakenYear = courseEventDTO.TakenYear
                                };
                                courseEvent.Concurrent = courseEventDTO.Concurrent ?? true;
                                courseEventViewModelList.Add(courseEvent);
                            }
                        }
                        classificationViewModel.CourseEventList = courseEventViewModelList;

                        #endregion CourseEvent

                        classificationViewModelList.Add(classificationViewModel);
                    }
                    disciplineViewModel.ClassificationList = classificationViewModelList;

                    foreach (ClassificationViewModel classification in classificationViewModelList)
                    {
                        int openParens = 0;

                        foreach (CourseEventViewModel courseEvent in classification.CourseEventList)
                        {
                            int closeParens = 0;

                            if (courseEvent.OpenParens.Length > 0 || courseEvent.CloseParens.Length > 0)
                            {
                                openParens += courseEvent.OpenParens.Split('(').Length - 1;
                                closeParens += courseEvent.CloseParens.Split(')').Length - 1;
                                courseEvent.SpacesCount = openParens;
                                openParens -= closeParens;
                            }
                            else
                            {
                                courseEvent.SpacesCount = openParens;
                            }
                        }
                    }

                    #endregion Classification

                    disciplineViewModelList.Add(disciplineViewModel);
                }
            }
            studentDegReqViewModel.DisciplineList = disciplineViewModelList;

            #endregion Discipline

            if (studentDegreeRequirementsDTO.SectionsNotCounted != null)
            {
                studentDegReqViewModel.SectionsNotCounted = new List<CourseEventViewModel>();
                CourseEventViewModel sectionViewModel = null;
                foreach (CourseEvent section in studentDegreeRequirementsDTO.SectionsNotCounted)
                {
                    sectionViewModel = new CourseEventViewModel
                    {
                        Id = section.Id,
                        Name = section.Name,
                        EventSubType = section.EventSubType,
                        Credits = section.Credits > 0 ?
                            FormatHelper.ToCredits(section.Credits, general.Credits) : string.Empty,
                        IsComplete = section.IsComplete,
                        IsInProgress = section.IsInProgress,
                        MinGrade = section.MinGrade,
                        TakenEventId = section.TakenEventId,
                        TakenSection = section.TakenSection,
                        TakenSession = section.TakenSession,
                        TakenSubtype = section.TakenSubtype,
                        TakenTerm = section.TakenTerm,
                        TakenYear = section.TakenYear
                    };
                    studentDegReqViewModel.SectionsNotCounted.Add(sectionViewModel);
                }
            }
            return studentDegReqViewModel;
        }
    }
}