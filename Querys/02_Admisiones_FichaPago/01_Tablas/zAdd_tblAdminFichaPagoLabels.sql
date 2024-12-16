/*Tabla para almacenar las leyendas que se mostrarán en la ficha de pago de Admisión*/
Create Table zAdd_tblAdminFichaPagoLabels
(Id Int Identity(1,1)
,LabelCode Nvarchar(5) Not Null Primary Key
,LabelTexT Nvarchar(Max) Not Null
)

Go
Insert Into zAdd_tblAdminFichaPagoLabels Values ('LBL1','Dicho pago se puede realizar en: Cajero automático y pago por transferencia del mismo banco (pago por servicios). Verificar que el número de referencia bancaria y el monto estén capturados correctamente.')

Go 
Insert Into zAdd_tblAdminFichaPagoLabels Values ('LBL2','Una vez realizado el pago, no habrá reembolsos. Es responsabilidad del aspirante cumplir con los pasos del Proceso de Ingreso 2025, respetando las indicaciones y fechas establecidas.')

Go 
Insert Into zAdd_tblAdminFichaPagoLabels Values ('LBL3','Una vez hecho el pago, esperar dos días hábiles y presentarse, de lunes a viernes de 08:00 a 18:00 hrs. en el Departamento de Servicios Escolares (Excepto los siguientes días: 18 de noviembre de 2024, del 23 de diciembre de 2024 al 7 de enero de 2025, 3 de febrero de 2025, 14 y 17 de marzo de 2025, del 14 al 25 de abril y 1º. de mayo de 2025) con la documentación correspondiente.')