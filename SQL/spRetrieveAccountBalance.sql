GO
/****** Object:  StoredProcedure [dbo].[spRetrieveAccountBalance]    Script Date: 11/21/2024 5:24:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[spRetrieveAccountBalance]( @personId int, @academicYear nvarchar(4),
		@academicTerm nvarchar(10), @academicSession nvarchar(10), 
		@showDetail nvarchar(1), @showWashOuts nvarchar(1), @includeAnticipated nvarchar(1)
	)

AS
/***********************************************************************
Description:
	Returns Account Balance Information for the specific person and period.
Parameters:  
	@personId - Person ID
	@academicYear - Year
	@academicTerm - Term
	@academicSession - Session
	@showDetail - Show Detail records in Results
	@showWashOuts - Show Washouts in results
	@includeAnticipated - Include Anticipated Aid
History:
	11/14/2005  mfields -  Created procedure. 
	DATE  DEVELOPER_NAME_OR_INITIALS - DESCRIPTION_OF_CHANGES_IN_PLAIN_ENGLISH
	7/6/2017	avidal - get anticipated aid for period. POW-4134 CR-000148537
Usage: 
	exec spRetrieveAccountBalance @personId, @academicYear, @academicTerm, 
	@academicSession, 'Y', 'N', 'N'


************************************************************************/
declare @PeopleCodeId nvarchar(10)
select @PeopleCodeId = ( select PEOPLE_CODE_ID from People where PersonId = @personId )
If @PeopleCodeId is null return(1) 

declare @summaryBalanceTotal decimal (18,6)
declare @otherPeriodsTotal decimal (18,6)
declare @anticipatedAidTotal decimal (18,6)
declare @anticipatedAidPeriodTotal decimal (18,6)
declare @balanceType nvarchar(15)
declare @summaryTypes table
(
	SummaryType nvarchar(6),
	SummaryTypeDescription nvarchar(255),
	Amount numeric(18,6)
)
create table #charges(
	chargecreditnumber int NOT NULL,
	academic_year nvarchar(4) NULL,
	academic_term nvarchar(10) NULL,
	academic_session nvarchar(10) NULL,
	charge_credit_code nvarchar(10) NULL,
	charge_credit_type nvarchar(1) NULL,
	amount numeric(18,6) NULL,
	void_flag nvarchar(1) NULL,
	SessionDesc nvarchar(10) NULL,
	TermDesc nvarchar(10) NULL,
	crg_crd_desc nvarchar(40) NULL,
	ChargeDesc nvarchar(20) NULL,
	Entry_Date datetime NULL,
	PreBill_Flag nvarchar(1) NULL,
	Summary_Type nvarchar(6) NULL,
	Anticipated_Flag nvarchar(1) NULL,
	Due_Date datetime NULL);

/* Calculate which balance type should be utilized through out the rest of the queries */
if (@academicYear = '' and @academicTerm = '' and @academicSession = '')
begin
	set @balanceType = 'CURR'
end
else if (@academicYear <> '' and @academicTerm <> '' and @academicSession = '')
begin
	set @balanceType = 'ALLTERM'
end
else if (@academicYear <> '' and @academicTerm <> '' and @academicSession <> '')
begin
	set @balanceType = 'YTS'
end

insert into @summaryTypes (SummaryType, 
	SummaryTypeDescription, Amount)
select 	pob.summary_type, 
	Coalesce(cst.MEDIUM_DESC, pob.summary_type),  pob.balance_amount
from dbo.PEOPLEORGBALANCE pob 
	left join dbo.CODE_SUMMARYTYPE cst 
		on pob.SUMMARY_TYPE = cst.CODE_VALUE_KEY
where 	pob.BALANCE_TYPE = @balanceType
	and pob.PEOPLE_ORG_CODE_ID = @PeopleCodeId
	and pob.ACADEMIC_YEAR = @academicYear
	and pob.ACADEMIC_TERM = @academicTerm
	and pob.ACADEMIC_SESSION = @academicSession
order by cst.SORT_ORDER;

-- AccountSummary
select SummaryType, SummaryTypeDescription, Amount
from @summaryTypes
where SummaryType <> '';

/* Generate ChargeCredit Records */
if ( @showDetail = 'Y' )
begin
	if ( @balanceType = 'CURR' )
	begin
		insert into #charges( academic_year, academic_term, academic_session, charge_credit_code, 
			amount, chargecreditnumber, charge_credit_type, void_flag, sessiondesc, termdesc, 
			crg_crd_desc, chargedesc, entry_date, prebill_flag, summary_type , anticipated_flag, due_date )
		select cc.ACADEMIC_YEAR, cc.ACADEMIC_TERM, cc.ACADEMIC_SESSION, cc.CHARGE_CREDIT_CODE, 
			cc.AMOUNT, cc.CHARGECREDITNUMBER, cc.CHARGE_CREDIT_TYPE, cc.VOID_FLAG, cas.SHORT_DESC, cat.SHORT_DESC, 
			cc.CRG_CRD_DESC, ccc.MEDIUM_DESC, cc.ENTRY_DATE, cc.PREBILL_FLAG, cc.SUMMARY_TYPE , cc.ANTICIPATED_FLAG,
			cc.DUE_DATE
		from dbo.CHARGECREDIT cc 
			left join dbo.CODE_CHARGECREDIT ccc on cc.CHARGE_CREDIT_CODE = ccc.CODE_VALUE_KEY
			left join dbo.CODE_ACASESSION cas on cc.ACADEMIC_SESSION = cas.CODE_VALUE_KEY
			left join dbo.CODE_ACATERM cat on cc.ACADEMIC_TERM = cat.CODE_VALUE_KEY
		where cc.PEOPLE_ORG_CODE_ID= @PeopleCodeId
			and cc.BEGINNING_BAL_FLAG='N' 
			and cc.VOID_FLAG='N' 
			and cc.PREBILL_FLAG = 'N'
		order by cas.SORT_ORDER, cc.ENTRY_DATE, ccc.PRINT_ORDER;
	end
	if ( @balanceType = 'ALLTERM' )
	begin
		insert into #charges( academic_year, academic_term, academic_session, charge_credit_code, 
			amount, chargecreditnumber, charge_credit_type, void_flag, sessiondesc, termdesc, 
			crg_crd_desc, chargedesc, entry_date, prebill_flag, summary_type , anticipated_flag, due_date )
		select cc.ACADEMIC_YEAR, cc.ACADEMIC_TERM, cc.ACADEMIC_SESSION, cc.CHARGE_CREDIT_CODE, 
			cc.AMOUNT, cc.CHARGECREDITNUMBER, cc.CHARGE_CREDIT_TYPE, cc.VOID_FLAG, cas.SHORT_DESC, cat.SHORT_DESC, 
			cc.CRG_CRD_DESC, ccc.MEDIUM_DESC, cc.ENTRY_DATE, cc.PREBILL_FLAG, cc.SUMMARY_TYPE , cc.ANTICIPATED_FLAG,
			cc.DUE_DATE
		from CHARGECREDIT cc 
			left join dbo.CODE_CHARGECREDIT ccc on cc.CHARGE_CREDIT_CODE = ccc.CODE_VALUE_KEY
			left join dbo.CODE_ACASESSION cas on cc.ACADEMIC_SESSION = cas.CODE_VALUE_KEY
			left join dbo.CODE_ACATERM cat on cc.ACADEMIC_TERM = cat.CODE_VALUE_KEY
		where cc.ACADEMIC_YEAR=@academicYear 
			and cc.ACADEMIC_TERM=@academicTerm
			and cc.PEOPLE_ORG_CODE_ID= @PeopleCodeId
			and cc.BEGINNING_BAL_FLAG='N' 
			and cc.VOID_FLAG='N' 
			and cc.PREBILL_FLAG = 'N'
		order by cas.SORT_ORDER, cc.ENTRY_DATE, ccc.PRINT_ORDER;
	end
	if ( @balanceType = 'YTS' )
	begin
		insert into #charges( academic_year, academic_term, academic_session, charge_credit_code, 
			amount, chargecreditnumber, charge_credit_type, void_flag, sessiondesc, termdesc, 
			crg_crd_desc, chargedesc, entry_date, prebill_flag, summary_type , anticipated_flag, due_date )
		select cc.ACADEMIC_YEAR, cc.ACADEMIC_TERM, cc.ACADEMIC_SESSION, cc.CHARGE_CREDIT_CODE, 
			cc.AMOUNT, cc.CHARGECREDITNUMBER, cc.CHARGE_CREDIT_TYPE, cc.VOID_FLAG, cas.SHORT_DESC, cat.SHORT_DESC, 
			cc.CRG_CRD_DESC, ccc.MEDIUM_DESC, cc.entry_date, cc.PREBILL_FLAG, cc.SUMMARY_TYPE , cc.ANTICIPATED_FLAG,
			cc.DUE_DATE
		from CHARGECREDIT cc 
			left join CODE_CHARGECREDIT ccc on cc.CHARGE_CREDIT_CODE = ccc.code_value_key
			left join CODE_ACASESSION cas on cc.ACADEMIC_SESSION = cas.code_value_key
			left join code_acaterm cat on cc.ACADEMIC_TERM = cat.code_value_key
		where cc.ACADEMIC_YEAR=@academicYear 
			and cc.ACADEMIC_TERM=@academicTerm 
			and cc.ACADEMIC_SESSION=@academicSession
			and cc.PEOPLE_ORG_CODE_ID= @PeopleCodeId
			and cc.BEGINNING_BAL_FLAG='N' 
			and cc.VOID_FLAG='N' 
			and cc.PREBILL_FLAG = 'N'
		order by cas.sort_order, cc.entry_date, ccc.PRINT_ORDER;
	end

	/* remove washouts if set to not show them */
	If( @showWashOuts = 'N' )
	begin
		exec spWebFilterWashOuts
	end
end

--SummaryDetail
select	academic_year as AcademicYear, academic_term as AcademicTerm, 
	academic_session as AcademicSession, charge_credit_code as ChargeCreditCode, 
	amount, charge_credit_type as ChargeCreditType, void_flag as VoidFlag, 
	sessiondesc as SessionDesc, termdesc as TermDesc, crg_crd_desc as CrgcrdDesc, 
	crg_crd_desc as ChargeDesc, entry_date as EntryDate, prebill_flag as PrebillFlag, 
	summary_type as SummaryType, anticipated_flag as AnticipatedFlag,
	chargecreditnumber as ChargeCreditNumber, due_date as DueDate
from #charges
where anticipated_flag = 'N' or anticipated_flag = @includeAnticipated

/* Calculate Summary Balance Totals */
select @summaryBalanceTotal = Amount
from @summaryTypes
where SummaryType = ''
select @summaryBalanceTotal = coalesce(@summaryBalanceTotal, 0.00)

/* Calculate Other Periods Totals */
if ( @balanceType = 'CURR' )
begin
	set @otherPeriodsTotal = 0.00
end
else
begin
	select @otherPeriodsTotal = ( Balance_Amount - @summaryBalanceTotal )
	from peopleorgbalance
	where PEOPLE_ORG_CODE_ID = @PeopleCodeId
		and balance_type = 'CURR'
		and summary_type = ''
end

/* Calculate Anticipated Aid Totals */
if ( @includeAnticipated = 'Y' )
begin
	select @anticipatedAidTotal = sum(cc.AMOUNT)
	from dbo.CHARGECREDIT as cc
	where cc.PEOPLE_ORG_CODE_ID = @PeopleCodeId
		and cc.PREBILL_FLAG = 'N'
		and cc.CHARGE_CREDIT_TYPE = 'F'
		and cc.VOID_FLAG='N'
		and cc.ANTICIPATED_FLAG = 'Y'
	if(@academicSession<>'')
	begin
		select @anticipatedAidPeriodTotal = sum(cc.AMOUNT)
		from dbo.CHARGECREDIT as cc
		where cc.PEOPLE_ORG_CODE_ID = @PeopleCodeId
			and cc.PREBILL_FLAG = 'N'
			and cc.CHARGE_CREDIT_TYPE = 'F'
			and cc.VOID_FLAG='N'
			and cc.ANTICIPATED_FLAG = 'Y'
			and cc.ACADEMIC_YEAR = @academicYear
			and cc.ACADEMIC_TERM = @academicTerm
			and cc.ACADEMIC_SESSION = @academicSession
	end
	else
	begin
	select @anticipatedAidPeriodTotal = sum(cc.AMOUNT)
		from dbo.CHARGECREDIT as cc
		where cc.PEOPLE_ORG_CODE_ID = @PeopleCodeId
			and cc.PREBILL_FLAG = 'N'
			and cc.CHARGE_CREDIT_TYPE = 'F'
			and cc.VOID_FLAG='N'
			and cc.ANTICIPATED_FLAG = 'Y'
			and cc.ACADEMIC_YEAR = @academicYear
			and cc.ACADEMIC_TERM = @academicTerm
	end
end

--BalanceTotals
select coalesce(@summaryBalanceTotal, 0) as SummaryTypeTotal,
	coalesce(@otherPeriodsTotal, 0) as OtherPeriodsTotal,
	coalesce(@anticipatedAidTotal, 0) as AnticipatedAidTotal,
	coalesce(@anticipatedAidPeriodTotal, 0) as AnticipatedAidPeriodTotal
