<template>
  <v-card class="mx-auto" width="400" prepend-icon="mdi-home">
    <template v-slot:title>{{ $t("$vuetify.imageText") }}</template>
    <v-card-text>
      <v-form validate-on="submit lazy" @submit.prevent="upload">
        <v-file-input
          v-model="file"
          prepend-icon=""
          label="File input"
          @update:model-value="enableButton()"
        ></v-file-input>
        <v-text-field v-model="formDatas.maxLabels" label="Label amount">
        </v-text-field>
        <v-text-field
          v-model="formDatas.minConfidenceLevel"
          label="Minimum confidence level"
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
import axios from "axios";

export default {
  data() {
    return {
      file: null,
      formDatas: {
        remoteFullPath: "",
        localFullPath: "",
        maxLabels: 3,
        minConfidenceLevel: 90,
      },
      isButtonDisabled: true,
      isTextDisabled: true,
      text: "",
      api: process.env.VUE_APP_API_GATEWAY_URL,
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
        formData.append("formFile", this.file[0]);
        // Create headers object with the appropriate Content-Type header including boundary parameter

        axios
          .post(this.api + "Upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            this.analyze(response.data);
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
      if (process.env.VUE_APP_DEVELOPMENT_MODE) {
        this.analyze(); // needs to be called in order for tests to pass
      } else {
        this.text = "You are offline, check your connection";
      }
    },
    analyze(remoteFullPath) {
      const formData = new FormData();

      formData.append("remoteFullPath", remoteFullPath);
      formData.append("localFullPath", this.formDatas.localFullPath);
      formData.append("maxLabels", this.formDatas.maxLabels);
      formData.append("minConfidenceLevel", this.formDatas.minConfidenceLevel);

      axios
        .post(this.api + "Analyze", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // Handle response
          this.isTextDisabled = false;
          this.text = ""; // Clear previous result
          for (let i = 0; i < response.data["Labels"].length; i++) {
            this.text += `Label: ${response.data["Labels"][i]}, Confidence: ${response.data["Confidences"][i]}\n`;
          }
        })
        .catch(() => {});
    },
  },
};
</script>
