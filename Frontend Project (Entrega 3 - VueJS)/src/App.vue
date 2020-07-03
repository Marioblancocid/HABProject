<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  background-image: url("/assets/loginBackground.jpg");
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end ;
  padding-right: 2rem;
}

#nav a {
  font-weight: bold;
  color: white;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: rgb(207, 205, 205);
  text-decoration: none;
}
</style>
