import { NgModule } from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {AddNewMeetingPage} from "./add-new-meeting";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
    declarations: [
        AddNewMeetingPage,
    ],
    imports: [
        IonicModule,
        ComponentsModule,
        IonicPageModule.forChild(AddNewMeetingPage),
    ],
})
export class AddNewMeetingModule {}
