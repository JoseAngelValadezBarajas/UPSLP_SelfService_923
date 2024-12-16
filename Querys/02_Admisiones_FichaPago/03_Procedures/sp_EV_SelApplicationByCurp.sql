If Exists(Select 1 From sys.sysobjects Where [Name]='sp_EV_SelApplicationByCurp')
	Drop Procedure sp_EV_SelApplicationByCurp
Go
Create Procedure sp_EV_SelApplicationByCurp
	@pCurp Nvarchar(25)
	,@pIdForm Int
As
Begin
	
		SELECT ApplicationId, NOMBRE, PROGRAMA, GRADO, CURRICULUM, AMOUNT, RESIDUO, 
	ACADEMIC_YEAR, ACADEMIC_TERM, ACADEMIC_SESSION, CODIGO_PROGRAM, DueDate, convert(varchar, DueDate, 103) DueDateString,   
	ProgramOfStudyId, ApplicationFormSettingId, CURP, COD_CARG 
	FROM vws_PaymentInformation 
	WHERE CURP=@pCurp
	And ApplicationFormSettingId=@pIdForm

End