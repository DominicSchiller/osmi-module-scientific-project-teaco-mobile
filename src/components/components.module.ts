import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LoadingIndicatorComponent } from './general/loading-indicator/loading-indicator';
import { OpenMeetingCardComponent } from './meetings/open-meeting-card/open-meeting-card';
import { ClosedMeetingCardComponent } from './meetings/closed-meeting-card/closed-meeting-card';
import { SuggestionCardComponent } from './suggestions/suggestion-card/suggestion-card';
import { QuickVoteComponent } from './suggestions/quick-vote/quick-vote';
import { InputCardComponent } from './general/input-card/input-card';
import { FeedbackAlertComponent } from './general/feedback-alert/feedback-alert';
import { ParticipantsManager } from './participants/participants-manager/participants-manager';
@NgModule({
	declarations: [
	    LoadingIndicatorComponent,
        OpenMeetingCardComponent,
        ClosedMeetingCardComponent,
        SuggestionCardComponent,
        QuickVoteComponent,
        InputCardComponent,
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
        FeedbackAlertComponent,
        ParticipantsManager
    ]
})
export class ComponentsModule {}
