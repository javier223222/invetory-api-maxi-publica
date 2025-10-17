import {z} from 'zod';

export const carFilterSchema = z.object({
    page:z.coerce.number({
        error: 'La página es requerida.'
    }).min(1),
    limit:z.coerce.number({
        error: 'El límite es requerido.'
    }).min(1),
    marca: z.string()
             .min(2, 'La marca debe tener al menos 2 caracteres.').optional(),

    modelo: z.string()
              .min(2, 'El modelo debe tener al menos 2 caracteres.').optional(),

    anio: z.coerce.number()
           .positive('El año debe ser un valor positivo.')
           .min(1900, 'El año debe ser mayor a 1900.').optional(),

    
    color:z.string(
        
    ).optional(),
    precioMin:z.coerce.number().positive("El precio mínimo debe ser un número positivo.").optional(),
    precioMax:z.coerce.number().positive("El precio máximo debe ser un número positivo.").optional()

});