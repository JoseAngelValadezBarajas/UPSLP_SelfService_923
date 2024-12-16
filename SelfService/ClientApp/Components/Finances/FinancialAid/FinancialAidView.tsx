/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FinancialAidView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Internal components
import FinancialAidMain from '../FinancialAid/FinancialAidMain';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IFinancialAidResources } from '../../../Types/Resources/Finances/IFinancialAidResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// #endregion

// #region Internal types
interface IFinancialAidState {
    awardYearToken?: string;
    componentError: boolean;
    resources?: IFinancialAidResources;
}

// #endregion

// #region Component
class FinancialAidView extends React.Component<any, IFinancialAidState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IFinancialAidState>;

    // Constructor
    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Finances';
        this.idPage = 'FinancialAid';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    // Init State
    private getInitialState(): IFinancialAidState {
        let resources: IFinancialAidResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            resources: resources
        };
    }

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    private resolveLayoutReady() {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                const hdnAwardYearToken: HTMLInputElement | undefined =
                    document.getElementById('hdnAwardYearToken') as HTMLInputElement;
                if (hdnAwardYearToken && hdnAwardYearToken.value) {
                    const awardYearToken: string = hdnAwardYearToken.value;
                    this.setState({
                        awardYearToken: awardYearToken
                    })
                }
                hdnAwardYearToken.remove();
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    }

    // State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IFinancialAidResources | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.setState({
                componentError: true
            }, () => this.logError(LogData.layoutNoReady(this.onLayoutReady.name)));
        }
    }

    // Lifecycle
    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
    }

    public componentDidCatch(error, info): void {
        this.setState({
            componentError: true
        }, () => {
            this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
            this.redirectError(500);
        });
    }

    // Render
    public render(): JSX.Element {
        const {
            awardYearToken,
            componentError,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            contentPage = (
                <FinancialAidMain
                    awardYearToken={awardYearToken}
                />
            );
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
            </Layout>
        );
    }
}

const FinancialAidViewWithLayout = withLayout(FinancialAidView);
// #endregion

// RenderDOM: Component
ReactDOM.render(<FinancialAidViewWithLayout />, document.getElementById('root'));