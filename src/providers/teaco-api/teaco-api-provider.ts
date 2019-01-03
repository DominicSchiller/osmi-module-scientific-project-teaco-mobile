import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

import { ENV } from "@app/env";

import {User} from "../../models/user";
import {Meeting} from "../../models/meeting";
import {MeetingType} from "../../models/MeetingType";
import {Vote} from "../../models/vote";

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
   * The API endpoint for Meeting CRUD operations
   */
  private readonly votesAPIEndpoint = "/votes/";

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
   * @return The retrieved user
   */
  getUser(userKey: string): Observable<User> {
    const requestOptions = TeaCoApiProvider.getRequestOptions();
    const url = this.baseUrl + this.usersAPIEndpoint + userKey;
    return this.http.get<User>(url, requestOptions)
        .map(response => {
          if(response === null) {
            throw new Error("No user found for this key");
          }
          return new User(response);
        });
  }

  /**
   * Get all meetings for a specific user from TeaCo.
   * @param userKey  The user's unique key
   * @param meetingType The requested meeting type
   * @return The retrieved list of meetings
   */
  getAllMeetings(userKey: string, meetingType: MeetingType): Observable<Meeting[]> {
    const requestOptions = TeaCoApiProvider.getRequestOptions();
    const url = this.baseUrl+ this.usersAPIEndpoint + userKey + this.meetingsAPIEndpoint + "?type=" + meetingType.toString();
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
     * Get a specific meeting from TeaCo.
     * @param userKey The user's unique key
     * @param meetingID The meeting's id which to load
     * @return The retrieved meeting
     */
  getMeeting(userKey: string, meetingID: number): Observable<Meeting> {
      const requestOptions = TeaCoApiProvider.getRequestOptions();
      const url = this.baseUrl+ this.usersAPIEndpoint + userKey + this.meetingsAPIEndpoint + meetingID;
      return this.http.get<Meeting>(url, requestOptions)
          .map(data => {
              return new Meeting(data);
          });
  }

    /**
     * Update a given Vote record on TeaCo.
     * @param userKey The user's unique key
     * @param vote The vote record which to update
     * @return operation status (success or error).
     */
  updateVote(userKey: string, vote: Vote): Observable<void> {
      const requestOptions = TeaCoApiProvider.getRequestOptions();
      const url = this.baseUrl+ this.usersAPIEndpoint + userKey + this.votesAPIEndpoint;
      const updateData = JSON.stringify(vote);
      return this.http.put<void>(url, updateData, requestOptions);
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
