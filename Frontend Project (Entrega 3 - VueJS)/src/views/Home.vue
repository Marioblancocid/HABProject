<template>
  <div class="home">
    <vue-headful title="Coffee & Talk" description="Home page" />

    <!-- MENU -->
    <menucustom></menucustom>

    <!-- BUSQUEDA -->
    <div class="searchProduct">
      <div name="slct" id="slct" class="select">
      <select v-model="filter">
        <option disabled value>Filtrado por...</option>
        <option value="lang">Idioma</option>
        <option value="city">Lugar</option>
        <option value="level">Nivel</option>
        <option value="age">Edad</option>
        <option value="interests">Intereses</option>
      </select>
      </div>
      <input
        v-model.trim="search"
        id="search"
        name="bySearch"
        type="search"
        placeholder="Búsqueda..."
        v-show="normalInput"
      />
      <div name="slct" id="slct" v-show="ageInput" class="select">
      <select v-model.trim="search" >
        <option disabled value>Elige un rango de edad</option>
        <option value="20">hasta 20 años</option>
        <option value="30">de 20 a 30 años</option>
        <option value="40">de 30 a 40 años</option>
        <option value="50">de 40 a 50 años</option>
        <option value="60">de 50 a 60 años</option>
      </select>
      </div>
      <div name="slct" id="slct" class="select" v-show="levelInput">
      <select v-model.trim="search" >
        <option disabled value>Elige un nivel de idioma</option>
        <option value="Beginner">Principiante</option>
        <option value="Intermediate">Medio</option>
        <option value="Expert">Experto</option>
        <option value="Senior">Nativo</option>
      </select>
      </div>
      <button @click="getMeetings()">Buscar</button>
      <button @click="clearInput()">Clean</button>
    </div>

    <!--  SIMBOLO DE CARGA  -->
    <div v-show="loading" class="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>

    <!-- COMPONENTE MEETINGS -->
    <meetinglist :meetings="meetings"></meetinglist>

    <!-- NO RESULTS -->
    <p v-show="noResults" style="color:red">No results</p>
  </div>
</template>

<script>
import axios from "axios";
//IMPORTANDO MENU
import menucustom from "@/components/MenuCustom.vue";
//IMPORTANDO SPACES
import meetinglist from "@/components/MeetingList.vue";
export default {
  name: "Home",
  components: { menucustom, meetinglist },
  data() {
    return {
      meetings: [],
      loading: true,
      search: "",
      filter: "",
      normalInput: true,
      ageInput: false,
      noResults: false,
      levelInput: false
    };
  },
  methods: {
    getMeetings() {
      let self = this;
      axios
        .get(
          `http://localhost:3001/entries?search=${self.search}&filter=${self.filter}`
        )
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.meetings = response.data.data;
          }, 1000);
        })
        .catch(function(error) {
          alert(error.response.data.message);
        });
    },
    clearInput() {
      (this.search = ""), (this.filter = "");
      this.getMeetings();
      this.normalInput= true;
      this.ageInput= false;
      this.noResults= false;
      this.levelInput= false
    }
  },
  watch: {
     // cada vez que la pregunta cambie, esta función será ejecutada
    filter: function() {
      if (this.filter === "age") {
        this.ageInput = true;
        this.levelInput = false;
        this.normalInput = false;
        this.search = "";
      } else if (this.filter === "level") {
        this.ageInput = false;
        this.levelInput = true;
        this.normalInput = false;
        this.search = "";
      } else {
        this.ageInput = false;
        this.levelInput = false;
        this.normalInput = true;
        this.search = "";
      }
    },
    meetings: function() {
      if (this.meetings.length < 1) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
    }
  },
  created() {
    this.getMeetings();
  }
}
</script>

<style>
:focus {
outline:none;
}
.searchProduct {
  background: #3F3D56;
  padding: 1rem;
  border: 1px solid black;
}
.home {
  min-width: 100vw;
  min-height: 100vh;
}
body {
  background-image: url("../assets/loginBackground.jpg");
  background-size: 100%;
  background-repeat: round;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.home input {
  margin: 0.5rem;
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  min-width: 40%;
  border-radius: 20px;
}
.home select {
  background: white;
  margin: 0.5rem;
  padding: 0.6rem 1rem 0.6rem 1rem;
  min-width: 40%;
  border-radius: 20px;
}
.home option {
  background: white;
  margin: 0.5rem;
  padding: 0.6rem 1rem 0.6rem 1rem;
  min-width: 40%;
  border-radius: 20px;
}
.home button {
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  border-radius: 20px;
  background: white;
  padding-right: 2rem;
  margin-left: 1rem;
}
.searchProduct {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
}
.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: cadetblue;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>