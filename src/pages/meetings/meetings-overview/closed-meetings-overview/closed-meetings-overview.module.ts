import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ClosedMeetingsOverviewPage} from "./closed-meetings-overview";
import {ComponentsModule} from "../../../../components/components.module";

@NgModule({
    declarations: [
        ClosedMeetingsOverviewPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(ClosedMeetingsOverviewPage),
    ],
})
export class ClosedMeetingsOverviewModule {}
