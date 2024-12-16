/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApplicationAttachment.ts */
export interface IApplicationAttachment {
    applicationAttachmentId?: number;
    applicationId?: number;
    attachmentTitle: string;
    extension?: string;
    fileContent?: any;
    fileSize: string;
    mediaTypeId?: number;
    mimeType?: string;
}