/* Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 * File: AdviseesSearchOptions.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import AdviseesSearchModal, { IAdviseesSearchModalResProps } from './AdviseesSearchModal';

// Internal components
import AdvancedSearchModal, { IAdvancedSearchModalResProps } from '../AdvancedSearchModal';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
import { IAdvancedSearchAdvising } from '../../../Types/Advisees/IAdvancedSearchAdvising';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion

// #region Internal types
export interface IAdviseesSearchOptionsProps {
    advancedSearchAdvisee: IAdvancedSearchAdvising;
    hidePendingSchedulesOption?: boolean;
    keyword: string;
    listOptions: IDropDownOption[];
    listOptionSelected: number;
    openAdvancedSearchModal: boolean;
    openSearchModal: boolean;
    resources: IAdviseesSearchOptionsResProps;
    onButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onChangeDropdown: (option: IDropDownOption, id: string) => void;
    onChangeListRdoB: (event: any) => void;
    onChangeTextField: (event: any) => void;
    onClear: () => void;
    onCloseModal: (modalName: string) => void;
    onEnterSearch: (searchValue: string) => void;
    onOpenModal: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface IAdviseesSearchOptionsResProps {
    advancedSearchModal: IAdvancedSearchModalResProps;
    adviseesSearchModal: IAdviseesSearchModalResProps;
    lblFilter: string;
    lblFilterSearch: string;
    lblList: string;
    lblSearchMask: string;
}

const styles = (() => createStyles({
    advancedLink: {
        alignItems: 'center',
        display: 'inline-flex'
    },
    buttonStyle: {
        bottom: Tokens.spacing80,
        justifyContent: 'center',
        left: 0,
        margin: 0,
        position: 'fixed',
        top: 'auto',
        zIndex: Tokens.zIndexActionMenu
    },
    iconRoot: {
        marginRight: Tokens.sizingXSmall
    }
}));

type PropsWithStyles = IAdviseesSearchOptionsProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const AdviseesSearchOptions: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        advancedSearchAdvisee,
        classes,
        hidePendingSchedulesOption,
        keyword,
        listOptions,
        listOptionSelected,
        openAdvancedSearchModal,
        openSearchModal,
        resources,
        onButtonClick,
        onChangeDropdown,
        onChangeListRdoB,
        onChangeTextField,
        onClear,
        onCloseModal,
        onEnterSearch,
        onOpenModal
    } = props;

    const content: JSX.Element | undefined = (
        <>
            <Hidden mdUp>
                <Grid container className={classes.buttonStyle}>
                    <Grid item>
                        <Button
                            id="btnFilterSearch"
                            onClick={onOpenModal}
                        >
                            <Icon name="filter" className={classes.iconRoot} />
                            {resources.lblFilterSearch}
                        </Button>
                    </Grid>
                </Grid>
                {openSearchModal && (
                    <AdviseesSearchModal
                        keyword={keyword}
                        listOptions={listOptions as IRadioOption[]}
                        listOptionSelected={listOptionSelected}
                        open={openSearchModal}
                        resources={resources.adviseesSearchModal}
                        onChangeList={onChangeListRdoB}
                        onChangeTextField={onChangeTextField}
                        onClear={onClear}
                        onClickApply={onButtonClick}
                        onCloseModal={onCloseModal}
                        onOpenModal={onOpenModal}
                    />
                )}
            </Hidden>
            <Hidden smDown>
                <Grid container>
                    <Grid item xs={12} sm={6} md={3}>
                        <Dropdown
                            id="ddlAdviseesListOptions"
                            label={resources.lblList}
                            options={listOptions}
                            value={listOptionSelected}
                            onChange={onChangeDropdown}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Search
                            id="txtSearchOptions"
                            placeholder={resources.lblSearchMask}
                            value={keyword}
                            onChange={onChangeTextField}
                            onClear={onClear}
                            onSearchInvoked={onEnterSearch}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2} className={classes.advancedLink}>
                        <Link
                            id="lnkAdvancedSearch"
                            onClick={onOpenModal}
                        >
                            <Text
                                color="inherit"
                            >
                                {resources.advancedSearchModal.lblAdvancedSearch}
                            </Text>
                        </Link>
                    </Grid>
                </Grid>
            </Hidden>
            {openAdvancedSearchModal && (
                <AdvancedSearchModal
                    advancedSearchAdvising={advancedSearchAdvisee}
                    hidePendingSchedulesOption={hidePendingSchedulesOption}
                    listOptionSelected={listOptionSelected}
                    onButtonClick={onButtonClick}
                    onChangeDropdown={onChangeDropdown}
                    onChangeTextField={onChangeTextField}
                    onCloseModal={onCloseModal}
                    open={openAdvancedSearchModal}
                    resources={resources.advancedSearchModal}
                />
            )}
        </>
    );

    return (
        content
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(AdviseesSearchOptions);