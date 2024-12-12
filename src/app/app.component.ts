import { Component } from '@angular/core';
import { TranslatorService } from './core/services/utilites/translate.service';

import { locale as enLang } from '@assets/i18n/en';
import { locale as arLang } from '@assets/i18n/ar';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './layouts/nav-bar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  providers: [TranslatorService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
