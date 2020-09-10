import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../user.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns = ['email', 'firstName', 'lastName', 'role', 'btnAdmin'];
  dataSource = new MatTableDataSource<User>();
  constructor(private userService: UserService) {
  }

  ngOnInit() {
    var that = this;
    var getUsersDataPromise = this.userService.getAllUsersData().then(function(data: User[]) {
      that.dataSource.data = data;
    });
  }

  setAsUser(user: User) {

    this.userService.setUserRole(user, 'USER');
  }

  setAsAdmin(user: User) {
    this.userService.setUserRole(user, 'ADMIN');
  }

}
