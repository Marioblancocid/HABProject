<template>
  <div class="error">
    <vue-headful title="Error" description="Error page of web" />
    <menucustom id="menuLanding"></menucustom>
    <section class="flexlanding">
      <h1>ERROR:</h1>
    <p>404 - NOT FOUND</p>
      <router-link  id='link' :to="{ name: 'Home'}">Volver</router-link> 
    </section>
    <FooterCustom id='footerLanding'></FooterCustom>
  </div>
</template>

<script>
import menucustom from "@/components/MenuCustom.vue";
import FooterCustom from "@/components/FooterCustom.vue";
export default {
  name: "Error",
  components: {
    menucustom, FooterCustom
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,300&display=swap');
.error h1 {
  margin-right: 2rem;
}
.error section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: white;
  min-width: 60vh;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
  border-radius: 30px;
  margin: 5rem;
  padding: 2rem;
}
.error {
    font-family: 'Merriweather', serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100vw;
  min-height: 100vh;
}
.error #menuLanding {
  min-width: 100vw;
}
.error #footerLanding {
position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  padding: 1.5rem;
  font-size: 300;
}
.error #link {
  text-decoration: none;
}
</style>