/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: GradeMappings.ts */

// Types
import { ISectionGradeMapping } from '../../Types/Section/ISectionGradeMapping';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const GradeMappingsRequests = {
    getGradeMappings(sectionId: number, resolver: (json: string) => void): void {
        Request.get(this.getGradeMappings.name, `/Sections/GradeMappings/${sectionId}`, resolver);
    },
    getGradeMappingsAdministration(resolver: (json: string) => void): void {
        Request.post(this.getGradeMappingsAdministration.name, '/GradeMappings', null, resolver);
    },
    getGradeMappingsCopyCourses(sectionId: number, sessionPeriodId: number, resolver: (json: string) => void): void {
        Request.post(this.getGradeMappingsCopyCourses.name, '/GradeMappings/Copy/Courses', { sectionId, sessionPeriodId }, resolver);
    },
    getGradeMappingsCopyPeriods(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getGradeMappingsCopyPeriods.name, '/GradeMappings/Copy/Periods', sectionId, resolver);
    },
    postApplyDefaults(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.postApplyDefaults.name, '/Sections/GradeMappings/ApplyDefaults', sectionId, resolver);
    },
    postGradeMappingsCopy(sourceSectionId: number, destinationSectionId: number, resolver: (json: string) => void): void {
        Request.post(this.postGradeMappingsCopy.name, '/GradeMappings/Copy/Save', { sourceSectionId, destinationSectionId }, resolver);
    },
    postDeleteAll(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteAll.name, '/Sections/GradeMappings/Delete', sectionId, resolver);
    },
    postGradeMappings(sectionId: number, mappingList: ISectionGradeMapping[], resolver: (json: string) => void): void {
        Request.post(this.postGradeMappings.name, '/Sections/GradeMappings', { sectionId, mappingList }, resolver);
    },
    postGradeMappingsAdministration(gradeMappings: ISectionGradeMapping[], resolver: (json: string) => void): void {
        Request.post(this.postGradeMappingsAdministration.name, '/GradeMappings/Save', gradeMappings, resolver);
    }
};

// Export object with the requests
export default GradeMappingsRequests;