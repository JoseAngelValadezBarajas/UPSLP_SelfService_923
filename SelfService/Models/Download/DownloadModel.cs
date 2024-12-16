// --------------------------------------------------------------------
// <copyright file="DownloadModel.cs" company="Ellucian">
//     Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Download
{
    /// <summary>
    /// DownloadModel
    /// </summary>
    public class DownloadModel
    {
        /// <summary>
        /// Gets or sets the name of the file.
        /// </summary>
        /// <value>
        /// The name of the file.
        /// </value>
        public string FileName { get; set; }

        /// <summary>
        /// Gets or sets the type of the file.
        /// </summary>
        /// <value>
        /// The type of the file.
        /// </value>
        public EnumDownloadFileType FileType { get; set; }

        /// <summary>
        /// Gets or sets the view.
        /// </summary>
        /// <value>
        /// The view.
        /// </value>
        public EnumDownloadView View { get; set; }
    }

    #region Enumerators

    /// <summary>
    /// EnumDownloadFileType
    /// </summary>
    public enum EnumDownloadFileType
    {
        /// <summary>
        /// The HTML file type
        /// </summary>
        Html = 0,

        /// <summary>
        /// The Word file type
        /// </summary>
        Doc = 1,

        /// <summary>
        /// The Excel file type
        /// </summary>
        Xls = 2,

        /// <summary>
        /// The tab separated file type
        /// </summary>
        Tsv = 3,

        /// <summary>
        /// The comma separated file type
        /// </summary>
        Csv = 4,

        /// <summary>
        /// The new Word file type
        /// </summary>
        Docx = 5,

        /// <summary>
        /// The new Excel file type
        /// </summary>
        Xlsx = 6
    }

    /// <summary>
    /// EnumDownloadView
    /// </summary>
    public enum EnumDownloadView
    {
        /// <summary>
        /// The manage advisees
        /// </summary>
        ManageAdvisees = 0,

        /// <summary>
        /// The manage my students
        /// </summary>
        ManageMyStudents = 1,

        /// <summary>
        /// The manage my associations
        /// </summary>
        ManageMyAssociations = 2,

        /// <summary>
        /// The manage all students
        /// </summary>
        ManageAllStudents = 3,

        /// <summary>
        /// The manage former advisees
        /// </summary>
        ManageFormerAdvisees = 4,

        /// <summary>
        /// The manage alumni
        /// </summary>
        ManageAlumni = 5,

        /// <summary>
        /// The manage my campus
        /// </summary>
        ManageMyCampus = 6,

        /// <summary>
        /// The class list
        /// </summary>
        ClassList = 7,

        /// <summary>
        /// The class list with Add status
        /// </summary>
        ClassListAdd = 8,

        /// <summary>
        /// The class list with Drop status
        /// </summary>
        ClassListDrop = 9,

        /// <summary>
        /// The class list with Hold status
        /// </summary>
        ClassListHold = 10,

        /// <summary>
        /// The overall grades
        /// </summary>
        OverallGrades = 11,

        /// <summary>
        /// The overall grades statistics
        /// </summary>
        OverallGradesStatistics = 12,

        /// <summary>
        /// The violations
        /// </summary>
        Violations = 13,

        /// <summary>
        /// The attendance
        /// </summary>
        Attendance = 14,

        /// <summary>
        /// The manage my department
        /// </summary>
        ManageMyDepartment = 15,

        /// <summary>
        /// The attendance daily
        /// </summary>
        AttendanceDaily = 16,

        /// <summary>
        /// The manage my shared advisees
        /// </summary>
        ManageMySharedAdvisees = 17
    }

    #endregion Enumerators
}