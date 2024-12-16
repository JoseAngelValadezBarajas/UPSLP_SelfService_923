/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AdvancedSearchModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAdvancedSearchAdvising } from '../../Types/Advisees/IAdvancedSearchAdvising';
import { AdviseeList } from '../../Types/Enum/AdviseeList';

// #endregion Imports

// #region Types
export interface IAdvancedSearchModalProps {
    advancedSearchAdvising: IAdvancedSearchAdvising;
    hidePendingSchedulesOption?: boolean;
    listOptionSelected: number;
    onButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onChangeDropdown: (option: IDropDownOption, id: string) => void;
    onChangeTextField: (event: any) => void;
    onCloseModal: (modalName: string) => void;
    open: boolean;
    resources: IAdvancedSearchModalResProps;
}

export interface IAdvancedSearchModalResProps {
    btnClear: string;
    btnSearch: string;
    lblAcademic: string;
    lblAdvancedSearch: string;
    lblAdvisor: string;
    lblAlumni: string;
    lblCampus: string;
    lblClassLevel: string;
    lblClassYear: string;
    lblCollege: string;
    lblCourse: string;
    lblCurriculum: string;
    lblDegree: string;
    lblDepartment: string;
    lblEvent: string;
    lblFilter: string;
    lblFirstName: string;
    lblId: string;
    lblLastName: string;
    lblLastNamePrefix: string;
    lblMiddleName: string;
    lblName: string;
    lblOnStopList: string;
    lblPendingSchedules: string;
    lblPeriod: string;
    lblProgram: string;
    lblRetrieveAll: string;
    lblSection: string;
    lblSelect: string;
    lblSession: string;
    lblStatus: string;
    lblSubType: string;
    lblYearTerm: string;
}
// #endregion Types

// #region Component
const AdvancedSearchModal: React.FC<IAdvancedSearchModalProps> = (props: IAdvancedSearchModalProps): JSX.Element => {
    const {
        advancedSearchAdvising,
        hidePendingSchedulesOption,
        listOptionSelected,
        onButtonClick,
        onCloseModal,
        onChangeDropdown,
        onChangeTextField,
        open,

        resources
    } = props;

    const filters: IDropDownOption[] = [];

    if (advancedSearchAdvising.hasScheduleRequestsClaim) {
        if (!hidePendingSchedulesOption) {
            filters.push({
                description: resources.lblPendingSchedules,
                value: 0
            });
        }
    }
    filters.push({
        description: resources.lblOnStopList,
        value: 1
    });

    const emptyOption: IDropDownOption = {
        description: resources.lblSelect,
        value: -2
    };

    const onClose = (): void => {
        onCloseModal('AdvancedSearch');
    };

    return (
        <Modal
            disableHeaderTypography
            id="advancedSearchModal"
            header={(
                <Text size="h2">
                    {resources.lblAdvancedSearch}
                </Text>
            )}
            footer={(
                <ButtonGroup id="btgAdvancedSearch">
                    <Button
                        align="left"
                        id="btnRetrieveAll"
                        textVariantStyling="inherit"
                        variant="text"
                        onClick={onButtonClick}
                    >
                        {resources.lblRetrieveAll}
                    </Button>
                    <Button
                        id="btnClear_AdvancedSearchModal"
                        color="secondary"
                        onClick={onButtonClick}
                    >
                        {resources.btnClear}
                    </Button>
                    <Button
                        id="btnSearch_AdvancedSearchModal"
                        onClick={onButtonClick}
                    >
                        {resources.btnSearch}
                    </Button>
                </ButtonGroup>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlFilters_AdvancedSearchModal"
                        label={resources.lblFilter}
                        options={filters}
                        value={advancedSearchAdvising.filterSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Text size="h3">
                        {resources.lblPeriod}
                    </Text>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlYearTerm_AdvancedSearchModal"
                        label={resources.lblYearTerm}
                        options={advancedSearchAdvising.yearTerms}
                        value={advancedSearchAdvising.yearTermSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlSession_AdvancedSearchModal"
                        label={resources.lblSession}
                        options={advancedSearchAdvising.sessions}
                        value={advancedSearchAdvising.sessionSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Text size="h3">
                        {resources.lblName}
                    </Text>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="txtLastName_AdvancedSearchModal"
                        label={resources.lblLastName}
                        type="text"
                        value={advancedSearchAdvising.lastName
                            ? advancedSearchAdvising.lastName : ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="txtLastNamePrefix_AdvancedSearchModal"
                        label={resources.lblLastNamePrefix}
                        type="text"
                        value={advancedSearchAdvising.lastNamePrefix
                            ? advancedSearchAdvising.lastNamePrefix : ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="txtFirstName_AdvancedSearchModal"
                        label={resources.lblFirstName}
                        type="text"
                        value={advancedSearchAdvising.firstName
                            ? advancedSearchAdvising.firstName : ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="txtMiddleName_AdvancedSearchModal"
                        label={resources.lblMiddleName}
                        type="text"
                        value={advancedSearchAdvising.middleName
                            ? advancedSearchAdvising.middleName : ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="txtId_AdvancedSearchModal"
                        label={resources.lblId}
                        type="text"
                        value={advancedSearchAdvising.id
                            ? advancedSearchAdvising.id : ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
            </Grid>
            {listOptionSelected === AdviseeList.myStudents && (
                <>
                    <Divider />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Text size="h3">
                                {resources.lblCourse}
                            </Text>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlEvent_AdvancedSearchModal"
                                label={resources.lblEvent}
                                options={advancedSearchAdvising.events}
                                value={advancedSearchAdvising.eventSelected}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlSubType_AdvancedSearchModal"
                                label={resources.lblSubType}
                                options={advancedSearchAdvising.subTypes}
                                value={advancedSearchAdvising.subTypeSelected}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlSection_AdvancedSearchModal"
                                label={resources.lblSection}
                                options={advancedSearchAdvising.sections}
                                value={advancedSearchAdvising.sectionSelected}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                    </Grid>
                </>
            )}
            {listOptionSelected === AdviseeList.allStudents && (
                <>
                    <Divider />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Text size="h3">
                                {resources.lblAdvisor}
                            </Text>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlName_AdvancedSearchModal"
                                label={resources.lblName}
                                options={advancedSearchAdvising.advisors}
                                value={advancedSearchAdvising.advisorSelected}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                    </Grid>
                </>
            )}
            {listOptionSelected === AdviseeList.alumni && (
                <>
                    <Divider />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Text size="h3">
                                {resources.lblAlumni}
                            </Text>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Dropdown
                                emptyOption={emptyOption}
                                id="ddlClassYear_AdvancedSearchModal"
                                label={resources.lblClassYear}
                                options={advancedSearchAdvising.classYears}
                                value={advancedSearchAdvising.classYearSelected}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                    </Grid>
                </>
            )}
            <Divider />
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Text size="h3">
                        {resources.lblAcademic}
                    </Text>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlCollege_AdvancedSearchModal"
                        label={resources.lblCollege}
                        options={advancedSearchAdvising.colleges}
                        value={advancedSearchAdvising.collegeSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlCampus_AdvancedSearchModal"
                        label={resources.lblCampus}
                        options={advancedSearchAdvising.campus}
                        value={advancedSearchAdvising.campusSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlProgram_AdvancedSearchModal"
                        label={resources.lblProgram}
                        options={advancedSearchAdvising.programs}
                        value={advancedSearchAdvising.programSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlDepartment_AdvancedSearchModal"
                        label={resources.lblDepartment}
                        options={advancedSearchAdvising.departments}
                        value={advancedSearchAdvising.departmentSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlDegree_AdvancedSearchModal"
                        label={resources.lblDegree}
                        options={advancedSearchAdvising.degrees}
                        value={advancedSearchAdvising.degreeSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlClassLevel_AdvancedSearchModal"
                        label={resources.lblClassLevel}
                        options={advancedSearchAdvising.classLevels}
                        value={advancedSearchAdvising.classLevelSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlCurriculum_AdvancedSearchModal"
                        label={resources.lblCurriculum}
                        options={advancedSearchAdvising.curriculums}
                        value={advancedSearchAdvising.curriculumSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlStatus_AdvancedSearchModal"
                        label={resources.lblStatus}
                        options={advancedSearchAdvising.status}
                        value={advancedSearchAdvising.statusSelected}
                        onChange={onChangeDropdown}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AdvancedSearchModal;