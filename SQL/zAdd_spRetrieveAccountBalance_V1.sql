GO
/****** Object:  StoredProcedure [dbo].[zAdd_spRetrieveAccountBalance]    Script Date: 8/28/2024 3:16:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[zAdd_spRetrieveAccountBalance]( 
    @personId INT, 
    @academicYear NVARCHAR(4),
    @academicTerm NVARCHAR(10), 
    @academicSession NVARCHAR(10),
    @filterText NVARCHAR(255) = NULL
)
AS
/***********************************************************************
Description:
    Returns Account Balance Information for the specific person and period.
    (Modified to return only summary balance information with additional columns)
Parameters:  
    @personId - Person ID
    @academicYear - Year
    @academicTerm - Term
    @academicSession - Session
    @filterText - Text to filter on SummaryTypeDescription
History:
    11/14/2005  mfields - Created procedure. 
    7/6/2017  avidal - get anticipated aid for period. POW-4134 CR-000148537
    8/23/2024  Angel Valadez - Modified to return only summary balance information
    8/23/2024  Angel Valadez - Removed unnecessary parameters and functionality
    8/23/2024  Angel Valadez - Added PeopleCodeID, filter functionality, and additional columns
************************************************************************/
DECLARE @PeopleCodeId NVARCHAR(10);
DECLARE @ProgramDesc NVARCHAR(255);
DECLARE @Campus NVARCHAR(255);
DECLARE @ProgramFormalTitle NVARCHAR(255);
DECLARE @LegalName NVARCHAR(255);
DECLARE @FirstName NVARCHAR(100);
DECLARE @LastName NVARCHAR(100);
DECLARE @BirthDate DATE;
DECLARE @RFC NVARCHAR(255);
DECLARE @lineaCaptura NVARCHAR(255);
DECLARE @Label1 NVARCHAR(555);
DECLARE @Label2 NVARCHAR(555);
DECLARE @Label3 NVARCHAR(555);
DECLARE @BalanceAmountValue NVARCHAR(255);
DECLARE @SummaryTypeValue NVARCHAR(255);
DECLARE @NewId INT;
DECLARE @ConcatenatedLabels NVARCHAR(255);
DECLARE @DueDateAF NVARCHAR(255);
DECLARE @DueDateBF NVARCHAR(255);

--Obtener los label 1 y 2
SELECT @Label1=LabelTexT from zAdd_tblAdminFichaPagoLabels WHERE LabelCode= 'LBL1';
SELECT @Label2=LabelTexT from zAdd_tblAdminFichaPagoLabels WHERE LabelCode= 'LBL2';
SELECT @Label3=LabelTexT from zAdd_tblAdminFichaPagoLabels WHERE LabelCode= 'LBL3';
SET @ConcatenatedLabels = @Label1 + ' ' + @Label2;

-- Obtener detalles de la persona
SELECT @PeopleCodeId = PEOPLE_CODE_ID, 
       @LegalName = LegalName, 
       @FirstName = FIRST_NAME, 
       @LastName = LAST_NAME, 
       @BirthDate = BIRTH_DATE 
FROM People
WHERE PersonId = @personId;

IF @PeopleCodeId IS NULL RETURN(1);

--Generar DUE DATE 
SELECT TOP 1 @DueDateBF = CONVERT(NVARCHAR(255), DUE_DATE, 120)
FROM CHARGECREDIT
WHERE PEOPLE_ORG_CODE_ID = @PeopleCodeId
  AND ACADEMIC_YEAR = @AcademicYear
  AND ACADEMIC_TERM = @AcademicTerm
  AND ACADEMIC_SESSION = @AcademicSession;

--AQUI ESTABA LA SECCION DE GENERAR RFC PARA REFERENCIA/ Obtencion de valores para poblar PaymentTransactionReference
/*
SELECT @BalanceAmountValue= BALANCE_AMOUNT, 
		@SummaryTypeValue= SUMMARY_TYPE
FROM [dbo].[PEOPLEORGBALANCE] pob
JOIN [dbo].[CODE_SUMMARYTYPE] cst
    ON pob.SUMMARY_TYPE = cst.CODE_VALUE
WHERE pob.PEOPLE_ORG_CODE_ID = @PeopleCodeId
    AND pob.ACADEMIC_YEAR = @academicYear
    AND pob.ACADEMIC_TERM = @academicTerm
    AND pob.ACADEMIC_SESSION = @academicSession
    AND cst.LONG_DESC = @filterText;*/

SELECT  @SummaryTypeValue=CRG_CRD_DESC, 
		@BalanceAmountValue=AMOUNT
FROM CHARGECREDIT 
Where PEOPLE_ORG_CODE_ID = @PeopleCodeId
	AND ACADEMIC_YEAR = @academicYear
	AND ACADEMIC_TERM = @academicTerm
	AND ACADEMIC_SESSION = @academicSession
	AND CRG_CRD_DESC = @filterText;

INSERT INTO zAdd_PaymentTransactionReference (Alumno, Anio, Periodo, Sesion, Id_Cargo, Monto, OrdenDistribucion, AnioCalendario, Referencia)
VALUES (@PeopleCodeId, @academicYear, @academicTerm, @academicSession, @SummaryTypeValue, @BalanceAmountValue, 100, YEAR(GETDATE()), NULL );

-- Obtener el ID generado por la columna IDENTITY
SET @NewId = SCOPE_IDENTITY();
-- Formatear @NewId para que tenga 8 caracteres con ceros a la izquierda
DECLARE @FormattedNewId NVARCHAR(8);
SET @FormattedNewId = FORMAT(@NewId, '00000000');
--Concatena nuestro valor para la Linea de Captura 
SET @RFC = CONCAT('01', @academicYear, @academicTerm, @FormattedNewId);

-- Verificar si existe el registro con las condiciones especificadas
IF EXISTS (
    SELECT 1 FROM zAdd_PaymentTransactionReference WHERE Alumno = @PeopleCodeId AND Anio = @academicYear AND Periodo = @academicTerm 
	  AND Sesion = @academicSession AND Id_Cargo = @SummaryTypeValue AND Monto = @BalanceAmountValue AND OrdenDistribucion = 100
      AND AnioCalendario = YEAR(GETDATE()) AND Referencia IS NOT NULL AND LTRIM(RTRIM(Referencia)) <> '')
BEGIN
    -- Si existe, obtener el valor de Referencia
    SELECT @lineaCaptura = Referencia FROM zAdd_PaymentTransactionReference WHERE Alumno = @PeopleCodeId AND Anio = @academicYear
      AND Periodo = @academicTerm AND Sesion = @academicSession AND Id_Cargo = @SummaryTypeValue AND Monto = @BalanceAmountValue
      AND OrdenDistribucion = 100 AND AnioCalendario = YEAR(GETDATE()) AND Referencia IS NOT NULL AND LTRIM(RTRIM(Referencia)) <> '';

	UPDATE zAdd_PaymentTransactionReference SET Referencia = @lineaCaptura WHERE Id = @NewId;
END
ELSE
BEGIN
    -- Genera La linea de captura con el algoritmo 37 BBVA
    CREATE TABLE #TempResult (
        LineaCaptura NVARCHAR(20)
    );

    -- Ejecutar el procedimiento almacenado e insertar el resultado en la tabla temporal
    INSERT INTO #TempResult (LineaCaptura)
    EXEC [dbo].[zAdd_spCalcularDigitoVerificadorBBVA]
        @referencia = @RFC,
        @lineaCaptura = @lineaCaptura OUTPUT;  

    -- Seleccionar el resultado desde la tabla temporal
    SELECT @lineaCaptura = LineaCaptura FROM #TempResult;

	--Añade la referencia a zAdd_PaymentTransactionReference
	UPDATE zAdd_PaymentTransactionReference SET Referencia = @lineaCaptura WHERE Id = @NewId;

    -- Eliminar la tabla temporal
    DROP TABLE #TempResult;
END



-- Obtiene ProgramDesc, Campus, y ProgramFormalTitle
SELECT TOP 1
    @ProgramDesc = cpr.MEDIUM_DESC,
    @Campus = o.ORG_NAME_1,
    @ProgramFormalTitle = cdr.SHORT_DESC + ' ' + td.FORMAL_TITLE
FROM dbo.ACADEMIC a
LEFT JOIN dbo.CODE_PROGRAM cpr ON a.PROGRAM = cpr.CODE_VALUE_KEY
LEFT JOIN dbo.CODE_DEGREE cdr ON a.DEGREE = cdr.CODE_VALUE_KEY
LEFT JOIN dbo.TRANSCRIPTDEGREE td ON a.PROGRAM = td.PROGRAM
    AND a.DEGREE = td.DEGREE
    AND a.CURRICULUM = td.CURRICULUM
    AND a.PEOPLE_CODE_ID = td.PEOPLE_CODE_ID
    AND a.TRANSCRIPT_SEQ = td.TRANSCRIPT_SEQ
LEFT JOIN dbo.ORGANIZATION o ON a.ORG_CODE_ID = o.ORG_CODE_ID
WHERE a.PEOPLE_CODE_ID = @PeopleCodeId
    AND a.ACADEMIC_YEAR = @academicYear
    AND a.ACADEMIC_TERM = @academicTerm
    AND a.ACADEMIC_SESSION = ' '
    AND a.PRIMARY_FLAG = 'Y'
    AND a.STATUS <> 'N';

-- Verificar si las variables están vacías y realizar la segunda consulta si es necesario
IF (@ProgramDesc IS NULL OR @ProgramDesc = '' OR
    @Campus IS NULL OR @Campus = '' OR
    @ProgramFormalTitle IS NULL OR @ProgramFormalTitle = '')
BEGIN
		-- Segunda consulta si alguna de las variables está vacía
	SELECT TOP 1
		@ProgramDesc = cpr.MEDIUM_DESC,
		@Campus = o.ORG_NAME_1,
		@ProgramFormalTitle = cdr.SHORT_DESC + ' ' + td.FORMAL_TITLE
	FROM dbo.ACADEMIC a
	LEFT JOIN dbo.CODE_PROGRAM cpr ON a.PROGRAM = cpr.CODE_VALUE_KEY
	LEFT JOIN dbo.CODE_DEGREE cdr ON a.DEGREE = cdr.CODE_VALUE_KEY
	LEFT JOIN dbo.TRANSCRIPTDEGREE td ON a.PROGRAM = td.PROGRAM
		AND a.DEGREE = td.DEGREE
		AND a.CURRICULUM = td.CURRICULUM
		AND a.PEOPLE_CODE_ID = td.PEOPLE_CODE_ID
		AND a.TRANSCRIPT_SEQ = td.TRANSCRIPT_SEQ
	LEFT JOIN dbo.ORGANIZATION o ON a.ORG_CODE_ID = o.ORG_CODE_ID
	WHERE a.PEOPLE_CODE_ID = @PeopleCodeId
		AND a.ACADEMIC_YEAR != ' '
		AND a.ACADEMIC_TERM != ' '
		AND a.ACADEMIC_SESSION != ' '
		AND a.PRIMARY_FLAG = 'Y'
		AND a.STATUS <> 'N';
END

/* Crea nuestro dataset para el reporte */
DECLARE @summaryTypes TABLE
(
    PeopleCodeId NVARCHAR(10),
    SummaryType NVARCHAR(16),
    SummaryTypeDescription NVARCHAR(255),
    Amount NVARCHAR(255),
    CreationDate NVARCHAR(20), -- New column for creation date
    AcademicYearSession NVARCHAR(20), -- New column for concatenated AcademicYear and AcademicSession
    SummaryTypeDesc NVARCHAR(262), -- New column for concatenated SummaryType and SummaryTypeDescription
    ProgramDesc NVARCHAR(255), -- New column for Program Description
    Campus NVARCHAR(255), -- New column for Campus
    ProgramFormalTitle NVARCHAR(255), -- New column for Program Formal Title
    LegalName NVARCHAR(255), -- Nueva columna para LegalName
    FechaVencimiento NVARCHAR(20), -- Nueva columna para Fecha de Vencimiento
    Bancomer NVARCHAR(255), -- Nueva columna para Bancomer
    Banamex NVARCHAR(255), -- Nueva columna para Banamex
    Santander NVARCHAR(255), -- Nueva columna para Santander
	Label1 NVARCHAR(255),
	Label2 NVARCHAR(255)
)

/* Revisa los tipos de Balance en caso de ser necesario */
DECLARE @balanceType NVARCHAR(15);
IF (@academicYear = '' AND @academicTerm = '' AND @academicSession = '')
BEGIN
    SET @balanceType = 'CURR';
END
ELSE IF (@academicYear <> '' AND @academicTerm <> '' AND @academicSession = '')
BEGIN
    SET @balanceType = 'ALLTERM';
END
ELSE IF (@academicYear <> '' AND @academicTerm <> '' AND @academicSession <> '')
BEGIN
    SET @balanceType = 'YTS';
END

/*Correccion 11/20/2024*/
IF @LegalName IS NULL OR LTRIM(RTRIM(@LegalName)) = ''
BEGIN
    SET @LegalName = ISNULL(@FirstName, '') + ' ' + ISNULL(@LastName, ''); 
END

/* Pobla nuestro dataset para el reporte */
INSERT INTO @summaryTypes (PeopleCodeId, 
			SummaryType, 
			SummaryTypeDescription, 
			Amount, 
			CreationDate, 
			AcademicYearSession, 
			SummaryTypeDesc, 
			ProgramDesc, 
			Campus, 
			ProgramFormalTitle, 
			LegalName, 
			FechaVencimiento, 
			Bancomer, 
			Banamex, 
			Santander,
			Label1,
			Label2)
SELECT @PeopleCodeId, 
       pob.summary_type, 
       pob.CRG_CRD_DESC,  
       LTRIM(RTRIM(STR(pob.AMOUNT, 20, 2))) AS balance_amount,
       FORMAT(GETDATE(), 'dd MMM yyyy'), 
       CONCAT(@academicYear, ' ', @academicTerm), 
       pob.CRG_CRD_DESC, 
       @ProgramDesc, 
       @Campus, 
       @ProgramFormalTitle, 
       @LegalName, 
       @DueDateBF, 
       @lineaCaptura, 
       @lineaCaptura, 
       @lineaCaptura, 
	   @Label1,
	   @Label2
FROM dbo.CHARGECREDIT pob 
LEFT JOIN dbo.CODE_SUMMARYTYPE cst 
    ON pob.SUMMARY_TYPE = cst.CODE_VALUE_KEY
WHERE 
    pob.PEOPLE_ORG_CODE_ID = @PeopleCodeId
  AND pob.ACADEMIC_YEAR = @academicYear
  AND pob.ACADEMIC_TERM = @academicTerm
  AND pob.ACADEMIC_SESSION = @academicSession
ORDER BY cst.SORT_ORDER;

/* Retorne el Summary Balance con el filtro */
SELECT PeopleCodeId, SummaryType, SummaryTypeDescription, Amount, CreationDate, AcademicYearSession, SummaryTypeDesc, ProgramDesc, Campus, ProgramFormalTitle, LegalName, FechaVencimiento, Bancomer, Banamex, Santander,Label1,Label2
FROM @summaryTypes
WHERE (@filterText IS NULL OR SummaryTypeDescription LIKE '%' + @filterText + '%');






/* SECCION GENERAR RFC PARA REFERENCIA
-- Crear RFC
DECLARE @ApellidoPaterno NVARCHAR(50);
DECLARE @ApellidoMaterno NVARCHAR(50);
DECLARE @PrimeraLetraPaterno NVARCHAR(1);
DECLARE @PrimeraVocalPaterno NVARCHAR(1);
DECLARE @PrimeraLetraMaterno NVARCHAR(1);
DECLARE @PrimeraLetraNombre NVARCHAR(1);
DECLARE @Year NVARCHAR(4);
DECLARE @Month NVARCHAR(2);
DECLARE @Day NVARCHAR(2);

-- Separar el año para el RFC
SET @Year = LEFT(FORMAT(@BirthDate, 'yyyy'), 2);
SET @Month = FORMAT(@BirthDate, 'MM');
SET @Day = LEFT(FORMAT(@BirthDate, 'dd'),1);

-- Separar los apellidos para el RFC
SET @ApellidoPaterno = LEFT(@LastName, CHARINDEX(' ', @LastName) - 1);
SET @ApellidoMaterno = LTRIM(SUBSTRING(@LastName, CHARINDEX(' ', @LastName) + 1, LEN(@LastName)));
SET @PrimeraLetraPaterno = LEFT(@ApellidoPaterno, 1);
SET @PrimeraVocalPaterno = SUBSTRING(@ApellidoPaterno, PATINDEX('%[AEIOU]%', SUBSTRING(@ApellidoPaterno, 2, LEN(@ApellidoPaterno))), 1);
SET @PrimeraLetraMaterno = LEFT(@ApellidoMaterno, 1);
SET @PrimeraLetraNombre = LEFT(@FirstName, 1);

--Genera el RFC
SET @RFC = CONCAT(
    '001',                          -- Prefijo constante
    @personId,                       -- ID de persona
    @PrimeraLetraPaterno,           -- Primera letra del apellido paterno
    @PrimeraVocalPaterno,           -- Primera vocal del apellido paterno
    @PrimeraLetraMaterno,           -- Primera letra del apellido materno
    @PrimeraLetraNombre,            -- Primera letra del nombre
    @Year,
	@Month,
	@Day
);

*/





