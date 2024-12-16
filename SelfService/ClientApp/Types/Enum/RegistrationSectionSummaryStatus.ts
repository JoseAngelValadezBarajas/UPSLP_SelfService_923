/* Copyright 2023 Ellucian Company L.P. and its affiliates.
 * File: RegistrationSectionSummaryStatus.ts */

export enum RegistrationSectionSummaryStatus {
    None = 0,
    InCartAuthorizationNeeded = 1,
    AwaitingApproval = 2,
    DropPendingApproval = 3,
    DropDenied = 4,
    Registered = 5,
    Denied = 6,
    Removed = 7,
    Dropped = 8,
    RegistrationPeriodEnded = 9
}