<script setup>
import {ref} from "vue";
import {useUserStore} from "../../../stores/UserStore.js";

const emit = defineEmits(['success', 'failure'])

const userStore = useUserStore()

const user = ref({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: ''
})

const loading = ref(false)
const submit = async () => {
  loading.value = true
  try {
    let success = userStore.registerUser(user.value)
    emit(success ? 'success' : 'failure')
  } catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <v-card>
    <v-card-text class="my-2">
      <v-row>
        <v-col>
          <v-text-field
              label="Имя"
              v-model="user.firstName"
              type="text"
          />
        </v-col>
        <v-col>
          <v-text-field
              label="Фамилия"
              v-model="user.lastName"
              type="text"
          />
        </v-col>
      </v-row>
      <v-text-field
          label="E-mail"
          v-model="user.email"
          type="email"
      />
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
          text="Зарегистрироваться"
      />
    </v-card-actions>
  </v-card>
</template>