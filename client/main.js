import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import './main.html';

if (Meteor.isClient) {
    Tracker.autorun(function () {
        Meteor.subscribe("allUsers");
        Meteor.subscribe("allUserData");
    });
    Template.signup.events({
        'submit form': function (event) {
            event.preventDefault();
            var emailVar = event.target.signupEmail.value;
            var passwordVar = event.target.signupPassword.value;
            date = new Date();
            nameVar = event.target.signupName.value;
            if (nameVar == "Paul") {
                Accounts.createUser({
                    email: emailVar,
                    password: passwordVar,
                    profile: {
                        name: nameVar,
                        role: "Admin",
                        createdAt: date,
                        room_type: "0",
                        room_number: "0",
                        person_number: "0",
                        child_number: "0",
                        checked_In: false
                    }
                });
            } else {
                Accounts.createUser({
                    email: emailVar,
                    password: passwordVar,
                    profile: {
                        name: nameVar,
                        role: "Why is this triggering",
                        createdAt: date,
                        room_type: "0",
                        room_number: "0",
                        person_number: "0",
                        child_number: "0",
                        checked_In: false
                    }
                });
            }
        }
    });
    Template.body.events({
        'click .cancel': function (e) {
            event.preventDefault();
            var date = Meteor.user().profile.createdAt;
            var name = Meteor.user().profile.name;
            var role = Meteor.user().profile.role;
            Meteor.users.update({ _id: Meteor.userId() }, {
                "$set": {
                    "profile": {
                        "room_type": "0",
                        "room_number": "0",
                        "person_number": "0",
                        "child_number": "0",
                        "createdAt": date,
                        "checked_In": false,
                        "name": name,
                        "role": role
                    }
                }
            });
            //alert("Great Success!");
            $('#myModalAccount').modal('hide');
            setTimeout(function () {
                $('#myModal2').modal('show');
            }, 1000)
        }
    });
    Template.login.events({
        'submit form': function (event) {
            event.preventDefault();
            var emailVar = event.target.loginEmail.value;
            var passwordVar = event.target.loginPassword.value;
            Meteor.loginWithPassword(emailVar, passwordVar);
        }
    });
    Template.settings.events({
        'click .logout': function (event) {
            event.preventDefault();
            Meteor.logout();
        },
        'submit form': function (event) {
            event.preventDefault();
            var room_type = event.target.room_type.value;
            var room_number = event.target.room_number.value;
            var person_number = event.target.person_number.value;
            var child_number = event.target.child_number.value;
            var date = Meteor.user().profile.createdAt;
            var name = Meteor.user().profile.name;
            var role = Meteor.user().profile.role;
            Meteor.users.update({ _id: Meteor.userId() }, {
                "$set": {
                    "profile": {
                        "room_type": room_type,
                        "room_number": room_number,
                        "person_number": person_number,
                        "child_number": child_number,
                        "createdAt": date,
                        "checked_In": false,
                        "name": name,
                        "role": role
                    }
                }
            });
            //alert("Great Success!");
            $('#myModal').modal('show');
            event.target.room_type.value = "Select Room/Suite";
            event.target.room_number.value = "0";
            event.target.person_number.value = "0";
            event.target.child_number.value = "0";
        }
    });
    Template.userEmail.helpers({
        userEmail: function () {
            return Meteor.user().emails[0].address
        }
    });
    Template.userName.helpers({
        userName: function () {
            return Meteor.user().profile.name
        }
    });
    Template.userChecked_In.helpers({
        userChecked_In: function () {
            return Meteor.user().profile.checked_In
        }
    });
    Template.userRole.helpers({
        userRole: function () {
            return Meteor.user().profile.role
        }
    });
    Template.userChildNumber.helpers({
        userChildNumber: function () {
            return Meteor.user().profile.child_number
        }
    });
    Template.userEmailVerified.helpers({
        userEmailVerified: function () {
            return Meteor.user().emails[0].verified
        }
    });
    Template.userPersonNumber.helpers({
        userPersonNumber: function () {
            return Meteor.user().profile.person_number
        }
    });
    Template.userCreatedAt.helpers({
        userCreatedAt: function () {
            return Meteor.user().profile.createdAt
        }
    });
    Template.userNumRoom.helpers({
        userNumRoom: function () {
            return Meteor.user().profile.room_number
        }
    });
    Template.userRoomType.helpers({
        userRoomType: function () {
            return Meteor.user().profile.room_type
        }
    });
    Template.daysOverview.helpers({
        users: function () {
            var user = Meteor.users.find({});
            return user;
        },
    });
    /*  REQUIRES AUTHORIZATION. POSSIBLE TO PUBLISH?
        userID: function () {
          return Meteor.user()._id
        }, */
    Template.isAdmin.helpers({
        admin: function () {
            if (Meteor.user().profile.role == "Admin") {
                return true
            } else {
                return false
            }
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
    Meteor.publish('allUsers', function () {
        return Meteor.users.find();
    });
    Meteor.publish('AllUserData', function () {
        return Meteor.users.find({}, { fields: { profile: true } });
    });
}