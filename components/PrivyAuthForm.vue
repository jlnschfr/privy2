<template>
  <form
    ref="form"
    class="max-w-md mx-auto px-3 md:px-6 py-8 shadow-xl bg-neutral-600 dark:bg-neutral-100 absolute left-4vw right-4vw top-50 transform -translate-y-1/2 transition duration-300"
    @submit.prevent="authenticate"
  >
    <header class="flex justify-center">
      <SvgoPrivy class="w-5" />
    </header>

    <Input
      v-model="email"
      placeholder="mail"
      type="email"
      class="mt-8"
      @focus="error = ''"
    />

    <Input
      v-model="password"
      placeholder="password"
      type="password"
      class="mt-4"
      @focus="error = ''"
    />

    <Input
      v-if="!isLogin"
      v-model="repeatedPassword"
      placeholder="repeat password"
      type="password"
      class="mt-4"
      @focus="error = ''"
    />

    <Button
      v-if="isLogin"
      :disabled="!email || !password"
      type="submit"
      class="w-full mt-6"
      >Login</Button
    >

    <Button
      v-if="!isLogin"
      :disabled="!email || !password || !repeatedPassword"
      type="submit"
      class="w-full mt-6"
    >
      Register</Button
    >

    <p class="mt-6 text-center">
      <span
        v-text="!isLogin ? 'Already got an account?' : 'Dont have an account?'"
      ></span>
      <button type="button" class="privy-focus" @click="isLogin = !isLogin">
        {{ isLogin ? "Register now" : "Login" }}
      </button>
    </p>
    <p v-if="error" class="mt-4 text-sm text-secondary-500 text-center">
      {{ error }}
    </p>
  </form>
</template>

<script>
export default {
  components: {
    Button: () => import("@/components/_Button"),
    Input: () => import("@/components/_Input"),
  },

  data() {
    return {
      isLogin: true,
      email: "",
      password: "",
      repeatedPassword: "",
      error: "",
    };
  },
  methods: {
    authenticate() {
      this.isLogin ? this.login() : this.register();
    },

    register() {
      if (this.password === this.repeatedPassword) {
        this.dispatchAuthenticateToStore("createUserWithEmailAndPassword");
      } else {
        this.error = "Passwords are not equal";
      }
    },

    login() {
      this.dispatchAuthenticateToStore("loginWithEmailAndPassword");
    },

    dispatchAuthenticateToStore(method) {
      this.$store
        .dispatch(method, {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$refs.form.reset();
        })
        .catch((e) => {
          this.error = e.message;
        });
    },
  },
};
</script>
