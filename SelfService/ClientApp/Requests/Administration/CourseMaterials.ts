/* Copyright 2023 Ellucian Company L.P. and its affiliates.
 * File: CourseMaterials.ts */

//Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ICourseMaterialsSettings } from '../../Types/InstitutionSettings/ICourseMaterialsSettings';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const CourseMaterialsRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getSettings.name, '/Settings/CourseMaterials', null, resolver, resolveError);
    },
    postSaveSettings(settings: ICourseMaterialsSettings, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/CourseMaterials/Save', settings, resolver, resolveError);
    }
};

export default CourseMaterialsRequests;