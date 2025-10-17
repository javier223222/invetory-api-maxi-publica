import { z } from 'zod';

export const createCarSchema = z.object({
   
    marca: z.string({ error: 'La marca es requerida.' })
             .min(2, 'La marca debe tener al menos 2 caracteres.'),

    modelo: z.string({ error: 'El modelo es requerido.' })
              .min(2, 'El modelo debe tener al menos 2 caracteres.'),

    anio: z.number({ error: 'El año es requerido.' })
           .int()
           .min(1900, 'El año debe ser mayor a 1900.'),

    precio: z.number({ error: 'El precio es requerido.' })
              .positive('El precio debe ser un valor positivo.'),

    kilometraje: z.number({ error: 'El kilometraje es requerido.' })
                   .min(100, 'El kilometraje debe ser mayor a 100.'),

    email: z.string({ error: 'El email es requerido.' })
             .regex(/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/, 'El formato del email no es válido.'),

    telefono: z.string({ error: 'El teléfono es requerido.' })
                .regex(/^\d{2,3}[\s-]?\d{3,4}[\s-]?\d{4}$/, 'El teléfono debe tener el formato 961-187-9041 o 9611879041.'),

    color: z.string().optional(),
});