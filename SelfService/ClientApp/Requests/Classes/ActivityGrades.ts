/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ActivityGrades.ts */

// Types
import { IStudentActivityGradeToSave } from '../../Types/Section/ISectionActivityGrades';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const ActivityGradesRequests = {
    getActivityGrades(sectionId: number, resolver: (json: string) => void): void {
        Request.get(this.getActivityGrades.name, `/Sections/${sectionId}/ActivityGrades`, resolver);
    },
    getActivityGradesById(sectionId: number, id: number, resolver: (json: string) => void): void {
        Request.get(this.getActivityGradesById.name, `/Sections/${sectionId}/ActivityGrades/${id}`, resolver);
    },
    postSaveActivityGrades(sectionId: number, studentsActivityGrade: IStudentActivityGradeToSave[], resolver: (json: string) => void): void {
        Request.post(this.postSaveActivityGrades.name, '/Sections/ActivityGrades', { sectionId, studentsActivityGrade }, resolver);
    }
};

// Export object with the requests
export default ActivityGradesRequests;