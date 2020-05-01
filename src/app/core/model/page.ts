export class Page {
    //The number of elements in the page
    public size: number = 1;
    public pageSize: number = 1;
    //The total number of elements
	public totalElements: number = 1;
	public totalResults: number = 1;
    //The total number of pages
	public totalPages: number = 1;
    //The current page number
	public pageNumber: number = 1;
    public currentPage: number = 1;

	public start: number = 0;
    
	public end: number = 1;

	public isPaginated: string = "Y";

	public sortFields: string = "";

	public sortDirections: string = "";


    public calculatePage( ptotalResults, ppageNumber, paggerSize){
        
        if(ptotalResults == 0   ){
            this.size=paggerSize;
        } else if( ptotalResults > 0 && ((Number(ppageNumber)+1) * this.size ) < ptotalResults ){
            this.size=paggerSize;
        } else {
            this.size= ptotalResults-(Number(ppageNumber) ) * this.size;
        }
    }
	
}