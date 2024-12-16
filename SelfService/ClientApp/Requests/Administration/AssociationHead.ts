/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: AssociationHead.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IAssociationHeadSave } from '../../Types/Administration/IAssociationHead';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AssociationHeadRequests = {
    getAssociationHeads(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getAssociationHeads.name, '/AssociationHead', null, resolver, resolveError);
    },
    getAssociationHeadsOptions(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getAssociationHeadsOptions.name, '/CodeTables/Association', null, resolver, resolveError);
    },
    postDeleteAssociationHead(associationHeadId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postDeleteAssociationHead.name, '/AssociationHead/Delete', associationHeadId, resolver, resolveError);
    },
    postFacultyHasAssociations(associationId: number,
        personId: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postFacultyHasAssociations.name,
            '/AssociationHead/FacultyHasAssociation',
            { associationId, personId },
            resolver,
            resolveError
        );
    },
    postSaveAssociationHead(associationHead: IAssociationHeadSave,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postFacultyHasAssociations.name, '/AssociationHead/Save', associationHead, resolver, resolveError);
    }
};

// Export object with the requests
export default AssociationHeadRequests;