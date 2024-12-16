/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: ConEdSectionsSearch.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion

// #region Internal types
export interface IConEdSectionsSearchProps {
    countResults: number;
    dirtySearch: boolean;
    keywords?: string;
    resources: IConEdSectionsSearchResProps;
    onBasicSearchChange: (event: any) => void;
    onBasicSearchClear: () => void;
    onBasicSearchEnterPress: (searchValue: string) => void;
    onNewSearch: () => void;
    onOpenAdvancedSearchModal: () => void;
}

export interface IConEdSectionsSearchResProps {
    btnAdvancedSearch: string;
    btnNewSearch: string;
    formatResult: string;
    formatResults: string;
    lblSearchTitle: string;
    lblNoResults: string;
}

const styles = createStyles({
    indicatorResults: {
        marginTop: Tokens.spacing40
    },
    marginText: {
        marginTop: `${Tokens.spacing40}!important`
    }
});

type PropsWithStyles = IConEdSectionsSearchProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ConEdSectionsSearch: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        countResults,
        dirtySearch,
        keywords,
        resources,
        onBasicSearchChange,
        onBasicSearchClear,
        onBasicSearchEnterPress,
        onNewSearch,
        onOpenAdvancedSearchModal
    } = props;

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container>
                        <Grid item xs>
                            <Text
                                id="txtSearchTitle"
                                size="large"
                            >
                                {resources.lblSearchTitle}
                            </Text>
                            <Search
                                id="txtSearch"
                                className={classes.marginText}
                                value={keywords}
                                onChange={onBasicSearchChange}
                                onClear={onBasicSearchClear}
                                onSearchInvoked={onBasicSearchEnterPress}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Button
                                id="btnAdvancedSearch"
                                align="left"
                                textVariantStyling="inherit"
                                variant="text"
                                onClick={onOpenAdvancedSearchModal}
                            >
                                {resources.btnAdvancedSearch}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                id="btnNewSearch"
                                align="left"
                                textVariantStyling="inherit"
                                variant="text"
                                onClick={onNewSearch}
                            >
                                {resources.btnNewSearch}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            {dirtySearch && (
                <>
                    {!countResults ?
                        <Grid container className={classes.indicatorResults}>
                            <Grid item xs>
                                <Card>
                                    <CardContent>
                                        <Illustration
                                            name="no-search-results"
                                            text={resources.lblNoResults}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        :
                        <Grid container className={classes.indicatorResults}>
                            <Grid item>
                                <Text>
                                    {Format.toString(countResults === 1 ?
                                        resources.formatResult
                                        : resources.formatResults, [countResults])}
                                </Text>
                            </Grid>
                        </Grid>
                    }
                </>
            )}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(ConEdSectionsSearch);