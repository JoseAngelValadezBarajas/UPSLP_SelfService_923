If Exists(Select 1 From sys.sysobjects Where [Name]='sp_EV_SelApplication')
	Drop Procedure sp_EV_SelApplication
Go
Create Procedure sp_EV_SelApplication
	@Id_Application Int
As
Begin
	
		SELECT ApplicationId, NOMBRE, PROGRAMA, GRADO, CURRICULUM, AMOUNT, RESIDUO, 
	ACADEMIC_YEAR, ACADEMIC_TERM, ACADEMIC_SESSION, CODIGO_PROGRAM, DueDate, convert(varchar, DueDate, 103) DueDateString,   
	ProgramOfStudyId, ApplicationFormSettingId, CURP, COD_CARG 
	FROM vws_PaymentInformation WHERE ApplicationId = @Id_Application

End