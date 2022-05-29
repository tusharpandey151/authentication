import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    //const user = this.authService.user.getValue();
    this.http
      .put(
        'https://http-test-e9893-default-rtdb.firebaseio.com/recipes.json',
        recipes,
        /* {
          params: new HttpParams().set('auth', user.token)
        } */
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    //return this.authService.user.pipe(take(1), exhaustMap(user => {
    return this.http
      .get<Recipe[]>(
        'https://http-test-e9893-default-rtdb.firebaseio.com/recipes.json',
      ).pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));
  }
}
