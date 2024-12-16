// --------------------------------------------------------------------
// <copyright file="AvatarViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Shared
{
    /// <summary>
    /// AvatarViewModel
    /// </summary>
    public class AvatarViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AvatarViewModel" /> class.
        /// </summary>
        public AvatarViewModel()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="AvatarViewModel"/> class.
        /// </summary>
        /// <param name="avatarViewModel">The avatar view model.</param>
        public AvatarViewModel(AvatarViewModel avatarViewModel)
        {
            this.ColorFirstLetter = avatarViewModel.ColorFirstLetter;
            this.FirstLetter = avatarViewModel.FirstLetter;
            this.FullName = avatarViewModel.FullName;
            this.HasPicture = avatarViewModel.HasPicture;
            this.PeopleId = avatarViewModel.PeopleId;
            this.Percentage = avatarViewModel.Percentage;
            this.PersonId = avatarViewModel.PersonId;
        }

        /// <summary>
        /// Gets or sets the color first letter.
        /// </summary>
        /// <value>
        /// The color first letter.
        /// </value>
        public int ColorFirstLetter { get; set; }

        /// <summary>
        /// Gets or sets the first letter.
        /// </summary>
        /// <value>
        /// The first letter.
        /// </value>
        public string FirstLetter { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has picture.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has picture; otherwise, <c>false</c>.
        /// </value>
        public bool HasPicture { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }

        /// <summary>
        /// Gets or sets the percentage.
        /// </summary>
        /// <value>
        /// The percentage.
        /// </value>
        public string Percentage { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int? PersonId { get; set; }
    }
}