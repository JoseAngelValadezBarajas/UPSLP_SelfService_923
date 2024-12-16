/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: CourseTemplateSetup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import CourseTemplatesActivities from './CourseTemplatesActivities';
import AddActivitiesModal from './CourseTemplatesAddActivitiesModal';
import EditActivitiesModal from './CourseTemplatesEditActivitiesModal';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ICourseTemplate } from '../../../Types/Department/ICourseTemplate';
import { ICourseTemplateAddActivities } from '../../../Types/Department/ICourseTemplateAddActivities';
import { ICourseTemplates } from '../../../Types/Department/ICourseTemplates';
import { ICourseTemplatesAssignment } from '../../../Types/Department/ICourseTemplatesAssignment';
import { ICourseTemplatesResources } from '../../../Types/Resources/Department/ICourseTemplatesResources';
import { ISectionAssignmentValidationResult } from '../../../Types/Section/ISectionAssignmentValidationResult';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface ICourseTemplateSetupProps {
    courseTemplateId: number;
    courseTemplates: ICourseTemplates;
    courseTemplateName: string;
    cultures: ICultures;
    gradeActivity: IDropDownOption[];
    hasActivities: boolean;
    isAssignedByUser: boolean;
    isMidterm: boolean;
    periodSelected: IDropDownOption;
    templateIsAssigned: boolean;
    onClickAssign: () => void;
    onClickViewCourses: () => void;
    resources: ICourseTemplatesResources;

    // #region Options
    courseTemplateSetup: ICourseTemplate;
    onChangeSetup: () => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickCourseTemplates: () => void;
    onDropdownChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    // #endregion Options

    // #region Add Activities
    activitySetupItems: ICourseTemplateAddActivities;
    isAddActivities: boolean;
    isActivityTypeRequired: boolean;
    isTitleRequired: boolean;
    isValidDueDate: boolean;
    isValidName: boolean;
    onCheckboxChangeModal: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickAddActivities: () => void;
    onCloseAddActivities: () => void;
    onDateTimeChangeModal?: (date: string, id: string, isValid: boolean) => void;
    onDropdownChangeModal: (optionSelected: IDropDownOption, _id: string) => void;
    onTextFieldChangeModal: (event: any) => void;
    onSaveAddActivity: () => void;
    // #endregion Add Activities

    // #region Edit Activities
    editActivitySetupItems: ICourseTemplateAddActivities;
    isEditActivity: boolean;
    isViewActivity: boolean;
    onCheckboxChangeEdit: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDateTimeChangeEdit: (date: string, id: string, isValid: boolean) => void;
    onDropdownChangeEdit: (optionSelected: IDropDownOption, _id: string) => void;
    onTextFieldChangeEdit: (event: any) => void;
    onSaveEditActitiy: () => void;
    // #endregion Edit Activities

    // #region Activities
    activityName: string;
    activitiesSetup: ICourseTemplatesAssignment[];
    confirmationDeleteAll: boolean;
    confirmDeleteActivity: boolean;
    sectionAssignmentValidationResult?: ISectionAssignmentValidationResult;
    showMessageDueDate: boolean;
    onClickCopyActivities: () => void;
    onClickDeleteAllActivities: () => void;
    onBlurTextField: (event: any) => void;
    onChangeDateTime: (date: string, id: string, isValid: boolean) => void;
    onCheckboxChangeActivity: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCloseDeleteAllConfirmModal: () => void;
    onConfirmDeleteActivity: () => void;
    onDeleteActivity: (id: number, name: string) => void;
    onDeleteAllActivity: () => void;
    onEditActivity: (id: number, index: number, subIndex: number, disabled: boolean) => void;
    onSaveActivities: () => void;
    onTextFieldChange: (event: any) => void;
    // #endregion Activities

    // #region Date Modal
    dateModal: boolean;
    dateSelected?: string;
    onChangeDate: (date: string) => void;
    onClearDate: () => void;
    onCloseDate: () => void;
    onOkDate: () => void;
    onOpenDate: (index: number, subIndex: number) => void;
    // #endregion Date Modal
}

const styles = ((theme: Theme) => createStyles({
    iconError: {
        height: Tokens.spacing50,
        marginBottom: Tokens.spacing40,
        marginRight: Tokens.spacing40,
        [theme.breakpoints.down('sm')]: {
            marginRight: Tokens.spacing30
        },
        marginTop: Tokens.spacing40,
        width: Tokens.spacing50
    },
    marginLeft: {
        marginLeft: Tokens.sizingMedium
    },
    marginLeftCheck: {
        marginLeft: Tokens.sizingSmall
    },
    marginRight: {
        marginLeft: '-1.5rem'
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '30%'
            }
        }
    },
    textAlign: {
        textAlign: 'right'
    }
}));

type PropsWithStyles = ICourseTemplateSetupProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const CourseTemplatesSetup: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        classes,
        hasActivities,
        isAssignedByUser,
        templateIsAssigned,
        onClickAssign,
        onClickViewCourses,

        // #region Options
        courseTemplateName,
        courseTemplateSetup,
        cultures,
        gradeActivity,
        periodSelected,
        onChangeSetup,
        onCheckboxChange,
        onClickCourseTemplates,
        onClickDeleteAllActivities,
        onDropdownChange,
        // #endregion Options

        // #region Add Activities
        activitySetupItems,
        isActivityTypeRequired,
        isAddActivities,
        isTitleRequired,
        isValidDueDate,
        isValidName,
        onCheckboxChangeModal,
        onClickAddActivities,
        onCloseAddActivities,
        onDateTimeChangeModal,
        onDropdownChangeModal,
        onTextFieldChangeModal,
        onSaveAddActivity,
        // #endregion Add Activities

        // #region Edit Activities
        editActivitySetupItems,
        isEditActivity,
        isViewActivity,
        onCheckboxChangeEdit,
        onDateTimeChangeEdit,
        onDropdownChangeEdit,
        onSaveEditActitiy,
        onTextFieldChangeEdit,
        // #endregion Edit Activities

        // #region Activities
        activityName,
        activitiesSetup,
        confirmDeleteActivity,
        confirmationDeleteAll,
        courseTemplates,
        courseTemplateId,
        isMidterm,
        sectionAssignmentValidationResult,
        showMessageDueDate,
        onBlurTextField,
        onChangeDateTime,
        onCheckboxChangeActivity,
        onClickCopyActivities,
        onCloseDeleteAllConfirmModal,
        onConfirmDeleteActivity,
        onDeleteActivity,
        onDeleteAllActivity,
        onEditActivity,
        onSaveActivities,
        onTextFieldChange,
        // #endregion Activities

        // #region Date Modal
        dateModal,
        dateSelected,
        onChangeDate,
        onClearDate,
        onCloseDate,
        onOkDate,
        onOpenDate,
        // #endregion Date Modal

        resources
    } = props;

    let isAssigned: boolean = false;
    let isShared: boolean = false;
    let disabledAll: boolean = false;
    let disabled: boolean = false;
    const template: any = courseTemplates.courseTemplates.find(x => x.templateId === courseTemplateId);
    isAssigned = template.isAssigned;

    if (!template.userIsOwner) {
        isShared = true;
        disabledAll = true;
    }
    else if (template.userIsOwner && template.isAssigned && template.isRestrictive) {
        disabled = true;
    }
    else if (template.userIsOwner && !template.isAssigned) {
        disabled = false;
    }
    else {
        disabledAll = true;
    }

    const dueDatesDyOptions: IDropDownOption[] = [
        { value: 0, description: resources.lblByActivity },
        { value: 1, description: resources.lblByActivityType }
    ];

    const weightActivitiesOptions: IDropDownOption[] = [
        { value: 1, description: resources.lblByPossiblePoints },
        { value: 2, description: resources.lblEnterForEachActivity },
        { value: 3, description: resources.lblEqually }
    ];

    const msgErrors: string[] = [];
    {
        if (sectionAssignmentValidationResult && sectionAssignmentValidationResult.errors.length > 0) {
            sectionAssignmentValidationResult.errors.forEach(item => {
                if (item.finalDropsWithUnequalWeights) {
                    msgErrors.push(
                        Format.toString(resources.formatFinalDropsWithUnequalWeights, [item.assignmentTypeDesc])
                    );
                }
                if (item.midtermDropsWithUnequalWeights) {
                    msgErrors.push(
                        Format.toString(resources.formatMidtermDropsWithUnequalWeights, [item.assignmentTypeDesc])
                    );
                }
                if (item.hasTooManyFinalDrops) {
                    msgErrors.push(
                        Format.toString(resources.formatHasTooManyFinalDrops, [item.assignmentTypeDesc])
                    );
                }
                if (item.hasTooManyMidtermDrops) {
                    msgErrors.push(
                        Format.toString(resources.formatTooManyMidtermDrops, [item.assignmentTypeDesc])
                    );
                }
            });
        }
    }

    let header: JSX.Element | undefined;
    header = (
        <Grid container>
            <Grid item>
                <Text size="h2">
                    {resources.lblOptions}
                </Text>
            </Grid>
        </Grid>
    );

    let content: JSX.Element | undefined;
    content = (
        <>
            <Divider
                noMarginTop
            />
            <br />
            <Hidden smDown>
                <Grid container>
                    <Grid item xs={12} md={4}>
                        <Text size="h3">
                            {resources.lblDueDatesOp}
                        </Text>
                        <Divider
                            noMarginBottom
                        />
                    </Grid>
                    <Hidden smDown>
                        <Grid item md={2} />
                    </Hidden>
                    <Grid item xs={12} md={4}>
                        <Text size="h3">
                            {resources.lblActivityWeight}
                        </Text>
                        <Divider
                            noMarginBottom
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={6} className={classes.marginLeftCheck}>
                        <Checkbox
                            checked={courseTemplateSetup.assignmentTemplate.isRestrictive}
                            disabled={disabledAll ? disabledAll : disabled}
                            id="chkSetDueDates"
                            label={resources.lblSetDueDatesForGrades}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Checkbox
                            checked={courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes}
                            disabled={disabledAll ? disabledAll : disabled}
                            id="chkWeightActivitiesByType"
                            label={resources.lblWeightTypeActivities}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={3} className={classes.marginLeft}>
                        <Dropdown
                            disabled={!courseTemplateSetup.assignmentTemplate.isRestrictive}
                            id="ddlSetDueDatesBy"
                            label={resources.lblSetDueDatesBy}
                            options={dueDatesDyOptions}
                            value={courseTemplateSetup.assignmentTemplate.isRestrictive &&
                                courseTemplateSetup.assignmentTemplate.isDateByAssignmentType ? 1 :
                                courseTemplateSetup.assignmentTemplate.isRestrictive &&
                                    !courseTemplateSetup.assignmentTemplate.isDateByAssignmentType ? 0 : 1}
                            onChange={onDropdownChange}
                        />
                    </Grid>
                    <Hidden smDown>
                        <Grid item md={3} />
                    </Hidden>
                    <Grid item xs={12} md={3} className={classes.marginRight}>
                        <Dropdown
                            disabled={disabledAll ? disabledAll : disabled}
                            id="ddlWeightActivities"
                            label={resources.lblWeightActivities}
                            options={weightActivitiesOptions}
                            value={courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod}
                            onChange={onDropdownChange}
                        />
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container>
                    <Grid item xs={12} md={4}>
                        <Text size="h3">
                            {resources.lblGradeMappings}
                        </Text>
                        <Divider
                            noMarginBottom
                        />
                    </Grid>
                    <Hidden smDown>
                        <Grid item md={2} />
                    </Hidden>
                    <Grid item xs={12} md={4}>
                        <Text size="h3">
                            {resources.lblOverallGrades}
                        </Text>
                        <Divider
                            noMarginBottom
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={6} className={classes.marginLeftCheck}>
                        <Checkbox
                            checked={courseTemplateSetup.assignmentTemplate.defaultGradeMapping}
                            disabled={disabledAll ? disabledAll : disabled}
                            id="chkUseDefaults"
                            label={resources.lblUseDefault}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Checkbox
                            checked={courseTemplateSetup.assignmentTemplate.automaticOverallGrades}
                            disabled={disabledAll ? disabledAll : disabled}
                            id="chkOverallGrades"
                            label={resources.lblCalculatedAutomatically}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container>
                    <Grid item>
                        <Button
                            disabled={disabledAll ? disabledAll : disabled}
                            id="btnChange"
                            onClick={onChangeSetup}
                        >
                            {resources.btnChange}
                        </Button>
                    </Grid>
                </Grid>
            </Hidden>
            <Hidden mdUp>
                <Grid container>
                    <Grid item xs={12}>
                        <Text size="h3">
                            {resources.lblDueDatesOp}
                        </Text>
                        <Divider
                            noMarginBottom
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className={classes.marginLeftCheck}>
                        <Checkbox
                            checked={courseTemplateSetup.assignmentTemplate.isRestrictive}
                            disabled={disabledAll ? disabledAll : disabled}
                            id="chkSetDueDates"
                            label={resources.lblSetDueDatesForGrades}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className={classes.marginLeft}>
                        <Dropdown
                            disabled={!courseTemplateSetup.assignmentTemplate.isRestrictive}
                            id="ddlSetDueDatesBy"
                            label={resources.lblSetDueDatesBy}
                            options={dueDatesDyOptions}
                            value={courseTemplateSetup.assignmentTemplate.isRestrictive &&
                                courseTemplateSetup.assignmentTemplate.isDateByAssignmentType ? 1 :
                                courseTemplateSetup.assignmentTemplate.isRestrictive &&
                                    !courseTemplateSetup.assignmentTemplate.isDateByAssignmentType ? 0 : 1}
                            onChange={onDropdownChange}
                        />
                    </Grid>
                </Grid>
                <br />
                <Grid container>
                    <Grid item xs={12}>
                        <Text size="h3">
                            {resources.lblActivityWeight}
                        </Text>
                        <Divider
                            noMarginBottom
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className={classes.marginLeftCheck}>
                        <Checkbox
                            checked={courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes}
                            disabled={disabledAll ? disabledAll : disabled}
                            id="chkWeightActivitiesByType"
                            label={resources.lblWeightTypeActivities}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className={classes.marginLeftCheck}>
                        <Dropdown
                            disabled={disabledAll ? disabledAll : disabled}
                            id="ddlWeightActivities"
                            label={resources.lblWeightActivities}
                            options={weightActivitiesOptions}
                            value={courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod}
                            onChange={onDropdownChange}
                        />
                    </Grid>
                </Grid>
                <br />
                <Grid container>
                    <Grid item xs={12}>
                        <Text size="h3">
                            {resources.lblGradeMappings}
                        </Text>
                        <Divider
                            noMarginBottom
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className={classes.marginLeftCheck}>
                        <Checkbox
                            checked={courseTemplateSetup.assignmentTemplate.defaultGradeMapping}
                            disabled={disabledAll ? disabledAll : disabled}
                            id="chkUseDefaults"
                            label={resources.lblUseDefault}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                </Grid>
                <br />
                <Grid container>
                    <Grid item xs={12}>
                        <Text size="h3">
                            {resources.lblOverallGrades}
                        </Text>
                        <Divider
                            noMarginBottom
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className={classes.marginLeftCheck}>
                        <Checkbox
                            checked={courseTemplateSetup.assignmentTemplate.automaticOverallGrades}
                            disabled={disabledAll ? disabledAll : disabled}
                            id="chkOverallGrades"
                            label={resources.lblCalculatedAutomatically}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                </Grid>
                <br />
                <Grid container>
                    <Grid item xs={12}>
                        <Button
                            disabled={disabledAll ? disabledAll : disabled}
                            id="btnChange"
                            onClick={onChangeSetup}
                        >
                            {resources.btnChange}
                        </Button>
                    </Grid>
                </Grid>
            </Hidden>
        </>
    );

    let addActivitiesModal: JSX.Element | undefined;
    if (isAddActivities) {
        addActivitiesModal = (
            <AddActivitiesModal
                activitySetupItems={activitySetupItems}
                courseTemplateName={courseTemplateName}
                cultures={cultures}
                gradeActivity={gradeActivity}
                isActivityTypeRequired={isActivityTypeRequired}
                isMidterm={isMidterm}
                isTitleRequired={isTitleRequired}
                isValidDueDate={isValidDueDate}
                isValidName={isValidName}
                key="addActivitiesModal"
                open={isAddActivities}
                weightType={courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod}
                onClose={onCloseAddActivities}
                onCheckboxChangeModal={onCheckboxChangeModal}
                onDateTimeChangeModal={onDateTimeChangeModal}
                onDropdownChangeModal={onDropdownChangeModal}
                onTextFieldChangeModal={onTextFieldChangeModal}
                onSaveAddActivity={onSaveAddActivity}
                resources={resources}
            />
        );
    }

    let confirmDeleteAll: JSX.Element | undefined;
    if (confirmationDeleteAll) {
        confirmDeleteAll = (
            <ConfirmationDialog
                contentText={resources.lblDeleteAllActivities}
                open={confirmationDeleteAll}
                primaryActionOnClick={onCloseDeleteAllConfirmModal}
                primaryActionText={resources.btnCancel}
                secondaryActionOnClick={onDeleteAllActivity}
                secondaryActionText={resources.btnDelete}
                secondaryActionProps={{ id: `btnDeleteAllActivities` }}
                title={resources.lblTitleDeleteAll}
            />
        );
    }

    let editActivitiesModal: JSX.Element | undefined;
    if (isEditActivity) {
        editActivitiesModal = (
            <EditActivitiesModal
                activitySetupItems={editActivitySetupItems}
                courseTemplateName={courseTemplateName}
                cultures={cultures}
                gradeActivity={gradeActivity}
                isActivityTypeRequired={isActivityTypeRequired}
                isMidterm={isMidterm}
                isTitleRequired={isTitleRequired}
                isValidDueDate={isValidDueDate}
                isValidName={isValidName}
                isViewActivity={isViewActivity}
                key="editActivitiesModal"
                open={isEditActivity}
                weightType={courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod}
                onClose={onCloseAddActivities}
                onCheckboxChangeEdit={onCheckboxChangeEdit}
                onDateTimeChangeEdit={onDateTimeChangeEdit}
                onDropdownChangeEdit={onDropdownChangeEdit}
                onTextFieldChangeEdit={onTextFieldChangeEdit}
                onSaveEditActitiy={onSaveEditActitiy}
                resources={resources}
            />
        );
    }

    const years: number = 10;
    let changeDateModal: JSX.Element | undefined;
    if (dateModal) {
        const datePickerDate: string | undefined = Format.toDatePicker(cultures.shortDatePattern, dateSelected);
        changeDateModal = (
            <Modal
                header={resources.lblGradesDue}
                id="changeDateModal"
                footer={(
                    <ButtonGroup id="bgDateModal">
                        <Button
                            color="secondary"
                            id="btnClearDate"
                            onClick={onClearDate}
                        >
                            {resources.btnClear}
                        </Button>
                        <Button
                            id="btnChangeDate"
                            onClick={onOkDate}
                        >
                            {resources.btnOk}
                        </Button>
                    </ButtonGroup>
                )}
                maxWidth="xs"
                open={dateModal}
                onClose={onCloseDate}
            >
                <Grid container justifyContent="center">
                    <Grid item>
                        <DatePicker
                            culture={cultures.dateTimeCulture}
                            format={cultures.shortDatePattern}
                            id="dtpChangeDate"
                            selectedDates={datePickerDate ? [datePickerDate] : undefined}
                            value={datePickerDate || ''}
                            variant="standalone"
                            yearsAfter={years}
                            yearsBefore={years}
                            onChange={onChangeDate}
                        />
                    </Grid>
                </Grid>
            </Modal>
        );
    }

    let contentPage: JSX.Element | undefined;
    contentPage = (
        <>
            <Grid container>
                <Grid item>
                    <Paragraph
                        id="prgBreadcrumbs"
                        text={Format.toString(resources.formatBreadcrumbSetup,
                            [resources.lblCourseTemplates, resources.lblTemplateSetup]
                        )}
                        events={[onClickCourseTemplates]}
                    />
                </Grid>
            </Grid>
            <br />
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Text id="lblCourseTemplateName" size="h2">
                                {courseTemplateName}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-between">
                        <Grid item xs={12} md={7}>
                            <Text id="lblPeriodSelected" size="h5">
                                {periodSelected.description}
                            </Text>
                        </Grid>
                        <Grid item xs={12} md={4} className={classes.textAlign}>
                            <ButtonGroup
                                id="btgAssignViewCourses"
                            >
                                {hasActivities && !isAssignedByUser ?
                                    (
                                        <Button
                                            color="secondary"
                                            id="btnAssignCourses"
                                            onClick={onClickAssign}
                                        >
                                            {resources.lblAssign}
                                        </Button>
                                    )
                                    : undefined}
                                {isAssigned || templateIsAssigned ?
                                    (
                                        <Button
                                            color="secondary"
                                            id="btnViewCourses"
                                            onClick={onClickViewCourses}
                                        >
                                            {resources.lblViewAssignedCourses}
                                        </Button>
                                    )
                                    : undefined}
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item md={12}>
                            {disabledAll && isShared ?
                                <Alert
                                    id="msgTemplateShared"
                                    open
                                    text={resources.lblMessageShared}
                                    type={ResultType.warning}
                                />
                                : disabledAll && isShared && isAssigned ?
                                    <Alert
                                        id="msgTemplateShared"
                                        open
                                        text={resources.lblMessageShared}
                                        type={ResultType.warning}
                                    />
                                    : disabledAll && isAssigned ?
                                        <Alert
                                            id="msgTemplateAssigned"
                                            open
                                            text={resources.lblMessageNoChanges}
                                            type={ResultType.warning}
                                        />
                                        : disabled ?
                                            <Alert
                                                id="msgOnlyDueDates"
                                                open
                                                text={resources.lblMessageDueDates}
                                                type={ResultType.warning}
                                            />
                                            : undefined}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <br />
            <ExpansionPanel
                key="courseTemplatesOptions"
                header={header}
            >
                {content}
            </ExpansionPanel>
            <br />
            <Card>
                <CardContent>
                    <Grid container justifyContent="space-between">
                        <Grid item xs={5} md={10}>
                            <Text size="h2">
                                {resources.lblActivities}
                            </Text>
                        </Grid>
                        <Grid item xs={7} md={2}>
                            <ButtonGroup
                                id="btgActions"
                            >
                                <Grid container justifyContent="flex-end">
                                    {hasActivities && (
                                        <>
                                            <Grid item xs={4} md={4}>
                                                <Tooltip
                                                    id="deleteActivity"
                                                    title={resources.btnDeleteAll}
                                                    aria-label={resources.btnDeleteAll}
                                                >
                                                    <IconButton
                                                        color="secondary"
                                                        disabled={disabledAll ? disabledAll : disabled}
                                                        id="btnDelete"
                                                        onClick={onClickDeleteAllActivities}
                                                    >
                                                        <Icon name="trash" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item xs={4} md={4}>
                                        <Tooltip
                                            id="copyActivity"
                                            title={resources.btnCopy}
                                            aria-label={resources.btnCopy}
                                        >
                                            <IconButton
                                                color="secondary"
                                                disabled={disabledAll ? disabledAll : disabled}
                                                id="btnCopy"
                                                onClick={onClickCopyActivities}
                                            >
                                                <Icon name="copy" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={4} md={4}>
                                        <Tooltip
                                            id="addActivity"
                                            title={resources.lblAdd}
                                            aria-label={resources.lblAdd}
                                        >
                                            <IconButton
                                                disabled={disabledAll ? disabledAll : disabled}
                                                id="btnAdd"
                                                onClick={onClickAddActivities}
                                            >
                                                <Icon name="add" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    {sectionAssignmentValidationResult?.status === 1 ?
                        (
                            <>
                                <br />
                                <Grid container>
                                    <Grid item md={12}>
                                        <Alert
                                            id="msgErrors"
                                            open
                                            text={(
                                                <>
                                                    {msgErrors.map((m, i) => (
                                                        <React.Fragment key={`msg_${i}`}>
                                                            {m}
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                                </>
                                            )}
                                            type={ResultType.warning}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        )
                        : undefined}
                    <br />
                    <br />
                    <CourseTemplatesActivities
                        key="courseTemplatesActivities"
                        activityName={activityName}
                        activitiesSetup={activitiesSetup}
                        confirmDeleteActivity={confirmDeleteActivity}
                        courseTemplateSetup={courseTemplateSetup}
                        cultures={cultures}
                        isAssigned={isAssigned}
                        isDisabled={disabled}
                        isDisabledAll={disabledAll}
                        isMidterm={isMidterm}
                        showMessageDueDate={showMessageDueDate}
                        onBlurTextField={onBlurTextField}
                        onChangeDateTime={onChangeDateTime}
                        onCheckboxChange={onCheckboxChangeActivity}
                        onCloseDeleteAllConfirmModal={onCloseDeleteAllConfirmModal}
                        onConfirmDeleteActivity={onConfirmDeleteActivity}
                        onDeleteActivity={onDeleteActivity}
                        onEditActivity={onEditActivity}
                        onOpenDate={onOpenDate}
                        onSaveActivities={onSaveActivities}
                        onTextFieldChange={onTextFieldChange}
                        resources={resources}
                    />
                    <br />
                </CardContent>
            </Card>
            {addActivitiesModal}
            {confirmDeleteAll}
            {editActivitiesModal}
            {changeDateModal}
        </>
    );

    return (
        <>
            {contentPage}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(CourseTemplatesSetup);