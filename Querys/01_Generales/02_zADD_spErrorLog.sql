IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'zADD_spErrorLog'AND XTYPE = 'P')
	DROP PROCEDURE zADD_spErrorLog
GO
CREATE PROCEDURE zADD_spErrorLog
	@pError nvarchar(MAX)
As
/***********************************************************************
Description:
	Procedimiento para obtener el cat�logo de Monedas.
Revision History:
	2022-11-08 Addvantit-AMartinez. - Creaci�n
************************************************************************/
Begin

	Insert Into zAdd_TblError(CERROR) Values (@pError)
	
End