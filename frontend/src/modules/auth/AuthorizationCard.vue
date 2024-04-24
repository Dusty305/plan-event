<script setup>
import {ref} from "vue";
import {useUserStore} from "../../app/stores/UserStore.js";

const emit = defineEmits(['success', 'failure'])

const userStore = useUserStore()

const user = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const submit = async () => {
  loading.value = true
  let success = await userStore.authorizeUser(user.value)
  emit(success ? 'success' : 'failure')
  loading.value = false
}
</script>

<template>
  <v-card>
    <v-card-text class="my-2">
      <v-text-field
          label="Имя пользователя"
          v-model="user.username"
          type="text"
      />
      <v-text-field
          label="Пароль"
          v-model="user.password"
          type="password"
      />
    </v-card-text>
    <v-card-actions class="justify-center mb-7">
      <v-btn
          :loading="loading"
          @click="submit"
          variant="elevated"
          text="Авторизоваться"
      />
    </v-card-actions>
  </v-card>
</template>