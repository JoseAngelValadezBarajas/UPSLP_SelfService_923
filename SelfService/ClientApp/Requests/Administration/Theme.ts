/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Theme.ts */

// Types
import { ITheme } from '@hedtech/powercampus-design-system/types/ITheme';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const ThemeRequests = {
    getThemeActionColors(resolver: (json: string) => void): void {
        Request.get(this.getThemeActionColors.name, '/Settings/ThemeActionColors', resolver);
    },
    saveTheme(theme: ITheme, resolver: (json: string) => void): void {
        Request.post(this.saveTheme.name, '/Settings/SaveTheme', theme, resolver);
    }
};

// Export object with the requests
export default ThemeRequests;