/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IPeopleEmergency.ts */

export interface IPeopleEmergency {
    contactCountry1: string | null;
    contactCountry2: string | null;
    contactCountryDesc1: string;
    contactCountryDesc2: string;
    contactEmail1: string | null;
    contactEmail2: string | null;
    contactName1: string | null;
    contactName2: string | null;
    contactNotes1: string | null;
    contactNotes2: string | null;
    contactPhone1: string | null;
    contactPhone2: string | null;
    contactRel1: string | null;
    contactRel2: string | null;
    contactRelDesc1: string;
    contactRelDesc2: string;
    formattedNumber1?: string;
    formattedNumber2?: string;
    peopleCodeId: string;
    phoneFormat1?: string;
    phoneFormat2?: string;
}

export interface IEmergencyContact {
    contactCountry: string | null;
    contactCountryDesc: string;
    contactCountryModified: boolean;
    contactEmail: string | null;
    contactEmailModified: boolean;
    contactName: string | null;
    contactNameModified: boolean;
    contactNotes: string | null;
    contactNotesModified: boolean;
    contactPhone: string | null;
    contactPhoneModified: boolean;
    contactRel: string | null;
    contactRelDesc: string;
    contactRelModified: boolean;
    contactType: EmergencyContactType;
    emailInvalid: boolean;
    formattedNumber?: string;
    isDuplicated: boolean;
    peopleCodeId: string;
    phoneFormat?: string;
}

export enum EmergencyContactType {
    Primary = 1,
    Secondary = 2
}