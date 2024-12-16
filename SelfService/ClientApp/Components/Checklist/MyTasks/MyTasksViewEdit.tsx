/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: MyTasksViewEdit.tsx
 * Type: Presentation component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import TimePicker from '@hedtech/powercampus-design-system/react/core/TimePicker';

// Types
import { IMyTasksDetail } from '../../../Types/Checklist/IMyTasksDetial';
import { ICheckListPermissions } from '../../../Types/Permissions/ICheckListPermissions';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IPeopleSearchModel } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchModel';
import { IMyTasksMainResources } from '../../../Types/Resources/Checklist/IMyTasksMainResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import MyTaskEditPersonModal from './MyTaskEditPersonModal';

// #endregion Imports

// #region Types
export interface IMyTaskViewEdit {
    canViewNotes: number;
    checkListPermissions: ICheckListPermissions;
    cultures: ICultures;
    impersonateInfo?: IImpersonateInfo;
    isPeopleSearch: boolean;
    onClickStep: (event: any) => void;
    onChange: () => void;
    onCheckboxChange: (event: any) => void;
    onCloseSearch: () => void;
    onDatePickerChange: (date: string, id: string, isValid: boolean) => void;
    onDropdownChange: (optionSelected: IDropDownOption, _id: string) => void;
    onOpenContactPopper: (event: any, myEditTask: IMyTasksDetail) => void;
    onNextEdit: () => void;
    onReturnToList: () => void;
    onTextFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onTimePickerChange: (value: string) => void;
    onSaveEdit: () => void;
    personId: number;
    resources: IMyTasksMainResources;
    myEditTask: IMyTasksDetail;
    session: IDropDownOption[];
    responsibles: IDropDownOption[];
    selectedPerson?: IPeopleSearchModel;
    yearTerm: IDropDownOption[];

    // #region Stepper
    activeStep: number;
    numSteps: number;
    stepErrors: boolean[];
    // #endregion Stepper
}

const styles = createStyles({
    display: {
        display: 'inline-flex'
    },
    marginLeft: {
        marginLeft: Tokens.spacing40
    }
});

type PropsWithStyles = IMyTaskViewEdit & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const MyTasksCompletedModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        canViewNotes,
        checkListPermissions,
        cultures,
        impersonateInfo,
        isPeopleSearch,
        onChange,
        onCheckboxChange,
        onClickStep,
        onCloseSearch,
        onDatePickerChange,
        onDropdownChange,
        onNextEdit,
        onOpenContactPopper,
        onReturnToList,
        onTextFieldChange,
        onTimePickerChange,
        onSaveEdit,
        myEditTask,
        responsibles,
        session,
        selectedPerson,
        yearTerm,
        resources
    } = props;

    let peopleSearch: JSX.Element | undefined;
    const dateMinFormat: string = moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
    const dateMaxFormat: string = moment().add(100, 'years').format(cultures.shortDatePattern.toUpperCase());
    let formatHours: string = '';
    let formatDays: string = '';
    let status: string = '';
    let type: string = '';
    let typeStatusLabel: string = '';

    const emptyOption: IDropDownOption = {
        description: resources.lblDropDownEmptyText,
        value: ''
    };

    if (myEditTask.peopleOrgCodeId && myEditTask.avatarEdit && myEditTask.avatarEditResp && myEditTask.peopleCodeId) {
        myEditTask.avatarEdit.peopleId = myEditTask.peopleOrgCodeId;
        myEditTask.avatarEditResp.peopleId = myEditTask.peopleCodeId;
    }
    switch (myEditTask.category) {
        case 1:
            formatHours = resources.formatHoursOverdue;
            formatDays = resources.formatDaysOverdue;
            status = resources.lblOverdueSingular;
            type = 'error';
            typeStatusLabel = 'error';
            break;

        case 2:
            formatHours = resources.formatHoursDue;
            formatDays = resources.formatDaysDue;
            status = resources.lblToday;
            type = 'warning';
            typeStatusLabel = 'draft';
            break;

        case 3:
            formatHours = resources.formatHoursDue;
            formatDays = resources.formatDaysDue;
            status = resources.lblUpcomingSingular;
            type = 'success';
            typeStatusLabel = 'success';
            break;

        case 4:
            formatHours = resources.formatHoursDue;
            formatDays = resources.formatDaysDue;
            status = resources.lblLaterSingular;
            type = 'info';
            typeStatusLabel = 'pending';
            break;
    }

    if (isPeopleSearch) {
        peopleSearch = (
            <>
                <MyTaskEditPersonModal
                    onClickStep={onClickStep}
                    onClose={onCloseSearch}
                    onNext={onNextEdit}
                    open={isPeopleSearch}
                    personId={impersonateInfo?.personId}
                    resources={resources}
                    editTask={myEditTask}
                    selectedPerson={selectedPerson}
                />
            </>
        );
    }

    const header: JSX.Element | undefined = (
        <>
            <Grid container>
                <Grid item>
                    <Paragraph
                        gutterBottom
                        id="prgBreadcrumbs"
                        text={Format.toString(impersonateInfo?.personId ?
                            resources.formatEditAssociateBreadCrumbs :
                            resources.formatEditBreadCrumbs, [myEditTask.actionName])}
                        events={[onReturnToList]}
                    />
                </Grid>
            </Grid>
            <Hidden smDown>
                <Grid container>
                    <Grid item xs={12}>
                        <div className={classes.display}>
                            <Text
                                size="h4"
                                weight="strong"
                            >
                                {Format.toString(resources.formatEditTask, [myEditTask.actionName])}
                            </Text>
                            <StatusLabel
                                className={classes.marginLeft}
                                id="stsLblStatus"
                                text={status}
                                type={typeStatusLabel}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Hidden>
            <Hidden mdUp>
                <Grid container>
                    <Grid item xs={12}>
                        <Text
                            size="h4"
                            weight="strong"
                        >
                            {Format.toString(resources.formatEditTask, [myEditTask.actionName])}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <StatusLabel
                            id="stsLblStatus"
                            text={status}
                            type={typeStatusLabel}
                        />
                    </Grid>
                </Grid>
            </Hidden>
            <Divider />
        </>
    );

    const onViewContact = (event: any): void => {
        onOpenContactPopper(event, myEditTask);
    };

    const content: JSX.Element | undefined = (
        <>
            <Card>
                <CardContent>
                    {header}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
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
                                        {Format.toString(myEditTask.isPerDay ? formatDays : formatHours, [myEditTask.difference])}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Hidden smDown>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    id="txtPriority"
                                    label={resources.checklistTaskResources.lblPriority}
                                    error={myEditTask.priorityModified && !Boolean(myEditTask.priority) || myEditTask.priorityInvalid}
                                    helperText={myEditTask.priorityModified && !Boolean(myEditTask.priority) ? resources.checklistTaskResources.lblEnterPriority
                                        : myEditTask.priorityInvalid ? resources.checklistTaskResources.lblEnterValidPriority : ''}
                                    maxCharacters={3}
                                    required
                                    value={myEditTask.priority}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                        </Hidden>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Grid container>
                                <Grid item>
                                    <Text>
                                        {resources.formatContact}
                                    </Text>
                                </Grid>
                            </Grid>
                            {impersonateInfo?.personId === null || impersonateInfo?.personId === undefined ?
                                (
                                    <Grid container>
                                        <Grid item>
                                            {myEditTask.avatarEdit && myEditTask.avatarEdit.fullName !== '' && (
                                                <AvatarText
                                                    ButtonProps={{
                                                        'data-id': myEditTask.avatarEdit.personId,
                                                        id: `btnTaskContact_${myEditTask.avatarEdit.personId}`,
                                                        onClick: onViewContact
                                                    }}
                                                    avatarInfo={myEditTask.avatarEdit}
                                                />
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Button
                                                id="btnChange"
                                                color="secondary"
                                                onClick={onChange}
                                            >
                                                {resources.lblChange}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ) :
                                myEditTask.avatarEditResp && myEditTask.avatarEditResp.fullName !== '' ?
                                    (
                                        <Grid container>
                                            <Grid item>
                                                <AvatarText
                                                    avatarInfo={myEditTask.avatarEditResp}
                                                />
                                            </Grid>
                                        </Grid>
                                    )
                                    : undefined
                            }
                        </Grid>
                        <Hidden smDown>
                            <Grid item xs={12} md={6}>
                                <div>
                                    <Checkbox
                                        checked={myEditTask.isRequired}
                                        id="chkRequired"
                                        label={resources.checklistTaskResources.lblRequired}
                                        onChange={onCheckboxChange}
                                    />
                                    <Text>
                                        {Format.toString(resources.formatAssigned, [myEditTask.assignedDate, myEditTask.assignedTime])}
                                    </Text>
                                </div>
                            </Grid>
                        </Hidden>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Grid container>
                                <Grid item>
                                    <Text>
                                        {resources.formatResponsible}
                                    </Text>
                                </Grid>
                            </Grid>
                            {impersonateInfo?.personId !== null || impersonateInfo?.personId !== undefined ?
                                (
                                    <Grid container>
                                        <Grid item xs={12} md={6}>
                                            <Dropdown
                                                emptyOption={emptyOption}
                                                id="ddlResponsible"
                                                label={resources.checklistTaskResources.lblResponsible}
                                                options={responsibles}
                                                value={myEditTask.responsibleId}
                                                onChange={onDropdownChange}
                                            />
                                        </Grid>
                                    </Grid>
                                )
                                : undefined
                            }
                            {impersonateInfo?.personId === null || impersonateInfo?.personId === undefined ?
                                (
                                    <Grid container>
                                        <Grid item>
                                            <AvatarText
                                                avatarInfo={myEditTask.avatarEditResp}
                                            />
                                        </Grid>
                                    </Grid>
                                ) :
                                (
                                    <Grid container>
                                        <Grid item>
                                            {myEditTask.avatarEdit && myEditTask.avatarEdit.fullName ?
                                                (
                                                    <AvatarText
                                                        ButtonProps={{
                                                            'data-id': myEditTask.avatarEdit.personId,
                                                            id: `btnTaskContact_${myEditTask.avatarEdit.personId}`,
                                                            onClick: onViewContact
                                                        }}
                                                        avatarInfo={myEditTask.avatarEdit}
                                                    />
                                                ) : undefined}
                                        </Grid>
                                        {myEditTask.responsibleId === '-1' && (
                                            <Grid item xs={12} md={4}>
                                                <Button
                                                    id="btnChange"
                                                    color="secondary"
                                                    onClick={onChange}
                                                >
                                                    {resources.lblChange}
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                )
                            }
                        </Grid>
                        <Hidden smDown>
                            <Grid item xs={12} md={6}>
                                <Grid container>
                                    <Grid item md={5}>
                                        <DatePicker
                                            culture={cultures.dateTimeCulture}
                                            flip
                                            format={cultures.shortDatePattern}
                                            error={myEditTask.scheduleDateInvalid && !Boolean(myEditTask.scheduleDate) ||
                                                myEditTask.scheduleDateInvalid}
                                            helperText={myEditTask.scheduleDateModified && !Boolean(myEditTask.scheduleDate) ?
                                                resources.checklistTaskResources.lblEnterDueDate
                                                : myEditTask.scheduleDateInvalid ? Format.toString(resources.formatDateOutOfRange,
                                                    [dateMinFormat, dateMaxFormat]) : ''}
                                            id="dpCompletedDate"
                                            label={resources.checklistTaskResources.lblDueDate}
                                            required
                                            value={myEditTask.scheduleDate}
                                            onChange={onDatePickerChange}
                                        />
                                    </Grid>
                                    <Grid item md={5}>
                                        <TimePicker
                                            error={myEditTask.scheduleTimeModified && !Boolean(myEditTask.scheduleTime)}
                                            format={cultures.shortTimePattern}
                                            helperText={myEditTask.scheduleTimeModified && !Boolean(myEditTask.scheduleTime) ?
                                                resources.lblEnterTime : ''}
                                            id="tpHour"
                                            label={resources.checklistTaskResources.lblTime}
                                            required
                                            value={myEditTask.scheduleTime}
                                            onChange={onTimePickerChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Hidden>
                    </Grid>
                    <Grid container>
                        <Grid item>
                            <Text>
                                {Format.toString(resources.formatOffice, [myEditTask.officeDesc])}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={3}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlYearTerm"
                                label={resources.checklistTaskResources.lblYearTerm}
                                options={yearTerm}
                                value={myEditTask.yearTerm}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={3}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlSession"
                                label={resources.checklistTaskResources.lblSession}
                                options={session}
                                value={myEditTask.academicSession}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                    <Hidden mdUp>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField
                                    id="txtPriority"
                                    label={resources.checklistTaskResources.lblPriority}
                                    error={myEditTask.priorityModified && !Boolean(myEditTask.priority) || myEditTask.priorityInvalid}
                                    helperText={myEditTask.priorityModified && !Boolean(myEditTask.priority) ?
                                        resources.checklistTaskResources.lblEnterPriority
                                        : myEditTask.priorityInvalid ? resources.checklistTaskResources.lblEnterValidPriority : ''}
                                    maxCharacters={3}
                                    required
                                    value={myEditTask.priority}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Checkbox
                                    checked={myEditTask.isRequired}
                                    id="chkRequired"
                                    label={resources.checklistTaskResources.lblRequired}
                                    onChange={onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Text>
                                    {Format.toString(resources.formatAssigned, [myEditTask.assignedDate, myEditTask.assignedTime])}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <DatePicker
                                    culture={cultures.dateTimeCulture}
                                    flip
                                    format={cultures.shortDatePattern}
                                    error={myEditTask.scheduleDateInvalid && !Boolean(myEditTask.scheduleDate) || myEditTask.scheduleDateInvalid}
                                    helperText={myEditTask.scheduleDateModified && !Boolean(myEditTask.scheduleDate) ?
                                        resources.checklistTaskResources.lblEnterDueDate
                                        : myEditTask.scheduleDateInvalid ?
                                            Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]) : ''}
                                    id="dpCompletedDate"
                                    label={resources.checklistTaskResources.lblDueDate}
                                    required
                                    value={myEditTask.scheduleDate}
                                    onChange={onDatePickerChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <TimePicker
                                    error={myEditTask.scheduleTimeModified && !Boolean(myEditTask.scheduleTime)}
                                    format={cultures.shortTimePattern}
                                    helperText={myEditTask.scheduleTimeModified && !Boolean(myEditTask.scheduleTime) ? resources.lblEnterTime : ''}
                                    id="tpHour"
                                    label={resources.checklistTaskResources.lblTime}
                                    required
                                    value={myEditTask.scheduleTime}
                                    onChange={onTimePickerChange}
                                />
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <ExpansionPanel
                                defaultExpanded={true}
                                key={`expansion_${myEditTask.actionId}`}
                                header={(
                                    <Text>
                                        {resources.lblInstructions}
                                    </Text>
                                )}
                                variant="card"
                            >
                                <>
                                    <Grid container>
                                        <Grid item md={6}>
                                            <TextField
                                                id="txtInstructions"
                                                label={resources.lblInstructions}
                                                multiline
                                                value={myEditTask.instruction}
                                                onChange={onTextFieldChange}
                                            />
                                            <Text
                                                color="textSecondary"
                                                display="inline"
                                            >
                                                {resources.lblNotesLegend}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Text weight="strong">
                                                {resources.lblPreview}
                                            </Text>
                                            <Divider />
                                            <Card>
                                                <CardContent>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Text>
                                                                <div dangerouslySetInnerHTML={
                                                                    { __html: myEditTask.instruction ? myEditTask.instruction : '' }} />
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </>
                            </ExpansionPanel>
                        </Grid>
                    </Grid>
                    {impersonateInfo?.personId !== null || impersonateInfo?.personId !== undefined ?
                        canViewNotes > 0 ?
                            (
                                <>
                                    <Grid container spacing={3}>
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
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                id="txtNotes"
                                                label={resources.lblNotes}
                                                multiline
                                                value={myEditTask.notes}
                                                onChange={onTextFieldChange}
                                            />
                                            <Text
                                                color="textSecondary"
                                                display="inline"
                                            >
                                                {resources.lblNotesLegend}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Text weight="strong">
                                                {resources.lblPreview}
                                            </Text>
                                            <Divider />
                                            <Card>
                                                <CardContent>
                                                    <Grid container>
                                                        <Grid item>
                                                            <Text>
                                                                <div dangerouslySetInnerHTML={{ __html: myEditTask.notes ? myEditTask.notes : '' }} />
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </>
                            )
                            : undefined
                        :
                        checkListPermissions.viewNotes && (
                            <>
                                <Grid container spacing={3}>
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
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="txtNotes"
                                            label={resources.lblNotes}
                                            multiline
                                            value={myEditTask.notes}
                                            onChange={onTextFieldChange}
                                        />
                                        <Text
                                            color="textSecondary"
                                            display="inline"
                                        >
                                            {resources.lblNotesLegend}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Text weight="strong">
                                            {resources.lblPreview}
                                        </Text>
                                        <Divider />
                                        <Card>
                                            <CardContent>
                                                <Grid container>
                                                    <Grid item>
                                                        <Text>
                                                            <div dangerouslySetInnerHTML={{ __html: myEditTask.notes ? myEditTask.notes : '' }} />
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    <Grid container>
                        <Grid item xs={12}>
                            <ButtonGroup id="btgSaveEdit">
                                <Button
                                    id="btnSave"
                                    onClick={onSaveEdit}
                                >
                                    {resources.lblSave}
                                </Button>
                                <Button
                                    id="btnCancel"
                                    color="secondary"
                                    onClick={onReturnToList}
                                >
                                    {resources.lblCancel}
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <br />
        </>
    );

    return (
        <>
            {content}
            {peopleSearch}
        </>
    );
};
// #endregion Component
// Export: Component
export default withStyles(styles)(MyTasksCompletedModal);