// --------------------------------------------------------------------
// <copyright file="SectionViolationViewModel.cs" company="Ellucian">
//     Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Downloads;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionViolationViewModel
    /// </summary>
    public class SectionViolationViewModel : AvatarViewModel
    {
        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the violation category list.
        /// </summary>
        /// <value>
        /// The violation category list.
        /// </value>
        public List<ViolationCategoriesViewModel> ViolationCategoryList { get; set; }

        /// <summary>
        /// Gets or sets the violation list.
        /// </summary>
        /// <value>
        /// The violation list.
        /// </value>
        public List<ViolationViewModel> ViolationList { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [with drawn].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [with drawn]; otherwise, <c>false</c>.
        /// </value>
        public bool Withdrawn { get; set; }
    }

    /// <summary>
    /// ViolationCategoriesViewModel
    /// </summary>
    public class ViolationCategoriesViewModel
    {
        /// <summary>
        /// Gets or sets the violation category.
        /// </summary>
        /// <value>
        /// The violation category.
        /// </value>
        public string ViolationCategory { get; set; }

        /// <summary>
        /// Gets or sets the violation category identifier.
        /// </summary>
        /// <value>
        /// The violation category identifier.
        /// </value>
        public int ViolationCategoryId { get; set; }
    }

    /// <summary>
    /// ViolationViewModel
    /// </summary>
    public class ViolationViewModel
    {
        /// <summary>
        /// Gets or sets the created date.
        /// </summary>
        /// <value>
        /// The created date.
        /// </value>
        public string CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is editable.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is editable; otherwise, <c>false</c>.
        /// </value>
        public bool IsEditable { get; set; }

        /// <summary>
        /// Gets or sets the display name of the reported by.
        /// </summary>
        /// <value>
        /// The display name of the reported by.
        /// </value>
        public string ReportedByFullName { get; set; }

        /// <summary>
        /// Gets or sets the violation category identifier.
        /// </summary>
        /// <value>
        /// The violation category identifier.
        /// </value>
        public int ViolationCategoryId { get; set; }

        /// <summary>
        /// Gets or sets the violation date.
        /// </summary>
        /// <value>
        /// The violation date.
        /// </value>
        public string ViolationDate { get; set; }

        /// <summary>
        /// Gets or sets the violation date table.
        /// </summary>
        /// <value>
        /// The violation date table.
        /// </value>
        public string ViolationDateTable { get; set; }

        /// <summary>
        /// Gets or sets the violation identifier.
        /// </summary>
        /// <value>
        /// The violation identifier.
        /// </value>
        public int ViolationId { get; set; }

        /// <summary>
        /// Gets or sets the type of the violation.
        /// </summary>
        /// <value>
        /// The type of the violation.
        /// </value>
        public string ViolationType { get; set; }

        /// <summary>
        /// Gets or sets the violation type identifier.
        /// </summary>
        /// <value>
        /// The violation type identifier.
        /// </value>
        public int ViolationTypeId { get; set; }
    }

    #region Violations Download

    /// <summary>
    /// SectionViolationDownload
    /// </summary>
    public class SectionViolationDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the resources.
        /// </summary>
        /// <value>
        /// The resources.
        /// </value>
        public SectionViolationResources Resources { get; set; }

        /// <summary>
        /// Gets or sets the students.
        /// </summary>
        /// <value>
        /// The students.
        /// </value>
        public List<StudentViolationDownloadModel> Students { get; set; }
    }

    /// <summary>
    /// StudentViolationDownloadModel
    /// </summary>
    public class StudentViolationDownloadModel
    {
        /// <summary>
        /// Gets or sets the category desc.
        /// </summary>
        /// <value>
        /// The category desc.
        /// </value>
        public string CategoryDesc { get; set; }

        /// <summary>
        /// Gets or sets the date.
        /// </summary>
        /// <value>
        /// The date.
        /// </value>
        public string Date { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }

        /// <summary>
        /// Gets or sets the violation desc.
        /// </summary>
        /// <value>
        /// The violation desc.
        /// </value>
        public string ViolationDesc { get; set; }

        /// <summary>
        /// Gets or sets the withdrawn.
        /// </summary>
        /// <value>
        /// The withdrawn.
        /// </value>
        public bool Withdrawn { get; set; }
    }

    #endregion Violations Download
}