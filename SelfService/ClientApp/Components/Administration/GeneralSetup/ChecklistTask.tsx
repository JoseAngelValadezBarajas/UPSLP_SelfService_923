/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: ChecklistTask.tsx
 * Type: Presentation component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import TimePicker from '@hedtech/powercampus-design-system/react/core/TimePicker';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ITask } from '../../../Types/Checklist/ITask';
import { IChecklistTaskResources } from '../../../Types/Resources/Administration/IChecklistSetupResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
// #endregion Imports

// #region Types
export interface IChecklistTaskProps {
    actions?: IDropDownOption[];
    actionName: string;
    cultures: ICultures;
    dueDateTypes: IDropDownOption;
    emptyOption: IDropDownOption;
    isLoadingAction: boolean;
    isLoadingSession: boolean;
    officeDesc: string;
    offices: IDropDownOption[];
    sessions?: IDropDownOption[];
    task: ITask;
    yearTerms?: IDropDownOption[];

    resources: IChecklistTaskResources;

    onCancel: () => void;
    onCheckboxChange: (event: any) => void;
    onDatePickerChange: (date: string, id: string, isValid: boolean) => void;
    onDropdownChange: (option: IDropDownOption, id: string) => void;
    onSave: () => void;
    onTextFieldChange: (event: any) => void;
    onTextFieldNumericChange: (value: number) => void;
    onTimePickerChange: (value: string) => void;
}

const styles = createStyles({
    styleName: {
        color: 'red',
        fontFamily: Tokens.fontFamilyDefault
    }
});

type PropsWithStyles = IChecklistTaskProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const ChecklistTask: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        actions,
        actionName,
        cultures,
        dueDateTypes,
        emptyOption,
        isLoadingAction,
        isLoadingSession,
        officeDesc,
        offices,
        sessions,
        task,
        yearTerms,

        resources,

        onCancel,
        onCheckboxChange,
        onDatePickerChange,
        onDropdownChange,
        onSave,
        onTextFieldChange,
        onTextFieldNumericChange,
        onTimePickerChange
    } = props;

    const dateMinFormat: string = moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
    const dateMaxFormat: string = moment().add(100, 'years').format(cultures.shortDatePattern.toUpperCase());

    return (
        <Grid container>
            <Grid item xs={12}>
                <Text size="h2" weight="strong">
                    {task.checklistTemplateId ? resources.lblEditAction + actionName : resources.lblCreateTaskDefault}
                </Text>
            </Grid>
            <Grid item xs={12}>
                <Text size="h3">
                    {resources.lblGeneralSetting}
                </Text>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12} md={4}>
                        {task.checklistTemplateId ? (
                            <Text>
                                {resources.lblEditOffice}
                                {officeDesc}
                            </Text>
                        ) : (
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
                        )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {task.checklistTemplateId ? '' : (
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
                        )}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12} md={3}>
                        <Checkbox
                            checked={task.isRequired}
                            id="chkRequired"
                            label={resources.lblRequired}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Checkbox
                            checked={task.isActive}
                            id="chkActive"
                            label={resources.lblActive}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                </Grid>
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
            <Grid item xs={12} md={12}>
                <Text size="h3">
                    {resources.lblDueDate}
                </Text>
            </Grid>
            <Grid item xs={12}>
                <Text>
                    {resources.lblDueDateInstrucctions}
                </Text>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12} md={4}>
                        <Dropdown
                            emptyOption={emptyOption}
                            error={task.optionModified && !Boolean(task.option)}
                            helperText={task.optionModified && !Boolean(task.option) ?
                                resources.lblEnterSetDueDate : undefined}
                            id="ddlDueDate"
                            label={resources.lblSetDueDate}
                            options={dueDateTypes}
                            required
                            value={task.option}
                            onChange={onDropdownChange}
                        />
                    </Grid>
                </Grid>
            </Grid>
            {task.option === 1 ? (
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                flip
                                format={cultures.shortDatePattern}
                                error={task.dueDateModified && !Boolean(task.dueDate) || task.dueDateInvalid}
                                helperText={task.dueDateModified && !Boolean(task.dueDate) ? resources.lblEnterDueDate
                                    : task.dueDateInvalid
                                        ? Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]) : ''}
                                id="dpDueDate"
                                label={resources.lblDueDate}
                                required
                                value={task.dueDate}
                                onChange={onDatePickerChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TimePicker
                                error={task.timeModified && !Boolean(task.dueTime)}
                                format={cultures.shortTimePattern}
                                helperText={task.timeModified && !Boolean(task.dueTime) ? resources.lblEnterTime : ''}
                                id="tpHour"
                                label={resources.lblTime}
                                required
                                value={task.dueTime}
                                onChange={onTimePickerChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            ) :
                task.option === 2 ? (
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={4}>
                                <TextField
                                    error={task.offsetDaysModified &&
                                        (task.offsetDays === undefined || task.offsetDays === null || task.offsetDaysInvalid)}
                                    helperText={task.offsetDaysModified &&
                                        (task.offsetDays === undefined || task.offsetDays === null) ?
                                        resources.lblEnterOffsetDays : task.offsetDaysInvalid ?
                                            Format.toString(resources.formatOffsetDaysRange, ['0', '999']) : ''}
                                    id="txtOffsetDaysy"
                                    label={resources.lblOffsetDays}
                                    max={999}
                                    min={0}
                                    required
                                    type="number"
                                    value={task.offsetDays}
                                    onChange={onTextFieldNumericChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TimePicker
                                    error={task.timeModified && !Boolean(task.dueTime)}
                                    format={cultures.shortTimePattern}
                                    helperText={task.timeModified && !Boolean(task.dueTime) ? resources.lblEnterTime : ''}
                                    id="tpHour"
                                    label={resources.lblTime}
                                    required
                                    value={task.dueTime}
                                    onChange={onTimePickerChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                ) : undefined
            }
            <Grid item xs={12}>
                <Text size="h3">
                    {resources.lblInstructions}
                </Text>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    id="txtInstructions"
                    label={resources.lblInstructions}
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
                <Text size="h3">
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
                <Text size="h3">
                    {resources.lblNotes}
                </Text>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    id="txtNotes"
                    label={resources.lblNotes}
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
                <Text size="h3">
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
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(ChecklistTask);