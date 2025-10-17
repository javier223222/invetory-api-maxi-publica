import { YearRangeDto } from "../../shared/dtos";

export class GetAvailableYearsUseCase {
    async execute(): Promise<YearRangeDto> {
        const currentYear = new Date().getFullYear();
        const minYear = 1990;
        const years: number[] = [];

        for (let year = currentYear; year >= minYear; year--) {
            years.push(year);
        }

        return {
            minYear,
            maxYear: currentYear,
            years
        };
    }
}
