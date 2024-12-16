/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: SavedApplications.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import List, { ListItem, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { ISavedApplication } from '../../../Types/Applications/ISavedApplication';
import { ISavedApplicationsResources } from '../../../Types/Resources/Admissions/IApplicationsResources';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface ISavedApplicationsProps {
    savedApplications: ISavedApplication[];
    resources: ISavedApplicationsResources;

    onRemove: (event: any) => void;
}

const styles = () => createStyles({
    marginBottom: {
        marginBottom: Tokens.spacing40
    },
    marginTop: {
        marginTop: Tokens.spacing30
    }
});

type PropsWithStyles = ISavedApplicationsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const SavedApplications: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        resources,
        savedApplications,
        onRemove
    } = props;

    const savedApplicationList: JSX.Element[] = [];
    if (savedApplications.length > 0) {
        savedApplications.forEach((savedApplication, iSavedApplication) => {

            const linkToSavedApplicationForm = (): void => {
                window.location.assign(`${Constants.webUrl}/Admissions/ApplicationForm/Saved/${savedApplication.token}`);
            };

            savedApplicationList.push(
                <ListItem
                    divider={iSavedApplication !== savedApplications.length-1}
                >
                    <ListItemText
                        id={`liSavedApplication_${iSavedApplication}`}
                        classes={{ root: classes.marginBottom }}
                        primary={(
                            <Grid
                                alignItems="center"
                                container
                                direction="row"
                                justifyContent="space-between"
                                spacing={0}
                            >
                                <Grid item>
                                    <Button
                                        TextProps={{
                                            size: 'h3'
                                        }}
                                        align="left"
                                        id={`lnkSavedApplication_${iSavedApplication}`}
                                        textVariantStyling="inherit"
                                        variant="text"
                                        onClick={linkToSavedApplicationForm}
                                    >
                                        {savedApplication.applicationFormName || ''}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        id="editNameIcon"
                                        placement="top"
                                        title={resources.lblRemove}
                                    >
                                        <IconButton
                                            color="gray"
                                            id={`iconButton_formName|${savedApplication.savedApplicationId}|${savedApplication.applicationFormName}`}
                                            onClick={onRemove}
                                        >
                                            <Icon name="trash" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        )}
                        secondary={(
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Text color="textPrimary" className={classes.marginTop}>
                                        {savedApplication.applicationFormDescription}
                                    </Text>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <Text color="textPrimary">
                                        {`${resources.lblCreated} ${savedApplication.createDatetime}`}
                                    </Text>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    <Text color="textPrimary">
                                        {`${resources.lblLastModified} ${savedApplication.revisionDatetime}`}
                                    </Text>
                                </Grid>
                            </Grid>
                        )}
                    />
                </ListItem>
            );
        });
    }

    let content: JSX.Element | undefined;
    if (resources) {
        content = (
            <ExpansionPanel
                defaultExpanded={true}
                id="epnlSubmittedApplications"
                header={(
                    <Text size="h2">
                        {resources.lblSavedApplications}
                    </Text>
                )}
            >
                <Divider
                    noMarginTop
                    noMarginBottom
                />
                <List id="lstSavedApplications">
                    {savedApplicationList}
                </List>
            </ExpansionPanel>
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
export default withStyles(styles)(SavedApplications);