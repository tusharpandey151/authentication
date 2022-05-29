import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    const user: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: Date
    } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if (user) {
      let loggedInUser: User = new User(user.email, user.id, user._token, user._tokenExpirationDate);
      if (loggedInUser.token) {
        this.authService.user.next(loggedInUser)
      }
      else {
        return null;
      }
    }
  }

}
