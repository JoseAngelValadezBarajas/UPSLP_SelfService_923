/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AreasList.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import AreasListTable from './AreasListTable';

// Types
import { INotificationsEvents } from '../../../Types/Notifications/INotificationsEvents';
import { INotificationsSetupResources } from '../../../Types/Resources/Administration/INotificationsSetupResources';

// #endregion

// #region Internal types
export interface IAreasListProps {
    areasList: INotificationsEvents;
    index: number;
    onChangeEnableDisable: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickSetup?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resources: INotificationsSetupResources;
}

// #endregion

// #region Component
const AreasList: React.FC<IAreasListProps> = (props: IAreasListProps): JSX.Element => {
    const {
        areasList,
        index,
        onChangeEnableDisable,
        onClickSetup,
        resources
    } = props;

    let content: JSX.Element | undefined;
    let header: JSX.Element | undefined;
    const container: JSX.Element[] | undefined = [];
    header = (
        <React.Fragment key={`eventHeader_${index}`}>
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {areasList.areaName}
                    </Text>
                </Grid>
            </Grid>
        </React.Fragment>
    );

    content = (
        <AreasListTable
            key={`areasList_${index}`}
            areasList={areasList}
            index={index}
            onChangeEnable={onChangeEnableDisable}
            onClickSetup={onClickSetup}
            resources={resources}
        />
    );

    container.push(
        <ExpansionPanel
            key={`events_${index}`}
            header={header}
        >
            {content}
        </ExpansionPanel>
    );

    return (
        <>
            {container}
        </>
    );
};
// #endregion

// Export: Component
export default AreasList;