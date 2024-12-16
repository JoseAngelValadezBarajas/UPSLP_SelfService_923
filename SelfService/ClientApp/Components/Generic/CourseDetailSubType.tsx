/* Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 * File: CourseDetailSubType.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import { createStyles, Theme, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ISubType } from '../../Types/Course/ISubType';
// #endregion Imports

// #region Internal types
export interface ICourseDetailSubTypeProps {
    resources: ICourseDetailSubTypeResProps;
    subType: ISubType;
    id?: string;
}

export interface ICourseDetailSubTypeResProps {
    lblCorequisite: string;
    lblCredits: string;
    lblCreditTypes: string;
    lblDescription: string;
    lblEmpty: string;
    lblFees: string;
    lblPrerequisites: string;
}

const styles = ((theme: Theme) => createStyles({
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

type PropsWithStyles = ICourseDetailSubTypeProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const CourseDetailSubType: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        resources,
        subType,
        id
    } = props;

    let content: JSX.Element;
    content = (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblDescription}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Text>
                        {(subType.description && subType.description !== '') ? subType.description : resources.lblEmpty}
                    </Text>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblPrerequisites}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Text>
                        {subType.prerequisiteCondition !== '' ? subType.prerequisiteCondition : resources.lblEmpty}
                    </Text>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblCorequisite}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Text>
                        {subType.corequisiteCondition !== '' ? subType.corequisiteCondition : resources.lblEmpty}
                    </Text>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblFees}
                    </Text>
                </Grid >
                <Grid item xs={12} md={9}>
                    <Text>
                        {subType.courseFeeCondition !== '' ? subType.courseFeeCondition : resources.lblEmpty}
                    </Text>
                </Grid >
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblCredits}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Text>
                        {subType.credits}
                    </Text>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblCreditTypes}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Text>
                        {subType.creditTypeCondition !== '' ? subType.creditTypeCondition : resources.lblEmpty}
                    </Text>
                </Grid>
            </Grid>
        </>
    );

    return (
        <>
            <br />
            <ExpansionPanel
                header={(
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Text size="h4">
                                {subType.name}
                            </Text>
                        </Grid>
                    </Grid>
                )}
                id={id}
            >
                {content}
            </ExpansionPanel>
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(CourseDetailSubType);