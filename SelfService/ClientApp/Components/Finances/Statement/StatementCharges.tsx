/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: StatementCharges.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';

// Types
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import { IStatementChargeCredit } from '../../../Types/Statement/IStatementChargeCredit';

// #endregion

// #region Internal types
export interface IStatementChargesProps {
    chargeCredits?: IStatementChargeCredit[];
    showAnticipatedAids: boolean;
    showCharges: boolean;
    showCredits: boolean;
    showPaymentPlanCharges: boolean;
}

export class StatementChargesResProps {
    public lblAmount: string;
    public lblAnticipatedAids: string;
    public lblCharges: string;
    public lblCredits: string;
    public lblDate: string;
    public lblDescription: string;
    public lblPaymentPlanInformation: string;
    public lblPeriod: string;

    public constructor(data: StatementChargesResProps) {
        this.lblAmount = data.lblAmount;
        this.lblAnticipatedAids = data.lblAnticipatedAids;
        this.lblCharges = data.lblCharges;
        this.lblCredits = data.lblCredits;
        this.lblDate = data.lblDate;
        this.lblDescription = data.lblDescription;
        this.lblPaymentPlanInformation = data.lblPaymentPlanInformation;
        this.lblPeriod = data.lblPeriod;
    }
}

type StatementChargesResPropsProps = IStatementChargesProps & StatementChargesResProps;
// #endregion

// #region Component
class StatementCharges extends React.Component<StatementChargesResPropsProps> {
    // Render
    public render(): JSX.Element {
        const {
            chargeCredits,
            showAnticipatedAids,
            showCharges,
            showCredits,
            showPaymentPlanCharges
        } = this.props;

        const resources: StatementChargesResProps =
            new StatementChargesResProps({ ...this.props as StatementChargesResProps });

        let chargesTable: JSX.Element | undefined;
        let creditsTable: JSX.Element | undefined;
        let paymentTable: JSX.Element | undefined;
        let anticipatedTable: JSX.Element | undefined;
        let chargeCreditsTable: JSX.Element[] = [];

        if (chargeCredits && chargeCredits.length > 0) {

            chargeCreditsTable = chargeCredits.map((chargeCredit, i) => (
                <TableRow key={`chargeCreditRow_${i}`}>
                    {showCharges || showCredits || showAnticipatedAids ? (
                            <TableCell columnName={resources.lblDate}>
                                <span>
                                    {chargeCredit.entryDate}
                                </span>
                            </TableCell>
                        ): undefined
                    }
                    <TableCell columnName={resources.lblPeriod}>
                        <span>
                            {chargeCredit.period}
                        </span>
                    </TableCell>
                    <TableCell columnName={resources.lblDescription}>
                        <span>
                            {chargeCredit.description}
                        </span>
                        <span>
                            {chargeCredit.statementMessage}
                        </span>
                    </TableCell>
                    <TableCell columnName={resources.lblAmount} align="right">
                        <span>
                            {chargeCredit.amount}
                        </span>
                    </TableCell>
                </TableRow>
            ));

            if (showCharges) {
                chargesTable = (
                    <>
                        <Text>
                            {resources.lblCharges}
                        </Text>
                        <Table
                            breakpoint="sm"
                            id="tblCharges"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {resources.lblDate}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblPeriod}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblDescription}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblAmount}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {chargeCreditsTable}
                            </TableBody>
                        </Table>
                    </>
                );
            }

            if (showCredits) {
                creditsTable = (
                    <>
                        <Text>
                            {resources.lblCredits}
                        </Text>
                        <Table
                            breakpoint="sm"
                            id="tblCredits"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {resources.lblDate}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblPeriod}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblDescription}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblAmount}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {chargeCreditsTable}
                            </TableBody>
                        </Table>
                    </>
                );
            }

            if (showAnticipatedAids) {
                anticipatedTable = (
                    <>
                        <Text>
                            {resources.lblAnticipatedAids}
                        </Text>
                        <Table
                            breakpoint="sm"
                            id="tblAnticipatedAids"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {resources.lblDate}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblPeriod}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblDescription}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblAmount}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {chargeCreditsTable}
                            </TableBody>
                        </Table>
                    </>
                );
            }

            if (showPaymentPlanCharges) {
                paymentTable = (
                    <>
                        <Text>
                            {resources.lblPaymentPlanInformation}
                        </Text>
                        <Table
                            breakpoint="sm"
                            id="tblPaymentPlanInformation"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {resources.lblDate}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblPeriod}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblDescription}
                                    </TableCell>
                                    <TableCell>
                                        {resources.lblAmount}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {chargeCreditsTable}
                            </TableBody>
                        </Table>
                    </>
                );
            }
        }

        return (
            <>
                {chargesTable}
                {creditsTable}
                {anticipatedTable}
                {paymentTable}
            </>
        );
    }
}
// #endregion

// Export: Component
export default StatementCharges;