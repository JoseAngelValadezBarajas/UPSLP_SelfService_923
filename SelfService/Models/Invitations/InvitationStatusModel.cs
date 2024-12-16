// --------------------------------------------------------------------
// <copyright file="InvitationStatusModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Invitations
{
    /// <summary>
    /// InvitationStatusModel
    /// </summary>
    public class InvitationStatusModel
    {
        /// <summary>
        /// Gets or sets the invitation identifier.
        /// </summary>
        /// <value>
        /// The invitation identifier.
        /// </value>
        public int InvitationId { get; set; }

        /// <summary>
        /// Gets or sets the relative identifier.
        /// </summary>
        /// <value>
        /// The relative identifier.
        /// </value>
        public int RelativeId { get; set; }
    }
}