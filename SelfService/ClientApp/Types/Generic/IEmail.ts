/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: IEmail.ts */

export interface IEmail {
    message: string;
    to: string;
    from: string;
    subject: string;

    // UI
    invalidRecipientsEmailAddresses?: boolean;
    invalidSenderEmailAddress?: boolean;
    messageModified?: boolean;
    recipientsEmailAddressesModified?: boolean;
    senderEmailAddressModified?: boolean;
    subjectModified?: boolean;
}