class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3, carnivoro: false }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1, carnivoro: false }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1, carnivoro: true }] }
        ];

        this.animaisInfo = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    biomaAdequado(biomaRecinto, biomasAnimal) {
        // Adaptar para aceitar biomas compostos, como "savana e rio"
        const biomasRecinto = biomaRecinto.split(' e ');
        return biomasRecinto.some(b => biomasAnimal.includes(b));
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animaisInfo[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const infoAnimal = this.animaisInfo[animal];
        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            const espacoOcupado = recinto.animais.reduce((acc, a) => acc + a.quantidade * this.animaisInfo[a.especie].tamanho, 0);
            let espacoExtra = 0;

            // Verifica se há mais de uma espécie para aplicar o espaço extra
            if (recinto.animais.length > 0 && recinto.animais[0].especie !== animal) {
                espacoExtra = 1;  // Adiciona 1 de espaço extra para recintos com mais de uma espécie
            }

            const espacoDisponivel = recinto.tamanho - espacoOcupado - espacoExtra;

            // Verificar se o bioma é adequado (usando a função que trata biomas compostos)
            if (!this.biomaAdequado(recinto.bioma, infoAnimal.biomas)) {
                continue;  // Pula se o bioma não for adequado
            }

            // Regra para carnívoros: só podem habitar com a mesma espécie
            if (infoAnimal.carnivoro && recinto.animais.some(a => a.especie !== animal)) {
                continue;
            }

            // Regra para herbívoros: não podem ficar com carnívoros
            if (!infoAnimal.carnivoro && recinto.animais.some(a => this.animaisInfo[a.especie].carnivoro)) {
                continue;
            }

            // Regra para hipopótamos: precisam de bioma "savana e rio"
            if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
                continue;
            }

            // Regra para macacos: não podem ficar sozinhos em recintos vazios
            if (animal === 'MACACO' && recinto.animais.length === 0 && quantidade < 2) {
                continue;
            }

            // Se o espaço disponível for suficiente, adiciona à lista de recintos viáveis
            if (espacoDisponivel >= quantidade * infoAnimal.tamanho) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel - quantidade * infoAnimal.tamanho} total: ${recinto.tamanho})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo};
