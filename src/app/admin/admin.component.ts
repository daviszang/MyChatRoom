import { Component, OnInit, Inject, forwardRef } from "@angular/core";
import { DbService } from "../db/db.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { group } from "@angular/animations";

type validateResult = {
  status: string;
  message?: string;
};

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
  providers: [DbService]
})
export class AdminComponent implements OnInit {
  public users;
  public groups;
  public type;
  public dismissModel;
  public cardToggle;
  public types;

  public choosedAddUser;

  public addGroupChannelButton;
  public newChannelName;
  public newGroupName;

  public editGroupName;
  public editChannelName;

  public filteredUsers;

  public newUserName;
  public newEmail;
  public newUserType;
  public newPassword;
  public edittingUser;

  public tableData: any[] = [];

  public changeUserType;

  constructor(
    private dbService: DbService,
    @Inject(forwardRef(() => FormBuilder)) private formBuilder: FormBuilder
  ) {}

  editChannelButton(groupname, channelname) {
    this.editChannelName = channelname;
    this.editGroupName = groupname;
    this.editChannelfilter();
    this.dbService
      .findUsersbyGroupAndChannel(this.editGroupName, this.editChannelName)
      .then(users => {
        this.tableData = users;
      });
  }

  editChannelfilter() {
    return this.dbService
      .findUsersbyGroupAndChannel(this.editGroupName, this.editChannelName)
      .then(cusers => {
        console.log(cusers);
        console.log("FFF");
        this.filteredUsers = this.users.filter(user => {
          const index = cusers.findIndex(
            cuser => cuser.username === user.username
          );
          return index == -1;
        });
      });
  }

  // deleteUserFromChannel(scope) {
  //   return this.dbService
  //     .deleteUserFromChannel(
  //       this.editGroupName,
  //       this.editChannelName,
  //       scope.username
  //     )
  //     .then(data => {
  //       this.editChannelfilter();
  //       this.dbService.findUsersbyGroupAndChannel(
  //         this.editGroupName,
  //         this.editChannelName
  //       );
  //     });
  // }

  getUsers() {
    // return this.dbService.getUsers().then(users => {
    //   this.users = users;
    // });

    return this.dbService.getUsers().subscribe(
      users => {
        this.users = users;
      },
      err => console.log(err)
    );
  }

  getGroups() {
    // return this.dbService.getGroups().then(groups => {
    //   this.groups = groups;
    // });

    return this.dbService.getGroups().subscribe(
      groups => {
        this.groups = groups;
      },
      err => console.log(err)
    );
  }

  deleteUser(userId) {
    // return this.dbService.deleteUser(user).then(() => {
    //   return this.getUsers();
    // });

    return this.dbService
      .deleteUser(userId)
      .subscribe(data => this.getUsers(), err => console.log(err));
  }

  createUser() {
    let newUser = {
      username: this.newUserName,
      email: this.newEmail,
      type: this.newUserType || 0,
      password: this.newPassword
    };
    if (newUser.type == undefined) newUser.type = 0;
    console.log("HHHHH1");
    console.log(newUser);
    this.dbService.addUser(newUser).subscribe(data => {
      this.getUsers();
      this.newUserName = "";
      this.newEmail = "";
      this.newUserType = 0;
      this.newPassword = "";
    });
  }

  editUserButton(user) {
    this.edittingUser = user;
  }
  editUser() {
    this.dbService
      .changeUserType(this.edittingUser.username, this.changeUserType)
      .subscribe(data => this.getUsers(), err => console.log(err));
    this.getUsers();
    this.edittingUser = {};
    this.changeUserType = "";
  }

  get createGroup() {
    let newGroup = {
      name: this.newGroupName,
      members: [],
      // admin: localStorage.getItem("userId"),
      userId: localStorage.getItem("userId")
    };
    this.dismissModel = true;
    console.log(newGroup);
    // return this.dbService.addGroup(newGroup).then(data => this.getGroups());
    return this.dbService
      .addGroup(newGroup)
      .subscribe(data => this.getGroups(), err => console.log(err));
  }

  deleteGroup(groupId) {
    console.log(groupId);

    // return this.dbService.deleteGroup(groupname).then(data => {
    //   return this.getGroups();
    // });

    return this.dbService
      .deleteGroup(groupId)
      .subscribe(data => this.getGroups(), err => console.log(err));
  }

  addChannelButton(groupId) {
    this.addGroupChannelButton = groupId;
  }
  addChannel() {
    let tmp = this.addGroupChannelButton;
    // return this.dbService.addChannel(tmp, this.newChannelName).then(data => {
    //   return this.getGroups();
    // });

    let userId = localStorage.getItem("userId");
    return this.dbService
      .addChannel(tmp, this.newChannelName, userId)
      .subscribe(data => this.getGroups(), err => console.log(err));
  }

  getChannels(groupId) {
    return this.dbService
      .getChannels(groupId)
      .subscribe(data => {}, err => console.log(err));
  }

  changeUser() {}

  ngOnInit() {
    let type = localStorage.getItem("type");
    if (type == undefined) {
      location.replace("./login");
      return;
    }
    if (type == "0") {
      location.replace("./chooseGroupAndChannel");
      return;
    }
    this.dismissModel = false;
    this.newUserType = 0;
    this.type = type;
    this.getUsers();
    this.getGroups();

    this.validateForm = this.formBuilder.group({});
    this.dbService.getTypes().then(types => {
      this.types = types;
    });
    this.edittingUser = {};
  }

  private validateForm: FormGroup;
  submit(): void {
    console.log(this.validateForm.value);
  }
}
