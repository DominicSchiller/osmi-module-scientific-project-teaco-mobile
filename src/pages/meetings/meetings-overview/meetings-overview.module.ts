import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MeetingsOverviewPage} from "./meetings-overview";
import {MeetingDetailPage} from "../meeting-detail/meeting-detail";

@NgModule({
    declarations: [
        MeetingsOverviewPage,
    ],
    imports: [
        IonicPageModule.forChild(MeetingsOverviewPage),
    ],
})
export class MeetingsOverviewModule {}
