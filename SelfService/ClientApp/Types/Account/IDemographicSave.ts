/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IDemographicSave.ts */

export interface IDemographicSave {
    citizenshipDesc?: string;
    citizenshipId?: number;
    countryOfBirthDesc?: string;
    countryOfBirthId?: number;
    demographicFormId?: number;
    ethnicityDesc?: string;
    ethnicityId?: number;
    genderId?: number;
    isRetired?: boolean;
    language?: string;
    languageId?: number;
    maritalStatusDesc?: string;
    maritalStatusId?: number;
    monthsInCountry?: number;
    religionDesc?: string;
    religionId?: number;
    secondaryCitizenshipDesc?: string;
    secondaryCitizenshipId?: number;
    secondaryLanguageDesc?: string;
    secondaryLanguageId?: number;
    veteranDesc?: string;
    veteranId?: number;
    visaDesc?: string;
    visaId?: number;
}