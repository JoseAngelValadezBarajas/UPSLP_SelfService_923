// --------------------------------------------------------------------
// <copyright file="AcademicDefaultViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Administration.Setup
{
    /// <summary>
    /// AcademicDefaultViewModel
    /// </summary>
    public class AcademicDefaultViewModel
    {
        /// <summary>
        /// Gets or sets the allow default registration.
        /// </summary>
        /// <value>
        /// The allow default registration.
        /// </value>
        public bool AllowDefaultRegistration { get; set; }

        /// <summary>
        /// Gets the application decision.
        /// </summary>
        /// <value>
        /// The application decision.
        /// </value>
        public int? ApplicationDecision { get; internal set; }

        /// <summary>
        /// Gets the application decision view model list.
        /// </summary>
        /// <value>
        /// The application decision view model list.
        /// </value>
        public List<ListOptionViewModel> ApplicationDecisionViewModelList { get; internal set; }

        /// <summary>
        /// Gets the application status.
        /// </summary>
        /// <value>
        /// The application status.
        /// </value>
        public int? ApplicationStatus { get; internal set; }

        /// <summary>
        /// Gets the application status view model list.
        /// </summary>
        /// <value>
        /// The application status view model list.
        /// </value>
        public List<ListOptionViewModel> ApplicationStatusViewModelList { get; internal set; }

        /// <summary>
        /// Gets or sets the class level.
        /// </summary>
        /// <value>
        /// The class level.
        /// </value>
        public int? ClassLevelId { get; set; }

        /// <summary>
        /// Gets or sets the class level view model list.
        /// </summary>
        /// <value>
        /// The class level view model list.
        /// </value>
        public List<ListOptionViewModel> ClassLevelViewModelList { get; set; }

        /// <summary>
        /// Gets or sets the college.
        /// </summary>
        /// <value>
        /// The college.
        /// </value>
        public int? CollegeId { get; set; }

        /// <summary>
        /// Gets or sets the college view model list.
        /// </summary>
        /// <value>
        /// The college view model list.
        /// </value>
        public List<ListOptionViewModel> CollegeViewModelList { get; set; }

        /// <summary>
        /// Gets or sets the credit limit.
        /// </summary>
        /// <value>
        /// The credit limit.
        /// </value>
        public string CreditLimit { get; set; }

        /// <summary>
        /// Gets or sets the curriculum.
        /// </summary>
        /// <value>
        /// The curriculum.
        /// </value>
        public int CurriculumId { get; set; }

        /// <summary>
        /// Gets or sets the curriculum view model list.
        /// </summary>
        /// <value>
        /// The curriculum view model list.
        /// </value>
        public List<ListOptionViewModel> CurriculumViewModelList { get; set; }

        /// <summary>
        /// Gets or sets the degree.
        /// </summary>
        /// <value>
        /// The degree.
        /// </value>
        public int DegreeId { get; set; }

        /// <summary>
        /// Gets or sets the degree view model list.
        /// </summary>
        /// <value>
        /// The degree view model list.
        /// </value>
        public List<ListOptionViewModel> DegreeViewModelList { get; set; }

        /// <summary>
        /// Gets or sets the department.
        /// </summary>
        /// <value>
        /// The department.
        /// </value>
        public int? DepartmentId { get; set; }

        /// <summary>
        /// Gets or sets the department view model list.
        /// </summary>
        /// <value>
        /// The department view model list.
        /// </value>
        public List<ListOptionViewModel> DepartmentViewModelList { get; set; }

        /// <summary>
        /// Gets the non trad program identifier.
        /// </summary>
        /// <value>
        /// The non trad program identifier.
        /// </value>
        public int? NonTradProgramId { get; internal set; }

        /// <summary>
        /// Gets the non trad program view model list.
        /// </summary>
        /// <value>
        /// The non trad program view model list.
        /// </value>
        public List<ListOptionViewModel> NonTradProgramViewModelList { get; internal set; }

        /// <summary>
        /// Gets or sets the population.
        /// </summary>
        /// <value>
        /// The population.
        /// </value>
        public int? PopulationId { get; set; }

        /// <summary>
        /// Gets or sets the population view model list.
        /// </summary>
        /// <value>
        /// The population view model list.
        /// </value>
        public List<ListOptionViewModel> PopulationViewModelList { get; set; }

        /// <summary>
        /// Gets or sets the program.
        /// </summary>
        /// <value>
        /// The program.
        /// </value>
        public int ProgramId { get; set; }

        /// <summary>
        /// Gets or sets the program view model list.
        /// </summary>
        /// <value>
        /// The program view model list.
        /// </value>
        public List<ListOptionViewModel> ProgramViewModelList { get; set; }

        /// <summary>
        /// Gets or sets the type of the registration.
        /// </summary>
        /// <value>
        /// The type of the registration.
        /// </value>
        public RegistrationType RegistrationType { get; set; }

        /// <summary>
        /// Gets or sets the setting identifier.
        /// </summary>
        /// <value>
        /// The setting identifier.
        /// </value>
        public int SettingId { get; set; }
    }
}