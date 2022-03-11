import { Azienda } from "./Azienda";
import { Dizionario } from "./Dizionario";
import { Gara } from "./Gara";

export class Veicolo {
    id:number;
    matricola : string;
    telaio : string;
    
    numSimSerialNumber: string;
    numSimTelefonico: string;
    costoAcquistoNettoIva: string;
    dataAggiornamento : Date;
    dataAttivazioneavm : Date;
    dataConsegnaAdAziendaTpl : Date;
    dataContrattoAziendaTpl : Date;
    dataInserimento : Date;
    dataPrimaImm : Date;
    dataScadGaranziaBase : Date;
    dataScadGaranziaEstesa : Date;
    dataScadUsufrutto : Date;
    dataScadVincolo : Date;
   
    depositoRicoveroProtComunicazione : string;
    username: string;
  
    lunghezza: number;
    note: string;
    numPorte: number;
    targa1Imm: string; 
    utimaVerIspettiva:string;
    assegnatario:Azienda; 
    gara:Gara; 
    categoria: Dizionario; 
    classe : Dizionario;
   
    fornitore: Dizionario;
    modello: Dizionario;
    regimeProprieta: Dizionario;
    tipoAlimentazione: Dizionario;
    tipoAllestimento:  Dizionario;
    //Dati Azienda
    dispCopiaCartaCirc : Dizionario;
    contrattoServizio: string;
    dataCessMarcia: Date;
    motivoFermo: string;
    indirizzoDepositoRicovero: string;
    kmDataRevisione: number; 
    dataUltimaRevisione : Date;
   

}