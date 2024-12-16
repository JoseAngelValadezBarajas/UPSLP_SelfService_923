using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using iTextSharp;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;
using System.Web.UI;
using SelfService.Data;

public class pdf 
{
    public MemoryStream ms;
    public MemoryStream formato(string _examen, string _ficha, string _nombre, string _carrera, 
                        string _duedate, string _referencia,string _referenciasan, string _monto, string _infoexamen, 
                        string _programa, string _iddeprograma,string txt1, string txt2, string txt3, string _year, string _term)
    {

        using (ms = new MemoryStream())
        {
            DateTime localDate = DateTime.Now;
			//DateTime vencimiento; //DESARROLLO 2023 - Se recibe parametro _duedate como tipo string
			string vencimiento; // DESARROLLO 2023 - Se cambia variable vencimiento a tipo string
			
            string _date = localDate.ToString("dd/MM/yyyy");
            string _dateexp = localDate.ToString("dd-MMMM-yyyy");
            string strLabel;

			//vencimiento = Convert.ToDateTime(_duedate); DESARROLLO 2023 - NO se convierte a Date ya que existe diferencia en formato dependiendo del idioma del explorador
			//string _concepto = vencimiento.ToString("yyyy"); DESARROLLO 2023 - se obtendrá el año de _duedate como tipo string


			vencimiento = _duedate; // DESARROLLO 2023 - Se asigna _duedate a vencimiento como tipo string
			string _concepto = _year + " - " + _term; // DESARROLLO 2023 - Se obtiene el año de _duedate
			
            Document document = new Document(PageSize.LETTER);
            PdfWriter writer = PdfWriter.GetInstance(document, ms);
            document.Open();

            var tit = FontFactory.GetFont("Arial", 10);
            var tit2 = FontFactory.GetFont("Arial", 10, Font.BOLD);
            var tit3 = FontFactory.GetFont("SegoeUI", 10);
            var f = FontFactory.GetFont("Arial", 8);
            var f2 = FontFactory.GetFont("Arial", 8, Font.BOLD);
            var f3 = FontFactory.GetFont("Arial", 6);
            var f4 = FontFactory.GetFont("Arial", 6, Font.BOLD);
			var f5 = FontFactory.GetFont("Arial", 10);
			var f6 = FontFactory.GetFont("Arial",8, Font.UNDERLINE); // Addvantit
			// iTextSharp.text.Image logo = iTextSharp.text.Image.GetInstance("C:/inetpub/wwwroot/PowerCampusSelfService/App_Code/bancomer.png");
            // logo.Alignment = Element.ALIGN_LEFT;
            // float per = 0.0f;
            // per = 120 / logo.Width;
            // logo.ScalePercent(per * 120);

            iTextSharp.text.Image logouni = iTextSharp.text.Image.GetInstance("C:\\inetpub\\wwwroot\\PowerCampusSelfService9\\Resources\\Admissions\\upslp_logo.png");
            logouni.Alignment = Element.ALIGN_LEFT;
            float per2 = 0.0f;
            per2 = 100 / logouni.Width;
            logouni.ScalePercent(per2 * 150);

            PdfPTable table = new PdfPTable(5);
            table.WidthPercentage = 105f;
            
            //Line 2
            PdfPCell cell = new PdfPCell();  //Logo de Bancomer
            cell.Colspan = 1;
            cell.Rowspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 2;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase("\nFICHA DE DEPÓSITO", tit2));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
            cell = new PdfPCell(logouni);  //Logo de universidad
            cell.Colspan = 1;
            cell.Rowspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase(_examen+"\n\n", tit));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase());
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);

            //line 3
            cell = new PdfPCell(new Phrase("FECHA DE EXPEDICIÓN", f));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase("NOMBRE DEL CUENTAHABIENTE", f));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase("\nFICHA: " + _ficha, f2));
            cell.Colspan = 1;
            cell.Rowspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase(_dateexp, f2));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase("UNIVERSIDAD POLITÉCNICA DE SAN LUIS POTOSÍ", f2));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);

            //----
            cell = new PdfPCell(new Phrase(" "));
            cell.Colspan = 5;
            cell.Border = 0;
            table.AddCell(cell);

            //Linea 4
            cell = new PdfPCell(new Phrase("NOMBRE DEL DEPOSITANTE", f));
            cell.Colspan = 2;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
			  cell = new PdfPCell(new Phrase("GRADO SOLICITADO", f));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
			cell = new PdfPCell(new Phrase("PROGRAMA ACADÉMICO", f));
            cell.Colspan = 2;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
          
			
			
            cell = new PdfPCell(new Phrase(_nombre, f2));
            cell.Colspan = 2;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
		
            cell = new PdfPCell(new Phrase(_carrera, f2));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
				
			cell = new PdfPCell(new Phrase(_programa +" - "+_iddeprograma , f2));
            cell.Colspan = 2;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);

            //----
            cell = new PdfPCell(new Phrase(" "));
            cell.Colspan = 5;
            cell.Border = 0;
            table.AddCell(cell);

            //Linea 5
            cell = new PdfPCell(new Phrase("FECHA DE VENCIMIENTO", f));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
         
			
			cell = new PdfPCell(new Phrase("CICLO", f));
            cell.Colspan = 2;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
			
			
            cell = new PdfPCell(new Phrase(_duedate, f2));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
           
			
			cell = new PdfPCell(new Phrase(_concepto, f2));
            cell.Colspan = 2;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);

            //----
            cell = new PdfPCell(new Phrase(" "));
            cell.Colspan = 5;
            cell.Border = 0;
            table.AddCell(cell);
			

            //Linea 6
			cell = new PdfPCell(new Phrase("CONVENIO\n", f));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase("REFERENCIA\n", f));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);
			cell = new PdfPCell(new Phrase(" ", f2));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
            
			cell = new PdfPCell(new Phrase("BANCOMER 0877506", f2));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);
			cell = new PdfPCell(new Phrase(_referencia, f));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);
			cell = new PdfPCell(new Phrase(" ", f2));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
            
			cell = new PdfPCell(new Phrase("SANTANDER 5399", f2));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);
			cell = new PdfPCell(new Phrase(_referencia, f));
            cell.Colspan = 1;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);
			cell = new PdfPCell(new Phrase(" ", f2));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);
			 
			//     Desarrollo - UPSLP  [Se quita la referencia de BANAMEX]  17-11-2022
			//cell = new PdfPCell(new Phrase("BANAMEX 7011-5370861", f2));
            //cell.Colspan = 1;
            //cell.Border = 0;
            //cell.HorizontalAlignment = 0;
            //table.AddCell(cell);
			//cell = new PdfPCell(new Phrase(_referencia, f));
            //cell.Colspan = 1;
            //cell.Border = 0;
            //cell.HorizontalAlignment = 0;
            //table.AddCell(cell);
			//cell = new PdfPCell(new Phrase(" ", f2));
            //cell.Colspan = 3;
            //cell.Border = 0;
            //cell.HorizontalAlignment = 1;
            //table.AddCell(cell);
			 
            //----
            cell = new PdfPCell(new Phrase(" "));
            cell.Colspan = 5;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);

            //Tabla de pagos
            cell = new PdfPCell(new Phrase("TOTAL A DEPOSITAR", f4));
            cell.Colspan = 1;
            // cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.HorizontalAlignment = 6;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase(_monto, f2));
            cell.Colspan = 1;
            // cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.HorizontalAlignment = 6;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase(" "));
            cell.Colspan = 3;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);

            strLabel = IAdmissions.GetFichaLabelTexT("LBL1");
            //----
           cell = new PdfPCell(new Phrase(strLabel + " \n", f3));
            cell.Colspan = 5;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);

            strLabel = IAdmissions.GetFichaLabelTexT("LBL2");
            //DESARROLLO 2023 - Se modifica año
            cell = new PdfPCell(new Phrase(strLabel, f2));
            cell.Colspan = 5;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);

            strLabel = IAdmissions.GetFichaLabelTexT("LBL3");
            //DESARROLLO 2023 - Se agrega texto para solo modificar en un archivo las leyendas de la referencia
            cell = new PdfPCell(new Phrase(strLabel, f)); //DESARROLLO 2023
            cell.HorizontalAlignment = Element.ALIGN_JUSTIFIED;
			cell.Colspan = 5;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);

			cell = new PdfPCell(new Phrase(txt2, f2));
            cell.HorizontalAlignment = Element.ALIGN_JUSTIFIED;
			cell.Colspan = 5;
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);
			
			//Addvantit 9nov2020
			cell = new PdfPCell(new Phrase(txt3, f3));
            cell.HorizontalAlignment = Element.ALIGN_CENTER; 
			cell.Colspan = 5;
            cell.Border = 0;
            //cell.HorizontalAlignment = 0;
            table.AddCell(cell);

			document.Add(table);
            Phrase prueba = new Phrase("---------------------------------------------------------------------------------------------------------------------------------------");
            document.Add(prueba);
            document.Add(table);

            document.Close();
            writer.Close();
            return ms;

        }
    }
}