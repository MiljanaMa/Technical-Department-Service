import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from "@angular/material/input"
import { MatSelect, MatSelectModule } from "@angular/material/select"
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteOrigin, MatAutocompleteTrigger } from "@angular/material/autocomplete"
import { MatToolbar, MatToolbarModule } from "@angular/material/toolbar"
import { MatMenu, MatMenuModule } from "@angular/material/menu"
import { MatIcon, MatIconModule } from "@angular/material/icon"
import { MatButton, MatButtonModule } from "@angular/material/button"
import { MatBadge, MatBadgeModule } from "@angular/material/badge"
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from "@angular/material/sidenav"
import { MatList, MatListItem, MatListModule, MatNavList } from "@angular/material/list"
import { MatCard, MatCardModule, MatCardTitle } from "@angular/material/card"
import { MatSlider, MatSliderModule } from "@angular/material/slider"
import { MatColumnDef, MatHeaderRowDef, MatRow, MatTable, MatTableModule } from "@angular/material/table"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatDateRangeInput, MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from "@angular/material/datepicker"
import { MatNativeDateModule, MatOption } from "@angular/material/core"
import { MatRadioButton, MatRadioModule } from "@angular/material/radio"
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox"
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatTab, MatTabGroup, MatTabLabel, MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatGridList, MatGridListModule, MatGridTile} from '@angular/material/grid-list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
 
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatSliderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDialogModule,
    MatGridListModule,
    MatDatepickerModule,
    MatSnackBarModule
  ],
  exports: [
    MatInput,
    MatSelect,
    MatAutocomplete,
    MatAutocompleteOrigin,
    MatAutocompleteTrigger,
    MatToolbar,
    MatMenu,
    MatIcon,
    MatButton,
    MatBadge,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatList,
    MatCard,
    MatSlider,
    MatTable,
    MatPaginator,
    MatSort,
    MatDatepicker,
    MatRadioButton,
    MatCheckbox,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatListItem,
    MatNavList,
    MatDivider,
    MatFormField,
    MatLabel,
    MatOption,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    MatColumnDef,
    MatDialogContent,
    MatDialogActions,
    MatGridList,
    MatGridTile,
    MatHeaderRowDef,
    MatRow,
    MatTableModule,
    MatError,
    MatDatepickerModule,
    MatSnackBarModule,
    MatCardTitle
  ]
})
export class MaterialModule { }