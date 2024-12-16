/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: OverallGradesApplied.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Internal components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IOverallGradesResources } from '../../../Types/Resources/Classes/IOverallGradesResources';
import { ISectionOverallGradesAssignment } from '../../../Types/Section/ISectionOverallGradesAssignment';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion Imports

// #region Types
export interface IStopListProps {
    assignment: ISectionOverallGradesAssignment;
    expanded?: boolean;
    onChangePanel: () => void;
    resources?: IOverallGradesResources;
}

const styles = () => createStyles({
    List: {
        alignContent: 'center',
        backgroundColor: Tokens.colorBackgroundAlertNeutral,
        display: 'inline-flex',
        verticalAlign: 'middle'
    },
    Text: {
        color: Tokens.colorTextAlertNeutral,
        display: 'inline-flex!important'
    }
});

type PropsWithStyles = IStopListProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const OverallGradesApplied: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        assignment,
        classes,
        expanded,
        onChangePanel,

        resources
    } = props;

    let content: JSX.Element | undefined;
    if (resources) {
        content = (
            <>
                <ExpansionPanel
                    expanded={expanded}
                    header={(
                        <Grid container spacing={3} className={classes.List}>
                            <Grid item xs={12}>
                                <Icon
                                    marginRight
                                    name="info"
                                    type={ResultType.info}
                                />
                                <Text
                                    className={classes.Text}
                                    id="txtLegend"
                                    size="large"
                                >
                                    {resources.lblLegend}
                                </Text>
                            </Grid>
                        </Grid>
                    )}
                    type={'info'}
                    onChange={onChangePanel}
                >
                    <Grid container className={classes.List}>
                        <Grid item xs={12} md={4}>
                            <Grid container>
                                <Grid item>
                                    <Text
                                        className={classes.Text}
                                        weight={'strong'}
                                    >
                                        {resources.lblTemplateName}
                                    </Text>
                                </Grid>
                                <Grid item>
                                    <Text>
                                        {assignment.name}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Grid container>
                                <Grid item>
                                    <Text
                                        className={classes.Text}
                                        weight={'strong'}
                                    >
                                        {resources.lblAssignedBy}
                                    </Text>
                                </Grid>
                                <Grid item>
                                    <Text>
                                        {assignment.assignedByName}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Grid container>
                                <Grid item>
                                    <Text
                                        className={classes.Text}
                                        weight={'strong'}
                                    >
                                        {resources.lblAssignedDate}
                                    </Text>
                                </Grid>
                                <Grid item>
                                    <Text>
                                        {assignment.assignedDate}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ExpansionPanel>
                <br />
            </>
        );
    }

    return (
        <>
            {content}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(OverallGradesApplied);