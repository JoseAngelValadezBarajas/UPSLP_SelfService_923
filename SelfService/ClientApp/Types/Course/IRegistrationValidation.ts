/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IRegistrationValidation.ts */

import { IValidationMessage } from './IValidationMessage';

export interface IRegistrationValidation {
    isSuccessful: boolean;
    message: string;
    registrationLogId: number;
    validationMessages: IValidationMessage[];
}