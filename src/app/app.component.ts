import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tabela-salarial';

  /**
   * Parametros iniciais
   */
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

  /**
   * TODO O(n^3)
   */
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

  /**
   * TODO O(n^3)
   */
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

  /**
   * TODO O(n^3)
   */
  countQtde() {
    var impact : number = 0;

    if (this.tabela && this.tabelaQtde) {
      for (var c = 0; c < this.classesTableNumber ; c++) { // classes
        for (var m = 0; m < this.matrizTableNumber ; m++) { // matriz  
          for (var f = 0; f < this.faixasTableNumber ; f++) { // faixas
            impact += this.tabelaQtde[c][m][f];
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

  getFormattedPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printable-component').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Tabela Salarial</title>
          <style>
          table > th, td {
            border: 1px solid black;
          }
          table {
            width: 100%;
            padding-bottom: 0.75rem;
          }
          </style>
        </head>
        <body onload="window.print();">
          <p><strong>Impacto Financeiro</strong> ${this.getFormattedPrice(this.countImpact())} | <strong>Quantidade de Colaboradores</strong> ${this.countQtde()}</p>
          <p><strong>Salário Base: </strong> ${this.getFormattedPrice(this.salarioBase)} <br/> 
          <strong>Informações: </strong> Matriz de ${this.matriz}, contendo ${this.faixas} faixas e ${this.classes} classes (total de ${this.faixas * this.classes} faixas) <br/> 
          <strong>intersticios: </strong> ${this.intersticio}% entre faixas ; ${this.intersticioClasses}% entre classes ; ${this.intersticioMatrixes}% entre Matrizes</p>
          ${printContents}
        </body>
      </html>`
    );
    popupWin.document.close();
  }

  /**
   * TODO O(n^3)
   */
  downloadData(data : any) {
    var BOM = "\uFEFF";
    var csvData = BOM;
    
    if (this.tabela && this.tabelaQtde) {
      for (var c = 0; c < this.classesTableNumber ; c++) { // classes
        for (var m = 0; m < this.matrizTableNumber ; m++) { // matriz  
          for (var f = 0; f < this.faixasTableNumber ; f++) { // faixas
            csvData += this.tabela[c][m][f] + ";"
          } // faixas
          csvData += "\n"
        } // matriz
        csvData += "\n\n"
      } // classes
    }

    var blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "tabela_salarial.csv");
  }

}
