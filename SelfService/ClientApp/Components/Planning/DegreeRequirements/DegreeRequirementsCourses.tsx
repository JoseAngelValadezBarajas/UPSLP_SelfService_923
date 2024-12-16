/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DegreeRequirementsCourses.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ICourseEvent } from '../../../Types/Course/ICourseEvent';
// #endregion Imports

// #region Internal types
export interface IDegreeRequirementsCoursesProps {
    courses: ICourseEvent[] | undefined;
    personId?: number;
    resources: IDegreeRequirementsCoursesResProps;
    showPadding: boolean;
    showMinGrade: boolean;
    showStatusIcons: boolean;
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
    onSearchSection: (id: string) => void;
    classificationIndex?: number;
    disciplineIndex?: number;
}

export interface IDegreeRequirementsCoursesResProps {
    formatFindSections: string;
    formatSectionDetail: string;
    formatViewDetails: string;
    lblAnd: string;
    lblCourseDetail: string;
    lblFindSections: string;
    lblMinimumGrade: string;
    lblNoCoursesAvailable: string;
    lblOr: string;
    lblRequired: string;
    lblSequence: string;
    lblSubTypeDetail: string;
    lblViewDetails: string;
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
    padding: {
        paddingBottom: '200px'
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

type PropsWithStyles = IDegreeRequirementsCoursesProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const DegreeRequirementsCourses: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        courses,
        resources,
        showPadding,
        showSequence,
        showStatusIcons,
        onButtonClick,
        onClickPopOver,
        onSearchSection,
        classificationIndex,
        disciplineIndex
    } = props;

    if (courses && courses.length > 0) {
        return (
            <div className={showPadding ? classes.padding : undefined}>
                <Table
                    breakpoint="sm"
                    classes={{ root: classes.table }}
                    id="tblCourseList"
                    variant="expansionPanels"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell />
                            <TableCell>
                                <span>
                                    {resources.lblCourseDetail}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span>
                                    {resources.lblSubTypeDetail}
                                </span>
                            </TableCell>
                            <TableCell />
                            <TableCell />
                            {showSequence ?
                                (
                                    <TableCell>
                                        <span>
                                            {resources.lblSequence}
                                        </span>
                                    </TableCell>
                                ) : undefined}
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
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course, i) => {
                            const onClickDetails = (): void => {
                                onButtonClick(course.id);
                            };

                            const onClickSection = (): void => {
                                onSearchSection(course.id);
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
                                <React.Fragment key={`degReqCourse_${i}`}>
                                    <TableExpandableRow>
                                        <TableCell>
                                            <Hidden smDown>
                                                {showStatusIcons ?
                                                    (
                                                        <div>
                                                            {course.isComplete ?
                                                                (
                                                                    <Tooltip
                                                                        id="tltViewDetails"
                                                                        title={resources.lblViewDetails}
                                                                        placement="top"
                                                                    >
                                                                        <IconButton
                                                                            aria-label={Format.toString(resources.formatViewDetails, [course.name])}
                                                                            onClick={onClickTakenCourse}
                                                                            color="gray"
                                                                            id={`btnCourseInfo_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                        >
                                                                            <Icon
                                                                                name="check-feedback"
                                                                                type={ResultType.success}
                                                                            />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )
                                                                : undefined}
                                                            {course.isInProgress ?
                                                                (
                                                                    <Tooltip
                                                                        id="tltViewDetails"
                                                                        title={resources.lblViewDetails}
                                                                        placement="top"
                                                                    >
                                                                        <IconButton
                                                                            aria-label={Format.toString(resources.formatViewDetails, [course.name])}
                                                                            onClick={onClickTakenCourse}
                                                                            color="gray"
                                                                            id={`btnCourseInfo_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                        >
                                                                            <Icon
                                                                                name="hour-glass"
                                                                                type={ResultType.warning}
                                                                            />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )
                                                                : undefined}
                                                            {course.isNotInProgress ?
                                                                (
                                                                    <Tooltip
                                                                        id="tltSearchSections"
                                                                        title={resources.lblFindSections}
                                                                        placement="top"
                                                                    >
                                                                        <IconButton
                                                                            aria-label={Format.toString(resources.formatFindSections, [course.name])}
                                                                            onClick={onClickSection}
                                                                            color="gray"
                                                                            id={`btnCourseInfo_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                        >
                                                                            <Icon name="search" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )
                                                                : undefined}
                                                        </div>
                                                    )
                                                    : undefined}
                                            </Hidden>
                                            <Hidden mdUp>
                                                <Grid container>
                                                    <Grid item>
                                                        {showStatusIcons ?
                                                            (
                                                                <div>
                                                                    {course.isComplete ?
                                                                        (
                                                                            <Tooltip
                                                                                id="tltViewDetails"
                                                                                title={resources.lblViewDetails}
                                                                                placement="top"
                                                                            >
                                                                                <IconButton
                                                                                    aria-label={Format.toString(resources.formatViewDetails, [course.name])}
                                                                                    onClick={onClickTakenCourse}
                                                                                    color="gray"
                                                                                    id={`btnCourseInfo_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                                >
                                                                                    <Icon
                                                                                        name="check-feedback"
                                                                                        type={ResultType.success}
                                                                                    />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        )
                                                                        : undefined}
                                                                    {course.isInProgress ?
                                                                        (
                                                                            <Tooltip
                                                                                id="tltViewDetails"
                                                                                title={resources.lblViewDetails}
                                                                                placement="top"
                                                                            >
                                                                                <IconButton
                                                                                    aria-label={Format.toString(resources.formatViewDetails, [course.name])}
                                                                                    onClick={onClickTakenCourse}
                                                                                    color="gray"
                                                                                    id={`btnCourseInfo_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                                >
                                                                                    <Icon
                                                                                        name="hour-glass"
                                                                                        type={ResultType.warning}
                                                                                    />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        )
                                                                        : undefined}
                                                                    {course.isNotInProgress ?
                                                                        (

                                                                            <Tooltip
                                                                                id="tltSearchSections"
                                                                                title={resources.lblFindSections}
                                                                                aria-label="Buscar secciones del curso"
                                                                                placement="top"
                                                                            >
                                                                                <IconButton
                                                                                    aria-label={Format.toString(resources.formatFindSections, [course.name])}
                                                                                    onClick={onClickSection}
                                                                                    id={`btnCourseInfo_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                                >
                                                                                    <Icon name="search" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        )
                                                                        : undefined}
                                                                </div>
                                                            )
                                                            : undefined}
                                                    </Grid>
                                                    <Grid item>
                                                        {course.name ?
                                                            (
                                                                <Paragraph
                                                                    id={`prgSectionId_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                    text={Format.toString(resources.formatSectionDetail,
                                                                        [course.id, course.name])}
                                                                    events={[onClickDetails]}
                                                                />
                                                            )
                                                            :
                                                            (
                                                                <Link
                                                                    id={`lnkSectionIdWildCard_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                    onClick={onClickDetails}
                                                                >
                                                                    <span>
                                                                        {course.id}
                                                                    </span>
                                                                </Link>
                                                            )
                                                        }
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
                                                                id={`prgSectionId_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                text={Format.toString(resources.formatSectionDetail,
                                                                    [course.id, course.name])}
                                                                events={[onClickDetails]}
                                                            />
                                                        )
                                                        : (
                                                            <Link
                                                                id={`lnkSectionIdWildCard_${disciplineIndex}_${classificationIndex}_${i}`}
                                                                onClick={onClickDetails}
                                                            >
                                                                <span>
                                                                    {course.id}
                                                                </span>
                                                            </Link>
                                                        )
                                                    }
                                                </div>
                                            </TableCell>
                                        </Hidden>
                                        <TableCell columnName={resources.lblSubTypeDetail}>
                                            <span>
                                                {course.eventSubType}
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
                                        {showSequence ?
                                            (
                                                <TableCell columnName={resources.lblSequence}>
                                                    <span>
                                                        {course.enrolledSeq}
                                                    </span>
                                                </TableCell>
                                            )
                                            : undefined}
                                        <TableCell columnName={resources.lblRequired}>
                                            {course.isRequired ?
                                                (
                                                    <span>
                                                        {resources.lblYes}
                                                    </span>
                                                )
                                                : undefined}
                                        </TableCell>
                                        <TableCell columnName={resources.lblMinimumGrade}>
                                            <span>
                                                {course.minGrade}
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
export default withStyles(styles)(DegreeRequirementsCourses);