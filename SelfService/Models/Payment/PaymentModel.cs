// --------------------------------------------------------------------
// <copyright file="PaymentModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Advancement;
using Hedtech.PowerCampus.Core.DTO.Student;
using System.Collections.Generic;

namespace SelfService.Models.Payment
{
    /// <summary>
    /// PaymentModel
    /// </summary>
    public class PaymentModel
    {
        /// <summary>
        /// Gets or sets the gift campaigns.
        /// </summary>
        /// <value>
        /// The gift campaigns.
        /// </value>
        public List<GiftCampaign> GiftCampaigns { get; set; }

        /// <summary>
        /// Gets or sets the payment request.
        /// </summary>
        /// <value>
        /// The payment request.
        /// </value>
        public PaymentRequestModel PaymentRequest { get; set; }

        /// <summary>
        /// Gets or sets the request transcripts.
        /// </summary>
        /// <value>
        /// The request transcripts.
        /// </value>
        public List<TranscriptRequestRecipient> RequestTranscripts { get; set; }
    }
}