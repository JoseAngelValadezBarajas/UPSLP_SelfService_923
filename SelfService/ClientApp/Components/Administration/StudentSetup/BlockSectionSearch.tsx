/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: BlockSectionSearch.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Chip from '@hedtech/powercampus-design-system/react/core/Chip';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Internal components
import BlockSections, { IBlockSectionsResProps } from './BlockSections';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ISectionsList } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { IAdvancedSearch } from '../../../Types/Section/IAdvancedSearch';
import { ISectionSearchOption } from '../../../Types/Section/ISectionSearchOption';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IBlockSectionSearchProps {
    addedSectionsIds: number[];
    dirtySearch: boolean;
    isLoadingOptions: boolean;
    isLoadingPagination: boolean;
    isLoadingSearch: boolean;
    open: boolean;
    options?: ISectionSearchOption;
    page: number;
    period: string;
    resources: IBlockSectionSearchResProps;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    searchAttempt: boolean;
    sectionsList?: ISectionsList;
    selectedSectionsIds: number[];
    selectedValues?: IAdvancedSearch;
    onAdd: () => void;
    onAddAndSearch: () => void;
    onChangePage: (_event: any, pageNumber: number) => void;
    onChangeRowsPerPage: (event: any) => void;
    onClearSearch: () => void;
    onClose: () => void;
    onDropdownChange: (optionSelected: IDropDownOption, id: string) => void;
    onNewSearch: () => void;
    onRefineSearch: () => void;
    onSearch: () => void;
    onSelectSection: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onTextFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IBlockSectionSearchResProps {
    blockSections: IBlockSectionsResProps;
    btnAdd: string;
    btnAddAndSearch: string;
    btnCancel: string;
    btnClearSearch: string;
    btnNewSearch: string;
    btnRefineSearch: string;
    btnSearch: string;
    formatCampus: string;
    formatCourse: string;
    formatCourseType: string;
    formatEndsBy: string;
    formatInstructor: string;
    formatKeyword: string;
    formatMeeting: string;
    formatSelected: string;
    formatSession: string;
    formatStartsFrom: string;
    formatSubtype: string;
    lblCampus: string;
    lblCourse: string;
    lblCourseDetails: string;
    lblCourseType: string;
    lblEndsBy: string;
    lblInstructor: string;
    lblKeyword: string;
    lblMeeting: string;
    lblNoResults: string;
    lblResultsFound: string;
    lblSession: string;
    lblSpecifyParameters: string;
    lblStartsFrom: string;
    lblSubTitle: string;
    lblSubtype: string;
    lblTimeLocation: string;
    lblTitle: string;
}

const styles = createStyles({
    searchTitle: {
        marginTop: Tokens.spacing30
    }
});

type PropsWithStyles = IBlockSectionSearchProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const BlockSectionSearch: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        addedSectionsIds,
        classes,
        dirtySearch,
        isLoadingOptions,
        isLoadingSearch,
        open,
        options,
        period,
        resources,
        searchAttempt,
        sectionsList,
        selectedSectionsIds,
        selectedValues,
        onAdd,
        onAddAndSearch,
        onChangePage,
        onChangeRowsPerPage,
        onClearSearch,
        onClose,
        onDropdownChange,
        onNewSearch,
        onRefineSearch,
        onSearch,
        onSelectSection,
        onTextFieldChange,

        // #region Pagination
        page,
        rowsPerPage,
        rowsPerPageOptions
        // #endregion Pagination
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
    let emptyOption: IDropDownOption;
    emptyOption = {
        description: layoutResources ? layoutResources.lblDropDownEmptyText : '',
        value: ''
    };

    let totalRows: number = 0;
    if (sectionsList && sectionsList.overallCount > 0) {
        totalRows = sectionsList.overallCount;
    }

    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            disableHeaderTypography
            id="advancedSearchModal"
            header={(
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Text className={classes.searchTitle} size="h2">
                                    {resources.lblTitle}
                                </Text>
                            </Grid>
                            <Grid item>
                                <StatusLabel
                                    id="stslPeriod"
                                    text={period}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {!dirtySearch && (
                        <Grid item xs={12}>
                            <Text size="h4">
                                {resources.lblSubTitle}
                            </Text>
                        </Grid>
                    )}
                </Grid>
            )}
            footer={dirtySearch ? (
                <ButtonGroup id="btgSectionSearch">
                    <Button
                        id={'btnCancel'}
                        color="secondary"
                        onClick={onClose}
                    >
                        {resources.btnCancel}
                    </Button>
                    {sectionsList && sectionsList.overallCount > 0 && (
                        <>
                            <Button
                                id={'btnAdd'}
                                color="secondary"
                                onClick={onAdd}
                            >
                                {resources.btnAdd}
                            </Button>
                            <Button
                                id={'btnAddAndSearch'}
                                onClick={onAddAndSearch}
                            >
                                {resources.btnAddAndSearch}
                            </Button>
                        </>
                    )}
                </ButtonGroup>
            ) : (
                    <ButtonGroup id="btgSectionSearch">
                        <Button
                            id={'btnClearSearch'}
                            color="secondary"
                            onClick={onClearSearch}
                        >
                            {resources.btnClearSearch}
                        </Button>
                        <Button
                            disabled={isLoadingOptions}
                            IconProps={{
                                name: 'search'
                            }}
                            id={'btnSearch'}
                            loading={isLoadingSearch}
                            onClick={onSearch}
                        >
                            {resources.btnSearch}
                        </Button>
                    </ButtonGroup>
                )}
            fullWidth
            maxWidth="lg"
            open={open}
            onClose={onClose}
        >
                {dirtySearch ? (
                    <>
                        {selectedValues && (
                            <>
                                <Grid container>
                                    <Grid item xs>
                                        <Text color="textSecondary">
                                            {resources.lblResultsFound}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    {selectedValues.keywords && (
                                        <Grid item>
                                            <Chip
                                                id="chpKeywords"
                                                label={Format.toString(resources.formatKeyword, [selectedValues.keywords])}
                                            />
                                        </Grid>
                                    )}
                                    {selectedValues.eventId && (
                                        <Grid item>
                                            <Chip
                                                id="chpEventId"
                                                label={Format.toString(resources.formatCourse, [selectedValues.eventId])}
                                            />
                                        </Grid>
                                    )}
                                    {selectedValues.session && (
                                        <Grid item>
                                            <Chip
                                                id="chpSession"
                                                label={Format.toString(resources.formatSession, [selectedValues.sessionText])}
                                            />
                                        </Grid>
                                    )}
                                    {selectedValues.startTime && (
                                        <Grid item>
                                            <Chip
                                                id="chpStartTime"
                                                label={Format.toString(resources.formatStartsFrom, [selectedValues.startTimeText])}
                                            />
                                        </Grid>
                                    )}
                                    {selectedValues.endTime && (
                                        <Grid item>
                                            <Chip
                                                id="chpEndTime"
                                                label={Format.toString(resources.formatEndsBy, [selectedValues.endTimeText])}
                                            />
                                        </Grid>
                                    )}
                                    {selectedValues.meeting && (
                                        <Grid item>
                                            <Chip
                                                id="chpMeeting"
                                                label={Format.toString(resources.formatMeeting, [selectedValues.meetingText])}
                                            />
                                        </Grid>
                                    )}
                                    {selectedValues.campusId && (
                                        <Grid item>
                                            <Chip
                                                id="chpCampus"
                                                label={Format.toString(resources.formatCampus, [selectedValues.campusIdText])}
                                            />
                                        </Grid>
                                    )}
                                    {selectedValues.eventType && (
                                        <Grid item>
                                            <Chip
                                                id="chpType"
                                                label={Format.toString(resources.formatCourseType, [selectedValues.eventTypeText])}
                                            />
                                        </Grid>
                                    )}
                                    {selectedValues.eventSubType && (
                                        <Grid item>
                                            <Chip
                                                id="chpSubType"
                                                label={Format.toString(resources.formatSubtype, [selectedValues.eventSubTypeText])}
                                            />
                                        </Grid>
                                    )}
                                    {selectedValues.instructorId && (
                                        <Grid item>
                                            <Chip
                                                id="chpInstructor"
                                                label={Format.toString(resources.formatInstructor, [selectedValues.instructorIdText])}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </>
                        )}
                        <Grid container justifyContent="space-between" wrap="nowrap">
                            <Grid item>
                                <Text>
                                    {Format.toString(resources.formatSelected, [selectedSectionsIds.length])}
                                </Text>
                            </Grid>
                            <Grid item>
                                <Grid container wrap="nowrap">
                                    <Grid item>
                                        <Button
                                            align="left"
                                            id="btnRefineSearch"
                                            textVariantStyling="inherit"
                                            variant="text"
                                            onClick={onRefineSearch}
                                        >
                                            {resources.btnRefineSearch}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            align="left"
                                            id="btnNewSearch"
                                            variant="text"
                                            textVariantStyling="inherit"
                                            onClick={onNewSearch}
                                        >
                                            {resources.btnNewSearch}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {sectionsList && sectionsList.sections && sectionsList.sections.length > 0 ? (
                            <BlockSections
                                addedSectionsIds={addedSectionsIds}
                                isLoadingSearch={isLoadingSearch}
                                resources={resources.blockSections}
                                sections={sectionsList.sections}
                                selectedSectionsIds={selectedSectionsIds}
                                onSelect={onSelectSection}
                            />
                        ) : (
                                <Illustration
                                    color="secondary"
                                    name="no-search-results"
                                    text={resources.lblNoResults}
                                />
                            )}
                        {rowsPerPage > 0 && totalRows > 0 && (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={totalRows}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        onPageChange={onChangePage}
                                        onRowsPerPageChange={onChangeRowsPerPage}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </>
                ) : (
                        <>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        disabled={isLoadingSearch}
                                        id="txtKeywords"
                                        label={resources.lblKeyword}
                                        type="text"
                                        value={selectedValues ? selectedValues.keywords : undefined}
                                        onChange={onTextFieldChange}
                                        onEnterPress={onSearch}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        disabled={isLoadingSearch}
                                        id="txtEventId"
                                        label={resources.lblCourse}
                                        type="text"
                                        value={selectedValues ? selectedValues.eventId : undefined}
                                        onChange={onTextFieldChange}
                                        onEnterPress={onSearch}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        disabled={isLoadingSearch}
                                        id="ddlSession"
                                        label={resources.lblSession}
                                        loading={isLoadingOptions}
                                        options={options ? options.sessions : undefined}
                                        value={selectedValues ? selectedValues.session : undefined}
                                        onChange={onDropdownChange}
                                    />
                                </Grid>
                            </Grid>
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
                                    <Dropdown
                                        disabled={isLoadingSearch}
                                        emptyOption={emptyOption}
                                        id="ddlStartTime"
                                        label={resources.lblStartsFrom}
                                        options={options ? options.hours : undefined}
                                        value={selectedValues ? selectedValues.startTime : undefined}
                                        onChange={onDropdownChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Dropdown
                                        disabled={isLoadingSearch}
                                        emptyOption={emptyOption}
                                        id="ddlEndTime"
                                        label={resources.lblEndsBy}
                                        options={options ? options.hours : undefined}
                                        value={selectedValues ? selectedValues.endTime : undefined}
                                        onChange={onDropdownChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        disabled={isLoadingSearch}
                                        id="ddlMeeting"
                                        label={resources.lblMeeting}
                                        loading={isLoadingOptions}
                                        options={options ? options.meetings : undefined}
                                        value={selectedValues ? selectedValues.meeting : undefined}
                                        onChange={onDropdownChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        disabled={isLoadingSearch}
                                        id="ddlCampusId"
                                        label={resources.lblCampus}
                                        loading={isLoadingOptions}
                                        options={options ? options.campus : undefined}
                                        value={selectedValues ? selectedValues.campusId : undefined}
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
                                        emptyOption={emptyOption}
                                        disabled={isLoadingSearch}
                                        id="ddlEventType"
                                        label={resources.lblCourseType}
                                        loading={isLoadingOptions}
                                        options={options ? options.eventTypes : undefined}
                                        value={selectedValues ? selectedValues.eventType : undefined}
                                        onChange={onDropdownChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        disabled={isLoadingSearch}
                                        id="ddlEventSubType"
                                        label={resources.lblSubtype}
                                        options={options ? options.subTypes : undefined}
                                        value={selectedValues ? selectedValues.eventSubType : undefined}
                                        onChange={onDropdownChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        disabled={isLoadingSearch}
                                        id="ddlInstructorId"
                                        label={resources.lblInstructor}
                                        loading={isLoadingOptions}
                                        options={options ? options.instructors : undefined}
                                        value={selectedValues ? selectedValues.instructorId : undefined}
                                        onChange={onDropdownChange}
                                    />
                                </Grid>
                            </Grid>
                            {searchAttempt && (
                                <Grid container>
                                    <Grid item>
                                        <MessageStyled
                                            classMessage="noResults"
                                            message={resources.lblSpecifyParameters}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(BlockSectionSearch);