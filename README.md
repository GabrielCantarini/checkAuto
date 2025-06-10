# Sistema de Controle de Veículos e Abastecimento - FATEC 2022/02

## Descrição
Este sistema foi desenvolvido como parte de um projeto de extensão para a empresa **SORPAN ALIMENTOS** - Industrial e Comercial Almeida. O sistema tem como objetivo
o controle de veículos da empresa, registrando informações de abastecimento, quilometragem e nível de combustível dos veículos, além de permitir que os gestores 
aprovem ou desaprovem os checklists enviados pelos motoristas.

O sistema é desenvolvido em **Node.js**, **EJS** e utiliza o banco de dados **MySQL** para armazenar as informações.

## Funcionalidades

- **Cadastro de Checklist:** Motoristas podem registrar as informações do veículo, como:
  - Nível de combustível
  - Quilometragem
  - Quantidade de combustível abastecido
  - Foto do painel de instrumentos do veículo para validação
- **Aprovação de Checklist:** Gestores podem visualizar os checklists cadastrados, com as informações e fotos, e aprovar ou desaprovar os registros.
- **Visualização do Histórico:** Gestores podem acessar e visualizar o histórico de abastecimento e manutenção dos veículos.

## Tecnologias Utilizadas

- **Node.js:** Backend do sistema, responsável pela lógica de processamento de dados e rotas.
- **EJS:** Sistema de templates para renderização das páginas HTML dinâmicas.
- **MySQL:** Banco de dados relacional utilizado para armazenar dados dos motoristas, veículos, checklists e registros de abastecimento.
