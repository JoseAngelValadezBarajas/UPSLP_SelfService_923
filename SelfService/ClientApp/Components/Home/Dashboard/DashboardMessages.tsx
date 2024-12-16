/* Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
 * File: DashboardMessages.tsx
 * Type: Container component */

// #region Imports
import classnames from 'classnames';
import React from 'react';

// Core components
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IDashboardMessagesResources } from '../../../Types/Resources/Home/IDashboardMessagesResources';
import { IDashboardNotification } from '../../../Types/Dashboard/IDashboardNotification';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import DashboardMessageCard, { IDashboardMessageCardResProps } from '../../Generic/DashboardMessageCard';
import DashboardMessagesPanel, { IDashboardMessagesPanelResProps } from './DashboardMessagesPanel';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
//import { useMediaQuery } from '@hedtech/powercampus-design-system/react/core/useMediaQuery';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IDashboardMessagesProps {
    notifications: IDashboardNotification[];
}

interface IDashboardMessagesRes extends IDashboardMessagesResources {
    dashboardMessageCard: IDashboardMessageCardResProps;
    dashboardMessagesPanel: IDashboardMessagesPanelResProps;
}

interface IDashboardMessagesState {
    isLoading: boolean;
    isScrolling: boolean;
    leftButtonVisible: boolean;
    moveToPX: number;
    lowPadding: boolean;
    resources?: IDashboardMessagesRes;
    rightButtonVisible: boolean;
}

const styles = (theme: Theme) => createStyles({
    container: {
        [theme.breakpoints.down('md')]: {
            marginLeft: '-30px',
            marginRight: '-30px'
        },
        alignItems: 'center',
        display: 'flex',
        marginLeft: '-55px',
        marginRight: '-55px'
    },
    carousel: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
        margin: `0 ${Tokens.spacing34} 0 ${Tokens.spacing34}`,
        overflow: 'hidden',
        width: Tokens.widthFluid
    },
    hidden: {
        visibility: 'hidden'
    },
    visible: {
        visibility: 'visible'
    },
    messageCard: {
        flex: '0 0 auto',
        height: '250px',
        margin: Tokens.spacing35,
        transition: `all ${Tokens.durationSlow}`,
        width: 'calc((100% / 2) - 1.313rem)',
        [theme.breakpoints.up('lg')]: {
            width: 'calc((100% / 3) - 1.313rem)'
        },
        ['@media only screen and (min-width: 1440px)']: {
            width: 'calc((100% / 4) - 1.313rem)'
        },
        ['@media only screen and (min-width: 2560px)']: {
            width: 'calc((100% / 4) - 1.313rem)'
        }
    },
    spacingAdjustment: {
        marginTop: '-45px'
    }
});
type PropsWithStyles = IDashboardMessagesProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class DashboardMessages extends React.Component<PropsWithStyles, IDashboardMessagesState> {
    private idModule: string;
    private idPage: string;

    private sliderRef: React.RefObject<any>;
    private adjustedMargin: number;
    private scrollLeft: number;
    private onPage: number;
    private pagesIsInteger: boolean;
    private slideStarted: boolean;
    private pages: number;
    private slidesPerPage: number;
    private cardMargin: number;
    private lowPaddingWidth: number;

    public readonly state: Readonly<IDashboardMessagesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Home';
        this.idPage = 'DashboardMessages';

        // #region Carousel variables initialize
        this.cardMargin = 12;
        this.adjustedMargin = this.cardMargin / 2;
        this.scrollLeft = 0;
        this.lowPaddingWidth = 376;
        this.slideRight = this.slideRight.bind(this);
        this.slideLeft = this.slideLeft.bind(this);

        this.sliderRef = React.createRef();

        this.onPage = 1;
        this.pages = -1;
        this.pagesIsInteger = false;
        this.slideStarted = false;
        this.slidesPerPage = 2;

        this.adjustSlides();
        this.registerEvents();
        // #endregion Carousel variables

        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDashboardMessagesState {
        let isLoading: boolean = true;
        let resources: IDashboardMessagesRes | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            leftButtonVisible: false,
            rightButtonVisible: true,
            isLoading: isLoading,
            isScrolling: false,
            lowPadding: false,
            moveToPX: this.adjustedMargin,
            resources: resources
        };
    }

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetResources.name);
            if (result?.status) {
                this.setState({
                    isLoading: false,
                    resources: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            this.overrideWidth();
            RequestsLayout.getResources(this.idModule, this.idPage, this.resolveGetResources);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentDidUpdate(prevProps) {
        if (this.props.width !== prevProps.width) {
            this.adjustSlides();
            this.overrideWidth();
        }
    }
    // #endregion Lifecycle

    // #region Events
    private slideLeft(): void {
        const {
            moveToPX
        } = this.state;

        const carouselWidth: number = this.calculateCarouselWidth();

        let leftButtonVisible: boolean = true;
        let rightButtonVisible: boolean = true;
        let pixsToMove: number = 0;

        this.onPage = this.onPage - 1;

        if (this.slideStarted && this.onPage === 1) {
            pixsToMove = 0;
            this.slideStarted = false;
            leftButtonVisible = false;
        }
        else if (this.onPage === Math.ceil(this.pages) && !this.pagesIsInteger) {
            pixsToMove = carouselWidth;
            this.slideStarted = true;
            rightButtonVisible = false;
        }
        else if (this.onPage === this.pages) {
            this.slideStarted = false;
            rightButtonVisible = false;
        }
        else {
            pixsToMove = carouselWidth;
            this.slideStarted = true;
        }

        this.setState({
            leftButtonVisible: leftButtonVisible,
            rightButtonVisible: rightButtonVisible,
            moveToPX: pixsToMove === 0 ? this.adjustedMargin : moveToPX - pixsToMove
        });
    }

    private slideRight(): void {
        const {
            moveToPX
        } = this.state;

        const carouselWidth = this.calculateCarouselWidth();

        let leftButtonVisible = true;
        let rightButtonVisible = true;
        let pixsToMove;

        this.onPage = this.onPage + 1;
        this.scrollLeft = this.calculateDiff();

        if (this.slideStarted && this.onPage === 1) {
            this.slideStarted = false;
            leftButtonVisible = false;
        }
        else if (this.onPage === Math.ceil(this.pages) && !this.pagesIsInteger) {
            pixsToMove = this.scrollLeft;
            this.slideStarted = true;
            rightButtonVisible = false;
        }
        else if (this.onPage === this.pages) {
            pixsToMove = carouselWidth;
            this.slideStarted = false;
            rightButtonVisible = false;
        }
        else {
            pixsToMove = carouselWidth;
            this.slideStarted = true;
        }

        this.setState({
            isScrolling: true,
            leftButtonVisible: leftButtonVisible,
            moveToPX: moveToPX + pixsToMove,
            rightButtonVisible: rightButtonVisible
        });
    }

    private onCardTransitionEnd = (): void => {
        this.setState({
            isScrolling: false
        });
    };
    // #endregion Events

    // #region Functions
    private registerEvents(): void {
        window.addEventListener("resize", () => {
            if (this.state.moveToPX !== this.adjustedMargin) {
                this.onPage = 1;
                this.setState({
                    leftButtonVisible: false,
                    rightButtonVisible: true,
                    moveToPX: this.adjustedMargin
                });
            }
            this.adjustSlides();
            this.overrideWidth();
        });
    }

    private calculateCarouselWidth(): number {
        const adjustFactor = this.slidesPerPage * this.cardMargin * 2;
        const { childNodes } = this.sliderRef.current;
        const slideWidth: number = childNodes[0].clientWidth;

        return slideWidth * this.slidesPerPage + adjustFactor;
    }

    private calculateDiff(): number {
        const { scrollWidth, clientWidth } = this.sliderRef.current;
        return scrollWidth - clientWidth + this.adjustedMargin;
    }

    private adjustSlides(): void {
        const {
            notifications,
            width
        } = this.props;

        switch (width) {
            case 'md':
                this.slidesPerPage = 2;
                break;

            case 'lg':
                this.slidesPerPage = 3;
                break;

            case 'xl':
                this.slidesPerPage = 4;
                break;

            default:
                this.slidesPerPage = 2;
        }

        this.pages = notifications.length / this.slidesPerPage;
    }

    private overrideWidth(): void {
        const {
            width,
            notifications
        } = this.props;

        let rightButtonVisible = true;
        if (width === 'md' && notifications.length <= 2) {
            rightButtonVisible = false;
        }
        else if (width === 'lg' && notifications.length <= 3) {
            rightButtonVisible = false;
        }
        else if (width === 'xl' && notifications.length <= 4) {
            rightButtonVisible = false;
        }
        else if (window.innerWidth >= 1440 && notifications.length === 4) {
            rightButtonVisible = false;
        }

        this.setState({
            lowPadding: window.innerWidth / this.slidesPerPage < this.lowPaddingWidth,
            leftButtonVisible: false,
            rightButtonVisible: rightButtonVisible
        });
    }

    // #endregion Functions

    public render(): JSX.Element {
        const {
            classes,
            notifications
        } = this.props;

        const {
            leftButtonVisible,
            rightButtonVisible,
            isLoading,
            isScrolling,
            lowPadding,
            moveToPX,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrDashboardMessages" />);
            }
            else {
                contentPage = (
                    <>
                        {notifications.length > 0 && (
                            <>
                                <Hidden smDown>
                                    <div className={classes.container}>
                                        <Tooltip
                                            id="tltMoveToLeft"
                                            title={resources.lblMoveToLeft}
                                        >
                                            <IconButton
                                                color="secondary"
                                                onClick={this.slideLeft}
                                                className={classnames(classes.hidden,
                                                    { [classes.visible]: leftButtonVisible }
                                                )}
                                            >
                                                <Icon name="chevron-left" />
                                            </IconButton>
                                        </Tooltip>
                                        <div className={classes.carousel} ref={this.sliderRef}>
                                            {notifications.map((notification, iNotification) => (
                                                <DashboardMessageCard
                                                    key={`DashboardMessageCard_${iNotification}`}
                                                    className={classes.messageCard}
                                                    dashboardMessage={notification}
                                                    index={iNotification + 1}
                                                    lowPadding={lowPadding}
                                                    overallCount={notifications.length}
                                                    moveToPX={moveToPX}
                                                    resources={resources.dashboardMessageCard}
                                                    onCardTransitionEnd={iNotification == 0 ? this.onCardTransitionEnd : null}
                                                />
                                            ))}
                                        </div>
                                        <Tooltip
                                            id="tltMoveToRight"
                                            title={resources.lblMoveToRight}
                                        >
                                            <IconButton
                                                disabled={isScrolling}
                                                color="secondary"
                                                onClick={this.slideRight}
                                                className={classnames(classes.hidden,
                                                    { [classes.visible]: rightButtonVisible }
                                                )}
                                            >
                                                <Icon name="chevron-right" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </Hidden>
                                <Hidden mdUp>
                                    <DashboardMessagesPanel
                                        notifications={notifications}
                                        resources={resources.dashboardMessagesPanel}
                                    />
                                </Hidden>
                            </>
                        )}
                    </>
                );
            }
        }

        return (
            <div className={classes.spacingAdjustment}>
                {contentPage}
            </div>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(DashboardMessages));