<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import debounce from "lodash.debounce";
import { useTextareaHeight } from "@/composables/textareaHeight";

export interface Props {
  id: string;
  data?: Markdown;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => {
    return { text: "" };
  },
});

const emit = defineEmits(["update"]);

const isEditable: Ref<boolean> = ref(false);
const textarea: Ref<HTMLTextAreaElement> = ref();
const { updateTextareaHeight } = useTextareaHeight(textarea);

const compiledMarkdown: ComputedRef<any> = computed(() => {
  const convertedHTML = marked(props.data.text);
  const purifiedHTML = DOMPurify.sanitize(convertedHTML);
  return purifiedHTML;
});

const onInput = debounce((event) => {
  emit("update", { id: props.id, data: event.target.value });
  updateTextareaHeight();
}, 25);

function onBlur() {
  isEditable.value = false;
}

async function onClickOrEnter() {
  isEditable.value = true;
  await nextTick();
  textarea.value.focus();
  updateTextareaHeight();
}
</script>

<template>
  <div>
    <textarea
      v-if="isEditable"
      ref="textarea"
      :value="data.text"
      class="h-1 w-full resize-none overflow-hidden bg-transparent"
      @input="onInput"
      @blur="onBlur"
    ></textarea>
    <div
      v-if="!isEditable"
      tabindex="0"
      class="Markdown"
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
</style>
