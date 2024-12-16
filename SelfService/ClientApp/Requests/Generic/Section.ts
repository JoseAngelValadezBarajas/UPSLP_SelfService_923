/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: Section.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Functions for requests
const SectionRequests = {
    getSection(id: number, withIsCartable: boolean, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getSection.name, '/Sections/Details', { id, withIsCartable, impersonateInfo}, resolver);
    },
    getSectionAnonymous(id: number, resolver: (json: string) => void): void {
        Request.post(this.getSectionAnonymous.name, '/Sections/AnonymousDetails', id, resolver);
    },
    getSectionInstructors(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getSectionInstructors.name, '/Sections/Instructors', sectionId, resolver);
    }
};

// Export object with the requests
export default SectionRequests;