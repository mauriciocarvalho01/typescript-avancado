export class PersonController{
  speak(name?:string):string{
    return `Hello ${name?.toLocaleUpperCase() ?? "Fulano"}!!!`;
  }
}