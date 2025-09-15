<script setup lang="ts">
import type { RecipeRequestParams } from "~/netlify/functions/generate-recipes/generate-recipes.mts";

interface Props {
  noteId: string;
}
const props = defineProps<Props>();

const recipeStore = useRecipeStore();
const syncStore = useSyncStore();
const snackbarStore = useSnackbarStore();

// Form state for recipe parameters
const numberOfRecipes = ref("3");
const numberOfPersons = ref("2");
const includedIngredients = ref("");
const excludedIngredients = ref("");
const cookingStyles = ref("");
const vegan = ref(false);
const vegetarian = ref(false);

const isDropdownOpen = ref(false);

async function generateRecipes(): Promise<void> {
  try {
    // Set global loading state
    syncStore.setIsSyncing(true);

    // Parse comma-separated ingredients
    const parseIngredients = (str: string) =>
      str
        ? str
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    const params: RecipeRequestParams = {
      numberOfRecipes: parseInt(numberOfRecipes.value) || 3,
      numberOfPersons: parseInt(numberOfPersons.value) || 4,
      includedIngredients: parseIngredients(includedIngredients.value),
      excludedIngredients: parseIngredients(excludedIngredients.value),
      cookingStyles: cookingStyles.value || undefined,
      vegan: vegan.value,
      vegetarian: vegetarian.value,
    };

    await recipeStore.generateAndAddRecipesToNote(props.noteId, params);

    // Close dropdown after successful generation
    isDropdownOpen.value = false;
  } catch (error) {
    console.error("Failed to generate recipes:", error);
    snackbarStore.show({
      text: "Fehler beim Generieren der Rezepte",
      action: "dismiss",
    });
  } finally {
    syncStore.setIsSyncing(false);
  }
}
</script>

<template>
  <DropdownMenuRoot v-model:open="isDropdownOpen">
    <DropdownMenuTrigger as-child>
      <IconButton
        label="generate recipes"
        styling="primary"
        :disabled="syncStore.isSyncing"
      >
        <SvgoHatChef aria-hidden="true" class="w-2" />
      </IconButton>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      class="w-80 border border-neutral-400 bg-neutral-600 px-3 py-2 shadow-lg transition-borderAndBgColor duration-300 dark:border-neutral-200 dark:bg-neutral-50"
      align="end"
    >
      <div class="space-y-3">
        <TextInput
          v-model="numberOfRecipes"
          type="number"
          placeholder="Anzahl der Rezepte"
          min="1"
          max="10"
        />

        <TextInput
          v-model="numberOfPersons"
          type="number"
          placeholder="Anzahl der Personen"
          min="1"
          max="20"
        />

        <TextInput
          v-model="includedIngredients"
          type="text"
          placeholder="Gewünschte Zutaten"
        />

        <TextInput
          v-model="excludedIngredients"
          type="text"
          placeholder="Unerwünschte Zutaten"
        />

        <TextInput v-model="cookingStyles" type="text" placeholder="Kochstil" />

        <div class="flex gap-3">
          <Checkbox id="vegan" v-model="vegan" label="Vegan" />

          <Checkbox id="vegetarian" v-model="vegetarian" label="Vegetarisch" />
        </div>

        <Button
          styling="primary"
          :disabled="syncStore.isSyncing"
          class="w-full"
          @click="generateRecipes"
        >
          Rezepte generieren
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>
