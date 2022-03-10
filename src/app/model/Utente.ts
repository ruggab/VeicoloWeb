import { Azienda } from "./Azienda";

export class Utente {
    id:number;
    username : string;
    email : string;
    password : string;
    confirmPassword : string;
    aziendas : Azienda[];
}