describe('Open test url', function () {
  it('Opened webpack dev server', function () {
    cy.visit('/')
  })
});
describe('Test main functionality', function () {
  it('has equal heights', function () {
    cy.get('.js-equal-height [data-equal-height="title"]').should('have.css', 'height', height);
  })
});
