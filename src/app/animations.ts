import { animate, keyframes, query, stagger, style, transition, trigger } from "@angular/animations";

export const listStateTrigger = trigger('listState', [
  transition('* => *', [
    // entrada
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-100%)' }),
      stagger(200, [
        animate('500ms ease-in', keyframes([
          style({ opacity: 1, transform: 'translateY(-10%)', offset: 0.4 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ], { optional: true }),
    // saída
    query(':leave', [
      stagger(200, [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(-100%)' }))
      ])
    ], { optional: true })
  ])
]);