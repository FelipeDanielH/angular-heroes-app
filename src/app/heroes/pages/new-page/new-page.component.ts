import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>(''),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  })

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ]

  constructor(
    private heroesService: HeroService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    ) {}

  ngOnInit(): void {
    if( !this.router.url.includes('edit') ) return



    this.activatedRoute.params
      .pipe(
        // 'id' viene desestructurado de "params"
        switchMap( ({id}) => this.heroesService.getHeroeById( id ) ),
      ).subscribe( hero => {

        if( !hero ) return this.router.navigateByUrl('/')

        // el metodo reset recibe un objeto y si encuentra coincidencia en sus campos (en este caso los del heroe) reemplaza sus valores
        this.heroForm.reset( hero )
        return
      })

  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero
  }

  onSubmit():void {
    if(this.heroForm.invalid ) return



    if( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
      .subscribe( hero => {
        console.log(this.currentHero)
        // TODO mostrar snackbar
      })

      return
    }

    this.heroesService.addHero( this.currentHero )
    .subscribe( hero => {
      // TODO mostrar snackbar y navegar a /heroes/edit/hero.id
    })
  }





}
