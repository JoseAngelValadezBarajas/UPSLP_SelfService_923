/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Statement.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const StatementRequest = {
    getStatements(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getStatements.name, '/Students/Statements', resolver, resolveError);
    },
    getStatement(statementNumber: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getStatement.name, '/Students/Statements', statementNumber, resolver, resolveError);
    }
};
// Export object with the requests
export default StatementRequest;