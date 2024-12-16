/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Dashboard.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const DashboardRequests = {
    getNotifications(resolver: (json: string) => void): void {
        Request.get(this.getNotifications.name, '/Dashboard/Notifications', resolver);
    },
    getStatus(resolver: (json: string) => void): void {
        Request.get(this.getStatus.name, '/Dashboard/Status', resolver);
    },
    getEvents(date: string, resolver: (json: string) => void): void {
        Request.post(this.getEvents.name, '/Dashboard/Events', date, resolver);
    },
    getChecklist(resolver: (json: string) => void): void {
        Request.get(this.getChecklist.name, '/Dashboard/Checklist', resolver);
    },
    getMyTasks(resolver: (json: string) => void): void {
        Request.get(this.getMyTasks.name, '/Dashboard/MyTasks', resolver);
    }
};

// Export object with the requests
export default DashboardRequests;