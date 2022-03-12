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
    dataScadGaranziaBase : Date;
    dataScadGaranziaEstesa : Date;
  
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
   

	
	numPolGaranziaBase: string;
	numPolGaranziaEstesa: string;
	protFidGaranziaBase: string;
	protFidGaranziaEstesa: string;
	dataScadTassaPossesso: Date;
    dataScadRca : Date;
	protComReferente: string;

	
    
    //Dati inseriti dall' Azienda
    dispCopiaCartaCirc : Dizionario;
    contrattoServizio: string;
    dataCessMarcia: Date;
    motivoFermo: string;
    indirizzoDepositoRicovero: string;
    kmDataRevisione: number; 
    dataUltimaRevisione : Date;
   

    username: string;
    dataAggiornamento : Date;
    dataInserimento : Date;

}