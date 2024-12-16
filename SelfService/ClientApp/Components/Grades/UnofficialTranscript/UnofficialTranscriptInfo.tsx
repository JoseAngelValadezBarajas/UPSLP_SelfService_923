/* Copyright 2018 - 2024 Ellucian Company L.P. and its affiliates.
 * File: UnofficialTranscriptInfo.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import Print from '../../Generic/Print';
import TranscriptGPA, { ITranscriptGPAResProps } from './TranscriptGPA';
import TranscriptOrganization, { ITranscriptOrganizationResProps } from './TranscriptOrganization';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { IUnofficialTranscript } from '../../../Types/UnofficialTranscript/IUnofficialTranscript';
// #endregion

// #region Internal types
export interface IUnofficialTranscriptInfoProps {
    impersonateInfo?: IImpersonateInfo;
    printResources: IPrintResources;
    resources: IUnofficialTranscriptInfoResProps;
    unofficialTranscript: IUnofficialTranscript;
}

export interface IUnofficialTranscriptInfoResProps {
    lblAwards: string;
    lblCumulativeGpa: string;
    lblDateGranted: string;
    lblDegreeAwarded: string;
    lblDob: string;
    lblEndTranscript: string;
    lblGeneralNotes: string;
    lblHonors: string;
    lblId: string;
    lblLegend: string;
    lblName: string;
    lblNoDegreeAwardedYet: string;
    lblOfficeRegistrar: string;
    lblOverallCredits: string;
    lblPreviousInstitution: string;
    lblProgramDegreeCurriculum: string;
    lblScore: string;
    lblSlashCharacter: string;
    lblTest: string;
    lblTestDate: string;
    lblTestScores: string;
    lblTotalCreditsTaken: string;
    lblTotalTransferCredits: string;
    lblUnofficialTranscript: string;
    lblYearTermNotes: string;

    unofficialTranscriptGpa: ITranscriptGPAResProps;
    unofficialTranscriptOrganization: ITranscriptOrganizationResProps;
}

const styles = ((theme: Theme) => createStyles({
    legend: {
        display: 'block!important'
    },
    marginBottom: {
        marginBottom: Tokens.spacing60
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '60%'
            }
        }
    }
}));

type PropsWithStyles = IUnofficialTranscriptInfoProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const UnofficialTranscriptInfo: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        impersonateInfo,
        printResources,
        unofficialTranscript,

        resources
    } = props;

    const unofficialTranscriptInfo: JSX.Element[] = [];
    let endTranscript: JSX.Element | undefined;
    if (unofficialTranscript) {

        // Test Scores
        let testScores: JSX.Element | undefined;
        testScores = unofficialTranscript.testScores
            && unofficialTranscript.testScores.length > 0 ?
            (
                <>
                    <Grid container spacing={3}>
                        <Grid item md={12}>
                            <Text weight="strong">
                                {resources.lblTestScores}
                            </Text>
                        </Grid>
                        {unofficialTranscript.testScores ?
                            (
                                <>
                                    <br />
                                    <Table
                                        breakpoint="sm"
                                        id="tblTests"
                                        variant="expansionPanels"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    {resources.lblTest}
                                                </TableCell>
                                                <TableCell>
                                                    {resources.lblTestDate}
                                                </TableCell>
                                                <TableCell>
                                                    {resources.lblScore}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {unofficialTranscript.testScores ? unofficialTranscript.testScores.map((testScore, i) => (
                                                <TableExpandableRow key={`testScore_${i}`}>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        columnName={resources.lblTest}
                                                    >
                                                        <span>
                                                            {`${testScore.description} ${testScore.typeDescription}`}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblTestDate}>
                                                        <span>
                                                            {testScore.date}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblScore}>
                                                        <span>
                                                            {testScore.score}
                                                        </span>
                                                    </TableCell>
                                                </TableExpandableRow>
                                            )) : undefined}
                                        </TableBody>
                                    </Table>
                                    <br />
                                </>
                            ) : undefined}
                    </Grid>
                    <br />
                </>
            ) : (<br />);

        unofficialTranscript.headerInformation.forEach((headerInfo, i) => {
            // General Information
            let generalInformation: JSX.Element | undefined;
            generalInformation = (
                <Grid container justifyContent="center" key={`headerInformation_${i}`} spacing={3}>
                    <Grid item>
                        <Text align="center" size="large" weight="strong">
                            {headerInfo.orgName}
                        </Text>
                        <Text align="center" size="large" weight="strong">
                            {resources.lblOfficeRegistrar}
                        </Text>
                        {headerInfo.houseNumber ?
                            (
                                <Text align="center" size="medium">
                                    {headerInfo.houseNumber}
                                </Text>
                            ) : undefined
                        }
                        {headerInfo.addressLine1 ?
                            (
                                <Text align="center" size="medium">
                                    {headerInfo.addressLine1}
                                </Text>
                            ) : undefined
                        }
                        {headerInfo.addressLine2 ?
                            (
                                <Text align="center" size="medium">
                                    {headerInfo.addressLine2}
                                </Text>
                            ) : undefined
                        }
                        {headerInfo.addressLine3 ?
                            (
                                <Text align="center" size="medium">
                                    {headerInfo.addressLine3}
                                </Text>
                            ) : undefined
                        }
                        {headerInfo.addressLine4 ?
                            (
                                <Text align="center" size="medium">
                                    {headerInfo.addressLine4}
                                </Text>
                            ) : undefined
                        }
                        {headerInfo.addressLine5 ?
                            (
                                <Text align="center" size="medium">
                                    {headerInfo.addressLine5}
                                </Text>
                            ) : undefined
                        }
                    </Grid>
                </Grid>
            );

            // Program Degree Curriculum
            let previousInstitution: JSX.Element[] | undefined;
            previousInstitution = headerInfo.previousInstitutions.map((prevInstitution, piIndex) => (
                <React.Fragment key={`previousInstitutions_${piIndex}`}>
                    {piIndex === headerInfo.previousInstitutions.length - 1 ?
                        prevInstitution : `${prevInstitution} ${resources.lblSlashCharacter}`}
                </React.Fragment>
            ));

            let programDegreeCurriculum: JSX.Element | undefined;
            programDegreeCurriculum = (
                <>
                    <Grid container className={classes.marginBottom} justifyContent="space-between" spacing={0}>
                        <Grid item>
                            <Text display="inline" weight="strong">
                                {resources.lblName}
                            </Text>
                            <Text display="inline">
                                {headerInfo.fullName}
                            </Text>
                            {unofficialTranscript.showGovernmentId ?
                                (
                                    <>
                                        <br />
                                        <Text display="inline" weight="strong">
                                            {resources.lblId}
                                        </Text>
                                        <Text display="inline">
                                            {headerInfo.governmentId}
                                        </Text>
                                    </>
                                ) : undefined}
                        </Grid>
                        {unofficialTranscript.showDateOfBirth ?
                            (
                                <Grid item>
                                    <Text display="inline" weight="strong">
                                        {resources.lblDob}
                                    </Text>
                                    <Text display="inline">
                                        {headerInfo.birthDate}
                                    </Text>
                                </Grid>
                            ) : undefined}
                    </Grid>
                    <Grid container className={classes.marginBottom} spacing={3}>
                        {headerInfo.transcriptDegree ?
                            (
                                <>
                                    <br />
                                    <Table
                                        breakpoint="sm"
                                        classes={{ root: classes.table }}
                                        id="tblProgramDegreeCurriculum"
                                        variant="expansionPanels"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    {resources.lblProgramDegreeCurriculum}
                                                </TableCell>
                                                <TableCell>
                                                    {resources.lblDegreeAwarded}
                                                </TableCell>
                                                <TableCell>
                                                    {resources.lblDateGranted}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {headerInfo.transcriptDegree ? headerInfo.transcriptDegree.map((degree, i) => (
                                                <TableExpandableRow key={`transcriptDegree_${i}`}>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        <span>
                                                            {degree.pdcDesc}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblDegreeAwarded}>
                                                        <span>
                                                            {degree.dateGranted ?
                                                                degree.degreeDesc
                                                                : resources.lblNoDegreeAwardedYet}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblDateGranted}>
                                                        <span>
                                                            {degree.dateGranted}
                                                        </span>
                                                    </TableCell>
                                                </TableExpandableRow>
                                            )) : undefined}
                                        </TableBody>
                                    </Table>
                                </>
                            ) : undefined
                        }
                    </Grid>
                    <Grid container justifyContent="space-between" spacing={0}>
                        <Grid item>
                            <Text display="inline" weight="strong">
                                {resources.lblHonors}
                            </Text>
                            <Text display="inline">
                                {headerInfo.honors}
                            </Text>
                        </Grid>
                        <Grid item>
                            <Text display="inline" weight="strong">
                                {resources.lblCumulativeGpa}
                            </Text>
                            <Text display="inline">
                                {headerInfo.cumGpa}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.marginBottom} spacing={0}>
                        <Grid item>
                            <Text display="inline" weight="strong">
                                {resources.lblPreviousInstitution}
                            </Text>
                            <Text display="inline">
                                {previousInstitution}
                            </Text>
                        </Grid>
                    </Grid>
                </>
            );

            // Grades
            let grades: JSX.Element[] | undefined;
            if (headerInfo.transcriptYearTerm) {
                grades = headerInfo.transcriptYearTerm.map((transYearTerm, tytIndex) => {
                    let yearTermAwards: JSX.Element[] | undefined;
                    yearTermAwards = transYearTerm.yearTermAwards.map((award, ytaIndex) => (
                        <Text key={`yearTermAward_${ytaIndex}`}>
                            {award}
                        </Text>
                    ));

                    let yearTermNotes: JSX.Element[] | undefined;
                    yearTermNotes = transYearTerm.yearTermNotes.map((note, ytnIndex) => (
                        <Grid container spacing={3} key={`yearTermNote_${ytnIndex}`}>
                            <Grid item md={12}>
                                <Text>
                                    {note}
                                </Text>
                            </Grid>
                        </Grid>
                    ));

                    return (
                        <React.Fragment key={`yearTerm_${tytIndex}`}>
                            <TranscriptOrganization
                                showAlternateGrade={unofficialTranscript.showAlternateGrade}
                                transcriptOrgs={transYearTerm.transcriptOrganization}
                                transcriptYearTermOrg={transYearTerm.period}
                                resources={resources.unofficialTranscriptOrganization}
                            />
                            {transYearTerm.yearTermAwards && transYearTerm.yearTermAwards.length > 0 ?
                                (
                                    <Grid container spacing={3}>
                                        <Grid item md={12}>
                                            <Text weight="strong">
                                                {resources.lblAwards}
                                            </Text>
                                            {yearTermAwards}
                                        </Grid>
                                    </Grid>
                                ) : undefined}
                            <TranscriptGPA
                                showDatesForTerms={unofficialTranscript.showClassInformation}
                                transGPA={transYearTerm.transcriptGpa}
                                resources={resources.unofficialTranscriptGpa}
                            />
                            <br />
                            {transYearTerm.yearTermNotes && transYearTerm.yearTermNotes.length > 0 ?
                                (
                                    <Grid container spacing={3}>
                                        <Grid item md={12}>
                                            <Text weight="strong">
                                                {resources.lblYearTermNotes}
                                            </Text>
                                            {yearTermNotes}
                                        </Grid>
                                    </Grid>
                                ) : undefined}
                        </React.Fragment>
                    );
                });
            }

            // Transcript Notes
            let notes: JSX.Element[] | undefined;
            notes = headerInfo.transcriptNotes.map((note, noteIndex) => (
                <React.Fragment key={`note_${noteIndex}`}>
                    <Text>
                        {note}
                    </Text>
                    <br />
                </React.Fragment>
            ));

            let transcriptNotes: JSX.Element | undefined;
            transcriptNotes = headerInfo.transcriptNotes && headerInfo.transcriptNotes.length > 0 ?
                (
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Text weight="strong">
                                {resources.lblGeneralNotes}
                            </Text>
                            <br />
                            {notes}
                        </Grid>
                    </Grid>
                ) : undefined;

            // Total Credits
            let totalCredits: JSX.Element | undefined;
            if (unofficialTranscript.showTotalsAtEnd) {
                totalCredits = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={11}>
                                <Text align="right" weight="strong">
                                    {resources.lblTotalCreditsTaken}
                                </Text>
                            </Grid>
                            <Grid item xs={6} sm={1}>
                                <Text align="right">
                                    {headerInfo.totalCredits ?
                                        `${headerInfo.totalCredits.creditsTaken}`
                                        : ''}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={11}>
                                <Text align="right" weight="strong">
                                    {resources.lblTotalTransferCredits}
                                </Text>
                            </Grid>
                            <Grid item xs={6} sm={1}>
                                <Text align="right">
                                    {headerInfo.totalCredits ?
                                        `${headerInfo.totalCredits.creditsTransfer}`
                                        : ''}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={11}>
                                <Text align="right" weight="strong">
                                    {resources.lblOverallCredits}
                                </Text>
                            </Grid>
                            <Grid item xs={6} sm={1}>
                                <Text align="right">
                                    {headerInfo.totalCredits ?
                                        `${headerInfo.totalCredits.creditsOverall}`
                                        : ''}
                                </Text>
                            </Grid>
                        </Grid>
                    </>
                );
            }

            unofficialTranscriptInfo.push(
                <React.Fragment key={`unofficialInfo_${i}`}>
                    {generalInformation}
                    {programDegreeCurriculum}
                    {grades}
                    {testScores}
                    {transcriptNotes}
                    {totalCredits}
                </React.Fragment>
            );
        });

        // End Transcript
        if (unofficialTranscript.showLegend) {
            endTranscript = (
                <>
                    <Grid container spacing={3}>
                        <Grid item>
                            <Text align="center">
                                {resources.lblEndTranscript}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item>
                            <Text weight="strong">
                                {resources.lblLegend}
                            </Text>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={3}>
                        <Grid item>
                            <Text>
                                <span dangerouslySetInnerHTML={{ __html: unofficialTranscript.legend }} />
                            </Text>
                        </Grid>
                    </Grid>
                    <Divider />
                </>
            );
        }
    }

    const printOptionalParameters: string = impersonateInfo ? `${impersonateInfo.process}/${impersonateInfo.personId}/${impersonateInfo.viewId}/${impersonateInfo.tabId}` : '';
    const link: string = `${Constants.webUrl}/Students/UnofficialTranscriptsReport/${printOptionalParameters}?currentPage=${Constants.headersRequestsJson['X-Current-Page']}`;

    return (
        <Card>
            <CardContent>
                <Grid container spacing={3} justifyContent="flex-end">
                    <Grid item>
                        <Print
                            resources={printResources}
                            link={link}
                        />
                    </Grid>
                </Grid>
                <Grid container justifyContent="center" spacing={3}>
                    <Grid item>
                        <Text size="h2" weight="strong" align="center">
                            {resources.lblUnofficialTranscript}
                        </Text>
                    </Grid>
                </Grid>
                {unofficialTranscriptInfo}
                {endTranscript}
            </CardContent>
        </Card>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(UnofficialTranscriptInfo);