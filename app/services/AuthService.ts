

module App.Services {

  export interface IAuthService {
    login(identity:string, password:string, remember:boolean);
    logout();
    save(permanent:boolean);
  }

  export class AuthService {

    constructor($rootScope:ng.IRootScopeService,$injector:ng.auto.IInjectorService,$q:ng.IQService){

    }

  }
}
