/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AdvisorApprovalContent.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Shared elements
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardActions, CardContent, CardHeader } from '@hedtech/powercampus-design-system/react/core/Card';
import Drawer from '@hedtech/powercampus-design-system/react/core/Drawer';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import List, { ListItem, ListItemIcon, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Table, { TableBody, TableCell, TableEditableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAdvisorRequest } from '../../../Types/Advising/IAdvisorRequest';
import { ISessionPeriod } from '../../../Types/Generic/ISessionPeriod';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface IAdvisorApprovalContentProps {
    advisorApprovalRequest?: IAdvisorRequest;
    decisionAll: number;
    isDrawerClicked: boolean;
    openValidateModal: boolean;
    selected: number;
    periods: ISessionPeriod[];
    onChangeComment: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDecision: (optionSelected: IDropDownOption, id: string) => void;
    onChangeDecisionAll: (optionSelected: IDropDownOption) => void;
    onChangePeriod: (event: React.MouseEvent<HTMLElement>) => void;
    onClickViewDetails: (sectionId: number) => void;
    onCloseValidateModal: () => void;
    onSaveSchedules: () => void;
    onValidateSchedules: () => void;
    onSwipeDrawer: () => void;

    resources: IAdvisorApprovalContentResProps;
}

export interface IAdvisorApprovalContentResProps {
    formatCreditType: string;
    formatTitleSection: string;
    formatRequestDateTime: string;
    formatSectionSubtype: string;
    formatBlockName: string;
    formatGroupName: string;
    btnSwipeDown: string;
    btnSwipeUp: string;
    lblApprove: string;
    lblApproveAll: string;
    lblApproved: string;
    lblCheckedSchedules: string;
    lblClose: string;
    lblComments: string;
    lblDecision: string;
    lblDecisionDate: string;
    lblDenied: string;
    lblDeny: string;
    lblDenyAll: string;
    lblDrop: string;
    lblDropApproval: string;
    lblDropRequests: string;
    lblItem: string;
    lblPending: string;
    lblPendingAll: string;
    lblPeriod: string;
    lblReason: string;
    lblRegistration: string;
    lblRegistrationApproval: string;
    lblRegistrationRequests: string;
    lblRequestDate: string;
    lblSave: string;
    lblScheduleValid: string;
    lblSection: string;
    lblValidate: string;
    lblValidateHeader: string;
}

const styles = (theme: Theme) => createStyles({
    alignItem: {
        textAlign: 'end'
    },
    bottomCard: {
        minHeight: '6.5rem'
    },
    buttonGroup: {
        marginTop: Tokens.spacing60
    },
    cardActions: {
        backgroundColor: Tokens.colorBrandNeutral200,
        padding: Tokens.spacing40,
        paddingBottom: 0
    },
    cardContainerBottom: {
        marginBottom: Tokens.spacing40
    },
    cardGeneralBottom: {
        [theme.breakpoints.down('md')]: {
            marginLeft: `-${Tokens.sizingXxLarge}`
        },
        [theme.breakpoints.only('xs')]: {
            marginLeft: `-${Tokens.spacing50}`
        },
        borderRadius: 0,
        bottom: '0',
        marginLeft: '-130px',
        padding: 0,
        position: 'fixed',
        width: '100%',
        zIndex: Tokens.zIndexActionMenu
    },
    cardGeneralTop: {
        borderRadius: 0,
        boxShadow: 'none',
        left: '0',
        overflowY: 'hidden',
        padding: 0,
        position: 'fixed',
        top: '0',
        width: '100%',
        zIndex: Tokens.zIndexActionMenu
    },
    cardItems: {
        height: '100%',
        overflowY: 'auto',
        padding: Tokens.spacing40,
        paddingBottom: 0,
        position: 'relative'
    },
    cardPeriods: {
        paddingLeft: 0,
        paddingRight: 0
    },
    drawerTitle: {
        marginBottom: Tokens.spacing35,
        textAlign: 'center',
        verticalAlign: 'middle'
    },
    iconBtnItem: {
        textAlign: 'center'
    },
    iconBtnSwipe: {
        height: Tokens.spacing50,
        marginLeft: Tokens.spacing50,
        marginRight: Tokens.spacing50
    },
    iconPeriodTitle: {
        display: 'inline',
        marginLeft: Tokens.spacing40
    },
    justifyButtons: {
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            justifyContent: 'center'
        },
        [theme.breakpoints.up('sm')]: {
            justifyContent: 'flex-end'
        }
    },
    listIcon: {
        minWidth: 0
    },
    listItem: {
        [theme.breakpoints.only('xs')]: {
            padding: `${Tokens.spacing40} ${Tokens.spacing40} ${Tokens.spacing40}`
        },
        padding: `${Tokens.spacing30} ${Tokens.spacing40} ${Tokens.spacing40}`
    },
    listItemSelected: {
        borderLeft: `${Tokens.spacing20} solid ${theme.palette.secondary.main}`,
        [theme.breakpoints.only('xs')]: {
            padding: `${Tokens.spacing40} ${Tokens.spacing40} ${Tokens.spacing40}`
        },
        padding: `${Tokens.spacing30} ${Tokens.spacing40} ${Tokens.spacing30}`
    },
    statusLabel: {
        marginBottom: Tokens.spacing20
    },
    tableAwaiting: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > tbody > tr > td:nth-child(2)': {
                width: '15%'
            },
            '& > tbody > tr > td:nth-child(3)': {
                width: '35%'
            },
            '& > tbody > tr > td:nth-child(4)': {
                width: '20%'
            },
            '& > tbody > tr > th:nth-child(1)': {
                width: '30%'
            }
        }
    },
    tableCell: {
        [theme.breakpoints.only('xs')]: {
            display: 'table-cell!important'
        }
    },
    tableChecked: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '30%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '35%'
            }
        }
    },
    topCard: {
        minHeight: '6.5rem'
    }
});

type PropsWithStyles = IAdvisorApprovalContentProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const AdvisorApprovalContent: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        advisorApprovalRequest,
        classes,
        isDrawerClicked,
        openValidateModal,
        selected,
        periods,
        decisionAll,
        onChangeComment,
        onChangeDecision,
        onChangeDecisionAll,
        onChangePeriod,
        onClickViewDetails,
        onCloseValidateModal,
        onSaveSchedules,
        onSwipeDrawer,
        onValidateSchedules,

        resources
    } = props;

    const decisionAlloptions: IDropDownOption[] = [
        { description: resources.lblPendingAll, value: 1 },
        { description: resources.lblApproveAll, value: 2 },
        { description: resources.lblDenyAll, value: 3 }
    ];

    const decisionOptions: IDropDownOption[] = [
        { description: resources.lblPending, value: 1 },
        { description: resources.lblApprove, value: 2 },
        { description: resources.lblDeny, value: 3 }
    ];

    const setDecision = (decision: number): string => {
        switch (decision) {
            case 1:
                return resources.lblPending;
            case 2:
                return resources.lblApproved;
            case 3:
                return resources.lblDenied;
            default:
                return resources.lblPending;
        }
    };

    const validateModal: JSX.Element = (
        <Modal
            id="validate_modal"
            header={resources.lblValidateHeader}
            footer={(
                <Button
                    id={'btnClose_validateModal'}
                    onClick={onCloseValidateModal}
                >
                    {resources.lblClose}
                </Button >
            )}
            maxWidth="sm"
            open={openValidateModal}
            onClose={onCloseValidateModal}
        >
            <Text>
                {resources.lblScheduleValid}
            </Text>
        </Modal>
    );

    const buttonUpDown: JSX.Element = (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} className={classes.iconBtnItem}>
                <Tooltip
                    id="tltSwipeMySchedule"
                    title={isDrawerClicked ? resources.btnSwipeDown : resources.btnSwipeUp}
                    aria-label={isDrawerClicked ? resources.btnSwipeDown : resources.btnSwipeUp}
                >
                    <IconButton
                        alt={isDrawerClicked ? resources.btnSwipeDown : resources.btnSwipeUp}
                        className={classes.iconBtnSwipe}
                        color="secondary"
                        id="btnSwipeMySchedule"
                        onClick={onSwipeDrawer}
                    >
                        <Icon
                            large
                            name={isDrawerClicked ? 'chevron-down' : 'chevron-up'}
                        />
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <div className={classes.drawerTitle}>
                    <Text
                        align="center"
                        display="inline"
                        size="h2"
                        verticalAlign="middle"
                    >
                        {resources.lblPeriod}
                    </Text>
                    {periods.find(period => period.hasPending) && !isDrawerClicked ? (
                        <div className={classes.iconPeriodTitle}>
                            <Icon
                                name="calendar-check"
                                type="success"
                                iconWithBackground
                            />
                        </div>
                    ) : undefined}
                </div>
            </Grid>
        </Grid>
    );

    const listElement: JSX.Element = (
        <List id="periodsList">
            {(periods.map((period, i) =>
                (
                    <ListItem
                        className={selected === i ? classes.listItemSelected : classes.listItem}
                        id={`periodItem_${period.sessionPeriodId}_${i}`}
                        key={`periodItem_${period.sessionPeriodId}_${i}`}
                        onClick={onChangePeriod}
                    >
                        <ListItemText
                            id={`period_itemText_${i}`}
                            primary={`${period.year}/ ${period.termDesc}/ ${period.sessionDesc}`}
                        />
                        {period.hasPending ? (
                            <ListItemIcon
                                className={classes.listIcon}
                                id={`period_itemIcon_${i}`}
                            >
                                <Icon
                                    name="calendar-check"
                                    type="success"
                                    iconWithBackground
                                />
                            </ListItemIcon>
                        ) : undefined}
                    </ListItem>
                )
            ))}
        </List>
    );

    let isAwaitingDrop: boolean = false;
    let isAwaitingRegistration: boolean = false;
    let isDropRequest: boolean = false;
    let isRegistrationRequest: boolean = false;

    if (advisorApprovalRequest) {
        isAwaitingDrop = advisorApprovalRequest.awaitingDropList
            && advisorApprovalRequest.awaitingDropList.length > 0;
        isAwaitingRegistration = advisorApprovalRequest.awaitingRegistrationList
            && advisorApprovalRequest.awaitingRegistrationList.length > 0;
        isDropRequest = advisorApprovalRequest.dropRequests
            && advisorApprovalRequest.dropRequests.length > 0;
        isRegistrationRequest = advisorApprovalRequest.registrationRequests
            && advisorApprovalRequest.registrationRequests.length > 0;
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item md={3} lg={2}>
                            <Media query={Tokens.mqSmallDown}>
                                {(matches: boolean): JSX.Element => matches ?
                                    (
                                        <>
                                            <Card className={classes.cardGeneralBottom}>
                                                <CardActions
                                                    className={classes.cardActions}
                                                    disableSpacing
                                                >
                                                    {buttonUpDown}
                                                </CardActions>
                                            </Card>
                                            <Drawer
                                                anchor="bottom"
                                                fullScreen
                                                open={isDrawerClicked}
                                                onClose={onSwipeDrawer}
                                            >
                                                <Card className={classes.cardGeneralTop}>
                                                    <CardActions
                                                        className={classes.cardActions}
                                                        disableSpacing
                                                    >
                                                        {buttonUpDown}
                                                    </CardActions>
                                                </Card>
                                                <div className={classes.topCard} /><br />
                                                <div className={classes.cardItems} >
                                                    {listElement}
                                                </div>
                                            </Drawer>
                                        </>
                                    ) :
                                    (
                                        <Card className={classes.cardPeriods}>
                                            <CardHeader
                                                title={resources.lblPeriod}
                                            />
                                            {listElement}
                                        </Card>
                                    )
                                }
                            </Media>
                        </Grid>
                        <Grid item xs={12} md={9} lg={10}>
                            {isAwaitingRegistration || isAwaitingDrop ? (
                                <Card className={classes.cardContainerBottom}>
                                    <CardContent>
                                        <Grid container spacing={3} alignItems="center">
                                            <Grid item xs={12} md={8} lg={9} >
                                                <Text size="h2">
                                                    {`${periods[selected].year}/${periods[selected].termDesc}/${periods[selected].sessionDesc}`}
                                                </Text>
                                            </Grid>
                                            <Grid item xs={12} md={4} lg={3}>
                                                <Dropdown
                                                    id="ddAdvisorDecisionAll"
                                                    options={decisionAlloptions}
                                                    label={resources.lblDecision}
                                                    value={decisionAll}
                                                    onChange={onChangeDecisionAll}
                                                />
                                            </Grid>
                                        </Grid>
                                        {isAwaitingRegistration && advisorApprovalRequest ? (
                                            <>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Text size="h4">
                                                            {resources.lblRegistrationApproval}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Table
                                                            breakpoint="sm"
                                                            classes={{ root: classes.tableAwaiting }}
                                                            id="tblAwaitingRegistration"
                                                        >
                                                            <TableBody>
                                                                {advisorApprovalRequest.awaitingRegistrationList.map((row, i) => (
                                                                    <TableRow key={`advisorApprovalSections_${i}`}>
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            <Button
                                                                                TextProps={{
                                                                                    weight: 'strong'
                                                                                }}
                                                                                align="left"
                                                                                id={`lnkSectionTitle_${row.sectionId}`}
                                                                                textVariantStyling="inherit"
                                                                                variant="text"
                                                                                onClick={onClickViewDetails(row.sectionId)}
                                                                            >
                                                                                {Format.toString(
                                                                                    resources.formatTitleSection,
                                                                                    [row.eventId, row.eventName]
                                                                                )}
                                                                            </Button>
                                                                            <Text
                                                                                color="textSecondary"
                                                                                size="small"
                                                                            >
                                                                                {Format.toString(resources.formatSectionSubtype,
                                                                                    [row.eventSection, row.eventSubTypeDesc])}
                                                                            </Text>
                                                                            <Text
                                                                                color="textSecondary"
                                                                                size="small"
                                                                            >
                                                                                {Format.toString(resources.formatCreditType,
                                                                                    [row.eventTypeDesc, row.eventCreditTypeDesc])}
                                                                            </Text>
                                                                            {row.blockName && (
                                                                                <Text size="small">
                                                                                    {Format.toString(resources.formatBlockName,
                                                                                        [row.blockName])}
                                                                                </Text>
                                                                            )}
                                                                            {row.groupName && (
                                                                                <Text size="small">
                                                                                    {Format.toString(resources.formatGroupName,
                                                                                        [row.groupName])}
                                                                                </Text>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Text size="small">
                                                                                {resources.lblRequestDate}
                                                                            </Text>
                                                                            <Text size="small">
                                                                                {Format.toString(resources.formatRequestDateTime,
                                                                                    [row.requestDate, row.requestTime])}
                                                                            </Text>
                                                                        </TableCell>
                                                                        <TableEditableCell
                                                                            editableComponent={(
                                                                                <TextField
                                                                                    id={`txtComments_registration_${i}`}
                                                                                    label={resources.lblComments}
                                                                                    value={row.reason}
                                                                                    onChange={onChangeComment}
                                                                                />
                                                                            )}
                                                                        />
                                                                        <TableEditableCell
                                                                            editableComponent={(
                                                                                <Grid container>
                                                                                    <Grid item xs={12}>
                                                                                        <Dropdown
                                                                                            id={`ddAdvisorDecision_registration_${i}`}
                                                                                            options={decisionOptions}
                                                                                            label={resources.lblDecision}
                                                                                            value={row.decision}
                                                                                            onChange={onChangeDecision}
                                                                                        />
                                                                                    </Grid>
                                                                                </Grid>
                                                                            )}
                                                                        />
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ) : undefined}
                                        {isAwaitingDrop && advisorApprovalRequest ? (
                                            <>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Text size="h4">
                                                            {resources.lblDropApproval}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Table
                                                            breakpoint="sm"
                                                            classes={{ root: classes.tableAwaiting }}
                                                            id="tblAwaitingDrop"
                                                        >
                                                            <TableBody>
                                                                {advisorApprovalRequest.awaitingDropList.map((row, i) => (
                                                                    <TableRow key={`advisorApprovalSections_${i}`}>
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            <Button
                                                                                TextProps={{
                                                                                    weight: 'strong'
                                                                                }}
                                                                                align="left"
                                                                                id={`lnkSectionTitle_${row.sectionId}`}
                                                                                textVariantStyling="inherit"
                                                                                variant="text"
                                                                                onClick={onClickViewDetails(row.sectionId)}
                                                                            >
                                                                                {Format.toString(
                                                                                    resources.formatTitleSection,
                                                                                    [row.eventId, row.eventName]
                                                                                )}
                                                                            </Button>
                                                                            <Text
                                                                                color="textSecondary"
                                                                                size="small"
                                                                            >
                                                                                {Format.toString(resources.formatSectionSubtype,
                                                                                    [row.eventSection, row.eventSubTypeDesc])}
                                                                            </Text>
                                                                            <Text
                                                                                color="textSecondary"
                                                                                size="small"
                                                                            >
                                                                                {Format.toString(resources.formatCreditType,
                                                                                    [row.eventTypeDesc, row.eventCreditTypeDesc])}
                                                                            </Text>
                                                                            {row.blockName && (
                                                                                <Text size="small">
                                                                                    {Format.toString(resources.formatBlockName,
                                                                                        [row.blockName])}
                                                                                </Text>
                                                                            )}
                                                                            {row.groupName && (
                                                                                <Text size="small">
                                                                                    {Format.toString(resources.formatGroupName,
                                                                                        [row.groupName])}
                                                                                </Text>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Text size="small">
                                                                                {resources.lblRequestDate}
                                                                            </Text>
                                                                            <Text size="small">
                                                                                {Format.toString(resources.formatRequestDateTime,
                                                                                    [row.requestDate, row.requestTime])}
                                                                            </Text>
                                                                        </TableCell>
                                                                        <TableEditableCell
                                                                            editableComponent={(
                                                                                <TextField
                                                                                    id={`txtComments_drop_${i}`}
                                                                                    label={resources.lblComments}
                                                                                    value={row.reason}
                                                                                    onChange={onChangeComment}
                                                                                />
                                                                            )}
                                                                        />
                                                                        <TableEditableCell
                                                                            editableComponent={(
                                                                                <Grid container>
                                                                                    <Grid item xs={12}>
                                                                                        <Dropdown
                                                                                            id={`ddAdvisorDecision_drop_${i}`}
                                                                                            options={decisionOptions}
                                                                                            label={resources.lblDecision}
                                                                                            value={row.decision}
                                                                                            onChange={onChangeDecision}
                                                                                        />
                                                                                    </Grid>
                                                                                </Grid>
                                                                            )}
                                                                        />
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ) : undefined}
                                        < Grid container spacing={3} className={classes.justifyButtons}>
                                            <Grid item>
                                                <ButtonGroup
                                                    className={classes.buttonGroup}
                                                    id="btnGroupAdvisorApproval"
                                                >
                                                    <Button
                                                        id="btnValidate"
                                                        color="secondary"
                                                        onClick={onValidateSchedules}
                                                    >
                                                        {resources.lblValidate}
                                                    </Button>
                                                    <Button
                                                        onClick={onSaveSchedules}
                                                        id="btnSave"
                                                    >
                                                        {resources.lblSave}
                                                    </Button>
                                                </ButtonGroup>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ) : undefined}
                            {isRegistrationRequest || isDropRequest ? (
                                <Card>
                                    <CardContent>
                                        {!isAwaitingRegistration && !isAwaitingDrop ? (
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Text size="h2">
                                                        {`${periods[selected].year}/${periods[selected].termDesc}/${periods[selected].sessionDesc}`}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                        ) : undefined}
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Text size="h3">
                                                    {resources.lblCheckedSchedules}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                {isRegistrationRequest && advisorApprovalRequest ? (
                                                    <ExpansionPanel
                                                        header={(
                                                            <Grid container alignItems="center">
                                                                <Grid item xs={7}>
                                                                    <Text size="h4">
                                                                        {resources.lblRegistrationRequests}
                                                                    </Text>
                                                                </Grid>
                                                                <Grid item xs={5} className={classes.alignItem}>
                                                                    <Text>
                                                                        {`${advisorApprovalRequest.registrationRequests.length} ${(
                                                                            resources.lblItem)}`}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    >
                                                        <Table
                                                            breakpoint="sm"
                                                            classes={{ root: classes.tableChecked }}
                                                            id="tblApprovedScheduleList"
                                                        >
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell component="th">
                                                                        {resources.lblSection}
                                                                    </TableCell>
                                                                    <TableCell component="th">
                                                                        {resources.lblReason}
                                                                    </TableCell>
                                                                    <TableCell component="th">
                                                                        {resources.lblRequestDate}
                                                                    </TableCell>
                                                                    <TableCell component="th">
                                                                        {resources.lblDecisionDate}
                                                                    </TableCell>
                                                                    <TableCell component="th">
                                                                        {resources.lblDecision}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {advisorApprovalRequest.registrationRequests.map((row, i) => (
                                                                    <TableRow key={`ApprovedScheduleInformation_${i}`}>
                                                                        <TableCell
                                                                            columnName={resources.lblSection}
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            <Button
                                                                                TextProps={{
                                                                                    weight: 'strong'
                                                                                }}
                                                                                align="left"
                                                                                id={`lnkSectionTitle_${row.sectionId}`}
                                                                                textVariantStyling="inherit"
                                                                                variant="text"
                                                                                onClick={onClickViewDetails(row.sectionId)}
                                                                            >
                                                                                {Format.toString(
                                                                                    resources.formatTitleSection,
                                                                                    [row.eventId, row.eventName]
                                                                                )}
                                                                            </Button>
                                                                            <Text
                                                                                color="textSecondary"
                                                                                size="small"
                                                                            >
                                                                                {Format.toString(resources.formatSectionSubtype,
                                                                                    [row.eventSection, row.eventSubTypeDesc])}
                                                                            </Text>
                                                                            <Text
                                                                                color="textSecondary"
                                                                                size="small"
                                                                            >
                                                                                {Format.toString(resources.formatCreditType,
                                                                                    [row.eventTypeDesc, row.eventCreditTypeDesc])}
                                                                            </Text>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            columnName={resources.lblReason}
                                                                        >
                                                                            <Text>
                                                                                {row.reason}
                                                                            </Text >
                                                                        </TableCell>
                                                                        <TableCell
                                                                            columnName={resources.lblRequestDate}
                                                                        >
                                                                            <Text>
                                                                                {row.requestDate}
                                                                            </Text>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            columnName={resources.lblDecisionDate}
                                                                        >
                                                                            <Text>
                                                                                {row.decisionDate}
                                                                            </Text>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            columnName={resources.lblDecision}
                                                                        >
                                                                            <Text>
                                                                                {setDecision(row.decision)}
                                                                            </Text>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </ExpansionPanel>
                                                ) : undefined}
                                                {isDropRequest && advisorApprovalRequest ? (
                                                    <ExpansionPanel
                                                        header={(
                                                            <Grid container alignItems="center" spacing={3} justifyContent="space-between" >
                                                                <Grid item xs={7}>
                                                                    <Text size="h4">
                                                                        {resources.lblDropRequests}
                                                                    </Text>
                                                                </Grid>
                                                                <Grid item xs={5} className={classes.alignItem}>
                                                                    <Text>
                                                                        {`${advisorApprovalRequest.dropRequests.length} ${(
                                                                            resources.lblItem)}`}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    >
                                                        <Table
                                                            breakpoint="sm"
                                                            classes={{ root: classes.tableChecked }}
                                                            id="tblApprovedScheduleList"
                                                        >
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell component="th">
                                                                        {resources.lblSection}
                                                                    </TableCell>
                                                                    <TableCell component="th">
                                                                        {resources.lblReason}
                                                                    </TableCell>
                                                                    <TableCell component="th">
                                                                        {resources.lblRequestDate}
                                                                    </TableCell>
                                                                    <TableCell component="th">
                                                                        {resources.lblDecisionDate}
                                                                    </TableCell>
                                                                    <TableCell component="th">
                                                                        {resources.lblDecision}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {advisorApprovalRequest.dropRequests.map((row, i) => (
                                                                    <TableRow key={`ApprovedScheduleInformation_${i}`}>
                                                                        <TableCell
                                                                            columnName={resources.lblSection}
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            <Button
                                                                                TextProps={{
                                                                                    weight: 'strong'
                                                                                }}
                                                                                align="left"
                                                                                id={`lnkSectionTitle_${row.sectionId}`}
                                                                                textVariantStyling="inherit"
                                                                                variant="text"
                                                                                onClick={onClickViewDetails(row.sectionId)}
                                                                            >
                                                                                {Format.toString(
                                                                                    resources.formatTitleSection,
                                                                                    [row.eventId, row.eventName]
                                                                                )}
                                                                            </Button>
                                                                            <Text
                                                                                color="textSecondary"
                                                                                size="small"
                                                                            >
                                                                                {Format.toString(resources.formatSectionSubtype,
                                                                                    [row.eventSection, row.eventSubTypeDesc])}
                                                                            </Text>
                                                                            <Text
                                                                                color="textSecondary"
                                                                                size="small"
                                                                            >
                                                                                {Format.toString(resources.formatCreditType,
                                                                                    [row.eventTypeDesc, row.eventCreditTypeDesc])}
                                                                            </Text>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            columnName={resources.lblReason}
                                                                        >
                                                                            <Text>
                                                                                {row.reason}
                                                                            </Text >
                                                                        </TableCell>
                                                                        <TableCell
                                                                            columnName={resources.lblRequestDate}
                                                                        >
                                                                            <Text>
                                                                                {row.requestDate}
                                                                            </Text>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            columnName={resources.lblDecisionDate}
                                                                        >
                                                                            <Text>
                                                                                {row.decisionDate}
                                                                            </Text>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            columnName={resources.lblDecision}
                                                                        >
                                                                            <Text>
                                                                                {setDecision(row.decision)}
                                                                            </Text>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </ExpansionPanel>
                                                ) : undefined}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ) : undefined}
                        </Grid>
                    </Grid>
                    <div className={classes.bottomCard} />
                </Grid>
            </Grid>
            {validateModal}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(AdvisorApprovalContent);