IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'vws_PaymentInformation')
	DROP View vws_PaymentInformation
GO
Create view [dbo].[vws_PaymentInformation]
AS
SELECT 
	APP.ApplicationId
	,PL.Id_Ficha
	,APP.ApplicationFormSettingId
	,CONCAT(APP.FirstName,' ',APP.MiddleName,' ',APP.LastName,' ',APP.LastNamePrefix) [NOMBRE]
	,A.ProgramOfStudyId
	,UD.ColumnValue [CURP]
	,PL.Referencia
	,B.LONG_DESC [PROGRAMA]
	,C.LONG_DESC [GRADO]
	,D.LONG_DESC [CURRICULUM]
	,E.CODE_VALUE_KEY [COD_CARG]
	,CONVERT(VARCHAR, CONVERT(INT,E.AMOUNT)/1) AS AMOUNT
	,CONVERT(VARCHAR, LEFT(RIGHT(E.AMOUNT, LEN(E.AMOUNT) - CHARINDEX('.',(E.AMOUNT))),2)) AS RESIDUO
	,H.ACADEMIC_YEAR
	,H.ACADEMIC_TERM
	,H.ACADEMIC_SESSION
	,B.CODE_VALUE_KEY [CODIGO_PROGRAM]
	,F.DueDate
	
FROM 
	Application AS APP
	INNER JOIN ApplicationProgram AS APR ON APR.ApplicationId = APP.ApplicationId
	INNER JOIN ProgramOfStudy AS A ON  A.ProgramOfStudyId = APR.ProgramOfStudyId
	INNER JOIN CODE_PROGRAM AS B ON B.ProgramId = A.Program
	INNER JOIN CODE_DEGREE AS C ON C.DegreeId = A.Degree
	INNER JOIN CODE_CURRICULUM AS D ON D.CurriculumId = A.Curriculum
	INNER JOIN CODE_CHARGECREDIT AS E ON E.CODE_XVAL='REFNI'
	INNER JOIN ACADEMICCALENDAR AS H ON H.SessionPeriodId = APP.SessionPeriodId
	INNER JOIN InstallmentRule AS G ON G.SessionPeriodId = H.SessionPeriodId
	INNER JOIN InstallmentChargeCredit AS F ON F.InstallmentRuleId = G.InstallmentRuleId
	AND f.ChargeCreditCodeId = e.ChargeCreditCodeId
	INNER JOIN ApplicationUserDefined AS UD ON APP.ApplicationId = UD.ApplicationId
	LEFT JOIN EV_PayLoadReg AS PL ON PL.Id_Application = APP.ApplicationId
WHERE UD.ColumnName = 'CURP'

GO


