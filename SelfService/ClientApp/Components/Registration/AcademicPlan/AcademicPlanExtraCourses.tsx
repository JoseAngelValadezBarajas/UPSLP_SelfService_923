/* Copyright 2018-2023 Ellucian Company L.P. and its affiliates.
 * File: AcademicPlanExtraCourses.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ICourseEvent } from '../../../Types/Course/ICourseEvent';
// #endregion Imports

// #region Internal types
export interface IAcademicPlanExtraCoursesProps {
    courses: ICourseEvent[] | undefined;
    expanded: boolean;
    resources: IAcademicPlanExtraCoursesResProps;
    showPadding: boolean;
    onButtonClick: (parameter: string) => void;
    onExpand: (event: any, expanded: boolean) => void;
}

export interface IAcademicPlanExtraCoursesResProps {
    formatSectionDetail: string;
    lblCoursesNotAssignedAcaPlan: string;
    lblCredits: string;
    lblCourseCompleted: string;
    lblCourseInProgress: string;
    lblCourseStatus: string;
    lblCourse: string;
}

const styles = ((theme: Theme) => createStyles({
    padding: {
        paddingBottom: '200px'
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '3%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '30%'
            }
        }
    }
}));

type PropsWithStyles = IAcademicPlanExtraCoursesProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const AcademicPlanExtraCourses: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        courses,
        expanded,
        resources,
        showPadding,
        onButtonClick,
        onExpand
    } = props;

    let header: JSX.Element | undefined;
    let content: JSX.Element | undefined;

    header = (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <Text size="h3">
                    {resources.lblCoursesNotAssignedAcaPlan}
                </Text>
            </Grid>
        </Grid>
    );

    if (courses && courses.length > 0) {
        content = (
            <div className={showPadding ? classes.padding : undefined}>
                <Table
                    breakpoint="sm"
                    classes={{ root: classes.table }}
                    id="tblCourseList"
                    variant="expansionPanels"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {resources.lblCourseStatus}
                            </TableCell>
                            <TableCell>
                                {resources.lblCourse}
                            </TableCell>
                            <TableCell>
                                {resources.lblCredits}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course, iCourse) => {
                            const onClickDetails = (): void => {
                                onButtonClick(course.id);
                            };

                            return (
                                <React.Fragment key={`academicPlanCourse_${iCourse}`}>
                                    <TableExpandableRow>
                                        <TableCell>
                                            <Hidden smDown>
                                                <div>
                                                    {course.isComplete && (
                                                        <Icon
                                                            aria-label={resources.lblCourseCompleted}
                                                            name="check-feedback"
                                                            type={ResultType.success}
                                                        />
                                                    )}
                                                    {course.isInProgress && (
                                                        <Icon
                                                            aria-label={resources.lblCourseInProgress}
                                                            name="hour-glass"
                                                            type={ResultType.warning}
                                                        />
                                                    )}
                                                </div>
                                            </Hidden>
                                            <Hidden mdUp>
                                                <Grid container>
                                                    <Grid item>
                                                        <div>
                                                            {course.isComplete && (
                                                                <Icon
                                                                    name="check-feedback"
                                                                    type={ResultType.success}
                                                                />
                                                            )}
                                                            {course.isInProgress && (
                                                                <Icon
                                                                    name="hour-glass"
                                                                    type={ResultType.warning}
                                                                />
                                                            )}
                                                        </div>
                                                    </Grid>
                                                    <Grid item>
                                                        <Paragraph
                                                            id="prgCourseId"
                                                            text={Format.toString(resources.formatSectionDetail,
                                                                [course.id, course.name])}
                                                            events={[onClickDetails]}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Hidden>
                                        </TableCell>
                                        <Hidden smDown>
                                            <TableCell>
                                                <Paragraph
                                                    id="prgCourseId"
                                                    text={Format.toString(resources.formatSectionDetail,
                                                        [course.id, course.name])}
                                                    events={[onClickDetails]}
                                                />
                                            </TableCell>
                                        </Hidden>
                                        <TableCell>
                                            <span>
                                                {course.credits !== '' ? `${resources.lblCredits}${' '}${course.credits}` : ''}
                                            </span>
                                        </TableCell>
                                    </TableExpandableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <>
            <br />
            <ExpansionPanel
                expanded={expanded}
                header={header}
                onChange={onExpand}
            >
                {content}
            </ExpansionPanel>
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(AcademicPlanExtraCourses);