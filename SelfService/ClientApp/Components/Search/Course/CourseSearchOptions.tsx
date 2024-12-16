/* Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
 * File: CourseSearchOptions.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// #endregion Imports

// #region Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ICourseSearchOptionsResources } from '../../../Types/Resources/Search/ICourseResources';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion Types
export interface ICourseSearchOptionsProps {
    availableClassLevel: IDropDownOption[];
    availableColleges: IDropDownOption[];
    availableCreditType: IDropDownOption[];
    availableCurriculum: IDropDownOption[];
    availableDepartment: IDropDownOption[];
    availableProgram: IDropDownOption[];
    availablePopulation: IDropDownOption[];
    availableSubtype: IDropDownOption[];
    availableNonTraditional: IDropDownOption[];
    courseCode?: string;
    resources: ICourseSearchOptionsResources;
    selectedClassLevel?: string | number;
    selectedCollege?: string | number;
    selectedCreditType?: string | number;
    selectedCurriculum?: string | number;
    selectedDepartment?: string | number;
    selectedProgram?: string | number;
    selectedPopulation?: string | number;
    selectedSubtype?: string | number;
    selectedNonTraditional?: string | number;
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: any) => void;
    onClearCourseCode: () => void;
    onClearSearch: () => void;
    onShareSearch: () => void;
    onSearch: () => void;
}

const styles = createStyles({
    container: {
        justifyContent: 'flex-end'
    },
    inline: {
        display: 'inline'
    },
    marginLeft: {
        display: 'inline',
        marginLeft: Tokens.sizingSmall
    }
});

type PropsWithStyles = ICourseSearchOptionsProps & WithStyles<typeof styles>;

// #region Component
const CourseSearchOptions: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        availableClassLevel,
        availableColleges,
        availableCreditType,
        availableCurriculum,
        availableDepartment,
        availableProgram,
        availablePopulation,
        availableSubtype,
        availableNonTraditional,
        classes,
        courseCode,
        selectedClassLevel,
        selectedCollege,
        selectedCreditType,
        selectedCurriculum,
        selectedDepartment,
        selectedProgram,
        selectedPopulation,
        selectedSubtype,
        selectedNonTraditional,

        // events
        onChangeDropDown,
        onChangeTextField,
        onClearCourseCode,
        onShareSearch,
        onClearSearch,
        onSearch,

        resources
    } = props;

    const header: JSX.Element = (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Text size="h3">
                    {resources.lblFilters}
                </Text>
            </Grid>
        </Grid>
    );

    const emptyOption: IDropDownOption = {
        description: String(resources.lblSelect),
        value: ''
    };

    const content: JSX.Element = (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Search
                        id="txtCourseCode"
                        placeholder={resources.lblCourseCode}
                        value={courseCode || ''}
                        onChange={onChangeTextField}
                        onClear={onClearCourseCode}
                        onSearchInvoked={onSearch}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlProgram"
                        label={resources.lblProgram}
                        options={availableProgram}
                        value={selectedProgram || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlCurriculum"
                        label={resources.lblCurriculum}
                        options={availableCurriculum}
                        value={selectedCurriculum || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlSubtype"
                        label={resources.lblSubtype}
                        options={availableSubtype}
                        value={selectedSubtype || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlCreditType"
                        label={resources.lblCreditType}
                        options={availableCreditType}
                        value={selectedCreditType || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlClassLevel"
                        label={resources.lblClassLevel}
                        options={availableClassLevel}
                        value={selectedClassLevel || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlCollege"
                        label={resources.lblCollege}
                        options={availableColleges}
                        value={selectedCollege || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlDepartment"
                        label={resources.lblDepartment}
                        options={availableDepartment}
                        value={selectedDepartment || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlPopulation"
                        label={resources.lblPopulation}
                        options={availablePopulation}
                        value={selectedPopulation || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlNonTraditional"
                        label={resources.lblNonTraditional}
                        options={availableNonTraditional}
                        value={selectedNonTraditional || ''}
                        onChange={onChangeDropDown}
                    />
                </Grid>
            </Grid>
            <Grid
                alignItems="flex-end"
                container
                direction="column"
                justifyContent="flex-end"
                spacing={3}
            >
                <Grid item xs={12} md={12}>
                    <Button
                        align="left"
                        id="btnClearSearch"
                        textVariantStyling="inherit"
                        variant="text"
                        onClick={onClearSearch}
                    >
                        {resources.lblClearAll}
                    </Button>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Button
                        className={classes.inline}
                        color="secondary"
                        fluid
                        id="btnShareSearch"
                        onClick={onShareSearch}
                    >
                        <Icon name="share" />
                        <div className={classes.marginLeft}>
                            {resources.lblShareSearch}
                        </div>
                    </Button>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Button
                        fluid
                        id={'btnSearch'}
                        onClick={onSearch}
                    >
                        {resources.btnSearch}
                    </Button>
                </Grid>
            </Grid>
        </>
    );

    return (
        <Media query={Tokens.mqSmallDown}>
            {(matches: boolean): JSX.Element => matches ? (
                <ExpansionPanel
                    defaultExpanded={false}
                    header={header}
                >
                    {content}
                </ExpansionPanel>
            ) : (
                    <ExpansionPanel
                        defaultExpanded={true}
                        header={header}
                    >
                        {content}
                    </ExpansionPanel>
                )
            }
        </Media>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(CourseSearchOptions);