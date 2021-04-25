import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {delay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User, UserModel} from './shared/user.model';
import {DatePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {UserModal} from './shared/modal/user-modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userForm: FormGroup;
  objectKeys = Object.keys;
  technologies = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };
  loader = false;

  constructor(private http: HttpClient, private datePipe: DatePipe, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      secondName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      birthday: new FormControl('', Validators.required),
      technologies: new FormControl('', Validators.required),
      version: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email], this.forbiddenEmails.bind(this)
      ),
      hobbies: new FormGroup({
        name: new FormControl('',),
        duration: new FormControl('', [Validators.pattern('^[0-9]*$')])
      }),
      hobby: new FormArray([], Validators.required)
    });
  }

  addHobby(): void {
    const hobbiesControl = this.userForm.get('hobby') as FormArray;
    const name = new FormGroup({
      name: new FormControl(this.userForm.get('hobbies').get('name').value),
      duration: new FormControl(this.userForm.get('hobbies').get('duration').value)
    });
    hobbiesControl.push(name);
    this.userForm.get('hobbies').reset();
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    return new Promise<any>((resolve) => {
      this.http.get<UserModel[]>('/assets/user-mock.json').pipe(delay(2000)).subscribe(value => {
        if (value.find((name) => control.value === name.email)) {
          resolve({emailIsForbidden: true});
        } else {
          resolve(null);
        }
      });
    });
  }

  sendForm(form): void {
    if (this.userForm.valid) {
      new Promise(resolve => {
        this.loader = true;
        setTimeout(() => {
          resolve(
            new User(
              this.userForm.get('name').value,
              this.userForm.get('secondName').value,
              this.datePipe.transform(this.userForm.get('birthday').value, 'yyyy-MM-dd'),
              this.userForm.get('technologies').value,
              this.userForm.get('version').value,
              this.userForm.get('email').value,
              this.userForm.get('hobby').value
            ));
        }, 2000);
      }).then(result => {
        this.loader = false;
        form.reset();
        Object.keys(this.userForm.controls).forEach(key => {
          this.userForm.get(key).setErrors(null);
        });
        const arrClear = this.userForm.get('hobby') as FormArray;
        arrClear.clear();
        this.dialog.open(UserModal);
      });
    }
  }
}

