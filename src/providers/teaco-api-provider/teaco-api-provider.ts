import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

import { User } from "../../models/User";
import {Meeting} from "../../models/Meeting";

/**
 * API provider for communicating with the TeaCo server endpoint.
 */
@Injectable()
export class TeaCoApiProvider {

  /**
   * The base URL to the TeaCo server
   */
  private baseUrl = 'http://localhost:3000/api/';
  /**
   * The API endpoint for User CRUD operations
   */
  private usersAPIEndpoint = "users/";

  /**
   * The API endpoint for Meeting CRUD operations
   */
  private meetingssAPIEndpoint = "meetings/";


  /**
   * Constructor
   * @param http The Ionic HTTP client instance
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Get a specific user from TeaCo.
   * @param userKey The user's unique key
   */
  getUser(userKey: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + this.usersAPIEndpoint + userKey, TeaCoApiProvider.getRequestOptions())
        .map(response => {
          return new User(response);
        })
  }

  /**
   * Get all meetings for a specific user from TeaCo.
   * @param userHash The user's hash
   */
  getMeetingsforUser(userHash: string): Observable<Meeting> {
      return this.http.get<Meeting>(this.baseUrl+ this.usersAPIEndpoint + userHash + this.meetingssAPIEndpoint, TeaCoApiProvider.getRequestOptions())
          .map(response => {
            return new Meeting(response);
          })
  }

  /**
   * Get required HTTP request options
   * @return Object which contains all required HTTP options such as HTTP headers etc.
   */
  private static getRequestOptions(): Object {
    return {
      headers: TeaCoApiProvider.createHttpHeaders()
    };
  }

  /**
   * Creates required HTTP Headers for sending a REST-Request.
   * @return HttpHeaders instance
   */
  private static createHttpHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');
    headers.append('content-type','application/json');

    return headers
  }

}
