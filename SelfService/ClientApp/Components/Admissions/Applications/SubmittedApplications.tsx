/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: SubmittedApplications.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import List, { ListItem, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ISubmittedApplication } from '../../../Types/Applications/ISubmittedApplication';
import { ISubmittedApplicationsResources } from '../../../Types/Resources/Admissions/IApplicationsResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
// #endregion Imports

// #region Types
export interface ISubmittedApplicationsProps {
    resources: ISubmittedApplicationsResources;
    showApplicationStatus: boolean;
    showDecisionAdmit: boolean;
    submittedApplications: ISubmittedApplication[];
}

const styles = () => createStyles({
    margin: {
        marginTop: Tokens.spacing30,
        marginBottom: Tokens.spacing30
    },
    statusLabelMargin: {
        marginLeft: Tokens.spacing50
    }
});

type PropsWithStyles = ISubmittedApplicationsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const SubmittedApplications: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        resources,
        showApplicationStatus,
        showDecisionAdmit,
        submittedApplications
    } = props;

    const submittedApplicationList: JSX.Element[] = [];
    if (submittedApplications.length > 0) {
        submittedApplications.forEach((submittedApplication, iSubmittedApplication) => {
            submittedApplicationList.push(
                <ListItem>
                    <ListItemText
                        id={`liSubmittedApplication_${iSubmittedApplication}`}
                        classes={{ root: classes.margin }}
                        primary={(
                            <Text size="h3" weight="strong">
                                {Format.toString(resources.formatProgramDegreeCurriculum,
                                    [submittedApplication.program, submittedApplication.degree, submittedApplication.curriculum])}
                            </Text>
                        )}
                        secondary={(
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={4}>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Text color="textPrimary">
                                                {resources.lblPeriod}
                                                {Format.toString(resources.formatPeriod,
                                                    [submittedApplication.academicYear, submittedApplication.academicTermDesc, submittedApplication.academicSessionDesc])}
                                            </Text>
                                        </Grid>
                                        <Grid item>
                                            <Text color="textPrimary">
                                                {resources.lblCollege}
                                                {submittedApplication.college}
                                            </Text>
                                        </Grid>
                                        <Grid item>
                                            <Text color="textPrimary">
                                                {resources.lblCollegeAttendance}
                                                {submittedApplication.collegeAttendance}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={showDecisionAdmit ? 4 : 8}>
                                    <Grid container direction="column" spacing={1}>
                                        {showApplicationStatus && (
                                            <Grid item>
                                                <Text color="textPrimary" display="inline">
                                                    {resources.lblStatus}
                                                </Text>
                                                {submittedApplication.status && (
                                                    <StatusLabel
                                                        classes={{ root: classes.statusLabelMargin }}
                                                        id={`stsStatus_${iSubmittedApplication}`}
                                                        text={Format.toString(resources.formatStatusDate,
                                                            [submittedApplication.status, submittedApplication.statusDate])}
                                                        type="default"
                                                    />
                                                )}
                                            </Grid>
                                        )}
                                        <Grid item>
                                            <Text color="textPrimary">
                                                {resources.lblReceiptDate}
                                                {submittedApplication.receiptDate}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {showDecisionAdmit && (
                                    <Grid item xs={12} md={4}>
                                        <Grid container direction="column" spacing={1}>
                                            <Grid item>
                                                <Text color="textPrimary" display="inline">
                                                    {resources.lblDecision}
                                                </Text>
                                                {submittedApplication.decision && (
                                                    <StatusLabel
                                                        classes={{ root: classes.statusLabelMargin }}
                                                        id={`stsDecision_${iSubmittedApplication}`}
                                                        text={Format.toString(resources.formatDecisionDate,
                                                            [submittedApplication.decision, submittedApplication.decisionDate])}
                                                        type="default"
                                                    />
                                                )}
                                            </Grid>
                                            <Grid item>
                                                <Text color="textPrimary">
                                                    {resources.lblAdmitPeriod}
                                                    {submittedApplication.admitYear
                                                        && submittedApplication.admitTermDesc
                                                        && submittedApplication.admitSessionDesc
                                                        && Format.toString(resources.formatAdmitPeriod,
                                                            [submittedApplication.admitYear, submittedApplication.admitTermDesc, submittedApplication.admitSessionDesc])}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    />
                </ListItem>
            );
        });
    }

    let content: JSX.Element | undefined;
    if (resources) {
        content = (
            <ExpansionPanel
                defaultExpanded
                id="epnlSubmittedApplications"
                header={(
                    <Text size="h2">
                        {resources.lblSubmittedApplications}
                    </Text>
                )}
            >
                <Divider
                    noMarginBottom
                    noMarginTop
                />
                <List id="lstSubmittedApplications">
                    {submittedApplicationList}
                </List>
            </ExpansionPanel>
        );
    }

    return (
        <>
            {content}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(SubmittedApplications);