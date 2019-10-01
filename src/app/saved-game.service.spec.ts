import { TestBed } from '@angular/core/testing';

import { SavedGameService } from './saved-game.service';

describe('SavedGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SavedGameService = TestBed.get(SavedGameService);
    expect(service).toBeTruthy();
  });
});
