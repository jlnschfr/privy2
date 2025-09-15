import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// Recipe generation parameters schema
const RecipeRequestSchema = z.object({
  numberOfRecipes: z.number().min(1).max(10),
  numberOfPersons: z.number().min(1).max(20),
  includedIngredients: z.array(z.string()).optional(),
  excludedIngredients: z.array(z.string()).optional(),
  cookingStyles: z.string().optional(),
  vegan: z.boolean().optional(),
  vegetarian: z.boolean().optional(),
});

// Response schemas for structured AI output
const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  category: z.string(), // Flexible string instead of strict enum
});

const ShoppingListItemSchema = z.object({
  name: z.string(),
  quantity: z.string(),
});

const ShoppingListCategorySchema = z.object({
  category: z.string(), // Flexible string instead of strict enum
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

// Export types derived from Zod schemas - single source of truth
export type RecipeRequestParams = z.infer<typeof RecipeRequestSchema>;
export type ShoppingListCategory = z.infer<typeof ShoppingListCategorySchema>;
export type ShoppingListItem = z.infer<typeof ShoppingListItemSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type RecipeResponse = z.infer<typeof RecipeResponseSchema>;

export default async (request: Request): Promise<Response> => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Parse and validate request body
    const body = await request.json();
    const params = RecipeRequestSchema.parse(body);

    // Build dynamic prompt based on parameters
    const cookingStylesText =
      params.cookingStyles && params.cookingStyles.trim()
        ? `Bevorzugte Kochrichtungen: ${params.cookingStyles}. `
        : "";

    const prompt = `Du bist ein kreativer Kochexperte, der interessante und ansprechende Rezepte mit detaillierten Anweisungen entwickelt.

AUFGABE:
Erstelle ${params.numberOfRecipes} kreative und vielfältige Rezepte für ${params.numberOfPersons} Person${params.numberOfPersons > 1 ? "en" : ""}.

KOCHSTIL:
${cookingStylesText}Wenn keine spezifischen Stile angegeben sind, variiere zwischen verschiedenen Kochrichtungen für Abwechslung.

ZUTATEN-RICHTLINIEN:
- Verwende die angegebenen Zutaten als Inspiration, aber ergänze sie kreativ
- Grundzutaten wie Salz, Pfeffer, Öl, Zwiebeln, Knoblauch können mehrfach verwendet werden
- Verwende realistische Mengen für die Personenzahl
- Berücksichtige Haltbarkeit von Zutaten für die Einkaufsliste
- Kategorisiere Zutaten nach sinnvollen Supermarkt-Bereichen (z.B. Gemüse, Fleisch, Milchprodukte, etc.)
${
  params.includedIngredients && params.includedIngredients.length > 0
    ? `- Integriere diese Zutaten sinnvoll: ${params.includedIngredients.join(", ")}`
    : ""
}
${
  params.excludedIngredients && params.excludedIngredients.length > 0
    ? `- Vermeide diese Zutaten: ${params.excludedIngredients.join(", ")}`
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
- Zubereitungszeit: 20-60 Minuten für interessante, aber machbare Gerichte
- Verwende grundlegende Küchenausstattung, erkläre aber Techniken genau
- Balanciere Anspruch mit Machbarkeit - interessant, aber nicht überfordernd
- Maximal 2-3 Kochschritte gleichzeitig, aber mit mehr Tiefe in der Ausführung

ERNÄHRUNG:
${params.vegan ? "Alle Rezepte müssen vegan sein." : ""}
${params.vegetarian ? "Alle Rezepte müssen vegetarisch sein." : ""}

FORMAT:
- Rezepte als Markdown mit deutschen Namen
- Einkaufsliste MUSS als Array von Kategorie-Objekten strukturiert sein
- Jede Kategorie hat ein 'category' Feld und ein 'items' Array
- Verwende NICHT ein Objekt mit Kategorie-Namen als Keys
- WICHTIG: Erstelle NUR Kategorien die auch Items enthalten (keine leeren Kategorien)
- Beispiel: [{"category":"Gemüse", "items":[{"name":"Tomaten", "quantity":"500g"}]}]`;

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: RecipeResponseSchema,
      prompt,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Recipe generation error:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request parameters",
          details: error.issues,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache", // Don't cache validation errors
          },
        },
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to generate recipes" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache", // Don't cache server errors
        },
      },
    );
  }
};