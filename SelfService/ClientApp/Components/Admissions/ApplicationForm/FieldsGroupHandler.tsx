/* Copyright 2019 Ellucian Company L.P. and its affiliates.
* File: FieldsGroupHandler.tsx
* Type: Presentation component */

// #region Imports
import React from 'react';

// Internal components
import { IApplicationHandler } from '../../../Types/Resources/Admissions/IApplicationFormResources';
import FieldsHandler from './FieldsHandler';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IApplicationErrors } from '../../../Types/Applications/IApplicationErrors';
import { IFieldsGroup } from '../../../Types/Form/IFieldsGroup';
// #endregion

// #region Internal types
export interface IFieldsGroupHandlerProps {
    dateTimeCulture: string;
    errors: IApplicationErrors[];
    expanded: boolean | string;
    fieldGroup: IFieldsGroup;
    fieldGroupIndex: number;
    firstDayOfWeek: number;
    governmentIdFormat: string;
    isExpansionPanel: boolean;
    isHorizontalAligned: boolean;
    shortDatePattern: string;
    stepIndex: number;

    resources: IApplicationHandler;

    onAddMore: (fieldGroup: IFieldsGroup, stepIndex: number, fieldGroupIndex: number) => void;
    onChangeCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDateTimeField: (date: string, id: string, isValid: boolean) => void;
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeExpansionPanel: (label: string) => void;
    onChangeListCheckbox: (event: any) => void;
    onChangeRadioGroup: (event: React.ChangeEvent<any>, value: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onDeleteItem: (event: any) => void;
}

const styles = (() => createStyles({
    buttonTop: {
        marginTop: Tokens.spacing30
    },
    groupTitleBottom: {
        marginBottom: 0
    }
}));

type PropsWithStyles = IFieldsGroupHandlerProps & WithStyles<typeof styles>;

// #endregion

// #region Component
const FieldsGroupHandler: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        dateTimeCulture,
        errors,
        expanded,
        fieldGroup,
        fieldGroupIndex,
        firstDayOfWeek,
        governmentIdFormat,
        isExpansionPanel,
        isHorizontalAligned,
        shortDatePattern,
        stepIndex,
        resources,

        onAddMore,
        onChangeCheckBox,
        onChangeDropDown,
        onChangeDateTimeField,
        onChangeExpansionPanel,
        onChangeListCheckbox,
        onChangeRadioGroup,
        onChangeTextField,
        onClickButton,
        onDeleteItem
    } = props;

    const isDisabled: boolean = fieldGroup.isDisableButton ? fieldGroup.isDisableButton : false;

    const content: JSX.Element[] = [];
    /* Field Id will be created in this way:
     * fieldId_sectionIndex_fieldIndex_positionInCollection
     * */
    const addMore = () => onAddMore(fieldGroup, stepIndex, fieldGroupIndex);
    if (fieldGroup.isMultiple) {
        content.push(
            <Text
                color="error"
                id={`textError|${fieldGroup.id}|text`}
                key={`textError|${fieldGroup.id}|text`}
                size="large"
            >
                <span id={`textError|${fieldGroup.id}`} />
            </Text>
        );
    }
    let labelElement: JSX.Element | undefined;
    if (fieldGroup.label) {
        labelElement = (
            <Text size="large">
                {fieldGroup.label}
            </Text>
        );
    }
    let instructionsElement: JSX.Element | undefined;
    if (fieldGroup.instructions) {
        instructionsElement = (
            <Text>
                {fieldGroup.instructions}
            </Text>
        );
    }

    content.push(
        <React.Fragment key={`${fieldGroup.id}`}>
            {(fieldGroup.label !== '' || fieldGroup.instructions) &&
                fieldGroup.id !== 'confirmationGroup' ?
                (
                    <Grid container className={classes.groupTitleBottom}>
                        <Grid item xs={12}>
                            {labelElement}
                            {instructionsElement}
                        </Grid>
                    </Grid>
                ) : undefined}
            <FieldsHandler
                dateTimeCulture={dateTimeCulture}
                errors={errors}
                expandedPanelId={expanded}
                fields={fieldGroup.fields}
                firstDayOfWeek={firstDayOfWeek}
                governmentIdFormat={governmentIdFormat}
                groupIndex={fieldGroupIndex}
                isExpansionPanel={isExpansionPanel}
                isHorizontalAligned={isHorizontalAligned}
                key={`field|${fieldGroupIndex}|${stepIndex}`}
                shortDatePattern={shortDatePattern}
                stepIndex={stepIndex}
                resources={resources}
                onChangeCheckBox={onChangeCheckBox}
                onChangeDropDown={onChangeDropDown}
                onChangeDateTimeField={onChangeDateTimeField}
                onChangeExpansionPanel={onChangeExpansionPanel}
                onChangeListCheckbox={onChangeListCheckbox}
                onChangeRadioGroup={onChangeRadioGroup}
                onChangeTextField={onChangeTextField}
                onClickButton={onClickButton}
                onDeleteItem={onDeleteItem}
            />
        </React.Fragment>
    );

    if (fieldGroup.isMultiple && Number(fieldGroup.maximumAllowed) !== 1) {
        content.push(
            <Grid container key={`${fieldGroup.id}|addButton`}>
                <Grid item xs>
                    <Button
                        IconProps={{
                            name: 'add'
                        }}
                        color="secondary"
                        className={classes.buttonTop}
                        disabled={isDisabled}
                        id={`btnAddMore|${fieldGroup.id}`}
                        onClick={addMore}
                    >
                        {resources.lblAddNew}
                    </Button>
                    <br />
                </Grid>
            </Grid>
        );
    }

    return (
        <>
            {content}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(FieldsGroupHandler);