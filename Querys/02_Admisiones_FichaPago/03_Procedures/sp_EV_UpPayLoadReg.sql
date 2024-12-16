If Exists(Select 1 From sys.sysobjects Where [Name]='sp_EV_UpPayLoadReg')
	Drop Procedure sp_EV_UpPayLoadReg
Go
Create Procedure sp_EV_UpPayLoadReg
	@pIdRefer Int
    ,@pRefer varchar(25)
As
Begin
	
	UPDATE EV_PayLoadReg SET Referencia = @pRefer WHERE Id = @pIdRefer

End