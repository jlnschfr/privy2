<script setup lang="ts">
import { Filter, Tag } from "@/types/enums";

interface Props {
  isActive: boolean;
}
interface Emits {
  (e: "toggle-drawer"): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const route = useRoute();
const client = useSupabaseClient();
const colorMode = useColorMode();
const tagStore = useTagStore();
const viewport = useViewport();
const queryParams = useQueryParams();

const { isMobile } = viewport;
const { activeTag, activeFilter } = queryParams;

const tags: ComputedRef<string[]> = computed(() => tagStore.uniqueTags);
const isDarkMode: ComputedRef<boolean> = computed(
  () => colorMode.value === "dark",
);

function getTagAmount(tag: string) {
  return tagStore.getTagAmount(tag);
}

function toggleDarkMode() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

async function logout() {
  await client.auth.signOut();
  navigateTo("/");
}

watch(
  () => [route.name, route.query.filter, route.query.tag],
  () => {
    if (props.isActive && isMobile.value) {
      emit("toggle-drawer");
    }
  },
);
</script>

<template>
  <section>
    <transition name="mobile-slide-right">
      <aside
        v-if="isActive || !isMobile"
        aria-label="Find filters and additional settings"
        class="fixed right-0 top-0 z-50 flex h-full w-4/5 flex-col justify-between bg-neutral-100 py-4 text-neutral-300 md:left-0 md:max-w-drawer"
      >
        <div>
          <header class="px-4 text-center">
            <p class="flex justify-center">
              <PrivyLogo width="5" />
            </p>
          </header>
          <nav
            aria-label="Filter your notes by the following tags"
            class="mt-4 max-h-drawerNav overflow-auto px-6"
          >
            <ul class="w-full py-1">
              <li>
                <nuxt-link
                  :to="`/notes/?filter=${Filter.Favorites}`"
                  class="privy-focus flex items-center transition-colors duration-300 hover:text-neutral-400"
                  :class="{
                    'text-neutral-600 hover:text-neutral-600':
                      activeFilter === Filter.Favorites,
                  }"
                >
                  <SvgoHeart class="mr-1 w-2" /> Favorites
                </nuxt-link>
              </li>
              <li class="mt-2">
                <nuxt-link
                  :to="`/notes/?tag=${Tag.Trash}`"
                  class="privy-focus flex items-center transition-colors duration-300 hover:text-neutral-400"
                  :class="{
                    'text-neutral-600 hover:text-neutral-600':
                      activeTag === Tag.Trash,
                  }"
                >
                  <SvgoTrash class="mr-1 w-2" /> Trash
                </nuxt-link>
              </li>

              <li v-for="(tag, key) in tags" :key="key" class="mt-2">
                <div class="flex justify-between">
                  <nuxt-link
                    :to="`/notes/?tag=${tag}`"
                    class="privy-focus flex items-center transition-colors duration-300 hover:text-neutral-400"
                    :class="{
                      'text-neutral-600 hover:text-neutral-600':
                        tag === activeTag,
                    }"
                  >
                    <SvgoHash class="mr-1 w-2" /> {{ tag }}
                  </nuxt-link>
                  {{ getTagAmount(tag) }}
                </div>
              </li>
              <li class="mt-2">
                <nuxt-link
                  to="/notes/?filter=All"
                  class="privy-focus flex items-center transition-colors duration-300 hover:text-neutral-400"
                  :class="{
                    'text-neutral-600 hover:text-neutral-600':
                      activeFilter === 'All',
                  }"
                >
                  <SvgoGrid class="mr-1 w-2" /> All Notes
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <footer class="mt-4 px-6">
          <ul class="w-full">
            <li><Weather /></li>
            <li class="mt-2">
              <button
                class="privy-focus flex items-center transition-colors duration-300 hover:text-neutral-400"
                @click="toggleDarkMode()"
              >
                <span v-if="isDarkMode" class="flex"
                  ><SvgoSun class="mr-1 w-2" /> Light Mode</span
                >
                <span v-if="!isDarkMode" class="flex"
                  ><SvgoMoon class="mr-1 w-2" /> Dark Mode</span
                >
              </button>
            </li>
            <li class="mt-2">
              <button
                class="privy-focus flex items-center transition-colors duration-300 hover:text-neutral-400"
                @click="logout"
              >
                <SvgoLogout class="mr-1 w-2" /> Logout
              </button>
            </li>
          </ul>
        </footer>
      </aside>
    </transition>
    <transition name="fade">
      <div
        v-if="isActive"
        class="fixed left-0 top-0 z-40 h-screen w-screen bg-neutral-200 bg-opacity-75"
        @click="emit('toggle-drawer')"
      ></div>
    </transition>
  </section>
</template>
