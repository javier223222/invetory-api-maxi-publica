import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../../../config';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventory API - Sistema de Gestión de Autos',
            version: '1.0.0',
            description: 'API REST para la gestión de inventario de autos con autenticación JWT',
            contact: {
                name: 'API Support',
                email: 'upconectionupconection@gmail.com'
            },
            
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
                description: 'Servidor de Desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingrese el token JWT obtenido del endpoint /api/usuarios/login'
                }
            },
            schemas: {
                Car: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID único del auto',
                            example: '507f1f77bcf86cd799439011'
                        },
                        marca: {
                            type: 'string',
                            description: 'Marca del auto',
                            example: 'Toyota'
                        },
                        modelo: {
                            type: 'string',
                            description: 'Modelo del auto',
                            example: 'Corolla'
                        },
                        año: {
                            type: 'number',
                            description: 'Año del auto',
                            example: 2023
                        },
                        precio: {
                            type: 'number',
                            description: 'Precio del auto',
                            example: 25000
                        },
                        kilometraje: {
                            type: 'number',
                            description: 'Kilometraje del auto',
                            example: 15000
                        },
                        color: {
                            type: 'string',
                            description: 'Color del auto',
                            example: 'Rojo'
                        },
                        email: {
                            type: 'string',
                            description: 'Email de contacto',
                            example: 'vendedor@example.com'
                        },
                        telefono: {
                            type: 'string',
                            description: 'Teléfono de contacto',
                            example: '9611879041'
                        },
                        fotografia: {
                            type: 'string',
                            description: 'URL de la fotografía',
                            example: 'http://localhost:3000/uploads/cars/photo.jpg'
                        },
                        fechaDeAlta: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de registro'
                        },
                        fechaDeModificacion: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de última modificación'
                        },
                        fechaDeEliminacion: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de eliminación del registro'
                        }


                    }
                },
                CarResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number',
                            example: 201
                        },
                        message: {
                            type: 'string',
                            example: 'Carro creado exitosamente.'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    example: '68f257d988886068bcd7d6ad'
                                },
                                marca: {
                                    type: 'string',
                                    example: 'Toyota'
                                },
                                modelo: {
                                    type: 'string',
                                    example: 'Corolla'
                                },
                                año: {
                                    type: 'number',
                                    example: 2023
                                },
                                precio: {
                                    type: 'number',
                                    example: 25000
                                },
                                kilometraje: {
                                    type: 'number',
                                    example: 15000
                                },
                                color: {
                                    type: 'string',
                                    nullable: true,
                                    example: 'Rojo'
                                },
                                email: {
                                    type: 'string',
                                    example: 'vendedor@example.com'
                                },
                                telefono: {
                                    type: 'string',
                                    example: '9611879041'
                                },
                                fotografia: {
                                    type: 'string',
                                    nullable: true,
                                    example: 'http://localhost:3000/uploads/cars/car-1760712664951-124583902.jpeg'
                                },
                                fechaDeAlta: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2025-10-17T14:51:05.032Z'
                                },
                                fechaDeModificacion: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2025-10-17T14:51:05.032Z'
                                },
                                fechaDeEliminacion: {
                                    type: 'string',
                                    format: 'date-time',
                                    nullable: true,
                                    example: null
                                }
                            }
                        }
                    }
                },
                CarResponseUpdate: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number',
                            example: 200
                        },
                        message: {
                            type: 'string',
                            example: 'Carro actualizado exitosamente.'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    example: '68f257d988886068bcd7d6ad'
                                },
                                marca: {
                                    type: 'string',
                                    example: 'Toyota'
                                },
                                modelo: {
                                    type: 'string',
                                    example: 'Corolla'
                                },
                                año: {
                                    type: 'number',
                                    example: 2023
                                },
                                precio: {
                                    type: 'number',
                                    example: 25000
                                },
                                kilometraje: {
                                    type: 'number',
                                    example: 15000
                                },
                                color: {
                                    type: 'string',
                                    nullable: true,
                                    example: 'Rojo'
                                },
                                email: {
                                    type: 'string',
                                    example: 'vendedor@example.com'
                                },
                                telefono: {
                                    type: 'string',
                                    example: '9611879041'
                                },
                                fotografia: {
                                    type: 'string',
                                    nullable: true,
                                    example: 'http://localhost:3000/uploads/cars/car-1760712664951-124583902.jpeg'
                                },
                                fechaDeAlta: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2025-10-17T14:51:05.032Z'
                                },
                                fechaDeModificacion: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2025-10-17T14:51:05.032Z'
                                },
                                fechaDeEliminacion: {
                                    type: 'string',
                                    format: 'date-time',
                                    nullable: true,
                                    example: null
                                }
                            }
                        }
                    }
                },
                Marca: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        nombre: {
                            type: 'string',
                            example: 'Toyota'
                        },
                        fechaDeAlta: {
                            type: 'string',
                            format: 'date-time'
                        },
                        fechaDeModificacion: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Modelo: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439021'
                        },
                        nombre: {
                            type: 'string',
                            example: 'Corolla'
                        },
                        marcaId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        fechaDeAlta: {
                            type: 'string',
                            format: 'date-time'
                        },
                        fechaDeModificacion: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439031'
                        },
                        email: {
                            type: 'string',
                            example: 'user@example.com'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                YearRange: {
                    type: 'object',
                    properties: {
                        minYear: {
                            type: 'number',
                            example: 1990
                        },
                        maxYear: {
                            type: 'number',
                            example: 2025
                        },
                        years: {
                            type: 'array',
                            items: {
                                type: 'number'
                            },
                            example: [2025, 2024, 2023]
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number',
                            example: 200
                        },
                        message: {
                            type: 'string',
                            example: 'Operation successful'
                        },
                        data: {
                            type: 'object'
                        }
                    }
                },
                
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number',
                            example: 400
                        },
                        name: {
                            type: 'string',
                            example: 'Bad Request'
                        },
                        message: {
                            type: 'string',
                            example: 'The request is invalid'
                        },
                        customMessage: {
                            type: 'string',
                            example: 'La solicitud es inválida'
                        }
                    }
                },
                ErrorServer: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number',
                            example: 500
                        },
                        name: {
                            type: 'string',
                            example: 'Internal Server Error'
                        },
                        message: {
                            type: 'string',
                            example: 'The server encountered an error'
                        },
                        customMessage: {
                            type: 'string',
                            example: 'La solicitud no se pudo completar debido a un error interno'
                        }
                    }
                },
                ErrorResponseUnauthorized: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number',
                            example: 401
                        },
                        name: {
                            type: 'string',
                            example: 'Unauthorized'
                        },
                        message: {
                            type: 'string',
                            example: 'Unauthorized access'
                        },
                        customMessage: {
                            type: 'string',
                            example: 'Acceso no autorizado'
                        }
                    }
                },
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        items: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Car'
                            }
                        },
                        page: {
                            type: 'number',
                            example: 1
                        },
                        limit: {
                            type: 'number',
                            example: 10
                        },
                        total: {
                            type: 'number',
                            example: 8
                        },
                        totalPages: {
                            type: 'number',
                            example: 1
                        },
                        hasNext: {
                            type: 'boolean',
                            example: false
                        },
                        hasPrev: {
                            type: 'boolean',
                            example: false
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Health',
                description: 'Endpoints de verificación de salud del servidor'
            },
            {
                name: 'Authentication',
                description: 'Endpoints de autenticación y gestión de usuarios'
            },
            {
                name: 'Cars',
                description: 'Gestión de autos en el inventario'
            },
            {
                name: 'Brands',
                description: 'Catálogo de marcas de autos'
            },
            {
                name: 'Models',
                description: 'Catálogo de modelos de autos'
            },
            {
                name: 'Years',
                description: 'Catálogo de años disponibles'
            }
        ]
    },
    apis: ['./src/api/routes/*.ts', './src/api/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
