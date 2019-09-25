import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tabela-salarial';

  salarioBase : number = 5618;
  intersticio : number = 1.7;
  intersticioClasses : number = 5;
  intersticioMatrixes : number = 5;
  classes : number = 4;
  faixas : number = 7;
  matriz : number = 4;

  classesTableNumber : number = 0;
  faixasTableNumber : number = 0;
  matrizTableNumber : number = 0;

  tabela : number[][][] = [];
  tabelaQtde : number[][][] = [];
  listMatricesNumeral : number[] = [];

  getTabelaSalarial() {
    this.salarioBase = parseFloat(this.salarioBase + "");
    this.intersticio = parseFloat(this.intersticio + "");
    this.intersticioClasses = parseFloat(this.intersticioClasses + "");
    this.intersticioMatrixes = parseFloat(this.intersticioMatrixes + "");
    this.classes = parseFloat(this.classes + "");
    this.faixas = parseFloat(this.faixas + "");
    this.matriz = parseFloat(this.matriz + "");

    this.classesTableNumber = this.classes;
    this.faixasTableNumber = this.faixas;
    this.matrizTableNumber = this.matriz;

    this.listMatricesNumeral = this.getArrayNumeralsReverse(this.matrizTableNumber);
    
    if (this.tabela) {
      this.tabela = [];
      this.tabelaQtde = [];
    }

    for (var c = 0; c < this.classes ; c++) { // classes
      if(!this.tabela[c]) { 
        this.tabela[c] = [];
        this.tabelaQtde[c] = []; 
      }

      for (var m = 0; m < this.matriz ; m++) { // matriz
        if (!this.tabela[c][m]) {
          this.tabela[c][m] = [];
          this.tabelaQtde[c][m] = [];
        };

        for (var f = 0; f < this.faixas ; f++) { // faixas

          if(f == 0) {
            
            if (m == 0) {
              
              if (c == 0) {
                this.tabela[c][m][f] = this.salarioBase;
              } else {
                var temp = this.tabela[c-1][this.matriz-1][this.faixas-1];

                this.tabela[c][m][f] = this.getValue( temp * ( 1 + (this.intersticioClasses/100)) );
              }

            } else {
              this.tabela[c][m][f] = this.getValue( this.tabela[c][m-1][0] + (this.tabela[c][m-1][0] * (this.intersticioMatrixes/100) ) );
            }

            
          } else {
            var numberTemp : number = this.tabela[c][m][f-1] + (this.tabela[c][m][f-1] * (this.intersticio/100) );
            this.tabela[c][m][f] = this.getValue(numberTemp);
          }

          // incluindo quantidade
          this.tabelaQtde[c][m][f] = 0;

          
        } // faixas
                
      } // matriz

      this.tabela[c] = this.tabela[c].reverse();

    } // classes

    this.countImpact();

    return this.tabela;
  }

  countImpact() {
    var impact : number = 0;

    if (this.tabela && this.tabelaQtde) {
      for (var c = 0; c < this.classesTableNumber ; c++) { // classes
        for (var m = 0; m < this.matrizTableNumber ; m++) { // matriz  
          for (var f = 0; f < this.faixasTableNumber ; f++) { // faixas
            impact += this.tabelaQtde[c][m][f] * this.tabela[c][m][f];
          } // faixas
        } // matriz  
      } // classes
    }
    
    return impact;
  }

  getValue(val : number) {
    return parseFloat( val.toFixed(2) )
  }

  getArrayLetters(n: number): any[] {
    return Array.from(Array(n), (e, i) => String.fromCharCode(i + 97));
  }

  getArrayNumeralsReverse(n: number): any[] {
    return Array.from({ length: n }, (v, i) => i+1).reverse();
  }
  

  ngOnInit() {
    this.getTabelaSalarial();
  }

}
