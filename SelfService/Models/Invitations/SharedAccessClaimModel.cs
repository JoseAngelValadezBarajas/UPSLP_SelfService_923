// --------------------------------------------------------------------
// <copyright file="SharedAccessClaimModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Invitations
{
    /// <summary>
    /// SharedAccessClaimModel
    /// </summary>
    public class SharedAccessClaimModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [academic plan].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [academic plan]; otherwise, <c>false</c>.
        /// </value>
        public bool AcademicPlan { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [activity grades].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [activity grades]; otherwise, <c>false</c>.
        /// </value>
        public bool ActivityGrades { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="SharedAccessClaimModel"/> is address.
        /// </summary>
        /// <value>
        ///   <c>true</c> if address; otherwise, <c>false</c>.
        /// </value>
        public bool Address { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="SharedAccessClaimModel"/> is balance.
        /// </summary>
        /// <value>
        ///   <c>true</c> if balance; otherwise, <c>false</c>.
        /// </value>
        public bool Balance { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [financial aid].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [financial aid]; otherwise, <c>false</c>.
        /// </value>
        public bool FinancialAid { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [grade report].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [grade report]; otherwise, <c>false</c>.
        /// </value>
        public bool GradeReport { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="SharedAccessClaimModel"/> is schedule.
        /// </summary>
        /// <value>
        ///   <c>true</c> if schedule; otherwise, <c>false</c>.
        /// </value>
        public bool Schedule { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [stop list].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [stop list]; otherwise, <c>false</c>.
        /// </value>
        public bool StopList { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="SharedAccessClaimModel"/> is transcript.
        /// </summary>
        /// <value>
        ///   <c>true</c> if transcript; otherwise, <c>false</c>.
        /// </value>
        public bool Transcript { get; set; }
    }
}