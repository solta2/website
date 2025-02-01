<template>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Address</th>
                    <th scope="col">Cover</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Simbolo</th>
                    <th scope="col">Decimales</th>
                    <th scope="col">supply</th>
                    <th scope="col">score</th>
                    <th scope="col">freezeAuthority</th>
                    <th scope="col">T. Market Liquidity</th>
                    <th scope="col">verification</th>
                    <th scope="col">Links</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(trend, it) in items" v-bind:key="'trending_' + it" :class="bgColor(trend.score)">
                    <th scope="row">{{$root.recortarCadena(trend.mint)}}</th>
                    <td><img v-if="trend.fileMeta !=null" :src="trend.fileMeta.image" class="img-fluid"></td>
                    <td>{{convertTime(trend.detectedAt)}}</td>
                    <td>{{trend.tokenMeta.name}}</td>
                    <td>{{trend.tokenMeta.symbol}}</td>
                    <td>{{trend.token.decimals}}</td>
                    <td>{{realValue(trend.token.supply, trend.token.decimals)}}</td>
                    <td>{{trend.score}}</td>
                    <td>{{trend.token.freezeAuthority}}</td>
                    <td>{{trend.totalMarketLiquidity}}</td>
                    <td>
                        <template v-if="trend.verification != null">
                            <a target="_blank" :href="link.value" class="btn btn-info" v-for="(link, il) in trend.verification.links" v-bind:key="'trending_' + it + '_link_'+il">
                                {{link.provider}}
                            </a>&nbsp;
                        </template>
                    </td>
                    <td>
                        <a target="_blank" :href="'https://gmgn.ai/sol/token/' + trend.mint" class="btn btn-success">
                            gmgn
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- {{records}} -->
    </div>
</template>

<script>
export default {
    props: [
        'records'
    ],
    computed: {
        items() {
            return this.records;
        },
    },
    methods: {
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
            if (segundos % 60 > 0 && partes.length === 0) {
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
            if (score <= 100) return "table-success";
            else if (score > 400) return "table-danger";
            else return "table-warning";
        },
        realValue(value, decimals) {
            return value / (10 ** decimals);
        }
    }
}
// 0 - 100 Verde

// > 400 Rojo
</script>