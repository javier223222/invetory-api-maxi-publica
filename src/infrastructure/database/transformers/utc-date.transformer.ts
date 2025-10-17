import { ValueTransformer } from "typeorm";

export class UtcDateTransformer implements ValueTransformer {
    
    from(value: Date | null): string | null {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return null; 
    }

    
    to(value: string | Date | null): Date | null {
        if (typeof value === 'string' || value instanceof Date) {
            const date = new Date(value);
            
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        return null; 
    }
}