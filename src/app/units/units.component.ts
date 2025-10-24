import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitService, Unit, Filter } from '../services/unit.service';
import { AlertComponent } from '../utils/alert/alert.component';
import { UnitDetailComponent } from "../units/unit-detail/unit-detail.component";
import { ModalComponent } from '../utils/modal/modal.component';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent, UnitDetailComponent,ModalComponent],
  templateUrl: './units.component.html',
  styleUrl: './units.component.css'
})
export class UnitsComponent {
  units: Unit[] = [];
  mode: string = 'LIST';
  unitSelected: Unit | undefined;
  isError: boolean = false;
  message: string = '';
  showModal = false;
  selectedUnit: Unit | undefined;
  messageModal:string='';
  filter:Filter={};

  constructor(private unitService: UnitService) { }

  ngOnInit(): void {
    this.filter.includeDeleted = true;
    this.unitService.getUnits(this.filter).subscribe(units => { this.units = units })
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

  setSelectUnit(unit: Unit){
    this.unitSelected = unit;
    if (this.unitSelected.is_deleted == false){
      this.messageModal = '¿Está seguro de inactivar la unidad '+ this.unitSelected.name + '?'
    }else{
      this.messageModal = '¿Está seguro de activar la unidad '+ this.unitSelected.name + '?'
    }
    this.showModal = true;
  }

  activate(unit: Unit) {
    const index = this.units.findIndex(c => c.id === unit.id);
    this.unitService.activate(unit.id).subscribe(
      response => {
        this.units[index].is_deleted = false
      }
    )
  }
  deactivate(unit: Unit) {
    const index = this.units.findIndex(c => c.id === unit.id);
    this.unitService.deactivate(unit.id).subscribe(
      response => {
        this.units[index].is_deleted = true
      }
    )
  }
  confirmModal() {
    if (this.unitSelected) {
      if (this.unitSelected.is_deleted == true) {
        this.activate(this.unitSelected);
      } else {
        this.deactivate(this.unitSelected);
      }
    }
    this.showModal = false;
  }
  cancelModal() {
    this.showModal = false;
    this.messageModal ='';
  }
}
