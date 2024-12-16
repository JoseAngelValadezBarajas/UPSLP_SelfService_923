/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: SectionApprovalCard.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { ISectionApproval } from '../../../Types/Section/ISectionDepartmentHead';
// #endregion Imports

// #region Types
export interface ISectionApprovalCardProps {
    hasDossierClaim: boolean;
    id: string;
    indexDepartment: number;
    indexSection: number;
    resources: ISectionApprovalCardResProps;
    section: ISectionApproval;
    onChangeRequireApproval: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onViewDetails: (id: number) => void;
    onViewDossier: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ISectionApprovalCardResProps {
    formatSessionSectionSubtype: string;
    formatTitleSection: string;
    formatTypeDuration: string;
    lblNoInstructor: string;
    lblRequiresApproval: string;
}

const styles = createStyles({
    avatar: {
        marginLeft: '0rem!important'
    },
    btnRight: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    centered: {
        alignItems: 'center',
        display: 'flex'
    },
    instructorName: {
        wordBreak: 'normal'
    },
    resultCardContainer: {
        marginTop: Tokens.spacing40
    }
});

type PropsWithStyles = ISectionApprovalCardProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
const SectionApprovalCard: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        hasDossierClaim,
        id,
        indexDepartment,
        indexSection,
        resources,
        section,
        width,
        onChangeRequireApproval,
        onViewDetails,
        onViewDossier
    } = props;

    const onClickViewDetails = (): void => onViewDetails(section.id);

    // #region Instructor(s)
    let instructors: JSX.Element | JSX.Element[] | undefined;
    if (section.instructors && section.instructors.length > 0) {
        instructors = section.instructors.map((instructor, i) => (
            <Grid item className={classes.centered} key={`instructor_${i}`}>
                <AvatarText
                    ButtonProps={hasDossierClaim ? {
                        'data-id': instructor.personId,
                        id: `avatar_firstLetter_${i}`,
                        onClick: onViewDossier
                    } : undefined}
                    avatarInfo={instructor}
                />
            </Grid>
        ));
    }
    else {
        instructors = (
            <Grid item xs className={classes.centered}>
                <div>
                    <Avatar id="avatar_noInstructor" background="default" classes={{ root: classes.avatar }} />
                </div>
                <div>
                    <Text className={classes.instructorName}>
                        {resources.lblNoInstructor}
                    </Text>
                </div>
            </Grid>
        );
    }
    // #endregion Instructor(s)

    let sectionName: JSX.Element;
    sectionName = (
        <>
            <Button
                TextProps={{
                    weight: 'strong'
                }}
                align="left"
                id={`lnkTitle_${id}_${section.id}`}
                textVariantStyling="inherit"
                variant="text"
                onClick={onClickViewDetails}
            >
                {Format.toString(resources.formatTitleSection, [section.eventId, section.eventName])}
            </Button>
            <Text
                color="textSecondary"
                id={`lblCourseInfo1_${indexDepartment}_${indexSection}`}
                size="small"
            >
                {Format.toString(resources.formatSessionSectionSubtype, [section.eventSubType, section.section])}
            </Text>
            <Text
                color="textSecondary"
                id={`lblCourseInfo2_${indexDepartment}_${indexSection}`}
                size="small"
            >
                {Format.toString(resources.formatTypeDuration, [section.eventType, section.defaultCreditTypeDesc])}
            </Text>
        </>
    );

    let switchApproval: JSX.Element;
    switchApproval = (
        <Tooltip
            id={`tltRequiresApproval_${section.id}`}
            title={resources.lblRequiresApproval}
            aria-label={resources.lblRequiresApproval}
        >
            <Switch
                checked={section.requireApproval}
                id={`swtRequireApproval_${indexDepartment}_${indexSection}_${section.id}`}
                loading={section.isLoading}
                onChange={onChangeRequireApproval}
            />
        </Tooltip>
    );

    return (
        <Card className={classes.resultCardContainer}>
            <CardContent>
                <Grid container>
                    <Grid item xs={12} sm={4} lg={5}>
                        {width === 'xs' ? (
                            <Grid container>
                                <Grid item xs>
                                    {sectionName}
                                </Grid>
                                <Grid item>
                                    {switchApproval}
                                </Grid>
                            </Grid>
                        ) : (
                                <>
                                    {sectionName}
                                </>
                            )}
                    </Grid>
                    {width === 'xs' ? (
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {instructors}
                            </Grid>
                        </Grid>
                    ) : (
                            <Grid item xs={12} sm={8} lg={7}>
                                <Grid
                                    container
                                    spacing={1}
                                >
                                    <Grid item xs>
                                        <Grid container spacing={2}>
                                            {instructors}
                                        </Grid>
                                    </Grid>
                                    <Grid item xs className={classes.btnRight}>
                                        {switchApproval}
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                </Grid>
            </CardContent>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(SectionApprovalCard));