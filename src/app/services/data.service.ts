import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Signal to track the selected box index reactively.
  private _selectedBoxIndex = signal<number | null>(null);

  private _boxList = new Array<Object>(10);

  constructor() {}


  get boxes(): Array<Object> {
    return this._boxList;
  }

  /** Access the reactive signal for the currently selected box index. */
  get selectedBoxIndex() {
    return this._selectedBoxIndex;
  }



  /**
   *  Set the selected box index if it is within the valid range.
   *  */
  setSelectedBoxIndex(index: number): void {
    if (index < this._boxList.length) {
      this._selectedBoxIndex.set(index);
    }
  }

  /**
   *  Clear the selected box index, setting it to null.
   *  */
  clearSelectedIndex(): void {
    this._selectedBoxIndex.set(null);
  }
}
