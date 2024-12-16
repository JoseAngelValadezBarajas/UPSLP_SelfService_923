IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'zAdd_fnAdminValidateCurp'AND XTYPE = 'FN')
	DROP FUNCTION zAdd_fnAdminValidateCurp
GO
CREATE FUNCTION zAdd_fnAdminValidateCurp(
	@pCurp Nvarchar(25)
	,@pIdForm Int
)
/***********************************************************************
Description:
	Función para validar si un curp ya posee su ficha de pago para un año/periodo/sesión
	-Y Existe
	-N No existe
Revision History:
	2024-11-05 Addvantit-AMartinez. - Creación
************************************************************************/
Returns Nvarchar(1)
AS
Begin
	
	Declare @vExiste Nvarchar(1)

	Set @vExiste='N'

	If Exists(SELECT CURP FROM EV_PayLoadReg AS A 
			WHERE CURP = @pCurp 
			AND Id_Form=@pIdForm)
		Set @vExiste = 'Y'

	Return @vExiste

End