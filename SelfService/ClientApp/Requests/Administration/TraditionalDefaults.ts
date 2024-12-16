/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: TraditionalDefaults.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITraditionalDefaults } from '../../Types/TraditionalDefaults/ITraditionalDefaults';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';
import { RegistrationType } from '../../Types/ConEdDefaults/IConEdDefaults';

// Functions for requests
const TraditionalDefaultsRequests = {
    getSettings(registrationType: RegistrationType,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, `/AcademicDefault/${registrationType}`, resolver, resolveError);
    },
    postSaveSettings(settings: ITraditionalDefaults, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        const academicDefault = {
            allowDefaultRegistration: settings.allowDefaultRegistration,
            classLevelId: settings.classLevelId,
            collegeId: settings.collegeId,
            creditLimit: settings.creditLimit,
            curriculumId: settings.curriculumId,
            degreeId: settings.degreeId,
            departmentId: settings.departmentId,
            populationId: settings.populationId,
            programId: settings.programId,
            registrationType: settings.registrationType,
            settingId: settings.settingId
        };
        Request.post(this.postSaveSettings.name, '/AcademicDefault/Save', academicDefault, resolver, resolveError);
    }
};

// Export object with the requests
export default TraditionalDefaultsRequests;