# MVP v1.0 – Plataforma para Corretores de Imóveis

## Objetivo

Criar uma plataforma SaaS para corretores de imóveis que permita:

* Publicação de imóveis
* Captação de leads
* Gestão básica de clientes
* Site público para divulgação

O objetivo da versão 1.0 não é competir com grandes plataformas do mercado, mas validar o produto com usuários reais.

---

# Público-Alvo

## Principal

* Corretores autônomos

## Secundário

* Pequenas imobiliárias
* Equipes de até 10 corretores

---

# Problema Resolvido

Hoje muitos corretores utilizam:

* Planilhas
* WhatsApp
* Redes sociais

Sem uma centralização dos imóveis e dos contatos.

O sistema deverá permitir:

* Organizar imóveis
* Receber contatos
* Controlar leads
* Possuir um site profissional

---

# Funcionalidades da Versão 1.0

## Autenticação

### Entram no MVP

* Login
* Logout
* Recuperação de senha
* Alteração de senha
* Perfil do usuário

### Não entram

* Login Google
* Login Facebook
* MFA

---

## Gestão de Imóveis

### Entram no MVP

* Cadastro de imóvel
* Edição de imóvel
* Exclusão de imóvel
* Ativar imóvel
* Desativar imóvel
* Upload de fotos

Campos:

* Título
* Descrição
* Valor
* Tipo
* Finalidade
* Cidade
* Bairro
* Área
* Quartos
* Banheiros
* Vagas
* Fotos

### Não entram

* Tour virtual
* Vídeos
* Integração com portais
* Importação XML

---

## Site Público

### Entram

* Página inicial
* Busca de imóveis
* Lista de imóveis
* Detalhes do imóvel
* Formulário de contato

### Não entram

* Blog
* SEO avançado
* Landing pages

---

## Leads

### Entram

* Cadastro automático
* Visualização
* Alteração de status

Status:

* Novo
* Contatado
* Visita Agendada
* Fechado
* Perdido

### Não entram

* Automações
* Disparo de e-mails
* Pipeline avançado

---

## Dashboard

### Entram

* Total de imóveis
* Total de leads
* Leads por status

### Não entram

* Relatórios avançados
* Gráficos complexos

---

# Requisitos Técnicos

## Backend

ASP.NET Core

## Frontend

Next.js

## Banco

PostgreSQL

## Hospedagem

Docker

## Armazenamento

Cloudflare R2 (fase posterior)

---

# Estrutura Inicial do Banco

## Users

* Id
* Name
* Email
* PasswordHash

## Properties

* Id
* Title
* Description
* Price
* Bedrooms
* Bathrooms
* GarageSpaces
* Area
* City
* Neighborhood
* Active

## PropertyImages

* Id
* PropertyId
* FileName

## Leads

* Id
* PropertyId
* Name
* Email
* Phone
* Message
* Status

---

# Critérios de Sucesso

O MVP será considerado concluído quando:

1. Um corretor conseguir criar conta.
2. Cadastrar imóveis.
3. Publicar imóveis.
4. Receber leads.
5. Visualizar os leads no painel.
6. O sistema estiver acessível por domínio público.

---

# Funcionalidades Explicitamente Fora do Escopo

* IA
* WhatsApp Business API
* Integração com portais imobiliários
* Multiempresa
* Multiusuário avançado
* Assinaturas
* Pagamentos
* Blog
* SEO avançado
* Aplicativo mobile
* Notificações push
* Redis
* RabbitMQ
* Kubernetes
* Microsserviços

Essas funcionalidades serão avaliadas após validação do MVP.
