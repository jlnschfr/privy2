import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const RecipeRequestSchema = z.object({
  numberOfRecipes: z.number().min(1).max(10),
  numberOfPersons: z.number().min(1).max(20),
  includedIngredients: z.array(z.string()).optional(),
  excludedIngredients: z.array(z.string()).optional(),
  cookingStyles: z.string().optional(),
  vegan: z.boolean().optional(),
  vegetarian: z.boolean().optional(),
});

const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  category: z.string(),
  usageInfo: z.string().optional(), // Information about usage across recipes
});

const ShoppingListItemSchema = z.object({
  name: z.string(),
  quantity: z.string(),
});

const ShoppingListCategorySchema = z.object({
  category: z.string(),
  items: z.array(ShoppingListItemSchema),
});

const RecipeSchema = z.object({
  title: z.string(),
  servings: z.number(),
  prepTime: z.string(),
  cookTime: z.string(),
  difficulty: z.enum(["Einfach", "Mittel", "Schwer"]),
  ingredients: z.array(IngredientSchema),
  instructions: z.array(z.string()),
  description: z.string().optional(),
});

const RecipeResponseSchema = z.object({
  shoppingList: z.array(ShoppingListCategorySchema),
  recipes: z.array(RecipeSchema),
});

export type RecipeRequestParams = z.infer<typeof RecipeRequestSchema>;
export type ShoppingListCategory = z.infer<typeof ShoppingListCategorySchema>;
export type ShoppingListItem = z.infer<typeof ShoppingListItemSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type RecipeResponse = z.infer<typeof RecipeResponseSchema>;

export async function generateRecipes(
  params: RecipeRequestParams,
): Promise<RecipeResponse> {
  const config = useRuntimeConfig();

  if (!config.public.openaiApiKey) {
    throw new Error(
      "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.",
    );
  }

  try {
    // Create OpenAI client with API key for static builds
    const openai = createOpenAI({
      apiKey: config.public.openaiApiKey,
    });

    // Validate request parameters
    const validatedParams = RecipeRequestSchema.parse(params);

    // Build dynamic prompt based on parameters
    const cookingStylesText =
      validatedParams.cookingStyles && validatedParams.cookingStyles.trim()
        ? `Bevorzugte Kochrichtungen: ${validatedParams.cookingStyles}. `
        : "";

    const prompt = `Du bist ein kreativer Kochexperte, der interessante und ansprechende Rezepte mit detaillierten Anweisungen entwickelt.

AUFGABE:
Erstelle ${validatedParams.numberOfRecipes} kreative und vielfältige Rezepte für ${validatedParams.numberOfPersons} Person${validatedParams.numberOfPersons > 1 ? "en" : ""}.

KOCHSTIL:
${cookingStylesText}Wenn keine spezifischen Stile angegeben sind, variiere zwischen verschiedenen Kochrichtungen für Abwechslung.

ZUTATEN-RICHTLINIEN:
- Verwende die angegebenen Zutaten als Inspiration, aber ergänze sie kreativ
- Grundzutaten wie Salz, Pfeffer, Öl, Zwiebeln, Knoblauch können mehrfach verwendet werden, sollten aber auch auf der Einkaufliste erscheinen
- Verwende realistische Mengen für die Personenzahl
- Berücksichtige Haltbarkeit von Zutaten für die Einkaufsliste
- Kategorisiere Zutaten nach sinnvollen Supermarkt-Bereichen (z.B. Gemüse, Fleisch, Milchprodukte, etc.)

ZUTATEN-VERWENDUNG IN REZEPTEN:
- Für jede Zutat in den einzelnen Rezepten: Gib eine kurze, hilfreiche usageInfo über die Verwendung an
- Diese Information hilft beim Kochen zu verstehen, ob die Zutat komplett verbraucht wird oder Reste übrig bleiben
- Beispiele für usageInfo bei Rezept-Zutaten:
  * "komplett verwenden" (wenn die gesamte Zutat für dieses Rezept benötigt wird)
  * "nur die Hälfte verwenden" (wenn nur ein Teil der üblichen Packung benötigt wird)
  * "auch in Gericht 2 verwendet" (wenn die gleiche Zutat in einem anderen Rezept vorkommt)
  * "Rest für später aufbewahren" (bei haltbaren Zutaten die übrig bleiben)
  * "auch für Gericht 3 benötigt" (Hinweis auf weitere Verwendung)
- Diese Information erscheint direkt bei den Rezept-Zutaten, nicht in der Einkaufsliste
- Verwende deutsche Begriffe und halte die Information prägnant (max. 40 Zeichen)
- Berücksichtige realistische Packungsgrößen und typische Haushaltsvorräte

${
  validatedParams.includedIngredients &&
  validatedParams.includedIngredients.length > 0
    ? `- Integriere diese Zutaten sinnvoll: ${validatedParams.includedIngredients.join(", ")}`
    : ""
}
${
  validatedParams.excludedIngredients &&
  validatedParams.excludedIngredients.length > 0
    ? `- Vermeide diese Zutaten: ${validatedParams.excludedIngredients.join(", ")}`
    : ""
}

KREATIVITÄTS-ANFORDERUNGEN:
- Jedes Rezept sollte einzigartig, interessant und inspirierend sein
- Wähle Gerichte mit charakteristischen Aromen und interessanten Zubereitungstechniken
- Verwende unterschiedliche Kochtechniken (anbraten, schmoren, rösten, gratinieren, marinieren, etc.)
- Kombiniere Zutaten auf überraschende aber harmonische Weise
- Denke an Farbe, Textur, Geschmackskontraste und Aromenschichtung
- Bevorzuge Gerichte mit kulinarischem Charakter gegenüber alltäglichen Grundrezepten
- Integriere interessante Details wie Gewürzkombinationen, Zubereitungstricks oder Geschmacksnuancen

ANWEISUNGS-QUALITÄT:
- Erstelle detaillierte, präzise Kochanweisungen mit 5-8 Schritten pro Rezept
- Erkläre WARUM bestimmte Techniken verwendet werden (z.B. "anbraten für Röstaromen")
- Gib konkrete Hinweise zu Gargraden, Konsistenzen und Erkennungsmerkmalen
- Beschreibe sensorische Hinweise: "bis die Zwiebeln glasig sind und duften"
- Erwähne wichtige Timing-Aspekte und Zubereitungstipps
- Erkläre Temperaturen, Garzeiten und Texturen präzise
- Strukturiere komplexere Zubereitungsschritte logisch und nachvollziehbar

SCHWIERIGKEIT & ZUGÄNGLICHKEIT:
- Zubereitungszeit: 20-50 Minuten für interessante, aber machbare Gerichte
- Verwende grundlegende Küchenausstattung, erkläre aber Techniken genau
- Balanciere Anspruch mit Machbarkeit - interessant, aber nicht überfordernd
- Maximal 2-3 Kochschritte gleichzeitig, aber mit mehr Tiefe in der Ausführung

ERNÄHRUNG:
${validatedParams.vegan ? "Alle Rezepte müssen vegan sein." : ""}
${validatedParams.vegetarian ? "Alle Rezepte müssen vegetarisch sein." : ""}

FORMAT:
- Die Antwort muss EXAKT folgende JSON-Struktur haben (ohne zusätzliche "properties" oder "type" Felder):
{
  "recipes": [Array von Rezept-Objekten],
  "shoppingList": [Array von Kategorie-Objekten]
}
- Rezepte als Markdown mit deutschen Namen
- Einkaufsliste MUSS als Array von Kategorie-Objekten strukturiert sein
- Jede Kategorie hat ein 'category' Feld und ein 'items' Array  
- Jede Zutat in den Rezepten sollte ein optionales 'usageInfo' Feld haben mit Verwendungsinformationen
- Verwende NICHT ein Objekt mit Kategorie-Namen als Keys
- WICHTIG: Erstelle NUR Kategorien die auch Items enthalten (keine leeren Kategorien)
- Beispiel Einkaufsliste: [{"category":"Gemüse", "items":[{"name":"Tomaten", "quantity":"500g"}]}]
- Beispiel Rezept-Zutat: {"name":"Tomaten", "quantity":"200g", "category":"Gemüse", "usageInfo":"auch in Gericht 2 verwendet"}`;

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: RecipeResponseSchema,
      schemaName: "RecipeResponse",
      schemaDescription: "A response containing recipes and a shopping list",
      prompt,
      mode: "json",
    });

    // Debug log to see what we're getting back
    console.log("AI Response:", JSON.stringify(result.object, null, 2));

    return result.object;
  } catch (error) {
    console.error("Recipe generation error:", error);

    if (error instanceof z.ZodError) {
      console.error("Validation error details:", error.issues);
      throw new Error(
        `Invalid AI response structure: ${error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ")}`,
      );
    }

    // Check if it's an AI SDK error and log more details
    if (error && typeof error === "object" && "cause" in error) {
      console.error("AI SDK error cause:", error.cause);
    }

    throw new Error(
      `Failed to generate recipes: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
