import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => {
    const userData = localStorage.getItem("user");
    return {
      user: userData && userData !== "undefined" ? JSON.parse(userData) : null,
      token: localStorage.getItem("token") || null,
    };
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      const response = await api.post("/login", credentials);
      // Backend returns access_token, not token
      this.token = response.data.access_token;
      localStorage.setItem("token", this.token);

      // Fetch user details immediately after login since login doesn't return user
      await this.fetchUser();
      return true;
    },
    async register(data) {
      await api.post("/register", data);
      // Registration successful, backend doesn't return token. Auto-login the user:
      return await this.login({
        email: data.email,
        password: data.password,
      });
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await api.get("/me");
        // Backend returns user inside 'data' object
        this.user = response.data.data || response.data;
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        this.logout();
      }
    },
    async logout() {
      try {
        if (this.token) {
          await api.post("/logout");
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});
