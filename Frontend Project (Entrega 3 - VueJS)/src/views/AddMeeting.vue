<template>
  <div class="AddMeeting">

    <!-- MENU -->
    <MenuCustom class="menuadd"></MenuCustom>
    
<!--APLICAMOS EL CAMBIO DE NOMBRE DINAMICO-->
<vue-headful title="Registro"
description="Página de registro de la aplicación."/>

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
<section class="flexadd">
<img v-show="!loading" src="../assets/add.svg" alt="addMeetings image">
<section v-show="!loading" class="addmeetingsblock">
<h2 id="titulo">
Añade un nuevo evento
</h2>
<p id="errormsg" v-if="required">{{errorMsg}}</p>
<form>

<p>Elije un título descriptivo, la fecha y el idioma del evento:</p>
<section>
<label for="titulo">Título:</label>
<input required minlength="3" maxlength="100" type="text" placeholder="Introduce el título" v-model="titulo">

<label for="online">¿Es online?</label>
<select required name="online" placeholder="Online?" v-model="online">
      <option value="1">Si</option>
      <option value="0">No</option>
 <option value="" selected disabled hidden>Elige...</option>
</select>
</section>

<section>
<label for="meeting-date">Fecha:</label>
<input required type="datetime-local" id="meeting-time" name="meeting-time" value="2018-06-12T19:30" :min=fechaminimo :max=fechamaximo v-model="meeting_date">
<select name="language" required placeholder="Introduce la lengua de la charla" v-model="meeting_language">
<option v-for="lang in languages" :key="lang.lang_name" v-bind:value="lang.lang_name">
{{lang.lang_name}}
</option> 
 <option value="" selected disabled hidden>Elige el idioma del evento</option>
</select>
</section>

<p>Elije la dirección donde tendrá lugar el evento:</p>
<section>
<label for="adresses">Direccion:</label>
<input required minlength="3" maxlength="100" type="text"  placeholder="Introduce tu direccion" v-model="adress">
<input required minlength="3" maxlength="100" type="text"  placeholder="Introduce tu ciudad" v-model="city">
</section>
<section>
<input required minlength="3" maxlength="100" type="text"  placeholder="Introduce tu provincia" v-model="province">
<input required minlength="3" maxlength="100" type="text" placeholder="Introduce tu pais" v-model="country">
</section>
<p>¿Cuantos asistentes están admitidos? ¡Elije tambien el nivel de idioma del evento!</p>

<section>
<label for="minusers">Asistentes mínimos:</label>
<select required name="minusers" placeholder="Usuarios minimos" v-model="minusers">
      <option>2</option>
      <option>3</option>
      <option>4</option>
 <option value="" selected disabled hidden>Asistentes mínimos</option>
</select>

<label for="minusers">Máximos:</label>
<select required name="minusers" placeholder="Usuarios minimos" disabled  v-show="!minusers">
 <option value="" selected disabled hidden>Elige primero el mínimo</option>
</select>
<select required name="maxusers"  placeholder="Usuarios maximos" v-model="maxusers" v-show="minusers">
      <option>{{parseInt(minusers) + 1}}</option>
      <option>{{parseInt(minusers) + 2}}</option>
      <option>{{parseInt(minusers) + 3}}</option>
 <option value="" selected disabled hidden>Asistentes máximos</option>
</select>
</section>
<section>
<label for="">Duración (en minutos):</label>
<input required type="number" placeholder="Duración" name="duracionminutos" min="10" max="120" v-model="duracionminutos">

<label for="langlevel">Nivel de la charla:</label>
<select required name="langlevel"  placeholder="Introduce el nivel del idioma" v-model="langlevel">
<option value="beginner">Principiante</option>
<option value="intermediate">Intermedio</option>
<option value="expert">Experto</option>
<option value="senior">Nativo</option>
 <option value="" selected disabled hidden>Elige el nivel</option>
</select>
</section>

<p>¡Finalmente añade una imagen descriptiva del evento o del lugar del evento y un comentario!</p>

<section>
<label for="imgmeeting">Sube una imagen:</label>
<input type="file" id="file" ref="file" accept="image/png, image/jpg" v-on:change="handleFileUpload()"/>
</section>
<textarea name="commentary" placeholder="Introduce una descripción del evento" rows="10" cols="50" v-model="commentary"></textarea>
</form>
<button class="myButton" @click='uploadEvent()'>
      Subir Evento
</button>
</section>
</section>
<footercustom></footercustom>
</div>
</template>
<script>
import footercustom from '@/components/FooterCustom.vue'
import MenuCustom from '@/components/MenuCustom'
import { getLang, addMeeting } from '../api/utils'
import Swal from 'sweetalert2'
export default {
  name: 'AñadirMeeting',
  components: {
    MenuCustom, footercustom
  },
  data() {
    return {
      loading: false,
      meeting_date: '',
      meeting_language: '',
      file: '',
      titulo: '',
      online: '',
      adress: '',
      city: '',
      province: '',
      country: '',
      commentary: '',
      minusers: '',
      maxusers: '',
      duracionminutos: '',
      langlevel: '',
      correctData: false,
      required: false,
      errorMsg: 'Error',
      languages: [],
      fechamaximo: '',
      fechaminimo: ''
    }
  },
  methods: {
    showError(msg) {
        this.errorMsg = msg
        this.correctData = false; // NON ENVIAR
        this.required = true; // MOSTRA O MENSAXE
      },
    validatingData() {
      if (
        this.titulo === "" ||
        this.online === "" ||
        this.adress === "" ||
        this.city === "" ||
        this.province === "" ||
        this.titulo === "" ||
        this.country === "" ||
        this.minusers === "" ||
        this.maxusers === "" ||
        this.duraciónminutos === "" ||
        this.langlevel === "" 
      ) {
        this.showError('Por favor cubre todos los campos');
        return;
      } else if (!this.validateName(this.city)){
        this.showError('La ciudad no es válida');
        return;
      } else if (!this.validateName(this.province)){
        this.showError('La provincia no es válida');
        return;
      } else if (!this.validateName(this.country)){
        this.showError('La ciudad no es válida');
        return;
      } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
      }
    },
    async uploadEvent() {
      this.validatingData();
        if (this.correctData) {
        try {
          const photoFormData = new FormData();
            // dict of all elements
          photoFormData.append("language", this.meeting_language);
          photoFormData.append("meeting_date", this.meeting_date);
          photoFormData.append("title", this.titulo);
          photoFormData.append("online_meeting", this.online);
          photoFormData.append("adress", this.adress);
          photoFormData.append("city", this.titulo);
          photoFormData.append("province", this.province);
          photoFormData.append("country", this.country);
          photoFormData.append("min_users", this.minusers);
          photoFormData.append("max_users", this.maxusers);
          photoFormData.append("sex", 'Unrestricted');
          photoFormData.append("commentary", this.commentary);
          photoFormData.append("duration_minutes", this.duracionminutos);
          photoFormData.append("lang_level", this.langlevel);
          if (this.file.name) {
          photoFormData.append("photo", this.file);
          };
          await addMeeting(photoFormData);
          Swal.fire({
          icon: "success",
          title: "Has subido tu evento!",
          text: "Estate atent@ por si alguien se apunta!",
        });
        this.$router.push('/home')
        } catch (error) {
          alert(error.response.data.message);
        }
        }
        return;
      },  
    handleFileUpload(){
        this.file = this.$refs.file.files[0];
    }, 
    async getLanguages(){
        try {
          this.languages = await getLang();
        } catch (error) {
          console.log(error);
        }
      },
    validateName(name) {
        var re = /^[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúñÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙÑ.-]+$/
        return re.test(String(name));
      },
    setFechaMinimoYMaximo() {
      let dateToday = new Date();
      this.fechaminimo = dateToday.toISOString().slice(0, 16);
      var date = new Date();
      date.setDate(date.getDate() + 31);
      this.fechamaximo = date.toISOString().slice(0, 16);
    }
  },
    mounted() {
      this.getLanguages();
      this.setFechaMinimoYMaximo();
  },
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,300&display=swap');

#errormsg {
    color: red;
  margin: 0;
  font-size: 1.2rem;
}
.addmeetingsblock button {
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  border-radius: 20px;
  background: #3F3D56;
  padding-right: 2rem;
  margin-top: 1rem;
  color: white;
}
.addmeetingsblock input {
  font-family: 'Merriweather', serif;
  margin: 0.5rem;
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  min-width: 20%;
  border-radius: 20px;
  border: 1px solid #3F3D56;
}
.addmeetingsblock input#file {
  border: none
}
.addmeetingsblock select {
  background: white;
  margin: 0.5rem;
  padding: 0.6rem 1rem 0.6rem 1rem;
  min-width: 20%;
  border-radius: 20px;
}
.addmeetingsblock textarea {
  font-family: 'Merriweather', serif;
}
.addmeetingsblock {
  animation: fadein 2s;
  font-family: 'Merriweather', serif;
  font-size: 0.8rem;
  background: white;
  min-width: 50%;
  min-height: 30vh;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
  border-radius: 30px;
  margin: 2rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
p {
  text-align: left;
  margin: 2rem 1rem 1rem 1rem;
  font-size: 1.1rem;
  color: #3F3D56;
  font-weight: bold;
  text-align: center;
}

.flexadd {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 80vh;
  min-width: 100%;
  justify-content: space-around;
}
.AddMeeting {
  font-family: 'Merriweather', serif;
  background-image: url("../assets/loginBackground.jpeg");
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100%;
  min-height: 100vh;
}
.AddMeeting img {
  animation: fadein 1.5s;
  max-width: 600px;
}
.menuadd {
  min-width: 100%;
}
.AddMeeting h2 {
  margin: 1rem;
  font-size: 1.5rem;
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