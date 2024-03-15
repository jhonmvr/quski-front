# Metronic Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


##CREACION DE NUEVOS CAMBIOS
Descargar la ultima version de master 
```
 git checkout master
 git -c http.sslVerify=false pull 
```

Crear un branch local
```
 git checkout -b BRANCH_NAME
 Ejemplo:
 git checkout -b lt/sprint-20/descripcion-cambio 
```

Terminado los cambios hacer commit y psh crear un Merge request, mismo que debe ser validado por lider tecnico
```
 git -c http.sslVerify=false push
 Solo la primera vez para generar la realcion con reposotorio remoto
 git -c http.sslVerify=false  push --set-upstream origin lt/merge-master/documentacion
 ```
Este comando genera un link, como el siguente ejemplo:
```
git -c http.sslVerify=false   push --set-upstream origin lt/merge-master/documentacion
Total 0 (delta 0), reused 0 (delta 0)
remote:
remote: To create a merge request for lt/merge-master/documentacion, visit:
remote:   https://service.relative-engine.com:8943/quski/quski-oro-core/-/merge_requests/new?merge_request%5Bsource_branch%5D=lt%2Fmerge-master%2Fdocumentacion
remote:
To https://service.relative-engine.com:8943/quski/quski-oro-core.git
 * [new branch]        lt/merge-master/documentacion -> lt/merge-master/documentacion
Branch 'lt/merge-master/documentacion' set up to track remote branch 'lt/merge-master/documentacion' from 'origin'.

```
 Al hacer click en el link abrira gitlab para que creen el Merge request
 

La branch master esta protegida solo pueden hacer commit en esa branch lider tecnico