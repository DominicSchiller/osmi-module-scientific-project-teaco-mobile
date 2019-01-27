import { NgModule } from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {ComponentsModule} from "../../../components/components.module";
import {MeetingDetailPage} from "./meeting-detail";

@NgModule({
    declarations: [
        MeetingDetailPage,
    ],
    imports: [
        IonicModule,
        ComponentsModule,
        IonicPageModule.forChild(MeetingDetailPage),
    ],
})
export class MeetingDetailModule {}
