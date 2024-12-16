// --------------------------------------------------------------------
// <copyright file="IReportHelper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Registration;
using SelfService.Models.Schedule;
using System.Collections.Generic;

namespace SelfService.Helpers.Interfaces
{
    /// <summary>
    /// The Report Helper Interface.
    /// </summary>
    public interface IReportHelper
    {
        byte[] GetPagoReferAdmission(int _IdApp);
        /// <summary>
        /// Gets the academic plan.
        /// </summary>
        /// <param name="academicPlanReport">The academic plan report.</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        byte[] GetAcademicPlan(AcademicPlanReportModel academicPlanReport, string language);

        /// <summary>
        /// Gets the class list.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="status">The status.</param>
        /// <param name="currentNameFormat">The current name format.</param>
        /// <param name="currentNameSort">The current name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        byte[] GetClassList(int sectionId, int status, string currentNameFormat, string currentNameSort, bool showMiddleNameInitial, string language);

        /// <summary>
        /// Gets the faculty schedule.
        /// </summary>
        /// <param name="traditionalSessions">The traditional sessions.</param>
        /// <param name="conEdSections">The con ed sections.</param>
        /// <param name="fullName">The full name.</param>
        /// <param name="period">The period.</param>
        /// <param name="conEd">if set to <c>true</c> [con ed].</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        byte[] GetFacultySchedule(List<FacultyScheduleBySessionViewModel> traditionalSessions, List<FacultyScheduleViewModel> conEdSections, string fullName, string period, bool conEd, string language);

        /// <summary>
        /// Gets the grades.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="termPeriodId">The term period identifier.</param>
        /// <param name="language">The language.</param>
        /// <param name="sequence">The sequence.</param>
        /// <returns></returns>
        byte[] GetGrades(int id, int termPeriodId, string language, string sequence = null);

        /// <summary>
        /// Gets the statements.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <param name="statementNumber">The statement number.</param>
        /// <param name="currentNameFormat">The current name format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        byte[] GetStatements(int personId, int statementNumber, string currentNameFormat, bool showMiddleNameInitial, string language);

        /// <summary>
        /// Gets the student schedule.
        /// </summary>
        /// <param name="peopleYearTermSession">The people year term session.</param>
        /// <param name="currentNameFormat">The current name format.</param>
        /// <param name="currentNameSort">The current name sort.</param>
        /// <param name="filter">The filter.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        byte[] GetStudentSchedule(PeopleYearTermSessionModel peopleYearTermSession, string currentNameFormat, string currentNameSort, int filter, bool showMiddleNameInitial, string language);

        /// <summary>
        /// Gets the unofficial transcript.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="currentNameFormat">The current name format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        byte[] GetUnofficialTranscript(int id, string currentNameFormat, bool showMiddleNameInitial, string language);

        /// <summary>
        /// Obtiene el reporte de referencia de pago
        /// ipasos 08/20/2024
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        byte[] GetPaymentReference(string PersonId, string academicYear, string academicTerm, string academicSession, string FilterText);
    }
}