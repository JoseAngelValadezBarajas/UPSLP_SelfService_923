/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
* File: GradeMappings.tsx
* Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import GradeMappingsTable, { IGradeMappingsTableResProps } from './GradeMappingsTable';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IGradeMappingsResources } from '../../../Types/Resources/Classes/IGradeMappingsResources';
import { ISectionCopyActivities } from '../../../Types/Section/ISectionCopyActivities';
import { ISectionGradeMapping } from '../../../Types/Section/ISectionGradeMapping';
import { ISectionMapping } from '../../../Types/Section/ISectionMapping';

// Internal components
import GradeMappingsCopyModal from './GradeMappingsCopyModal';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/GradeMappings';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
export interface IGradeMappingsProps {
    cultures: ICultures;
    isAdministration?: boolean;
    myPosition: number;
    sectionId?: number; /* If there is no sectionId, the component is from Administration/GradeMappings */
}

interface IGradeMappingsRes extends IGradeMappingsResources {
    gradeMappingsTable: IGradeMappingsTableResProps;
}

interface IGradeMappingsState {
    componentError: boolean;
    confirmationModal: boolean;
    gradeMappings?: ISectionMapping;
    gradeMappingsCopy?: ISectionCopyActivities;
    isCopy: boolean;
    isCopyButton: boolean;
    isLoading: boolean;
    resources?: IGradeMappingsRes;
    sectionsCourses: IDropDownOption[];
    showShowPoints: boolean;
    showPoints: boolean;
}

const styles = createStyles({
    showPointsCheck: {
        textAlign: 'right'
    }
});

type PropsWithStyles = IGradeMappingsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class GradeMappings extends React.Component<PropsWithStyles, IGradeMappingsState> {
    private creditTypePosition: number;
    private fixedDigits: number;
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IGradeMappingsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.creditTypePosition = -1;
        this.fixedDigits = 2;
        this.idModule = 'Classes';
        this.idPage = 'GradeMappings';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IGradeMappingsState {
        let resources: IGradeMappingsRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            componentError: false,
            confirmationModal: false,
            isCopy: false,
            isCopyButton: true,
            isLoading: true,
            resources: resources,
            sectionsCourses: [],
            showPoints: false,
            showShowPoints: false
        };
    }

    // #region Functions
    private validateAmount(value: string | null): boolean {
        let isValid: boolean = false;
        let numberTest: number;
        if (value && value.match(/^(\d+\.?\d{0,2}|\.\d{1,2})$/g)) {
            isValid = true;
        }
        if (isValid) {
            numberTest = Number(value);
            isValid = !(isNaN(numberTest));
        }
        return isValid;
    }
    // #endregion Functions

    // #region Events
    private onChangePercent = (event: any): void => {
        try {
            const {
                gradeMappings,
                resources
            } = this.state;

            const position: string[] = event.target.id.split('_');
            const positionCreditType: number = Number(position[1]);
            const positionGradeValue: number = Number(position[2]);

            if (gradeMappings && resources) {
                const gradesList: ISectionGradeMapping[] = gradeMappings.gradeMappingList[positionCreditType].sectionList;
                const grade: ISectionGradeMapping = gradesList[positionGradeValue];
                let valueBeforeChange: string | null;
                let gradesBefore: ISectionGradeMapping[];
                let gradesAfter: ISectionGradeMapping[];

                if (event.target.value && event.target.value !== '') {
                    const gradeValue: string = event.target.value;
                    switch (position[0]) {
                        case 'txtMid':
                            // Modify the grade mapping
                            valueBeforeChange = String(grade.minimumMidtermPercentage);
                            gradeMappings.gradeMappingList[positionCreditType].modified = true;
                            grade.minimumMidtermPercentage = gradeValue;
                            grade.invalidMinimumMidtermPercentage = !this.validateAmount(grade.minimumMidtermPercentage);
                            grade.incorrectMinimumMidtermPercentage = false;
                            grade.incorrectMinimumMidtermPoints = false;
                            if (gradeMappings.midTermPoint && !grade.invalidMinimumMidtermPercentage) {
                                grade.minimumMidtermPoints = String(((Number(gradeValue) * gradeMappings.midTermPoint) / 100)
                                    .toFixed(this.fixedDigits));
                            }
                            grade.modified = true;

                            // Check if grade is less than grade before
                            if (!grade.invalidMinimumMidtermPercentage) {
                                if (positionGradeValue > 0 && gradesList.length > 1) {
                                    if (Number(grade.minimumMidtermPercentage) > Number(gradesList[positionGradeValue - 1]
                                        .minimumMidtermPercentage)) {
                                        grade.incorrectMinimumMidtermPercentage = true;
                                    }
                                    if (Number(grade.minimumMidtermPoints) > Number(gradesList[positionGradeValue - 1].minimumMidtermPoints)) {
                                        grade.incorrectMinimumMidtermPoints = true;
                                    }
                                    if (positionGradeValue < gradesList.length - 1) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumMidtermPercentage = false;
                                        gradesList[positionGradeValue + 1].incorrectMinimumMidtermPoints = false;
                                    }
                                }
                                if (gradesList.length > 1 && positionGradeValue < gradesList.length - 1) {
                                    gradesList[positionGradeValue + 1].incorrectMinimumMidtermPercentage =
                                        Number(grade.minimumMidtermPercentage) < Number(gradesList[positionGradeValue + 1].minimumMidtermPercentage);
                                    if (gradeMappings.midTermPoint) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumMidtermPoints =
                                            Number(grade.minimumMidtermPoints) < Number(gradesList[positionGradeValue + 1].minimumMidtermPoints);
                                    }
                                }
                            }

                            // Search if the value is repeated
                            gradesBefore = gradesList.filter(x =>
                                String(x.minimumMidtermPercentage) === valueBeforeChange
                                && x.minimumMidtermPercentage !== null
                                && x.minimumMidtermPercentage !== undefined);
                            gradesAfter = gradesList.filter(x =>
                                String(x.minimumMidtermPercentage) === grade.minimumMidtermPercentage
                                && x.minimumMidtermPercentage !== null
                                && x.minimumMidtermPercentage !== undefined);
                            if (gradesBefore && gradesBefore.length > 0) {
                                if (gradesBefore.length > 1) {
                                    gradesBefore.forEach(item => {
                                        item.errorMidtermPercentage = true;
                                    });
                                }
                                else {
                                    gradesBefore[0].errorMidtermPercentage = false;
                                }
                            }
                            if (gradesAfter && gradesAfter.length > 0) {
                                if (gradesAfter.length > 1) {
                                    gradesAfter.forEach(item => {
                                        item.errorMidtermPercentage = true;
                                    });
                                }
                                else {
                                    gradesAfter[0].errorMidtermPercentage = false;
                                }
                            }
                            this.setState({
                                gradeMappings: gradeMappings
                            });
                            break;
                        case 'txtFinal':
                            // Modify the grade mapping
                            valueBeforeChange = String(grade.minimumFinalPercentage);
                            gradeMappings.gradeMappingList[positionCreditType].modified = true;
                            grade.minimumFinalPercentage = gradeValue;
                            grade.invalidMinimumFinalPercentage = !this.validateAmount(grade.minimumFinalPercentage);
                            grade.incorrectMinimumFinalPercentage = false;
                            grade.incorrectMinimumFinalPoints = false;
                            if (gradeMappings.finalPoint) {
                                grade.minimumFinalPoints = String(((Number(gradeValue) * gradeMappings.finalPoint) / 100).toFixed(this.fixedDigits));
                            }
                            grade.modified = true;

                            // Check if grade is less than grade before
                            if (!grade.invalidMinimumFinalPercentage) {
                                if (positionGradeValue > 0 && gradesList.length > 1) {
                                    if (Number(grade.minimumFinalPercentage) > Number(gradesList[positionGradeValue - 1].minimumFinalPercentage)) {
                                        grade.incorrectMinimumFinalPercentage = true;
                                    }
                                    if (Number(grade.minimumFinalPoints) > Number(gradesList[positionGradeValue - 1].minimumFinalPoints)) {
                                        grade.incorrectMinimumFinalPoints = true;
                                    }
                                    if (positionGradeValue < gradesList.length - 1) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumFinalPercentage = false;
                                        gradesList[positionGradeValue + 1].incorrectMinimumFinalPoints = false;
                                    }
                                }
                                if (gradesList.length > 1 && positionGradeValue < gradesList.length - 1) {
                                    gradesList[positionGradeValue + 1].incorrectMinimumFinalPercentage =
                                        Number(grade.minimumFinalPercentage) < Number(gradesList[positionGradeValue + 1].minimumFinalPercentage);
                                    if (gradeMappings.finalPoint) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumFinalPoints =
                                            Number(grade.minimumFinalPoints) < Number(gradesList[positionGradeValue + 1].minimumFinalPoints);
                                    }
                                }
                            }

                            // Search if the value is repeated
                            gradesBefore = gradesList.filter(x =>
                                String(x.minimumFinalPercentage) === valueBeforeChange
                                && x.minimumFinalPercentage !== null
                                && x.minimumFinalPercentage !== undefined);
                            gradesAfter = gradesList.filter(x =>
                                String(x.minimumFinalPercentage) === grade.minimumFinalPercentage
                                && x.minimumFinalPercentage !== null
                                && x.minimumFinalPercentage !== undefined);
                            if (gradesBefore && gradesBefore.length > 0) {
                                if (gradesBefore.length > 1) {
                                    gradesBefore.forEach(item => {
                                        item.errorFinalPercentage = true;
                                    });
                                }
                                else {
                                    gradesBefore[0].errorFinalPercentage = false;
                                }
                            }
                            if (gradesAfter && gradesAfter.length > 0) {
                                if (gradesAfter.length > 1) {
                                    gradesAfter.forEach(item => {
                                        item.errorFinalPercentage = true;
                                    });
                                }
                                else {
                                    gradesAfter[0].errorFinalPercentage = false;
                                }
                            }

                            this.setState({
                                gradeMappings: gradeMappings
                            });
                            break;
                    }
                }
                else {
                    switch (position[0]) {
                        case 'txtMid':
                            // Modify the grade mapping
                            valueBeforeChange = String(grade.minimumMidtermPercentage);
                            gradeMappings.gradeMappingList[positionCreditType].modified = true;
                            grade.invalidMinimumMidtermPercentage = false;
                            grade.minimumMidtermPercentage = null;
                            grade.minimumMidtermPoints = null;
                            grade.errorMidtermPercentage = false;
                            grade.incorrectMinimumMidtermPercentage = false;
                            grade.incorrectMinimumMidtermPoints = false;
                            grade.modified = true;

                            // Check if grade is less than grade before
                            if (!grade.invalidMinimumMidtermPercentage) {
                                if (positionGradeValue > 0 && gradesList.length > 1) {
                                    if (Number(grade.minimumMidtermPercentage) > Number(gradesList[positionGradeValue - 1]
                                        .minimumMidtermPercentage)) {
                                        grade.incorrectMinimumMidtermPercentage = true;
                                    }
                                    if (Number(grade.minimumMidtermPoints) > Number(gradesList[positionGradeValue - 1].minimumMidtermPoints)) {
                                        grade.incorrectMinimumMidtermPoints = true;
                                    }
                                    if (positionGradeValue < gradesList.length - 1) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumMidtermPercentage = false;
                                        gradesList[positionGradeValue + 1].incorrectMinimumMidtermPoints = false;
                                    }
                                }
                                if (gradesList.length > 1 && positionGradeValue < gradesList.length - 1) {
                                    gradesList[positionGradeValue + 1].incorrectMinimumMidtermPercentage =
                                        Number(grade.minimumMidtermPercentage) < Number(gradesList[positionGradeValue + 1].minimumMidtermPercentage);
                                    if (gradeMappings.midTermPoint) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumMidtermPoints =
                                            Number(grade.minimumMidtermPoints) < Number(gradesList[positionGradeValue + 1].minimumMidtermPoints);
                                    }
                                }
                            }

                            // Search if the value is repeated
                            gradesBefore = gradesList.filter(x =>
                                String(x.minimumMidtermPercentage) === valueBeforeChange
                                && x.minimumMidtermPercentage !== null
                                && x.minimumMidtermPercentage !== undefined);
                            gradesAfter = gradesList.filter(x =>
                                String(x.minimumMidtermPercentage) === grade.minimumMidtermPercentage);
                            if (gradesBefore && gradesBefore.length > 0) {
                                if (gradesBefore.length > 1) {
                                    gradesBefore.forEach(item => {
                                        item.errorMidtermPercentage = true;
                                    });
                                }
                                else {
                                    gradesBefore[0].errorMidtermPercentage = false;
                                }
                            }
                            if (gradesAfter && gradesAfter.length > 0) {
                                if (gradesAfter.length > 1) {
                                    gradesAfter.forEach(item => {
                                        item.errorMidtermPercentage = false;
                                    });
                                }
                            }

                            this.setState({
                                gradeMappings: gradeMappings
                            });
                            break;
                        case 'txtFinal':
                            // Modify the grade mapping
                            valueBeforeChange = String(grade.minimumFinalPercentage);
                            gradeMappings.gradeMappingList[positionCreditType].modified = true;
                            grade.invalidMinimumFinalPercentage = false;
                            grade.minimumFinalPercentage = null;
                            grade.minimumFinalPoints = null;
                            grade.errorFinalPercentage = false;
                            grade.incorrectMinimumFinalPercentage = false;
                            grade.incorrectMinimumFinalPoints = false;
                            grade.modified = true;

                            // Check if grade is less than grade before
                            if (!grade.invalidMinimumFinalPercentage) {
                                if (positionGradeValue > 0 && gradesList.length > 1) {
                                    if (Number(grade.minimumFinalPercentage) > Number(gradesList[positionGradeValue - 1].minimumFinalPercentage)) {
                                        grade.incorrectMinimumFinalPercentage = true;
                                    }
                                    if (Number(grade.minimumFinalPoints) > Number(gradesList[positionGradeValue - 1].minimumFinalPoints)) {
                                        grade.incorrectMinimumFinalPoints = true;
                                    }
                                    if (positionGradeValue < gradesList.length - 1) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumFinalPercentage = false;
                                        gradesList[positionGradeValue + 1].incorrectMinimumFinalPoints = false;
                                    }
                                }
                                if (gradesList.length > 1 && positionGradeValue < gradesList.length - 1) {
                                    gradesList[positionGradeValue + 1].incorrectMinimumFinalPercentage =
                                        Number(grade.minimumFinalPercentage) < Number(gradesList[positionGradeValue + 1].minimumFinalPercentage);
                                    if (gradeMappings.finalPoint) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumFinalPoints =
                                            Number(grade.minimumFinalPoints) < Number(gradesList[positionGradeValue + 1].minimumFinalPoints);
                                    }
                                }
                            }

                            // Search if the value is repeated
                            gradesBefore = gradesList.filter(x =>
                                String(x.minimumFinalPercentage) === valueBeforeChange
                                && x.minimumFinalPercentage !== null
                                && x.minimumFinalPercentage !== undefined);
                            gradesAfter = gradesList.filter(x =>
                                String(x.minimumFinalPercentage) === grade.minimumFinalPercentage);
                            if (gradesBefore && gradesBefore.length > 0) {
                                if (gradesBefore.length > 1) {
                                    gradesBefore.forEach(item => {
                                        item.errorFinalPercentage = true;
                                    });
                                }
                                else {
                                    gradesBefore[0].errorFinalPercentage = false;
                                }
                            }
                            if (gradesAfter && gradesAfter.length > 0) {
                                if (gradesAfter.length > 1) {
                                    gradesAfter.forEach(item => {
                                        item.errorFinalPercentage = false;
                                    });
                                }
                            }

                            this.setState({
                                gradeMappings: gradeMappings
                            });
                            break;
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePercent.name, e));
        }
    };

    private onChangePoint = (event: any): void => {
        try {
            const {
                gradeMappings,
                resources
            } = this.state;

            const position: string[] = event.target.id.split('_');
            const positionCreditType: number = Number(position[1]);
            const positionGradeValue: number = Number(position[2]);
            if (gradeMappings && resources) {
                const gradesList: ISectionGradeMapping[] = gradeMappings.gradeMappingList[positionCreditType].sectionList;
                const grade: ISectionGradeMapping = gradesList[positionGradeValue];
                let valueBeforeChange: string | null;
                let gradesBefore: ISectionGradeMapping[];
                let gradesAfter: ISectionGradeMapping[];

                if (event.target.value && event.target.value !== '') {
                    const gradePoint: string = event.target.value;

                    switch (position[0]) {
                        case 'txtMidPt':
                            if (gradeMappings.midTermPoint) {
                                if (Number(gradePoint) <= gradeMappings.midTermPoint) {
                                    // Modify the grade mapping
                                    valueBeforeChange = grade.minimumMidtermPoints;
                                    gradeMappings.gradeMappingList[positionCreditType].modified = true;
                                    grade.minimumMidtermPercentage = String(((Number(gradePoint) * 100) / gradeMappings.midTermPoint)
                                        .toFixed(this.fixedDigits));
                                    grade.minimumMidtermPoints = gradePoint;
                                    grade.invalidMinimumMidtermPoints = !this.validateAmount(grade.minimumMidtermPoints);
                                    grade.incorrectMinimumMidtermPoints = false;
                                    grade.incorrectMinimumMidtermPercentage = false;
                                    grade.modified = true;

                                    // Check if grade is less than grade before
                                    if (!grade.invalidMinimumMidtermPoints) {
                                        if (positionGradeValue > 0 && gradesList.length > 1) {
                                            if (Number(grade.minimumMidtermPoints) > Number(gradesList[positionGradeValue - 1]
                                                .minimumMidtermPoints)) {
                                                grade.incorrectMinimumMidtermPoints = true;
                                            }
                                            if (Number(grade.minimumMidtermPercentage) > Number(gradesList[positionGradeValue - 1]
                                                .minimumMidtermPercentage)) {
                                                grade.incorrectMinimumMidtermPercentage = true;
                                            }
                                            if (positionGradeValue < gradesList.length - 1) {
                                                gradesList[positionGradeValue + 1].incorrectMinimumMidtermPoints = false;
                                                gradesList[positionGradeValue + 1].incorrectMinimumMidtermPercentage = false;
                                            }
                                        }
                                        if (gradesList.length > 1 && positionGradeValue < gradesList.length - 1) {
                                            gradesList[positionGradeValue + 1].incorrectMinimumMidtermPoints =
                                                Number(grade.minimumMidtermPoints) < Number(gradesList[positionGradeValue + 1].minimumMidtermPoints);
                                            gradesList[positionGradeValue + 1].incorrectMinimumMidtermPercentage =
                                                Number(grade.minimumMidtermPercentage) < Number(gradesList[positionGradeValue + 1]
                                                    .minimumMidtermPercentage);
                                        }
                                    }

                                    // Search if the value is repeated
                                    gradesBefore = gradesList.filter(x =>
                                        String(x.minimumMidtermPoints) === valueBeforeChange
                                        && x.minimumMidtermPoints !== null
                                        && x.minimumMidtermPoints !== undefined);
                                    gradesAfter = gradesList.filter(x =>
                                        String(x.minimumMidtermPoints) === grade.minimumMidtermPoints
                                        && x.minimumMidtermPoints !== null
                                        && x.minimumMidtermPoints !== undefined);
                                    if (gradesBefore && gradesBefore.length > 0) {
                                        if (gradesBefore.length > 1) {
                                            gradesBefore.forEach(item => {
                                                item.errorMidtermPercentage = true;
                                            });
                                        }
                                        else {
                                            gradesBefore[0].errorMidtermPercentage = false;
                                        }
                                    }
                                    if (gradesAfter && gradesAfter.length > 0) {
                                        if (gradesAfter.length > 1) {
                                            gradesAfter.forEach(item => {
                                                item.errorMidtermPercentage = true;
                                            });
                                        }
                                        else {
                                            gradesAfter[0].errorMidtermPercentage = false;
                                        }
                                    }

                                    this.setState({
                                        gradeMappings: gradeMappings
                                    });
                                }
                            }
                            break;
                        case 'txtFinalPt':
                            if (gradeMappings.finalPoint) {
                                if (Number(gradePoint) <= gradeMappings.finalPoint) {
                                    // Modify the grade mapping
                                    valueBeforeChange = grade.minimumFinalPoints;
                                    gradeMappings.gradeMappingList[positionCreditType].modified = true;
                                    grade.minimumFinalPercentage = String(((Number(gradePoint) * 100) / gradeMappings.finalPoint)
                                        .toFixed(this.fixedDigits));
                                    grade.minimumFinalPoints = gradePoint;
                                    grade.invalidMinimumFinalPoints = !this.validateAmount(grade.minimumFinalPoints);
                                    grade.incorrectMinimumFinalPoints = false;
                                    grade.incorrectMinimumFinalPercentage = false;
                                    grade.modified = true;

                                    // Check if grade is less than grade before
                                    if (!grade.invalidMinimumFinalPoints) {
                                        if (positionGradeValue > 0 && gradesList.length > 1) {
                                            if (Number(grade.minimumFinalPoints) > Number(gradesList[positionGradeValue - 1].minimumFinalPoints)) {
                                                grade.incorrectMinimumFinalPoints = true;
                                            }
                                            if (Number(grade.minimumFinalPercentage) > Number(gradesList[positionGradeValue - 1]
                                                .minimumFinalPercentage)) {
                                                grade.incorrectMinimumFinalPercentage = true;
                                            }
                                            if (positionGradeValue < gradesList.length - 1) {
                                                gradesList[positionGradeValue + 1].incorrectMinimumFinalPoints = false;
                                                gradesList[positionGradeValue + 1].incorrectMinimumFinalPercentage = false;
                                            }
                                        }
                                        if (gradesList.length > 1 && positionGradeValue < gradesList.length - 1) {
                                            gradesList[positionGradeValue + 1].incorrectMinimumFinalPoints =
                                                Number(grade.minimumFinalPoints) < Number(gradesList[positionGradeValue + 1].minimumFinalPoints);
                                            gradesList[positionGradeValue + 1].incorrectMinimumFinalPercentage =
                                                Number(grade.minimumFinalPercentage) < Number(gradesList[positionGradeValue + 1]
                                                    .minimumFinalPercentage);
                                        }
                                    }

                                    // Search if the value is repeated
                                    gradesBefore = gradesList.filter(x =>
                                        String(x.minimumFinalPoints) === valueBeforeChange
                                        && x.minimumFinalPoints !== null
                                        && x.minimumFinalPoints !== undefined);
                                    gradesAfter = gradesList.filter(x =>
                                        String(x.minimumFinalPoints) === grade.minimumFinalPoints
                                        && x.minimumFinalPoints !== null
                                        && x.minimumFinalPoints !== undefined);
                                    if (gradesBefore && gradesBefore.length > 0) {
                                        if (gradesBefore.length > 1) {
                                            gradesBefore.forEach(item => {
                                                item.errorFinalPercentage = true;
                                            });
                                        }
                                        else {
                                            gradesBefore[0].errorFinalPercentage = false;
                                        }
                                    }
                                    if (gradesAfter && gradesAfter.length > 0) {
                                        if (gradesAfter.length > 1) {
                                            gradesAfter.forEach(item => {
                                                item.errorFinalPercentage = true;
                                            });
                                        }
                                        else {
                                            gradesAfter[0].errorFinalPercentage = false;
                                        }
                                    }

                                    this.setState({
                                        gradeMappings: gradeMappings
                                    });
                                }
                            }
                            break;
                    }
                }
                else {
                    switch (position[0]) {
                        case 'txtMidPt':
                            // Modify the grade mapping
                            valueBeforeChange = grade.minimumMidtermPoints;
                            gradeMappings.gradeMappingList[positionCreditType].modified = true;
                            grade.minimumMidtermPercentage = null;
                            grade.minimumMidtermPoints = null;
                            grade.errorMidtermPercentage = false;
                            grade.invalidMinimumMidtermPoints = false;
                            grade.incorrectMinimumMidtermPoints = false;
                            grade.incorrectMinimumMidtermPercentage = false;
                            grade.modified = true;

                            // Check if grade is less than grade before
                            if (!grade.invalidMinimumMidtermPoints) {
                                if (positionGradeValue > 0 && gradesList.length > 1) {
                                    if (Number(grade.minimumMidtermPoints) > Number(gradesList[positionGradeValue - 1].minimumMidtermPoints)) {
                                        grade.incorrectMinimumMidtermPoints = true;
                                    }
                                    if (Number(grade.minimumMidtermPercentage) > Number(gradesList[positionGradeValue - 1]
                                        .minimumMidtermPercentage)) {
                                        grade.incorrectMinimumMidtermPercentage = true;
                                    }
                                    if (positionGradeValue < gradesList.length - 1) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumMidtermPoints = false;
                                        gradesList[positionGradeValue + 1].incorrectMinimumMidtermPercentage = false;
                                    }
                                }
                                if (gradesList.length > 1 && positionGradeValue < gradesList.length - 1) {
                                    gradesList[positionGradeValue + 1].incorrectMinimumMidtermPoints =
                                        Number(grade.minimumMidtermPoints) < Number(gradesList[positionGradeValue + 1].minimumMidtermPoints);
                                    gradesList[positionGradeValue + 1].incorrectMinimumMidtermPercentage =
                                        Number(grade.minimumMidtermPercentage) < Number(gradesList[positionGradeValue + 1].minimumMidtermPercentage);
                                }
                            }

                            // Search if the value is repeated
                            gradesBefore = gradesList.filter(x =>
                                String(x.minimumMidtermPoints) === valueBeforeChange
                                && x.minimumMidtermPoints !== null
                                && x.minimumMidtermPoints !== undefined);
                            gradesAfter = gradesList.filter(x =>
                                String(x.minimumMidtermPoints) === grade.minimumMidtermPoints);
                            if (gradesBefore && gradesBefore.length > 0) {
                                if (gradesBefore.length > 1) {
                                    gradesBefore.forEach(item => {
                                        item.errorMidtermPercentage = true;
                                    });
                                }
                                else {
                                    gradesBefore[0].errorMidtermPercentage = false;
                                }
                            }
                            if (gradesAfter && gradesAfter.length > 0) {
                                if (gradesAfter.length > 1) {
                                    gradesAfter.forEach(item => {
                                        item.errorMidtermPercentage = false;
                                    });
                                }
                            }

                            this.setState({
                                gradeMappings: gradeMappings
                            });
                            break;
                        case 'txtFinalPt':
                            // Modify the grade mapping
                            valueBeforeChange = grade.minimumFinalPoints;
                            gradeMappings.gradeMappingList[positionCreditType].modified = true;
                            grade.minimumFinalPercentage = null;
                            grade.minimumFinalPoints = null;
                            grade.errorFinalPercentage = false;
                            grade.invalidMinimumFinalPoints = false;
                            grade.incorrectMinimumFinalPoints = false;
                            grade.incorrectMinimumFinalPercentage = false;
                            grade.modified = true;

                            // Check if grade is less than grade before
                            if (!grade.invalidMinimumFinalPoints) {
                                if (positionGradeValue > 0 && gradesList.length > 1) {
                                    if (Number(grade.minimumFinalPoints) > Number(gradesList[positionGradeValue - 1].minimumFinalPoints)) {
                                        grade.incorrectMinimumFinalPoints = true;
                                    }
                                    if (Number(grade.minimumFinalPercentage) > Number(gradesList[positionGradeValue - 1].minimumFinalPercentage)) {
                                        grade.incorrectMinimumFinalPercentage = true;
                                    }
                                    if (positionGradeValue < gradesList.length - 1) {
                                        gradesList[positionGradeValue + 1].incorrectMinimumFinalPoints = false;
                                        gradesList[positionGradeValue + 1].incorrectMinimumFinalPercentage = false;
                                    }
                                }
                                if (gradesList.length > 1 && positionGradeValue < gradesList.length - 1) {
                                    gradesList[positionGradeValue + 1].incorrectMinimumFinalPoints =
                                        Number(grade.minimumFinalPoints) < Number(gradesList[positionGradeValue + 1].minimumFinalPoints);
                                    gradesList[positionGradeValue + 1].incorrectMinimumFinalPercentage =
                                        Number(grade.minimumFinalPercentage) < Number(gradesList[positionGradeValue + 1].minimumFinalPercentage);
                                }
                            }

                            // Search if the value is repeated
                            gradesBefore = gradesList.filter(x =>
                                String(x.minimumFinalPoints) === valueBeforeChange
                                && x.minimumFinalPoints !== null
                                && x.minimumFinalPoints !== undefined);
                            gradesAfter = gradesList.filter(x =>
                                String(x.minimumFinalPoints) === grade.minimumFinalPoints);
                            if (gradesBefore && gradesBefore.length > 0) {
                                if (gradesBefore.length > 1) {
                                    gradesBefore.forEach(item => {
                                        item.errorFinalPercentage = true;
                                    });
                                }
                                else {
                                    gradesBefore[0].errorFinalPercentage = false;
                                }
                            }
                            if (gradesAfter && gradesAfter.length > 0) {
                                if (gradesAfter.length > 1) {
                                    gradesAfter.forEach(item => {
                                        item.errorFinalPercentage = false;
                                    });
                                }
                            }

                            this.setState({
                                gradeMappings: gradeMappings
                            });
                            break;
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePoint.name, e));
        }
    };

    private onChangeShowPoints = (): void => {
        this.setState(prevState => ({
            showPoints: !prevState.showPoints
        }));
    };

    private onChangeTotalPointsFinal = (event: any): void => {
        try {
            const {
                gradeMappings
            } = this.state;

            if (gradeMappings) {
                if (event.target.value && event.target.value !== '') {
                    const point: number = parseInt(event.target.value, 10);

                    if (!isNaN(point) && point >= 0) {
                        gradeMappings.finalPoint = point;

                        if (gradeMappings.gradeMappingList) {
                            gradeMappings.gradeMappingList.forEach(creditType => {
                                if (creditType.sectionList) {
                                    creditType.sectionList.forEach(item => {
                                        if (item.minimumFinalPercentage && gradeMappings.finalPoint) {
                                            item.minimumFinalPoints
                                                = String(((Number(item.minimumFinalPercentage) * gradeMappings.finalPoint) / 100)
                                                    .toFixed(this.fixedDigits));
                                        }
                                    });
                                }
                            });
                        }

                        this.setState({
                            gradeMappings: gradeMappings
                        });
                    }
                }
                else {
                    gradeMappings.finalPoint = null;
                    this.setState({
                        gradeMappings: gradeMappings
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTotalPointsFinal.name, e));
        }
    };

    private onChangeTotalPointsMidterm = (event: any): void => {
        try {
            const {
                gradeMappings
            } = this.state;

            if (gradeMappings) {
                if (event.target.value && event.target.value !== '') {
                    const point: number = parseInt(event.target.value, 10);

                    if (!isNaN(point) && point >= 0) {
                        gradeMappings.midTermPoint = point;

                        if (gradeMappings.gradeMappingList) {
                            gradeMappings.gradeMappingList.forEach(creditType => {
                                if (creditType.sectionList) {
                                    creditType.sectionList.forEach(item => {
                                        if (item.minimumMidtermPercentage && gradeMappings.midTermPoint) {
                                            item.minimumMidtermPoints
                                                = String(((Number(item.minimumMidtermPercentage) * gradeMappings.midTermPoint) / 100)
                                                    .toFixed(this.fixedDigits));
                                        }
                                    });
                                }
                            });
                        }

                        this.setState({
                            gradeMappings: gradeMappings
                        });
                    }
                }
                else {
                    gradeMappings.midTermPoint = null;
                    this.setState({
                        gradeMappings: gradeMappings
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTotalPointsMidterm.name, e));
        }
    };

    private onApplyDefaults = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            if (sectionId) {
                LayoutActions.setLoading(true);
                Requests.postApplyDefaults(sectionId, this.resolvePostGradeMappingsApplyDefaults);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onApplyDefaults.name, e));
        }
    };

    private onCopy = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            const {
                gradeMappingsCopy
            } = this.state;

            if (sectionId && gradeMappingsCopy) {
                LayoutActions.setLoading(true);
                Requests.postGradeMappingsCopy(Number(gradeMappingsCopy.defaultSection.value),
                    sectionId, this.resolvePostGradeMappingsCopy);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCopy.name, e));
        }
    };

    private onCopyAll = (): void => {
        try {

            const {
                sectionId
            } = this.props;

            if (sectionId) {
                LayoutActions.setLoading(true);
                Requests.getGradeMappingsCopyPeriods(sectionId, this.resolveGetCopyPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCopyAll.name, e));
        }
    };

    private onCloseDeleteConfirmModal = (): void => {
        try {
            this.setState({
                confirmationModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteConfirmModal.name, e));
        }
    };

    private onCloseModal = (): void => {
        try {
            this.setState({
                isCopy: false,
                isCopyButton: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onDeleteAll = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            if (sectionId) {
                LayoutActions.setLoading(true);
                Requests.postDeleteAll(sectionId, this.resolvePostGradeMappingsDelete);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAll.name, e));
        }
    };

    private onDeleteConfirmation = (): void => {
        try {
            this.setState({
                confirmationModal: true
            });
        } catch (e) {
            this.logError(LogData.fromException(this.onDeleteConfirmation.name, e));
        }
    };

    private onDropdownCopyChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            const {
                gradeMappingsCopy
            } = this.state;

            if (sectionId && gradeMappingsCopy) {
                if (id === 'ddlPeriod') {
                    LayoutActions.setLoading(true);
                    gradeMappingsCopy.defaultSection.value = '';
                    gradeMappingsCopy.defaultPeriod.value = Number(optionSelected.value);
                    Requests.getGradeMappingsCopyCourses(sectionId, Number(optionSelected.value), this.resolveGetSectionsCourses);
                    this.setState({
                        gradeMappingsCopy: gradeMappingsCopy,
                        isCopyButton: true
                    });
                }
                else {
                    gradeMappingsCopy.defaultSection.value = Number(optionSelected.value);
                    gradeMappingsCopy.defaultSection.description = String(optionSelected.description);
                    if (Number(optionSelected.value) > 0) {
                        this.setState({
                            gradeMappingsCopy: gradeMappingsCopy,
                            isCopyButton: false
                        });
                    }
                    else {
                        this.setState({
                            isCopyButton: true
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownCopyChange.name, e));
        }
    };

    private onSave = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                sectionId
            } = this.props;

            const {
                gradeMappings,
                resources
            } = this.state;

            const positionCreditType: number = Number(event.currentTarget.id.split('_')[1]);
            let canSave: boolean = true;
            if (gradeMappings && resources) {
                if (gradeMappings.gradeMappingList[positionCreditType].sectionList) {
                    gradeMappings.gradeMappingList[positionCreditType].sectionList.forEach(item => {
                        if (item.errorMidtermPercentage || item.errorFinalPercentage
                            || item.invalidMinimumMidtermPercentage || item.invalidMinimumFinalPercentage
                            || item.incorrectMinimumMidtermPercentage || item.incorrectMinimumFinalPercentage) {
                            canSave = false;
                        }
                    });
                    if (canSave) {
                        const gradesModified: ISectionGradeMapping[] =
                            gradeMappings.gradeMappingList[positionCreditType].sectionList.filter(item => item.modified);

                        gradesModified.forEach(grade => {
                            grade.minimumFinalPercentage = Number(grade.minimumFinalPercentage);
                            grade.minimumMidtermPercentage = Number(grade.minimumMidtermPercentage);
                            grade.minimumMidtermPercentageCurrent = Number(grade.minimumMidtermPercentageCurrent);
                        });

                        if (gradesModified && gradesModified.length > 0) {
                            this.creditTypePosition = positionCreditType;
                            if (sectionId) {
                                this.showLoaderSave();
                                Requests.postGradeMappings(
                                    sectionId,
                                    gradesModified,
                                    this.resolvePostGradeMappings);
                            }
                            else {
                                LayoutActions.setLoading(true);
                                Requests.postGradeMappingsAdministration(
                                    gradesModified,
                                    this.resolvePostGradeMappingsAdministration);
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
        }
    };
    // #endregion Events

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

    private hideLoaderSave = (): void => {
        const {
            gradeMappings
        } = this.state;
        if (gradeMappings) {
            gradeMappings.gradeMappingList[this.creditTypePosition].loading = false;
            this.setState({
                gradeMappings: gradeMappings
            });
        }
    };

    private showLoaderSave = (): void => {
        const {
            gradeMappings
        } = this.state;
        if (gradeMappings) {
            gradeMappings.gradeMappingList[this.creditTypePosition].loading = true;
            this.setState({
                gradeMappings: gradeMappings
            });
        }
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
    private resolveGetGradeMappings = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetGradeMappings.name, this.hideAllLoaders);

            LayoutActions.setLoading(false);
            if (result?.status) {
                const gradeMappings: ISectionMapping = result.data;
                let showShowPoints: boolean = false;
                if (gradeMappings) {
                    showShowPoints =
                        gradeMappings.midTermPoint !== undefined
                        && gradeMappings.midTermPoint !== null
                        && gradeMappings.finalPoint !== undefined
                        && gradeMappings.finalPoint !== null;
                    if (gradeMappings.gradeMappingList) {
                        gradeMappings.gradeMappingList.forEach(creditType => {
                            creditType.modified = false;
                            if (creditType.sectionList) {
                                creditType.sectionList.forEach(item => {
                                    if (item.minimumFinalPercentage && gradeMappings.finalPoint) {
                                        item.minimumFinalPoints
                                            = String((Number(item.minimumFinalPercentage) * gradeMappings.finalPoint) / 100);
                                    }
                                    if (item.minimumMidtermPercentage && gradeMappings.midTermPoint) {
                                        item.minimumMidtermPoints
                                            = String((Number(item.minimumMidtermPercentage) * gradeMappings.midTermPoint) / 100);
                                    }
                                });
                            }
                        });
                    }
                }
                this.setState({
                    gradeMappings: gradeMappings,
                    showPoints: false,
                    showShowPoints: showShowPoints
                }, () => {
                    if (sectionId) {
                        this.hideLoader();
                    }
                    else {
                        LayoutActions.setLoading(false);
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetGradeMappings.name, e));
        }
    };

    private resolveGetCopyPeriods = (json: string): void => {
        try {
            LayoutActions.setLoading(false);
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCopyPeriods.name, this.hideAllLoaders);

            if (result?.status) {
                const gradeMappingsCopy: ISectionCopyActivities = result.data;
                gradeMappingsCopy.defaultSection = { description: '', value: '' };
                this.setState({
                    gradeMappingsCopy: gradeMappingsCopy,
                    isCopy: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCopyPeriods.name, e));
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

    private resolvePostGradeMappingsApplyDefaults = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            LayoutActions.setLoading(false);

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostGradeMappingsApplyDefaults.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                if (sectionId) {
                    LayoutActions.setLoading(true);
                    Requests.getGradeMappings(sectionId, this.resolveGetGradeMappings);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostGradeMappingsApplyDefaults.name, e));
        }
    };

    private resolvePostGradeMappings = (json: string): void => {
        try {
            const {
                gradeMappings
            } = this.state;

            const {
                sectionId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostGradeMappings.name, this.hideAllLoaders);

            if (result?.status) {
                if (gradeMappings) {
                    if (gradeMappings.showMidTerm !== result.data) {
                        gradeMappings.showMidTerm = result.data;
                    }
                    gradeMappings.gradeMappingList[this.creditTypePosition].modified = false;
                    gradeMappings.gradeMappingList[this.creditTypePosition].sectionList.forEach(item => {
                        item.modified = false;
                        if (!gradeMappings.showMidTerm) {
                            item.minimumMidtermPercentage = item.minimumMidtermPercentageCurrent;
                        }
                    });
                    this.setState({
                        gradeMappings: gradeMappings
                    });
                }

                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                if (sectionId) {
                    this.hideLoaderSave();
                }
                else {
                    LayoutActions.setLoading(false);
                }
                this.creditTypePosition = -1;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostGradeMappings.name, e));
        }
    };

    private resolvePostGradeMappingsCopy = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            LayoutActions.setLoading(false);

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostGradeMappingsCopy.name, this.hideAllLoaders);

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
                    isCopy: false,
                    isCopyButton: true
                });

                if (sectionId) {
                    LayoutActions.setLoading(true);
                    Requests.getGradeMappings(sectionId, this.resolveGetGradeMappings);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostGradeMappingsCopy.name, e));
        }
    };

    private resolvePostGradeMappingsDelete = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostGradeMappingsDelete.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    confirmationModal: false
                });
                if (sectionId) {
                    Requests.getGradeMappings(sectionId, this.resolveGetGradeMappings);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostGradeMappingsDelete.name, e));
        }
    };

    private resolvePostGradeMappingsAdministration = (json: string): void => {
        try {
            const {
                gradeMappings
            } = this.state;

            const {
                sectionId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostGradeMappingsAdministration.name, this.hideAllLoaders);

            if (result?.status && result.data.result) {
                if (gradeMappings) {
                    if (gradeMappings.showMidTerm !== result.data.showMidterm) {
                        gradeMappings.showMidTerm = result.data.showMidTerm;
                    }
                    gradeMappings.gradeMappingList[this.creditTypePosition].modified = false;
                    gradeMappings.gradeMappingList[this.creditTypePosition].sectionList.forEach(item => {
                        item.modified = false;
                        if (!gradeMappings.showMidTerm) {
                            item.minimumMidtermPercentage = item.minimumMidtermPercentageCurrent;
                        }
                    });
                    this.setState({
                        gradeMappings: gradeMappings
                    });
                }

                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                if (sectionId) {
                    this.hideLoaderSave();
                }
                else {
                    LayoutActions.setLoading(false);
                }
                this.creditTypePosition = -1;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostGradeMappingsAdministration.name, e));
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
            if (sectionId) {
                Requests.getGradeMappings(sectionId, this.resolveGetGradeMappings);
            }
            else {
                Requests.getGradeMappingsAdministration(this.resolveGetGradeMappings);
            }
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
            isAdministration,
            sectionId
        } = this.props;

        const {
            componentError,
            confirmationModal,
            gradeMappings,
            gradeMappingsCopy,
            isCopy,
            isCopyButton,
            isLoading,
            resources,
            sectionsCourses,
            showPoints,
            showShowPoints
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (isLoading && sectionId) {
            contentPage = (
                <ContainerLoader id="ldrGradeMappings" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (gradeMappings && gradeMappings.gradeMappingList) {
                let copyGradeMappingsModal: JSX.Element | undefined;
                if (isCopy && gradeMappingsCopy) {
                    copyGradeMappingsModal = (
                        <GradeMappingsCopyModal
                            gradeMappingsCopy={gradeMappingsCopy}
                            isCopyButton={isCopyButton}
                            open={isCopy}
                            sectionsCourses={sectionsCourses}
                            onClose={this.onCloseModal}
                            onDropdownChange={this.onDropdownCopyChange}
                            onCopyGradeMappings={this.onCopy}
                            resources={resources}
                        />
                    );
                }

                contentPage = (
                    <>
                        {sectionId ? undefined : (
                            <>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Text size="h4">
                                            {resources.lblDescription}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <br />
                            </>
                        )}
                        {!isAdministration && (
                            <Grid container spacing={3} justifyContent="space-between">
                                <Grid item xs={6} md={10}>
                                    <Button
                                        id="btnApplyDefaults"
                                        color="secondary"
                                        onClick={this.onApplyDefaults}
                                    >
                                        {resources.btnApplyDefaults}
                                    </Button>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                    <Grid container spacing={3} justifyContent="flex-end">
                                        <Grid item xs={4}>
                                            <Tooltip
                                                id="deleteGradeMappings"
                                                title={resources.btnDeleteAllMappings}
                                                aria-label={resources.btnDeleteAllMappings}
                                            >
                                                <IconButton
                                                    id="btnDelete"
                                                    onClick={this.onDeleteConfirmation}
                                                >
                                                    <Icon name="trash" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Tooltip
                                                id="copyGradeMappings"
                                                title={resources.btnCopyGradeMappings}
                                                aria-label={resources.btnCopyGradeMappings}
                                            >
                                                <IconButton
                                                    id="btnCopy"
                                                    onClick={this.onCopyAll}
                                                >
                                                    <Icon name="copy" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        <br />
                        <Grid container spacing={3} justifyContent="flex-end">
                            {showShowPoints && (
                                <Grid item xs={12} className={classes.showPointsCheck}>
                                    <Checkbox
                                        id="chkShowPoints"
                                        checked={showPoints}
                                        label={resources.lblShowPoints}
                                        onChange={this.onChangeShowPoints}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        {showPoints ? (
                            <>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} />
                                    <Grid item xs={12} sm={6}>
                                        <Text size="large">
                                            {resources.lblTotalPoints}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} />
                                    {gradeMappings.showMidTerm ? (
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                id="totalPointsMidterm"
                                                label={resources.lblMidterm}
                                                numeric
                                                type="text"
                                                value={gradeMappings.midTermPoint !== undefined && gradeMappings.midTermPoint !== null ?
                                                    String(gradeMappings.midTermPoint) : ''}
                                                onChange={this.onChangeTotalPointsMidterm}
                                            />
                                        </Grid>
                                    ) : undefined}
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="totalPointsFinal"
                                            label={resources.lblFinal}
                                            numeric
                                            type="text"
                                            value={gradeMappings.finalPoint !== undefined && gradeMappings.finalPoint !== null ?
                                                String(gradeMappings.finalPoint) : ''}
                                            onChange={this.onChangeTotalPointsFinal}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        ) : undefined}
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                {gradeMappings.gradeMappingList.map((creditType, i) => (
                                    <ExpansionPanel
                                        key={`panelGrades_${i}`}
                                        background="gray"
                                        header={(
                                            <Text size="h3">
                                                {creditType.creditType}
                                            </Text>
                                        )}
                                        defaultExpanded={i === 0 ? true : false}
                                        footer={
                                            (
                                                <Button
                                                    id={`btnSave_${i}`}
                                                    loading={creditType.loading}
                                                    onClick={this.onSave}
                                                >
                                                    {resources.btnSave}
                                                </Button>
                                            )}
                                    >
                                        {creditType.sectionList && creditType.sectionList.length > 0 ? (
                                            <GradeMappingsTable
                                                detail={creditType.sectionList}
                                                id={`${i}`}
                                                showMidTerm={gradeMappings.showMidTerm}
                                                showPoints={showPoints}
                                                onChangePercent={this.onChangePercent}
                                                onChangePoint={this.onChangePoint}
                                                resources={resources.gradeMappingsTable}
                                            />
                                        ) : (
                                            <Illustration
                                                color="secondary"
                                                height="sm"
                                                name="no-tasks"
                                                text={resources.lblNoCreditData}
                                            />
                                        )}
                                    </ExpansionPanel>
                                ))}
                            </Grid>
                        </Grid>
                        {confirmationModal && (
                            <ConfirmationDialog
                                contentText={resources.lblDeleteGradeMappings}
                                open={confirmationModal}
                                primaryActionOnClick={this.onCloseDeleteConfirmModal}
                                primaryActionText={resources.btnCancel}
                                secondaryActionOnClick={this.onDeleteAll}
                                secondaryActionText={resources.btnDelete}
                                title={resources.lblTitleConfirmationDialog}
                            />
                        )}
                        {copyGradeMappingsModal}
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
export default withStyles(styles)(GradeMappings);