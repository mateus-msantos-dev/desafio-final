import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router'; // ⬅️ Importe withInMemoryScrolling

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // ⬅️ Configure o Router aqui:
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled', // Ativa a rolagem para âncoras (#id)
        scrollPositionRestoration: 'enabled' // Rola para o topo ao mudar de página
      })
    ),
    
    provideHttpClient()
  ]
};
