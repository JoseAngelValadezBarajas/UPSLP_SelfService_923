CREATE TABLE zAdd_ErrorLog (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ErrorMessage NVARCHAR(MAX),
    StackTrace NVARCHAR(MAX),
    DateOccurred DATETIME DEFAULT GETDATE()
);