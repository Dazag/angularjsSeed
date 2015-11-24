module project.User {

    export interface ILoginForm {
        remember:boolean;
        password:string;
        email:string;
    }

    export interface ISignupForm{
        name?:string;
        confirmPassword:string;
        password:string;
        email:string;
    }

    export interface IUser {
        id:number;
        name:string;
        surname:string;
        phone:string;
        src:string;
        email:string;
        group:string;
        settings:IUserSettings;
        address:IUserAddress[];
        eventCount:number;
        created:string;
    }

    export interface IUserArray {
        meta:{list:{total}}
        data:IUser[]
    }

    export interface IUserSettings {
        allCategories:number;
        categories:Array<any>;
        geofencing:number;
        iBeacon:boolean;
        push:boolean;
    }

    export interface IUserAddress {
        id:number;
        address1:string;
        address2:string;
        alias:string;
        city:string;
        company:string;
        country:string;
        name:string;
        surname:string;
        phone:string;
        phone_mobile:string;
        postcode:number;
        state:string;
        vat_number:string;
    }

    export class UserSrv extends project.services.RestSrv {

        static $inject = ['$http', 'appConfig', '$window'];

        window:ng.IWindowService;
        endpoint:string = 'users';
        users:Array<any>;
        user:IUser;
        eventType:string;

        //paginación
        itemsPerPage:number = 8;
        currentPage:number = 1;
        totalItems:number = 0;

        searchInput:string;

        constructor($http:ng.IHttpService, appConfig:project.IAppConfig, $window:ng.IWindowService) {
            super($http, appConfig);

            this.window = $window;
        }

        getAll(params:string = '', page:number = 1, limit:number = 8):ng.IHttpPromise<IUserArray> {
            return this.get(this.endpoint, params + '&sort=-created&offset=' + (--page * limit), limit).success((response, status)=> {
                this.users = response.data;
            });
        }

        getOne(id:number, endpoint?:string, config:ng.IRequestShortcutConfig = {}):ng.IHttpPromise<IUser> {
            return super.getOne(id, this.endpoint).success((response, status)=>this.user = response.data);
        }

        current():ng.IHttpPromise<any> {
            return this.get('user');
        }

        deleteOne(id?:number) {
            if (!this.window.confirm("¿Estás seguro que deseas eliminar este elemento?")) {
                return;
            }
            this.remove(this.endpoint + '/' + (id ? id : this.user.id));
        }

        pageChanged(pageNumber?:number, resetSearch:boolean = false) {

            var params:string = '';

            if (resetSearch) {
                this.searchInput = '';
            }
            if (this.eventType) {
                params = '&event=' + this.eventType;
            }
            if (this.searchInput) {
                params += '&q=' + this.searchInput;
            }

            this.getAll(params, pageNumber ? pageNumber : this.currentPage, this.itemsPerPage).success((response)=> {
                this.totalItems = response.meta.list.total;
            });
        }
    }
}
project.Bootstrap.angular.service('UserSrv', project.User.UserSrv);
