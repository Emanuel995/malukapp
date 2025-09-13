import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, output, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UnitService, Unit } from '../../services/unit.service';
import { AlertComponent } from '../../utils/alert/alert.component';

@Component({
  selector: 'app-unit-detail',
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent],
  templateUrl: './unit-detail.component.html',
  styleUrl: './unit-detail.component.css'
})
export class UnitDetailComponent {
  isError: boolean = false;
  message: string = '';
  units: Unit[] = [];
  unit: Unit | undefined;
  editable: boolean = true;
  @Input() unitSelected: Unit | undefined;
  @Input() mode: string = '';
  @Output() modeChange = new EventEmitter<string>();
  @Output() isErrorChange = new EventEmitter<Boolean>();
  @Output() messageChange = new EventEmitter<string>();
  constructor(private unitservice: UnitService) { }

  ngOnInit(): void {
    if (this.mode == 'INS') {
      this.unit = {
        id: 0,
        name: '',
        description:''
      }
    } else {
      this.unit = this.unitSelected;
    }
  }

  save() {
    this.isError = false;
    this.message = '';
    switch (this.mode) {
      case 'INS':
        if (this.unit) {
          this.unitservice.createUnit(this.unit).subscribe(
            resp => {
              this.isError = resp.isError;
              this.message = resp.message;
              console.log(resp);
              if (this.isError == false) {
                this.modeChange.emit('LIST');
              }
            }
          );
        }
        break;
      case 'UPD':
        if (this.unit) {
          this.unitservice.updateUnit(this.unit).subscribe(
            resp => {
              this.isError = resp.isError;
              this.message = resp.message;
              console.log(resp);
              if (this.isError == false) {
                this.modeChange.emit('LIST');
              }
            }
          );
        }
        break;
    }
    this.isErrorChange.emit(this.isError);
    this.messageChange.emit(this.message);
  }
  back() {
    this.modeChange.emit('LIST');
  }
}
