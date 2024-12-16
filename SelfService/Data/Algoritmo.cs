using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Descripción breve de Algoritmo
/// </summary>
public class Algoritmo
{
    string[] factores = { "7", "3", "1" };
    string[] facref = { "11", "13", "17", "19", "23" };
    string fecha_ven;
    string DV;
    string auxcad;
    string importe;         //Recibir dato
    string cadena;          //Recibir dato
    int year = 0;           //Recibir dato
    int month = 0;          //Recibir dato
    int day = 0;            //Recibir dato
    int tam = 0;
    int aux = 0;
    int aux2 = 0;
    int count = 0;
    int tamcad = 0;
    int count2 = 0;
    int auxcad2 = 0;
    int auxcadint = 0;
    public string refe;
    public string referencia(string _cadena)
    {
        
        cadena = _cadena;
       

			string[] facref = { "13", "17", "19", "23", "11" };
            string DV;
            string auxcad;        //Recibir dato
            //string cadena = "CURPDEPRUEBA123456";          //Recibir dato
            string consref = "";
            string axudata = "";
            int tamcad = 0;
            int count2 = 0;
            int auxcad2 = 0;
            int auxcadint = 0;
            int a = 1;

            tamcad = cadena.Length;

            while (tamcad > 0)
            {
                auxcad = cadena.Substring(tamcad - 1, 1);
                switch (auxcad)
                {
                    case "A": case "a": auxcad = "1"; break;
                    case "B": case "b": auxcad = "2"; break;
                    case "C": case "c": auxcad = "3"; break;
                    case "D": case "d": auxcad = "4"; break;
                    case "E": case "e": auxcad = "5"; break;
                    case "F": case "f": auxcad = "6"; break;
                    case "G": case "g": auxcad = "7"; break;
                    case "H": case "h": auxcad = "8"; break;
                    case "I": case "i": auxcad = "9"; break;
                    case "J": case "j": auxcad = "1"; break;
                    case "K": case "k": auxcad = "2"; break;
                    case "L": case "l": auxcad = "3"; break;
                    case "M": case "m": auxcad = "4"; break;
                    case "N": case "n": auxcad = "5"; break;
                    case "O": case "o": auxcad = "6"; break;
                    case "P": case "p": auxcad = "7"; break;
                    case "Q": case "q": auxcad = "8"; break;
                    case "R": case "r": auxcad = "9"; break;
                    case "S": case "s": auxcad = "1"; break;
                    case "T": case "t": auxcad = "2"; break;
                    case "U": case "u": auxcad = "3"; break;
                    case "V": case "v": auxcad = "4"; break;
                    case "W": case "w": auxcad = "5"; break;
                    case "X": case "x": auxcad = "6"; break;
                    case "Y": case "y": auxcad = "7"; break;
                    case "Z": case "z": auxcad = "8"; break;
                }

                if (a > 1)
                {
                    auxcadint = Convert.ToInt32(facref[count2]) * Convert.ToInt32(auxcad);
                    auxcad2 = auxcadint + auxcad2;
                    consref = auxcad + consref;
                    tamcad = tamcad - 1;
                    count2++;

                    if (count2 == 5)
                    {
                        count2 = 0;
                    }
                }
                else
                {
                    a++;
                    tamcad = tamcad - 1;
                    axudata = auxcad;
                }
            }


            DV = Convert.ToString(((auxcad2 + 330) % 97) + 1);
            DV = "00" + DV;
            DV = DV.Substring(DV.Length - 2);


        refe = cadena + DV;
        return refe;

    }
}