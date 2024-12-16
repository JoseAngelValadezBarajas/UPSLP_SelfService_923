/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: CoursesModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ICourseCatalog } from '../../Types/Course/ICourseCatalog';
// #endregion Imports

// #region Internal types
export interface ICoursesModalProps {
    courseDetail: ICourseCatalog[];
    open: boolean;
    overallCount: number;
    page: number;
    resources: ICoursesModalResProps;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    selectedCourse: string;
    onChangePage: (_event: any, page: number) => void;
    onChangeRowsPerPage: (event: any) => void;
    onClose: () => void;
    onCourseDetail: (id: string) => void;
    onSeachSection: (id: string) => void;
}

export interface ICoursesModalResProps {
    formatCourseName: string;
    formatCoursesFor: string;
    lblCourseCatalog: string;
    lblCourseDetail: string;
    lblDescriptionDetail: string;
    lblFindCourseSection: string;
    lblSubTypes: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '25%'
            },
            '& > thead > tr > th:nth-child(4)': {
                width: '20%'
            }
        }
    },
    tableCell: {
        textAlign: 'center'
    }
}));

type PropsWithStyles = ICoursesModalProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const CoursesModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        courseDetail,
        open,
        page,
        resources,
        rowsPerPage,
        rowsPerPageOptions,
        selectedCourse,
        overallCount,
        onChangePage,
        onChangeRowsPerPage,
        onClose,
        onCourseDetail,
        onSeachSection
    } = props;

    return (
        <Modal
            disableHeaderTypography
            id="courseDetailModalTitle"
            header={(
                <>
                    <Text size="h2">
                        {resources.lblCourseCatalog}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Text size="h4">
                {Format.toString(resources.formatCoursesFor, [selectedCourse])}
            </Text>
            <br />
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblCourseCatalogModal"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <span>
                                {resources.lblCourseDetail}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span>
                                {resources.lblSubTypes}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span>
                                {resources.lblDescriptionDetail}
                            </span>
                        </TableCell>
                        <TableCell classes={{ root: classes.tableCell }}>
                            <span>
                                {resources.lblFindCourseSection}
                            </span>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courseDetail.map((course, i) => {
                        const onClickSection = (): void => {
                            onSeachSection(course.code);
                        };

                        const onClickCourse = (): void => {
                            onCourseDetail(course.code);
                        };

                        return (
                            <React.Fragment key={`academicPlanCourseModal_${i}`}>
                                <TableRow>
                                    <TableCell>
                                        <Link
                                            key={`CourseCatalogId_${i}`}
                                            onClick={onClickCourse}
                                        >
                                            <span>
                                                {Format.toString(resources.formatCourseName, [course.code, course.name])}
                                            </span>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <span>
                                            {course.subtypes}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span>
                                            {course.description}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        classes={{ root: classes.tableCell }}
                                    >
                                        <Link
                                            key={`IsNotCompletedCourse_${i}`}
                                            onClick={onClickSection}
                                        >
                                            <Icon
                                                name="search"
                                            />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
            {rowsPerPage > 0 ? (
                <Grid container>
                    <Grid item xs>
                        <Pagination
                            count={overallCount}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={rowsPerPageOptions}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />
                    </Grid>
                </Grid >
            ) : undefined}
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(CoursesModal);