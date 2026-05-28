# language: es
Feature: LoginUsuario
  Como usuario
  Quiero loginusuario

  Scenario: Caso exitoso
    Given el usuario autenticado
    When solicita
    Then el sistema procesa
