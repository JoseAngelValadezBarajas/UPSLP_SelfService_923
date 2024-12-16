/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: DailyAttendanceTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableEditableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAttendanceDaily } from '../../../Types/Section/IAttendanceDaily';

// #endregion

// #region Internal types
export interface IAttendanceListProps {
    attendanceStatus: IDropDownOption[];
    attendanceStudentList: IAttendanceDaily;
    isLoadingTable: boolean;
    resources: IDailyAttendanceTableResProps;
    statusAttendanceSelected: number;
    onChangeApplyStatus?: (optionSelected: IDropDownOption, id: string) => void;
    onChangeAttendanceStatus?: (optionSelected: IDropDownOption, id: string) => void;
    onDownloadDailyAttendance: (defaultName: string, nameSelected: string) => void;
    onSaveAttendanceDailyList: () => void;
    onTextFieldChange?: (event: any) => void;
}

export interface IDailyAttendanceTableResProps {
    btnSave: string;
    formatDailyCalendar: string;
    lblApplyStatus: string;
    lblAttendanceStatus: string;
    lblComments: string;
    lblDailyAttendance: string;
    lblDropDownEmptyText: string;
    lblDownload: string;
    lblDownloadDailyName: string;
    lblName: string;
    lblNoResults: string;
    lblToday: string;
    lblWithdrawn: string;
}

const styles = ((theme: Theme) => createStyles({
    datePickerContainer: {
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        width: '100%'
    },
    eventCard: {
        borderLeft: `thick solid ${Tokens.fountain600}`,
        marginBottom: Tokens.spacing50,
        paddingLeft: Tokens.spacing40
    },
    green: {
        borderColor: Tokens.colorFillAlertSuccess
    },
    inline: {
        display: 'inline'
    },
    margin: {
        marginLeft: Tokens.sizingXLarge
    },
    marginRight: {
        marginRight: Tokens.sizingXxLarge
    },
    marginTop: {
        [theme.breakpoints.up('md')]: {
            marginTop: Tokens.spacing50
        }
    },
    red: {
        borderColor: Tokens.colorFillAlertError
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '50%'
            }
        }
    }
}));

type PropsWithStyles = IAttendanceListProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const DailyAttendanceTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        attendanceStatus,
        attendanceStudentList,
        classes,
        isLoadingTable,
        resources,
        statusAttendanceSelected,
        onChangeApplyStatus,
        onChangeAttendanceStatus,
        onDownloadDailyAttendance,
        onSaveAttendanceDailyList,
        onTextFieldChange
    } = props;

    const emptyOption: IDropDownOption = {
        description: resources.lblDropDownEmptyText,
        value: ''
    };

    const onDownloadDaily = (): void => {
        onDownloadDailyAttendance(resources.lblDownloadDailyName, resources.lblDownloadDailyName);
    };

    return (
        <>
            {attendanceStudentList.studentMeetingAttendanceViewModels
                && attendanceStudentList.studentMeetingAttendanceViewModels.length > 0 ? (
                    <>
                        <Grid container justifyContent="space-between">
                            <Grid item xs={12} md={3}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    id="ddlApplyStatus"
                                    label={resources.lblApplyStatus}
                                    options={attendanceStatus}
                                    value={statusAttendanceSelected ? statusAttendanceSelected : emptyOption.value}
                                    onChange={onChangeApplyStatus}
                                />
                            </Grid>
                            <Grid item className={classes.marginRight}>
                                <Button
                                    IconProps={{
                                        name: 'download'
                                    }}
                                    id="download"
                                    align="left"
                                    textVariantStyling="inherit"
                                    variant="text"
                                    onClick={onDownloadDaily}
                                >
                                    {resources.lblDownload}
                                </Button>
                            </Grid>
                        </Grid>
                        <br />
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblAttendanceDailyList"
                            variant="expansionPanels"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblName}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblAttendanceStatus}
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendanceStudentList.studentMeetingAttendanceViewModels.map((student, i) => (
                                    <TableExpandableRow
                                        key={`studentsList_${student.personId}_${i}`}
                                        expandedRowContent={
                                            (
                                                <div>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                id={`txtComments_${i}_${student.personId}`}
                                                                label={resources.lblComments}
                                                                value={student.comments}
                                                                onChange={onTextFieldChange}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            )
                                        }
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                        >
                                            <AvatarText
                                                avatarInfo={student}
                                                complement={student.withdrawn ? (
                                                    <StatusLabel
                                                        id={`stsLbl_${i}_${student.personId}`}
                                                        text={resources.lblWithdrawn}
                                                        type="draft"
                                                    />
                                                ) : undefined}
                                            />
                                        </TableCell>
                                        <TableEditableCell
                                            columnName={resources.lblAttendanceStatus}
                                            editableComponent={
                                                (
                                                    <Dropdown
                                                        emptyOption={emptyOption}
                                                        id={`ddlAttendanceDaily_${i}_${student.personId}`}
                                                        label="Status"
                                                        loading={isLoadingTable}
                                                        options={attendanceStatus}
                                                        size="small"
                                                        value={student.attendanceStatus ? student.attendanceStatus : statusAttendanceSelected}
                                                        onChange={onChangeAttendanceStatus}
                                                    />
                                                )}
                                        />
                                    </TableExpandableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <br />
                        <Grid container justifyContent="space-between">
                            <Grid item xs>
                                <ButtonGroup id="btnGroupAttendanceDailyList">
                                    <Button
                                        id="btnSaveStudent"
                                        loading={isLoadingTable}
                                        onClick={onSaveAttendanceDailyList}
                                    >
                                        {resources.btnSave}
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        <br />
                        <Illustration
                            color="secondary"
                            height="lg"
                            internalName="no-enrolled"
                            text={resources.lblNoResults}
                        />
                    </>
                )}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(DailyAttendanceTable);