import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

import { ENV } from "@app/env";

import {User} from "../../models/User";
import {Meeting} from "../../models/Meeting";

/**
 * API provider for communicating with the TeaCo server endpoint.
 */
@Injectable()
export class TeaCoApiProvider {

  /**
   * The base URL to the TeaCo server
   */
  private readonly baseUrl: string;
  /**
   * The API endpoint for User CRUD operations
   */
  private readonly usersAPIEndpoint = "users/";

  /**
   * The API endpoint for Meeting CRUD operations
   */
  private readonly meetingsAPIEndpoint = "/meetings/";


  /**
   * Constructor
   * @param http The Ionic HTTP client instance
   */
  constructor(private http: HttpClient) {
    this.baseUrl = ENV.api.baseURL;
  }

  /**
   * Get a specific user from TeaCo.
   * @param userKey The user's unique key
   */
  getUser(userKey: string): Observable<User> {
    const requestOptions = TeaCoApiProvider.getRequestOptions();
    const url = this.baseUrl + this.usersAPIEndpoint + userKey;
    return this.http.get<User>(url, requestOptions)
        .map(response => {
          return new User(response);
        });
  }

  /**
   * Get all meetings for a specific user from TeaCo.
   * @param userKey  The user's unique key
   */
  getAllMeetings(userKey: string): Observable<Meeting[]> {
    const requestOptions = TeaCoApiProvider.getRequestOptions();
    const url = this.baseUrl+ this.usersAPIEndpoint + userKey + this.meetingsAPIEndpoint;
    return this.http.get<Meeting[]>(url, requestOptions)
        .map(response => {
          let meetings: Meeting[] = [];
          response.forEach(data => {
            meetings.push(new Meeting(data));
          });
          return meetings;
        });
  }

  /**
   * Get required HTTP request options
   * @return Object which contains all required HTTP options such as HTTP headers etc.
   */
  private static getRequestOptions() {
    return {
      headers: TeaCoApiProvider.createHttpHeaders()
    }
  }

  /**
   * Creates required HTTP Headers for sending a REST-Request.
   * @return HttpHeaders instance
   */
  private static createHttpHeaders(): HttpHeaders {
    return new HttpHeaders()
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'POST, GET, DELETE, PATCH, OPTIONS, PUT, HEAD')
        .set('Accept', 'application/json')
        .set('content-type', 'application/json')
  }

}
