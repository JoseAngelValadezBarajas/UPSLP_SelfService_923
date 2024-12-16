IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'zAdd_fnAdminSelIdAppByCurp'AND XTYPE = 'FN')
	DROP FUNCTION zAdd_fnAdminSelIdAppByCurp
GO
CREATE FUNCTION zAdd_fnAdminSelIdAppByCurp(
	@pCurp Nvarchar(25)
	,@pIdForm Int
)
/***********************************************************************
Description:
	Funci�n para obtener el Id. de Aplicaci�n de una admisi�n por curp y id de Form
Revision History:
	2024-11-05 Addvantit-AMartinez. - Creaci�n
************************************************************************/
Returns Int
AS
Begin
	
	Declare @vIdApp Int

	SELECT @vIdApp=Id_Application 
	FROM EV_PayLoadReg AS A 
	WHERE CURP = @pCurp 
	AND Id_Form=@pIdForm

	Return @vIdApp

End