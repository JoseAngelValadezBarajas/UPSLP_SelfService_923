/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: DossierSetupRequests.ts */

// Types
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { IDossierSetup } from '@hedtech/powercampus-design-system/types/Dossier/IDossierSetup';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const DossierSetupRequests = {
    getDossierSetupViews(resolver: (json: string) => void): void {
        Request.get(this.getDossierSetupViews.name, '/Dossier/Setup/Views', resolver);
    },
    getSetup(dossierType: DossierType, resolver: (json: string) => void): void {
        Request.get(this.getSetup.name, `/Dossiers/Setup/Details/${dossierType}`, resolver);
    },
    saveSetup(adds: IDossierSetup[], deletes: IDossierSetup[], updates: IDossierSetup[],
        resolver: (json: string) => void): void {
        Request.post(this.saveSetup.name, '/Dossiers/Setup/Save', { adds, deletes, updates }, resolver);
    }
};

// Export object with the requests
export default DossierSetupRequests;