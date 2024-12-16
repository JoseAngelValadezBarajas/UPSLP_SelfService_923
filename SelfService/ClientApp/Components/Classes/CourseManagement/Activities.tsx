/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Activities.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import ActivitiesTable, { IActivitiesTableResProps } from './ActivitiesTable';

// Types
import { IActivitiesSetup } from '../../../Types/Section/IActivitiesSetup';
// #endregion

// #region Internal types
export interface IActivitiesProps {
    anchorEl: any;
    activitiesSetup: IActivitiesSetup;
    isRestricted: boolean;
    resources: IActivitiesResProps;
    onBlurTextField: (event: any) => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClosePopper: () => void;
    onCopy: (id: number, index: number, subIndex: number) => void;
    onDelete: (id: number) => void;
    onEditClick: (id: number, index: number, subIndex: number, disabled: boolean) => void;
    onExpand: (index: number, expanded: boolean) => void;
    onOpenPopper: (event: any) => void;
    onTextFieldChange: (event: any) => void;
}

export interface IActivitiesResProps {
    lblComma: string;
    lblItem: string;
    lblPoints: string;
    activitiesTable: IActivitiesTableResProps;
}

// #endregion

// #region Component
const Activities: React.FC<IActivitiesProps> = (props: IActivitiesProps): JSX.Element => {
    const {
        anchorEl,
        activitiesSetup,
        isRestricted,
        resources,
        onBlurTextField,
        onCheckboxChange,
        onClosePopper,
        onCopy,
        onDelete,
        onEditClick,
        onExpand,
        onOpenPopper,
        onTextFieldChange
    } = props;

    let header: JSX.Element | undefined;
    let content: JSX.Element | undefined;
    const container: JSX.Element[] | undefined = [];

    if (activitiesSetup) {
        activitiesSetup.assignmentTypes.forEach((activity, i) => {
            header = (
                <>
                    <Hidden smDown>
                        <React.Fragment key={`activitiesHeader_${i}`}>
                            <Grid container>
                                <Grid item>
                                    <Text size="h3">
                                        {activity.description}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    {activitiesSetup.weightMethod === 1 && !activitiesSetup.isWeightByType ?
                                        (
                                            <Text size="small">
                                                {activity.assignmentsCount}
                                                {resources.lblItem}
                                            </Text>
                                        )
                                        :
                                        (
                                            <Text size="small">
                                                {activity.assignmentsCount}
                                                {resources.lblItem}
                                            </Text>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </Hidden>
                    <Hidden mdUp>
                        <React.Fragment key={`activitiesHeader_${i}`}>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Text size="small">
                                        {activity.description}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    {activitiesSetup.weightMethod === 1 && !activitiesSetup.isWeightByType ?
                                        (
                                            <Text size="small">
                                                {activity.assignmentsCount}
                                                {resources.lblItem}
                                            </Text>
                                        )
                                        :
                                        (
                                            <Text size="small">
                                                {activity.assignmentsCount}
                                                {resources.lblItem}
                                            </Text>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </Hidden>
                </>
            );

            content = (
                <ActivitiesTable
                    anchorEl={anchorEl}
                    activitiesSetup={activitiesSetup}
                    isRestricted={isRestricted}
                    index={i}
                    resources={resources.activitiesTable}
                    onBlurTextField={onBlurTextField}
                    onCheckboxChange={onCheckboxChange}
                    onCopy={onCopy}
                    onDelete={onDelete}
                    onEditClick={onEditClick}
                    onTextFieldChange={onTextFieldChange}
                    onOpenPopper={onOpenPopper}
                    onClosePopper={onClosePopper}
                />
            );

            const onExpandCallback = (_event: any, expanded: boolean) => {
                onExpand(i, expanded);
            }

            container.push(
                <ExpansionPanel
                    defaultExpanded={activitiesSetup.assignmentTypes[i].isExpanded}
                    expanded={activitiesSetup.assignmentTypes[i].isExpanded}
                    key={`activityType_${i}`}
                    id={`activityType_${i}`}
                    background="gray"
                    header={header}
                    onChange={onExpandCallback}
                >
                    {content}
                </ExpansionPanel>
            );
        });
    }

    return (
        <>
            {container}
        </>
    );
};
// #endregion

// Export: Component
export default Activities;