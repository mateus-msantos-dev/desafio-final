import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosPopularesComponent } from './produtos-populares.component';

describe('ProdutosPopularesComponent', () => {
  let component: ProdutosPopularesComponent;
  let fixture: ComponentFixture<ProdutosPopularesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutosPopularesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutosPopularesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
