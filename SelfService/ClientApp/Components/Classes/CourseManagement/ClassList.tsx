/* Copyright 2019 - 2024 Ellucian Company L.P. and its affiliates.
 * File: ClassList.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import EmailModal from '../../Generic/EmailModal';
import ImageList from './ImageList';
import Print from '../../Generic/Print';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Types
import { ClassListStatus } from '../../../Types/Enum/ClassListStatus';
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IClassListResources } from '../../../Types/Resources/Classes/IClassListResources';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { ISectionEnrollment } from '../../../Types/Classes/ISectionEnrollment';
import { IStudentClassList } from '../../../Types/Classes/IStudentClassList';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/ClassList';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
export interface IClassListProps {
    myPosition: number;
    sectionId: number;
    setClassListStatus: (newStatus: ClassListStatus) => void;
    onDownloadModal: () => void;
    onViewDossier?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface IClassListRes extends IClassListResources {
    printing: IPrintResources;
}

interface IClassListState {
    allSelected: boolean;
    classListDetail?: ISectionEnrollment;
    componentError: boolean;
    imageView: boolean;
    isLoading: boolean;
    isStudentSelected: boolean;
    resources?: IClassListRes;
    selectedStatus: ClassListStatus;
    selectedStatusText?: string;
    selectStatus?: IDropDownOption[];

    // #region Email Modal
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

const styles = ((theme: Theme) => createStyles({
    checkboxHeader: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: `${Tokens.spacing35}!important`
        },
        marginLeft: `${Tokens.spacing40}!important`
    },
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    listTyle: {
        [theme.breakpoints.down('sm')]: {
            display: 'block!important'
        },
        listStyleType: 'none',
        margin: 0,
        padding: 0
    },
    marginLeft: {
        marginLeft: Tokens.sizingXSmall
    },
    nameStyle: {
        marginBottom: Tokens.spacing40
    },
    statusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '30%'
            }
        }
    }
}));

type PropsWithStyles = IClassListProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class ClassList extends React.Component<PropsWithStyles, IClassListState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IClassListState>;

    public constructor(props) {
        super(props);
        this.props.setClassListStatus(ClassListStatus.Add);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'ClassList';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IClassListState {
        let resources: IClassListRes | undefined;

        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            allSelected: false,
            componentError: false,
            imageView: false,
            isLoading: true,
            isStudentSelected: false,
            resources: resources,
            selectedStatus: ClassListStatus.Add,

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onSelectAll = (): void => {
        try {
            const {
                allSelected,
                classListDetail,
                isStudentSelected
            } = this.state;

            if (classListDetail?.students) {
                let selectAll: boolean = false;
                if (allSelected || !isStudentSelected) {
                    selectAll = !allSelected;
                }
                classListDetail.students.forEach(student => student.checked = selectAll);
                this.setState({
                    allSelected: selectAll,
                    classListDetail: classListDetail,
                    isStudentSelected: selectAll
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectAll.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>, classList: IStudentClassList[]): void => {
        try {
            const {
                classListDetail
            } = this.state;

            if (classList) {
                const personId: number = Number(event.currentTarget.dataset.id);
                const student: IStudentClassList | undefined = classList.find(a => a.personId === personId);
                if (student) {
                    student.checked = !student.checked;
                    const isStudentSelected: boolean = classList.findIndex(student => student.checked) >= 0;
                    const oneNotSelected: boolean = classList.findIndex(student => !student.checked) >= 0;
                    this.setState({
                        allSelected: !oneNotSelected,
                        classListDetail: classListDetail,
                        isStudentSelected: isStudentSelected
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeImageView = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const element: any = event.target;

            this.setState({
                imageView: JSON.parse(element.dataset.imageview)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeImageView.name, e));
        }
    };

    private onChangeFilter = (optionSelected: IDropDownOption): void => {
        try {
            const {
                classListDetail
            } = this.state;

            this.props.setClassListStatus(Number(optionSelected.value));
            if (optionSelected) {
                if (classListDetail?.students) {
                    classListDetail.students.forEach(student => student.checked = false);
                }
                this.setState({
                    allSelected: false,
                    isStudentSelected: false,
                    selectedStatus: Number(optionSelected.value),
                    selectedStatusText: optionSelected.description
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFilter.name, e));
        }
    };

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                classListDetail
            } = this.state;

            if (classListDetail) {
                const emailSettings: IEmailSettings = classListDetail.emailSettings;
                if (emailSettings.emailProvider === EmailProviderOption.SelfService) {
                    LayoutActions.showPageLoader();
                    this.setState({
                        recipientsEmailAddresses: emailAddresses,
                        openEmailModal: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenEmailModal.name, e));
        }
    };

    private onCloseEmailModal = (): void => {
        try {
            this.setState({
                openEmailModal: false,
                recipientsEmailAddresses: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEmailModal.name, e));
        }
    };
    // #endregion Email Modal
    // #endregion Events

    // #region Functions
    private setSelects = (): void => {
        try {
            const {
                resources
            } = this.state;
            if (resources) {
                const selectStatus: IDropDownOption[] = [
                    { value: ClassListStatus.All, description: resources.lblViewAll },
                    { value: ClassListStatus.Add, description: resources.lblAdd },
                    { value: ClassListStatus.Drop, description: resources.lblDrop },
                    { value: ClassListStatus.Hold, description: resources.lblHold }
                ];
                this.setState({
                    selectStatus: selectStatus
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setSelects.name, e));
        }
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetClassList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetClassList.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    classListDetail: result.data
                }, this.hideLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetClassList.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                Store.setResources(this.props.myPosition, result.data);
                this.setState({
                    resources: result.data
                }, this.setSelects);
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
            const {
                sectionId
            } = this.props;
            const {
                resources
            } = this.state;

            if (!resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
            else {
                this.setSelects();
            }

            Requests.getClassList(sectionId, 0, this.resolveGetClassList);
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
            classes,
            onDownloadModal,
            onViewDossier,
            sectionId
        } = this.props;

        const {
            allSelected,
            classListDetail,
            componentError,
            imageView,
            isLoading,
            isStudentSelected,
            resources,
            selectStatus,
            selectedStatus,

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let emailModal: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrWaitlist" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (classListDetail && classListDetail.studentCount) {
                let statusSelected: IStudentClassList[] = [];
                if (classListDetail.students) {
                    switch (selectedStatus) {
                        case ClassListStatus.All:
                            statusSelected = classListDetail.students;
                            break;

                        case ClassListStatus.Add:
                            statusSelected = classListDetail.students.filter(stud => stud.statusCode === 'A');
                            break;

                        case ClassListStatus.Drop:
                            statusSelected = classListDetail.students.filter(stud => stud.statusCode === 'D');
                            break;

                        case ClassListStatus.Hold:
                            statusSelected = classListDetail.students.filter(stud => stud.statusCode === 'H');
                            break;

                        case undefined:
                            statusSelected = classListDetail.students.filter(stud => stud.statusCode === 'A');
                            break;
                    }
                }

                const onClickEmail = (): void => {
                    const emails: string[] = [];
                    statusSelected.forEach(status => {
                        if (status.checked && status.emailAddress) {
                            emails.push(status.emailAddress);
                        }
                    });

                    if (classListDetail.emailSettings.emailProvider === EmailProviderOption.External) {
                        window.open(Format.toString(classListDetail.emailSettings.staffUrl, [emails.join(classListDetail.emailSettings.staffSeparator)]),
                            classListDetail.emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
                    }
                    else {
                        this.onOpenEmailModal(emails);
                    }
                };

                contentPage = (
                    <>
                        <Grid container className={classes.statusContainer} justifyContent="space-between">
                            <Grid item xs sm={6} md={3}>
                                <Dropdown
                                    id="ddlStatus"
                                    label={resources.lblSelectStatus}
                                    options={selectStatus}
                                    value={selectedStatus}
                                    onChange={this.onChangeFilter}
                                />
                            </Grid>
                            <Grid item>
                                <ButtonGroup id="btgClassListView" toggle>
                                    <Tooltip
                                        id="tltList"
                                        title={resources.btnListView}
                                        aria-label={resources.btnListView}
                                    >
                                        <IconButton
                                            alt={resources.btnListView}
                                            color="secondary"
                                            data-imageview={false}
                                            id="btnList"
                                            selected={!imageView}
                                            onClick={this.onChangeImageView}
                                        >
                                            <Icon name="list-view" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        id="tltImages"
                                        title={resources.btnImageView}
                                        aria-label={resources.btnImageView}
                                    >
                                        <IconButton
                                            alt={resources.btnImageView}
                                            color="secondary"
                                            data-imageview={true}
                                            id="btnImages"
                                            selected={imageView}
                                            onClick={this.onChangeImageView}
                                        >
                                            <Icon name="user" />
                                        </IconButton>
                                    </Tooltip>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                        <br />
                        {statusSelected.length > 0 ? (
                            imageView ? (
                                <ImageList
                                    mailToUrl={classListDetail.emailSettings.staffUrl}
                                    students={statusSelected}
                                    onViewDossier={onViewDossier}
                                />
                            ) : (
                                <>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Checkbox
                                                checked={allSelected || isStudentSelected}
                                                classes={{
                                                    focused: classes.checkboxHeader,
                                                    root: classes.checkboxHeader
                                                }}
                                                id="chkSelectAll"
                                                indeterminate={!allSelected && isStudentSelected}
                                                inputProps={{
                                                    'aria-label': this.layoutResources?.lblSelectAll
                                                }}
                                                onChange={this.onSelectAll}
                                            />
                                            <Tooltip
                                                id="tltEmailSelected"
                                                title={resources.lblEmailButton}
                                                placement="top"
                                            >
                                                <div className={classes.inline}>
                                                    <IconButton
                                                        alt={resources.lblEmailButton}
                                                        classes={{ root: classes.iconHeader }}
                                                        color="secondary"
                                                        disabled={!isStudentSelected}
                                                        onClick={onClickEmail}
                                                        id="EmailSelectedBtn"
                                                    >
                                                        <Icon large name="email" />
                                                    </IconButton>
                                                </div>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item>
                                            <Hidden smDown>
                                                <Button
                                                    TextProps={{
                                                        display: 'inline'
                                                    }}
                                                    IconProps={{
                                                        name: 'download'
                                                    }}
                                                    id="download"
                                                    align="left"
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={onDownloadModal}
                                                >
                                                    {resources.lblDownloadButton}
                                                </Button>
                                            </Hidden>
                                            <Hidden mdUp>
                                                <IconButton
                                                    alt={resources.lblDownloadButton}
                                                    color="secondary"
                                                    onClick={onDownloadModal}
                                                    id="DownloadBtn"
                                                >
                                                    <Icon large name="download" />
                                                </IconButton>
                                            </Hidden>
                                            <Print
                                                classNameButtonText={classes.marginLeft}
                                                classNameIconButton={classes.marginLeft}
                                                resources={resources.printing}
                                                link={`${Constants.webUrl}/Sections/EnrollmentReport/${sectionId}/${selectedStatus}?currentPage=${Constants.headersRequestsJson['X-Current-Page']}`}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Table
                                        breakpoint="sm"
                                        classes={{ root: classes.table }}
                                        id="tblClassList"
                                        variant="expansionPanels"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell component="th">
                                                    {resources.lblNameDetail}
                                                </TableCell>
                                                <TableCell component="th">
                                                    {resources.lblCurriculumDetail}
                                                </TableCell>
                                                <TableCell component="th">
                                                    {resources.lblClassLevelDetail}
                                                </TableCell>
                                                <TableCell component="th">
                                                    {resources.lblClassLoadDetail}
                                                </TableCell>
                                                <TableCell component="th">
                                                    {resources.lblCreditTypeDetail}
                                                </TableCell>
                                                <TableCell component="th">
                                                    {resources.lblStatusDetail}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {statusSelected.map((row, i) => {
                                                const onCheckClick = (event: any): void => {
                                                    this.onChangeCheckbox(event, statusSelected);
                                                };
                                                return (
                                                    <TableExpandableRow key={`studentsList_${row.personId}_${i}`}>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                        >
                                                            <AvatarText
                                                                ButtonProps={onViewDossier ? {
                                                                    'data-id': row.personId,
                                                                    id: `btnStudentName_${i}`,
                                                                    onClick: onViewDossier
                                                                } : undefined}
                                                                CheckboxProps={{
                                                                    checked: Boolean(row.checked),
                                                                    id: `chkStudentName_${i}`,
                                                                    inputProps: {
                                                                        'aria-label': Format.toString(resources.formatSelectStudent, [row.fullName]),
                                                                        'data-id': row.personId
                                                                    },
                                                                    onChange: onCheckClick
                                                                }}
                                                                avatarInfo={row}
                                                                complement={row.withdrawn ? (
                                                                    <StatusLabel
                                                                        id={`stsLblStudentStatus_${i}`}
                                                                        text={resources.lblWithdrawn}
                                                                        type="draft"
                                                                    />
                                                                ) : undefined}
                                                                id={`avtStudent_${i}`}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblCurriculumDetail}
                                                        >
                                                            <ul className={classes.listTyle}>
                                                                {row.studentAcademicRecords ?
                                                                    row.studentAcademicRecords.map((students, i) => (
                                                                        <li
                                                                            className={classes.nameStyle}
                                                                            key={`description_${row.personId}_${i}`}
                                                                        >
                                                                            {students.pdcDescription}
                                                                        </li>

                                                                    )) : undefined}
                                                            </ul>
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblClassLevelDetail}
                                                        >
                                                            <ul className={classes.listTyle}>
                                                                {row.studentAcademicRecords ?
                                                                    row.studentAcademicRecords.map((students, i) => (
                                                                        <li
                                                                            className={classes.nameStyle}
                                                                            key={`class_${row.personId}_${i}`}
                                                                        >
                                                                            {students.classLevel}
                                                                        </li>

                                                                    )) : undefined}
                                                            </ul>
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblClassLoadDetail}
                                                        >
                                                            <ul className={classes.listTyle}>
                                                                {row.studentAcademicRecords ?
                                                                    row.studentAcademicRecords.map((students, i) => (
                                                                        <li
                                                                            className={classes.nameStyle}
                                                                            key={`load_${row.personId}_${i}`}
                                                                        >
                                                                            {students.classLoad}
                                                                        </li>

                                                                    )) : undefined}
                                                            </ul>
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblCreditTypeDetail}
                                                        >
                                                            <span>
                                                                {row.creditType}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblStatusDetail}
                                                        >
                                                            <span>
                                                                {row.statusCode === 'A' ?
                                                                    resources.lblAdd : row.statusCode === 'D' ?
                                                                        resources.lblDrop : resources.lblHold}
                                                            </span>
                                                        </TableCell>
                                                    </TableExpandableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <br />
                                    <Grid container>
                                        <Grid item xs>
                                            <Text align="right">
                                                {Format.toString(resources.formatTotalStudents, [statusSelected.length])}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        ) : (
                            <Illustration
                                color="secondary"
                                height="lg"
                                internalName="no-enrolled"
                                text={resources.lblNoResultsByStatus}
                            />
                        )}
                    </>
                );

                if (openEmailModal) {
                    emailModal = (
                        <EmailModal
                            emailSettings={classListDetail.emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    );
                }
            }
            else {
                contentPage = (
                    <Illustration
                        color="secondary"
                        height="lg"
                        internalName="no-enrolled"
                        text={resources.lblNoResults}
                    />
                );
            }
        }

        return (
            <>
                {contentPage}
                {emailModal}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(ClassList);