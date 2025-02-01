<template>
    <div class="home">
        <HelloWorld msg="Crear Meme's Token en Solana"/>
        <hr />
        <button class="btn btn-primary" @click="connectWallet">Conectar Wallet</button>
        <template v-if="!createTokenButtonStatus">
            <hr />
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingInput-payer" placeholder="Payer" v-model="form.payer">
                <label for="floatingInput-payer">Payer</label>
            </div>
            
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingInput-mintAuthority" placeholder="mintAuthority" v-model="form.mintAuthority">
                <label for="floatingInput-mintAuthority">mintAuthority</label>
            </div>
            
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingInput-freezeAuthority" placeholder="freezeAuthority" v-model="form.freezeAuthority">
                <label for="floatingInput-freezeAuthority">freezeAuthority</label>
            </div>
            
            <div class="form-floating mb-3">
                <input type="number" min="0" max="100" class="form-control" id="floatingInput-decimals" placeholder="decimals" v-model="form.decimals">
                <label for="floatingInput-decimals">decimals</label>
            </div>
            <div class="alert alert-danger" role="alert" v-if="tokenInfo.error != null">{{ tokenInfo.error }}</div>

            <button class="btn btn-primary" @click="createToken" :disabled="createTokenButtonStatus">Crear Token</button>
        </template>
        <hr />

        <p>minSOL: {{ minSOL / (10 ** 9) }} SOL</p>
        <p>form: {{ form }}</p>
        <p>walletPublicKey: {{ walletPublicKey }}</p>
        <p>walletInfo: {{ walletInfo }}</p>
        <p>tokenInfo: {{ tokenInfo }}</p>
    </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
// eslint-disable-next-line
import { Buffer } from "buffer"; // Importar Buffer

export default {
    name: 'TokensCreateView',
    components: {
        HelloWorld
    },
    data() {
        return {
            form: {
                payer: null,
                mintAuthority: null,
                freezeAuthority: null,
                decimals: 9,
            },
            minSOL: 0.01 * 1e9, // Verificar si el saldo es menor a 0.01 SOL
            createTokenButtonStatus: true,
            connection: null,
            walletPublicKey: null,
            walletInfo: {
                publicKey: null,
            },
            tokenInfo: {
                address: null,
                error: null,
            },
        };
    },
    methods: {
        async connectWallet() {
            if (window.solana && window.solana.isPhantom) {
                try {
                    const response = await window.solana.connect();
                    console.log('response', response)
                    this.walletPublicKey = new PublicKey(response.publicKey.toString());
                    this.walletInfo.publicKey = this.walletPublicKey.toBase58();

                    this.form.payer = this.walletInfo.publicKey
                    this.form.mintAuthority = this.walletInfo.publicKey

                    this.createTokenButtonStatus = false;
                } catch (err) {
                    console.error("Error al conectar la billetera:", err);
                }
            } else {
                alert("¡Phantom Wallet no está instalado!");
            }
        },
        async createToken() {
            if (!this.walletPublicKey) {
                alert("Primero conecta tu billetera.");
                return;
            }

            try {
                const balance = await this.connection.getBalance(this.walletPublicKey);
                console.log("Saldo de SOL:", balance / 1e9); // Convertir lamports a SOL
                if (balance < this.minSOL) {
                    alert("No tienes suficiente SOL para pagar las tarifas de transacción.");
                    throw new Error("No tienes suficiente SOL para pagar las tarifas de transacción.");
                }

                // Verifica que this.connection esté definido
                if (!this.connection) {
                    throw new Error("La conexión con Solana no está inicializada.");
                }

                // Crear un nuevo token
                const mint = await createMint(
                    this.connection,
                    this.form.payer, // Usar la billetera conectada como pagador
                    this.form.mintAuthority, // Usar la billetera conectada como autoridad de acuñación
                    null, // No establecer una autoridad de congelación
                    this.form.decimals // Decimales
                );

                // Mostrar la información del token creado
                this.tokenInfo.address = mint.toBase58();
            } catch (err) {
                this.tokenInfo.error = JSON.stringify(err.message)
                console.error("Error al crear el token:", err);

                // Manejar errores específicos
                if (err.message.includes("Insufficient funds")) {
                    alert("No tienes suficiente SOL para pagar las tarifas de transacción.");
                } else if (err.message.includes("Failed to send transaction")) {
                    alert("Error al enviar la transacción. Por favor, inténtalo de nuevo.");
                } else {
                    alert("Ocurrió un error al crear el token. Por favor, inténtalo de nuevo.");
                }
            }

        },
    },
    mounted() {
        this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    },
}
</script>