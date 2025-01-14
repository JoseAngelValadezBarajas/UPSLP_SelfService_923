/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IInquiry.ts */

// Types
import { IApplicationActivity } from '../Applications/IApplicationActivity';
import { IApplicationAddress } from '../Applications/IApplicationAddress';
import { IApplicationEducation } from '../Applications/IApplicationEducation';
import { IApplicationIpeds } from '../Applications/IApplicationIpeds';
import { IApplicationPhoneList } from '../Applications/IApplicationPhoneList';
import { IApplicationProgram } from '../Applications/IApplicationProgram';
import { IApplicationUserDefined } from '../Applications/IApplicationUserDefined';

export interface IInquiry {
    addresses: IApplicationAddress[];
    inquiryId?: number;
    collegeAttendStatus?: number;
    counselorId?: number;
    countryOfBirth?: number;
    dateOfBirth?: string;
    education: IApplicationEducation[];
    email?: string;
    employerEndDateId?: string;
    employerStartDateId?: string;
    employerNameId?: string;
    employerPositionId?: string;
    ethnicity?: number;
    firstName?: string;
    formerLastName?: string;
    gender?: string;
    governmentId?: string;
    ipeds?: IApplicationIpeds[];
    isInterestedInExtracurricular?: boolean;
    isInterestedInFinancialAid?: boolean;
    isRetired?: boolean;
    isSeekingDegree?: boolean;
    lastName?: string;
    lastNamePrefix?: string;
    legalName?: string;
    maritalStatus?: number;
    middleName?: string;
    monthsInCountry?: number;
    nickname?: string;
    passportCountryId?: number;
    passportNumber?: string;
    passportExpiration?: string;
    period?: number;
    phones: IApplicationPhoneList[];
    phoneCountry?: string;
    phoneNumberId?: string;
    phoneType?: string;
    policy?: boolean;
    prefix?: number;
    primaryCitizenship?: number;
    primaryLanguage?: number;
    programs?: IApplicationProgram[];
    religion?: number;
    secondaryCitizenship?: number;
    secondaryLanguage?: number;
    suffix?: number;
    userDefined: IApplicationUserDefined[];
    veteranStatus?: number;
    visa?: number;
    visaCountryId?: number;
    visaNumber?: string;
    visaExpiration?: string;
    activities?: IApplicationActivity[];
    foodPlanInterest?: boolean;
    dormPlanInterest?: boolean;
    dormCampus?: number;
    dormBuilding?: number;
    academicInterests?: number[];
    academicYear?: number;
    dateOfEntry?: string;
    inquiryFormSettingId?: number;
    inquiryStatusId?: number;
    isCriminalConviction?: boolean;
    licenseNumber?: string;
    licenseStateId?: number;
    personId?: number;
    portOfEntry?: string;
    sessionPeriodId?: number;
    sevisNumber?: string;
    sources?: number[];
    status?: number;
    submittedDate?: string;
    termPeriodId?: number;
}