/* Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 * File: CoursePopOver.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Popover from '@hedtech/powercampus-design-system/react/core/Popover';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ICourseTaken } from '../../Types/Course/ICourseTaken';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #region Internal types
export interface ICoursePopOverProps {
    courses: ICourseTaken;
    onClosePopOver: () => void;
    viewCommentsAnchor?: any;

    resources: ICoursePopOverResProps;
}

export interface ICoursePopOverResProps {
    lblCompleted: string;
    lblCourseId: string;
    lblCredits: string;
    lblFinalGrade: string;
    lblInProgress: string;
    lblName: string;
    lblSession: string;
    lblSubType: string;
}

const styles = ((theme: Theme) => createStyles({
    containerPopover: {
        [theme.breakpoints.up('lg')]: {
            width: '300px'
        },
        [theme.breakpoints.only('sm')]: {
            width: '300px'
        },
        height: 'auto',
        margin: `${Tokens.spacing60} ${Tokens.sizingXLarge}`,
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: '12.5rem'
    }
}));

type PropsWithStyles = ICoursePopOverProps & WithStyles<typeof styles>;

// #region Component
const CoursePopOver: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        classes,
        courses,
        onClosePopOver,
        viewCommentsAnchor,

        resources
    } = props;

    return (
        <Popover
            anchorEl={viewCommentsAnchor}
            open={Boolean(viewCommentsAnchor)}
            onClose={onClosePopOver}
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'top'
            }}
            transformOrigin={{
                horizontal: 'left',
                vertical: 'top'
            }}
        >
            <div className={classes.containerPopover}>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Text size="h3">
                            {courses.yearTerm}
                        </Text>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StatusLabel
                            id="stsLable"
                            text={courses.status === 'P' ? resources.lblInProgress : resources.lblCompleted}
                            type={courses.status === 'P' ? 'draft' : 'success'}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {resources.lblSession}
                        </Text>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {courses.session}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {resources.lblCourseId}
                        </Text>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {courses.eventId}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {resources.lblSubType}
                        </Text>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {courses.subType}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {resources.lblName}
                        </Text>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {courses.eventName}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {resources.lblCredits}
                        </Text>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {courses.credits}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {resources.lblFinalGrade}
                        </Text>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Text>
                            {courses.finalGrade}
                        </Text>
                    </Grid>
                </Grid>
            </div>
        </Popover>
    );

};
// #endregion

// Export: Component
export default withStyles(styles)(CoursePopOver);