/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: MyTasksViewDetailModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ICheckListPermissions } from '../../../Types/Permissions/ICheckListPermissions';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IMyTasksViewDetails } from '../../../Types/Checklist/IMyTasksViewDetails';
import { IMyTasksMainResources } from '../../../Types/Resources/Checklist/IMyTasksMainResources';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// #endregion Imports

// #region Types
export interface IAlertDetailModalProps {
    canceled?: boolean;
    canViewDetails: number;
    canViewNotes: number;
    checkListPermissions: ICheckListPermissions;
    completed?: boolean;
    difference: number;
    impersonateInfo?: IImpersonateInfo;
    isPerDay: boolean;
    myTaskViewDetail: IMyTasksViewDetails;
    onClose: () => void;
    onOpenPopper: (event: any, myTaskViewDetail: IMyTasksViewDetails) => void;
    open: boolean;
    category: number;
    waived?: boolean;
    resources: IMyTasksMainResources;
}

const styles = createStyles({
    display: {
        display: 'flex'
    },
    marginLeft: {
        marginLeft: Tokens.spacing40
    },
    marginRight: {
        marginRight: Tokens.spacing40
    },
    maginTop: {
        marginTop: `-${Tokens.spacing60}`
    }
});

type PropsWithStyles = IAlertDetailModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const MyTasksViewDetailModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        canceled,
        canViewDetails,
        canViewNotes,
        checkListPermissions,
        completed,
        difference,
        impersonateInfo,
        isPerDay,
        onClose,
        onOpenPopper,
        open,
        category,
        myTaskViewDetail,
        waived,
        resources
    } = props;

    let formatHours: string = '';
    let formatDays: string = '';
    let status: string = '';
    let type: string = '';
    let typeStatusLabel: string = '';
    let isCompleted: boolean = false;

    switch (category) {
        case 1:
            formatHours = resources.formatHoursOverdue;
            formatDays = resources.formatDaysOverdue;
            status = resources.lblOverdueSingular;
            type = 'error';
            typeStatusLabel = 'error';
            isCompleted = false;
            break;

        case 2:
            formatHours = resources.formatHoursDue;
            formatDays = resources.formatDaysDue;
            status = resources.lblToday;
            type = 'warning';
            typeStatusLabel = 'draft';
            isCompleted = false;
            break;

        case 3:
            formatHours = resources.formatHoursDue;
            formatDays = resources.formatDaysDue;
            status = resources.lblUpcomingSingular;
            type = 'success';
            typeStatusLabel = 'success';
            isCompleted = false;
            break;

        case 4:
            formatHours = resources.formatHoursDue;
            formatDays = resources.formatDaysDue;
            status = resources.lblLaterSingular;
            type = 'info';
            typeStatusLabel = 'pending';
            isCompleted = false;
            break;

        case 5:
            formatHours = resources.formatHoursDue;
            formatDays = resources.formatDaysDue;
            type = 'default';
            isCompleted = true;
            break;
    }

    const onViewDetails = (event: any): void => {
        onOpenPopper(event, myTaskViewDetail);
    };
    const contentModal: JSX.Element | undefined =
        (
            <>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        {!isCompleted && (
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Icon
                                        large
                                        name="stopwatch"
                                        type={type}
                                    />
                                </Grid>
                                <Grid item>
                                    <Text
                                        size="h4"
                                        weight="strong"
                                    >
                                        {Format.toString(isPerDay ? formatDays : formatHours, [difference])}
                                    </Text>
                                </Grid>
                            </Grid>
                        )}
                        <Grid container>
                            <Grid item>
                                <Grid container>
                                    <Grid item>
                                        <Text>
                                            {resources.formatContact}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item>
                                        {myTaskViewDetail && myTaskViewDetail.isImpersonate ?
                                            myTaskViewDetail.avatar.fullName !== '' ?
                                                (
                                                    <AvatarText
                                                        avatarInfo={myTaskViewDetail.avatar}
                                                    />
                                                )
                                                : undefined
                                            : myTaskViewDetail.avatarResp.fullName !== '' && (
                                                <AvatarText
                                                    ButtonProps={{
                                                        'data-id': myTaskViewDetail.avatarResp.personId,
                                                        id: `btnTaskContact_${myTaskViewDetail.avatarResp.personId}`,
                                                        onClick: onViewDetails
                                                    }}
                                                    avatarInfo={myTaskViewDetail.avatarResp}
                                                />
                                            )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Grid container>
                                    <Grid item>
                                        <Text>
                                            {resources.formatResponsible}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item>
                                        {myTaskViewDetail && myTaskViewDetail.isImpersonate ?
                                            myTaskViewDetail.avatarResp.fullName !== '' ?
                                                (
                                                    <AvatarText
                                                        ButtonProps={{
                                                            'data-id': myTaskViewDetail.avatarResp.personId,
                                                            id: `btnTaskContact_${myTaskViewDetail.avatarResp.personId}`,
                                                            onClick: onViewDetails
                                                        }}
                                                        avatarInfo={myTaskViewDetail.avatarResp}
                                                    />
                                                )
                                                : undefined
                                            : myTaskViewDetail.avatar.fullName !== '' && (
                                                <AvatarText
                                                    avatarInfo={myTaskViewDetail.avatar}
                                                />
                                            )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatOffice, [myTaskViewDetail.officeDesc])}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatYear, [myTaskViewDetail.academicYear])}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatTerm, [myTaskViewDetail.academicTerm])}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatSession, [myTaskViewDetail.academicSession])}
                                </Text>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container>
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatPriority, [myTaskViewDetail.priority])}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Text>
                                    {myTaskViewDetail.required === 'Y' ? resources.formatRequiredYes : resources.formatRequiredNo}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatAssigned, [myTaskViewDetail.assignedDate, myTaskViewDetail.assignedTime])}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatDueDate, [myTaskViewDetail.scheduleDate, myTaskViewDetail.scheduleTime])}
                                </Text>
                            </Grid>
                        </Grid>
                        {isCompleted && (
                            <>
                                <Grid container>
                                    <Grid item>
                                        <Text>
                                            {Format.toString(resources.formatDateCompleted, [myTaskViewDetail.completedDate])}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item>
                                        <Text>
                                            {Format.toString(resources.formatCompletedBy, [myTaskViewDetail.avatarCompleted.fullName])}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item>
                                        <Text>
                                            {Format.toString(resources.formatCancellationReason, [myTaskViewDetail.cancelReason])}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item>
                                        <Text>
                                            {Format.toString(resources.formatWaivedReason, [myTaskViewDetail.waivedReason])}
                                        </Text>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Text
                            size="h4"
                            weight="strong"
                        >
                            {resources.lblInstructions}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Text>
                            <span dangerouslySetInnerHTML={{
                                __html: myTaskViewDetail.instruction
                            }}
                            />
                        </Text>
                    </Grid>
                </Grid>
                {impersonateInfo?.personId === undefined || impersonateInfo.personId === null ?
                    checkListPermissions.viewNotes ?
                        (
                            <>
                                <Grid container>
                                    <Grid item>
                                        <Text
                                            size="h4"
                                            weight="strong"
                                        >
                                            {resources.lblNotes}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item>
                                        <Text>
                                            <span dangerouslySetInnerHTML={{
                                                __html: myTaskViewDetail.notes
                                            }}
                                            />
                                        </Text>
                                    </Grid>
                                </Grid>
                            </>
                        )
                        : undefined
                    :
                    canViewDetails > 0 && canViewNotes > 0 ?
                        (
                            <>
                                <Grid container>
                                    <Grid item>
                                        <Text
                                            size="h4"
                                            weight="strong"
                                        >
                                            {resources.lblNotes}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item>
                                        <Text>
                                            <span dangerouslySetInnerHTML={{
                                                __html: myTaskViewDetail.notes
                                            }}
                                            />
                                        </Text>
                                    </Grid>
                                </Grid>
                            </>
                        )
                        : undefined
                }
            </>
        );

    const header: JSX.Element | undefined =
        (
            <>
                <Hidden smDown>
                    <Grid container>
                        <Grid item xs={12} md={12} className={classes.display}>
                            <Text
                                size={'h4'}
                                weight={'strong'}
                            >
                                {myTaskViewDetail.actionName}
                            </Text>
                            {isCompleted ?
                                (
                                    <>
                                        {completed && (
                                            <StatusLabel
                                                className={classes.marginLeft}
                                                id="stsLblCompletedStatus"
                                                text={resources.lblCompleted}
                                                type={type}
                                            />
                                        )}
                                        {canceled && (
                                            <StatusLabel
                                                className={classes.marginLeft}
                                                id="stsLblCanceledStatus"
                                                text={resources.lblCanceled}
                                                type={type}
                                            />
                                        )}
                                        {waived && (
                                            <StatusLabel
                                                className={classes.marginLeft}
                                                id="stsLblWaivedStatus"
                                                text={resources.lblWaived}
                                                type={type}
                                            />
                                        )}
                                    </>
                                )
                                :
                                (
                                    <StatusLabel
                                        className={classes.marginLeft}
                                        id="stsLblStatus"
                                        text={status}
                                        type={typeStatusLabel}
                                    />
                                )
                            }
                        </Grid>
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid container>
                        <Grid item xs={12}>
                            <Text
                                size={'h4'}
                                weight={'strong'}
                            >
                                {myTaskViewDetail.actionName}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            {isCompleted ?
                                (
                                    <>
                                        {completed && (
                                            <StatusLabel
                                                className={classes.marginRight}
                                                id="stsLblCompletedStatus"
                                                text={resources.lblCompleted}
                                                type={type}
                                            />
                                        )}
                                        {canceled && (
                                            <StatusLabel
                                                id="stsLblCanceledStatus"
                                                text={resources.lblCanceled}
                                                type={type}
                                            />
                                        )}
                                        {waived && (
                                            <StatusLabel
                                                id="stsLblWaivedStatus"
                                                text={resources.lblWaived}
                                                type={type}
                                            />
                                        )}
                                    </>
                                )
                                :
                                (
                                    <StatusLabel
                                        id="stsLblStatus"
                                        text={status}
                                        type={typeStatusLabel}
                                    />
                                )
                            }
                        </Grid>
                    </Grid>
                </Hidden>
                <Divider />
            </>
        );

    return (
        <Modal
            disableBackdropClick
            id="viewDetailModal"
            header={header}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <div className={classes.maginTop}>
                {contentModal}
            </div>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(MyTasksViewDetailModal);