<template>
    <div class="row row-cols-1 row-cols-md-5 g4">
        <div class="" v-for="(record, it) in items" v-bind:key="'records_' + it" :class="'col '">
            <div :class="'card h-100- mb-3 ' + bgColor(record.score)" >
                <img v-if="record.fileMeta != null" :src="record.fileMeta.image" class="card-img-top">
                <div class="card-body">
                    <h2 class="card-title">{{record.tokenMeta.symbol}}</h2>
                    <h5 class="card-subtitle">{{record.tokenMeta.name}}</h5>
                    <h3 class="card-subtitle">{{$root.recortarCadena(record.mint)}}</h3>
                    <h3 class="card-subtitle"  v-if="record != null">{{record.token.freezeAuthority}}</h3>
                    <p class="card-text">Score: {{record.score}}</p>
                    <p class="card-text">Total Supply: {{formatNumber(realValue(record.token.supply, record.token.decimals))}}</p>
                    <p class="card-text">Total Market Liquidity: {{formatNumber(record.totalMarketLiquidity)}}</p>
                    <!-- <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p> -->
                    
                    <template v-if="record.verification != null">
                        <a target="_blank" :href="link.value" class="btn btn-info me-1" v-for="(link, il) in record.verification.links" v-bind:key="'record_a_' + it + '_link_'+il">
                            {{link.provider}}
                        </a>&nbsp;
                    </template>
                </div>
                <div class="card-footer">
                    <a target="_blank" :href="'https://gmgn.ai/sol/token/' + record.mint" class="btn btn-success">
                        gmgn
                    </a>
                </div>
                <div class="card-footer">
                    <small class="text-body-secondary">
                        {{convertTime(record.detectedAt)}} <br />
                        {{convertTime2(record.detectedAt)}}
                    </small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'records'
    ],
    computed: {
        items() {
            // return this.records;
            return this.records;
        },
    },
    methods: {
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
            // Crear un objeto Date a partir de la fecha UTC
            let fecha = new Date(utcDate);
            let ahora = new Date();

            // Calcular la diferencia en milisegundos
            let diferencia = ahora - fecha;

            // Convertir la diferencia en unidades de tiempo
            let segundos = Math.floor(diferencia / 1000);
            let minutos = Math.floor(segundos / 60);
            let horas = Math.floor(minutos / 60);
            let dias = Math.floor(horas / 24);

            let partes = [];

            partes.push('hace ');

            if (dias > 0) {
                partes.push(`${dias} día${dias > 1 ? 's' : ''}`);
            }
            if (horas % 24 > 0) {
                partes.push(`${horas % 24} hora${horas % 24 > 1 ? 's' : ''}`);
            }
            if (minutos % 60 > 0) {
                partes.push(`${minutos % 60} minuto${minutos % 60 > 1 ? 's' : ''}`);
            }
            if (segundos % 60 >= 0 && partes.length === 0) {
                partes.push(`menos de un minuto`);
            }

            return partes.join(', ');
        },
        convertTime2(utcDate) {
            // Crear un objeto Date a partir de la fecha UTC
            let date = new Date(utcDate);
            // Formatear la fecha para la zona horaria de Bogotá
            let options = { 
            timeZone: 'America/Bogota', 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
            };

            // Usar Intl.DateTimeFormat para formatear la fecha
            let formatter = new Intl.DateTimeFormat('es-CO', options);
            let bogotaTime = formatter.format(date);
            return bogotaTime;
        },
        bgColor(score) {
            if (score <= 100) return "text-bg-success";
            else if (score > 400) return "text-bg-danger";
            else return "text-bg-warning";
        },
        realValue(value, decimals) {
            return value / (10 ** decimals);
        }
    }
}
</script>