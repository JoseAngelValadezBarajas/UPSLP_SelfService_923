/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: CourseTemplates.ts */

// Types
import { IAssignments } from '../../Types/Section/IAssignments';
import { IAssignmentTypes } from '../../Types/Section/IAssignmentTypes';
import { ICourseTemplateAddActivities } from '../../Types/Department/ICourseTemplateAddActivities';
import { ICourseTemplatesAssignCoursesSave } from '../../Types/Department/ICourseTemplatesAssignCoursesSave';
import { ICourseTemplatesAssignmentSearch } from '../../Types/Department/ICourseTemplatesAssignmentSearch';
import { ICourseTemplateSetup } from '../../Types/Department/ICourseTemplateSetup';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const CourseTemplatesRequests = {
    getAssignFilters(resolver: (json: string) => void): void {
        Request.post(this.getTemplates.name, '/CourseTemplates/Options', null, resolver);
    },
    getAssignedCourses(templateId: number, startIndex: number, length: number, resolver: (json: string) => void): void {
        Request.post(this.getAssignedCourses.name, '/CourseTemplates/Assign/List', { templateId, startIndex, length }, resolver);
    },
    getGradeActivity(resolver: (json: string) => void): void {
        Request.get(this.getGradeActivity.name, '/CodeTables/GradeActivity', resolver);
    },
    getSetupActivities(sectionId: number, resolver: (json: string) => void): void {
        Request.get(this.getSetupActivities.name, `/Sections/${sectionId}/Activities`, resolver);
    },
    getPeriods(resolver: (json: string) => void): void {
        Request.post(this.getPeriods.name, '/Periods/CourseTemplates', null, resolver);
    },
    getTemplates(sessionPeriodId: number, startIndex: number, length: number, resolver: (json: string) => void): void {
        Request.post(this.getTemplates.name, '/CourseTemplates/List', { sessionPeriodId, startIndex, length }, resolver);
    },
    getTemplate(id: number, resolver: (json: string) => void): void {
        Request.post(this.getTemplate.name, '/CourseTemplates', id, resolver);
    },
    getTemplateOptions(sessionPeriodId: number, assignmentTemplateHeader: number, resolver: (json: string) => void): void {
        Request.post(this.getTemplateOptions.name, '/CourseTemplates/Assignment/Options', { sessionPeriodId, assignmentTemplateHeader }, resolver);
    },
    postSearchCourses(assignmentSearch: ICourseTemplatesAssignmentSearch, startIndex: number, length: number, resolver: (json: string) => void): void {
        Request.post(this.getTemplates.name, '/Sections/CourseTemplates', { startIndex, length, assignmentSearch }, resolver);
    },
    postCopyAssignments(fromTemplateId: number, toTemplateId: number, resolver: (json: string) => void): void {
        Request.post(this.postCopyAssignments.name, '/CourseTemplates/Assignment/Copy', { fromTemplateId, toTemplateId }, resolver);
    },
    postCreateShare(assignmentTemplateHeaders: number[], sharedTo: number, resolver: (json: string) => void): void {
        Request.post(this.postCreateShare.name, '/CourseTemplates/Share/Create', { assignmentTemplateHeaders, sharedTo }, resolver);
    },
    postShareList(assignmentTemplateHeaderId: number, resolver: (json: string) => void): void {
        Request.post(this.postShareList.name, '/CourseTemplates/Share/List', assignmentTemplateHeaderId, resolver);
    },
    postDeleteAssignmentShare(id: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteAssignmentShare.name, '/CourseTemplates/Share/Delete', id, resolver);
    },
    postDeleteTemplate(id: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteTemplate.name, '/CourseTemplates/Delete', id, resolver);
    },
    postDeleteActivity(id: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteActivity.name, '/CourseTemplates/Assignment/Delete', id, resolver);
    },
    postDeleteAllActivities(id: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteAllActivities.name, '/CourseTemplates/Assignment/DeleteAll', id, resolver);
    },
    postDeleteAssignedCourse(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteAssignedCourse.name, '/CourseTemplates/Assign/Delete', sectionId, resolver);
    },
    postSaveActivity(assignment: IAssignments, templateId: number, useManualWeights: boolean, resolver: (json: string) => void): void {
        Request.post(this.postSaveActivity.name, '/CourseTemplates/Assignment/Create', { assignment, templateId, useManualWeights }, resolver);
    },
    postSaveActivities(assignmentList: IAssignments[], assignmentTypeList: IAssignmentTypes[], resolver: (json: string) => void): void {
        Request.post(this.postSaveActivities.name, '/CourseTemplates/Assignment/Update', { assignmentList, assignmentTypeList }, resolver);
    },
    postSaveAssingCourses(assignSections: ICourseTemplatesAssignCoursesSave[], resolver: (json: string) => void): void {
        Request.post(this.postSaveTemplate.name, '/CourseTemplates/Assign', assignSections, resolver);
    },
    postSaveTemplate(assignmentTemplate: ICourseTemplateSetup, resolver: (json: string) => void): void {
        Request.post(this.postSaveTemplate.name, '/CourseTemplates/Save', assignmentTemplate, resolver);
    },
    postValidateActivityName(assignment: ICourseTemplateAddActivities, templateId: number, resolver: (json: string) => void): void {
        Request.post(this.postValidateActivityName.name, '/CourseTemplates/Assignment/IsValidName', { assignment, templateId }, resolver);
    }
};

// Export object with the requests
export default CourseTemplatesRequests;