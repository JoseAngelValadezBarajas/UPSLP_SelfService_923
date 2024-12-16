// --------------------------------------------------------------------
// <copyright file="AdviseeClaimModel.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Advisees
{
    public class AdviseeClaimModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [academic plan].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [academic plan]; otherwise, <c>false</c>.
        /// </value>
        public bool AcademicPlan { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [academic plan add to cart].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [academic plan add to cart]; otherwise, <c>false</c>.
        /// </value>
        public bool AcademicPlanAddToCart { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="AdviseeClaimModel"/> is agreements.
        /// </summary>
        /// <value>
        ///   <c>true</c> if agreements; otherwise, <c>false</c>.
        /// </value>
        public bool Agreements { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="AdviseeClaimModel"/> is alerts.
        /// </summary>
        /// <value>
        ///   <c>true</c> if alerts; otherwise, <c>false</c>.
        /// </value>
        public bool Alerts { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="AdviseeClaimModel"/> is attendance.
        /// </summary>
        /// <value>
        ///   <c>true</c> if attendance; otherwise, <c>false</c>.
        /// </value>
        public bool Attendance { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [attendance daily attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [attendance daily attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool AttendanceDailyAttendance { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="AdviseeClaimModel"/> is checklist.
        /// </summary>
        /// <value>
        ///   <c>true</c> if checklist; otherwise, <c>false</c>.
        /// </value>
        public bool Checklist { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [checklist create action item].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [checklist create action item]; otherwise, <c>false</c>.
        /// </value>
        public bool ChecklistCreateActionItem { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="AdviseeClaimModel"/> is disabilities.
        /// </summary>
        /// <value>
        ///   <c>true</c> if disabilities; otherwise, <c>false</c>.
        /// </value>
        public bool Disabilities { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [grade report].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [grade report]; otherwise, <c>false</c>.
        /// </value>
        public bool GradeReport { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [grade report coursework].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [grade report coursework]; otherwise, <c>false</c>.
        /// </value>
        public bool GradeReportCoursework { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [advisor has the Registration Summary claim].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [advisor has the Registration Summary claim]; otherwise, <c>false</c>.
        /// </value>
        public bool RegistrationSummary { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="AdviseeClaimModel"/> is schedule.
        /// </summary>
        /// <value>
        ///   <c>true</c> if schedule; otherwise, <c>false</c>.
        /// </value>
        public bool Schedule { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [schedule requests].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [schedule requests]; otherwise, <c>false</c>.
        /// </value>
        public bool ScheduleRequests { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [test scores].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [test scores]; otherwise, <c>false</c>.
        /// </value>
        public bool TestScores { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [unofficial transcript].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [unofficial transcript]; otherwise, <c>false</c>.
        /// </value>
        public bool UnofficialTranscript { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [what if].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [what if]; otherwise, <c>false</c>.
        /// </value>
        public bool WhatIf { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [what if add to cart].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [what if add to cart]; otherwise, <c>false</c>.
        /// </value>
        public bool WhatIfAddToCart { get; set; }
    }
}