<template>
  <v-card class="mx-auto" width="400" prepend-icon="mdi-home">
    <template v-slot:title>{{ $t("$vuetify.imageText") }}</template>
    <v-card-text>
      <v-form validate-on="submit lazy" @submit.prevent="upload">
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
import axios from "axios";

export default {
  data() {
    return {
      formDatas: {
        file: null,
        remoteFullPath: "",
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
    async upload() {
      try {
        const formData = new FormData();

        // Append the file to the FormData object
        formData.append("formFile", this.formDatas.file[0]);

        // Create headers object with the appropriate Content-Type header including boundary parameter

        axios
          .post("https://localhost:32780/api/Gateway/Upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            this.formDatas.remoteFullPath = response.data;
            this.analyze();
          })
          .catch((response) => {
            this.handleError(response);
          });
      } catch (error) {
        this.handleError(error);
      }
    },
    handleError(response) {
      console.log(response);
      Analyzer.analyze().then((data) => {
        // Handle the analysis result here
        this.isTextDisabled = false;
        this.text = JSON.stringify(data);
      });
    },
    analyze() {
      axios
        .post("https://localhost:32768/api/Gateway/Analyze", this.formDatas)
        .then((response) => {
          // Handle response
          console.log(response.data);
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    },
  },
};
</script>
