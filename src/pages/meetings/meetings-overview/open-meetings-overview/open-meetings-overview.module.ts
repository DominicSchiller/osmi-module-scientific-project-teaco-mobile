import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {OpenMeetingsOverviewPage} from "./open-meetings-overview";
import {ComponentsModule} from "../../../../components/components.module";

@NgModule({
    declarations: [
        OpenMeetingsOverviewPage
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(OpenMeetingsOverviewPage),
    ],
})
export class OpenMeetingsOverviewModule {}
