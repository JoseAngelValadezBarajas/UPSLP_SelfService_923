/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: DashboardMessagesPanel.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Types
import { IDashboardNotification } from '../../../Types/Dashboard/IDashboardNotification';
import { DashboardMessageType } from '../../../Types/Dashboard/IDashboardMessage';

// Core components
import Badge from '@hedtech/powercampus-design-system/react/core/Badge';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import List, { ListItem, ListItemIcon, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextLink from '@hedtech/powercampus-design-system/react/core/TextLink';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
// #endregion Imports

// #region Types
export interface IDashboardMessagesPanelProps {
    notifications: IDashboardNotification[];
    resources: IDashboardMessagesPanelResProps;
}

export interface IDashboardMessagesPanelResProps {
    lblMessages: string;
}

const styles = createStyles({
    listItemIcon: {
        marginRight: Tokens.spacing40,
        minWidth: Tokens.widthReset
    },
    breakWord: {
        wordBreak: 'break-word'
    }
});

type PropsWithStyles = IDashboardMessagesPanelProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const DashboardMessagesPanel: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        resources,
        notifications
    } = props;

    const getAvatar = (notification: IDashboardNotification): JSX.Element => {
        let notificationIcon: JSX.Element;
        switch (notification.type) {
            case DashboardMessageType.Alert:
                notificationIcon = (
                    <Icon
                        large
                        name="notification"
                        type="error"
                    />
                );
                break;
            case DashboardMessageType.Congratulation:
                notificationIcon = (
                    <Icon
                        large
                        type="success"
                        name="approve"
                    />
                );
                break;
            case DashboardMessageType.News:
                notificationIcon = (
                    <Icon
                        large
                        type="info"
                        name="globe"
                    />
                );
                break;
            case DashboardMessageType.Reminder:
                notificationIcon = (
                    <Icon
                        large
                        type="warning"
                        name="lightbulb"
                    />
                );
                break;
            case DashboardMessageType.Schedule:
                notificationIcon = (
                    <Icon
                        large
                        type="success"
                        name="calendar"
                    />
                );
                break;
            default:
                notificationIcon = (
                    <Icon
                        large
                        type="success"
                        name="info"
                    />
                );
                break;
        }
        return notificationIcon;
    };


    return (
        <ExpansionPanel
            background="gray"
            header={(
                <>
                    <Badge badgeContent={notifications.length}>
                        <Text size="h2">
                            {resources.lblMessages}
                        </Text>
                    </Badge>
                </>
            )}
        >
            <List id="lstNotifications">
                {notifications.map((notification, iNotification) => {
                    let notificationIcon: JSX.Element = getAvatar(notification);

                    return (
                        <ListItem
                            disableGutters
                            divider={iNotification < notifications.length - 1}
                        >
                            <ListItemIcon classes={{root: classes.listItemIcon}}>
                                <Grid container justifyContent="center">
                                    <Grid item>
                                        {notificationIcon}
                                    </Grid>
                                </Grid>
                            </ListItemIcon>
                            <ListItemText
                                id={`lstTxt_${iNotification}`}
                                primary={
                                    <Text size="h3" className={classes.breakWord}>
                                        {notification.title}
                                    </Text>
                                }
                                secondary={
                                    <>
                                        <Text className={classes.breakWord}>
                                            {notification.message}
                                        </Text>
                                        <TextLink
                                            id={`lnkUrl_${iNotification}`}
                                            href={notification.url}
                                            target="_blank"
                                        >
                                            {notification.urlText}
                                        </TextLink>
                                    </>
                                }
                            />
                        </ListItem>
                    );
                })}
            </List>
        </ExpansionPanel>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(DashboardMessagesPanel);