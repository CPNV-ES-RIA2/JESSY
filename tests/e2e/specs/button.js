// eslint-disable-next-line no-unused-vars
const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps")
require ("cypress-file-upload")

before(function () {
  cy.visit("/")
});

Given("The form is loaded", function (){
  cy.get("form").should("be.visible")
});

When("I drag an drop a file", function (){
  cy.get("input[type=file]").selectFile("tests/e2e/specs/example.jpg", {
    action: "drag-drop"
  })
  cy.get("form").submit()
});

When("Check GUI language", function () {
  cy.get("#app > :nth-child(1) > .v-input > .v-input__control > .v-field").click()
  cy.get(".v-list").contains("English").click()
});

Then("The result text area will show informations", function (){
  cy.get("#input-6").should("not.be.empty")
});

Then("Language is updated", function (){
  cy.get(".v-card-title").contains("Image analyser")
});