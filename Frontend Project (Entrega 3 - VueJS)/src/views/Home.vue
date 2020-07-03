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
      <button @click="searchNow()">Buscar</button>
      <button @click="clearInput()">Clean</button>
    </div>

    <!--  SIMBOLO DE CARGA  -->
    <div id="spinner" v-show="loading">
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>  
    <!-- COMPONENTE MEETINGS -->
    <div v-show="normalState">
    <h1 v-show="!loading">Proximos eventos:</h1>
    </div>
    <meetinglist v-show="!loading" :meetings="meetings"></meetinglist>
    <div v-if="Anonymous">
    <div div v-show="normalState">
    <h1 v-show="!loading">Eventos cercanos:</h1>
    <meetinglist v-show="!loading" :meetings="meetingsplace"></meetinglist>
    <h1 v-show="!loading">Eventos en tu idioma:</h1>
    <meetinglist v-show="!loading"  :meetings="meetingslanguage"></meetinglist>
    </div>
    </div>
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
      meetingsplace: [],
      meetingslanguage: [],
      profile: {},
      loading: true,
      search: "",
      filter: "",
      normalState: true,
      normalInput: true,
      ageInput: false,
      noResults: false,
      levelInput: false,
      Anonymous: true
    };
  },
  methods: {
    getProfile() {
      if (localStorage.getItem('id')) {
      let self = this;
      axios
        .get("http://localhost:3001/users/" + localStorage.getItem('id'))
        .then(function(response) {
            self.profile = response.data.data;
            self.getMeetingsLang();
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        })
        } else {
        this.Anonymous = false;
        return;
        }
    },
    getMeetingsLang() {
      let self = this;
      axios
        .get(
          `http://localhost:3001/entries?search=${self.profile.main_language}&filter=lang`
        )
        .then(function(response) {
            self.meetingslanguage = response.data.data;
            self.getMeetingsPlace();
        })
        .catch(function(error) {
          alert(error.response.data.message);
        });
    },
      getMeetingsPlace() {
      let self = this;
      axios
        .get(
          `http://localhost:3001/entries?search=${self.profile.city}&filter=city`
        )
        .then(function(response) {
            self.meetingsplace = response.data.data;
        })
        .catch(function(error) {
          alert(error.response.data.message);
        });
    },
    searchNow(){
      this.normalState = false;
      this.loading = true;
      this.getMeetings();
    },
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
            self.getProfile();
          }, 1500);
        })
        .catch(function(error) {
          alert(error.response.data.message);
        });
    },
    clearInput() {
      this.loading = true;
      (this.search = ""), (this.filter = "");
      this.getMeetings();
      this.normalInput= true;
      this.ageInput= false;
      this.noResults= false;
      this.levelInput= false;
      this.normalState= true;
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
.loadingroller {
min-width: 100vw;
min-height: 60vh;
display: flex;
align-items: center;
justify-content: center;
}
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
.home h1 {
  background: white;
  max-width: 30vw;
  border-radius: 15px;
  padding: 1rem;
  margin-left: 2rem;
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

#spinner {
  min-height: 40vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.lds-ring {
  width: 400px;
  height: 200px;
  border-radius: 100px;
  background: #3F3D56;
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;

}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>