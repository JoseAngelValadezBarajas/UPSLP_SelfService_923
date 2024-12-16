/* Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
 * File: DashboardMessageCard.tsx
 * Type: Presentation component */

// #region Imports
import classnames from 'classnames';
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextLink from '@hedtech/powercampus-design-system/react/core/TextLink';

// Types
import { IDashboardNotification } from '../../Types/Dashboard/IDashboardNotification';
import { DashboardMessageType } from '../../Types/Dashboard/IDashboardMessage';

// Helpers
import { createStyles, withStyles, WithStyles, Theme } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
// #endregion Imports

// #region Types
export interface IDashboardMessageCardProps {
    dashboardMessage: IDashboardNotification;
    className?: string;
    moveToPX?: number;
    lowPadding: boolean;
    isPreview: boolean;
    onCardTransitionEnd: () => void;
    overallCount: number;
    index: number;
    resources: IDashboardMessageCardResProps;
}

export interface IDashboardMessageCardResProps {
    formatCardOfTotal: string;
}

const styles = (theme: Theme) => createStyles({
    card: {
        height: '250px',
    },
    lowPadding: {
        padding: `${Tokens.spacing30} ${Tokens.important}`
    },
    messageContent: {
        height: Tokens.heightFluid
    },
    translate: (props: IDashboardMessageCardProps): any => ({
        transform: `translateX(-${props.moveToPX}px)`
    }),
    breakWord: {
        wordBreak: 'break-word'
    },
    previewWidth: {
        [theme.breakpoints.up('md')]: {
            minWidth: '300px'
        },
        minWidth: '250px',
        maxWidth: '400px',
    }
});

type PropsWithStyles = IDashboardMessageCardProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const DashboardMessageCard: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        className,
        dashboardMessage,
        index,
        isPreview,
        lowPadding,
        moveToPX,
        onCardTransitionEnd,
        overallCount,
        resources
    } = props;

    let messageIcon: JSX.Element;
    switch (dashboardMessage.type) {
        case DashboardMessageType.Alert:
            messageIcon = (
                <Text
                    align="left"
                    IconProps={{
                        large: true,
                        name: "notification",
                        type: "error"
                    }}
                    id={`lblNotificationAlert_${index}`}
                    size="h3"
                    verticalAlignIcon="center"
                    weight="strong"
                >
                    {dashboardMessage.title}
                </Text>
            );
            break;
        case DashboardMessageType.Congratulation:
            messageIcon = (
                <Text
                    align="left"
                    IconProps={{
                        large: true,
                        name: "approve",
                        type: "success"
                    }}
                    id={`lblNotificationCongratulation_${index}`}
                    size="h3"
                    verticalAlignIcon="center"
                    weight="strong"
                >
                    {dashboardMessage.title}
                </Text>
            );
            break;
        case DashboardMessageType.News:
            messageIcon = (
                <Text
                    align="left"
                    IconProps={{
                        large: true,
                        name: "globe",
                        type: "info"
                    }}
                    id={`lblNotificationNews_${index}`}
                    size="h3"
                    verticalAlignIcon="center"
                    weight="strong"
                >
                    {dashboardMessage.title}
                </Text>
            );
            break;
        case DashboardMessageType.Reminder:
            messageIcon = (
                <Text
                    align="left"
                    IconProps={{
                        large: true,
                        name: "lightbulb",
                        type: "warning"
                    }}
                    id={`lblNotificationReminder_${index}`}
                    size="h3"
                    verticalAlignIcon="center"
                    weight="strong"
                >
                    {dashboardMessage.title}
                </Text>
            );
            break;
        case DashboardMessageType.Schedule:
            messageIcon = (
                <Text
                    align="left"
                    IconProps={{
                        large: true,
                        name: "calendar",
                        type: "success"
                    }}
                    id={`lblNotificationSchedule_${index}`}
                    size="h3"
                    verticalAlignIcon="center"
                    weight="strong"
                >
                    {dashboardMessage.title}
                </Text>
            );
            break;
        default:
            messageIcon = (
                <Text
                    align="left"
                    IconProps={{
                        large: true,
                        name: "info",
                        type: "info"
                    }}
                    id={`lblNotificationInfo_${index}`}
                    size="h3"
                    verticalAlignIcon="center"
                    weight="strong"
                >
                    {dashboardMessage.title}
                </Text>
            );
            break;
    }

    return (
        <Card
            accent="secondary"
            className={classnames(
                classes.card,
                className,
                { [classes.translate]: !!moveToPX },
                { [classes.lowPadding]: lowPadding },
                { [classes.previewWidth]: isPreview },
            )}
            onTransitionEnd={onCardTransitionEnd}
        >
            <CardContent>
                <Grid container direction="column" spacing={0} justifyContent="space-between" className={classes.messageContent}>
                    <Grid item>
                        <Grid container justifyContent="center">
                            <Grid item xs className={classes.breakWord}>
                                {messageIcon}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container>
                            <Grid item xs={12} className={classes.breakWord}>
                                <Text verticalAlign="middle" align="left">
                                    {dashboardMessage.message}
                                </Text>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1} justifyContent="space-between" alignItems="flex-end">
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatCardOfTotal, [index, overallCount])}
                                </Text>
                            </Grid>
                            <Grid item xs>
                                <Text align="right">
                                    <TextLink
                                        id={`lnkMessageUrl_${index}`}
                                        href={dashboardMessage.url}
                                        target="_blank"
                                    >
                                        {dashboardMessage.urlText}
                                    </TextLink>
                                </Text>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(DashboardMessageCard);