/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: EthnicityMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import FormControl, { FormControlLabel, FormGroup } from '@hedtech/powercampus-design-system/react/core/FormControl';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEthnicity } from '../../../Types/Account/IEthnicity';
import { IEthnicityMain } from '../../../Types/Account/IEthnicityMain';
import { IEthnicityMainResources } from '../../../Types/Resources/Account/IEthnicityMainResources';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/EthnicityMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
interface IEthnicityMainState {
    componentError: boolean;
    ethnicityInfo?: IEthnicityMain[];
    isHispanicEmpty: boolean;
    isHispanicNoAndEthnicityEmpty: boolean;
    isLoading: boolean;
    isNotValidSave: boolean;
    optionSelected: number;

    resources?: IEthnicityMainResources;
}

const styles = createStyles({
    cardContainerTop: {
        marginTop: Tokens.spacing40
    },
    category: {
        marginBottom: Tokens.spacing30,
        marginLeft: Tokens.spacing50
    },
    errorText: {
        marginBottom: Tokens.spacing30,
        marginTop: Tokens.spacing30
    },
    federalCategory: {
        '& > span:nth-child(2)': {
            fontWeight: Tokens.fontWeightBold
        },
        marginBottom: Tokens.spacing30
    }
});

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class EthnicityMain extends React.Component<PropsWithStyles, IEthnicityMainState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IEthnicityMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Account';
        this.idPage = 'EthnicityMain';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IEthnicityMainState {
        let resources: IEthnicityMainResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            ethnicityInfo: undefined,
            isHispanicEmpty: false,
            isHispanicNoAndEthnicityEmpty: false,
            isLoading: true,
            isNotValidSave: false,
            optionSelected: 0, // Select...

            resources: resources
        };
    }
    // #region Events
    private onChangeDropdown = (optionSelected: IDropDownOption, _id: string) => {
        try {
            const {
                ethnicityInfo,
                isHispanicEmpty,
                isHispanicNoAndEthnicityEmpty,
                isNotValidSave
            } = this.state;

            if (ethnicityInfo) {
                switch (Number(optionSelected.value)) {
                    case 0: // Option 'Select...'
                        ethnicityInfo.forEach(item => { // Changes to false all categories and subcategorios
                            item.isSelected = false;
                        });
                        break;
                    case 1: // Option 'Yes'
                        if (ethnicityInfo[0]) { // Changes to true Hispanic federal category
                            ethnicityInfo[0].isSelected = true;
                        }
                        break;
                    case 2: // Option 'No'
                        ethnicityInfo.forEach(item => {
                            if (item.ipedsFederalCategoryId === 1) { // Changes to false all subcategories of hispanic section
                                item.isSelected = false;
                            }
                        });
                        break;
                }
            }

            this.setState({
                ethnicityInfo: ethnicityInfo,
                isHispanicEmpty: Number(optionSelected.value) === 0 ? isHispanicEmpty : false, // Select...
                isHispanicNoAndEthnicityEmpty: Number(optionSelected.value) === 0
                    || Number(optionSelected.value) === 1 ? false : isHispanicNoAndEthnicityEmpty, //  Select... || Yes
                isNotValidSave: Number(optionSelected.value) === 1
                    || Number(optionSelected.value) === 2 ? false : isNotValidSave, // Yes || No
                optionSelected: Number(optionSelected.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                ethnicityInfo,
                isNotValidSave,
                optionSelected
            } = this.state;

            const ids: string[] = event.target.id.split('_');
            let federalIndex: number;
            let dropdownOption: number = optionSelected;
            let newIsNotValidSave: boolean = isNotValidSave;
            if (ethnicityInfo) {
                if (ethnicityInfo[Number(ids[1])]) {
                    if (ethnicityInfo[Number(ids[1])].ipedsFederalCategoryId === 1) { // if Hispanic/Latino checkboxes change
                        dropdownOption = 1; // Sets 'Yes' Option in Hispanic federal category
                        newIsNotValidSave = false;
                    }
                    ethnicityInfo[Number(ids[1])].isSelected = !ethnicityInfo[Number(ids[1])].isSelected;
                    // Set federalCategory automatically:
                    if (ethnicityInfo[Number(ids[1])].isSelected) { // if isSelected === true
                        federalIndex = ethnicityInfo.findIndex(item =>
                            item.ipedsFederalCategoryId === ethnicityInfo[Number(ids[1])].ipedsFederalCategoryId);
                        if (federalIndex > -1) {
                            ethnicityInfo[federalIndex].isSelected = true;
                        }
                    }
                    else if (!ethnicityInfo[Number(ids[1])].ipedsEthnicityId) { // if isSelected === false and ipedsEthnicityId is null
                        // Sets all subcategories of federalCategory to false
                        ethnicityInfo.forEach(item => {
                            if (item.ipedsFederalCategoryId === ethnicityInfo[Number(ids[1])].ipedsFederalCategoryId
                                && item.ipedsEthnicityId) {
                                item.isSelected = false;
                            }
                        });
                    }
                }
            }

            this.setState({
                ethnicityInfo: ethnicityInfo,
                isHispanicNoAndEthnicityEmpty: false,
                isNotValidSave: newIsNotValidSave,
                optionSelected: dropdownOption
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onSaveEthnicity = () => {
        try {
            const {
                ethnicityInfo,
                optionSelected
            } = this.state;

            const ethnicity: IEthnicity[] = [];
            if (ethnicityInfo) {
                if (optionSelected === 0) {// If Select... is selected
                    if (ethnicityInfo.find(item => item.isSelected)) {
                        this.setState({
                            isHispanicEmpty: true,
                            isNotValidSave: false
                        });
                    }
                    else {
                        this.setState({
                            isHispanicEmpty: false,
                            isNotValidSave: true
                        });
                    }
                }
                else {
                    ethnicityInfo.forEach(item => {
                        if (item.isSelected) {
                            ethnicity.push({
                                federalEthnicity: item.ipedsFederalCategoryId,
                                ipedsEthnicityId: item.ipedsEthnicityId
                            });
                        }
                    });
                    if (ethnicity.length > 0) {
                        LayoutActions.showPageLoader();
                        Requests.postEthnicty(ethnicity, this.resolvePostEthnicity, this.logError);
                    }
                    else {
                        this.setState({
                            isHispanicNoAndEthnicityEmpty: true
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveEthnicity.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getEthnicityInfo(
                        this.resolveGetEthnicityInfo,
                        this.logError);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetEthnicityInfo = (json: string): void => {
        try {
            const {
                optionSelected
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetEthnicityInfo.name, this.hideAllLoaders);

            let dropdownOption: number = optionSelected;

            if (result?.status) {
                const ethnicity: IEthnicityMain[] = result.data;
                for (const item of ethnicity) {
                    if (item.ipedsFederalCategoryId === 1 && !item.ipedsEthnicityId && item.isSelected) {
                        dropdownOption = 1; // Sets dropdown option to "Yes"
                        break;
                    }
                    else {
                        /* Checks the 'No' case, to allow the 'Select...' case*/
                        if (item.ipedsFederalCategoryId !== 1 && !item.ipedsEthnicityId && item.isSelected) {
                            dropdownOption = 2; // Sets dropdown option to "No"
                            break;
                        }
                    }
                }
                this.setState({
                    ethnicityInfo: ethnicity,
                    optionSelected: dropdownOption
                }, () => {
                    this.hideAllLoaders();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetEthnicityInfo.name, e));
        }
    };

    private resolvePostEthnicity = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostEthnicity.name, this.hideAllLoaders);

            const {
                resources
            } = this.state;

            if (result?.status) {
                if (resources) {
                    LayoutActions.setAlert({
                        message: resources.lblSuccess,
                        messageType: ResultType.success,
                        snackbar: true
                    });
                }
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostEthnicity.name, e));
        }
    };

    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentDidCatch(error, info): void {
        this.setState({
            componentError: true
        }, () => {
            this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
            this.redirectError(500);
        });
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            componentError,
            ethnicityInfo,
            isHispanicEmpty,
            isHispanicNoAndEthnicityEmpty,
            isLoading,
            isNotValidSave,
            optionSelected,

            resources
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        const checkboxContent: JSX.Element[] = [];
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (!componentError && resources) {
            const errorHispanicEmpty: JSX.Element = (
                <Text className={classes.errorText} color="error">
                    {resources.lblErrorHispanicEmpty}
                </Text>
            );
            const emptyMessage: JSX.Element = (
                <Text className={classes.errorText} color="error">
                    {resources.lblEmptyText}
                </Text>
            );
            const errorMessage: JSX.Element = (
                <Text className={classes.errorText} color="error">
                    {resources.lblErrorText}
                </Text>
            );
            if (ethnicityInfo) {
                const dropdownOptions: IDropDownOption[] = [
                    { value: 0, description: resources.lblSelect },
                    { value: 1, description: resources.lblYes },
                    { value: 2, description: resources.lblNo }
                ];

                ethnicityInfo.forEach((item, i) => {
                    if (item.ipedsEthnicityId) {
                        checkboxContent.push(
                            <FormControlLabel
                                classes={{ root: classes.category }}
                                control={
                                    (
                                        <Checkbox
                                            checked={item.isSelected}
                                            id={`ethnicity_${i}`}
                                            onChange={this.onChangeCheckbox}
                                            value={String(item.ipedsEthnicityId)}
                                        />
                                    )}
                                label={item.ipedsEthnicityDesc}
                                key={`ethnicityCategory_${i}`}
                            />
                        );
                    }
                    else {
                        if (item.ipedsFederalCategoryId !== 1) {
                            checkboxContent.push(
                                <React.Fragment key={`federalCategory_${i}`}>
                                    {item.ipedsFederalCategoryId === 2 ? (
                                        <>
                                            <Text size="h4" weight="strong" gutterBottom>
                                                {resources.lblSelectMoreRaces}
                                            </Text>
                                        </>
                                    ) : undefined}
                                    <FormControlLabel
                                        classes={{ root: classes.federalCategory }}
                                        control={
                                            (
                                                <Checkbox
                                                    checked={item.isSelected}
                                                    id={`federal_${i}`}
                                                    onChange={this.onChangeCheckbox}
                                                    value={String(item.ipedsFederalCategoryId)}
                                                />
                                            )
                                        }
                                        label={item.ipedsFederalCategoryDesc}
                                    />
                                </React.Fragment>
                            );
                        }
                    }
                });

                contentPage = (
                    <Grid container spacing={3} className={classes.cardContainerTop}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Text size="h2">
                                                {resources.lblEthnicityInformation}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Text size="h4" weight="strong">
                                                {resources.lblAreYouHispanic}
                                            </Text>
                                            {isHispanicNoAndEthnicityEmpty ? emptyMessage : undefined}
                                            {isHispanicEmpty ? errorHispanicEmpty : undefined}
                                            {isNotValidSave ? errorMessage : undefined}
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={4} lg={4}>
                                            <Dropdown
                                                id="ddlAreYouHispanic"
                                                label={resources.lblHispanicLatino}
                                                options={dropdownOptions}
                                                value={optionSelected}
                                                error={isNotValidSave || isHispanicEmpty}
                                                required
                                                onChange={this.onChangeDropdown}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl component="fieldset">
                                                <FormGroup>
                                                    {checkboxContent}
                                                </FormGroup>
                                            </FormControl>
                                            <br />
                                            <Button
                                                id="btnSaveEthnicity"
                                                onClick={this.onSaveEthnicity}
                                            >
                                                {resources.btnSave}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid >
                );
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(EthnicityMain);