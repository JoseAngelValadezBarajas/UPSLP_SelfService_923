/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: CourseManagementStore.ts */

// #region Imports
import { EventEmitter } from 'events';

// Types
import { IAttendanceDaily } from '../Types/Section/IAttendanceDaily';
import { IAttendanceDailyCalendar } from '../Types/Section/IAttendanceDailyCalendar';
import { CourseManagementEventStatus } from '../Types/StoreStatus/CourseManagementEventStatus';
import { CourseManagementStatus } from '../Types/StoreStatus/CourseManagementStatus';

// Dispatcher
import AppDispatcher from '@hedtech/powercampus-design-system/flux/AppDispatcher';
// #endregion Imports

// #region Emitter
class CourseManagementStoreEmitter extends EventEmitter {
    private calendarKey?: number;
    private dailyAttendance?: IAttendanceDaily;
    private dailyAttendanceCalendar?: IAttendanceDailyCalendar;
    private resources: any[];

    public constructor() {
        super();
        this.calendarKey = undefined;
        this.dailyAttendance = undefined;
        this.dailyAttendanceCalendar = undefined;
        this.resources = [];
    }

    // #region Daily Attendance
    public addDailyAttendanceListener(callback: any): void {
        this.addListener(CourseManagementEventStatus.changeDailyAttendance, callback);
    }

    public removeDailyAttendanceListener(callback: any): void {
        this.removeListener(CourseManagementEventStatus.changeDailyAttendance, callback);
    }

    public emitDailyAttendance(): void {
        this.emit(CourseManagementEventStatus.changeDailyAttendance);
    }

    public getDailyAttendanceCalendar(): IAttendanceDailyCalendar | undefined {
        return this.dailyAttendanceCalendar;
    }

    public getDailyAttendance(): IAttendanceDaily | undefined {
        return this.dailyAttendance;
    }

    public getCalendarKey(): number | undefined {
        return this.calendarKey;
    }

    public setDailyAttendance(dailyAttendanceCalendar?: IAttendanceDailyCalendar, dailyAttendance?: IAttendanceDaily, calendarKey?: number): void {
        this.dailyAttendanceCalendar = dailyAttendanceCalendar;
        this.dailyAttendance = dailyAttendance;
        this.calendarKey = calendarKey;
    }
    // #endregion Daily Attendance

    // #region Resources
    public getResources(position: number): any | undefined {
        return this.resources[position];
    }

    public setResources(position: number, value?: any): void {
        this.resources[position] = value;
    }
    // #endregion Resources
}
// #endregion Emitter

// #region Register the events in the dispatcher
const CourseManagementStore = new CourseManagementStoreEmitter();

AppDispatcher.register((callback: any) => {
    switch (callback.type) {
        case CourseManagementStatus.successCleanDailyAttendance:
            CourseManagementStore.setDailyAttendance();
            break;
        case CourseManagementStatus.successSetDailyAttendance:
            CourseManagementStore.setDailyAttendance(callback.payload.calendar, callback.payload.hours, callback.payload.calendarKey);
            CourseManagementStore.emitDailyAttendance();
            break;
        default:
            break;
    }
});
// #endregion Register the events in the dispatcher

// Export: Store
export default CourseManagementStore;