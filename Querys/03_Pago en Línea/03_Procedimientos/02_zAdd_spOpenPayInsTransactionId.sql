IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'zAdd_spOpenPayInsTransactionId'AND XTYPE = 'P')
	DROP PROCEDURE zAdd_spOpenPayInsTransactionId
GO
CREATE PROCEDURE zAdd_spOpenPayInsTransactionId
	@pPaymentTransactionId Int,
	@pOpenPayId Nvarchar(50)
As
/***********************************************************************
Description:
	Procedimiento para insertar la relación del Id de Transacción de PC con la de OpenPay.
Revision History:
	2024-12-02 Addvantit-AMartinez. - Creación
************************************************************************/
Begin
	
	Insert Into zAdd_tblOpenPayTransactionId(PaymentTransactionId,OpenPayId)
	Values (@pPaymentTransactionId,@pOpenPayId)

End