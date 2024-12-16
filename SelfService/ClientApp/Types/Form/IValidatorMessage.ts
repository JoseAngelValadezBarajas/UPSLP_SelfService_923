/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IValidatorMessage.ts */

export interface IValidatorMessage {
    invalidFormat?: string;
    isDuplicated?: string;
    isPrimary?: string;
    isRequired?: string;
    notNumeric?: string;
    notValid?: string;
    outOfRange?: string;
}