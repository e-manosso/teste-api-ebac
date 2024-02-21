/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contrato'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    }) 
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('usuarios')
      }) 
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let nome = faker.internet.userName()
    let email = faker.internet.email(nome)

    cy.cadastrarUsuario(nome, email, 'teste', 'true')
    .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      }) 
  });

  it('Deve validar um usuário com email inválido', () => {
    let nome = faker.internet.userName()
    cy.cadastrarUsuario(nome, 'fulano@qa.com', 'teste', 'true')
    .then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("Este email já está sendo usado")
      })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let nome = faker.internet.userName()
    let email = faker.internet.email(nome)

    cy.cadastrarUsuario('Nome teste 1', 'emailteste1@teste.com', 'teste', 'true')
    .then(response => {
      let id = response.body._id

      cy.request({
        method: 'PUT', 
        url: `usuarios/${id}`,
        body: 
        {
          "nome": nome,
          "email": email,
          "password": "teste",
          "administrador": "true"
        }
      })
      .then(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
          expect(response.status).equal(200)
      })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario('Teste Delete', 'emaildelete@teste.com', 'teste', 'true')
    .then(response => {
      let id = response.body._id

      cy.request({
        method: 'DELETE', 
        url: `usuarios/${id}`,
      })
      .then(response => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).equal(200)
      })
    }) 
  });


});
