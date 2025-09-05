import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  imports: [MatDividerModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  year = new Date().getFullYear();
}
