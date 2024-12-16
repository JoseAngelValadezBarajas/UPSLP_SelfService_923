/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: CourseTemplateAssign.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ICourseTemplates } from '../../../Types/Department/ICourseTemplates';
import { ICourseTemplatesAssignCourses } from '../../../Types/Department/ICourseTemplatesAssignCourses';
import { ICourseTemplatesAssignmentSearch } from '../../../Types/Department/ICourseTemplatesAssignmentSearch';
import { ICourseTemplatesAssignOptions } from '../../../Types/Department/ICourseTemplatesAssignOptions';
import { ICourseTemplatesResources } from '../../../Types/Resources/Department/ICourseTemplatesResources';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion

// #region Internal types
export interface ICourseTemplateAssignProps {
    checkboxHeader: boolean;
    courseTemplateFilterSearch: ICourseTemplatesAssignmentSearch;
    courseTemplateId: number;
    courseTemplateName: string;
    courseTemplates: ICourseTemplates;
    filterOptions: ICourseTemplatesAssignOptions;
    isDepartmentSelected: boolean;
    periodSelected: IDropDownOption;
    sectionAssignments: ICourseTemplatesAssignCourses;
    showAssignButton: boolean;
    templateIsAssigned: boolean;
    onAssignCourses: () => void;
    onChangeCheckHeader: () => void;
    onChangeCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickClear: () => void;
    onClickSetup: () => void;
    onClickViewCourses: () => void;
    onDropdownChangeFilter: (optionSelected: IDropDownOption, id: string) => void;
    onSearchCourses: () => void;

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
    marginLeft: {
        marginLeft: Tokens.sizingMedium
    },
    marginRight: {
        marginLeft: '-1.5rem'
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: Tokens.spacing60
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '30%'
            }
        }
    },
    textAlign: {
        textAlign: 'right'
    }
}));

type PropsWithStyles = ICourseTemplateAssignProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const CourseTemplatesAssign: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        classes,
        checkboxHeader,
        courseTemplateFilterSearch,
        courseTemplateName,
        isDepartmentSelected,
        filterOptions,
        periodSelected,
        sectionAssignments,
        showAssignButton,
        templateIsAssigned,
        onAssignCourses,
        onChangeCheckHeader,
        onChangeCheckbox,
        onClickClear,
        onClickSetup,
        onClickViewCourses,
        onDropdownChangeFilter,
        onSearchCourses,

        // #region Pagination
        getRowsPerPageOptions,
        onChangePage,
        onChangeRowsPerPage,
        page,
        rowsPerPage,
        // #endregion Pagination

        resources
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

    const statusOptions: IDropDownOption[] = [
        { value: 1, description: resources.assignCourses.lblHasActivitiesCreated },
        { value: 2, description: resources.assignCourses.lblHasTemplateAssigned }
    ];

    let emptyOption: IDropDownOption;
    emptyOption = {
        description: resources.assignCourses.lblDropDownEmptyText,
        value: 0
    };

    let totalRows: number = 0;
    if (sectionAssignments && sectionAssignments.overallCount > 0) {
        totalRows = sectionAssignments.overallCount ? sectionAssignments.overallCount : 0;
    }

    let contentPage: JSX.Element | undefined;
    contentPage = (
        <>
            <Grid container>
                <Grid item>
                    <Paragraph
                        id="prgBreadcrumbs"
                        text={Format.toString(resources.assignCourses.formatBreadcrumbAssign,
                            [resources.lblCourseTemplates, resources.lblTemplateSetup, resources.assignCourses.lblAssignCourseTemplate]
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
                        {templateIsAssigned && (
                            <Grid item xs={12} md={6} className={classes.textAlign}>
                                <Button
                                    color="secondary"
                                    id="btnViewCourses"
                                    onClick={onClickViewCourses}
                                >
                                    {resources.lblViewAssignedCourses}
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
            <br />
            <Card>
                <CardContent>
                    <Grid container>
                        <Grid item>
                            <Text size="h3">
                                {resources.assignCourses.lblFilter}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlDepartment"
                                label={resources.assignCourses.lblDepartment}
                                options={filterOptions.departments}
                                value={courseTemplateFilterSearch ? courseTemplateFilterSearch.departmentId : emptyOption.value}
                                onChange={onDropdownChangeFilter}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlSubtype"
                                label={resources.assignCourses.lblSubtype}
                                options={filterOptions.subtypes}
                                value={courseTemplateFilterSearch ? courseTemplateFilterSearch.subTypeId : emptyOption.value}
                                onChange={onDropdownChangeFilter}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlClassLevel"
                                label={resources.assignCourses.lblClassLevel}
                                options={filterOptions.classLevels}
                                value={courseTemplateFilterSearch ? courseTemplateFilterSearch.classLevelId : emptyOption.value}
                                onChange={onDropdownChangeFilter}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlStatus"
                                label={resources.assignCourses.lblStatus}
                                options={statusOptions}
                                value={courseTemplateFilterSearch ? courseTemplateFilterSearch.status : emptyOption.value}
                                onChange={onDropdownChangeFilter}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-between">
                        <Grid item xs={12} sm={6} md={6}>
                            <Button
                                disabled={isDepartmentSelected}
                                id="btnFilterSearch"
                                onClick={onSearchCourses}
                            >
                                {resources.assignCourses.btnSearch}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} className={classes.textAlign}>
                            <Link
                                id="lnkClearFilters"
                                onClick={onClickClear}
                            >

                                <Text color="inherit">
                                    {resources.assignCourses.lblClearFilters}
                                </Text>
                            </Link>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <br />
            {sectionAssignments ?
                sectionAssignments.overallCount > 0 ?
                    (
                        <Card>
                            <CardContent>
                                <br />
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Text size="h4">
                                            {Format.toString(resources.assignCourses.formatAssign, [courseTemplateName])}
                                        </Text>
                                    </Grid>
                                    {showAssignButton ?
                                        (
                                            <Grid item xs={12}>
                                                <Button
                                                    id="btnAssign"
                                                    onClick={onAssignCourses}
                                                >
                                                    {resources.assignCourses.btnAssign}
                                                </Button>
                                            </Grid>
                                        )
                                        : undefined}
                                </Grid>
                                <br />
                                <>
                                    <Table
                                        breakpoint="sm"
                                        classes={{ root: classes.table }}
                                        id="tblCourseTemplatesList"
                                        variant="expansionPanels"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={checkboxHeader || showAssignButton}
                                                        id="chkSelectAll"
                                                        indeterminate={!checkboxHeader && showAssignButton}
                                                        inputProps={{
                                                            'aria-label': layoutResources?.lblSelectAll
                                                        }}
                                                        onChange={onChangeCheckHeader}
                                                    />
                                                </TableCell>
                                                <TableCell component="th">
                                                    {resources.assignCourses.lblCourseName}
                                                </TableCell>
                                                <TableCell component="th">
                                                    {resources.assignCourses.lblSection}
                                                </TableCell>
                                                <TableCell component="th">
                                                    {resources.assignCourses.lblStatus}
                                                </TableCell>
                                                <TableCell />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sectionAssignments ?
                                                sectionAssignments.sectionAssignments.map((courses, i) => (
                                                    <React.Fragment key={`coursesTable_${i}`}>
                                                        <TableExpandableRow
                                                            key={`coursesList_${i}`}
                                                        >
                                                            {courses.hasGrades || courses.hasPostedGrades ?
                                                                (
                                                                    <>
                                                                        <Hidden smDown>
                                                                            <TableCell />
                                                                        </Hidden>
                                                                        <Hidden mdUp>
                                                                            <TableCell>
                                                                                {courses.eventName}
                                                                            </TableCell>
                                                                        </Hidden>
                                                                    </>
                                                                )
                                                                :
                                                                (
                                                                    <>
                                                                        <Hidden smDown>
                                                                            <TableCell>
                                                                                <Checkbox
                                                                                    checked={courses.checked ? true : false}
                                                                                    id={`chkSelect_${courses.sectionId}_${i}`}
                                                                                    inputProps={{
                                                                                        'aria-label': Format.toString(resources.assignCourses.formatSelectTemplate, [courses.eventName])
                                                                                    }}
                                                                                    onChange={onChangeCheckbox}
                                                                                />
                                                                            </TableCell>
                                                                        </Hidden>
                                                                        <Hidden mdUp>
                                                                            <TableCell>
                                                                                <div>
                                                                                    <Checkbox
                                                                                        checked={courses.checked ? true : false}
                                                                                        id={`chkSelect_${courses.sectionId}_${i}`}
                                                                                        inputProps={{
                                                                                            'aria-label': Format.toString(resources.assignCourses.formatSelectTemplate, [courses.eventName])
                                                                                        }}
                                                                                        onChange={onChangeCheckbox}
                                                                                    />
                                                                                    {courses.eventName}
                                                                                </div>
                                                                            </TableCell>
                                                                        </Hidden>
                                                                    </>
                                                                )
                                                            }
                                                            <Hidden smDown>
                                                                <TableCell columnName={resources.assignCourses.lblCourseName}>
                                                                    {courses.eventName}
                                                                </TableCell>
                                                            </Hidden>
                                                            <TableCell columnName={resources.assignCourses.lblSection}>
                                                                {Format.toString(resources.assignCourses.formatCourseSection,
                                                                    [courses.eventId, courses.eventSubType, courses.sectionIdentifier])}
                                                            </TableCell>
                                                            <TableCell columnName={resources.assignCourses.lblStatus}>
                                                                <div className={classes.display}>
                                                                    {courses.hasActivities && (
                                                                        <StatusLabel
                                                                            id={`stsLbl_${i}_activities_${courses.eventId}`}
                                                                            text={resources.assignCourses.lblHasActivities}
                                                                            type={'draft'}
                                                                        />
                                                                    )}
                                                                    {courses.hasGrades && (
                                                                        <StatusLabel
                                                                            id={`stsLbl_${i}_grades_${courses.eventId}`}
                                                                            text={resources.assignCourses.lblHasGrades}
                                                                            type={'draft'}
                                                                        />
                                                                    )}
                                                                    {courses.hasPostedGrades && (
                                                                        <StatusLabel
                                                                            id={`stsLbl_${i}_posted_${courses.eventId}`}
                                                                            text={resources.assignCourses.lblHasPostedGrades}
                                                                            type={'draft'}
                                                                        />
                                                                    )}
                                                                    {courses.hasTemplate && (
                                                                        <StatusLabel
                                                                            id={`stsLbl_${i}_template_${courses.eventId}`}
                                                                            text={resources.assignCourses.lblHasTemplateAssigned}
                                                                            type={'draft'}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableExpandableRow>
                                                    </React.Fragment>
                                                ))
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
                    )
                    :
                    (
                        <MessageStyled
                            classMessage="noResults"
                            message={resources.assignCourses.lblNoSections}
                        />
                    )
                :
                (
                    <Illustration
                        color="secondary"
                        name="no-search-results"
                        text={resources.assignCourses.lblNoDepartment}
                    />
                )
            }
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
export default withStyles(styles)(CourseTemplatesAssign);