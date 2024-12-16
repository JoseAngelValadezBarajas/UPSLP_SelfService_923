/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: GlobalSettings.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IGeneral } from '../../Types/InstitutionSettings/IGeneral';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const GlobalSettingsRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, '/Settings/General', resolver, resolveError);
    },
    getSubCultureCurrencyFormat(id: string, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSubCultureCurrencyFormat.name, `/Settings/Subcultures/${id}/CurrencyFormat`, resolver, resolveError);
    },
    getSubCultureDateTimeFormat(id: string, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSubCultureDateTimeFormat.name, `/Settings/Subcultures/${id}/DateTimeFormat`, resolver, resolveError);
    },
    getSubCultureNumberFormat(id: string, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSubCultureNumberFormat.name, `/Settings/Subcultures/${id}/NumberFormat`, resolver, resolveError);
    },
    getSubCultures(id: string, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSubCultures.name, `/Settings/Subcultures/${id}`, resolver, resolveError);
    },
    postSaveSettings(settings: IGeneral, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/General', settings, resolver, resolveError);
    }
};

// Export object with the requests
export default GlobalSettingsRequests;