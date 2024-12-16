/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: CourseTemplateActivities.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Internal components
import CourseTemplatesActivitiesTable from './CourseTemplatesActivitiesTable';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ICourseTemplate } from '../../../Types/Department/ICourseTemplate';
import { ICourseTemplatesResources } from '../../../Types/Resources/Department/ICourseTemplatesResources';
import { IActivitiesSetup } from '../../../Types/Section/IActivitiesSetup';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion

// #region Internal types
export interface ICourseTemplateActivitiesProps {
    activityName: string;
    activitiesSetup: IActivitiesSetup;
    confirmDeleteActivity: boolean;
    courseTemplateSetup: ICourseTemplate;
    cultures: ICultures;
    isAssigned: boolean;
    isDisabled: boolean;
    isDisabledAll: boolean;
    isMidterm: boolean;
    showMessageDueDate: boolean;
    onBlurTextField: (event: any) => void;
    onChangeDateTime: (date: string, id: string, isValid: boolean) => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCloseDeleteAllConfirmModal: () => void;
    onConfirmDeleteActivity: () => void;
    onDeleteActivity: (id: number, name: string) => void;
    onSaveActivities: () => void;
    onEditActivity: (id: number, index: number, subIndex: number, disabled: boolean) => void;
    onOpenDate: (index: number, subIndex: number) => void;
    onTextFieldChange: (event: any) => void;
    resources: ICourseTemplatesResources;
}

const styles = ((theme: Theme) => createStyles({
    marginTop: {
        [theme.breakpoints.up('md')]: {
            marginTop: '1.5rem'
        },
        marginTop: Tokens.sizingXSmall
    }
}));

type PropsWithStyles = ICourseTemplateActivitiesProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const CourseTemplatesActivities: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        activityName,
        activitiesSetup,
        classes,
        confirmDeleteActivity,
        courseTemplateSetup,
        cultures,
        isAssigned,
        isDisabled,
        isDisabledAll,
        isMidterm,
        showMessageDueDate,
        onBlurTextField,
        onChangeDateTime,
        onCheckboxChange,
        onCloseDeleteAllConfirmModal,
        onConfirmDeleteActivity,
        onDeleteActivity,
        onEditActivity,
        onOpenDate,
        onSaveActivities,
        onTextFieldChange,

        resources
    } = props;

    const contentPage: JSX.Element[] | undefined = [];
    if (activitiesSetup && activitiesSetup.assignmentTypes) {
        activitiesSetup.assignmentTypes.forEach((activity, index) => {
            let headerActivities: JSX.Element | undefined;
            headerActivities = (
                <>
                    <Grid container>
                        <Grid item>
                            <Text size="h3">
                                {Format.toString(resources.formatActivityTitle, [activity.description])}
                            </Text>
                        </Grid>
                    </Grid>
                    {courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 1 && activity.assignmentsCount > 0 ?
                        (
                            <Grid container>
                                <Grid item>
                                    <Text>
                                        {Format.toString(resources.formatItems, [activity.assignmentsCount])}
                                    </Text>
                                </Grid>
                            </Grid>
                        )
                        : undefined}
                </>
            );

            let contentActivities: JSX.Element | undefined;
            contentActivities = (
                <>
                    <Hidden smDown>
                        <Grid container>
                            {isMidterm && (
                                <Grid item md={5}>
                                    <Text size="h3">
                                        {resources.lblMidterm}
                                    </Text>
                                </Grid>
                            )}
                            <Grid item md={5}>
                                <Text size="h3">
                                    {resources.lblFinal}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            {isMidterm ?
                                (
                                    <Grid item xs={12} md={5}>
                                        <Grid container>
                                            {courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes ?
                                                (
                                                    <Grid item md={2}>
                                                        <TextField
                                                            disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                                            id={`txtWeightMidterm_${index}`}
                                                            label={resources.lblWeight}
                                                            numeric
                                                            type="text"
                                                            value={activitiesSetup.assignmentTypes[index].midtermWeight}
                                                            onBlur={onBlurTextField}
                                                            onChange={onTextFieldChange}
                                                        />
                                                    </Grid>
                                                )
                                                : undefined}
                                            <Grid item md={3}>
                                                <TextField
                                                    disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                                    id={`txtDropLowestMidterm_${index}`}
                                                    label={resources.lblDropLowest}
                                                    numeric
                                                    type="text"
                                                    value={activitiesSetup.assignmentTypes[index].midtermDropLowest}
                                                    onBlur={onBlurTextField}
                                                    onChange={onTextFieldChange}
                                                />
                                            </Grid>
                                            <Grid item md={2} className={classes.marginTop}>
                                                <Text>
                                                    {Format.toString(resources.formatOf, [activitiesSetup.assignmentTypes[index].midtermMaxDrop])}
                                                </Text>
                                            </Grid>
                                            <Grid item md={3}>
                                                <TextField
                                                    disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                                    id={`txtDropHighestMidterm_${index}`}
                                                    label={resources.lblDropHighest}
                                                    numeric
                                                    type="text"
                                                    value={activitiesSetup.assignmentTypes[index].midtermDropHighest}
                                                    onBlur={onBlurTextField}
                                                    onChange={onTextFieldChange}
                                                />
                                            </Grid>
                                            <Grid item md={2} className={classes.marginTop}>
                                                <Text>
                                                    {Format.toString(resources.formatOf, [activitiesSetup.assignmentTypes[index].midtermMaxDrop])}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                                : undefined}
                            <Grid item xs={12} md={5}>
                                <Grid container>
                                    {courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes ?
                                        (
                                            <Grid item md={2}>
                                                <TextField
                                                    disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                                    id={`txtWeightFinal_${index}`}
                                                    label={resources.lblWeight}
                                                    numeric
                                                    type="text"
                                                    value={activitiesSetup.assignmentTypes[index].finalWeight}
                                                    onBlur={onBlurTextField}
                                                    onChange={onTextFieldChange}
                                                />
                                            </Grid>
                                        )
                                        : undefined}
                                    <Grid item md={3}>
                                        <TextField
                                            disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                            id={`txtDropLowestFinal_${index}`}
                                            label={resources.lblDropLowest}
                                            numeric
                                            type="text"
                                            value={activitiesSetup.assignmentTypes[index].finalDropLowest}
                                            onBlur={onBlurTextField}
                                            onChange={onTextFieldChange}
                                        />
                                    </Grid>
                                    <Grid item md={2} className={classes.marginTop}>
                                        <Text>
                                            {Format.toString(resources.formatOf, [activitiesSetup.assignmentTypes[index].finalMaxDrop])}
                                        </Text>
                                    </Grid>
                                    <Grid item md={3}>
                                        <TextField
                                            disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                            id={`txtDropHighestFinal_${index}`}
                                            label={resources.lblDropHighest}
                                            numeric
                                            type="text"
                                            value={activitiesSetup.assignmentTypes[index].finalDropHighest}
                                            onBlur={onBlurTextField}
                                            onChange={onTextFieldChange}
                                        />
                                    </Grid>
                                    <Grid item md={2} className={classes.marginTop}>
                                        <Text>
                                            {Format.toString(resources.formatOf, [activitiesSetup.assignmentTypes[index].finalMaxDrop])}
                                        </Text>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <DatePicker
                                    culture={cultures.dateTimeCulture}
                                    disabled={!courseTemplateSetup.assignmentTemplate.isDateByAssignmentType}
                                    flip
                                    format={cultures.shortDatePattern}
                                    id={`dtpGradeDue_${index}`}
                                    label={resources.lblGradesDue}
                                    required
                                    value={activity.endDate}
                                    onChange={onChangeDateTime}
                                />
                            </Grid>
                            <Divider />
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        {isMidterm && (
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblMidterm}
                                    </Text>
                                </Grid>
                            </Grid>
                        )}
                        {isMidterm && courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes ?
                            (
                                <Grid container>
                                    <Grid item xs={5} sm={4}>
                                        <TextField
                                            disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                            id={`txtWeightMidterm_${index}`}
                                            label={resources.lblWeight}
                                            numeric
                                            type="text"
                                            value={activitiesSetup.assignmentTypes[index].midtermWeight}
                                            onBlur={onBlurTextField}
                                            onChange={onTextFieldChange}
                                        />
                                    </Grid>
                                </Grid>
                            )
                            : undefined}
                        {isMidterm ?
                            (
                                <Grid container>
                                    <Grid item xs={5}>
                                        <TextField
                                            disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                            id={`txtDropLowestMidterm_${index}`}
                                            label={resources.lblDropLowest}
                                            numeric
                                            type="text"
                                            value={activitiesSetup.assignmentTypes[index].midtermDropLowest}
                                            onBlur={onBlurTextField}
                                            onChange={onTextFieldChange}
                                        />
                                    </Grid>
                                    <Grid item xs={1} className={classes.marginTop}>
                                        <Text>
                                            {Format.toString(resources.formatOf, [activitiesSetup.assignmentTypes[index].midtermMaxDrop])}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                            id={`txtDropHighestMidterm_${index}`}
                                            label={resources.lblDropHighest}
                                            numeric
                                            type="text"
                                            value={activitiesSetup.assignmentTypes[index].midtermDropHighest}
                                            onBlur={onBlurTextField}
                                            onChange={onTextFieldChange}
                                        />
                                    </Grid>
                                    <Grid item xs={1} className={classes.marginTop}>
                                        <Text>
                                            {Format.toString(resources.formatOf, [activitiesSetup.assignmentTypes[index].midtermMaxDrop])}
                                        </Text>
                                    </Grid>
                                </Grid>
                            )
                            : undefined}
                        <br />
                        <Grid container>
                            <Grid item xs={12}>
                                <Text size="h3">
                                    {resources.lblFinal}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            {courseTemplateSetup.assignmentTemplate.useWeightedAssignmentTypes ?
                                (
                                    <Grid item xs={5} sm={4}>
                                        <TextField
                                            disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                            id={`txtWeightFinal_${index}`}
                                            label={resources.lblWeight}
                                            numeric
                                            type="text"
                                            value={activitiesSetup.assignmentTypes[index].finalWeight}
                                            onBlur={onBlurTextField}
                                            onChange={onTextFieldChange}
                                        />
                                    </Grid>
                                )
                                : undefined}
                        </Grid>
                        <Grid container>
                            <Grid item xs={5}>
                                <TextField
                                    disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                    id={`txtDropLowestFinal_${index}`}
                                    label={resources.lblDropLowest}
                                    numeric
                                    type="text"
                                    value={activitiesSetup.assignmentTypes[index].finalDropLowest}
                                    onBlur={onBlurTextField}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                            <Grid item xs={1} className={classes.marginTop}>
                                <Text>
                                    {Format.toString(resources.formatOf, [activitiesSetup.assignmentTypes[index].finalMaxDrop])}
                                </Text>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                    id={`txtDropHighestFinal_${index}`}
                                    label={resources.lblDropHighest}
                                    numeric
                                    type="text"
                                    value={activitiesSetup.assignmentTypes[index].finalDropHighest}
                                    onBlur={onBlurTextField}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                            <Grid item xs={1} className={classes.marginTop}>
                                <Text>
                                    {Format.toString(resources.formatOf, [activitiesSetup.assignmentTypes[index].finalMaxDrop])}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs={12}>
                                <DatePicker
                                    culture={cultures.dateTimeCulture}
                                    disabled={!courseTemplateSetup.assignmentTemplate.isDateByAssignmentType}
                                    flip
                                    format={cultures.shortDatePattern}
                                    id={`dtpGradeDue_${index}`}
                                    label={resources.lblGradesDue}
                                    required
                                    value={activity.endDate}
                                    onChange={onChangeDateTime}
                                />
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Divider />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <CourseTemplatesActivitiesTable
                                key={`courseTemplatesActivitiesTable_${activity.id}_${index}`}
                                activityName={activityName}
                                activitiesSetup={activity}
                                courseTemplateSetup={courseTemplateSetup}
                                confirmDeleteActivity={confirmDeleteActivity}
                                cultures={cultures}
                                isMidterm={isMidterm}
                                isDisabled={isDisabled}
                                isDisabledAll={isDisabledAll}
                                isAssigned={isAssigned}
                                index={index}
                                onOpenDate={onOpenDate}
                                onBlurTextField={onBlurTextField}
                                onCheckboxChange={onCheckboxChange}
                                onCloseDeleteAllConfirmModal={onCloseDeleteAllConfirmModal}
                                onConfirmDeleteActivity={onConfirmDeleteActivity}
                                onDeleteActivity={onDeleteActivity}
                                onEditActivity={onEditActivity}
                                onTextFieldChange={onTextFieldChange}
                                resources={resources}
                            />
                        </Grid>
                    </Grid>
                    <br />
                </>
            );

            contentPage.push(
                <>
                    <Grid container>
                        <Grid item xs={12} md={12}>
                            <ExpansionPanel
                                background="gray"
                                header={headerActivities}
                                key={`courseTemplateActivityType_${index}`}
                                id={`courseTemplateActivityType_${index}`}
                            >
                                {contentActivities}
                            </ExpansionPanel>
                        </Grid>
                    </Grid>
                    <br />
                </>
            );
        });
    }
    else {
        contentPage.push(
            <Grid container justifyContent="space-between">
                <Grid item xs={12}>
                    <Illustration
                        color="secondary"
                        height="md"
                        internalName="no-activities"
                        text={resources.lblNoActivities}
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <>
            {courseTemplateSetup.assignmentTemplate.isRestrictive && showMessageDueDate ?
                (
                    <Grid container>
                        <Grid item md={12}>
                            <Alert
                                id="msgErrors"
                                open
                                text={resources.lblLegendDueDates}
                                type={ResultType.warning}
                            />
                        </Grid>
                    </Grid>
                )
                : undefined}
            {contentPage}
            <br />
            {activitiesSetup && activitiesSetup.assignmentTypes ?
                (
                    <>
                        <Grid container>
                            {isMidterm ?
                                (
                                    <Grid item>
                                        <Text>
                                            {Format.toString(resources.formatTotalMidtermPoints,
                                                [activitiesSetup.totalMidtermPoints])}
                                        </Text>
                                    </Grid>
                                )
                                : undefined}
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatTotalFinalPoints,
                                        [activitiesSetup.totalFinalPoints])}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs={12}>
                                <ButtonGroup>
                                    <Button
                                        disabled={isDisabledAll ? isDisabledAll : false}
                                        id="btnSave"
                                        onClick={onSaveActivities}
                                    >
                                        {resources.btnSave}
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </>
                )
                : undefined}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(CourseTemplatesActivities);