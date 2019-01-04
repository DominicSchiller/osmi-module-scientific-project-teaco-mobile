import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator';
import {MyApp} from "../app/app.component";
import { OpenMeetingCardComponent } from './open-meeting-card/open-meeting-card';
import { ClosedMeetingCardComponent } from './closed-meeting-card/closed-meeting-card';
import { SuggestionCardComponent } from './suggestion-card/suggestion-card';
import { QuickVoteComponent } from './quick-vote/quick-vote';
@NgModule({
	declarations: [LoadingIndicatorComponent,
    OpenMeetingCardComponent,
    ClosedMeetingCardComponent,
    SuggestionCardComponent,
    QuickVoteComponent],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp)
	],
	exports: [LoadingIndicatorComponent,
    OpenMeetingCardComponent,
    ClosedMeetingCardComponent,
    SuggestionCardComponent,
    QuickVoteComponent]
})
export class ComponentsModule {}