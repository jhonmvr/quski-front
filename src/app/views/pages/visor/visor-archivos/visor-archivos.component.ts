import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-visor-archivos',
  templateUrl: './visor-archivos.component.html',
  styleUrls: ['./visor-archivos.component.scss']
})
export class VisorArchivosComponent implements OnInit {

  verDocumento :boolean;
  archivo = 'https://www.redalyc.org/pdf/1341/134116845005.pdf' ;
  trustedUrl 
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer) { 
    
      

  }

  ngOnInit() {
    this.route.paramMap.subscribe((json: any) => {
      //this.archivo = json.params.item;
      let archivo = localStorage.getItem('miarchivo');
      console.log(archivo)
      let obj=JSON.parse( atob(archivo) );
        //console.log("entra a retorno json " + JSON.stringify( obj ));
        const byteCharacters = atob(obj.fileBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        let blob = new Blob([byteArray],{type:"application/pdf"});
     
        console.log('blob', obj);
       
        var url = window.URL.createObjectURL(blob); 
      
        let anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank"
        anchor.click();
        this.trustedUrl =   this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
    
   
  }

}
