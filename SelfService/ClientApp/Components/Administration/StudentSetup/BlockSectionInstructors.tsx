/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: BlockSectionInstructors.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface IBlockSectionInstructorsProps {
    resources: IBlockSectionInstructorsResProps;
    section: ISection;
}

export interface IBlockSectionInstructorsResProps {
    lblInstructors: string;
    lblNoInstructor: string;
}

const styles = createStyles({
    avatar: {
        marginLeft: '0rem!important'
    },
    centered: {
        alignItems: 'center',
        display: 'flex'
    },
    instructorName: {
        wordBreak: 'normal'
    }
});

type PropsWithStyles = IBlockSectionInstructorsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const BlockSectionInstructors: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        resources,
        section
    } = props;

    // #region Instructor(s)
    let instructors: JSX.Element | JSX.Element[] | undefined;
    if (section.instructors && section.instructors.length > 0) {
        instructors = section.instructors.map((instructor, i) => (
            <Grid item className={classes.centered} key={`instructor_${i}`}>
                <div>
                    <Avatar
                        id={`avatar_firstLetter_${i}`}
                        backgroundNumber={instructor.colorFirstLetter}
                        classes={{ root: classes.avatar }}
                    >
                        {instructor.firstLetter}
                    </Avatar>
                </div>
                <div>
                    <Text
                        className={classes.instructorName}
                    >
                        {instructor.fullName}
                    </Text>
                </div>
            </Grid>
        ));
    }
    else {
        instructors = (
            <Grid item xs className={classes.centered}>
                <div>
                    <Avatar id="avatar_noInstructor" background="default" classes={{ root: classes.avatar }} />
                </div>
                <div>
                    <Text className={classes.instructorName}>
                        {resources.lblNoInstructor}
                    </Text>
                </div>
            </Grid>
        );
    }
    // #endregion Instructor(s)

    return (
        <>
            <Grid container>
                <Grid item>
                    <Text weight="strong">
                        {resources.lblInstructors}
                    </Text>
                </Grid>
            </Grid>
            <Grid container>
                {instructors}
            </Grid>
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(BlockSectionInstructors);