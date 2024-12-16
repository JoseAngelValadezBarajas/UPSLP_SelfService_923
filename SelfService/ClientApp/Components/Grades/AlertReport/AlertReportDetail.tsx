/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: AlertReportDetail.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
//import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IAlertReport } from '../../../Types/Grades/IAlertReport';
import { IAlertReportResources } from '../../../Types/Resources/Grades/IAlertReportResources';

// #endregion

// #region Internal types
export interface IAlertReportDetailProps {
    alertReportDetails: IAlertReport[];
    onDetailsSection: (id: number) => void;
    onDetailsAlert: (index: number, id: number, eventTypeDesc: string, date: string) => void;
    resources: IAlertReportResources;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '30%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '30%'
            }
        }
    },
}));

type PropsWithStyles = IAlertReportDetailProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const AlertReportDetail: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        alertReportDetails,
        classes,
        onDetailsAlert,
        onDetailsSection,
        resources
    } = props;

    return (
        <>
            <br />
            <Grid container spacing={2}>
                <Grid item xs>
                    {alertReportDetails.map((alerts, i) => (
                        <React.Fragment key={`cardSession_${alerts.academicSession}_${i}`}>
                            <Card key={`session_${alerts.academicSession}_${i}`}>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs>
                                            <Text size="h3">
                                                <span>
                                                    {alerts.academicSession}
                                                </span>
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs>
                                            <Table
                                                breakpoint="sm"
                                                classes={{ root: classes.table }}
                                                id="tblAlertReportDetail"
                                                variant="expansionPanels"
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell
                                                            id="lblCourseDetail"
                                                            component="th">
                                                            {resources.lblCourse}
                                                        </TableCell>
                                                        <TableCell
                                                            id="lblSubtype"
                                                            component="th">
                                                            {resources.lblAlert}
                                                        </TableCell>
                                                        <TableCell
                                                            id="lblSectionDetail"
                                                            component="th">
                                                            {resources.lblDate}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {alerts.list.map((details, j) => {
                                                        const onClickDetails = (): void => {
                                                            onDetailsSection(details.sectionId);
                                                        };

                                                        const onClickAlertDetails = (): void => {
                                                            onDetailsAlert(i, details.sectionId, details.violationCategoryDesc ?
                                                                details.violationCategoryDesc : '',
                                                                details.violationDate ? details.violationDate : '')
                                                        };
                                                        return (
                                                            <TableExpandableRow key={`alertReportList_${i}_${j}`}>
                                                                <TableCell>
                                                                    <Button
                                                                        TextProps={{
                                                                            weight: 'strong'
                                                                        }}
                                                                        align="left"
                                                                        id={'btnCourse'}
                                                                        textVariantStyling="inherit"
                                                                        variant="text"
                                                                        onClick={onClickDetails}
                                                                    >
                                                                        {`${details.eventId} - ${details.eventName}`}
                                                                    </Button>
                                                                    <Text
                                                                        color="textSecondary"
                                                                        size="small"
                                                                    >
                                                                        {Format.toString(resources.formatSectionSubType, [details.eventSubTypeDesc, details.section])}
                                                                    </Text>
                                                                    <Text
                                                                        color="textSecondary"
                                                                        size="small"
                                                                    >
                                                                        {Format.toString(resources.formatCreditType, [details.eventTypeDesc, details.creditTypeDesc])}
                                                                    </Text>
                                                                </TableCell>
                                                                <TableCell columnName={resources.lblAlert}>
                                                                    <Button
                                                                        TextProps={{
                                                                            weight: 'strong'
                                                                        }}
                                                                        align="left"
                                                                        id={'btnAlertDetail'}
                                                                        textVariantStyling="inherit"
                                                                        variant="text"
                                                                        onClick={onClickAlertDetails}
                                                                    >
                                                                        {`${details.violationCategoryDesc} - ${details.violationDesc}`}
                                                                    </Button>
                                                                </TableCell>
                                                                <TableCell columnName={resources.lblDate}>
                                                                    {details.violationDate}
                                                                </TableCell>
                                                            </TableExpandableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <br />
                        </React.Fragment>
                    ))}
                </Grid>
            </Grid>
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(AlertReportDetail);