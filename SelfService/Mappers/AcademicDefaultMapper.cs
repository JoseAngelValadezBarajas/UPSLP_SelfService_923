// --------------------------------------------------------------------
// <copyright file="AcademicDefaultMapper.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Models.Administration.Setup;

namespace SelfService.Mappers
{
    /// <summary>
    /// AcademicDefaultMapper
    /// </summary>
    internal static class AcademicDefaultMapper
    {
        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="academicDefault">The academic default.</param>
        /// <param name="formatCredits">The format credits.</param>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="academicDefaultService">The academic default service.</param>
        /// <returns></returns>
        internal static AcademicDefaultViewModel ToViewModel(this AcademicDefault academicDefault, string formatCredits, ICodeTableService codeTableService, IAcademicDefaultService academicDefaultService)
        {
            return new AcademicDefaultViewModel
            {
                AllowDefaultRegistration = academicDefault.AllowDefaultRegistration,
                ApplicationDecision = academicDefault.ApplicationDecision,
                ApplicationDecisionViewModelList = codeTableService.GetByName(CodeTableName.ApplicationDecision).ToViewModel(true),
                ApplicationStatus = academicDefault.ApplicationStatus,
                ApplicationStatusViewModelList = codeTableService.GetByName(CodeTableName.ApplicationStatus).ToViewModel(true),
                CollegeId = academicDefault.CollegeId,
                CollegeViewModelList = codeTableService.GetByName(CodeTableName.College).ToViewModel(true),
                ClassLevelId = academicDefault.ClassLevelId,
                CreditLimit = FormatHelper.ToCredits(academicDefault.CreditLimit, formatCredits),
                ClassLevelViewModelList = codeTableService.GetByName(CodeTableName.ClassLevel).ToViewModel(true),
                CurriculumId = academicDefault.CurriculumId,
                CurriculumViewModelList = codeTableService.GetByName(CodeTableName.Curriculum).ToViewModel(true),
                DegreeId = academicDefault.DegreeId,
                DegreeViewModelList = codeTableService.GetByName(CodeTableName.Degree).ToViewModel(true),
                DepartmentId = academicDefault.DepartmentId,
                DepartmentViewModelList = codeTableService.GetByName(CodeTableName.Department).ToViewModel(true),
                NonTradProgramId = academicDefault.NonTradProgramId,
                NonTradProgramViewModelList = academicDefaultService.GetNontraditionalPrograms().ToViewModel(true),
                PopulationId = academicDefault.PopulationId,
                PopulationViewModelList = codeTableService.GetByName(CodeTableName.Population).ToViewModel(true),
                ProgramId = academicDefault.ProgramId,
                ProgramViewModelList = codeTableService.GetByName(CodeTableName.Program).ToViewModel(true),
                RegistrationType = academicDefault.RegistrationType,
                SettingId = academicDefault.SettingId
            };
        }
    }
}