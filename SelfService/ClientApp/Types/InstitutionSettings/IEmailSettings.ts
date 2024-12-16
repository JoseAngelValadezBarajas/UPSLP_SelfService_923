/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IEmailSetting.ts */

import { EmailProviderOption, Sender } from "../Enum/EmailProviderOption";

export interface IEmailSettings {
    canEditRecipient: boolean;
    canEditSender: boolean;
    email: string;
    emailProvider: EmailProviderOption;
    sender: Sender;
    staffSeparator: string;
    staffUrl: string;
    studentSeparator: string;
    studentUrl: string;

    // UI
    emailModified?: boolean;
    invalidEmail?: boolean;
    senderModified?: boolean;
    staffSeparatorModified?: boolean;
    staffUrlModified?: boolean;
    studentSeparatorModified?: boolean;
    studentUrlModified?: boolean;
}