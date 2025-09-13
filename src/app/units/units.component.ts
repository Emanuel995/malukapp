import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitService, Unit } from '../services/unit.service';
import { AlertComponent } from '../utils/alert/alert.component';
import { UnitDetailComponent } from "../units/unit-detail/unit-detail.component";

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent, UnitDetailComponent],
  templateUrl: './units.component.html',
  styleUrl: './units.component.css'
})
export class UnitsComponent {
  units: Unit[] = [];
  mode: string = 'LIST';
  unitSelected: Unit | undefined;
  isError: boolean = false;
  message: string = '';

  constructor(private unitService: UnitService) { }

  ngOnInit(): void {
    this.unitService.getUnits().subscribe(units => { this.units = units })
  }

  create() {
    this.mode = 'INS';
    this.unitSelected = { id: 0, name: '',description:'' }
  }
  edit(unit: Unit) {
    this.mode = 'UPD';
    this.unitSelected = unit;
  }
  onModeChanged(newmode: string) {
    this.mode = 'LIST';
    this.ngOnInit();
  }
}
