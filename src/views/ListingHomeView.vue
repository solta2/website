<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <HelloWorld msg="Bienvenido a snifferMeme"/>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">Total de registros ({{ records.length }})</div>
          <div class="card-body">
            <TableGeneral :records="records" />
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  data() {
    return {
      records: [],
      last_query_rugcheck: 0, // Timestamp del último proceso
      buffer: [],  // Arreglo con los items que se procesarán
      bufferResult: {},
      currentIndex: 0,  // Para llevar un seguimiento del índice del item actual

      lists: {
        trending: [],
        recent: [],
        verified: [],
        new_tokens: [],
        pump: [],
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
          record.score = 'pendiente';
          this.addToBuffer(record.mint);
        }
        return record;
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
  components: {
    HelloWorld
  },
  methods: {
    async loadItems() {
      let self = this
        // https://api.rugcheck.xyz/v1/stats/trending?limit=5
        // https://api.rugcheck.xyz/v1/stats/recent?limit=5
        // https://api.rugcheck.xyz/v1/stats/verified?limit=5
        // https://api.rugcheck.xyz/v1/stats/new_tokens?limit=5
        // https://api.degencdn.com/v1/nfts/3tbrhUy6jdoSH6bf5Uy4LZqTwVeffoqL19EmcoKKpump
        
        console.log('loadItems')

        await fetch('https://api.rugcheck.xyz/v1/stats/trending?limit=25')
        .then(resp => resp.json())
        .then(resp => {
            console.log('trending', resp)
            self.lists.trending = resp;
            resp.forEach(element => {
              self.records.push({
                provider: 'rugcheck',
                origen: 'trending',
                mint: element.mint,
              })
            });
        }).catch(e => console.log('error cargando trending', e))

        await fetch('https://api.rugcheck.xyz/v1/stats/new_tokens?limit=25')
        .then(resp => resp.json())
        .then(resp => {
            console.log('new_tokens', resp)
            self.lists.new_tokens = resp;
            resp.forEach(element => {
              self.records.push({
                provider: 'rugcheck',
                origen: 'new_tokens',
                mint: element.mint
              })
            });
        }).catch(e => console.log('error cargando new_tokens', e))

        await fetch('https://api.rugcheck.xyz/v1/stats/recent?limit=25')
        .then(resp => resp.json())
        .then(resp => {
            console.log('recent', resp)
            self.lists.recent = resp;
            resp.forEach(element => {
              self.records.push({
                provider: 'rugcheck',
                origen: 'recent',
                mint: element.mint
              })
            });
        }).catch(e => console.log('error cargando recent', e))

        await fetch('https://api.rugcheck.xyz/v1/stats/verified?limit=25')
        .then(resp => resp.json())
        .then(resp => {
            console.log('verified', resp)
            self.lists.verified = resp;
            resp.forEach(element => {
              self.records.push({
                provider: 'rugcheck',
                origen: 'verified',
                mint: element.mint
              })
            });
        }).catch(e => console.log('error cargando verified', e))

        await fetch('https://smtm.sombrerochain.org/api/pump-coins-for-you.php')
        .then(resp => resp.json())
        .then(resp => {
            console.log('pump-coins-for-you', resp)
            self.lists.pump = resp;
            resp.forEach(element => {
              self.records.push({
                provider: 'pump coins',
                origen: 'for-you',
                mint: element.mint,
              })
            });
        }).catch(e => console.log('error cargando trending', e))
        // this.runScore()
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
        if (timeDifference >= 15000) {
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
        }).catch(e => console.log('error cargando token report', e), scorePush = "error")
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
        return this.itemActive(mint) ? (this.bufferResult[mint].error == undefined ? (this.bufferResult[mint][key] == null ? ' Ninguno ' : this.bufferResult[mint][key]) : "error") : "loading"; // Guardar el resultado en bufferResult
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
        }, 15000); // Procesar cada 20 segundos
    },
    itemActive(mint) {
      return this.bufferResult[mint] != undefined;
    }
  },
  mounted() {
      // Iniciar el proceso de monitoreo para procesar cada 20 segundos
      this.loadItems()
      // this.runScore()
  },
  beforeUnmount() {
      // Limpiar el intervalo cuando el componente se destruya
      clearInterval(this.processInterval);
  },
}
</script>
