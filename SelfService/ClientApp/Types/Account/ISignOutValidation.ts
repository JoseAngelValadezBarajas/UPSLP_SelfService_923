/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: ISignOutValidation.ts */

import { SignOutRedirectLocation } from "./SignOutRedirectLocation";

export interface ISignOutValidation {
    isSameUser: boolean;
    loggedUserName: string;
    redirectLocation: SignOutRedirectLocation;
    token: string;
}