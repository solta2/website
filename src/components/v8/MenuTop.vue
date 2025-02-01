<template>
    <!-- <nav class="navbar navbar-expand-lg bg-body-tertiary"> -->
    <nav class="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Solta2</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                <!-- <router-link to="/">Home</router-link> |
                <router-link to="/listing-home">listing home</router-link> |
                <router-link to="/listing">listing</router-link> -->
                
                <li class="nav-item">
                    <router-link class="nav-link" to="/">Inicio</router-link>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Listados Memes
                    </a>
                    <ul class="dropdown-menu">
                        <li><router-link class="dropdown-item" to="/listing-home">Version 7</router-link></li>
                        <li><router-link class="dropdown-item" to="/listing">Version 6</router-link></li>
                    </ul>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Tools (Meme's)
                    </a>
                    <ul class="dropdown-menu">
                        <li><router-link class="dropdown-item" to="/tokens/create">Crear</router-link></li>
                    </ul>
                </li>
                <li class="nav-item">
                <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                </li>
            </ul>
            <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
            </div>
        </div>
    </nav>
</template>