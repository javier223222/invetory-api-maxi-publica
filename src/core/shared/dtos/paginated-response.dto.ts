import { PaginationMetaDto } from "./pagination-meta.dto";

export interface PaginationResponseDto<T> {
    
    data: T[] ;
    pagination : PaginationMetaDto;
}

