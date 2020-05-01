import {Page} from "./page";

export class PaginatedList<T> extends Page{
    list = new Array<T>();
    
    /*setPageData( page:Page ){
    	this._size= page.size;
    	this._pageSize= page.size;
		this._totalElements= page.totalElements;
		this._totalResults= page.totalElements;
		this._totalPages= page.totalPages;
		this._pageNumber= page.pageNumber;
		this._currentPage= page.pageNumber;
		this._start= page.start;
		this._end= page.end;
		this._isPaginated=page.isPaginated;
    }
    
    setPageDataParam( currentPage,pageNumber,pageSize,size,totalResults,totalElements,totalPages,start,end,isPaginated ){
    	this._size= size;
    	this._pageSize= pageSize;
		this._totalElements= totalElements;
		this._totalResults= totalElements;
		this._totalPages= totalResults;
		this._pageNumber= pageNumber;
		this._currentPage= currentPage;
		this._start= start;
		this._end= end;
		this._isPaginated=isPaginated;
    }*/
    
    
    
}