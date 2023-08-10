import { Component, OnInit } from '@angular/core';
import { HeroService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero

  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  goBack(): void {
    this.router.navigateByUrl('heroes/list')
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(({ id }) => this.heroService.getHeroeById(id))
      )
      .subscribe(hero => {
        if (!hero) return this.router.navigate(['/heroes/list'])
        this.hero = hero;
        return
      })
  }

}
