<template>
  <div>
    <div class="profile">
      <img :src="profile.user_img ? profile.user_img : path">
      <p>{{ profile.email ? 'Email: ' + profile.email : null}}</p>
      <p>{{ profile.first_name ? 'Nombre: ' + profile.first_name : null}}</p>
      <p>{{ profile.second_name ? 'Apellido: ' + profile.second_name : null}}</p>
      <p>{{ profile.main_language ? 'Idioma nativo: ' + profile.main_language : null}}</p>
      <p>{{ profile.creation_date ? 'Miembro desde: ' + formatDate(profile.creation_date) : null}}</p>
      <p>{{ profile.birth_date ? 'Cumpleaños: ' + formatDate(profile.birth_date) : null}}</p>
      <p>{{ profile.adress ? 'Dirección: ' + profile.adress : null}}</p>
      <p>{{ profile.city ? 'Ciudad: ' + profile.city : null}}</p>
      <p>{{ profile.province ? 'Provincia: ' + profile.province : null}}</p>
      <p>{{ profile.country ? 'País: ' + profile.country : null}}</p>
      <p>{{ profile.sex ? 'Sexo: ' + translateSex(profile.sex) : null}}</p>
      <p>{{ profile.tel ? 'Teléfono: ' + profile.tel : null}}</p>
      <p>{{ profile.user_status ? 'Estado: ' + profile.user_status : null}}</p>
      <p>{{ profile.interests ? 'Intereses: ' + profile.interests : null}}</p>

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
    }
  },
};
</script>

<style scoped>

img {
  height: 400px;
  width: 400px;
}
</style>