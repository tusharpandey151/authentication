import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'ng-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent {

    @Input() message: string;

    @Output() alertEvent = new EventEmitter<void>();

    close() {
        this.alertEvent.emit(); 
    }

}