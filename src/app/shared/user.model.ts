export interface UserModel {
  name: string;
  lastName: string;
  dateOfBirth: string;
  framework: string;
  frameworkVersion: string;
  email: string;
  hobby: [{ name: string, duration: number }];
}

export class Hobby {
  constructor(private name: string, private duration: number) {
  }
}

export class User implements UserModel {
  name: string;
  lastName: string;
  dateOfBirth: string;
  framework: string;
  frameworkVersion: string;
  email: string;
  hobby: [{ name: string, duration: number }];

  constructor(name, lastName, dateOfBirth, framework, frameworkVersion, email, hobby) {
    this.name = name;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.framework = framework;
    this.frameworkVersion = frameworkVersion;
    this.email = email;
    this.hobby = hobby;
  }
}
