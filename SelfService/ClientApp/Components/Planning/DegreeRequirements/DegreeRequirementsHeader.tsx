/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: DegreeRequirementsHeader.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Types
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
// #endregion Imports

// #region Internal Types
export interface IDegreeRequirementsHeaderProps {
    allExpanded: boolean;
    courseMax: number;
    courseMin: number;
    discipline: number;
    formalTitle: string;
    onExpandAll: (event: React.MouseEvent<HTMLButtonElement>) => void;
    programId: number;
    resources: IDegreeRequirementsHeaderResProps;
}

export interface IDegreeRequirementsHeaderResProps {
    lblCourse: string;
    lblDiscipline: string;
    lblMax: string;
    lblMin: string;
}

const styles = (theme: Theme) => createStyles({
    backgroundContainer: {
        justifyContent: 'left',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center'
        }
    },
    border: {
        [theme.breakpoints.down('xs')]: {
            borderColor: Tokens.colorBrandNeutral400
        },
        borderColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.spacing30,
        borderStyle: 'solid',
        borderWidth: 'thin',
        display: 'inline-flex',
        marginRight: '3.4375rem',
        marginTop: Tokens.spacing40,
        padding: '0.625rem'
    },
    course: {
        display: 'inline-flex',
        marginLeft: '1.25rem',
        color: 'white'
    },
    courseContainer: {
        justifyContent: 'flex-end'
    },
    discipline: {
        marginTop: Tokens.sizingLarge,
        color: 'white'
    },
    marginLeft: {
        marginLeft: Tokens.spacing40
    },
    marginTop: {
        [theme.breakpoints.down('xs')]: {
            marginTop: 0
        },
        marginTop: '4.5rem'
    },
    text: {
        color: Tokens.colorTextNeutral100,
        textAlign: 'left',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },
    textCourses: {
        color: Tokens.colorTextNeutral100,
        textAlign: 'left'
    },
    textDownContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    textHeader: {
        color: Tokens.colorTextNeutral100,
        margin: Tokens.spacing30
    },
    textHeaderSecondary: {
        color: Tokens.colorTextNeutral100,
        margin: Tokens.spacing30
    },
    textSecondary: {
        color: Tokens.colorTextNeutral100,
        textAlign: 'left'
    }
});

type PropsWithStyles = IDegreeRequirementsHeaderProps & WithStyles<typeof styles> & WithWidth;
// #endregion Internal Types

// #region Component
const DegreeRequirementsHeader: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        allExpanded,
        classes,
        courseMax,
        courseMin,
        discipline,
        formalTitle,
        onExpandAll,
        programId,
        resources,
        width
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

    const backgroundImage: string = (
        `linear-gradient(${
        isWidthUp('xs', width) ? 'to right' : 'to down'}, rgba(21, 22, 24, 0.7)100%, rgba(21, 22, 24, 0.7)100%, rgba(21, 22, 24, 0.7)100%), url(${
        Constants.webUrl}/${programId ?
            `programs/picture/${programId}` :
            'Content/images/Profile_default_background.png'})`
    );

    const background = {
        backgroundImage: backgroundImage,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        marginTop: Tokens.spacing40,
        minHeight: 'inherit'
    };

    return (
        <Grid>
            <Card style={background}>
                <CardContent>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={8} className={classes.marginTop}>
                            <Text size="h2" className={classes.text} id="lblDegreeTitle">
                                {formalTitle}
                            </Text>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Grid container className={classes.courseContainer}>
                                <Grid item className={classes.discipline}>
                                    <UpDownLabel
                                        sizeTextUp="h3"
                                        sizeTextDown="large"
                                        textDown={resources.lblDiscipline}
                                        textUp={discipline}
                                    />
                                </Grid>
                                <div className={classes.border}>
                                    <div>
                                        <Grid item>
                                            <Text size="large" className={programId ? classes.textCourses : classes.textSecondary}>
                                                {resources.lblCourse}
                                            </Text>
                                        </Grid>
                                        <div className={classes.course}>
                                            <Grid item>
                                                <UpDownLabel
                                                    sizeTextUp="h3"
                                                    sizeTextDown="large"
                                                    textDown={resources.lblMin}
                                                    textUp={courseMin}
                                                />
                                            </Grid>
                                            <Grid item className={classes.marginLeft}>
                                                <UpDownLabel
                                                    sizeTextUp="h3"
                                                    sizeTextDown="large"
                                                    textDown={resources.lblMax}
                                                    textUp={courseMax}
                                                />
                                            </Grid>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <br/>
                {layoutResources && (
                    <Grid
                        container
                        justifyContent="flex-end"
                    >
                        <Grid item>
                            <Button
                                data-expanded={!allExpanded}
                                id="btnExpandCollapseAll"
                                variant="text"
                                onClick={onExpandAll}
                            >
                                {allExpanded ? layoutResources.lblCollapseAll : layoutResources.lblExpandAll}
                            </Button>
                        </Grid>
                    </Grid>
                )}
        </Grid>
    );
};
// #endregion Component

// Component
export default withStyles(styles)(withWidth()(DegreeRequirementsHeader));