import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError, tap, map } from "rxjs/operators";
import { group } from "@angular/animations";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};
const apiUrl = "http://localhost:3000/api";
@Injectable({
  providedIn: "root"
})
export class DbService {
  constructor(private http: HttpClient) {}

  // getBooks(): Observable<any> {
  //   return this.http.get(apiUrl, httpOptions).pipe(
  //     map(this.extractData),
  //     catchError(this.handleError));
  // }

  // getBook(id: string): Observable<any> {
  //   const url = `${apiUrl}/${id}`;
  //   return this.http.get(url, httpOptions).pipe(
  //     map(this.extractData),
  //     catchError(this.handleError));
  // }

  // postBook(data): Observable<any> {
  //   return this.http.post(apiUrl, data, httpOptions)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // updateBook(data): Observable<any> {
  //   return this.http.put(apiUrl, data, httpOptions)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // deleteBook(id: string): Observable<{}> {
  //   const url = `${apiUrl}/${id}`;
  //   return this.http.delete(url, httpOptions)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  /**
   * Extract data from response
   * @param res
   */
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  /**
   * Error handler
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }

  //0 : genneral  1 : group admin 2 : super admin
  private types = [
    { label: "general", type: 0 },
    { label: "group admin", type: 1 },
    { label: "super admin", type: 2 }
  ];

  private users = [
    {
      username: "tbxsx1",
      password: "pass1",
      email: "email1@qq.com",
      type: 0
    },
    {
      username: "tbxsx2",
      password: "pass2",
      email: "email2@qq.com",
      type: 0
    },
    {
      username: "tbxsx3",
      password: "pass3",
      email: "email3@qq.com",
      type: 1
    },
    {
      username: "tbxsx4",
      password: "pass4",
      email: "email4@qq.com",
      type: 2
    }
  ];
  private groups = [
    {
      name: "group1",
      channels: [
        {
          name: "channel11",
          users: [
            {
              username: "tbxsx3",
              password: "pass3",
              email: "email3@qq.com",
              type: 1
            }
          ]
        },
        {
          name: "channel12",
          users: []
        }
      ]
    },
    {
      name: "group2",
      channels: [
        {
          name: "channel21",
          users: []
        },
        {
          name: "channel22",
          users: []
        }
      ]
    },
    {
      name: "group3",
      channels: [
        {
          name: "channel31",
          users: []
        },
        {
          name: "channel32",
          users: []
        },
        {
          name: "channel33",
          users: []
        }
      ]
    }
  ];
  private messages = [];

  getTypes() {
    return new Promise(resolve => {
      resolve(this.types);
    });
  }

  // getUsers() {
  //   return new Promise(resolve => {
  //     let data = this.users;
  //     resolve(data);
  //   });
  // }
  getUsers(): Observable<any> {
    const url = `${apiUrl}/user`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  /**
   * log out
   */
  logout(): Observable<any> {
    const url = `${apiUrl}/logout`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  /**
   * log in
   */

  login(username, password): Observable<any> {
    const url = `${apiUrl}/login`;
    let data = {
      username: username,
      password: password
    };
    return this.http.post(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // getUser(username, password) {
  //   return new Promise(resolve => {
  //     const index = this.users.findIndex(
  //       user => user.username === username && user.password === password
  //     );
  //     let ret = index != -1;
  //     let data = {};
  //     if (index != -1) {
  //       data["user"] = this.users[index];
  //       data["contain"] = true;
  //     } else {
  //       data["user"] = {};
  //       data["contain"] = false;
  //     }
  //     resolve(data);
  //   });
  // }

  getGroups(): Observable<any> {
    const url = `${apiUrl}/group`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

    // return new Promise(resolve => {
    //   let data = this.groups;
    //   resolve(data);
    // });
  }

  getGroupById(groupId): Observable<any> {
    const url = `${apiUrl}/groups/${groupId}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getChannel(channelId): Observable<any> {
    const url = `${apiUrl}/channel/${channelId}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getUser(userId): Observable<any> {
    const url = `${apiUrl}/user/${userId}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getChannels(groupId): Observable<any> {
    const url = `${apiUrl}/channel?groupId=${groupId}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

    // return new Promise(resolve => {
    //   const index = this.groups.findIndex(group => group.name === groupname);
    //   let data = this.groups[index].channels;
    //   resolve(data);
    // });
  }

  addChannel(groupId, channelname, userId) {
    const url = `${apiUrl}/channel`;
    let data = {
      group: groupId,
      channelName: channelname,
      userId: userId
    };
    return this.http.post(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
    // let
    // return new Promise(resolve => {
    //   const index = this.groups.findIndex(group => group.name === groupname);
    //   let newChannel = {
    //     name: channelname,
    //     users: []
    //   };
    //   this.groups[index].channels.push(newChannel);
    //   resolve(this.groups);
    // });
  }

  addUser(data): Observable<any> {
    // console.log("addUser");
    // console.log(data);
    const url = `${apiUrl}/user`;
    return this.http.post(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

    // return new Promise(resolve => {
    //   const index = this.users.findIndex(
    //     user => user.username == data.username
    //   );
    //   if (index == -1) {
    //     this.users.push(data);
    //   }
    //   resolve(data);
    // });
  }

  changeUserType(username, type): Observable<any> {
    const url = `${apiUrl}/user/changetype`;
    let data = {
      username: username,
      type: type
    };
    console.log(data);
    return this.http.post(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

    // const index = this.users.findIndex(user => user.username == username);
    // this.users[index].type = type;
    // return new Promise(resolve => {
    //   resolve(this.users);
    // });
  }

  addGroup(data) {
    const url = `${apiUrl}/groups`;
    return this.http.post(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

    // return new Promise(resolve => {
    //   const index = this.groups.findIndex(group => group.name === data.name);
    //   if (index == -1) {
    //     this.groups.push(data);
    //   }
    //   resolve(data);
    // });
  }

  findUsersbyGroupAndChannel(groupname, channelname): Promise<any[]> {
    return new Promise(resolve => {
      let data = [];
      const gindex = this.groups.findIndex(group => group.name === groupname);
      if (gindex != -1) {
        const cindex = this.groups[gindex].channels.findIndex(
          channel => channel.name === channelname
        );
        if (cindex != -1) {
          data = this.groups[gindex].channels[cindex].users;
        }
      }
      resolve(data);
    });
  }

  deleteUserFromChannel(channelId, userId) {
    // return new Promise(resolve => {
    //   let data = [];
    //   const gindex = this.groups.findIndex(group => group.name === groupname);
    //   if (gindex != -1) {
    //     const cindex = this.groups[gindex].channels.findIndex(
    //       channel => channel.name === channelname
    //     );
    //     if (cindex != -1) {
    //       const uindex = this.groups[gindex].channels[cindex].users.findIndex(
    //         user => user.username === username
    //       );
    //       this.groups[gindex].channels[cindex].users.splice(uindex, 1);
    //     }
    //   }
    //   resolve(true);
    // });
    const url = `${apiUrl}/channel/delete`;
    let data = {
      userId: userId,
      channelId: channelId
    };
    console.log(data);
    return this.http.post(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  addUserChannel(channelId, userId) {
    const url = `${apiUrl}/channel/add`;
    let data = {
      channelId: channelId,
      userId: userId
    };
    return this.http.post(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

    // return new Promise(resolve => {
    //   let data = [];
    //   const gindex = this.groups.findIndex(group => group.name === groupname);
    //   if (gindex != -1) {
    //     const cindex = this.groups[gindex].channels.findIndex(
    //       channel => channel.name === channelname
    //     );
    //     if (cindex != -1) {
    //       this.groups[gindex].channels[cindex].users.push(user);
    //     }
    //   }
    //   resolve(this.groups);
    // });
  }

  // addGroupByName(groupname) {
  //   return new Promise(resolve => {
  //     const index = this.groups.findIndex(group => group.name === groupname);
  //     let newGroup = {
  //       name: groupname,
  //       channels: []
  //     };
  //     if (index == -1) {
  //       this.groups.push(newGroup);
  //     }
  //     resolve(this.groups);
  //   });
  // }

  deleteUser(userId): Observable<any> {
    const url = `${apiUrl}/user/delete/${userId}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

    // return new Promise(resolve => {
    //   const index = this.users.findIndex(user => user.username === username);
    //   this.users.splice(index, 1);
    //   resolve(true);
    // });
  }

  deleteGroup(groupId): Observable<any> {
    const url = `${apiUrl}/groups/delete/${groupId}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

    // return new Promise(resolve => {
    //   const index = this.groups.findIndex(group => group.name === groupname);
    //   if (index != -1) {
    //     this.groups.splice(index, 1);
    //   }
    //   resolve(true);
    // });
  }

  deleteChannel(channelId): Observable<any> {
    const url = `${apiUrl}/channel/delete/${channelId}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  updateUser(newuser) {
    return new Promise(resolve => {
      const index = this.users.findIndex(
        user => user.username === newuser.username
      );
      this.users[index] = newuser;
      resolve(true);
    });
  }

  // constructor() {}
}
