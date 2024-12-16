/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SharedAdviseesTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Table, { TableBody, TableCell, TableExpandableRow } from '@hedtech/powercampus-design-system/react/core/Table';

// Internal components
import RelatedAdvisorsTable, { IRelatedAdvisorsTablePropsToExtend, IRelatedAdvisorsTableResProps } from './RelatedAdvisorsTable';

// Types
import { IAdviseeShared } from '../../../Types/Advisees/IAdviseesShared';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// #endregion Imports

// #region Types
export interface ISharedAdviseesTableProps {
    advisees: IAdviseeShared[];
    hasDossierClaim: boolean;
    hasFacultyDossier: boolean;
    resources: ISharedAdviseesTableResProps;
    RelatedAdvisorsTableProps: IRelatedAdvisorsTablePropsToExtend;
    onSelectAdvisee: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onViewDossier: (event: React.MouseEvent<HTMLButtonElement>, id: number, isFaculty: boolean) => void;
}

export interface ISharedAdviseesTableResProps {
    formatSelectAdvisee: string;
    relatedAdvisorsTable: IRelatedAdvisorsTableResProps;
}
// #endregion Types

// #region Component
const SharedAdviseesTable: React.FC<ISharedAdviseesTableProps> = (props: ISharedAdviseesTableProps): JSX.Element => {
    const {
        advisees,
        hasDossierClaim,
        hasFacultyDossier,
        resources,
        RelatedAdvisorsTableProps,
        onSelectAdvisee,
        onViewDossier
    } = props;

    return (
        <Table
            breakpoint="sm"
            id="tblSharedAdvisees"
            variant="expansionPanels"
        >
            <TableBody>
                {advisees.map((advisee, iAdvisee) => (
                    <TableExpandableRow
                        key={`sharedAdviseesRow_${iAdvisee}`}
                        expandedRowContent={(
                            <RelatedAdvisorsTable
                                adviseeId={advisee.personId}
                                advisors={advisee.advisors}
                                hasFacultyDossier={hasFacultyDossier}
                                resources={resources.relatedAdvisorsTable}
                                onViewDossier={onViewDossier}
                                {...RelatedAdvisorsTableProps}
                            />
                        )}
                    >
                        <TableCell scope="row">
                            <AvatarText
                                ButtonProps={hasDossierClaim ? {
                                    'data-id': advisee.personId,
                                    id: `btnAdviseeDossier_${advisee.personId}_${iAdvisee}`,
                                    onClick: onViewDossier
                                } : undefined}
                                CheckboxProps={{
                                    checked: Boolean(advisee.checked),
                                    id: `chkSharedAdvisee_${iAdvisee}`,
                                    inputProps: {
                                        'aria-label': Format.toString(resources.formatSelectAdvisee, [advisee.fullName]),
                                        'data-id': advisee.personId
                                    },
                                    onChange: onSelectAdvisee
                                }}
                                avatarInfo={advisee}
                            />
                        </TableCell>
                        <TableCell />
                    </TableExpandableRow>
                ))}
            </TableBody>
        </Table>
    );
};
// #endregion Component

// Export: Component
export default SharedAdviseesTable;