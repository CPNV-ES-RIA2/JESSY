<template>
  <v-card class="mx-auto" width="400" prepend-icon="mdi-home">
    <template v-slot:title>{{ $t("$vuetify.imageText") }}</template>
    <v-card-text>
      <v-form validate-on="submit lazy" @submit.prevent="analyze">
        <v-file-input
          v-model="formDatas.file"
          prepend-icon=""
          label="File input"
          @update:model-value="enableButton()"
        ></v-file-input>
        <v-text-field
          v-model="formDatas.maxLabels"
          label="Label amount"
          value="3"
        >
        </v-text-field>
        <v-text-field
          v-model="formDatas.minConfidenceLevel"
          label="Minimum confidence level"
          value="90"
        >
        </v-text-field>
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
      formDatas: {
        file: null,
        maxLabels: "",
        minConfidenceLevel: "",
      },
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
      try {
        const formData = new FormData();

        // Append the file to the FormData object
        formData.append("formFile", this.formDatas.file[0]);

        // Create headers object with the appropriate Content-Type header including boundary parameter
        const headers = new Headers();
        headers.append(
          "Content-Type",
          "multipart/form-data; boundary=---------------------------boundary"
        );
        // Create requestOptions object with method, headers, and body
        const requestOptions = {
          method: "POST",
          headers: headers,
          body: formData,
        };

        fetch("https://localhost:32770/api/Gateway/Upload", requestOptions)
          .then((response) => response.json())
          .then((data) => (this.postId = data.id));
      } catch (error) {
        Analyzer.analyze().then((data) => {
          // Handle the analysis result here
          this.isTextDisabled = false;
          this.text = JSON.stringify(data);
        });
      }
    },
  },
};
</script>
