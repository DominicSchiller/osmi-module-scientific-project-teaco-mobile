import { NgModule } from '@angular/core';
import {NoUserFoundPage} from "./no-user-found";
import {IonicPageModule} from "ionic-angular";

@NgModule({
    declarations: [
        NoUserFoundPage,
    ],
    imports: [
        IonicPageModule.forChild(NoUserFoundPage),
    ],
})
export class NoUserFoundModule {}
