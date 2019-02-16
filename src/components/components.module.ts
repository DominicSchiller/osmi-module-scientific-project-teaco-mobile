import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator';
import { OpenMeetingCardComponent } from './open-meeting-card/open-meeting-card';
import { ClosedMeetingCardComponent } from './closed-meeting-card/closed-meeting-card';
import { SuggestionCardComponent } from './suggestion-card/suggestion-card';
import { QuickVoteComponent } from './quick-vote/quick-vote';
import { InputCardComponent } from './input-card/input-card';
import { ParticipantsListCardComponent } from './participants-list-card/participants-list-card';
import { SuggestionsListCardComponent } from './suggestions-list-card/suggestions-list-card';
import { FeedbackAlertComponent } from './feedback-alert/feedback-alert';
import { ParticipantsManager } from './participants-manager/participants-manager';
@NgModule({
	declarations: [
	    LoadingIndicatorComponent,
        OpenMeetingCardComponent,
        ClosedMeetingCardComponent,
        SuggestionCardComponent,
        QuickVoteComponent,
        InputCardComponent,
        ParticipantsListCardComponent,
        SuggestionsListCardComponent,
        FeedbackAlertComponent,
        ParticipantsManager,
    ],
	imports: [
        IonicModule
	],
    entryComponents: [
    ],
	exports: [
	    LoadingIndicatorComponent,
        OpenMeetingCardComponent,
        ClosedMeetingCardComponent,
        SuggestionCardComponent,
        QuickVoteComponent,
        InputCardComponent,
        ParticipantsListCardComponent,
        SuggestionsListCardComponent,
    FeedbackAlertComponent,
    ParticipantsManager
    ]
})
export class ComponentsModule {}
