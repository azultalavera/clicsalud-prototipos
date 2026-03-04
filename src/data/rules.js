// src/data/rules.js
export const CALCULATOR_RULES = {
  "GUARDIA": {
    unicos: ["Cardiodesfibrilador", "Electrocardiógrafo", "Oxímetro de pulso"],
    multiples: []
  },
  "QUIRÓFANO": {
    unicos: ["Mesa de Cirugía", "Máquina de Anestesia", "Lámpara Cialítica"],
    porCama: ["Monitor Multiparamétrico"]
  },
  "UNIDAD DE TERAPIA INTENSIVA": {
    unicos: ["Central de Monitoreo", "Carro de Paro"],
    multiples: [
      { item: "Respirador Mecánico", base: 1, min: 1 } // 1 por cada cama
    ],
    porCama: ["Bomba de Infusión", "Monitor Multiparamétrico"]
  }
};