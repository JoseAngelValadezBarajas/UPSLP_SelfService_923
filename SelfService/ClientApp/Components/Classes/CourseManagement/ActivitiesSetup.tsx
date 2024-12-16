/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ActivitiesSetup.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import Activities, { IActivitiesResProps } from './Activities';
import ActivitiesAddModal, { IActivitiesAddModalResProps } from './ActivitiesAddModal';
import ActivitiesCopyModal from './ActivitiesCopyModal';
import ActivitiesEditModal, { IActivitiesEditModalResProps } from './ActivitiesEditModal';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IActivitiesSetupResources } from '../../../Types/Resources/Classes/IActivitiesSetupResources';
import { IAssignments } from '../../../Types/Section/IAssignments';
import { ISaveActivities } from '../../../Types/Section/ISaveActivities';
import { ISectionAssignmentsSetup } from '../../../Types/Section/ISectionAssignmentsSetup';
import { ISectionCopyActivities } from '../../../Types/Section/ISectionCopyActivities';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/ActivitiesSetup';
import RequestsSection from '../../../Requests/Generic/Section';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
export interface IActivitiesSetupProps {
    cultures: ICultures;
    myPosition: number;
    sectionId: number;
}

interface IActivitiesSetupRes extends IActivitiesSetupResources {
    activities: IActivitiesResProps;
    activitiesAddModal: IActivitiesAddModalResProps;
    activitiesEditModal: IActivitiesEditModalResProps;
}

interface IActivitiesSetupState {
    activitiesSetup?: ISectionAssignmentsSetup;
    activitySetupItems: IAssignments;
    activityType: number;
    addActivity: boolean;
    addActivityItems: IAssignments;
    anchorEl: any;
    changeActivity: boolean;
    componentError: boolean;
    copyActivities?: ISectionCopyActivities;
    copyActivitiesAssignments?: IAssignments[];
    copyActivity: IAssignments;
    countAllFinal: number;
    countAllMidterm: number;
    courseSectionId: number;
    cultures: ICultures;
    editActivity: boolean;
    gradeActivity?: IDropDownOption[];
    isActivityTypeRequired: boolean;
    isAddActivity: boolean;
    isCopyActivities: boolean;
    isCopyActivity: boolean;
    isFinishButton: boolean;
    isLoading: boolean;
    isPossiblePoints: boolean;
    isRestricted: boolean;
    isTitleRequired: boolean;
    isValidDateAssignedDate: boolean;
    isValidDateDueDate: boolean;
    isValidDueDate: boolean;
    isValidName: boolean;
    isValidPossiblePoints: boolean;
    isViewActivity: boolean;
    percentageFinalBytype: number[];
    percentageMidtermBytype: number[];
    resources?: IActivitiesSetupRes;
    saveActivities: ISaveActivities;
    sectionName: string;
    sectionsCourses?: IDropDownOption[];
    weightType: number;
}
// #endregion Types
const styles = () => createStyles({
    marginLeftCheck: {
        marginLeft: Tokens.sizingSmall
    },
    textAlign: {
        textAlign: 'right'
    }
});

type PropsWithStyles = IActivitiesSetupProps & IActivitiesSetupState & WithStyles<typeof styles>;

// #region Component
class ActivitiesSetup extends React.Component<PropsWithStyles> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IActivitiesSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'ActivitiesSetup';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IActivitiesSetupState {
        let resources: IActivitiesSetupRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            activitySetupItems: {},
            activityType: 0,
            addActivity: false,
            addActivityItems: {},
            anchorEl: null,
            changeActivity: false,
            componentError: false,
            copyActivity: {},
            countAllFinal: 0,
            countAllMidterm: 0,
            courseSectionId: 0,
            cultures: LayoutStore.getCultures(),
            editActivity: false,
            isActivityTypeRequired: false,
            isAddActivity: false,
            isCopyActivities: false,
            isCopyActivity: false,
            isFinishButton: true,
            isLoading: true,
            isPossiblePoints: false,
            isRestricted: false,
            isTitleRequired: false,
            isValidDateAssignedDate: true,
            isValidDateDueDate: true,
            isValidDueDate: true,
            isValidName: false,
            isValidPossiblePoints: false,
            isViewActivity: false,
            percentageFinalBytype: [],
            percentageMidtermBytype: [],
            resources: resources,
            saveActivities: {},
            sectionName: '',
            weightType: 0
        };
    }

    // #region Events
    private onAddActivity = (): void => {
        try {
            this.setState({
                addActivity: true,
                addActivityItems: {}
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddActivity.name, e));
        }
    };

    private onBlurTextField = (event: any): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            if (activitiesSetup) {
                const index: string[] = event.target.id.split('_');
                let possiblePoints: number = 0;
                let totalMidterm: number = 0;
                let totalFinal: number = 0;

                switch (index[0]) {
                    case 'txtWeightMidterm':
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermWeight = Number(event.target.value);
                        this.calculateWeight();
                        break;
                    case 'txtWeightFinal':
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalWeight = Number(event.target.value);
                        this.calculateWeight();
                        break;
                    case 'txtPossiblePoints':
                        if (!activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                            .sectionAssignments[index[2]].isExtraCredit && activitiesSetup.sectionAssignmentSetup.weightMethod === 1) {
                            if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].midtermWeight ||
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].finalWeight) {
                                if (activitiesSetup.sectionAssignmentSetup.isWeightByType) {
                                    if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermWeight > 0) {
                                        this.calculatePercentageByWeight(true, true, Number(index[1]));
                                    }
                                    if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalWeight > 0) {
                                        this.calculatePercentageByWeight(false, true, Number(index[1]));
                                    }
                                }
                                else {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(assignment => {
                                        assignment.sectionAssignments.forEach(item => {
                                            if (item.possiblePoints && !item.isExtraCredit) {
                                                if (item.midtermWeight || item.finalWeight) {
                                                    possiblePoints += Number(item.possiblePoints);
                                                }
                                            }
                                        });
                                    });
                                    activitiesSetup.sectionAssignmentSetup.totalMidtermPoints = possiblePoints.toFixed(2).toString();
                                    activitiesSetup.sectionAssignmentSetup.totalFinalPoints = possiblePoints.toFixed(2).toString();
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach((assignment, i) => {
                                        assignment.sectionAssignments.forEach((item, j) => {
                                            if (item.possiblePoints) {
                                                this.calculatePercentage(item.possiblePoints, i, j);
                                            }
                                        });
                                    });
                                }
                            }

                            this.setState({
                                activitiesSetup: activitiesSetup
                            });
                        }
                        break;

                    case 'txtCountsTowardMidterm':
                        if (activitiesSetup.sectionAssignmentSetup.isWeightByType) {
                            if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermWeight > 0) {
                                this.calculatePercentageMidtermByWeight(Number(index[1]));
                            }
                        }
                        else {
                            activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(items => {
                                items.sectionAssignments.forEach(item => {
                                    if (!item.isExtraCredit && item.midtermWeight) {
                                        totalMidterm += Number(item.midtermWeight);
                                    }
                                });
                            });
                            this.calculatePercentageMidterm(totalMidterm);
                        }
                        break;

                    case 'txtCountsTowardFinal':
                        if (activitiesSetup.sectionAssignmentSetup.isWeightByType) {
                            if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalWeight > 0) {
                                this.caluclatePercentageFinalByWeight(Number(index[1]));
                            }
                        }
                        else {
                            activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(items => {
                                items.sectionAssignments.forEach(item => {
                                    if (!item.isExtraCredit && item.finalWeight) {
                                        totalFinal += Number(item.finalWeight);
                                    }
                                });
                            });
                            this.calculatePercentageFinal(totalFinal);
                        }
                        break;
                }

            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurTextField.name, e));
        }
    };

    private onChangeActivity = (): void => {
        try {
            this.setState({
                changeActivity: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeActivity.name, e));
        }
    };

    private onChangeDropDown = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            let optionsSelected: IAssignments | undefined;
            optionsSelected = this.state.activitySetupItems;
            if (optionsSelected) {
                optionsSelected.type = Number(optionSelected.value);
                this.setState({
                    activitySetupItems: optionsSelected,
                    isActivityTypeRequired: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropDown.name, e));
        }
    };

    private onChangeDropDownAdd = (optionSelected: IDropDownOption, _id: string): void => {
        const {
            isCopyActivity
        } = this.state;

        try {
            let optionsSelected: IAssignments | undefined;
            if (isCopyActivity) {
                optionsSelected = this.state.copyActivity;
                if (optionsSelected) {
                    optionsSelected.type = Number(optionSelected.value);
                    this.setState({
                        copyActivity: optionsSelected,
                        isActivityTypeRequired: false
                    });
                }
            }
            else {
                optionsSelected = this.state.addActivityItems;
                if (optionsSelected) {
                    optionsSelected.type = Number(optionSelected.value);
                    this.setState({
                        addActivityItems: optionsSelected,
                        isActivityTypeRequired: false
                    });
                }
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropDownAdd.name, e));
        }
    };

    private onChangeRadio = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            if (activitiesSetup) {
                activitiesSetup.sectionAssignmentSetup.weightMethod = Number(event.target.value);
                this.setState({
                    activitiesSetup: activitiesSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRadio.name, e));
        }
    };

    private onChangeTextFieldModal = (event: any): void => {
        try {
            const textFieldValue: IAssignments = { ...this.state.activitySetupItems };
            const idSelected: string = event.target.id;

            if (idSelected === 'txtMidtermWeight' || idSelected === 'txtFinalWeight') {
                if (textFieldValue && event.target.value.match(/^[0-9.\b]*$/g) && event.target.value <= 999) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        activitySetupItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else if (idSelected === 'txtPossiblePoints') {
                if (textFieldValue && event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 99999) {
                    const value: any = event.target.value.split('.');
                    if (value[1]) {
                        if (value[1].length <= 2) {
                            textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                        }
                    }
                    else {
                        textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    }

                    this.setState({
                        activitySetupItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else {
                if (textFieldValue) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        activitySetupItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldModal.name, e));
        }
    };

    private onChangeTextFieldModalAdd = (event: any): void => {
        try {
            const textFieldValue: IAssignments = { ...this.state.addActivityItems };
            const idSelected: string = event.target.id;

            if (idSelected === 'txtMidtermWeight' || idSelected === 'txtFinalWeight') {
                if (textFieldValue && event.target.value.match(/^[0-9.\b]*$/g) && event.target.value <= 999) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        addActivityItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else if (idSelected === 'txtPossiblePoints') {
                if (textFieldValue && event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 99999) {
                    const value: any = event.target.value.split('.');
                    if (value[1]) {
                        if (value[1].length <= 2) {
                            textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                        }
                    }
                    else {
                        textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    }

                    this.setState({
                        addActivityItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else {
                if (textFieldValue) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        addActivityItems: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldModalAdd.name, e));
        }
    };

    private onChangeTextFieldModalCopy = (event: any): void => {
        try {
            const textFieldValue: IAssignments = { ...this.state.copyActivity };
            const idSelected: string = event.target.id;

            if (idSelected === 'txtMidtermWeight' || idSelected === 'txtFinalWeight') {
                if (textFieldValue && event.target.value.match(/^[0-9.\b]*$/g) && event.target.value <= 999) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        copyActivity: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else if (idSelected === 'txtPossiblePoints') {
                if (textFieldValue && event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 99999) {
                    const value: any = event.target.value.split('.');
                    if (value[1]) {
                        if (value[1].length <= 2) {
                            textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                        }
                    }
                    else {
                        textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    }

                    this.setState({
                        copyActivity: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else {
                if (textFieldValue) {
                    textFieldValue[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                    this.setState({
                        copyActivity: textFieldValue,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldModalCopy.name, e));
        }
    };

    private onChangeTextFieldTable = (event: any): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            if (activitiesSetup) {
                const index: string[] = event.target.id.split('_');
                switch (index[0]) {
                    case 'txtWeightMidterm':
                        if (event.target.value.match(/^[0-9.\b]*$/g) && event.target.value <= 999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermWeight = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermWeight = event.target.value;
                            }
                        }
                        break;

                    case 'txtDropLowestMidterm':
                        if (event.target.value.match(/^[0-9\b]*$/g) && event.target.value <= 999) {
                            if (event.target.value === '') {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropLowest = event.target.value;
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropLowest = Number(event.target.value);
                                if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropLowest !== 0 &&
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropLowest !== '') {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isMidtermDrop = true;
                                }
                                else {
                                    if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropHighest !== 0 &&
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropHighest !== '') {
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isMidtermDrop = true;
                                    }
                                    else {
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isMidtermDrop = false;
                                    }
                                }
                            }
                        }
                        break;

                    case 'txtDropHighestMidterm':
                        if (event.target.value.match(/^[0-9\b]*$/g) && event.target.value <= 999) {
                            if (event.target.value === '') {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropHighest = event.target.value;
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropHighest = Number(event.target.value);
                                if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropHighest !== 0 &&
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropHighest !== '') {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isMidtermDrop = true;
                                }
                                else {
                                    if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropLowest !== 0 &&
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermDropLowest !== '') {
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isMidtermDrop = true;
                                    }
                                    else {
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isMidtermDrop = false;
                                    }
                                }
                            }
                        }
                        break;

                    case 'txtWeightFinal':
                        if (event.target.value.match(/^[0-9.\b]*$/g) && event.target.value <= 999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalWeight = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalWeight = event.target.value;
                            }
                        }
                        break;

                    case 'txtDropLowestFinal':
                        if (event.target.value.match(/^[0-9\b]*$/g) && event.target.value <= 999) {
                            if (event.target.value === '') {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropLowest = event.target.value;
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropLowest = Number(event.target.value);
                                if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropLowest !== 0 &&
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropLowest !== '') {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isFinalDrop = true;
                                }
                                else {
                                    if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropHighest !== 0 &&
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropHighest !== '') {
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isFinalDrop = true;
                                    }
                                    else {
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isFinalDrop = false;
                                    }
                                }
                            }
                        }
                        break;

                    case 'txtDropHighestFinal':
                        if (event.target.value.match(/^[0-9\b]*$/g) && event.target.value <= 999) {
                            if (event.target.value === '') {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropHighest = event.target.value;
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropHighest = Number(event.target.value);
                                if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropHighest !== 0 &&
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropHighest !== '') {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isFinalDrop = true;
                                }
                                else {
                                    if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropLowest !== 0 &&
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalDropLowest !== '') {
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isFinalDrop = true;
                                    }
                                    else {
                                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].isFinalDrop = false;
                                    }
                                }
                            }
                        }
                        break;

                    case 'txtPossiblePoints':
                        if (event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 99999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                    .sectionAssignments[index[2]].possiblePoints = event.target.value;
                            }
                        }
                        break;

                    case 'txtCountsTowardMidterm':
                        if (event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].midtermWeight = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                    .sectionAssignments[index[2]].midtermWeight = event.target.value;
                            }
                        }
                        break;

                    case 'txtCountsTowardFinal':
                        if (event.target.value.match(/^[0-9.]*$/g) && event.target.value <= 999) {
                            const value: any = event.target.value.split('.');
                            if (value[1]) {
                                if (value[1].length <= 2) {
                                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].finalWeight = event.target.value;
                                }
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                    .sectionAssignments[index[2]].finalWeight = event.target.value;
                            }
                        }
                        break;
                }
            }

            this.setState({
                activitiesSetup: activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldTable.name, e));
        }
    };

    private onChangeWeightActivity = (): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                activitiesSetup
            } = this.state;

            if (activitiesSetup) {
                LayoutActions.setLoading(true);
                activitiesSetup.sectionAssignmentSetup.sectionId = sectionId;
                Requests.postUpdateWeightType(activitiesSetup.sectionAssignmentSetup, this.resolveUpdateWeightType);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeWeightActivity.name, e));
        }
    };

    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                activitiesSetup,
                activitySetupItems

            } = this.state;

            const checked: boolean = event.target.checked;
            if (event.target.id && activitiesSetup) {
                switch (event.target.id) {
                    case 'chkCountsTowardFinal':
                        activitySetupItems.countsForFinal = checked;
                        checked ? activitySetupItems.finalWeight = 1 : activitySetupItems.finalWeight = 0;
                        break;
                    case 'chkExtraCredit':
                        activitySetupItems.isExtraCredit = checked;
                        break;
                    case 'chkCountsTowardMidterm':
                        activitySetupItems.countsForMidterm = checked;
                        checked ? activitySetupItems.midtermWeight = 1 : activitySetupItems.midtermWeight = 0;
                        break;
                    case 'chkWeightByType':
                        activitiesSetup.sectionAssignmentSetup.isWeightByType = checked;
                        break;
                }

                this.setState({
                    activitiesSetup: activitiesSetup,
                    activitySetupItems: activitySetupItems
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onCheckboxChangeAdd = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                activitiesSetup,
                addActivityItems,
                copyActivity,
                isCopyActivity
            } = this.state;

            const checked: boolean = event.target.checked;
            if (event.target.id && activitiesSetup) {
                switch (event.target.id) {
                    case 'chkCountsTowardFinal':
                        if (isCopyActivity) {
                            copyActivity.countsForFinal = checked;
                            checked ? copyActivity.finalWeight = 1 : copyActivity.finalWeight = 0;
                        }
                        else {
                            addActivityItems.countsForFinal = checked;
                            checked ? addActivityItems.finalWeight = 1 : addActivityItems.finalWeight = 0;
                        }
                        break;
                    case 'chkExtraCredit':
                        if (isCopyActivity) {
                            copyActivity.isExtraCredit = checked;
                        }
                        else {
                            addActivityItems.isExtraCredit = checked;
                        }
                        break;
                    case 'chkCountsTowardMidterm':
                        if (isCopyActivity) {
                            copyActivity.countsForMidterm = checked;
                            checked ? copyActivity.midtermWeight = 1 : copyActivity.midtermWeight = 0;
                        }
                        else {
                            addActivityItems.countsForMidterm = checked;
                            checked ? addActivityItems.midtermWeight = 1 : addActivityItems.midtermWeight = 0;
                        }
                        break;
                    case 'chkWeightByType':
                        activitiesSetup.sectionAssignmentSetup.isWeightByType = checked;
                        break;
                }

                this.setState({
                    activitiesSetup: activitiesSetup,
                    addActivityItems: addActivityItems,
                    copyActivity: copyActivity
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChangeAdd.name, e));
        }
    };

    private onCheckBoxChangeTable = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                activitiesSetup,
                countAllFinal,
                countAllMidterm
            } = this.state;

            let countMidterm: number = 0;
            let countFinal: number = 0;
            const checked: boolean = event.target.checked;
            if (activitiesSetup) {
                const index: string[] = event.target.id.split('_');
                switch (index[0]) {
                    case 'chkCountsTowardMidterm':
                        checked ? activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].midtermWeight = 1
                            : activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].midtermWeight = 0;
                        if (!activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].isExtraCredit) {
                            checked ? activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermMaxDrop += 1 :
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermMaxDrop -= 1;
                            checked ?
                                activitiesSetup.sectionAssignmentSetup.totalMidtermPoints =
                                (Number(activitiesSetup.sectionAssignmentSetup.totalMidtermPoints) +
                                    Number(activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints)).toFixed(2).toString()
                                :
                                activitiesSetup.sectionAssignmentSetup.totalMidtermPoints =
                                (Number(activitiesSetup.sectionAssignmentSetup.totalMidtermPoints) -
                                    Number(activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints)).toFixed(2).toString();

                            if (activitiesSetup.sectionAssignmentSetup.isWeightByType) {
                                if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].midtermWeight > 0) {
                                    this.calculatePercentageByWeight(true, false, Number(index[1]));
                                }
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach((items, i) => {
                                    items.sectionAssignments.forEach((item, j) => {
                                        if (item.possiblePoints) {
                                            this.calculatePercentage(item.possiblePoints, Number(i), Number(j));
                                        }
                                    });
                                });
                            }
                        }
                        checked ? countMidterm += countAllMidterm : countMidterm -= countAllMidterm;
                        break;
                    case 'chkCountsTowardFinal':
                        checked ? activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].finalWeight = 1
                            : activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].finalWeight = 0;
                        if (!activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].sectionAssignments[index[2]].isExtraCredit) {
                            checked ? activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalMaxDrop += 1 :
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalMaxDrop -= 1;
                            checked ?
                                activitiesSetup.sectionAssignmentSetup.totalFinalPoints =
                                (Number(activitiesSetup.sectionAssignmentSetup.totalFinalPoints) +
                                    Number(activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints)).toFixed(2).toString()
                                :
                                activitiesSetup.sectionAssignmentSetup.totalFinalPoints =
                                (Number(activitiesSetup.sectionAssignmentSetup.totalFinalPoints) -
                                    Number(activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]]
                                        .sectionAssignments[index[2]].possiblePoints)).toFixed(2).toString();

                            if (activitiesSetup.sectionAssignmentSetup.isWeightByType) {
                                if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index[1]].finalWeight > 0) {
                                    this.calculatePercentageByWeight(false, false, Number(index[1]));
                                }
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach((items, i) => {
                                    items.sectionAssignments.forEach((item, j) => {
                                        if (item.possiblePoints) {
                                            this.calculatePercentage(item.possiblePoints, Number(i), Number(j));
                                        }
                                    });
                                });
                            }
                        }
                        checked ? countFinal += countAllFinal : countFinal -= countAllFinal;
                        break;
                }

                this.setState({
                    activitiesSetup: activitiesSetup,
                    countAllFinal: countFinal,
                    countAllMidterm: countMidterm
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckBoxChangeTable.name, e));
        }
    };

    private onClose = (): void => {
        try {

            const {
                activitiesSetup,
                changeActivity,
                weightType
            } = this.state;

            if (activitiesSetup && changeActivity) {
                activitiesSetup.sectionAssignmentSetup.weightMethod = weightType;
            }

            this.setState({
                activitiesSetup: activitiesSetup,
                activityType: 0,
                addActivity: false,
                changeActivity: false,
                copyActivitiesAssignments: undefined,
                editActivity: false,
                isActivityTypeRequired: false,
                isCopyActivities: false,
                isCopyActivity: false,
                isFinishButton: true,
                isTitleRequired: false,
                isValidDueDate: true,
                isValidName: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClose.name, e));
        }
    };

    private onCopy = (id: number, index: number, _subIndex: number): void => {
        try {
            if (id) {
                let copyActivity: ISectionAssignmentsSetup | undefined;
                let copyAssignment: IAssignments | undefined;
                if (this.state.activitiesSetup) {
                    copyActivity = { ...this.state.activitiesSetup };
                    copyAssignment = { ...this.state.addActivityItems };
                    copyAssignment.assignedDate =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].assignedDate;
                    copyAssignment.dueDate =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].dueDate;
                    copyAssignment.countsForFinal =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].countsForFinal;
                    copyAssignment.countsForMidterm =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].countsForMidterm;
                    copyAssignment.description =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].description;
                    copyAssignment.finalPercentage =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].finalPercentage;
                    copyAssignment.finalWeight =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].finalWeight;
                    copyAssignment.isExtraCredit =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].isExtraCredit;
                    copyAssignment.midtermPercentage =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].midtermPercentage;
                    copyAssignment.midtermWeight =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].midtermWeight;
                    copyAssignment.possiblePoints =
                        copyActivity.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[_subIndex].possiblePoints;
                    copyAssignment.id = 0;
                    copyAssignment.title = '';
                    this.setState({
                        activityType: copyActivity.sectionAssignmentSetup.assignmentTypes[index].id,
                        addActivity: true,
                        copyActivity: copyAssignment,
                        isCopyActivity: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCopy.name, e));
        }
    };

    private onCopyActivities = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            if (sectionId) {
                LayoutActions.setLoading(true);
                Requests.getSectionsPeriods(sectionId, this.resolveGetSectionsPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCopyActivities.name, e));
        }
    };

    private onDateTimeChange = (date: string, id: string, isValid: boolean): void => {
        try {
            const {
                isValidDateAssignedDate,
                isValidDateDueDate
            } = this.state;

            let isValidDateAssignedDateNew: boolean = isValidDateAssignedDate;
            let isValidDateDueDateNew: boolean = isValidDateDueDate;

            let assignment: IAssignments | undefined;
            assignment = this.state.activitySetupItems;
            if (assignment) {
                if (id === 'dtpAssigned') {
                    assignment.assignedDate = date;
                    assignment.isAssignedDateChanged = true;
                    isValidDateAssignedDateNew = isValid;
                }
                else {
                    assignment.dueDate = date;
                    assignment.isdueDateChanged = true;
                    isValidDateDueDateNew = isValid;
                }

                const isValidDueDate: boolean = this.isValidDueDate(assignment) || !isValidDateAssignedDateNew || !isValidDateDueDateNew;

                this.setState({
                    isValidDueDate: isValidDueDate,
                    activitySetupItems: assignment,
                    isValidDateAssignedDate: isValidDateAssignedDateNew,
                    isValidDateDueDate: isValidDateDueDateNew,
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDateTimeChange.name, e));
        }
    };

    private onDateTimeChangeAdd = (date: string, id: string, isValid: boolean): void => {
        const {
            isCopyActivity,
            isValidDateAssignedDate,
            isValidDateDueDate
        } = this.state;

        let isValidDateAssignedDateNew: boolean = isValidDateAssignedDate;
        let isValidDateDueDateNew: boolean = isValidDateDueDate;

        try {
            let assignment: IAssignments | undefined;
            if (isCopyActivity) {
                assignment = this.state.copyActivity;
                if (assignment) {
                    if (id === 'dtpAssigned') {
                        assignment.assignedDate = date;
                        assignment.isAssignedDateChanged = true;
                        isValidDateAssignedDateNew = isValid;
                    }
                    else {
                        assignment.dueDate = date;
                        assignment.isdueDateChanged = true;
                        isValidDateDueDateNew = isValid;
                    }

                    const isValidDueDate: boolean = this.isValidDueDate(assignment) || !isValidDateAssignedDateNew || !isValidDateDueDateNew;

                    this.setState({
                        copyActivity: assignment,
                        isValidDueDate: isValidDueDate,
                        isValidDateAssignedDate: isValidDateAssignedDateNew,
                        isValidDateDueDate: isValidDateDueDateNew,
                    });
                }
            }
            else {
                assignment = this.state.addActivityItems;
                if (assignment) {
                    if (id === 'dtpAssigned') {
                        assignment.assignedDate = date;
                        isValidDateAssignedDateNew = isValid;
                    }
                    else {
                        assignment.dueDate = date;
                        isValidDateDueDateNew = isValid;
                    }

                    const isValidDueDate: boolean = this.isValidDueDate(assignment) || !isValidDateAssignedDateNew || !isValidDateDueDateNew;

                    this.setState({
                        addActivityItems: assignment,
                        isValidDueDate: isValidDueDate,
                        isValidDateAssignedDate: isValidDateAssignedDateNew,
                        isValidDateDueDate: isValidDateDueDateNew
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDateTimeChangeAdd.name, e));
        }
    };

    private onDelete = (id: number): void => {
        try {
            LayoutActions.setLoading(true);
            Requests.postDeleteActivity(id, this.resolvePostDeleteActivity);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDelete.name, e));
        }
    };

    private onDeleteAll = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            LayoutActions.setLoading(true);
            Requests.postDeleteActivities(sectionId, this.resolvePostDeleteActivity);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAll.name, e));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            if (activitiesSetup) {
                activitiesSetup.sectionAssignmentSetup.weightMethod = Number(optionSelected.value);
                this.setState({
                    activitiesSetup: activitiesSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onDropdownCopyChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            const {
                copyActivities
            } = this.state;

            if (copyActivities && sectionId) {
                LayoutActions.showPageLoader();
                if (id === 'ddlPeriod') {
                    copyActivities.defaultSection.value = '';
                    copyActivities.defaultPeriod.value = Number(optionSelected.value);
                    Requests.getSectionsCourse(sectionId, Number(optionSelected.value), this.resolveGetSectionsCourses);
                    this.setState({
                        copyActivities: copyActivities,
                        copyActivitiesAssignments: undefined,
                        isFinishButton: true
                    });
                }
                else {
                    copyActivities.defaultSection.value = Number(optionSelected.value);
                    copyActivities.defaultSection.description = String(optionSelected.description);
                    if (copyActivities.defaultSection.value > 0) {
                        Requests.getSectionsAssignments(Number(optionSelected.value), this.resolveGetSectionsAssignments);
                        this.setState({
                            copyActivities: copyActivities,
                            courseSectionId: copyActivities.defaultSection.value,
                            isFinishButton: false
                        });
                    }
                    else {
                        this.setState({
                            copyActivities: copyActivities,
                            copyActivitiesAssignments: undefined,
                            isFinishButton: true
                        }, LayoutActions.hidePageLoader);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownCopyChange.name, e));
        }
    };

    private onEditActivity = (id: number, index: number, subIndex: number, disabled: boolean): void => {
        try {

            const {
                activitiesSetup
            } = this.state;

            if (id && activitiesSetup) {
                this.setState({
                    activitySetupItems: activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[subIndex],
                    activityType: activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].id,
                    addActivityItems: {},
                    editActivity: true,
                    isAddActivity: false,
                    isCopyActivity: false,
                    isViewActivity: disabled
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditActivity.name, e));
        }
    };

    private onExpand = (index: number, expanded: boolean): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let possiblePoints: number = 0;
            if (activitiesSetup) {
                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].isExpanded = expanded;
                if (activitiesSetup.sectionAssignmentSetup.isWeightByType) {
                    if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].midtermWeight > 0) {
                        this.calculatePercentageByWeight(true, true, Number(index));
                    }
                    if (activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].finalWeight > 0) {
                        this.calculatePercentageByWeight(false, true, Number(index));
                    }
                }
                else {
                    activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(assignment => {
                        assignment.sectionAssignments.forEach(item => {
                            if (item.possiblePoints && !item.isExtraCredit) {
                                if (item.midtermWeight || item.finalWeight) {
                                    possiblePoints += Number(item.possiblePoints);
                                }
                            }
                        });
                    });
                    activitiesSetup.sectionAssignmentSetup.totalMidtermPoints = possiblePoints.toFixed(2).toString();
                    activitiesSetup.sectionAssignmentSetup.totalFinalPoints = possiblePoints.toFixed(2).toString();
                    activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach((assignment, i) => {
                        assignment.sectionAssignments.forEach((item, j) => {
                            if (item.possiblePoints) {
                                this.calculatePercentage(item.possiblePoints, i, j);
                            }
                        });
                    });
                }
            }
            this.setState({
                activitiesSetup: activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpand.name, e));
        }
    }

    private onFinishCopy = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            const {
                courseSectionId
            } = this.state;

            if (sectionId) {
                LayoutActions.setLoading(true);
                Requests.postSaveActivitiesCopy(courseSectionId, sectionId, this.resolvePostSaveCopyActivities);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinishCopy.name, e));
        }
    };

    private onSave = (): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                activitiesSetup,
                saveActivities
            } = this.state;

            if (activitiesSetup) {
                saveActivities.assignmentTypes = activitiesSetup.sectionAssignmentSetup.assignmentTypes;
                activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach((assingment, i) => {
                    if (saveActivities.assignmentTypes) {
                        saveActivities.assignmentTypes[i].isExpanded = false;
                        saveActivities.assignmentTypes[i].assignments = assingment.sectionAssignments;
                    }
                });
                saveActivities.sectionId = sectionId;
                LayoutActions.setLoading(true);
                activitiesSetup.sectionAssignmentValidationResult.status = 0;
                this.setState({
                    activitiesSetup: activitiesSetup
                });
                Requests.postSaveActivities(saveActivities, this.resolvePostSaveActivities);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
        }
    };

    private onSaveActivity = (): void => {
        try {
            const {
                sectionId,
            } = this.props;
            const {
                activitySetupItems,
                activityType,
                isValidDateAssignedDate,
                isValidDateDueDate,
                isValidDueDate
            } = this.state;

            if (!activitySetupItems.type) {
                activitySetupItems.type = activityType;
            }

            if (!isValidDateAssignedDate || activitySetupItems.assignedDate === '') {
                activitySetupItems.assignedDate = undefined;
            }

            if (!isValidDateDueDate || activitySetupItems.dueDate === '') {
                activitySetupItems.dueDate = undefined;
            }

            if (!activitySetupItems.possiblePoints) {
                activitySetupItems.possiblePoints = undefined;
            }

            if (activitySetupItems && activitySetupItems.title && activitySetupItems.type && isValidDueDate) {
                if (activitySetupItems.possiblePoints) {
                    if (activitySetupItems.possiblePoints <= 99999) {
                        LayoutActions.setLoading(true);
                        activitySetupItems.sectionId = sectionId;
                        Requests.postValidateActivityName(activitySetupItems, this.resolveIsValidName);
                        this.setState({
                            activitySetupItems: activitySetupItems,
                            isActivityTypeRequired: false,
                            isPossiblePoints: false,
                            isTitleRequired: false
                        });
                    }
                    else {
                        this.setState({
                            activitySetupItems: activitySetupItems,
                            isActivityTypeRequired: false,
                            isPossiblePoints: true,
                            isTitleRequired: false
                        });
                    }
                }
                else {
                    LayoutActions.setLoading(true);
                    activitySetupItems.sectionId = sectionId;
                    Requests.postValidateActivityName(activitySetupItems, this.resolveIsValidName);
                    this.setState({
                        activitySetupItems: activitySetupItems,
                        isActivityTypeRequired: false,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else {
                this.setState({
                    activitySetupItems: activitySetupItems,
                    isActivityTypeRequired: !activitySetupItems.type,
                    isTitleRequired: !activitySetupItems.title
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveActivity.name, e));
        }
    };

    private onSaveAddActivity = (): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                activityType,
                addActivityItems,
                isValidDateAssignedDate,
                isValidDateDueDate,
                isValidDueDate,
            } = this.state;

            if (!addActivityItems.type) {
                addActivityItems.type = activityType;
            }

            if (!isValidDateAssignedDate || addActivityItems.assignedDate === '') {
                addActivityItems.assignedDate = undefined;
            }

            if (!isValidDateDueDate || addActivityItems.dueDate === '') {
                addActivityItems.dueDate = undefined;
            }

            if (!addActivityItems.possiblePoints) {
                addActivityItems.possiblePoints = undefined;
            }

            if (addActivityItems && addActivityItems.title && addActivityItems.type && isValidDueDate) {
                if (addActivityItems.possiblePoints) {
                    if (addActivityItems.possiblePoints <= 99999) {
                        LayoutActions.setLoading(true);
                        addActivityItems.sectionId = sectionId;
                        Requests.postValidateActivityName(addActivityItems, this.resolveIsValidName);
                        this.setState({
                            addActivityItems: addActivityItems,
                            isActivityTypeRequired: false,
                            isAddActivity: true,
                            isCopyActivity: false,
                            isPossiblePoints: false,
                            isTitleRequired: false
                        });
                    }
                    else {
                        this.setState({
                            addActivityItems: addActivityItems,
                            isActivityTypeRequired: false,
                            isPossiblePoints: true,
                            isTitleRequired: false
                        });
                    }
                }
                else {
                    LayoutActions.setLoading(true);
                    addActivityItems.sectionId = sectionId;
                    Requests.postValidateActivityName(addActivityItems, this.resolveIsValidName);
                    this.setState({
                        addActivityItems: addActivityItems,
                        isActivityTypeRequired: false,
                        isAddActivity: true,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else {
                this.setState({
                    addActivityItems: addActivityItems,
                    isActivityTypeRequired: !addActivityItems.type,
                    isTitleRequired: !addActivityItems.title
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAddActivity.name, e));
        }
    };

    private onSaveCopyActivity = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            const {
                activityType,
                copyActivity,
                cultures,
                isValidDueDate
            } = this.state;

            if (!copyActivity.type) {
                copyActivity.type = activityType;
            }

            if (copyActivity && copyActivity.title && copyActivity.type && isValidDueDate) {
                if (!copyActivity.isAssignedDateChanged || copyActivity.isAssignedDateChanged === undefined) {
                    copyActivity.assignedDate = Format.toDatePicker(cultures.shortDatePattern, copyActivity.assignedDate);
                }
                if (!copyActivity.isdueDateChanged || copyActivity.isdueDateChanged === undefined) {
                    copyActivity.dueDate = Format.toDatePicker(cultures.shortDatePattern, copyActivity.dueDate);
                }
                if (copyActivity.possiblePoints) {
                    if (copyActivity.possiblePoints <= 99999) {
                        LayoutActions.setLoading(true);
                        copyActivity.sectionId = sectionId;
                        Requests.postValidateActivityName(copyActivity, this.resolveIsValidName);
                        this.setState({
                            isActivityTypeRequired: false,
                            isAddActivity: false,
                            isCopyActivity: true,
                            isPossiblePoints: false,
                            isTitleRequired: false
                        });
                    }
                    else {
                        this.setState({
                            isActivityTypeRequired: false,
                            isPossiblePoints: true,
                            isTitleRequired: false
                        });
                    }
                }
                else {
                    LayoutActions.setLoading(true);
                    copyActivity.sectionId = sectionId;
                    Requests.postValidateActivityName(copyActivity, this.resolveIsValidName);
                    this.setState({
                        isActivityTypeRequired: false,
                        isPossiblePoints: false,
                        isTitleRequired: false
                    });
                }
            }
            else {
                this.setState({
                    isActivityTypeRequired: !copyActivity.type,
                    isTitleRequired: !copyActivity.title
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveCopyActivity.name, e));
        }
    };

    private onOpenPopper = (event: any): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            const targetId: string = event.currentTarget.id;
            const targetSplit: string[] = targetId.split('_');
            const iAssignmentType: number = Number(targetSplit[1]);
            const iSectionAssignment: number = Number(targetSplit[2]);

            if (activitiesSetup?.sectionAssignmentSetup.assignmentTypes) {
                activitiesSetup.sectionAssignmentSetup.assignmentTypes[iAssignmentType].sectionAssignments[iSectionAssignment].isOpenInfo = true;
            }

            this.setState({
                anchorEl: event.currentTarget,
                activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            const {
                anchorEl,
                activitiesSetup
            } = this.state;

            const targetId: string = anchorEl.id;
            const targetSplit: string[] = targetId.split('_');
            const iAssignmentType: number = Number(targetSplit[1]);
            const iSectionAssignment: number = Number(targetSplit[2]);

            if (activitiesSetup?.sectionAssignmentSetup.assignmentTypes) {
                activitiesSetup.sectionAssignmentSetup.assignmentTypes[iAssignmentType].sectionAssignments[iSectionAssignment].isOpenInfo = false;
            }

            this.setState({
                anchorEl: null,
                activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private calculate = (): void => {
        try {
            const {
                activitiesSetup
            } = this.state;
            let countAllMidterm: number = 0;
            let countAllFinal: number = 0;
            if (activitiesSetup) {
                if (activitiesSetup.sectionAssignmentSetup.weightMethod === 2) {
                    activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(items => {
                        items.sectionAssignments.forEach(item => {
                            if (!item.isExtraCredit && item.midtermWeight) {
                                countAllMidterm += Number(item.midtermWeight);
                            }
                            if (!item.isExtraCredit && item.finalWeight) {
                                countAllFinal += Number(item.finalWeight);
                            }
                        });
                    });
                    this.calculatePercentageMidterm(countAllMidterm);
                    this.calculatePercentageFinal(countAllFinal);
                }
                else {
                    activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach((items, i) => {
                        items.sectionAssignments.forEach((item, j) => {
                            if (item.midtermWeight && !item.isExtraCredit) {
                                countAllMidterm += item.midtermWeight;
                                this.calculatePercentage(item.possiblePoints ? item.possiblePoints : 0, i, j);
                            }
                            else if (item.midtermWeight && item.isExtraCredit) {
                                this.calculatePercentage(item.possiblePoints ? item.possiblePoints : 0, i, j);
                            }
                            else if (item.finalWeight && !item.isExtraCredit) {
                                countAllFinal += item.finalWeight;
                                this.calculatePercentage(item.possiblePoints ? item.possiblePoints : 0, i, j);
                            }
                            else if (item.finalWeight && item.isExtraCredit) {
                                this.calculatePercentage(item.possiblePoints ? item.possiblePoints : 0, i, j);
                            }
                        });
                    });
                }
            }

            this.setState({
                activitiesSetup: activitiesSetup,
                countAllFinal: countAllFinal,
                countAllMidterm: countAllMidterm
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculate.name, e));
        }
    };

    private calculateWeight = (): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let midtermWeight: number = 0;
            let finalWeight: number = 0;
            let numMidtermAssignment: number = 0;
            let numFinalAssingment: number = 0;
            let numPossiblePoints: number = 0;
            const totalMidtermAssignment: number[] = [];
            const totalFinalAssignment: number[] = [];
            const totalPossiblePoints: number[] = [];
            let finalPercentage: number = 0;
            let percentage: number = 0;
            const weightTypeValue: number[] = [];
            const weightFinalTypeValue: number[] = [];
            const percentageByType: number[] = [];
            const percentageFinalByType: number[] = [];

            if (activitiesSetup) {
                activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(items => {
                    if (items.midtermWeight) {
                        weightTypeValue.push(items.midtermWeight);
                        midtermWeight += items.midtermWeight;
                    }

                    if (items.finalWeight) {
                        weightFinalTypeValue.push(items.finalWeight);
                        finalWeight += items.finalWeight;
                    }

                    items.sectionAssignments.forEach(item => {
                        if (!item.isExtraCredit && item.midtermWeight) {
                            numMidtermAssignment += 1;
                        }

                        if (!item.isExtraCredit && item.finalWeight) {
                            numFinalAssingment += 1;
                        }

                        if (!item.isExtraCredit && item.possiblePoints) {
                            numPossiblePoints += Number(item.possiblePoints);
                        }
                    });

                    totalMidtermAssignment.push(numMidtermAssignment);
                    totalFinalAssignment.push(numFinalAssingment);
                    totalPossiblePoints.push(numPossiblePoints);
                    numFinalAssingment = 0;
                    numMidtermAssignment = 0;
                    numPossiblePoints = 0;
                });

                weightTypeValue.forEach(weight => {
                    percentage = Number((weight * 100) / midtermWeight);
                    percentageByType.push(percentage);
                });

                weightFinalTypeValue.forEach(weight => {
                    finalPercentage = Number((weight * 100) / finalWeight);
                    percentageFinalByType.push(finalPercentage);
                });

                activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach((types, i) => {
                    let midTermValue: string = '';
                    let finalValue: string = '';
                    types.sectionAssignments.forEach((assignment, j) => {
                        if (activitiesSetup.sectionAssignmentSetup.weightMethod === 1) {
                            if (!assignment.isExtraCredit && assignment.possiblePoints) {
                                midTermValue =
                                    (Number((types.midtermWeight) * 100 / midtermWeight) *
                                        Number(assignment.possiblePoints)
                                        / Number(totalPossiblePoints[i])).toFixed(2).toString();
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[i].sectionAssignments[j].midtermPercentage =
                                    Number(midTermValue);
                                finalValue =
                                    (Number((types.finalWeight) * 100 / finalWeight) *
                                        Number(assignment.possiblePoints)
                                        / Number(totalPossiblePoints[i])).toFixed(2).toString();
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[i].sectionAssignments[j].finalPercentage =
                                    Number(finalValue);
                            }
                        }
                        else {
                            if (activitiesSetup.sectionAssignmentSetup.showMidterm && types.midtermWeight > 0) {
                                this.calculatePercentageMidtermByWeight(i);
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[i].sectionAssignments[j].midtermPercentage = 0;
                            }
                            if (types.finalWeight > 0) {
                                this.caluclatePercentageFinalByWeight(i);
                            }
                            else {
                                activitiesSetup.sectionAssignmentSetup.assignmentTypes[i].sectionAssignments[j].finalPercentage = 0;
                            }
                        }
                    });
                });
            }

            this.setState({
                activitiesSetup: activitiesSetup,
                percentageFinalBytype: percentageFinalByType,
                percentageMidtermBytype: percentageByType
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculateWeight.name, e));
        }
    };

    private calculatePercentageByWeight = (isMidterm: boolean, isByPoints: boolean, index: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let totalMidtermPointsAssignment: number = 0;
            let totalFinalPointsAssignment: number = 0;
            let midtermPercentage: string = '';
            let finalPercentage: string = '';
            let totalMidtermAssignment = 0;
            let totalFinalAssignmnet = 0;
            let totalTypesMidterm: number = 0;
            let totalTypesFinal: number = 0;
            let percentageTypeMidterm: number = 0;
            let percentageTypeFinal: number = 0;

            if (activitiesSetup) {
                if (isByPoints) {
                    activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(types => {
                        if (types.midtermWeight) {
                            totalTypesMidterm += 1;
                        }

                        if (types.finalWeight) {
                            totalTypesFinal += 1;
                        }
                    });

                    if (totalTypesFinal > 0) {
                        percentageTypeFinal = 100 / totalTypesFinal;
                    }
                    if (totalTypesMidterm > 0) {
                        percentageTypeMidterm = 100 / totalTypesMidterm;
                    }

                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach(item => {
                        if (!item.isExtraCredit && item.midtermWeight && item.possiblePoints) {
                            totalMidtermPointsAssignment = Number(totalMidtermPointsAssignment) + Number(item.possiblePoints);
                        }

                        if (!item.isExtraCredit && item.finalWeight && item.possiblePoints) {
                            totalFinalPointsAssignment = Number(totalFinalPointsAssignment) + Number(item.possiblePoints);
                        }
                    });
                    activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                        if (!assignment.isExtraCredit && assignment.midtermWeight && assignment.possiblePoints) {
                            midtermPercentage =
                                Number((assignment.possiblePoints * percentageTypeMidterm) / totalMidtermPointsAssignment).toFixed(2).toString();
                            assignment.midtermPercentage = Number(midtermPercentage);
                        }

                        if (!assignment.isExtraCredit && assignment.finalWeight && assignment.possiblePoints) {
                            finalPercentage =
                                Number((assignment.possiblePoints * percentageTypeFinal) / totalFinalPointsAssignment).toFixed(2).toString();
                            assignment.finalPercentage = Number(finalPercentage);
                        }
                    });
                }
                else {
                    activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(types => {
                        if (isMidterm) {
                            if (types.midtermWeight) {
                                totalTypesMidterm += 1;
                            }
                        }
                        else {
                            if (types.finalWeight) {
                                totalTypesFinal += 1;
                            }
                        }
                    });

                    if (isMidterm) {
                        percentageTypeMidterm = 100 / totalTypesMidterm;
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach(item => {
                            if (!item.isExtraCredit && item.midtermWeight) {
                                totalMidtermAssignment += 1;
                            }
                        });
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                            if (!assignment.isExtraCredit && assignment.midtermWeight) {
                                midtermPercentage = (Number((1 * percentageTypeMidterm) / totalMidtermAssignment).toFixed(2)).toString();
                                assignment.midtermPercentage = Number(midtermPercentage);
                            }
                        });
                    }
                    else {
                        percentageTypeFinal = 100 / totalTypesFinal;
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach(item => {
                            if (!item.isExtraCredit && item.finalWeight) {
                                totalFinalAssignmnet += 1;
                            }
                        });
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                            if (!assignment.isExtraCredit && assignment.midtermWeight) {
                                finalPercentage = (Number((1 * percentageTypeFinal) / totalFinalAssignmnet).toFixed(2)).toString();
                                assignment.finalPercentage = Number(finalPercentage);
                            }
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentageByWeight.name, e));
        }
    };

    private caluclatePercentageFinalByWeight = (index: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let percentageFinalWeight: string = '';
            let percentageTypeFinal: number = 0;
            let totalTypesFinal: number = 0;
            let totalFinalAssignment: number = 0;

            if (activitiesSetup) {
                activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(type => {
                    if (type.finalWeight) {
                        totalTypesFinal += 1;
                    }
                });

                percentageTypeFinal = 100 / totalTypesFinal;
                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                    if (!assignment.isExtraCredit && assignment.finalWeight) {
                        totalFinalAssignment += Number(assignment.finalWeight);
                    }
                });

                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach((item, i) => {
                    if (!item.isExtraCredit && item.finalWeight) {
                        percentageFinalWeight =
                            (Number((item.finalWeight * percentageTypeFinal) / totalFinalAssignment).toFixed(2)).toString();
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[i].finalPercentage =
                            Number(percentageFinalWeight);
                    }
                });

                this.setState({
                    activitiesSetup: activitiesSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.caluclatePercentageFinalByWeight.name, e));
        }
    };

    private calculatePercentageMidtermByWeight = (index: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let percentageMidtermWeight: string = '';
            let percentageTypeMidterm: number = 0;
            let totalTypesMidterm: number = 0;
            let totalMidtermAssignment: number = 0;

            if (activitiesSetup) {
                activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(type => {
                    if (type.midtermWeight) {
                        totalTypesMidterm += 1;
                    }
                });

                percentageTypeMidterm = 100 / totalTypesMidterm;
                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach(assignment => {
                    if (!assignment.isExtraCredit && assignment.midtermWeight) {
                        totalMidtermAssignment += Number(assignment.midtermWeight);
                    }
                });

                activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments.forEach((item, i) => {
                    if (!item.isExtraCredit && item.midtermWeight) {
                        percentageMidtermWeight =
                            (Number((item.midtermWeight * percentageTypeMidterm) / totalMidtermAssignment).toFixed(2)).toString();
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[i].midtermPercentage =
                            Number(percentageMidtermWeight);
                    }
                });

                this.setState({
                    activitiesSetup: activitiesSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentageMidtermByWeight.name, e));
        }
    };

    private calculatePercentage = (value: number, index: number, subIndex: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let percentageMidterm: number = 0;
            let percentageFinal: number = 0;
            let midtermMaxDrop: number = 0;
            let finalMaxDrop: number = 0;

            if (activitiesSetup) {
                switch (activitiesSetup.sectionAssignmentSetup.weightMethod) {
                    case 1:
                        percentageMidterm = Number((value * 100) /
                            Number(activitiesSetup.sectionAssignmentSetup.totalMidtermPoints));
                        percentageFinal = Number((value * 100) /
                            Number(activitiesSetup.sectionAssignmentSetup.totalFinalPoints));
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[subIndex].midtermPercentage =
                            Number(percentageMidterm.toFixed(2).toString());
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[subIndex].finalPercentage =
                            Number(percentageFinal.toFixed(2).toString());
                        break;

                    case 3:
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach(item => {
                            midtermMaxDrop += item.midtermMaxDrop;
                            finalMaxDrop += item.finalMaxDrop;
                        });
                        percentageMidterm = Number(100 / midtermMaxDrop);
                        percentageFinal = Number(100 / finalMaxDrop);
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[subIndex].midtermPercentage =
                            Number(percentageMidterm.toFixed(2).toString());
                        activitiesSetup.sectionAssignmentSetup.assignmentTypes[index].sectionAssignments[subIndex].finalPercentage =
                            Number(percentageFinal.toFixed(2).toString());
                        break;
                }

            }

            this.setState({
                activitiesSetup: activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentage.name, e));
        }
    };

    private calculatePercentageFinal = (totalFinal: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let percentageFinal: number = 0;

            if (activitiesSetup) {
                activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach((items, i) => {
                    items.sectionAssignments.forEach((item, j) => {
                        if (item.finalWeight) {
                            percentageFinal = Number((100 / totalFinal) * item.finalWeight);
                            activitiesSetup.sectionAssignmentSetup.assignmentTypes[i].
                                sectionAssignments[j].finalPercentage = Number(percentageFinal.toFixed(2).toString());
                        }
                    });
                });
            }

            this.setState({
                activitiesSetup: activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentageFinal.name, e));
        }
    };

    private calculatePercentageMidterm = (totalMidterm: number): void => {
        try {
            const {
                activitiesSetup
            } = this.state;

            let percentageMidterm: number = 0;

            if (activitiesSetup) {
                activitiesSetup.sectionAssignmentSetup.assignmentTypes.forEach((items, i) => {
                    items.sectionAssignments.forEach((item, j) => {
                        if (item.midtermWeight) {
                            percentageMidterm = Number((100 / totalMidterm) * item.midtermWeight);
                            activitiesSetup.sectionAssignmentSetup.assignmentTypes[i].
                                sectionAssignments[j].midtermPercentage = Number(percentageMidterm.toFixed(2).toString());
                        }
                    });
                });
            }

            this.setState({
                activitiesSetup: activitiesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.calculatePercentageMidterm.name, e));
        }
    };

    private formatDatesForRequest = (assignment: IAssignments): void => {
        const {
            cultures
        } = this.state;

        assignment.dueDate = Format.toDatePicker(cultures.shortDatePattern, assignment.dueDate);
        assignment.assignedDate = Format.toDatePicker(cultures.shortDatePattern, assignment.assignedDate);
        assignment.assignmentEndDate = Format.toDatePicker(cultures.shortDatePattern, assignment.assignmentEndDate);
    }

    private isValidDueDate = (assignment: IAssignments): boolean => {
        let isValid: boolean = true;

        if (assignment.assignedDate && assignment.dueDate) {
            isValid = moment(assignment.dueDate).isSameOrAfter(assignment.assignedDate);
        }

        return isValid;
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetActivities = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetActivities.name, this.hideAllLoaders);

            if (result?.status) {
                const activities: ISectionAssignmentsSetup = result.data;
                if (activities.sectionAssignmentSetup.assignmentTypes?.length > 0) {
                    activities.sectionAssignmentSetup.assignmentTypes.forEach(activity => {
                        activity.isExpanded = false;
                    });
                }
                this.setState({
                    activitiesSetup: activities,
                    isRestricted: activities.isRestricted,
                    weightType: activities.sectionAssignmentSetup.weightMethod
                }, this.hideLoader);
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetActivities.name, e));
        }
    };

    private resolvePostDeleteActivity = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteActivity.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    activitySetupItems: {},
                    addActivity: false,
                    editActivity: false
                });
                Requests.getSetupActivities(sectionId, this.resolveGetActivities);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteActivity.name, e));
        }
    };

    private resolveGetGradeActivity = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetGradeActivity.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    gradeActivity: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetGradeActivity.name, e));
        }
    };

    private resolveIsValidName = (json: string): void => {
        try {
            const {
                activitySetupItems,
                addActivityItems,
                copyActivity,
                isAddActivity,
                isCopyActivity
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveIsValidName.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    if (isAddActivity) {
                        this.formatDatesForRequest(addActivityItems);
                        Requests.postSaveActivity(addActivityItems, this.resolvePostSaveActivity);
                    }
                    else if (isCopyActivity) {
                        this.formatDatesForRequest(copyActivity);
                        Requests.postSaveActivity(copyActivity, this.resolvePostSaveActivity);
                    }
                    else {
                        this.formatDatesForRequest(activitySetupItems);
                        Requests.postSaveActivity(activitySetupItems, this.resolvePostSaveActivity);
                    }
                    this.setState({
                        isValidName: false
                    });
                }
                else {
                    this.setState({
                        isValidName: true
                    }, () => LayoutActions.setLoading(false));
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveIsValidName.name, e));
        }
    };

    private resolvePostCopyActivities = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            LayoutActions.setLoading(false);
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostCopyActivities.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                this.setState({
                    activitySetupItems: {},
                    addActivity: false,
                    editActivity: false
                });

                LayoutActions.setLoading(true);
                Requests.getSetupActivities(sectionId, this.resolveGetActivities);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostCopyActivities.name, e));
        }
    };

    private resolvePostSaveActivity = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            LayoutActions.setLoading(false);

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveActivity.name, this.hideAllLoaders);
            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                this.setState({
                    activitySetupItems: {},
                    addActivity: false,
                    addActivityItems: {},
                    copyActivity: {},
                    editActivity: false,
                    isAddActivity: false,
                    isCopyActivity: false,
                    isValidDueDate: true,
                    isValidName: false
                });

                LayoutActions.setLoading(true);
                Requests.getSetupActivities(sectionId, this.resolveGetActivities);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveActivity.name, e));
        }
    };

    private resolvePostSaveActivities = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            LayoutActions.setLoading(false);

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveActivities.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                this.setState({
                    activitySetupItems: {},
                    addActivity: false,
                    editActivity: false
                });

                LayoutActions.setLoading(true);
                Requests.getSetupActivities(sectionId, this.resolveGetActivities);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveActivities.name, e));
        }
    };

    private resolvePostSaveCopyActivities = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            LayoutActions.setLoading(false);

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveCopyActivities.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                this.setState({
                    activitySetupItems: {},
                    addActivity: false,
                    addActivityItems: {},
                    copyActivitiesAssignments: undefined,
                    copyActivity: {},
                    editActivity: false,
                    isAddActivity: false,
                    isCopyActivities: false,
                    isCopyActivity: false,
                    isFinishButton: true,
                    isValidDueDate: true,
                    isValidName: false
                });

                LayoutActions.setLoading(true);
                Requests.getSetupActivities(sectionId, this.resolveGetActivities);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveCopyActivities.name, e));
        }
    };

    private resolveUpdateWeightType = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveUpdateWeightType.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    changeActivity: false
                });
                Requests.getSetupActivities(sectionId, this.resolveGetActivities);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveUpdateWeightType.name, e));
        }
    };

    private resolveGetSectionName = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSectionName.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    sectionName: result.data.eventName
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSectionName.name, e));
        }
    };

    private resolveGetSectionsPeriods = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSectionsPeriods.name, this.hideAllLoaders);

            LayoutActions.setLoading(false);
            if (result?.status) {
                const copyActivities: ISectionCopyActivities = result.data;
                copyActivities.defaultSection = { description: '', value: '' };
                this.setState({
                    copyActivities: copyActivities,
                    isCopyActivities: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSectionsPeriods.name, e));
        }
    };

    private resolveGetSectionsCourses = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSectionsCourses.name, this.hideAllLoaders);

            LayoutActions.setLoading(false);
            if (result?.status) {
                this.setState({
                    sectionsCourses: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSectionsCourses.name, e));
        }
    };

    private resolveGetSectionsAssignments = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSectionsAssignments.name, this.hideAllLoaders);

            LayoutActions.hidePageLoader();
            if (result?.status) {
                this.setState({
                    copyActivitiesAssignments: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSectionsAssignments.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                Store.setResources(this.props.myPosition, result.data);
                this.setState({
                    resources: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                sectionId
            } = this.props;
            const {
                resources
            } = this.state;

            if (!resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
            RequestsSection.getSection(sectionId, false, this.resolveGetSectionName);
            Requests.getGradeActivity(this.resolveGetGradeActivity);
            Requests.getSetupActivities(sectionId, this.resolveGetActivities);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentDidCatch(error, info): void {
        this.setState({
            componentError: true
        }, () => {
            this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
            this.redirectError(500);
        });
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes,
            cultures,
            sectionId
        } = this.props;

        const {
            anchorEl,
            activitiesSetup,
            activitySetupItems,
            activityType,
            addActivity,
            addActivityItems,
            componentError,
            copyActivities,
            copyActivitiesAssignments,
            copyActivity,
            editActivity,
            gradeActivity,
            isActivityTypeRequired,
            isCopyActivities,
            isCopyActivity,
            isFinishButton,
            isLoading,
            isPossiblePoints,
            isRestricted,
            isTitleRequired,
            isValidDueDate,
            isValidName,
            isViewActivity,
            resources,
            sectionName,
            sectionsCourses
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrActivitiesSetup" height="md" />
            );
        }
        else if (!componentError && resources) {
            const weightActivitiesOptions: IDropDownOption[] = [
                { value: 1, description: resources.lblByPossiblePoints },
                { value: 2, description: resources.lblEnterForEachActivity },
                { value: 3, description: resources.lblEqually }
            ];

            if (activitiesSetup) {
                const msgErrors: string[] = [];
                {
                    activitiesSetup.sectionAssignmentValidationResult.errors.forEach(item => {
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

                let addActivityModal: JSX.Element | undefined;
                if (addActivity) {
                    addActivityModal = (
                        <ActivitiesAddModal
                            activityType={activityType}
                            activitySetupItems={addActivityItems}
                            copyActivities={copyActivity}
                            dateTimeCulture={cultures.dateTimeCulture}
                            firstDayOfWeek={cultures.firstDayOfWeek}
                            gradeActivity={gradeActivity}
                            isActivityTypeRequired={isActivityTypeRequired}
                            isCopyActivity={isCopyActivity}
                            isMidterm={activitiesSetup.sectionAssignmentSetup.showMidterm}
                            isPossiblePoints={isPossiblePoints}
                            isTitleRequired={isTitleRequired}
                            isValidDueDate={isValidDueDate}
                            isValidName={isValidName}
                            sectionId={sectionId}
                            sectionName={sectionName}
                            shortDatePattern={cultures.shortDatePattern}
                            weightType={activitiesSetup.sectionAssignmentSetup.weightMethod}
                            open={addActivity}
                            onCheckboxChange={this.onCheckboxChangeAdd}
                            onClose={this.onClose}
                            onDateTimeChange={this.onDateTimeChangeAdd}
                            onDropdownChange={this.onChangeDropDownAdd}
                            onSaveActivity={this.onSaveAddActivity}
                            onSaveCopy={this.onSaveCopyActivity}
                            onTextFieldChange={this.onChangeTextFieldModalAdd}
                            onTextFieldChangeCopy={this.onChangeTextFieldModalCopy}
                            resources={resources.activitiesAddModal}
                        />
                    );
                }

                let editActivityModal: JSX.Element | undefined;
                if (editActivity) {
                    editActivityModal = (
                        <ActivitiesEditModal
                            activityType={activityType}
                            dateTimeCulture={cultures.dateTimeCulture}
                            editActivitySetupItems={activitySetupItems}
                            firstDayOfWeek={cultures.firstDayOfWeek}
                            gradeActivity={gradeActivity}
                            isActivityTypeRequired={isActivityTypeRequired}
                            isMidterm={activitiesSetup.sectionAssignmentSetup.showMidterm}
                            isPossiblePoints={isPossiblePoints}
                            isTitleRequired={isTitleRequired}
                            isValidDueDate={isValidDueDate}
                            isValidName={isValidName}
                            isViewActivity={isViewActivity}
                            sectionId={sectionId}
                            sectionName={sectionName}
                            shortDatePattern={cultures.shortDatePattern}
                            weightType={activitiesSetup.sectionAssignmentSetup.weightMethod}
                            open={editActivity}
                            onCheckboxChange={this.onCheckboxChange}
                            onClose={this.onClose}
                            onDateTimeChange={this.onDateTimeChange}
                            onDropdownChange={this.onChangeDropDown}
                            onEditClick={this.onEditActivity}
                            onSaveActivity={this.onSaveActivity}
                            onTextFieldChange={this.onChangeTextFieldModal}
                            resources={resources.activitiesEditModal}
                        />
                    );
                }

                let copyActivitiesModal: JSX.Element | undefined;
                if (isCopyActivities) {
                    copyActivitiesModal = (
                        <ActivitiesCopyModal
                            copyActivities={copyActivities}
                            assignments={copyActivitiesAssignments}
                            isFinishButton={isFinishButton}
                            sectionsCourses={sectionsCourses}
                            open={isCopyActivities}
                            onClose={this.onClose}
                            onFinishCopy={this.onFinishCopy}
                            onDropdownChange={this.onDropdownCopyChange}
                            resources={resources.activities.activitiesTable}
                        />
                    );
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
                        <Grid container>
                            <Grid item xs={12}>
                                <Text size="h3">
                                    {resources.lblHowToWeight}
                                </Text>
                                <Divider
                                    noMarginBottom
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} className={classes.marginLeftCheck}>
                                <Checkbox
                                    disabled={isRestricted}
                                    id="chkWeightByType"
                                    checked={activitiesSetup.sectionAssignmentSetup.isWeightByType}
                                    label={resources.lblWeightByType}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs={12} md={4}>
                                <Dropdown
                                    disabled={isRestricted}
                                    id="ddlWeightActivities"
                                    label={resources.lblHowToWeight}
                                    options={weightActivitiesOptions}
                                    value={activitiesSetup.sectionAssignmentSetup.weightMethod}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Button
                                    disabled={isRestricted}
                                    id="btnChangeType"
                                    onClick={this.onChangeWeightActivity}
                                >
                                    {resources.btnChange}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                );

                contentPage = (
                    <>
                        {isRestricted && (
                            <Grid container>
                                <Grid item md={12}>
                                    <Alert
                                        id="msgIsRestricted"
                                        open
                                        text={resources.lblLegend}
                                        type={ResultType.info}
                                    />
                                </Grid>
                            </Grid>
                        )}
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <ExpansionPanel
                                    key="courseTemplatesOptions"
                                    header={header}
                                >
                                    {content}
                                </ExpansionPanel>
                            </Grid>
                        </Grid>
                        <br />
                        <Divider />

                        {activitiesSetup.sectionAssignmentSetup.assignmentTypes
                            && activitiesSetup.sectionAssignmentSetup.assignmentTypes.length > 0 ? (
                            <Grid container justifyContent="space-between">
                                <Grid item xs={6} md={9}>
                                    <Text size="h2">
                                        {resources.lblActivities}
                                    </Text>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <ButtonGroup
                                        id="btgActions"
                                    >
                                        <Grid container justifyContent="flex-end">
                                            {activitiesSetup.sectionAssignmentSetup.allowDeleteAll && (
                                                <>
                                                    <Grid item xs={4} md={3}>
                                                        <Tooltip
                                                            id="deleteActivity"
                                                            title={resources.btnDeleteAll}
                                                            aria-label={resources.btnDeleteAll}
                                                        >
                                                            <IconButton
                                                                disabled={isRestricted}
                                                                id="btnDelete"
                                                                onClick={this.onDeleteAll}
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={4} md={3}>
                                                        <Tooltip
                                                            id="copyActivity"
                                                            title={resources.btnCopyActivities}
                                                            aria-label={resources.btnCopyActivities}
                                                        >
                                                            <IconButton
                                                                disabled={isRestricted}
                                                                id="btnCopy"
                                                                onClick={this.onCopyActivities}
                                                            >
                                                                <Icon name="copy" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                </>
                                            )}
                                            <Grid item xs={4}>
                                                <Tooltip
                                                    id="addActivity"
                                                    title={resources.btnAddActivity}
                                                    aria-label={resources.btnAddActivity}
                                                >
                                                    <IconButton
                                                        disabled={isRestricted}
                                                        id="btnAdd"
                                                        onClick={this.onAddActivity}
                                                    >
                                                        <Icon name="add" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container justifyContent="flex-end">
                                <Grid item xs={6} md={3}>
                                    <ButtonGroup
                                        id="btgActions"
                                    >
                                        <Grid container justifyContent="flex-end">
                                            {activitiesSetup.sectionAssignmentSetup.allowDeleteAll && (
                                                <>
                                                    <Grid item xs={4} md={3}>
                                                        <Tooltip
                                                            id="deleteActivity"
                                                            title={resources.btnDeleteAll}
                                                            aria-label={resources.btnDeleteAll}
                                                        >
                                                            <IconButton
                                                                disabled={isRestricted}
                                                                id="btnDelete"
                                                                onClick={this.onDeleteAll}
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={4} md={3}>
                                                        <Tooltip
                                                            id="copyActivity"
                                                            title={resources.btnCopyActivities}
                                                            aria-label={resources.btnCopyActivities}
                                                        >
                                                            <IconButton
                                                                disabled={isRestricted}
                                                                id="btnCopy"
                                                                onClick={this.onCopyActivities}
                                                            >
                                                                <Icon name="copy" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                </>
                                            )}
                                            <Grid item xs={4}>
                                                <Tooltip
                                                    id="addActivity"
                                                    title={resources.btnAddActivity}
                                                    aria-label={resources.btnAddActivity}
                                                >
                                                    <IconButton
                                                        disabled={isRestricted}
                                                        id="btnAdd"
                                                        onClick={this.onAddActivity}
                                                    >
                                                        <Icon name="add" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                        )}

                        {activitiesSetup.sectionAssignmentValidationResult.status === 1 && (
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
                        )}
                        <br />
                        <br />
                        {activitiesSetup.sectionAssignmentSetup.assignmentTypes
                            && activitiesSetup.sectionAssignmentSetup.assignmentTypes.length > 0 ? (
                            <>
                                <Activities
                                    anchorEl={anchorEl}
                                    activitiesSetup={activitiesSetup.sectionAssignmentSetup}
                                    isRestricted={isRestricted}
                                    onBlurTextField={this.onBlurTextField}
                                    onCheckboxChange={this.onCheckBoxChangeTable}
                                    onCopy={this.onCopy}
                                    onDelete={this.onDelete}
                                    onEditClick={this.onEditActivity}
                                    onExpand={this.onExpand}
                                    onTextFieldChange={this.onChangeTextFieldTable}
                                    onOpenPopper={this.onOpenPopper}
                                    onClosePopper={this.onClosePopper}
                                    resources={resources.activities}
                                />
                                <br />
                                {activitiesSetup.sectionAssignmentSetup.weightMethod === 1
                                    && !activitiesSetup.sectionAssignmentSetup.isWeightByType ?
                                    (
                                        <>
                                            <Grid container>
                                                {activitiesSetup.sectionAssignmentSetup.showMidterm ?
                                                    (
                                                        <Grid item>
                                                            <Text>
                                                                {Format.toString(resources.formatTotalMidtermPoints,
                                                                    [activitiesSetup.sectionAssignmentSetup.totalMidtermPoints])}
                                                            </Text>
                                                        </Grid>
                                                    )
                                                    : undefined}
                                                <Grid item>
                                                    <Text>
                                                        {Format.toString(resources.formatTotalFinalPoints,
                                                            [activitiesSetup.sectionAssignmentSetup.totalFinalPoints])}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                            <br />
                                        </>
                                    )
                                    : undefined}
                                <Grid container>
                                    <Grid item xs>
                                        <ButtonGroup id="btgActions">
                                            <Button
                                                disabled={isRestricted}
                                                id="btnSave"
                                                onClick={this.onSave}
                                            >
                                                {resources.btnSave}
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <Grid container>
                                <Grid item xs={12}>
                                    <Illustration
                                        color="secondary"
                                        height="md"
                                        internalName="no-activities"
                                        text={resources.lblNoActivities}
                                    />
                                </Grid>
                            </Grid>
                        )
                        }
                        {addActivityModal}
                        {copyActivitiesModal}
                        {editActivityModal}
                    </>
                );
            }
            else {
                contentPage = (
                    <MessageStyled
                        classMessage="noResults"
                        message={resources.lblNoResults}
                    />
                );
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(ActivitiesSetup);