import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>(''),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
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
    private dialog: MatDialog
  ) { }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return

    this.activatedRoute.params
      .pipe(
        // 'id' viene desestructurado de "params"
        switchMap(({ id }) => this.heroesService.getHeroeById(id)),
      ).subscribe(hero => {

        if (!hero) return this.router.navigateByUrl('/')

        // el metodo reset recibe un objeto y si encuentra coincidencia en sus campos (en este caso los del heroe) reemplaza sus valores
        this.heroForm.reset(hero)
        return
      })
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackBar(`${hero.superhero} updated`)
        })

      return
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['/heores/edit', hero.id])
        this.showSnackBar(`${hero.superhero} created`)
      })
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero id is required')

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result),
      switchMap( () => this.heroesService.deleteHero( this.currentHero.id)),
      filter( wasDeleted => wasDeleted )
    )
    .subscribe( () => {
      this.router.navigate(['/heroes'])
    })

    /* dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      this.heroesService.deleteHero(this.currentHero.id)
        .subscribe(wasDeleted => {
          if (wasDeleted)
            this.router.navigate(['/heroes'])
        })
    }); */
  }

  showSnackBar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500
    })
  }
}
