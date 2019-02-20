import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from "../../models/user";

/**
 * Provider responsible for getting and setting the active user and managing
 * it's session at runtime.
 */
@Injectable()
export class UserSessionProvider {

  /**
   * Storage key for reading and writing the active user object
   */
  private readonly USER_STORAGE_KEY: string = 'activeUser';

  /**
   * The currently active user
   */
  private _activeUser: User;

  /**
   * Set a new user object to be the active user.
   * @param newActiveUser the new user to be the active one
   */
  public setActiveUser(newActiveUser: User) {
    this._activeUser = newActiveUser;
    if(this._activeUser !== null) {
      this.storage.set(this.USER_STORAGE_KEY, JSON.stringify(this._activeUser)).then();
    } else {
      this.storage.remove(this.USER_STORAGE_KEY).then();
    }
  }

  /**
   * Constructor
   * @param storage The Ionic storage service.
   */
  constructor(private storage: Storage) {
  }

  /**
   * Get the ready promise which will be called back
   * when the user session service has been ready initialized and configured.
   */
  public ready(): Promise<User> {
    return this.getActiveUser();
  }

  /**
   * Try to load the active user from the app's storage.
   * @return Promise which will be called back when the storage finished it's reading process.
   */
  public async getActiveUser() {
     return <User>await new Promise(resolve => {
       if(this._activeUser !== undefined) {
         resolve(this._activeUser);
       } else {
         this.storage.get(this.USER_STORAGE_KEY).then((userData) => {
           if(userData !== null) {
             this._activeUser = User.of(JSON.parse(userData));
             resolve(this._activeUser);
           } else {
             resolve(null);
           }
         });
       }
    })
  }

}
