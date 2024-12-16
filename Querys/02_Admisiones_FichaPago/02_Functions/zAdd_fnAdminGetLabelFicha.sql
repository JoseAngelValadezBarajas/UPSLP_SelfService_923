IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'zAdd_fnAdminGetLabelFicha'AND XTYPE = 'FN')
	DROP FUNCTION zAdd_fnAdminGetLabelFicha
GO
CREATE FUNCTION zAdd_fnAdminGetLabelFicha(
	@pLabelCode Nvarchar(5)
)
/***********************************************************************
Description:
	Funci�n para validar si un curp ya posee su ficha de pago para un a�o/periodo/sesi�n
	-Y Existe
	-N No existe
Revision History:
	2024-11-05 Addvantit-AMartinez. - Creaci�n
************************************************************************/
Returns Nvarchar(Max)
AS
Begin
	
	Declare @vLabel Nvarchar(Max)

	Set @vLabel=''

	Select @vLabel=LabelTexT 
	From zAdd_tblAdminFichaPagoLabels
	Where LabelCode=@pLabelCode

	Return @vLabel

End