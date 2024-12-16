/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: CampusCoordinator.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ICampusCoordinatorSave } from '../../Types/Administration/ICampusCoordinator';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const CampusCoordinatorRequests = {
    getCampusCoordinators(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getCampusCoordinators.name, '/CampusCoordinators', null, resolver, resolveError);
    },
    getCampusCoordinatorsOptions(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getCampusCoordinatorsOptions.name, '/CodeTables/Campuses', null, resolver, resolveError);
    },
    postFacultyHasCampus(organizationId: number, personId: number,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postFacultyHasCampus.name, '/CampusCoordinators/FacultyHasCampus',
            { organizationId, personId }, resolver, resolveError);
    },
    postDeleteCampusCoordinator(campusCoordinatorId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postDeleteCampusCoordinator.name, '/CampusCoordinators/Delete', campusCoordinatorId, resolver, resolveError);
    },
    postSaveCampusCoordinator(campusCoordinator: ICampusCoordinatorSave,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveCampusCoordinator.name, '/CampusCoordinators/Save', campusCoordinator, resolver, resolveError);
    }
};

// Export object with the requests
export default CampusCoordinatorRequests;