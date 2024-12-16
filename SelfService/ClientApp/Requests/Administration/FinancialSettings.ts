/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: FinancialSettings.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';
import { IFinancialSettings } from '../../Types/InstitutionSettings/IFinancialSettings';
import { IPaymentPeriod } from '../../Types/Payment/IPaymentPeriod';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const FinancialSettingsRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, '/Settings/Financial', resolver, resolveError);
    },
    postSaveSettings(financial: IFinancialSettings,
        paymentPeriods: IPaymentPeriod[],
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/Financial', { financial, paymentPeriods }, resolver, resolveError);
    },
    postValidateBalancePayment(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateBalancePayment.name,
            '/Settings/Payment/Validate',
            {
                fromPayment: false,
                paymentOrigin: PaymentOrigin.MakePayment
            },
            resolver,
            resolveError);
    }
};

// Export object with the requests
export default FinancialSettingsRequests;