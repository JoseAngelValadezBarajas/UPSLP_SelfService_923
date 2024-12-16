/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: OverallGrades.ts */

// Types
import { IGradeComment } from '../../Types/Classes/IGradeComment';
import { IOverallGradeList } from '../../Types/Section/IOverallGradeList';
import { IOverallGradesSaveChange } from '../../Types/Section/IOverallGradesSaveChange';
import { ISectionApproveGrade } from '../../Types/Section/ISectionApproveGrade';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const OverallGradesRequests = {
    getApproveGrades(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getApproveGrades.name, '/Sections/ApproveGrades/Students', sectionId, resolver);
    },
    getChangeOptions(resolver: (json: string) => void): void {
        Request.post(this.getChangeOptions.name, '/Sections/OverallGrades/ChangeOptions', null, resolver);
    },
    getChangeComments(studentGradeId: number, resolver: (json: string) => void): void {
        Request.post(this.getChangeComments.name, '/Sections/OverallGrades/Comments', studentGradeId, resolver);
    },
    getOverallGrades(sectionId: number, resolver: (json: string) => void): void {
        Request.get(this.getOverallGrades.name, `/Sections/OverallGrades/${sectionId}`, resolver);
    },
    getCourseStatistics(sectionId: number, resolver: (json: string) => void): void {
        Request.get(this.getCourseStatistics.name, `/Sections/Statistics/${sectionId}`, resolver);
    },
    postSaveOverallGrades(sectionId: number, isSubmit: boolean, submitType: number, overallGradeList: IOverallGradeList[],
        resolver: (json: string) => void): void {
        Request.post(this.postSaveOverallGrades.name, '/Sections/OverallGrades', { sectionId, isSubmit, submitType, overallGradeList },
            resolver);
    },
    postSaveStudentsGrades(sectionId: number, sectionApproveGrades: ISectionApproveGrade[],
        resolver: (json: string) => void): void {
        Request.post(this.postSaveStudentsGrades.name, '/Sections/StudentGrades/Save', { sectionId, sectionApproveGrades }, resolver);
    },
    postSubmitChangeGrades(changeGrade: IOverallGradesSaveChange, resolver: (json: string) => void): void {
        Request.post(this.postSubmitChangeGrades.name, '/Sections/OverallGrades/Change', changeGrade, resolver);
    },
    postCreateStudentGrade(transcriptDetailId: number, isMidterm: boolean, resolver: (json: string) => void): void {
        Request.post(this.postCreateStudentGrade.name, '/Sections/OverallGrades/Create', { transcriptDetailId, isMidterm }, resolver);
    },
    getStudentComments(personId: number, sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getStudentComments.name, '/Sections/OverallGrades/StudentComments', { personId, sectionId }, resolver);
    },
    updateStudentComments(comments: IGradeComment[], resolver: (json: string) => void): void {
        Request.post(this.updateStudentComments.name, '/Sections/OverallGrades/StudentComments/Update', comments , resolver);
    }
};

// Export object with the requests
export default OverallGradesRequests;