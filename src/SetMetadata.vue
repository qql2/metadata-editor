<template>
	<div id="container">
		<h1>Set Metadata in batches</h1>
		<h2>Target notes</h2>
		<textarea v-model="rawFilePath" rows="10" cols="50"></textarea>
		<h2>Metadata</h2>
		<div>
			key: <input type="text" v-model="key" /> value:
			<input type="text" v-model="value" />
		</div>
		<button id="submit" @click="setMetadata">Set Metadata</button>
		<span v-if="isProcessing">ing...</span>
	</div>
</template>
<script setup lang="ts">
let plugin = inject<MyPlugin>("plugin")!;
import { Notice } from "obsidian";
import { computed, inject, ref, watch } from "vue";
import { FrontMatterYAML } from "qql1-front-matter";
import MyPlugin from "./main";
let rawFilePath = ref("");
let key = ref(plugin.settings.keyHistory);
let value = ref(plugin.settings.valueHistory);
let isProcessing = ref(false);
let notePaths = computed(() => {
	return rawFilePath.value.split("\n").map((path) => path.trim());
});
watch(key, (cur) => {
	plugin.settings.keyHistory = cur;
	plugin.saveSettings();
});
watch(value, (cur) => {
	plugin.settings.valueHistory = cur;
	plugin.saveSettings();
});
async function setMetadata() {
	isProcessing.value = true;
	let error = false;
	for (const path of notePaths.value) {
		const file = plugin?.app.vault.getFileByPath(path);
		if (!file) continue;
		let frontMater = new FrontMatterYAML(file, plugin);
		let rst = await frontMater.setField(key.value, value.value);
		if (!rst) {
			console.error(`Failed to set metadata for ${path}`);
			error = true;
		}
	}
	if (error) {
		new Notice("Some notes failed to set metadata");
	} else {
		new Notice("Metadata set successfully");
	}
	isProcessing.value = false;
}
</script>
<style scoped>
#container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
#submit {
	margin-top: 10px;
}
</style>
