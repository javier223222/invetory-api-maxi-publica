import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Marca, Modelo } from "../../core/entities";

const marcasData = [
    { nombre: "Toyota" },
    { nombre: "Honda" },
    { nombre: "Ford" },
    { nombre: "Chevrolet" },
    { nombre: "Nissan" },
    { nombre: "Volkswagen" },
    { nombre: "BMW" },
    { nombre: "Mercedes-Benz" },
    { nombre: "Audi" },
    { nombre: "Mazda" }
];

const modelosData: { [key: string]: string[] } = {
    "Toyota": ["Corolla", "Camry", "RAV4", "Hilux", "Yaris"],
    "Honda": ["Civic", "Accord", "CR-V", "Fit", "Pilot"],
    "Ford": ["F-150", "Mustang", "Explorer", "Focus", "Escape"],
    "Chevrolet": ["Silverado", "Malibu", "Equinox", "Tahoe", "Camaro"],
    "Nissan": ["Sentra", "Altima", "Rogue", "Versa", "Frontier"],
    "Volkswagen": ["Jetta", "Golf", "Tiguan", "Passat", "Atlas"],
    "BMW": ["Serie 3", "Serie 5", "X3", "X5", "Serie 1"],
    "Mercedes-Benz": ["Clase C", "Clase E", "GLE", "GLA", "Clase A"],
    "Audi": ["A3", "A4", "Q5", "Q7", "A6"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5"]
};

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log("Database connection established");

        const marcaRepository = AppDataSource.getRepository(Marca);
        const modeloRepository = AppDataSource.getRepository(Modelo);

        await modeloRepository.delete({});
        await marcaRepository.delete({});
        console.log("Existing data cleared");

        for (const marcaData of marcasData) {
            const marca = marcaRepository.create(marcaData);
            const savedMarca = await marcaRepository.save(marca);
            console.log(`Marca created: ${savedMarca.nombre}`);

            const modelosForMarca = modelosData[marcaData.nombre] || [];
            for (const modeloName of modelosForMarca) {
                const modelo = modeloRepository.create({
                    nombre: modeloName,
                    marcaId: savedMarca.id
                });
                await modeloRepository.save(modelo);
                console.log(`  - Modelo created: ${modeloName}`);
            }
        }

        console.log("Seed completed successfully");
        await AppDataSource.destroy();
    } catch (error) {
        console.error("Error during seed:", error);
        process.exit(1);
    }
}

seed();
