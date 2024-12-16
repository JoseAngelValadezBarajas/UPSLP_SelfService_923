/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AdvancedSearchModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAdvancedSearch } from '../../../Types/Section/IAdvancedSearch';
import { ISectionSearchOption } from '../../../Types/Section/ISectionSearchOption';
// #endregion

// #region Internal types
export interface IAdvancedSearchModalProps {
    advancedSearchSelected?: IAdvancedSearch;
    data: ISectionSearchOption;
    dateTimeCulture: string;
    isConEd: boolean;
    isLoadingSectionSearch?: boolean;
    noDefaultPeriod?: boolean;
    open: boolean;
    resources: IAdvancedSearchOptionModalResProps;
    shortDatePattern: string;
    onClear: () => void;
    onClose: () => void;
    onDateTimeChange?: (date: string, id: string, isValid: boolean) => void;
    onDropdownChange: (optionSelected: IDropDownOption, id: string) => void;
    onSearch: () => void;
    onTextFieldChange: (event: any) => void;
}

export interface IAdvancedSearchOptionModalResProps {
    btnClear: string;
    btnSearch: string;
    lblAdvancedSearch: string;
    lblAdvancedSearchSubTitle: string;
    lblCampus: string;
    lblClassLevel: string;
    lblClosed: string;
    lblCollege: string;
    lblCourse: string;
    lblCourseDetails: string;
    lblCourseType: string;
    lblCreditType: string;
    lblCurriculum: string;
    lblDepartment: string;
    lblDropDownEmptyText: string;
    lblEndsBy: string;
    lblGeneralEducation: string;
    lblInstructor: string;
    lblKeyword: string;
    lblMeeting: string;
    lblNonTraditionalPrograms: string;
    lblOpen: string;
    lblPeriod: string;
    lblPopulation: string;
    lblProgram: string;
    lblRegistrationType: string;
    lblSession: string;
    lblStartsFrom: string;
    lblStatus: string;
    lblSubtype: string;
    lblTimeLocation: string;
    lblWaitlist: string;
}
// #endregion

// #region Component
const AdvancedSearchModal: React.FC<IAdvancedSearchModalProps> = (props: IAdvancedSearchModalProps): JSX.Element => {
    const {
        advancedSearchSelected,
        data,
        dateTimeCulture,
        isConEd,
        isLoadingSectionSearch,
        noDefaultPeriod,
        open,
        resources,
        shortDatePattern,
        onClear,
        onClose,
        onDateTimeChange,
        onDropdownChange,
        onSearch,
        onTextFieldChange
    } = props;

    const emptyOption: IDropDownOption = {
        description: resources.lblDropDownEmptyText,
        value: ''
    };

    let sectionNoConEd: JSX.Element | undefined;
    if (!isConEd) {
        sectionNoConEd = (
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={noDefaultPeriod ? emptyOption : undefined}
                        id="ddlPeriod_AdvancedSearchModal"
                        label={resources.lblPeriod}
                        options={data.periods}
                        value={advancedSearchSelected ? advancedSearchSelected.period : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlSession_AdvancedSearchModal"
                        label={resources.lblSession}
                        options={data.sessions}
                        value={advancedSearchSelected ? advancedSearchSelected.session : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <Modal
            disableHeaderTypography
            id="advancedSearchModal"
            header={(
                <>
                    <Text gutterBottom size="h2">
                        {resources.lblAdvancedSearch}
                    </Text>
                    <Text size="large">
                        {resources.lblAdvancedSearchSubTitle}
                    </Text>
                </>
            )}
            footer={(
                <ButtonGroup id="btgAdvancedSearch">
                    <Button
                        disabled={Boolean(isLoadingSectionSearch)}
                        id="btnClear_AdvancedSearchModal"
                        color="secondary"
                        onClick={onClear}
                    >
                        {resources.btnClear}
                    </Button>
                    <Button
                        id="btnSearch_AdvancedSearchModal"
                        IconProps={{
                            name: 'search'
                        }}
                        loading={Boolean(isLoadingSectionSearch)}
                        onClick={onSearch}
                    >
                        {resources.btnSearch}
                    </Button>
                </ButtonGroup>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <TextField
                        disabled={Boolean(isLoadingSectionSearch)}
                        id="txtKeywords_AdvancedSearchModal"
                        label={resources.lblKeyword}
                        type="text"
                        value={advancedSearchSelected ? advancedSearchSelected.keywords : undefined}
                        onChange={onTextFieldChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        disabled={Boolean(isLoadingSectionSearch)}
                        id="txtEventId_AdvancedSearchModal"
                        label={resources.lblCourse}
                        type="text"
                        value={advancedSearchSelected ? advancedSearchSelected.eventId : undefined}
                        onChange={onTextFieldChange}
                    />
                </Grid>
            </Grid>
            {sectionNoConEd}
            <Grid container>
                <Grid item xs={12}>
                    <Text size="h3">
                        {resources.lblTimeLocation}
                    </Text>
                    <Divider noMarginBottom />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        culture={dateTimeCulture}
                        disabled={Boolean(isLoadingSectionSearch)}
                        format={shortDatePattern}
                        id="dtpStartDate_AdvancedSearchModal"
                        label={resources.lblStartsFrom}
                        value={advancedSearchSelected ? advancedSearchSelected.startDate : undefined}
                        onChange={onDateTimeChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        culture={dateTimeCulture}
                        disabled={Boolean(isLoadingSectionSearch)}
                        format={shortDatePattern}
                        id="dtpEndDate_AdvancedSearchModal"
                        label={resources.lblEndsBy}
                        value={advancedSearchSelected ? advancedSearchSelected.endDate : undefined}
                        onChange={onDateTimeChange}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlStartTime_AdvancedSearchModal"
                        label={resources.lblStartsFrom}
                        options={data.hours}
                        value={advancedSearchSelected ? advancedSearchSelected.startTime : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlEndTime_AdvancedSearchModal"
                        label={resources.lblEndsBy}
                        options={data.hours}
                        value={advancedSearchSelected ? advancedSearchSelected.endTime : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlMeeting_AdvancedSearchModal"
                        label={resources.lblMeeting}
                        options={data.meetings}
                        value={advancedSearchSelected ? advancedSearchSelected.meeting : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlCampusId_AdvancedSearchModal"
                        label={resources.lblCampus}
                        options={data.campus}
                        value={advancedSearchSelected ? advancedSearchSelected.campusId : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <Text size="h3">
                        {resources.lblCourseDetails}
                    </Text>
                    <Divider noMarginBottom />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlStatus_AdvancedSearchModal"
                        label={resources.lblStatus}
                        options={data.status}
                        value={advancedSearchSelected ? advancedSearchSelected.status : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlEventSubType_AdvancedSearchModal"
                        label={resources.lblSubtype}
                        options={data.subTypes}
                        value={advancedSearchSelected ? advancedSearchSelected.eventSubType : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlCreditType_AdvancedSearchModal"
                        label={resources.lblCreditType}
                        options={data.creditTypes}
                        value={advancedSearchSelected ? advancedSearchSelected.creditType : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlInstructorId_AdvancedSearchModal"
                        label={resources.lblInstructor}
                        options={data.instructors}
                        value={advancedSearchSelected ? advancedSearchSelected.instructorId : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlProgram_AdvancedSearchModal"
                        label={resources.lblProgram}
                        options={data.programs}
                        value={advancedSearchSelected ? advancedSearchSelected.program : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlClassLevel_AdvancedSearchModal"
                        label={resources.lblClassLevel}
                        options={data.classLevels}
                        value={advancedSearchSelected ? advancedSearchSelected.classLevel : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlDepartment_AdvancedSearchModal"
                        label={resources.lblDepartment}
                        options={data.departments}
                        value={advancedSearchSelected ? advancedSearchSelected.department : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlPopulation_AdvancedSearchModal"
                        label={resources.lblPopulation}
                        options={data.populations}
                        value={advancedSearchSelected ? advancedSearchSelected.population : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlCollege_AdvancedSearchModal"
                        label={resources.lblCollege}
                        options={data.colleges}
                        value={advancedSearchSelected ? advancedSearchSelected.college : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlNonTradProgram_AdvancedSearchModal"
                        label={resources.lblNonTraditionalPrograms}
                        options={data.nontraditionalPrograms}
                        value={advancedSearchSelected ? advancedSearchSelected.nonTradProgram : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlCurriculum_AdvancedSearchModal"
                        label={resources.lblCurriculum}
                        options={data.curriculums}
                        value={advancedSearchSelected ? advancedSearchSelected.curriculum : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlGeneralEd_AdvancedSearchModal"
                        label={resources.lblGeneralEducation}
                        options={data.generalEducationList}
                        value={advancedSearchSelected ? advancedSearchSelected.generalEd : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Dropdown
                        disabled={Boolean(isLoadingSectionSearch)}
                        emptyOption={emptyOption}
                        id="ddlEventType_AdvancedSearchModal"
                        label={resources.lblCourseType}
                        options={data.eventTypes}
                        value={advancedSearchSelected ? advancedSearchSelected.eventType : undefined}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion

// Export: Component
export default AdvancedSearchModal;