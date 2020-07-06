<template>
  <div class="Landing">
    <vue-headful title="Coffee & Talk" description="Landing page" />
    <menucustom id="menuLanding"></menucustom>
    <section class="flexlanding">
      <img src="../assets/logoapp.png" alt="">
  <section>
    <h1>Coffee & Talk</h1>
    <h2>La mejor opción para aprender idiomas.</h2>
    <p>¿Necesitas practicar un idioma y no sabes como empezar?</p>
    <p>¡Reúnete con gente con los mismos intereses</p>
    <p>y practicad ese idioma que tanto os gusta!</p>
      <br>
      <br>
      <br>
    <router-link class="cta" :to="{ name: 'Login'}">
  <span>Empezar</span>
  <svg width="13px" height="10px" viewBox="0 0 13 10">
    <path d="M1,5 L11,5"></path>
    <polyline points="8 1 12 5 8 9"></polyline>
  </svg>
    </router-link>
  </section>
  </section>
  <FooterCustom id='footerLanding'></FooterCustom>
  </div>
</template>

<script>
import menucustom from "@/components/MenuCustom.vue";
import FooterCustom from "@/components/FooterCustom.vue";
export default {
  name: "Landing",
  components: {
    menucustom, FooterCustom
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,300&display=swap');

.Landing a {
  text-decoration: none;
  color: inherit;
  margin: 1rem;
}
.Landing span {
  color: black;
}
.cta {
  position: relative;
  margin: auto;
  padding: 19px 22px;
  transition: all 0.2s ease;
}
.cta:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  border-radius: 28px;
  background: #3F3D56;
  width: 56px;
  height: 56px;
  transition: all 0.3s ease;
}
.cta span {
  position: relative;
  font-size: 16px;
  line-height: 18px;
  font-weight: 900;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  vertical-align: middle;
}
.cta svg {
  position: relative;
  top: 0;
  margin-left: 10px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #111;
  stroke-width: 2;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}
.cta:hover:before {
  width: 100%;
  background: rgb(119, 115, 172);
}
.cta:hover svg {
  transform: translateX(0);
}
.cta:active {
  transform: scale(0.96);
}
.flexlanding {
  animation: fadein 2s;
  background: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-width: 60%;
  min-height: 30vh;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
  border-radius: 30px;
  margin: 5rem;
  padding: 2rem;
}
#menuLanding {
  min-width: 100vw;
}
.Landing h1 {
  font-size: 1.8rem;
  text-align: left;
}

.Landing h2 {
  text-align: left;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #777984;
}
.Landing section p {
  text-align: left;
}
.Landing {
  background-image: url("../assets/loginBackground.jpeg");
  font-family: 'Merriweather', serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100vw;
  min-height: 100vh;
}
#footerLanding {
position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  padding: 1.5rem;
  font-size: 300;
}
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>