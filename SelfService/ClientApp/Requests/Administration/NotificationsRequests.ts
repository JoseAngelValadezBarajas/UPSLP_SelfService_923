/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: NotificationsRequests.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';
import { INotificationsEventUpdate } from '../../Types/Notifications/INotificationsEventUpdate';
import { INotificationsTypesSetup } from '../../Types/Notifications/INotificationsTypesSetup';

// Functions for requests
const NotificationsRequests = {
    getApplcations(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getApplcations.name, '/Notifications/Applications', null, resolver, resolveError);
    },
    getEvents(applicationId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getEvents.name, '/Notifications/Events', applicationId, resolver, resolveError);
    },
    getEventsDetails(eventId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getEventsDetails.name, '/Notifications/Events/Details', eventId, resolver, resolveError);
    },
    getTypes(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getTypes.name, '/Notifications/Types', null, resolver, resolveError);
    },
    getTypesSetup(eventId: number, typeId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getTypesSetup.name, '/Notifications/Events/Setup', { eventId, typeId }, resolver, resolveError);
    },
    postSaveSetup(notificationSetupViewModel: INotificationsTypesSetup,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSetup.name, '/Notifications/Events/Setup/Create', notificationSetupViewModel, resolver, resolveError);
    },
    postEnableDisable(notificationEventUpdate: INotificationsEventUpdate,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postEnableDisable.name, '/Notifications/Events/Update', notificationEventUpdate, resolver, resolveError);
    }
};
// Export object with the requests
export default NotificationsRequests;