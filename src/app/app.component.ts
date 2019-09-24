import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tabela-salarial';

  salarioBase : number = 5618;
  classes : number = 4;
  intersticio : number = 1.7;
  intersticioClasses : number = 5;
  intersticioMatrixes : number = 5;
  faixas : number = 7;
  matriz : number = 4;
  tabela : number[][][] = [];

  getTabelaSalarial() {
    this.salarioBase = parseFloat(this.salarioBase + "");
    this.salarioBase = parseFloat(this.salarioBase + "");
    this.classes = parseFloat(this.classes + "");
    this.intersticio = parseFloat(this.intersticio + "");
    this.intersticioClasses = parseFloat(this.intersticioClasses + "");
    this.intersticioMatrixes = parseFloat(this.intersticioMatrixes + "");
    this.faixas = parseFloat(this.faixas + "");
    this.matriz = parseFloat(this.matriz + "");

    if (this.tabela) this.tabela = [];

    for (var c = 0; c < this.classes ; c++) { // classes
      if(!this.tabela[c]) { this.tabela[c] = []; }

      for (var m = 0; m < this.matriz ; m++) { // matriz
        if (!this.tabela[c][m]) { this.tabela[c][m] = [] };

        for (var f = 0; f < this.faixas ; f++) { // faixas

          if(f == 0) {
            
            if (m == 0) {
              
              if (c == 0) {
                this.tabela[c][m][f] = this.salarioBase;
              } else {
                var temp = this.tabela[c-1][this.matriz-1][this.faixas-1];

                this.tabela[c][m][f] = temp * ( 1 + (this.intersticioClasses/100));
                this.tabela[c][m][f] = parseFloat( this.tabela[c][m][f].toFixed(2) );  
              }

            } else {
              this.tabela[c][m][f] = this.tabela[c][m-1][0] + (this.tabela[c][m-1][0] * (this.intersticioMatrixes/100) );
              this.tabela[c][m][f] = parseFloat( this.tabela[c][m][f].toFixed(2) );
            }

            
          } else {
            var numberTemp : number = this.tabela[c][m][f-1] + (this.tabela[c][m][f-1] * (this.intersticio/100) );
            this.tabela[c][m][f] =  parseFloat( numberTemp.toFixed(2) );
          }

          
        } // faixas
                
      } // matriz

      this.tabela[c] = this.tabela[c].reverse();

    } // classes

    return this.tabela;
  }

  ngOnInit() {
    this.getTabelaSalarial();
  }

}
