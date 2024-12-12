import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslatorService } from 'src/app/core/services/utilites/translate.service';
import { AuthenticationService } from '@core/services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '@core/models/user.model';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Languages } from '@core/enums/language.enum';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    MatButtonToggleModule,
  ],

  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavBarComponent implements OnInit {
  private router: Router = inject(Router);
  private authService: AuthenticationService = inject(AuthenticationService);
  private translatorService: TranslatorService = inject(TranslatorService);

  isLoggedIn$!: Observable<boolean>;
  user$!: Observable<User | null>;
  currentLang!: string;
  languages = Languages;

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.user$ = this.authService.user$;
    this.currentLang = this.translatorService.currentLang;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleLanguage() {
    const newLang =
      this.currentLang === Languages.En ? Languages.Ar : Languages.En;
    this.translatorService.changeLang(newLang);
    this.currentLang = newLang;
  }
}
