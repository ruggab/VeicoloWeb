import { Azienda } from "./Azienda";
import { Dizionario } from "./Dizionario";
import { Gara } from "./Gara";

export class Veicolo {
    id:number;
    matricola : string;
    telaio : string;
    numSimSerialNumber: string;
    numSimTelefonico: string;
    dataPrimaImm : Date;
  
    dataScadVincolo : Date;
    lunghezza: number;
    numPorte: number;
    targa1Imm: string; 
    utimaVerIspettiva:string;
    categoria: Dizionario; 
    classe : Dizionario;
    fornitore: Dizionario;
    modello: Dizionario;
    tipoAlimentazione: Dizionario;
    tipoAllestimento:  Dizionario;
	classeAmbientale: Dizionario;
	
   
    //Info Veicolo
    gara:Gara;
    assegnatario:Azienda; 
    determAssegnazione: string;
    dataConsegnaAziendaTpl : Date;
    dataContrattoAssegnAziendaTpl : Date;
	dataContrattoApplAziendaTpl : Date;
    dataAttivazioneAvm : Date;
    regimeProprieta: Dizionario;
    costoAcquistoNettoIva: string;
    numProtocolloRicovero : string;
    protArrivoAcamMessADispCons: string;
    protComSituazApparati: string;
    dataScadTassaPossesso: Date;
    dataScadRca : Date;
    dataUltimaVerificaIsp: Date;
	estremiProtRappVerIsp: string;
    noteVerificaIsp: string;


    //Dati Usufrutto
    dataScadUsufrutto : Date;
    estremiContrUsufrutto: string;
	dataContrUsufrutto: Date;
	valAnnuoCanone: number;
	valPrimoCanone: number;
	valDa2a8Canone: number;
	val9Canone: number;
	val10Canone: number;
	val11Canone: number;
   

	//Polizze e garanzie
    protFidGaranziaBase: string;
	protFidGaranziaEstesa: string;
	numPolGaranziaBase: string; 
	numPolGaranziaEstesa: string;
    dataScadPolGaranziaBase : Date;
    dataScadPolGaranziaEstesa : Date;
    dataScadGaranziaBase : Date;
    dataScadGaranziaEstesa : Date;

	
    
    //Dati inseriti dall' Azienda
    dispCopiaCartaCirc : Dizionario;
    contrattoServizio: string;
    dataCessMarcia: Date;
    motivoFermo: string;
    indirizzoDepositoRicovero: string;
    kmDataRevisione: number; 
    dataUltimaRevisione : Date;
   

    //dati interni
    username: string;
    dataAggiornamento : Date;
    dataInserimento : Date;


    protComReferente: string;

}