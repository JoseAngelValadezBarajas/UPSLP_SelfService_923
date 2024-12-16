/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: MyTaskListProcesed.tsx
 * Type: Presentation component */

// #region Imports
import classnames from 'classnames';
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IMyTasksMainResources } from '../../../Types/Resources/Checklist/IMyTasksMainResources';
import { IMyTasks } from '../../../Types/Checklist/IMyTasks';
import { IMyTasksDetail } from '../../../Types/Checklist/IMyTasksDetial';

// #endregion

// #region Internal types
export interface IMyTaskListProcesedProps {
    myTasks: IMyTasks[];
    onClickDetails: (actionScheduleId: number, category: number, difference: number,
        isPerDay: boolean, taskAddress: IMyTasksDetail, completed?: boolean, canceled?: boolean, waived?: boolean) => void;
    onOpenPopper: (event: any, myTaskDetails: IMyTasksDetail) => void;
    resources: IMyTasksMainResources;
}

const styles = () => createStyles({
    itemCard: {
        borderLeftStyle: 'solid',
        borderLeftWidth: Tokens.spacing30,
        marginBottom: Tokens.spacing50,
        minHeight: '100px',
        position: 'relative'
    },
    popperText: {
        maxWidth: '15rem'
    },
    processedCard: {
        borderLeftColor: Tokens.colorBrandNeutral300
    }
});

type PropsWithStyles = IMyTaskListProcesedProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const MyTaskListProcesed: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        classes,
        myTasks,
        onClickDetails,
        onOpenPopper,
        resources
    } = props;

    let header: JSX.Element | undefined;
    const content: JSX.Element[] = [];
    let classCard: string = classes.itemCard;
    classCard = classnames(classCard, classes.processedCard);
    if (myTasks.length > 0) {
        myTasks.forEach((tasks, i) => {
            header = (
                <>
                    <Grid container>
                        <Grid>
                            <Text
                                weight="strong"
                                size="h4"
                            >
                                {resources.lblProcessed}
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
                    <br />
                </>
            );

            tasks.myTasks.forEach((task, j) => {
                const onViewDetails = (event: any): void => {
                    onOpenPopper(event, task);
                };
                const onViewTaskDetails = (): void => {
                    onClickDetails(task.actionScheduledId, tasks.category,
                        task.difference, task.isPerDay, task,
                        task.completed, task.canceled, task.waived);
                }
                content.push(
                    <>
                        <Card
                            key={`tasksListProcessed_${i}_${j}`}
                            className={classCard}
                        >
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={12} md={3}>
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
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Text>
                                            {task.officeDesc}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        {task.avatar && task.avatar.fullName !== '' && (
                                            <AvatarText
                                                ButtonProps={{
                                                    'data-id': task.avatar.personId,
                                                    id: `btnTaskType_${i}_${j}_${task.avatar.personId}`,
                                                    onClick: onViewDetails
                                                }}
                                                avatarInfo={task.avatar}
                                            />
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Grid container spacing={1}>
                                            {task.completed && (
                                                <Grid item>
                                                    <StatusLabel
                                                        id="stsLblStatus"
                                                        text={resources.lblCompleted}
                                                        type={'default'}
                                                    />
                                                </Grid>
                                            )}
                                            {task.canceled ? (
                                                <Grid item>
                                                    <StatusLabel
                                                        id="stsLblStatus"
                                                        text={resources.lblCanceled}
                                                        type={'default'}
                                                    />
                                                </Grid>
                                            ) :
                                                task.waived && (
                                                    <Grid item>
                                                        <StatusLabel
                                                            id="stsLblStatus"
                                                            text={resources.lblWaived}
                                                            type={'default'}
                                                        />
                                                    </Grid>
                                                )
                                            }
                                        </Grid>
                                        {task.waived && task.canceled && (
                                            <Grid container spacing={1}>
                                                <Grid item>
                                                    <StatusLabel
                                                        id="stsLblStatus"
                                                        text={resources.lblWaived}
                                                        type={'default'}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </>
                );
            });
        });
    }

    return (
        <>
            {header}
            {content}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(MyTaskListProcesed);