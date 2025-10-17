export interface CarFilterOptionsDto {
  marca?:string;
  modelo?: string;
  año?: number;

  color?: string;
  precioMin?: number;
  precioMax?: number;
}