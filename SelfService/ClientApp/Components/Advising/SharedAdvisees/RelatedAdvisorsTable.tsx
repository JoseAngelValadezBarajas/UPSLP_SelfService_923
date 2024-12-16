/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: RelatedAdvisorsTable.tsx
 * Type: Presentation component */

// #region Imports
import React, { useEffect } from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import List, { ListItem, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import { IAdvisor } from '../../../Types/Advisees/IAdviseesShared';
// #endregion Imports

// #region Types
export interface IRelatedAdvisorsTableProps {
    adviseeId: number;
    advisors?: IAdvisor[];
    hasFacultyDossier: boolean;
    onViewDossier: (event: React.MouseEvent<HTMLButtonElement>, id: number, isFaculty: boolean) => void;
    resources: IRelatedAdvisorsTableResProps;
}

export interface IRelatedAdvisorsTablePropsToExtend {
    onDeleteAdvisor: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onGetAdvisors: (adviseeId: number) => void;
}

export interface IRelatedAdvisorsTableResProps {
    btnDelete: string;
    lblSharedWith: string;
}

type IRelatedAdvisorsTableAllProps = IRelatedAdvisorsTableProps & IRelatedAdvisorsTablePropsToExtend;
// #endregion Types

// #region Component
const RelatedAdvisorsTable: React.FC<IRelatedAdvisorsTableAllProps> = (props: IRelatedAdvisorsTableAllProps): JSX.Element => {
    const {
        adviseeId,
        advisors,
        hasFacultyDossier,
        resources,
        onDeleteAdvisor,
        onGetAdvisors,
        onViewDossier
    } = props;

    useEffect(() => {
        if (!advisors || advisors.length <= 0) {
            onGetAdvisors(adviseeId);
        }
    }, []);   

    if (advisors && advisors.length > 0) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Text>{resources.lblSharedWith}</Text>
                </Grid>
                <Grid item xs={12}>
                    <List
                        id="lstRelatedAdvisors"
                    >
                        {advisors.map((advisor, iAdvisor) => {
                            const onClickDossier = (): void => {
                                onViewDossier(AvatarText, advisor.personId, true);
                            };
                            return(
                                <ListItem
                                    key={`relatedAdvisor_${iAdvisor}`}
                                    divider
                                    id={`relatedAdvisor_${iAdvisor}`}
                                    noHover
                                >
                                    <ListItemText
                                        disableTypography
                                        id={`relatedAdvisorText_${iAdvisor}`}
                                        primary={(
                                            <AvatarText
                                                ButtonProps={hasFacultyDossier ? {
                                                    'data-id': advisor.personId,
                                                    id: `btnAdvisee_${advisor.personId}`,
                                                    onClick: onClickDossier
                                                } : undefined}

                                                avatarInfo={advisor}
                                            />
                                        )}
                                    />
                                    <Tooltip
                                        id={`tltDeleteAdvisor_${iAdvisor}`}
                                        title={resources.btnDelete}
                                        placement="top"
                                    >
                                        <IconButton
                                            aria-label={resources.btnDelete}
                                            color="gray"
                                            data-advisee-id={adviseeId}
                                            data-advisor-id={advisor.personId}
                                            data-id={advisor.sharedAdviseeId}
                                            data-name={advisor.fullName}
                                            id={`btnDeleteAdvisor_${iAdvisor}`}
                                            onClick={onDeleteAdvisor}
                                        >
                                            <Icon name="trash" />
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            );                            
                        })}
                    </List>
                </Grid>
            </Grid>
        );
    }
    else {
        return (<ContainerLoader id="ldrRelatedAdvisors" height="sm" />);
    }
};
// #endregion Component

// Export: Component
export default RelatedAdvisorsTable;