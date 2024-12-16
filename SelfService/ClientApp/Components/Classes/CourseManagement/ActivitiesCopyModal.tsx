/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File:ActivitiesCopyModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAssignments } from '../../../Types/Section/IAssignments';
import { ISectionCopyActivities } from '../../../Types/Section/ISectionCopyActivities';
import { IActivitiesTableResProps } from './ActivitiesTable';
// #endregion

// #region Internal types
export interface IActivitiesCopyModalProps {
    assignments: IAssignments[];
    copyActivities: ISectionCopyActivities;
    isFinishButton: boolean;
    open: boolean;
    sectionsCourses: IDropDownOption[];
    resources: IActivitiesTableResProps;
    onClose: () => void;
    onFinishCopy: () => void;
    onDropdownChange: (optionSelected: IDropDownOption, _id: string) => void;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '20%'
            }
        }
    }
}));

type PropsWithStyles = IActivitiesCopyModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ActivitiesCopyModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        assignments,
        classes,
        copyActivities,
        isFinishButton,
        open,
        sectionsCourses,
        onClose,
        onFinishCopy,
        onDropdownChange,

        resources
    } = props;

    let emptyOption: IDropDownOption;
    emptyOption = {
        description: resources.lblDropDownEmptyText,
        value: 0
    };

    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            disableHeaderTypography
            id="activitiesCopyModal"
            footer={(
                <Button
                    disabled={isFinishButton}
                    id="btnFinish"
                    onClick={onFinishCopy}
                >
                    {resources.btnFinish}
                </Button>
            )}
            fullWidth
            header={(
                <>
                    <Text size="h2">
                        {resources.lblCopyActivities}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="lg"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item>
                    <Text size="h4">
                        {resources.lblChooseSection}
                    </Text>
                </Grid>
            </Grid>
            <br />
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        id="ddlPeriod"
                        label={resources.lblPeriod}
                        options={copyActivities.periods}
                        value={copyActivities.defaultPeriod.value}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlCourse"
                        label={resources.lblCourse}
                        options={sectionsCourses ? sectionsCourses : copyActivities.sections}
                        value={copyActivities.defaultSection ? copyActivities.defaultSection.value : emptyOption}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <br />
            {assignments ?
                (
                    <Table
                        breakpoint="sm"
                        classes={{ root: classes.table }}
                        id="tblActivitiesCopy"
                        variant="expansionPanels"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">
                                    {resources.lblTitle}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblType}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblDescription}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblPossiblePoints}
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignments.map((activities, i) => (
                                <React.Fragment key={`activitiesTable_${i}`}>
                                    <TableExpandableRow key={`rowActivities_${i}`}>
                                        <TableCell>
                                            {activities.title}
                                        </TableCell>
                                        <TableCell columnName={resources.lblType}>
                                            {activities.assignmentType}
                                        </TableCell>
                                        <TableCell columnName={resources.lblDescription}>
                                            {activities.description}
                                        </TableCell>
                                        <TableCell columnName={resources.lblPossiblePoints}>
                                            {activities.possiblePoints}
                                        </TableCell>
                                    </TableExpandableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                )
                :
                (
                    <Illustration
                        height="md"
                        name="no-search-results"
                        noHeightFluid
                        text={resources.lblToStartWorking}
                    />
                )
            }
        </Modal>
    );
};
// #endregion

export default withStyles(styles)(ActivitiesCopyModal);