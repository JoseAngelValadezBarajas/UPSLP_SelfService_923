IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'zAdd_fnAdminSelIdAppByCurp'AND XTYPE = 'FN')
	DROP FUNCTION zAdd_fnAdminSelIdAppByCurp
GO
CREATE FUNCTION zAdd_fnAdminSelIdAppByCurp(
	@pCurp Nvarchar(25)
	,@pIdForm Int
)
/***********************************************************************
Description:
	Función para obtener el Id. de Aplicación de una admisión por curp y id de Form
Revision History:
	2024-11-05 Addvantit-AMartinez. - Creación
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