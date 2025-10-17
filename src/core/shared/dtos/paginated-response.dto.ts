

export interface PaginationResponseDto<T> {
    
    items: T[] ;
    page: number ;
    limit: number ;
    total: number ;
    totalPages: number ;
    hasNext: boolean ;
    hasPrev: boolean ;
}

