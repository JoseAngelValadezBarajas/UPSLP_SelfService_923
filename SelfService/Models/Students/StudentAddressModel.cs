// --------------------------------------------------------------------
// <copyright file="StudentAddressModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Students
{
    /// <summary>
    /// StudentAddressModel class
    /// </summary>
    public class StudentAddressModel
    {
        /// <summary>
        /// Gets or sets the address type identifier.
        /// </summary>
        /// <value>
        /// The address type identifier.
        /// </value>
        public int AddressTypeId { get; set; }

        /// <summary>
        /// Gets or sets the sequence number.
        /// </summary>
        /// <value>
        /// The sequence number.
        /// </value>
        public int SequenceNumber { get; set; }
    }
}