import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LockedMettingsPage } from './locked-mettings';

@NgModule({
  declarations: [
    LockedMettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(LockedMettingsPage),
  ],
})
export class LockedMettingsPageModule {}
