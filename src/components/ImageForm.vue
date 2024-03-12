<template>
  <v-card class="mx-auto" width="400" prepend-icon="mdi-home">
    <template v-slot:title>{{ $t("$vuetify.imageText") }}</template>
    <v-card-text>
      <v-form validate-on="submit lazy" @submit.prevent="analyze">
        <v-file-input
          v-model="file"
          prepend-icon=""
          label="File input"
          @update:model-value="enableButton()"
        ></v-file-input>
        <v-btn type="submit" block class="mt-2" :disabled="isButtonDisabled">
          Analyse
        </v-btn>
        <p class="my-10">Result</p>
        <v-textarea :disabled="isTextDisabled" :value="text"></v-textarea>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import Analyzer from "../api/mock/index.js";

export default {
  data() {
    return {
      file: "",
      isButtonDisabled: true,
      isTextDisabled: true,
      text: "",
    };
  },
  methods: {
    enableButton() {
      // Enable the button when a certain condition is met
      this.isButtonDisabled = false;
    },
    async analyze() {
      Analyzer.analyze().then((data) => {
        // Handle the analysis result here
        this.isTextDisabled = false;
        this.text = JSON.stringify(data);
        console.log("Analysis result:", data);
      });
    },
  },
};
</script>
