<template>
    <div class="table-responsive" style="height:450px">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <!-- <th scope="col">#</th> -->
            <th scope="col">Direccion</th>
            <th scope="col">Provedor</th>
            <th scope="col">Origen</th>
            <th scope="col">Listo</th>
            <th scope="col">Puntaje</th>
            <th scope="col">detectedAt</th>
            <th scope="col">Nombre</th>
            <th scope="col">Nombre2</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Simbolo</th>
            <th scope="col">Simbolo2</th>
            <th scope="col">supply</th>
            <th scope="col">decimals</th>
            <th scope="col">Imagen</th>
            
            <th scope="col">Mutable</th>
            <!-- <th scope="col">verification</th> -->

            <!-- <th scope="col">transferFee</th> -->
            <th scope="col">totalLPProviders</th>
            <th scope="col">totalMarketLiquidity</th>

            <th scope="col">uri</th>
            <th scope="col">updateAuthority</th>
            <th scope="col">tokenProgram</th>
            <th scope="col">mintAuthority</th>
            <th scope="col">freezeAuthority</th>
            <th scope="col">isInitialized</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" v-bind:key="'general-items-'+i" v-bind:id="'general-items-'+item.mint" :class="bgColorTable(item.score)">
            <!-- <th scope="row">{{ i }}</th> -->
            <td>
                <a :href="'#records_' + i">
                    {{ $root.recortarCadena(item.mint) }}
                </a>
            </td>
            <td>{{ item.provider }}</td>
            <td>{{ item.origen }}</td>
            <td>
                <ion-icon name="refresh-outline" v-if="itemActive(item.mint) == false"></ion-icon>
                <ion-icon v-else name="checkmark-outline"></ion-icon>
            </td>
            <td>{{ loadData('score', item.mint) }}</td>

            <td>{{ (loadData('detectedAt', item.mint)) }}</td>
            
            <td>{{ (loadData('tokenMeta', item.mint).name) }}</td>
            <td>{{ (loadData('fileMeta', item.mint).name) }}</td>
            <td>{{ (loadData('fileMeta', item.mint).description) }}</td>
            <td>{{ (loadData('tokenMeta', item.mint).symbol) }}</td>
            <td>{{ (loadData('fileMeta', item.mint).symbol) }}</td>
            <td>{{ (loadData('token', item.mint).supply  / (10 ** loadData('token', item.mint).decimals)) }}</td>
            <td>{{ (loadData('token', item.mint).decimals) }}</td>
            <td>
              <img :src="loadData('fileMeta', item.mint).image" class="img-thumbnail">
            </td>
            
            <td>{{ (loadData('tokenMeta', item.mint).mutable) }}</td>
            <!-- <td>{{ (loadData('verification', item.mint)) }}</td> -->
            
            <!-- <td>{{ (loadData('transferFee', item.mint)) }}</td> -->
            <td>{{ (loadData('totalLPProviders', item.mint)) }}</td>
            <td>{{ (loadData('totalMarketLiquidity', item.mint)) }}</td>

            <td>{{ (loadData('tokenMeta', item.mint).uri) }}</td>
            <td>{{ (loadData('tokenMeta', item.mint).updateAuthority) }}</td>

            <td>{{ loadData('tokenProgram', item.mint) }}</td>
            
            <td>{{ (loadData('token', item.mint).mintAuthority) }}</td>
            <td>{{ (loadData('token', item.mint).freezeAuthority) }}</td>
            <td>{{ (loadData('token', item.mint).isInitialized) }}</td>
            <!-- <td>{{ loadReport(item) }}</td> -->
          </tr>
        </tbody>
      </table>
      
    </div>
    <div class="row row-cols-2 row-cols-md-6 g4 mt-3">
      <div v-for="(item, it) in items" v-bind:key="'records_' + it" v-bind:id="'records_' + it" :class="'col '">
          <div :class="'card h-100- mb-3 ' + bgColor(item.score)">
            <div class="card-header">
                {{ item.provider }} ({{ item.origen }})
            </div>
            <template v-if="itemActive(item.mint) == false">
                <div class="card-body">
                    <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect></svg>
                    <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h5>
                </div>
                <div class="card-footer">
                    <ion-icon name="refresh-outline"></ion-icon>
                </div>
                <div class="card-footer">
                    <small class="text-body-secondary">
                      <!-- {{ convertTime(item.created_timestamp) }} <br />
                      {{ convertTime2(item.created_timestamp) }} -->
                    </small>
                </div>
            </template>
            <template v-else>
                <img :src="loadData('fileMeta', item.mint).image" class="card-img-top">
                <div class="card-body">
                  <h2 class="card-title">{{ loadData('tokenMeta', item.mint).symbol }}</h2>
                  <h5 class="card-subtitle">{{ loadData('tokenMeta', item.mint).name }}</h5>
                  <h3 class="card-subtitle">{{ $root.recortarCadena(item.mint) }}</h3>
                  <p class="card-text">Score: {{ loadData('score', item.mint) }}</p>

                  <p class="card-text">Total Supply: {{ (loadData('token', item.mint).supply  / (10 ** loadData('token', item.mint).decimals)) }}</p>
                  <p class="card-text">Market Cap Liquidity: {{ parseFloat(loadData('totalMarketLiquidity', item.mint)).toFixed(2) }}</p>
                  <p class="card-text">{{ (loadData('fileMeta', item.mint).description) }}</p>
                  <p class="card-text">{{ (loadData('verification', item.mint).verification) }}</p>

                  <p class="card-text">totalLPProviders: {{ (loadData('totalLPProviders', item.mint)) }}</p>
                  <!-- 
                    <a v-if="item.twitter" target="_blank" :href="item.twitter" class="btn btn-dark me-1">X</a>
                  <a v-if="item.twitter" target="_blank" :href="item.twitter" class="btn btn-dark me-1">X</a>
                  <a v-if="item.website" target="_blank" :href="item.website" class="btn btn-primary me-1">Website</a>
                  <a v-if="item.telegram" target="_blank" :href="item.telegram" class="btn btn-info me-1">Telegram</a> -->
              </div>
              <div class="card-footer">
                  <a target="_blank" :href="'https://gmgn.ai/sol/token/' + item.mint" class="btn btn-info me-1">gmgn</a>
                  <a target="_blank" :href="'https://rugcheck.xyz/tokens/' + item.mint" class="btn btn-light me-1">rugcheck</a>
                  <a target="_blank" :href="verify.value" class="btn btn-light me-1 mt-1" v-for="(verify, v) in loadData('verification', item.mint).links" v-bind:key="'records_' + it + '_ver_' + v">{{ verify.provider }}</a>
              </div>
              <div class="card-footer">
                  <small class="text-white">
                    {{ loadData('detectedAt', item.mint) }}
                    <!-- {{ convertTime(loadData('detectedAt', item.mint)) }} {{ convertTime2(loadData('detectedAt', item.mint)) }} -->
                  </small>
              </div>
            </template>
          </div>
      </div>
    </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'HomeView',
  props: ['records'],
  data() {
    return {
    //   records: [],
      last_query_rugcheck: 0, // Timestamp del último proceso
      buffer: [],  // Arreglo con los items que se procesarán
      bufferResult: {},
      currentIndex: 0,  // Para llevar un seguimiento del índice del item actual

      lists: {
        trending: []
      }
    };
  },
  computed: {
    // Computed para obtener los items
    items() {
        return this.records.map(record => {
            if (this.bufferResult[record.mint] != undefined && this.bufferResult[record.mint] != null) {
            record.loading = false;
            record.score = this.bufferResult[record.mint].error ? this.bufferResult[record.mint].error : this.bufferResult[record.mint].score;
            } else {
            record.loading = true;
            record.score = 9999999999999999999999999999999999999999999999;
            this.addToBuffer(record.mint);
            }
            return record;
        }).sort(function (a, b) {
            if (a.score > b.score) {
                return 1;
            }
            if (a.score < b.score) {
                return -1;
            }
            if (typeof(b.score) == 'string') {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
    },
  },
  watch: {
      // Watch para controlar el arreglo buffer
      buffer(newBuffer, oldBuffer) {
          console.log('buffer changed:', newBuffer, oldBuffer);
          // Iniciar el procesamiento si el buffer cambia
          this.processNextItem();
      },
  },
  methods: {
    loadItems() {
      let self = this
        // https://api.rugcheck.xyz/v1/stats/trending?limit=5
        // https://api.rugcheck.xyz/v1/stats/recent?limit=5
        // https://api.rugcheck.xyz/v1/stats/verified?limit=5
        // https://api.rugcheck.xyz/v1/stats/new_tokens?limit=5
        // https://api.degencdn.com/v1/nfts/3tbrhUy6jdoSH6bf5Uy4LZqTwVeffoqL19EmcoKKpump
        
        console.log('loadItems')
        fetch('https://api.rugcheck.xyz/v1/stats/trending?limit=25')
        .then(resp => resp.json())
        .then(resp => {
            console.log('trending', resp)
            self.lists.trending = resp;
            resp.forEach(element => {
              self.records.push({
                mint: element.mint
              })
            });
        }).catch(e => console.log('error cargando trending', e))

        fetch('https://api.rugcheck.xyz/v1/stats/recent?limit=25')
        .then(resp => resp.json())
        .then(resp => {
            console.log('recent', resp)
        }).catch(e => console.log('error cargando recent', e))

        fetch('https://api.rugcheck.xyz/v1/stats/verified?limit=25')
        .then(resp => resp.json())
        .then(resp => {
            console.log('verified', resp)
        }).catch(e => console.log('error cargando verified', e))

        fetch('https://api.rugcheck.xyz/v1/stats/new_tokens?limit=25')
        .then(resp => resp.json())
        .then(resp => {
            console.log('new_tokens', resp)
        }).catch(e => console.log('error cargando new_tokens', e))

        this.runScore()
    },
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
        if (timeDifference >= 6666) {
            if (this.currentIndex < this.buffer.length) {
                const mint = this.buffer[this.currentIndex];
                console.log('Processing item:', mint);
                this.processItem(mint);

                // delete this.buffer.splice(this.currentIndex, 1)
                this.buffer.shift()
                // Actualizar el índice del item que se está procesando
                // this.currentIndex++;
                // Actualizar el timestamp del último proceso
            } else {
                console.log('No more items to process.');
                clearInterval(this.processInterval);
            }
        }
    },
    // Método para procesar un ítem
    async processItem(mint) {
      let self = this
        // Aquí puedes agregar la lógica que desees para procesar el ítem
        console.log('Processing item with mint:', mint);

        let scorePush = "no identificado"
        // console.log('scorePush', scorePush)
        
        return fetch(`https://api.rugcheck.xyz/v1/tokens/${mint}/report`)
        .then(resp => resp.json())
        .then(resp => {
            console.log('token report', resp.score)
            scorePush = resp;
        }).catch(e => console.log('error cargando token report', e), scorePush = 8888888888888888888888888888888888)
        .finally(() => {
          console.log('scorePush', scorePush)
          if (scorePush != undefined && scorePush != null && scorePush != "error") {
            self.bufferResult[mint] = scorePush;
            self.last_query_rugcheck = Date.now();
          }  // Simulamos que se procesó
        })

        
        // return axios.get(`https://api.rugcheck.xyz/v1/tokens/${mint}/report`, {})
        // .then(async r => {
        //     console.log('r', r.data)
        //     scorePush = r.data.score ?? "NO encontrado";
        // }).catch(e => {
        //     console.log(e)
        //     scorePush = "error"
        // }).finally(()=> {
        //     console.log('scorePush', scorePush)
        //     // Simulamos el proceso con un retraso
        //     setTimeout(() => {
        //         this.bufferResult[mint] = scorePush;  // Simulamos que se procesó
        //         console.log('Processed item:', mint);
        //     }, 1000); // Tiempo de procesamiento simulado
        // })

    },
    loadData(key, mint) {
        return this.itemActive(mint) ? (this.bufferResult[mint].error == undefined ? (this.bufferResult[mint][key] == null ? ' Ninguno ' : this.bufferResult[mint][key]) : this.bufferResult[mint].error) : "loading"; // Guardar el resultado en bufferResult
    },
    loadScore(record) {
        return this.itemActive(record.mint) ? this.bufferResult[record.mint].score : -2; // Guardar el resultado en bufferResult
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
        if (typeof(score) == 'string') return "text-bg-dark";
        else if (score == 9999999999999999999999999999999999999999999999) return "text-bg-dark";
        else if (score <= 100) return "text-bg-success";
        else if (score <= 400) return "text-bg-warning";
        else return "text-bg-danger";
    },
    bgColorTable(score) {
        if (typeof(score) == 'string') return "table-dark";
        else if (score == 9999999999999999999999999999999999999999999999) return "table-dark";
        else if (score <= 100) return "table-success";
        else if (score <= 400) return "table-warning";
        else return "table-danger";
    },
    realValue(value, decimals) {
        return value / (10 ** decimals);
    },
    runScore() {
        this.processInterval = setInterval(() => {
            this.processNextItem();
        }, 6666); // Procesar cada 20 segundos
    },
    itemActive(mint) {
      return this.bufferResult[mint] != undefined;
    },
    itemIsError(mint) {
      return this.bufferResult[mint].error != undefined;
    }
  },
  mounted() {
      // Iniciar el proceso de monitoreo para procesar cada 20 segundos
    //   this.loadItems()
      this.runScore()
  },
  beforeUnmount() {
      // Limpiar el intervalo cuando el componente se destruya
      clearInterval(this.processInterval);
  },
}
</script>
