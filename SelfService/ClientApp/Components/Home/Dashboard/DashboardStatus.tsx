/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: DashboardStatus.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardActions, CardContent, CardHeader } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { IDashboardStatus } from '../../../Types/Dashboard/IDashboardStatus';
// #endregion Imports

// #region Types
export interface IDashboardStatusProps {
    resources: IDashboardStatusResProps;
    status?: IDashboardStatus;
    statusInfo?: string;
}

export interface IDashboardStatusResProps {
    btnDegreeProgress: string;
    lblAcademic: string;
    lblCore: string;
    lblElective: string;
    lblGraduationDate: string;
}

const styles = ((theme: Theme) => createStyles({
    innerPercentage: {
        '& > div:nth-child(1)': {
            [theme.breakpoints.only('md')]: {
                height: '65px',
                width: '63px'
            },
            [theme.breakpoints.only('xs')]: {
                height: '65px',
                width: '63px'
            },
            alignItems: 'center',
            borderBottomStyle: 'solid',
            borderColor: Tokens.colorBrandSecondary,
            borderLeftStyle: 'solid',
            borderRadius: '50%',
            borderRightStyle: 'solid',
            borderTopStyle: 'solid',
            display: 'flex',
            height: '85px',
            justifyContent: 'center',
            width: '83px'
        }
    },
    percentage1: {
        '& > div > div:nth-child(1)': {
            borderTopStyle: 'outset'
        },
        padding: '0rem!important'
    },
    percentage2: {
        '& > div > div:nth-child(1)': {
            borderLeftStyle: 'outset',
            borderTopStyle: 'outset'
        },
        padding: '0rem!important'
    },
    percentages: {
        padding: '0rem'
    },
    statusCard: {
        [theme.breakpoints.up('sm')]: {
            paddingLeft: '0.875rem',
            paddingRight: '0.875rem'
        },
        animation: 'slidein 1s',
        height: Tokens.heightFluid,
        paddingLeft: Tokens.spacing30,
        paddingRight: Tokens.spacing30
    },
    statusCardContent: {
        overflow: 'auto'
    },
    statusCardHeader: {
        paddingLeft: Tokens.spacingReset,
        paddingRight: Tokens.spacingReset,
        paddingTop: Tokens.spacing35
    },
    statusContent: {
        [theme.breakpoints.up('md')]: {
            height: '168px'
        },
        height: 'auto',
        minHeight: '168px'
    },
    statusHeader: {
        [theme.breakpoints.up('md')]: {
            height: '180px'
        },
        backgroundColor: Tokens.colorBrandNeutral200,
        height: 'auto',
        minHeight: '180px'
    }
}));

type PropsWithStyles = IDashboardStatusProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
const DashboardStatus: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        resources,
        status,
        statusInfo,
        width
    } = props;

    if (status) {
        return (
            <Card accent="secondary" className={classes.statusCard}>
                <CardHeader
                    className={classes.statusCardHeader}
                    title={(
                        <Grid container alignItems="center" justifyContent="center" className={classes.statusHeader}>
                            <Grid item>
                                <Text
                                    align="center"
                                    size={width === 'md' || width === 'xs' ? 'h2' : 'h1'}
                                >
                                    {status.graduationDate}
                                </Text>
                                <Text align="center">
                                    {resources.lblGraduationDate}
                                </Text>
                            </Grid>
                        </Grid>
                    )}
                />
                <CardContent className={classes.statusCardContent}>
                    <Grid container alignItems="center" className={classes.statusContent}>
                        <Grid item xs className={classes.percentages}>
                            <Grid container alignItems="center" justifyContent="space-around">
                                <Grid item className={classes.percentage1}>
                                    <div className={classes.innerPercentage}>
                                        <UpDownLabel
                                            sizeTextDown="small"
                                            sizeTextUp={width === 'md' || width === 'xs' ? 'h4' : 'h3'}
                                            textDown={resources.lblCore}
                                            textUp={status.corePercentage}
                                            withMarginTextUp
                                        />
                                    </div>
                                </Grid>
                                <Grid item className={classes.percentage2}>
                                    <div className={classes.innerPercentage}>
                                        <UpDownLabel
                                            sizeTextDown="small"
                                            sizeTextUp={width === 'md' || width === 'xs' ? 'h4' : 'h3'}
                                            textDown={resources.lblAcademic}
                                            textUp={status.academicPercentage}
                                            withMarginTextUp
                                        />
                                    </div>
                                </Grid>
                                <Grid item className={classes.percentage1}>
                                    <div className={classes.innerPercentage}>
                                        <UpDownLabel
                                            sizeTextDown="small"
                                            sizeTextUp={width === 'md' || width === 'xs' ? 'h4' : 'h3'}
                                            textDown={resources.lblElective}
                                            textUp={status.electivePercentage}
                                            withMarginTextUp
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container justifyContent="center">
                        <Grid item xs={width === 'xs' ? 12 : false}>
                            <Button
                                id="btnDegreeProgress"
                                size={width === 'md' ? 'small' : 'medium'}
                            >
                                {resources.btnDegreeProgress}
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        );
    }
    else {
        return (
            <Card accent="secondary" className={classes.statusCard}>
                <CardContent className={classes.statusCardContent}>
                    {statusInfo ? (
                        <Text component="div">
                            <div dangerouslySetInnerHTML={{ __html: statusInfo }} />
                        </Text>
                    ) : undefined}
                </CardContent>
            </Card>
        );
    }
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(DashboardStatus));