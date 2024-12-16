// --------------------------------------------------------------------
// <copyright file="PeopleModel.cs" company="Ellucian">
//     Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Account;
using SelfService.Models.Pagination;

namespace SelfService.Models.Students
{
    /// <summary>
    /// PeopleModel class
    /// </summary>
    public class PeopleModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the impersonate information.
        /// </summary>
        /// <value>
        /// The impersonate information.
        /// </value>
        public ImpersonateInfoModel ImpersonateInfo { get; set; }
    }
}