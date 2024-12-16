/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: TranscriptGPA.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Material-UI
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ITranscriptGpa } from '../../../Types/UnofficialTranscript/ITranscriptGpa';
// #endregion

// #region Internal types
interface ITranscriptGPAProps {
    showDatesForTerms: boolean;
    transGPA: ITranscriptGpa[];
    resources: ITranscriptGPAResProps;
}

export interface ITranscriptGPAResProps {
    lblAttemptedCredit: string;
    lblClassRank: string;
    lblClassSize: string;
    lblEarnedCredits: string;
    lblGpa: string;
    lblGpaCredits: string;
    lblOverall: string;
    lblQualityPoints: string;
    lblTerm: string;
    lblTotalCredits: string;
    lblTransferCredits: string;
}
// #endregion

// #region Component
const TranscriptGPA: React.FC<ITranscriptGPAProps> = (props: ITranscriptGPAProps): JSX.Element => {
    const {
        showDatesForTerms,
        transGPA,
        resources
    } = props;

    if (transGPA && transGPA.length > 0) {
        return (
            <>
                <br />
                <Table
                    breakpoint="sm"
                    id="tblGPA"
                    variant="expansionPanels"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>
                                {resources.lblAttemptedCredit}
                            </TableCell>
                            <TableCell>
                                {resources.lblEarnedCredits}
                            </TableCell>
                            <TableCell>
                                {resources.lblTotalCredits}
                            </TableCell>
                            <TableCell>
                                {resources.lblGpaCredits}
                            </TableCell>
                            <TableCell>
                                {resources.lblTransferCredits}
                            </TableCell>
                            <TableCell>
                                {resources.lblQualityPoints}
                            </TableCell>
                            <TableCell>
                                {resources.lblGpa}
                            </TableCell>
                            {showDatesForTerms ?
                                (
                                    <>
                                        <TableCell>
                                            {resources.lblClassRank}
                                        </TableCell>
                                        <TableCell>
                                            {resources.lblClassSize}
                                        </TableCell>
                                    </>
                                ) : undefined}
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transGPA.map((transGPAItem, i) =>
                            (
                                <TableExpandableRow key={`transcriptGPA_${i}`}>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        <Text weight="strong">
                                            {transGPAItem.gpaType === 'T' ?
                                                resources.lblTerm
                                                : resources.lblOverall}
                                        </Text>
                                    </TableCell>
                                    <TableCell columnName={resources.lblAttemptedCredit}>
                                        <span>
                                            {transGPAItem.attemptedCredits}
                                        </span>
                                    </TableCell>
                                    <TableCell columnName={resources.lblEarnedCredits}>
                                        <span>
                                            {transGPAItem.earnedCredits}
                                        </span>
                                    </TableCell>
                                    <TableCell columnName={resources.lblTotalCredits}>
                                        <span>
                                            {transGPAItem.totalCredits}
                                        </span>
                                    </TableCell>
                                    <TableCell columnName={resources.lblGpaCredits}>
                                        <span>
                                            {transGPAItem.gpaCredits}
                                        </span>
                                    </TableCell>
                                    <TableCell columnName={resources.lblTransferCredits}>
                                        <span>
                                            {transGPAItem.transferCredits}
                                        </span>
                                    </TableCell>
                                    <TableCell columnName={resources.lblQualityPoints}>
                                        <span>
                                            {transGPAItem.qualityPoints}
                                        </span>
                                    </TableCell>
                                    <TableCell columnName={resources.lblGpa}>
                                        <span>
                                            {transGPAItem.gpa}
                                        </span>
                                    </TableCell>
                                    {showDatesForTerms ?
                                        (
                                            <>
                                                <TableCell columnName={resources.lblClassRank}>
                                                    <span>
                                                        {transGPAItem.classRank}
                                                    </span>
                                                </TableCell>
                                                <TableCell columnName={resources.lblClassSize}>
                                                    <span>
                                                        {transGPAItem.classSize}
                                                    </span>
                                                </TableCell>
                                            </>
                                        )
                                        : undefined}
                                </TableExpandableRow>
                            ))}
                    </TableBody>
                </Table>
            </>
        );
    }
    else {
        return (
            <>
            </>
        );
    }
};
// #endregion

// Export: Component
export default TranscriptGPA;