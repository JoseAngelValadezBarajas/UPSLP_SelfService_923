/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: CourseManagementActions.ts */

// #region Imports
import AppDispatcher, { IPayload } from '@hedtech/powercampus-design-system/flux/AppDispatcher';

// Types
import { IAttendanceDaily } from '../Types/Section/IAttendanceDaily';
import { IAttendanceDailyCalendar } from '../Types/Section/IAttendanceDailyCalendar';
import { CourseManagementStatus } from '../Types/StoreStatus/CourseManagementStatus';
// #endregion Imports

// #region Actions
const CourseManagementActions = {
    cleanDailyAttendance(): void {
        AppDispatcher.dispatch({
            type: CourseManagementStatus.successCleanDailyAttendance
        } as IPayload);
    },
    setDailyAttendance(calendar: IAttendanceDailyCalendar, hours: IAttendanceDaily, calendarKey: number): void {
        AppDispatcher.dispatch({
            payload: {
                calendar,
                calendarKey,
                hours
            },
            type: CourseManagementStatus.successSetDailyAttendance
        } as IPayload);
    }
};
// #endregion Actions

// Export: Actions
export default CourseManagementActions;