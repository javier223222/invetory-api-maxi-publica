import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string({ message: 'El email es requerido.' })
             .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El formato del email no es válido.'),

    password: z.string({ message: 'La contraseña es requerida.' })
                .min(8, 'La contraseña debe tener al menos 8 caracteres.')
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).'
                )
});
