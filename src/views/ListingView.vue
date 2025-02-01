<template>
    <div class="listing">
        <div class="row">
            <div class="col-md-9 mb-3">
                <CardsToken :records="tokens" />
            </div>
            
            <div class="col-md-3">
                <div class="card border-success mb-3">
                    <div class="card-header bg-transparent border-success">Cuentas conocidas</div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">First</th>
                                    <th scope="col">Last</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(known_account, ka) in known_accounts" v-bind:key="'known_account_' + ka">
                                    <th scope="row">{{$root.recortarCadena(ka)}}</th>
                                    <td>{{known_account.name}}</td>
                                    <td>{{known_account.type}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- <div class="card border-success mb-3">
                    <div class="card-header bg-transparent border-success">Conectar Solana Wallet</div>
                    <div class="card-body text-success">
                        <h5 class="card-title">Conectar Wallet</h5>
                        <button @click="connectWallet" class="btn btn-success">Conectar</button>
                        <p v-if="walletAddress">Dirección de la cuenta: {{ walletAddress }}</p>
                    </div>
                </div> -->
            </div>
            <div class="col-md-6">
            </div>
            <div class="col-md-6">
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
// eslint-disable-next-line
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
// eslint-disable-next-line
import { TOKEN_PROGRAM_ID, AccountLayout, Token } from '@solana/spl-token';

export default {
    data() {
        return {
            rugcheck: [],
            tokens: [],
            known_accounts: [],
            trending: [],
            recent: [],
            verified: [],
            new_tokens: [],
            walletAddress: null,  // Dirección de la wallet
        };
    },
    mounted() {
        this.loadLists()
    },
    methods: {
        // https://api.rugcheck.xyz/v1/stats/trending?limit=5
        // https://api.rugcheck.xyz/v1/stats/recent?limit=5
        // https://api.rugcheck.xyz/v1/stats/verified?limit=5
        // https://api.rugcheck.xyz/v1/stats/new_tokens?limit=5
        // https://api.degencdn.com/v1/nfts/3tbrhUy6jdoSH6bf5Uy4LZqTwVeffoqL19EmcoKKpump
        async getTokensBase(url, params=null) {
            if (params == null) params = {}
            return await axios.get(url, {
                params: params
            })
            .then(async r => {
                // console.log('r', r.data)
                return r.data;
            }).catch(e => {
                console.log(e)
                return []
            })
        },
        // https://data.fluxbeam.xyz/tokens/EFFECT1A1R3Dz8Hg4q5SXKjkiPc6KDRUWQ7Czjvy4H7E/price
        async loadLists() {
            let self = this

            await axios.get('https://api.rugcheck.xyz/public/known_accounts.json', {
            })
            .then(async r => {
                console.log('r', r.data)
                self.known_accounts = r.data
            }).catch(e => console.log(e))

            // const listing = await this.getTokensBase('/pump/coins/for-you', {
            const listing = await this.getTokensBase('https://smtm.sombrerochain.org/api/pump-coins-for-you.php', {
                offset: 0,
                limit: 50,
                includeNsfw: false,
            })
            console.log('listing', listing)
            this.tokens = listing;

            // listing.forEach(item => {
            //     console.log('item', item)
            // })
        },
        delay(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        },
        async getTokenInfo(mintAddress) {
            // return axios.get('https://api.degencdn.com/v1/nfts/'+mintAddress)
            return axios.get('https://api.rugcheck.xyz/v1/tokens/'+mintAddress+'/report')
            .then(r => {
                return r.data;
            })
            .catch(e => {
                console.log('error getTokenInfo', e)
                return null;
            })
        },

        async getTokenInfo2(connection, mintAddress) {
            const mintPublicKey = new PublicKey(mintAddress);

            // Obtenemos la información del token
            const tokenAccountInfo = await connection.getAccountInfo(mintPublicKey);
            if (tokenAccountInfo === null) {
                throw new Error('Token no encontrado');
            }

            // Decodificamos los datos de la cuenta
            const data = tokenAccountInfo.data;
            const decimals = data[0];  // Los decimales están en el primer byte
            const supply = data.readUIntLE(0, 8); // Se lee el suministro total del token (en este caso simplificado, puede variar dependiendo de cómo se define)

            // Retorna la información básica del token
            return {
                decimals,
                supply,
            };
        },

        async connectWallet() {
            if (window.solana) {
                try {
                    const resp = await window.solana.connect();
                    this.walletAddress = resp.publicKey.toString();
                    console.log("Conectado a Solana con la dirección:", this.walletAddress);
                } catch (error) {
                    console.error("Error al conectar la wallet:", error);
                }
            } else {
                alert("Por favor, instala Phantom o una wallet compatible de Solana.");
            }
        }
    }
}
</script>
