/* Copyright 2020 Ellucian Company L.P. and its affiliates.
* File: SharedAccessMain.ts */

// Types
import { IInvitation } from '../../Types/Account/IInvitation';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const SharedAccessMainRequests = {
    getSettings(resolver: (json: string) => void): void {
        Request.post(this.getSettings.name, '/Invitations', null, resolver);
    },
    getOptions(resolver: (json: string) => void): void {
        Request.post(this.getSettings.name, '/Invitations/Options', null, resolver);
    },
    getEmailRegExp(resolver: (json: string) => void): void {
        Request.post(this.getEmailRegExp.name, '/Settings/EmailRegExp', null, resolver);
    },
    getDisclosureStatement(resolver: (json: string) => void): void {
        Request.post(this.getDisclosureStatement.name, '/Invitations/DisclosureStatement', null, resolver);
    },
    postSaveInvitation(invitation: IInvitation, resolver: (json: string) => void): void {
        Request.post(this.postSaveInvitation.name, '/Invitations/Save', invitation, resolver);
    },
    getInvitations(resolver: (json: string) => void): void {
        Request.post(this.getInvitations.name, '/Invitations/Details', null, resolver);
    },
    postDeleteInvitation(invitationId: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteInvitation.name, '/Invitations/Delete', invitationId, resolver);
    },
    postUpdateStatus(invitationId: number, relativeId: number, resolver: (json: string) => void): void {
        Request.post(this.postUpdateStatus.name, '/Invitations/UpdateStatus', { invitationId, relativeId }, resolver);
    },
    getRelativeOptions(relativeId: number, resolver: (json: string) => void): void {
        Request.post(this.getRelativeOptions.name, '/Invitations/Relatives/Options', relativeId, resolver);
    },
    postUpdateRelativeOptions(invitation: IInvitation, resolver: (json: string) => void): void {
        Request.post(this.postUpdateRelativeOptions.name, '/Invitations/Relatives/Options/Update', invitation, resolver);
    },
};

// Export object with the requests
export default SharedAccessMainRequests;