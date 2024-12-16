IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'zAdd_spOpenPaySelConfig'AND XTYPE = 'P')
	DROP PROCEDURE zAdd_spOpenPaySelConfig
GO
CREATE PROCEDURE zAdd_spOpenPaySelConfig
As
/***********************************************************************
Description:
	Procedimiento para insertar infromaci�n adicional de openPay de una transacci�n de pago.
Revision History:
	2024-12-02 Addvantit-AMartinez. - Creaci�n
************************************************************************/
Begin
	
	Select * From zAdd_tblOpenPayConfig

End