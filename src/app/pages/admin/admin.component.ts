import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importe a sidebar que acabamos de criar
import { AdminSidebarComponent } from './pages/admin-sidebar/admin-sidebar.component'; 

@Component({
  selector: 'app-admin-root',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent], 
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
}