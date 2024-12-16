/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: StatementInformation.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Internal components
import StatementCharges, { StatementChargesResProps } from './StatementCharges';

// Types
import { IStatement } from '../../../Types/Statement/IStatement';
// #endregion

// #region Internal types
export interface IStatementInformationProps {
    statement?: IStatement;
    resources: IStatementInformationResProps;
}

export interface IStatementInformationResProps {
    lblAmount: string;
    lblAmountEnclosed: string;
    lblAmountNotCovered: string;
    lblAnticipatedAids: string;
    lblCharges: string;
    lblCreditCardNumber: string;
    lblCreditCardType: string;
    lblCredits: string;
    lblCurrentBalance: string;
    lblDate: string;
    lblDescription: string;
    lblDueDate: string;
    lblExpirationDate: string;
    lblFor: string;
    lblId: string;
    lblInstructions: string;
    lblLessAnticipatedCredits: string;
    lblLine: string;
    lblOtherAmount: string;
    lblPageInstructions: string;
    lblPaymentDue: string;
    lblPaymentDueBy: string;
    lblPaymentPlanInformation: string;
    lblPeriod: string;
    lblPreviousBalance: string;
    lblSeparator: string;
    lblSignature: string;
    lblStatement: string;
    lblStatementNumber: string;
    lblTotalAnticipated: string;
    lblTotalCharges: string;
    lblTotalCredits: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '25%'
            }

        }
    }
}));

type PropsWithStyles = IStatementInformationProps & WithStyles<typeof styles>;
// #region Component

const StatementInformation: React.FC<PropsWithStyles> = (props: PropsWithStyles) => {
    const {
        classes,
        resources,
        statement
    } = props;

    let statementInfo: JSX.Element | undefined;
    if (statement) {
        // #region studentAddress
        let studentAddress: JSX.Element | undefined;
        studentAddress = (
            <Grid item md={12}>
                {statement.student.address.houseNumber !== '' ? (
                    <Text>
                        {statement.student.address.houseNumber}
                    </Text>
                ) : undefined}
                {statement.student.address.line1 !== '' ? (
                    <Text>
                        {statement.student.address.line1}
                    </Text>
                ) : undefined}
                {statement.student.address.line2 !== '' ?
                    (
                        <Text>
                            {statement.student.address.line2}
                        </Text>
                    ) : undefined}
                {statement.student.address.line3 !== '' ? (
                    <Text>
                        {statement.student.address.line3}
                    </Text>
                ) : undefined}
                {statement.student.address.line4 !== '' ? (
                    <Text>
                        {statement.student.address.line4}
                    </Text>
                ) : undefined}
                {statement.student.address.line5 !== '' ? (
                    <Text>
                        {statement.student.address.line5}
                    </Text>
                ) : undefined}
            </Grid>
        );
        // #endregion studentAddress

        // #region statementDetail
        let statementDetail: JSX.Element | undefined;
        statementDetail = (
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblStatementDetail"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {resources.lblId}
                        </TableCell>
                        <TableCell>
                            {resources.lblStatementNumber}
                        </TableCell>
                        <TableCell>
                            {resources.lblDueDate}
                        </TableCell>
                        {statement.payplanFlag === 'Y' ? (
                            <TableCell>
                                {resources.lblOtherAmount}
                            </TableCell>
                        ) : (
                                <TableCell>
                                    {resources.lblCurrentBalance}
                                </TableCell>
                            )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell columnName={resources.lblId}>
                            <span>
                                {statement.student.peopleId}
                            </span>
                        </TableCell>
                        <TableCell columnName={resources.lblStatementNumber}>
                            <span>
                                {statement.number}
                            </span>
                        </TableCell>
                        <TableCell columnName={resources.lblDueDate}>
                            <span>
                                {statement.dueDate}
                            </span>
                        </TableCell>
                        {statement.payplanFlag === 'Y' ? (
                            <TableCell columnName={resources.lblOtherAmount}>
                                <span>
                                    {statement.otherAmountDue}
                                </span>
                            </TableCell>
                        ) : (
                                <TableCell columnName={resources.lblCurrentBalance}>
                                    <span>
                                        {statement.currentBalance}
                                    </span>
                                </TableCell>
                            )}
                    </TableRow>
                </TableBody>
            </Table>
        );
        // #endregion statementDetail

        // #region statementDetail2
        let statementDetail2: JSX.Element | undefined;
        statementDetail2 = (
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblStatementDetail2"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {resources.lblPaymentDue}
                        </TableCell>
                        <TableCell>
                            {resources.lblLessAnticipatedCredits}
                        </TableCell>
                        <TableCell>
                            {resources.lblAmountEnclosed}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell columnName={resources.lblPaymentDue}>
                            <span>
                                {statement.paymentDue}
                            </span>
                        </TableCell>
                        <TableCell columnName={resources.lblLessAnticipatedCredits}>
                            <span>
                                {statement.lessAnticipatedCredits}
                            </span>
                        </TableCell>
                        <TableCell columnName={resources.lblAmountEnclosed}>
                            {''}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
        // #endregion statementDetail2

        // #region creditCardSection
        let creditCardSection: JSX.Element | undefined;
        if (statement.creditCardTypes !== null) {
            creditCardSection = (
                <>
                    <Grid item md={3} sm={3} xs={3}>
                        <Text>
                            {`${resources.lblCreditCardType}`}
                        </Text>
                    </Grid>
                    <Grid item md={9} sm={9} xs={9}>
                        <Text>
                            {`${statement.creditCardTypes}`}
                        </Text>
                    </Grid>
                    <Divider />
                    <Grid item md={3} sm={3} xs={3}>
                        <Text>
                            {`${resources.lblCreditCardNumber}`}
                        </Text>
                    </Grid>
                    <Grid item md={9} sm={9} xs={9}>
                        <Text>
                            {`${resources.lblLine}`}
                        </Text>
                    </Grid>
                    <Divider />
                    <Grid item md={3} sm={3} xs={3}>
                        <Text>
                            {`${resources.lblExpirationDate}`}
                        </Text>
                    </Grid>
                    <Grid item md={9} sm={9} xs={9}>
                        <Text>
                            {`${resources.lblLine}`}
                        </Text>
                    </Grid>
                    <Divider />
                    <Grid item md={3} sm={3} xs={3}>
                        <Text>
                            {`${resources.lblSignature}`}
                        </Text>
                    </Grid>
                    <Grid item md={9} sm={9} xs={9}>
                        <Text>
                            {`${resources.lblLine}`}
                        </Text>
                    </Grid>
                </>
            );
        }
        // #endregion creditCardSection

        // #region mailToAddress
        let mailToAddress: JSX.Element | undefined;
        mailToAddress = (
            <Grid item md={8}>
                <Text>
                    {statement.mailTo.fullName}
                </Text>
                {statement.mailTo.address.houseNumber !== '' ? (
                    <Text>
                        {statement.mailTo.address.houseNumber}
                    </Text>
                ) : undefined}
                {statement.mailTo.address.line1 !== '' ? (
                    <Text>
                        {statement.mailTo.address.line1}
                    </Text>
                ) : undefined}
                {statement.mailTo.address.line2 !== '' ? (
                    <Text>
                        {statement.mailTo.address.line2}
                    </Text>
                ) : undefined}
                {statement.mailTo.address.line3 !== '' ? (
                    <Text>
                        {statement.mailTo.address.line3}
                    </Text>
                ) : undefined}
                {statement.mailTo.address.line4 !== '' ? (
                    <Text>
                        {statement.mailTo.address.line4}
                    </Text>
                ) : undefined}
                {statement.mailTo.address.line5 !== '' ? (
                    <Text>
                        {statement.mailTo.address.line5}
                    </Text>
                ) : undefined}
            </Grid>
        );
        // #endregion mailToAddress

        // #region organizationAddress
        let organizationAddress: JSX.Element | undefined;
        organizationAddress = (
            <Grid item md={4}>
                <Text>
                    {statement.organization.name}
                </Text>
                {statement.organization.address.houseNumber !== '' ? (
                    <Text>
                        {statement.organization.address.houseNumber}
                    </Text>
                ) : undefined}
                {statement.organization.address.line1 !== '' ? (
                    <Text>
                        {statement.organization.address.line1}
                    </Text>
                ) : undefined}
                {statement.organization.address.line2 !== '' ? (
                    <Text>
                        {statement.organization.address.line2}
                    </Text>
                ) : undefined}
                {statement.organization.address.line3 !== '' ? (
                    <Text>
                        {statement.organization.address.line3}
                    </Text>
                ) : undefined}
                {statement.organization.address.line4 !== '' ? (
                    <Text>
                        {statement.organization.address.line4}
                    </Text>
                ) : undefined}
                {statement.organization.address.line5 !== '' ? (
                    <Text>
                        {statement.organization.address.line5}
                    </Text>
                ) : undefined}
            </Grid>
        );
        // #endregion organizationAddress

        // #region statementInfo
        statementInfo = (
            <>
                <Grid item md={12} xs={12} sm={12}>
                    <Text size="h2">
                        {resources.lblStatement}
                    </Text>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                    <Text>
                        {resources.lblPageInstructions}
                    </Text>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                    <Text>
                        {statement.title}
                    </Text>
                    <Text>
                        {resources.lblStatementNumber}
                        {statement.number}
                    </Text>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                    <Text align="right">
                        {statement.date}
                    </Text>
                </Grid>
                <Divider />
                <Grid item md={6} xs={12} sm={6}>
                    <Text>
                        {statement.student.fullName}
                    </Text>
                    {studentAddress}
                    <Text>
                        {statement.balanceTypeDesc}
                        {resources.lblSeparator}
                        {statement.description}
                    </Text>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                    <Text align="right">
                        {resources.lblId}
                        {statement.student.peopleId}
                    </Text>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                    <Text align="right">
                        {statement.showPreviousBalance ? `${resources.lblPreviousBalance} ${statement.previousBalance}` : ''}
                    </Text>
                </Grid>
                {statement.charges ? (
                    <StatementCharges
                        chargeCredits={statement.charges}
                        showAnticipatedAids={false}
                        showCharges={true}
                        showCredits={false}
                        showPaymentPlanCharges={false}
                        {...(new StatementChargesResProps({ ...resources as StatementChargesResProps }))}
                    />
                ) : undefined
                }
                {
                    statement.charges && statement.charges.length > 0 ? (
                        <Grid item md={12} xs={12} sm={12}>
                            <Text align="right">
                                {resources.lblTotalCharges}
                                {statement.totalCharges}
                            </Text>
                        </Grid>
                    ) : undefined
                }
                {statement.credits ? (
                    <StatementCharges
                        chargeCredits={statement.credits}
                        showAnticipatedAids={false}
                        showCharges={false}
                        showCredits={true}
                        showPaymentPlanCharges={false}
                        {...(new StatementChargesResProps({ ...resources as StatementChargesResProps }))}
                    />
                ) : undefined
                }
                {
                    statement.credits && statement.credits.length > 0 ? (
                        <Grid item md={12} xs={12} sm={12}>
                            <Text align="right">
                                {resources.lblTotalCredits}
                                {statement.totalCredits}
                            </Text>
                        </Grid>
                    ) : undefined
                }
                {statement.anticipatedAids ? (
                    <StatementCharges
                        chargeCredits={statement.anticipatedAids}
                        showAnticipatedAids={true}
                        showCharges={false}
                        showCredits={false}
                        showPaymentPlanCharges={false}
                        {...(new StatementChargesResProps({ ...resources as StatementChargesResProps }))}
                    />
                ) : undefined
                }
                {
                    statement.anticipatedAids && statement.anticipatedAids.length > 0 ? (
                        <Grid item md={12} xs={12} sm={12}>
                            <Text align="right">
                                {resources.lblTotalAnticipated}
                                {statement.totalAnticipatedAid}
                            </Text>
                        </Grid>
                    ) : undefined
                }
                {statement.paymentPlanCharges ? (
                    <StatementCharges
                        chargeCredits={statement.paymentPlanCharges}
                        showAnticipatedAids={false}
                        showCharges={false}
                        showCredits={false}
                        showPaymentPlanCharges={true}
                        {...(new StatementChargesResProps({ ...resources as StatementChargesResProps }))}
                    />
                ) : undefined
                }
                {statement.payplanFlag === 'Y' ? (
                    <Grid item md={12} xs={12} sm={12}>
                        <Text align="right">
                            {resources.lblAmountNotCovered}
                            {statement.otherAmountDue}
                        </Text>
                    </Grid>
                ) : (
                        <Grid item md={12} xs={12} sm={12}>
                            <Text align="right">
                                {resources.lblCurrentBalance}
                                {statement.currentBalance}
                            </Text>
                        </Grid>
                    )}
                {statement.payplanFlag === 'Y' ?
                    (
                        <Grid item md={12} xs={12} sm={12}>
                            <Text align="right">
                                {resources.lblPaymentDueBy}
                                {statement.dueDate}
                                {statement.paymentDue}
                            </Text>
                        </Grid>
                    ) : (
                        <Grid item md={12} xs={12} sm={12}>
                            <Text align="right">
                                {resources.lblPaymentDue}
                                {statement.paymentDue}
                            </Text>
                        </Grid>
                    )}
                <Divider />
                <Grid item md={12} xs={12} sm={12}>
                    <Text>
                        {statement.anticipatedMessage}
                    </Text>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                    <Text>
                        {statement.posNegMessage}
                    </Text>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                    <Text>
                        {statement.generalMessage}
                    </Text>
                </Grid>
                <Divider />
                <Grid item md={12} xs={12} sm={12}>
                    <Text>
                        {resources.lblInstructions}
                    </Text>
                </Grid>
                {statementDetail}
                {statementDetail2}

                <Grid item md={12} xs={12} sm={12}>
                    <Text>
                        {statement.title}
                    </Text>
                    <Text>
                        {resources.lblFor}
                        {statement.student.fullName}
                    </Text>
                </Grid>
                {creditCardSection}
                {mailToAddress}
                {organizationAddress}
            </>
        );
        // #endregion statementInfo
    }
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        {statementInfo}
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(StatementInformation);