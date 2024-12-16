/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ActivitiesSetup.ts */

// Types
import { IAssignments } from '../../Types/Section/IAssignments';
import { ISaveActivities } from '../../Types/Section/ISaveActivities';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const ActivitiesSetupRequests = {
    getGradeActivity(resolver: (json: string) => void): void {
        Request.get(this.getGradeActivity.name, '/CodeTables/GradeActivity', resolver);
    },
    getSectionsAssignments(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getSectionsAssignments.name, '/Sections/Assignments', sectionId, resolver);
    },
    getSectionsCourse(sectionId: number, sessionPeriodId: number, resolver: (json: string) => void): void {
        Request.post(this.getSectionsCourse.name, '/Sections/CopyActivities/Courses', { sectionId, sessionPeriodId }, resolver);
    },
    getSectionsPeriods(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getSectionsPeriods.name, '/Sections/CopyActivities/Periods', sectionId, resolver);
    },
    getSetupActivities(sectionId: number, resolver: (json: string) => void): void {
        Request.get(this.getSetupActivities.name, `/Sections/${sectionId}/Activities`, resolver);
    },
    postDeleteActivity(id: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteActivity.name, '/Sections/Activity/Delete', id, resolver);
    },
    postDeleteActivities(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteActivities.name, '/Sections/Activities/Delete', sectionId, resolver);
    },
    postSaveActivity(sectionAssignment: IAssignments, resolver: (json: string) => void): void {
        Request.post(this.postSaveActivity.name, '/Sections/Activity/Save', sectionAssignment, resolver);
    },
    postSaveActivities(sectionAssignmentSetup: ISaveActivities, resolver: (json: string) => void): void {
        Request.post(this.postSaveActivities.name, '/Sections/Activities/Save', sectionAssignmentSetup, resolver);
    },
    postSaveActivitiesCopy(sourceSectionId: number, destinationSectionId: number, resolver: (json: string) => void): void {
        Request.post(this.postSaveActivitiesCopy.name, '/Sections/CopyActivities/Save',
            { sourceSectionId, destinationSectionId }, resolver);
    },
    postUpdateWeightType(sectionAssignment: IAssignments, resolver: (json: string) => void): void {
        Request.post(this.postUpdateWeightType.name, '/Sections/Activities/Weight/Save', sectionAssignment, resolver);
    },
    postValidateActivityName(sectionAssignment: IAssignments, resolver: (json: string) => void): void {
        Request.post(this.postValidateActivityName.name, '/Sections/Activities/ValidateName', sectionAssignment, resolver);
    }
};

// Export object with the requests
export default ActivitiesSetupRequests;