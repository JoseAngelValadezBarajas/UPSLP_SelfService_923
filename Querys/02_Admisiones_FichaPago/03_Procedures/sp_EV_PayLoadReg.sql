If Exists(Select 1 From sys.sysobjects Where [Name]='sp_EV_PayLoadReg')
	Drop Procedure sp_EV_PayLoadReg
Go
Create Procedure [dbo].[sp_EV_PayLoadReg]
	(
	@Id int output,
	@Id_Ficha int output,
	@Id_Application int,
	@Id_Form int,
	@Id_Program int,
	@Legal_Name varchar(50),
	@CURP varchar(25),
	@Referencia varchar (25),
	@Amount numeric,
	@Due_Date datetime,
	@CODE_CHARGECREDIT varchar(20),
	@Year varchar(10),
	@Term varchar(10),
	@Session varchar(10),
	@Create_OPID varchar(10),
	@Create_Date datetime,
	@Create_time datetime,
	@Status varchar(100))--1 Activo, 0 Aplicado.
AS
BEGIN

If Not EXISTS(Select 1 From EV_PayLoadReg_UltFicha)
	Insert Into EV_PayLoadReg_UltFicha (UltFicha) Values (0)

IF NOT EXISTS (SELECT Id_Application FROM EV_PayLoadReg WHERE Id_Application = @Id_Application) 
BEGIN
	
	Select Top 1 @Id_Ficha=UltFicha
	From EV_PayLoadReg_UltFicha

	If @Id_Ficha>=9990
	Begin
		
		Set @Id_Ficha=1

		Update EV_PayLoadReg_UltFicha Set UltFicha=1

	End
	Else
	Begin
		
		Set @Id_Ficha=@Id_Ficha+1

		Update EV_PayLoadReg_UltFicha Set UltFicha=@Id_Ficha

	End
		

	INSERT INTO EV_PayLoadReg VALUES 
			(
			@Id_Ficha,
			@Id_Application,
			@Id_Form,
			@Id_Program,
			@Legal_Name,
			@CURP,
			@Referencia,
			@Amount,
			@Due_Date,
			@CODE_CHARGECREDIT,
			@Year,
			@Term,
			@Session,
			@Create_OPID,
			dbo.fnmakedate (getdate()),
			dbo.fnmaketime (getdate()),
			@Status
			);

	SET @Id = SCOPE_IDENTITY();
	
END 
ELSE BEGIN 
 
 SELECT @Id_Ficha = Id_Ficha,@Id=Id 
 FROM EV_PayLoadReg WHERE Id_Application = @Id_Application

END 

END



