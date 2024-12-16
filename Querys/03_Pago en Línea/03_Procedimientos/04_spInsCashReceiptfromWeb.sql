IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'spInsCashReceiptfromWeb'AND XTYPE = 'P')
	DROP PROCEDURE spInsCashReceiptfromWeb
GO
CREATE PROCEDURE [dbo].[spInsCashReceiptfromWeb]
	 @PaymentTransactionId int,
	 @AuthoNumber VARCHAR(100)
	
AS

	declare @ReturnStatus int
		, @ReceiptNumber int
		, @PersonId int
		, @SessionPeriodId int
		, @TermPeriodId int
		, @PaymentAmount numeric(18,6)
		, @OfficeId int
		, @ChargeCreditCodeId int
		, @BatchSequence int
		, @BatchNumber nvarchar(20)
		, @Existe int

select @PersonId = PersonId ,
 @PaymentAmount = amount ,
 @SessionPeriodId=SessionPeriodId,
 @ChargeCreditCodeId=CashReceiptCodeId,
 @OfficeId=CashReceiptOfficeId
 from PaymentTransaction
where PaymentTransactionId = @PaymentTransactionId

	select @ReceiptNumber = 0
		--, @SessionPeriodId = 10
		, @TermPeriodId = null
		--, @OfficeId = 12
		-- , @ChargeCreditCodeId = 1705
		, @BatchSequence = 9988 -- 9988, 9989, 9990, 9991
		, @BatchNumber = replace( convert( nvarchar, getdate(), 101), '/', '' ) + convert( nvarchar, @BatchSequence )

	SELECT @Existe = COUNT(*) from CASHRECEIPT WITH(NOLOCK) WHERE PaymentTransactionId = @PaymentTransactionId
	
	IF ISNULL(@Existe,0) = 0 AND @PaymentAmount<>0
	BEGIN 
		exec @ReturnStatus = dbo.spInsCashReceipt
			@ReceiptNumber = @ReceiptNumber OUTPUT
			, @PersonId = @PersonId
			, @SessionPeriodId = @SessionPeriodId
			, @TermPeriodId = @TermPeriodId
			, @PaymentAmount = @PaymentAmount
			, @OfficeId = @OfficeId
			, @ChargeCreditCodeId = @ChargeCreditCodeId
			, @BatchSequence = @BatchSequence
			, @PersonOriginId = @PersonId
			, @PaymentTransactionId = @PaymentTransactionId
		--select @ReturnStatus [@ReturnStatus], @ReceiptNumber [@ReceiptNumber]
		--select * from dbo.BatchHeader where TableName = 'CASHRECEIPT'
		--	and Batch_Number = @BatchNumber
		--select * from dbo.CashReceipt where Receipt_Number = @Receipt_Number

		update	PaymentTransaction
		set IsSuccessful = 1,AuthorizationNumber=@AuthoNumber
		where PaymentTransactionId = @PaymentTransactionId
	END