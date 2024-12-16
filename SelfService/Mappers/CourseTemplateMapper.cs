// --------------------------------------------------------------------
// <copyright file="CourseTemplateMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.CourseTemplates;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace SelfService.Mappers
{
    internal static class CourseTemplateMapper
    {
        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="courseTemplatesDTO">The course templates dto.</param>
        /// <returns></returns>
        internal static List<CourseTemplateViewModel> ToViewModel(this List<CourseTemplate> courseTemplatesDTO)
        {
            CourseTemplateViewModel courseTemplateViewModel = null;
            List<CourseTemplateViewModel> courseTemplateViewModels = new();
            if (courseTemplatesDTO?.Count > 0)
            {
                foreach (CourseTemplate courseTemplate in courseTemplatesDTO)
                {
                    courseTemplateViewModel = new CourseTemplateViewModel
                    {
                        HasActivities = courseTemplate.HasActivities,
                        IsAssigned = courseTemplate.IsAssigned,
                        IsAssignedByUser = courseTemplate.IsAssignedByUser,
                        IsRestrictive = courseTemplate.IsRestrictive,
                        IsShared = courseTemplate.IsShared,
                        Name = courseTemplate.Name,
                        TemplateId = courseTemplate.TemplateId,
                        UserIsOwner = courseTemplate.UserIsOwner
                    };
                    courseTemplateViewModels.Add(courseTemplateViewModel);
                }
            }
            return courseTemplateViewModels;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="assignmentTemplatesDTO">The assignment templates dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<AssignmentTemplateShareViewModel> ToViewModel(this List<AssignmentTemplateShare> assignmentTemplatesDTO
            , string nameFormat, string nameSort, string peopleFormat, bool showMiddleNameInitial)
        {
            AssignmentTemplateShareViewModel assignmentTemplateShareViewModel = null;
            List<AssignmentTemplateShareViewModel> assignmentTemplateShareViewModels = new();
            if (assignmentTemplatesDTO?.Count > 0)
            {
                foreach (AssignmentTemplateShare assignmentTemplateShare in assignmentTemplatesDTO)
                {
                    assignmentTemplateShareViewModel = new AssignmentTemplateShareViewModel
                    {
                        AssignmentTemplateShareId = assignmentTemplateShare.Id,
                        Avatar = assignmentTemplateShare.People.ToViewModel(nameFormat, nameSort, showMiddleNameInitial, peopleFormat)
                    };
                    assignmentTemplateShareViewModels.Add(assignmentTemplateShareViewModel);
                }
            }

            return assignmentTemplateShareViewModels;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="assignmentTemplateDTO">The assignment template dto.</param>
        /// <returns></returns>
        internal static AssignmentTemplateViewModel ToViewModel(this AssignmentTemplate assignmentTemplateDTO)
        {
            AssignmentTemplateViewModel assignmentTemplateViewModel = null;
            if (assignmentTemplateDTO != null)
            {
                assignmentTemplateViewModel = new AssignmentTemplateViewModel
                {
                    TemplateId = assignmentTemplateDTO.AssignmentTemplateHeaderId,
                    AssignmentWeightingMethod = assignmentTemplateDTO.AssignmentWeightingMethod,
                    AutomaticOverallGrades = assignmentTemplateDTO.AutomaticOverallGrades,
                    CreatedBy = assignmentTemplateDTO.CreatedBy,
                    DefaultGradeMapping = assignmentTemplateDTO.DefaultGradeMapping,
                    IsDateByAssignmentType = assignmentTemplateDTO.IsDateByAssignmentType,
                    IsRestrictive = assignmentTemplateDTO.IsRestrictive,
                    Name = assignmentTemplateDTO.Name,
                    UseWeightedAssignmentTypes = assignmentTemplateDTO.UseWeightedAssignmentTypes
                };
            }
            return assignmentTemplateViewModel;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="assignmentDepartmentDTO">The assignment department dto.</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns></returns>
        internal static AssignmentDepartmentViewModel ToViewModel(this AssignmentTemplate assignmentDepartmentDTO, string dateTimeCultureFormat)
        {
            AssignmentDepartmentViewModel assignmentDepartmentViewModel = null;
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);
            if (assignmentDepartmentDTO != null)
            {
                assignmentDepartmentViewModel = new AssignmentDepartmentViewModel
                {
                    AssignedByName = assignmentDepartmentDTO.AssignedByName,
                    AssignedDate = FormatHelper.ToShortDate(assignmentDepartmentDTO.AssignedDate, datetimeCulture),
                    IsAutomaticOverallGrades = assignmentDepartmentDTO.AutomaticOverallGrades,
                    Name = assignmentDepartmentDTO.Name
                };
            }
            return assignmentDepartmentViewModel;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="sectionCourseDates">The section course dates.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<AssignmentSectionViewModel> ToViewModel(this List<SectionCourseDate> sectionCourseDates, InstitutionSettings.General general)
        {
            AssignmentSectionViewModel assignmentSectionViewModel = null;
            List<AssignmentSectionViewModel> assignmentSectionViewModels = new();
            if (sectionCourseDates.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                foreach (SectionCourseDate sectionCourseDate in sectionCourseDates)
                {
                    assignmentSectionViewModel = new AssignmentSectionViewModel
                    {
                        EndDate = FormatHelper.ToShortDate(sectionCourseDate.EndDate, datetimeCulture),
                        StartDate = FormatHelper.ToShortDate(sectionCourseDate.StartDate, datetimeCulture),
                        EventId = sectionCourseDate.EventId,
                        EventName = sectionCourseDate.EventName,
                        EventSubType = sectionCourseDate.EventSubType,
                        HasPostedGrades = sectionCourseDate.HasPostedGrades,
                        InstructorNames = sectionCourseDate.InstructorNames,
                        Section = sectionCourseDate.Section,
                        SectionId = sectionCourseDate.SectionId
                    };
                    assignmentSectionViewModels.Add(assignmentSectionViewModel);
                }
            }
            return assignmentSectionViewModels;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="assignments">The assignments.</param>
        /// <param name="isList">if set to <c>true</c> [is list].</param>
        /// <param name="numberCultureFormat">The number culture format.</param>
        /// <returns></returns>
        internal static List<AssignmentViewModel> ToViewModel(this List<Assignment> assignments, bool isList, string numberCultureFormat)
        {
            AssignmentViewModel assignmentViewModel = null;
            List<AssignmentViewModel> assignmentViewModels = new();
            if (isList && assignments.Count > 0)
            {
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(numberCultureFormat);
                foreach (Assignment assignment in assignments)
                {
                    assignmentViewModel = new AssignmentViewModel
                    {
                        AssignmentType = assignment.AssignmentTypeDesc,
                        Description = assignment.Description,
                        PossiblePoints = FormatHelper.ToDecimal(assignment.PossiblePoints, formatProvider),
                        Title = assignment.AssignmentTitle
                    };
                    assignmentViewModels.Add(assignmentViewModel);
                }
            }
            return assignmentViewModels;
        }
    }
}