CREATE TABLE zAdd_PaymentTransactionReference (
    Id INT IDENTITY(1,1) PRIMARY KEY, 
    Alumno NVARCHAR(100),             
    Anio INT,                         
    Periodo NVARCHAR(50),             
    Sesion NVARCHAR(50),              
    Id_Cargo NVARCHAR(50),            
    Monto DECIMAL(18, 2),             
    OrdenDistribucion NVARCHAR(100),  
    AnioCalendario INT,               
    Referencia NVARCHAR(255)          
);
