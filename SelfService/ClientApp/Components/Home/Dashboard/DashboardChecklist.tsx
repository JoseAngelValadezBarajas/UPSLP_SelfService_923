/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: DashboardChecklist.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDashboardChecklist } from '../../../Types/Dashboard/IDashboardChecklist';
// #endregion Imports

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// #region Types
export interface IDashboardChecklistProps {
    myTasksDetail: IDashboardChecklist;
    resources: IDashboardChecklistResProps;
}

export interface IDashboardChecklistResProps {
    btnViewChecklist: string;
    lblMyTasks: string;
    lblOverdue: string;
    lblToday: string;
    lblUpcoming: string;
    lblUpToDate: string;
}

const styles = (theme: Theme) => createStyles({
    buttonContainer: {
        display: 'flex',
        marginTop: Tokens.spacing40,
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 0
        }
    },
    card: {
        animation: 'slidein 1s',
        marginBottom: Tokens.spacing80
    },
    icon: {
        marginRight: Tokens.spacing50
    },
    iconContainer: {
        display: 'flex'
    },
    linkHidden: {
        height: 0,
        visibility: 'hidden',
        width: 0
    },
    textWithBreak: {
        whiteSpace: 'pre-line'
    }
});

type PropsWithStyles = IDashboardChecklistProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const DashboardChecklist: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        myTasksDetail,
        resources
    } = props;

    const onClickMyTasks = (): void => {
        window.location.assign(
            `${Constants.webUrl}/Checklist/MyTasks`);
    };

    return (
        <Card className={classes.card}>
            <CardContent>
                <Hidden smDown>
                    <div className={classes.iconContainer}>
                        <div className={classes.icon}>
                            <Icon
                                name="requirements"
                                type="success"
                                size="xxLarge"
                                iconWithBackground
                            />
                        </div>
                        <Grid container justifyContent='flex-start'>
                            <Grid item>
                                <UpDownLabel
                                    sizeTextUp="h3"
                                    weightTextUp="strong"
                                    textUp={resources.lblMyTasks}
                                    withMarginTextUp
                                />
                            </Grid>
                            {myTasksDetail.overdue ? (
                                <Grid item>
                                    <UpDownLabel
                                        sizeTextDown="small"
                                        sizeTextUp="large"
                                        weightTextUp="strong"
                                        textDown={resources.lblOverdue}
                                        textUp={myTasksDetail.overdue}
                                    />
                                </Grid>
                            ) : undefined}
                            {myTasksDetail.today ? (
                                <Grid item>
                                    <UpDownLabel
                                        sizeTextDown="small"
                                        sizeTextUp="large"
                                        weightTextUp="strong"
                                        textDown={resources.lblToday}
                                        textUp={myTasksDetail.today}
                                    />
                                </Grid>
                            ) : undefined}
                            {myTasksDetail.upcoming ? (
                                <Grid item>
                                    <UpDownLabel
                                        sizeTextDown="small"
                                        sizeTextUp="large"
                                        weightTextUp="strong"
                                        textDown={resources.lblUpcoming}
                                        textUp={myTasksDetail.upcoming}
                                    />
                                </Grid>
                            ) : undefined}
                            {(!myTasksDetail.overdue && !myTasksDetail.today && !myTasksDetail.upcoming) ? (
                                <Grid item>
                                    <br />
                                    <UpDownLabel
                                        sizeTextUp="small"
                                        textUp={resources.lblUpToDate}
                                    />
                                </Grid>
                            ) : undefined}
                        </Grid>
                        <Grid container
                            justifyContent='flex-end'>
                            <Grid item xs={12}>
                                <div className={classes.buttonContainer}>
                                    <Button
                                        color="secondary"
                                        id="btnChecklist"
                                        onClick={onClickMyTasks}
                                    >
                                        {resources.btnViewChecklist}
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Hidden>
                <Hidden mdUp>
                    <div className={classes.iconContainer}>
                        <div className={classes.icon}>
                            <Icon
                                name="requirements"
                                type="success"
                                size="xxLarge"
                                iconWithBackground
                            />
                        </div>
                        <Grid container>
                            <Grid item>
                                <UpDownLabel
                                    sizeTextUp="h3"
                                    weightTextUp="strong"
                                    textUp={resources.lblMyTasks}
                                    withMarginTextUp
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <>
                        <Grid container justifyContent='center'>
                            {myTasksDetail.overdue ? (
                                <Grid item>
                                    <UpDownLabel
                                        sizeTextDown="small"
                                        sizeTextUp="large"
                                        weightTextUp="strong"
                                        textDown={resources.lblOverdue}
                                        textUp={myTasksDetail.overdue}
                                    />
                                </Grid>
                            ) : undefined}
                            {myTasksDetail.today ? (
                                <Grid item>
                                    <UpDownLabel
                                        sizeTextDown="small"
                                        sizeTextUp="large"
                                        weightTextUp="strong"
                                        textDown={resources.lblToday}
                                        textUp={myTasksDetail.today}
                                    />
                                </Grid>
                            ) : undefined}
                            {myTasksDetail.upcoming ? (
                                <Grid item>
                                    <UpDownLabel
                                        sizeTextDown="small"
                                        sizeTextUp="large"
                                        weightTextUp="strong"
                                        textDown={resources.lblUpcoming}
                                        textUp={myTasksDetail.upcoming}
                                    />
                                </Grid>
                            ) : undefined}
                        </Grid>
                        <br />
                        <br />
                        <Grid container>
                            {(!myTasksDetail.overdue && !myTasksDetail.today && !myTasksDetail.upcoming) ? (
                                <Grid item>
                                    <UpDownLabel
                                        sizeTextUp="small"
                                        textUp={resources.lblUpToDate}
                                        withMarginTextUp
                                    />
                                </Grid>
                            ) : undefined}
                        </Grid>
                    </>
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <div className={classes.buttonContainer}>
                                <Button
                                    color="secondary"
                                    id="btnChecklist"
                                    onClick={onClickMyTasks}
                                >
                                    {resources.btnViewChecklist}
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Hidden>
            </CardContent>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(DashboardChecklist);