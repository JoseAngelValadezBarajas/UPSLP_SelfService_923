/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: MyTaskListDetail.tsx
 * Type: Presentation component */

// #region Imports
import classnames from 'classnames';
import React from 'react';

// Core components
import ActionMenu from '@hedtech/powercampus-design-system/react/core/ActionMenu';
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IActionMenuOption } from '@hedtech/powercampus-design-system/types/IActionMenuOption';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IMyTasksMainResources } from '../../../Types/Resources/Checklist/IMyTasksMainResources';
import { IMyTasks } from '../../../Types/Checklist/IMyTasks';
import { IMyTasksDetail } from '../../../Types/Checklist/IMyTasksDetial';
import { ICheckListPermissions } from '../../../Types/Permissions/ICheckListPermissions';

// #endregion

// #region Internal types
export interface IMyTasksListDetailProps {
    allExpanded: boolean;
    checkListPermissions: ICheckListPermissions;
    impersonateInfo?: IImpersonateInfo;
    myTasks: IMyTasks[];
    onCancel: (task: IMyTasksDetail) => void;
    onEdit: (task: IMyTasksDetail, category: number) => void;
    onWaive: (task: IMyTasksDetail) => void;
    onComplete: (task: IMyTasksDetail) => void;
    onClickDetails: (actionScheduleId: number, category: number, difference: number, isPerDay: boolean, taskAddrees: IMyTasksDetail) => void;
    onReassign: (task: IMyTasksDetail) => void;
    onExpand: (category: number, expanded: boolean) => void;
    onOpenPopper: (event: any, myTaskDetails: IMyTasksDetail) => void;
    resources: IMyTasksMainResources;
}

const styles = () => createStyles({
    actionMenu: {
        textAlign: 'end'
    },
    display: {
        display: 'flex'
    },
    itemCard: {
        borderLeftStyle: 'solid',
        borderLeftWidth: Tokens.spacing30,
        marginBottom: Tokens.spacing50,
        minHeight: '100px',
        position: 'relative'
    },
    laterCard: {
        borderLeftColor: Tokens.fountain600
    },
    marginTop: {
        marginTop: Tokens.sizingXSmall
    },
    overdueCard: {
        borderLeftColor: Tokens.colorFillAlertError
    },
    popperText: {
        maxWidth: '15rem'
    },
    processedCard: {
        borderLeftColor: Tokens.colorBrandNeutral250
    },
    todayCard: {
        borderLeftColor: Tokens.saffron600
    },
    upcomingCard: {
        borderLeftColor: Tokens.meadow600
    }
});

type PropsWithStyles = IMyTasksListDetailProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const MyTaskListDetail: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        classes,
        checkListPermissions,
        impersonateInfo,
        myTasks,
        onCancel,
        onClickDetails,
        onComplete,
        onEdit,
        onReassign,
        onWaive,
        onExpand,
        onOpenPopper,
        resources
    } = props;

    let actions: IActionMenuOption[];
    let header: JSX.Element | undefined;
    let content: JSX.Element[] = [];
    const myTasksPage: JSX.Element[] = [];
    let defaultExpanded: boolean = false;
    let expanded: boolean = false;
    let formatHours: string = '';
    let formatDays: string = '';
    let status: string = '';
    let type: string = '';
    {
        myTasks.forEach((tasks, i) => {
            const onExpandCallback = (_event: any, expanded: boolean) => {
                onExpand(tasks.category, expanded);
            };
            content = [];
            let classCard: string = classes.itemCard;
            switch (tasks.category) {
                case 1:
                    defaultExpanded = false;
                    expanded = tasks.expanded;
                    formatHours = resources.formatHoursOverdue;
                    formatDays = resources.formatDaysOverdue;
                    status = resources.lblOverdue;
                    classCard = classnames(classCard, classes.overdueCard);
                    type = 'error';
                    break;

                case 2:
                    defaultExpanded = true;
                    if (tasks.expanded === undefined) {
                        expanded = true;
                    }
                    else {
                        expanded = tasks.expanded;
                    }
                    formatHours = resources.formatHoursDue;
                    formatDays = resources.formatDaysDue;
                    status = resources.lblToday;
                    classCard = classnames(classCard, classes.todayCard);
                    type = 'warning';
                    break;

                case 3:
                    defaultExpanded = false;
                    expanded = tasks.expanded;
                    formatHours = resources.formatHoursDue;
                    formatDays = resources.formatDaysDue;
                    status = resources.lblUpcoming;
                    classCard = classnames(classCard, classes.upcomingCard);
                    type = 'success';
                    break;

                case 4:
                    defaultExpanded = false;
                    expanded = tasks.expanded;
                    formatHours = resources.formatHoursDue;
                    formatDays = resources.formatDaysDue;
                    status = resources.lblLater;
                    classCard = classnames(classCard, classes.laterCard);
                    type = 'info';
                    break;
            }

            header = (
                <>
                    <Grid container>
                        <Grid>
                            <Text
                                weight="strong"
                                size="h4"
                            >
                                {status}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid>
                            <Text
                                size="small"
                            >
                                {Format.toString(resources.formatTasksNumber, [tasks.myTasks.length])}
                            </Text>
                        </Grid>
                    </Grid>
                </>
            );

            tasks.myTasks.forEach((task, j) => {
                actions = [
                    {
                        callback: () => {
                            onEdit(task, tasks.category);
                        },
                        id: 0,
                        label: resources.lblEdit
                    },
                    {
                        callback: () => {
                            onComplete(task);
                        },
                        id: 1,
                        label: resources.lblComplete
                    },
                    {
                        callback: () => {
                            onWaive(task);
                        },
                        id: 2,
                        label: resources.lblWaive
                    },
                    {
                        callback: () => {
                            onCancel(task);
                        },
                        id: 3,
                        label: resources.lblCancel
                    },
                    {
                        callback: () => {
                            onReassign(task);
                        },
                        id: 4,
                        label: resources.lblReassign
                    }
                ];

                const onViewDetails = (event: any): void => {
                    onOpenPopper(event, task);
                };

                const onViewTaskDetails = (): void => {
                    onClickDetails(task.actionScheduledId, tasks.category, task.difference, task.isPerDay, task);
                };
                content.push(
                    <>
                        <Card
                            key={`tasksList_${i}_${j}`}
                            className={classCard}
                        >
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={3}>
                                        <div className={classes.display}>
                                            {impersonateInfo?.personId == undefined || impersonateInfo?.personId == null ?
                                                (
                                                    <Button
                                                        TextProps={{
                                                            weight: 'strong'
                                                        }}
                                                        align="left"
                                                        id={`btnActionDetail_${task.actionName}_${j}`}
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={onViewTaskDetails}
                                                    >
                                                        {task.actionName}
                                                    </Button>
                                                )
                                                : task.canViewDetails ?
                                                    (
                                                        <Button
                                                            TextProps={{
                                                                weight: 'strong'
                                                            }}
                                                            align="left"
                                                            id={`btnActionDetail_${task.actionName}_${j}`}
                                                            textVariantStyling="inherit"
                                                            variant="text"
                                                            onClick={onViewTaskDetails}
                                                        >
                                                            {task.actionName}
                                                        </Button>
                                                    )
                                                    :
                                                    (
                                                        <Text>
                                                            {task.actionName}
                                                        </Text>
                                                    )}
                                            <Hidden mdUp>
                                                <div className={classes.marginTop}>
                                                    {impersonateInfo?.personId == undefined || impersonateInfo.personId == null ?
                                                        checkListPermissions && checkListPermissions.editAction && (
                                                            <ActionMenu
                                                                absolutePosition
                                                                actions={actions}
                                                                id={`task_ ${task.actionName}`}
                                                            />
                                                        )
                                                        : task.canEditTasks && task.canViewDetails && (
                                                            <ActionMenu
                                                                absolutePosition
                                                                actions={actions}
                                                                id={`task_ ${task.actionName}`}
                                                            />
                                                        )
                                                    }
                                                </div>
                                            </Hidden>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Text>
                                            {task.officeDesc}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        {impersonateInfo?.personId === undefined ?
                                            task.avatar && task.avatar.fullName !== '' ?
                                                (
                                                    <AvatarText
                                                        ButtonProps={{
                                                            'data-id': task.avatar.personId,
                                                            id: `btnTaskType_${i}_${j}_${task.avatar.personId}`,
                                                            onClick: onViewDetails
                                                        }}
                                                        avatarInfo={task.avatar}
                                                    />
                                                )
                                                : undefined
                                            : task.avatarResp && task.avatarResp.fullName !== '' ?
                                                (
                                                    <AvatarText
                                                        ButtonProps={{
                                                            'data-id': task.avatarResp.personId,
                                                            id: `btnTaskType_${i}_${j}_${task.avatarResp.personId}`,
                                                            onClick: onViewDetails
                                                        }}
                                                        avatarInfo={task.avatarResp}
                                                    />
                                                )
                                                : undefined
                                        }
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <Icon
                                                    name="stopwatch"
                                                    type={type}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Text
                                                    weight="strong"
                                                >
                                                    {Format.toString(task.isPerDay ? formatDays : formatHours, [task.difference])}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {checkListPermissions && checkListPermissions.editAction &&
                                        (impersonateInfo?.personId === undefined || impersonateInfo.personId === null) ?
                                        (
                                            <Hidden smDown>
                                                <Grid item md={1} className={classes.actionMenu}>
                                                    <ActionMenu
                                                        absolutePosition
                                                        absolutePosition2
                                                        placement="bottom-end"
                                                        actions={actions}
                                                        id={`task_ ${task.actionName}`}
                                                    />
                                                </Grid>
                                            </Hidden>
                                        )
                                        : task.canEditTasks && task.canViewDetails ?
                                            (
                                                <Hidden smDown>
                                                    <Grid item md={1} className={classes.actionMenu}>
                                                        <ActionMenu
                                                            absolutePosition
                                                            absolutePosition2
                                                            placement="bottom-end"
                                                            actions={actions}
                                                            id={`task_ ${task.actionName}`}
                                                        />
                                                    </Grid>
                                                </Hidden>
                                            )
                                            : undefined}
                                </Grid>
                            </CardContent>
                        </Card>
                    </>
                );
            });

            myTasksPage.push(
                <ExpansionPanel
                    key={`myTasks_${i}`}
                    defaultExpanded={Boolean(defaultExpanded)}
                    expanded={Boolean(expanded)}
                    header={header}
                    variant="card"
                    onChange={onExpandCallback}
                >
                    {content}
                </ExpansionPanel>
            );
        });
    }

    return (
        <>
            {myTasksPage}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(MyTaskListDetail);