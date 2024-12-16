/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ConEdDefaults.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IConEdDefaults } from '../../Types/ConEdDefaults/IConEdDefaults';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';
import { RegistrationType } from '../../Types/ConEdDefaults/IConEdDefaults';

// Functions for requests
const ConEdDefaultsRequests = {
    getSettings(registrationType: RegistrationType,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, `/AcademicDefault/${registrationType}`, resolver, resolveError);
    },
    postSaveSettings(settings: IConEdDefaults, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        const academicDefault = {
            applicationDecision: settings.applicationDecision,
            applicationStatus: settings.applicationStatus,
            classLevelId: settings.classLevelId,
            collegeId: settings.collegeId,
            curriculumId: settings.curriculumId,
            degreeId: settings.degreeId,
            departmentId: settings.departmentId,
            nonTradProgramId: settings.nonTradProgramId,
            populationId: settings.populationId,
            programId: settings.programId,
            registrationType: settings.registrationType
        };
        Request.post(this.postSaveSettings.name, '/AcademicDefault/Save', academicDefault, resolver, resolveError);
    }
};

// Export object with the requests
export default ConEdDefaultsRequests;