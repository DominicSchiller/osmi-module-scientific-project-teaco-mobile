import { NgModule } from '@angular/core';
import {NoUserFoundPage} from "./no-user-found";
import {IonicPageModule} from "ionic-angular";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
    declarations: [
        NoUserFoundPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(NoUserFoundPage),
    ],
})
export class NoUserFoundModule {}
