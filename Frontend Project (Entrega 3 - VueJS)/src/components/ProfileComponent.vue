<template>
  <div>
    <div class="profile">
      <img :src="profile.user_img ? pathimg + profile.user_img : path">
      <hr>
      <p><span>Nombre: </span>{{ profile.first_name ? profile.first_name : null}}</p>
      <p><span>Apellidos: </span>{{ profile.second_name ? profile.second_name : null}}</p>
      <p><span>Idioma nativo: </span>{{ profile.main_language ? profile.main_language : null}}</p>
      <p><span>Email: </span>{{ profile.email ? profile.email : null}}</p>
      <p><span>Miembro desde: </span> {{ profile.creation_date ? formatDate(profile.creation_date) : null}}</p>
      <p><span>Cumpleaños: </span>{{ profile.birth_date ? formatDate(profile.birth_date) : null}}</p>
      <div v-show="checkId()">
      <hr>
      <p><span>Dirección: </span>{{ profile.adress ? profile.adress : null}}</p>
      <p><span>Ciudad: </span>{{ profile.city ? profile.city : null}}</p>
      <p><span>Provincia: </span>{{ profile.province ? profile.province : null}}</p>
      <p><span>País: </span>{{ profile.country ? profile.country : null}}</p>
      <p><span>Sexo: </span>{{ profile.sex ? translateSex(profile.sex) : null}}</p>
      <p><span>Teléfono: </span>{{ profile.tel ? profile.tel : null}}</p>
      <p><span>Estado: </span>{{ profile.user_status ? profile.user_status : null}}</p>
      <p><span>Intereses: </span>{{ profile.interests ? profile.interests : null}}</p>
      <hr>
      </div>

      </div>
      <br />
    </div>
</template>

<script>
export default {
  name: "ProfileComponent",
  data() {
    return {
      path: "http://localhost:3001/uploads/defaultimg.png",
      pathimg: "http://localhost:3001/uploads/",
      id: 0,
      id_viewer: 1
    };
  },
  props: {
    profile: Object,
  },
  methods: {
    formatDate(param, id){
      const date = new Date(param);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
      return date.toLocaleString('es-ES', options); 
    },
    capitalize() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    translateSex(sex){
      if (sex==='Male') {
        return 'Hombre'
      } else if (sex==='Female') {
        return 'Mujer'
      }
      return 'Other'
    },
    checkId(){
      if (this.profile.id) {
      this.id = this.profile.id;
      this.id_viewer = localStorage.getItem('id');
      if (this.id.toString() === this.id_viewer) {
        return true
      } else {
        return false
      }
      }
    },
  },
  created() {
    this.checkId();
  }
};
</script>

<style scoped>

img {
  border-radius: 50%;
  height: 300px;
  width: 300px;
  border: 2px black solid;
  margin: 1rem;
}
span {
  font-weight: bold;
}
p {
  text-align: left;
  margin: 0.7rem;
  font-size: 1.4rem;
}
</style>