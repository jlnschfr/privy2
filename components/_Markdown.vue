<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify";
import { useDebounceFn } from "@vueuse/core";
import { Marked } from "marked";
import { useTextareaHeight } from "@/composables/textareaHeight";
import hljs from "@/utils/syntaxHighlight";

interface Props {
  modelValue: Markdown;
}
interface Emits {
  (e: "update:modelValue", markdown: Markdown): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const text: Ref<string> = ref(props.modelValue.data.text);
const isEditable: Ref<boolean> = ref(false);
const textarea: Ref<HTMLTextAreaElement> = ref();
const { updateTextareaHeight } = useTextareaHeight(textarea);

const compiledMarkdown: ComputedRef<string> = computed(() => {
  const marked = new Marked({
    renderer: {
      code({ text, lang }) {
        const highlighted =
          lang && hljs.getLanguage(lang)
            ? hljs.highlight(text, { language: lang }).value
            : hljs.highlightAuto(text).value;
        const langClass = lang ? ` language-${lang}` : "";
        return `<pre><code class="hljs${langClass}">${highlighted}</code></pre>`;
      },
    },
  });

  const convertedHTML: string = marked.parse(text.value) as string;
  const purifiedHTML = DOMPurify.sanitize(convertedHTML);
  return purifiedHTML;
});

watch(
  text,
  useDebounceFn(() => {
    emit("update:modelValue", {
      ...props.modelValue,
      data: { text: text.value },
    });
    updateTextareaHeight();
  }, 250),
);

function onBlur(): void {
  isEditable.value = false;
}

async function onClickOrEnter(): Promise<void> {
  isEditable.value = true;
  await nextTick();
  textarea.value?.focus();
  updateTextareaHeight();
}
</script>

<template>
  <div>
    <textarea
      v-if="isEditable"
      ref="textarea"
      v-model="text"
      class="privy-focus h-1 w-full resize-none overflow-hidden bg-transparent"
      @blur="onBlur"
    ></textarea>
    <div
      v-if="!isEditable"
      tabindex="0"
      class="Markdown privy-focus"
      @click="onClickOrEnter"
      @keyup.enter="onClickOrEnter"
      v-html="compiledMarkdown"
    ></div>
  </div>
</template>

<style>
.Markdown {
  line-height: 1.6;
  min-height: 1.5rem;
}

.Markdown h1 {
  font-size: 1.5rem;
  font-weight: bold;
}

.Markdown h2 {
  font-size: 1.3rem;
  font-weight: bold;
}

.Markdown h3 {
  font-size: 1.1rem;
  font-weight: bold;
}

.Markdown h4,
.Markdown h5,
.Markdown h6 {
  font-size: 1rem;
  font-weight: bold;
}

.Markdown ul,
.Markdown ol {
  margin-left: 1rem;
}

.Markdown ul li,
.Markdown ol li {
  padding-left: 0.5rem;
}

.Markdown ul {
  list-style: disc;
}

.Markdown ol {
  list-style: upper-greek;
}

.Markdown a {
  border-bottom: 0.1rem solid theme("colors.primary.500");
  color: theme("colors.primary.500");
}

.Markdown blockquote {
  border-left: 0.2rem solid theme("colors.primary.600");
  color: theme("colors.primary.600");
  font-style: italic;
  max-width: 80%;
  padding-left: 1rem;
}

.Markdown > h2:not(:first-child) {
  margin-top: 2.5rem;
}

.Markdown > h3:not(:first-child),
.Markdown > h4:not(:first-child),
.Markdown > h5:not(:first-child),
.Markdown > h6:not(:first-child) {
  margin-top: 2rem;
}

.Markdown > *:not(:first-child),
.Markdown.Markdown h1 + h2,
.Markdown.Markdown h2 + h3,
.Markdown.Markdown h3 + h4,
.Markdown.Markdown h4 + h5,
.Markdown.Markdown h5 + h6 {
  margin-top: 1rem;
}

.Markdown > h1:not(:first-child) {
  margin-top: 3rem;
}

/* Tables */
.Markdown table {
  border-collapse: collapse;
  width: 100%;
}

.Markdown th,
.Markdown td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
}

.Markdown tr:not(:last-child) th,
.Markdown tr:not(:last-child) td {
  border-bottom: 1px solid theme("colors.neutral.400");
}

.dark .Markdown tr:not(:last-child) th,
.dark .Markdown tr:not(:last-child) td {
  border-bottom-color: theme("colors.neutral.200");
}

/* Code blocks */
.Markdown pre code {
  display: block;
  font-size: 0.8rem;
  overflow: auto;
  padding: 1em;
}

/* Inline code */
.Markdown :not(pre) > code {
  background-color: #2b2b2b;
  color: #f8f8f2;
  font-size: 0.8em;
  padding: 0.15em 0.4em;
}

.dark .Markdown :not(pre) > code {
  background-color: theme("colors.neutral.50");
}

.dark .Markdown pre code {
  background-color: theme("colors.neutral.50");
}
</style>
