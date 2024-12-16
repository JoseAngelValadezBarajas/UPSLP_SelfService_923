/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AcademicPlanCourses.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ICourseEvent } from '../../../Types/Course/ICourseEvent';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
// #endregion Imports

// #region Internal types
export interface IAcademicPlanCoursesProps {
    courses: ICourseEvent[] | undefined;
    impersonateInfo?: IImpersonateInfo;
    resources: IAcademicPlanCoursesResProps;
    showSequence: boolean;
    onButtonClick: (parameter: string) => void;
    onClickPopOver: (event: React.MouseEvent<HTMLAnchorElement>,
        year: string,
        term: string,
        session: string,
        eventId: string,
        subType: string,
        section: string,
        status: string) => void;
    onSearchSection: (id: string, eventSubType: string) => void;
}

export interface IAcademicPlanCoursesResProps {
    formatSectionDetail: string;
    lblAction: string;
    lblAnd: string;
    lblCredits: string;
    lblCourseDetail: string;
    lblMinGrade: string;
    lblMinimumGrade: string;
    lblNoCoursesAvailable: string;
    lblOr: string;
    lblRequired: string;
    lblSequence: string;
    lblSubTypeDetail: string;
    lblYes: string;
}

const styles = ((theme: Theme) => createStyles({
    marginLeftCour: {
        marginLeft: 0
    },
    marginLeftCourse: {
        marginLeft: 0
    },
    marginLeftCourse1: {
        marginLeft: Tokens.sizingSmall
    },
    marginLeftCourse2: {
        marginLeft: Tokens.spacing60
    },
    marginLeftCourse3: {
        marginLeft: Tokens.spacing80
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '3%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '30%'
            }
        }
    }
}));

type PropsWithStyles = IAcademicPlanCoursesProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const AcademicPlanCourses: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        courses,
        resources,
        showSequence,
        onButtonClick,
        onClickPopOver,
        onSearchSection
    } = props;

    if (courses && courses.length > 0) {
        return (
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblCourseList"
                variant="expansionPanels"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <span>
                                {resources.lblAction}
                            </span>
                        </TableCell>
                        <TableCell />
                        <Hidden smDown>
                            <TableCell>
                                <span>
                                    {resources.lblCourseDetail}
                                </span>
                            </TableCell>
                        </Hidden>
                        <TableCell>
                            <span>
                                {resources.lblSubTypeDetail}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span>
                                {resources.lblCredits}
                            </span>
                        </TableCell>
                        <TableCell />
                        <TableCell />
                        {showSequence && (
                            <TableCell>
                                <span>
                                    {resources.lblSequence}
                                </span>
                            </TableCell>
                        )}
                        <TableCell>
                            <span>
                                {resources.lblRequired}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span>
                                {resources.lblMinimumGrade}
                            </span>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses.map((course, i) => {
                        const onClickDetails = (): void => {
                            onButtonClick(course.id);
                        };

                        const onClickSection = (): void => {
                            onSearchSection(course.id, course.eventSubType);
                        };

                        switch (course.spacesCount) {
                            case 0:
                                classes.marginLeftCourse = classes.marginLeftCour;
                                break;
                            case 1:
                                classes.marginLeftCourse = classes.marginLeftCourse1;
                                break;
                            case 2:
                                classes.marginLeftCourse = classes.marginLeftCourse2;
                                break;
                            case 3:
                                classes.marginLeftCourse = classes.marginLeftCourse3;
                                break;
                        }

                        const onClickTakenCourse = (event: any): void => {
                            onClickPopOver(event,
                                course.takenYear,
                                course.takenTerm,
                                course.takenSession,
                                course.takenEventId,
                                course.takenSubtype,
                                course.takenSection,
                                course.isInProgress ? 'P' : course.isComplete ? 'C' : '');
                        };
                        return (
                            <TableExpandableRow key={`academicPlanCourse_${i}`}>
                                <TableCell>
                                    <Hidden smDown>
                                        {course.isComplete && (
                                            <Link
                                                onClick={onClickTakenCourse}
                                            >
                                                <Icon
                                                    name="check-feedback"
                                                    type={ResultType.success}
                                                />
                                            </Link>
                                        )}
                                        {course.isInProgress && (
                                            <Link
                                                onClick={onClickTakenCourse}
                                            >
                                                <Icon
                                                    name="hour-glass"
                                                    type={ResultType.warning}
                                                />
                                            </Link>
                                        )}
                                        {course.isNotInProgress && (
                                            <Link
                                                onClick={onClickSection}
                                            >
                                                <Icon
                                                    name="search"
                                                />
                                            </Link>
                                        )}
                                    </Hidden>
                                    <Hidden mdUp>
                                        <Grid container>
                                            <Grid item>
                                                {course.isComplete && (
                                                    <Link
                                                        onClick={onClickTakenCourse}
                                                    >
                                                        <Icon
                                                            name="check-feedback"
                                                            type={ResultType.success}
                                                        />
                                                    </Link>
                                                )}
                                                {course.isInProgress && (
                                                    <Link
                                                        onClick={onClickTakenCourse}
                                                    >
                                                        <Icon
                                                            name="hour-glass"
                                                            type={ResultType.warning}
                                                        />
                                                    </Link>
                                                )}
                                                {course.isNotInProgress && (
                                                    <Link
                                                        onClick={onClickSection}
                                                    >
                                                        <Icon
                                                            name="search"
                                                        />
                                                    </Link>
                                                )}
                                            </Grid>
                                            <Grid item>
                                                {course.name ? (
                                                    <Paragraph
                                                        id="prgSectionId"
                                                        text={Format.toString(resources.formatSectionDetail,
                                                            [course.id, course.name])}
                                                        events={[onClickDetails]}
                                                    />
                                                ) : (
                                                        <Link
                                                            id="lnkSectionIdWildCard"
                                                            onClick={onClickDetails}
                                                        >
                                                            <span>
                                                                {course.id}
                                                            </span>
                                                        </Link>
                                                    )}
                                            </Grid>
                                        </Grid>
                                    </Hidden>
                                </TableCell>
                                <TableCell>
                                    <span>
                                        {course.openParens}
                                    </span>
                                </TableCell>
                                <Hidden smDown>
                                    <TableCell>
                                        <div className={classes.marginLeftCourse}>
                                            {course.name ?
                                                (
                                                    <Paragraph
                                                        id="prgSectionId"
                                                        text={Format.toString(resources.formatSectionDetail,
                                                            [course.id, course.name])}
                                                        events={[onClickDetails]}
                                                    />
                                                ) : (
                                                    <Link
                                                        id="lnkSectionIdWildCard"
                                                        onClick={onClickDetails}
                                                    >
                                                        <span>
                                                            {course.id}
                                                        </span>
                                                    </Link>
                                                )}
                                        </div>
                                    </TableCell>
                                </Hidden>
                                <TableCell columnName={resources.lblSubTypeDetail}>
                                    <span>
                                        {course.eventSubType}
                                    </span>
                                </TableCell>
                                <TableCell columnName={resources.lblCredits}>
                                    <span>
                                        {course.credits}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span>
                                        {course.closeParens}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span>
                                        {course.logicalOperator === 'A' ?
                                            resources.lblAnd : course.logicalOperator === 'O' ?
                                                resources.lblOr : undefined
                                        }
                                    </span>
                                </TableCell>
                                {showSequence && (
                                    <TableCell columnName={resources.lblSequence}>
                                        <span>
                                            {course.enrolledSeq}
                                        </span>
                                    </TableCell>
                                )}
                                <TableCell columnName={resources.lblRequired}>
                                    {course.isRequired && (
                                        <span>
                                            {resources.lblYes}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell columnName={resources.lblMinimumGrade}>
                                    <span>
                                        {course.minGrade}
                                    </span>
                                </TableCell>
                            </TableExpandableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
    else {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <br />
                    <MessageStyled
                        classMessage="noResults"
                        message={resources.lblNoCoursesAvailable}
                    />
                </Grid>
            </Grid>
        );
    }
};
// #endregion Component

// Export: Component
export default withStyles(styles)(AcademicPlanCourses);