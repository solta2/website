<template>
    <div class="row row-cols-1 row-cols-md-5 g4">
        <div class="col-md-12">
            <button class="btn btn-md btn-warning" @click="runScore">runScore</button>
            <hr>
        </div>
        <div v-for="(record, it) in items" :key="'records_' + it" :class="'col '">
            <div :class="'card h-100- mb-3 ' + bgColor(record.score)" >
                <img v-if="record.image_uri != null" :src="record.image_uri" class="card-img-top">
                <div class="card-body">
                    <h2 class="card-title">{{ record.symbol }}</h2>
                    <h5 class="card-subtitle">{{ record.name }}</h5>
                    <h3 class="card-subtitle">{{ $root.recortarCadena(record.mint) }}</h3>
                    <p class="card-text">Score: {{ record.score }}</p>
                    <p class="card-text">Total Supply: {{ formatNumber(realValue(record.total_supply, 6)) }}</p>
                    <p class="card-text">Market Cap: {{ formatNumber(record.market_cap) }}</p>
                    <p class="card-text">Market Cap USD: {{ formatNumber(record.usd_market_cap) }}</p>
                    <p class="card-text">{{ record.description }}</p>
                    <a v-if="record.twitter" target="_blank" :href="record.twitter" class="btn btn-dark me-1">X</a>
                    <a v-if="record.website" target="_blank" :href="record.website" class="btn btn-primary me-1">Website</a>
                    <a v-if="record.telegram" target="_blank" :href="record.telegram" class="btn btn-info me-1">Telegram</a>
                </div>
                <div class="card-footer">
                    <a target="_blank" :href="'https://gmgn.ai/sol/token/' + record.mint" class="btn btn-success">
                        gmgn
                    </a>
                </div>
                <div class="card-footer">
                    <small class="text-body-secondary">
                        {{ convertTime(record.created_timestamp) }} <br />
                        {{ convertTime2(record.created_timestamp) }}
                    </small>
                </div>
            </div>
        </div>
        buffer: {{ buffer }} <br />
        bufferResult: {{ bufferResult }} <br />
        currentIndex: {{ currentIndex }} <br />
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props: ['records'],
    data() {
        return {
            last_query_rugcheck: 0, // Timestamp del último proceso
            buffer: [],  // Arreglo con los items que se procesarán
            bufferResult: {},
            currentIndex: 0,  // Para llevar un seguimiento del índice del item actual
        };
    },
    watch: {
        // Watch para controlar el arreglo buffer
        buffer(newBuffer, oldBuffer) {
            console.log('buffer changed:', newBuffer, oldBuffer);
            // Iniciar el procesamiento si el buffer cambia
            this.processNextItem();
        },
    },
    computed: {
        // Computed para obtener los items
        items() {
            return this.records.map(record => {
                if (this.bufferResult[record.mint] != undefined && this.bufferResult[record.mint] != null) {
                    record.score = this.bufferResult[record.mint];
                } else {
                    record.score = 'pendiente';
                    this.addToBuffer(record.mint);
                }
                return record;
            });
        },
    },
    methods: {
        // Método para agregar a buffer sin repetir
        addToBuffer(mint) {
            if (!this.buffer.includes(mint)) {
                this.buffer.push(mint);
            }
        },
        // Procesar el siguiente ítem en el buffer
        processNextItem() {
            console.log('processNextItem')
            const now = Date.now();
            const timeDifference = now - this.last_query_rugcheck;
            console.log('timeDifference', timeDifference)
            console.log('currentIndex', this.currentIndex)
            console.log('buffer.length', this.buffer.length)
            console.log('condition', this.currentIndex < this.buffer.length)

            // Solo procesar un ítem si han pasado más de 20 segundos
            if (timeDifference >= 20000) {
                if (this.currentIndex < this.buffer.length) {
                    const mint = this.buffer[this.currentIndex];
                    console.log('Processing item:', mint);
                    this.processItem(mint);

                    // delete this.buffer.splice(this.currentIndex, 1)
                    this.buffer.shift()
                    // Actualizar el índice del item que se está procesando
                    // this.currentIndex++;
                    // Actualizar el timestamp del último proceso
                    this.last_query_rugcheck = now;
                } else {
                    console.log('No more items to process.');
                    clearInterval(this.processInterval);
                }
            }
        },
        // Método para procesar un ítem
        async processItem(mint) {
            // Aquí puedes agregar la lógica que desees para procesar el ítem
            console.log('Processing item with mint:', mint);

            let scorePush = "no identificado"
            
            return axios.get(`https://api.rugcheck.xyz/v1/tokens/${mint}/report`, {})
            .then(async r => {
                console.log('r', r.data)
                scorePush = r.data.score ?? "NO encontrado";
            }).catch(e => {
                console.log(e)
                scorePush = "error"
            }).finally(()=> {
                console.log('scorePush', scorePush)
                // Simulamos el proceso con un retraso
                setTimeout(() => {
                    this.bufferResult[mint] = scorePush;  // Simulamos que se procesó
                    console.log('Processed item:', mint);
                }, 1000); // Tiempo de procesamiento simulado
            })

        },
        loadScore(record) {
            console.log('loadScore', record);
            this.bufferResult[record.mint] = record.score; // Guardar el resultado en bufferResult
        },
        formatNumber(number) {
            const suffixes = ['K', 'M', 'B', 'T'];
            let index = -1;
            while (number >= 1000) {
                number /= 1000;
                index++;
            }
            return number.toFixed(2) + (index >= 0 ? suffixes[index] : '');
        },
        convertTime(utcDate) {
            let fecha = new Date(utcDate);
            let ahora = new Date();
            let diferencia = ahora - fecha;
            let segundos = Math.floor(diferencia / 1000);
            let minutos = Math.floor(segundos / 60);
            let horas = Math.floor(minutos / 60);
            let dias = Math.floor(horas / 24);
            let partes = ['hace '];
            if (dias > 0) partes.push(`${dias} día${dias > 1 ? 's' : ''}`);
            if (horas % 24 > 0) partes.push(`${horas % 24} hora${horas % 24 > 1 ? 's' : ''}`);
            if (minutos % 60 > 0) partes.push(`${minutos % 60} minuto${minutos % 60 > 1 ? 's' : ''}`);
            if (segundos % 60 >= 0 && partes.length === 0) partes.push('menos de un minuto');
            return partes.join(', ');
        },
        convertTime2(utcDate) {
            let date = new Date(utcDate);
            let options = {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            };
            let formatter = new Intl.DateTimeFormat('es-CO', options);
            return formatter.format(date);
        },
        bgColor(score) {
            if (score == 'pendiente') return "text-bg-dark";
            else if (score <= 100) return "text-bg-success";
            else if (score > 400) return "text-bg-danger";
            else return "text-bg-warning";
        },
        realValue(value, decimals) {
            return value / (10 ** decimals);
        },
        runScore() {
            
            this.processInterval = setInterval(() => {
                this.processNextItem();
            }, 2000); // Procesar cada 20 segundos
        }
    },
    mounted() {
        // Iniciar el proceso de monitoreo para procesar cada 20 segundos
        this.runScore()
    },
    beforeUnmount() {
        // Limpiar el intervalo cuando el componente se destruya
        clearInterval(this.processInterval);
    },
};
</script>
