<template>
  <div class="meetingview">
    <vue-headful title="Meeting" description="Meeting page" />

    <!-- MENU -->
    <menucustom id="menumeetingview"></menucustom>

<!--  SIMBOLO DE CARGA  -->
    <div id="spinner" v-show="loading">
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>  


<section class="flexmeeting">
  <img id="undraw" v-show="!loading" src="../assets/meeting.svg" alt="profile image">
<section v-show="!loading" id="meetingCard">
    <!-- meeting VIEW -->
    <meetingview
      :meeting="meeting"
      :peopleJoin="peopleJoin"
      :allPeopleJoins="allPeopleJoins"
      :comments="comments"
      v-show="!loading"
    ></meetingview>
    <section v-show="!loading">
    <button v-show="!getIds()" @click="canIVote('Votar')" :disabled="!disablebutton">Votar</button>
    <button v-show="!getIds()" :disabled="disablebutton" @click="CanIJoin('Apuntar')">Apuntate!</button>
    </section>
    <!-- MODAL PARA VOTAR -->
    <div class="modal" v-show="modal">
      <div class="modalBox">
        <section v-show="votemodal">
        <h3>Votar meeting</h3>
        <label for="commentary">Commentary:</label>
        <textarea
          name="comentary"
          placeholder="Commentary..."
          v-model.trim="comentary"
          rows="10"
          cols="50"
        />
        <label for="rating">Score:</label>
        <star-rating v-model="rating" class="vote"></star-rating>
        <div>
          <button @click="closeModal()">Cancel</button>
          <button @click="vote()">Enviar</button>
        </div>
        </section>
        <section>
          <label  for="text">Escribe un mensaje de petición para entrar</label>
          <input type="text" v-model="messagejoin" name="message" placeholder="Escribe aqui...">
         </section>
        <section v-show="joinmodal">
          <button @click="sendRequestJoin()" >Enviar</button>
          <button @click="closeModal()">Cancel</button>
        </section>
      </div>
    </div>
  </section>
  </section>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";
import Swal from "sweetalert2";
//IMPORTANDO MENU
import menucustom from "@/components/MenuCustom.vue";
//IMPORTANDO meetingS
import meetingview from "@/components/MeetingView.vue";
export default {
  name: "Meeting",
  components: { menucustom, meetingview, StarRating },
  props: ["id"],
  data() {
    return {
      meeting: {},
      comments: [],
      loading: true,
      modal: false,
      rating: 0,
      comentary: "",
      votemodal: false,
      joinmodal: false,
      messagejoin: '',
      peopleJoin: [],
      allPeopleJoins: [],
      disablebutton: false,

    };
  },
  methods: {
    getIds(){
      if (this.meeting.id_user_host) {
      this.id_host = this.meeting.id_user_host;
      this.id_viewer = localStorage.getItem('id');
      if (this.id_host.toString() === this.id_viewer) {
        return true
      } else {
        return false
      }
    }
  },
    async getPeople(max_users) {
      let self = this;
      await axios
        .get(
          "http://localhost:3001/entries/join/" + self.$route.params.id
        )
        .then(function(response) {
          self.peopleJoin = response.data.data
          if (self.peopleJoin.length>=max_users) {
            self.disablebutton = true
          };
        })
        .catch(function(error) {
          if (error.response.data) {
            alert(error.response.data.message);
          }
        });
    },
    async getAllPeople() {
      let self = this;
      await axios
        .get(
          "http://localhost:3001/entries/allJoins/" + self.$route.params.id
        )
        .then(function(response) {
          self.allPeopleJoins = response.data.data;
          for (const join of self.allPeopleJoins) {
            if (join.id.toString()===localStorage.getItem('id'))  {
              self.disablebutton = true;
            }
          }

        })
        .catch(function(error) {
          if (error.response.data) {
            alert(error.response.data.message);
          }
        });
    },
    canIVote(data){
      let fecha = new Date;
      if (fecha.getTime() >= Date.parse(this.meeting.meeting_date)) {
        this.openModal(data);
      } else {
        Swal.fire({
        icon: "error",
        title: "No ha sido posible.",
        text: "No puedes votar un evento al que aun no asististe",
        confirmButtonText: "Ok",
        });
      }
    },
    CanIJoin(data){
      let fecha = new Date;
      if (fecha.getTime() >= Date.parse(this.meeting.meeting_date)) {
        Swal.fire({
        icon: "error",
        title: "No ha sido posible.",
        text: "No puedes apuntarte a un evento que ya ha ocurrido",
        confirmButtonText: "Ok",
        });
        } else {
        this.openModal(data);
      }
    },
    //FUNCION QUE ABRE EL POP UP PARA EDITAR
    openModal(data) {
      this.modal = true;
      if (data==='Votar') {
        this.votemodal = true;
      } else {
        this.joinmodal = true;
      }
    },
    //FUNCION QUE CIERRA EL POP UP PARA EDITAR
    closeModal() {
      this.modal = false;
      this.rating = 0;
      this.comentary = "";
      this.votemodal = false;
      this.joinmodal = false;

    },
    getmeetings() {
      let self = this;
      axios
        .get("http://localhost:3001/entries/" + self.$route.params.id)
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.meeting = response.data.data;
            self.getAllPeople();
            self.getPeople(self.meeting.max_users);
          }, 1000);
          
        })
        .catch(function(error) {
          if (error.response) {
            alert('No existe esa meeting');
          }
        });
    },
    sendRequestJoin() {
      let self = this;
      axios
        .post("http://localhost:3001/entries/join/" + self.$route.params.id,
        {
          message: self.messagejoin
        })
        .then(function(response) {
          Swal.fire({
        icon: "success",
        title: "Petición enviada",
        text: "Gracias",
        confirmButtonText: "Ok",
        });
        self.disablebutton = true;
        self.closeModal();
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    getVotes() {
      let self = this;
      axios
        .get("http://localhost:3001/entries/" + self.$route.params.id + "/votes")
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.comments = response.data.data;
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    vote() {
      let self = this;
      axios
        .post(
          "http://localhost:3001/entries/" + self.$route.params.id + "/votes",
          {
            vote: self.rating,
            commentary: self.comentary,
          }
        )
        .then(function(response) {
          console.log(response);
          self.emptyFields();
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    emptyFields() {
      this.rating = 0;
      this.comentary = "";
      this.closeModal();
      Swal.fire({
        icon: "success",
        title: "Voto enviado",
        text: "Gracias",
        confirmButtonText: "Ok",
      });
      setTimeout(function() {
        location.reload();
      }, 1500);
    },
  },
  created() {
    this.getmeetings();
    this.getVotes();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,300&display=swap');
:focus {
outline:none;
}
.flexmeeting {
  display: flex;
  flex-direction: row;
  min-width: 100%;
  justify-content: space-around;
}
#meetingCard {
  animation: fadein 2s;
  background: white;
  max-width: 50%;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
  border-radius: 30px;
  margin: 2rem;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#menumeetingview {
  min-width: 100vw;
}
#meetingCard p {
  text-align: left;
}
#meetingCard img {
  min-width: 80%;
  align-self: center;
  margin: 1rem 0 2rem 0;
  border: 5px solid black;
}
.meetingview button {
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  border-radius: 20px;
  background: white;
  padding-right: 2rem;
  margin-left: 1rem;
}
.meetingview {
    font-family: 'Merriweather', serif;
  background-image: url("../assets/loginBackground.jpeg");
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100vw;
  min-height: 100vh;
}
.meetingview p {
  background: none;
  color: rgb(138, 118, 118);
}
.meetingview img#undraw{
  animation: fadein 1.5s;
  max-width: 900px;
  margin-top: 5rem;
}
.meetingview a {
  color: #8A7676;
  font-weight: 500;
  text-decoration: underline;
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
.modal {
  animation: fadein 1s;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
}
.modalBox {
  background: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border-radius: 40px;;
  border: 1px solid #888;
  width: 40%;
  color: black;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

.modalBox input {
  font-family: 'Merriweather', serif;
  margin: 1rem;
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  max-width: 25%;
  border-radius: 20px;
  border: 1px solid #3F3D56;
}

.modalBox textarea {
  min-width: 50%;
  min-height: 6rem;
  align-self: center;
  margin-bottom: 1rem;
  border-radius: 10px;
  padding: 0.5rem;
}

.modalBox select {
  background: white;
  margin: 0.5rem;
  padding: 0.6rem 1rem 0.6rem 1rem;
  min-width: 10%;
  border-radius: 20px;
}

.modalBox button {
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  border-radius: 20px;
  background: white;
  padding-right: 2rem;
  margin-left: 1rem;
  max-width: 30%;
  margin-top: 0.5rem;
}

.vote {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
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
  animation: fadein 0.5s;
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
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>