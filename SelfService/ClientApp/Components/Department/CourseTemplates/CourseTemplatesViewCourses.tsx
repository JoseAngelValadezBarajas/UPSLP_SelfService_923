/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: CourseTemplateViewCourses.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ICourseTemplatesViewCourses } from '../../../Types/Department/ICourseTemplatesViewCourses';
import { ICourseTemplatesResources } from '../../../Types/Resources/Department/ICourseTemplatesResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion

// #region Internal types
export interface ICourseTemplateViewCoursesProps {
    courseTemplateId: number;
    courseTemplateName: string;
    periodSelected: IDropDownOption;
    assignmentSection: ICourseTemplatesViewCourses;
    onClickAssign: () => void;
    onClickDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickSetup: () => void;
    onClickViewCourses: () => void;
    onViewDetailsSection: (id: number) => void;

    // #region Pagination
    getRowsPerPageOptions: (maxValue: number) => number[];
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    onChangePage: (_event: any, pageNumber: number) => void;
    onChangeRowsPerPage: () => void;
    // #endregion Pagination

    resources: ICourseTemplatesResources;
}

const styles = ((theme: Theme) => createStyles({
    display: {
        display: 'inline-grid'
    },
    listTyle: {
        [theme.breakpoints.down('sm')]: {
            display: 'block!important'
        },
        listStyleType: 'none',
        margin: 0,
        padding: 0
    },
    marginLeft: {
        marginLeft: Tokens.sizingMedium
    },
    marginRight: {
        marginLeft: '-1.5rem'
    },
    nameStyle: {
        marginBottom: Tokens.spacing40
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '30%'
            }
        }
    },
    textAlign: {
        textAlign: 'right'
    }
}));

type PropsWithStyles = ICourseTemplateViewCoursesProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const CourseTemplatesView: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        assignmentSection,
        classes,
        courseTemplateName,
        periodSelected,
        onClickAssign,
        onClickDelete,
        onClickSetup,
        onViewDetailsSection,

        // #region Pagination
        getRowsPerPageOptions,
        onChangePage,
        onChangeRowsPerPage,
        page,
        rowsPerPage,
        // #endregion Pagination

        resources
    } = props;

    let totalRows: number = 0;
    if (assignmentSection && assignmentSection.overallCount > 0) {
        totalRows = assignmentSection.overallCount ? assignmentSection.overallCount : 0;
    }

    const contentPage: JSX.Element = (
        <>
            <Grid container>
                <Grid item>
                    <Paragraph
                        id="prgBreadcrumbs"
                        text={Format.toString(resources.assignCourses.formatBreadcrumbAssign,
                            [resources.lblCourseTemplates, resources.lblTemplateSetup, resources.assignCourses.lblViewCourses]
                        )}
                        events={[onClickSetup]}
                    />
                </Grid>
            </Grid>
            <br />
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Text size="h3">
                                {courseTemplateName}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} justifyContent="space-between">
                        <Grid item xs={12} md={6}>
                            <Text size="h4">
                                {periodSelected.description}
                            </Text>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.textAlign}>
                            <Button
                                color="secondary"
                                id="btnAssignCourses"
                                onClick={onClickAssign}
                            >
                                {resources.lblAssign}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <br />
            <Card>
                <CardContent>
                    <>
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblCourseTemplatesView"
                            variant="expansionPanels"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.assignCourses.lblCourseName}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.assignCourses.lblSubtype}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.assignCourses.lblInstructor}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.assignCourses.lblStartDate}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.assignCourses.lblEndDate}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.assignCourses.lblStatus}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.assignCourses.lblRemove}
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assignmentSection ?
                                    assignmentSection.assignmentSections.map((courses, i) => {
                                        const onViewSection = (): void => {
                                            onViewDetailsSection(courses.sectionId);
                                        };
                                        return (
                                            <React.Fragment key={`coursesTable_${i}`}>
                                                <TableExpandableRow
                                                    key={`coursesList_${i}`}
                                                >
                                                    <TableCell>
                                                        <Button
                                                            align="left"
                                                            id={`courseName_${courses.sectionId}`}
                                                            textVariantStyling="inherit"
                                                            variant="text"
                                                            onClick={onViewSection}
                                                        >
                                                            {Format.toString(resources.assignCourses.formatCourseName,
                                                                [courses.eventId, courses.eventName])}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell columnName={resources.assignCourses.lblSubtype}>
                                                        {courses.eventSubType}
                                                    </TableCell>
                                                    <TableCell columnName={resources.assignCourses.lblInstructor}>
                                                        <ul className={classes.listTyle}>
                                                            {courses.instructorNames.map((name, i) => (
                                                                <li
                                                                    className={classes.nameStyle}
                                                                    key={`description_${name}_${i}`}
                                                                >
                                                                    {name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </TableCell>
                                                    <TableCell columnName={resources.assignCourses.lblStartDate}>
                                                        {courses.startDate}
                                                    </TableCell>
                                                    <TableCell columnName={resources.assignCourses.lblEndDate}>
                                                        {courses.endDate}
                                                    </TableCell>
                                                    <TableCell columnName={resources.assignCourses.lblStatus}>
                                                        <div className={classes.display}>
                                                            {courses.hasPostedGrades ?
                                                                (
                                                                    <StatusLabel
                                                                        id={`stsLbl_${i}_posted_${courses.eventId}`}
                                                                        text={resources.assignCourses.lblHasPostedGrades}
                                                                        type={'draft'}
                                                                    />
                                                                )
                                                                : undefined}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Grid container>
                                                            <Grid item>
                                                                {courses.hasPostedGrades ?
                                                                    (
                                                                        <IconButton
                                                                            color="secondary"
                                                                            disabled={true}
                                                                            id="btnDelete"
                                                                        >
                                                                            <Icon name="trash" />
                                                                        </IconButton>
                                                                    )
                                                                    :
                                                                    (
                                                                        <Tooltip
                                                                            id="deleteCourseTemplate"
                                                                            title={resources.btnDelete}
                                                                        >
                                                                            <IconButton
                                                                                color="secondary"
                                                                                aria-label={resources.btnDelete}
                                                                                id={`btnDelete_${courses.sectionId}_${courses.eventId}_${courses.eventName}`}
                                                                                onClick={onClickDelete}
                                                                            >
                                                                                <Icon name="trash" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                </TableExpandableRow>
                                            </React.Fragment>
                                        );
                                    })
                                    : undefined}
                            </TableBody>
                        </Table>
                        {rowsPerPage > 0 ? (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={totalRows}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={getRowsPerPageOptions(totalRows)}
                                        onPageChange={onChangePage}
                                        onRowsPerPageChange={onChangeRowsPerPage}
                                    />
                                </Grid>
                            </Grid >
                        ) : undefined}
                    </>
                </CardContent>
            </Card>
        </>
    );

    return (
        <>
            {contentPage}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(CourseTemplatesView);