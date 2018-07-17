import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CardService } from './card.service';
import { AppConfig } from '../../app.config';

describe('CardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppConfig, HttpClient, HttpHandler, CardService]
    });
  });

  it('should be created', inject([CardService], (service: CardService) => {
    expect(service).toBeTruthy();
  }));
});
