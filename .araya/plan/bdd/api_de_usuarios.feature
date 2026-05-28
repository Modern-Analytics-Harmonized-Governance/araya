# language: es
Feature: API_de_usuarios
  Como usuario
  Quiero api_de_usuarios

  Scenario: Caso exitoso
    Given el usuario autenticado
    When solicita
    Then el sistema procesa
