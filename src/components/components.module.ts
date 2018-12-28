import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator';
import {MyApp} from "../app/app.component";
import { OpenMeetingCardComponent } from './open-meeting-card/open-meeting-card';
@NgModule({
	declarations: [LoadingIndicatorComponent,
    OpenMeetingCardComponent],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp)
	],
	exports: [LoadingIndicatorComponent,
    OpenMeetingCardComponent]
})
export class ComponentsModule {}
