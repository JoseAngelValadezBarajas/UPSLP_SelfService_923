IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'zAdd_fnOpenPaySelTransactionId'AND XTYPE = 'FN')
	DROP FUNCTION zAdd_fnOpenPaySelTransactionId
GO
CREATE FUNCTION zAdd_fnOpenPaySelTransactionId(
	@pPaymentTransactionId Int
)
/***********************************************************************
Description:
	Funci�n para obtener el Id de transacci�n de OpenPay que le corresponde a la transacci�n de PC
Revision History:
	2024-12-02 Addvantit-AMartinez. - Creaci�n
************************************************************************/
Returns Nvarchar(50)
AS
Begin
	
	Declare @vOpenPayId Nvarchar(50)

	Select @vOpenPayId = OpenPayId 
	From zAdd_tblOpenPayTransactionId
	Where PaymentTransactionId=@pPaymentTransactionId

	Return @vOpenPayId

End