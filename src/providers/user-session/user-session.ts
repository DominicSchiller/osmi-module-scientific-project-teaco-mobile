import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from "../../models/User";

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
   * Promise which will be called back when the user session service
   * has been completely initialized and ready configured.
   */
  private readonly _loadingPromise: Promise<User>;

  /**
   * Get the active user.
   */
  get activeUser(): User {
    return this._activeUser;
  }

  /**
   * Set a new user object to be the active user.
   * @param newActiveUser the new user to be the active one
   */
  set activeUser(newActiveUser: User) {
    this._activeUser = newActiveUser;
    if(this.activeUser !== null) {
      this.storage.set(this.USER_STORAGE_KEY, JSON.stringify(newActiveUser)).then();
    } else {
      this.storage.remove(this.USER_STORAGE_KEY).then();
    }
  }

  /**
   * Constructor
   * @param storage The Ionic storage service.
   */
  constructor(private storage: Storage) {
    this._loadingPromise = this.loadActiveUser();
  }

  /**
   * Get the ready promise which will be called back
   * when the user session service has been ready initialized and configured.
   */
  public ready(): Promise<User> {
    return this._loadingPromise;
  }

  /**
   * Try to load the active user from the app's storage.
   * @return Promise which will be called back when the storage finished it's reading process.
   */
  private loadActiveUser(): Promise<User> {
     return new Promise(resolve => {
      this.storage.get(this.USER_STORAGE_KEY).then((userData) => {
        if(userData !== null) {
          resolve(new User(JSON.parse(userData)));
        } else {
          resolve(null);
        }
      });
    })
  }

}
