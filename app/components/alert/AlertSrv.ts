module project.Alert {


    import IPromise = angular.IPromise;
    export class AlertSrv {

        static $inject:string[] = ['$timeout'];

        static danger:string = 'danger';
        static warning:string = 'warning';
        static info:string = 'info';
        static success:string = 'success';

        timeout:ng.ITimeoutService;
        timeoutPromise:IPromise<void>;

        msg:string;
        type:string;
        show:boolean = false;

        constructor($timeout:ng.ITimeoutService) {
            this.timeout = $timeout;
        }

        showMsg(msg:string, type:string, autoHide:boolean = true):void {
            this.msg = msg;
            this.type = type;
            this.show = true;

            if (autoHide) {
                this.timeoutPromise = this.timeout(() => {
                    this.hideMsg();
                }, 8000);
            }
        }

        hideMsg():void {
            this.timeout.cancel(this.timeoutPromise);
            this.msg = '';
            this.type = '';
            this.show = false;
        }
    }
}
project.Bootstrap.angular.service('AlertSrv', project.Alert.AlertSrv);