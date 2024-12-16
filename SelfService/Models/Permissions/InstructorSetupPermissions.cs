// --------------------------------------------------------------------
// <copyright file="InstructorSetupPermissions.cs" company="Ellucian">
//     Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    /// <summary>
    /// InstructorSetupPermissions
    /// </summary>
    public class InstructorSetupPermissions
    {
        /// <summary>
        /// Get or sets the permission for the InstructorSettings tab.
        /// </summary>
        /// /// <value>
        ///   <c>true</c> if you are allowed to access; otherwise, <c>false</c>.
        /// </value>
        public bool AdvisorWarnings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [association faculty dossier].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [association faculty dossier]; otherwise, <c>false</c>.
        /// </value>
        public bool AssociationFacultyDossier { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [association head].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [association head]; otherwise, <c>false</c>.
        /// </value>
        public bool AssociationHead { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [campus coordinator].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [campus coordinator]; otherwise, <c>false</c>.
        /// </value>
        public bool CampusCoordinator { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [campus coordinator faculty dossier].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [campus coordinator faculty dossier]; otherwise, <c>false</c>.
        /// </value>
        public bool CampusCoordinatorFacultyDossier { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [course management].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [course management]; otherwise, <c>false</c>.
        /// </value>
        public bool CourseManagement { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [department head].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [department head]; otherwise, <c>false</c>.
        /// </value>
        public bool DepartmentHead { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [department head faculty dossier].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [department head faculty dossier]; otherwise, <c>false</c>.
        /// </value>
        public bool DepartmentHeadFacultyDossier { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="InstructorSetupPermissions"/> is offices.
        /// </summary>
        /// <value>
        ///   <c>true</c> if offices; otherwise, <c>false</c>.
        /// </value>
        public bool Offices { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [offices faculty dossier].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [offices faculty dossier]; otherwise, <c>false</c>.
        /// </value>
        public bool OfficesFacultyDossier { get; set; }
    }
}