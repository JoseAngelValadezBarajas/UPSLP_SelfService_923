/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: FieldsHandle.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import FormControl, { FormControlLabel, FormGroup } from '@hedtech/powercampus-design-system/react/core/FormControl';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import List from '@hedtech/powercampus-design-system/react/core/List';
import Paragraph, { TextColor, TextSize } from '@hedtech/powercampus-design-system/react/core/Paragraph';
import RadioGroup from '@hedtech/powercampus-design-system/react/core/RadioGroup';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import TextLink from '@hedtech/powercampus-design-system/react/core/TextLink';

// Internal components
import { IApplicationHandler } from '../../../Types/Resources/Admissions/IApplicationFormResources';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IApplicationErrors } from '../../../Types/Applications/IApplicationErrors';
import { IApplicationIpeds } from '../../../Types/Applications/IApplicationIpeds';
import { IFieldForm } from '../../../Types/Form/IFieldForm';
// #endregion

// #region Internal types
export interface IFieldsHandlerProps {
    dateTimeCulture: string;
    errors: IApplicationErrors[];
    expandedPanelId: boolean | string;
    fields: IFieldForm[];
    governmentIdFormat: string;
    groupIndex: number;
    isExpansionPanel: boolean;
    isHorizontalAligned: boolean;
    shortDatePattern: string;
    stepIndex: number;

    resources: IApplicationHandler;

    onClickButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onChangeCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDateTimeField: (date: string, id: string, isValid: boolean) => void;
    onDeleteItem: (event: any) => void;
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeExpansionPanel: (label: string) => void;
    onChangeListCheckbox: (event: any) => void;
    onChangeRadioGroup: (event: React.ChangeEvent<any>, value: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const styles = createStyles({
    category: {
        marginBottom: Tokens.spacing30,
        marginLeft: Tokens.spacing50
    },
    federalCategory: {
        '& > span:nth-child(2)': {
            fontWeight: Tokens.fontWeightBold
        },
        marginBottom: Tokens.spacing30
    }
});

type PropsWithStyles = IFieldsHandlerProps & WithStyles<typeof styles> & WithWidth;
// #endregion

// #region Component
const FieldsHandler: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        dateTimeCulture,
        errors,
        expandedPanelId,
        fields,
        governmentIdFormat,
        groupIndex,
        isExpansionPanel,
        isHorizontalAligned,
        resources,
        shortDatePattern,
        stepIndex,
        width,

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

    const elements: JSX.Element[] = [];

    // General Sections Arrays
    let ids: string[] = [];
    const sectionIndexes: number[] = [];
    let sectionElements: JSX.Element[] = [];
    const sectionContainers: JSX.Element[] = [];
    let sectionIndex: number;

    // Header Arrays
    let headerDeleteElement: JSX.Element[] = [];
    let headerTitleElements: string[] = [];
    const firstHeaderTitleElement: string[] = [];

    const getId = (idStringArray: string[], index: number): number => Number(idStringArray[index]);

    const setHeaderTitleElements = (field: IFieldForm): void => {
        if (field.isExpansionPanelHeader) {
            if (field.value) {
                if (headerTitleElements[0] === resources.lblNew) {
                    headerTitleElements.splice(0, 1);
                }
                if (field.componentType && field.componentType === 'Dropdown') {
                    let selectedOption: number = 0;
                    if (field.data && field.data.options && field.data.options.length > 0) {
                        selectedOption =
                            field.data.options.findIndex(x => x.value === field.value);
                        if (selectedOption > -1) {
                            headerTitleElements.push(`${field.data.options[selectedOption].description} `);
                        }
                    }
                }
                else {
                    headerTitleElements.push(`${field.value} `);
                }
            }
            if (headerTitleElements.length === 0) {
                headerTitleElements.push(resources.lblNew);
            }
        }
    };

    const fillElements = (fieldElement: JSX.Element, field: IFieldForm): void => {
        if (isExpansionPanel && field.componentType === 'DeleteIconButton') {
            headerDeleteElement.push(fieldElement);
        }
        else {
            sectionElements.push(fieldElement);
        }
    };

    const setMultipleFields = (field: IFieldForm, fieldElement: JSX.Element, id: string) => {
        ids = field.data.id.split('|');
        sectionIndex = errors[getId(ids, 1)].groupErrors[getId(ids, 2)].sectionErrors.findIndex(
            section => section.sectionIndex === Number(getId(ids, 4))
        );
        // Verify if section exists
        if (sectionIndexes.includes(getId(ids, 4))) {
            setHeaderTitleElements(field);
            fillElements(fieldElement, field);
        }
        // Create a new section
        else {
            sectionElements = [];
            headerDeleteElement = [];
            headerTitleElements = [];

            setHeaderTitleElements(field);
            fillElements(fieldElement, field);
            sectionIndexes.push(getId(ids, 4));

            sectionContainers.push(
                isExpansionPanel ? (
                    <ExpansionPanel
                        applicationFormError={sectionIndex > -1 ?
                            errors[getId(ids, 1)].groupErrors[getId(ids, 2)].sectionErrors.length > 0 ?
                                errors[getId(ids, 1)].groupErrors[getId(ids, 2)].sectionErrors[sectionIndex].isSectionError
                                : false
                            : false}
                        background="gray"
                        expandIcon={<Icon name="edit" />}
                        expanded={expandedPanelId === `panel|${stepIndex}|${groupIndex}|${getId(ids, 4)}`}
                        header={(
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <Text
                                        color={errors[getId(ids, 1)].groupErrors[getId(ids, 2)].sectionErrors.length > 0 && sectionIndex > -1 ?
                                            errors[getId(ids, 1)].groupErrors[getId(ids, 2)].sectionErrors[sectionIndex].isSectionError ?
                                                'error' : undefined
                                            : undefined}
                                    >
                                        {headerTitleElements}
                                    </Text>
                                </Grid>
                                <Grid item>
                                    {headerDeleteElement}
                                </Grid>
                            </Grid>
                        )}
                        key={`expansionPanel|${field.data.id}|${id}`}
                        onChange={onChangeExpansionPanel(`panel|${stepIndex}|${groupIndex}|${getId(ids, 4)}`)}
                    >
                        <Grid
                            container
                            direction="column"
                            key={`container|${field.data.id}|${id}`}
                        >
                            {sectionElements}
                        </Grid>
                    </ExpansionPanel>
                ) : (
                    <React.Fragment key={`fragment|${field.data.id}|${id}`}>
                        <Grid
                            alignItems={isHorizontalAligned && isWidthUp('sm', width) ? 'center' : 'stretch'}
                            container
                            direction={isHorizontalAligned && isWidthUp('sm', width) ? 'row' : 'column'}
                            key={`container|${field.data.id}|${id}`}
                        >
                            {sectionElements}
                        </Grid>
                    </React.Fragment >
                )
            );
        }
    };
    if (errors) {
        if (errors[stepIndex].groupErrors[groupIndex].groupId === 'addressInformationGroup') {
            firstHeaderTitleElement.push(`${resources.lblPrimary} `);
        }
    }

    fields.forEach((field, j) => {
        let fieldElement: JSX.Element | undefined;

        let id: string;
        if (field.data.modified) {
            id = `${field.data.id}`;
        }
        else {
            id = `${field.data.id}|${stepIndex}|${groupIndex}|${j}`;
        }

        let fieldSize: false | 'auto' | true | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
        switch (field.gridSize) {
            case 'XS':
                fieldSize = 2;
                break;
            case 'S':
                fieldSize = 3;
                break;
            case 'M':
                fieldSize = 4;
                break;
            case 'L':
                fieldSize = 6;
                break;
            case 'XL':
                fieldSize = 12;
                break;
            default:
                fieldSize = 12;
        }

        switch (field.componentType) {
            case 'Button':
                fieldSize = isHorizontalAligned ? 3 : fieldSize;
                fieldElement = (
                    <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                        <Button
                            id={id}
                            onClick={onClickButton}
                        >
                            {field.data.label}
                        </Button>
                    </Grid>
                );
                break;
            case 'TextField':
                if (id.substr(0, 'postalCodeId'.length) === 'postalCodeId' ||
                    id.substr(0, 'educationEtsCodeId'.length) === 'educationEtsCodeId') {
                    let buttonId: string = '';
                    let isPostalCode: boolean = false;
                    if (field.data.modified) {
                        if (id.substr(0, 'postalCodeId'.length) === 'postalCodeId') {
                            buttonId = id.replace('postalCodeId', 'postalCodeButtonId');
                        }
                        if (id.substr(0, 'educationEtsCodeId'.length) === 'educationEtsCodeId') {
                            buttonId = id.replace('educationEtsCodeId', 'educationEtsCodeButtonId');
                        }
                    }
                    else {
                        if (id.substr(0, 'postalCodeId'.length) === 'postalCodeId') {
                            buttonId = `postalCodeButtonId|${stepIndex}|${groupIndex}|${j + 1}`;
                            isPostalCode = true;
                        }
                        if (id.substr(0, 'educationEtsCodeId'.length) === 'educationEtsCodeId') {
                            buttonId = `educationEtsCodeButtonId|${stepIndex}|${groupIndex}|${j + 1}`;
                        }
                    }

                    fieldElement = (
                        <Grid item xs>
                            <Grid
                                alignItems={'center'}
                                container
                                direction={'row'}
                            >
                                <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                                    <TextField
                                        error={field.data.error}
                                        helperText={field.data.helperText}
                                        id={id}
                                        label={field.data.label}
                                        required={field.isRequired}
                                        value={field.value ? String(field.value) : ''}
                                        onChange={onChangeTextField}
                                        maxCharacters={isPostalCode ? 15 : undefined}
                                    />
                                </Grid>
                                <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                                    <Button
                                        id={buttonId}
                                        onClick={onClickButton}
                                    >
                                        {resources.lblSearch}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                }
                else {
                    let format: string | undefined;
                    if (id.substr(0, 'governmentId'.length) === 'governmentId' && governmentIdFormat) {
                        format = governmentIdFormat;
                    }

                    fieldElement = (
                        <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                            <TextField
                                error={field.data.error}
                                format={format}
                                helperText={field.data.helperText}
                                id={id}
                                label={field.data.label}
                                placeholder={format}
                                required={field.isRequired}
                                value={field.value ? String(field.value) : ''}
                                onChange={onChangeTextField}
                            />
                        </Grid>
                    );
                }
                break;

            case 'Dropdown':
                const emptyOption: IDropDownOption = {
                    description: String(resources.lblSelect),
                    value: ''
                };
                let exist: boolean = false;
                if (field.default && field.data.options) {
                    field.data.options.forEach(option => {
                        if (option.value.toString() === field.default.toString()) {
                            exist = true;
                        }
                    });
                }
                fieldElement = (
                    <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                        <Dropdown
                            error={field.data.error}
                            emptyOption={emptyOption}
                            helperText={field.data.helperText}
                            id={id}
                            label={field.data.label ? field.data.label : ''}
                            // TO DO: Verify multiple selection for dropdown
                            multiple={field.data.allowMultipleSelection}
                            options={field.data.options}
                            required={field.isRequired}
                            value={field.value ? field.value :
                                exist ? field.default : ''}
                            onChange={onChangeDropDown}
                        />
                    </Grid>
                );
                break;

            case 'Checkbox':
                let checked: boolean = false;
                if (field.value !== undefined) {
                    checked = field.value;
                }
                fieldElement = (
                    <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                        <Checkbox
                            checked={checked}
                            error={field.data.error}
                            helperText={field.data.helperText}
                            id={id}
                            label={field.data.label}
                            onChange={onChangeCheckBox}
                        />
                    </Grid>
                );
                break;

            case 'DatePicker':
                fieldElement = (
                    <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                        <DatePicker
                            id={id}
                            culture={dateTimeCulture}
                            format={shortDatePattern}
                            error={field.data.error}
                            helperText={field.data.helperText}
                            label={field.data.label}
                            required={field.isRequired}
                            value={field.value}
                            onChange={onChangeDateTimeField}
                        />
                    </Grid>
                );
                break;

            case 'DeleteIconButton':
                fieldSize = isHorizontalAligned ? 1 : fieldSize;
                const idDelete: string = field.data.id;
                fieldElement = (
                    <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                        <IconButton
                            id={idDelete}
                            title={resources.btnDelete}
                            onClick={field.onClick ? field.onClick : onDeleteItem}
                        >
                            <Icon name="trash" />
                        </IconButton>
                    </Grid>
                );
                break;

            case 'CheckboxList':
                let messageRequired: JSX.Element | undefined;
                if (field.data.error && field.isRequired) {
                    messageRequired = (
                        <Text size="large" color="error">
                            {field.data.helperText}
                        </Text>
                    );
                }
                else {
                    messageRequired = undefined;
                }
                const chkElements: JSX.Element[] = [];
                let isCheck: boolean;
                if (field.data.options) {
                    field.data.options.forEach((option, i) => {
                        isCheck = false;
                        if (field.value) {
                            const array: string[] = Object.values(field.value.split(','));
                            if (field.value && array.length > 0) {
                                const index: number = array.findIndex(x => x === option.value.toString());
                                if (index > -1) {
                                    isCheck = true;
                                }
                            }
                        }
                        chkElements.push(
                            <FormControlLabel
                                classes={{ root: classes.category }}
                                control={
                                    (
                                        <Checkbox
                                            checked={isCheck}
                                            id={`${id}|${option.value}`}
                                            onChange={onChangeListCheckbox}
                                        />
                                    )
                                }
                                label={option.description}
                                key={`${field.data.id}|list|${i}`}
                            />
                        );
                    });
                }
                fieldElement = (
                    <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                        {messageRequired}
                        {field.data.label ? (
                            <Text size="large">
                                {field.isRequired ? `${field.data.label} *` : `${field.data.label}`}
                            </Text>
                        ) : undefined}
                        <FormControl component="fieldset">
                            <FormGroup>
                                {chkElements}
                            </FormGroup>
                        </FormControl>
                    </Grid>
                );
                break;

            case 'Text':
                const errorColor: TextColor | undefined = field.data.error ? 'error' : undefined;
                let colorText: TextColor | undefined;
                if (!errorColor) {
                    colorText = field.color ? field.color : undefined;
                }
                else {
                    colorText = errorColor;
                }
                const size: TextSize | undefined = field.size;

                if (!field.isWithLink) {
                    fieldElement = (
                        <Grid item xs={12} key={`item|${field.data.id}|${id}`}>
                            <Text
                                color={colorText}
                                id={id}
                                size={size === 'h4' ? 'large' : size}
                            >
                                {field.data.label}
                            </Text>
                        </Grid>
                    );
                }
                else {
                    if (field.actionUrl && field.data.label) {
                        const actions: string[] = field.actionUrl.split('|');
                        fieldElement = (
                            <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                                <Paragraph
                                    color={colorText}
                                    id={id}
                                    size={size === 'h4' ? 'large' : size}
                                    text={field.data.label}
                                    events={
                                        actions.map(action => {
                                            if (action.substr(0, 'mailto:'.length) === 'mailto:' ||
                                                action.substr(0, 'tel:'.length) === 'tel:') {
                                                return ((_event: React.MouseEvent<HTMLAnchorElement>) => {
                                                    window.location.href = `${action}`;
                                                });
                                            }
                                            else {
                                                return ((_event: React.MouseEvent<HTMLAnchorElement>) => {
                                                    window.open(`${action}`, '_blank');
                                                });
                                            }
                                        })
                                    }
                                />
                            </Grid>
                        );
                    }
                }
                break;

            case 'RadioGroup':
                const options: IDropDownOption[] = [];
                fieldElement = (
                    <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                        <Text size="large" id={`text|${j}`}>
                            {field.data.label}
                        </Text>
                        <RadioGroup
                            id={id}
                            name={id}
                            options={field.data.options ? field.data.options : options}
                            value={field.value}
                            onChange={field.onClick ? field.onClick : onChangeRadioGroup}
                        />
                    </Grid>
                );
                break;

            case 'NestedCheckboxList':
                const array: IApplicationIpeds[] = [];
                if (field.value) {
                    const ipedsArray = field.value.split(',');
                    ipedsArray.forEach(iped => {
                        const ipedItem = iped.split('$');
                        if (ipedItem[0] !== '') {
                            if (ipedItem.length > 1) {
                                array.push({
                                    ipedsEthnicityId: ipedItem[1],
                                    ipedsFederalCategoryId: ipedItem[0]
                                });
                            }
                            else {
                                array.push({
                                    ipedsFederalCategoryId: ipedItem[0]
                                });
                            }
                        }
                    });
                }
                let errorMessage: JSX.Element | undefined;
                if (field.data.error) {
                    errorMessage = (
                        <Text size="large" color="error">
                            {field.data.helperText}
                        </Text>
                    );
                }
                else {
                    errorMessage = undefined;
                }
                const elementsList: JSX.Element[] = [];
                if (field.data.complexOptions && field.data.complexOptions.length > 0) {
                    field.data.complexOptions.forEach(complexItem => {
                        const elements: JSX.Element[] = [];
                        if (complexItem.options && complexItem.options.length > 0) {
                            complexItem.options.forEach(item => {
                                let childIsChecked: boolean = false;
                                if (array.length > 0) {
                                    let index: number = -1;
                                    index =
                                        array.findIndex(x =>
                                            (x.ipedsEthnicityId ?
                                                x.ipedsEthnicityId.toString() : '') === item.value.toString() &&
                                            x.ipedsFederalCategoryId.toString() === complexItem.value.toString());
                                    if (index > -1) {
                                        childIsChecked = true;
                                    }
                                }
                                elements.push(
                                    <FormControlLabel
                                        classes={{ root: classes.category }}
                                        control={
                                            (
                                                <Checkbox
                                                    checked={childIsChecked}
                                                    id={`child|${id}|${j}|${complexItem.value}|${item.value}`}
                                                    onChange={onChangeListCheckbox}
                                                />
                                            )
                                        }
                                        label={item.description}
                                    />
                                );
                            });
                        }
                        let parentIsChecked: boolean = false;
                        if (array.length > 0) {
                            let index: number = -1;
                            index =
                                array.findIndex(x =>
                                    (x.ipedsFederalCategoryId ?
                                        x.ipedsFederalCategoryId.toString() : '') === complexItem.value.toString());
                            if (index > -1) {
                                parentIsChecked = true;
                            }
                        }
                        elementsList.push(
                            <>
                                <FormControlLabel
                                    classes={{ root: classes.federalCategory }}
                                    control={
                                        (
                                            <Checkbox
                                                checked={parentIsChecked}
                                                id={`parent|${id}|${j}|${complexItem.value}`}
                                                onChange={onChangeListCheckbox}
                                            />
                                        )
                                    }
                                    label={complexItem.description}
                                />
                                {elements}
                            </>
                        );
                    });
                }
                fieldElement = (
                    <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                        {field.data.label ? (
                            <Text size="large">
                                {field.isRequired ? `${field.data.label} *` : `${field.data.label}`}
                            </Text>
                        ) : undefined}
                        <List id={`${id}`} >
                            {errorMessage}
                            <FormControl component="fieldset">
                                <FormGroup>
                                    {elementsList}
                                </FormGroup>
                            </FormControl>
                        </List>
                    </Grid>
                );
                break;
            case 'Link':
                if (field.data.label) {
                    fieldElement = (
                        <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                            <TextLink
                                href={field.actionUrl}
                                id="lnkDataLabel"
                            >
                                {field.data.label}
                            </TextLink>
                        </Grid>
                    );
                }
                break;
            case 'IconLinkEmail':
                if (field.data.label) {
                    fieldElement = (
                        <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                            <Button
                                IconProps={{
                                    name: 'email'
                                }}
                                id={`email|${field.data.id}|${id}`}
                                align="left"
                                textVariantStyling="inherit"
                                variant="text"
                                onClick={() => { if (field.actionUrl) { window.location.href = field.actionUrl } }}
                            >
                                {field.data.label}
                            </Button>
                        </Grid>
                    );
                }
                break;
            case 'IconLinkPhone':
                if (field.data.label) {
                    fieldElement = (
                        <Grid item xs md={fieldSize} key={`item|${field.data.id}|${id}`}>
                            <Button
                                IconProps={{
                                    name: 'phone'
                                }}
                                id={`phone|${field.data.id}|${id}`}
                                align="left"
                                textVariantStyling="inherit"
                                variant="text"
                                onClick={() => { if (field.actionUrl) { window.location.href = field.actionUrl } }}
                            >
                                {field.data.label}
                            </Button>
                        </Grid>
                    );
                }
                break;
            case 'Divider':
                fieldElement = (
                    <Grid item xs={12} md={12}>
                        <hr />
                    </Grid>
                );
                break;
            case 'Image':
                fieldElement = (
                    <Grid item xs md={fieldSize}>
                        <img
                            src={field.src}
                            alt={field.alt}
                        />
                    </Grid>
                );
                break;
            case 'HtmlElement':
                fieldElement = (
                    <Grid item xs md={fieldSize}>
                        <Text
                            color={colorText}
                            id={id}
                            size={size === 'h4' ? 'large' : size}
                        >
                            <div dangerouslySetInnerHTML={{ __html: field.value }} />
                        </Text>
                    </Grid>
                );
                break;
        }

        /* Determines the expansion panel header
         * for the first element of a group */
        if (field.isExpansionPanelHeader && field.value) {
            if (!field.data.modified) {
                if (field.componentType && field.componentType === 'Dropdown') {
                    let selectedOption: number = 0;
                    if (field.data && field.data.options && field.data.options.length > 0) {
                        selectedOption =
                            field.data.options.findIndex(x => x.value === field.value);
                        if (selectedOption > -1) {
                            firstHeaderTitleElement.push(`${field.data.options[selectedOption].description} `);
                        }
                    }
                }
                else {
                    firstHeaderTitleElement.push(`${field.value} `);
                }
            }
        }

        /* Determines if the element is copied */
        if (fieldElement) {
            if (field.data.modified) {
                setMultipleFields(field, fieldElement, id);
            }
            else {
                elements.push(fieldElement);
            }
        }
    });

    return (
        isExpansionPanel && sectionContainers.length > 0 ? (
            <>
                <ExpansionPanel
                    applicationFormError={errors[stepIndex].groupErrors[groupIndex].firstSectionErrors.isFirstSectionErrors}
                    background="gray"
                    expanded={expandedPanelId === `panel|${stepIndex}|${groupIndex}`}
                    expandIcon={<Icon name="edit" />}
                    header={(
                        <Text
                            color={errors[stepIndex].groupErrors[groupIndex].firstSectionErrors.isFirstSectionErrors ? 'error' : undefined}
                        >
                            {firstHeaderTitleElement.length > 0 ? firstHeaderTitleElement : resources.lblNew}
                        </Text>
                    )}
                    onChange={onChangeExpansionPanel(`panel|${stepIndex}|${groupIndex}`)}
                >
                    <Grid
                        container
                        direction="column"
                    >
                        {elements}
                    </Grid>
                </ExpansionPanel>
                {sectionContainers}
            </>
        ) : (
            <>
                <Grid
                    alignItems={isHorizontalAligned && isWidthUp('sm', width) ? 'center' : 'stretch'}
                    container
                    direction={isHorizontalAligned && isWidthUp('sm', width) ? 'row' : 'column'}
                >
                    {elements}
                </Grid>
                {sectionContainers}
            </>

        ));
};
// #endregion

// Export: Component
export default withStyles(styles)(withWidth()(FieldsHandler));