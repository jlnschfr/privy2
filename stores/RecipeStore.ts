import { defineStore } from "pinia";

// Import types from the API schema - single source of truth
import type {
  RecipeRequestParams,
  ShoppingListCategory,
  Recipe,
  RecipeResponse,
} from "~/netlify/functions/generate-recipes/generate-recipes.mts";

import { v4 as uuidv4 } from "uuid";

export const useRecipeStore = defineStore("RecipeStore", () => {
  // State for loading states, cache, etc.
  const isGenerating = ref(false);
  const lastGeneratedRecipes = ref<Recipe[]>([]);
  const lastShoppingList = ref<ShoppingListCategory[]>([]);

  /**
   * Calls the recipe generation API endpoint
   */
  const generateRecipes = async (
    params: RecipeRequestParams,
  ): Promise<RecipeResponse> => {
    const response = await $fetch<RecipeResponse>(
      "/.netlify/functions/generate-recipes",
      {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  };

  /**
   * Converts shopping list categories into Task items and Markdown headers for the note
   */
  const convertShoppingListToItems = (
    shoppingList: ShoppingListCategory[],
  ): Item[] => {
    const items: Item[] = [];

    shoppingList.forEach((categoryGroup) => {
      // Only create category header if there are items in this category
      if (categoryGroup.items && categoryGroup.items.length > 0) {
        // Add category header as markdown
        items.push({
          id: uuidv4(),
          type: "Markdown",
          data: {
            text: `## ${categoryGroup.category}`,
          },
        });

        // Add each ingredient as a task
        categoryGroup.items.forEach((item) => {
          items.push({
            id: uuidv4(),
            type: "Task",
            data: {
              text: `${item.quantity} ${item.name}`,
              isValid: false,
            },
          });
        });
      }
    });

    return items;
  };

  /**
   * Converts recipes into Markdown items for the note
   */
  const convertRecipesToMarkdown = (recipes: Recipe[]): Markdown[] => {
    const markdownItems: Markdown[] = [];

    recipes.forEach((recipe) => {
      const markdownContent = `
## ${recipe.title}

${recipe.description ? `**${recipe.description}**\n` : ""}
- 🍽️ Portionen: ${recipe.servings} Person${recipe.servings > 1 ? "en" : ""}
- ⏱️ Vorbereitung: ${recipe.prepTime}
- 🔥 Kochzeit: ${recipe.cookTime}
- 📊 Schwierigkeit: ${recipe.difficulty}

### Zutaten
${recipe.ingredients.map((ingredient) => `- ${ingredient.quantity} ${ingredient.name}`).join("\n")}

### Anweisungen
${recipe.instructions.map((step, stepIndex) => `${stepIndex + 1}. ${step}`).join("\n")}

---
`;

      markdownItems.push({
        id: uuidv4(),
        type: "Markdown",
        data: {
          text: markdownContent.trim(),
        },
      });
    });

    return markdownItems;
  };

  /**
   * Main function to generate recipes and convert them to note items
   */
  const generateRecipeItems = async (
    params: RecipeRequestParams,
  ): Promise<Item[]> => {
    isGenerating.value = true;

    try {
      const recipeData = await generateRecipes(params);

      // Store for potential future use
      lastGeneratedRecipes.value = recipeData.recipes;
      lastShoppingList.value = recipeData.shoppingList;

      const shoppingItems = convertShoppingListToItems(recipeData.shoppingList);
      const recipeMarkdown = convertRecipesToMarkdown(recipeData.recipes);

      // Combine shopping list and recipes
      return [...shoppingItems, ...recipeMarkdown];
    } finally {
      isGenerating.value = false;
    }
  };

  /**
   * Add recipe items to an existing note using the note store
   */
  const addRecipesToNote = async (noteId: string, recipeItems: Item[]) => {
    const noteStore = useNoteStore();

    const existingNote = noteStore.get(noteId);
    if (!existingNote) {
      throw new Error(`Note with id ${noteId} not found`);
    }

    const currentItems = existingNote.items || [];
    const newItems: Item[] = [...currentItems, ...recipeItems];

    // Update note with recipes, title, and tags
    await noteStore.update(noteId, {
      items: newItems,
      title: "Kulinarische Ideen",
      tags: [{ text: "Kulinarische Ideen" }],
    });
  };

  /**
   * Generate and add recipes to a note in one operation
   */
  const generateAndAddRecipesToNote = async (
    noteId: string,
    params: RecipeRequestParams,
  ) => {
    const recipeItems = await generateRecipeItems(params);
    await addRecipesToNote(noteId, recipeItems);
  };

  return {
    // State
    isGenerating: readonly(isGenerating),
    lastGeneratedRecipes: readonly(lastGeneratedRecipes),
    lastShoppingList: readonly(lastShoppingList),

    // Actions
    generateRecipes,
    generateRecipeItems,
    addRecipesToNote,
    generateAndAddRecipesToNote,
  };
});
