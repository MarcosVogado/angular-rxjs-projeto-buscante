import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { listStateTrigger } from 'src/app/animations';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/LivroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

  const pausa = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
  animations: [
    listStateTrigger
  ]
})

export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;
  
  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(pausa),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo inicial')),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      map(resultado => this.livrosResultado = resultado),
      catchError(erro => {
        console.log(erro)
        return of();
      })
    )

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(pausa),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo inicial')),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      tap((retornoAPI) => console.log(retornoAPI)),
      map(resultado => resultado.items ?? []),
      map((items) => {
        return this.livrosResultadoParaLivros(items)
      }),
      catchError(erro => {
        console.log(erro)
        return throwError(() => new Error(this.mensagemErro = 'Ops, ocorreu um erro, recarregue a página!'))
      })
    )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }
}



