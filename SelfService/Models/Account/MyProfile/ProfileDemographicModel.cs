// --------------------------------------------------------------------
// <copyright file="ProfileDemographicModel.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Account.MyProfile
{
    /// <summary>
    /// ProfileDemographicModel class
    /// </summary>
    public class ProfileDemographicModel
    {
        /// <summary>
        /// Gets or sets the citizenship identifier.
        /// </summary>
        /// <value>
        /// The citizenship identifier.
        /// </value>
        public int? CitizenshipId { get; set; }

        /// <summary>
        /// Gets or sets the country of birth identifier.
        /// </summary>
        /// <value>
        /// The country of birth identifier.
        /// </value>
        public int? CountryOfBirthId { get; set; }

        /// <summary>
        /// Gets or sets the demographic form identifier.
        /// </summary>
        /// <value>
        /// The demographic form identifier.
        /// </value>
        public int DemographicFormId { get; set; }

        /// <summary>
        /// Gets or sets the ethnicity identifier.
        /// </summary>
        /// <value>
        /// The ethnicity identifier.
        /// </value>
        public int? EthnicityId { get; set; }

        /// <summary>
        /// Gets or sets the gender.
        /// </summary>
        /// <value>
        /// The gender.
        /// </value>
        public byte? GenderId { get; set; }

        /// <summary>
        /// Gets or sets the is retired.
        /// </summary>
        /// <value>
        /// The is retired.
        /// </value>
        public bool? IsRetired { get; set; }

        /// <summary>
        /// Gets or sets the language identifier.
        /// </summary>
        /// <value>
        /// The language identifier.
        /// </value>
        public int? LanguageId { get; set; }

        /// <summary>
        /// Gets or sets the marital status identifier.
        /// </summary>
        /// <value>
        /// The marital status identifier.
        /// </value>
        public int? MaritalStatusId { get; set; }

        /// <summary>
        /// Gets or sets the months in country.
        /// </summary>
        /// <value>
        /// The months in country.
        /// </value>
        public int? MonthsInCountry { get; set; }

        /// <summary>
        /// Gets or sets the religion identifier.
        /// </summary>
        /// <value>
        /// The religion identifier.
        /// </value>
        public int? ReligionId { get; set; }

        /// <summary>
        /// Gets or sets the secondary citizenship identifier.
        /// </summary>
        /// <value>
        /// The secondary citizenship identifier.
        /// </value>
        public int? SecondaryCitizenshipId { get; set; }

        /// <summary>
        /// Gets or sets the secondary language identifier.
        /// </summary>
        /// <value>
        /// The secondary language identifier.
        /// </value>
        public int? SecondaryLanguageId { get; set; }

        /// <summary>
        /// Gets or sets the veteran identifier.
        /// </summary>
        /// <value>
        /// The veteran identifier.
        /// </value>
        public int? VeteranId { get; set; }

        /// <summary>
        /// Gets or sets the visa identifier.
        /// </summary>
        /// <value>
        /// The visa identifier.
        /// </value>
        public int? VisaId { get; set; }
    }
}