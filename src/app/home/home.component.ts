import { Component, OnInit } from '@angular/core';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

class AuthUser{
  constructor(
    public iduser: string ="",
    public username: string = "",
    public password: string = "",
    public phonenumber: string = "", 
  ){}
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  // mantain list of authuser mutation
  AuthUser: Array<any> = [];
  // constructor() { }
  authModel: AuthUser;
  showNew: Boolean = false;
  submitType: string = "Save";
  selectRow: number;
  //store user list 
  authUserList: Array<any> = [];
  comments: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.displayAuthUser();
  }

  //declare property/function DisplayAuthUser
  displayAuthUser(){
    const getAuthUser = gql`
    {
      AuthUser {
        iduser
        username
        phonenumber
      }
    }
    `;
    
    this.apollo
    .watchQuery({
      query: getAuthUser,
      fetchPolicy: "network-only"
    })
    .valueChanges.map((result:any) => result.data.AuthUser)
    .subscribe(data => {
      this.AuthUser = data;
    });
  }

  onSubmit() {
    if (this.submitType == "Save") {
      const saveAuth = gql `
        mutation createAuth (
          $iduser: String!
          $username: String!
          $phonenumber: String!
        ){
          createAuth(
            iduser: $iduser
            username: $username
            phonenumber: $phonenumber
          ){
            message
            id
          }
        }
      `;
      this.apollo
      .mutate({
        mutation: saveAuth,
        variables: {
          iduser: this.authModel.iduser,
          username: this.authModel.username,
          phonenumber: this.authModel.phonenumber
        }
      })
      .subscribe(
        ({ data }) => {
          this.displayAuthUser();
        },
        error => {
          console.log("there was an error sending query", error);
        }
      );
    }
  }
  

}
