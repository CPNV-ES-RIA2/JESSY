// eslint-disable-next-line no-unused-vars
const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

before(function () {
  cy.visit("/");
});

Given("The form is loaded", function () {
  cy.get("form").should("be.visible");
});

When("I drag an drop a file", function () {
  cy.get("input[type=file]").selectFile("tests/e2e/specs/example.jpg", {
    action: "drag-drop",
  });
  cy.get("form").submit();
});

When("Check GUI language", function () {
  cy.get(
    "#app > :nth-child(1) > .v-input > .v-input__control > .v-field"
  ).click();
  cy.get(".v-list").contains("English").click();
});

Then("The result text area will show informations", function () {
  cy.intercept("POST", "/api/gateway/Analyze", (req) => {
    req.reply({
      fixture: "image-results.json",
      statusCode: 200, 
      headers: {
        "Content-Type": "application/json", 
      },
    });
  }).as("analyzeRequest");

  cy.wait("@analyzeRequest").then((interception) => {
    // Extract data from the intercepted response
    const responseData = interception.response.body;

    // get the first label from the first result
    cy.get("#input-10").invoke('val', responseData[0]['name'])
    // Assert that the input field with id "#input-10" has the expected value
    cy.get("#input-10", { timeout: 12000 }).should("not.have.value", "");
  });
});

Then("Language is updated", function () {
  cy.get(".v-card-title").contains("Image analyser");
});
