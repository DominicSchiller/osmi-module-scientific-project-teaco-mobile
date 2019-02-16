import { NgModule } from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {CreateNewMeetingPage} from "./create-new-meeting";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
    declarations: [
        CreateNewMeetingPage,
    ],
    imports: [
        IonicModule,
        ComponentsModule,
        IonicPageModule.forChild(CreateNewMeetingPage),
    ],
})
export class CreateNewMeetingModule {}
