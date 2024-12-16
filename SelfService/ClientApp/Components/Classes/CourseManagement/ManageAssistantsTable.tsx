/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ManageAssistantsTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableHead, TableRow, TableExpandableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IFacultyAssistantDetail } from '../../../Types/FacultyAssistants/IFacultyAssistant';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface IManageAssistantsTableProps {
    allSelected: boolean;
    emailSettings: IEmailSettings;
    facultyAssistants: IFacultyAssistantDetail[];
    hasActivitiesClaim?: boolean;
    hasActivityGradesClaim?: boolean;
    hasAlertsClaim?: boolean;
    hasClassListClaim?: boolean;
    hasDailyAttendanceClaim?: boolean;
    hasDashboardNotesClaim?: boolean;
    hasGradeMappingsClaim?: boolean;
    hasOverallAttendanceClaim?: boolean;
    hasOverallGradesClaim?: boolean;
    hasOverallGradesSubmissionClaim?: boolean;
    hasWaitListClaim?: boolean;
    isAssistantSelected: boolean;
    isLoadingSave: boolean;
    resources: IManageAssistantsTableResProps;
    onChangeAssistantCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onOpenEmailModal: (emailAddresses: string[]) => void
    onSave: () => void;
    onSelectAll: () => void;
    onViewDossier?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IManageAssistantsTableResProps {
    btnSave: string;
    btnSendEmail: string;
    formatAdded: string;
    formatLastModified: string;
    formatSelectAssistant: string;
    lblActivities: string;
    lblActivityGrades: string;
    lblAlerts: string;
    lblAssistant: string;
    lblClassList: string;
    lblDailyAttendance: string;
    lblDashboardNotes: string;
    lblDelete: string;
    lblGradeMappings: string;
    lblOverallAttendance: string;
    lblOverallGrades: string;
    lblSubmitOverallGrades: string;
    lblWaitlist: string;
    lblWithdrawn: string;
}

const styles = ((theme: Theme) => createStyles({
    checkboxHeader: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: `${Tokens.spacing35}!important`
        },
        marginLeft: `${Tokens.spacing40}!important`
    },
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '80%'
            }
        }
    }
}));

type PropsWithStyles = IManageAssistantsTableProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const ManageAssistantsTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        allSelected,
        classes,
        emailSettings,
        facultyAssistants,
        hasActivitiesClaim,
        hasActivityGradesClaim,
        hasAlertsClaim,
        hasClassListClaim,
        hasDailyAttendanceClaim,
        hasDashboardNotesClaim,
        hasGradeMappingsClaim,
        hasOverallAttendanceClaim,
        hasOverallGradesClaim,
        hasOverallGradesSubmissionClaim,
        hasWaitListClaim,
        isAssistantSelected,
        isLoadingSave,
        resources,
        onChangeAssistantCheckbox,
        onChangeCheckbox,
        onDelete,
        onOpenEmailModal,
        onSave,
        onSelectAll,
        onViewDossier
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

    const onClickEmail = (): void => {
        const emails: string[] = [];
        facultyAssistants.forEach(faculty => {
            if (faculty.checkbox && Boolean(faculty.email)) {
                emails.push(faculty.email);
            }
        });

        if (emailSettings.emailProvider === EmailProviderOption.External) {
            window.open(Format.toString(emailSettings.staffUrl, [emails.join(emailSettings.staffSeparator)]),
                emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
        }
        else {
            onOpenEmailModal(emails);
        }
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item>
                        <Checkbox
                            checked={allSelected || isAssistantSelected}
                            classes={{
                                focused: classes.checkboxHeader,
                                root: classes.checkboxHeader
                            }}
                            id="chkSelectAllAssistants"
                            indeterminate={!allSelected && isAssistantSelected}
                            inputProps={{
                                'aria-label': layoutResources?.lblSelectAll
                            }}
                            onChange={onSelectAll}
                        />
                        <Tooltip
                            id="tltEmailSelected"
                            title={resources.btnSendEmail}
                            placement="top"
                        >
                            <div className={classes.inline}>
                                <IconButton
                                    title={resources.btnSendEmail}
                                    classes={{ root: classes.iconHeader }}
                                    color="secondary"
                                    disabled={!isAssistantSelected}
                                    onClick={onClickEmail}
                                    id="btnSentEmail"
                                >
                                    <Icon large name="email" />
                                </IconButton>
                            </div>
                        </Tooltip>
                    </Grid>
                </Grid>
                <br />
                <Table
                    breakpoint="sm"
                    classes={{ root: classes.table }}
                    id="tblFacultyAssistants"
                    variant="expansionPanels"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell component="th">
                                {resources.lblAssistant}
                            </TableCell>
                            <TableCell component="th" align="right">
                                {resources.lblDelete}
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {facultyAssistants.map((faculty, i) =>
                        (
                            <TableExpandableRow
                                key={`tblFaculty_${i}`}
                                expandedRowContent={(
                                    <div>
                                        <Grid container>
                                            {hasDashboardNotesClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canAccessDashboardNotes}
                                                        id={`chk_dashboardNotes_${i}`}
                                                        label={resources.lblDashboardNotes}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasClassListClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canAccessClassList}
                                                        id={`chk_classList_${i}`}
                                                        label={resources.lblClassList}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasWaitListClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canAccessWaitlist}
                                                        id={`chk_waitlist_${i}`}
                                                        label={resources.lblWaitlist}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasAlertsClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canAccessViolations}
                                                        id={`chk_violations_${i}`}
                                                        label={resources.lblAlerts}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasOverallAttendanceClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canAccessAttendance}
                                                        id={`chk_overallAttendance_${i}`}
                                                        label={resources.lblOverallAttendance}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasDailyAttendanceClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canTakeDailyAttendance}
                                                        id={`chk_dailyAttendance_${i}`}
                                                        label={resources.lblDailyAttendance}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasActivitiesClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canSetupActivities}
                                                        id={`chk_activities_${i}`}
                                                        label={resources.lblActivities}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasGradeMappingsClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canSetupGradeMappings}
                                                        id={`chk_gradeMappings_${i}`}
                                                        label={resources.lblGradeMappings}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasActivityGradesClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canAccessActivityGrades}
                                                        id={`chk_activityGrades_${i}`}
                                                        label={resources.lblActivityGrades}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasOverallGradesClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canAccessOverallGrades}
                                                        id={`chk_overallGrades_${i}`}
                                                        label={resources.lblOverallGrades}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                            {hasOverallGradesSubmissionClaim && (
                                                <Grid item xs={12} md={4}>
                                                    <Checkbox
                                                        checked={faculty.canSubmitOverallGrades}
                                                        id={`chk_submitOverallGrades_${i}`}
                                                        label={resources.lblSubmitOverallGrades}
                                                        onChange={onChangeCheckbox}
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                        <Divider />
                                        <Grid container>
                                            <Grid item xs={12} md={4}>
                                                <Text>
                                                    {Format.toString(resources.formatAdded,
                                                        [faculty.createDate])}
                                                </Text>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Text>
                                                    {Format.toString(resources.formatLastModified,
                                                        [faculty.revisionDate])}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </div>
                                )}
                            >
                                <TableCell
                                    component="th"
                                    scope="row"
                                >
                                    <AvatarText
                                        ButtonProps={onViewDossier ? {
                                            'data-id': faculty.assistant.personId,
                                            id: `btnFacultyDossier_${faculty.assistant.personId}_${i}`,
                                            onClick: onViewDossier
                                        } : undefined}
                                        CheckboxProps={{
                                            checked: Boolean(faculty.checkbox),
                                            id: `chkAssistantName_${i}`,
                                            inputProps: {
                                                'aria-label': Format.toString(resources.formatSelectAssistant, [faculty.assistant.fullName]),
                                                'data-id': faculty.facultyAssistantId
                                            },
                                            onChange: onChangeAssistantCheckbox
                                        }}
                                        avatarInfo={faculty.assistant}
                                        complement={faculty.isWithdrawn ? (
                                            <StatusLabel
                                                id={`stsLblAssistantStatus_${i}`}
                                                text={resources.lblWithdrawn}
                                                type="draft"
                                            />
                                        ) : undefined}
                                        id={`avtAssistant_${i}`}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Grid container justifyContent="flex-end" spacing={0}>
                                        <Grid item>
                                            <IconButton
                                                alt={resources.lblDelete}
                                                color="secondary"
                                                onClick={onDelete}
                                                id={`btnDelete_${i}`}
                                            >
                                                <Icon name="trash" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableExpandableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid >
            <Grid item xs>
                <br />
                <Button
                    id="btnSaveFacultyAssistant"
                    loading={isLoadingSave}
                    onClick={onSave}
                >
                    {resources.btnSave}
                </Button>
            </Grid>
        </Grid >
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(ManageAssistantsTable);