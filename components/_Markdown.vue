<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify";
import debounce from "lodash.debounce";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
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
  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    }),
  );

  const convertedHTML: string = marked.parse(text.value) as string;
  const purifiedHTML = DOMPurify.sanitize(convertedHTML);
  return purifiedHTML;
});

watch(
  text,
  debounce(() => {
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

.Markdown code {
  font-size: 0.75rem;
}
</style>
