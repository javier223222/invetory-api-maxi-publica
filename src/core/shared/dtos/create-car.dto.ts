export interface CreateCarDto {
    marca: string;
    modelo: string;
    año: number;
    precio: number;
    kilometraje: number;
    email: string;
    telefono: string;
    color?: string;
    fotografia?: string; 
}