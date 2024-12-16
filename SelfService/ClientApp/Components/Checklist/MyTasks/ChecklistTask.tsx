/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ChecklistTask.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import TimePicker from '@hedtech/powercampus-design-system/react/core/TimePicker';

// Types
import { IAvatar } from '../../../Types/Account/IRelative';
import { IChecklistTaskResources } from '../../../Types/Resources/CheckList/IMyTasksMainResources';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ITask } from '../../../Types/Checklist/ITask';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
// #endregion Imports

// #region Types
export interface IChecklistTaskProps {
    actions?: IDropDownOption[];
    anchorEl: any,
    avatarInfo?: IAvatar;
    cultures: ICultures;
    dateMaxFormat: string;
    dateMinFormat: string;
    emptyOption: IDropDownOption;
    isLoadingAction: boolean;
    isLoadingResponsible: boolean;
    isLoadingSession: boolean;
    offices: IDropDownOption[];
    openPopperAdd: boolean;
    responsibles?: IDropDownOption[];
    sessions?: IDropDownOption[];
    showSearchButton?: boolean;
    task: ITask;
    yearTerms?: IDropDownOption[];

    resources: IChecklistTaskResources;

    onCancel: () => void;
    onCheckboxChange: (event: any) => void;
    onClickAssociatedTaskLink: () => void;
    onClosePopperAdd: () => void;
    onDatePickerChange: (date: string, id: string, isValid: boolean) => void;
    onDropdownChange: (option: IDropDownOption, id: string) => void;
    onOpenPopperAdd: (event: any) => void;
    onSave: () => void;
    onSearchResponsible: () => void;
    onTextFieldChange: (event: any) => void;
    onTimePickerChange: (value: string) => void;
}

const styles = createStyles({
    inline: {
        display: 'inline-flex'
    },
    popperText: {
        maxWidth: '15rem'
    }
});

type PropsWithStyles = IChecklistTaskProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const ChecklistTask: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        actions,
        anchorEl,
        avatarInfo,
        classes,
        cultures,
        dateMaxFormat,
        dateMinFormat,
        emptyOption,
        isLoadingAction,
        isLoadingResponsible,
        isLoadingSession,
        offices,
        openPopperAdd,
        responsibles,
        sessions,
        showSearchButton,
        task,
        yearTerms,

        resources,

        onCancel,
        onCheckboxChange,
        onClickAssociatedTaskLink,
        onClosePopperAdd,
        onDatePickerChange,
        onDropdownChange,
        onOpenPopperAdd,
        onSave,
        onSearchResponsible,
        onTextFieldChange,
        onTimePickerChange
    } = props;

    let responsibleInfo: JSX.Element | undefined;
    responsibleInfo = (
        <>
            <Popper
                anchorEl={anchorEl}
                arrow
                id="popResponsibleInfo"
                open={openPopperAdd}
                placement="right-start"
                TextTypographyProps={{ className: classes.popperText }}
                transition={false}
                onClickAway={onClosePopperAdd}
            >
                <Grid container>
                    <Grid item>
                        <Text
                            weight="strong"
                        >
                            {resources.lblResponsible}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item>
                        <Icon
                            large
                            name="phone"
                        />
                    </Grid>
                    <Grid item>
                        <Text>
                            {Format.toPhone(task.responsibleDetail && task.responsibleDetail.phoneNumber ? task.responsibleDetail.phoneNumber : '',
                                task.responsibleDetail && task.responsibleDetail.phoneFormat ? task.responsibleDetail.phoneFormat : '', '@')}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item>
                        <Icon
                            large
                            name="email"
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            id="btnSendEmail"
                            align="left"
                            textVariantStyling="inherit"
                            variant="text"
                        >
                            {task.responsibleDetail ? task.responsibleDetail.email : ''}
                        </Button>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item>
                        <Icon
                            large
                            name="location"
                        />
                    </Grid>
                    <Grid item>
                        <Text>
                            <span dangerouslySetInnerHTML={{
                                __html: task.responsibleDetail ?
                                    Format.toString(resources.formatAddress, [
                                        task.responsibleDetail.addressLine1,
                                        task.responsibleDetail.addressLine2,
                                        task.responsibleDetail.addressLine3,
                                        task.responsibleDetail.addressLine4,
                                        task.responsibleDetail.houseNumber,
                                        task.responsibleDetail.city,
                                        task.responsibleDetail.state,
                                        task.responsibleDetail.zipCode,
                                        task.responsibleDetail.country
                                    ]) : ''
                            }}
                            />
                        </Text>
                    </Grid>
                </Grid>
            </Popper>
        </>
    );

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div className={classes.inline}>
                        <Button
                            align="left"
                            id="AssociatedTaskLink"
                            textVariantStyling="inherit"
                            variant="text"
                            onClick={onClickAssociatedTaskLink}
                        >
                            {resources.lblAssociatedTasks}
                        </Button>
                        <Text inline>
                            {resources.lblAddTaskLink}
                        </Text>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Text size="h3" weight="strong">
                        {resources.lblCreateTaskDefault}
                    </Text>
                </Grid>
                <Grid item xs={12}>
                    <Text size="h4" weight="strong">
                        {resources.lblContact}
                    </Text>
                </Grid>
                <Grid item xs={12}>
                    <AvatarText
                        avatarInfo={avatarInfo}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Text size="h4" weight="strong">
                        {resources.lblGeneralSetting}
                    </Text>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={task.officeModified && !Boolean(task.officeId)}
                                helperText={task.officeModified && !Boolean(task.officeId) ?
                                    resources.lblEnterOffice : undefined}
                                id="ddlOffice"
                                label={resources.lblOffice}
                                options={offices}
                                required
                                value={task.officeId}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={task.actionModified && !Boolean(task.actionId) || task.actionInvalid}
                                helperText={task.actionModified && !Boolean(task.actionId) ?
                                    resources.lblEnterAction : task.actionInvalid ? resources.lblActionDuplicated
                                        : undefined}
                                id="ddlAction"
                                label={resources.lblAction}
                                loading={isLoadingAction}
                                options={actions}
                                required
                                value={task.actionId}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Text>
                        {resources.lblResponsibleInstructions}
                    </Text>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlResponsible"
                                label={resources.lblResponsible}
                                loading={isLoadingResponsible}
                                options={responsibles}
                                value={task.responsibleId}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                        {task.responsible && (
                            <Grid item xs={12} md={4}>
                                <AvatarText
                                    ButtonProps={{
                                        'data-id': task.responsible.personId,
                                        id: `btnResponsibleInfo_${task.responsibleId}`,
                                        onClick: onOpenPopperAdd
                                    }}
                                    avatarInfo={task.responsible}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                {showSearchButton ?
                    <Grid item xs={12}>

                        <Button
                            id="btnSearch"
                            onClick={onSearchResponsible}
                        >
                            {resources.btnSearchResponsible}
                        </Button>
                    </Grid>
                    : undefined}
                <Grid item xs={12}>
                    <Checkbox
                        checked={task.isRequired}
                        id="chkRequired"
                        label={resources.lblRequired}
                        onChange={onCheckboxChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlYearTerm"
                                label={resources.lblYearTerm}
                                options={yearTerms}
                                value={task.yearTermSelected}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlSession"
                                label={resources.lblSession}
                                loading={isLoadingSession}
                                options={sessions}
                                value={task.academicSession}
                                onChange={onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <TextField
                                error={task.priorityModified && !Boolean(task.priority) || task.priorityInvalid}
                                helperText={task.priorityModified && !Boolean(task.priority) ? resources.lblEnterPriority
                                    : task.priorityInvalid ? resources.lblEnterValidPriority : ''}
                                id="txtPriority"
                                label={resources.lblPriority}
                                maxCharacters={3}
                                required
                                value={task.priority}
                                onChange={onTextFieldChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                flip
                                format={cultures.shortDatePattern}
                                error={task.dueDateModified && !Boolean(task.dueDate) || task.dueDateInvalid}
                                helperText={task.dueDateModified && !Boolean(task.dueDate) ? resources.lblEnterDueDate
                                    : task.dueDateInvalid ?
                                        Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat])
                                        : ''}
                                id="dpDueDate"
                                label={resources.lblDueDate}
                                required
                                value={task.dueDate || ''}
                                onChange={onDatePickerChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TimePicker
                                error={task.timeModified && !Boolean(task.dueTime)}
                                format={cultures.shortTimePattern}
                                helperText={task.timeModified && !Boolean(task.dueTime) ? resources.lblEnterTime : ''}
                                id="tpHour"
                                key={task.dueTime}
                                label={resources.lblTime}
                                required
                                value={task.dueTime}
                                onChange={onTimePickerChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Text size="h4" weight="strong">
                        {resources.lblInstructions}
                    </Text>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="txtInstructions"
                        label={resources.lblEnterInstructions}
                        multiline
                        value={task.instruction}
                        onChange={onTextFieldChange}
                    />
                    <Text
                        color="textSecondary"
                        display="inline"
                    >
                        {resources.lblInstructionsDescription}
                    </Text>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Text size="h4" weight="strong">
                        {resources.lblPreview}
                    </Text>
                    <Divider />
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text>
                                        <div dangerouslySetInnerHTML={{ __html: task.instruction ? task.instruction : '' }} />
                                    </Text>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Text size="h4" weight="strong">
                        {resources.lblNotes}
                    </Text>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="txtNotes"
                        label={resources.lblEnterNotes}
                        multiline
                        value={task.note}
                        onChange={onTextFieldChange}
                    />
                    <Text
                        color="textSecondary"
                        display="inline"
                    >
                        {resources.lblNotesDescription}
                    </Text>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Text size="h4" weight="strong">
                        {resources.lblPreview}
                    </Text>
                    <Divider />
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text>
                                        <div dangerouslySetInnerHTML={{ __html: task.note ? task.note : '' }} />
                                    </Text>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup id="bgAddTask">
                        <Button
                            id="btnSave"
                            onClick={onSave}
                        >
                            {resources.btnSave}
                        </Button>
                        <Button
                            color="secondary"
                            id="btnCancel"
                            onClick={onCancel}
                        >
                            {resources.btnCancel}
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            {responsibleInfo}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(ChecklistTask);